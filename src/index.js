/* eslint-disable no-empty-function, no-unused-vars */
import autobind from 'autobind-decorator';
import ServiceDiscoveryDelegate from './delegate';
import ServiceDiscoveryDataSource from './datasource';
import Bonjour from './backend/bonjour';
import MQTTSD from './backend/mqttsd';
import Dummy from './backend/dummy';

@autobind
class ChildService {
  constructor(configs, props, parentProps) {
    const {
      name,
      port,
      type = 'default',
      protocol,
      subtypes = [],
      txt = {},
    } = parentProps;
    const txtpath = txt.path || '';
    const pid = txt[configs.idSelector || 'serialnumber'] || `${name}:${port}._${type}`;

    this.dummy = new Dummy();
    this.status = '';
    this.configs = configs;
    this.props = {
      name: props.name || `Child service of ${name}`,
      port: props.port || port,
      type: props.type || type,
      protocol: props.protocol || protocol,
      subtypes: props.subtypes || subtypes,
      txt: Object.assign({}, props.txt, {
        path: `${txtpath}/${pid}`.replace(/\/\//g, '/'),
      }),
    };

    this.bonjourChild = configs.bonjour ? new Bonjour() : this.dummy;
    this.bonjourChild.setProps(this.props);

    this.mqttsdChild = configs.mqttsd ? new MQTTSD(configs.mqttsd) : this.dummy;
    this.mqttsdChild.setProps(this.props);
  }

  async start() {
    if (this.status !== 'running') {
      await this.bonjourChild.start();
      await this.mqttsdChild.start();
      this.status = 'running';
    }
    await this.status;
  }

  async stop() {
    if (this.status !== 'stopped') {
      await this.bonjourChild.stop();
      await this.mqttsdChild.stop();
      this.status = 'stopped';
    }
    await this.status;
  }
}

@autobind
export default class ServiceDiscovery {
  constructor() {
    this.delegate = new ServiceDiscoveryDelegate();
    this.datasource = new ServiceDiscoveryDataSource();
    this.children = [];
    this.dummy = new Dummy();
  }

