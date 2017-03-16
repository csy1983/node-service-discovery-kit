(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("autobind-decorator"), require("events"), require("ip"), require("babel-polyfill"), require("bonjour"), require("mqtt"));
	else if(typeof define === 'function' && define.amd)
		define(["autobind-decorator", "events", "ip", "babel-polyfill", "bonjour", "mqtt"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("autobind-decorator"), require("events"), require("ip"), require("babel-polyfill"), require("bonjour"), require("mqtt")) : factory(root["autobind-decorator"], root["events"], root["ip"], root["babel-polyfill"], root["bonjour"], root["mqtt"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findSerialNumber = findSerialNumber;
exports.defaultComparator = defaultComparator;
exports.findServiceHelper = findServiceHelper;
function findSerialNumber(service) {
  return service.txt ? service.txt.serialnumber || service.txt.Serialnumber || service.txt.serialNumber || service.txt.SerialNumber || service.txt.Serial || service.txt.serial || service.txt.SN || service.txt.sn || service.txt.UUID || service.txt.uuid || service.txt.deviceid || service.txt.deviceId || service.txt.deviceID || service.txt.Deviceid || service.txt.DeviceId || service.txt.DeviceID : null;
}

function defaultComparator(service, searchKey, searchValue) {
  switch (searchKey) {
    case 'Name':
      return service.name === searchValue;
    case 'Address':
      return service.addresses.indexOf(searchValue) >= 0;
    case 'Host':
      return service.host === searchValue;
    case 'DeviceType':
      return service.txt && (service.txt.devicetype || service.txt.DeviceType) === searchValue;
    case 'SerialNumber':
      return findSerialNumber(service) === searchValue;
    default:
      return false;
  }
}

function findServiceHelper() {
  var serviceMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var matches = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var comparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultComparator;

  var services = [];

  Object.keys(serviceMap).forEach(function (addr) {
    serviceMap[addr].forEach(function (srv) {
      if (Object.keys(matches).length === 0) {
        services.push(srv);
      } else {
        var found = Object.keys(matches).map(function (key) {
          return comparator(srv, key, matches[key]);
        }).reduce(function (prev, curr) {
          return prev && curr;
        });
        if (found) {
          services.push(srv);
        }
      }
    });
  });

  return services;
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("autobind-decorator");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("ip");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class; /* eslint-disable no-empty-function, no-unused-vars */


var _autobindDecorator = __webpack_require__(1);

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _delegate = __webpack_require__(10);

var _delegate2 = _interopRequireDefault(_delegate);

var _datasource = __webpack_require__(9);

var _datasource2 = _interopRequireDefault(_datasource);

var _bonjour = __webpack_require__(6);

var _bonjour2 = _interopRequireDefault(_bonjour);

var _mqttsd = __webpack_require__(8);

var _mqttsd2 = _interopRequireDefault(_mqttsd);

var _dummy = __webpack_require__(7);

var _dummy2 = _interopRequireDefault(_dummy);

var _helper = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceDiscovery = (0, _autobindDecorator2.default)(_class = function () {
  function ServiceDiscovery() {
    _classCallCheck(this, ServiceDiscovery);

    this.delegate = new _delegate2.default();
    this.datasource = new _datasource2.default();
    this.children = [];
    this.dummy = new _dummy2.default();
  }

  _createClass(ServiceDiscovery, [{
    key: 'setDelegate',
    value: function setDelegate(delegate) {
      var _this = this;

      Object.getOwnPropertyNames(Object.getPrototypeOf(this.delegate)).filter(function (prop) {
        return prop !== 'constructor';
      }).forEach(function (prop) {
        if (delegate[prop]) _this.delegate[prop] = delegate[prop];
      });
    }
  }, {
    key: 'setDataSource',
    value: function setDataSource(datasource) {
      var _this2 = this;

      Object.getOwnPropertyNames(Object.getPrototypeOf(this.datasource)).filter(function (prop) {
        return prop !== 'constructor';
      }).forEach(function (prop) {
        if (datasource[prop]) _this2.datasource[prop] = datasource[prop];
      });
    }

    /**
     * Delegation method for delegator to initiate the service discovery delegation.
     *
     * @method start
     * @return {Promise} A promise of the result of the initiate process.
     */

  }, {
    key: 'start',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _this3 = this;

        var configs, bonjour, mqttsd;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                configs = this.datasource.serviceDiscoveryConfigs();


                if (configs.bonjour) {
                  this.bonjour = new _bonjour2.default({ browse: true });
                } else {
                  this.bonjour = this.dummy;
                }

                this.bonjour.on('event', function (event) {
                  if (_this3.delegate.serviceDiscoveryDidReceiveEvent) {
                    _this3.delegate.serviceDiscoveryDidReceiveEvent('bonjour', event.action, event.data);
                  }
                });

                if (configs.mqttsd) {
                  this.mqttsd = new _mqttsd2.default({
                    browse: true,
                    brokerURL: configs.mqttsd.brokerURL,
                    options: configs.mqttsd.options
                  });
                } else {
                  this.mqttsd = this.dummy;
                }

                this.mqttsd.on('event', function (event) {
                  if (_this3.delegate.serviceDiscoveryDidReceiveEvent) {
                    _this3.delegate.serviceDiscoveryDidReceiveEvent('mqttsd', event.action, event.data);
                  }
                });

                _context.next = 7;
                return this.delegate.serviceDiscoveryWillStart();

              case 7:
                this.bonjour.setProps(this.datasource.serviceDiscoveryProps());
                this.mqttsd.setProps(this.datasource.serviceDiscoveryProps());
                _context.next = 11;
                return this.bonjour.start();

              case 11:
                bonjour = _context.sent;
                _context.next = 14;
                return this.mqttsd.start();

              case 14:
                mqttsd = _context.sent;
                _context.next = 17;
                return this.delegate.serviceDiscoveryDidStart();

              case 17:
                return _context.abrupt('return', { bonjour: bonjour, mqttsd: mqttsd });

              case 18:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start() {
        return _ref.apply(this, arguments);
      }

      return start;
    }()

    /**
     * Delegation method for the delegator to update the service properties.
     * Property changes must be reflected in the return of serviceDiscoveryProps().
     * This method will also republish your service automatically, calling
     * publishService() after this method is unnecessary.
     *
     * @method updateServiceProps
     */

  }, {
    key: 'updateServiceProps',
    value: function updateServiceProps() {
      this.bonjour.updateProps(this.datasource.serviceDiscoveryProps());
      this.mqttsd.updateProps(this.datasource.serviceDiscoveryProps());
      this.publishService();
    }

    /**
     * Delegation method for the delegator to manually publish the service.
     *
     * @method publishService
     */

  }, {
    key: 'publishService',
    value: function publishService() {
      this.bonjour.publish();
      this.mqttsd.publish();
      this.children.forEach(function (child) {
        child.stop(child.start);
      });
    }

    /**
     * Delegation method for the delegator to find services from the service browser.
     *
     * @method findService
     * @param  {Object} matches Key-value matches to search in an the service object.
     * @return {Array}          All matched service objects in an array.
     */

  }, {
    key: 'findService',
    value: function findService() {
      var _this4 = this;

      var matches = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var bonjourServices = this.bonjour.findService(matches);
      var mqttsdServices = this.mqttsd.findService(matches);
      return bonjourServices.filter(function (srv) {
        if (mqttsdServices.length === 0) return true;
        return !_this4.mqttsd.findService(Object.assign(matches, {
          SerialNumber: (0, _helper.findSerialNumber)(srv)
        }));
      }).concat(mqttsdServices);
    }

    /**
     * Delegation method for the delegator to create a child service. A child service
     * can be recognized by its TXT record. A `path` property in TXT describes the
     * parent-child relationship between services.
     *
     * For ancestor service, its `path` property is always '/' (root path).
     * For child service, its `path` property contains parent's serial number and
     * even grandparent's, e.g., '/mother-serial-number', '/grandma-sn/mom-sn'.
     *
     * Delegator can initiate the child service by calling the start() method from
     * the returned child service object, and terminate it by stop().
     *
     * @method createChildService
     * @param  {Object} props Child service properties (refer to serviceDiscoveryProps()).
     * @return {Object}       Child service object with start() and stop() methods.
     */

  }, {
    key: 'createChildService',
    value: function createChildService(props) {
      var _datasource$serviceDi = this.datasource.serviceDiscoveryProps(),
          name = _datasource$serviceDi.name,
          txt = _datasource$serviceDi.txt,
          port = _datasource$serviceDi.port,
          type = _datasource$serviceDi.type;

      var configs = this.datasource.serviceDiscoveryConfigs();
      var childProps = {
        name: props.name || 'Child service of ' + name,
        port: props.port || port,
        type: props.type || type,
        txt: Object.assign({}, props.txt, { path: txt.path + txt.serialnumber })
      };

      var bonjourChild = configs.bonjour ? new _bonjour2.default() : this.dummy;
      bonjourChild.setProps(childProps);

      var mqttsdChild = configs.mqttsd ? new _mqttsd2.default(configs.mqttsd) : this.dummy;
      mqttsdChild.setProps(childProps);

      var child = {
        start: function start() {
          var _this5 = this;

          return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return bonjourChild.start();

                  case 2:
                    _context2.next = 4;
                    return mqttsdChild.start();

                  case 4:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this5);
          }))();
        },
        stop: function stop() {
          var _this6 = this;

          return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return bonjourChild.stop();

                  case 2:
                    _context3.next = 4;
                    return mqttsdChild.stop();

                  case 4:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, _this6);
          }))();
        }
      };

      this.children.push(child);

      return child;
    }

    /**
     * Delegation method for the delegator to terminate the service discovery delegation.
     *
     * @method stop
     * @return {Promise} A promise of the result of the terminate process.
     */

  }, {
    key: 'stop',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.delegate.serviceDiscoveryWillStop();

              case 2:
                _context4.next = 4;
                return Promise.all(this.children.map(function (child) {
                  return child.stop();
                }));

              case 4:
                _context4.next = 6;
                return this.bonjour.stop();

              case 6:
                _context4.next = 8;
                return this.mqttsd.stop();

              case 8:
                delete this.bonjour;
                delete this.mqttsd;
                _context4.next = 12;
                return this.delegate.serviceDiscoveryDidStop();

              case 12:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function stop() {
        return _ref2.apply(this, arguments);
      }

      return stop;
    }()
  }]);

  return ServiceDiscovery;
}()) || _class;

