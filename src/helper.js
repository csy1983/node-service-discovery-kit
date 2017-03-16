export function findSerialNumber(service) {
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
    service.txt.DeviceID
  ) : null;
}

export function defaultComparator(service, searchKey, searchValue) {
  switch (searchKey) {
    case 'Name':
      return service.name === searchValue;
    case 'Address':
      return service.addresses.indexOf(searchValue) >= 0;
    case 'Host':
      return service.host === searchValue;
    case 'DeviceType':
      return (service.txt && (service.txt.devicetype || service.txt.DeviceType) === searchValue);
    case 'SerialNumber':
      return findSerialNumber(service) === searchValue;
    default:
      return false;
  }
}

export function findServiceHelper(serviceMap = {}, matches = {}, comparator = defaultComparator) {
  const services = [];

  Object.keys(serviceMap).forEach((addr) => {
    serviceMap[addr].forEach((srv) => {
      if (Object.keys(matches).length === 0) {
        services.push(srv);
      } else {
        const found = Object.keys(matches)
          .map(key => comparator(srv, key, matches[key]))
          .reduce((prev, curr) => prev && curr);
        if (found) {
          services.push(srv);
        }
      }
    });
  });

  return services;
}
