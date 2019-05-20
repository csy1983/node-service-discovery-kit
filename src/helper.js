import os from 'os';
import defaultGateway from 'default-gateway';
import ip from 'ip';
import { STATUS_UP } from './constants';

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
    service.txt.DeviceID || ''
  ) : '';
}

export function filterService(services = [], service) {
  return services.filter((srv) => {
    return (srv.type !== service.type && srv.port !== service.port);
  })
}

export function defaultComparator(service, searchKey, searchValue) {
  switch (searchKey) {
    case 'addresses':
    case 'subtypes':
      return service[searchKey].indexOf(searchValue) >= 0;
    case 'devicetype':
      return (service.txt && (service.txt.devicetype || service.txt.DeviceType) === searchValue);
    case 'serialnumber':
      return findSerialNumber(service).toLowerCase() === searchValue.toLowerCase();
    case 'workgroup':
      return (service.txt && (service.txt.workgroup || service.txt.Workgroup) === searchValue);
    case 'name':
    case 'fqdn':
    case 'host':
    case 'type':
    case 'protocol':
    case 'port':
    default:
      return service[searchKey] === searchValue;
  }
}

export function findServiceHelper(serviceMap = {}, matches = {}, comparator = defaultComparator) {
  const services = [];

  /* Default returns online service only */
  if (matches.status === undefined) {
    matches.status = STATUS_UP;
  }

  Object.keys(serviceMap).forEach((addr) => {
    serviceMap[addr].forEach((_srv) => {
      const srv = JSON.parse(JSON.stringify(_srv));
      if (Object.keys(matches).length === 0) {
        services.push(srv);
      } else {
        const found = Object.keys(matches)
          .map(key => (
            (matches.status.toLowerCase() === srv.status.toLowerCase()) &&
            comparator(srv, key, matches[key])
          ))
          .reduce((prev, curr) => prev && curr);
        if (found) {
          services.push(srv);
        }
      }
    });
  });

  return services;
}

export function networkInterface() {
  const ifaces = os.networkInterfaces();
  try {
    const gateway = defaultGateway.v4.sync().gateway;
    for (let iface in ifaces) {
      const found = ifaces[iface]
        .filter(iface => iface.family === 'IPv4')
        .find(({ address, netmask }) => ip.subnet(address, netmask).contains(gateway));
      if (found) {
        return {
          address: found.address,
          netmask: found.netmask,
        };
      }
    }
    return { address: ip.address(), netmask: ip.fromPrefixLen(24) };
  } catch (error) {
    const address = ip.address();
    const netmask = ip.fromPrefixLen(24);
    console.log(`[ServiceDiscovery] ${error.message}. Roll back to ${address}`);
    return { address, netmask };
  }
}