exports.default = ServiceDiscovery;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

var _events = __webpack_require__(2);

var _events2 = _interopRequireDefault(_events);

var _autobindDecorator = __webpack_require__(1);

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _bonjour = __webpack_require__(11);

var _bonjour2 = _interopRequireDefault(_bonjour);

var _ip = __webpack_require__(3);

var _ip2 = _interopRequireDefault(_ip);

var _helper = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Service discovery using Bonjour.
 * @class Bonjour
 * @constructor
 * @extends EventEmitter
 */
var Bonjour = (0, _autobindDecorator2.default)(_class = function (_EventEmitter) {
  _inherits(Bonjour, _EventEmitter);

  /**
   * Construct and configure a Bonjour instance.
   *
   * @param {Object} configs Configuration object:
   * {
   *   browse: {boolean} if true, browse network services before publish service on start(); otherwise, do publish only.
   * }
   */
  function Bonjour(configs) {
    _classCallCheck(this, Bonjour);

    var _this = _possibleConstructorReturn(this, (Bonjour.__proto__ || Object.getPrototypeOf(Bonjour)).call(this));

    _this.bonjour = (0, _bonjour2.default)();
    _this.configs = configs;
    _this.props = {};
    _this.serviceMap = {}; // To store discovered services referred by its ip address as key
    return _this;
  }

  /**
   * Start the Bonjour instance.
   *
   * @method start
   * @return {Promise} A promise of the result of start process.
   */


  _createClass(Bonjour, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      return new Promise(function (resolve) {
        if (_this2.configs.browse) _this2.browse();
        _this2.publish();
        resolve();
      });
    }

    /**
     * Stop the Bonjour instance.
     *
     * @method stop
     * @return {Promise} A promise of the result of stop process.
     */

  }, {
    key: 'stop',
    value: function stop() {
      var _this3 = this;

      return new Promise(function (resolve) {
        _this3.bonjour.unpublishAll(function () {
          _this3.bonjour.destroy();
          resolve();
        });
      });
    }

    /**
     * Start browsing services by Bonjour. All found services will be stored in an
     * service map with their ip address as key for findService() method to search.
     *
     * @method browse
     * @private
     */

  }, {
    key: 'browse',
    value: function browse() {
      var _this4 = this;

      this.bonjour.find({ type: this.props.type }, function (service) {
        var addrs = _this4.findAddresses(service);
        if (addrs) {
          service.addresses = addrs;
          _this4.serviceMap[addrs[0]] = (_this4.serviceMap[addrs[0]] || []).filter(function (serv) {
            return serv.fqdn !== service.fqdn;
          });
          _this4.serviceMap[addrs[0]].push(service);
          _this4.emit('event', { action: 'up', data: service });
        }
      }).on('down', function (service) {
        var addrs = _this4.findAddresses(service);
        if (addrs) {
          _this4.serviceMap[addrs[0]] = (_this4.serviceMap[addrs[0]] || []).filter(function (serv) {
            return serv.fqdn !== service.fqdn;
          });
          _this4.emit('event', { action: 'down', data: service });
        }
      });
    }

    /**
     * Publish service with given properties.
     *
     * @method publish
     */

  }, {
    key: 'publish',
    value: function publish() {
      var _this5 = this;

      if (this.bonjourService && this.bonjourService.published) {
        this.bonjourService.stop(function () {
          _this5.bonjourService = _this5.bonjour.publish(_this5.props);
        });
      } else if (this.props.name && this.props.port && this.props.type) {
        this.bonjourService = this.bonjour.publish(this.props);
      }
    }

    /**
     * Set service properties.
     *
     * @method setProps
     * @param {Object} props A service object with properties.
     * (Refer to serviceDiscoveryProps() in delegate.js)
     */

  }, {
    key: 'setProps',
    value: function setProps() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.assign(this.props, props);
    }

    /**
     * Update service properties.
     *
     * @method updateProps
     * @param {Object} props A service object with only properties to be updated.
     */

  }, {
    key: 'updateProps',
    value: function updateProps(props) {
      Object.assign(props.txt, this.props.txt);
      Object.assign(this.props, props);
    }

    /**
     * Find addresses of the machine from its bonjour service.
     *
     * @method findAddresses
     * @private
     * @param  {Object} service A bonjour service object.
     * @return {Array}          Addresses in an array.
     */

  }, {
    key: 'findAddresses',
    value: function findAddresses(service) {
      var addresses = service.addresses.filter(function (addr) {
        return _ip2.default.isV4Format(addr);
      });
      if (addresses.length === 0) {
        if (service.referer && service.referer.address) {
          return [service.referer.address];
        }
        return null;
      }
      return addresses;
    }

    /**
     * Find services from Bonjour service browser.
     *
     * @method findService
     * @param {Object} matches An object contains properties to match the service.
     * @param {Function} comparator A custom helper function to compare the `matches` with service.
     * @return {Array} All matched service objects in an array.
     */

  }, {
    key: 'findService',
    value: function findService(matches, comparator) {
      return (0, _helper.findServiceHelper)(this.serviceMap, matches, comparator);
    }
  }]);

  return Bonjour;
}(_events2.default)) || _class;

