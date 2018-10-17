/* eslint-disable no-empty-function, no-unused-vars */
const ServiceDiscoveryDelegate = require('./delegate')
const ServiceDiscoveryDataSource = require('./datasource')
const Bonjour = require('./backend/bonjour')
const MQTTSD = require('./backend/mqttsd')
const Dummy = require('./backend/dummy')

class ChildService {
  constructor (configs, props, parentProps) {
    const {
      name,
      port,
      type = 'default',
      protocol,
      subtypes = [],
      txt = {}
    } = parentProps
    const txtpath = txt.path || ''
    const pid = txt[configs.idSelector || 'serialnumber'] || `${name}:${port}._${type}`

    this.dummy = new Dummy()
    this.status = ''
    this.configs = configs
    this.props = {
      name: props.name || `Child service of ${name}`,
      port: props.port || port,
      type: props.type || type,
      protocol: props.protocol || protocol,
      subtypes: props.subtypes || subtypes,
      txt: {
        ...props.txt,
        path: `${txtpath}/${pid}`.replace(/\/\//g, '/')
      }
    }

    this.bonjourChild = configs.bonjour ? new Bonjour() : this.dummy
    this.bonjourChild.setProps(this.props)

    this.mqttsdChild = configs.mqttsd ? new MQTTSD(configs.mqttsd) : this.dummy
    this.mqttsdChild.setProps(this.props)
  }

  async start () {
    if (this.status !== 'running') {
      await this.bonjourChild.start()
      await this.mqttsdChild.start()
      this.status = 'running'
    }
    await this.status
  }

  async stop () {
    if (this.status !== 'stopped') {
      await this.bonjourChild.stop()
      await this.mqttsdChild.stop()
      this.status = 'stopped'
    }
    await this.status
  }
}

class ServiceDiscovery {
  constructor () {
    this.delegate = new ServiceDiscoveryDelegate()
    this.datasource = new ServiceDiscoveryDataSource()
    this.children = []
    this.dummy = new Dummy()
    this.setDelegate = this.setDelegate.bind(this)
    this.setDataSource = this.setDataSource.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.updateServiceProps = this.updateServiceProps.bind(this)
    this.publishService = this.publishService.bind(this)
    this.findService = this.findService.bind(this)
    this.createChildService = this.createChildService.bind(this)
  }

