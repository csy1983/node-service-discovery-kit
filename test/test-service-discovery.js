/* eslint-disable no-undef, prefer-arrow-callback, func-names, space-before-function-paren */
import autobind from 'autobind-decorator';
import assert from 'assert';
import debug from 'debug';
import EventEmitter from 'events';
import http from 'http';
import mosca from 'mosca';
import ServiceDiscovery from '../src';

@autobind
class EchoServer extends ServiceDiscovery {

  constructor() {
    super();
    this.emitter = new EventEmitter();
    this.setDelegate(this);
    this.setDataSource(this);
    this.props = {
      name: 'HTTP echo server',
      host: 'csy1983',
      port: 8888,
      type: 'echo-test',
      protocol: 'tcp',
      subtypes: [],
      txt: {
        serialnumber: '12345678',
      },
    };
  }

  setProps(props) {
    this.props = props;
  }

  /**
   * ServiceDiscoveryDelegate implementations
   */
  serviceDiscoveryWillStart() {
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

  serviceDiscoveryDidReceiveEvent(protocol, action, service) {
    this.emitter.emit('didReceiveEvent', { protocol, action, service });
  }

  serviceDiscoveryWillStop() {
    this.server.close();
  }

  /**
   * ServiceDiscoveryDataSource implementations
   */
  serviceDiscoveryConfigs() {
    return {
      bonjour: true,
      mqttsd: {
        brokerURL: 'localhost',
      },
    };
  }

  serviceDiscoveryProps() {
    return this.props;
  }

  /**
   * Shared test helpers
   */
  testServiceEvent(expectedEvent, callback) {
    let didReceiveEvent = (actualEvent) => {
      try {
        if (actualEvent.protocol === expectedEvent.protocol &&
            actualEvent.action === expectedEvent.action) {
          let expectedProps = expectedEvent.service || this.serviceDiscoveryProps();
          debug('test')('didReceiveEvent: [actual]', actualEvent);
          debug('test')('didReceiveEvent: [expected]', expectedProps);
          assert.equal(actualEvent.service.name, expectedProps.name);
          assert.equal(actualEvent.service.port, expectedProps.port);
          assert.equal(actualEvent.service.type, expectedProps.type);
          assert.equal(actualEvent.service.protocol, expectedProps.protocol);
          assert.deepEqual(actualEvent.service.subtypes, expectedProps.subtypes);
          assert.deepEqual(actualEvent.service.txt, expectedProps.txt);
          this.emitter.removeListener('didReceiveEvent', didReceiveEvent);
          callback();
        }
      } catch (error) {
        this.emitter.removeListener('didReceiveEvent', didReceiveEvent);
        callback(error);
      }
    };
    this.emitter.on('didReceiveEvent', didReceiveEvent);
  }
}

@autobind
class EchoServerWithBonjour extends EchoServer {
  /**
   * ServiceDiscoveryDataSource implementations
   */
  serviceDiscoveryConfigs() {
    return {
      bonjour: true,
    };
  }
}

@autobind
class EchoServerWithMQTTSD extends EchoServer {
  /**
   * ServiceDiscoveryDataSource implementations
   */
  serviceDiscoveryConfigs() {
    return {
      mqttsd: {
        brokerURL: 'localhost',
      },
    };
  }