  /**
   * Specify the delegation source.
   * @param {Object} delegate An instance who implements the ServiceDiscoveryDelegate class.
   */
  setDelegate(delegate) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this.delegate))
      .filter(prop => prop !== 'constructor')
      .forEach((prop) => {
        if (delegate[prop]) this.delegate[prop] = delegate[prop];
      });
  }

  /**
   * Specify the data source.
   * @param {Object} datasource An instance who implements the ServiceDiscoveryDataSource class.
   */
  setDataSource(datasource) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this.datasource))
      .filter(prop => prop !== 'constructor')
      .forEach((prop) => {
        if (datasource[prop]) this.datasource[prop] = datasource[prop];
      });
  }

  /**
   * Initiate the service discovery.
   *
   * @method start
   * @param {Object} opts Options to launch service discovery framework
   * @return {Promise} A promise of the result of the initiate process.
   */
  async start(opts = {}) {
    if (!opts.restart) {
      await this.delegate.serviceDiscoveryWillStart();
    }

    const configs = this.datasource.serviceDiscoveryConfigs();
    const props = this.datasource.serviceDiscoveryProps();

    if (!props.txt) props.txt = { path: '/' };
    else if (!props.txt.path) props.txt.path = '/';

    if (configs.bonjour) {
      this.bonjour = new Bonjour({ browse: true, idSelector: configs.idSelector });
    } else {
      this.bonjour = this.dummy;
    }

    this.bonjour.on('event', (event) => {
      if (this.delegate.serviceDiscoveryDidReceiveEvent) {
        this.delegate.serviceDiscoveryDidReceiveEvent('bonjour', event.action, event.data);
      }
    });

    if (configs.mqttsd) {
      this.mqttsd = new MQTTSD({
        browse: configs.mqttsd.browse,
        brokerURL: configs.mqttsd.brokerURL,
        options: configs.mqttsd.options,
        idSelector: configs.idSelector,
      });
    } else {
      this.mqttsd = this.dummy;
    }

    this.mqttsd.on('event', (event) => {
      if (this.delegate.serviceDiscoveryDidReceiveEvent) {
        this.delegate.serviceDiscoveryDidReceiveEvent('mqttsd', event.action, event.data);
      }
    });

    this.bonjour.setProps(props);
    this.mqttsd.setProps(props);
    await this.bonjour.start();
    await this.mqttsd.start();
    if (!opts.restart) {
      await this.delegate.serviceDiscoveryDidStart();
    }
  }

  /**
   * Terminate the service discovery.
   *
   * @method stop
   * @param {Object} opts Options to stop service discovery framework.
   * @return {Promise} A promise of the result of the terminate process.
   */
  async stop(opts = {}) {
    if (!opts.restart) {
      await this.delegate.serviceDiscoveryWillStop();
    }
    await Promise.all(this.children.map(child => child.stop()));
    await this.bonjour.stop();
    await this.mqttsd.stop();
    delete this.bonjour;
    delete this.mqttsd;
    if (!opts.restart) {
      await this.delegate.serviceDiscoveryDidStop();
    }
  }

  /**
   * Update the service properties.
   * Property changes must be reflected in the return of serviceDiscoveryProps().
   * This method will also republish your service automatically, calling
   * publishService() after this method is unnecessary.
   *
   * @method updateServiceProps
   * @param {Object} opts Options to update service.
   */
  async updateServiceProps(opts = {}) {
    const props = this.datasource.serviceDiscoveryProps();
    if (!props.txt) props.txt = { path: '/' };
    else if (!props.txt.path) props.txt.path = '/';

    if (opts.restart) {
      await this.stop(opts);
      await this.start(opts);
      this.publishService({ onError: opts.onError });
    } else {
      this.bonjour.updateProps(props);
      this.mqttsd.updateProps(props);
      this.publishService({ propsUpdated: true, onError: opts.onError });
    }
  }

  /**
   * Manually publish the service.
   *
   * @method publishService
   */
  publishService(options = {}) {
    this.bonjour.publish(options);
    this.mqttsd.publish(options);
    this.children.forEach((child) => {
      child.stop().then(() => child.start());
    });
  }

  /**
   * Refresh online services.
   *
   * @method refreshServices
   */
  refreshServices(options = {}) {
    this.bonjour.refresh(options);
    this.mqttsd.refresh(options);
  }

  /**
   * Find services from the service browser.
   *
   * @method findService
   * @param  {Object} matches Key-value matches to search in an the service object.
   * @return {Array}          All matched service objects in an array.
   */
  findService(matches = {}, comparator) {
    const bonjourServices = this.bonjour.findService(matches, comparator);
    const mqttsdServices = this.mqttsd.findService(matches, comparator);
    const mergedServices = [];

    bonjourServices.forEach((srv) => {
      const services = this.mqttsd.findService(Object.assign({
        fqdn: srv.fqdn,
        port: srv.port,
      }, matches));

      if (services.length > 0) {
        for (let i = 0; i < services.length; i++) {
          if (srv.timestamp > services[i].timestamp) {
            mergedServices.push(srv);
            break;
          }
        }
      } else {
        mergedServices.push(srv);
      }
    });

    mqttsdServices.forEach((srv) => {
      const services = this.bonjour.findService(Object.assign({
        fqdn: srv.fqdn,
        port: srv.port,
      }, matches));

      if (services.length > 0) {
        for (let i = 0; i < services.length; i++) {
          if (srv.timestamp > services[i].timestamp) {
            mergedServices.push(srv);
            break;
          }
        }
      } else {
        mergedServices.push(srv);
      }
    });

    return mergedServices;
  }

  /**
   * Create a child service. A child service can be recognized by its TXT record.
   * A `path` property in TXT describes the
   * parent-child relationship between services.
   *
   * For ancestor service, its `path` property is always '/' (root path).
   * For child service, its `path` property contains parent's serial number and
   * even grandparent's, e.g., '/mother-serial-number', '/grandma-sn/mom-sn'.
   *
   * If `serialnumber` is not set in txt record of the ancestor service, the path of
   * child service will use ancestor service's name, port and type combined string
   * as default serial number. But it is not recommanded to use the combined string as
   * serial number, because it's not guaranteed to be unique. You should always assign
   * a serial number for your service.
   *
   * Here is an example of TXT record for a parent service:
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
  createChildService(props) {
    const configs = this.datasource.serviceDiscoveryConfigs();
    const parentProps = this.datasource.serviceDiscoveryProps();
    const child = new ChildService(configs, props, parentProps);
    this.children.push(child);
    return child;
  }
}

export Bonjour from './backend/bonjour';
export MQTTSD from './backend/mqttsd';