exports.default = Bonjour;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(2);

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-unused-vars */


/**
 * Dummy service discovery.
 * @class Dummy
 * @constructor
 * @extends EventEmitter
 */
var Dummy = function (_EventEmitter) {
  _inherits(Dummy, _EventEmitter);

  function Dummy() {
    _classCallCheck(this, Dummy);

    return _possibleConstructorReturn(this, (Dummy.__proto__ || Object.getPrototypeOf(Dummy)).apply(this, arguments));
  }

  _createClass(Dummy, [{
    key: 'start',
    value: function start() {}
  }, {
    key: 'stop',
    value: function stop() {}
  }, {
    key: 'publish',
    value: function publish() {}
  }, {
    key: 'setProps',
    value: function setProps() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    }
  }, {
    key: 'updateProps',
    value: function updateProps(props) {}
  }, {
    key: 'findService',
    value: function findService(matches, comparator) {
      return [];
    }
  }]);

  return Dummy;
}(_events2.default);

exports.default = Dummy;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

var _events = __webpack_require__(2);

var _events2 = _interopRequireDefault(_events);

var _autobindDecorator = __webpack_require__(1);

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _ip = __webpack_require__(3);

var _ip2 = _interopRequireDefault(_ip);

var _mqtt = __webpack_require__(12);

