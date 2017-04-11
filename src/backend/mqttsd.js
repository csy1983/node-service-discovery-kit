import EventEmitter from 'events';
import autobind from 'autobind-decorator';
import ip from 'ip';
import mqtt from 'mqtt';
import { findServiceHelper } from '../helper';

const MQTTSD_QUERY_TOPIC = 'mqttsd-query';
const MQTTSD_TOPIC = 'mqttsd';
const MQTTSD_QOS = { qos: 1 };
const MQTTSD_QUERY_RESPONSE_DELAY = 5000;

/**
 * Service discovery using MQTT.
 * @class MQTTSD
 * @constructor
 * @extends EventEmitter
 */
@autobind
export default class MQTTSD extends EventEmitter {
  /**
   * Construct and configure a MQTTSD instance.
   *
   * @param {Object} configs Configuration object:
   * {
   *   brokerURL: {String} MQTT broker URL.
   *   options: {Object} MQTT client options. (See https://github.com/mqttjs/MQTT.js#client)
   *   browse: {Boolean} if true, browse network services before publish service on start(); otherwise, do publish only. (Default: false)
   * }
   */
  constructor(configs) {
    super();
    this.configs = configs || {};
    this.props = {
      protocol: 'tcp',
      subtypes: [],
    };
    this.prevProps = {};
    this.serviceMap = {};
  }

  /**
   * Start the MQTTSD instance.
   *
   * @method start
   * @return {Promise} A promise of the result of start process.
   */
  start() {
    return new Promise((resolve) => {
      if (!this.configs.brokerURL) return resolve();

      this.mqtt = mqtt.connect(`mqtt://${this.configs.brokerURL}`, this.configs.options);
      this.browse();
      this.mqtt.on('connect', () => {
        this.mqtt.subscribe(MQTTSD_QUERY_TOPIC, MQTTSD_QOS, () => {
          if (this.configs.browse) {
            this.mqtt.subscribe(MQTTSD_TOPIC, MQTTSD_QOS, () => {
              this.publish({ queryId: this.mqtt.options.clientId });
              resolve();
            });
          } else {
            this.publish();
            resolve();
          }
        });
      });

      this.mqtt.on('error', (error) => {
        resolve({
          status: 'error',
          error,
        });
      });

      this.mqtt.on('reconnect', () => {
        resolve({ status: 'reconnect' });
      });

      this.mqtt.on('close', () => {
        //
      });

      this.mqtt.on('offline', () => {
        this.mqtt.unsubscribe([MQTTSD_QUERY_TOPIC, MQTTSD_TOPIC]);
      });
    });
  }

  /**
   * Stop the MQTTSD instance.
   *
   * @method stop
   * @return {Promise} A promise of the result of stop process.
   */
  stop() {
    return new Promise((resolve) => {
      if (!this.configs.brokerURL) return resolve();
      if (this.mqtt.connected) {
        const timeout = setTimeout(resolve, 5000);
        this.mqtt.publish(MQTTSD_TOPIC, JSON.stringify(Object.assign(this.props, {
          addresses: [this.address],
          status: 'down',
        })), MQTTSD_QOS, () => {
          clearTimeout(timeout);
          this.mqtt.end();
          resolve();
        });
      } else {
        this.mqtt.end();
        resolve();
      }
    });
  }

  /**
   * Start browsing services by MQTTSD. All found services will be stored in an
   * service map with their ip address as key for findService() method to search.
   *
   * @method browse
   * @private
   */
  browse() {
    if (!this.configs.brokerURL) return;
    this.mqtt.on('message', (topic, message) => {
      if (topic === MQTTSD_QUERY_TOPIC) {
        const data = JSON.parse(message.toString());

        if (data && data.queryId !== this.mqtt.options.clientId) {
          clearTimeout(this.responseQueryTimer);
          this.responseQueryTimer = setTimeout(() => {
            this.publish();
          }, MQTTSD_QUERY_RESPONSE_DELAY);
        }
      } else if (this.configs.browse && topic === MQTTSD_TOPIC) {
        const service = JSON.parse(message.toString());
        const addr = service.addresses[0];

        if (!addr || !service.txt) return;
        if (service.status === 'up') {
          this.serviceMap[addr] = (this.serviceMap[addr] || []).filter(srv => srv.txt.serialnumber !== service.txt.serialnumber);
          this.serviceMap[addr].push(service);
          this.emit('event', { action: 'up', data: service });
        } else if (service.status === 'down') {
          this.serviceMap[addr] = (this.serviceMap[addr] || []).filter(srv => srv.txt.serialnumber !== service.txt.serialnumber);
          this.emit('event', { action: 'down', data: service });
        }
      }
    });
  }

  /**
   * Publish service with given properties.
   *
   * @method publish
   * @param {Object} options
   */
  publish(options = {}) {
    if (options.queryId) {
      this.mqtt.publish(MQTTSD_QUERY_TOPIC, `{"queryId":"${options.queryId}"}`, MQTTSD_QOS);
    }

    if (this.props.name && this.props.port && this.props.type) {
      if (this.address) {
        this.mqtt.publish(MQTTSD_TOPIC, JSON.stringify(Object.assign(this.prevProps, {
          addresses: [this.address],
          status: 'down',
        })), MQTTSD_QOS, () => {
          this.address = ip.address();
          this.mqtt.publish(MQTTSD_TOPIC, JSON.stringify(Object.assign(this.props, {
            addresses: [this.address],
            fqdn: `${this.props.name}._${this.props.type}._${this.props.protocol || 'tcp'}.local`,
            status: 'up',
          })), MQTTSD_QOS);
        });
      } else {
        this.address = ip.address();
        this.mqtt.publish(MQTTSD_TOPIC, JSON.stringify(Object.assign(this.props, {
          addresses: [this.address],
          fqdn: `${this.props.name}._${this.props.type}._${this.props.protocol || 'tcp'}.local`,
          status: 'up',
        })), MQTTSD_QOS);
      }
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
    this.prevProps = Object.assign({}, this.props);
    Object.assign(this.props, props);
  }

  /**
   * Find services from MQTTSD service browser.
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
