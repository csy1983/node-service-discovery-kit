!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("autobind-decorator"),require("events"),require("ip"),require("babel-polyfill"),require("bonjour"),require("default-gateway"),require("mqtt"),require("os"));else if("function"==typeof define&&define.amd)define(["autobind-decorator","events","ip","babel-polyfill","bonjour","default-gateway","mqtt","os"],t);else{var r="object"==typeof exports?t(require("autobind-decorator"),require("events"),require("ip"),require("babel-polyfill"),require("bonjour"),require("default-gateway"),require("mqtt"),require("os")):t(e["autobind-decorator"],e.events,e.ip,e["babel-polyfill"],e.bonjour,e["default-gateway"],e.mqtt,e.os);for(var n in r)("object"==typeof exports?exports:e)[n]=r[n]}}(this,function(e,t,r,n,o,i,s,u){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=16)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.STATUS_UP="up",t.STATUS_DOWN="down"},function(e,t){e.exports=require("autobind-decorator")},function(e,t){e.exports=require("events")},function(e,t){e.exports=require("ip")},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){return e.txt?e.txt.serialnumber||e.txt.Serialnumber||e.txt.serialNumber||e.txt.SerialNumber||e.txt.Serial||e.txt.serial||e.txt.SN||e.txt.sn||e.txt.UUID||e.txt.uuid||e.txt.deviceid||e.txt.deviceId||e.txt.deviceID||e.txt.Deviceid||e.txt.DeviceId||e.txt.DeviceID||"":""}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];return e.filter(function(e){return e.type!==t.type&&e.port!==t.port})}function s(e,t,r){switch(t){case"addresses":case"subtypes":return e[t].indexOf(r)>=0;case"devicetype":return e.txt&&(e.txt.devicetype||e.txt.DeviceType)===r;case"serialnumber":return o(e).toLowerCase()===r.toLowerCase();case"workgroup":return e.txt&&(e.txt.workgroup||e.txt.Workgroup)===r;case"name":case"fqdn":case"host":case"type":case"protocol":case"port":default:return e[t]===r}}function u(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:s,n=[];return void 0===t.status&&(t.status=b.STATUS_UP),Object.keys(e).forEach(function(o){e[o].forEach(function(e){var o=JSON.parse(JSON.stringify(e));if(0===Object.keys(t).length)n.push(o);else{Object.keys(t).map(function(e){return t.status.toLowerCase()===o.status.toLowerCase()&&r(o,e,t[e])}).reduce(function(e,t){return e&&t})&&n.push(o)}})}),n}function a(){var e=p.default.networkInterfaces();try{var t=function(){var t=d.default.v4.sync().gateway;for(var r in e){var n=e[r].filter(function(e){return"IPv4"===e.family}).find(function(e){var r=e.address,n=e.netmask;return h.default.subnet(r,n).contains(t)});if(n)return{v:{address:n.address,netmask:n.netmask}}}return{v:{address:h.default.address(),netmask:h.default.fromPrefixLen(24)}}}();if("object"===(void 0===t?"undefined":c(t)))return t.v}catch(e){var r=h.default.address(),n=h.default.fromPrefixLen(24);return console.log("[ServiceDiscovery] "+e.message+". Roll back to "+r),{address:r,netmask:n}}}Object.defineProperty(t,"__esModule",{value:!0});var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.findSerialNumber=o,t.filterService=i,t.defaultComparator=s,t.findServiceHelper=u,t.networkInterface=a;var f=r(15),p=n(f),l=r(13),d=n(l),v=r(3),h=n(v),b=r(0)},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){function n(o,i){try{var s=t[o](i),u=s.value}catch(e){return void r(e)}if(!s.done)return Promise.resolve(u).then(function(e){n("next",e)},function(e){n("throw",e)});e(u)}return n("next")})}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.MQTTSD=t.Bonjour=t.default=void 0;var s,u,a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),c=r(1),f=n(c),p=r(11),l=n(p),d=r(10),v=n(d),h=r(7),b=n(h),y=r(9),m=n(y),w=r(8),g=n(w),k=(0,f.default)(s=function(){function e(t,r,n){i(this,e);var o=n.name,s=n.port,u=n.type,a=void 0===u?"default":u,c=n.protocol,f=n.subtypes,p=void 0===f?[]:f,l=n.txt,d=void 0===l?{}:l,v=d.path||"",h=d[t.idSelector||"serialnumber"]||o+":"+s+"._"+a;this.dummy=new g.default,this.status="",this.configs=t,this.props={name:r.name||"Child service of "+o,port:r.port||s,type:r.type||a,protocol:r.protocol||c,subtypes:r.subtypes||p,txt:Object.assign({},r.txt,{path:(v+"/"+h).replace(/\/\//g,"/")})},this.bonjourChild=t.bonjour?new b.default:this.dummy,this.bonjourChild.setProps(this.props),this.mqttsdChild=t.mqttsd?new m.default(t.mqttsd):this.dummy,this.mqttsdChild.setProps(this.props)}return a(e,[{key:"start",value:function(){function e(){return t.apply(this,arguments)}var t=o(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("running"===this.status){e.next=6;break}return e.next=3,this.bonjourChild.start();case 3:return e.next=5,this.mqttsdChild.start();case 5:this.status="running";case 6:return e.next=8,this.status;case 8:case"end":return e.stop()}},e,this)}));return e}()},{key:"stop",value:function(){function e(){return t.apply(this,arguments)}var t=o(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("stopped"===this.status){e.next=6;break}return e.next=3,this.bonjourChild.stop();case 3:return e.next=5,this.mqttsdChild.stop();case 5:this.status="stopped";case 6:return e.next=8,this.status;case 8:case"end":return e.stop()}},e,this)}));return e}()}]),e}())||s,q=(0,f.default)(u=function(){function e(){i(this,e),this.delegate=new l.default,this.datasource=new v.default,this.children=[],this.dummy=new g.default}return a(e,[{key:"setDelegate",value:function(e){var t=this;Object.getOwnPropertyNames(Object.getPrototypeOf(this.delegate)).filter(function(e){return"constructor"!==e}).forEach(function(r){e[r]&&(t.delegate[r]=e[r])})}},{key:"setDataSource",value:function(e){var t=this;Object.getOwnPropertyNames(Object.getPrototypeOf(this.datasource)).filter(function(e){return"constructor"!==e}).forEach(function(r){e[r]&&(t.datasource[r]=e[r])})}},{key:"start",value:function(){function e(){return t.apply(this,arguments)}var t=o(regeneratorRuntime.mark(function e(){var t,r,n=this,o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(o.updateNetwork){e.next=3;break}return e.next=3,this.delegate.serviceDiscoveryWillStart();case 3:return t=this.datasource.serviceDiscoveryConfigs(),r=this.datasource.serviceDiscoveryProps(),r.txt?r.txt.path||(r.txt.path="/"):r.txt={path:"/"},t.bonjour?this.bonjour=new b.default({browse:!0,idSelector:t.idSelector}):this.bonjour=this.dummy,this.bonjour.on("event",function(e){n.delegate.serviceDiscoveryDidReceiveEvent&&n.delegate.serviceDiscoveryDidReceiveEvent("bonjour",e.action,e.data)}),t.mqttsd?this.mqttsd=new m.default({browse:t.mqttsd.browse,brokerURL:t.mqttsd.brokerURL,options:t.mqttsd.options,idSelector:t.idSelector}):this.mqttsd=this.dummy,this.mqttsd.on("event",function(e){n.delegate.serviceDiscoveryDidReceiveEvent&&n.delegate.serviceDiscoveryDidReceiveEvent("mqttsd",e.action,e.data)}),this.bonjour.setProps(r),this.mqttsd.setProps(r),e.next=14,this.bonjour.start();case 14:return e.next=16,this.mqttsd.start();case 16:if(o.updateNetwork){e.next=19;break}return e.next=19,this.delegate.serviceDiscoveryDidStart();case 19:case"end":return e.stop()}},e,this)}));return e}()},{key:"stop",value:function(){function e(){return t.apply(this,arguments)}var t=o(regeneratorRuntime.mark(function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t.updateNetwork){e.next=3;break}return e.next=3,this.delegate.serviceDiscoveryWillStop();case 3:return e.next=5,Promise.all(this.children.map(function(e){return e.stop()}));case 5:return e.next=7,this.bonjour.stop();case 7:return e.next=9,this.mqttsd.stop();case 9:if(delete this.bonjour,delete this.mqttsd,t.updateNetwork){e.next=14;break}return e.next=14,this.delegate.serviceDiscoveryDidStop();case 14:case"end":return e.stop()}},e,this)}));return e}()},{key:"updateServiceProps",value:function(){function e(){return t.apply(this,arguments)}var t=o(regeneratorRuntime.mark(function e(){var t,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=this.datasource.serviceDiscoveryProps(),t.txt?t.txt.path||(t.txt.path="/"):t.txt={path:"/"},!r.updateNetwork){e.next=9;break}return e.next=5,this.stop(r);case 5:return e.next=7,this.start(r);case 7:e.next=12;break;case 9:this.bonjour.updateProps(t),this.mqttsd.updateProps(t),this.publishService({propsUpdated:!0});case 12:case"end":return e.stop()}},e,this)}));return e}()},{key:"publishService",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.bonjour.publish(e),this.mqttsd.publish(e),this.children.forEach(function(e){e.stop().then(function(){return e.start()})})}},{key:"findService",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments[1],n=this.bonjour.findService(t,r),o=this.mqttsd.findService(t,r),i=[];return n.forEach(function(r){var n=e.mqttsd.findService(Object.assign({fqdn:r.fqdn,port:r.port},t));if(n.length>0){for(var o=0;o<n.length;o++)if(r.timestamp>n[o].timestamp){i.push(r);break}}else i.push(r)}),o.forEach(function(r){var n=e.bonjour.findService(Object.assign({fqdn:r.fqdn,port:r.port},t));if(n.length>0){for(var o=0;o<n.length;o++)if(r.timestamp>n[o].timestamp){i.push(r);break}}else i.push(r)}),i}},{key:"createChildService",value:function(e){var t=this.datasource.serviceDiscoveryConfigs(),r=this.datasource.serviceDiscoveryProps(),n=new k(t,e,r);return this.children.push(n),n}}]),e}())||u;t.default=q,t.Bonjour=b.default,t.MQTTSD=m.default},function(e,t){e.exports=require("babel-polyfill")},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var u,a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),c=r(2),f=n(c),p=r(1),l=n(p),d=r(12),v=n(d),h=r(3),b=n(h),y=r(0),m=r(4),w=(0,l.default)(u=function(e){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.configs=e,r.props={},r.serviceMap={},r}return s(t,e),a(t,[{key:"start",value:function(){var e=this;return new Promise(function(t){e.networkInterface=(0,m.networkInterface)(),e.bonjour=(0,v.default)("win32"===process.platform?{interface:e.networkInterface.address}:{}),e.configs.browse&&e.browse(),e.publish(),t()})}},{key:"stop",value:function(){var e=this;return new Promise(function(t){e.bonjour.unpublishAll(function(){setTimeout(function(){e.bonjour.destroy(),t()},3e3)})})}},{key:"browse",value:function(){var e=this;return this.bonjour.find({type:this.props.type}).on("up",function(t){var r=e.findAddresses(t);r&&(t.addresses=r,t.status=y.STATUS_UP,t.timestamp=Date.now(),e.serviceMap[r[0]]=(0,m.filterService)(e.serviceMap[r[0]]),e.serviceMap[r[0]].push(t),e.emit("event",{action:y.STATUS_UP,data:t}))}).on("down",function(t){var r=e.findAddresses(t);r&&(t.status=y.STATUS_DOWN,t.timestamp=Date.now(),e.serviceMap[r[0]]=(0,m.filterService)(e.serviceMap[r[0]]),e.serviceMap[r[0]].push(t),e.emit("event",{action:y.STATUS_DOWN,data:t}))})}},{key:"publish",value:function(){var e=this;arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.bonjourService&&this.bonjourService.published?this.bonjourService.stop(function(){e.bonjourService=e.bonjour.publish(e.props)}):this.props.name&&this.props.port&&this.props.type&&(this.bonjourService=this.bonjour.publish(this.props))}},{key:"setProps",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object.assign(this.props,e)}},{key:"updateProps",value:function(e){this.networkInterface=(0,m.networkInterface)(),Object.assign(this.props,e)}},{key:"findAddresses",value:function(e){var t=this.networkInterface,r=t.address,n=t.netmask,o=b.default.subnet(r,n),i=e.addresses.filter(function(e){return b.default.isV4Format(e)}).sort(function(e,t){return+o.contains(e)<+o.contains(t)});return 0===i.length?e.referer&&e.referer.address?[e.referer.address]:null:i}},{key:"findService",value:function(e,t){return(0,m.findServiceHelper)(this.serviceMap,e,t)}}]),t}(f.default))||u;t.default=w},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),u=r(2),a=function(e){return e&&e.__esModule?e:{default:e}}(u),c=function(e){function t(){return n(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),s(t,[{key:"start",value:function(){return new Promise(function(e){return e()})}},{key:"stop",value:function(){return new Promise(function(e){return e()})}},{key:"publish",value:function(){}},{key:"setProps",value:function(){arguments.length>0&&void 0!==arguments[0]&&arguments[0]}},{key:"updateProps",value:function(e){}},{key:"findService",value:function(e,t){return[]}}]),t}(a.default);t.default=c},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var u,a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),c=r(2),f=n(c),p=r(1),l=n(p),d=r(14),v=n(d),h=r(3),b=n(h),y=r(0),m=r(4),w={qos:1},g=(0,l.default)(u=function(e){function t(e){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.status="offline",r.configs=e||{},r.props={protocol:"tcp",subtypes:[]},r.prevProps={},r.serviceMap={},r}return s(t,e),a(t,[{key:"start",value:function(){var e=this;return new Promise(function(t){if(!e.configs.brokerURL)return t();e.networkInterface=(0,m.networkInterface)(),e.mqtt=v.default.connect("mqtt://"+e.configs.brokerURL,e.configs.options),e.browse(),e.mqtt.on("connect",function(){e.status="connect",e.mqtt.subscribe("mqttsd-query",w,function(){e.configs.browse?e.mqtt.subscribe("mqttsd",w,function(){e.publish({queryId:e.mqtt.options.clientId})}):e.publish()})}),e.mqtt.on("error",function(t){e.status="error"}),e.mqtt.on("reconnect",function(){e.status="reconnect"}),e.mqtt.on("close",function(){}),e.mqtt.on("offline",function(){e.status="offline",e.mqtt.unsubscribe(["mqttsd-query","mqttsd"])}),t()})}},{key:"stop",value:function(){var e=this;return new Promise(function(t){if(!e.configs.brokerURL)return t();if(e.mqtt.connected){var r=setTimeout(t,5e3);e.mqtt.publish("mqttsd",JSON.stringify(Object.assign(e.props,{addresses:[e.networkInterface.address],status:y.STATUS_DOWN})),w,function(){clearTimeout(r),e.mqtt.end(),t()})}else e.mqtt.end(),t()})}},{key:"browse",value:function(){var e=this;this.configs.brokerURL&&this.mqtt.on("message",function(t,r){if("mqttsd-query"===t){var n=JSON.parse(r.toString());n&&n.queryId!==e.mqtt.options.clientId&&(clearTimeout(e.responseQueryTimer),e.responseQueryTimer=setTimeout(function(){e.publish()},5e3))}else if(e.configs.browse&&"mqttsd"===t){var o=JSON.parse(r.toString());if(0===o.addresses.length)return;var i=e.networkInterface,s=i.address,u=i.netmask,a=b.default.subnet(s,u),c=o.addresses.sort(function(e,t){return+a.contains(e)<+a.contains(t)})[0];o.timestamp=Date.now(),o.status===y.STATUS_UP?(e.serviceMap[c]=(0,m.filterService)(e.serviceMap[c]),e.serviceMap[c].push(o),e.emit("event",{action:y.STATUS_UP,data:o})):o.status===y.STATUS_DOWN&&(e.serviceMap[c]=(0,m.filterService)(e.serviceMap[c]),e.serviceMap[c].push(o),e.emit("event",{action:y.STATUS_DOWN,data:o}))}})}},{key:"publish",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t.queryId&&this.mqtt.publish("mqttsd-query",'{"queryId":"'+t.queryId+'"}',w),this.props.name&&this.props.port&&this.props.type&&(t.propsUpdated?this.mqtt.publish("mqttsd",JSON.stringify(Object.assign(this.prevProps,{addresses:[this.prevNetworkInterface.address],status:y.STATUS_DOWN})),w,function(){e.mqtt.publish("mqttsd",JSON.stringify(Object.assign(e.props,{addresses:[e.networkInterface.address],fqdn:e.props.name+"._"+e.props.type+"._"+(e.props.protocol||"tcp")+".local",status:y.STATUS_UP})),w)}):this.mqtt.publish("mqttsd",JSON.stringify(Object.assign(this.props,{addresses:[this.networkInterface.address],fqdn:this.props.name+"._"+this.props.type+"._"+(this.props.protocol||"tcp")+".local",status:y.STATUS_UP})),w))}},{key:"setProps",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object.assign(this.props,e)}},{key:"updateProps",value:function(e){this.prevNetworkInterface=this.networkInterface,this.networkInterface=(0,m.networkInterface)(),this.prevProps=Object.assign({},this.props),Object.assign(this.props,e)}},{key:"findService",value:function(e,t){return(0,m.findServiceHelper)(this.serviceMap,e,t)}}]),t}(f.default))||u;t.default=g},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=function(){function e(){n(this,e)}return o(e,[{key:"serviceDiscoveryConfigs",value:function(){return{}}},{key:"serviceDiscoveryProps",value:function(){return{}}}]),e}();t.default=i},function(e,t,r){"use strict";function n(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){function n(o,i){try{var s=t[o](i),u=s.value}catch(e){return void r(e)}if(!s.done)return Promise.resolve(u).then(function(e){n("next",e)},function(e){n("throw",e)});e(u)}return n("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),s=function(){function e(){o(this,e)}return i(e,[{key:"serviceDiscoveryWillStart",value:function(){function e(){return t.apply(this,arguments)}var t=n(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e,this)}));return e}()},{key:"serviceDiscoveryDidStart",value:function(){function e(){return t.apply(this,arguments)}var t=n(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e,this)}));return e}()},{key:"serviceDiscoveryDidReceiveEvent",value:function(e,t,r){}},{key:"serviceDiscoveryWillStop",value:function(){function e(){return t.apply(this,arguments)}var t=n(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e,this)}));return e}()},{key:"serviceDiscoveryDidStop",value:function(){function e(){return t.apply(this,arguments)}var t=n(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e,this)}));return e}()}]),e}();t.default=s},function(e,t){e.exports=require("bonjour")},function(e,t){e.exports=require("default-gateway")},function(e,t){e.exports=require("mqtt")},function(e,t){e.exports=require("os")},function(e,t,r){r(6),e.exports=r(5)}])});