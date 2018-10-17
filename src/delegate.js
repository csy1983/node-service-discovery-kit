/* eslint-disable no-empty-function, no-unused-vars */
class ServiceDiscoveryDelegate {
  /**
   * Delegation life cycle #1:
   *   Delegator should implement serviceDiscoveryWillStart() to get prepared for
   *   the service discovery to start.
   *   We usually do the following tasks here:
   *     1. Generate dynamic service discovery properties for serviceDiscoveryProps()
   *     2. Startup our server
   *
   * @method serviceDiscoveryWillStart
   * @return {Promise} A promise of the result of willStart() method.
   */
  async serviceDiscoveryWillStart () {}

  /**
   * Delegation life cycle #2:
   *   Delegator should implement serviceDiscoveryDidStart() method to do whatever
   *   it wants after service discovery instances are all up and running.
   *
   * @method serviceDiscoveryDidStart
   * @return {Promise} A promise of the result of didStart() method.
   */
  async serviceDiscoveryDidStart () {}

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
  serviceDiscoveryDidReceiveEvent (protocol, action, service) {}

  /**
   * Delegation life cycle #4:
   *   Delegator should implement serviceDiscoveryWillStop() method to do some
   *   termination tasks before service discovery instances are going down.
   *
   * @method serviceDiscoveryWillStop
   * @return {Promise} A promise of the result of willStop() method.
   */
  async serviceDiscoveryWillStop () {}

  /**
   * Delegation life cycle #5:
   *   Delegator should implement serviceDiscoveryDidStop() method to do some
   *   cleanup tasks after service discovery instances are going down.
   *
   * @method serviceDiscoveryDidStop
   * @return {Promise} A promise of the result of didStop() method.
   */
  async serviceDiscoveryDidStop () {}
}

module.exports = ServiceDiscoveryDelegate
