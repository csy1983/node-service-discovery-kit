/* eslint-disable no-unused-vars */
const EventEmitter = require('events')

/**
 * Dummy service discovery.
 * @class Dummy
 * @constructor
 * @extends EventEmitter
 */
class Dummy extends EventEmitter {
  start () {
    return new Promise(resolve => resolve())
  }
  stop () {
    return new Promise(resolve => resolve())
  }
  publish () {}
  setProps (props = {}) {}
  updateProps (props) {}
  findService (matches, comparator) { return [] }
}

module.exports = Dummy
