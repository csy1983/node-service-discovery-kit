/* eslint-disable no-undef, prefer-arrow-callback, func-names, space-before-function-paren */
const assert = require('assert')
const debug = require('debug'); // eslint-disable-line
const http = require('http')
const ServiceDiscovery = require('../src')

const DEBUG = debug('service-discovery')

class EchoServer extends ServiceDiscovery {
  constructor() {
    super()
    this.props = {
      name: 'HTTP echo server',
      host: 'csy1983',
      port: 8888,
      type: 'echo-test',
      protocol: 'tcp',
      subtypes: [],
      txt: {
        serialnumber: '12345678'
      }
    }
    this.testEventQueue = {
      bonjour: [],
      mqttsd: []
    }
    this.setProps = this.setProps.bind(this)
    this.serviceDiscoveryWillStart = this.serviceDiscoveryWillStart.bind(this)
    this.serviceDiscoveryWillStop = this.serviceDiscoveryWillStop.bind(this)
    this.serviceDiscoveryDidReceiveEvent = this.serviceDiscoveryDidReceiveEvent.bind(this)
    this.serviceDiscoveryConfigs = this.serviceDiscoveryConfigs.bind(this)
    this.serviceDiscoveryProps = this.serviceDiscoveryProps.bind(this)
    this.addEventTestObject = this.addEventTestObject.bind(this)
    this.testServiceEvent = this.testServiceEvent.bind(this)

    this.setDelegate(this)
    this.setDataSource(this)
  }

  setProps(props) {
    this.props = Object.freeze(props)
  }

  /**
   * ServiceDiscoveryDelegate implementations
   */
  serviceDiscoveryWillStart() {
    this.server = http.createServer((request, response) => {
      response.writeHead(200)
      request.on('data', (message) => {
        response.write(message)
      })

      request.on('end', function() {
        response.end()
      })
    }).listen(8888)
  }

  serviceDiscoveryDidReceiveEvent(protocol, action, service) {
    if (this.testEventQueue[protocol].length) {
      if (this.testServiceEvent(
        { protocol, action, service },
        this.testEventQueue[protocol][0].expectedEvent,
        this.testEventQueue[protocol][0].callback) !== 0) {
        this.testEventQueue[protocol].shift()
      }
    }
  }

  serviceDiscoveryWillStop() {
    this.server.close()
  }

  /**
   * ServiceDiscoveryDataSource implementations
   */
  serviceDiscoveryConfigs() {
    return {
      bonjour: true,
      mqttsd: {
        brokerURL: 'localhost',
        browse: true
      }
    }
  }

  serviceDiscoveryProps() {
    return this.props
  }

  /**
   * Shared test helpers
   */
  addEventTestObject(expectedEvent, callback) {
    this.testEventQueue[expectedEvent.protocol].push({ expectedEvent, callback })
  }

  testServiceEvent(actualEvent, expectedEvent, callback) {
    try {
      if (actualEvent.service.protocol !== expectedEvent.protocol) {
        let expectedProps = expectedEvent.service || this.serviceDiscoveryProps()
        DEBUG('testServiceEvent: [actual]', actualEvent)
        DEBUG('testServiceEvent: [expected]', expectedProps)
        assert.equal(actualEvent.service.name, expectedProps.name)
        assert.equal(actualEvent.service.port, expectedProps.port)
        assert.equal(actualEvent.service.type, expectedProps.type)
        assert.deepEqual(actualEvent.service.subtypes, expectedProps.subtypes)
        assert.deepEqual(actualEvent.service.txt, expectedProps.txt)
        callback()
        return 1
      }
      return 0
    } catch (error) {
      callback(error)
      return -1
    }
  }
}

module.exports = EchoServer
