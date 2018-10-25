/* eslint-disable no-undef, prefer-arrow-callback, func-names, space-before-function-paren */
import assert from 'assert';
import debug from 'debug';
import mosca from 'mosca';
import { STATUS_UP, STATUS_DOWN } from '../src/constants';
import EchoServer from './echo-server';

const DEBUG = debug('service-discovery:hybrid');

describe('EchoServer with all backend enabled', function() {
  let echoServer = new EchoServer();
  let childService;
  let mqttBroker;

  this.timeout(15000);

  describe('#start()', function() {
    it('should start without error', function(done) {
      mqttBroker = new mosca.Server();
      mqttBroker.on('error', error => assert(false, error));

      const pBonjourEvent = new Promise((resolve, reject) => {
        echoServer.addEventTestObject({ protocol: 'bonjour', action: STATUS_UP }, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      const pMqttsdEvent = new Promise((resolve, reject) => {
        echoServer.addEventTestObject({ protocol: 'mqttsd', action: STATUS_UP }, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      Promise.all([pBonjourEvent, pMqttsdEvent]).then(() => done()).catch(done);
      echoServer.start().catch(done);
    });
  });

  describe('#child:start()', function() {
    it('should create a child service and start it without error', function(done) {
      const serviceProps = echoServer.serviceDiscoveryProps();
      const targetService = Object.assign({}, serviceProps, {
        name: 'Child echo server',
        txt: {
          path: `/${serviceProps.txt.serialnumber}`,
          serialnumber: 'child-12345678',
        },
      });

      const pBonjourEvent = new Promise((resolve, reject) => {
        echoServer.addEventTestObject({
          protocol: 'bonjour',
          action: STATUS_UP,
          service: targetService,
        }, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      const pMqttsdEvent = new Promise((resolve, reject) => {
        echoServer.addEventTestObject({
          protocol: 'mqttsd',
          action: STATUS_UP,
          service: targetService,
        }, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      Promise.all([pBonjourEvent, pMqttsdEvent]).then(() => done()).catch(done);

      childService = echoServer.createChildService({
        name: 'Child echo server',
        txt: { serialnumber: 'child-12345678' },
      });
      childService.start().catch(done);
    });
  });

  describe('#findService()', function() {
    it('should return with 2 echo-test services', function(done) {
      const services = echoServer.findService();
      DEBUG(services);
      assert.equal(services.length, 2);
      done();
    });
  });

  describe('#child:stop()', function() {
    it('should stop child service without error', function(done) {
      const pBonjourEvent = new Promise((resolve, reject) => {
        echoServer.addEventTestObject({
          protocol: 'bonjour',
          action: STATUS_DOWN,
          service: childService.props,
        }, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      const pMqttsdEvent = new Promise((resolve, reject) => {
        echoServer.addEventTestObject({
          protocol: 'mqttsd',
          action: STATUS_DOWN,
          service: childService.props,
        }, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      Promise.all([pBonjourEvent, pMqttsdEvent]).then(() => done()).catch(done);
      childService.stop().catch(done);
    });
  });

  describe('#findService()', function() {
    it('should return 1 online echo-test service', function(done) {
      const services = echoServer.findService();
      DEBUG(services);
      assert.equal(services.length, 1);
      done();
    });
  });

  describe('#findService()', function() {
    it('should return 1 offline echo-test child service', function(done) {
      const services = echoServer.findService({
        status: STATUS_DOWN,
        serialnumber: 'child-12345678',
      });
      DEBUG(services);
      assert.equal(services.length, 1);
      assert.equal(services[0].status, STATUS_DOWN);
      done()
    });
  });

  describe('#stop()', function() {
    it('should unpublish itself and stop without throwing error', function(done) {
      const pBonjourEvent = new Promise((resolve, reject) => {
        echoServer.addEventTestObject({
          protocol: 'bonjour',
          action: STATUS_DOWN,
        }, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      const pMqttsdEvent = new Promise((resolve, reject) => {
        echoServer.addEventTestObject({
          protocol: 'mqttsd',
          action: STATUS_DOWN,
        }, (error) => {
          mqttBroker.close();
          if (error) reject(error);
          else resolve();
        });
      });

      Promise.all([pBonjourEvent, pMqttsdEvent]).then(() => done()).catch(done);
      echoServer.stop().catch(done);
    });
  });
});
