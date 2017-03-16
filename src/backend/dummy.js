/* eslint-disable no-unused-vars */
import EventEmitter from 'events';

/**
 * Dummy service discovery.
 * @class Dummy
 * @constructor
 * @extends EventEmitter
 */
export default class Dummy extends EventEmitter {
  start() {}
  stop() {}
  publish() {}
  setProps(props = {}) {}
  updateProps(props) {}
  findService(matches, comparator) { return []; }
}
