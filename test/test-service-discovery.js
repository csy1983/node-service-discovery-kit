/* eslint-disable no-undef, prefer-arrow-callback, func-names, space-before-function-paren */
import autobind from 'autobind-decorator';
import assert from 'assert';
import debug from 'debug';
import EventEmitter from 'events';
import http from 'http';
import mosca from 'mosca';
import ServiceDiscovery from '../dist'; // import from '../src' for istanbul code coverage analysis

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
      type: 'delegate-test',
      protocol: 'tcp',
      subtypes: [],
      txt: {
        sn: '12345678',
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
  serviceDiscoveryProps() {
    return this.props;
  }

  /**
   * Shared test helpers
   */
  testSelfServiceEvent(expectedEvent, callback) {
    debug('test')('testSelfServiceEvent:', expectedEvent);
    this.emitter.once('didReceiveEvent', (actualEvent) => {
      try {
        assert.equal(actualEvent.protocol, expectedEvent.protocol);
        assert.equal(actualEvent.action, expectedEvent.action);
        assert.equal(actualEvent.service.name, this.serviceDiscoveryProps().name);
        assert.equal(actualEvent.service.port, this.serviceDiscoveryProps().port);
        assert.equal(actualEvent.service.type, this.serviceDiscoveryProps().type);
        assert.equal(actualEvent.service.protocol, this.serviceDiscoveryProps().protocol);
        assert.deepEqual(actualEvent.service.subtypes, this.serviceDiscoveryProps().subtypes);
        assert.deepEqual(actualEvent.service.txt, this.serviceDiscoveryProps().txt);
        callback();
      } catch (error) {
        callback(error);
      }
    });
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

  this.timeout(15000);

  describe('#start()', function() {
    it('should start and publish itself via Bonjour without throwing error', function(done) {
      echoServer.testSelfServiceEvent({ protocol: 'bonjour', action: 'up' }, done);
      echoServer.start().catch(done);
    });
  });

  describe('#updateServiceProps()', function() {
    it('should republish itself with updated service properties', function(done) {
      echoServer.setProps({
        name: 'HTTP echo server',
        host: 'csy1983',
        port: 8888,
        type: 'delegate-test',
        protocol: 'tcp',
        subtypes: [],
        txt: {
          sn: '12345678',
        },
      });
      done();
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
      echoServer.testSelfServiceEvent({ protocol: 'mqttsd', action: 'up' }, done);
    });
  });

  describe('#stop()', function() {
    it('should unpublish itself via MQTTSD and stop without throwing error', function(done) {
      echoServer.testSelfServiceEvent({ protocol: 'mqttsd', action: 'down' }, (error) => {
        mqttBroker.close();
        done(error);
      });
      echoServer.stop().catch(done);
    });
  });
});
