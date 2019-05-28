/* eslint-disable no-unused-vars */
import EventEmitter from 'events';

/**
 * Dummy service discovery.
 * @class Dummy
 * @constructor
 * @extends EventEmitter
 */
export default class Dummy extends EventEmitter {
  start() {
    return new Promise(resolve => resolve());
  }
  stop() {
    return new Promise(resolve => resolve());
  }
  refresh(options = {}) {}
  publish() {}
  setProps(props = {}) {}
  updateProps(props) {}
  findService(matches, comparator) { return []; }
}