  /**
   * Specify the delegation source.
   * @param {Object} delegate An instance who implements the ServiceDiscoveryDelegate class.
   */
  setDelegate (delegate) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this.delegate))
      .filter(prop => prop !== 'constructor')
      .forEach((prop) => {
        if (delegate[prop]) this.delegate[prop] = delegate[prop]
      })
  }

  /**
   * Specify the data source.
   * @param {Object} datasource An instance who implements the ServiceDiscoveryDataSource class.
   */
  setDataSource (datasource) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this.datasource))
      .filter(prop => prop !== 'constructor')
      .forEach((prop) => {
        if (datasource[prop]) this.datasource[prop] = datasource[prop]
      })
  }

  /**
   * Initiate the service discovery.
   *
   * @method start
   * @return {Promise} A promise of the result of the initiate process.
   */
  async start () {
    await this.delegate.serviceDiscoveryWillStart()

    const configs = this.datasource.serviceDiscoveryConfigs()
    const props = this.datasource.serviceDiscoveryProps()

    if (!props.txt) props.txt = { path: '/' }
    else if (!props.txt.path) props.txt.path = '/'

    if (configs.bonjour) {
      this.bonjour = new Bonjour({ browse: true })
    } else {
      this.bonjour = this.dummy
    }

    this.bonjour.on('event', (event) => {
      if (this.delegate.serviceDiscoveryDidReceiveEvent) {
        this.delegate.serviceDiscoveryDidReceiveEvent('bonjour', event.action, event.data)
      }
    })

    if (configs.mqttsd) {
      this.mqttsd = new MQTTSD({
        browse: true,
        brokerURL: configs.mqttsd.brokerURL,
        options: configs.mqttsd.options
      })
    } else {
      this.mqttsd = this.dummy
    }

    this.mqttsd.on('event', (event) => {
      if (this.delegate.serviceDiscoveryDidReceiveEvent) {
        this.delegate.serviceDiscoveryDidReceiveEvent('mqttsd', event.action, event.data)
      }
    })

    this.bonjour.setProps(props)
    this.mqttsd.setProps(props)
    let bonjour = await this.bonjour.start()
    let mqttsd = await this.mqttsd.start()
    await this.delegate.serviceDiscoveryDidStart()
    return { bonjour, mqttsd }
  }

  /**
   * Update the service properties.
   * Property changes must be reflected in the return of serviceDiscoveryProps().
   * This method will also republish your service automatically, calling
   * publishService() after this method is unnecessary.
   *
   * @method updateServiceProps
   */
  updateServiceProps () {
    const props = this.datasource.serviceDiscoveryProps()
    if (!props.txt) props.txt = { path: '/' }
    else if (!props.txt.path) props.txt.path = '/'
    this.bonjour.updateProps(props)
    this.mqttsd.updateProps(props)
    this.publishService()
  }

  /**
   * Manually publish the service.
   *
   * @method publishService
   */
  publishService () {
    this.bonjour.publish()
    this.mqttsd.publish()
    this.children.forEach((child) => {
      child.stop().then(() => child.start())
    })
  }

  /**
   * Find services from the service browser.
   *
   * @method findService
   * @param  {Object} matches Key-value matches to search in an the service object.
   * @return {Array}          All matched service objects in an array.
   */
  findService (matches = {}) {
    const bonjourServices = this.bonjour.findService(matches)
    const mqttsdServices = this.mqttsd.findService(matches)
    const mergedServices = []

    bonjourServices.forEach((srv) => {
      const services = this.mqttsd.findService({
        fqdn: srv.fqdn,
        port: srv.port,
        ...matches
      })

      if (services.length > 0) {
        for (let i = 0; i < services.length; i++) {
          if (srv.timestamp > services[i].timestamp) {
            mergedServices.push(srv)
            break
          }
        }
      } else {
        mergedServices.push(srv)
      }
    })

    mqttsdServices.forEach((srv) => {
      const services = this.bonjour.findService({
        fqdn: srv.fqdn,
        port: srv.port,
        ...matches
      })

      if (services.length > 0) {
        for (let i = 0; i < services.length; i++) {
          if (srv.timestamp > services[i].timestamp) {
            mergedServices.push(srv)
            break
          }
        }
      } else {
        mergedServices.push(srv)
      }
    })

    return mergedServices
  }

  /**
   * Create a child service. A child service can be recognized by its TXT record.
   * A `path` property in TXT describes the
   * parent-child relationship between services.
   *
   * For ancestor service, its `path` property is always '/' (root path).
   * For child service, its `path` property contains parent's id and
   * even grandparent's, e.g., '/mother-uuid', '/grandma-uuid/mom-uuid'.
   *
   * If parent id specified by `idSelector` in serviceDiscoveryConfigs is not set in
   * txt record of the ancestor service, the path of child service will use ancestor
   * service's name, port and type combined string as default id.
   * But it is not recommanded to use the combined string as an id, because it's not
   * guaranteed to be unique. You should always assign an id for your service.
   *
   * Here is an example of TXT record for a parent service: (assuming `idSelector` is `serialnumber`)
   * {
   *   path: '/',
   *   serialnumber: 'parent-uuid'
   * }
   *
   * and its child service:
   * {
   *   path: '/parent-uuid',
   *   serialnumber: 'child-uuid'
   * }
   *
   * Delegator can initiate the child service by calling the start() method from
   * the returned child service object, and terminate it by stop().
   *
   * @method createChildService
   * @param  {Object} props Child service properties (refer to serviceDiscoveryProps()).
   * @return {Object}       Child service object with start() and stop() methods.
   */
  createChildService (props) {
    const configs = this.datasource.serviceDiscoveryConfigs()
    const parentProps = this.datasource.serviceDiscoveryProps()
    const child = new ChildService(configs, props, parentProps)
    this.children.push(child)
    return child
  }

  /**
   * Terminate the service discovery.
   *
   * @method stop
   * @return {Promise} A promise of the result of the terminate process.
   */
  async stop () {
    await this.delegate.serviceDiscoveryWillStop()
    await Promise.all(this.children.map(child => child.stop()))
    await this.bonjour.stop()
    await this.mqttsd.stop()
    delete this.bonjour
    delete this.mqttsd
    await this.delegate.serviceDiscoveryDidStop()
  }
}

exports.Bonjour = Bonjour
exports.MQTTSD = MQTTSD
module.exports = ServiceDiscovery
