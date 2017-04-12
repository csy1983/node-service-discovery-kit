/* eslint-disable no-empty-function, no-unused-vars */
import autobind from 'autobind-decorator';
import ServiceDiscoveryDelegate from './delegate';
import ServiceDiscoveryDataSource from './datasource';
import Bonjour from './backend/bonjour';
import MQTTSD from './backend/mqttsd';
import Dummy from './backend/dummy';
import { findSerialNumber } from './helper';

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
   * @return {Promise} A promise of the result of the initiate process.
   */
  async start() {
    await this.delegate.serviceDiscoveryWillStart();

    const configs = this.datasource.serviceDiscoveryConfigs();
    const props = this.datasource.serviceDiscoveryProps();

    if (!props.txt) props.txt = { path: '/' };
    else if (!props.txt.path) props.txt.path = '/';

    if (configs.bonjour) {
      this.bonjour = new Bonjour({ browse: true });
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
        browse: true,
        brokerURL: configs.mqttsd.brokerURL,
        options: configs.mqttsd.options,
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
    let bonjour = await this.bonjour.start();
    let mqttsd = await this.mqttsd.start();
    await this.delegate.serviceDiscoveryDidStart();
    return { bonjour, mqttsd };
  }

  /**
   * Update the service properties.
   * Property changes must be reflected in the return of serviceDiscoveryProps().
   * This method will also republish your service automatically, calling
   * publishService() after this method is unnecessary.
   *
   * @method updateServiceProps
   */
  updateServiceProps() {
    const props = this.datasource.serviceDiscoveryProps();
    if (!props.txt) props.txt = { path: '/' };
    else if (!props.txt.path) props.txt.path = '/';
    this.bonjour.updateProps(props);
    this.mqttsd.updateProps(props);
    this.publishService();
  }

  /**
   * Manually publish the service.
   *
   * @method publishService
   */
  publishService() {
    this.bonjour.publish();
    this.mqttsd.publish();
    this.children.forEach((child) => {
      child.stop(child.start);
    });
  }

  /**
   * Find services from the service browser.
   *
   * @method findService
   * @param  {Object} matches Key-value matches to search in an the service object.
   * @return {Array}          All matched service objects in an array.
   */
  findService(matches = {}) {
    const bonjourServices = this.bonjour.findService(matches);
    const mqttsdServices = this.mqttsd.findService(matches);
    return bonjourServices.filter((srv) => {
      if (mqttsdServices.length === 0) return true;
      const services = this.mqttsd.findService(Object.assign({
        name: srv.name,
        port: srv.port,
        type: srv.type,
        serialnumber: findSerialNumber(srv),
      }, matches));
      return services.length === 0;
    }).concat(mqttsdServices);
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
    const { name, port, type = 'default', txt = {} } = this.datasource.serviceDiscoveryProps();
    const txtpath = txt.path || '';
    const serialnumber = txt.serialnumber || `${name}:${port}._${type}`;
    const configs = this.datasource.serviceDiscoveryConfigs();
    const childProps = {
      name: props.name || `Child service of ${name}`,
      port: props.port || port,
      type: props.type || type,
      txt: Object.assign({}, props.txt, {
        path: `${txtpath}/${serialnumber}`.replace(/\/\//g, '/'),
      }),
    };

    const bonjourChild = configs.bonjour ? new Bonjour() : this.dummy;
    bonjourChild.setProps(childProps);

    const mqttsdChild = configs.mqttsd ? new MQTTSD(configs.mqttsd) : this.dummy;
    mqttsdChild.setProps(childProps);

    const child = {
      async start() {
        await bonjourChild.start();
        await mqttsdChild.start();
      },
      async stop() {
        await bonjourChild.stop();
        await mqttsdChild.stop();
      },
    };

    this.children.push(child);

    return child;
  }

  /**
   * Terminate the service discovery.
   *
   * @method stop
   * @return {Promise} A promise of the result of the terminate process.
   */
  async stop() {
    await this.delegate.serviceDiscoveryWillStop();
    await Promise.all(this.children.map(child => child.stop()));
    await this.bonjour.stop();
    await this.mqttsd.stop();
    delete this.bonjour;
    delete this.mqttsd;
    await this.delegate.serviceDiscoveryDidStop();
  }
}

export Bonjour from './backend/bonjour';
export MQTTSD from './backend/mqttsd';
