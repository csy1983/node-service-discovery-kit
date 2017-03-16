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

  setDelegate(delegate) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this.delegate))
      .filter(prop => prop !== 'constructor')
      .forEach((prop) => {
        if (delegate[prop]) this.delegate[prop] = delegate[prop];
      });
  }

  setDataSource(datasource) {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this.datasource))
      .filter(prop => prop !== 'constructor')
      .forEach((prop) => {
        if (datasource[prop]) this.datasource[prop] = datasource[prop];
      });
  }

  /**
   * Delegation method for delegator to initiate the service discovery delegation.
   *
   * @method start
   * @return {Promise} A promise of the result of the initiate process.
   */
  async start() {
    const configs = this.datasource.serviceDiscoveryConfigs();

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

    await this.delegate.serviceDiscoveryWillStart();
    this.bonjour.setProps(this.datasource.serviceDiscoveryProps());
    this.mqttsd.setProps(this.datasource.serviceDiscoveryProps());
    let bonjour = await this.bonjour.start();
    let mqttsd = await this.mqttsd.start();
    await this.delegate.serviceDiscoveryDidStart();
    return { bonjour, mqttsd };
  }

  /**
   * Delegation method for the delegator to update the service properties.
   * Property changes must be reflected in the return of serviceDiscoveryProps().
   * This method will also republish your service automatically, calling
   * publishService() after this method is unnecessary.
   *
   * @method updateServiceProps
   */
  updateServiceProps() {
    this.bonjour.updateProps(this.datasource.serviceDiscoveryProps());
    this.mqttsd.updateProps(this.datasource.serviceDiscoveryProps());
    this.publishService();
  }

  /**
   * Delegation method for the delegator to manually publish the service.
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
   * Delegation method for the delegator to find services from the service browser.
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
      return !this.mqttsd.findService(Object.assign(matches, {
        SerialNumber: findSerialNumber(srv),
      }));
    }).concat(mqttsdServices);
  }

  /**
   * Delegation method for the delegator to create a child service. A child service
   * can be recognized by its TXT record. A `path` property in TXT describes the
   * parent-child relationship between services.
   *
   * For ancestor service, its `path` property is always '/' (root path).
   * For child service, its `path` property contains parent's serial number and
   * even grandparent's, e.g., '/mother-serial-number', '/grandma-sn/mom-sn'.
   *
   * Delegator can initiate the child service by calling the start() method from
   * the returned child service object, and terminate it by stop().
   *
   * @method createChildService
   * @param  {Object} props Child service properties (refer to serviceDiscoveryProps()).
   * @return {Object}       Child service object with start() and stop() methods.
   */
  createChildService(props) {
    const { name, txt, port, type } = this.datasource.serviceDiscoveryProps();
    const configs = this.datasource.serviceDiscoveryConfigs();
    const childProps = {
      name: props.name || `Child service of ${name}`,
      port: props.port || port,
      type: props.type || type,
      txt: Object.assign({}, props.txt, { path: txt.path + txt.serialnumber }),
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
   * Delegation method for the delegator to terminate the service discovery delegation.
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