var _mqtt2 = _interopRequireDefault(_mqtt);

var _helper = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import debug from 'debug';

var MQTTSD_TOPIC = 'mqttsd';

/**
 * Service discovery using MQTT.
 * @class MQTTSD
 * @constructor
 * @extends EventEmitter
 */

var MQTTSD = (0, _autobindDecorator2.default)(_class = function (_EventEmitter) {
  _inherits(MQTTSD, _EventEmitter);

  /**
   * Construct and configure a MQTTSD instance.
   *
   * @param {Object} configs Configuration object:
   * {
   *   brokerURL: {String} MQTT broker URL.
   *   options: {Object} MQTT client options. (See https://github.com/mqttjs/MQTT.js#client)
   *   browse: {Boolean} if true, browse network services before publish service on start(); otherwise, do publish only.
   * }
   */
  function MQTTSD(configs) {
    _classCallCheck(this, MQTTSD);

    var _this = _possibleConstructorReturn(this, (MQTTSD.__proto__ || Object.getPrototypeOf(MQTTSD)).call(this));

    _this.configs = configs || {};
    _this.props = {};
    _this.serviceMap = {};
    return _this;
  }

  /**
   * Start the MQTTSD instance.
   *
   * @method start
   * @return {Promise} A promise of the result of start process.
   */


  _createClass(MQTTSD, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      return new Promise(function (resolve) {
        if (!_this2.configs.brokerURL) return resolve();

        _this2.mqtt = _mqtt2.default.connect('mqtt://' + _this2.configs.brokerURL, _this2.configs.options);
        _this2.mqtt.on('connect', function () {
          if (_this2.configs.browse) {
            _this2.mqtt.subscribe(MQTTSD_TOPIC, { qos: 1 }, function () {
              _this2.browse();
              _this2.publish();
              resolve();
            });
          } else {
            _this2.publish();
            resolve();
          }
        });

        _this2.mqtt.on('error', function (error) {
          resolve({
            status: 'error',
            error: error
          });
        });

        _this2.mqtt.on('reconnect', function () {
          resolve({ status: 'reconnect' });
        });
      });
    }

    /**
     * Stop the MQTTSD instance.
     *
     * @method stop
     * @return {Promise} A promise of the result of stop process.
     */

  }, {
    key: 'stop',
    value: function stop() {
      var _this3 = this;

      return new Promise(function (resolve) {
        if (!_this3.configs.brokerURL) return resolve();

        if (_this3.mqtt.connected) {
          var timeout = setTimeout(resolve, 5000);
          _this3.mqtt.publish(MQTTSD_TOPIC, JSON.stringify(Object.assign(_this3.props, {
            addresses: [_this3.address],
            status: 'down'
          })), { qos: 1 }, function () {
            clearTimeout(timeout);
            _this3.mqtt.end();
            resolve();
          });
        } else {
          _this3.mqtt.end();
          resolve();
        }
      });
    }

    /**
     * Start browsing services by MQTTSD. All found services will be stored in an
     * service map with their ip address as key for findService() method to search.
     *
     * @method browse
     * @private
     */

  }, {
    key: 'browse',
    value: function browse() {
      var _this4 = this;

      if (!this.configs.brokerURL) return;
      this.mqtt.on('message', function (topic, message) {
        if (topic === MQTTSD_TOPIC) {
          var service = JSON.parse(message.toString());
          var addr = service.addresses[0];

          if (!addr) return;
          if (service.status === 'up') {
            _this4.serviceMap[addr] = (_this4.serviceMap[addr] || []).filter(function (srv) {
              return srv.txt.serialnumber !== service.txt.serialnumber;
            });
            _this4.serviceMap[addr].push(service);
            _this4.emit('event', { action: 'up', data: service });
          } else if (service.status === 'down') {
            _this4.serviceMap[addr] = (_this4.serviceMap[addr] || []).filter(function (srv) {
              return srv.txt.serialnumber !== service.txt.serialnumber;
            });
            _this4.emit('event', { action: 'down', data: service });
          }
        }
      });
    }

    /**
     * Publish service with given properties.
     *
     * @method publish
     */

  }, {
    key: 'publish',
    value: function publish() {
      var _this5 = this;

      if (this.props.name && this.props.port && this.props.type) {
        if (this.address) {
          this.mqtt.publish(MQTTSD_TOPIC, JSON.stringify(Object.assign(this.props, {
            addresses: [this.address],
            status: 'down'
          })), { qos: 1 }, function () {
            _this5.address = _ip2.default.address();
            _this5.mqtt.publish(MQTTSD_TOPIC, JSON.stringify(Object.assign(_this5.props, {
              addresses: [_this5.address],
              fqdn: _this5.props.name + '._' + _this5.props.type + '._' + (_this5.props.protocol || 'tcp') + '.local',
              status: 'up'
            })), { qos: 1 });
          });
        } else {
          this.address = _ip2.default.address();
          this.mqtt.publish(MQTTSD_TOPIC, JSON.stringify(Object.assign(this.props, {
            addresses: [this.address],
            fqdn: this.props.name + '._' + this.props.type + '._' + (this.props.protocol || 'tcp') + '.local',
            status: 'up'
          })), { qos: 1 });
        }
      }
    }

    /**
     * Set service properties.
     *
     * @method setProps
     * @param {Object} props A service object with properties.
     * (Refer to serviceDiscoveryProps() in delegate.js)
     */

  }, {
    key: 'setProps',
    value: function setProps() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.assign(this.props, props);
    }

    /**
     * Update service properties.
     *
     * @method updateProps
     * @param {Object} props A service object with only properties to be updated.
     */

  }, {
    key: 'updateProps',
    value: function updateProps(props) {
      Object.assign(props.txt, this.props.txt);
      Object.assign(this.props, props);
    }

    /**
     * Find services from MQTTSD service browser.
     *
     * @method findService
     * @param {Object} matches An object contains properties to match the service.
     * @param {Function} comparator A custom helper function to compare the `matches` with service.
     * @return {Array} All matched service objects in an array.
     */

  }, {
    key: 'findService',
    value: function findService(matches, comparator) {
      return (0, _helper.findServiceHelper)(this.serviceMap, matches, comparator);
    }
  }]);

  return MQTTSD;
}(_events2.default)) || _class;

