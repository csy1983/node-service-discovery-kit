!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t(require("autobind-decorator"),require("events"),require("ip"),require("babel-polyfill"),require("bonjour"),require("mqtt"));else if("function"==typeof define&&define.amd)define(["autobind-decorator","events","ip","babel-polyfill","bonjour","mqtt"],t);else{var r="object"==typeof exports?t(require("autobind-decorator"),require("events"),require("ip"),require("babel-polyfill"),require("bonjour"),require("mqtt")):t(e["autobind-decorator"],e.events,e.ip,e["babel-polyfill"],e.bonjour,e.mqtt);for(var n in r)("object"==typeof exports?exports:e)[n]=r[n]}}(this,function(e,t,r,n,o,i){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=13)}([function(e,t,r){"use strict";function n(e){return e.txt?e.txt.serialnumber||e.txt.Serialnumber||e.txt.serialNumber||e.txt.SerialNumber||e.txt.Serial||e.txt.serial||e.txt.SN||e.txt.sn||e.txt.UUID||e.txt.uuid||e.txt.deviceid||e.txt.deviceId||e.txt.deviceID||e.txt.Deviceid||e.txt.DeviceId||e.txt.DeviceID:null}function o(e,t,r){switch(t){case"Name":return e.name===r;case"Address":return e.addresses.indexOf(r)>=0;case"Host":return e.host===r;case"DeviceType":return e.txt&&(e.txt.devicetype||e.txt.DeviceType)===r;case"SerialNumber":return n(e)===r;default:return!1}}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:o,n=[];return Object.keys(e).forEach(function(o){e[o].forEach(function(e){if(0===Object.keys(t).length)n.push(e);else{Object.keys(t).map(function(n){return r(e,n,t[n])}).reduce(function(e,t){return e&&t})&&n.push(e)}})}),n}Object.defineProperty(t,"__esModule",{value:!0}),t.findSerialNumber=n,t.defaultComparator=o,t.findServiceHelper=i},function(e,t){e.exports=require("autobind-decorator")},function(e,t){e.exports=require("events")},function(e,t){e.exports=require("ip")},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){function n(o,i){try{var s=t[o](i),u=s.value}catch(e){return void r(e)}if(!s.done)return Promise.resolve(u).then(function(e){n("next",e)},function(e){n("throw",e)});e(u)}return n("next")})}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.MQTTSD=t.Bonjour=t.default=void 0;var s,u=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=r(1),c=n(a),f=r(10),p=n(f),l=r(9),d=n(l),v=r(6),h=n(v),b=r(8),y=n(b),m=r(7),g=n(m),j=r(0),q=(0,c.default)(s=function(){function e(){i(this,e),this.delegate=new p.default,this.datasource=new d.default,this.children=[],this.dummy=new g.default}return u(e,[{key:"setDelegate",value:function(e){var t=this;Object.getOwnPropertyNames(Object.getPrototypeOf(this.delegate)).filter(function(e){return"constructor"!==e}).forEach(function(r){e[r]&&(t.delegate[r]=e[r])})}},{key:"setDataSource",value:function(e){var t=this;Object.getOwnPropertyNames(Object.getPrototypeOf(this.datasource)).filter(function(e){return"constructor"!==e}).forEach(function(r){e[r]&&(t.datasource[r]=e[r])})}},{key:"start",value:function(){function e(){return t.apply(this,arguments)}var t=o(regeneratorRuntime.mark(function e(){var t,r,n,o,i=this;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.delegate.serviceDiscoveryWillStart();case 2:return t=this.datasource.serviceDiscoveryConfigs(),r=this.datasource.serviceDiscoveryProps(),r.txt?r.txt.path||(r.txt.path="/"):r.txt={path:"/"},t.bonjour?this.bonjour=new h.default({browse:!0}):this.bonjour=this.dummy,this.bonjour.on("event",function(e){i.delegate.serviceDiscoveryDidReceiveEvent&&i.delegate.serviceDiscoveryDidReceiveEvent("bonjour",e.action,e.data)}),t.mqttsd?this.mqttsd=new y.default({browse:!0,brokerURL:t.mqttsd.brokerURL,options:t.mqttsd.options}):this.mqttsd=this.dummy,this.mqttsd.on("event",function(e){i.delegate.serviceDiscoveryDidReceiveEvent&&i.delegate.serviceDiscoveryDidReceiveEvent("mqttsd",e.action,e.data)}),this.bonjour.setProps(r),this.mqttsd.setProps(r),e.next=13,this.bonjour.start();case 13:return n=e.sent,e.next=16,this.mqttsd.start();case 16:return o=e.sent,e.next=19,this.delegate.serviceDiscoveryDidStart();case 19:return e.abrupt("return",{bonjour:n,mqttsd:o});case 20:case"end":return e.stop()}},e,this)}));return e}()},{key:"updateServiceProps",value:function(){var e=this.datasource.serviceDiscoveryProps();e.txt?e.txt.path||(e.txt.path="/"):e.txt={path:"/"},this.bonjour.updateProps(e),this.mqttsd.updateProps(e),this.publishService()}},{key:"publishService",value:function(){this.bonjour.publish(),this.mqttsd.publish(),this.children.forEach(function(e){e.stop(e.start)})}},{key:"findService",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=this.bonjour.findService(t),n=this.mqttsd.findService(t);return r.filter(function(r){return 0===n.length||!e.mqttsd.findService(Object.assign(t,{SerialNumber:(0,j.findSerialNumber)(r)}))}).concat(n)}},{key:"createChildService",value:function(e){var t=this.datasource.serviceDiscoveryProps(),r=t.name,n=t.port,i=t.type,s=void 0===i?"default":i,u=t.txt,a=void 0===u?{}:u,c=a.path||"",f=a.serialnumber||r+":"+n+"._"+s,p=this.datasource.serviceDiscoveryConfigs(),l={name:e.name||"Child service of "+r,port:e.port||n,type:e.type||s,txt:Object.assign({},e.txt,{path:(c+"/"+f).replace(/\/\//g,"/")})},d=p.bonjour?new h.default:this.dummy;d.setProps(l);var v=p.mqttsd?new y.default(p.mqttsd):this.dummy;v.setProps(l);var b={start:function(){var e=this;return o(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d.start();case 2:return e.next=4,v.start();case 4:case"end":return e.stop()}},t,e)}))()},stop:function(){var e=this;return o(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d.stop();case 2:return e.next=4,v.stop();case 4:case"end":return e.stop()}},t,e)}))()}};return this.children.push(b),b}},{key:"stop",value:function(){function e(){return t.apply(this,arguments)}var t=o(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.delegate.serviceDiscoveryWillStop();case 2:return e.next=4,Promise.all(this.children.map(function(e){return e.stop()}));case 4:return e.next=6,this.bonjour.stop();case 6:return e.next=8,this.mqttsd.stop();case 8:return delete this.bonjour,delete this.mqttsd,e.next=12,this.delegate.serviceDiscoveryDidStop();case 12:case"end":return e.stop()}},e,this)}));return e}()}]),e}())||s;t.default=q,t.Bonjour=h.default,t.MQTTSD=y.default},function(e,t){e.exports=require("babel-polyfill")},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var u,a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),c=r(2),f=n(c),p=r(1),l=n(p),d=r(11),v=n(d),h=r(3),b=n(h),y=r(0),m=(0,l.default)(u=function(e){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.bonjour=(0,v.default)(),r.configs=e,r.props={},r.serviceMap={},r}return s(t,e),a(t,[{key:"start",value:function(){var e=this;return new Promise(function(t){e.configs.browse&&e.browse(),e.publish(),t()})}},{key:"stop",value:function(){var e=this;return new Promise(function(t){e.bonjour.unpublishAll(function(){e.bonjour.destroy(),t()})})}},{key:"browse",value:function(){var e=this;this.bonjour.find({type:this.props.type}).on("up",function(t){var r=e.findAddresses(t);r&&(t.addresses=r,e.serviceMap[r[0]]=(e.serviceMap[r[0]]||[]).filter(function(e){return e.fqdn!==t.fqdn}),e.serviceMap[r[0]].push(t),e.emit("event",{action:"up",data:t}))}).on("down",function(t){var r=e.findAddresses(t);r&&(e.serviceMap[r[0]]=(e.serviceMap[r[0]]||[]).filter(function(e){return e.fqdn!==t.fqdn}),e.emit("event",{action:"down",data:t}))})}},{key:"publish",value:function(){var e=this;this.bonjourService&&this.bonjourService.published?this.bonjourService.stop(function(){e.bonjourService=e.bonjour.publish(e.props)}):this.props.name&&this.props.port&&this.props.type&&(this.bonjourService=this.bonjour.publish(this.props))}},{key:"setProps",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object.assign(this.props,e)}},{key:"updateProps",value:function(e){Object.assign(this.props,e)}},{key:"findAddresses",value:function(e){var t=e.addresses.filter(function(e){return b.default.isV4Format(e)});return 0===t.length?e.referer&&e.referer.address?[e.referer.address]:null:t}},{key:"findService",value:function(e,t){return(0,y.findServiceHelper)(this.serviceMap,e,t)}}]),t}(f.default))||u;t.default=m},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),u=r(2),a=function(e){return e&&e.__esModule?e:{default:e}}(u),c=function(e){function t(){return n(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),s(t,[{key:"start",value:function(){}},{key:"stop",value:function(){}},{key:"publish",value:function(){}},{key:"setProps",value:function(){arguments.length>0&&void 0!==arguments[0]&&arguments[0]}},{key:"updateProps",value:function(e){}},{key:"findService",value:function(e,t){return[]}}]),t}(a.default);t.default=c},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var u,a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),c=r(2),f=n(c),p=r(1),l=n(p),d=r(3),v=n(d),h=r(12),b=n(h),y=r(0),m={qos:1},g=(0,l.default)(u=function(e){function t(e){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.configs=e||{},r.props={protocol:"tcp",subtypes:[]},r.prevProps={},r.serviceMap={},r}return s(t,e),a(t,[{key:"start",value:function(){var e=this;return new Promise(function(t){if(!e.configs.brokerURL)return t();e.mqtt=b.default.connect("mqtt://"+e.configs.brokerURL,e.configs.options),e.mqtt.on("connect",function(){e.browse(),e.mqtt.subscribe("mqttsd-query",m,function(){e.configs.browse?e.mqtt.subscribe("mqttsd",m,function(){e.publish({queryId:e.mqtt.options.clientId}),t()}):(e.publish(),t())})}),e.mqtt.on("error",function(e){t({status:"error",error:e})}),e.mqtt.on("reconnect",function(){t({status:"reconnect"})})})}},{key:"stop",value:function(){var e=this;return new Promise(function(t){if(!e.configs.brokerURL)return t();if(e.mqtt.connected){var r=setTimeout(t,5e3);e.mqtt.publish("mqttsd",JSON.stringify(Object.assign(e.props,{addresses:[e.address],status:"down"})),m,function(){clearTimeout(r),e.mqtt.end(),t()})}else e.mqtt.end(),t()})}},{key:"browse",value:function(){var e=this;this.configs.brokerURL&&this.mqtt.on("message",function(t,r){if("mqttsd-query"===t){var n=JSON.parse(r.toString());n&&n.queryId!==e.mqtt.options.clientId&&(clearTimeout(e.responseQueryTimer),e.responseQueryTimer=setTimeout(function(){e.publish()},5e3))}else if(e.configs.browse&&"mqttsd"===t){var o=JSON.parse(r.toString()),i=o.addresses[0];if(!i||!o.txt)return;"up"===o.status?(e.serviceMap[i]=(e.serviceMap[i]||[]).filter(function(e){return e.txt.serialnumber!==o.txt.serialnumber}),e.serviceMap[i].push(o),e.emit("event",{action:"up",data:o})):"down"===o.status&&(e.serviceMap[i]=(e.serviceMap[i]||[]).filter(function(e){return e.txt.serialnumber!==o.txt.serialnumber}),e.emit("event",{action:"down",data:o}))}})}},{key:"publish",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t.queryId&&this.mqtt.publish("mqttsd-query",'{"queryId":"'+t.queryId+'"}',m),this.props.name&&this.props.port&&this.props.type&&(this.address?this.mqtt.publish("mqttsd",JSON.stringify(Object.assign(this.prevProps,{addresses:[this.address],status:"down"})),m,function(){e.address=v.default.address(),e.mqtt.publish("mqttsd",JSON.stringify(Object.assign(e.props,{addresses:[e.address],fqdn:e.props.name+"._"+e.props.type+"._"+(e.props.protocol||"tcp")+".local",status:"up"})),m)}):(this.address=v.default.address(),this.mqtt.publish("mqttsd",JSON.stringify(Object.assign(this.props,{addresses:[this.address],fqdn:this.props.name+"._"+this.props.type+"._"+(this.props.protocol||"tcp")+".local",status:"up"})),m)))}},{key:"setProps",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object.assign(this.props,e)}},{key:"updateProps",value:function(e){this.prevProps=Object.assign({},this.props),Object.assign(this.props,e)}},{key:"findService",value:function(e,t){return(0,y.findServiceHelper)(this.serviceMap,e,t)}}]),t}(f.default))||u;t.default=g},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=function(){function e(){n(this,e)}return o(e,[{key:"serviceDiscoveryConfigs",value:function(){return{}}},{key:"serviceDiscoveryProps",value:function(){return{}}}]),e}();t.default=i},function(e,t,r){"use strict";function n(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){function n(o,i){try{var s=t[o](i),u=s.value}catch(e){return void r(e)}if(!s.done)return Promise.resolve(u).then(function(e){n("next",e)},function(e){n("throw",e)});e(u)}return n("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),s=function(){function e(){o(this,e)}return i(e,[{key:"serviceDiscoveryWillStart",value:function(){function e(){return t.apply(this,arguments)}var t=n(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e,this)}));return e}()},{key:"serviceDiscoveryDidStart",value:function(){function e(){return t.apply(this,arguments)}var t=n(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e,this)}));return e}()},{key:"serviceDiscoveryDidReceiveEvent",value:function(e,t,r){}},{key:"serviceDiscoveryWillStop",value:function(){function e(){return t.apply(this,arguments)}var t=n(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e,this)}));return e}()},{key:"serviceDiscoveryDidStop",value:function(){function e(){return t.apply(this,arguments)}var t=n(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e,this)}));return e}()}]),e}();t.default=s},function(e,t){e.exports=require("bonjour")},function(e,t){e.exports=require("mqtt")},function(e,t,r){r(5),e.exports=r(4)}])});