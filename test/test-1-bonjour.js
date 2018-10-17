/* eslint-disable no-undef, prefer-arrow-callback, func-names, space-before-function-paren */
const debug = require('debug')
const { STATUS_UP, STATUS_DOWN } = require('../src/constants')
const EchoServer = require('./echo-server')

const DEBUG = debug('service-discovery:bonjour')

class EchoServerWithBonjour extends EchoServer {
  /**
   * ServiceDiscoveryDataSource implementations
   */
  serviceDiscoveryConfigs() {
    return {
      bonjour: true
    }
  }
}

describe('EchoServer with Bonjour', function() {
  let echoServer = new EchoServerWithBonjour()
  let childService
  let pass = false

  this.timeout(15000)

  describe('#start()', function() {
    it('should start and publish itself via Bonjour without throwing error', function(done) {
      echoServer.addEventTestObject({ protocol: 'bonjour', action: STATUS_UP }, done)
      echoServer.start().catch(done)
    })
  })

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
          serialnumber: '87654321'
        }
      }

      echoServer.addEventTestObject({
        protocol: 'bonjour',
        action: STATUS_DOWN,
        service: echoServer.serviceDiscoveryProps()
      }, (error) => {
        if (error) done(error)
        else pass = true
      })

      echoServer.addEventTestObject({
        protocol: 'bonjour',
        action: STATUS_UP,
        service: updatedProp
      }, (error) => {
        if (pass) done(error)
      })

      echoServer.setProps(updatedProp)
      echoServer.updateServiceProps()
    })
  })

  describe('#child:start()', function() {
    it('should create a child service and start it without error', function(done) {
      const serviceProps = echoServer.serviceDiscoveryProps()
      echoServer.addEventTestObject({
        protocol: 'bonjour',
        action: STATUS_UP,
        service: Object.assign({}, serviceProps, {
          name: 'Child bonjour echo server',
          txt: {
            path: `/${serviceProps.txt.serialnumber}`,
            serialnumber: 'child-12345678'
          }
        })
      }, done)

      childService = echoServer.createChildService({
        name: 'Child bonjour echo server',
        txt: { serialnumber: 'child-12345678' }
      })
      childService.start().catch(done)
    })
  })

  describe('#findService()', function() {
    it('should return 2 echo-test services', function(done) {
      const services = echoServer.findService()
      DEBUG(services)
      if (services.length === 2) done()
      else done(services)
    })
  })

  describe('#child:stop()', function() {
    it('should stop child service without error', function(done) {
      echoServer.addEventTestObject({
        protocol: 'bonjour',
        action: STATUS_DOWN,
        service: childService.props
      }, done)
      childService.stop().catch(done)
    })
  })

  describe('#findService()', function() {
    it('should return 1 online echo-test service', function(done) {
      const services = echoServer.findService()
      DEBUG(services)
      if (services.length === 1) done()
      else done(services)
    })
  })

  describe('#findService()', function() {
    it('should return 1 offline echo-test child service', function(done) {
      const services = echoServer.findService({
        status: STATUS_DOWN,
        serialnumber: 'child-12345678'
      })
      DEBUG(services)
      if (services.length === 1 && services[0].status === STATUS_DOWN) done()
      else done(services)
    })
  })

  describe('#stop()', function() {
    it('should return without throwing error', function(done) {
      echoServer.addEventTestObject({
        protocol: 'bonjour',
        action: STATUS_DOWN
      }, done)
      echoServer.stop().catch(done)
    })
  })
})