  /**
   * MQTTSD test helpers
   */
  testClientStatus(actual, expected, callback) {
    try {
      assert.equal(actual, expected);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

/**
 * Test EchoServer with Bonjour
 */
describe('EchoServer with Bonjour', function() {
  let echoServer = new EchoServerWithBonjour();
  let childService;
  let pass = false;

  this.timeout(15000);

  describe('#start()', function() {
    it('should start and publish itself via Bonjour without throwing error', function(done) {
      echoServer.testServiceEvent({ protocol: 'bonjour', action: 'up' }, done);
      echoServer.start().catch(done);
    });
  });

  describe('#updateServiceProps()', function() {
    it('should republish itself with updated service properties', function(done) {
      let updatedProp = {
        name: 'HTTP echo server 2',
        host: 'csy1983',
        port: 9999,
        type: 'echo-test',
        protocol: 'tcp',
        subtypes: [],
        txt: {
          serialnumber: '87654321',
        },
      };

      echoServer.testServiceEvent({
        protocol: 'bonjour',
        action: 'down',
        service: echoServer.serviceDiscoveryProps(),
      }, (error) => {
        if (error) done(error);
        else pass = true;
      });

      echoServer.testServiceEvent({
        protocol: 'bonjour',
        action: 'up',
        service: updatedProp,
      }, (error) => {
        if (pass) done(error);
      });

      echoServer.setProps(updatedProp);
      echoServer.updateServiceProps();
    });
  });

  describe('#createChildService()', function() {
    it('should create a child service without error', function(done) {
      childService = echoServer.createChildService({
        name: 'Child bonjour echo server',
        txt: { serialnumber: 'child-12345678' },
      });

      if (childService.start && childService.stop) {
        done();
      } else {
        done('Bad child service object returned');
      }
    });
  });

  describe('#child:start()', function() {
    it('should start child service without error', function(done) {
      const serviceProps = echoServer.serviceDiscoveryProps();
      echoServer.testServiceEvent({
        protocol: 'bonjour',
        action: 'up',
        service: Object.assign(serviceProps, {
          name: 'Child bonjour echo server',
          txt: {
            path: `/${serviceProps.txt.serialnumber}`,
            serialnumber: 'child-12345678',
          },
        }),
      }, done);
      childService.start().catch(done);
    });
  });

  describe('#findService()', function() {
    it('should return with 2 echo-test services', function(done) {
      const services = echoServer.findService();
      debug('test')(services);
      if (services.length === 2) done();
      else done(services);
    });
  });

  describe('#stop()', function() {
    it('should return without throwing error', function() {
      return echoServer.stop();
    });
  });
});

/**
 * Test EchoServer with MQTTSD
 */
describe('EchoServer with MQTTSD', function() {
  let echoServer = new EchoServerWithMQTTSD();
  let mqttBroker;
  let childService;

  this.timeout(5000);

  describe('#start()', function() {
    it('should attempt to reconnect because MQTT broker is not ready', function(done) {
      echoServer.start()
        .then(({ mqttsd }) => echoServer.testClientStatus(mqttsd.status, 'reconnect', done))
        .catch(done);
    });

    it('should establish connection to MQTT broker and publish itelf via MQTTSD', function(done) {
      mqttBroker = new mosca.Server();
      mqttBroker.on('error', error => assert(false, error));
      echoServer.testServiceEvent({ protocol: 'mqttsd', action: 'up' }, done);
    });
  });

  describe('#updateServiceProps()', function() {
    it('should republish itself with updated service properties', function(done) {
      let pass = false;
      let updatedProp = {
        name: 'HTTP echo server 2',
        host: 'csy1983',
        port: 9999,
        type: 'echo-test',
        protocol: 'tcp',
        subtypes: [],
        txt: {
          serialnumber: '87654321',
        },
      };

      echoServer.testServiceEvent({
        protocol: 'mqttsd',
        action: 'down',
        service: echoServer.serviceDiscoveryProps(),
      }, (error) => {
        if (error) done(error);
        else pass = true;
      });

      echoServer.testServiceEvent({
        protocol: 'mqttsd',
        action: 'up',
        service: updatedProp,
      }, (error) => {
        if (pass) done(error);
      });

      echoServer.setProps(updatedProp);
      echoServer.updateServiceProps();
    });
  });

  describe('#createChildService()', function() {
    it('should create a child service without error', function(done) {
      childService = echoServer.createChildService({
        name: 'Child mqttsd echo server',
        txt: { serialnumber: 'child-12345678' },
      });

      if (childService.start && childService.stop) {
        done();
      } else {
        done('Bad child service object returned');
      }
    });
  });

  describe('#child:start()', function() {
    it('should start child service without error', function(done) {
      const serviceProps = echoServer.serviceDiscoveryProps();
      echoServer.testServiceEvent({
        protocol: 'mqttsd',
        action: 'up',
        service: Object.assign(serviceProps, {
          name: 'Child mqttsd echo server',
          txt: {
            path: `/${serviceProps.txt.serialnumber}`,
            serialnumber: 'child-12345678',
          },
        }),
      }, done);
      childService.start().catch(done);
    });
  });

  describe('#findService()', function() {
    it('should return with 2 echo-test services', function(done) {
      const services = echoServer.findService();
      debug('test')(services);
      if (services.length === 2) done();
      else done(services);
    });
  });

  describe('#stop()', function() {
    it('should unpublish itself via MQTTSD and stop without throwing error', function(done) {
      echoServer.testServiceEvent({ protocol: 'mqttsd', action: 'down' }, (error) => {
        mqttBroker.close();
        done(error);
      });
      echoServer.stop().catch(done);
    });
  });
});

/**
 * Test EchoServer with both Bonjour and MQTTSD
 */
describe('EchoServer with all backend enabled', function() {
  let echoServer = new EchoServer();
  let childService;
  let mqttBroker;

  this.timeout(5000);

  describe('#start()', function() {
    it('should start without error', function(done) {
      mqttBroker = new mosca.Server();
      mqttBroker.on('error', error => assert(false, error));
      echoServer.start().then(() => done());
    });
  });

  describe('#createChildService()', function() {
    it('should create a child service without error', function(done) {
      childService = echoServer.createChildService({
        name: 'Child echo server',
        txt: { serialnumber: 'child-12345678' },
      });

      if (childService.start && childService.stop) {
        done();
      } else {
        done('Bad child service object returned');
      }
    });
  });

  describe('#child:start()', function() {
    it('should start child service without error', function(done) {
      childService.start().then(() => done());
    });
  });

  describe('#findService()', function() {
    it('should return with 2 echo-test services', function(done) {
      const services = echoServer.findService();
      debug('test')(services);
      if (services.length === 2) done();
      else done(services.length);
    });
  });

  describe('#stop()', function() {
    it('should unpublish itself and stop without throwing error', function(done) {
      echoServer.stop().then(() => done());
    });
  });
});
