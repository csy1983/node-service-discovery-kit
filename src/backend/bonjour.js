import EventEmitter from 'events';
import autobind from 'autobind-decorator';
import bonjour from 'bonjour';
import ip from 'ip';
import { STATUS_UP, STATUS_DOWN } from '../constants';
import { findServiceHelper, networkInterface } from '../helper';

/**
 * Service discovery using Bonjour.
 * @class Bonjour
 * @constructor
 * @extends EventEmitter
 */
@autobind
export default class Bonjour extends EventEmitter {
  /**
   * Construct and configure a Bonjour instance.
   *
   * @param {Object} configs Configuration object:
   * {
   *   browse: {Boolean} if true, browse network services before publish service on start(); otherwise, do publish only. (Default: false)
   * }
   */
  constructor(configs = {}) {
    super();
    this.networkInterface = networkInterface();
    this.bonjour = bonjour(/* { networkInterface: this.ipaddr } */);
    this.configs = configs;
    this.props = {};
    this.serviceMap = {}; // To store discovered services referred by its ip address as key
  }

  /**
   * Start the Bonjour instance.
   *
   * @method start
   * @return {Promise} A promise of the result of start process.
   */
  start() {
    return new Promise((resolve) => {
      if (this.configs.browse) this.browse();
      this.publish();
      resolve();
    });
  }

  /**
   * Stop the Bonjour instance.
   *
   * @method stop
   * @return {Promise} A promise of the result of stop process.
   */
  stop() {
    return new Promise((resolve) => {
      this.bonjour.unpublishAll(() => {
        // this.bonjour.destroy();
        resolve();
      });
    });
  }

  /**
   * Start browsing services by Bonjour. All found services will be stored in an
   * service map with their ip address as key for findService() method to search.
   *
   * @method browse
   * @private
   */
  browse() {
    return this.bonjour.find({ type: this.props.type })
    .on('up', (service) => {
      const addrs = this.findAddresses(service);
      if (addrs) {
        service.addresses = addrs;
        service.status = STATUS_UP;
        service.timestamp = Date.now();
        this.serviceMap[addrs[0]] = (this.serviceMap[addrs[0]] || []).filter(srv => srv.fqdn !== service.fqdn);
        this.serviceMap[addrs[0]].push(service);
        this.emit('event', { action: STATUS_UP, data: service });
      }
    })
    .on('down', (service) => {
      const addrs = this.findAddresses(service);
      if (addrs) {
        service.status = STATUS_DOWN;
        service.timestamp = Date.now();
        this.serviceMap[addrs[0]] = (this.serviceMap[addrs[0]] || []).filter(srv => srv.fqdn !== service.fqdn);
        this.serviceMap[addrs[0]].push(service);
        this.emit('event', { action: STATUS_DOWN, data: service });
      }
    });
  }

  /**
   * Publish service with given properties.
   *
   * @method publish
   */
  publish(options = {}) {
    if (this.bonjourService && this.bonjourService.published) {
      this.bonjourService.stop(() => {
        this.bonjourService = this.bonjour.publish(this.props);
      });
    } else if (this.props.name && this.props.port && this.props.type) {
      this.bonjourService = this.bonjour.publish(this.props);
    }
  }

  /**
   * Set service properties.
   *
   * @method setProps
   * @param {Object} props A service object with properties.
   * (Refer to serviceDiscoveryProps() in delegate.js)
   */
  setProps(props = {}) {
    Object.assign(this.props, props);
  }

  /**
   * Update service properties.
   *
   * @method updateProps
   * @param {Object} props A service object with only properties to be updated.
   */
  updateProps(props) {
    this.networkInterface = networkInterface();
    Object.assign(this.props, props);
  }

  /**
   * Find addresses of the machine from its bonjour service.
   *
   * @method findAddresses
   * @private
   * @param  {Object} service A bonjour service object.
   * @return {Array}          Addresses in an array.
   */
  findAddresses(service) {
    const { address, netmask } = this.networkInterface;
    const subnet = ip.subnet(address, netmask);
    const addresses = service.addresses
      .filter(addr => ip.isV4Format(addr))
      .sort((addr1, addr2) => +(subnet.contains(addr1)) < +(subnet.contains(addr2)));
    if (addresses.length === 0) {
      if (service.referer && service.referer.address) {
        return [service.referer.address];
      }
      return null;
    }
    return addresses;
  }

  /**
   * Find services from Bonjour service browser.
   *
   * @method findService
   * @param {Object} matches An object contains properties to match the service.
   * @param {Function} comparator A custom helper function to compare the `matches` with service.
   * @return {Array} All matched service objects in an array.
   */
  findService(matches, comparator) {
    return findServiceHelper(this.serviceMap, matches, comparator);
  }
}
