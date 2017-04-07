# node-service-discovery-kit
A node.js class providing service discovery functionalities for your service using Bonjour and MQTT.

[![Build Status](https://travis-ci.org/csy1983/node-service-discovery-kit.svg?branch=master)](https://travis-ci.org/csy1983/node-service-discovery-kit)

# Usage
```
npm install node-service-discovery-kit
```

## Backend
- **Bonjour**: Backed by [watson/bonjour](https://github.com/watson/bonjour).
- **MQTTSD**: Use MQTT to imitate the bonjour behavior to provide reliable discovery.

## Example Code
Create a http echo server and publish the service to the network using both Bonjour and MQTTSD.
```js
import http from 'http';
import ServiceDiscovery from 'node-service-discovery-kit';

class EchoServer extends ServiceDiscovery {
  constructor() {
    super();
    // Set delegate
    this.setDelegate(this);
    // Set datasource
    this.setDataSource(this);
  }

  /**
   * ServiceDiscoveryDelegate implementations
   */

  serviceDiscoveryWillStart() {
    // We usually start our server in this callback
    this.server = http.createServer((request, response) => {
      response.writeHead(200);
      request.on('data', (message) => {
        response.write(message);
      });

      request.on('end', function() {
        response.end();
      });
    }).listen(8888);
  }

  serviceDiscoveryDidStart() {
    // Okay, we have started the server and publish the service to the network
    // Nothing to do in this example...
  }

  serviceDiscoveryDidReceiveEvent(protocol, action, service) {
    this.emitter.emit('didReceiveEvent', { protocol, action, service });
  }

  serviceDiscoveryWillStop() {
    // Close the server before publishing service down event
    this.server.close();
  }

  serviceDiscoveryDidStop() {
    // This server is down, and service down event is also published
  }

  /**
   * ServiceDiscoveryDataSource implementations
   */

  serviceDiscoveryConfigs() {
    return {
      bonjour: true, // Enable bonjour
      mqttsd: {      // Enable mqttsd as well
        brokerURL: 'localhost'
      }
    };
  }

  serviceDiscoveryProps() {
    return {
      name: 'HTTP echo server',
      host: 'chardi',
      port: 8888,
      type: 'echo-test',
      protocol: 'tcp',
      subtypes: [],
      txt: {
        serialnumber: '12345678',
      }
    };
  }
}

/* Create echo server instance */
const echoServer = new EchoServer();

/* Start the echo server */
echoServer.start();

```

## Class Life Cycle
### start()
1. Read configs from [serviceDiscoveryConfigs()](#user-content-servicediscoveryconfigs)
2. Read properties from [serviceDiscoveryProps()](#user-content-servicediscoveryprops)
3. Callback [serviceDiscoveryWillStart()](#user-content-servicediscoverywillstart)
4. Callback [serviceDiscoveryDidStart()](#user-content-servicediscoverydidstart)
5. Callback [serviceDiscoveryDidReceiveEvent()](#user-content-servicediscoverydidreceiveevent) on any service found

### stop()
1. Callback [serviceDiscoveryWillStop()](#user-content-servicediscoverywillstop)
2. Stop child services if any
3. Callback [serviceDiscoveryDidStop()](#user-content-servicediscoverydidstop)

## Class Methods
### setDelegate
```js
/**
 * Specify the delegation source.
 * @param {Object} delegate An instance who implements the ServiceDiscoveryDelegate class.
 */
setDelegate(delegate)
```

### setDataSource
```js
/**
 * Specify the data source.
 * @param {Object} datasource An instance who implements the ServiceDiscoveryDataSource class.
 */
setDataSource(datasource)
```

### start
```js
/**
 * Initiate the service discovery.
 *
 * @method start
 * @return {Promise} A promise of the result of the initiate process.
 */
async start()
```
See [Class Life Cycle](#user-content-class-life-cycle) for the start flow.

### stop()
```js
/**
 * Terminate the service discovery.
 *
 * @method stop
 * @return {Promise} A promise of the result of the terminate process.
 */
async stop()
```
See [Class Life Cycle](#user-content-class-life-cycle) for the stop flow.

### createChildService
```js
/**
 * Create a child service. A child service can be recognized by its TXT record.
 * A `path` property in TXT describes the parent-child relationship between services.
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
createChildService(props)
```

### updateServiceProps
```js
/**
 * Update the service properties.
 * Property changes must be reflected in the return of serviceDiscoveryProps().
 * This method will also republish your service automatically, calling
 * publishService() after this method is unnecessary.
 *
 * @method updateServiceProps
 */
updateServiceProps()
```

### publishService
```js
/**
 * Manually publish the service.
 *
 * @method publishService
 */
publishService()
```

### findService
```js
/**
 * Find services from the service browser.
 *
 * @method findService
 * @param  {Object} matches Key-value matches to search in an the service object.
 * @return {Array}          All matched service objects in an array.
 */
findService(matches = {})
```

## Class Data Source
### serviceDiscoveryConfigs
```js
/**
 * Return service discovery configurations for the delegator to configure what
 * methods of service discovery are going to use.
 *
 * @method serviceDiscoveryConfigs
 * @return {Object} Configurations of service discovery delegation:
 * {
 *   bonjour: true, // set to true if use bonjour
 *   mqttsd: {      // set mqttsd configs properly to use mqttsd
 *     brokerURL: 'mqtt_broker_url'
 *     options: { ...mqtt_client_options }
 *   }
 * }
 */
serviceDiscoveryConfigs()
```
### serviceDiscoveryProps
```js
/**
 * Delegator must implement serviceDiscoveryProps() to return a service object
 * to setup the service discovery instances.
 *
 * @method serviceDiscoveryProps
 * @return {Object} Properties of service object.
 * A typical service object may contain the following properties:
 * {
 *   name: 'service_name',
 *   host: 'hostname',
 *   port: service_port,
 *   type: 'service_type',
 *   protocol: 'tcp' or 'udp',
 *   subtypes: [],
 *   txt: {
 *     path: '/', // refer to createChildService()
 *     serialnumber: 'machine_serial_number', // refer to createChildService()
 *     ...any further information you want for the service
 *   }
 * }
 */
serviceDiscoveryProps()
```

## Class Delegate
### serviceDiscoveryWillStart
```js
/**
 * Delegation life cycle #1:
 *   Delegator should implement serviceDiscoveryWillStart() to prepare the service
 *   before service discovery starts. We usually put our server start codes here.
 *
 * @method serviceDiscoveryWillStart
 * @return {Promise} A promise of the result of willStart() method.
 */
async serviceDiscoveryWillStart()
```
### serviceDiscoveryDidStart
```js
/**
 * Delegation life cycle #2:
 *   Delegator should implement serviceDiscoveryDidStart() method to do whatever
 *   it wants after service discovery instances are all up and running.
 *
 * @method serviceDiscoveryDidStart
 * @return {Promise} A promise of the result of didStart() method.
 */
async serviceDiscoveryDidStart()
```
### serviceDiscoveryDidReceiveEvent
```js
/**
 * Delegation life cycle #3:
 *   Delegator should implement serviceDiscoveryDidReceiveEvent() method if it
 *   would like to get notified on service up and service down.
 *
 * @method serviceDiscoveryDidReceiveEvent
 * @param {String} protocol Service discovery protocol, e.g., 'bonjour', 'mqttsd'.
 * @param {String} action   Event action, i.e., 'up', 'down'.
 * @param {Object} service  Service object who triggered this event.
 */
serviceDiscoveryDidReceiveEvent(protocol, action, service)
```
### serviceDiscoveryWillStop
```js
/**
 * Delegation life cycle #4:
 *   Delegator should implement serviceDiscoveryWillStop() method to do some
 *   termination tasks before service discovery instances are going down.
 *
 * @method serviceDiscoveryWillStop
 * @return {Promise} A promise of the result of willStop() method.
 */
async serviceDiscoveryWillStop()
```
### serviceDiscoveryDidStop
```js
/**
 * Delegation life cycle #5:
 *   Delegator should implement serviceDiscoveryDidStop() method to do some
 *   cleanup tasks after service discovery instances are going down.
 *
 * @method serviceDiscoveryDidStop
 * @return {Promise} A promise of the result of didStop() method.
 */
async serviceDiscoveryDidStop()
```

## Create a new service discovery backend
A very simple skeleton code is [here](https://github.com/csy1983/node-service-discovery-kit/blob/master/src/backend/dummy.js) for your reference.

# License
MIT

