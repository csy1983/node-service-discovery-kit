/* eslint-disable no-undef, prefer-arrow-callback, func-names, space-before-function-paren */
import autobind from 'autobind-decorator';
import assert from 'assert';
import debug from 'debug';
import mosca from 'mosca';
import { STATUS_UP, STATUS_DOWN } from '../src/constants';
import EchoServer from './echo-server';

const DEBUG = debug('service-discovery:mqttsd');

@autobind
class EchoServerWithMQTTSD extends EchoServer {
  /**
   * ServiceDiscoveryDataSource implementations
   */
  serviceDiscoveryConfigs() {
    return {
      mqttsd: {
        brokerURL: 'localhost',
        options: {
          connectTimeout: 1000,
        }
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

describe('EchoServer with MQTTSD', function() {
  let echoServer = new EchoServerWithMQTTSD();
  let mqttBroker;
  let childService;

  this.timeout(10000);

  describe('#start()', function() {
    it('should attempt to reconnect because MQTT broker is not ready', function(done) {
      echoServer.start();
      setTimeout(() => {
        echoServer.testClientStatus(echoServer.mqttsd.status, 'reconnect', done);
      }, 5000);
    });

    it('should establish connection to MQTT broker and publish itelf via MQTTSD', function(done) {
      mqttBroker = new mosca.Server();
      mqttBroker.on('error', error => assert(false, error));
      mqttBroker.on('clientConnected', (client) => {
        // console.log('Client Connected:', client.id);
      });
      mqttBroker.on('clientDisconnected', (client) => {
        // console.log('Client Disconnected:', client.id);
      });
      mqttBroker.on('published', (packet, client) => {
        // if (packet.topic === 'mqttsd') {
        //   console.log(JSON.parse(packet.payload.toString()));
        // }
      })
      echoServer.addEventTestObject({ protocol: 'mqttsd', action: STATUS_UP }, done);
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

      echoServer.addEventTestObject({
        protocol: 'mqttsd',
        action: STATUS_DOWN,
        service: echoServer.serviceDiscoveryProps(),
      }, (error) => {
        if (error) done(error);
        else pass = true;
      });

      echoServer.addEventTestObject({
        protocol: 'mqttsd',
        action: STATUS_UP,
        service: updatedProp,
      }, (error) => {
        if (pass) done(error);
      });

      echoServer.setProps(updatedProp);
      echoServer.updateServiceProps();
    });
  });

  describe('#child:start()', function() {
    it('should create a child service and start it without error', function(done) {
      const serviceProps = echoServer.serviceDiscoveryProps();
      echoServer.addEventTestObject({
        protocol: 'mqttsd',
        action: STATUS_UP,
        service: Object.assign({}, serviceProps, {
          name: 'Child mqttsd echo server',
          txt: {
            path: `/${serviceProps.txt.serialnumber}`,
            serialnumber: 'child-12345678',
          },
        }),
      }, done);

      childService = echoServer.createChildService({
        name: 'Child mqttsd echo server',
        txt: { serialnumber: 'child-12345678' },
      });
      childService.start().catch(done);
    });
  });

  describe('#findService()', function() {
    it('should return with 2 echo-test services', function(done) {
      const services = echoServer.findService();
      DEBUG(services);
      if (services.length === 2) done();
      else done(services);
    });
  });

  describe('#child:stop()', function() {
    it('should stop child service without error', function(done) {
      echoServer.addEventTestObject({
        protocol: 'mqttsd',
        action: STATUS_DOWN,
        service: childService.props,
      }, done);
      childService.stop().catch(done);
    });
  });

  describe('#findService()', function() {
    it('should return 1 online echo-test service', function(done) {
      const services = echoServer.findService();
      DEBUG(services);
      if (services.length === 1) done();
      else done(services);
    });
  });

  describe('#findService()', function() {
    it('should return 1 offline echo-test child service', function(done) {
      const services = echoServer.findService({
        status: STATUS_DOWN,
        serialnumber: 'child-12345678',
      });
      DEBUG(services);
      if (services.length === 1 && services[0].status === STATUS_DOWN) done();
      else done(services);
    });
  });

  describe('#stop()', function() {
    it('should unpublish itself via MQTTSD and stop without throwing error', function(done) {
      echoServer.addEventTestObject({
        protocol: 'mqttsd',
        action: STATUS_DOWN,
      }, (error) => {
        mqttBroker.close();
        done(error);
      });
      echoServer.stop().catch(done);
    });
  });
});
