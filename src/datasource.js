export default class ServiceDiscoveryDataSource {
  /**
   * Delegation life cycle #1:
   *   Read service discovery configurations from the delegator to configure
   *   what methods of service discovery are going to use.
   *
   * @method serviceDiscoveryConfigs
   * @return {Object} Configurations of service discovery delegation:
   * {
   *   bonjour: true, // set to true if use bonjour
   *   mqttsd: {      // set mqttsd configs properly to use mqttsd
   *     brokerURL: 'mqtt_broker_url'
   *     options: { ...mqtt_client_options }
   *   }
   * }
   */
  serviceDiscoveryConfigs() {
    return {};
  }

  /**
   * Delegation life cycle #3:
   *   Delegator must implement serviceDiscoveryProps() to return a service object
   *   to setup the service discovery instances.
   *
   * @method serviceDiscoveryProps
   * @return {Object} Properties of service object.
   * A typical service object may contain the following properties:
   * {
   *   name: 'service_name',
   *   host: 'hostname',
   *   port: service_port,
   *   type: 'service_type',
   *   protocol: 'tcp' or 'udp',
   *   subtypes: [],
   *   txt: {
   *     path: '/', // refer to createChildService()
   *     serialnumber: 'machine_serial_number', // refer to createChildService()
   *     ...any further information you want for the service
   *   }
   * }
   */
  serviceDiscoveryProps() {
    return {};
  }
}