exports.default = MQTTSD;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceDiscoveryDataSource = function () {
  function ServiceDiscoveryDataSource() {
    _classCallCheck(this, ServiceDiscoveryDataSource);
  }

  _createClass(ServiceDiscoveryDataSource, [{
    key: "serviceDiscoveryConfigs",

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
    value: function serviceDiscoveryConfigs() {
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

  }, {
    key: "serviceDiscoveryProps",
    value: function serviceDiscoveryProps() {
      return {};
    }
  }]);

  return ServiceDiscoveryDataSource;
}();

exports.default = ServiceDiscoveryDataSource;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-empty-function, no-unused-vars */
var ServiceDiscoveryDelegate = function () {
  function ServiceDiscoveryDelegate() {
    _classCallCheck(this, ServiceDiscoveryDelegate);
  }

  _createClass(ServiceDiscoveryDelegate, [{
    key: "serviceDiscoveryWillStart",

    /**
     * Delegation life cycle #2:
     *   Delegator should implement serviceDiscoveryWillStart() to prepare the service
     *   before service discovery starts.
     *
     * @method serviceDiscoveryWillStart
     * @return {Promise} A promise of the result of willStart() method.
     */
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function serviceDiscoveryWillStart() {
        return _ref.apply(this, arguments);
      }

      return serviceDiscoveryWillStart;
    }()

    /**
     * Delegation life cycle #4:
     *   Delegator should implement serviceDiscoveryDidStart() method to do whatever
     *   it wants after service discovery instances are all up and running.
     *
     * @method serviceDiscoveryDidStart
     * @return {Promise} A promise of the result of didStart() method.
     */

  }, {
    key: "serviceDiscoveryDidStart",
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function serviceDiscoveryDidStart() {
        return _ref2.apply(this, arguments);
      }

      return serviceDiscoveryDidStart;
    }()

    /**
     * Delegation life cycle #5:
     *   Delegator should implement serviceDiscoveryDidReceiveEvent() method if it
     *   would like to get notified on service up and service down.
     *
     * @method serviceDiscoveryDidReceiveEvent
     * @param {String} protocol Service discovery protocol, e.g., 'bonjour', 'mqttsd'.
     * @param {String} action   Event action, i.e., 'up', 'down'.
     * @param {Object} service  Service object who triggered this event.
     */

  }, {
    key: "serviceDiscoveryDidReceiveEvent",
    value: function serviceDiscoveryDidReceiveEvent(protocol, action, service) {}

    /**
     * Delegation life cycle #6:
     *   Delegator should implement serviceDiscoveryWillStop() method to do some
     *   termination tasks before service discovery instances are going down.
     *
     * @method serviceDiscoveryWillStop
     * @return {Promise} A promise of the result of willStop() method.
     */

  }, {
    key: "serviceDiscoveryWillStop",
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function serviceDiscoveryWillStop() {
        return _ref3.apply(this, arguments);
      }

      return serviceDiscoveryWillStop;
    }()

    /**
     * Delegation life cycle #7:
     *   Delegator should implement serviceDiscoveryDidStop() method to do some
     *   cleanup tasks after service discovery instances are going down.
     *
     * @method serviceDiscoveryDidStop
     * @return {Promise} A promise of the result of didStop() method.
     */

  }, {
    key: "serviceDiscoveryDidStop",
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function serviceDiscoveryDidStop() {
        return _ref4.apply(this, arguments);
      }

      return serviceDiscoveryDidStop;
    }()
  }]);

  return ServiceDiscoveryDelegate;
}();

exports.default = ServiceDiscoveryDelegate;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("bonjour");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("mqtt");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(5);
module.exports = __webpack_require__(4);


/***/ })
/******/ ]);
});