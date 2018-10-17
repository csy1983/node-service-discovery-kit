const { STATUS_UP } = require('./constants')

function findSerialNumber (service) {
  return service.txt ? (
    service.txt.serialnumber ||
    service.txt.Serialnumber ||
    service.txt.serialNumber ||
    service.txt.SerialNumber ||
    service.txt.Serial ||
    service.txt.serial ||
    service.txt.SN ||
    service.txt.sn ||
    service.txt.UUID ||
    service.txt.uuid ||
    service.txt.deviceid ||
    service.txt.deviceId ||
    service.txt.deviceID ||
    service.txt.Deviceid ||
    service.txt.DeviceId ||
    service.txt.DeviceID || ''
  ) : ''
}

function defaultComparator (service, searchKey, searchValue) {
  switch (searchKey) {
    case 'addresses':
    case 'subtypes':
      return service[searchKey].indexOf(searchValue) >= 0
    case 'devicetype':
      return (service.txt && (service.txt.devicetype || service.txt.DeviceType) === searchValue)
    case 'serialnumber':
      return findSerialNumber(service).toLowerCase() === searchValue.toLowerCase()
    case 'workgroup':
      return (service.txt && (service.txt.workgroup || service.txt.Workgroup) === searchValue)
    case 'name':
    case 'fqdn':
    case 'host':
    case 'type':
    case 'protocol':
    case 'status':
      return service[searchKey].toLowerCase() === searchValue.toLowerCase()
    case 'port':
      return service.port === searchValue
    default:
      return false
  }
}

function findServiceHelper (serviceMap = {}, matches = {}, comparator = defaultComparator) {
  const services = []

  /* Default returns online service only */
  if (matches.status === undefined) {
    matches.status = STATUS_UP
  }

  Object.keys(serviceMap).forEach((addr) => {
    serviceMap[addr].forEach((srv) => {
      if (Object.keys(matches).length === 0) {
        services.push(srv)
      } else {
        const found = Object.keys(matches)
          .map(key => comparator(srv, key, matches[key]))
          .reduce((prev, curr) => prev && curr)
        if (found) {
          services.push(srv)
        }
      }
    })
  })

  return services
}

exports.findSerialNumber = findSerialNumber
exports.defaultComparator = defaultComparator
exports.findServiceHelper = findServiceHelper
