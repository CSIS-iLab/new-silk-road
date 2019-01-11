/******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-console */
	
	__webpack_require__(182);
	
	__webpack_require__(124);
	
	var _mapboxGl = __webpack_require__(170);
	
	var _mapboxGl2 = _interopRequireDefault(_mapboxGl);
	
	var _GeoStyles = __webpack_require__(180);
	
	var _GeoStyles2 = _interopRequireDefault(_GeoStyles);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ProjectDetail = window.ProjectDetail || {};
	var mapStyle = 'mapbox://styles/ilabmedia/cjldtfvvu21jk2qqh0jh8drn1';
	var token = 'pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw';
	
	var Map = function () {
	  function Map(geoURL, mapConfig) {
	    var _this = this;
	
	    var infrastructureType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
	    _classCallCheck(this, Map);
	
	    this.geoURL = geoURL;
	    this.geoLoaded = false;
	    this.infrastructureType = infrastructureType;
	
	    var disableHandlers = mapConfig.disableHandlers,
	        hideNavigation = mapConfig.hideNavigation,
	        config = _objectWithoutProperties(mapConfig, ['disableHandlers', 'hideNavigation']);
	
	    config['style'] = mapStyle;
	    _mapboxGl2.default.accessToken = token;
	    this.map = new _mapboxGl2.default.Map(config);
	    disableHandlers.forEach(function (handler) {
	      _this.map[handler].disable();
	    });
	    if (hideNavigation !== true) {
	      this.map.addControl(new _mapboxGl.NavigationControl({ position: 'top-left' }));
	    }
	    this.map.on('load', this.handleMapDidLoad.bind(this));
	    this.stylo = new _GeoStyles2.default();
	  }
	
	  _createClass(Map, [{
	    key: 'handleMapDidLoad',
	    value: function handleMapDidLoad() {
	      if (!this.geoLoaded) {
	        this.loadGeodata();
	      }
	    }
	  }, {
	    key: 'loadGeodata',
	    value: function loadGeodata() {
	      var _this2 = this;
	
	      if (this.geoURL) {
	        fetch(this.geoURL, { credentials: 'same-origin' }).then(function (response) {
	          return response.json();
	        }).then(function (json) {
	          _this2.geoLoaded = true;
	          return _this2.mapProjectLayers(json);
	        }).catch(function (error) {
	          return console.error(error);
	        });
	      } else {
	        console.error('No geoURL to load!');
	      }
	    }
	  }, {
	    key: 'mapProjectLayers',
	    value: function mapProjectLayers(json) {
	      var _this3 = this;
	
	      var extent = json.extent;
	
	      var camera = {
	        bounds: extent,
	        maxZoom: 10,
	        padding: 40
	      };
	      var geoTypes = ['lines', 'points', 'polygons'];
	      geoTypes.forEach(function (t) {
	        var data = json[t];
	        if (data.features.length) {
	          var layerId = t + '-layer';
	          _this3.map.addSource(layerId, {
	            data: data,
	            type: 'geojson'
	          });
	          var layer = Object.assign({
	            source: layerId,
	            id: layerId
	          }, _this3.stylo.getStyleFor(t, _this3.infrastructureType));
	          delete layer.minzoom; // Some big shapes won't show otherwise
	          _this3.map.addLayer(layer);
	        }
	      });
	      this.map.fitBounds(camera.bounds, camera);
	    }
	  }]);
	
	  return Map;
	}();
	
	ProjectDetail.Map = Map;
	window.ProjectDetail = ProjectDetail;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var core = __webpack_require__(25);
	var hide = __webpack_require__(17);
	var redefine = __webpack_require__(18);
	var ctx = __webpack_require__(26);
	var PROTOTYPE = 'prototype';
	
	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if (target) redefine(target, key, out, type & $export.U);
	    // export
	    if (exports[key] != out) hide(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};
	global.core = core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var store = __webpack_require__(77)('wks');
	var uid = __webpack_require__(51);
	var Symbol = __webpack_require__(4).Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(28);
	var min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(5)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(3);
	var IE8_DOM_DEFINE = __webpack_require__(136);
	var toPrimitive = __webpack_require__(33);
	var dP = Object.defineProperty;
	
	exports.f = __webpack_require__(9) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(31);
	module.exports = function (it) {
	  return Object(defined(it));
	};


/***/ }),
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ }),
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(10);
	var createDesc = __webpack_require__(47);
	module.exports = __webpack_require__(9) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var hide = __webpack_require__(17);
	var has = __webpack_require__(20);
	var SRC = __webpack_require__(51)('src');
	var TO_STRING = 'toString';
	var $toString = Function[TO_STRING];
	var TPL = ('' + $toString).split(TO_STRING);
	
	__webpack_require__(25).inspectSource = function (it) {
	  return $toString.call(it);
	};
	
	(module.exports = function (O, key, val, safe) {
	  var isFunction = typeof val == 'function';
	  if (isFunction) has(val, 'name') || hide(val, 'name', key);
	  if (O[key] === val) return;
	  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if (O === global) {
	    O[key] = val;
	  } else if (!safe) {
	    delete O[key];
	    hide(O, key, val);
	  } else if (O[key]) {
	    O[key] = val;
	  } else {
	    hide(O, key, val);
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString() {
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var fails = __webpack_require__(5);
	var defined = __webpack_require__(31);
	var quot = /"/g;
	// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	var createHTML = function (string, tag, attribute, value) {
	  var S = String(defined(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};
	module.exports = function (NAME, exec) {
	  var O = {};
	  O[NAME] = exec(createHTML);
	  $export($export.P + $export.F * fails(function () {
	    var test = ''[NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  }), 'String', O);
	};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE = __webpack_require__(61);
	var createDesc = __webpack_require__(47);
	var toIObject = __webpack_require__(23);
	var toPrimitive = __webpack_require__(33);
	var has = __webpack_require__(20);
	var IE8_DOM_DEFINE = __webpack_require__(136);
	var gOPD = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(9) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(20);
	var toObject = __webpack_require__(11);
	var IE_PROTO = __webpack_require__(105)('IE_PROTO');
	var ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(60);
	var defined = __webpack_require__(31);
	module.exports = function (it) {
	  return IObject(defined(it));
	};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	var core = module.exports = { version: '2.6.0' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(13);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var fails = __webpack_require__(5);
	
	module.exports = function (method, arg) {
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call
	    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
	  });
	};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};


/***/ }),
/* 29 */,
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx = __webpack_require__(26);
	var IObject = __webpack_require__(60);
	var toObject = __webpack_require__(11);
	var toLength = __webpack_require__(8);
	var asc = __webpack_require__(89);
	module.exports = function (TYPE, $create) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  var create = $create || asc;
	  return function ($this, callbackfn, that) {
	    var O = toObject($this);
	    var self = IObject(O);
	    var f = ctx(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var val, res;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      val = self[index];
	      res = f(val, index, O);
	      if (TYPE) {
	        if (IS_MAP) result[index] = res;   // map
	        else if (res) switch (TYPE) {
	          case 3: return true;             // some
	          case 5: return val;              // find
	          case 6: return index;            // findIndex
	          case 2: result.push(val);        // filter
	        } else if (IS_EVERY) return false; // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(1);
	var core = __webpack_require__(25);
	var fails = __webpack_require__(5);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
	};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(6);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};


/***/ }),
/* 34 */,
/* 35 */,
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(158);
	var $export = __webpack_require__(1);
	var shared = __webpack_require__(77)('metadata');
	var store = shared.store || (shared.store = new (__webpack_require__(162))());
	
	var getOrCreateMetadataMap = function (target, targetKey, create) {
	  var targetMetadata = store.get(target);
	  if (!targetMetadata) {
	    if (!create) return undefined;
	    store.set(target, targetMetadata = new Map());
	  }
	  var keyMetadata = targetMetadata.get(targetKey);
	  if (!keyMetadata) {
	    if (!create) return undefined;
	    targetMetadata.set(targetKey, keyMetadata = new Map());
	  } return keyMetadata;
	};
	var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
	  var metadataMap = getOrCreateMetadataMap(O, P, false);
	  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
	};
	var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
	  var metadataMap = getOrCreateMetadataMap(O, P, false);
	  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
	};
	var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
	  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
	};
	var ordinaryOwnMetadataKeys = function (target, targetKey) {
	  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
	  var keys = [];
	  if (metadataMap) metadataMap.forEach(function (_, key) { keys.push(key); });
	  return keys;
	};
	var toMetaKey = function (it) {
	  return it === undefined || typeof it == 'symbol' ? it : String(it);
	};
	var exp = function (O) {
	  $export($export.S, 'Reflect', O);
	};
	
	module.exports = {
	  store: store,
	  map: getOrCreateMetadataMap,
	  has: ordinaryHasOwnMetadata,
	  get: ordinaryGetOwnMetadata,
	  set: ordinaryDefineOwnMetadata,
	  keys: ordinaryOwnMetadataKeys,
	  key: toMetaKey,
	  exp: exp
	};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	if (__webpack_require__(9)) {
	  var LIBRARY = __webpack_require__(39);
	  var global = __webpack_require__(4);
	  var fails = __webpack_require__(5);
	  var $export = __webpack_require__(1);
	  var $typed = __webpack_require__(79);
	  var $buffer = __webpack_require__(110);
	  var ctx = __webpack_require__(26);
	  var anInstance = __webpack_require__(42);
	  var propertyDesc = __webpack_require__(47);
	  var hide = __webpack_require__(17);
	  var redefineAll = __webpack_require__(48);
	  var toInteger = __webpack_require__(28);
	  var toLength = __webpack_require__(8);
	  var toIndex = __webpack_require__(156);
	  var toAbsoluteIndex = __webpack_require__(50);
	  var toPrimitive = __webpack_require__(33);
	  var has = __webpack_require__(20);
	  var classof = __webpack_require__(52);
	  var isObject = __webpack_require__(6);
	  var toObject = __webpack_require__(11);
	  var isArrayIter = __webpack_require__(96);
	  var create = __webpack_require__(44);
	  var getPrototypeOf = __webpack_require__(22);
	  var gOPN = __webpack_require__(45).f;
	  var getIterFn = __webpack_require__(112);
	  var uid = __webpack_require__(51);
	  var wks = __webpack_require__(7);
	  var createArrayMethod = __webpack_require__(30);
	  var createArrayIncludes = __webpack_require__(66);
	  var speciesConstructor = __webpack_require__(62);
	  var ArrayIterators = __webpack_require__(113);
	  var Iterators = __webpack_require__(53);
	  var $iterDetect = __webpack_require__(71);
	  var setSpecies = __webpack_require__(49);
	  var arrayFill = __webpack_require__(88);
	  var arrayCopyWithin = __webpack_require__(128);
	  var $DP = __webpack_require__(10);
	  var $GOPD = __webpack_require__(21);
	  var dP = $DP.f;
	  var gOPD = $GOPD.f;
	  var RangeError = global.RangeError;
	  var TypeError = global.TypeError;
	  var Uint8Array = global.Uint8Array;
	  var ARRAY_BUFFER = 'ArrayBuffer';
	  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
	  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	  var PROTOTYPE = 'prototype';
	  var ArrayProto = Array[PROTOTYPE];
	  var $ArrayBuffer = $buffer.ArrayBuffer;
	  var $DataView = $buffer.DataView;
	  var arrayForEach = createArrayMethod(0);
	  var arrayFilter = createArrayMethod(2);
	  var arraySome = createArrayMethod(3);
	  var arrayEvery = createArrayMethod(4);
	  var arrayFind = createArrayMethod(5);
	  var arrayFindIndex = createArrayMethod(6);
	  var arrayIncludes = createArrayIncludes(true);
	  var arrayIndexOf = createArrayIncludes(false);
	  var arrayValues = ArrayIterators.values;
	  var arrayKeys = ArrayIterators.keys;
	  var arrayEntries = ArrayIterators.entries;
	  var arrayLastIndexOf = ArrayProto.lastIndexOf;
	  var arrayReduce = ArrayProto.reduce;
	  var arrayReduceRight = ArrayProto.reduceRight;
	  var arrayJoin = ArrayProto.join;
	  var arraySort = ArrayProto.sort;
	  var arraySlice = ArrayProto.slice;
	  var arrayToString = ArrayProto.toString;
	  var arrayToLocaleString = ArrayProto.toLocaleString;
	  var ITERATOR = wks('iterator');
	  var TAG = wks('toStringTag');
	  var TYPED_CONSTRUCTOR = uid('typed_constructor');
	  var DEF_CONSTRUCTOR = uid('def_constructor');
	  var ALL_CONSTRUCTORS = $typed.CONSTR;
	  var TYPED_ARRAY = $typed.TYPED;
	  var VIEW = $typed.VIEW;
	  var WRONG_LENGTH = 'Wrong length!';
	
	  var $map = createArrayMethod(1, function (O, length) {
	    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
	  });
	
	  var LITTLE_ENDIAN = fails(function () {
	    // eslint-disable-next-line no-undef
	    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
	  });
	
	  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
	    new Uint8Array(1).set({});
	  });
	
	  var toOffset = function (it, BYTES) {
	    var offset = toInteger(it);
	    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
	    return offset;
	  };
	
	  var validate = function (it) {
	    if (isObject(it) && TYPED_ARRAY in it) return it;
	    throw TypeError(it + ' is not a typed array!');
	  };
	
	  var allocate = function (C, length) {
	    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
	      throw TypeError('It is not a typed array constructor!');
	    } return new C(length);
	  };
	
	  var speciesFromList = function (O, list) {
	    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
	  };
	
	  var fromList = function (C, list) {
	    var index = 0;
	    var length = list.length;
	    var result = allocate(C, length);
	    while (length > index) result[index] = list[index++];
	    return result;
	  };
	
	  var addGetter = function (it, key, internal) {
	    dP(it, key, { get: function () { return this._d[internal]; } });
	  };
	
	  var $from = function from(source /* , mapfn, thisArg */) {
	    var O = toObject(source);
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var iterFn = getIterFn(O);
	    var i, length, values, result, step, iterator;
	    if (iterFn != undefined && !isArrayIter(iterFn)) {
	      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
	        values.push(step.value);
	      } O = values;
	    }
	    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
	    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
	      result[i] = mapping ? mapfn(O[i], i) : O[i];
	    }
	    return result;
	  };
	
	  var $of = function of(/* ...items */) {
	    var index = 0;
	    var length = arguments.length;
	    var result = allocate(this, length);
	    while (length > index) result[index] = arguments[index++];
	    return result;
	  };
	
	  // iOS Safari 6.x fails here
	  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });
	
	  var $toLocaleString = function toLocaleString() {
	    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
	  };
	
	  var proto = {
	    copyWithin: function copyWithin(target, start /* , end */) {
	      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    every: function every(callbackfn /* , thisArg */) {
	      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
	      return arrayFill.apply(validate(this), arguments);
	    },
	    filter: function filter(callbackfn /* , thisArg */) {
	      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
	        arguments.length > 1 ? arguments[1] : undefined));
	    },
	    find: function find(predicate /* , thisArg */) {
	      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    findIndex: function findIndex(predicate /* , thisArg */) {
	      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    forEach: function forEach(callbackfn /* , thisArg */) {
	      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    indexOf: function indexOf(searchElement /* , fromIndex */) {
	      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    includes: function includes(searchElement /* , fromIndex */) {
	      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    join: function join(separator) { // eslint-disable-line no-unused-vars
	      return arrayJoin.apply(validate(this), arguments);
	    },
	    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
	      return arrayLastIndexOf.apply(validate(this), arguments);
	    },
	    map: function map(mapfn /* , thisArg */) {
	      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
	      return arrayReduce.apply(validate(this), arguments);
	    },
	    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
	      return arrayReduceRight.apply(validate(this), arguments);
	    },
	    reverse: function reverse() {
	      var that = this;
	      var length = validate(that).length;
	      var middle = Math.floor(length / 2);
	      var index = 0;
	      var value;
	      while (index < middle) {
	        value = that[index];
	        that[index++] = that[--length];
	        that[length] = value;
	      } return that;
	    },
	    some: function some(callbackfn /* , thisArg */) {
	      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    sort: function sort(comparefn) {
	      return arraySort.call(validate(this), comparefn);
	    },
	    subarray: function subarray(begin, end) {
	      var O = validate(this);
	      var length = O.length;
	      var $begin = toAbsoluteIndex(begin, length);
	      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
	        O.buffer,
	        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
	        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
	      );
	    }
	  };
	
	  var $slice = function slice(start, end) {
	    return speciesFromList(this, arraySlice.call(validate(this), start, end));
	  };
	
	  var $set = function set(arrayLike /* , offset */) {
	    validate(this);
	    var offset = toOffset(arguments[1], 1);
	    var length = this.length;
	    var src = toObject(arrayLike);
	    var len = toLength(src.length);
	    var index = 0;
	    if (len + offset > length) throw RangeError(WRONG_LENGTH);
	    while (index < len) this[offset + index] = src[index++];
	  };
	
	  var $iterators = {
	    entries: function entries() {
	      return arrayEntries.call(validate(this));
	    },
	    keys: function keys() {
	      return arrayKeys.call(validate(this));
	    },
	    values: function values() {
	      return arrayValues.call(validate(this));
	    }
	  };
	
	  var isTAIndex = function (target, key) {
	    return isObject(target)
	      && target[TYPED_ARRAY]
	      && typeof key != 'symbol'
	      && key in target
	      && String(+key) == String(key);
	  };
	  var $getDesc = function getOwnPropertyDescriptor(target, key) {
	    return isTAIndex(target, key = toPrimitive(key, true))
	      ? propertyDesc(2, target[key])
	      : gOPD(target, key);
	  };
	  var $setDesc = function defineProperty(target, key, desc) {
	    if (isTAIndex(target, key = toPrimitive(key, true))
	      && isObject(desc)
	      && has(desc, 'value')
	      && !has(desc, 'get')
	      && !has(desc, 'set')
	      // TODO: add validation descriptor w/o calling accessors
	      && !desc.configurable
	      && (!has(desc, 'writable') || desc.writable)
	      && (!has(desc, 'enumerable') || desc.enumerable)
	    ) {
	      target[key] = desc.value;
	      return target;
	    } return dP(target, key, desc);
	  };
	
	  if (!ALL_CONSTRUCTORS) {
	    $GOPD.f = $getDesc;
	    $DP.f = $setDesc;
	  }
	
	  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
	    getOwnPropertyDescriptor: $getDesc,
	    defineProperty: $setDesc
	  });
	
	  if (fails(function () { arrayToString.call({}); })) {
	    arrayToString = arrayToLocaleString = function toString() {
	      return arrayJoin.call(this);
	    };
	  }
	
	  var $TypedArrayPrototype$ = redefineAll({}, proto);
	  redefineAll($TypedArrayPrototype$, $iterators);
	  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
	  redefineAll($TypedArrayPrototype$, {
	    slice: $slice,
	    set: $set,
	    constructor: function () { /* noop */ },
	    toString: arrayToString,
	    toLocaleString: $toLocaleString
	  });
	  addGetter($TypedArrayPrototype$, 'buffer', 'b');
	  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
	  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
	  addGetter($TypedArrayPrototype$, 'length', 'e');
	  dP($TypedArrayPrototype$, TAG, {
	    get: function () { return this[TYPED_ARRAY]; }
	  });
	
	  // eslint-disable-next-line max-statements
	  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
	    CLAMPED = !!CLAMPED;
	    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + KEY;
	    var SETTER = 'set' + KEY;
	    var TypedArray = global[NAME];
	    var Base = TypedArray || {};
	    var TAC = TypedArray && getPrototypeOf(TypedArray);
	    var FORCED = !TypedArray || !$typed.ABV;
	    var O = {};
	    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
	    var getter = function (that, index) {
	      var data = that._d;
	      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
	    };
	    var setter = function (that, index, value) {
	      var data = that._d;
	      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
	      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
	    };
	    var addElement = function (that, index) {
	      dP(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };
	    if (FORCED) {
	      TypedArray = wrapper(function (that, data, $offset, $length) {
	        anInstance(that, TypedArray, NAME, '_d');
	        var index = 0;
	        var offset = 0;
	        var buffer, byteLength, length, klass;
	        if (!isObject(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new $ArrayBuffer(byteLength);
	        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
	          buffer = data;
	          offset = toOffset($offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
	            byteLength = $len - offset;
	            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
	          } else {
	            byteLength = toLength($length) * BYTES;
	            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (TYPED_ARRAY in data) {
	          return fromList(TypedArray, data);
	        } else {
	          return $from.call(TypedArray, data);
	        }
	        hide(that, '_d', {
	          b: buffer,
	          o: offset,
	          l: byteLength,
	          e: length,
	          v: new $DataView(buffer)
	        });
	        while (index < length) addElement(that, index++);
	      });
	      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
	      hide(TypedArrayPrototype, 'constructor', TypedArray);
	    } else if (!fails(function () {
	      TypedArray(1);
	    }) || !fails(function () {
	      new TypedArray(-1); // eslint-disable-line no-new
	    }) || !$iterDetect(function (iter) {
	      new TypedArray(); // eslint-disable-line no-new
	      new TypedArray(null); // eslint-disable-line no-new
	      new TypedArray(1.5); // eslint-disable-line no-new
	      new TypedArray(iter); // eslint-disable-line no-new
	    }, true)) {
	      TypedArray = wrapper(function (that, data, $offset, $length) {
	        anInstance(that, TypedArray, NAME);
	        var klass;
	        // `ws` module bug, temporarily remove validation length for Uint8Array
	        // https://github.com/websockets/ws/pull/645
	        if (!isObject(data)) return new Base(toIndex(data));
	        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
	          return $length !== undefined
	            ? new Base(data, toOffset($offset, BYTES), $length)
	            : $offset !== undefined
	              ? new Base(data, toOffset($offset, BYTES))
	              : new Base(data);
	        }
	        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
	        return $from.call(TypedArray, data);
	      });
	      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
	        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
	      });
	      TypedArray[PROTOTYPE] = TypedArrayPrototype;
	      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
	    }
	    var $nativeIterator = TypedArrayPrototype[ITERATOR];
	    var CORRECT_ITER_NAME = !!$nativeIterator
	      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
	    var $iterator = $iterators.values;
	    hide(TypedArray, TYPED_CONSTRUCTOR, true);
	    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
	    hide(TypedArrayPrototype, VIEW, true);
	    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);
	
	    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
	      dP(TypedArrayPrototype, TAG, {
	        get: function () { return NAME; }
	      });
	    }
	
	    O[NAME] = TypedArray;
	
	    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);
	
	    $export($export.S, NAME, {
	      BYTES_PER_ELEMENT: BYTES
	    });
	
	    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
	      from: $from,
	      of: $of
	    });
	
	    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);
	
	    $export($export.P, NAME, proto);
	
	    setSpecies(NAME);
	
	    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });
	
	    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);
	
	    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;
	
	    $export($export.P + $export.F * fails(function () {
	      new TypedArray(1).slice();
	    }), NAME, { slice: $slice });
	
	    $export($export.P + $export.F * (fails(function () {
	      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
	    }) || !fails(function () {
	      TypedArrayPrototype.toLocaleString.call([1, 2]);
	    })), NAME, { toLocaleString: $toLocaleString });
	
	    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
	    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
	  };
	} else module.exports = function () { /* empty */ };


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = __webpack_require__(7)('unscopables');
	var ArrayProto = Array.prototype;
	if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(17)(ArrayProto, UNSCOPABLES, {});
	module.exports = function (key) {
	  ArrayProto[UNSCOPABLES][key] = true;
	};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

	module.exports = false;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var META = __webpack_require__(51)('meta');
	var isObject = __webpack_require__(6);
	var has = __webpack_require__(20);
	var setDesc = __webpack_require__(10).f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !__webpack_require__(5)(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};


/***/ }),
/* 41 */,
/* 42 */
/***/ (function(module, exports) {

	module.exports = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx = __webpack_require__(26);
	var call = __webpack_require__(139);
	var isArrayIter = __webpack_require__(96);
	var anObject = __webpack_require__(3);
	var toLength = __webpack_require__(8);
	var getIterFn = __webpack_require__(112);
	var BREAK = {};
	var RETURN = {};
	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
	  var f = ctx(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = call(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	exports.BREAK = BREAK;
	exports.RETURN = RETURN;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(3);
	var dPs = __webpack_require__(145);
	var enumBugKeys = __webpack_require__(92);
	var IE_PROTO = __webpack_require__(105)('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(91)('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(94).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys = __webpack_require__(147);
	var hiddenKeys = __webpack_require__(92).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(147);
	var enumBugKeys = __webpack_require__(92);
	
	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	var redefine = __webpack_require__(18);
	module.exports = function (target, src, safe) {
	  for (var key in src) redefine(target, key, src[key], safe);
	  return target;
	};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global = __webpack_require__(4);
	var dP = __webpack_require__(10);
	var DESCRIPTORS = __webpack_require__(9);
	var SPECIES = __webpack_require__(7)('species');
	
	module.exports = function (KEY) {
	  var C = global[KEY];
	  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(28);
	var max = Math.max;
	var min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};


/***/ }),
/* 51 */
/***/ (function(module, exports) {

	var id = 0;
	var px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(24);
	var TAG = __webpack_require__(7)('toStringTag');
	// ES3 wrong here
	var ARG = cof(function () { return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};
	
	module.exports = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};


/***/ }),
/* 53 */
/***/ (function(module, exports) {

	module.exports = {};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(10).f;
	var has = __webpack_require__(20);
	var TAG = __webpack_require__(7)('toStringTag');
	
	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var defined = __webpack_require__(31);
	var fails = __webpack_require__(5);
	var spaces = __webpack_require__(108);
	var space = '[' + spaces + ']';
	var non = '\u200b\u0085';
	var ltrim = RegExp('^' + space + space + '*');
	var rtrim = RegExp(space + space + '*$');
	
	var exporter = function (KEY, exec, ALIAS) {
	  var exp = {};
	  var FORCE = fails(function () {
	    return !!spaces[KEY]() || non[KEY]() != non;
	  });
	  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
	  if (ALIAS) exp[ALIAS] = fn;
	  $export($export.P + $export.F * FORCE, 'String', exp);
	};
	
	// 1 -> String#trimLeft
	// 2 -> String#trimRight
	// 3 -> String#trim
	var trim = exporter.trim = function (string, TYPE) {
	  string = String(defined(string));
	  if (TYPE & 1) string = string.replace(ltrim, '');
	  if (TYPE & 2) string = string.replace(rtrim, '');
	  return string;
	};
	
	module.exports = exporter;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);
	module.exports = function (it, TYPE) {
	  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
	  return it;
	};


/***/ }),
/* 57 */,
/* 58 */,
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 21.2.5.3 get RegExp.prototype.flags
	var anObject = __webpack_require__(3);
	module.exports = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(24);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ }),
/* 61 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject = __webpack_require__(3);
	var aFunction = __webpack_require__(13);
	var SPECIES = __webpack_require__(7)('species');
	module.exports = function (O, D) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};


/***/ }),
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(23);
	var toLength = __webpack_require__(8);
	var toAbsoluteIndex = __webpack_require__(50);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global = __webpack_require__(4);
	var $export = __webpack_require__(1);
	var redefine = __webpack_require__(18);
	var redefineAll = __webpack_require__(48);
	var meta = __webpack_require__(40);
	var forOf = __webpack_require__(43);
	var anInstance = __webpack_require__(42);
	var isObject = __webpack_require__(6);
	var fails = __webpack_require__(5);
	var $iterDetect = __webpack_require__(71);
	var setToStringTag = __webpack_require__(54);
	var inheritIfRequired = __webpack_require__(95);
	
	module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
	  var Base = global[NAME];
	  var C = Base;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var proto = C && C.prototype;
	  var O = {};
	  var fixMethod = function (KEY) {
	    var fn = proto[KEY];
	    redefine(proto, KEY,
	      KEY == 'delete' ? function (a) {
	        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'has' ? function has(a) {
	        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'get' ? function get(a) {
	        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
	        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
	    );
	  };
	  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
	    new C().entries().next();
	  }))) {
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	    meta.NEED = true;
	  } else {
	    var instance = new C();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new C();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });
	    if (!ACCEPT_ITERABLES) {
	      C = wrapper(function (target, iterable) {
	        anInstance(target, C, NAME);
	        var that = inheritIfRequired(new Base(), target, C);
	        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
	        return that;
	      });
	      C.prototype = proto;
	      proto.constructor = C;
	    }
	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }
	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
	    // weak collections should not contains .clear method
	    if (IS_WEAK && proto.clear) delete proto.clear;
	  }
	
	  setToStringTag(C, NAME);
	
	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F * (C != Base), O);
	
	  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);
	
	  return C;
	};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	__webpack_require__(159);
	var redefine = __webpack_require__(18);
	var hide = __webpack_require__(17);
	var fails = __webpack_require__(5);
	var defined = __webpack_require__(31);
	var wks = __webpack_require__(7);
	var regexpExec = __webpack_require__(103);
	
	var SPECIES = wks('species');
	
	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});
	
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
	  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
	})();
	
	module.exports = function (KEY, length, exec) {
	  var SYMBOL = wks(KEY);
	
	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });
	
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;
	    re.exec = function () { execCalled = true; return null; };
	    if (KEY === 'split') {
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES] = function () { return re; };
	    }
	    re[SYMBOL]('');
	    return !execCalled;
	  }) : undefined;
	
	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var fns = exec(
	      defined,
	      SYMBOL,
	      ''[KEY],
	      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
	        if (regexp.exec === regexpExec) {
	          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	            // The native String method already delegates to @@method (this
	            // polyfilled function), leasing to infinite recursion.
	            // We avoid it by directly calling the native @@method method.
	            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	          }
	          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	        }
	        return { done: false };
	      }
	    );
	    var strfn = fns[0];
	    var rxfn = fns[1];
	
	    redefine(String.prototype, KEY, strfn);
	    hide(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return rxfn.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return rxfn.call(string, this); }
	    );
	  }
	};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(24);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.8 IsRegExp(argument)
	var isObject = __webpack_require__(6);
	var cof = __webpack_require__(24);
	var MATCH = __webpack_require__(7)('match');
	module.exports = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
	};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR = __webpack_require__(7)('iterator');
	var SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(riter, function () { throw 2; });
	} catch (e) { /* empty */ }
	
	module.exports = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// Forced replacement prototype accessors methods
	module.exports = __webpack_require__(39) || !__webpack_require__(5)(function () {
	  var K = Math.random();
	  // In FF throws only define methods
	  // eslint-disable-next-line no-undef, no-useless-call
	  __defineSetter__.call(null, K, function () { /* empty */ });
	  delete __webpack_require__(4)[K];
	});


/***/ }),
/* 73 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var classof = __webpack_require__(52);
	var builtinExec = RegExp.prototype.exec;
	
	 // `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	module.exports = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw new TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }
	  if (classof(R) !== 'RegExp') {
	    throw new TypeError('RegExp#exec called on incompatible receiver');
	  }
	  return builtinExec.call(R, S);
	};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/proposal-setmap-offrom/
	var $export = __webpack_require__(1);
	var aFunction = __webpack_require__(13);
	var ctx = __webpack_require__(26);
	var forOf = __webpack_require__(43);
	
	module.exports = function (COLLECTION) {
	  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
	    var mapFn = arguments[1];
	    var mapping, A, n, cb;
	    aFunction(this);
	    mapping = mapFn !== undefined;
	    if (mapping) aFunction(mapFn);
	    if (source == undefined) return new this();
	    A = [];
	    if (mapping) {
	      n = 0;
	      cb = ctx(mapFn, arguments[2], 2);
	      forOf(source, false, function (nextItem) {
	        A.push(cb(nextItem, n++));
	      });
	    } else {
	      forOf(source, false, A.push, A);
	    }
	    return new this(A);
	  } });
	};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/proposal-setmap-offrom/
	var $export = __webpack_require__(1);
	
	module.exports = function (COLLECTION) {
	  $export($export.S, COLLECTION, { of: function of() {
	    var length = arguments.length;
	    var A = new Array(length);
	    while (length--) A[length] = arguments[length];
	    return new this(A);
	  } });
	};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	var core = __webpack_require__(25);
	var global = __webpack_require__(4);
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});
	
	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: core.version,
	  mode: __webpack_require__(39) ? 'pure' : 'global',
	  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
	});


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(28);
	var defined = __webpack_require__(31);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that));
	    var i = toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var hide = __webpack_require__(17);
	var uid = __webpack_require__(51);
	var TYPED = uid('typed_array');
	var VIEW = uid('view');
	var ABV = !!(global.ArrayBuffer && global.DataView);
	var CONSTR = ABV;
	var i = 0;
	var l = 9;
	var Typed;
	
	var TypedArrayConstructors = (
	  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
	).split(',');
	
	while (i < l) {
	  if (Typed = global[TypedArrayConstructors[i++]]) {
	    hide(Typed.prototype, TYPED, true);
	    hide(Typed.prototype, VIEW, true);
	  } else CONSTR = false;
	}
	
	module.exports = {
	  ABV: ABV,
	  CONSTR: CONSTR,
	  TYPED: TYPED,
	  VIEW: VIEW
	};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var navigator = global.navigator;
	
	module.exports = navigator && navigator.userAgent || '';


/***/ }),
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var at = __webpack_require__(78)(true);
	
	 // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	module.exports = function (S, index, unicode) {
	  return index + (unicode ? at(S, index).length : 1);
	};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	'use strict';
	var toObject = __webpack_require__(11);
	var toAbsoluteIndex = __webpack_require__(50);
	var toLength = __webpack_require__(8);
	module.exports = function fill(value /* , start = 0, end = @length */) {
	  var O = toObject(this);
	  var length = toLength(O.length);
	  var aLen = arguments.length;
	  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
	  var end = aLen > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
	  while (endPos > index) O[index++] = value;
	  return O;
	};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var speciesConstructor = __webpack_require__(184);
	
	module.exports = function (original, length) {
	  return new (speciesConstructor(original))(length);
	};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(10);
	var createDesc = __webpack_require__(47);
	
	module.exports = function (object, index, value) {
	  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);
	var document = __webpack_require__(4).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ }),
/* 92 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	var MATCH = __webpack_require__(7)('match');
	module.exports = function (KEY) {
	  var re = /./;
	  try {
	    '/./'[KEY](re);
	  } catch (e) {
	    try {
	      re[MATCH] = false;
	      return !'/./'[KEY](re);
	    } catch (f) { /* empty */ }
	  } return true;
	};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	var document = __webpack_require__(4).document;
	module.exports = document && document.documentElement;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);
	var setPrototypeOf = __webpack_require__(104).set;
	module.exports = function (that, target, C) {
	  var S = target.constructor;
	  var P;
	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
	    setPrototypeOf(that, P);
	  } return that;
	};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators = __webpack_require__(53);
	var ITERATOR = __webpack_require__(7)('iterator');
	var ArrayProto = Array.prototype;
	
	module.exports = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create = __webpack_require__(44);
	var descriptor = __webpack_require__(47);
	var setToStringTag = __webpack_require__(54);
	var IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(17)(IteratorPrototype, __webpack_require__(7)('iterator'), function () { return this; });
	
	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(39);
	var $export = __webpack_require__(1);
	var redefine = __webpack_require__(18);
	var hide = __webpack_require__(17);
	var Iterators = __webpack_require__(53);
	var $iterCreate = __webpack_require__(97);
	var setToStringTag = __webpack_require__(54);
	var getPrototypeOf = __webpack_require__(22);
	var ITERATOR = __webpack_require__(7)('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';
	
	var returnThis = function () { return this; };
	
	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};


/***/ }),
/* 99 */
/***/ (function(module, exports) {

	// 20.2.2.14 Math.expm1(x)
	var $expm1 = Math.expm1;
	module.exports = (!$expm1
	  // Old FF bug
	  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
	  // Tor Browser bug
	  || $expm1(-2e-17) != -2e-17
	) ? function expm1(x) {
	  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
	} : $expm1;


/***/ }),
/* 100 */
/***/ (function(module, exports) {

	// 20.2.2.28 Math.sign(x)
	module.exports = Math.sign || function sign(x) {
	  // eslint-disable-next-line no-self-compare
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var macrotask = __webpack_require__(109).set;
	var Observer = global.MutationObserver || global.WebKitMutationObserver;
	var process = global.process;
	var Promise = global.Promise;
	var isNode = __webpack_require__(24)(process) == 'process';
	
	module.exports = function () {
	  var head, last, notify;
	
	  var flush = function () {
	    var parent, fn;
	    if (isNode && (parent = process.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (e) {
	        if (head) notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };
	
	  // Node.js
	  if (isNode) {
	    notify = function () {
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
	  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
	    var toggle = true;
	    var node = document.createTextNode('');
	    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise && Promise.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    var promise = Promise.resolve(undefined);
	    notify = function () {
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }
	
	  return function (fn) {
	    var task = { fn: fn, next: undefined };
	    if (last) last.next = task;
	    if (!head) {
	      head = task;
	      notify();
	    } last = task;
	  };
	};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 25.4.1.5 NewPromiseCapability(C)
	var aFunction = __webpack_require__(13);
	
	function PromiseCapability(C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject = aFunction(reject);
	}
	
	module.exports.f = function (C) {
	  return new PromiseCapability(C);
	};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var regexpFlags = __webpack_require__(59);
	
	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;
	
	var patchedExec = nativeExec;
	
	var LAST_INDEX = 'lastIndex';
	
	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/,
	      re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
	})();
	
	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;
	
	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	
	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];
	
	    match = nativeExec.call(re, str);
	
	    if (UPDATES_LAST_INDEX_WRONG && match) {
	      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      // eslint-disable-next-line no-loop-func
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }
	
	    return match;
	  };
	}
	
	module.exports = patchedExec;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(6);
	var anObject = __webpack_require__(3);
	var check = function (O, proto) {
	  anObject(O);
	  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function (test, buggy, set) {
	      try {
	        set = __webpack_require__(26)(Function.call, __webpack_require__(21).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch (e) { buggy = true; }
	      return function setPrototypeOf(O, proto) {
	        check(O, proto);
	        if (buggy) O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(77)('keys');
	var uid = __webpack_require__(51);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	// helper for String#{startsWith, endsWith, includes}
	var isRegExp = __webpack_require__(70);
	var defined = __webpack_require__(31);
	
	module.exports = function (that, searchString, NAME) {
	  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
	  return String(defined(that));
	};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var toInteger = __webpack_require__(28);
	var defined = __webpack_require__(31);
	
	module.exports = function repeat(count) {
	  var str = String(defined(this));
	  var res = '';
	  var n = toInteger(count);
	  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
	  return res;
	};


/***/ }),
/* 108 */
/***/ (function(module, exports) {

	module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx = __webpack_require__(26);
	var invoke = __webpack_require__(137);
	var html = __webpack_require__(94);
	var cel = __webpack_require__(91);
	var global = __webpack_require__(4);
	var process = global.process;
	var setTask = global.setImmediate;
	var clearTask = global.clearImmediate;
	var MessageChannel = global.MessageChannel;
	var Dispatch = global.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;
	var run = function () {
	  var id = +this;
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function (event) {
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!setTask || !clearTask) {
	  setTask = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (__webpack_require__(24)(process) == 'process') {
	    defer = function (id) {
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
	    defer = function (id) {
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in cel('script')) {
	    defer = function (id) {
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set: setTask,
	  clear: clearTask
	};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global = __webpack_require__(4);
	var DESCRIPTORS = __webpack_require__(9);
	var LIBRARY = __webpack_require__(39);
	var $typed = __webpack_require__(79);
	var hide = __webpack_require__(17);
	var redefineAll = __webpack_require__(48);
	var fails = __webpack_require__(5);
	var anInstance = __webpack_require__(42);
	var toInteger = __webpack_require__(28);
	var toLength = __webpack_require__(8);
	var toIndex = __webpack_require__(156);
	var gOPN = __webpack_require__(45).f;
	var dP = __webpack_require__(10).f;
	var arrayFill = __webpack_require__(88);
	var setToStringTag = __webpack_require__(54);
	var ARRAY_BUFFER = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE = 'prototype';
	var WRONG_LENGTH = 'Wrong length!';
	var WRONG_INDEX = 'Wrong index!';
	var $ArrayBuffer = global[ARRAY_BUFFER];
	var $DataView = global[DATA_VIEW];
	var Math = global.Math;
	var RangeError = global.RangeError;
	// eslint-disable-next-line no-shadow-restricted-names
	var Infinity = global.Infinity;
	var BaseBuffer = $ArrayBuffer;
	var abs = Math.abs;
	var pow = Math.pow;
	var floor = Math.floor;
	var log = Math.log;
	var LN2 = Math.LN2;
	var BUFFER = 'buffer';
	var BYTE_LENGTH = 'byteLength';
	var BYTE_OFFSET = 'byteOffset';
	var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
	var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
	var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;
	
	// IEEE754 conversions based on https://github.com/feross/ieee754
	function packIEEE754(value, mLen, nBytes) {
	  var buffer = new Array(nBytes);
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
	  var i = 0;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
	  var e, m, c;
	  value = abs(value);
	  // eslint-disable-next-line no-self-compare
	  if (value != value || value === Infinity) {
	    // eslint-disable-next-line no-self-compare
	    m = value != value ? 1 : 0;
	    e = eMax;
	  } else {
	    e = floor(log(value) / LN2);
	    if (value * (c = pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }
	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * pow(2, eBias - 1) * pow(2, mLen);
	      e = 0;
	    }
	  }
	  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
	  buffer[--i] |= s * 128;
	  return buffer;
	}
	function unpackIEEE754(buffer, mLen, nBytes) {
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = eLen - 7;
	  var i = nBytes - 1;
	  var s = buffer[i--];
	  var e = s & 127;
	  var m;
	  s >>= 7;
	  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : s ? -Infinity : Infinity;
	  } else {
	    m = m + pow(2, mLen);
	    e = e - eBias;
	  } return (s ? -1 : 1) * m * pow(2, e - mLen);
	}
	
	function unpackI32(bytes) {
	  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
	}
	function packI8(it) {
	  return [it & 0xff];
	}
	function packI16(it) {
	  return [it & 0xff, it >> 8 & 0xff];
	}
	function packI32(it) {
	  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
	}
	function packF64(it) {
	  return packIEEE754(it, 52, 8);
	}
	function packF32(it) {
	  return packIEEE754(it, 23, 4);
	}
	
	function addGetter(C, key, internal) {
	  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
	}
	
	function get(view, bytes, index, isLittleEndian) {
	  var numIndex = +index;
	  var intIndex = toIndex(numIndex);
	  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
	  var store = view[$BUFFER]._b;
	  var start = intIndex + view[$OFFSET];
	  var pack = store.slice(start, start + bytes);
	  return isLittleEndian ? pack : pack.reverse();
	}
	function set(view, bytes, index, conversion, value, isLittleEndian) {
	  var numIndex = +index;
	  var intIndex = toIndex(numIndex);
	  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
	  var store = view[$BUFFER]._b;
	  var start = intIndex + view[$OFFSET];
	  var pack = conversion(+value);
	  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
	}
	
	if (!$typed.ABV) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
	    var byteLength = toIndex(length);
	    this._b = arrayFill.call(new Array(byteLength), 0);
	    this[$LENGTH] = byteLength;
	  };
	
	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance(this, $DataView, DATA_VIEW);
	    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = buffer[$LENGTH];
	    var offset = toInteger(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
	    this[$BUFFER] = buffer;
	    this[$OFFSET] = offset;
	    this[$LENGTH] = byteLength;
	  };
	
	  if (DESCRIPTORS) {
	    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
	    addGetter($DataView, BUFFER, '_b');
	    addGetter($DataView, BYTE_LENGTH, '_l');
	    addGetter($DataView, BYTE_OFFSET, '_o');
	  }
	
	  redefineAll($DataView[PROTOTYPE], {
	    getInt8: function getInt8(byteOffset) {
	      return get(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackI32(get(this, 4, byteOffset, arguments[1]));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set(this, 1, byteOffset, packI8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set(this, 1, byteOffset, packI8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
	      set(this, 2, byteOffset, packI16, value, arguments[2]);
	    },
	    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
	      set(this, 2, byteOffset, packI16, value, arguments[2]);
	    },
	    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packI32, value, arguments[2]);
	    },
	    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packI32, value, arguments[2]);
	    },
	    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packF32, value, arguments[2]);
	    },
	    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
	      set(this, 8, byteOffset, packF64, value, arguments[2]);
	    }
	  });
	} else {
	  if (!fails(function () {
	    $ArrayBuffer(1);
	  }) || !fails(function () {
	    new $ArrayBuffer(-1); // eslint-disable-line no-new
	  }) || fails(function () {
	    new $ArrayBuffer(); // eslint-disable-line no-new
	    new $ArrayBuffer(1.5); // eslint-disable-line no-new
	    new $ArrayBuffer(NaN); // eslint-disable-line no-new
	    return $ArrayBuffer.name != ARRAY_BUFFER;
	  })) {
	    $ArrayBuffer = function ArrayBuffer(length) {
	      anInstance(this, $ArrayBuffer);
	      return new BaseBuffer(toIndex(length));
	    };
	    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
	    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
	      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
	    }
	    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
	  }
	  // iOS Safari 7.x bug
	  var view = new $DataView(new $ArrayBuffer(2));
	  var $setInt8 = $DataView[PROTOTYPE].setInt8;
	  view.setInt8(0, 2147483648);
	  view.setInt8(1, 2147483649);
	  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
	    setInt8: function setInt8(byteOffset, value) {
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    }
	  }, true);
	}
	setToStringTag($ArrayBuffer, ARRAY_BUFFER);
	setToStringTag($DataView, DATA_VIEW);
	hide($DataView[PROTOTYPE], $typed.VIEW, true);
	exports[ARRAY_BUFFER] = $ArrayBuffer;
	exports[DATA_VIEW] = $DataView;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var core = __webpack_require__(25);
	var LIBRARY = __webpack_require__(39);
	var wksExt = __webpack_require__(157);
	var defineProperty = __webpack_require__(10).f;
	module.exports = function (name) {
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
	};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	var classof = __webpack_require__(52);
	var ITERATOR = __webpack_require__(7)('iterator');
	var Iterators = __webpack_require__(53);
	module.exports = __webpack_require__(25).getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(38);
	var step = __webpack_require__(140);
	var Iterators = __webpack_require__(53);
	var toIObject = __webpack_require__(23);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(98)(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');


/***/ }),
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */
/***/ (function(module, exports) {

	(function(self) {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }
	
	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ]
	
	    var isDataView = function(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj)
	    }
	
	    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    }
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }
	
	    return iterator
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	    } else if (Array.isArray(headers)) {
	      headers.forEach(function(header) {
	        this.append(header[0], header[1])
	      }, this)
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var oldValue = this.map[name]
	    this.map[name] = oldValue ? oldValue+','+value : value
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    name = normalizeName(name)
	    return this.has(name) ? this.map[name] : null
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value)
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this)
	      }
	    }
	  }
	
	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsArrayBuffer(blob)
	    return promise
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsText(blob)
	    return promise
	  }
	
	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf)
	    var chars = new Array(view.length)
	
	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i])
	    }
	    return chars.join('')
	  }
	
	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength)
	      view.set(new Uint8Array(buf))
	      return view.buffer
	    }
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (!body) {
	        this._bodyText = ''
	      } else if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer)
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer])
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body)
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      }
	    }
	
	    this.text = function() {
	      var rejected = consumed(this)
	      if (rejected) {
	        return rejected
	      }
	
	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	
	    if (input instanceof Request) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = String(input)
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this, { body: this._bodyInit })
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function parseHeaders(rawHeaders) {
	    var headers = new Headers()
	    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	    // https://tools.ietf.org/html/rfc7230#section-3.2
	    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
	    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
	      var parts = line.split(':')
	      var key = parts.shift().trim()
	      if (key) {
	        var value = parts.join(':').trim()
	        headers.append(key, value)
	      }
	    })
	    return headers
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this.type = 'default'
	    this.status = options.status === undefined ? 200 : options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = 'statusText' in options ? options.statusText : 'OK'
	    this.headers = new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init)
	      var xhr = new XMLHttpRequest()
	
	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        }
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      } else if (request.credentials === 'omit') {
	        xhr.withCredentials = false
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 125 */,
/* 126 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var defaultZoom = 2.0;
	var minDetailZoom = 5.0;
	var maxFitZoom = 10.0;
	var onMoveDelayTime = 750;
	var updateInterval = 500;
	var boundsPadding = 15;
	var popContentClass = 'popup-content';
	var defaultCenter = [88.639973, 32.776942];
	
	exports.defaultZoom = defaultZoom;
	exports.minDetailZoom = minDetailZoom;
	exports.maxFitZoom = maxFitZoom;
	exports.onMoveDelayTime = onMoveDelayTime;
	exports.boundsPadding = boundsPadding;
	exports.updateInterval = updateInterval;
	exports.popContentClass = popContentClass;
	exports.defaultCenter = defaultCenter;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	var cof = __webpack_require__(24);
	module.exports = function (it, msg) {
	  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
	  return +it;
	};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	'use strict';
	var toObject = __webpack_require__(11);
	var toAbsoluteIndex = __webpack_require__(50);
	var toLength = __webpack_require__(8);
	
	module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = toObject(this);
	  var len = toLength(O.length);
	  var to = toAbsoluteIndex(target, len);
	  var from = toAbsoluteIndex(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];
	    else delete O[to];
	    to += inc;
	    from += inc;
	  } return O;
	};


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

	var forOf = __webpack_require__(43);
	
	module.exports = function (iter, ITERATOR) {
	  var result = [];
	  forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

	var aFunction = __webpack_require__(13);
	var toObject = __webpack_require__(11);
	var IObject = __webpack_require__(60);
	var toLength = __webpack_require__(8);
	
	module.exports = function (that, callbackfn, aLen, memo, isRight) {
	  aFunction(callbackfn);
	  var O = toObject(that);
	  var self = IObject(O);
	  var length = toLength(O.length);
	  var index = isRight ? length - 1 : 0;
	  var i = isRight ? -1 : 1;
	  if (aLen < 2) for (;;) {
	    if (index in self) {
	      memo = self[index];
	      index += i;
	      break;
	    }
	    index += i;
	    if (isRight ? index < 0 : length <= index) {
	      throw TypeError('Reduce of empty array with no initial value');
	    }
	  }
	  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
	    memo = callbackfn(memo, self[index], index, O);
	  }
	  return memo;
	};


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var aFunction = __webpack_require__(13);
	var isObject = __webpack_require__(6);
	var invoke = __webpack_require__(137);
	var arraySlice = [].slice;
	var factories = {};
	
	var construct = function (F, len, args) {
	  if (!(len in factories)) {
	    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
	  } return factories[len](F, args);
	};
	
	module.exports = Function.bind || function bind(that /* , ...args */) {
	  var fn = aFunction(this);
	  var partArgs = arraySlice.call(arguments, 1);
	  var bound = function (/* args... */) {
	    var args = partArgs.concat(arraySlice.call(arguments));
	    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
	  };
	  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
	  return bound;
	};


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var dP = __webpack_require__(10).f;
	var create = __webpack_require__(44);
	var redefineAll = __webpack_require__(48);
	var ctx = __webpack_require__(26);
	var anInstance = __webpack_require__(42);
	var forOf = __webpack_require__(43);
	var $iterDefine = __webpack_require__(98);
	var step = __webpack_require__(140);
	var setSpecies = __webpack_require__(49);
	var DESCRIPTORS = __webpack_require__(9);
	var fastKey = __webpack_require__(40).fastKey;
	var validate = __webpack_require__(56);
	var SIZE = DESCRIPTORS ? '_s' : 'size';
	
	var getEntry = function (that, key) {
	  // fast case
	  var index = fastKey(key);
	  var entry;
	  if (index !== 'F') return that._i[index];
	  // frozen object case
	  for (entry = that._f; entry; entry = entry.n) {
	    if (entry.k == key) return entry;
	  }
	};
	
	module.exports = {
	  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, NAME, '_i');
	      that._t = NAME;         // collection type
	      that._i = create(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
	          entry.r = true;
	          if (entry.p) entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = validate(this, NAME);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.n;
	          var prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if (prev) prev.n = next;
	          if (next) next.p = prev;
	          if (that._f == entry) that._f = next;
	          if (that._l == entry) that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        validate(this, NAME);
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.n : this._f) {
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while (entry && entry.r) entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(validate(this, NAME), key);
	      }
	    });
	    if (DESCRIPTORS) dP(C.prototype, 'size', {
	      get: function () {
	        return validate(this, NAME)[SIZE];
	      }
	    });
	    return C;
	  },
	  def: function (that, key, value) {
	    var entry = getEntry(that, key);
	    var prev, index;
	    // change existing entry
	    if (entry) {
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if (!that._f) that._f = entry;
	      if (prev) prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if (index !== 'F') that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function (C, NAME, IS_MAP) {
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function (iterated, kind) {
	      this._t = validate(iterated, NAME); // target
	      this._k = kind;                     // kind
	      this._l = undefined;                // previous
	    }, function () {
	      var that = this;
	      var kind = that._k;
	      var entry = that._l;
	      // revert to the last existing entry
	      while (entry && entry.r) entry = entry.p;
	      // get next entry
	      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if (kind == 'keys') return step(0, entry.k);
	      if (kind == 'values') return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);
	
	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var classof = __webpack_require__(52);
	var from = __webpack_require__(129);
	module.exports = function (NAME) {
	  return function toJSON() {
	    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
	    return from(this);
	  };
	};


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var redefineAll = __webpack_require__(48);
	var getWeak = __webpack_require__(40).getWeak;
	var anObject = __webpack_require__(3);
	var isObject = __webpack_require__(6);
	var anInstance = __webpack_require__(42);
	var forOf = __webpack_require__(43);
	var createArrayMethod = __webpack_require__(30);
	var $has = __webpack_require__(20);
	var validate = __webpack_require__(56);
	var arrayFind = createArrayMethod(5);
	var arrayFindIndex = createArrayMethod(6);
	var id = 0;
	
	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function (that) {
	  return that._l || (that._l = new UncaughtFrozenStore());
	};
	var UncaughtFrozenStore = function () {
	  this.a = [];
	};
	var findUncaughtFrozen = function (store, key) {
	  return arrayFind(store.a, function (it) {
	    return it[0] === key;
	  });
	};
	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;
	    else this.a.push([key, value]);
	  },
	  'delete': function (key) {
	    var index = arrayFindIndex(this.a, function (it) {
	      return it[0] === key;
	    });
	    if (~index) this.a.splice(index, 1);
	    return !!~index;
	  }
	};
	
	module.exports = {
	  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, NAME, '_i');
	      that._t = NAME;      // collection type
	      that._i = id++;      // collection id
	      that._l = undefined; // leak store for uncaught frozen objects
	      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function (key) {
	        if (!isObject(key)) return false;
	        var data = getWeak(key);
	        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
	        return data && $has(data, this._i) && delete data[this._i];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has(key) {
	        if (!isObject(key)) return false;
	        var data = getWeak(key);
	        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
	        return data && $has(data, this._i);
	      }
	    });
	    return C;
	  },
	  def: function (that, key, value) {
	    var data = getWeak(anObject(key), true);
	    if (data === true) uncaughtFrozenStore(that).set(key, value);
	    else data[that._i] = value;
	    return that;
	  },
	  ufstore: uncaughtFrozenStore
	};


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
	var isArray = __webpack_require__(69);
	var isObject = __webpack_require__(6);
	var toLength = __webpack_require__(8);
	var ctx = __webpack_require__(26);
	var IS_CONCAT_SPREADABLE = __webpack_require__(7)('isConcatSpreadable');
	
	function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
	  var targetIndex = start;
	  var sourceIndex = 0;
	  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
	  var element, spreadable;
	
	  while (sourceIndex < sourceLen) {
	    if (sourceIndex in source) {
	      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];
	
	      spreadable = false;
	      if (isObject(element)) {
	        spreadable = element[IS_CONCAT_SPREADABLE];
	        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
	      }
	
	      if (spreadable && depth > 0) {
	        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
	      } else {
	        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
	        target[targetIndex] = element;
	      }
	
	      targetIndex++;
	    }
	    sourceIndex++;
	  }
	  return targetIndex;
	}
	
	module.exports = flattenIntoArray;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(9) && !__webpack_require__(5)(function () {
	  return Object.defineProperty(__webpack_require__(91)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 137 */
/***/ (function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function (fn, args, that) {
	  var un = that === undefined;
	  switch (args.length) {
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return fn.apply(that, args);
	};


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(6);
	var floor = Math.floor;
	module.exports = function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(3);
	module.exports = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) anObject(ret.call(iterator));
	    throw e;
	  }
	};


/***/ }),
/* 140 */
/***/ (function(module, exports) {

	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.16 Math.fround(x)
	var sign = __webpack_require__(100);
	var pow = Math.pow;
	var EPSILON = pow(2, -52);
	var EPSILON32 = pow(2, -23);
	var MAX32 = pow(2, 127) * (2 - EPSILON32);
	var MIN32 = pow(2, -126);
	
	var roundTiesToEven = function (n) {
	  return n + 1 / EPSILON - 1 / EPSILON;
	};
	
	module.exports = Math.fround || function fround(x) {
	  var $abs = Math.abs(x);
	  var $sign = sign(x);
	  var a, result;
	  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
	  a = (1 + EPSILON32 / EPSILON) * $abs;
	  result = a - (a - $abs);
	  // eslint-disable-next-line no-self-compare
	  if (result > MAX32 || result != result) return $sign * Infinity;
	  return $sign * result;
	};


/***/ }),
/* 142 */
/***/ (function(module, exports) {

	// 20.2.2.20 Math.log1p(x)
	module.exports = Math.log1p || function log1p(x) {
	  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
	};


/***/ }),
/* 143 */
/***/ (function(module, exports) {

	// https://rwaldron.github.io/proposal-math-extensions/
	module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
	  if (
	    arguments.length === 0
	      // eslint-disable-next-line no-self-compare
	      || x != x
	      // eslint-disable-next-line no-self-compare
	      || inLow != inLow
	      // eslint-disable-next-line no-self-compare
	      || inHigh != inHigh
	      // eslint-disable-next-line no-self-compare
	      || outLow != outLow
	      // eslint-disable-next-line no-self-compare
	      || outHigh != outHigh
	  ) return NaN;
	  if (x === Infinity || x === -Infinity) return x;
	  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
	};


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys = __webpack_require__(46);
	var gOPS = __webpack_require__(73);
	var pIE = __webpack_require__(61);
	var toObject = __webpack_require__(11);
	var IObject = __webpack_require__(60);
	var $assign = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(5)(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = gOPS.f;
	  var isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]);
	    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  } return T;
	} : $assign;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(10);
	var anObject = __webpack_require__(3);
	var getKeys = __webpack_require__(46);
	
	module.exports = __webpack_require__(9) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(23);
	var gOPN = __webpack_require__(45).f;
	var toString = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function (it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

	var has = __webpack_require__(20);
	var toIObject = __webpack_require__(23);
	var arrayIndexOf = __webpack_require__(66)(false);
	var IE_PROTO = __webpack_require__(105)('IE_PROTO');
	
	module.exports = function (object, names) {
	  var O = toIObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys = __webpack_require__(46);
	var toIObject = __webpack_require__(23);
	var isEnum = __webpack_require__(61).f;
	module.exports = function (isEntries) {
	  return function (it) {
	    var O = toIObject(it);
	    var keys = getKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) if (isEnum.call(O, key = keys[i++])) {
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

	// all object keys, includes non-enumerable and symbols
	var gOPN = __webpack_require__(45);
	var gOPS = __webpack_require__(73);
	var anObject = __webpack_require__(3);
	var Reflect = __webpack_require__(4).Reflect;
	module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
	  var keys = gOPN.f(anObject(it));
	  var getSymbols = gOPS.f;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

	var $parseFloat = __webpack_require__(4).parseFloat;
	var $trim = __webpack_require__(55).trim;
	
	module.exports = 1 / $parseFloat(__webpack_require__(108) + '-0') !== -Infinity ? function parseFloat(str) {
	  var string = $trim(String(str), 3);
	  var result = $parseFloat(string);
	  return result === 0 && string.charAt(0) == '-' ? -0 : result;
	} : $parseFloat;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

	var $parseInt = __webpack_require__(4).parseInt;
	var $trim = __webpack_require__(55).trim;
	var ws = __webpack_require__(108);
	var hex = /^[-+]?0[xX]/;
	
	module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
	  var string = $trim(String(str), 3);
	  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
	} : $parseInt;


/***/ }),
/* 152 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return { e: false, v: exec() };
	  } catch (e) {
	    return { e: true, v: e };
	  }
	};


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(3);
	var isObject = __webpack_require__(6);
	var newPromiseCapability = __webpack_require__(102);
	
	module.exports = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};


/***/ }),
/* 154 */
/***/ (function(module, exports) {

	// 7.2.9 SameValue(x, y)
	module.exports = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-string-pad-start-end
	var toLength = __webpack_require__(8);
	var repeat = __webpack_require__(107);
	var defined = __webpack_require__(31);
	
	module.exports = function (that, maxLength, fillString, left) {
	  var S = String(defined(that));
	  var stringLength = S.length;
	  var fillStr = fillString === undefined ? ' ' : String(fillString);
	  var intMaxLength = toLength(maxLength);
	  if (intMaxLength <= stringLength || fillStr == '') return S;
	  var fillLen = intMaxLength - stringLength;
	  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
	  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
	  return left ? stringFiller + S : S + stringFiller;
	};


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/ecma262/#sec-toindex
	var toInteger = __webpack_require__(28);
	var toLength = __webpack_require__(8);
	module.exports = function (it) {
	  if (it === undefined) return 0;
	  var number = toInteger(it);
	  var length = toLength(number);
	  if (number !== length) throw RangeError('Wrong length!');
	  return length;
	};


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(7);


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(132);
	var validate = __webpack_require__(56);
	var MAP = 'Map';
	
	// 23.1 Map Objects
	module.exports = __webpack_require__(67)(MAP, function (get) {
	  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key) {
	    var entry = strong.getEntry(validate(this, MAP), key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value) {
	    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
	  }
	}, strong, true);


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var regexpExec = __webpack_require__(103);
	__webpack_require__(1)({
	  target: 'RegExp',
	  proto: true,
	  forced: regexpExec !== /./.exec
	}, {
	  exec: regexpExec
	});


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

	// 21.2.5.3 get RegExp.prototype.flags()
	if (__webpack_require__(9) && /./g.flags != 'g') __webpack_require__(10).f(RegExp.prototype, 'flags', {
	  configurable: true,
	  get: __webpack_require__(59)
	});


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(132);
	var validate = __webpack_require__(56);
	var SET = 'Set';
	
	// 23.2 Set Objects
	module.exports = __webpack_require__(67)(SET, function (get) {
	  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value) {
	    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
	  }
	}, strong);


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var each = __webpack_require__(30)(0);
	var redefine = __webpack_require__(18);
	var meta = __webpack_require__(40);
	var assign = __webpack_require__(144);
	var weak = __webpack_require__(134);
	var isObject = __webpack_require__(6);
	var fails = __webpack_require__(5);
	var validate = __webpack_require__(56);
	var WEAK_MAP = 'WeakMap';
	var getWeak = meta.getWeak;
	var isExtensible = Object.isExtensible;
	var uncaughtFrozenStore = weak.ufstore;
	var tmp = {};
	var InternalMap;
	
	var wrapper = function (get) {
	  return function WeakMap() {
	    return get(this, arguments.length > 0 ? arguments[0] : undefined);
	  };
	};
	
	var methods = {
	  // 23.3.3.3 WeakMap.prototype.get(key)
	  get: function get(key) {
	    if (isObject(key)) {
	      var data = getWeak(key);
	      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
	      return data ? data[this._i] : undefined;
	    }
	  },
	  // 23.3.3.5 WeakMap.prototype.set(key, value)
	  set: function set(key, value) {
	    return weak.def(validate(this, WEAK_MAP), key, value);
	  }
	};
	
	// 23.3 WeakMap Objects
	var $WeakMap = module.exports = __webpack_require__(67)(WEAK_MAP, wrapper, methods, weak, true, true);
	
	// IE11 WeakMap frozen keys fix
	if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
	  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
	  assign(InternalMap.prototype, methods);
	  meta.NEED = true;
	  each(['delete', 'has', 'get', 'set'], function (key) {
	    var proto = $WeakMap.prototype;
	    var method = proto[key];
	    redefine(proto, key, function (a, b) {
	      // store frozen objects on internal weakmap shim
	      if (isObject(a) && !isExtensible(a)) {
	        if (!this._f) this._f = new InternalMap();
	        var result = this._f[key](a, b);
	        return key == 'set' ? this : result;
	      // store all the rest on native weakmap
	      } return method.call(this, a, b);
	    });
	  });
	}


/***/ }),
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

	var require;var require;/* WEBPACK VAR INJECTION */(function(Buffer, global) {(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mapboxgl = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	"use strict";function serializePaintVertexArrays(r,e){var t={};for(var a in r){var n=r[a].paintVertexArray;if(0!==n.length){var i=n.serialize(e),s=n.constructor.serialize();t[a]={array:i,type:s}}}return t}var ProgramConfiguration=require("./program_configuration"),Segment=function(r,e){this.vertexOffset=r,this.primitiveOffset=e,this.vertexLength=0,this.primitiveLength=0},ArrayGroup=function(r,e,t){var a=this;this.globalProperties={zoom:t};var n=r.layoutVertexArrayType;this.layoutVertexArray=new n;var i=r.elementArrayType;i&&(this.elementArray=new i);var s=r.elementArrayType2;s&&(this.elementArray2=new s),this.layerData={};for(var y=0,o=e;y<o.length;y+=1){var l=o[y],h=ProgramConfiguration.createDynamic(r.paintAttributes||[],l,t);a.layerData[l.id]={layer:l,programConfiguration:h,paintVertexArray:new h.PaintVertexArray}}this.segments=[],this.segments2=[]};ArrayGroup.prototype.prepareSegment=function(r){var e=this.segments[this.segments.length-1];return(!e||e.vertexLength+r>ArrayGroup.MAX_VERTEX_ARRAY_LENGTH)&&(e=new Segment(this.layoutVertexArray.length,this.elementArray.length),this.segments.push(e)),e},ArrayGroup.prototype.prepareSegment2=function(r){var e=this.segments2[this.segments2.length-1];return(!e||e.vertexLength+r>ArrayGroup.MAX_VERTEX_ARRAY_LENGTH)&&(e=new Segment(this.layoutVertexArray.length,this.elementArray2.length),this.segments2.push(e)),e},ArrayGroup.prototype.populatePaintArrays=function(r){var e=this;for(var t in this.layerData){var a=e.layerData[t];0!==a.paintVertexArray.bytesPerElement&&a.programConfiguration.populatePaintArray(a.layer,a.paintVertexArray,e.layoutVertexArray.length,e.globalProperties,r)}},ArrayGroup.prototype.isEmpty=function(){return 0===this.layoutVertexArray.length},ArrayGroup.prototype.serialize=function(r){return{layoutVertexArray:this.layoutVertexArray.serialize(r),elementArray:this.elementArray&&this.elementArray.serialize(r),elementArray2:this.elementArray2&&this.elementArray2.serialize(r),paintVertexArrays:serializePaintVertexArrays(this.layerData,r),segments:this.segments,segments2:this.segments2}},ArrayGroup.MAX_VERTEX_ARRAY_LENGTH=Math.pow(2,16)-1,module.exports=ArrayGroup;
	},{"./program_configuration":15}],2:[function(require,module,exports){
	"use strict";var ArrayGroup=require("./array_group"),BufferGroup=require("./buffer_group"),util=require("../util/util"),Bucket=function(r,e){this.zoom=r.zoom,this.overscaling=r.overscaling,this.layers=r.layers,this.index=r.index,r.arrays?this.buffers=new BufferGroup(e,r.layers,r.zoom,r.arrays):this.arrays=new ArrayGroup(e,r.layers,r.zoom)};Bucket.prototype.populate=function(r,e){for(var t=this,i=0,u=r;i<u.length;i+=1){var a=u[i];t.layers[0].filter(a)&&(t.addFeature(a),e.featureIndex.insert(a,t.index))}},Bucket.prototype.isEmpty=function(){return this.arrays.isEmpty()},Bucket.prototype.serialize=function(r){return{zoom:this.zoom,layerIds:this.layers.map(function(r){return r.id}),arrays:this.arrays.serialize(r)}},Bucket.prototype.destroy=function(){this.buffers&&(this.buffers.destroy(),this.buffers=null)},module.exports=Bucket,Bucket.deserialize=function(r,e){if(e){for(var t={},i=0,u=r;i<u.length;i+=1){var a=u[i],o=a.layerIds.map(function(r){return e.getLayer(r)}).filter(Boolean);if(0!==o.length)for(var s=o[0].createBucket(util.extend({layers:o},a)),n=0,f=o;n<f.length;n+=1){var l=f[n];t[l.id]=s}}return t}};
	},{"../util/util":126,"./array_group":1,"./buffer_group":9}],3:[function(require,module,exports){
	"use strict";function addCircleVertex(e,r,t,a,c){e.emplaceBack(2*r+(a+1)/2,2*t+(c+1)/2)}var Bucket=require("../bucket"),createVertexArrayType=require("../vertex_array_type"),createElementArrayType=require("../element_array_type"),loadGeometry=require("../load_geometry"),EXTENT=require("../extent"),circleInterface={layoutVertexArrayType:createVertexArrayType([{name:"a_pos",components:2,type:"Int16"}]),elementArrayType:createElementArrayType(),paintAttributes:[{property:"circle-color",type:"Uint8"},{property:"circle-radius",type:"Uint16",multiplier:10},{property:"circle-blur",type:"Uint16",multiplier:10},{property:"circle-opacity",type:"Uint8",multiplier:255}]},CircleBucket=function(e){function r(r){e.call(this,r,circleInterface)}return e&&(r.__proto__=e),r.prototype=Object.create(e&&e.prototype),r.prototype.constructor=r,r.prototype.addFeature=function(e){for(var r=this.arrays,t=0,a=loadGeometry(e);t<a.length;t+=1)for(var c=a[t],p=0,y=c;p<y.length;p+=1){var i=y[p],l=i.x,o=i.y;if(!(l<0||l>=EXTENT||o<0||o>=EXTENT)){var n=r.prepareSegment(4),u=n.vertexLength;addCircleVertex(r.layoutVertexArray,l,o,-1,-1),addCircleVertex(r.layoutVertexArray,l,o,1,-1),addCircleVertex(r.layoutVertexArray,l,o,1,1),addCircleVertex(r.layoutVertexArray,l,o,-1,1),r.elementArray.emplaceBack(u,u+1,u+2),r.elementArray.emplaceBack(u,u+3,u+2),n.vertexLength+=4,n.primitiveLength+=2}}r.populatePaintArrays(e.properties)},r}(Bucket);module.exports=CircleBucket;
	},{"../bucket":2,"../element_array_type":10,"../extent":11,"../load_geometry":13,"../vertex_array_type":17}],4:[function(require,module,exports){
	"use strict";var Bucket=require("../bucket"),createVertexArrayType=require("../vertex_array_type"),createElementArrayType=require("../element_array_type"),loadGeometry=require("../load_geometry"),earcut=require("earcut"),classifyRings=require("../../util/classify_rings"),EARCUT_MAX_RINGS=500,fillInterface={layoutVertexArrayType:createVertexArrayType([{name:"a_pos",components:2,type:"Int16"}]),elementArrayType:createElementArrayType(3),elementArrayType2:createElementArrayType(2),paintAttributes:[{property:"fill-color",type:"Uint8"},{property:"fill-outline-color",type:"Uint8"},{property:"fill-opacity",type:"Uint8",multiplier:255}]},FillBucket=function(e){function r(r){e.call(this,r,fillInterface)}return e&&(r.__proto__=e),r.prototype=Object.create(e&&e.prototype),r.prototype.constructor=r,r.prototype.addFeature=function(e){for(var r=this.arrays,t=0,a=classifyRings(loadGeometry(e),EARCUT_MAX_RINGS);t<a.length;t+=1){for(var l=a[t],p=0,n=0,y=l;n<y.length;n+=1){var o=y[n];p+=o.length}for(var i=r.prepareSegment(p),c=i.vertexLength,u=[],h=[],s=0,g=l;s<g.length;s+=1){var m=g[s];if(0!==m.length){m!==l[0]&&h.push(u.length/2);var f=r.prepareSegment2(m.length),A=f.vertexLength;r.layoutVertexArray.emplaceBack(m[0].x,m[0].y),r.elementArray2.emplaceBack(A+m.length-1,A),u.push(m[0].x),u.push(m[0].y);for(var v=1;v<m.length;v++)r.layoutVertexArray.emplaceBack(m[v].x,m[v].y),r.elementArray2.emplaceBack(A+v-1,A+v),u.push(m[v].x),u.push(m[v].y);f.vertexLength+=m.length,f.primitiveLength+=m.length}}for(var x=earcut(u,h),_=0;_<x.length;_+=3)r.elementArray.emplaceBack(c+x[_],c+x[_+1],c+x[_+2]);i.vertexLength+=p,i.primitiveLength+=x.length/3}r.populatePaintArrays(e.properties)},r}(Bucket);module.exports=FillBucket;
	},{"../../util/classify_rings":110,"../bucket":2,"../element_array_type":10,"../load_geometry":13,"../vertex_array_type":17,"earcut":136}],5:[function(require,module,exports){
	"use strict";function addVertex(e,r,t,a,n,y,o,i){e.emplaceBack(r,t,2*Math.floor(a*FACTOR)+o,n*FACTOR*2,y*FACTOR*2,Math.round(i))}function isBoundaryEdge(e,r){return e.x===r.x&&(e.x<0||e.x>EXTENT)||e.y===r.y&&(e.y<0||e.y>EXTENT)}var Bucket=require("../bucket"),createVertexArrayType=require("../vertex_array_type"),createElementArrayType=require("../element_array_type"),loadGeometry=require("../load_geometry"),EXTENT=require("../extent"),earcut=require("earcut"),classifyRings=require("../../util/classify_rings"),EARCUT_MAX_RINGS=500,fillExtrusionInterface={layoutVertexArrayType:createVertexArrayType([{name:"a_pos",components:2,type:"Int16"},{name:"a_normal",components:3,type:"Int16"},{name:"a_edgedistance",components:1,type:"Int16"}]),elementArrayType:createElementArrayType(3),paintAttributes:[{property:"fill-extrusion-base",type:"Uint16"},{property:"fill-extrusion-height",type:"Uint16"},{property:"fill-extrusion-color",type:"Uint8"}]},FACTOR=Math.pow(2,13),FillExtrusionBucket=function(e){function r(r){e.call(this,r,fillExtrusionInterface)}return e&&(r.__proto__=e),r.prototype=Object.create(e&&e.prototype),r.prototype.constructor=r,r.prototype.addFeature=function(e){for(var r=this.arrays,t=0,a=classifyRings(loadGeometry(e),EARCUT_MAX_RINGS);t<a.length;t+=1){for(var n=a[t],y=0,o=0,i=n;o<i.length;o+=1){var l=i[o];y+=l.length}for(var p=r.prepareSegment(5*y),u=[],c=[],x=[],s=0,d=n;s<d.length;s+=1){var h=d[s];if(0!==h.length){h!==n[0]&&c.push(u.length/2);for(var m=0,f=0;f<h.length;f++){var A=h[f];if(addVertex(r.layoutVertexArray,A.x,A.y,0,0,1,1,0),x.push(p.vertexLength++),f>=1){var g=h[f-1];if(!isBoundaryEdge(A,g)){var _=A.sub(g)._perp()._unit();addVertex(r.layoutVertexArray,A.x,A.y,_.x,_.y,0,0,m),addVertex(r.layoutVertexArray,A.x,A.y,_.x,_.y,0,1,m),m+=g.dist(A),addVertex(r.layoutVertexArray,g.x,g.y,_.x,_.y,0,0,m),addVertex(r.layoutVertexArray,g.x,g.y,_.x,_.y,0,1,m);var v=p.vertexLength;r.elementArray.emplaceBack(v,v+1,v+2),r.elementArray.emplaceBack(v+1,v+2,v+3),p.vertexLength+=4,p.primitiveLength+=2}}u.push(A.x),u.push(A.y)}}}for(var T=earcut(u,c),E=0;E<T.length;E+=3)r.elementArray.emplaceBack(x[T[E]],x[T[E+1]],x[T[E+2]]);p.primitiveLength+=T.length/3}r.populatePaintArrays(e.properties)},r}(Bucket);module.exports=FillExtrusionBucket;
	},{"../../util/classify_rings":110,"../bucket":2,"../element_array_type":10,"../extent":11,"../load_geometry":13,"../vertex_array_type":17,"earcut":136}],6:[function(require,module,exports){
	"use strict";function addLineVertex(e,t,r,i,a,n,d){e.emplaceBack(t.x<<1|i,t.y<<1|a,Math.round(EXTRUDE_SCALE*r.x)+128,Math.round(EXTRUDE_SCALE*r.y)+128,(0===n?0:n<0?-1:1)+1|(d*LINE_DISTANCE_SCALE&63)<<2,d*LINE_DISTANCE_SCALE>>6)}var Bucket=require("../bucket"),createVertexArrayType=require("../vertex_array_type"),createElementArrayType=require("../element_array_type"),loadGeometry=require("../load_geometry"),EXTENT=require("../extent"),EXTRUDE_SCALE=63,COS_HALF_SHARP_CORNER=Math.cos(37.5*(Math.PI/180)),SHARP_CORNER_OFFSET=15,LINE_DISTANCE_BUFFER_BITS=15,LINE_DISTANCE_SCALE=.5,MAX_LINE_DISTANCE=Math.pow(2,LINE_DISTANCE_BUFFER_BITS-1)/LINE_DISTANCE_SCALE,lineInterface={layoutVertexArrayType:createVertexArrayType([{name:"a_pos",components:2,type:"Int16"},{name:"a_data",components:4,type:"Uint8"}]),paintAttributes:[{property:"line-color",type:"Uint8"}],elementArrayType:createElementArrayType()},LineBucket=function(e){function t(t){e.call(this,t,lineInterface)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.addFeature=function(e){for(var t=this,r=this.layers[0].layout,i=r["line-join"],a=r["line-cap"],n=r["line-miter-limit"],d=r["line-round-limit"],s=0,u=loadGeometry(e,LINE_DISTANCE_BUFFER_BITS);s<u.length;s+=1){var l=u[s];t.addLine(l,e.properties,i,a,n,d)}},t.prototype.addLine=function(e,t,r,i,a,n){for(var d=this,s=e.length;s>2&&e[s-1].equals(e[s-2]);)s--;if(!(e.length<2)){"bevel"===r&&(a=1.05);var u=SHARP_CORNER_OFFSET*(EXTENT/(512*this.overscaling)),l=e[0],o=e[s-1],c=l.equals(o),_=this.arrays,h=_.prepareSegment(10*s);if(2!==s||!c){this.distance=0;var p,y,E,m,x,C,A,v=i,f=c?"butt":i,L=!0;this.e1=this.e2=this.e3=-1,c&&(p=e[s-2],x=l.sub(p)._unit()._perp());for(var S=0;S<s;S++)if(E=c&&S===s-1?e[1]:e[S+1],!E||!e[S].equals(E)){x&&(m=x),p&&(y=p),p=e[S],x=E?E.sub(p)._unit()._perp():m,m=m||x;var V=m.add(x)._unit(),T=V.x*x.x+V.y*x.y,I=1/T,N=T<COS_HALF_SHARP_CORNER&&y&&E;if(N&&S>0){var b=p.dist(y);if(b>2*u){var R=p.sub(p.sub(y)._mult(u/b)._round());d.distance+=R.dist(y),d.addCurrentVertex(R,d.distance,m.mult(1),0,0,!1,h),y=R}}var g=y&&E,B=g?r:E?v:f;if(g&&"round"===B&&(I<n?B="miter":I<=2&&(B="fakeround")),"miter"===B&&I>a&&(B="bevel"),"bevel"===B&&(I>2&&(B="flipbevel"),I<a&&(B="miter")),y&&(d.distance+=p.dist(y)),"miter"===B)V._mult(I),d.addCurrentVertex(p,d.distance,V,0,0,!1,h);else if("flipbevel"===B){if(I>100)V=x.clone();else{var F=m.x*x.y-m.y*x.x>0?-1:1,k=I*m.add(x).mag()/m.sub(x).mag();V._perp()._mult(k*F)}d.addCurrentVertex(p,d.distance,V,0,0,!1,h),d.addCurrentVertex(p,d.distance,V.mult(-1),0,0,!1,h)}else if("bevel"===B||"fakeround"===B){var D=m.x*x.y-m.y*x.x>0,q=-Math.sqrt(I*I-1);if(D?(A=0,C=q):(C=0,A=q),L||d.addCurrentVertex(p,d.distance,m,C,A,!1,h),"fakeround"===B){for(var P,M=Math.floor(8*(.5-(T-.5))),O=0;O<M;O++)P=x.mult((O+1)/(M+1))._add(m)._unit(),d.addPieSliceVertex(p,d.distance,P,D,h);d.addPieSliceVertex(p,d.distance,V,D,h);for(var U=M-1;U>=0;U--)P=m.mult((U+1)/(M+1))._add(x)._unit(),d.addPieSliceVertex(p,d.distance,P,D,h)}E&&d.addCurrentVertex(p,d.distance,x,-C,-A,!1,h)}else"butt"===B?(L||d.addCurrentVertex(p,d.distance,m,0,0,!1,h),E&&d.addCurrentVertex(p,d.distance,x,0,0,!1,h)):"square"===B?(L||(d.addCurrentVertex(p,d.distance,m,1,1,!1,h),d.e1=d.e2=-1),E&&d.addCurrentVertex(p,d.distance,x,-1,-1,!1,h)):"round"===B&&(L||(d.addCurrentVertex(p,d.distance,m,0,0,!1,h),d.addCurrentVertex(p,d.distance,m,1,1,!0,h),d.e1=d.e2=-1),E&&(d.addCurrentVertex(p,d.distance,x,-1,-1,!0,h),d.addCurrentVertex(p,d.distance,x,0,0,!1,h)));if(N&&S<s-1){var X=p.dist(E);if(X>2*u){var H=p.add(E.sub(p)._mult(u/X)._round());d.distance+=H.dist(p),d.addCurrentVertex(H,d.distance,x.mult(1),0,0,!1,h),p=H}}L=!1}_.populatePaintArrays(t)}}},t.prototype.addCurrentVertex=function(e,t,r,i,a,n,d){var s,u=n?1:0,l=this.arrays,o=l.layoutVertexArray,c=l.elementArray;s=r.clone(),i&&s._sub(r.perp()._mult(i)),addLineVertex(o,e,s,u,0,i,t),this.e3=d.vertexLength++,this.e1>=0&&this.e2>=0&&(c.emplaceBack(this.e1,this.e2,this.e3),d.primitiveLength++),this.e1=this.e2,this.e2=this.e3,s=r.mult(-1),a&&s._sub(r.perp()._mult(a)),addLineVertex(o,e,s,u,1,-a,t),this.e3=d.vertexLength++,this.e1>=0&&this.e2>=0&&(c.emplaceBack(this.e1,this.e2,this.e3),d.primitiveLength++),this.e1=this.e2,this.e2=this.e3,t>MAX_LINE_DISTANCE/2&&(this.distance=0,this.addCurrentVertex(e,this.distance,r,i,a,n,d))},t.prototype.addPieSliceVertex=function(e,t,r,i,a){var n=i?1:0;r=r.mult(i?-1:1);var d=this.arrays,s=d.layoutVertexArray,u=d.elementArray;addLineVertex(s,e,r,0,n,0,t),this.e3=a.vertexLength++,this.e1>=0&&this.e2>=0&&(u.emplaceBack(this.e1,this.e2,this.e3),a.primitiveLength++),i?this.e2=this.e3:this.e1=this.e3},t}(Bucket);module.exports=LineBucket;
	},{"../bucket":2,"../element_array_type":10,"../extent":11,"../load_geometry":13,"../vertex_array_type":17}],7:[function(require,module,exports){
	"use strict";function addVertex(e,t,o,a,r,n,i,s,l,c,y){e.emplaceBack(t,o,Math.round(64*a),Math.round(64*r),n/4,i/4,10*(c||0),y,10*(s||0),10*Math.min(l||25,25))}function addCollisionBoxVertex(e,t,o,a,r){return e.emplaceBack(t.x,t.y,Math.round(o.x),Math.round(o.y),10*a,10*r)}var Point=require("point-geometry"),ArrayGroup=require("../array_group"),BufferGroup=require("../buffer_group"),createVertexArrayType=require("../vertex_array_type"),createElementArrayType=require("../element_array_type"),EXTENT=require("../extent"),Anchor=require("../../symbol/anchor"),getAnchors=require("../../symbol/get_anchors"),resolveTokens=require("../../util/token"),Quads=require("../../symbol/quads"),Shaping=require("../../symbol/shaping"),resolveText=require("../../symbol/resolve_text"),mergeLines=require("../../symbol/mergelines"),clipLine=require("../../symbol/clip_line"),util=require("../../util/util"),scriptDetection=require("../../util/script_detection"),loadGeometry=require("../load_geometry"),CollisionFeature=require("../../symbol/collision_feature"),findPoleOfInaccessibility=require("../../util/find_pole_of_inaccessibility"),classifyRings=require("../../util/classify_rings"),shapeText=Shaping.shapeText,shapeIcon=Shaping.shapeIcon,WritingMode=Shaping.WritingMode,getGlyphQuads=Quads.getGlyphQuads,getIconQuads=Quads.getIconQuads,elementArrayType=createElementArrayType(),layoutVertexArrayType=createVertexArrayType([{name:"a_pos",components:2,type:"Int16"},{name:"a_offset",components:2,type:"Int16"},{name:"a_texture_pos",components:2,type:"Uint16"},{name:"a_data",components:4,type:"Uint8"}]),symbolInterfaces={glyph:{layoutVertexArrayType:layoutVertexArrayType,elementArrayType:elementArrayType},icon:{layoutVertexArrayType:layoutVertexArrayType,elementArrayType:elementArrayType},collisionBox:{layoutVertexArrayType:createVertexArrayType([{name:"a_pos",components:2,type:"Int16"},{name:"a_extrude",components:2,type:"Int16"},{name:"a_data",components:2,type:"Uint8"}]),elementArrayType:createElementArrayType(2)}},SymbolBucket=function(e){var t=this;if(this.collisionBoxArray=e.collisionBoxArray,this.symbolQuadsArray=e.symbolQuadsArray,this.symbolInstancesArray=e.symbolInstancesArray,this.zoom=e.zoom,this.overscaling=e.overscaling,this.layers=e.layers,this.index=e.index,this.sdfIcons=e.sdfIcons,this.iconsNeedLinear=e.iconsNeedLinear,this.adjustedTextSize=e.adjustedTextSize,this.adjustedIconSize=e.adjustedIconSize,this.fontstack=e.fontstack,e.arrays){this.buffers={};for(var o in e.arrays)e.arrays[o]&&(t.buffers[o]=new BufferGroup(symbolInterfaces[o],e.layers,e.zoom,e.arrays[o]))}};SymbolBucket.prototype.populate=function(e,t){var o=this,a=this.layers[0].layout,r=a["text-field"],n=a["text-font"],i=a["icon-image"],s=r&&n,l=i;if(this.features=[],s||l){for(var c=t.iconDependencies,y=t.glyphDependencies,d=y[n]=y[n]||{},h=0;h<e.length;h++){var x=e[h];if(o.layers[0].filter(x)){var u;s&&(u=resolveText(x,a));var m;if(l&&(m=resolveTokens(x.properties,i)),(u||m)&&(o.features.push({text:u,icon:m,index:h,sourceLayerIndex:x.sourceLayerIndex,geometry:loadGeometry(x),properties:x.properties}),m&&(c[m]=!0),u))for(var p=0;p<u.length;p++)d[u.charCodeAt(p)]=!0}}"line"===a["symbol-placement"]&&(this.features=mergeLines(this.features))}},SymbolBucket.prototype.isEmpty=function(){return this.arrays.icon.isEmpty()&&this.arrays.glyph.isEmpty()&&this.arrays.collisionBox.isEmpty()},SymbolBucket.prototype.serialize=function(e){return{zoom:this.zoom,layerIds:this.layers.map(function(e){return e.id}),sdfIcons:this.sdfIcons,iconsNeedLinear:this.iconsNeedLinear,adjustedTextSize:this.adjustedTextSize,adjustedIconSize:this.adjustedIconSize,fontstack:this.fontstack,arrays:util.mapObject(this.arrays,function(t){return t.isEmpty()?null:t.serialize(e)})}},SymbolBucket.prototype.destroy=function(){this.buffers&&(this.buffers.icon&&this.buffers.icon.destroy(),this.buffers.glyph&&this.buffers.glyph.destroy(),this.buffers.collisionBox&&this.buffers.collisionBox.destroy(),this.buffers=null)},SymbolBucket.prototype.createArrays=function(){var e=this;this.arrays=util.mapObject(symbolInterfaces,function(t){return new ArrayGroup(t,e.layers,e.zoom)})},SymbolBucket.prototype.prepare=function(e,t){var o=this;this.createArrays(),this.adjustedTextMaxSize=this.layers[0].getLayoutValue("text-size",{zoom:18}),this.adjustedTextSize=this.layers[0].getLayoutValue("text-size",{zoom:this.zoom+1}),this.adjustedIconMaxSize=this.layers[0].getLayoutValue("icon-size",{zoom:18}),this.adjustedIconSize=this.layers[0].getLayoutValue("icon-size",{zoom:this.zoom+1});var a=512*this.overscaling;this.tilePixelRatio=EXTENT/a,this.compareText={},this.iconsNeedLinear=!1,this.symbolInstancesStartIndex=this.symbolInstancesArray.length;var r=this.layers[0].layout,n=.5,i=.5;switch(r["text-anchor"]){case"right":case"top-right":case"bottom-right":n=1;break;case"left":case"top-left":case"bottom-left":n=0}switch(r["text-anchor"]){case"bottom":case"bottom-right":case"bottom-left":i=1;break;case"top":case"top-right":case"top-left":i=0}for(var s="right"===r["text-justify"]?1:"left"===r["text-justify"]?0:.5,l=24,c=r["text-line-height"]*l,y="line"!==r["symbol-placement"]?r["text-max-width"]*l:0,d=r["text-letter-spacing"]*l,h=[r["text-offset"][0]*l,r["text-offset"][1]*l],x=this.fontstack=r["text-font"].join(","),u="map"===r["text-rotation-alignment"]&&"line"===r["symbol-placement"],m=0,p=this.features;m<p.length;m+=1){var g,f=p[m];if(f.text){var b=scriptDetection.allowsVerticalWritingMode(f.text);g={},g[WritingMode.horizontal]=shapeText(f.text,e[x],y,c,n,i,s,d,h,l,WritingMode.horizontal),g[WritingMode.vertical]=b&&u&&shapeText(f.text,e[x],y,c,n,i,s,d,h,l,WritingMode.vertical)}else g={};var I;if(f.icon){var S=t[f.icon];I=shapeIcon(S,r),S&&(void 0===o.sdfIcons?o.sdfIcons=S.sdf:o.sdfIcons!==S.sdf&&util.warnOnce("Style sheet warning: Cannot mix SDF and non-SDF icons in one buffer"),1!==S.pixelRatio?o.iconsNeedLinear=!0:0===r["icon-rotate"]&&o.layers[0].isLayoutValueFeatureConstant("icon-rotate")||(o.iconsNeedLinear=!0))}(g[WritingMode.horizontal]||I)&&o.addFeature(f,g,I)}this.symbolInstancesEndIndex=this.symbolInstancesArray.length},SymbolBucket.prototype.addFeature=function(e,t,o){var a=this,r=e.geometry,n=this.layers[0].layout,i=24,s=this.adjustedTextSize/i,l=void 0!==this.adjustedTextMaxSize?this.adjustedTextMaxSize:this.adjustedTextSize,c=this.tilePixelRatio*s,y=this.tilePixelRatio*l/i,d=this.tilePixelRatio*this.adjustedIconSize,h=this.tilePixelRatio*n["symbol-spacing"],x=n["symbol-avoid-edges"],u=n["text-padding"]*this.tilePixelRatio,m=n["icon-padding"]*this.tilePixelRatio,p=n["text-max-angle"]/180*Math.PI,g="map"===n["text-rotation-alignment"]&&"line"===n["symbol-placement"],f="map"===n["icon-rotation-alignment"]&&"line"===n["symbol-placement"],b=n["text-allow-overlap"]||n["icon-allow-overlap"]||n["text-ignore-placement"]||n["icon-ignore-placement"],I=n["symbol-placement"],S="line"===I,v=h/2,A=null;A=S?clipLine(r,0,0,EXTENT,EXTENT):classifyRings(r,0);for(var M=0;M<A.length;M++){var B=null,T=A[M],z=null;S?(z=T,B=getAnchors(z,h,p,t[WritingMode.vertical]||t[WritingMode.horizontal],o,i,y,a.overscaling,EXTENT)):(z=T[0],B=a.findPolygonAnchors(T));for(var k=0,E=B.length;k<E;k++){var P=B[k];if(!(t[WritingMode.horizontal]&&S&&a.anchorIsTooClose(t[WritingMode.horizontal].text,v,P))){var _=!(P.x<0||P.x>EXTENT||P.y<0||P.y>EXTENT);if(!x||_){var w=_||b;a.addSymbolInstance(P,z,t,o,a.layers[0],w,a.symbolInstancesArray.length,a.collisionBoxArray,e.index,e.sourceLayerIndex,a.index,c,u,g,d,m,f,{zoom:a.zoom},e.properties)}}}}},SymbolBucket.prototype.findPolygonAnchors=function(e){var t=e[0];if(0===t.length)return[];if(t.length<3||!util.isClosedPolygon(t))return[new Anchor(t[0].x,t[0].y,0)];var o=null,a=findPoleOfInaccessibility(e,16);return o=[new Anchor(a.x,a.y,0)]},SymbolBucket.prototype.anchorIsTooClose=function(e,t,o){var a=this.compareText;if(e in a){for(var r=a[e],n=r.length-1;n>=0;n--)if(o.dist(r[n])<t)return!0}else a[e]=[];return a[e].push(o),!1},SymbolBucket.prototype.place=function(e,t){var o=this;this.createArrays();var a=this.layers[0].layout,r=e.maxScale,n="map"===a["text-rotation-alignment"]&&"line"===a["symbol-placement"],i="map"===a["icon-rotation-alignment"]&&"line"===a["symbol-placement"],s=a["text-allow-overlap"]||a["icon-allow-overlap"]||a["text-ignore-placement"]||a["icon-ignore-placement"];if(s){var l=this.symbolInstancesArray.toArray(this.symbolInstancesStartIndex,this.symbolInstancesEndIndex),c=e.angle,y=Math.sin(c),d=Math.cos(c);this.sortedSymbolInstances=l.sort(function(e,t){var o=y*e.anchorPointX+d*e.anchorPointY|0,a=y*t.anchorPointX+d*t.anchorPointY|0;return o-a||t.index-e.index})}for(var h=this.symbolInstancesStartIndex;h<this.symbolInstancesEndIndex;h++){var x=o.sortedSymbolInstances?o.sortedSymbolInstances[h-o.symbolInstancesStartIndex]:o.symbolInstancesArray.get(h),u={boxStartIndex:x.textBoxStartIndex,boxEndIndex:x.textBoxEndIndex},m={boxStartIndex:x.iconBoxStartIndex,boxEndIndex:x.iconBoxEndIndex},p=!(x.textBoxStartIndex===x.textBoxEndIndex),g=!(x.iconBoxStartIndex===x.iconBoxEndIndex),f=a["text-optional"]||!p,b=a["icon-optional"]||!g,I=p?e.placeCollisionFeature(u,a["text-allow-overlap"],a["symbol-avoid-edges"]):e.minScale,S=g?e.placeCollisionFeature(m,a["icon-allow-overlap"],a["symbol-avoid-edges"]):e.minScale;f||b?!b&&I?I=Math.max(S,I):!f&&S&&(S=Math.max(S,I)):S=I=Math.max(S,I),p&&(e.insertCollisionFeature(u,I,a["text-ignore-placement"]),I<=r&&o.addSymbols(o.arrays.glyph,x.glyphQuadStartIndex,x.glyphQuadEndIndex,I,a["text-keep-upright"],n,e.angle,x.writingModes)),g&&(e.insertCollisionFeature(m,S,a["icon-ignore-placement"]),S<=r&&o.addSymbols(o.arrays.icon,x.iconQuadStartIndex,x.iconQuadEndIndex,S,a["icon-keep-upright"],i,e.angle))}t&&this.addToDebugBuffers(e)},SymbolBucket.prototype.addSymbols=function(e,t,o,a,r,n,i,s){for(var l=this,c=e.elementArray,y=e.layoutVertexArray,d=this.zoom,h=Math.max(Math.log(a)/Math.LN2+d,0),x=t;x<o;x++){var u=l.symbolQuadsArray.get(x).SymbolQuad,m=(u.anchorAngle+i+Math.PI)%(2*Math.PI);if(s&WritingMode.vertical){if(n&&u.writingMode===WritingMode.vertical){if(r&&n&&m<=5*Math.PI/4||m>7*Math.PI/4)continue}else if(r&&n&&m<=3*Math.PI/4||m>5*Math.PI/4)continue}else if(r&&n&&(m<=Math.PI/2||m>3*Math.PI/2))continue;var p=u.tl,g=u.tr,f=u.bl,b=u.br,I=u.tex,S=u.anchorPoint,v=Math.max(d+Math.log(u.minScale)/Math.LN2,h),A=Math.min(d+Math.log(u.maxScale)/Math.LN2,25);if(!(A<=v)){v===h&&(v=0);var M=Math.round(u.glyphAngle/(2*Math.PI)*256),B=e.prepareSegment(4),T=B.vertexLength;addVertex(y,S.x,S.y,p.x,p.y,I.x,I.y,v,A,h,M),addVertex(y,S.x,S.y,g.x,g.y,I.x+I.w,I.y,v,A,h,M),addVertex(y,S.x,S.y,f.x,f.y,I.x,I.y+I.h,v,A,h,M),addVertex(y,S.x,S.y,b.x,b.y,I.x+I.w,I.y+I.h,v,A,h,M),c.emplaceBack(T,T+1,T+2),c.emplaceBack(T+1,T+2,T+3),B.vertexLength+=4,B.primitiveLength+=2}}},SymbolBucket.prototype.addToDebugBuffers=function(e){for(var t=this,o=this.arrays.collisionBox,a=o.layoutVertexArray,r=o.elementArray,n=-e.angle,i=e.yStretch,s=this.symbolInstancesStartIndex;s<this.symbolInstancesEndIndex;s++){var l=t.symbolInstancesArray.get(s);l.textCollisionFeature={boxStartIndex:l.textBoxStartIndex,boxEndIndex:l.textBoxEndIndex},l.iconCollisionFeature={boxStartIndex:l.iconBoxStartIndex,boxEndIndex:l.iconBoxEndIndex};for(var c=0;c<2;c++){var y=l[0===c?"textCollisionFeature":"iconCollisionFeature"];if(y)for(var d=y.boxStartIndex;d<y.boxEndIndex;d++){var h=t.collisionBoxArray.get(d),x=h.anchorPoint,u=new Point(h.x1,h.y1*i)._rotate(n),m=new Point(h.x2,h.y1*i)._rotate(n),p=new Point(h.x1,h.y2*i)._rotate(n),g=new Point(h.x2,h.y2*i)._rotate(n),f=Math.max(0,Math.min(25,t.zoom+Math.log(h.maxScale)/Math.LN2)),b=Math.max(0,Math.min(25,t.zoom+Math.log(h.placementScale)/Math.LN2)),I=o.prepareSegment(4),S=I.vertexLength;addCollisionBoxVertex(a,x,u,f,b),addCollisionBoxVertex(a,x,m,f,b),addCollisionBoxVertex(a,x,g,f,b),addCollisionBoxVertex(a,x,p,f,b),r.emplaceBack(S,S+1),r.emplaceBack(S+1,S+2),r.emplaceBack(S+2,S+3),r.emplaceBack(S+3,S),I.vertexLength+=4,I.primitiveLength+=4}}}},SymbolBucket.prototype.addSymbolInstance=function(e,t,o,a,r,n,i,s,l,c,y,d,h,x,u,m,p,g,f){var b,I,S,v=this,A=[];for(var M in o){var B=parseInt(M,10);o[B]&&(A=A.concat(n?getGlyphQuads(e,o[B],d,t,r,x,B):[]),b=new CollisionFeature(s,t,e,l,c,y,o[B],d,h,x,!1))}var T=this.symbolQuadsArray.length;if(A&&A.length)for(var z=0;z<A.length;z++)v.addSymbolQuad(A[z]);var k=this.symbolQuadsArray.length,E=b?b.boxStartIndex:this.collisionBoxArray.length,P=b?b.boxEndIndex:this.collisionBoxArray.length;a&&(S=n?getIconQuads(e,a,u,t,r,p,o[WritingMode.horizontal],g,f):[],I=new CollisionFeature(s,t,e,l,c,y,a,u,m,p,!0));var _=this.symbolQuadsArray.length;S&&1===S.length&&this.addSymbolQuad(S[0]);var w=this.symbolQuadsArray.length,L=I?I.boxStartIndex:this.collisionBoxArray.length,Q=I?I.boxEndIndex:this.collisionBoxArray.length;w>SymbolBucket.MAX_QUADS&&util.warnOnce("Too many symbols being rendered in a tile. See https://github.com/mapbox/mapbox-gl-js/issues/2907"),k>SymbolBucket.MAX_QUADS&&util.warnOnce("Too many glyphs being rendered in a tile. See https://github.com/mapbox/mapbox-gl-js/issues/2907");var V=(o[WritingMode.vertical]?WritingMode.vertical:0)|(o[WritingMode.horizontal]?WritingMode.horizontal:0);return this.symbolInstancesArray.emplaceBack(E,P,L,Q,T,k,_,w,e.x,e.y,i,V)},SymbolBucket.prototype.addSymbolQuad=function(e){return this.symbolQuadsArray.emplaceBack(e.anchorPoint.x,e.anchorPoint.y,e.tl.x,e.tl.y,e.tr.x,e.tr.y,e.bl.x,e.bl.y,e.br.x,e.br.y,e.tex.h,e.tex.w,e.tex.x,e.tex.y,e.anchorAngle,e.glyphAngle,e.maxScale,e.minScale,e.writingMode)},SymbolBucket.MAX_QUADS=65535,module.exports=SymbolBucket;
	},{"../../symbol/anchor":72,"../../symbol/clip_line":74,"../../symbol/collision_feature":76,"../../symbol/get_anchors":78,"../../symbol/mergelines":81,"../../symbol/quads":82,"../../symbol/resolve_text":83,"../../symbol/shaping":84,"../../util/classify_rings":110,"../../util/find_pole_of_inaccessibility":116,"../../util/script_detection":123,"../../util/token":125,"../../util/util":126,"../array_group":1,"../buffer_group":9,"../element_array_type":10,"../extent":11,"../load_geometry":13,"../vertex_array_type":17,"point-geometry":195}],8:[function(require,module,exports){
	"use strict";var AttributeType={Int8:"BYTE",Uint8:"UNSIGNED_BYTE",Int16:"SHORT",Uint16:"UNSIGNED_SHORT"},Buffer=function(e,t,r){this.arrayBuffer=e.arrayBuffer,this.length=e.length,this.attributes=t.members,this.itemSize=t.bytesPerElement,this.type=r,this.arrayType=t};Buffer.fromStructArray=function(e,t){return new Buffer(e.serialize(),e.constructor.serialize(),t)},Buffer.prototype.bind=function(e){var t=e[this.type];this.buffer?e.bindBuffer(t,this.buffer):(this.gl=e,this.buffer=e.createBuffer(),e.bindBuffer(t,this.buffer),e.bufferData(t,this.arrayBuffer,e.STATIC_DRAW),this.arrayBuffer=null)},Buffer.prototype.setVertexAttribPointers=function(e,t,r){for(var f=this,i=0;i<this.attributes.length;i++){var u=f.attributes[i],s=t[u.name];void 0!==s&&e.vertexAttribPointer(s,u.components,e[AttributeType[u.type]],!1,f.arrayType.bytesPerElement,u.offset+(f.arrayType.bytesPerElement*r||0))}},Buffer.prototype.destroy=function(){this.buffer&&this.gl.deleteBuffer(this.buffer)},Buffer.BufferType={VERTEX:"ARRAY_BUFFER",ELEMENT:"ELEMENT_ARRAY_BUFFER"},module.exports=Buffer;
	},{}],9:[function(require,module,exports){
	"use strict";var util=require("../util/util"),Buffer=require("./buffer"),ProgramConfiguration=require("./program_configuration"),VertexArrayObject=require("../render/vertex_array_object"),BufferGroup=function(e,r,t,a){var f=this;this.layoutVertexBuffer=new Buffer(a.layoutVertexArray,e.layoutVertexArrayType.serialize(),Buffer.BufferType.VERTEX),a.elementArray&&(this.elementBuffer=new Buffer(a.elementArray,e.elementArrayType.serialize(),Buffer.BufferType.ELEMENT)),a.elementArray2&&(this.elementBuffer2=new Buffer(a.elementArray2,e.elementArrayType2.serialize(),Buffer.BufferType.ELEMENT)),this.layerData={};for(var i=0,n=r;i<n.length;i+=1){var u=n[i],s=a.paintVertexArrays&&a.paintVertexArrays[u.id],o=ProgramConfiguration.createDynamic(e.paintAttributes||[],u,t),y=s?new Buffer(s.array,s.type,Buffer.BufferType.VERTEX):null;f.layerData[u.id]={programConfiguration:o,paintVertexBuffer:y}}this.segments=a.segments,this.segments2=a.segments2;for(var l=0,m=[this.segments,this.segments2];l<m.length;l+=1)for(var B=m[l],h=0,p=B||[];h<p.length;h+=1){var g=p[h];g.vaos=util.mapObject(f.layerData,function(){return new VertexArrayObject})}};BufferGroup.prototype.destroy=function(){var e=this;this.layoutVertexBuffer.destroy(),this.elementBuffer&&this.elementBuffer.destroy(),this.elementBuffer2&&this.elementBuffer2.destroy();for(var r in this.layerData){var t=e.layerData[r].paintVertexBuffer;t&&t.destroy()}for(var a=0,f=[this.segments,this.segments2];a<f.length;a+=1)for(var i=f[a],n=0,u=i||[];n<u.length;n+=1){var s=u[n];for(var o in s.vaos)s.vaos[o].destroy()}},module.exports=BufferGroup;
	},{"../render/vertex_array_object":38,"../util/util":126,"./buffer":8,"./program_configuration":15}],10:[function(require,module,exports){
	"use strict";function createElementArrayType(e){return createStructArrayType({members:[{type:"Uint16",name:"vertices",components:e||3}]})}var createStructArrayType=require("../util/struct_array");module.exports=createElementArrayType;
	},{"../util/struct_array":124}],11:[function(require,module,exports){
	"use strict";module.exports=8192;
	},{}],12:[function(require,module,exports){
	"use strict";function translateDistance(e){return Math.sqrt(e[0]*e[0]+e[1]*e[1])}function topDownFeatureComparator(e,t){return t-e}function getLineWidth(e){return e["line-gap-width"]>0?e["line-gap-width"]+2*e["line-width"]:e["line-width"]}function translate(e,t,r,i,n){if(!t[0]&&!t[1])return e;t=Point.convert(t),"viewport"===r&&t._rotate(-i);for(var a=[],o=0;o<e.length;o++){for(var s=e[o],l=[],u=0;u<s.length;u++)l.push(s[u].sub(t._mult(n)));a.push(l)}return a}function offsetLine(e,t){for(var r=[],i=new Point(0,0),n=0;n<e.length;n++){for(var a=e[n],o=[],s=0;s<a.length;s++){var l=a[s-1],u=a[s],c=a[s+1],y=0===s?i:u.sub(l)._unit()._perp(),f=s===a.length-1?i:c.sub(u)._unit()._perp(),d=y._add(f)._unit(),h=d.x*f.x+d.y*f.y;d._mult(1/h),o.push(d._mult(t)._add(u))}r.push(o)}return r}var Point=require("point-geometry"),loadGeometry=require("./load_geometry"),EXTENT=require("./extent"),featureFilter=require("feature-filter"),createStructArrayType=require("../util/struct_array"),Grid=require("grid-index"),DictionaryCoder=require("../util/dictionary_coder"),vt=require("vector-tile"),Protobuf=require("pbf"),GeoJSONFeature=require("../util/vectortile_to_geojson"),arraysIntersect=require("../util/util").arraysIntersect,intersection=require("../util/intersection_tests"),multiPolygonIntersectsBufferedMultiPoint=intersection.multiPolygonIntersectsBufferedMultiPoint,multiPolygonIntersectsMultiPolygon=intersection.multiPolygonIntersectsMultiPolygon,multiPolygonIntersectsBufferedMultiLine=intersection.multiPolygonIntersectsBufferedMultiLine,FeatureIndexArray=createStructArrayType({members:[{type:"Uint32",name:"featureIndex"},{type:"Uint16",name:"sourceLayerIndex"},{type:"Uint16",name:"bucketIndex"}]}),FeatureIndex=function(e,t,r){if(e.grid){var i=e,n=t;e=i.coord,t=i.overscaling,this.grid=new Grid(i.grid),this.featureIndexArray=new FeatureIndexArray(i.featureIndexArray),this.rawTileData=n,this.bucketLayerIDs=i.bucketLayerIDs}else this.grid=new Grid(EXTENT,16,0),this.featureIndexArray=new FeatureIndexArray;this.coord=e,this.overscaling=t,this.x=e.x,this.y=e.y,this.z=e.z-Math.log(t)/Math.LN2,this.setCollisionTile(r)};FeatureIndex.prototype.insert=function(e,t){var r=this,i=this.featureIndexArray.length;this.featureIndexArray.emplaceBack(e.index,e.sourceLayerIndex,t);for(var n=loadGeometry(e),a=0;a<n.length;a++){for(var o=n[a],s=[1/0,1/0,-(1/0),-(1/0)],l=0;l<o.length;l++){var u=o[l];s[0]=Math.min(s[0],u.x),s[1]=Math.min(s[1],u.y),s[2]=Math.max(s[2],u.x),s[3]=Math.max(s[3],u.y)}r.grid.insert(i,s[0],s[1],s[2],s[3])}},FeatureIndex.prototype.setCollisionTile=function(e){this.collisionTile=e},FeatureIndex.prototype.serialize=function(e){var t=this.grid.toArrayBuffer();return e&&e.push(t),{coord:this.coord,overscaling:this.overscaling,grid:t,featureIndexArray:this.featureIndexArray.serialize(e),bucketLayerIDs:this.bucketLayerIDs}},FeatureIndex.prototype.query=function(e,t){this.vtLayers||(this.vtLayers=new vt.VectorTile(new Protobuf(this.rawTileData)).layers,this.sourceLayerCoder=new DictionaryCoder(this.vtLayers?Object.keys(this.vtLayers).sort():["_geojsonTileLayer"]));var r={},i=e.params||{},n=EXTENT/e.tileSize/e.scale,a=featureFilter(i.filter),o=0;for(var s in t){var l=t[s],u=l.paint,c=0;"line"===l.type?c=getLineWidth(u)/2+Math.abs(u["line-offset"])+translateDistance(u["line-translate"]):"fill"===l.type?c=translateDistance(u["fill-translate"]):"fill-extrusion"===l.type?c=translateDistance(u["fill-extrusion-translate"]):"circle"===l.type&&(c=u["circle-radius"]+translateDistance(u["circle-translate"])),o=Math.max(o,c*n)}for(var y=e.queryGeometry.map(function(e){return e.map(function(e){return new Point(e.x,e.y)})}),f=1/0,d=1/0,h=-(1/0),g=-(1/0),p=0;p<y.length;p++)for(var v=y[p],x=0;x<v.length;x++){var I=v[x];f=Math.min(f,I.x),d=Math.min(d,I.y),h=Math.max(h,I.x),g=Math.max(g,I.y)}var m=this.grid.query(f-o,d-o,h+o,g+o);m.sort(topDownFeatureComparator),this.filterMatching(r,m,this.featureIndexArray,y,a,i.layers,t,e.bearing,n);var L=this.collisionTile.queryRenderedSymbols(y,e.scale);return L.sort(),this.filterMatching(r,L,this.collisionTile.collisionBoxArray,y,a,i.layers,t,e.bearing,n),r},FeatureIndex.prototype.filterMatching=function(e,t,r,i,n,a,o,s,l){for(var u,c=this,y=0;y<t.length;y++){var f=t[y];if(f!==u){u=f;var d=r.get(f),h=c.bucketLayerIDs[d.bucketIndex];if(!a||arraysIntersect(a,h)){var g=c.sourceLayerCoder.decode(d.sourceLayerIndex),p=c.vtLayers[g],v=p.feature(d.featureIndex);if(n(v))for(var x=null,I=0;I<h.length;I++){var m=h[I];if(!(a&&a.indexOf(m)<0)){var L=o[m];if(L){var M;if("symbol"!==L.type){x||(x=loadGeometry(v));var P=L.paint;if("line"===L.type){M=translate(i,P["line-translate"],P["line-translate-anchor"],s,l);var b=getLineWidth(P)/2*l;if(P["line-offset"]&&(x=offsetLine(x,P["line-offset"]*l)),!multiPolygonIntersectsBufferedMultiLine(M,x,b))continue}else if("fill"===L.type||"fill-extrusion"===L.type){var w=L.type;if(M=translate(i,P[w+"-translate"],P[w+"-translate-anchor"],s,l),!multiPolygonIntersectsMultiPolygon(M,x))continue}else if("circle"===L.type){M=translate(i,P["circle-translate"],P["circle-translate-anchor"],s,l);var _=P["circle-radius"]*l;if(!multiPolygonIntersectsBufferedMultiPoint(M,x,_))continue}}var q=new GeoJSONFeature(v,c.z,c.x,c.y);q.layer=L.serialize();var T=e[m];void 0===T&&(T=e[m]=[]),T.push(q)}}}}}}},module.exports=FeatureIndex;
	},{"../util/dictionary_coder":112,"../util/intersection_tests":119,"../util/struct_array":124,"../util/util":126,"../util/vectortile_to_geojson":127,"./extent":11,"./load_geometry":13,"feature-filter":137,"grid-index":159,"pbf":193,"point-geometry":195,"vector-tile":205}],13:[function(require,module,exports){
	"use strict";function createBounds(e){return{min:-1*Math.pow(2,e-1),max:Math.pow(2,e-1)-1}}var util=require("../util/util"),EXTENT=require("./extent"),boundsLookup={15:createBounds(15),16:createBounds(16)};module.exports=function(e,t){for(var r=boundsLookup[t||16],o=EXTENT/e.extent,u=e.loadGeometry(),n=0;n<u.length;n++)for(var a=u[n],i=0;i<a.length;i++){var d=a[i];d.x=Math.round(d.x*o),d.y=Math.round(d.y*o),(d.x<r.min||d.x>r.max||d.y<r.min||d.y>r.max)&&util.warnOnce("Geometry exceeds allowed extent, reduce your vector tile buffer size")}return u};
	},{"../util/util":126,"./extent":11}],14:[function(require,module,exports){
	"use strict";var createStructArrayType=require("../util/struct_array"),PosArray=createStructArrayType({members:[{name:"a_pos",type:"Int16",components:2}]});module.exports=PosArray;
	},{"../util/struct_array":124}],15:[function(require,module,exports){
	"use strict";function getPaintAttributeValue(t,e,r,i){if(!t.zoomStops)return e.getPaintValue(t.property,r,i);var a=t.zoomStops.map(function(a){return e.getPaintValue(t.property,util.extend({},r,{zoom:a}),i)});return 1===a.length?a[0]:a}function normalizePaintAttribute(t,e){var r=t.property.replace(e.type+"-","").replace(/-/g,"_"),i="color"===e._paintSpecifications[t.property].type;return util.extend({name:"a_"+r,components:i?4:1,multiplier:i?255:1},t)}var createVertexArrayType=require("./vertex_array_type"),util=require("../util/util"),ProgramConfiguration=function(){this.attributes=[],this.uniforms=[],this.interpolationUniforms=[],this.pragmas={vertex:{},fragment:{}},this.cacheKey=""};ProgramConfiguration.createDynamic=function(t,e,r){for(var i=new ProgramConfiguration,a=0,n=t;a<n.length;a+=1){var o=n[a],p=normalizePaintAttribute(o,e),u=p.name.slice(2);e.isPaintValueFeatureConstant(p.property)?i.addZoomAttribute(u,p):e.isPaintValueZoomConstant(p.property)?i.addPropertyAttribute(u,p):i.addZoomAndPropertyAttribute(u,p,e,r)}return i.PaintVertexArray=createVertexArrayType(i.attributes),i},ProgramConfiguration.createStatic=function(t){for(var e=new ProgramConfiguration,r=0,i=t;r<i.length;r+=1){var a=i[r];e.addUniform(a,"u_"+a)}return e},ProgramConfiguration.prototype.addUniform=function(t,e){var r=this.getPragmas(t);r.define.push("uniform {precision} {type} "+e+";"),r.initialize.push("{precision} {type} "+t+" = "+e+";"),this.cacheKey+="/u_"+t},ProgramConfiguration.prototype.addZoomAttribute=function(t,e){this.uniforms.push(e),this.addUniform(t,e.name)},ProgramConfiguration.prototype.addPropertyAttribute=function(t,e){var r=this.getPragmas(t);this.attributes.push(e),r.define.push("varying {precision} {type} "+t+";"),r.vertex.define.push("attribute {precision} {type} "+e.name+";"),r.vertex.initialize.push(t+" = "+e.name+" / "+e.multiplier+".0;"),this.cacheKey+="/a_"+t},ProgramConfiguration.prototype.addZoomAndPropertyAttribute=function(t,e,r,i){var a=this,n=this.getPragmas(t);n.define.push("varying {precision} {type} "+t+";");for(var o=0,p=r.getPaintValueStopZoomLevels(e.property);o<p.length&&p[o]<i;)o++;var u=Math.max(0,Math.min(p.length-4,o-2)),s="u_"+t+"_t";n.vertex.define.push("uniform lowp float "+s+";"),this.interpolationUniforms.push({name:s,property:e.property,stopOffset:u});for(var m=[],f=0;f<4;f++)m.push(p[Math.min(u+f,p.length-1)]);var g=[];if(1===e.components)this.attributes.push(util.extend({},e,{components:4,zoomStops:m})),n.vertex.define.push("attribute {precision} vec4 "+e.name+";"),g.push(e.name);else for(var h=0;h<4;h++){var l=e.name+h;g.push(l),a.attributes.push(util.extend({},e,{name:l,zoomStops:[m[h]]})),n.vertex.define.push("attribute {precision} {type} "+l+";")}n.vertex.initialize.push(t+" = evaluate_zoom_function_"+e.components+"(            "+g.join(", ")+", "+s+") / "+e.multiplier+".0;"),this.cacheKey+="/z_"+t},ProgramConfiguration.prototype.getPragmas=function(t){return this.pragmas[t]||(this.pragmas[t]={define:[],initialize:[]},this.pragmas[t].fragment={define:[],initialize:[]},this.pragmas[t].vertex={define:[],initialize:[]}),this.pragmas[t]},ProgramConfiguration.prototype.applyPragmas=function(t,e){var r=this;return t.replace(/#pragma mapbox: ([\w]+) ([\w]+) ([\w]+) ([\w]+)/g,function(t,i,a,n,o){return r.pragmas[o][i].concat(r.pragmas[o][e][i]).join("\n").replace(/{type}/g,n).replace(/{precision}/g,a)})},ProgramConfiguration.prototype.populatePaintArray=function(t,e,r,i,a){var n=e.length;e.resize(r);for(var o=0,p=this.attributes;o<p.length;o+=1)for(var u=p[o],s=getPaintAttributeValue(u,t,i,a),m=n;m<r;m++){var f=e.get(m);if(4===u.components)for(var g=0;g<4;g++)f[u.name+g]=s[g]*u.multiplier;else f[u.name]=s*u.multiplier}},ProgramConfiguration.prototype.setUniforms=function(t,e,r,i){for(var a=0,n=this.uniforms;a<n.length;a+=1){var o=n[a],p=r.getPaintValue(o.property,i);4===o.components?t.uniform4fv(e[o.name],p):t.uniform1f(e[o.name],p)}for(var u=0,s=this.interpolationUniforms;u<s.length;u+=1){var m=s[u],f=r.getPaintInterpolationT(m.property,i);t.uniform1f(e[m.name],Math.max(0,Math.min(4,f-m.stopOffset)))}},module.exports=ProgramConfiguration;
	},{"../util/util":126,"./vertex_array_type":17}],16:[function(require,module,exports){
	"use strict";var createStructArrayType=require("../util/struct_array"),RasterBoundsArray=createStructArrayType({members:[{name:"a_pos",type:"Int16",components:2},{name:"a_texture_pos",type:"Int16",components:2}]});module.exports=RasterBoundsArray;
	},{"../util/struct_array":124}],17:[function(require,module,exports){
	"use strict";function createVertexArrayType(r){return createStructArrayType({members:r,alignment:4})}var createStructArrayType=require("../util/struct_array");module.exports=createVertexArrayType;
	},{"../util/struct_array":124}],18:[function(require,module,exports){
	"use strict";var Coordinate=function(o,t,n){this.column=o,this.row=t,this.zoom=n};Coordinate.prototype.clone=function(){return new Coordinate(this.column,this.row,this.zoom)},Coordinate.prototype.zoomTo=function(o){return this.clone()._zoomTo(o)},Coordinate.prototype.sub=function(o){return this.clone()._sub(o)},Coordinate.prototype._zoomTo=function(o){var t=Math.pow(2,o-this.zoom);return this.column*=t,this.row*=t,this.zoom=o,this},Coordinate.prototype._sub=function(o){return o=o.zoomTo(this.zoom),this.column-=o.column,this.row-=o.row,this},module.exports=Coordinate;
	},{}],19:[function(require,module,exports){
	"use strict";var wrap=require("../util/util").wrap,LngLat=function(t,n){if(isNaN(t)||isNaN(n))throw new Error("Invalid LngLat object: ("+t+", "+n+")");if(this.lng=+t,this.lat=+n,this.lat>90||this.lat<-90)throw new Error("Invalid LngLat latitude value: must be between -90 and 90")};LngLat.prototype.wrap=function(){return new LngLat(wrap(this.lng,-180,180),this.lat)},LngLat.prototype.toArray=function(){return[this.lng,this.lat]},LngLat.prototype.toString=function(){return"LngLat("+this.lng+", "+this.lat+")"},LngLat.convert=function(t){if(t instanceof LngLat)return t;if(t&&t.hasOwnProperty("lng")&&t.hasOwnProperty("lat"))return new LngLat(t.lng,t.lat);if(Array.isArray(t)&&2===t.length)return new LngLat(t[0],t[1]);throw new Error("`LngLatLike` argument must be specified as a LngLat instance, an object {lng: <lng>, lat: <lat>}, or an array of [<lng>, <lat>]")},module.exports=LngLat;
	},{"../util/util":126}],20:[function(require,module,exports){
	"use strict";var LngLat=require("./lng_lat"),LngLatBounds=function(t,n){t&&(n?this.setSouthWest(t).setNorthEast(n):4===t.length?this.setSouthWest([t[0],t[1]]).setNorthEast([t[2],t[3]]):this.setSouthWest(t[0]).setNorthEast(t[1]))};LngLatBounds.prototype.setNorthEast=function(t){return this._ne=LngLat.convert(t),this},LngLatBounds.prototype.setSouthWest=function(t){return this._sw=LngLat.convert(t),this},LngLatBounds.prototype.extend=function(t){var n,e,s=this._sw,o=this._ne;if(t instanceof LngLat)n=t,e=t;else{if(!(t instanceof LngLatBounds))return Array.isArray(t)?t.every(Array.isArray)?this.extend(LngLatBounds.convert(t)):this.extend(LngLat.convert(t)):this;if(n=t._sw,e=t._ne,!n||!e)return this}return s||o?(s.lng=Math.min(n.lng,s.lng),s.lat=Math.min(n.lat,s.lat),o.lng=Math.max(e.lng,o.lng),o.lat=Math.max(e.lat,o.lat)):(this._sw=new LngLat(n.lng,n.lat),this._ne=new LngLat(e.lng,e.lat)),this},LngLatBounds.prototype.getCenter=function(){return new LngLat((this._sw.lng+this._ne.lng)/2,(this._sw.lat+this._ne.lat)/2)},LngLatBounds.prototype.getSouthWest=function(){return this._sw},LngLatBounds.prototype.getNorthEast=function(){return this._ne},LngLatBounds.prototype.getNorthWest=function(){return new LngLat(this.getWest(),this.getNorth())},LngLatBounds.prototype.getSouthEast=function(){return new LngLat(this.getEast(),this.getSouth())},LngLatBounds.prototype.getWest=function(){return this._sw.lng},LngLatBounds.prototype.getSouth=function(){return this._sw.lat},LngLatBounds.prototype.getEast=function(){return this._ne.lng},LngLatBounds.prototype.getNorth=function(){return this._ne.lat},LngLatBounds.prototype.toArray=function(){return[this._sw.toArray(),this._ne.toArray()]},LngLatBounds.prototype.toString=function(){return"LngLatBounds("+this._sw.toString()+", "+this._ne.toString()+")"},LngLatBounds.convert=function(t){return!t||t instanceof LngLatBounds?t:new LngLatBounds(t)},module.exports=LngLatBounds;
	},{"./lng_lat":19}],21:[function(require,module,exports){
	"use strict";var LngLat=require("./lng_lat"),Point=require("point-geometry"),Coordinate=require("./coordinate"),util=require("../util/util"),interp=require("../util/interpolate"),TileCoord=require("../source/tile_coord"),EXTENT=require("../data/extent"),glmatrix=require("gl-matrix"),vec4=glmatrix.vec4,mat4=glmatrix.mat4,mat2=glmatrix.mat2,Transform=function(t,i){this.tileSize=512,this._minZoom=t||0,this._maxZoom=i||22,this.latRange=[-85.05113,85.05113],this.width=0,this.height=0,this._center=new LngLat(0,0),this.zoom=0,this.angle=0,this._altitude=1.5,this._pitch=0,this._unmodified=!0},prototypeAccessors={minZoom:{},maxZoom:{},worldSize:{},centerPoint:{},size:{},bearing:{},pitch:{},altitude:{},zoom:{},center:{},unmodified:{},x:{},y:{},point:{}};prototypeAccessors.minZoom.get=function(){return this._minZoom},prototypeAccessors.minZoom.set=function(t){this._minZoom!==t&&(this._minZoom=t,this.zoom=Math.max(this.zoom,t))},prototypeAccessors.maxZoom.get=function(){return this._maxZoom},prototypeAccessors.maxZoom.set=function(t){this._maxZoom!==t&&(this._maxZoom=t,this.zoom=Math.min(this.zoom,t))},prototypeAccessors.worldSize.get=function(){return this.tileSize*this.scale},prototypeAccessors.centerPoint.get=function(){return this.size._div(2)},prototypeAccessors.size.get=function(){return new Point(this.width,this.height)},prototypeAccessors.bearing.get=function(){return-this.angle/Math.PI*180},prototypeAccessors.bearing.set=function(t){var i=-util.wrap(t,-180,180)*Math.PI/180;this.angle!==i&&(this._unmodified=!1,this.angle=i,this._calcMatrices(),this.rotationMatrix=mat2.create(),mat2.rotate(this.rotationMatrix,this.rotationMatrix,this.angle))},prototypeAccessors.pitch.get=function(){return this._pitch/Math.PI*180},prototypeAccessors.pitch.set=function(t){var i=util.clamp(t,0,60)/180*Math.PI;this._pitch!==i&&(this._unmodified=!1,this._pitch=i,this._calcMatrices())},prototypeAccessors.altitude.get=function(){return this._altitude},prototypeAccessors.altitude.set=function(t){var i=Math.max(.75,t);this._altitude!==i&&(this._unmodified=!1,this._altitude=i,this._calcMatrices())},prototypeAccessors.zoom.get=function(){return this._zoom},prototypeAccessors.zoom.set=function(t){var i=Math.min(Math.max(t,this.minZoom),this.maxZoom);this._zoom!==i&&(this._unmodified=!1,this._zoom=i,this.scale=this.zoomScale(i),this.tileZoom=Math.floor(i),this.zoomFraction=i-this.tileZoom,this._constrain(),this._calcMatrices())},prototypeAccessors.center.get=function(){return this._center},prototypeAccessors.center.set=function(t){t.lat===this._center.lat&&t.lng===this._center.lng||(this._unmodified=!1,this._center=t,this._constrain(),this._calcMatrices())},Transform.prototype.coveringZoomLevel=function(t){return(t.roundZoom?Math.round:Math.floor)(this.zoom+this.scaleZoom(this.tileSize/t.tileSize))},Transform.prototype.coveringTiles=function(t){var i=this.coveringZoomLevel(t),o=i;if(i<t.minzoom)return[];i>t.maxzoom&&(i=t.maxzoom);var e=this,r=e.locationCoordinate(e.center)._zoomTo(i),n=new Point(r.column-.5,r.row-.5);return TileCoord.cover(i,[e.pointCoordinate(new Point(0,0))._zoomTo(i),e.pointCoordinate(new Point(e.width,0))._zoomTo(i),e.pointCoordinate(new Point(e.width,e.height))._zoomTo(i),e.pointCoordinate(new Point(0,e.height))._zoomTo(i)],t.reparseOverscaled?o:i).sort(function(t,i){return n.dist(t)-n.dist(i)})},Transform.prototype.resize=function(t,i){this.width=t,this.height=i,this.pixelsToGLUnits=[2/t,-2/i],this._constrain(),this._calcMatrices()},prototypeAccessors.unmodified.get=function(){return this._unmodified},Transform.prototype.zoomScale=function(t){return Math.pow(2,t)},Transform.prototype.scaleZoom=function(t){return Math.log(t)/Math.LN2},Transform.prototype.project=function(t,i){return new Point(this.lngX(t.lng,i),this.latY(t.lat,i))},Transform.prototype.unproject=function(t,i){return new LngLat(this.xLng(t.x,i),this.yLat(t.y,i))},prototypeAccessors.x.get=function(){return this.lngX(this.center.lng)},prototypeAccessors.y.get=function(){return this.latY(this.center.lat)},prototypeAccessors.point.get=function(){return new Point(this.x,this.y)},Transform.prototype.lngX=function(t,i){return(180+t)*(i||this.worldSize)/360},Transform.prototype.latY=function(t,i){var o=180/Math.PI*Math.log(Math.tan(Math.PI/4+t*Math.PI/360));return(180-o)*(i||this.worldSize)/360},Transform.prototype.xLng=function(t,i){return 360*t/(i||this.worldSize)-180},Transform.prototype.yLat=function(t,i){var o=180-360*t/(i||this.worldSize);return 360/Math.PI*Math.atan(Math.exp(o*Math.PI/180))-90},Transform.prototype.panBy=function(t){var i=this.centerPoint._add(t);this.center=this.pointLocation(i)},Transform.prototype.setLocationAtPoint=function(t,i){var o=this.locationCoordinate(t),e=this.pointCoordinate(i),r=this.pointCoordinate(this.centerPoint),n=e._sub(o);this._unmodified=!1,this.center=this.coordinateLocation(r._sub(n))},Transform.prototype.locationPoint=function(t){return this.coordinatePoint(this.locationCoordinate(t))},Transform.prototype.pointLocation=function(t){return this.coordinateLocation(this.pointCoordinate(t))},Transform.prototype.locationCoordinate=function(t){var i=this.zoomScale(this.tileZoom)/this.worldSize,o=LngLat.convert(t);return new Coordinate(this.lngX(o.lng)*i,this.latY(o.lat)*i,this.tileZoom)},Transform.prototype.coordinateLocation=function(t){var i=this.zoomScale(t.zoom);return new LngLat(this.xLng(t.column,i),this.yLat(t.row,i))},Transform.prototype.pointCoordinate=function(t){var i=0,o=[t.x,t.y,0,1],e=[t.x,t.y,1,1];vec4.transformMat4(o,o,this.pixelMatrixInverse),vec4.transformMat4(e,e,this.pixelMatrixInverse);var r=o[3],n=e[3],s=o[0]/r,a=e[0]/n,h=o[1]/r,c=e[1]/n,m=o[2]/r,l=e[2]/n,p=m===l?0:(i-m)/(l-m),u=this.worldSize/this.zoomScale(this.tileZoom);return new Coordinate(interp(s,a,p)/u,interp(h,c,p)/u,this.tileZoom)},Transform.prototype.coordinatePoint=function(t){var i=this.worldSize/this.zoomScale(t.zoom),o=[t.column*i,t.row*i,0,1];return vec4.transformMat4(o,o,this.pixelMatrix),new Point(o[0]/o[3],o[1]/o[3])},Transform.prototype.calculatePosMatrix=function(t,i){void 0===i&&(i=1/0),t instanceof TileCoord&&(t=t.toCoordinate(i));var o=Math.min(t.zoom,i),e=this.worldSize/Math.pow(2,o),r=new Float64Array(16);return mat4.identity(r),mat4.translate(r,r,[t.column*e,t.row*e,0]),mat4.scale(r,r,[e/EXTENT,e/EXTENT,1]),mat4.multiply(r,this.projMatrix,r),new Float32Array(r)},Transform.prototype._constrain=function(){if(this.center&&this.width&&this.height&&!this._constraining){this._constraining=!0;var t,i,o,e,r,n,s,a,h=this.size,c=this._unmodified;this.latRange&&(t=this.latY(this.latRange[1]),i=this.latY(this.latRange[0]),r=i-t<h.y?h.y/(i-t):0),this.lngRange&&(o=this.lngX(this.lngRange[0]),e=this.lngX(this.lngRange[1]),n=e-o<h.x?h.x/(e-o):0);var m=Math.max(n||0,r||0);if(m)return this.center=this.unproject(new Point(n?(e+o)/2:this.x,r?(i+t)/2:this.y)),this.zoom+=this.scaleZoom(m),this._unmodified=c,void(this._constraining=!1);if(this.latRange){var l=this.y,p=h.y/2;l-p<t&&(a=t+p),l+p>i&&(a=i-p)}if(this.lngRange){var u=this.x,d=h.x/2;u-d<o&&(s=o+d),u+d>e&&(s=e-d)}void 0===s&&void 0===a||(this.center=this.unproject(new Point(void 0!==s?s:this.x,void 0!==a?a:this.y))),this._unmodified=c,this._constraining=!1}},Transform.prototype._calcMatrices=function(){if(this.height){var t=Math.atan(.5/this.altitude),i=Math.sin(t)*this.altitude/Math.sin(Math.PI/2-this._pitch-t),o=Math.cos(Math.PI/2-this._pitch)*i+this.altitude,e=new Float64Array(16);mat4.perspective(e,2*Math.atan(this.height/2/this.altitude),this.width/this.height,.1,o),mat4.translate(e,e,[0,0,-this.altitude]),mat4.scale(e,e,[1,-1,1/this.height]),mat4.rotateX(e,e,this._pitch),mat4.rotateZ(e,e,this.angle),mat4.translate(e,e,[-this.x,-this.y,0]);var r=2*Math.PI*6378137;if(mat4.scale(e,e,[1,1,Math.pow(2,this.zoom)*this.tileSize/(r*Math.abs(Math.cos(this.center.lat*(Math.PI/180)))),1]),this.projMatrix=e,e=mat4.create(),mat4.scale(e,e,[this.width/2,-this.height/2,1]),mat4.translate(e,e,[1,-1,0]),this.pixelMatrix=mat4.multiply(new Float64Array(16),e,this.projMatrix),e=mat4.invert(new Float64Array(16),this.pixelMatrix),!e)throw new Error("failed to invert matrix");this.pixelMatrixInverse=e,e=mat2.create(),mat2.scale(e,e,[1,Math.cos(this._pitch)]),mat2.rotate(e,e,this.angle),this.lineAntialiasingMatrix=e;var n=Math.sqrt(this.height*this.height/4*(1+this.altitude*this.altitude));this.lineStretch=(n+this.height/2*Math.tan(this._pitch))/n-1}},Object.defineProperties(Transform.prototype,prototypeAccessors),module.exports=Transform;
	},{"../data/extent":11,"../source/tile_coord":50,"../util/interpolate":118,"../util/util":126,"./coordinate":18,"./lng_lat":19,"gl-matrix":149,"point-geometry":195}],22:[function(require,module,exports){
	"use strict";var WorkerPool=require("./util/worker_pool"),globalWorkerPool;module.exports=function(){return globalWorkerPool||(globalWorkerPool=new WorkerPool),globalWorkerPool};
	},{"./util/worker_pool":129}],23:[function(require,module,exports){
	"use strict";var simplexFont={" ":[16,[]],"!":[10,[5,21,5,7,-1,-1,5,2,4,1,5,0,6,1,5,2]],'"':[16,[4,21,4,14,-1,-1,12,21,12,14]],"#":[21,[11,25,4,-7,-1,-1,17,25,10,-7,-1,-1,4,12,18,12,-1,-1,3,6,17,6]],$:[20,[8,25,8,-4,-1,-1,12,25,12,-4,-1,-1,17,18,15,20,12,21,8,21,5,20,3,18,3,16,4,14,5,13,7,12,13,10,15,9,16,8,17,6,17,3,15,1,12,0,8,0,5,1,3,3]],"%":[24,[21,21,3,0,-1,-1,8,21,10,19,10,17,9,15,7,14,5,14,3,16,3,18,4,20,6,21,8,21,10,20,13,19,16,19,19,20,21,21,-1,-1,17,7,15,6,14,4,14,2,16,0,18,0,20,1,21,3,21,5,19,7,17,7]],"&":[26,[23,12,23,13,22,14,21,14,20,13,19,11,17,6,15,3,13,1,11,0,7,0,5,1,4,2,3,4,3,6,4,8,5,9,12,13,13,14,14,16,14,18,13,20,11,21,9,20,8,18,8,16,9,13,11,10,16,3,18,1,20,0,22,0,23,1,23,2]],"'":[10,[5,19,4,20,5,21,6,20,6,18,5,16,4,15]],"(":[14,[11,25,9,23,7,20,5,16,4,11,4,7,5,2,7,-2,9,-5,11,-7]],")":[14,[3,25,5,23,7,20,9,16,10,11,10,7,9,2,7,-2,5,-5,3,-7]],"*":[16,[8,21,8,9,-1,-1,3,18,13,12,-1,-1,13,18,3,12]],"+":[26,[13,18,13,0,-1,-1,4,9,22,9]],",":[10,[6,1,5,0,4,1,5,2,6,1,6,-1,5,-3,4,-4]],"-":[26,[4,9,22,9]],".":[10,[5,2,4,1,5,0,6,1,5,2]],"/":[22,[20,25,2,-7]],0:[20,[9,21,6,20,4,17,3,12,3,9,4,4,6,1,9,0,11,0,14,1,16,4,17,9,17,12,16,17,14,20,11,21,9,21]],1:[20,[6,17,8,18,11,21,11,0]],2:[20,[4,16,4,17,5,19,6,20,8,21,12,21,14,20,15,19,16,17,16,15,15,13,13,10,3,0,17,0]],3:[20,[5,21,16,21,10,13,13,13,15,12,16,11,17,8,17,6,16,3,14,1,11,0,8,0,5,1,4,2,3,4]],4:[20,[13,21,3,7,18,7,-1,-1,13,21,13,0]],5:[20,[15,21,5,21,4,12,5,13,8,14,11,14,14,13,16,11,17,8,17,6,16,3,14,1,11,0,8,0,5,1,4,2,3,4]],6:[20,[16,18,15,20,12,21,10,21,7,20,5,17,4,12,4,7,5,3,7,1,10,0,11,0,14,1,16,3,17,6,17,7,16,10,14,12,11,13,10,13,7,12,5,10,4,7]],7:[20,[17,21,7,0,-1,-1,3,21,17,21]],8:[20,[8,21,5,20,4,18,4,16,5,14,7,13,11,12,14,11,16,9,17,7,17,4,16,2,15,1,12,0,8,0,5,1,4,2,3,4,3,7,4,9,6,11,9,12,13,13,15,14,16,16,16,18,15,20,12,21,8,21]],9:[20,[16,14,15,11,13,9,10,8,9,8,6,9,4,11,3,14,3,15,4,18,6,20,9,21,10,21,13,20,15,18,16,14,16,9,15,4,13,1,10,0,8,0,5,1,4,3]],":":[10,[5,14,4,13,5,12,6,13,5,14,-1,-1,5,2,4,1,5,0,6,1,5,2]],";":[10,[5,14,4,13,5,12,6,13,5,14,-1,-1,6,1,5,0,4,1,5,2,6,1,6,-1,5,-3,4,-4]],"<":[24,[20,18,4,9,20,0]],"=":[26,[4,12,22,12,-1,-1,4,6,22,6]],">":[24,[4,18,20,9,4,0]],"?":[18,[3,16,3,17,4,19,5,20,7,21,11,21,13,20,14,19,15,17,15,15,14,13,13,12,9,10,9,7,-1,-1,9,2,8,1,9,0,10,1,9,2]],"@":[27,[18,13,17,15,15,16,12,16,10,15,9,14,8,11,8,8,9,6,11,5,14,5,16,6,17,8,-1,-1,12,16,10,14,9,11,9,8,10,6,11,5,-1,-1,18,16,17,8,17,6,19,5,21,5,23,7,24,10,24,12,23,15,22,17,20,19,18,20,15,21,12,21,9,20,7,19,5,17,4,15,3,12,3,9,4,6,5,4,7,2,9,1,12,0,15,0,18,1,20,2,21,3,-1,-1,19,16,18,8,18,6,19,5]],A:[18,[9,21,1,0,-1,-1,9,21,17,0,-1,-1,4,7,14,7]],B:[21,[4,21,4,0,-1,-1,4,21,13,21,16,20,17,19,18,17,18,15,17,13,16,12,13,11,-1,-1,4,11,13,11,16,10,17,9,18,7,18,4,17,2,16,1,13,0,4,0]],C:[21,[18,16,17,18,15,20,13,21,9,21,7,20,5,18,4,16,3,13,3,8,4,5,5,3,7,1,9,0,13,0,15,1,17,3,18,5]],D:[21,[4,21,4,0,-1,-1,4,21,11,21,14,20,16,18,17,16,18,13,18,8,17,5,16,3,14,1,11,0,4,0]],E:[19,[4,21,4,0,-1,-1,4,21,17,21,-1,-1,4,11,12,11,-1,-1,4,0,17,0]],F:[18,[4,21,4,0,-1,-1,4,21,17,21,-1,-1,4,11,12,11]],G:[21,[18,16,17,18,15,20,13,21,9,21,7,20,5,18,4,16,3,13,3,8,4,5,5,3,7,1,9,0,13,0,15,1,17,3,18,5,18,8,-1,-1,13,8,18,8]],H:[22,[4,21,4,0,-1,-1,18,21,18,0,-1,-1,4,11,18,11]],I:[8,[4,21,4,0]],J:[16,[12,21,12,5,11,2,10,1,8,0,6,0,4,1,3,2,2,5,2,7]],K:[21,[4,21,4,0,-1,-1,18,21,4,7,-1,-1,9,12,18,0]],L:[17,[4,21,4,0,-1,-1,4,0,16,0]],M:[24,[4,21,4,0,-1,-1,4,21,12,0,-1,-1,20,21,12,0,-1,-1,20,21,20,0]],N:[22,[4,21,4,0,-1,-1,4,21,18,0,-1,-1,18,21,18,0]],O:[22,[9,21,7,20,5,18,4,16,3,13,3,8,4,5,5,3,7,1,9,0,13,0,15,1,17,3,18,5,19,8,19,13,18,16,17,18,15,20,13,21,9,21]],P:[21,[4,21,4,0,-1,-1,4,21,13,21,16,20,17,19,18,17,18,14,17,12,16,11,13,10,4,10]],Q:[22,[9,21,7,20,5,18,4,16,3,13,3,8,4,5,5,3,7,1,9,0,13,0,15,1,17,3,18,5,19,8,19,13,18,16,17,18,15,20,13,21,9,21,-1,-1,12,4,18,-2]],R:[21,[4,21,4,0,-1,-1,4,21,13,21,16,20,17,19,18,17,18,15,17,13,16,12,13,11,4,11,-1,-1,11,11,18,0]],S:[20,[17,18,15,20,12,21,8,21,5,20,3,18,3,16,4,14,5,13,7,12,13,10,15,9,16,8,17,6,17,3,15,1,12,0,8,0,5,1,3,3]],T:[16,[8,21,8,0,-1,-1,1,21,15,21]],U:[22,[4,21,4,6,5,3,7,1,10,0,12,0,15,1,17,3,18,6,18,21]],V:[18,[1,21,9,0,-1,-1,17,21,9,0]],W:[24,[2,21,7,0,-1,-1,12,21,7,0,-1,-1,12,21,17,0,-1,-1,22,21,17,0]],X:[20,[3,21,17,0,-1,-1,17,21,3,0]],Y:[18,[1,21,9,11,9,0,-1,-1,17,21,9,11]],Z:[20,[17,21,3,0,-1,-1,3,21,17,21,-1,-1,3,0,17,0]],"[":[14,[4,25,4,-7,-1,-1,5,25,5,-7,-1,-1,4,25,11,25,-1,-1,4,-7,11,-7]],"\\":[14,[0,21,14,-3]],"]":[14,[9,25,9,-7,-1,-1,10,25,10,-7,-1,-1,3,25,10,25,-1,-1,3,-7,10,-7]],"^":[16,[6,15,8,18,10,15,-1,-1,3,12,8,17,13,12,-1,-1,8,17,8,0]],_:[16,[0,-2,16,-2]],"`":[10,[6,21,5,20,4,18,4,16,5,15,6,16,5,17]],a:[19,[15,14,15,0,-1,-1,15,11,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],b:[19,[4,21,4,0,-1,-1,4,11,6,13,8,14,11,14,13,13,15,11,16,8,16,6,15,3,13,1,11,0,8,0,6,1,4,3]],c:[18,[15,11,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],d:[19,[15,21,15,0,-1,-1,15,11,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],e:[18,[3,8,15,8,15,10,14,12,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],f:[12,[10,21,8,21,6,20,5,17,5,0,-1,-1,2,14,9,14]],g:[19,[15,14,15,-2,14,-5,13,-6,11,-7,8,-7,6,-6,-1,-1,15,11,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],h:[19,[4,21,4,0,-1,-1,4,10,7,13,9,14,12,14,14,13,15,10,15,0]],i:[8,[3,21,4,20,5,21,4,22,3,21,-1,-1,4,14,4,0]],j:[10,[5,21,6,20,7,21,6,22,5,21,-1,-1,6,14,6,-3,5,-6,3,-7,1,-7]],k:[17,[4,21,4,0,-1,-1,14,14,4,4,-1,-1,8,8,15,0]],l:[8,[4,21,4,0]],m:[30,[4,14,4,0,-1,-1,4,10,7,13,9,14,12,14,14,13,15,10,15,0,-1,-1,15,10,18,13,20,14,23,14,25,13,26,10,26,0]],n:[19,[4,14,4,0,-1,-1,4,10,7,13,9,14,12,14,14,13,15,10,15,0]],o:[19,[8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3,16,6,16,8,15,11,13,13,11,14,8,14]],p:[19,[4,14,4,-7,-1,-1,4,11,6,13,8,14,11,14,13,13,15,11,16,8,16,6,15,3,13,1,11,0,8,0,6,1,4,3]],q:[19,[15,14,15,-7,-1,-1,15,11,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],r:[13,[4,14,4,0,-1,-1,4,8,5,11,7,13,9,14,12,14]],s:[17,[14,11,13,13,10,14,7,14,4,13,3,11,4,9,6,8,11,7,13,6,14,4,14,3,13,1,10,0,7,0,4,1,3,3]],t:[12,[5,21,5,4,6,1,8,0,10,0,-1,-1,2,14,9,14]],u:[19,[4,14,4,4,5,1,7,0,10,0,12,1,15,4,-1,-1,15,14,15,0]],v:[16,[2,14,8,0,-1,-1,14,14,8,0]],w:[22,[3,14,7,0,-1,-1,11,14,7,0,-1,-1,11,14,15,0,-1,-1,19,14,15,0]],x:[17,[3,14,14,0,-1,-1,14,14,3,0]],y:[16,[2,14,8,0,-1,-1,14,14,8,0,6,-4,4,-6,2,-7,1,-7]],z:[17,[14,14,3,0,-1,-1,3,14,14,14,-1,-1,3,0,14,0]],"{":[14,[9,25,7,24,6,23,5,21,5,19,6,17,7,16,8,14,8,12,6,10,-1,-1,7,24,6,22,6,20,7,18,8,17,9,15,9,13,8,11,4,9,8,7,9,5,9,3,8,1,7,0,6,-2,6,-4,7,-6,-1,-1,6,8,8,6,8,4,7,2,6,1,5,-1,5,-3,6,-5,7,-6,9,-7]],"|":[8,[4,25,4,-7]],"}":[14,[5,25,7,24,8,23,9,21,9,19,8,17,7,16,6,14,6,12,8,10,-1,-1,7,24,8,22,8,20,7,18,6,17,5,15,5,13,6,11,10,9,6,7,5,5,5,3,6,1,7,0,8,-2,8,-4,7,-6,-1,-1,8,8,6,6,6,4,7,2,8,1,9,-1,9,-3,8,-5,7,-6,5,-7]],"~":[24,[3,6,3,8,4,11,6,12,8,12,10,11,14,8,16,7,18,7,20,8,21,10,-1,-1,3,8,4,10,6,11,8,11,10,10,14,7,16,6,18,6,20,7,21,10,21,12]]};module.exports=function(l,n,t,e){e=e||1;var r,o,u,s,i,x,f,p,h=[];for(r=0,o=l.length;r<o;r++)if(i=simplexFont[l[r]]){for(p=null,u=0,s=i[1].length;u<s;u+=2)i[1][u]===-1&&i[1][u+1]===-1?p=null:(x=n+i[1][u]*e,f=t-i[1][u+1]*e,p&&h.push(p.x,p.y,x,f),p={x:x,y:f});n+=i[0]*e}return h};
	},{}],24:[function(require,module,exports){
	"use strict";var browser=require("./util/browser"),mapboxgl=module.exports={};mapboxgl.version=require("../package.json").version,mapboxgl.workerCount=Math.max(Math.floor(browser.hardwareConcurrency/2),1),mapboxgl.Map=require("./ui/map"),mapboxgl.NavigationControl=require("./ui/control/navigation_control"),mapboxgl.GeolocateControl=require("./ui/control/geolocate_control"),mapboxgl.AttributionControl=require("./ui/control/attribution_control"),mapboxgl.ScaleControl=require("./ui/control/scale_control"),mapboxgl.Popup=require("./ui/popup"),mapboxgl.Marker=require("./ui/marker"),mapboxgl.Style=require("./style/style"),mapboxgl.LngLat=require("./geo/lng_lat"),mapboxgl.LngLatBounds=require("./geo/lng_lat_bounds"),mapboxgl.Point=require("point-geometry"),mapboxgl.Evented=require("./util/evented"),mapboxgl.util=require("./util/util"),mapboxgl.supported=require("./util/browser").supported;var ajax=require("./util/ajax");mapboxgl.util.getJSON=ajax.getJSON,mapboxgl.util.getArrayBuffer=ajax.getArrayBuffer;var config=require("./util/config");mapboxgl.config=config,Object.defineProperty(mapboxgl,"accessToken",{get:function(){return config.ACCESS_TOKEN},set:function(r){config.ACCESS_TOKEN=r}});
	},{"../package.json":214,"./geo/lng_lat":19,"./geo/lng_lat_bounds":20,"./style/style":60,"./ui/control/attribution_control":90,"./ui/control/geolocate_control":91,"./ui/control/navigation_control":92,"./ui/control/scale_control":93,"./ui/map":102,"./ui/marker":103,"./ui/popup":104,"./util/ajax":106,"./util/browser":107,"./util/config":111,"./util/evented":115,"./util/util":126,"point-geometry":195}],25:[function(require,module,exports){
	"use strict";function drawBackground(r,t,e){var a=r.gl,i=r.transform,n=i.tileSize,o=e.paint["background-color"],l=e.paint["background-pattern"],u=e.paint["background-opacity"],f=!l&&1===o[3]&&1===u;if(r.isOpaquePass===f){a.disable(a.STENCIL_TEST),r.setDepthSublayer(0);var s;l?(s=r.useProgram("fillPattern",r.basicFillProgramConfiguration),pattern.prepare(l,r,s),r.tileExtentPatternVAO.bind(a,s,r.tileExtentBuffer)):(s=r.useProgram("fill",r.basicFillProgramConfiguration),a.uniform4fv(s.u_color,o),r.tileExtentVAO.bind(a,s,r.tileExtentBuffer)),a.uniform1f(s.u_opacity,u);for(var c=i.coveringTiles({tileSize:n}),g=0,p=c;g<p.length;g+=1){var d=p[g];l&&pattern.setTile({coord:d,tileSize:n},r,s),a.uniformMatrix4fv(s.u_matrix,!1,r.transform.calculatePosMatrix(d)),a.drawArrays(a.TRIANGLE_STRIP,0,r.tileExtentBuffer.length)}}}var pattern=require("./pattern");module.exports=drawBackground;
	},{"./pattern":37}],26:[function(require,module,exports){
	"use strict";function drawCircles(e,r,t,i){if(!e.isOpaquePass){var a=e.gl;e.setDepthSublayer(0),e.depthMask(!1),a.disable(a.STENCIL_TEST);for(var s=0;s<i.length;s++){var o=i[s],f=r.getTile(o),n=f.getBucket(t);if(n){var l=n.buffers,u=l.layerData[t.id],m=u.programConfiguration,c=e.useProgram("circle",m);m.setUniforms(a,c,t,{zoom:e.transform.zoom}),"map"===t.paint["circle-pitch-scale"]?(a.uniform1i(c.u_scale_with_map,!0),a.uniform2f(c.u_extrude_scale,e.transform.pixelsToGLUnits[0]*e.transform.altitude,e.transform.pixelsToGLUnits[1]*e.transform.altitude)):(a.uniform1i(c.u_scale_with_map,!1),a.uniform2fv(c.u_extrude_scale,e.transform.pixelsToGLUnits)),a.uniform1f(c.u_devicepixelratio,browser.devicePixelRatio),a.uniformMatrix4fv(c.u_matrix,!1,e.translatePosMatrix(o.posMatrix,f,t.paint["circle-translate"],t.paint["circle-translate-anchor"]));for(var p=0,d=l.segments;p<d.length;p+=1){var v=d[p];v.vaos[t.id].bind(a,c,l.layoutVertexBuffer,l.elementBuffer,u.paintVertexBuffer,v.vertexOffset),a.drawElements(a.TRIANGLES,3*v.primitiveLength,a.UNSIGNED_SHORT,3*v.primitiveOffset*2)}}}}}var browser=require("../util/browser");module.exports=drawCircles;
	},{"../util/browser":107}],27:[function(require,module,exports){
	"use strict";function drawCollisionDebug(e,o,r,i){var t=e.gl;t.enable(t.STENCIL_TEST);for(var f=e.useProgram("collisionBox"),l=0;l<i.length;l++){var n=i[l],a=o.getTile(n),s=a.getBucket(r);if(s){var u=s.buffers.collisionBox;if(u){t.uniformMatrix4fv(f.u_matrix,!1,n.posMatrix),e.enableTileClippingMask(n),e.lineWidth(1),t.uniform1f(f.u_scale,Math.pow(2,e.transform.zoom-a.coord.z)),t.uniform1f(f.u_zoom,10*e.transform.zoom),t.uniform1f(f.u_maxzoom,10*(a.coord.z+1));for(var m=0,g=u.segments;m<g.length;m+=1){var v=g[m];v.vaos[r.id].bind(t,f,u.layoutVertexBuffer,u.elementBuffer,null,v.vertexOffset),t.drawElements(t.LINES,2*v.primitiveLength,t.UNSIGNED_SHORT,2*v.primitiveOffset*2)}}}}}module.exports=drawCollisionDebug;
	},{}],28:[function(require,module,exports){
	"use strict";function drawDebug(r,e,t){for(var a=0;a<t.length;a++)drawDebugTile(r,e,t[a])}function drawDebugTile(r,e,t){var a=r.gl;a.disable(a.STENCIL_TEST),r.lineWidth(1*browser.devicePixelRatio);var i=t.posMatrix,u=r.useProgram("debug");a.uniformMatrix4fv(u.u_matrix,!1,i),a.uniform4f(u.u_color,1,0,0,1),r.debugVAO.bind(a,u,r.debugBuffer),a.drawArrays(a.LINE_STRIP,0,r.debugBuffer.length);for(var o=textVertices(t.toString(),50,200,5),f=new PosArray,n=0;n<o.length;n+=2)f.emplaceBack(o[n],o[n+1]);var l=Buffer.fromStructArray(f,Buffer.BufferType.VERTEX),d=new VertexArrayObject;d.bind(a,u,l),a.uniform4f(u.u_color,1,1,1,1);for(var b=e.getTile(t).tileSize,g=EXTENT/(Math.pow(2,r.transform.zoom-t.z)*b),m=[[-1,-1],[-1,1],[1,-1],[1,1]],s=0;s<m.length;s++){var x=m[s];a.uniformMatrix4fv(u.u_matrix,!1,mat4.translate([],i,[g*x[0],g*x[1],0])),a.drawArrays(a.LINES,0,l.length)}a.uniform4f(u.u_color,0,0,0,1),a.uniformMatrix4fv(u.u_matrix,!1,i),a.drawArrays(a.LINES,0,l.length)}var textVertices=require("../lib/debugtext"),browser=require("../util/browser"),mat4=require("gl-matrix").mat4,EXTENT=require("../data/extent"),Buffer=require("../data/buffer"),VertexArrayObject=require("./vertex_array_object"),PosArray=require("../data/pos_array");module.exports=drawDebug;
	},{"../data/buffer":8,"../data/extent":11,"../data/pos_array":14,"../lib/debugtext":23,"../util/browser":107,"./vertex_array_object":38,"gl-matrix":149}],29:[function(require,module,exports){
	"use strict";function drawFill(t,e,r,i){var a=t.gl;a.enable(a.STENCIL_TEST);var l=!r.paint["fill-pattern"]&&r.isPaintValueFeatureConstant("fill-color")&&r.isPaintValueFeatureConstant("fill-opacity")&&1===r.paint["fill-color"][3]&&1===r.paint["fill-opacity"];t.isOpaquePass===l&&(t.setDepthSublayer(1),drawFillTiles(t,e,r,i,drawFillTile)),!t.isOpaquePass&&r.paint["fill-antialias"]&&(t.lineWidth(2),t.depthMask(!1),t.setDepthSublayer(r.getPaintProperty("fill-outline-color")?2:0),drawFillTiles(t,e,r,i,drawStrokeTile))}function drawFillTiles(t,e,r,i,a){for(var l=!0,n=0,o=i;n<o.length;n+=1){var f=o[n],s=e.getTile(f),u=s.getBucket(r);u&&(t.enableTileClippingMask(f),a(t,e,r,s,f,u.buffers,l),l=!1)}}function drawFillTile(t,e,r,i,a,l,n){for(var o=t.gl,f=l.layerData[r.id],s=setFillProgram("fill",r.paint["fill-pattern"],t,f,r,i,a,n),u=0,p=l.segments;u<p.length;u+=1){var g=p[u];g.vaos[r.id].bind(o,s,l.layoutVertexBuffer,l.elementBuffer,f.paintVertexBuffer,g.vertexOffset),o.drawElements(o.TRIANGLES,3*g.primitiveLength,o.UNSIGNED_SHORT,3*g.primitiveOffset*2)}}function drawStrokeTile(t,e,r,i,a,l,n){var o=t.gl,f=l.layerData[r.id],s=r.paint["fill-pattern"]&&!r.getPaintProperty("fill-outline-color"),u=setFillProgram("fillOutline",s,t,f,r,i,a,n);o.uniform2f(u.u_world,o.drawingBufferWidth,o.drawingBufferHeight);for(var p=0,g=l.segments2;p<g.length;p+=1){var m=g[p];m.vaos[r.id].bind(o,u,l.layoutVertexBuffer,l.elementBuffer2,f.paintVertexBuffer,m.vertexOffset),o.drawElements(o.LINES,2*m.primitiveLength,o.UNSIGNED_SHORT,2*m.primitiveOffset*2)}}function setFillProgram(t,e,r,i,a,l,n,o){var f,s=r.currentProgram;return e?(f=r.useProgram(t+"Pattern",i.programConfiguration),(o||f!==s)&&(i.programConfiguration.setUniforms(r.gl,f,a,{zoom:r.transform.zoom}),pattern.prepare(a.paint["fill-pattern"],r,f)),pattern.setTile(l,r,f)):(f=r.useProgram(t,i.programConfiguration),(o||f!==s)&&i.programConfiguration.setUniforms(r.gl,f,a,{zoom:r.transform.zoom})),r.gl.uniformMatrix4fv(f.u_matrix,!1,r.translatePosMatrix(n.posMatrix,l,a.paint["fill-translate"],a.paint["fill-translate-anchor"])),f}var pattern=require("./pattern");module.exports=drawFill;
	},{"./pattern":37}],30:[function(require,module,exports){
	"use strict";function draw(e,t,r,i){if(0!==r.paint["fill-extrusion-opacity"]){var a=e.gl;a.disable(a.STENCIL_TEST),a.enable(a.DEPTH_TEST),e.depthMask(!0);var s=new ExtrusionTexture(a,e,r);s.bindFramebuffer(),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT);for(var u=0;u<i.length;u++)drawExtrusion(e,t,r,i[u]);s.unbindFramebuffer(),s.renderToMap()}}function ExtrusionTexture(e,t,r){this.gl=e,this.width=t.width,this.height=t.height,this.painter=t,this.layer=r,this.texture=null,this.fbo=null,this.fbos=this.painter.preFbos[this.width]&&this.painter.preFbos[this.width][this.height]}function drawExtrusion(e,t,r,i){if(!e.isOpaquePass){var a=t.getTile(i),s=a.getBucket(r);if(s){var u=s.buffers,f=e.gl,h=r.paint["fill-extrusion-pattern"],n=u.layerData[r.id],o=n.programConfiguration,E=e.useProgram(h?"fillExtrusionPattern":"fillExtrusion",o);o.setUniforms(f,E,r,{zoom:e.transform.zoom}),h&&(pattern.prepare(h,e,E),pattern.setTile(a,e,E),f.uniform1f(E.u_height_factor,-Math.pow(2,i.z)/a.tileSize/8)),e.gl.uniformMatrix4fv(E.u_matrix,!1,e.translatePosMatrix(i.posMatrix,a,r.paint["fill-extrusion-translate"],r.paint["fill-extrusion-translate-anchor"])),setLight(E,e);for(var T=0,l=u.segments;T<l.length;T+=1){var R=l[T];R.vaos[r.id].bind(f,E,u.layoutVertexBuffer,u.elementBuffer,n.paintVertexBuffer,R.vertexOffset),f.drawElements(f.TRIANGLES,3*R.primitiveLength,f.UNSIGNED_SHORT,3*R.primitiveOffset*2)}}}}function setLight(e,t){var r=t.gl,i=t.style.light,a=i.calculated.position,s=[a.x,a.y,a.z],u=mat3.create();"viewport"===i.calculated.anchor&&mat3.fromRotation(u,-t.transform.angle),vec3.transformMat3(s,s,u),r.uniform3fv(e.u_lightpos,s),r.uniform1f(e.u_lightintensity,i.calculated.intensity),r.uniform3fv(e.u_lightcolor,i.calculated.color.slice(0,3))}var mat3=require("gl-matrix").mat3,mat4=require("gl-matrix").mat4,vec3=require("gl-matrix").vec3,Buffer=require("../data/buffer"),VertexArrayObject=require("./vertex_array_object"),PosArray=require("../data/pos_array"),pattern=require("./pattern");module.exports=draw,ExtrusionTexture.prototype.bindFramebuffer=function(){var e=this.gl;if(this.texture=this.painter.getViewportTexture(this.width,this.height),e.activeTexture(e.TEXTURE1),this.texture?e.bindTexture(e.TEXTURE_2D,this.texture):(this.texture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,this.width,this.height,0,e.RGBA,e.UNSIGNED_BYTE,null),this.texture.width=this.width,this.texture.height=this.height),this.fbos)this.fbo=this.fbos.pop(),e.bindFramebuffer(e.FRAMEBUFFER,this.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.texture,0);else{this.fbo=e.createFramebuffer();var t=e.createRenderbuffer(),r=e.createRenderbuffer();e.bindRenderbuffer(e.RENDERBUFFER,t),e.bindRenderbuffer(e.RENDERBUFFER,r),e.renderbufferStorage(e.RENDERBUFFER,e.RGBA4,this.width,this.height),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,this.width,this.height),e.bindFramebuffer(e.FRAMEBUFFER,this.fbo),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,t),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.texture,0)}},ExtrusionTexture.prototype.unbindFramebuffer=function(){this.painter.bindDefaultFramebuffer(),this.fbos?this.fbos.push(this.fbo):(this.painter.preFbos[this.width]||(this.painter.preFbos[this.width]={}),this.painter.preFbos[this.width][this.height]=[this.fbo]),this.painter.saveViewportTexture(this.texture)},ExtrusionTexture.prototype.renderToMap=function(){var e=this.gl,t=this.painter,r=t.useProgram("extrusionTexture");e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.uniform1f(r.u_opacity,this.layer.paint["fill-extrusion-opacity"]),e.uniform1i(r.u_texture,1),e.uniformMatrix4fv(r.u_matrix,!1,mat4.ortho(mat4.create(),0,t.width,t.height,0,0,1)),e.disable(e.DEPTH_TEST),e.uniform1i(r.u_xdim,t.width),e.uniform1i(r.u_ydim,t.height);var i=new PosArray;i.emplaceBack(0,0),i.emplaceBack(t.width,0),i.emplaceBack(0,t.height),i.emplaceBack(t.width,t.height);var a=Buffer.fromStructArray(i,Buffer.BufferType.VERTEX),s=new VertexArrayObject;s.bind(e,r,a),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.enable(e.DEPTH_TEST)};
	},{"../data/buffer":8,"../data/pos_array":14,"./pattern":37,"./vertex_array_object":38,"gl-matrix":149}],31:[function(require,module,exports){
	"use strict";function drawLineTile(i,e,t,r,a,n,o,f,l){var u,s,m,_,p=e.gl,g=a.paint["line-dasharray"],d=a.paint["line-pattern"];if(f||l){var v=1/pixelsToTileUnits(t,1,e.transform.tileZoom);if(g){u=e.lineAtlas.getDash(g.from,"round"===a.layout["line-cap"]),s=e.lineAtlas.getDash(g.to,"round"===a.layout["line-cap"]);var c=u.width*g.fromScale,h=s.width*g.toScale;p.uniform2f(i.u_patternscale_a,v/c,-u.height/2),p.uniform2f(i.u_patternscale_b,v/h,-s.height/2),p.uniform1f(i.u_sdfgamma,e.lineAtlas.width/(256*Math.min(c,h)*browser.devicePixelRatio)/2)}else if(d){if(m=e.spriteAtlas.getPosition(d.from,!0),_=e.spriteAtlas.getPosition(d.to,!0),!m||!_)return;p.uniform2f(i.u_pattern_size_a,m.size[0]*d.fromScale/v,_.size[1]),p.uniform2f(i.u_pattern_size_b,_.size[0]*d.toScale/v,_.size[1])}}if(f){d||p.uniform4fv(i.u_color,a.paint["line-color"]),g?(p.uniform1i(i.u_image,0),p.activeTexture(p.TEXTURE0),e.lineAtlas.bind(p),p.uniform1f(i.u_tex_y_a,u.y),p.uniform1f(i.u_tex_y_b,s.y),p.uniform1f(i.u_mix,g.t)):d&&(p.uniform1i(i.u_image,0),p.activeTexture(p.TEXTURE0),e.spriteAtlas.bind(p,!0),p.uniform2fv(i.u_pattern_tl_a,m.tl),p.uniform2fv(i.u_pattern_br_a,m.br),p.uniform2fv(i.u_pattern_tl_b,_.tl),p.uniform2fv(i.u_pattern_br_b,_.br),p.uniform1f(i.u_fade,d.t));var b=1/browser.devicePixelRatio;p.uniform1f(i.u_linewidth,a.paint["line-width"]/2),p.uniform1f(i.u_gapwidth,a.paint["line-gap-width"]/2),p.uniform1f(i.u_antialiasing,b/2),p.uniform1f(i.u_blur,a.paint["line-blur"]+b),p.uniform1f(i.u_opacity,a.paint["line-opacity"]),p.uniformMatrix2fv(i.u_antialiasingmatrix,!1,e.transform.lineAntialiasingMatrix),p.uniform1f(i.u_offset,-a.paint["line-offset"]),p.uniform1f(i.u_extra,e.transform.lineStretch)}e.enableTileClippingMask(n);var x=e.translatePosMatrix(n.posMatrix,t,a.paint["line-translate"],a.paint["line-translate-anchor"]);p.uniformMatrix4fv(i.u_matrix,!1,x),p.uniform1f(i.u_ratio,1/pixelsToTileUnits(t,1,e.transform.zoom));for(var T=0,w=r.segments;T<w.length;T+=1){var y=w[T];y.vaos[a.id].bind(p,i,r.layoutVertexBuffer,r.elementBuffer,o.paintVertexBuffer,y.vertexOffset),p.drawElements(p.TRIANGLES,3*y.primitiveLength,p.UNSIGNED_SHORT,3*y.primitiveOffset*2)}}var browser=require("../util/browser"),pixelsToTileUnits=require("../source/pixels_to_tile_units");module.exports=function(i,e,t,r){if(!i.isOpaquePass){i.setDepthSublayer(0),i.depthMask(!1);var a=i.gl;if(a.enable(a.STENCIL_TEST),!(t.paint["line-width"]<=0))for(var n,o=t.paint["line-dasharray"]?"lineSDF":t.paint["line-pattern"]?"linePattern":"line",f=!0,l=0,u=r;l<u.length;l+=1){var s=u[l],m=e.getTile(s),_=m.getBucket(t);if(_){var p=_.buffers.layerData[t.id],g=i.currentProgram,d=i.useProgram(o,p.programConfiguration),v=f||d!==g,c=n!==m.coord.z;v&&p.programConfiguration.setUniforms(i.gl,d,t,{zoom:i.transform.zoom}),drawLineTile(d,i,m,_.buffers,t,s,p,v,c),n=m.coord.z,f=!1}}}};
	},{"../source/pixels_to_tile_units":44,"../util/browser":107}],32:[function(require,module,exports){
	"use strict";function drawRaster(r,t,a,e){if(!r.isOpaquePass){var i=r.gl;i.enable(i.DEPTH_TEST),r.depthMask(!0),i.depthFunc(i.LESS);for(var o=e.length&&e[0].z,n=0;n<e.length;n++){var u=e[n];r.setDepthSublayer(u.z-o),drawRasterTile(r,t,a,u)}i.depthFunc(i.LEQUAL)}}function drawRasterTile(r,t,a,e){var i=r.gl;i.disable(i.STENCIL_TEST);var o=t.getTile(e),n=r.transform.calculatePosMatrix(e,t.getSource().maxzoom);o.setAnimationLoop(r.style.animationLoop,a.paint["raster-fade-duration"]);var u=r.useProgram("raster");i.uniformMatrix4fv(u.u_matrix,!1,n),i.uniform1f(u.u_brightness_low,a.paint["raster-brightness-min"]),i.uniform1f(u.u_brightness_high,a.paint["raster-brightness-max"]),i.uniform1f(u.u_saturation_factor,saturationFactor(a.paint["raster-saturation"])),i.uniform1f(u.u_contrast_factor,contrastFactor(a.paint["raster-contrast"])),i.uniform3fv(u.u_spin_weights,spinWeights(a.paint["raster-hue-rotate"]));var s,c,f=o.sourceCache&&o.sourceCache.findLoadedParent(e,0,{}),d=getOpacities(o,f,a,r.transform);i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,o.texture),i.activeTexture(i.TEXTURE1),f?(i.bindTexture(i.TEXTURE_2D,f.texture),s=Math.pow(2,f.coord.z-o.coord.z),c=[o.coord.x*s%1,o.coord.y*s%1]):i.bindTexture(i.TEXTURE_2D,o.texture),i.uniform2fv(u.u_tl_parent,c||[0,0]),i.uniform1f(u.u_scale_parent,s||1),i.uniform1f(u.u_buffer_scale,1),i.uniform1f(u.u_opacity0,d[0]),i.uniform1f(u.u_opacity1,d[1]),i.uniform1i(u.u_image0,0),i.uniform1i(u.u_image1,1);var m=o.boundsBuffer||r.rasterBoundsBuffer,h=o.boundsVAO||r.rasterBoundsVAO;h.bind(i,u,m),i.drawArrays(i.TRIANGLE_STRIP,0,m.length)}function spinWeights(r){r*=Math.PI/180;var t=Math.sin(r),a=Math.cos(r);return[(2*a+1)/3,(-Math.sqrt(3)*t-a+1)/3,(Math.sqrt(3)*t-a+1)/3]}function contrastFactor(r){return r>0?1/(1-r):1+r}function saturationFactor(r){return r>0?1-1/(1.001-r):-r}function getOpacities(r,t,a,e){var i=[1,0],o=a.paint["raster-fade-duration"];if(r.sourceCache&&o>0){var n=Date.now(),u=(n-r.timeAdded)/o,s=t?(n-t.timeAdded)/o:-1,c=r.sourceCache.getSource(),f=e.coveringZoomLevel({tileSize:c.tileSize,roundZoom:c.roundZoom}),d=!t||Math.abs(t.coord.z-f)>Math.abs(r.coord.z-f);i[0]=util.clamp(d?u:1-s,0,1),i[1]=t?1-i[0]:0}var m=a.paint["raster-opacity"];return i[0]*=m,i[1]*=m,i}var util=require("../util/util");module.exports=drawRaster;
	},{"../util/util":126}],33:[function(require,module,exports){
	"use strict";function drawSymbols(t,e,i,a){if(!t.isOpaquePass){var o=!(i.layout["text-allow-overlap"]||i.layout["icon-allow-overlap"]||i.layout["text-ignore-placement"]||i.layout["icon-ignore-placement"]),r=t.gl;o?r.disable(r.STENCIL_TEST):r.enable(r.STENCIL_TEST),t.setDepthSublayer(0),t.depthMask(!1),drawLayerSymbols(t,e,i,a,!1,i.paint["icon-translate"],i.paint["icon-translate-anchor"],i.layout["icon-rotation-alignment"],i.layout["icon-rotation-alignment"],i.layout["icon-size"],i.paint["icon-halo-width"],i.paint["icon-halo-color"],i.paint["icon-halo-blur"],i.paint["icon-opacity"],i.paint["icon-color"]),drawLayerSymbols(t,e,i,a,!0,i.paint["text-translate"],i.paint["text-translate-anchor"],i.layout["text-rotation-alignment"],i.layout["text-pitch-alignment"],i.layout["text-size"],i.paint["text-halo-width"],i.paint["text-halo-color"],i.paint["text-halo-blur"],i.paint["text-opacity"],i.paint["text-color"]),e.map.showCollisionBoxes&&drawCollisionDebug(t,e,i,a)}}function drawLayerSymbols(t,e,i,a,o,r,l,n,s,u,f,m,p,c,d){if(o||!t.style.sprite||t.style.sprite.loaded()){var h=t.gl,b="map"===n,x="map"===s,g=x;g?h.enable(h.DEPTH_TEST):h.disable(h.DEPTH_TEST);for(var _,y=0,T=a;y<T.length;y+=1){var v=T[y],w=e.getTile(v),S=w.getBucket(i);if(S){var E=o?S.buffers.glyph:S.buffers.icon;if(E&&E.segments.length){var P=o||S.sdfIcons;_||(_=t.useProgram(P?"symbolSDF":"symbolIcon"),setSymbolDrawState(_,t,o,P,b,x,S.fontstack,u,S.iconsNeedLinear,o?S.adjustedTextSize:S.adjustedIconSize,c)),t.enableTileClippingMask(v),h.uniformMatrix4fv(_.u_matrix,!1,t.translatePosMatrix(v.posMatrix,w,r,l)),drawTileSymbols(_,t,i,w,E,o,P,x,u,f,m,p,d)}}}g||h.enable(h.DEPTH_TEST)}}function setSymbolDrawState(t,e,i,a,o,r,l,n,s,u,f){var m=e.gl,p=e.transform;if(m.uniform1i(t.u_rotate_with_map,o),m.uniform1i(t.u_pitch_with_map,r),m.activeTexture(m.TEXTURE0),m.uniform1i(t.u_texture,0),i){var c=l&&e.glyphSource.getGlyphAtlas(l);if(!c)return;c.updateTexture(m),m.uniform2f(t.u_texsize,c.width/4,c.height/4)}else{var d=e.options.rotating||e.options.zooming,h=1!==n||browser.devicePixelRatio!==e.spriteAtlas.pixelRatio||s,b=r||p.pitch;e.spriteAtlas.bind(m,a||d||h||b),m.uniform2f(t.u_texsize,e.spriteAtlas.width/4,e.spriteAtlas.height/4)}m.activeTexture(m.TEXTURE1),e.frameHistory.bind(m),m.uniform1i(t.u_fadetexture,1);var x=Math.log(n/u)/Math.LN2||0;m.uniform1f(t.u_zoom,10*(p.zoom-x)),m.uniform1f(t.u_pitch,p.pitch/360*2*Math.PI),m.uniform1f(t.u_bearing,p.bearing/360*2*Math.PI),m.uniform1f(t.u_aspect_ratio,p.width/p.height),m.uniform1f(t.u_opacity,f)}function drawTileSymbols(t,e,i,a,o,r,l,n,s,u,f,m,p){var c=e.gl,d=e.transform,h=s/(r?24:1);if(n){var b=pixelsToTileUnits(a,h,d.zoom);c.uniform2f(t.u_extrude_scale,b,b)}else{var x=d.altitude*h;c.uniform2f(t.u_extrude_scale,d.pixelsToGLUnits[0]*x,d.pixelsToGLUnits[1]*x)}if(l){var g=h*(n?Math.cos(d._pitch):1);u&&(c.uniform1f(t.u_gamma,(m*blurOffset/sdfPx+gamma)/g),c.uniform4fv(t.u_color,f),c.uniform1f(t.u_buffer,(haloOffset-u/h)/sdfPx),drawSymbolElements(o,i,c,t)),c.uniform1f(t.u_gamma,gamma/g),c.uniform4fv(t.u_color,p),c.uniform1f(t.u_buffer,.75)}drawSymbolElements(o,i,c,t)}function drawSymbolElements(t,e,i,a){for(var o=0,r=t.segments;o<r.length;o+=1){var l=r[o];l.vaos[e.id].bind(i,a,t.layoutVertexBuffer,t.elementBuffer,null,l.vertexOffset),i.drawElements(i.TRIANGLES,3*l.primitiveLength,i.UNSIGNED_SHORT,3*l.primitiveOffset*2)}}var browser=require("../util/browser"),drawCollisionDebug=require("./draw_collision_debug"),pixelsToTileUnits=require("../source/pixels_to_tile_units");module.exports=drawSymbols;var sdfPx=8,blurOffset=1.19,haloOffset=6,gamma=.105/browser.devicePixelRatio;
	},{"../source/pixels_to_tile_units":44,"../util/browser":107,"./draw_collision_debug":27}],34:[function(require,module,exports){
	"use strict";var FrameHistory=function(){this.changeTimes=new Float64Array(256),this.changeOpacities=new Uint8Array(256),this.opacities=new Uint8ClampedArray(256),this.array=new Uint8Array(this.opacities.buffer),this.previousZoom=0,this.firstFrame=!0};FrameHistory.prototype.record=function(e,t,i){var r=this;this.firstFrame&&(e=0,this.firstFrame=!1),t=Math.floor(10*t);var a;if(t<this.previousZoom)for(a=t+1;a<=this.previousZoom;a++)r.changeTimes[a]=e,r.changeOpacities[a]=r.opacities[a];else for(a=t;a>this.previousZoom;a--)r.changeTimes[a]=e,r.changeOpacities[a]=r.opacities[a];for(a=0;a<256;a++){var s=e-r.changeTimes[a],o=255*(i?s/i:1);a<=t?r.opacities[a]=r.changeOpacities[a]+o:r.opacities[a]=r.changeOpacities[a]-o}this.changed=!0,this.previousZoom=t},FrameHistory.prototype.bind=function(e){this.texture?(e.bindTexture(e.TEXTURE_2D,this.texture),this.changed&&(e.texSubImage2D(e.TEXTURE_2D,0,0,0,256,1,e.ALPHA,e.UNSIGNED_BYTE,this.array),this.changed=!1)):(this.texture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texImage2D(e.TEXTURE_2D,0,e.ALPHA,256,1,0,e.ALPHA,e.UNSIGNED_BYTE,this.array))},module.exports=FrameHistory;
	},{}],35:[function(require,module,exports){
	"use strict";var util=require("../util/util"),LineAtlas=function(t,i){this.width=t,this.height=i,this.nextRow=0,this.bytes=4,this.data=new Uint8Array(this.width*this.height*this.bytes),this.positions={}};LineAtlas.prototype.setSprite=function(t){this.sprite=t},LineAtlas.prototype.getDash=function(t,i){var e=t.join(",")+i;return this.positions[e]||(this.positions[e]=this.addDash(t,i)),this.positions[e]},LineAtlas.prototype.addDash=function(t,i){var e=this,h=i?7:0,s=2*h+1,a=128;if(this.nextRow+s>this.height)return util.warnOnce("LineAtlas out of space"),null;for(var r=0,n=0;n<t.length;n++)r+=t[n];for(var E=this.width/r,o=E/2,T=t.length%2===1,R=-h;R<=h;R++)for(var u=e.nextRow+h+R,d=e.width*u,l=T?-t[t.length-1]:0,x=t[0],A=1,_=0;_<this.width;_++){for(;x<_/E;)l=x,x+=t[A],T&&A===t.length-1&&(x+=t[0]),A++;var p,g=Math.abs(_-l*E),w=Math.abs(_-x*E),D=Math.min(g,w),U=A%2===1;if(i){var f=h?R/h*(o+1):0;if(U){var X=o-Math.abs(f);p=Math.sqrt(D*D+X*X)}else p=o-Math.sqrt(D*D+f*f)}else p=(U?1:-1)*D;e.data[3+4*(d+_)]=Math.max(0,Math.min(255,p+a))}var y={y:(this.nextRow+h+.5)/this.height,height:2*h/this.height,width:r};return this.nextRow+=s,this.dirty=!0,y},LineAtlas.prototype.bind=function(t){this.texture?(t.bindTexture(t.TEXTURE_2D,this.texture),this.dirty&&(this.dirty=!1,t.texSubImage2D(t.TEXTURE_2D,0,0,0,this.width,this.height,t.RGBA,t.UNSIGNED_BYTE,this.data))):(this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,this.width,this.height,0,t.RGBA,t.UNSIGNED_BYTE,this.data))},module.exports=LineAtlas;
	},{"../util/util":126}],36:[function(require,module,exports){
	"use strict";var browser=require("../util/browser"),mat4=require("gl-matrix").mat4,FrameHistory=require("./frame_history"),SourceCache=require("../source/source_cache"),EXTENT=require("../data/extent"),pixelsToTileUnits=require("../source/pixels_to_tile_units"),util=require("../util/util"),Buffer=require("../data/buffer"),VertexArrayObject=require("./vertex_array_object"),RasterBoundsArray=require("../data/raster_bounds_array"),PosArray=require("../data/pos_array"),ProgramConfiguration=require("../data/program_configuration"),shaders=require("mapbox-gl-shaders"),draw={symbol:require("./draw_symbol"),circle:require("./draw_circle"),line:require("./draw_line"),fill:require("./draw_fill"),"fill-extrusion":require("./draw_fill_extrusion"),raster:require("./draw_raster"),background:require("./draw_background"),debug:require("./draw_debug")},Painter=function(e,r){this.gl=e,this.transform=r,this.reusableTextures={},this.preFbos={},this.frameHistory=new FrameHistory,this.setup(),this.numSublayers=SourceCache.maxUnderzooming+SourceCache.maxOverzooming+1,this.depthEpsilon=1/Math.pow(2,16),this.lineWidthRange=e.getParameter(e.ALIASED_LINE_WIDTH_RANGE),this.basicFillProgramConfiguration=ProgramConfiguration.createStatic(["color","opacity"]),this.emptyProgramConfiguration=new ProgramConfiguration};Painter.prototype.resize=function(e,r){var t=this.gl;this.width=e*browser.devicePixelRatio,this.height=r*browser.devicePixelRatio,t.viewport(0,0,this.width,this.height)},Painter.prototype.setup=function(){var e=this.gl;e.verbose=!0,e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.enable(e.STENCIL_TEST),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),this._depthMask=!1,e.depthMask(!1);var r=new PosArray;r.emplaceBack(0,0),r.emplaceBack(EXTENT,0),r.emplaceBack(0,EXTENT),r.emplaceBack(EXTENT,EXTENT),this.tileExtentBuffer=Buffer.fromStructArray(r,Buffer.BufferType.VERTEX),this.tileExtentVAO=new VertexArrayObject,this.tileExtentPatternVAO=new VertexArrayObject;var t=new PosArray;t.emplaceBack(0,0),t.emplaceBack(EXTENT,0),t.emplaceBack(EXTENT,EXTENT),t.emplaceBack(0,EXTENT),t.emplaceBack(0,0),this.debugBuffer=Buffer.fromStructArray(t,Buffer.BufferType.VERTEX),this.debugVAO=new VertexArrayObject;var a=new RasterBoundsArray;a.emplaceBack(0,0,0,0),a.emplaceBack(EXTENT,0,32767,0),a.emplaceBack(0,EXTENT,0,32767),a.emplaceBack(EXTENT,EXTENT,32767,32767),this.rasterBoundsBuffer=Buffer.fromStructArray(a,Buffer.BufferType.VERTEX),this.rasterBoundsVAO=new VertexArrayObject},Painter.prototype.clearColor=function(){var e=this.gl;e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT)},Painter.prototype.clearStencil=function(){var e=this.gl;e.clearStencil(0),e.stencilMask(255),e.clear(e.STENCIL_BUFFER_BIT)},Painter.prototype.clearDepth=function(){var e=this.gl;e.clearDepth(1),this.depthMask(!0),e.clear(e.DEPTH_BUFFER_BIT)},Painter.prototype._renderTileClippingMasks=function(e){var r=this,t=this.gl;t.colorMask(!1,!1,!1,!1),this.depthMask(!1),t.disable(t.DEPTH_TEST),t.enable(t.STENCIL_TEST),t.stencilMask(248),t.stencilOp(t.KEEP,t.KEEP,t.REPLACE);var a=1;this._tileClippingMaskIDs={};for(var i=0,s=e;i<s.length;i+=1){var o=s[i],n=r._tileClippingMaskIDs[o.id]=a++<<3;t.stencilFunc(t.ALWAYS,n,248);var l=r.useProgram("fill",r.basicFillProgramConfiguration);t.uniformMatrix4fv(l.u_matrix,!1,o.posMatrix),r.tileExtentVAO.bind(t,l,r.tileExtentBuffer),t.drawArrays(t.TRIANGLE_STRIP,0,r.tileExtentBuffer.length)}t.stencilMask(0),t.colorMask(!0,!0,!0,!0),this.depthMask(!0),t.enable(t.DEPTH_TEST)},Painter.prototype.enableTileClippingMask=function(e){var r=this.gl;r.stencilFunc(r.EQUAL,this._tileClippingMaskIDs[e.id],248)},Painter.prototype.prepareBuffers=function(){},Painter.prototype.bindDefaultFramebuffer=function(){var e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null)},Painter.prototype.render=function(e,r){if(this.style=e,this.options=r,this.lineAtlas=e.lineAtlas,this.spriteAtlas=e.spriteAtlas,this.spriteAtlas.setSprite(e.sprite),this.glyphSource=e.glyphSource,this.frameHistory.record(Date.now(),this.transform.zoom,e.getTransition().duration),this.prepareBuffers(),this.clearColor(),this.clearDepth(),this.showOverdrawInspector(r.showOverdrawInspector),this.depthRange=(e._order.length+2)*this.numSublayers*this.depthEpsilon,this.isOpaquePass=!0,this.renderPass(),this.isOpaquePass=!1,this.renderPass(),this.options.showTileBoundaries){var t=this.style.sourceCaches[Object.keys(this.style.sourceCaches)[0]];draw.debug(this,t,t.getVisibleCoordinates())}},Painter.prototype.renderPass=function(){var e,r,t=this,a=this.style._order;this.currentLayer=this.isOpaquePass?a.length-1:0;for(var i=0;i<a.length;i++){var s=t.style._layers[a[t.currentLayer]];s.source!==(e&&e.id)&&(e=t.style.sourceCaches[s.source],r=[],e&&(e.prepare&&e.prepare(),t.clearStencil(),r=e.getVisibleCoordinates(),e.getSource().isTileClipped&&t._renderTileClippingMasks(r)),t.isOpaquePass?t._showOverdrawInspector||t.gl.disable(t.gl.BLEND):(t.gl.enable(t.gl.BLEND),r.reverse())),t.renderLayer(t,e,s,r),t.currentLayer+=t.isOpaquePass?-1:1}},Painter.prototype.depthMask=function(e){e!==this._depthMask&&(this._depthMask=e,this.gl.depthMask(e))},Painter.prototype.renderLayer=function(e,r,t,a){t.isHidden(this.transform.zoom)||("background"===t.type||a.length)&&(this.id=t.id,draw[t.type](e,r,t,a))},Painter.prototype.setDepthSublayer=function(e){var r=1-((1+this.currentLayer)*this.numSublayers+e)*this.depthEpsilon,t=r-1+this.depthRange;this.gl.depthRange(t,r)},Painter.prototype.translatePosMatrix=function(e,r,t,a){if(!t[0]&&!t[1])return e;if("viewport"===a){var i=Math.sin(-this.transform.angle),s=Math.cos(-this.transform.angle);t=[t[0]*s-t[1]*i,t[0]*i+t[1]*s]}var o=[pixelsToTileUnits(r,t[0],this.transform.zoom),pixelsToTileUnits(r,t[1],this.transform.zoom),0],n=new Float32Array(16);return mat4.translate(n,e,o),n},Painter.prototype.saveTileTexture=function(e){var r=this.reusableTextures[e.size];r?r.push(e):this.reusableTextures[e.size]=[e]},Painter.prototype.saveViewportTexture=function(e){this.reusableTextures.viewport||(this.reusableTextures.viewport={}),this.reusableTextures.viewport.texture=e},Painter.prototype.getTileTexture=function(e,r){var t=this.reusableTextures[e];if(t){var a=t[r||e];return a&&a.length>0?a.pop():null}},Painter.prototype.getViewportTexture=function(e,r){if(this.reusableTextures.viewport){var t=this.reusableTextures.viewport.texture;return t.width===e&&t.height===r?t:(this.gl.deleteTexture(t),void(this.reusableTextures.viewport.texture=null))}},Painter.prototype.lineWidth=function(e){this.gl.lineWidth(util.clamp(e,this.lineWidthRange[0],this.lineWidthRange[1]))},Painter.prototype.showOverdrawInspector=function(e){if(e||this._showOverdrawInspector){this._showOverdrawInspector=e;var r=this.gl;if(e){r.blendFunc(r.CONSTANT_COLOR,r.ONE);var t=8,a=1/t;r.blendColor(a,a,a,0),r.clearColor(0,0,0,1),r.clear(r.COLOR_BUFFER_BIT)}else r.blendFunc(r.ONE,r.ONE_MINUS_SRC_ALPHA)}},Painter.prototype.createProgram=function(e,r){var t=this.gl,a=t.createProgram(),i=shaders[e],s="#define MAPBOX_GL_JS;\n";this._showOverdrawInspector&&(s+="#define OVERDRAW_INSPECTOR;\n");var o=t.createShader(t.FRAGMENT_SHADER);t.shaderSource(o,r.applyPragmas(s+shaders.prelude.fragmentSource+i.fragmentSource,"fragment")),t.compileShader(o),t.attachShader(a,o);var n=t.createShader(t.VERTEX_SHADER);t.shaderSource(n,r.applyPragmas(s+shaders.prelude.vertexSource+i.vertexSource,"vertex")),t.compileShader(n),t.attachShader(a,n),t.linkProgram(a);for(var l=t.getProgramParameter(a,t.ACTIVE_ATTRIBUTES),u={program:a,numAttributes:l},h=0;h<l;h++){var c=t.getActiveAttrib(a,h);u[c.name]=t.getAttribLocation(a,c.name)}for(var p=t.getProgramParameter(a,t.ACTIVE_UNIFORMS),d=0;d<p;d++){var f=t.getActiveUniform(a,d);u[f.name]=t.getUniformLocation(a,f.name)}return u},Painter.prototype._createProgramCached=function(e,r){this.cache=this.cache||{};var t=""+e+(r.cacheKey||"")+(this._showOverdrawInspector?"/overdraw":"");return this.cache[t]||(this.cache[t]=this.createProgram(e,r)),this.cache[t]},Painter.prototype.useProgram=function(e,r){var t=this.gl,a=this._createProgramCached(e,r||this.emptyProgramConfiguration);return this.currentProgram!==a&&(t.useProgram(a.program),this.currentProgram=a),a},module.exports=Painter;
	},{"../data/buffer":8,"../data/extent":11,"../data/pos_array":14,"../data/program_configuration":15,"../data/raster_bounds_array":16,"../source/pixels_to_tile_units":44,"../source/source_cache":48,"../util/browser":107,"../util/util":126,"./draw_background":25,"./draw_circle":26,"./draw_debug":28,"./draw_fill":29,"./draw_fill_extrusion":30,"./draw_line":31,"./draw_raster":32,"./draw_symbol":33,"./frame_history":34,"./vertex_array_object":38,"gl-matrix":149,"mapbox-gl-shaders":162}],37:[function(require,module,exports){
	"use strict";var pixelsToTileUnits=require("../source/pixels_to_tile_units");exports.prepare=function(r,t,i){var o=t.gl,e=t.spriteAtlas.getPosition(r.from,!0),_=t.spriteAtlas.getPosition(r.to,!0);e&&_&&(o.uniform1i(i.u_image,0),o.uniform2fv(i.u_pattern_tl_a,e.tl),o.uniform2fv(i.u_pattern_br_a,e.br),o.uniform2fv(i.u_pattern_tl_b,_.tl),o.uniform2fv(i.u_pattern_br_b,_.br),o.uniform1f(i.u_mix,r.t),o.uniform2fv(i.u_pattern_size_a,e.size),o.uniform2fv(i.u_pattern_size_b,_.size),o.uniform1f(i.u_scale_a,r.fromScale),o.uniform1f(i.u_scale_b,r.toScale),o.activeTexture(o.TEXTURE0),t.spriteAtlas.bind(o,!0))},exports.setTile=function(r,t,i){var o=t.gl;o.uniform1f(i.u_tile_units_to_pixels,1/pixelsToTileUnits(r,1,t.transform.tileZoom));var e=Math.pow(2,r.coord.z),_=r.tileSize*Math.pow(2,t.transform.tileZoom)/e,u=_*(r.coord.x+r.coord.w*e),n=_*r.coord.y;o.uniform2f(i.u_pixel_coord_upper,u>>16,n>>16),o.uniform2f(i.u_pixel_coord_lower,65535&u,65535&n)};
	},{"../source/pixels_to_tile_units":44}],38:[function(require,module,exports){
	"use strict";var VertexArrayObject=function(){this.boundProgram=null,this.boundVertexBuffer=null,this.boundVertexBuffer2=null,this.boundElementBuffer=null,this.boundVertexOffset=null,this.vao=null};VertexArrayObject.prototype.bind=function(e,t,r,i,n,o){void 0===e.extVertexArrayObject&&(e.extVertexArrayObject=e.getExtension("OES_vertex_array_object"));var s=!this.vao||this.boundProgram!==t||this.boundVertexBuffer!==r||this.boundVertexBuffer2!==n||this.boundElementBuffer!==i||this.boundVertexOffset!==o;!e.extVertexArrayObject||s?(this.freshBind(e,t,r,i,n,o),this.gl=e):e.extVertexArrayObject.bindVertexArrayOES(this.vao)},VertexArrayObject.prototype.freshBind=function(e,t,r,i,n,o){var s,u=t.numAttributes;if(e.extVertexArrayObject)this.vao&&this.destroy(),this.vao=e.extVertexArrayObject.createVertexArrayOES(),e.extVertexArrayObject.bindVertexArrayOES(this.vao),s=0,this.boundProgram=t,this.boundVertexBuffer=r,this.boundVertexBuffer2=n,this.boundElementBuffer=i,this.boundVertexOffset=o;else{s=e.currentNumAttributes||0;for(var b=u;b<s;b++)e.disableVertexAttribArray(b)}for(var a=s;a<u;a++)e.enableVertexAttribArray(a);r.bind(e),r.setVertexAttribPointers(e,t,o),n&&(n.bind(e),n.setVertexAttribPointers(e,t,o)),i&&i.bind(e),e.currentNumAttributes=u},VertexArrayObject.prototype.destroy=function(){this.vao&&(this.gl.extVertexArrayObject.deleteVertexArrayOES(this.vao),this.vao=null)},module.exports=VertexArrayObject;
	},{}],39:[function(require,module,exports){
	"use strict";function resolveURL(t){var e=window.document.createElement("a");return e.href=t,e.href}var Evented=require("../util/evented"),util=require("../util/util"),window=require("../util/window"),EXTENT=require("../data/extent"),GeoJSONSource=function(t){function e(e,o,i,r){var a=this;t.call(this),o=o||{},this.id=e,this.type="geojson",this.minzoom=0,this.maxzoom=18,this.tileSize=512,this.isTileClipped=!0,this.reparseOverscaled=!0,this.dispatcher=i,this._data=o.data,void 0!==o.maxzoom&&(this.maxzoom=o.maxzoom),o.type&&(this.type=o.type);var s=EXTENT/this.tileSize;this.workerOptions=util.extend({source:this.id,cluster:o.cluster||!1,geojsonVtOptions:{buffer:(void 0!==o.buffer?o.buffer:128)*s,tolerance:(void 0!==o.tolerance?o.tolerance:.375)*s,extent:EXTENT,maxZoom:this.maxzoom},superclusterOptions:{maxZoom:Math.min(o.clusterMaxZoom,this.maxzoom-1)||this.maxzoom-1,extent:EXTENT,radius:(o.clusterRadius||50)*s,log:!1}},o.workerOptions),this.setEventedParent(r),this.fire("dataloading",{dataType:"source"}),this._updateWorkerData(function(t){return t?void a.fire("error",{error:t}):(a.fire("data",{dataType:"source"}),void a.fire("source.load"))})}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.onAdd=function(t){this.map=t},e.prototype.setData=function(t){var e=this;return this._data=t,this.fire("dataloading",{dataType:"source"}),this._updateWorkerData(function(t){return t?e.fire("error",{error:t}):void e.fire("data",{dataType:"source"})}),this},e.prototype._updateWorkerData=function(t){var e=this,o=util.extend({},this.workerOptions),i=this._data;"string"==typeof i?o.url=resolveURL(i):o.data=JSON.stringify(i),this.workerID=this.dispatcher.send(this.type+".loadData",o,function(o){e._loaded=!0,t(o)})},e.prototype.loadTile=function(t,e){var o=this,i=t.coord.z>this.maxzoom?Math.pow(2,t.coord.z-this.maxzoom):1,r={type:this.type,uid:t.uid,coord:t.coord,zoom:t.coord.z,maxZoom:this.maxzoom,tileSize:this.tileSize,source:this.id,overscaling:i,angle:this.map.transform.angle,pitch:this.map.transform.pitch,showCollisionBoxes:this.map.showCollisionBoxes};t.workerID=this.dispatcher.send("loadTile",r,function(i,r){if(t.unloadVectorData(),!t.aborted)return i?e(i):(t.loadVectorData(r,o.map.painter),t.redoWhenDone&&(t.redoWhenDone=!1,t.redoPlacement(o)),e(null))},this.workerID)},e.prototype.abortTile=function(t){t.aborted=!0},e.prototype.unloadTile=function(t){t.unloadVectorData(),this.dispatcher.send("removeTile",{uid:t.uid,type:this.type,source:this.id},function(){},t.workerID)},e.prototype.serialize=function(){return{type:this.type,data:this._data}},e}(Evented);module.exports=GeoJSONSource;
	},{"../data/extent":11,"../util/evented":115,"../util/util":126,"../util/window":109}],40:[function(require,module,exports){
	"use strict";var ajax=require("../util/ajax"),rewind=require("geojson-rewind"),GeoJSONWrapper=require("./geojson_wrapper"),vtpbf=require("vt-pbf"),supercluster=require("supercluster"),geojsonvt=require("geojson-vt"),VectorTileWorkerSource=require("./vector_tile_worker_source"),GeoJSONWorkerSource=function(e){function r(r,t,o){e.call(this,r,t),o&&(this.loadGeoJSON=o),this._geoJSONIndexes={}}return e&&(r.__proto__=e),r.prototype=Object.create(e&&e.prototype),r.prototype.constructor=r,r.prototype.loadVectorData=function(e,r){var t=e.source,o=e.coord;if(!this._geoJSONIndexes[t])return r(null,null);var n=this._geoJSONIndexes[t].getTile(Math.min(o.z,e.maxZoom),o.x,o.y);if(!n)return r(null,null);var a=new GeoJSONWrapper(n.features);a.name="_geojsonTileLayer";var u=vtpbf({layers:{_geojsonTileLayer:a}});0===u.byteOffset&&u.byteLength===u.buffer.byteLength||(u=new Uint8Array(u)),a.rawData=u.buffer,r(null,a)},r.prototype.loadData=function(e,r){var t=function(t,o){var n=this;return t?r(t):"object"!=typeof o?r(new Error("Input data is not a valid GeoJSON object.")):(rewind(o,!0),void this._indexData(o,e,function(t,o){return t?r(t):(n._geoJSONIndexes[e.source]=o,void r(null))}))}.bind(this);this.loadGeoJSON(e,t)},r.prototype.loadGeoJSON=function(e,r){if(e.url)ajax.getJSON(e.url,r);else{if("string"!=typeof e.data)return r(new Error("Input data is not a valid GeoJSON object."));try{return r(null,JSON.parse(e.data))}catch(e){return r(new Error("Input data is not a valid GeoJSON object."))}}},r.prototype._indexData=function(e,r,t){try{r.cluster?t(null,supercluster(r.superclusterOptions).load(e.features)):t(null,geojsonvt(e,r.geojsonVtOptions))}catch(e){return t(e)}},r}(VectorTileWorkerSource);module.exports=GeoJSONWorkerSource;
	},{"../util/ajax":106,"./geojson_wrapper":41,"./vector_tile_worker_source":52,"geojson-rewind":138,"geojson-vt":144,"supercluster":198,"vt-pbf":209}],41:[function(require,module,exports){
	"use strict";var Point=require("point-geometry"),VectorTileFeature=require("vector-tile").VectorTileFeature,EXTENT=require("../data/extent"),FeatureWrapper=function(e){var t=this;if(this.type=e.type,1===e.type){this.rawGeometry=[];for(var r=0;r<e.geometry.length;r++)t.rawGeometry.push([e.geometry[r]])}else this.rawGeometry=e.geometry;this.properties=e.tags,this.extent=EXTENT};FeatureWrapper.prototype.loadGeometry=function(){var e=this,t=this.rawGeometry;this.geometry=[];for(var r=0;r<t.length;r++){for(var o=t[r],a=[],i=0;i<o.length;i++)a.push(new Point(o[i][0],o[i][1]));e.geometry.push(a)}return this.geometry},FeatureWrapper.prototype.bbox=function(){this.geometry||this.loadGeometry();for(var e=this.geometry,t=1/0,r=-(1/0),o=1/0,a=-(1/0),i=0;i<e.length;i++)for(var p=e[i],h=0;h<p.length;h++){var n=p[h];t=Math.min(t,n.x),r=Math.max(r,n.x),o=Math.min(o,n.y),a=Math.max(a,n.y)}return[t,o,r,a]},FeatureWrapper.prototype.toGeoJSON=function(){VectorTileFeature.prototype.toGeoJSON.call(this)};var GeoJSONWrapper=function(e){this.features=e,this.length=e.length,this.extent=EXTENT};GeoJSONWrapper.prototype.feature=function(e){return new FeatureWrapper(this.features[e])},module.exports=GeoJSONWrapper;
	},{"../data/extent":11,"point-geometry":195,"vector-tile":205}],42:[function(require,module,exports){
	"use strict";var util=require("../util/util"),window=require("../util/window"),TileCoord=require("./tile_coord"),LngLat=require("../geo/lng_lat"),Point=require("point-geometry"),Evented=require("../util/evented"),ajax=require("../util/ajax"),EXTENT=require("../data/extent"),RasterBoundsArray=require("../data/raster_bounds_array"),Buffer=require("../data/buffer"),VertexArrayObject=require("../render/vertex_array_object"),ImageSource=function(t){function e(e,r,o,i){t.call(this),this.id=e,this.dispatcher=o,this.coordinates=r.coordinates,this.minzoom=0,this.maxzoom=22,this.tileSize=512,this.setEventedParent(i),this.fire("dataloading",{dataType:"source"}),this._load(r)}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._load=function(t){var e=this;this.url=t.url,ajax.getImage(t.url,function(t,r){return t?e.fire("error",{error:t}):(e.image=r,void e._finishLoading())})},e.prototype._finishLoading=function(){this.fire("data",{dataType:"source"}),this.fire("source.load"),this.map&&this.setCoordinates(this.coordinates)},e.prototype.onAdd=function(t){this.map=t,this.image&&this.setCoordinates(this.coordinates)},e.prototype.setCoordinates=function(t){this.coordinates=t;var e=this.map,r=t.map(function(t){return e.transform.locationCoordinate(LngLat.convert(t)).zoomTo(0)}),o=this.centerCoord=util.getCoordinatesCenter(r);return o.column=Math.round(o.column),o.row=Math.round(o.row),this.minzoom=this.maxzoom=o.zoom,this.coord=new TileCoord(o.zoom,o.column,o.row),this._tileCoords=r.map(function(t){var e=t.zoomTo(o.zoom);return new Point(Math.round((e.column-o.column)*EXTENT),Math.round((e.row-o.row)*EXTENT))}),this.fire("data",{dataType:"source"}),this},e.prototype._setTile=function(t){this.tile=t;var e=32767,r=new RasterBoundsArray;r.emplaceBack(this._tileCoords[0].x,this._tileCoords[0].y,0,0),r.emplaceBack(this._tileCoords[1].x,this._tileCoords[1].y,e,0),r.emplaceBack(this._tileCoords[3].x,this._tileCoords[3].y,0,e),r.emplaceBack(this._tileCoords[2].x,this._tileCoords[2].y,e,e),this.tile.buckets={},this.tile.boundsBuffer=Buffer.fromStructArray(r,Buffer.BufferType.VERTEX),this.tile.boundsVAO=new VertexArrayObject},e.prototype.prepare=function(){this.tile&&this.image&&this._prepareImage(this.map.painter.gl,this.image)},e.prototype._prepareImage=function(t,e){"loaded"!==this.tile.state?(this.tile.state="loaded",this.tile.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.tile.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e)):e instanceof window.HTMLVideoElement&&(t.bindTexture(t.TEXTURE_2D,this.tile.texture),t.texSubImage2D(t.TEXTURE_2D,0,0,0,t.RGBA,t.UNSIGNED_BYTE,e))},e.prototype.loadTile=function(t,e){this.coord&&this.coord.toString()===t.coord.toString()?(this._setTile(t),e(null)):(t.state="errored",e(null))},e.prototype.serialize=function(){return{type:"image",urls:this.url,coordinates:this.coordinates}},e}(Evented);module.exports=ImageSource;
	},{"../data/buffer":8,"../data/extent":11,"../data/raster_bounds_array":16,"../geo/lng_lat":19,"../render/vertex_array_object":38,"../util/ajax":106,"../util/evented":115,"../util/util":126,"../util/window":109,"./tile_coord":50,"point-geometry":195}],43:[function(require,module,exports){
	"use strict";var util=require("../util/util"),ajax=require("../util/ajax"),browser=require("../util/browser"),normalizeURL=require("../util/mapbox").normalizeSourceURL;module.exports=function(r,e){var i=function(r,i){if(r)return e(r);var t=util.pick(i,["tiles","minzoom","maxzoom","attribution"]);i.vector_layers&&(t.vectorLayers=i.vector_layers,t.vectorLayerIds=t.vectorLayers.map(function(r){return r.id})),e(null,t)};r.url?ajax.getJSON(normalizeURL(r.url),i):browser.frame(i.bind(null,null,r))};
	},{"../util/ajax":106,"../util/browser":107,"../util/mapbox":122,"../util/util":126}],44:[function(require,module,exports){
	"use strict";var EXTENT=require("../data/extent");module.exports=function(e,t,r){return t*(EXTENT/(e.tileSize*Math.pow(2,r-e.coord.z)))};
	},{"../data/extent":11}],45:[function(require,module,exports){
	"use strict";function sortTilesIn(e,r){var o=e.coord,t=r.coord;return o.z-t.z||o.y-t.y||o.w-t.w||o.x-t.x}function mergeRenderedFeatureLayers(e){for(var r=e[0]||{},o=1;o<e.length;o++){var t=e[o];for(var n in t){var a=t[n],i=r[n];if(void 0===i)i=r[n]=a;else for(var u=0;u<a.length;u++)i.push(a[u])}}return r}var TileCoord=require("./tile_coord");exports.rendered=function(e,r,o,t,n,a){var i=e.tilesIn(o);i.sort(sortTilesIn);for(var u=[],s=0;s<i.length;s++){var d=i[s];d.tile.featureIndex&&u.push(d.tile.featureIndex.query({queryGeometry:d.queryGeometry,scale:d.scale,tileSize:d.tile.tileSize,bearing:a,params:t},r))}return mergeRenderedFeatureLayers(u)},exports.source=function(e,r){for(var o=e.getRenderableIds().map(function(r){return e.getTileByID(r)}),t=[],n={},a=0;a<o.length;a++){var i=o[a],u=new TileCoord(Math.min(i.sourceMaxZoom,i.coord.z),i.coord.x,i.coord.y,0).id;n[u]||(n[u]=!0,i.querySourceFeatures(t,r))}return t};
	},{"./tile_coord":50}],46:[function(require,module,exports){
	"use strict";var util=require("../util/util"),ajax=require("../util/ajax"),Evented=require("../util/evented"),loadTileJSON=require("./load_tilejson"),normalizeURL=require("../util/mapbox").normalizeTileURL,RasterTileSource=function(e){function t(t,i,r,a){var o=this;e.call(this),this.id=t,this.dispatcher=r,this.minzoom=0,this.maxzoom=22,this.roundZoom=!0,this.scheme="xyz",this.tileSize=512,this._loaded=!1,util.extend(this,util.pick(i,["url","scheme","tileSize"])),this.setEventedParent(a),this.fire("dataloading",{dataType:"source"}),loadTileJSON(i,function(e,t){return e?o.fire("error",e):(util.extend(o,t),o.fire("data",{dataType:"source"}),void o.fire("source.load"))})}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.onAdd=function(e){this.map=e},t.prototype.serialize=function(){return{type:"raster",url:this.url,tileSize:this.tileSize,tiles:this.tiles}},t.prototype.loadTile=function(e,t){function i(i,r){if(delete e.request,e.aborted)return this.state="unloaded",t(null);if(i)return this.state="errored",t(i);var a=this.map.painter.gl;e.texture=this.map.painter.getTileTexture(r.width),e.texture?(a.bindTexture(a.TEXTURE_2D,e.texture),a.texSubImage2D(a.TEXTURE_2D,0,0,0,a.RGBA,a.UNSIGNED_BYTE,r)):(e.texture=a.createTexture(),a.bindTexture(a.TEXTURE_2D,e.texture),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR_MIPMAP_NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,r),e.texture.size=r.width),a.generateMipmap(a.TEXTURE_2D),e.state="loaded",t(null)}var r=normalizeURL(e.coord.url(this.tiles,null,this.scheme),this.url,this.tileSize);e.request=ajax.getImage(r,i.bind(this))},t.prototype.abortTile=function(e){e.request&&(e.request.abort(),delete e.request)},t.prototype.unloadTile=function(e){e.texture&&this.map.painter.saveTileTexture(e.texture)},t}(Evented);module.exports=RasterTileSource;
	},{"../util/ajax":106,"../util/evented":115,"../util/mapbox":122,"../util/util":126,"./load_tilejson":43}],47:[function(require,module,exports){
	"use strict";var util=require("../util/util"),sourceTypes={vector:require("../source/vector_tile_source"),raster:require("../source/raster_tile_source"),geojson:require("../source/geojson_source"),video:require("../source/video_source"),image:require("../source/image_source")};exports.create=function(e,r,o,t){if(r=new sourceTypes[r.type](e,r,o,t),r.setEventedParent(t),r.id!==e)throw new Error("Expected Source id to be "+e+" instead of "+r.id);return util.bindAll(["load","abort","unload","serialize","prepare"],r),r},exports.getType=function(e){return sourceTypes[e]},exports.setType=function(e,r){sourceTypes[e]=r};
	},{"../source/geojson_source":39,"../source/image_source":42,"../source/raster_tile_source":46,"../source/vector_tile_source":51,"../source/video_source":53,"../util/util":126}],48:[function(require,module,exports){
	"use strict";function coordinateToTilePoint(e,t,o){var r=o.zoomTo(Math.min(e.z,t));return{x:(r.column-(e.x+e.w*Math.pow(2,e.z)))*EXTENT,y:(r.row-e.y)*EXTENT}}function compareKeyZoom(e,t){return e%32-t%32}var Source=require("./source"),Tile=require("./tile"),Evented=require("../util/evented"),TileCoord=require("./tile_coord"),Cache=require("../util/lru_cache"),Coordinate=require("../geo/coordinate"),util=require("../util/util"),EXTENT=require("../data/extent"),SourceCache=function(e){function t(t,o,r){e.call(this),this.id=t,this.dispatcher=r,this._source=Source.create(t,o,r,this),this.on("source.load",function(){this.map&&this._source.onAdd&&this._source.onAdd(this.map),this._sourceLoaded=!0}),this.on("error",function(){this._sourceErrored=!0}),this.on("data",function(e){this._sourceLoaded&&"source"===e.dataType&&(this.reload(),this.transform&&this.update(this.transform))}),this._tiles={},this._cache=new Cache(0,this.unloadTile.bind(this)),this._isIdRenderable=this._isIdRenderable.bind(this)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.onAdd=function(e){this.map=e,this._source&&this._source.onAdd&&this._source.onAdd(e)},t.prototype.loaded=function(){var e=this;if(this._sourceErrored)return!0;if(!this._sourceLoaded)return!1;for(var t in this._tiles){var o=e._tiles[t];if("loaded"!==o.state&&"errored"!==o.state)return!1}return!0},t.prototype.getSource=function(){return this._source},t.prototype.loadTile=function(e,t){return this._source.loadTile(e,t)},t.prototype.unloadTile=function(e){if(this._source.unloadTile)return this._source.unloadTile(e)},t.prototype.abortTile=function(e){if(this._source.abortTile)return this._source.abortTile(e)},t.prototype.serialize=function(){return this._source.serialize()},t.prototype.prepare=function(){if(this._sourceLoaded&&this._source.prepare)return this._source.prepare()},t.prototype.getIds=function(){return Object.keys(this._tiles).map(Number).sort(compareKeyZoom)},t.prototype.getRenderableIds=function(){return this.getIds().filter(this._isIdRenderable)},t.prototype._isIdRenderable=function(e){return this._tiles[e].hasData()&&!this._coveredTiles[e]},t.prototype.reload=function(){var e=this;this._cache.reset();for(var t in this._tiles){var o=e._tiles[t];"loading"!==o.state&&(o.state="reloading"),e.loadTile(e._tiles[t],e._tileLoaded.bind(e,e._tiles[t]))}},t.prototype._tileLoaded=function(e,t){return t?(e.state="errored",void this._source.fire("error",{tile:e,error:t})):(e.sourceCache=this,e.timeAdded=(new Date).getTime(),this._source.fire("data",{tile:e,dataType:"tile"}),void(this.map&&(this.map.painter.tileExtentVAO.vao=null)))},t.prototype.getTile=function(e){return this.getTileByID(e.id)},t.prototype.getTileByID=function(e){return this._tiles[e]},t.prototype.getZoom=function(e){return e.zoom+e.scaleZoom(e.tileSize/this._source.tileSize)},t.prototype.findLoadedChildren=function(e,t,o){var r=this,i=!1;for(var s in this._tiles){var a=r._tiles[s];if(!(o[s]||!a.hasData()||a.coord.z<=e.z||a.coord.z>t)){var n=Math.pow(2,Math.min(a.coord.z,r._source.maxzoom)-Math.min(e.z,r._source.maxzoom));if(Math.floor(a.coord.x/n)===e.x&&Math.floor(a.coord.y/n)===e.y)for(o[s]=!0,i=!0;a&&a.coord.z-1>e.z;){var d=a.coord.parent(r._source.maxzoom).id;a=r._tiles[d],a&&a.hasData()&&(delete o[s],o[d]=!0)}}}return i},t.prototype.findLoadedParent=function(e,t,o){for(var r=this,i=e.z-1;i>=t;i--){e=e.parent(r._source.maxzoom);var s=r._tiles[e.id];if(s&&s.hasData())return o[e.id]=!0,s;if(r._cache.has(e.id))return r.addTile(e),o[e.id]=!0,r._tiles[e.id]}},t.prototype.updateCacheSize=function(e){var t=Math.ceil(e.width/e.tileSize)+1,o=Math.ceil(e.height/e.tileSize)+1,r=t*o,i=5;this._cache.setMaxSize(Math.floor(r*i))},t.prototype.update=function(e){var o=this;if(this._sourceLoaded){var r,i,s;this.updateCacheSize(e);var a=(this._source.roundZoom?Math.round:Math.floor)(this.getZoom(e)),n=Math.max(a-t.maxOverzooming,this._source.minzoom),d=Math.max(a+t.maxUnderzooming,this._source.minzoom),c={};this._coveredTiles={};var h;for(h=this.used?this._source.coord?[this._source.coord]:e.coveringTiles({tileSize:this._source.tileSize,minzoom:this._source.minzoom,maxzoom:this._source.maxzoom,roundZoom:this._source.roundZoom,reparseOverscaled:this._source.reparseOverscaled}):[],r=0;r<h.length;r++)i=h[r],s=o.addTile(i),c[i.id]=!0,s.hasData()||o.findLoadedChildren(i,d,c)||o.findLoadedParent(i,n,c);for(var u={},l=Object.keys(c),p=0;p<l.length;p++){var _=l[p];i=TileCoord.fromID(_),s=o._tiles[_],s&&s.animationLoopEndTime>=Date.now()&&(o.findLoadedChildren(i,d,c)&&(c[_]=!0),o.findLoadedParent(i,n,u))}var m;for(m in u)c[m]||(o._coveredTiles[m]=!0);for(m in u)c[m]=!0;var f=util.keysDifference(this._tiles,c);for(r=0;r<f.length;r++)o.removeTile(+f[r]);this.transform=e}},t.prototype.addTile=function(e){var t=this._tiles[e.id];if(t)return t;var o=e.wrapped();if(t=this._tiles[o.id],t||(t=this._cache.get(o.id),t&&t.redoPlacement(this._source)),!t){var r=e.z,i=r>this._source.maxzoom?Math.pow(2,r-this._source.maxzoom):1;t=new Tile(o,this._source.tileSize*i,this._source.maxzoom),this.loadTile(t,this._tileLoaded.bind(this,t))}return t.uses++,this._tiles[e.id]=t,this._source.fire("dataloading",{tile:t,dataType:"tile"}),t},t.prototype.removeTile=function(e){var t=this._tiles[e];t&&(t.uses--,delete this._tiles[e],this._source.fire("data",{tile:t,dataType:"tile"}),t.uses>0||(t.hasData()?this._cache.add(t.coord.wrapped().id,t):(t.aborted=!0,this.abortTile(t),this.unloadTile(t))))},t.prototype.clearTiles=function(){var e=this;for(var t in this._tiles)e.removeTile(t);this._cache.reset()},t.prototype.tilesIn=function(e){for(var t=this,o={},r=this.getIds(),i=1/0,s=1/0,a=-(1/0),n=-(1/0),d=e[0].zoom,c=0;c<e.length;c++){var h=e[c];i=Math.min(i,h.column),s=Math.min(s,h.row),a=Math.max(a,h.column),n=Math.max(n,h.row)}for(var u=0;u<r.length;u++){var l=t._tiles[r[u]],p=TileCoord.fromID(r[u]),_=[coordinateToTilePoint(p,l.sourceMaxZoom,new Coordinate(i,s,d)),coordinateToTilePoint(p,l.sourceMaxZoom,new Coordinate(a,n,d))];if(_[0].x<EXTENT&&_[0].y<EXTENT&&_[1].x>=0&&_[1].y>=0){for(var m=[],f=0;f<e.length;f++)m.push(coordinateToTilePoint(p,l.sourceMaxZoom,e[f]));var v=o[l.coord.id];void 0===v&&(v=o[l.coord.id]={tile:l,coord:p,queryGeometry:[],scale:Math.pow(2,t.transform.zoom-l.coord.z)}),v.queryGeometry.push(m)}}var T=[];for(var y in o)T.push(o[y]);return T},t.prototype.redoPlacement=function(){for(var e=this,t=this.getIds(),o=0;o<t.length;o++){var r=e.getTileByID(t[o]);r.redoPlacement(e._source)}},t.prototype.getVisibleCoordinates=function(){for(var e=this,t=this.getRenderableIds().map(TileCoord.fromID),o=0,r=t;o<r.length;o+=1){var i=r[o];i.posMatrix=e.transform.calculatePosMatrix(i,e._source.maxzoom)}return t},t}(Evented);SourceCache.maxOverzooming=10,SourceCache.maxUnderzooming=3,module.exports=SourceCache;
	},{"../data/extent":11,"../geo/coordinate":18,"../util/evented":115,"../util/lru_cache":121,"../util/util":126,"./source":47,"./tile":49,"./tile_coord":50}],49:[function(require,module,exports){
	"use strict";var util=require("../util/util"),Bucket=require("../data/bucket"),FeatureIndex=require("../data/feature_index"),vt=require("vector-tile"),Protobuf=require("pbf"),GeoJSONFeature=require("../util/vectortile_to_geojson"),featureFilter=require("feature-filter"),CollisionTile=require("../symbol/collision_tile"),CollisionBoxArray=require("../symbol/collision_box"),SymbolInstancesArray=require("../symbol/symbol_instances"),SymbolQuadsArray=require("../symbol/symbol_quads"),Tile=function(e,t,i){this.coord=e,this.uid=util.uniqueId(),this.uses=0,this.tileSize=t,this.sourceMaxZoom=i,this.buckets={},this.state="loading"};Tile.prototype.setAnimationLoop=function(e,t){this.animationLoopEndTime=t+Date.now(),void 0!==this.animationLoopId&&e.cancel(this.animationLoopId),this.animationLoopId=e.set(t)},Tile.prototype.loadVectorData=function(e,t){this.hasData()&&this.unloadVectorData(t),this.state="loaded",e&&(e.rawTileData&&(this.rawTileData=e.rawTileData),this.collisionBoxArray=new CollisionBoxArray(e.collisionBoxArray),this.collisionTile=new CollisionTile(e.collisionTile,this.collisionBoxArray),this.symbolInstancesArray=new SymbolInstancesArray(e.symbolInstancesArray),this.symbolQuadsArray=new SymbolQuadsArray(e.symbolQuadsArray),this.featureIndex=new FeatureIndex(e.featureIndex,this.rawTileData,this.collisionTile),this.buckets=Bucket.deserialize(e.buckets,t.style))},Tile.prototype.reloadSymbolData=function(e,t){var i=this;if("unloaded"!==this.state){this.collisionTile=new CollisionTile(e.collisionTile,this.collisionBoxArray),this.featureIndex.setCollisionTile(this.collisionTile);for(var o in this.buckets){var s=i.buckets[o];"symbol"===s.type&&(s.destroy(),delete i.buckets[o])}util.extend(this.buckets,Bucket.deserialize(e.buckets,t))}},Tile.prototype.unloadVectorData=function(){var e=this;for(var t in this.buckets)e.buckets[t].destroy();this.buckets={},this.collisionBoxArray=null,this.symbolQuadsArray=null,this.symbolInstancesArray=null,this.collisionTile=null,this.featureIndex=null,this.state="unloaded"},Tile.prototype.redoPlacement=function(e){function t(t,i){this.reloadSymbolData(i,e.map.style),e.fire("data",{tile:this,dataType:"tile"}),e.map&&(e.map.painter.tileExtentVAO.vao=null),this.state="loaded",this.redoWhenDone&&(this.redoPlacement(e),this.redoWhenDone=!1)}if("vector"===e.type||"geojson"===e.type){if("loaded"!==this.state||"reloading"===this.state)return void(this.redoWhenDone=!0);this.state="reloading",e.dispatcher.send("redoPlacement",{type:e.type,uid:this.uid,source:e.id,angle:e.map.transform.angle,pitch:e.map.transform.pitch,showCollisionBoxes:e.map.showCollisionBoxes},t.bind(this),this.workerID)}},Tile.prototype.getBucket=function(e){return this.buckets[e.id]},Tile.prototype.querySourceFeatures=function(e,t){var i=this;if(this.rawTileData){this.vtLayers||(this.vtLayers=new vt.VectorTile(new Protobuf(this.rawTileData)).layers);var o=this.vtLayers._geojsonTileLayer||this.vtLayers[t.sourceLayer];if(o)for(var s=featureFilter(t&&t.filter),r={z:this.coord.z,x:this.coord.x,y:this.coord.y},a=0;a<o.length;a++){var l=o.feature(a);if(s(l)){var n=new GeoJSONFeature(l,i.coord.z,i.coord.x,i.coord.y);n.tile=r,e.push(n)}}}},Tile.prototype.hasData=function(){return"loaded"===this.state||"reloading"===this.state},module.exports=Tile;
	},{"../data/bucket":2,"../data/feature_index":12,"../symbol/collision_box":75,"../symbol/collision_tile":77,"../symbol/symbol_instances":86,"../symbol/symbol_quads":87,"../util/util":126,"../util/vectortile_to_geojson":127,"feature-filter":137,"pbf":193,"vector-tile":205}],50:[function(require,module,exports){
	"use strict";function edge(t,i){if(t.row>i.row){var o=t;t=i,i=o}return{x0:t.column,y0:t.row,x1:i.column,y1:i.row,dx:i.column-t.column,dy:i.row-t.row}}function scanSpans(t,i,o,r,e){var n=Math.max(o,Math.floor(i.y0)),h=Math.min(r,Math.ceil(i.y1));if(t.x0===i.x0&&t.y0===i.y0?t.x0+i.dy/t.dy*t.dx<i.x1:t.x1-i.dy/t.dy*t.dx<i.x0){var s=t;t=i,i=s}for(var a=t.dx/t.dy,d=i.dx/i.dy,y=t.dx>0,l=i.dx<0,u=n;u<h;u++){var x=a*Math.max(0,Math.min(t.dy,u+y-t.y0))+t.x0,c=d*Math.max(0,Math.min(i.dy,u+l-i.y0))+i.x0;e(Math.floor(c),Math.ceil(x),u)}}function scanTriangle(t,i,o,r,e,n){var h,s=edge(t,i),a=edge(i,o),d=edge(o,t);s.dy>a.dy&&(h=s,s=a,a=h),s.dy>d.dy&&(h=s,s=d,d=h),a.dy>d.dy&&(h=a,a=d,d=h),s.dy&&scanSpans(d,s,r,e,n),a.dy&&scanSpans(d,a,r,e,n)}function getQuadkey(t,i,o){for(var r,e="",n=t;n>0;n--)r=1<<n-1,e+=(i&r?1:0)+(o&r?2:0);return e}var WhooTS=require("whoots-js"),Coordinate=require("../geo/coordinate"),TileCoord=function(t,i,o,r){isNaN(r)&&(r=0),this.z=+t,this.x=+i,this.y=+o,this.w=+r,r*=2,r<0&&(r=r*-1-1);var e=1<<this.z;this.id=32*(e*e*r+e*this.y+this.x)+this.z,this.posMatrix=null};TileCoord.prototype.toString=function(){return this.z+"/"+this.x+"/"+this.y},TileCoord.prototype.toCoordinate=function(t){var i=Math.min(this.z,t),o=Math.pow(2,i),r=this.y,e=this.x+o*this.w;return new Coordinate(e,r,i)},TileCoord.prototype.url=function(t,i,o){var r=WhooTS.getTileBBox(this.x,this.y,this.z),e=getQuadkey(this.z,this.x,this.y);return t[(this.x+this.y)%t.length].replace("{prefix}",(this.x%16).toString(16)+(this.y%16).toString(16)).replace("{z}",Math.min(this.z,i||this.z)).replace("{x}",this.x).replace("{y}","tms"===o?Math.pow(2,this.z)-this.y-1:this.y).replace("{quadkey}",e).replace("{bbox-epsg-3857}",r)},TileCoord.prototype.parent=function(t){return 0===this.z?null:this.z>t?new TileCoord(this.z-1,this.x,this.y,this.w):new TileCoord(this.z-1,Math.floor(this.x/2),Math.floor(this.y/2),this.w)},TileCoord.prototype.wrapped=function(){return new TileCoord(this.z,this.x,this.y,0)},TileCoord.prototype.children=function(t){if(this.z>=t)return[new TileCoord(this.z+1,this.x,this.y,this.w)];var i=this.z+1,o=2*this.x,r=2*this.y;return[new TileCoord(i,o,r,this.w),new TileCoord(i,o+1,r,this.w),new TileCoord(i,o,r+1,this.w),new TileCoord(i,o+1,r+1,this.w)]},TileCoord.cover=function(t,i,o){function r(t,i,r){var h,s,a;if(r>=0&&r<=e)for(h=t;h<i;h++)s=(h%e+e)%e,a=new TileCoord(o,s,r,Math.floor(h/e)),n[a.id]=a}var e=1<<t,n={};return scanTriangle(i[0],i[1],i[2],0,e,r),scanTriangle(i[2],i[3],i[0],0,e,r),Object.keys(n).map(function(t){return n[t]})},TileCoord.fromID=function(t){var i=t%32,o=1<<i,r=(t-i)/32,e=r%o,n=(r-e)/o%o,h=Math.floor(r/(o*o));return h%2!==0&&(h=h*-1-1),h/=2,new TileCoord(i,e,n,h)},module.exports=TileCoord;
	},{"../geo/coordinate":18,"whoots-js":213}],51:[function(require,module,exports){
	"use strict";var Evented=require("../util/evented"),util=require("../util/util"),loadTileJSON=require("./load_tilejson"),normalizeURL=require("../util/mapbox").normalizeTileURL,VectorTileSource=function(e){function t(t,i,o,r){var l=this;if(e.call(this),this.id=t,this.dispatcher=o,this.type="vector",this.minzoom=0,this.maxzoom=22,this.scheme="xyz",this.tileSize=512,this.reparseOverscaled=!0,this.isTileClipped=!0,util.extend(this,util.pick(i,["url","scheme","tileSize"])),this._options=util.extend({type:"vector"},i),512!==this.tileSize)throw new Error("vector tile sources must have a tileSize of 512");this.setEventedParent(r),this.fire("dataloading",{dataType:"source"}),loadTileJSON(i,function(e,t){return e?void l.fire("error",e):(util.extend(l,t),l.fire("data",{dataType:"source"}),void l.fire("source.load"))})}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.onAdd=function(e){this.map=e},t.prototype.serialize=function(){return util.extend({},this._options)},t.prototype.loadTile=function(e,t){function i(i,o){if(!e.aborted){if(i)return t(i);e.loadVectorData(o,this.map.painter),e.redoWhenDone&&(e.redoWhenDone=!1,e.redoPlacement(this)),t(null),e.reloadCallback&&(this.loadTile(e,e.reloadCallback),e.reloadCallback=null)}}var o=e.coord.z>this.maxzoom?Math.pow(2,e.coord.z-this.maxzoom):1,r={url:normalizeURL(e.coord.url(this.tiles,this.maxzoom,this.scheme),this.url),uid:e.uid,coord:e.coord,zoom:e.coord.z,tileSize:this.tileSize*o,type:this.type,source:this.id,overscaling:o,angle:this.map.transform.angle,pitch:this.map.transform.pitch,showCollisionBoxes:this.map.showCollisionBoxes};e.workerID?"loading"===e.state?e.reloadCallback=t:this.dispatcher.send("reloadTile",r,i.bind(this),e.workerID):e.workerID=this.dispatcher.send("loadTile",r,i.bind(this))},t.prototype.abortTile=function(e){this.dispatcher.send("abortTile",{uid:e.uid,type:this.type,source:this.id},null,e.workerID)},t.prototype.unloadTile=function(e){e.unloadVectorData(),this.dispatcher.send("removeTile",{uid:e.uid,type:this.type,source:this.id},null,e.workerID)},t}(Evented);module.exports=VectorTileSource;
	},{"../util/evented":115,"../util/mapbox":122,"../util/util":126,"./load_tilejson":43}],52:[function(require,module,exports){
	"use strict";var ajax=require("../util/ajax"),vt=require("vector-tile"),Protobuf=require("pbf"),WorkerTile=require("./worker_tile"),util=require("../util/util"),VectorTileWorkerSource=function(e,r,o){this.actor=e,this.layerIndex=r,o&&(this.loadVectorData=o),this.loading={},this.loaded={}};VectorTileWorkerSource.prototype.loadTile=function(e,r){function o(e,o){return delete this.loading[t][i],e?r(e):o?(a.vectorTile=o,a.parse(o,this.layerIndex,this.actor,function(e,t,i){return e?r(e):void r(null,util.extend({rawTileData:o.rawData},t),i)}),this.loaded[t]=this.loaded[t]||{},void(this.loaded[t][i]=a)):r(null,null)}var t=e.source,i=e.uid;this.loading[t]||(this.loading[t]={});var a=this.loading[t][i]=new WorkerTile(e);a.abort=this.loadVectorData(e,o.bind(this))},VectorTileWorkerSource.prototype.reloadTile=function(e,r){var o=this.loaded[e.source],t=e.uid;if(o&&o[t]){var i=o[t];i.parse(i.vectorTile,this.layerIndex,this.actor,r)}},VectorTileWorkerSource.prototype.abortTile=function(e){var r=this.loading[e.source],o=e.uid;r&&r[o]&&r[o].abort&&(r[o].abort(),delete r[o])},VectorTileWorkerSource.prototype.removeTile=function(e){var r=this.loaded[e.source],o=e.uid;r&&r[o]&&delete r[o]},VectorTileWorkerSource.prototype.loadVectorData=function(e,r){function o(e,o){if(e)return r(e);var t=new vt.VectorTile(new Protobuf(o));t.rawData=o,r(e,t)}var t=ajax.getArrayBuffer(e.url,o.bind(this));return function(){t.abort()}},VectorTileWorkerSource.prototype.redoPlacement=function(e,r){var o=this.loaded[e.source],t=this.loading[e.source],i=e.uid;if(o&&o[i]){var a=o[i],l=a.redoPlacement(e.angle,e.pitch,e.showCollisionBoxes);l.result&&r(null,l.result,l.transferables)}else t&&t[i]&&(t[i].angle=e.angle)},module.exports=VectorTileWorkerSource;
	},{"../util/ajax":106,"../util/util":126,"./worker_tile":55,"pbf":193,"vector-tile":205}],53:[function(require,module,exports){
	"use strict";var ajax=require("../util/ajax"),ImageSource=require("./image_source"),VideoSource=function(e){function t(t,o,i,r){e.call(this,t,o,i,r),this.roundZoom=!0}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype._load=function(e){var t=this;this.urls=e.urls,ajax.getVideo(e.urls,function(e,o){if(e)return t.fire("error",{error:e});t.video=o,t.video.loop=!0;var i;t.video.addEventListener("playing",function(){i=t.map.style.animationLoop.set(1/0),t.map._rerender()}),t.video.addEventListener("pause",function(){t.map.style.animationLoop.cancel(i)}),t.map&&t.video.play(),t._finishLoading()})},t.prototype.getVideo=function(){return this.video},t.prototype.onAdd=function(e){this.map||(this.map=e,this.video&&(this.video.play(),this.setCoordinates(this.coordinates)))},t.prototype.prepare=function(){!this.tile||this.video.readyState<2||this._prepareImage(this.map.painter.gl,this.video)},t.prototype.serialize=function(){return{type:"video",urls:this.urls,coordinates:this.coordinates}},t}(ImageSource);module.exports=VideoSource;
	},{"../util/ajax":106,"./image_source":42}],54:[function(require,module,exports){
	"use strict";var Actor=require("../util/actor"),StyleLayerIndex=require("../style/style_layer_index"),VectorTileWorkerSource=require("./vector_tile_worker_source"),GeoJSONWorkerSource=require("./geojson_worker_source"),Worker=function(e){var r=this;this.self=e,this.actor=new Actor(e,this),this.layerIndexes={},this.workerSourceTypes={vector:VectorTileWorkerSource,geojson:GeoJSONWorkerSource},this.workerSources={},this.self.registerWorkerSource=function(e,o){if(r.workerSourceTypes[e])throw new Error('Worker source with name "'+e+'" already registered.');r.workerSourceTypes[e]=o}};Worker.prototype.setLayers=function(e,r){this.getLayerIndex(e).replace(r)},Worker.prototype.updateLayers=function(e,r){this.getLayerIndex(e).update(r.layers,r.removedIds,r.symbolOrder)},Worker.prototype.loadTile=function(e,r,o){this.getWorkerSource(e,r.type).loadTile(r,o)},Worker.prototype.reloadTile=function(e,r,o){this.getWorkerSource(e,r.type).reloadTile(r,o)},Worker.prototype.abortTile=function(e,r){this.getWorkerSource(e,r.type).abortTile(r)},Worker.prototype.removeTile=function(e,r){this.getWorkerSource(e,r.type).removeTile(r)},Worker.prototype.redoPlacement=function(e,r,o){this.getWorkerSource(e,r.type).redoPlacement(r,o)},Worker.prototype.loadWorkerSource=function(e,r,o){try{this.self.importScripts(r.url),o()}catch(e){o(e)}},Worker.prototype.getLayerIndex=function(e){var r=this.layerIndexes[e];return r||(r=this.layerIndexes[e]=new StyleLayerIndex),r},Worker.prototype.getWorkerSource=function(e,r){var o=this;if(this.workerSources[e]||(this.workerSources[e]={}),!this.workerSources[e][r]){var t={send:function(r,t,i,s){o.actor.send(r,t,i,s,e)}};this.workerSources[e][r]=new this.workerSourceTypes[r](t,this.getLayerIndex(e))}return this.workerSources[e][r]},module.exports=function(e){return new Worker(e)};
	},{"../style/style_layer_index":68,"../util/actor":105,"./geojson_worker_source":40,"./vector_tile_worker_source":52}],55:[function(require,module,exports){
	"use strict";function serializeBuckets(e,r){return e.filter(function(e){return!e.isEmpty()}).map(function(e){return e.serialize(r)})}var FeatureIndex=require("../data/feature_index"),CollisionTile=require("../symbol/collision_tile"),CollisionBoxArray=require("../symbol/collision_box"),DictionaryCoder=require("../util/dictionary_coder"),util=require("../util/util"),SymbolInstancesArray=require("../symbol/symbol_instances"),SymbolQuadsArray=require("../symbol/symbol_quads"),WorkerTile=function(e){this.coord=e.coord,this.uid=e.uid,this.zoom=e.zoom,this.tileSize=e.tileSize,this.source=e.source,this.overscaling=e.overscaling,this.angle=e.angle,this.pitch=e.pitch,this.showCollisionBoxes=e.showCollisionBoxes};WorkerTile.prototype.parse=function(e,r,o,s){var i=this;e.layers||(e={layers:{_geojsonTileLayer:e}}),this.status="parsing",this.data=e,this.collisionBoxArray=new CollisionBoxArray,this.symbolInstancesArray=new SymbolInstancesArray,this.symbolQuadsArray=new SymbolQuadsArray;var l=new CollisionTile(this.angle,this.pitch,this.collisionBoxArray),t=new DictionaryCoder(Object.keys(e.layers).sort()),a=new FeatureIndex(this.coord,this.overscaling,l,e.layers);a.bucketLayerIDs={};var n={},c=0,u={featureIndex:a,iconDependencies:{},glyphDependencies:{}},y=r.familiesBySource[this.source];for(var m in y){var h=e.layers[m];if(h){1===h.version&&util.warnOnce('Vector tile source "'+i.source+'" layer "'+m+'" does not use vector tile spec v2 and therefore may have some rendering errors.');for(var d=t.encode(m),b=[],f=0;f<h.length;f++){var v=h.feature(f);v.index=f,v.sourceLayerIndex=d,b.push(v)}for(var p=0,g=y[m];p<g.length;p+=1){var A=g[p],z=A[0];if(!(z.minzoom&&i.zoom<z.minzoom||z.maxzoom&&i.zoom>=z.maxzoom||z.layout&&"none"===z.layout.visibility)){for(var x=0,k=A;x<k.length;x+=1){var B=k[x];B.recalculate(i.zoom)}var I=n[z.id]=z.createBucket({index:c,layers:A,zoom:i.zoom,overscaling:i.overscaling,collisionBoxArray:i.collisionBoxArray,symbolQuadsArray:i.symbolQuadsArray,symbolInstancesArray:i.symbolInstancesArray});I.populate(b,u),a.bucketLayerIDs[c]=A.map(function(e){return e.id}),c++}}}}var w=function(){i.status="done",i.redoPlacementAfterDone&&(i.redoPlacement(i.angle,i.pitch,null),i.redoPlacementAfterDone=!1);var e=[];s(null,{buckets:serializeBuckets(util.values(n),e),featureIndex:a.serialize(e),collisionTile:l.serialize(e),collisionBoxArray:i.collisionBoxArray.serialize(),symbolInstancesArray:i.symbolInstancesArray.serialize(),symbolQuadsArray:i.symbolQuadsArray.serialize()},e)};this.symbolBuckets=[];for(var D=r.symbolOrder.length-1;D>=0;D--){var C=n[r.symbolOrder[D]];C&&i.symbolBuckets.push(C)}if(0===this.symbolBuckets.length)return w();var T=0,q=Object.keys(u.iconDependencies),O=util.mapObject(u.glyphDependencies,function(e){return Object.keys(e).map(Number)}),Q=function(e){if(e)return s(e);if(T++,2===T){for(var r=0,o=i.symbolBuckets;r<o.length;r+=1){for(var t=o[r],a=0,n=t.layers;a<n.length;a+=1){var c=n[a];c.recalculate(i.zoom)}t.prepare(O,q),t.place(l,i.showCollisionBoxes)}w()}};Object.keys(O).length?o.send("getGlyphs",{uid:this.uid,stacks:O},function(e,r){O=r,Q(e)}):Q(),q.length?o.send("getIcons",{icons:q},function(e,r){q=r,Q(e)}):Q()},WorkerTile.prototype.redoPlacement=function(e,r,o){var s=this;if("done"!==this.status)return this.redoPlacementAfterDone=!0,this.angle=e,{};for(var i=new CollisionTile(e,r,this.collisionBoxArray),l=0,t=this.symbolBuckets;l<t.length;l+=1){for(var a=t[l],n=0,c=a.layers;n<c.length;n+=1){var u=c[n];u.recalculate(s.zoom)}a.place(i,o)}var y=[];return{result:{buckets:serializeBuckets(this.symbolBuckets,y),collisionTile:i.serialize(y)},transferables:y}},module.exports=WorkerTile;
	},{"../data/feature_index":12,"../symbol/collision_box":75,"../symbol/collision_tile":77,"../symbol/symbol_instances":86,"../symbol/symbol_quads":87,"../util/dictionary_coder":112,"../util/util":126}],56:[function(require,module,exports){
	"use strict";var AnimationLoop=function(){this.n=0,this.times=[]};AnimationLoop.prototype.stopped=function(){return this.times=this.times.filter(function(t){return t.time>=(new Date).getTime()}),!this.times.length},AnimationLoop.prototype.set=function(t){return this.times.push({id:this.n,time:t+(new Date).getTime()}),this.n++},AnimationLoop.prototype.cancel=function(t){this.times=this.times.filter(function(i){return i.id!==t})},module.exports=AnimationLoop;
	},{}],57:[function(require,module,exports){
	"use strict";var Evented=require("../util/evented"),ajax=require("../util/ajax"),browser=require("../util/browser"),normalizeURL=require("../util/mapbox").normalizeSpriteURL,SpritePosition=function(){this.x=0,this.y=0,this.width=0,this.height=0,this.pixelRatio=1,this.sdf=!1},ImageSprite=function(t){function i(i){var e=this;t.call(this),this.base=i,this.retina=browser.devicePixelRatio>1;var a=this.retina?"@2x":"";ajax.getJSON(normalizeURL(i,a,".json"),function(t,i){return t?void e.fire("error",{error:t}):(e.data=i,void(e.imgData&&e.fire("data",{dataType:"style"})))}),ajax.getImage(normalizeURL(i,a,".png"),function(t,i){if(t)return void e.fire("error",{error:t});e.imgData=browser.getImageData(i);for(var a=0;a<e.imgData.length;a+=4){var r=e.imgData[a+3]/255;e.imgData[a+0]*=r,e.imgData[a+1]*=r,e.imgData[a+2]*=r}e.width=i.width,e.data&&e.fire("data",{dataType:"style"})})}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.toJSON=function(){return this.base},i.prototype.loaded=function(){return!(!this.data||!this.imgData)},i.prototype.resize=function(){var t=this;if(browser.devicePixelRatio>1!==this.retina){var e=new i(this.base);e.on("data",function(){t.data=e.data,t.imgData=e.imgData,t.width=e.width,t.retina=e.retina})}},i.prototype.getSpritePosition=function(t){if(!this.loaded())return new SpritePosition;var i=this.data&&this.data[t];return i&&this.imgData?i:new SpritePosition},i}(Evented);module.exports=ImageSprite;
	},{"../util/ajax":106,"../util/browser":107,"../util/evented":115,"../util/mapbox":122}],58:[function(require,module,exports){
	"use strict";var styleSpec=require("./style_spec"),util=require("../util/util"),Evented=require("../util/evented"),validateStyle=require("./validate_style"),StyleDeclaration=require("./style_declaration"),StyleTransition=require("./style_transition"),TRANSITION_SUFFIX="-transition",Light=function(t){function i(i){t.call(this),this.properties=["anchor","color","position","intensity"],this._specifications=styleSpec.light,this.set(i)}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.set=function(t){var i=this;if(!this._validate(validateStyle.light,t)){this._declarations={},this._transitions={},this._transitionOptions={},this.calculated={},t=util.extend({anchor:this._specifications.anchor.default,color:this._specifications.color.default,position:this._specifications.position.default,intensity:this._specifications.intensity.default},t);for(var e=0,o=this.properties;e<o.length;e+=1){var n=o[e];i._declarations[n]=new StyleDeclaration(i._specifications[n],t[n])}return this}},i.prototype.getLight=function(){return{anchor:this.getLightProperty("anchor"),color:this.getLightProperty("color"),position:this.getLightProperty("position"),intensity:this.getLightProperty("intensity")}},i.prototype.getLightProperty=function(t){return util.endsWith(t,TRANSITION_SUFFIX)?this._transitionOptions[t]:this._declarations[t]&&this._declarations[t].value},i.prototype.getLightValue=function(t,i){if("position"===t){var e=this._transitions[t].calculate(i),o=util.sphericalToCartesian(e);return{x:o[0],y:o[1],z:o[2]}}return this._transitions[t].calculate(i)},i.prototype.setLight=function(t){var i=this;if(!this._validate(validateStyle.light,t))for(var e in t){var o=t[e];util.endsWith(e,TRANSITION_SUFFIX)?i._transitionOptions[e]=o:null===o||void 0===o?delete i._declarations[e]:i._declarations[e]=new StyleDeclaration(i._specifications[e],o)}},i.prototype.recalculate=function(t){var i=this;for(var e in this._declarations)i.calculated[e]=i.getLightValue(e,{zoom:t})},i.prototype._applyLightDeclaration=function(t,i,e,o,n){var r=e.transition?this._transitions[t]:void 0,a=this._specifications[t];if(null!==i&&void 0!==i||(i=new StyleDeclaration(a,a.default)),!r||r.declaration.json!==i.json){var s=util.extend({duration:300,delay:0},o,this.getLightProperty(t+TRANSITION_SUFFIX)),l=this._transitions[t]=new StyleTransition(a,i,r,s);l.instant()||(l.loopID=n.set(l.endTime-Date.now())),r&&n.cancel(r.loopID)}},i.prototype.updateLightTransitions=function(t,i,e){var o,n=this;for(o in this._declarations)n._applyLightDeclaration(o,n._declarations[o],t,i,e)},i.prototype._validate=function(t,i){return validateStyle.emitErrors(this,t.call(validateStyle,util.extend({value:i,style:{glyphs:!0,sprite:!0},styleSpec:styleSpec})))},i}(Evented);module.exports=Light;
	},{"../util/evented":115,"../util/util":126,"./style_declaration":61,"./style_spec":69,"./style_transition":70,"./validate_style":71}],59:[function(require,module,exports){
	"use strict";var parseColorString=require("csscolorparser").parseCSSColor,util=require("../util/util"),MapboxGLFunction=require("mapbox-gl-function"),cache={};module.exports=function r(o){if(o&&MapboxGLFunction.isFunctionDefinition(o))return o.stops?util.extend({},o,{stops:o.stops.map(function(o){return[o[0],r(o[1])]})}):o;if("string"==typeof o){if(!cache[o]){var i=parseColorString(o);if(!i)throw new Error("Invalid color "+o);cache[o]=[i[0]/255*i[3],i[1]/255*i[3],i[2]/255*i[3],i[3]]}return cache[o]}if(Array.isArray(o))return o;throw new Error("Invalid color "+o)};
	},{"../util/util":126,"csscolorparser":135,"mapbox-gl-function":161}],60:[function(require,module,exports){
	"use strict";var Evented=require("../util/evented"),StyleLayer=require("./style_layer"),ImageSprite=require("./image_sprite"),Light=require("./light"),GlyphSource=require("../symbol/glyph_source"),SpriteAtlas=require("../symbol/sprite_atlas"),LineAtlas=require("../render/line_atlas"),util=require("../util/util"),ajax=require("../util/ajax"),mapbox=require("../util/mapbox"),browser=require("../util/browser"),Dispatcher=require("../util/dispatcher"),AnimationLoop=require("./animation_loop"),validateStyle=require("./validate_style"),Source=require("../source/source"),QueryFeatures=require("../source/query_features"),SourceCache=require("../source/source_cache"),styleSpec=require("./style_spec"),MapboxGLFunction=require("mapbox-gl-function"),getWorkerPool=require("../global_worker_pool"),deref=require("mapbox-gl-style-spec/lib/deref"),Style=function(e){function t(t,r,i){var s=this;e.call(this),this.map=r,this.animationLoop=r&&r.animationLoop||new AnimationLoop,this.dispatcher=new Dispatcher(getWorkerPool(),this),this.spriteAtlas=new SpriteAtlas(1024,1024),this.lineAtlas=new LineAtlas(256,512),this._layers={},this._order=[],this.sourceCaches={},this.zoomHistory={},this._loaded=!1,util.bindAll(["_redoPlacement"],this),this._resetUpdates(),i=util.extend({validate:"string"!=typeof t||!mapbox.isMapboxURL(t)},i),this.setEventedParent(r),this.fire("dataloading",{dataType:"style"});var o=function(e,t){if(e)return void s.fire("error",{error:e});if(!i.validate||!validateStyle.emitErrors(s,validateStyle(t))){s._loaded=!0,s.stylesheet=t,s.updateClasses();for(var r in t.sources)s.addSource(r,t.sources[r],i);t.sprite&&(s.sprite=new ImageSprite(t.sprite),s.sprite.setEventedParent(s)),s.glyphSource=new GlyphSource(t.glyphs),s._resolve(),s.fire("data",{dataType:"style"}),s.fire("style.load")}};"string"==typeof t?ajax.getJSON(mapbox.normalizeStyleURL(t),o):browser.frame(o.bind(this,null,t)),this.on("source.load",function(e){var t=e.source;if(t&&t.vectorLayerIds)for(var r in s._layers){var i=s._layers[r];i.source===t.id&&s._validateLayer(i)}})}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype._validateLayer=function(e){var t=this.sourceCaches[e.source];if(e.sourceLayer&&t){var r=t.getSource();r.vectorLayerIds&&r.vectorLayerIds.indexOf(e.sourceLayer)===-1&&this.fire("error",{error:new Error('Source layer "'+e.sourceLayer+'" does not exist on source "'+r.id+'" as specified by style layer "'+e.id+'"')})}},t.prototype.loaded=function(){var e=this;if(!this._loaded)return!1;if(Object.keys(this._updatedSources).length)return!1;for(var t in this.sourceCaches)if(!e.sourceCaches[t].loaded())return!1;return!(this.sprite&&!this.sprite.loaded())},t.prototype._resolve=function(){var e=this,t=deref(this.stylesheet.layers);this._order=t.map(function(e){return e.id}),this._layers={};for(var r=0,i=t;r<i.length;r+=1){var s=i[r];s=StyleLayer.create(s),s.setEventedParent(e,{layer:{id:s.id}}),e._layers[s.id]=s}this.dispatcher.broadcast("setLayers",this._serializeLayers(this._order)),this.light=new Light(this.stylesheet.light)},t.prototype._serializeLayers=function(e){var t=this;return e.map(function(e){return t._layers[e].serialize()})},t.prototype._applyClasses=function(e,t){var r=this;if(this._loaded){e=e||[],t=t||{transition:!0};var i=this.stylesheet.transition||{},s=this._updatedAllPaintProps?this._layers:this._updatedPaintProps;for(var o in s){var a=r._layers[o],n=r._updatedPaintProps[o];if(r._updatedAllPaintProps||n.all)a.updatePaintTransitions(e,t,i,r.animationLoop,r.zoomHistory);else for(var l in n)r._layers[o].updatePaintTransition(l,e,t,i,r.animationLoop,r.zoomHistory)}this.light.updateLightTransitions(t,i,this.animationLoop)}},t.prototype._recalculate=function(e){var t=this;if(this._loaded){for(var r in this.sourceCaches)t.sourceCaches[r].used=!1;this._updateZoomHistory(e);for(var i=0,s=this._order;i<s.length;i+=1){var o=s[i],a=t._layers[o];a.recalculate(e),!a.isHidden(e)&&a.source&&(t.sourceCaches[a.source].used=!0)}this.light.recalculate(e);var n=300;Math.floor(this.z)!==Math.floor(e)&&this.animationLoop.set(n),this.z=e}},t.prototype._updateZoomHistory=function(e){var t=this.zoomHistory;void 0===t.lastIntegerZoom&&(t.lastIntegerZoom=Math.floor(e),t.lastIntegerZoomTime=0,t.lastZoom=e),Math.floor(t.lastZoom)<Math.floor(e)?(t.lastIntegerZoom=Math.floor(e),t.lastIntegerZoomTime=Date.now()):Math.floor(t.lastZoom)>Math.floor(e)&&(t.lastIntegerZoom=Math.floor(e+1),t.lastIntegerZoomTime=Date.now()),t.lastZoom=e},t.prototype._checkLoaded=function(){if(!this._loaded)throw new Error("Style is not done loading")},t.prototype.update=function(e,t){var r=this;if(this._changed){var i=Object.keys(this._updatedLayers),s=Object.keys(this._removedLayers);(i.length||s.length||this._updatedSymbolOrder)&&this._updateWorkerLayers(i,s);for(var o in this._updatedSources)r._reloadSource(o);this._applyClasses(e,t),this._resetUpdates(),this.fire("data",{dataType:"style"})}},t.prototype._updateWorkerLayers=function(e,t){var r=this,i=this._updatedSymbolOrder?this._order.filter(function(e){return"symbol"===r._layers[e].type}):null;this.dispatcher.broadcast("updateLayers",{layers:this._serializeLayers(e),removedIds:t,symbolOrder:i})},t.prototype._resetUpdates=function(){this._changed=!1,this._updatedLayers={},this._removedLayers={},this._updatedSymbolOrder=!1,this._updatedSources={},this._updatedPaintProps={},this._updatedAllPaintProps=!1},t.prototype.addSource=function(e,t,r){if(this._checkLoaded(),void 0!==this.sourceCaches[e])throw new Error("There is already a source with this ID");if(!t.type)throw new Error("The type property must be defined, but the only the following properties were given: "+Object.keys(t)+".");var i=["vector","raster","geojson","video","image"],s=i.indexOf(t.type)>=0;if(!s||!this._validate(validateStyle.source,"sources."+e,t,null,r)){var o=this.sourceCaches[e]=new SourceCache(e,t,this.dispatcher);o.style=this,o.setEventedParent(this,{source:o.getSource()}),o.onAdd&&o.onAdd(this.map),this._changed=!0}},t.prototype.removeSource=function(e){if(this._checkLoaded(),void 0===this.sourceCaches[e])throw new Error("There is no source with this ID");var t=this.sourceCaches[e];delete this.sourceCaches[e],delete this._updatedSources[e],t.setEventedParent(null),t.clearTiles(),t.onRemove&&t.onRemove(this.map),this._changed=!0},t.prototype.getSource=function(e){return this.sourceCaches[e]&&this.sourceCaches[e].getSource()},t.prototype.addLayer=function(e,t,r){this._checkLoaded();var i=e.id;if(!this._validate(validateStyle.layer,"layers."+i,e,{arrayIndex:-1},r)){var s=StyleLayer.create(e);this._validateLayer(s),s.setEventedParent(this,{layer:{id:i}});var o=t?this._order.indexOf(t):this._order.length;this._order.splice(o,0,i),this._layers[i]=s,delete this._removedLayers[i],this._updateLayer(s),"symbol"===s.type&&(this._updatedSymbolOrder=!0),this.updateClasses(i)}},t.prototype.moveLayer=function(e,t){this._checkLoaded(),this._changed=!0;var r=this._layers[e];if(!r)throw new Error("Layer not found: "+e);var i=this._order.indexOf(e);this._order.splice(i,1);var s=t?this._order.indexOf(t):this._order.length;this._order.splice(s,0,e),"symbol"===r.type&&(this._updatedSymbolOrder=!0,r.source&&(this._updatedSources[r.source]=!0))},t.prototype.removeLayer=function(e){this._checkLoaded();var t=this._layers[e];if(!t)throw new Error("Layer not found: "+e);t.setEventedParent(null);var r=this._order.indexOf(e);this._order.splice(r,1),"symbol"===t.type&&(this._updatedSymbolOrder=!0),this._changed=!0,this._removedLayers[e]=!0,delete this._layers[e],delete this._updatedLayers[e],delete this._updatedPaintProps[e]},t.prototype.getLayer=function(e){return this._layers[e]},t.prototype.setLayerZoomRange=function(e,t,r){this._checkLoaded();var i=this.getLayer(e);i.minzoom===t&&i.maxzoom===r||(null!=t&&(i.minzoom=t),null!=r&&(i.maxzoom=r),this._updateLayer(i))},t.prototype.setFilter=function(e,t){this._checkLoaded();var r=this.getLayer(e);null!==t&&this._validate(validateStyle.filter,"layers."+r.id+".filter",t)||util.deepEqual(r.filter,t)||(r.filter=util.clone(t),this._updateLayer(r))},t.prototype.getFilter=function(e){return util.clone(this.getLayer(e).filter)},t.prototype.setLayoutProperty=function(e,t,r){this._checkLoaded();var i=this.getLayer(e);util.deepEqual(i.getLayoutProperty(t),r)||(i.setLayoutProperty(t,r),this._updateLayer(i))},t.prototype.getLayoutProperty=function(e,t){return this.getLayer(e).getLayoutProperty(t)},t.prototype.setPaintProperty=function(e,t,r,i){this._checkLoaded();var s=this.getLayer(e);if(!util.deepEqual(s.getPaintProperty(t,i),r)){var o=s.isPaintValueFeatureConstant(t);s.setPaintProperty(t,r,i);var a=!(r&&MapboxGLFunction.isFunctionDefinition(r)&&"$zoom"!==r.property&&void 0!==r.property);a&&o||this._updateLayer(s),this.updateClasses(e,t)}},t.prototype.getPaintProperty=function(e,t,r){return this.getLayer(e).getPaintProperty(t,r)},t.prototype.getTransition=function(){return util.extend({duration:300,delay:0},this.stylesheet&&this.stylesheet.transition)},t.prototype.updateClasses=function(e,t){if(this._changed=!0,e){var r=this._updatedPaintProps;r[e]||(r[e]={}),r[e][t||"all"]=!0}else this._updatedAllPaintProps=!0},t.prototype.serialize=function(){var e=this;return util.filterObject({version:this.stylesheet.version,name:this.stylesheet.name,metadata:this.stylesheet.metadata,light:this.stylesheet.light,center:this.stylesheet.center,zoom:this.stylesheet.zoom,bearing:this.stylesheet.bearing,pitch:this.stylesheet.pitch,sprite:this.stylesheet.sprite,glyphs:this.stylesheet.glyphs,transition:this.stylesheet.transition,sources:util.mapObject(this.sourceCaches,function(e){return e.serialize()}),layers:this._order.map(function(t){return e._layers[t].serialize()})},function(e){return void 0!==e})},t.prototype._updateLayer=function(e){this._updatedLayers[e.id]=!0,e.source&&(this._updatedSources[e.source]=!0),this._changed=!0},t.prototype._flattenRenderedFeatures=function(e){for(var t=this,r=[],i=this._order.length-1;i>=0;i--)for(var s=t._order[i],o=0,a=e;o<a.length;o+=1){var n=a[o],l=n[s];if(l)for(var h=0,u=l;h<u.length;h+=1){var d=u[h];r.push(d)}}return r},t.prototype.queryRenderedFeatures=function(e,t,r,i){var s=this;t&&t.filter&&this._validate(validateStyle.filter,"queryRenderedFeatures.filter",t.filter);var o={};if(t&&t.layers)for(var a=0,n=t.layers;a<n.length;a+=1){var l=n[a],h=s._layers[l];if(!h)return void s.fire("error",{error:"The layer '"+l+"' does not exist in the map's style and cannot be queried for features."});o[h.source]=!0}var u=[];for(var d in this.sourceCaches)if(!t.layers||o[d]){var p=QueryFeatures.rendered(s.sourceCaches[d],s._layers,e,t,r,i);u.push(p)}return this._flattenRenderedFeatures(u)},t.prototype.querySourceFeatures=function(e,t){t&&t.filter&&this._validate(validateStyle.filter,"querySourceFeatures.filter",t.filter);var r=this.sourceCaches[e];return r?QueryFeatures.source(r,t):[]},t.prototype.addSourceType=function(e,t,r){return Source.getType(e)?r(new Error('A source type called "'+e+'" already exists.')):(Source.setType(e,t),t.workerSourceURL?void this.dispatcher.broadcast("loadWorkerSource",{name:e,url:t.workerSourceURL},r):r(null,null))},t.prototype.getLight=function(){return this.light.getLight()},t.prototype.setLight=function(e,t){this._checkLoaded();var r=this.light.getLight(),i=!1;for(var s in e)if(!util.deepEqual(e[s],r[s])){i=!0;break}if(i){var o=this.stylesheet.transition||{};this.light.setLight(e),this.light.updateLightTransitions(t||{transition:!0},o,this.animationLoop)}},t.prototype._validate=function(e,t,r,i,s){return(!s||s.validate!==!1)&&validateStyle.emitErrors(this,e.call(validateStyle,util.extend({key:t,style:this.serialize(),value:r,styleSpec:styleSpec},i)))},t.prototype._remove=function(){var e=this;for(var t in this.sourceCaches)e.sourceCaches[t].clearTiles();this.dispatcher.remove()},t.prototype._reloadSource=function(e){this.sourceCaches[e].reload()},t.prototype._updateSources=function(e){var t=this;for(var r in this.sourceCaches)t.sourceCaches[r].update(e)},t.prototype._redoPlacement=function(){var e=this;for(var t in this.sourceCaches)e.sourceCaches[t].redoPlacement()},t.prototype.getIcons=function(e,t,r){var i=this,s=function(){i.spriteAtlas.setSprite(i.sprite),i.spriteAtlas.addIcons(t.icons,r)};this.sprite.loaded()?s():this.sprite.on("data",s)},t.prototype.getGlyphs=function(e,t,r){function i(e,t,i){e&&console.error(e),n[i]=t,a--,0===a&&r(null,n)}var s=this,o=t.stacks,a=Object.keys(o).length,n={};for(var l in o)s.glyphSource.getSimpleGlyphs(l,o[l],t.uid,i)},t}(Evented);module.exports=Style;
	},{"../global_worker_pool":22,"../render/line_atlas":35,"../source/query_features":45,"../source/source":47,"../source/source_cache":48,"../symbol/glyph_source":80,"../symbol/sprite_atlas":85,"../util/ajax":106,"../util/browser":107,"../util/dispatcher":113,"../util/evented":115,"../util/mapbox":122,"../util/util":126,"./animation_loop":56,"./image_sprite":57,"./light":58,"./style_layer":62,"./style_spec":69,"./validate_style":71,"mapbox-gl-function":161,"mapbox-gl-style-spec/lib/deref":163}],61:[function(require,module,exports){
	"use strict";var MapboxGLFunction=require("mapbox-gl-function"),parseColor=require("./parse_color"),util=require("../util/util"),StyleDeclaration=function(t,o){var i=this;this.value=util.clone(o),this.isFunction=MapboxGLFunction.isFunctionDefinition(o),this.json=JSON.stringify(this.value),this.minimum=t.minimum,this.isColor="color"===t.type;var n=this.isColor&&this.value?parseColor(this.value):o,s=t.default;if(s&&"color"===t.type&&(s=parseColor(s)),this.function=MapboxGLFunction[t.function||"piecewise-constant"](n,s),this.isFeatureConstant=this.function.isFeatureConstant,this.isZoomConstant=this.function.isZoomConstant,!this.isFeatureConstant&&!this.isZoomConstant){this.stopZoomLevels=[];for(var e=[],a=0,r=this.value.stops;a<r.length;a+=1){var l=r[a],u=l[0].zoom;i.stopZoomLevels.indexOf(u)<0&&(i.stopZoomLevels.push(u),e.push([u,e.length]))}this.functionInterpolationT=MapboxGLFunction.interpolated({stops:e,base:o.base,colorSpace:o.colorSpace})}};StyleDeclaration.prototype.calculate=function(t,o){var i=this.function(t&&t.zoom,o||{});return this.isColor&&i?parseColor(i):void 0!==this.minimum&&i<this.minimum?this.minimum:i},StyleDeclaration.prototype.calculateInterpolationT=function(t,o){return this.functionInterpolationT(t&&t.zoom,o||{})},module.exports=StyleDeclaration;
	},{"../util/util":126,"./parse_color":59,"mapbox-gl-function":161}],62:[function(require,module,exports){
	"use strict";function getDeclarationValue(t){return t.value}var util=require("../util/util"),StyleTransition=require("./style_transition"),StyleDeclaration=require("./style_declaration"),styleSpec=require("./style_spec"),validateStyle=require("./validate_style"),parseColor=require("./parse_color"),Evented=require("../util/evented"),TRANSITION_SUFFIX="-transition",StyleLayer=function(t){function i(i){var a=this;t.call(this),this.id=i.id,this.metadata=i.metadata,this.type=i.type,this.source=i.source,this.sourceLayer=i["source-layer"],this.minzoom=i.minzoom,this.maxzoom=i.maxzoom,this.filter=i.filter,this.paint={},this.layout={},this._paintSpecifications=styleSpec["paint_"+this.type],this._layoutSpecifications=styleSpec["layout_"+this.type],this._paintTransitions={},this._paintTransitionOptions={},this._paintDeclarations={},this._layoutDeclarations={},this._layoutFunctions={};var e,n,o={validate:!1};for(var r in i){var s=r.match(/^paint(?:\.(.*))?$/);if(s){var l=s[1]||"";for(e in i[r])a.setPaintProperty(e,i[r][e],l,o)}}for(n in i.layout)a.setLayoutProperty(n,i.layout[n],o);for(e in this._paintSpecifications)a.paint[e]=a.getPaintValue(e);for(n in this._layoutSpecifications)a._updateLayoutValue(n)}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.setLayoutProperty=function(t,i,a){if(null==i)delete this._layoutDeclarations[t];else{var e="layers."+this.id+".layout."+t;if(this._validate(validateStyle.layoutProperty,e,t,i,a))return;this._layoutDeclarations[t]=new StyleDeclaration(this._layoutSpecifications[t],i)}this._updateLayoutValue(t)},i.prototype.getLayoutProperty=function(t){return this._layoutDeclarations[t]&&this._layoutDeclarations[t].value},i.prototype.getLayoutValue=function(t,i,a){var e=this._layoutSpecifications[t],n=this._layoutDeclarations[t];return n?n.calculate(i,a):e.default},i.prototype.setPaintProperty=function(t,i,a,e){var n="layers."+this.id+(a?'["paint.'+a+'"].':".paint.")+t;if(util.endsWith(t,TRANSITION_SUFFIX))if(this._paintTransitionOptions[a||""]||(this._paintTransitionOptions[a||""]={}),null===i||void 0===i)delete this._paintTransitionOptions[a||""][t];else{if(this._validate(validateStyle.paintProperty,n,t,i,e))return;this._paintTransitionOptions[a||""][t]=i}else if(this._paintDeclarations[a||""]||(this._paintDeclarations[a||""]={}),null===i||void 0===i)delete this._paintDeclarations[a||""][t];else{if(this._validate(validateStyle.paintProperty,n,t,i,e))return;this._paintDeclarations[a||""][t]=new StyleDeclaration(this._paintSpecifications[t],i)}},i.prototype.getPaintProperty=function(t,i){return i=i||"",util.endsWith(t,TRANSITION_SUFFIX)?this._paintTransitionOptions[i]&&this._paintTransitionOptions[i][t]:this._paintDeclarations[i]&&this._paintDeclarations[i][t]&&this._paintDeclarations[i][t].value},i.prototype.getPaintValue=function(t,i,a){var e=this._paintSpecifications[t],n=this._paintTransitions[t];return n?n.calculate(i,a):"color"===e.type&&e.default?parseColor(e.default):e.default},i.prototype.getPaintValueStopZoomLevels=function(t){var i=this._paintTransitions[t];return i?i.declaration.stopZoomLevels:[]},i.prototype.getPaintInterpolationT=function(t,i){var a=this._paintTransitions[t];return a.declaration.calculateInterpolationT(i)},i.prototype.isPaintValueFeatureConstant=function(t){var i=this._paintTransitions[t];return!i||i.declaration.isFeatureConstant},i.prototype.isLayoutValueFeatureConstant=function(t){var i=this._layoutDeclarations[t];return!i||i.isFeatureConstant},i.prototype.isPaintValueZoomConstant=function(t){var i=this._paintTransitions[t];return!i||i.declaration.isZoomConstant},i.prototype.isHidden=function(t){return!!(this.minzoom&&t<this.minzoom)||(!!(this.maxzoom&&t>=this.maxzoom)||"none"===this.layout.visibility)},i.prototype.updatePaintTransitions=function(t,i,a,e,n){for(var o=this,r=util.extend({},this._paintDeclarations[""]),s=0;s<t.length;s++)util.extend(r,o._paintDeclarations[t[s]]);var l;for(l in r)o._applyPaintDeclaration(l,r[l],i,a,e,n);for(l in this._paintTransitions)l in r||o._applyPaintDeclaration(l,null,i,a,e,n)},i.prototype.updatePaintTransition=function(t,i,a,e,n,o){for(var r=this,s=this._paintDeclarations[""][t],l=0;l<i.length;l++){var u=r._paintDeclarations[i[l]];u&&u[t]&&(s=u[t])}this._applyPaintDeclaration(t,s,a,e,n,o)},i.prototype.recalculate=function(t){var i=this;for(var a in this._paintTransitions)i.paint[a]=i.getPaintValue(a,{zoom:t});for(var e in this._layoutFunctions)i.layout[e]=i.getLayoutValue(e,{zoom:t})},i.prototype.serialize=function(){var t=this,i={id:this.id,type:this.type,source:this.source,"source-layer":this.sourceLayer,metadata:this.metadata,minzoom:this.minzoom,maxzoom:this.maxzoom,filter:this.filter,layout:util.mapObject(this._layoutDeclarations,getDeclarationValue)};for(var a in this._paintDeclarations){var e=""===a?"paint":"paint."+a;i[e]=util.mapObject(t._paintDeclarations[a],getDeclarationValue)}return util.filterObject(i,function(t,i){return void 0!==t&&!("layout"===i&&!Object.keys(t).length)})},i.prototype._applyPaintDeclaration=function(t,i,a,e,n,o){var r=a.transition?this._paintTransitions[t]:void 0,s=this._paintSpecifications[t];if(null!==i&&void 0!==i||(i=new StyleDeclaration(s,s.default)),!r||r.declaration.json!==i.json){var l=util.extend({duration:300,delay:0},e,this.getPaintProperty(t+TRANSITION_SUFFIX)),u=this._paintTransitions[t]=new StyleTransition(s,i,r,l,o);u.instant()||(u.loopID=n.set(u.endTime-Date.now())),r&&n.cancel(r.loopID)}},i.prototype._updateLayoutValue=function(t){var i=this._layoutDeclarations[t];i&&i.isFunction?this._layoutFunctions[t]=!0:(delete this._layoutFunctions[t],this.layout[t]=this.getLayoutValue(t))},i.prototype._validate=function(t,i,a,e,n){return(!n||n.validate!==!1)&&validateStyle.emitErrors(this,t.call(validateStyle,{key:i,layerType:this.type,objectKey:a,value:e,styleSpec:styleSpec,style:{glyphs:!0,sprite:!0}}))},i}(Evented);module.exports=StyleLayer;var subclasses={circle:require("./style_layer/circle_style_layer"),fill:require("./style_layer/fill_style_layer"),"fill-extrusion":require("./style_layer/fill_extrusion_style_layer"),line:require("./style_layer/line_style_layer"),symbol:require("./style_layer/symbol_style_layer")};StyleLayer.create=function(t){var i=subclasses[t.type]||StyleLayer;return new i(t)};
	},{"../util/evented":115,"../util/util":126,"./parse_color":59,"./style_declaration":61,"./style_layer/circle_style_layer":63,"./style_layer/fill_extrusion_style_layer":64,"./style_layer/fill_style_layer":65,"./style_layer/line_style_layer":66,"./style_layer/symbol_style_layer":67,"./style_spec":69,"./style_transition":70,"./validate_style":71}],63:[function(require,module,exports){
	"use strict";var StyleLayer=require("../style_layer"),CircleBucket=require("../../data/bucket/circle_bucket"),CircleStyleLayer=function(e){function t(){e.apply(this,arguments)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.createBucket=function(e){return new CircleBucket(e)},t}(StyleLayer);module.exports=CircleStyleLayer;
	},{"../../data/bucket/circle_bucket":3,"../style_layer":62}],64:[function(require,module,exports){
	"use strict";var StyleLayer=require("../style_layer"),FillExtrusionBucket=require("../../data/bucket/fill_extrusion_bucket"),FillExtrusionStyleLayer=function(t){function e(){t.apply(this,arguments)}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.getPaintValue=function(e,r,o){var l=t.prototype.getPaintValue.call(this,e,r,o);return"fill-extrusion-color"===e&&l&&(l[3]=1),l},e.prototype.createBucket=function(t){return new FillExtrusionBucket(t)},e}(StyleLayer);module.exports=FillExtrusionStyleLayer;
	},{"../../data/bucket/fill_extrusion_bucket":5,"../style_layer":62}],65:[function(require,module,exports){
	"use strict";var StyleLayer=require("../style_layer"),FillBucket=require("../../data/bucket/fill_bucket"),FillStyleLayer=function(t){function o(){t.apply(this,arguments)}return t&&(o.__proto__=t),o.prototype=Object.create(t&&t.prototype),o.prototype.constructor=o,o.prototype.getPaintValue=function(o,l,e){return"fill-outline-color"===o&&void 0===this.getPaintProperty("fill-outline-color")?t.prototype.getPaintValue.call(this,"fill-color",l,e):t.prototype.getPaintValue.call(this,o,l,e)},o.prototype.getPaintValueStopZoomLevels=function(o){return"fill-outline-color"===o&&void 0===this.getPaintProperty("fill-outline-color")?t.prototype.getPaintValueStopZoomLevels.call(this,"fill-color"):t.prototype.getPaintValueStopZoomLevels.call(this,o)},o.prototype.getPaintInterpolationT=function(o,l){return"fill-outline-color"===o&&void 0===this.getPaintProperty("fill-outline-color")?t.prototype.getPaintInterpolationT.call(this,"fill-color",l):t.prototype.getPaintInterpolationT.call(this,o,l)},o.prototype.isPaintValueFeatureConstant=function(o){return"fill-outline-color"===o&&void 0===this.getPaintProperty("fill-outline-color")?t.prototype.isPaintValueFeatureConstant.call(this,"fill-color"):t.prototype.isPaintValueFeatureConstant.call(this,o)},o.prototype.isPaintValueZoomConstant=function(o){return"fill-outline-color"===o&&void 0===this.getPaintProperty("fill-outline-color")?t.prototype.isPaintValueZoomConstant.call(this,"fill-color"):t.prototype.isPaintValueZoomConstant.call(this,o)},o.prototype.createBucket=function(t){return new FillBucket(t)},o}(StyleLayer);module.exports=FillStyleLayer;
	},{"../../data/bucket/fill_bucket":4,"../style_layer":62}],66:[function(require,module,exports){
	"use strict";var StyleLayer=require("../style_layer"),LineBucket=require("../../data/bucket/line_bucket"),util=require("../../util/util"),LineStyleLayer=function(e){function t(){e.apply(this,arguments)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.getPaintValue=function(t,r,o){var i=e.prototype.getPaintValue.call(this,t,r,o);if(i&&"line-dasharray"===t){var a=this.getPaintValue("line-width",util.extend({},r,{zoom:Math.floor(r.zoom)}),o);i.fromScale*=a,i.toScale*=a}return i},t.prototype.createBucket=function(e){return new LineBucket(e)},t}(StyleLayer);module.exports=LineStyleLayer;
	},{"../../data/bucket/line_bucket":6,"../../util/util":126,"../style_layer":62}],67:[function(require,module,exports){
	"use strict";var StyleLayer=require("../style_layer"),SymbolBucket=require("../../data/bucket/symbol_bucket"),SymbolStyleLayer=function(t){function e(){t.apply(this,arguments)}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.getLayoutValue=function(e,o,r){var a=t.prototype.getLayoutValue.call(this,e,o,r);if("auto"!==a)return a;switch(e){case"text-rotation-alignment":case"icon-rotation-alignment":return"line"===this.getLayoutValue("symbol-placement",o,r)?"map":"viewport";case"text-pitch-alignment":return this.getLayoutValue("text-rotation-alignment",o,r);default:return a}},e.prototype.createBucket=function(t){return new SymbolBucket(t)},e}(StyleLayer);module.exports=SymbolStyleLayer;
	},{"../../data/bucket/symbol_bucket":7,"../style_layer":62}],68:[function(require,module,exports){
	"use strict";var StyleLayer=require("./style_layer"),util=require("../util/util"),featureFilter=require("feature-filter"),groupByLayout=require("mapbox-gl-style-spec/lib/group_by_layout"),StyleLayerIndex=function(e){e&&this.replace(e)};StyleLayerIndex.prototype.replace=function(e){var r=this;this.symbolOrder=[];for(var t=0,a=e;t<a.length;t+=1){var i=a[t];"symbol"===i.type&&r.symbolOrder.push(i.id)}this._layers={},this.update(e,[])},StyleLayerIndex.prototype.update=function(e,r,t){for(var a=this,i=0,l=e;i<l.length;i+=1){var y=l[i];a._layers[y.id]=y}for(var o=0,u=r;o<u.length;o+=1){var s=u[o];delete a._layers[s]}t&&(this.symbolOrder=t),this.familiesBySource={};for(var n=groupByLayout(util.values(this._layers)),p=0,f=n;p<f.length;p+=1){var h=f[p];h=h.map(function(e){return e=StyleLayer.create(e),e.updatePaintTransitions({},{transition:!1}),e.filter=featureFilter(e.filter),e});var v=h[0];if(!v.layout||"none"!==v.layout.visibility){var c=v.source||"",d=a.familiesBySource[c];d||(d=a.familiesBySource[c]={});var m=v.sourceLayer||"_geojsonTileLayer",L=d[m];L||(L=d[m]=[]),L.push(h)}}},module.exports=StyleLayerIndex;
	},{"../util/util":126,"./style_layer":62,"feature-filter":137,"mapbox-gl-style-spec/lib/group_by_layout":165}],69:[function(require,module,exports){
	"use strict";module.exports=require("mapbox-gl-style-spec/reference/latest.min");
	},{"mapbox-gl-style-spec/reference/latest.min":189}],70:[function(require,module,exports){
	"use strict";function interpZoomTransitioned(t,i,o){if(void 0!==t&&void 0!==i)return{from:t.to,fromScale:t.toScale,to:i.to,toScale:i.toScale,t:o}}var util=require("../util/util"),interpolate=require("../util/interpolate"),fakeZoomHistory={lastIntegerZoom:0,lastIntegerZoomTime:0,lastZoom:0},StyleTransition=function(t,i,o,e,a){this.declaration=i,this.startTime=this.endTime=(new Date).getTime(),this.oldTransition=o,this.duration=e.duration||0,this.delay=e.delay||0,this.zoomTransitioned="piecewise-constant"===t.function&&t.transition,this.interp=this.zoomTransitioned?interpZoomTransitioned:interpolate[t.type],this.zoomHistory=a||fakeZoomHistory,this.instant()||(this.endTime=this.startTime+this.duration+this.delay),o&&o.endTime<=this.startTime&&delete o.oldTransition};StyleTransition.prototype.instant=function(){return!this.oldTransition||!this.interp||0===this.duration&&0===this.delay},StyleTransition.prototype.calculate=function(t,i,o){var e=this._calculateTargetValue(t,i);if(this.instant())return e;if(o=o||Date.now(),o>=this.endTime)return e;var a=this.oldTransition.calculate(t,i,this.startTime),n=util.easeCubicInOut((o-this.startTime-this.delay)/this.duration);return this.interp(a,e,n)},StyleTransition.prototype._calculateTargetValue=function(t,i){if(!this.zoomTransitioned)return this.declaration.calculate(t,i);var o=t.zoom,e=this.zoomHistory.lastIntegerZoom,a=o>e?2:.5,n=this.declaration.calculate({zoom:o>e?o-1:o+1},i),r=this.declaration.calculate({zoom:o},i),s=Math.min((Date.now()-this.zoomHistory.lastIntegerZoomTime)/this.duration,1),l=Math.abs(o-e),u=interpolate(s,1,l);return void 0!==n&&void 0!==r?{from:n,fromScale:a,to:r,toScale:1,t:u}:void 0},module.exports=StyleTransition;
	},{"../util/interpolate":118,"../util/util":126}],71:[function(require,module,exports){
	"use strict";module.exports=require("mapbox-gl-style-spec/lib/validate_style.min"),module.exports.emitErrors=function(r,e){if(e&&e.length){for(var t=0;t<e.length;t++)r.fire("error",{error:new Error(e[t].message)});return!0}return!1};
	},{"mapbox-gl-style-spec/lib/validate_style.min":187}],72:[function(require,module,exports){
	"use strict";var Point=require("point-geometry"),Anchor=function(t){function o(o,e,n,r){t.call(this,o,e),this.angle=n,void 0!==r&&(this.segment=r)}return t&&(o.__proto__=t),o.prototype=Object.create(t&&t.prototype),o.prototype.constructor=o,o.prototype.clone=function(){return new o(this.x,this.y,this.angle,this.segment)},o}(Point);module.exports=Anchor;
	},{"point-geometry":195}],73:[function(require,module,exports){
	"use strict";function checkMaxAngle(e,t,a,r,n){if(void 0===t.segment)return!0;for(var i=t,s=t.segment+1,f=0;f>-a/2;){if(s--,s<0)return!1;f-=e[s].dist(i),i=e[s]}f+=e[s].dist(e[s+1]),s++;for(var l=[],o=0;f<a/2;){var u=e[s-1],c=e[s],g=e[s+1];if(!g)return!1;var h=u.angleTo(c)-c.angleTo(g);for(h=Math.abs((h+3*Math.PI)%(2*Math.PI)-Math.PI),l.push({distance:f,angleDelta:h}),o+=h;f-l[0].distance>r;)o-=l.shift().angleDelta;if(o>n)return!1;s++,f+=c.dist(g)}return!0}module.exports=checkMaxAngle;
	},{}],74:[function(require,module,exports){
	"use strict";function clipLine(n,x,y,o,e){for(var r=[],t=0;t<n.length;t++)for(var i,u=n[t],d=0;d<u.length-1;d++){var P=u[d],w=u[d+1];P.x<x&&w.x<x||(P.x<x?P=new Point(x,P.y+(w.y-P.y)*((x-P.x)/(w.x-P.x)))._round():w.x<x&&(w=new Point(x,P.y+(w.y-P.y)*((x-P.x)/(w.x-P.x)))._round()),P.y<y&&w.y<y||(P.y<y?P=new Point(P.x+(w.x-P.x)*((y-P.y)/(w.y-P.y)),y)._round():w.y<y&&(w=new Point(P.x+(w.x-P.x)*((y-P.y)/(w.y-P.y)),y)._round()),P.x>=o&&w.x>=o||(P.x>=o?P=new Point(o,P.y+(w.y-P.y)*((o-P.x)/(w.x-P.x)))._round():w.x>=o&&(w=new Point(o,P.y+(w.y-P.y)*((o-P.x)/(w.x-P.x)))._round()),P.y>=e&&w.y>=e||(P.y>=e?P=new Point(P.x+(w.x-P.x)*((e-P.y)/(w.y-P.y)),e)._round():w.y>=e&&(w=new Point(P.x+(w.x-P.x)*((e-P.y)/(w.y-P.y)),e)._round()),i&&P.equals(i[i.length-1])||(i=[P],r.push(i)),i.push(w)))))}return r}var Point=require("point-geometry");module.exports=clipLine;
	},{"point-geometry":195}],75:[function(require,module,exports){
	"use strict";var createStructArrayType=require("../util/struct_array"),Point=require("point-geometry"),CollisionBoxArray=createStructArrayType({members:[{type:"Int16",name:"anchorPointX"},{type:"Int16",name:"anchorPointY"},{type:"Int16",name:"x1"},{type:"Int16",name:"y1"},{type:"Int16",name:"x2"},{type:"Int16",name:"y2"},{type:"Float32",name:"maxScale"},{type:"Uint32",name:"featureIndex"},{type:"Uint16",name:"sourceLayerIndex"},{type:"Uint16",name:"bucketIndex"},{type:"Int16",name:"bbox0"},{type:"Int16",name:"bbox1"},{type:"Int16",name:"bbox2"},{type:"Int16",name:"bbox3"},{type:"Float32",name:"placementScale"}]});Object.defineProperty(CollisionBoxArray.prototype.StructType.prototype,"anchorPoint",{get:function(){return new Point(this.anchorPointX,this.anchorPointY)}}),module.exports=CollisionBoxArray;
	},{"../util/struct_array":124,"point-geometry":195}],76:[function(require,module,exports){
	"use strict";var CollisionFeature=function(t,e,i,o,s,a,n,r,l,d,u){var h=n.top*r-l,x=n.bottom*r+l,f=n.left*r-l,m=n.right*r+l;if(this.boxStartIndex=t.length,d){var _=x-h,b=m-f;if(_>0)if(_=Math.max(10*r,_),u){var v=e[i.segment+1].sub(e[i.segment])._unit()._mult(b),c=[i.sub(v),i.add(v)];this._addLineCollisionBoxes(t,c,i,0,b,_,o,s,a)}else this._addLineCollisionBoxes(t,e,i,i.segment,b,_,o,s,a)}else t.emplaceBack(i.x,i.y,f,h,m,x,1/0,o,s,a,0,0,0,0,0);this.boxEndIndex=t.length};CollisionFeature.prototype._addLineCollisionBoxes=function(t,e,i,o,s,a,n,r,l){var d=a/2,u=Math.floor(s/d),h=-a/2,x=this.boxes,f=i,m=o+1,_=h;do{if(m--,m<0)return x;_-=e[m].dist(f),f=e[m]}while(_>-s/2);for(var b=e[m].dist(e[m+1]),v=0;v<u;v++){for(var c=-s/2+v*d;_+b<c;){if(_+=b,m++,m+1>=e.length)return x;b=e[m].dist(e[m+1])}var g=c-_,p=e[m],C=e[m+1],B=C.sub(p)._unit()._mult(g)._add(p)._round(),M=Math.max(Math.abs(c-h)-d/2,0),y=s/2/M;t.emplaceBack(B.x,B.y,-a/2,-a/2,a/2,a/2,y,n,r,l,0,0,0,0,0)}return x},module.exports=CollisionFeature;
	},{}],77:[function(require,module,exports){
	"use strict";var Point=require("point-geometry"),EXTENT=require("../data/extent"),Grid=require("grid-index"),intersectionTests=require("../util/intersection_tests"),CollisionTile=function(t,e,i){if("object"==typeof t){var r=t;i=e,t=r.angle,e=r.pitch,this.grid=new Grid(r.grid),this.ignoredGrid=new Grid(r.ignoredGrid)}else this.grid=new Grid(EXTENT,12,6),this.ignoredGrid=new Grid(EXTENT,12,0);this.minScale=.5,this.maxScale=2,this.angle=t,this.pitch=e;var a=Math.sin(t),o=Math.cos(t);if(this.rotationMatrix=[o,-a,a,o],this.reverseRotationMatrix=[o,a,-a,o],this.yStretch=1/Math.cos(e/180*Math.PI),this.yStretch=Math.pow(this.yStretch,1.3),this.collisionBoxArray=i,0===i.length){i.emplaceBack();var n=32767;i.emplaceBack(0,0,0,-n,0,n,n,0,0,0,0,0,0,0,0,0),i.emplaceBack(EXTENT,0,0,-n,0,n,n,0,0,0,0,0,0,0,0,0),i.emplaceBack(0,0,-n,0,n,0,n,0,0,0,0,0,0,0,0,0),i.emplaceBack(0,EXTENT,-n,0,n,0,n,0,0,0,0,0,0,0,0,0)}this.tempCollisionBox=i.get(0),this.edges=[i.get(1),i.get(2),i.get(3),i.get(4)]};CollisionTile.prototype.serialize=function(t){var e=this.grid.toArrayBuffer(),i=this.ignoredGrid.toArrayBuffer();return t&&(t.push(e),t.push(i)),{angle:this.angle,pitch:this.pitch,grid:e,ignoredGrid:i}},CollisionTile.prototype.placeCollisionFeature=function(t,e,i){for(var r=this,a=this.collisionBoxArray,o=this.minScale,n=this.rotationMatrix,l=this.yStretch,h=t.boxStartIndex;h<t.boxEndIndex;h++){var s=a.get(h),x=s.anchorPoint._matMult(n),c=x.x,g=x.y,y=c+s.x1,d=g+s.y1*l,m=c+s.x2,u=g+s.y2*l;if(s.bbox0=y,s.bbox1=d,s.bbox2=m,s.bbox3=u,!e)for(var p=r.grid.query(y,d,m,u),M=0;M<p.length;M++){var f=a.get(p[M]),v=f.anchorPoint._matMult(n);if(o=r.getPlacementScale(o,x,s,v,f),o>=r.maxScale)return o}if(i){var S;if(r.angle){var P=r.reverseRotationMatrix,b=new Point(s.x1,s.y1).matMult(P),T=new Point(s.x2,s.y1).matMult(P),w=new Point(s.x1,s.y2).matMult(P),N=new Point(s.x2,s.y2).matMult(P);S=r.tempCollisionBox,S.anchorPointX=s.anchorPoint.x,S.anchorPointY=s.anchorPoint.y,S.x1=Math.min(b.x,T.x,w.x,N.x),S.y1=Math.min(b.y,T.x,w.x,N.x),S.x2=Math.max(b.x,T.x,w.x,N.x),S.y2=Math.max(b.y,T.x,w.x,N.x),S.maxScale=s.maxScale}else S=s;for(var B=0;B<this.edges.length;B++){var G=r.edges[B];if(o=r.getPlacementScale(o,s.anchorPoint,S,G.anchorPoint,G),o>=r.maxScale)return o}}}return o},CollisionTile.prototype.queryRenderedSymbols=function(t,e){var i={},r=[];if(0===t.length||0===this.grid.length&&0===this.ignoredGrid.length)return r;for(var a=this.collisionBoxArray,o=this.rotationMatrix,n=this.yStretch,l=[],h=1/0,s=1/0,x=-(1/0),c=-(1/0),g=0;g<t.length;g++)for(var y=t[g],d=0;d<y.length;d++){var m=y[d].matMult(o);h=Math.min(h,m.x),s=Math.min(s,m.y),x=Math.max(x,m.x),c=Math.max(c,m.y),l.push(m)}for(var u=this.grid.query(h,s,x,c),p=this.ignoredGrid.query(h,s,x,c),M=0;M<p.length;M++)u.push(p[M]);for(var f=Math.pow(2,Math.ceil(Math.log(e)/Math.LN2*10)/10),v=0;v<u.length;v++){var S=a.get(u[v]),P=S.sourceLayerIndex,b=S.featureIndex;if(void 0===i[P]&&(i[P]={}),!i[P][b]&&!(f<S.placementScale||f>S.maxScale)){var T=S.anchorPoint.matMult(o),w=T.x+S.x1/e,N=T.y+S.y1/e*n,B=T.x+S.x2/e,G=T.y+S.y2/e*n,E=[new Point(w,N),new Point(B,N),new Point(B,G),new Point(w,G)];intersectionTests.polygonIntersectsPolygon(l,E)&&(i[P][b]=!0,r.push(u[v]))}}return r},CollisionTile.prototype.getPlacementScale=function(t,e,i,r,a){var o=e.x-r.x,n=e.y-r.y,l=(a.x1-i.x2)/o,h=(a.x2-i.x1)/o,s=(a.y1-i.y2)*this.yStretch/n,x=(a.y2-i.y1)*this.yStretch/n;(isNaN(l)||isNaN(h))&&(l=h=1),(isNaN(s)||isNaN(x))&&(s=x=1);var c=Math.min(Math.max(l,h),Math.max(s,x)),g=a.maxScale,y=i.maxScale;return c>g&&(c=g),c>y&&(c=y),c>t&&c>=a.placementScale&&(t=c),t},CollisionTile.prototype.insertCollisionFeature=function(t,e,i){for(var r=this,a=i?this.ignoredGrid:this.grid,o=this.collisionBoxArray,n=t.boxStartIndex;n<t.boxEndIndex;n++){var l=o.get(n);l.placementScale=e,e<r.maxScale&&a.insert(n,l.bbox0,l.bbox1,l.bbox2,l.bbox3)}},module.exports=CollisionTile;
	},{"../data/extent":11,"../util/intersection_tests":119,"grid-index":159,"point-geometry":195}],78:[function(require,module,exports){
	"use strict";function getAnchors(e,r,t,n,a,l,o,i,h){var c=n?.6*l*o:0,s=Math.max(n?n.right-n.left:0,a?a.right-a.left:0),u=0===e[0].x||e[0].x===h||0===e[0].y||e[0].y===h;r-s*o<r/4&&(r=s*o+r/4);var g=2*l,p=u?r/2*i%r:(s/2+g)*o*i%r;return resample(e,p,r,c,t,s*o,u,!1,h)}function resample(e,r,t,n,a,l,o,i,h){for(var c=l/2,s=0,u=0;u<e.length-1;u++)s+=e[u].dist(e[u+1]);for(var g=0,p=r-t,x=[],f=0;f<e.length-1;f++){for(var v=e[f],m=e[f+1],A=v.dist(m),y=m.angleTo(v);p+t<g+A;){p+=t;var d=(p-g)/A,k=interpolate(v.x,m.x,d),q=interpolate(v.y,m.y,d);if(k>=0&&k<h&&q>=0&&q<h&&p-c>=0&&p+c<=s){var M=new Anchor(k,q,y,f)._round();n&&!checkMaxAngle(e,M,l,n,a)||x.push(M)}}g+=A}return i||x.length||o||(x=resample(e,g/2,t,n,a,l,o,!0,h)),x}var interpolate=require("../util/interpolate"),Anchor=require("../symbol/anchor"),checkMaxAngle=require("./check_max_angle");module.exports=getAnchors;
	},{"../symbol/anchor":72,"../util/interpolate":118,"./check_max_angle":73}],79:[function(require,module,exports){
	"use strict";var ShelfPack=require("shelf-pack"),util=require("../util/util"),SIZE_GROWTH_RATE=4,DEFAULT_SIZE=128,MAX_SIZE=2048,GlyphAtlas=function(){this.width=DEFAULT_SIZE,this.height=DEFAULT_SIZE,this.bin=new ShelfPack(this.width,this.height),this.index={},this.ids={},this.data=new Uint8Array(this.width*this.height)};GlyphAtlas.prototype.getGlyphs=function(){var t,i,e,h={};for(var r in this.ids)t=r.split("#"),i=t[0],e=t[1],h[i]||(h[i]=[]),h[i].push(e);return h},GlyphAtlas.prototype.getRects=function(){var t,i,e,h=this,r={};for(var s in this.ids)t=s.split("#"),i=t[0],e=t[1],r[i]||(r[i]={}),r[i][e]=h.index[s];return r},GlyphAtlas.prototype.addGlyph=function(t,i,e,h){var r=this;if(!e)return null;var s=i+"#"+e.id;if(this.index[s])return this.ids[s].indexOf(t)<0&&this.ids[s].push(t),this.index[s];if(!e.bitmap)return null;var a=e.width+2*h,n=e.height+2*h,E=1,T=a+2*E,u=n+2*E;T+=4-T%4,u+=4-u%4;var l=this.bin.packOne(T,u);if(l||(this.resize(),l=this.bin.packOne(T,u)),!l)return util.warnOnce("glyph bitmap overflow"),null;this.index[s]=l,this.ids[s]=[t];for(var d=this.data,A=e.bitmap,_=0;_<n;_++)for(var p=r.width*(l.y+_+E)+l.x+E,o=a*_,R=0;R<a;R++)d[p+R]=A[o+R];return this.dirty=!0,l},GlyphAtlas.prototype.resize=function(){var t=this,i=this.width,e=this.height;if(!(i>=MAX_SIZE||e>=MAX_SIZE)){this.texture&&(this.gl&&this.gl.deleteTexture(this.texture),this.texture=null),this.width*=SIZE_GROWTH_RATE,this.height*=SIZE_GROWTH_RATE,this.bin.resize(this.width,this.height);for(var h=new ArrayBuffer(this.width*this.height),r=0;r<e;r++){var s=new Uint8Array(t.data.buffer,e*r,i),a=new Uint8Array(h,e*r*SIZE_GROWTH_RATE,i);a.set(s)}this.data=new Uint8Array(h)}},GlyphAtlas.prototype.bind=function(t){this.gl=t,this.texture?t.bindTexture(t.TEXTURE_2D,this.texture):(this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.ALPHA,this.width,this.height,0,t.ALPHA,t.UNSIGNED_BYTE,null))},GlyphAtlas.prototype.updateTexture=function(t){this.bind(t),this.dirty&&(t.texSubImage2D(t.TEXTURE_2D,0,0,0,this.width,this.height,t.ALPHA,t.UNSIGNED_BYTE,this.data),this.dirty=!1)},module.exports=GlyphAtlas;
	},{"../util/util":126,"shelf-pack":197}],80:[function(require,module,exports){
	"use strict";function glyphUrl(t,e,a,l){return l=l||"abc",a.replace("{s}",l[t.length%l.length]).replace("{fontstack}",t).replace("{range}",e)}var normalizeURL=require("../util/mapbox").normalizeGlyphsURL,ajax=require("../util/ajax"),verticalizePunctuation=require("../util/verticalize_punctuation"),Glyphs=require("../util/glyphs"),GlyphAtlas=require("../symbol/glyph_atlas"),Protobuf=require("pbf"),SimpleGlyph=function(t,e,a){var l=1;this.advance=t.advance,this.left=t.left-a-l,this.top=t.top+a+l,this.rect=e},GlyphSource=function(t){this.url=t&&normalizeURL(t),this.atlases={},this.stacks={},this.loading={}};GlyphSource.prototype.getSimpleGlyphs=function(t,e,a,l){var i=this;void 0===this.stacks[t]&&(this.stacks[t]={}),void 0===this.atlases[t]&&(this.atlases[t]=new GlyphAtlas);for(var r={},o=this.stacks[t],s=this.atlases[t],n=3,h={},p=0,u=function(e){var l=Math.floor(e/256);if(o[l]){var i=o[l].glyphs[e],u=s.addGlyph(a,t,i,n);i&&(r[e]=new SimpleGlyph(i,u,n))}else void 0===h[l]&&(h[l]=[],p++),h[l].push(e)},c=0;c<e.length;c++){var y=e[c],f=String.fromCharCode(y);u(y),verticalizePunctuation.lookup[f]&&u(verticalizePunctuation.lookup[f].charCodeAt(0))}p||l(void 0,r,t);var v=function(e,o,u){if(!e)for(var c=i.stacks[t][o]=u.stacks[0],y=0;y<h[o].length;y++){var f=h[o][y],v=c.glyphs[f],d=s.addGlyph(a,t,v,n);v&&(r[f]=new SimpleGlyph(v,d,n))}p--,p||l(void 0,r,t)};for(var d in h)i.loadRange(t,d,v)},GlyphSource.prototype.loadRange=function(t,e,a){if(256*e>65535)return a("glyphs > 65535 not supported");void 0===this.loading[t]&&(this.loading[t]={});var l=this.loading[t];if(l[e])l[e].push(a);else{l[e]=[a];var i=256*e+"-"+(256*e+255),r=glyphUrl(t,i,this.url);ajax.getArrayBuffer(r,function(t,a){for(var i=!t&&new Glyphs(new Protobuf(a)),r=0;r<l[e].length;r++)l[e][r](t,e,i);delete l[e]})}},GlyphSource.prototype.getGlyphAtlas=function(t){return this.atlases[t]},module.exports=GlyphSource;
	},{"../symbol/glyph_atlas":79,"../util/ajax":106,"../util/glyphs":117,"../util/mapbox":122,"../util/verticalize_punctuation":128,"pbf":193}],81:[function(require,module,exports){
	"use strict";module.exports=function(e){function t(t){g.push(e[t]),l++}function r(e,t,r){var n=u[e];return delete u[e],u[t]=n,g[n].geometry[0].pop(),g[n].geometry[0]=g[n].geometry[0].concat(r[0]),n}function n(e,t,r){var n=i[t];return delete i[t],i[e]=n,g[n].geometry[0].shift(),g[n].geometry[0]=r[0].concat(g[n].geometry[0]),n}function o(e,t,r){var n=r?t[0][t[0].length-1]:t[0][0];return e+":"+n.x+":"+n.y}for(var i={},u={},g=[],l=0,m=0;m<e.length;m++){var y=e[m],c=y.geometry,f=y.text;if(f){var a=o(f,c),s=o(f,c,!0);if(a in u&&s in i&&u[a]!==i[s]){var v=n(a,s,c),d=r(a,s,g[v].geometry);delete i[a],delete u[s],u[o(f,g[d].geometry,!0)]=d,g[v].geometry=null}else a in u?r(a,s,c):s in i?n(a,s,c):(t(m),i[a]=l-1,u[s]=l-1)}else t(m)}return g.filter(function(e){return e.geometry})};
	},{}],82:[function(require,module,exports){
	"use strict";function SymbolQuad(t,e,a,n,i,o,l,h,r,s,g){this.anchorPoint=t,this.tl=e,this.tr=a,this.bl=n,this.br=i,this.tex=o,this.anchorAngle=l,this.glyphAngle=h,this.minScale=r,this.maxScale=s,this.writingMode=g}function getIconQuads(t,e,a,n,i,o,l,h,r){var s,g,u,c,m=e.image.rect,f=i.layout,x=1,d=e.left-x,P=d+m.w/e.image.pixelRatio,y=e.top-x,M=y+m.h/e.image.pixelRatio;if("none"!==f["icon-text-fit"]&&l){var p=P-d,v=M-y,w=f["text-size"]/24,S=l.left*w,b=l.right*w,I=l.top*w,_=l.bottom*w,Q=b-S,G=_-I,k=f["icon-text-fit-padding"][0],q=f["icon-text-fit-padding"][1],A=f["icon-text-fit-padding"][2],R=f["icon-text-fit-padding"][3],z="width"===f["icon-text-fit"]?.5*(G-v):0,L="height"===f["icon-text-fit"]?.5*(Q-p):0,V="width"===f["icon-text-fit"]||"both"===f["icon-text-fit"]?Q:p,j="height"===f["icon-text-fit"]||"both"===f["icon-text-fit"]?G:v;s=new Point(S+L-R,I+z-k),g=new Point(S+L+q+V,I+z-k),u=new Point(S+L+q+V,I+z+A+j),c=new Point(S+L-R,I+z+A+j)}else s=new Point(d,y),g=new Point(P,y),u=new Point(P,M),c=new Point(d,M);var B=i.getLayoutValue("icon-rotate",h,r)*Math.PI/180;if(o){var C=n[t.segment];if(t.y===C.y&&t.x===C.x&&t.segment+1<n.length){var D=n[t.segment+1];B+=Math.atan2(t.y-D.y,t.x-D.x)+Math.PI}else B+=Math.atan2(t.y-C.y,t.x-C.x)}if(B){var E=Math.sin(B),F=Math.cos(B),H=[F,-E,E,F];s=s.matMult(H),g=g.matMult(H),c=c.matMult(H),u=u.matMult(H)}return[new SymbolQuad(new Point(t.x,t.y),s,g,c,u,e.image.rect,0,0,minScale,1/0)]}function getGlyphQuads(t,e,a,n,i,o){for(var l=i.layout["text-rotate"]*Math.PI/180,h=i.layout["text-keep-upright"],r=e.positionedGlyphs,s=[],g=0;g<r.length;g++){var u=r[g],c=u.glyph;if(c){var m=c.rect;if(m){var f,x=(u.x+c.advance/2)*a,d=minScale;o?(f=[],d=getSegmentGlyphs(f,t,x,n,t.segment,!0),h&&(d=Math.min(d,getSegmentGlyphs(f,t,x,n,t.segment,!1)))):f=[{anchorPoint:new Point(t.x,t.y),offset:0,angle:0,maxScale:1/0,minScale:minScale}];var P=u.x+c.left,y=u.y-c.top,M=P+m.w,p=y+m.h,v=new Point(u.x,c.advance/2),w=new Point(P,y),S=new Point(M,y),b=new Point(P,p),I=new Point(M,p);0!==u.angle&&(w._sub(v)._rotate(u.angle)._add(v),S._sub(v)._rotate(u.angle)._add(v),b._sub(v)._rotate(u.angle)._add(v),I._sub(v)._rotate(u.angle)._add(v));for(var _=0;_<f.length;_++){var Q=f[_],G=w,k=S,q=b,A=I;if(l){var R=Math.sin(l),z=Math.cos(l),L=[z,-R,R,z];G=G.matMult(L),k=k.matMult(L),q=q.matMult(L),A=A.matMult(L)}var V=Math.max(Q.minScale,d),j=(t.angle+Q.offset+2*Math.PI)%(2*Math.PI),B=(Q.angle+Q.offset+2*Math.PI)%(2*Math.PI);s.push(new SymbolQuad(Q.anchorPoint,G,k,q,A,m,j,B,V,Q.maxScale,e.writingMode))}}}}return s}function getSegmentGlyphs(t,e,a,n,i,o){var l=!o;a<0&&(o=!o),o&&i++;var h=new Point(e.x,e.y),r=n[i],s=1/0;a=Math.abs(a);for(var g=minScale;;){var u=h.dist(r),c=a/u,m=Math.atan2(r.y-h.y,r.x-h.x);if(o||(m+=Math.PI),t.push({anchorPoint:h,offset:l?Math.PI:0,minScale:c,maxScale:s,angle:(m+2*Math.PI)%(2*Math.PI)}),c<=g)break;for(h=r;h.equals(r);)if(i+=o?1:-1,r=n[i],!r)return c;var f=r.sub(h)._unit();h=h.sub(f._mult(u)),s=c}return g}var Point=require("point-geometry");module.exports={getIconQuads:getIconQuads,getGlyphQuads:getGlyphQuads,SymbolQuad:SymbolQuad};var minScale=.5;
	},{"point-geometry":195}],83:[function(require,module,exports){
	"use strict";var resolveTokens=require("../util/token");module.exports=function(e,r){var o=resolveTokens(e.properties,r["text-field"]);if(o){o=o.toString();var t=r["text-transform"];return"uppercase"===t?o=o.toLocaleUpperCase():"lowercase"===t&&(o=o.toLocaleLowerCase()),o}};
	},{"../util/token":125}],84:[function(require,module,exports){
	"use strict";function PositionedGlyph(i,t,e,n,o){this.codePoint=i,this.x=t,this.y=e,this.glyph=n||null,this.angle=o}function Shaping(i,t,e,n,o,r,a){this.positionedGlyphs=i,this.text=t,this.top=e,this.bottom=n,this.left=o,this.right=r,this.writingMode=a}function shapeText(i,t,e,n,o,r,a,h,l,s,c){i=i.trim(),c===WritingMode.vertical&&(i=verticalizePunctuation(i));for(var p=[],u=new Shaping(p,i,l[1],l[1],l[0],l[0],c),d=-17,g=0,f=0;f<i.length;f++){var v=i.charCodeAt(f),x=t[v];(x||v===newLine)&&(scriptDetection.charHasUprightVerticalOrientation(v)&&c!==WritingMode.horizontal?(p.push(new PositionedGlyph(v,g,0,x,-Math.PI/2)),x&&(g+=s+h)):(p.push(new PositionedGlyph(v,g,d,x,0)),x&&(g+=x.advance+h)))}return!!p.length&&(linewrap(u,t,n,e,o,r,a,l,scriptDetection.allowsIdeographicBreaking(i),c),u)}function linewrap(i,t,e,n,o,r,a,h,l,s){var c=null,p=0,u=0,d=0,g=0,f=i.positionedGlyphs;if(s===WritingMode.horizontal&&n){if(l){var v=f[f.length-1],x=Math.max(1,Math.ceil(v.x/n));n=v.x/x}for(var w=0;w<f.length;w++){var P=f[w];if(P.x-=p,P.y+=e*d,null!==c&&(P.x>n||f[c].codePoint===newLine)){var y=f[c+1].x;g=Math.max(y,g);for(var b=c+1;b<=w;b++)f[b].y+=e,f[b].x-=y;if(a&&c>u){var M=c;invisible[f[c].codePoint]&&M--,justifyLine(f,t,u,M,a)}u=c+1,c=null,p+=y,d++}(l||breakable[P.codePoint]||scriptDetection.charAllowsIdeographicBreaking(P.codePoint))&&(c=w)}}var m=f[f.length-1],I=m.x+t[m.codePoint].advance;g=Math.max(g,I);var L=(d+1)*e;justifyLine(f,t,u,f.length-1,a),align(f,a,o,r,g,e,d,h),i.top+=-r*L,i.bottom=i.top+L,i.left+=-o*g,i.right=i.left+g}function justifyLine(i,t,e,n,o){for(var r=t[i[n].codePoint].advance,a=(i[n].x+r)*o,h=e;h<=n;h++)i[h].x-=a}function align(i,t,e,n,o,r,a,h){for(var l=(t-e)*o+h[0],s=(-n*(a+1)+.5)*r+h[1],c=0;c<i.length;c++)i[c].x+=l,i[c].y+=s}function shapeIcon(i,t){if(!i||!i.rect)return null;var e=t["icon-offset"][0],n=t["icon-offset"][1],o=e-i.width/2,r=o+i.width,a=n-i.height/2,h=a+i.height;return new PositionedIcon(i,a,h,o,r)}function PositionedIcon(i,t,e,n,o){this.image=i,this.top=t,this.bottom=e,this.left=n,this.right=o}var scriptDetection=require("../util/script_detection"),verticalizePunctuation=require("../util/verticalize_punctuation"),WritingMode={horizontal:1,vertical:2};module.exports={shapeText:shapeText,shapeIcon:shapeIcon,WritingMode:WritingMode};var newLine=10,invisible={32:!0,8203:!0},breakable={32:!0,38:!0,43:!0,45:!0,47:!0,173:!0,183:!0,8203:!0,8208:!0,8211:!0};invisible[newLine]=breakable[newLine]=!0;
	},{"../util/script_detection":123,"../util/verticalize_punctuation":128}],85:[function(require,module,exports){
	"use strict";function copyBitmap(t,i,e,h,a,s,r,o,l,p,n){var u,R,f=h*i+e,x=o*s+r;if(n)for(x-=s,R=-1;R<=p;R++,f=((R+p)%p+h)*i+e,x+=s)for(u=-1;u<=l;u++)a[x+u]=t[f+(u+l)%l];else for(R=0;R<p;R++,f+=i,x+=s)for(u=0;u<l;u++)a[x+u]=t[f+u]}var ShelfPack=require("shelf-pack"),browser=require("../util/browser"),util=require("../util/util"),AtlasImage=function(t,i,e,h,a){this.rect=t,this.width=i,this.height=e,this.sdf=h,this.pixelRatio=a},SpriteAtlas=function(t,i){this.width=t,this.height=i,this.bin=new ShelfPack(t,i),this.images={},this.data=!1,this.texture=0,this.filter=0,this.pixelRatio=1,this.dirty=!0};SpriteAtlas.prototype.allocateImage=function(t,i){t/=this.pixelRatio,i/=this.pixelRatio;var e=2,h=t+e+(4-(t+e)%4),a=i+e+(4-(i+e)%4),s=this.bin.packOne(h,a);return s?s:(util.warnOnce("SpriteAtlas out of space."),null)},SpriteAtlas.prototype.getImage=function(t,i){if(this.images[t])return this.images[t];if(!this.sprite)return null;var e=this.sprite.getSpritePosition(t);if(!e.width||!e.height)return null;var h=this.allocateImage(e.width,e.height);if(!h)return null;var a=new AtlasImage(h,e.width/e.pixelRatio,e.height/e.pixelRatio,e.sdf,e.pixelRatio/this.pixelRatio);return this.images[t]=a,this.copy(h,e,i),a},SpriteAtlas.prototype.getPosition=function(t,i){var e=this.getImage(t,i),h=e&&e.rect;if(!h)return null;var a=e.width*e.pixelRatio,s=e.height*e.pixelRatio,r=1;return{size:[e.width,e.height],tl:[(h.x+r)/this.width,(h.y+r)/this.height],br:[(h.x+r+a)/this.width,(h.y+r+s)/this.height]}},SpriteAtlas.prototype.allocate=function(){var t=this;if(!this.data){var i=Math.floor(this.width*this.pixelRatio),e=Math.floor(this.height*this.pixelRatio);this.data=new Uint32Array(i*e);for(var h=0;h<this.data.length;h++)t.data[h]=0}},SpriteAtlas.prototype.copy=function(t,i,e){if(this.sprite.imgData){var h=new Uint32Array(this.sprite.imgData.buffer);this.allocate();var a=this.data,s=1;copyBitmap(h,this.sprite.width,i.x,i.y,a,this.width*this.pixelRatio,(t.x+s)*this.pixelRatio,(t.y+s)*this.pixelRatio,i.width,i.height,e),this.dirty=!0}},SpriteAtlas.prototype.setSprite=function(t){t&&(this.pixelRatio=browser.devicePixelRatio>1?2:1,this.canvas&&(this.canvas.width=this.width*this.pixelRatio,this.canvas.height=this.height*this.pixelRatio)),this.sprite=t},SpriteAtlas.prototype.addIcons=function(t,i){for(var e=this,h=0;h<t.length;h++)e.getImage(t[h]);i(null,this.images)},SpriteAtlas.prototype.bind=function(t,i){var e=!1;this.texture?t.bindTexture(t.TEXTURE_2D,this.texture):(this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),e=!0);var h=i?t.LINEAR:t.NEAREST;h!==this.filter&&(t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,h),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,h),this.filter=h),this.dirty&&(this.allocate(),e?t.texImage2D(t.TEXTURE_2D,0,t.RGBA,this.width*this.pixelRatio,this.height*this.pixelRatio,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array(this.data.buffer)):t.texSubImage2D(t.TEXTURE_2D,0,0,0,this.width*this.pixelRatio,this.height*this.pixelRatio,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array(this.data.buffer)),this.dirty=!1)},module.exports=SpriteAtlas;
	},{"../util/browser":107,"../util/util":126,"shelf-pack":197}],86:[function(require,module,exports){
	"use strict";var createStructArrayType=require("../util/struct_array"),Point=require("point-geometry"),SymbolInstancesArray=createStructArrayType({members:[{type:"Uint16",name:"textBoxStartIndex"},{type:"Uint16",name:"textBoxEndIndex"},{type:"Uint16",name:"iconBoxStartIndex"},{type:"Uint16",name:"iconBoxEndIndex"},{type:"Uint16",name:"glyphQuadStartIndex"},{type:"Uint16",name:"glyphQuadEndIndex"},{type:"Uint16",name:"iconQuadStartIndex"},{type:"Uint16",name:"iconQuadEndIndex"},{type:"Int16",name:"anchorPointX"},{type:"Int16",name:"anchorPointY"},{type:"Int8",name:"index"},{type:"Uint8",name:"writingModes"}]});Object.defineProperty(SymbolInstancesArray.prototype.StructType.prototype,"anchorPoint",{get:function(){return new Point(this.anchorPointX,this.anchorPointY)}}),module.exports=SymbolInstancesArray;
	},{"../util/struct_array":124,"point-geometry":195}],87:[function(require,module,exports){
	"use strict";var createStructArrayType=require("../util/struct_array"),Point=require("point-geometry"),SymbolQuad=require("./quads").SymbolQuad,SymbolQuadsArray=createStructArrayType({members:[{type:"Int16",name:"anchorPointX"},{type:"Int16",name:"anchorPointY"},{type:"Float32",name:"tlX"},{type:"Float32",name:"tlY"},{type:"Float32",name:"trX"},{type:"Float32",name:"trY"},{type:"Float32",name:"blX"},{type:"Float32",name:"blY"},{type:"Float32",name:"brX"},{type:"Float32",name:"brY"},{type:"Int16",name:"texH"},{type:"Int16",name:"texW"},{type:"Int16",name:"texX"},{type:"Int16",name:"texY"},{type:"Float32",name:"anchorAngle"},{type:"Float32",name:"glyphAngle"},{type:"Float32",name:"maxScale"},{type:"Float32",name:"minScale"},{type:"Uint8",name:"writingMode"}]});Object.defineProperty(SymbolQuadsArray.prototype.StructType.prototype,"anchorPoint",{get:function(){return new Point(this.anchorPointX,this.anchorPointY)}}),Object.defineProperty(SymbolQuadsArray.prototype.StructType.prototype,"SymbolQuad",{get:function(){return new SymbolQuad(this.anchorPoint,new Point(this.tlX,this.tlY),new Point(this.trX,this.trY),new Point(this.blX,this.blY),new Point(this.brX,this.brY),{x:this.texX,y:this.texY,h:this.texH,w:this.texW,height:this.texH,width:this.texW},this.anchorAngle,this.glyphAngle,this.minScale,this.maxScale,this.writingMode)}}),module.exports=SymbolQuadsArray;
	},{"../util/struct_array":124,"./quads":82,"point-geometry":195}],88:[function(require,module,exports){
	"use strict";var DOM=require("../util/dom"),Point=require("point-geometry"),handlers={scrollZoom:require("./handler/scroll_zoom"),boxZoom:require("./handler/box_zoom"),dragRotate:require("./handler/drag_rotate"),dragPan:require("./handler/drag_pan"),keyboard:require("./handler/keyboard"),doubleClickZoom:require("./handler/dblclick_zoom"),touchZoomRotate:require("./handler/touch_zoom_rotate")};module.exports=function(e,t){function n(e){h("mouseout",e)}function o(t){e.stop(),E=DOM.mousePos(g,t),h("mousedown",t)}function r(t){var n=e.dragRotate&&e.dragRotate.isActive();p&&!n&&h("contextmenu",p),p=null,h("mouseup",t)}function u(t){if(!(e.dragPan&&e.dragPan.isActive()||e.dragRotate&&e.dragRotate.isActive())){for(var n=t.toElement||t.target;n&&n!==g;)n=n.parentNode;n===g&&h("mousemove",t)}}function a(t){e.stop(),f("touchstart",t),!t.touches||t.touches.length>1||(L?(clearTimeout(L),L=null,h("dblclick",t)):L=setTimeout(l,300))}function i(e){f("touchmove",e)}function c(e){f("touchend",e)}function d(e){f("touchcancel",e)}function l(){L=null}function s(e){var t=DOM.mousePos(g,e);t.equals(E)&&h("click",e)}function v(e){h("dblclick",e),e.preventDefault()}function m(e){p=e,e.preventDefault()}function h(t,n){var o=DOM.mousePos(g,n);return e.fire(t,{lngLat:e.unproject(o),point:o,originalEvent:n})}function f(t,n){var o=DOM.touchPos(g,n),r=o.reduce(function(e,t,n,o){return e.add(t.div(o.length))},new Point(0,0));return e.fire(t,{lngLat:e.unproject(r),point:r,lngLats:o.map(function(t){return e.unproject(t)},this),points:o,originalEvent:n})}var g=e.getCanvasContainer(),p=null,E=null,L=null;for(var b in handlers)e[b]=new handlers[b](e,t),t.interactive&&t[b]&&e[b].enable();g.addEventListener("mouseout",n,!1),g.addEventListener("mousedown",o,!1),g.addEventListener("mouseup",r,!1),g.addEventListener("mousemove",u,!1),g.addEventListener("touchstart",a,!1),g.addEventListener("touchend",c,!1),g.addEventListener("touchmove",i,!1),g.addEventListener("touchcancel",d,!1),g.addEventListener("click",s,!1),g.addEventListener("dblclick",v,!1),g.addEventListener("contextmenu",m,!1)};
	},{"../util/dom":114,"./handler/box_zoom":94,"./handler/dblclick_zoom":95,"./handler/drag_pan":96,"./handler/drag_rotate":97,"./handler/keyboard":98,"./handler/scroll_zoom":99,"./handler/touch_zoom_rotate":100,"point-geometry":195}],89:[function(require,module,exports){
	"use strict";var util=require("../util/util"),interpolate=require("../util/interpolate"),browser=require("../util/browser"),LngLat=require("../geo/lng_lat"),LngLatBounds=require("../geo/lng_lat_bounds"),Point=require("point-geometry"),Evented=require("../util/evented"),Camera=function(t){function i(i,e){t.call(this),this.transform=i,this._bearingSnap=e.bearingSnap}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.getCenter=function(){return this.transform.center},i.prototype.setCenter=function(t,i){return this.jumpTo({center:t},i),this},i.prototype.panBy=function(t,i,e){return this.panTo(this.transform.center,util.extend({offset:Point.convert(t).mult(-1)},i),e),this},i.prototype.panTo=function(t,i,e){return this.easeTo(util.extend({center:t},i),e)},i.prototype.getZoom=function(){return this.transform.zoom},i.prototype.setZoom=function(t,i){return this.jumpTo({zoom:t},i),this},i.prototype.zoomTo=function(t,i,e){return this.easeTo(util.extend({zoom:t},i),e)},i.prototype.zoomIn=function(t,i){return this.zoomTo(this.getZoom()+1,t,i),this},i.prototype.zoomOut=function(t,i){return this.zoomTo(this.getZoom()-1,t,i),this},i.prototype.getBearing=function(){return this.transform.bearing},i.prototype.setBearing=function(t,i){return this.jumpTo({bearing:t},i),this},i.prototype.rotateTo=function(t,i,e){return this.easeTo(util.extend({bearing:t},i),e)},i.prototype.resetNorth=function(t,i){return this.rotateTo(0,util.extend({duration:1e3},t),i),this},i.prototype.snapToNorth=function(t,i){return Math.abs(this.getBearing())<this._bearingSnap?this.resetNorth(t,i):this},i.prototype.getPitch=function(){return this.transform.pitch},i.prototype.setPitch=function(t,i){return this.jumpTo({pitch:t},i),this},i.prototype.fitBounds=function(t,i,e){i=util.extend({padding:0,offset:[0,0],maxZoom:1/0},i),t=LngLatBounds.convert(t);var o=Point.convert(i.offset),n=this.transform,r=n.project(t.getNorthWest()),s=n.project(t.getSouthEast()),a=s.sub(r),h=(n.width-2*i.padding-2*Math.abs(o.x))/a.x,u=(n.height-2*i.padding-2*Math.abs(o.y))/a.y;return i.center=n.unproject(r.add(s).div(2)),i.zoom=Math.min(n.scaleZoom(n.scale*Math.min(h,u)),i.maxZoom),i.bearing=0,i.linear?this.easeTo(i,e):this.flyTo(i,e)},i.prototype.jumpTo=function(t,i){this.stop();var e=this.transform,o=!1,n=!1,r=!1;return"zoom"in t&&e.zoom!==+t.zoom&&(o=!0,e.zoom=+t.zoom),"center"in t&&(e.center=LngLat.convert(t.center)),"bearing"in t&&e.bearing!==+t.bearing&&(n=!0,e.bearing=+t.bearing),"pitch"in t&&e.pitch!==+t.pitch&&(r=!0,e.pitch=+t.pitch),this.fire("movestart",i).fire("move",i),o&&this.fire("zoomstart",i).fire("zoom",i).fire("zoomend",i),n&&this.fire("rotate",i),r&&this.fire("pitch",i),this.fire("moveend",i)},i.prototype.easeTo=function(t,i){var e=this;this.stop(),t=util.extend({offset:[0,0],duration:500,easing:util.ease},t);var o,n,r=this.transform,s=Point.convert(t.offset),a=this.getZoom(),h=this.getBearing(),u=this.getPitch(),p="zoom"in t?+t.zoom:a,c="bearing"in t?this._normalizeBearing(t.bearing,h):h,m="pitch"in t?+t.pitch:u;"center"in t?(o=LngLat.convert(t.center),n=r.centerPoint.add(s)):"around"in t?(o=LngLat.convert(t.around),n=r.locationPoint(o)):(n=r.centerPoint.add(s),o=r.pointLocation(n));var g=r.locationPoint(o);return t.animate===!1&&(t.duration=0),this.zooming=p!==a,this.rotating=h!==c,this.pitching=m!==u,t.smoothEasing&&0!==t.duration&&(t.easing=this._smoothOutEasing(t.duration)),t.noMoveStart||this.fire("movestart",i),this.zooming&&this.fire("zoomstart",i),clearTimeout(this._onEaseEnd),this._ease(function(t){this.zooming&&(r.zoom=interpolate(a,p,t)),this.rotating&&(r.bearing=interpolate(h,c,t)),this.pitching&&(r.pitch=interpolate(u,m,t)),r.setLocationAtPoint(o,g.add(n.sub(g)._mult(t))),this.fire("move",i),this.zooming&&this.fire("zoom",i),this.rotating&&this.fire("rotate",i),this.pitching&&this.fire("pitch",i)},function(){t.delayEndEvents?e._onEaseEnd=setTimeout(e._easeToEnd.bind(e,i),t.delayEndEvents):e._easeToEnd(i)},t),this},i.prototype._easeToEnd=function(t){var i=this.zooming;this.zooming=!1,this.rotating=!1,this.pitching=!1,i&&this.fire("zoomend",t),this.fire("moveend",t)},i.prototype.flyTo=function(t,i){function e(t){var i=(_*_-y*y+(t?-1:1)*x*x*M*M)/(2*(t?_:y)*x*M);return Math.log(Math.sqrt(i*i+1)-i)}function o(t){return(Math.exp(t)-Math.exp(-t))/2}function n(t){return(Math.exp(t)+Math.exp(-t))/2}function r(t){return o(t)/n(t)}this.stop(),t=util.extend({offset:[0,0],speed:1.2,curve:1.42,easing:util.ease},t);var s=this.transform,a=Point.convert(t.offset),h=this.getZoom(),u=this.getBearing(),p=this.getPitch(),c="center"in t?LngLat.convert(t.center):this.getCenter(),m="zoom"in t?+t.zoom:h,g="bearing"in t?this._normalizeBearing(t.bearing,u):u,f="pitch"in t?+t.pitch:p;Math.abs(s.center.lng)+Math.abs(c.lng)>180&&(s.center.lng>0&&c.lng<0?c.lng+=360:s.center.lng<0&&c.lng>0&&(c.lng-=360));var d=s.zoomScale(m-h),l=s.point,v="center"in t?s.project(c).sub(a.div(d)):l,b=s.worldSize,z=t.curve,y=Math.max(s.width,s.height),_=y/d,M=v.sub(l).mag();if("minZoom"in t){var T=util.clamp(Math.min(t.minZoom,h,m),s.minZoom,s.maxZoom),E=y/s.zoomScale(T-h);z=Math.sqrt(E/M*2)}var x=z*z,L=e(0),P=function(t){return n(L)/n(L+z*t)},Z=function(t){return y*((n(L)*r(L+z*t)-o(L))/x)/M},B=(e(1)-L)/z;if(Math.abs(M)<1e-6){if(Math.abs(y-_)<1e-6)return this.easeTo(t);var j=_<y?-1:1;B=Math.abs(Math.log(_/y))/z,Z=function(){return 0},P=function(t){return Math.exp(j*z*t)}}if("duration"in t)t.duration=+t.duration;else{var q="screenSpeed"in t?+t.screenSpeed/z:+t.speed;t.duration=1e3*B/q}return this.zooming=!0,u!==g&&(this.rotating=!0),p!==f&&(this.pitching=!0),this.fire("movestart",i),this.fire("zoomstart",i),this._ease(function(t){var e=t*B,o=Z(e);s.zoom=h+s.scaleZoom(1/P(e)),s.center=s.unproject(l.add(v.sub(l).mult(o)),b),this.rotating&&(s.bearing=interpolate(u,g,t)),this.pitching&&(s.pitch=interpolate(p,f,t)),this.fire("move",i),this.fire("zoom",i),this.rotating&&this.fire("rotate",i),this.pitching&&this.fire("pitch",i)},function(){this.zooming=!1,this.rotating=!1,this.pitching=!1,this.fire("zoomend",i),this.fire("moveend",i)},t),this},i.prototype.isEasing=function(){return!!this._abortFn},i.prototype.stop=function(){return this._abortFn&&(this._abortFn(),this._finishEase()),this},i.prototype._ease=function(t,i,e){this._finishFn=i,this._abortFn=browser.timed(function(i){t.call(this,e.easing(i)),1===i&&this._finishEase()},e.animate===!1?0:e.duration,this)},i.prototype._finishEase=function(){delete this._abortFn;var t=this._finishFn;delete this._finishFn,t.call(this)},i.prototype._normalizeBearing=function(t,i){t=util.wrap(t,-180,180);var e=Math.abs(t-i);return Math.abs(t-360-i)<e&&(t-=360),Math.abs(t+360-i)<e&&(t+=360),t},i.prototype._smoothOutEasing=function(t){var i=util.ease;if(this._prevEase){var e=this._prevEase,o=(Date.now()-e.start)/e.duration,n=e.easing(o+.01)-e.easing(o),r=.27/Math.sqrt(n*n+1e-4)*.01,s=Math.sqrt(.0729-r*r);i=util.bezier(r,s,.25,1)}return this._prevEase={start:(new Date).getTime(),duration:t,easing:i},i},i}(Evented);module.exports=Camera;
	},{"../geo/lng_lat":19,"../geo/lng_lat_bounds":20,"../util/browser":107,"../util/evented":115,"../util/interpolate":118,"../util/util":126,"point-geometry":195}],90:[function(require,module,exports){
	"use strict";var DOM=require("../../util/dom"),util=require("../../util/util"),AttributionControl=function(){util.bindAll(["_updateEditLink","_updateData"],this)};AttributionControl.prototype.getDefaultPosition=function(){return"bottom-right"},AttributionControl.prototype.onAdd=function(t){return this._map=t,this._container=DOM.create("div","mapboxgl-ctrl mapboxgl-ctrl-attrib"),this._updateAttributions(),this._updateEditLink(),this._map.on("data",this._updateData),this._map.on("moveend",this._updateEditLink),this._container},AttributionControl.prototype.onRemove=function(){this._container.parentNode.removeChild(this._container),this._map.off("data",this._updateData),this._map.off("moveend",this._updateEditLink),this._map=void 0},AttributionControl.prototype._updateEditLink=function(){if(this._editLink||(this._editLink=this._container.querySelector(".mapbox-improve-map")),this._editLink){var t=this._map.getCenter();this._editLink.href="https://www.mapbox.com/map-feedback/#/"+t.lng+"/"+t.lat+"/"+Math.round(this._map.getZoom()+1)}},AttributionControl.prototype._updateData=function(t){"source"===t.dataType&&(this._updateAttributions(),this._updateEditLink())},AttributionControl.prototype._updateAttributions=function(){if(this._map.style){var t=[],i=this._map.style.sourceCaches;for(var o in i){var n=i[o].getSource();n.attribution&&t.indexOf(n.attribution)<0&&t.push(n.attribution)}t.sort(function(t,i){return t.length-i.length}),t=t.filter(function(i,o){for(var n=o+1;n<t.length;n++)if(t[n].indexOf(i)>=0)return!1;return!0}),this._container.innerHTML=t.join(" | "),this._editLink=null}},module.exports=AttributionControl;
	},{"../../util/dom":114,"../../util/util":126}],91:[function(require,module,exports){
	"use strict";function checkGeolocationSupport(t){void 0!==supportsGeolocation?t(supportsGeolocation):void 0!==window.navigator.permissions?window.navigator.permissions.query({name:"geolocation"}).then(function(o){supportsGeolocation="denied"!==o.state,t(supportsGeolocation)}):(supportsGeolocation=!!window.navigator.geolocation,t(supportsGeolocation))}var Evented=require("../../util/evented"),DOM=require("../../util/dom"),window=require("../../util/window"),util=require("../../util/util"),geoOptions={enableHighAccuracy:!1,timeout:6e3},className="mapboxgl-ctrl",supportsGeolocation,GeolocateControl=function(t){function o(){t.call(this),util.bindAll(["_onSuccess","_onError","_finish","_setupUI"],this)}return t&&(o.__proto__=t),o.prototype=Object.create(t&&t.prototype),o.prototype.constructor=o,o.prototype.onAdd=function(t){return this._map=t,this._container=DOM.create("div",className+" "+className+"-group"),checkGeolocationSupport(this._setupUI),this._container},o.prototype.onRemove=function(){this._container.parentNode.removeChild(this._container),this._map=void 0},o.prototype._onSuccess=function(t){this._map.jumpTo({center:[t.coords.longitude,t.coords.latitude],zoom:17,bearing:0,pitch:0}),this.fire("geolocate",t),this._finish()},o.prototype._onError=function(t){this.fire("error",t),this._finish()},o.prototype._finish=function(){this._timeoutId&&clearTimeout(this._timeoutId),this._timeoutId=void 0},o.prototype._setupUI=function(t){t!==!1&&(this._container.addEventListener("contextmenu",function(t){return t.preventDefault()}),this._geolocateButton=DOM.create("button",className+"-icon "+className+"-geolocate",this._container),this._geolocateButton.type="button",this._geolocateButton.setAttribute("aria-label","Geolocate"),this._geolocateButton.addEventListener("click",this._onClickGeolocate.bind(this)))},o.prototype._onClickGeolocate=function(){window.navigator.geolocation.getCurrentPosition(this._onSuccess,this._onError,geoOptions),this._timeoutId=setTimeout(this._finish,1e4)},o}(Evented);module.exports=GeolocateControl;
	},{"../../util/dom":114,"../../util/evented":115,"../../util/util":126,"../../util/window":109}],92:[function(require,module,exports){
	"use strict";function copyMouseEvent(t){return new window.MouseEvent(t.type,{button:2,buttons:2,bubbles:!0,cancelable:!0,detail:t.detail,view:t.view,screenX:t.screenX,screenY:t.screenY,clientX:t.clientX,clientY:t.clientY,movementX:t.movementX,movementY:t.movementY,ctrlKey:t.ctrlKey,shiftKey:t.shiftKey,altKey:t.altKey,metaKey:t.metaKey})}var DOM=require("../../util/dom"),window=require("../../util/window"),util=require("../../util/util"),className="mapboxgl-ctrl",NavigationControl=function(){util.bindAll(["_rotateCompassArrow"],this)};NavigationControl.prototype._rotateCompassArrow=function(){var t="rotate("+this._map.transform.angle*(180/Math.PI)+"deg)";this._compassArrow.style.transform=t},NavigationControl.prototype.onAdd=function(t){return this._map=t,this._container=DOM.create("div",className+" "+className+"-group",t.getContainer()),this._container.addEventListener("contextmenu",this._onContextMenu.bind(this)),this._zoomInButton=this._createButton(className+"-icon "+className+"-zoom-in","Zoom In",t.zoomIn.bind(t)),this._zoomOutButton=this._createButton(className+"-icon "+className+"-zoom-out","Zoom Out",t.zoomOut.bind(t)),this._compass=this._createButton(className+"-icon "+className+"-compass","Reset North",t.resetNorth.bind(t)),this._compassArrow=DOM.create("span","arrow",this._compass),this._compass.addEventListener("mousedown",this._onCompassDown.bind(this)),this._onCompassMove=this._onCompassMove.bind(this),this._onCompassUp=this._onCompassUp.bind(this),this._map.on("rotate",this._rotateCompassArrow),this._rotateCompassArrow(),this._container},NavigationControl.prototype.onRemove=function(){this._container.parentNode.removeChild(this._container),this._map.off("rotate",this._rotateCompassArrow),this._map=void 0},NavigationControl.prototype._onContextMenu=function(t){t.preventDefault()},NavigationControl.prototype._onCompassDown=function(t){0===t.button&&(DOM.disableDrag(),window.document.addEventListener("mousemove",this._onCompassMove),window.document.addEventListener("mouseup",this._onCompassUp),this._map.getCanvasContainer().dispatchEvent(copyMouseEvent(t)),t.stopPropagation())},NavigationControl.prototype._onCompassMove=function(t){0===t.button&&(this._map.getCanvasContainer().dispatchEvent(copyMouseEvent(t)),t.stopPropagation())},NavigationControl.prototype._onCompassUp=function(t){0===t.button&&(window.document.removeEventListener("mousemove",this._onCompassMove),window.document.removeEventListener("mouseup",this._onCompassUp),DOM.enableDrag(),this._map.getCanvasContainer().dispatchEvent(copyMouseEvent(t)),t.stopPropagation())},NavigationControl.prototype._createButton=function(t,o,e){var n=DOM.create("button",t,this._container);return n.type="button",n.setAttribute("aria-label",o),n.addEventListener("click",function(){e()}),n},module.exports=NavigationControl;
	},{"../../util/dom":114,"../../util/util":126,"../../util/window":109}],93:[function(require,module,exports){
	"use strict";function updateScale(t,e,o){var n=o&&o.maxWidth||100,i=t._container.clientHeight/2,a=getDistance(t.unproject([0,i]),t.unproject([n,i]));if(o&&"imperial"===o.unit){var r=3.2808*a;if(r>5280){var l=r/5280;setScale(e,n,l,"mi")}else setScale(e,n,r,"ft")}else setScale(e,n,a,"m")}function setScale(t,e,o,n){var i=getRoundNum(o),a=i/o;"m"===n&&i>=1e3&&(i/=1e3,n="km"),t.style.width=e*a+"px",t.innerHTML=i+n}function getDistance(t,e){var o=6371e3,n=Math.PI/180,i=t.lat*n,a=e.lat*n,r=Math.sin(i)*Math.sin(a)+Math.cos(i)*Math.cos(a)*Math.cos((e.lng-t.lng)*n),l=o*Math.acos(Math.min(r,1));return l}function getRoundNum(t){var e=Math.pow(10,(""+Math.floor(t)).length-1),o=t/e;return o=o>=10?10:o>=5?5:o>=3?3:o>=2?2:1,e*o}var DOM=require("../../util/dom"),util=require("../../util/util"),ScaleControl=function(t){this.options=t,util.bindAll(["_onMove"],this)};ScaleControl.prototype.getDefaultPosition=function(){return"bottom-left"},ScaleControl.prototype._onMove=function(){updateScale(this._map,this._container,this.options)},ScaleControl.prototype.onAdd=function(t){return this._map=t,this._container=DOM.create("div","mapboxgl-ctrl mapboxgl-ctrl-scale",t.getContainer()),this._map.on("move",this._onMove),this._onMove(),this._container},ScaleControl.prototype.onRemove=function(){this._container.parentNode.removeChild(this._container),this._map.off("move",this._onMove),this._map=void 0},module.exports=ScaleControl;
	},{"../../util/dom":114,"../../util/util":126}],94:[function(require,module,exports){
	"use strict";var DOM=require("../../util/dom"),LngLatBounds=require("../../geo/lng_lat_bounds"),util=require("../../util/util"),window=require("../../util/window"),BoxZoomHandler=function(o){this._map=o,this._el=o.getCanvasContainer(),this._container=o.getContainer(),util.bindAll(["_onMouseDown","_onMouseMove","_onMouseUp","_onKeyDown"],this)};BoxZoomHandler.prototype.isEnabled=function(){return!!this._enabled},BoxZoomHandler.prototype.isActive=function(){return!!this._active},BoxZoomHandler.prototype.enable=function(){this.isEnabled()||(this._el.addEventListener("mousedown",this._onMouseDown,!1),this._enabled=!0)},BoxZoomHandler.prototype.disable=function(){this.isEnabled()&&(this._el.removeEventListener("mousedown",this._onMouseDown),this._enabled=!1)},BoxZoomHandler.prototype._onMouseDown=function(o){o.shiftKey&&0===o.button&&(window.document.addEventListener("mousemove",this._onMouseMove,!1),window.document.addEventListener("keydown",this._onKeyDown,!1),window.document.addEventListener("mouseup",this._onMouseUp,!1),DOM.disableDrag(),this._startPos=DOM.mousePos(this._el,o),this._active=!0)},BoxZoomHandler.prototype._onMouseMove=function(o){var e=this._startPos,t=DOM.mousePos(this._el,o);this._box||(this._box=DOM.create("div","mapboxgl-boxzoom",this._container),this._container.classList.add("mapboxgl-crosshair"),this._fireEvent("boxzoomstart",o));var n=Math.min(e.x,t.x),i=Math.max(e.x,t.x),s=Math.min(e.y,t.y),r=Math.max(e.y,t.y);DOM.setTransform(this._box,"translate("+n+"px,"+s+"px)"),this._box.style.width=i-n+"px",this._box.style.height=r-s+"px"},BoxZoomHandler.prototype._onMouseUp=function(o){if(0===o.button){var e=this._startPos,t=DOM.mousePos(this._el,o),n=(new LngLatBounds).extend(this._map.unproject(e)).extend(this._map.unproject(t));this._finish(),e.x===t.x&&e.y===t.y?this._fireEvent("boxzoomcancel",o):this._map.fitBounds(n,{linear:!0}).fire("boxzoomend",{originalEvent:o,boxZoomBounds:n})}},BoxZoomHandler.prototype._onKeyDown=function(o){27===o.keyCode&&(this._finish(),this._fireEvent("boxzoomcancel",o))},BoxZoomHandler.prototype._finish=function(){this._active=!1,window.document.removeEventListener("mousemove",this._onMouseMove,!1),window.document.removeEventListener("keydown",this._onKeyDown,!1),window.document.removeEventListener("mouseup",this._onMouseUp,!1),this._container.classList.remove("mapboxgl-crosshair"),this._box&&(this._box.parentNode.removeChild(this._box),this._box=null),DOM.enableDrag()},BoxZoomHandler.prototype._fireEvent=function(o,e){return this._map.fire(o,{originalEvent:e})},module.exports=BoxZoomHandler;
	},{"../../geo/lng_lat_bounds":20,"../../util/dom":114,"../../util/util":126,"../../util/window":109}],95:[function(require,module,exports){
	"use strict";var DoubleClickZoomHandler=function(o){this._map=o,this._onDblClick=this._onDblClick.bind(this)};DoubleClickZoomHandler.prototype.isEnabled=function(){return!!this._enabled},DoubleClickZoomHandler.prototype.enable=function(){this.isEnabled()||(this._map.on("dblclick",this._onDblClick),this._enabled=!0)},DoubleClickZoomHandler.prototype.disable=function(){this.isEnabled()&&(this._map.off("dblclick",this._onDblClick),this._enabled=!1)},DoubleClickZoomHandler.prototype._onDblClick=function(o){this._map.zoomTo(this._map.getZoom()+(o.originalEvent.shiftKey?-1:1),{around:o.lngLat},o)},module.exports=DoubleClickZoomHandler;
	},{}],96:[function(require,module,exports){
	"use strict";var DOM=require("../../util/dom"),util=require("../../util/util"),window=require("../../util/window"),inertiaLinearity=.3,inertiaEasing=util.bezier(0,0,inertiaLinearity,1),inertiaMaxSpeed=1400,inertiaDeceleration=2500,DragPanHandler=function(t){this._map=t,this._el=t.getCanvasContainer(),util.bindAll(["_onDown","_onMove","_onUp","_onTouchEnd","_onMouseUp"],this)};DragPanHandler.prototype.isEnabled=function(){return!!this._enabled},DragPanHandler.prototype.isActive=function(){return!!this._active},DragPanHandler.prototype.enable=function(){this.isEnabled()||(this._el.addEventListener("mousedown",this._onDown),this._el.addEventListener("touchstart",this._onDown),this._enabled=!0)},DragPanHandler.prototype.disable=function(){this.isEnabled()&&(this._el.removeEventListener("mousedown",this._onDown),this._el.removeEventListener("touchstart",this._onDown),this._enabled=!1)},DragPanHandler.prototype._onDown=function(t){this._ignoreEvent(t)||this.isActive()||(t.touches?(window.document.addEventListener("touchmove",this._onMove),window.document.addEventListener("touchend",this._onTouchEnd)):(window.document.addEventListener("mousemove",this._onMove),window.document.addEventListener("mouseup",this._onMouseUp)),this._active=!1,this._startPos=this._pos=DOM.mousePos(this._el,t),this._inertia=[[Date.now(),this._pos]])},DragPanHandler.prototype._onMove=function(t){if(!this._ignoreEvent(t)){this.isActive()||(this._active=!0,this._fireEvent("dragstart",t),this._fireEvent("movestart",t));var e=DOM.mousePos(this._el,t),n=this._map;n.stop(),this._drainInertiaBuffer(),this._inertia.push([Date.now(),e]),n.transform.setLocationAtPoint(n.transform.pointLocation(this._pos),e),this._fireEvent("drag",t),this._fireEvent("move",t),this._pos=e,t.preventDefault()}},DragPanHandler.prototype._onUp=function(t){var e=this;if(this.isActive()){this._active=!1,this._fireEvent("dragend",t),this._drainInertiaBuffer();var n=function(){return e._fireEvent("moveend",t)},i=this._inertia;if(i.length<2)return void n();var o=i[i.length-1],r=i[0],a=o[1].sub(r[1]),s=(o[0]-r[0])/1e3;if(0===s||o[1].equals(r[1]))return void n();var u=a.mult(inertiaLinearity/s),h=u.mag();h>inertiaMaxSpeed&&(h=inertiaMaxSpeed,u._unit()._mult(h));var d=h/(inertiaDeceleration*inertiaLinearity),v=u.mult(-d/2);this._map.panBy(v,{duration:1e3*d,easing:inertiaEasing,noMoveStart:!0},{originalEvent:t})}},DragPanHandler.prototype._onMouseUp=function(t){this._ignoreEvent(t)||(this._onUp(t),window.document.removeEventListener("mousemove",this._onMove),window.document.removeEventListener("mouseup",this._onMouseUp))},DragPanHandler.prototype._onTouchEnd=function(t){this._ignoreEvent(t)||(this._onUp(t),window.document.removeEventListener("touchmove",this._onMove),window.document.removeEventListener("touchend",this._onTouchEnd))},DragPanHandler.prototype._fireEvent=function(t,e){return this._map.fire(t,{originalEvent:e})},DragPanHandler.prototype._ignoreEvent=function(t){var e=this._map;if(e.boxZoom&&e.boxZoom.isActive())return!0;if(e.dragRotate&&e.dragRotate.isActive())return!0;if(t.touches)return t.touches.length>1;if(t.ctrlKey)return!0;var n=1,i=0;return"mousemove"===t.type?t.buttons&0===n:t.button!==i},DragPanHandler.prototype._drainInertiaBuffer=function(){for(var t=this._inertia,e=Date.now(),n=160;t.length>0&&e-t[0][0]>n;)t.shift()},module.exports=DragPanHandler;
	},{"../../util/dom":114,"../../util/util":126,"../../util/window":109}],97:[function(require,module,exports){
	"use strict";var DOM=require("../../util/dom"),util=require("../../util/util"),window=require("../../util/window"),inertiaLinearity=.25,inertiaEasing=util.bezier(0,0,inertiaLinearity,1),inertiaMaxSpeed=180,inertiaDeceleration=720,DragRotateHandler=function(t,e){this._map=t,this._el=t.getCanvasContainer(),this._bearingSnap=e.bearingSnap,this._pitchWithRotate=e.pitchWithRotate!==!1,util.bindAll(["_onDown","_onMove","_onUp"],this)};DragRotateHandler.prototype.isEnabled=function(){return!!this._enabled},DragRotateHandler.prototype.isActive=function(){return!!this._active},DragRotateHandler.prototype.enable=function(){this.isEnabled()||(this._el.addEventListener("mousedown",this._onDown),this._enabled=!0)},DragRotateHandler.prototype.disable=function(){this.isEnabled()&&(this._el.removeEventListener("mousedown",this._onDown),this._enabled=!1)},DragRotateHandler.prototype._onDown=function(t){this._ignoreEvent(t)||this.isActive()||(window.document.addEventListener("mousemove",this._onMove),window.document.addEventListener("mouseup",this._onUp),this._active=!1,this._inertia=[[Date.now(),this._map.getBearing()]],this._startPos=this._pos=DOM.mousePos(this._el,t),this._center=this._map.transform.centerPoint,t.preventDefault())},DragRotateHandler.prototype._onMove=function(t){if(!this._ignoreEvent(t)){this.isActive()||(this._active=!0,this._fireEvent("rotatestart",t),this._fireEvent("movestart",t));var e=this._map;e.stop();var i=this._pos,n=DOM.mousePos(this._el,t),r=.8*(i.x-n.x),a=(i.y-n.y)*-.5,o=e.getBearing()-r,s=e.getPitch()-a,h=this._inertia,_=h[h.length-1];this._drainInertiaBuffer(),h.push([Date.now(),e._normalizeBearing(o,_[1])]),e.transform.bearing=o,this._pitchWithRotate&&(e.transform.pitch=s),this._fireEvent("rotate",t),this._fireEvent("move",t),this._pos=n}},DragRotateHandler.prototype._onUp=function(t){var e=this;if(!this._ignoreEvent(t)&&(window.document.removeEventListener("mousemove",this._onMove),window.document.removeEventListener("mouseup",this._onUp),this.isActive())){this._active=!1,this._fireEvent("rotateend",t),this._drainInertiaBuffer();var i=this._map,n=i.getBearing(),r=this._inertia,a=function(){Math.abs(n)<e._bearingSnap?i.resetNorth({noMoveStart:!0},{originalEvent:t}):e._fireEvent("moveend",t)};if(r.length<2)return void a();var o=r[0],s=r[r.length-1],h=r[r.length-2],_=i._normalizeBearing(n,h[1]),v=s[1]-o[1],u=v<0?-1:1,d=(s[0]-o[0])/1e3;if(0===v||0===d)return void a();var l=Math.abs(v*(inertiaLinearity/d));l>inertiaMaxSpeed&&(l=inertiaMaxSpeed);var p=l/(inertiaDeceleration*inertiaLinearity),g=u*l*(p/2);_+=g,Math.abs(i._normalizeBearing(_,0))<this._bearingSnap&&(_=i._normalizeBearing(0,_)),i.rotateTo(_,{duration:1e3*p,easing:inertiaEasing,noMoveStart:!0},{originalEvent:t})}},DragRotateHandler.prototype._fireEvent=function(t,e){return this._map.fire(t,{originalEvent:e})},DragRotateHandler.prototype._ignoreEvent=function(t){var e=this._map;if(e.boxZoom&&e.boxZoom.isActive())return!0;if(e.dragPan&&e.dragPan.isActive())return!0;if(t.touches)return t.touches.length>1;var i=t.ctrlKey?1:2,n=t.ctrlKey?0:2;return"mousemove"===t.type?t.buttons&0===i:t.button!==n},DragRotateHandler.prototype._drainInertiaBuffer=function(){for(var t=this._inertia,e=Date.now(),i=160;t.length>0&&e-t[0][0]>i;)t.shift()},module.exports=DragRotateHandler;
	},{"../../util/dom":114,"../../util/util":126,"../../util/window":109}],98:[function(require,module,exports){
	"use strict";function easeOut(e){return e*(2-e)}var panStep=100,bearingStep=15,pitchStep=10,KeyboardHandler=function(e){this._map=e,this._el=e.getCanvasContainer(),this._onKeyDown=this._onKeyDown.bind(this)};KeyboardHandler.prototype.isEnabled=function(){return!!this._enabled},KeyboardHandler.prototype.enable=function(){this.isEnabled()||(this._el.addEventListener("keydown",this._onKeyDown,!1),this._enabled=!0)},KeyboardHandler.prototype.disable=function(){this.isEnabled()&&(this._el.removeEventListener("keydown",this._onKeyDown),this._enabled=!1)},KeyboardHandler.prototype._onKeyDown=function(e){if(!(e.altKey||e.ctrlKey||e.metaKey)){var t=0,n=0,a=0,i=0,r=0;switch(e.keyCode){case 61:case 107:case 171:case 187:t=1;break;case 189:case 109:case 173:t=-1;break;case 37:e.shiftKey?n=-1:(e.preventDefault(),i=-1);break;case 39:e.shiftKey?n=1:(e.preventDefault(),i=1);break;case 38:e.shiftKey?a=1:(e.preventDefault(),r=-1);break;case 40:e.shiftKey?a=-1:(r=1,e.preventDefault())}var s=this._map,o=s.getZoom(),d={duration:300,delayEndEvents:500,easing:easeOut,zoom:t?Math.round(o)+t*(e.shiftKey?2:1):o,bearing:s.getBearing()+n*bearingStep,pitch:s.getPitch()+a*pitchStep,offset:[-i*panStep,-r*panStep],center:s.getCenter()};s.easeTo(d,{originalEvent:e})}},module.exports=KeyboardHandler;
	},{}],99:[function(require,module,exports){
	"use strict";var DOM=require("../../util/dom"),util=require("../../util/util"),browser=require("../../util/browser"),window=require("../../util/window"),ua=window.navigator.userAgent.toLowerCase(),firefox=ua.indexOf("firefox")!==-1,safari=ua.indexOf("safari")!==-1&&ua.indexOf("chrom")===-1,ScrollZoomHandler=function(e){this._map=e,this._el=e.getCanvasContainer(),util.bindAll(["_onWheel","_onTimeout"],this)};ScrollZoomHandler.prototype.isEnabled=function(){return!!this._enabled},ScrollZoomHandler.prototype.enable=function(){this.isEnabled()||(this._el.addEventListener("wheel",this._onWheel,!1),this._el.addEventListener("mousewheel",this._onWheel,!1),this._enabled=!0)},ScrollZoomHandler.prototype.disable=function(){this.isEnabled()&&(this._el.removeEventListener("wheel",this._onWheel),this._el.removeEventListener("mousewheel",this._onWheel),this._enabled=!1)},ScrollZoomHandler.prototype._onWheel=function(e){var t;"wheel"===e.type?(t=e.deltaY,firefox&&e.deltaMode===window.WheelEvent.DOM_DELTA_PIXEL&&(t/=browser.devicePixelRatio),e.deltaMode===window.WheelEvent.DOM_DELTA_LINE&&(t*=40)):"mousewheel"===e.type&&(t=-e.wheelDeltaY,safari&&(t/=3));var o=browser.now(),i=o-(this._time||0);this._pos=DOM.mousePos(this._el,e),this._time=o,0!==t&&t%4.000244140625===0?this._type="wheel":0!==t&&Math.abs(t)<4?this._type="trackpad":i>400?(this._type=null,this._lastValue=t,this._timeout=setTimeout(this._onTimeout,40)):this._type||(this._type=Math.abs(i*t)<200?"trackpad":"wheel",this._timeout&&(clearTimeout(this._timeout),this._timeout=null,t+=this._lastValue)),e.shiftKey&&t&&(t/=4),this._type&&this._zoom(-t,e),e.preventDefault()},ScrollZoomHandler.prototype._onTimeout=function(){this._type="wheel",this._zoom(-this._lastValue)},ScrollZoomHandler.prototype._zoom=function(e,t){if(0!==e){var o=this._map,i=2/(1+Math.exp(-Math.abs(e/100)));e<0&&0!==i&&(i=1/i);var l=o.ease?o.ease.to:o.transform.scale,s=o.transform.scaleZoom(l*i);o.zoomTo(s,{duration:"wheel"===this._type?200:0,around:o.unproject(this._pos),delayEndEvents:200,smoothEasing:!0},{originalEvent:t})}},module.exports=ScrollZoomHandler;
	},{"../../util/browser":107,"../../util/dom":114,"../../util/util":126,"../../util/window":109}],100:[function(require,module,exports){
	"use strict";var DOM=require("../../util/dom"),util=require("../../util/util"),window=require("../../util/window"),inertiaLinearity=.15,inertiaEasing=util.bezier(0,0,inertiaLinearity,1),inertiaDeceleration=12,inertiaMaxSpeed=2.5,significantScaleThreshold=.15,significantRotateThreshold=4,TouchZoomRotateHandler=function(t){this._map=t,this._el=t.getCanvasContainer(),util.bindAll(["_onStart","_onMove","_onEnd"],this)};TouchZoomRotateHandler.prototype.isEnabled=function(){return!!this._enabled},TouchZoomRotateHandler.prototype.enable=function(){this.isEnabled()||(this._el.addEventListener("touchstart",this._onStart,!1),this._enabled=!0)},TouchZoomRotateHandler.prototype.disable=function(){this.isEnabled()&&(this._el.removeEventListener("touchstart",this._onStart),this._enabled=!1)},TouchZoomRotateHandler.prototype.disableRotation=function(){this._rotationDisabled=!0},TouchZoomRotateHandler.prototype.enableRotation=function(){this._rotationDisabled=!1},TouchZoomRotateHandler.prototype._onStart=function(t){if(2===t.touches.length){var e=DOM.mousePos(this._el,t.touches[0]),i=DOM.mousePos(this._el,t.touches[1]);this._startVec=e.sub(i),this._startScale=this._map.transform.scale,this._startBearing=this._map.transform.bearing,this._gestureIntent=void 0,this._inertia=[],window.document.addEventListener("touchmove",this._onMove,!1),window.document.addEventListener("touchend",this._onEnd,!1)}},TouchZoomRotateHandler.prototype._onMove=function(t){if(2===t.touches.length){var e=DOM.mousePos(this._el,t.touches[0]),i=DOM.mousePos(this._el,t.touches[1]),o=e.add(i).div(2),n=e.sub(i),a=n.mag()/this._startVec.mag(),r=this._rotationDisabled?0:180*n.angleWith(this._startVec)/Math.PI,s=this._map;if(this._gestureIntent){var h={duration:0,around:s.unproject(o)};"rotate"===this._gestureIntent&&(h.bearing=this._startBearing+r),"zoom"!==this._gestureIntent&&"rotate"!==this._gestureIntent||(h.zoom=s.transform.scaleZoom(this._startScale*a)),s.stop(),this._drainInertiaBuffer(),this._inertia.push([Date.now(),a,o]),s.easeTo(h,{originalEvent:t})}else{var u=Math.abs(1-a)>significantScaleThreshold,l=Math.abs(r)>significantRotateThreshold;l?this._gestureIntent="rotate":u&&(this._gestureIntent="zoom"),this._gestureIntent&&(this._startVec=n,this._startScale=s.transform.scale,this._startBearing=s.transform.bearing)}t.preventDefault()}},TouchZoomRotateHandler.prototype._onEnd=function(t){window.document.removeEventListener("touchmove",this._onMove),window.document.removeEventListener("touchend",this._onEnd),this._drainInertiaBuffer();var e=this._inertia,i=this._map;if(e.length<2)return void i.snapToNorth({},{originalEvent:t});var o=e[e.length-1],n=e[0],a=i.transform.scaleZoom(this._startScale*o[1]),r=i.transform.scaleZoom(this._startScale*n[1]),s=a-r,h=(o[0]-n[0])/1e3,u=o[2];if(0===h||a===r)return void i.snapToNorth({},{originalEvent:t});var l=s*inertiaLinearity/h;Math.abs(l)>inertiaMaxSpeed&&(l=l>0?inertiaMaxSpeed:-inertiaMaxSpeed);var d=1e3*Math.abs(l/(inertiaDeceleration*inertiaLinearity)),c=a+l*d/2e3;c<0&&(c=0),i.easeTo({zoom:c,duration:d,easing:inertiaEasing,around:i.unproject(u)},{originalEvent:t})},TouchZoomRotateHandler.prototype._drainInertiaBuffer=function(){for(var t=this._inertia,e=Date.now(),i=160;t.length>2&&e-t[0][0]>i;)t.shift()},module.exports=TouchZoomRotateHandler;
	},{"../../util/dom":114,"../../util/util":126,"../../util/window":109}],101:[function(require,module,exports){
	"use strict";var util=require("../util/util"),window=require("../util/window"),Hash=function(){util.bindAll(["_onHashChange","_updateHash"],this)};Hash.prototype.addTo=function(t){return this._map=t,window.addEventListener("hashchange",this._onHashChange,!1),this._map.on("moveend",this._updateHash),this},Hash.prototype.remove=function(){return window.removeEventListener("hashchange",this._onHashChange,!1),this._map.off("moveend",this._updateHash),delete this._map,this},Hash.prototype._onHashChange=function(){var t=window.location.hash.replace("#","").split("/");return t.length>=3&&(this._map.jumpTo({center:[+t[2],+t[1]],zoom:+t[0],bearing:+(t[3]||0),pitch:+(t[4]||0)}),!0)},Hash.prototype._updateHash=function(){var t=this._map.getCenter(),e=this._map.getZoom(),a=this._map.getBearing(),h=this._map.getPitch(),i=Math.max(0,Math.ceil(Math.log(e)/Math.LN2)),n="#"+Math.round(100*e)/100+"/"+t.lat.toFixed(i)+"/"+t.lng.toFixed(i);(a||h)&&(n+="/"+Math.round(10*a)/10),h&&(n+="/"+Math.round(h)),window.history.replaceState("","",n)},module.exports=Hash;
	},{"../util/util":126,"../util/window":109}],102:[function(require,module,exports){
	"use strict";function removeNode(t){t.parentNode&&t.parentNode.removeChild(t)}var util=require("../util/util"),browser=require("../util/browser"),window=require("../util/window"),DOM=require("../util/dom"),Style=require("../style/style"),AnimationLoop=require("../style/animation_loop"),Painter=require("../render/painter"),Transform=require("../geo/transform"),Hash=require("./hash"),bindHandlers=require("./bind_handlers"),Camera=require("./camera"),LngLat=require("../geo/lng_lat"),LngLatBounds=require("../geo/lng_lat_bounds"),Point=require("point-geometry"),AttributionControl=require("./control/attribution_control"),isSupported=require("mapbox-gl-supported"),defaultMinZoom=0,defaultMaxZoom=20,defaultOptions={center:[0,0],zoom:0,bearing:0,pitch:0,minZoom:defaultMinZoom,maxZoom:defaultMaxZoom,interactive:!0,scrollZoom:!0,boxZoom:!0,dragRotate:!0,dragPan:!0,keyboard:!0,doubleClickZoom:!0,touchZoomRotate:!0,bearingSnap:7,hash:!1,attributionControl:!0,failIfMajorPerformanceCaveat:!1,preserveDrawingBuffer:!1,trackResize:!0},Map=function(t){function e(e){var o=this;e=util.extend({},defaultOptions,e);var i=new Transform(e.minZoom,e.maxZoom);t.call(this,i,e),this._interactive=e.interactive,this._failIfMajorPerformanceCaveat=e.failIfMajorPerformanceCaveat,this._preserveDrawingBuffer=e.preserveDrawingBuffer,this._trackResize=e.trackResize,this._bearingSnap=e.bearingSnap,"string"==typeof e.container?this._container=window.document.getElementById(e.container):this._container=e.container,this.animationLoop=new AnimationLoop,e.maxBounds&&this.setMaxBounds(e.maxBounds),util.bindAll(["_onWindowOnline","_onWindowResize","_contextLost","_contextRestored","_update","_render"],this),this._setupContainer(),this._setupPainter(),this.on("move",this._update.bind(this,!1)),this.on("zoom",this._update.bind(this,!0)),this.on("moveend",function(){o.animationLoop.set(300),o._rerender()}),"undefined"!=typeof window&&(window.addEventListener("online",this._onWindowOnline,!1),window.addEventListener("resize",this._onWindowResize,!1)),bindHandlers(this,e),this._hash=e.hash&&(new Hash).addTo(this),this._hash&&this._hash._onHashChange()||this.jumpTo({center:e.center,zoom:e.zoom,bearing:e.bearing,pitch:e.pitch}),this._classes=[],this.resize(),e.classes&&this.setClasses(e.classes),e.style&&this.setStyle(e.style),e.attributionControl&&this.addControl(new AttributionControl),this.on("style.load",function(){this.transform.unmodified&&this.jumpTo(this.style.stylesheet),this.style.update(this._classes,{transition:!1})}),this.on("data",function(t){"style"===t.dataType?this._update(!0):this._update()})}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e;var o={showTileBoundaries:{},showCollisionBoxes:{},showOverdrawInspector:{},repaint:{},vertices:{}};return e.prototype.addControl=function(t,e){void 0===e&&t.getDefaultPosition&&(e=t.getDefaultPosition()),void 0===e&&(e="top-right");var o=t.onAdd(this),i=this._controlPositions[e];return e.indexOf("bottom")!==-1?i.insertBefore(o,i.firstChild):i.appendChild(o),this},e.prototype.removeControl=function(t){return t.onRemove(this),this},e.prototype.addClass=function(t,e){return this._classes.indexOf(t)>=0||""===t?this:(this._classes.push(t),this._classOptions=e,this.style&&this.style.updateClasses(),this._update(!0))},e.prototype.removeClass=function(t,e){var o=this._classes.indexOf(t);return o<0||""===t?this:(this._classes.splice(o,1),this._classOptions=e,this.style&&this.style.updateClasses(),this._update(!0))},e.prototype.setClasses=function(t,e){for(var o={},i=0;i<t.length;i++)""!==t[i]&&(o[t[i]]=!0);return this._classes=Object.keys(o),this._classOptions=e,this.style&&this.style.updateClasses(),this._update(!0)},e.prototype.hasClass=function(t){return this._classes.indexOf(t)>=0},e.prototype.getClasses=function(){return this._classes},e.prototype.resize=function(){var t=this._containerDimensions(),e=t[0],o=t[1];return this._resizeCanvas(e,o),this.transform.resize(e,o),this.painter.resize(e,o),this.fire("movestart").fire("move").fire("resize").fire("moveend")},e.prototype.getBounds=function(){var t=new LngLatBounds(this.transform.pointLocation(new Point(0,this.transform.height)),this.transform.pointLocation(new Point(this.transform.width,0)));return(this.transform.angle||this.transform.pitch)&&(t.extend(this.transform.pointLocation(new Point(this.transform.size.x,0))),t.extend(this.transform.pointLocation(new Point(0,this.transform.size.y)))),t},e.prototype.setMaxBounds=function(t){if(t){var e=LngLatBounds.convert(t);this.transform.lngRange=[e.getWest(),e.getEast()],this.transform.latRange=[e.getSouth(),e.getNorth()],this.transform._constrain(),this._update()}else null!==t&&void 0!==t||(this.transform.lngRange=[],this.transform.latRange=[],this._update());return this},e.prototype.setMinZoom=function(t){if(t=null===t||void 0===t?defaultMinZoom:t,t>=defaultMinZoom&&t<=this.transform.maxZoom)return this.transform.minZoom=t,this._update(),this.getZoom()<t&&this.setZoom(t),this;throw new Error("minZoom must be between "+defaultMinZoom+" and the current maxZoom, inclusive")},e.prototype.getMinZoom=function(){return this.transform.minZoom},e.prototype.setMaxZoom=function(t){if(t=null===t||void 0===t?defaultMaxZoom:t,t>=this.transform.minZoom&&t<=defaultMaxZoom)return this.transform.maxZoom=t,this._update(),this.getZoom()>t&&this.setZoom(t),this;throw new Error("maxZoom must be between the current minZoom and "+defaultMaxZoom+", inclusive")},e.prototype.getMaxZoom=function(){return this.transform.maxZoom},e.prototype.project=function(t){return this.transform.locationPoint(LngLat.convert(t))},e.prototype.unproject=function(t){return this.transform.pointLocation(Point.convert(t))},e.prototype.queryRenderedFeatures=function(){function t(t){return t instanceof Point||Array.isArray(t)}var e,o={};return 2===arguments.length?(e=arguments[0],o=arguments[1]):1===arguments.length&&t(arguments[0])?e=arguments[0]:1===arguments.length&&(o=arguments[0]),this.style.queryRenderedFeatures(this._makeQueryGeometry(e),o,this.transform.zoom,this.transform.angle)},e.prototype._makeQueryGeometry=function(t){var e=this;void 0===t&&(t=[Point.convert([0,0]),Point.convert([this.transform.width,this.transform.height])]);var o,i=t instanceof Point||"number"==typeof t[0];if(i){var s=Point.convert(t);o=[s]}else{var r=[Point.convert(t[0]),Point.convert(t[1])];o=[r[0],new Point(r[1].x,r[0].y),r[1],new Point(r[0].x,r[1].y),r[0]]}return o=o.map(function(t){return e.transform.pointCoordinate(t)})},e.prototype.querySourceFeatures=function(t,e){return this.style.querySourceFeatures(t,e)},e.prototype.setStyle=function(t){return this.style&&(this.style.setEventedParent(null),this.style._remove(),this.off("rotate",this.style._redoPlacement),this.off("pitch",this.style._redoPlacement)),t?(t instanceof Style?this.style=t:this.style=new Style(t,this),this.style.setEventedParent(this,{style:this.style}),this.on("rotate",this.style._redoPlacement),this.on("pitch",this.style._redoPlacement),this):(this.style=null,this)},e.prototype.getStyle=function(){if(this.style)return this.style.serialize()},e.prototype.addSource=function(t,e){return this.style.addSource(t,e),this._update(!0),this},e.prototype.addSourceType=function(t,e,o){return this.style.addSourceType(t,e,o)},e.prototype.removeSource=function(t){return this.style.removeSource(t),this._update(!0),this},e.prototype.getSource=function(t){return this.style.getSource(t)},e.prototype.addLayer=function(t,e){return this.style.addLayer(t,e),this._update(!0),this},e.prototype.moveLayer=function(t,e){return this.style.moveLayer(t,e),this._update(!0),this},e.prototype.removeLayer=function(t){return this.style.removeLayer(t),this._update(!0),this},e.prototype.getLayer=function(t){return this.style.getLayer(t)},e.prototype.setFilter=function(t,e){return this.style.setFilter(t,e),this._update(!0),this},e.prototype.setLayerZoomRange=function(t,e,o){return this.style.setLayerZoomRange(t,e,o),this._update(!0),this},e.prototype.getFilter=function(t){return this.style.getFilter(t)},e.prototype.setPaintProperty=function(t,e,o,i){return this.style.setPaintProperty(t,e,o,i),this._update(!0),this},e.prototype.getPaintProperty=function(t,e,o){return this.style.getPaintProperty(t,e,o)},e.prototype.setLayoutProperty=function(t,e,o){return this.style.setLayoutProperty(t,e,o),this._update(!0),this},e.prototype.getLayoutProperty=function(t,e){return this.style.getLayoutProperty(t,e)},e.prototype.setLight=function(t){return this.style.setLight(t),this._update(!0),this},e.prototype.getLight=function(){return this.style.getLight()},e.prototype.getContainer=function(){return this._container},e.prototype.getCanvasContainer=function(){return this._canvasContainer},e.prototype.getCanvas=function(){return this._canvas},e.prototype._containerDimensions=function(){var t=0,e=0;return this._container&&(t=this._container.offsetWidth||400,e=this._container.offsetHeight||300),[t,e]},e.prototype._setupContainer=function(){var t=this._container;t.classList.add("mapboxgl-map");var e=this._canvasContainer=DOM.create("div","mapboxgl-canvas-container",t);this._interactive&&e.classList.add("mapboxgl-interactive"),this._canvas=DOM.create("canvas","mapboxgl-canvas",e),this._canvas.style.position="absolute",this._canvas.addEventListener("webglcontextlost",this._contextLost,!1),this._canvas.addEventListener("webglcontextrestored",this._contextRestored,!1),this._canvas.setAttribute("tabindex",0);var o=this._containerDimensions();this._resizeCanvas(o[0],o[1]);var i=this._controlContainer=DOM.create("div","mapboxgl-control-container",t),s=this._controlPositions={};["top-left","top-right","bottom-left","bottom-right"].forEach(function(t){s[t]=DOM.create("div","mapboxgl-ctrl-"+t,i)})},e.prototype._resizeCanvas=function(t,e){var o=window.devicePixelRatio||1;this._canvas.width=o*t,this._canvas.height=o*e,this._canvas.style.width=t+"px",this._canvas.style.height=e+"px"},e.prototype._setupPainter=function(){var t=util.extend({failIfMajorPerformanceCaveat:this._failIfMajorPerformanceCaveat,preserveDrawingBuffer:this._preserveDrawingBuffer},isSupported.webGLContextAttributes),e=this._canvas.getContext("webgl",t)||this._canvas.getContext("experimental-webgl",t);return e?void(this.painter=new Painter(e,this.transform)):void this.fire("error",{error:new Error("Failed to initialize WebGL")})},e.prototype._contextLost=function(t){t.preventDefault(),this._frameId&&browser.cancelFrame(this._frameId),this.fire("webglcontextlost",{originalEvent:t})},e.prototype._contextRestored=function(t){this._setupPainter(),this.resize(),this._update(),this.fire("webglcontextrestored",{originalEvent:t})},e.prototype.loaded=function(){return!this._styleDirty&&!this._sourcesDirty&&!(!this.style||!this.style.loaded())},e.prototype._update=function(t){return this.style?(this._styleDirty=this._styleDirty||t,this._sourcesDirty=!0,this._rerender(),this):this},e.prototype._render=function(){return this.style&&this._styleDirty&&(this._styleDirty=!1,this.style.update(this._classes,this._classOptions),this._classOptions=null,this.style._recalculate(this.transform.zoom)),this.style&&this._sourcesDirty&&(this._sourcesDirty=!1,this.style._updateSources(this.transform)),this.painter.render(this.style,{showTileBoundaries:this.showTileBoundaries,showOverdrawInspector:this._showOverdrawInspector,rotating:this.rotating,zooming:this.zooming}),this.fire("render"),this.loaded()&&!this._loaded&&(this._loaded=!0,this.fire("load")),this._frameId=null,this.animationLoop.stopped()||(this._styleDirty=!0),(this._sourcesDirty||this._repaint||this._styleDirty)&&this._rerender(),this},e.prototype.remove=function(){this._hash&&this._hash.remove(),browser.cancelFrame(this._frameId),this.setStyle(null),"undefined"!=typeof window&&window.removeEventListener("resize",this._onWindowResize,!1);var t=this.painter.gl.getExtension("WEBGL_lose_context");t&&t.loseContext(),removeNode(this._canvasContainer),removeNode(this._controlContainer),this._container.classList.remove("mapboxgl-map"),this.fire("remove")},e.prototype._rerender=function(){this.style&&!this._frameId&&(this._frameId=browser.frame(this._render))},e.prototype._onWindowOnline=function(){this._update()},e.prototype._onWindowResize=function(){this._trackResize&&this.stop().resize()._update()},o.showTileBoundaries.get=function(){return!!this._showTileBoundaries},o.showTileBoundaries.set=function(t){this._showTileBoundaries!==t&&(this._showTileBoundaries=t,this._update())},o.showCollisionBoxes.get=function(){return!!this._showCollisionBoxes},o.showCollisionBoxes.set=function(t){this._showCollisionBoxes!==t&&(this._showCollisionBoxes=t,this.style._redoPlacement())},o.showOverdrawInspector.get=function(){return!!this._showOverdrawInspector},o.showOverdrawInspector.set=function(t){this._showOverdrawInspector!==t&&(this._showOverdrawInspector=t,this._update())},o.repaint.get=function(){return!!this._repaint},o.repaint.set=function(t){this._repaint=t,this._update()},o.vertices.get=function(){return!!this._vertices},o.vertices.set=function(t){this._vertices=t,this._update()},Object.defineProperties(e.prototype,o),e}(Camera);module.exports=Map;
	},{"../geo/lng_lat":19,"../geo/lng_lat_bounds":20,"../geo/transform":21,"../render/painter":36,"../style/animation_loop":56,"../style/style":60,"../util/browser":107,"../util/dom":114,"../util/util":126,"../util/window":109,"./bind_handlers":88,"./camera":89,"./control/attribution_control":90,"./hash":101,"mapbox-gl-supported":191,"point-geometry":195}],103:[function(require,module,exports){
	"use strict";var DOM=require("../util/dom"),util=require("../util/util"),LngLat=require("../geo/lng_lat"),Point=require("point-geometry"),Popup=require("./popup"),Marker=function(t,e){this._offset=Point.convert(e&&e.offset||[0,0]),this._update=this._update.bind(this),this._onMapClick=this._onMapClick.bind(this),t||(t=DOM.create("div")),t.classList.add("mapboxgl-marker"),this._element=t,this._popup=null};Marker.prototype.addTo=function(t){return this.remove(),this._map=t,t.getCanvasContainer().appendChild(this._element),t.on("move",this._update),t.on("moveend",this._update),this._update(),this._map.on("click",this._onMapClick),this},Marker.prototype.remove=function(){return this._map&&(this._map.off("click",this._onMapClick),this._map.off("move",this._update),this._map.off("moveend",this._update),this._map=null),DOM.remove(this._element),this._popup&&this._popup.remove(),this},Marker.prototype.getLngLat=function(){return this._lngLat},Marker.prototype.setLngLat=function(t){return this._lngLat=LngLat.convert(t),this._popup&&this._popup.setLngLat(this._lngLat),this._update(),this},Marker.prototype.getElement=function(){return this._element},Marker.prototype.setPopup=function(t){return this._popup&&(this._popup.remove(),this._popup=null),t&&(this._popup=t,this._popup.setLngLat(this._lngLat)),this},Marker.prototype._onMapClick=function(t){var e=t.originalEvent.target,p=this._element;this._popup&&(e===p||p.contains(e))&&this.togglePopup()},Marker.prototype.getPopup=function(){return this._popup},Marker.prototype.togglePopup=function(){var t=this._popup;t&&(t.isOpen()?t.remove():t.addTo(this._map))},Marker.prototype._update=function(t){if(this._map){var e=this._map.project(this._lngLat)._add(this._offset);t&&"moveend"!==t.type||(e=e.round()),DOM.setTransform(this._element,"translate("+e.x+"px,"+e.y+"px)")}},module.exports=Marker;
	},{"../geo/lng_lat":19,"../util/dom":114,"../util/util":126,"./popup":104,"point-geometry":195}],104:[function(require,module,exports){
	"use strict";function normalizeOffset(t){if(t){if("number"==typeof t){var o=Math.round(Math.sqrt(.5*Math.pow(t,2)));return{top:new Point(0,t),"top-left":new Point(o,o),"top-right":new Point(-o,o),bottom:new Point(0,-t),"bottom-left":new Point(o,-o),"bottom-right":new Point(-o,-o),left:new Point(t,0),right:new Point(-t,0)}}if(isPointLike(t)){var e=Point.convert(t);return{top:e,"top-left":e,"top-right":e,bottom:e,"bottom-left":e,"bottom-right":e,left:e,right:e}}return{top:Point.convert(t.top),"top-left":Point.convert(t["top-left"]),"top-right":Point.convert(t["top-right"]),bottom:Point.convert(t.bottom),"bottom-left":Point.convert(t["bottom-left"]),"bottom-right":Point.convert(t["bottom-right"]),left:Point.convert(t.left),right:Point.convert(t.right)}}return normalizeOffset(new Point(0,0))}function isPointLike(t){return t instanceof Point||Array.isArray(t)}var util=require("../util/util"),Evented=require("../util/evented"),DOM=require("../util/dom"),LngLat=require("../geo/lng_lat"),Point=require("point-geometry"),window=require("../util/window"),defaultOptions={closeButton:!0,closeOnClick:!0},Popup=function(t){function o(o){t.call(this),this.options=util.extend(Object.create(defaultOptions),o),util.bindAll(["_update","_onClickClose"],this)}return t&&(o.__proto__=t),o.prototype=Object.create(t&&t.prototype),o.prototype.constructor=o,o.prototype.addTo=function(t){return this._map=t,this._map.on("move",this._update),this.options.closeOnClick&&this._map.on("click",this._onClickClose),this._update(),this},o.prototype.isOpen=function(){return!!this._map},o.prototype.remove=function(){return this._content&&this._content.parentNode&&this._content.parentNode.removeChild(this._content),this._container&&(this._container.parentNode.removeChild(this._container),delete this._container),this._map&&(this._map.off("move",this._update),this._map.off("click",this._onClickClose),delete this._map),this.fire("close"),this},o.prototype.getLngLat=function(){return this._lngLat},o.prototype.setLngLat=function(t){return this._lngLat=LngLat.convert(t),this._update(),this},o.prototype.setText=function(t){return this.setDOMContent(window.document.createTextNode(t))},o.prototype.setHTML=function(t){var o,e=window.document.createDocumentFragment(),n=window.document.createElement("body");for(n.innerHTML=t;;){if(o=n.firstChild,!o)break;e.appendChild(o)}return this.setDOMContent(e)},o.prototype.setDOMContent=function(t){return this._createContent(),this._content.appendChild(t),this._update(),this},o.prototype._createContent=function(){this._content&&this._content.parentNode&&this._content.parentNode.removeChild(this._content),this._content=DOM.create("div","mapboxgl-popup-content",this._container),this.options.closeButton&&(this._closeButton=DOM.create("button","mapboxgl-popup-close-button",this._content),this._closeButton.type="button",this._closeButton.innerHTML="&#215;",this._closeButton.addEventListener("click",this._onClickClose))},o.prototype._update=function(){if(this._map&&this._lngLat&&this._content){this._container||(this._container=DOM.create("div","mapboxgl-popup",this._map.getContainer()),this._tip=DOM.create("div","mapboxgl-popup-tip",this._container),this._container.appendChild(this._content));var t=this.options.anchor,o=normalizeOffset(this.options.offset),e=this._map.project(this._lngLat).round();if(!t){var n=this._container.offsetWidth,i=this._container.offsetHeight;t=e.y+o.bottom.y<i?["top"]:e.y>this._map.transform.height-i?["bottom"]:[],e.x<n/2?t.push("left"):e.x>this._map.transform.width-n/2&&t.push("right"),t=0===t.length?"bottom":t.join("-")}var r=e.add(o[t]),s={top:"translate(-50%,0)","top-left":"translate(0,0)","top-right":"translate(-100%,0)",bottom:"translate(-50%,-100%)","bottom-left":"translate(0,-100%)","bottom-right":"translate(-100%,-100%)",left:"translate(0,-50%)",right:"translate(-100%,-50%)"},p=this._container.classList;for(var a in s)p.remove("mapboxgl-popup-anchor-"+a);p.add("mapboxgl-popup-anchor-"+t),DOM.setTransform(this._container,s[t]+" translate("+r.x+"px,"+r.y+"px)")}},o.prototype._onClickClose=function(){this.remove()},o}(Evented);module.exports=Popup;
	},{"../geo/lng_lat":19,"../util/dom":114,"../util/evented":115,"../util/util":126,"../util/window":109,"point-geometry":195}],105:[function(require,module,exports){
	"use strict";var Actor=function(t,e,a){this.target=t,this.parent=e,this.mapId=a,this.callbacks={},this.callbackID=0,this.receive=this.receive.bind(this),this.target.addEventListener("message",this.receive,!1)};Actor.prototype.send=function(t,e,a,r,s){var i=a?this.mapId+":"+this.callbackID++:null;a&&(this.callbacks[i]=a),this.target.postMessage({targetMapId:s,sourceMapId:this.mapId,type:t,id:String(i),data:e},r)},Actor.prototype.receive=function(t){var e,a=this,r=t.data,s=r.id;if(!r.targetMapId||this.mapId===r.targetMapId){var i=function(t,e,r){a.target.postMessage({sourceMapId:a.mapId,type:"<response>",id:String(s),error:t?String(t):null,data:e},r)};if("<response>"===r.type)e=this.callbacks[r.id],delete this.callbacks[r.id],e&&e(r.error||null,r.data);else if("undefined"!=typeof r.id&&this.parent[r.type])this.parent[r.type](r.sourceMapId,r.data,i);else if("undefined"!=typeof r.id&&this.parent.getWorkerSource){var p=r.type.split("."),d=this.parent.getWorkerSource(r.sourceMapId,p[0]);d[p[1]](r.data,i)}else this.parent[r.type](r.data)}},Actor.prototype.remove=function(){this.target.removeEventListener("message",this.receive,!1)},module.exports=Actor;
	},{}],106:[function(require,module,exports){
	"use strict";function sameOrigin(e){var n=window.document.createElement("a");return n.href=e,n.protocol===window.document.location.protocol&&n.host===window.document.location.host}var window=require("./window");exports.getJSON=function(e,n){var t=new window.XMLHttpRequest;return t.open("GET",e,!0),t.setRequestHeader("Accept","application/json"),t.onerror=function(e){n(e)},t.onload=function(){if(t.status>=200&&t.status<300&&t.response){var e;try{e=JSON.parse(t.response)}catch(e){return n(e)}n(null,e)}else n(new Error(t.statusText))},t.send(),t},exports.getArrayBuffer=function(e,n){var t=new window.XMLHttpRequest;return t.open("GET",e,!0),t.responseType="arraybuffer",t.onerror=function(e){n(e)},t.onload=function(){return 0===t.response.byteLength&&200===t.status?n(new Error("http status 200 returned without content.")):void(t.status>=200&&t.status<300&&t.response?n(null,t.response):n(new Error(t.statusText)))},t.send(),t};var transparentPngUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=";exports.getImage=function(e,n){return exports.getArrayBuffer(e,function(t,r){if(t)return n(t);var o=new window.Image;o.onload=function(){return n(null,o)},sameOrigin(e)||(o.crossOrigin="Anonymous"),o.src=r.byteLength?e:transparentPngUrl})},exports.getVideo=function(e,n){var t=window.document.createElement("video");t.onloadstart=function(){n(null,t)};for(var r=0;r<e.length;r++){var o=window.document.createElement("source");sameOrigin(e[r])||(t.crossOrigin="Anonymous"),o.src=e[r],t.appendChild(o)}return t};
	},{"./window":109}],107:[function(require,module,exports){
	"use strict";var window=require("./window");module.exports.now=function(){return window.performance&&window.performance.now?window.performance.now.bind(window.performance):Date.now.bind(Date)}();var frame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;exports.frame=function(e){return frame(e)};var cancel=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame;exports.cancelFrame=function(e){cancel(e)},exports.timed=function(e,n,t){function o(i){r||(i=module.exports.now(),i>=a+n?e.call(t,1):(e.call(t,(i-a)/n),exports.frame(o)))}if(!n)return e.call(t,1),null;var r=!1,a=module.exports.now();return exports.frame(o),function(){r=!0}},exports.getImageData=function(e){var n=window.document.createElement("canvas"),t=n.getContext("2d");return n.width=e.width,n.height=e.height,t.drawImage(e,0,0),t.getImageData(0,0,e.width,e.height).data},exports.supported=require("mapbox-gl-supported"),exports.hardwareConcurrency=window.navigator.hardwareConcurrency||4,Object.defineProperty(exports,"devicePixelRatio",{get:function(){return window.devicePixelRatio}}),exports.supportsWebp=!1;var webpImgTest=window.document.createElement("img");webpImgTest.onload=function(){exports.supportsWebp=!0},webpImgTest.src="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=";
	},{"./window":109,"mapbox-gl-supported":191}],108:[function(require,module,exports){
	"use strict";var WebWorkify=require("webworkify"),window=require("../window"),workerURL=window.URL.createObjectURL(new WebWorkify(require("../../source/worker"),{bare:!0}));module.exports=function(){return new window.Worker(workerURL)};
	},{"../../source/worker":54,"../window":109,"webworkify":212}],109:[function(require,module,exports){
	"use strict";module.exports=self;
	},{}],110:[function(require,module,exports){
	"use strict";function compareAreas(e,r){return r.area-e.area}var quickselect=require("quickselect"),calculateSignedArea=require("./util").calculateSignedArea;module.exports=function(e,r){var a=e.length;if(a<=1)return[e];for(var t,u,c=[],i=0;i<a;i++){var l=calculateSignedArea(e[i]);0!==l&&(e[i].area=Math.abs(l),void 0===u&&(u=l<0),u===l<0?(t&&c.push(t),t=[e[i]]):t.push(e[i]))}if(t&&c.push(t),r>1)for(var n=0;n<c.length;n++)c[n].length<=r||(quickselect(c[n],r,1,c[n].length-1,compareAreas),c[n]=c[n].slice(0,r));return c};
	},{"./util":126,"quickselect":196}],111:[function(require,module,exports){
	"use strict";module.exports={API_URL:"https://api.mapbox.com",REQUIRE_ACCESS_TOKEN:!0};
	},{}],112:[function(require,module,exports){
	"use strict";var DictionaryCoder=function(r){var t=this;this._stringToNumber={},this._numberToString=[];for(var o=0;o<r.length;o++){var i=r[o];t._stringToNumber[i]=o,t._numberToString[o]=i}};DictionaryCoder.prototype.encode=function(r){return this._stringToNumber[r]},DictionaryCoder.prototype.decode=function(r){return this._numberToString[r]},module.exports=DictionaryCoder;
	},{}],113:[function(require,module,exports){
	"use strict";var util=require("./util"),Actor=require("./actor"),Dispatcher=function(t,r){var o=this;this.workerPool=t,this.actors=[],this.currentActor=0,this.id=util.uniqueId();for(var i=this.workerPool.acquire(this.id),e=0;e<i.length;e++){var s=i[e],c=new Actor(s,r,o.id);c.name="Worker "+e,o.actors.push(c)}};Dispatcher.prototype.broadcast=function(t,r,o){o=o||function(){},util.asyncAll(this.actors,function(o,i){o.send(t,r,i)},o)},Dispatcher.prototype.send=function(t,r,o,i,e){return("number"!=typeof i||isNaN(i))&&(i=this.currentActor=(this.currentActor+1)%this.actors.length),this.actors[i].send(t,r,o,e),i},Dispatcher.prototype.remove=function(){this.actors.forEach(function(t){t.remove()}),this.actors=[],this.workerPool.release(this.id)},module.exports=Dispatcher;
	},{"./actor":105,"./util":126}],114:[function(require,module,exports){
	"use strict";function testProp(e){for(var t=0;t<e.length;t++)if(e[t]in docStyle)return e[t];return e[0]}function suppressClick(e){e.preventDefault(),e.stopPropagation(),window.removeEventListener("click",suppressClick,!0)}var Point=require("point-geometry"),window=require("./window");exports.create=function(e,t,o){var n=window.document.createElement(e);return t&&(n.className=t),o&&o.appendChild(n),n};var docStyle=window.document.documentElement.style,selectProp=testProp(["userSelect","MozUserSelect","WebkitUserSelect","msUserSelect"]),userSelect;exports.disableDrag=function(){selectProp&&(userSelect=docStyle[selectProp],docStyle[selectProp]="none")},exports.enableDrag=function(){selectProp&&(docStyle[selectProp]=userSelect)};var transformProp=testProp(["transform","WebkitTransform"]);exports.setTransform=function(e,t){e.style[transformProp]=t},exports.suppressClick=function(){window.addEventListener("click",suppressClick,!0),window.setTimeout(function(){window.removeEventListener("click",suppressClick,!0)},0)},exports.mousePos=function(e,t){var o=e.getBoundingClientRect();return t=t.touches?t.touches[0]:t,new Point(t.clientX-o.left-e.clientLeft,t.clientY-o.top-e.clientTop)},exports.touchPos=function(e,t){for(var o=e.getBoundingClientRect(),n=[],r="touchend"===t.type?t.changedTouches:t.touches,s=0;s<r.length;s++)n.push(new Point(r[s].clientX-o.left-e.clientLeft,r[s].clientY-o.top-e.clientTop));return n},exports.remove=function(e){e.parentNode&&e.parentNode.removeChild(e)};
	},{"./window":109,"point-geometry":195}],115:[function(require,module,exports){
	"use strict";var util=require("./util"),Evented=function(){};Evented.prototype.on=function(e,t){return this._listeners=this._listeners||{},this._listeners[e]=this._listeners[e]||[],this._listeners[e].push(t),this},Evented.prototype.off=function(e,t){if(this._listeners&&this._listeners[e]){var s=this._listeners[e].indexOf(t);s!==-1&&this._listeners[e].splice(s,1)}return this},Evented.prototype.once=function(e,t){var s=this,n=function(i){s.off(e,n),t.call(s,i)};return this.on(e,n),this},Evented.prototype.fire=function(e,t){var s=this;if(this.listens(e)){t=util.extend({},t,{type:e,target:this});for(var n=this._listeners&&this._listeners[e]?this._listeners[e].slice():[],i=0;i<n.length;i++)n[i].call(s,t);this._eventedParent&&this._eventedParent.fire(e,util.extend({},t,this._eventedParentData))}else util.endsWith(e,"error")&&console.error(t&&t.error||t||"Empty error event");return this},Evented.prototype.listens=function(e){return this._listeners&&this._listeners[e]||this._eventedParent&&this._eventedParent.listens(e)},Evented.prototype.setEventedParent=function(e,t){return this._eventedParent=e,this._eventedParentData=t,this},module.exports=Evented;
	},{"./util":126}],116:[function(require,module,exports){
	"use strict";function compareMax(e,t){return t.max-e.max}function Cell(e,t,n,r){this.p=new Point(e,t),this.h=n,this.d=pointToPolygonDist(this.p,r),this.max=this.d+this.h*Math.SQRT2}function pointToPolygonDist(e,t){for(var n=!1,r=1/0,o=0;o<t.length;o++)for(var l=t[o],i=0,s=l.length,u=s-1;i<s;u=i++){var a=l[i],h=l[u];a.y>e.y!=h.y>e.y&&e.x<(h.x-a.x)*(e.y-a.y)/(h.y-a.y)+a.x&&(n=!n),r=Math.min(r,distToSegmentSquared(e,a,h))}return(n?1:-1)*Math.sqrt(r)}function getCentroidCell(e){for(var t=0,n=0,r=0,o=e[0],l=0,i=o.length,s=i-1;l<i;s=l++){var u=o[l],a=o[s],h=u.x*a.y-a.x*u.y;n+=(u.x+a.x)*h,r+=(u.y+a.y)*h,t+=3*h}return new Cell(n/t,r/t,0,e)}var Queue=require("tinyqueue"),Point=require("point-geometry"),distToSegmentSquared=require("./intersection_tests").distToSegmentSquared;module.exports=function(e,t,n){t=t||1;for(var r,o,l,i,s=e[0],u=0;u<s.length;u++){var a=s[u];(!u||a.x<r)&&(r=a.x),(!u||a.y<o)&&(o=a.y),(!u||a.x>l)&&(l=a.x),(!u||a.y>i)&&(i=a.y)}for(var h=l-r,p=i-o,y=Math.min(h,p),x=y/2,d=new Queue(null,compareMax),g=r;g<l;g+=y)for(var f=o;f<i;f+=y)d.push(new Cell(g+x,f+x,x,e));for(var m=getCentroidCell(e),c=d.length;d.length;){var v=d.pop();v.d>m.d&&(m=v,n&&console.log("found best %d after %d probes",Math.round(1e4*v.d)/1e4,c)),v.max-m.d<=t||(x=v.h/2,d.push(new Cell(v.p.x-x,v.p.y-x,x,e)),d.push(new Cell(v.p.x+x,v.p.y-x,x,e)),d.push(new Cell(v.p.x-x,v.p.y+x,x,e)),d.push(new Cell(v.p.x+x,v.p.y+x,x,e)),c+=4)}return n&&(console.log("num probes: "+c),console.log("best distance: "+m.d)),m.p};
	},{"./intersection_tests":119,"point-geometry":195,"tinyqueue":203}],117:[function(require,module,exports){
	"use strict";function Glyphs(a,e){this.stacks=a.readFields(readFontstacks,[],e)}function readFontstacks(a,e,r){if(1===a){var t=r.readMessage(readFontstack,{glyphs:{}});e.push(t)}}function readFontstack(a,e,r){if(1===a)e.name=r.readString();else if(2===a)e.range=r.readString();else if(3===a){var t=r.readMessage(readGlyph,{});e.glyphs[t.id]=t}}function readGlyph(a,e,r){1===a?e.id=r.readVarint():2===a?e.bitmap=r.readBytes():3===a?e.width=r.readVarint():4===a?e.height=r.readVarint():5===a?e.left=r.readSVarint():6===a?e.top=r.readSVarint():7===a&&(e.advance=r.readVarint())}module.exports=Glyphs;
	},{}],118:[function(require,module,exports){
	"use strict";function interpolate(t,e,n){return t*(1-n)+e*n}module.exports=interpolate,interpolate.number=interpolate,interpolate.vec2=function(t,e,n){return[interpolate(t[0],e[0],n),interpolate(t[1],e[1],n)]},interpolate.color=function(t,e,n){return[interpolate(t[0],e[0],n),interpolate(t[1],e[1],n),interpolate(t[2],e[2],n),interpolate(t[3],e[3],n)]},interpolate.array=function(t,e,n){return t.map(function(t,r){return interpolate(t,e[r],n)})};
	},{}],119:[function(require,module,exports){
	"use strict";function polygonIntersectsPolygon(n,t){for(var e=0;e<n.length;e++)if(polygonContainsPoint(t,n[e]))return!0;for(var r=0;r<t.length;r++)if(polygonContainsPoint(n,t[r]))return!0;return!!lineIntersectsLine(n,t)}function multiPolygonIntersectsBufferedMultiPoint(n,t,e){for(var r=0;r<n.length;r++)for(var o=n[r],i=0;i<t.length;i++)for(var l=t[i],u=0;u<l.length;u++){var s=l[u];if(polygonContainsPoint(o,s))return!0;if(pointIntersectsBufferedLine(s,o,e))return!0}return!1}function multiPolygonIntersectsMultiPolygon(n,t){if(1===n.length&&1===n[0].length)return multiPolygonContainsPoint(t,n[0][0]);for(var e=0;e<t.length;e++)for(var r=t[e],o=0;o<r.length;o++)if(multiPolygonContainsPoint(n,r[o]))return!0;for(var i=0;i<n.length;i++){for(var l=n[i],u=0;u<l.length;u++)if(multiPolygonContainsPoint(t,l[u]))return!0;for(var s=0;s<t.length;s++)if(lineIntersectsLine(l,t[s]))return!0}return!1}function multiPolygonIntersectsBufferedMultiLine(n,t,e){for(var r=0;r<t.length;r++)for(var o=t[r],i=0;i<n.length;i++){var l=n[i];if(l.length>=3)for(var u=0;u<o.length;u++)if(polygonContainsPoint(l,o[u]))return!0;if(lineIntersectsBufferedLine(l,o,e))return!0}return!1}function lineIntersectsBufferedLine(n,t,e){if(n.length>1){if(lineIntersectsLine(n,t))return!0;for(var r=0;r<t.length;r++)if(pointIntersectsBufferedLine(t[r],n,e))return!0}for(var o=0;o<n.length;o++)if(pointIntersectsBufferedLine(n[o],t,e))return!0;return!1}function lineIntersectsLine(n,t){if(0===n.length||0===t.length)return!1;for(var e=0;e<n.length-1;e++)for(var r=n[e],o=n[e+1],i=0;i<t.length-1;i++){var l=t[i],u=t[i+1];if(lineSegmentIntersectsLineSegment(r,o,l,u))return!0}return!1}function lineSegmentIntersectsLineSegment(n,t,e,r){return isCounterClockwise(n,e,r)!==isCounterClockwise(t,e,r)&&isCounterClockwise(n,t,e)!==isCounterClockwise(n,t,r)}function pointIntersectsBufferedLine(n,t,e){var r=e*e;if(1===t.length)return n.distSqr(t[0])<r;for(var o=1;o<t.length;o++){var i=t[o-1],l=t[o];if(distToSegmentSquared(n,i,l)<r)return!0}return!1}function distToSegmentSquared(n,t,e){var r=t.distSqr(e);if(0===r)return n.distSqr(t);var o=((n.x-t.x)*(e.x-t.x)+(n.y-t.y)*(e.y-t.y))/r;return o<0?n.distSqr(t):o>1?n.distSqr(e):n.distSqr(e.sub(t)._mult(o)._add(t))}function multiPolygonContainsPoint(n,t){for(var e,r,o,i=!1,l=0;l<n.length;l++){e=n[l];for(var u=0,s=e.length-1;u<e.length;s=u++)r=e[u],o=e[s],r.y>t.y!=o.y>t.y&&t.x<(o.x-r.x)*(t.y-r.y)/(o.y-r.y)+r.x&&(i=!i)}return i}function polygonContainsPoint(n,t){for(var e=!1,r=0,o=n.length-1;r<n.length;o=r++){var i=n[r],l=n[o];i.y>t.y!=l.y>t.y&&t.x<(l.x-i.x)*(t.y-i.y)/(l.y-i.y)+i.x&&(e=!e)}return e}var isCounterClockwise=require("./util").isCounterClockwise;module.exports={multiPolygonIntersectsBufferedMultiPoint:multiPolygonIntersectsBufferedMultiPoint,multiPolygonIntersectsMultiPolygon:multiPolygonIntersectsMultiPolygon,multiPolygonIntersectsBufferedMultiLine:multiPolygonIntersectsBufferedMultiLine,polygonIntersectsPolygon:polygonIntersectsPolygon,distToSegmentSquared:distToSegmentSquared};
	},{"./util":126}],120:[function(require,module,exports){
	"use strict";module.exports={"Latin-1 Supplement":function(n){return n>=128&&n<=255},"Hangul Jamo":function(n){return n>=4352&&n<=4607},"Unified Canadian Aboriginal Syllabics":function(n){return n>=5120&&n<=5759},"Unified Canadian Aboriginal Syllabics Extended":function(n){return n>=6320&&n<=6399},"General Punctuation":function(n){return n>=8192&&n<=8303},"Letterlike Symbols":function(n){return n>=8448&&n<=8527},"Number Forms":function(n){return n>=8528&&n<=8591},"Miscellaneous Technical":function(n){return n>=8960&&n<=9215},"Control Pictures":function(n){return n>=9216&&n<=9279},"Optical Character Recognition":function(n){return n>=9280&&n<=9311},"Enclosed Alphanumerics":function(n){return n>=9312&&n<=9471},"Geometric Shapes":function(n){return n>=9632&&n<=9727},"Miscellaneous Symbols":function(n){return n>=9728&&n<=9983},"Miscellaneous Symbols and Arrows":function(n){return n>=11008&&n<=11263},"CJK Radicals Supplement":function(n){return n>=11904&&n<=12031},"Kangxi Radicals":function(n){return n>=12032&&n<=12255},"Ideographic Description Characters":function(n){return n>=12272&&n<=12287},"CJK Symbols and Punctuation":function(n){return n>=12288&&n<=12351},Hiragana:function(n){return n>=12352&&n<=12447},Katakana:function(n){return n>=12448&&n<=12543},Bopomofo:function(n){return n>=12544&&n<=12591},"Hangul Compatibility Jamo":function(n){return n>=12592&&n<=12687},Kanbun:function(n){return n>=12688&&n<=12703},"Bopomofo Extended":function(n){return n>=12704&&n<=12735},"CJK Strokes":function(n){return n>=12736&&n<=12783},"Katakana Phonetic Extensions":function(n){return n>=12784&&n<=12799},"Enclosed CJK Letters and Months":function(n){return n>=12800&&n<=13055},"CJK Compatibility":function(n){return n>=13056&&n<=13311},"CJK Unified Ideographs Extension A":function(n){return n>=13312&&n<=19903},"Yijing Hexagram Symbols":function(n){return n>=19904&&n<=19967},"CJK Unified Ideographs":function(n){return n>=19968&&n<=40959},"Yi Syllables":function(n){return n>=40960&&n<=42127},"Yi Radicals":function(n){return n>=42128&&n<=42191},"Hangul Jamo Extended-A":function(n){return n>=43360&&n<=43391},"Hangul Syllables":function(n){return n>=44032&&n<=55215},"Hangul Jamo Extended-B":function(n){return n>=55216&&n<=55295},"Private Use Area":function(n){return n>=57344&&n<=63743},"CJK Compatibility Ideographs":function(n){return n>=63744&&n<=64255},"Vertical Forms":function(n){return n>=65040&&n<=65055},"CJK Compatibility Forms":function(n){return n>=65072&&n<=65103},"Small Form Variants":function(n){return n>=65104&&n<=65135},"Halfwidth and Fullwidth Forms":function(n){return n>=65280&&n<=65519}};
	},{}],121:[function(require,module,exports){
	"use strict";var LRUCache=function(t,e){this.max=t,this.onRemove=e,this.reset()};LRUCache.prototype.reset=function(){var t=this;for(var e in this.data)t.onRemove(t.data[e]);return this.data={},this.order=[],this},LRUCache.prototype.add=function(t,e){if(this.has(t))this.order.splice(this.order.indexOf(t),1),this.data[t]=e,this.order.push(t);else if(this.data[t]=e,this.order.push(t),this.order.length>this.max){var r=this.get(this.order[0]);r&&this.onRemove(r)}return this},LRUCache.prototype.has=function(t){return t in this.data},LRUCache.prototype.keys=function(){return this.order},LRUCache.prototype.get=function(t){if(!this.has(t))return null;var e=this.data[t];return delete this.data[t],this.order.splice(this.order.indexOf(t),1),e},LRUCache.prototype.setMaxSize=function(t){var e=this;for(this.max=t;this.order.length>this.max;){var r=e.get(e.order[0]);r&&e.onRemove(r)}return this},module.exports=LRUCache;
	},{}],122:[function(require,module,exports){
	"use strict";function makeAPIURL(r,e){var t=parseUrl(config.API_URL);if(r.protocol=t.protocol,r.authority=t.authority,!config.REQUIRE_ACCESS_TOKEN)return formatUrl(r);if(e=e||config.ACCESS_TOKEN,!e)throw new Error("An API access token is required to use Mapbox GL. "+help);if("s"===e[0])throw new Error("Use a public access token (pk.*) with Mapbox GL, not a secret access token (sk.*). "+help);return r.params.push("access_token="+e),formatUrl(r)}function isMapboxURL(r){return 0===r.indexOf("mapbox:")}function replaceTempAccessToken(r){for(var e=0;e<r.length;e++)0===r[e].indexOf("access_token=tk.")&&(r[e]="access_token="+config.ACCESS_TOKEN)}function parseUrl(r){var e=r.match(urlRe);return{protocol:e[1],authority:e[2],path:e[3]||"/",params:e[4]?e[4].split("&"):[]}}function formatUrl(r){var e=r.params.length?"?"+r.params.join("&"):"";return r.protocol+"://"+r.authority+r.path+e}var config=require("./config"),browser=require("./browser"),help="See https://www.mapbox.com/developers/api/#access-tokens";exports.isMapboxURL=isMapboxURL,exports.normalizeStyleURL=function(r,e){if(!isMapboxURL(r))return r;var t=parseUrl(r);return t.path="/styles/v1"+t.path,makeAPIURL(t,e)},exports.normalizeGlyphsURL=function(r,e){if(!isMapboxURL(r))return r;var t=parseUrl(r);return t.path="/fonts/v1"+t.path,makeAPIURL(t,e)},exports.normalizeSourceURL=function(r,e){if(!isMapboxURL(r))return r;var t=parseUrl(r);return t.path="/v4/"+t.authority+".json",t.params.push("secure"),makeAPIURL(t,e)},exports.normalizeSpriteURL=function(r,e,t,a){var o=parseUrl(r);return isMapboxURL(r)?(o.path="/styles/v1"+o.path+"/sprite"+e+t,makeAPIURL(o,a)):(o.path+=""+e+t,formatUrl(o))};var imageExtensionRe=/(\.(png|jpg)\d*)(?=$)/;exports.normalizeTileURL=function(r,e,t){if(!e||!isMapboxURL(e))return r;var a=parseUrl(r),o=browser.devicePixelRatio>=2||512===t?"@2x":"",s=browser.supportsWebp?".webp":"$1";return a.path=a.path.replace(imageExtensionRe,""+o+s),replaceTempAccessToken(a.params),formatUrl(a)};var urlRe=/^(\w+):\/\/([^\/?]+)(\/[^?]+)?\??(.+)?/;
	},{"./browser":107,"./config":111}],123:[function(require,module,exports){
	"use strict";var isChar=require("./is_char_in_unicode_block");module.exports.allowsIdeographicBreaking=function(a){for(var i=0,r=a;i<r.length;i+=1){var s=r[i];if(!exports.charAllowsIdeographicBreaking(s.charCodeAt(0)))return!1}return!0},module.exports.allowsVerticalWritingMode=function(a){for(var i=0,r=a;i<r.length;i+=1){var s=r[i];if(exports.charHasUprightVerticalOrientation(s.charCodeAt(0)))return!0}return!1},module.exports.charAllowsIdeographicBreaking=function(a){return!(a<11904)&&(!!isChar["Bopomofo Extended"](a)||(!!isChar.Bopomofo(a)||(!!isChar["CJK Compatibility Forms"](a)||(!!isChar["CJK Compatibility Ideographs"](a)||(!!isChar["CJK Compatibility"](a)||(!!isChar["CJK Radicals Supplement"](a)||(!!isChar["CJK Strokes"](a)||(!!isChar["CJK Symbols and Punctuation"](a)||(!!isChar["CJK Unified Ideographs Extension A"](a)||(!!isChar["CJK Unified Ideographs"](a)||(!!isChar["Enclosed CJK Letters and Months"](a)||(!!isChar["Halfwidth and Fullwidth Forms"](a)||(!!isChar.Hiragana(a)||(!!isChar["Ideographic Description Characters"](a)||(!!isChar["Kangxi Radicals"](a)||(!!isChar["Katakana Phonetic Extensions"](a)||(!!isChar.Katakana(a)||(!!isChar["Vertical Forms"](a)||(!!isChar["Yi Radicals"](a)||!!isChar["Yi Syllables"](a))))))))))))))))))))},exports.charHasUprightVerticalOrientation=function(a){return 746===a||747===a||!(a<4352)&&(!!isChar["Bopomofo Extended"](a)||(!!isChar.Bopomofo(a)||(!(!isChar["CJK Compatibility Forms"](a)||a>=65097&&a<=65103)||(!!isChar["CJK Compatibility Ideographs"](a)||(!!isChar["CJK Compatibility"](a)||(!!isChar["CJK Radicals Supplement"](a)||(!!isChar["CJK Strokes"](a)||(!(!isChar["CJK Symbols and Punctuation"](a)||a>=12296&&a<=12305||a>=12308&&a<=12319||12336===a)||(!!isChar["CJK Unified Ideographs Extension A"](a)||(!!isChar["CJK Unified Ideographs"](a)||(!!isChar["Enclosed CJK Letters and Months"](a)||(!!isChar["Hangul Compatibility Jamo"](a)||(!!isChar["Hangul Jamo Extended-A"](a)||(!!isChar["Hangul Jamo Extended-B"](a)||(!!isChar["Hangul Jamo"](a)||(!!isChar["Hangul Syllables"](a)||(!!isChar.Hiragana(a)||(!!isChar["Ideographic Description Characters"](a)||(!!isChar.Kanbun(a)||(!!isChar["Kangxi Radicals"](a)||(!!isChar["Katakana Phonetic Extensions"](a)||(!(!isChar.Katakana(a)||12540===a)||(!(!isChar["Halfwidth and Fullwidth Forms"](a)||65288===a||65289===a||65293===a||a>=65306&&a<=65310||65339===a||65341===a||65343===a||a>=65371&&a<=65503||65507===a||a>=65512&&a<=65519)||(!(!isChar["Small Form Variants"](a)||a>=65112&&a<=65118||a>=65123&&a<=65126)||(!!isChar["Unified Canadian Aboriginal Syllabics"](a)||(!!isChar["Unified Canadian Aboriginal Syllabics Extended"](a)||(!!isChar["Vertical Forms"](a)||(!!isChar["Yijing Hexagram Symbols"](a)||(!!isChar["Yi Syllables"](a)||!!isChar["Yi Radicals"](a))))))))))))))))))))))))))))))},exports.charHasNeutralVerticalOrientation=function(a){return!(!isChar["Latin-1 Supplement"](a)||167!==a&&169!==a&&174!==a&&177!==a&&188!==a&&189!==a&&190!==a&&215!==a&&247!==a)||(!(!isChar["General Punctuation"](a)||8214!==a&&8224!==a&&8225!==a&&8240!==a&&8241!==a&&8251!==a&&8252!==a&&8258!==a&&8263!==a&&8264!==a&&8265!==a&&8273!==a)||(!!isChar["Letterlike Symbols"](a)||(!!isChar["Number Forms"](a)||(!(!isChar["Miscellaneous Technical"](a)||!(a>=8960&&a<=8967||a>=8972&&a<=8991||a>=8996&&a<=9e3||9003===a||a>=9085&&a<=9114||a>=9150&&a<=9165||9167===a||a>=9169&&a<=9179||a>=9186&&a<=9215))||(!(!isChar["Control Pictures"](a)||9251===a)||(!!isChar["Optical Character Recognition"](a)||(!!isChar["Enclosed Alphanumerics"](a)||(!!isChar["Geometric Shapes"](a)||(!(!isChar["Miscellaneous Symbols"](a)||a>=9754&&a<=9759)||(!(!isChar["Miscellaneous Symbols and Arrows"](a)||!(a>=11026&&a<=11055||a>=11088&&a<=11097||a>=11192&&a<=11243))||(!!isChar["CJK Symbols and Punctuation"](a)||(!!isChar.Katakana(a)||(!!isChar["Private Use Area"](a)||(!!isChar["CJK Compatibility Forms"](a)||(!!isChar["Small Form Variants"](a)||(!!isChar["Halfwidth and Fullwidth Forms"](a)||(8734===a||8756===a||8757===a||a>=9984&&a<=10087||a>=10102&&a<=10131||65532===a||65533===a)))))))))))))))))},exports.charHasRotatedVerticalOrientation=function(a){return!(exports.charHasUprightVerticalOrientation(a)||exports.charHasNeutralVerticalOrientation(a))};
	},{"./is_char_in_unicode_block":120}],124:[function(require,module,exports){
	"use strict";function createStructArrayType(t){var e=JSON.stringify(t);if(structArrayTypeCache[e])return structArrayTypeCache[e];void 0===t.alignment&&(t.alignment=1);var r=0,i=0,n=["Uint8"],a=t.members.map(function(e){n.indexOf(e.type)<0&&n.push(e.type);var a=sizeOf(e.type),o=r=align(r,Math.max(t.alignment,a)),s=e.components||1;return i=Math.max(i,a),r+=a*s,{name:e.name,type:e.type,components:s,offset:o}}),o=align(r,Math.max(i,t.alignment)),s=function(t){function e(){t.apply(this,arguments)}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e}(Struct);s.prototype.alignment=t.alignment,s.prototype.size=o;for(var p=0,y=a;p<y.length;p+=1)for(var c=y[p],h=0;h<c.components;h++){var u=c.name+(1===c.components?"":h);Object.defineProperty(s.prototype,u,{get:createGetter(c,h),set:createSetter(c,h)})}var f=function(t){function e(){t.apply(this,arguments)}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e}(StructArray);return f.prototype.members=a,f.prototype.StructType=s,f.prototype.bytesPerElement=o,f.prototype.emplaceBack=createEmplaceBack(a,o),f.prototype._usedTypes=n,structArrayTypeCache[e]=f,f}function align(t,e){return Math.ceil(t/e)*e}function sizeOf(t){return viewTypes[t].BYTES_PER_ELEMENT}function getArrayViewName(t){return t.toLowerCase()}function createEmplaceBack(t,e){for(var r=[],i=[],n="var i = this.length;\nthis.resize(this.length + 1);\n",a=0,o=t;a<o.length;a+=1){var s=o[a],p=sizeOf(s.type);r.indexOf(p)<0&&(r.push(p),n+="var o"+p.toFixed(0)+" = i * "+(e/p).toFixed(0)+";\n");for(var y=0;y<s.components;y++){var c="v"+i.length,h="o"+p.toFixed(0)+" + "+(s.offset/p+y).toFixed(0);n+="this."+getArrayViewName(s.type)+"["+h+"] = "+c+";\n",i.push(c)}}return n+="return i;",new Function(i,n)}function createMemberComponentString(t,e){var r="this._pos"+sizeOf(t.type).toFixed(0),i=(t.offset/sizeOf(t.type)+e).toFixed(0),n=r+" + "+i;return"this._structArray."+getArrayViewName(t.type)+"["+n+"]"}function createGetter(t,e){return new Function([],"return "+createMemberComponentString(t,e)+";")}function createSetter(t,e){return new Function(["x"],createMemberComponentString(t,e)+" = x;")}module.exports=createStructArrayType;var viewTypes={Int8:Int8Array,Uint8:Uint8Array,Uint8Clamped:Uint8ClampedArray,Int16:Int16Array,Uint16:Uint16Array,Int32:Int32Array,Uint32:Uint32Array,Float32:Float32Array,Float64:Float64Array},Struct=function(t,e){this._structArray=t,this._pos1=e*this.size,this._pos2=this._pos1/2,this._pos4=this._pos1/4,this._pos8=this._pos1/8},DEFAULT_CAPACITY=128,RESIZE_MULTIPLIER=5,StructArray=function(t){this.isTransferred=!1,void 0!==t?(this.arrayBuffer=t.arrayBuffer,this.length=t.length,this.capacity=this.arrayBuffer.byteLength/this.bytesPerElement,this._refreshViews()):(this.capacity=-1,this.resize(0))};StructArray.serialize=function(){return{members:this.prototype.members,alignment:this.prototype.StructType.prototype.alignment,bytesPerElement:this.prototype.bytesPerElement}},StructArray.prototype.serialize=function(t){return this._trim(),t&&(this.isTransferred=!0,t.push(this.arrayBuffer)),{length:this.length,arrayBuffer:this.arrayBuffer}},StructArray.prototype.get=function(t){return new this.StructType(this,t)},StructArray.prototype._trim=function(){this.length!==this.capacity&&(this.capacity=this.length,this.arrayBuffer=this.arrayBuffer.slice(0,this.length*this.bytesPerElement),this._refreshViews())},StructArray.prototype.resize=function(t){if(this.length=t,t>this.capacity){this.capacity=Math.max(t,Math.floor(this.capacity*RESIZE_MULTIPLIER),DEFAULT_CAPACITY),this.arrayBuffer=new ArrayBuffer(this.capacity*this.bytesPerElement);var e=this.uint8;this._refreshViews(),e&&this.uint8.set(e)}},StructArray.prototype._refreshViews=function(){for(var t=this,e=0,r=this._usedTypes;e<r.length;e+=1){var i=r[e];t[getArrayViewName(i)]=new viewTypes[i](t.arrayBuffer)}},StructArray.prototype.toArray=function(t,e){for(var r=this,i=[],n=t;n<e;n++){var a=r.get(n);i.push(a)}return i};var structArrayTypeCache={};
	},{}],125:[function(require,module,exports){
	"use strict";function resolveTokens(e,n){return n.replace(/{([^{}]+)}/g,function(n,r){return r in e?e[r]:""})}module.exports=resolveTokens;
	},{}],126:[function(require,module,exports){
	"use strict";var UnitBezier=require("unitbezier"),Coordinate=require("../geo/coordinate"),Point=require("point-geometry");exports.easeCubicInOut=function(r){if(r<=0)return 0;if(r>=1)return 1;var e=r*r,n=e*r;return 4*(r<.5?n:3*(r-e)+n-.75)},exports.bezier=function(r,e,n,t){var o=new UnitBezier(r,e,n,t);return function(r){return o.solve(r)}},exports.ease=exports.bezier(.25,.1,.25,1),exports.clamp=function(r,e,n){return Math.min(n,Math.max(e,r))},exports.wrap=function(r,e,n){var t=n-e,o=((r-e)%t+t)%t+e;return o===e?n:o},exports.asyncAll=function(r,e,n){if(!r.length)return n(null,[]);var t=r.length,o=new Array(r.length),a=null;r.forEach(function(r,i){e(r,function(r,e){r&&(a=r),o[i]=e,0===--t&&n(a,o)})})},exports.values=function(r){var e=[];for(var n in r)e.push(r[n]);return e},exports.keysDifference=function(r,e){var n=[];for(var t in r)t in e||n.push(t);return n},exports.extend=function(r,e,n,t){for(var o=arguments,a=1;a<arguments.length;a++){var i=o[a];for(var u in i)r[u]=i[u]}return r},exports.pick=function(r,e){for(var n={},t=0;t<e.length;t++){var o=e[t];o in r&&(n[o]=r[o])}return n};var id=1;exports.uniqueId=function(){return id++},exports.bindAll=function(r,e){r.forEach(function(r){e[r]&&(e[r]=e[r].bind(e))})},exports.getCoordinatesCenter=function(r){for(var e=1/0,n=1/0,t=-(1/0),o=-(1/0),a=0;a<r.length;a++)e=Math.min(e,r[a].column),n=Math.min(n,r[a].row),t=Math.max(t,r[a].column),o=Math.max(o,r[a].row);var i=t-e,u=o-n,s=Math.max(i,u);return new Coordinate((e+t)/2,(n+o)/2,0).zoomTo(Math.floor(-Math.log(s)/Math.LN2))},exports.endsWith=function(r,e){return r.indexOf(e,r.length-e.length)!==-1},exports.mapObject=function(r,e,n){var t=this,o={};for(var a in r)o[a]=e.call(n||t,r[a],a,r);return o},exports.filterObject=function(r,e,n){var t=this,o={};for(var a in r)e.call(n||t,r[a],a,r)&&(o[a]=r[a]);return o},exports.deepEqual=function(r,e){if(Array.isArray(r)){if(!Array.isArray(e)||r.length!==e.length)return!1;for(var n=0;n<r.length;n++)if(!exports.deepEqual(r[n],e[n]))return!1;return!0}if("object"==typeof r&&null!==r&&null!==e){if("object"!=typeof e)return!1;var t=Object.keys(r);if(t.length!==Object.keys(e).length)return!1;for(var o in r)if(!exports.deepEqual(r[o],e[o]))return!1;return!0}return r===e},exports.clone=function(r){return Array.isArray(r)?r.map(exports.clone):"object"==typeof r&&r?exports.mapObject(r,exports.clone):r},exports.arraysIntersect=function(r,e){for(var n=0;n<r.length;n++)if(e.indexOf(r[n])>=0)return!0;return!1};var warnOnceHistory={};exports.warnOnce=function(r){warnOnceHistory[r]||("undefined"!=typeof console&&console.warn(r),warnOnceHistory[r]=!0)},exports.isCounterClockwise=function(r,e,n){return(n.y-r.y)*(e.x-r.x)>(e.y-r.y)*(n.x-r.x)},exports.calculateSignedArea=function(r){for(var e,n,t=0,o=0,a=r.length,i=a-1;o<a;i=o++)e=r[o],n=r[i],t+=(n.x-e.x)*(e.y+n.y);return t},exports.isClosedPolygon=function(r){if(r.length<4)return!1;var e=r[0],n=r[r.length-1];return!(Math.abs(e.x-n.x)>0||Math.abs(e.y-n.y)>0)&&Math.abs(exports.calculateSignedArea(r))>.01},exports.sphericalToCartesian=function(r){var e=r[0],n=r[1],t=r[2];return n+=90,n*=Math.PI/180,t*=Math.PI/180,[e*Math.cos(n)*Math.sin(t),e*Math.sin(n)*Math.sin(t),e*Math.cos(t)]};
	},{"../geo/coordinate":18,"point-geometry":195,"unitbezier":204}],127:[function(require,module,exports){
	"use strict";var Feature=function(e,t,r,o){this.type="Feature",this._vectorTileFeature=e,e._z=t,e._x=r,e._y=o,this.properties=e.properties,null!=e.id&&(this.id=e.id)},prototypeAccessors={geometry:{}};prototypeAccessors.geometry.get=function(){return void 0===this._geometry&&(this._geometry=this._vectorTileFeature.toGeoJSON(this._vectorTileFeature._x,this._vectorTileFeature._y,this._vectorTileFeature._z).geometry),this._geometry},prototypeAccessors.geometry.set=function(e){this._geometry=e},Feature.prototype.toJSON=function(){var e=this,t={geometry:this.geometry};for(var r in this)"_geometry"!==r&&"_vectorTileFeature"!==r&&(t[r]=e[r]);return t},Object.defineProperties(Feature.prototype,prototypeAccessors),module.exports=Feature;
	},{}],128:[function(require,module,exports){
	"use strict";var scriptDetection=require("./script_detection");module.exports=function(t){for(var o="",e=0;e<t.length;e++){var r=t.charCodeAt(e+1)||null,l=t.charCodeAt(e-1)||null,i=(!r||!scriptDetection.charHasRotatedVerticalOrientation(r)||module.exports.lookup[t[e+1]])&&(!l||!scriptDetection.charHasRotatedVerticalOrientation(l)||module.exports.lookup[t[e-1]]);o+=i&&module.exports.lookup[t[e]]?module.exports.lookup[t[e]]:t[e]}return o},module.exports.lookup={"!":"︕","#":"＃",$:"＄","%":"％","&":"＆","(":"︵",")":"︶","*":"＊","+":"＋",",":"︐","-":"︲",".":"・","/":"／",":":"︓",";":"︔","<":"︿","=":"＝",">":"﹀","?":"︖","@":"＠","[":"﹇","\\":"＼","]":"﹈","^":"＾",_:"︳","`":"｀","{":"︷","|":"―","}":"︸","~":"～","¢":"￠","£":"￡","¥":"￥","¦":"￤","¬":"￢","¯":"￣","–":"︲","—":"︱","‘":"﹃","’":"﹄","“":"﹁","”":"﹂","…":"︙","‧":"・","₩":"￦","、":"︑","。":"︒","〈":"︿","〉":"﹀","《":"︽","》":"︾","「":"﹁","」":"﹂","『":"﹃","』":"﹄","【":"︻","】":"︼","〔":"︹","〕":"︺","〖":"︗","〗":"︘","！":"︕","（":"︵","）":"︶","，":"︐","－":"︲","．":"・","：":"︓","；":"︔","＜":"︿","＞":"﹀","？":"︖","［":"﹇","］":"﹈","＿":"︳","｛":"︷","｜":"―","｝":"︸","｟":"︵","｠":"︶","｡":"︒","｢":"﹁","｣":"﹂"};
	},{"./script_detection":123}],129:[function(require,module,exports){
	"use strict";var WebWorker=require("./web_worker"),WorkerPool=function(){this.active={}};WorkerPool.prototype.acquire=function(r){var e=this;if(!this.workers){var o=require("../mapbox-gl").workerCount;for(this.workers=[];this.workers.length<o;)e.workers.push(new WebWorker)}return this.active[r]=!0,this.workers.slice()},WorkerPool.prototype.release=function(r){delete this.active[r],0===Object.keys(this.active).length&&(this.workers.forEach(function(r){r.terminate()}),this.workers=null)},module.exports=WorkerPool;
	},{"../mapbox-gl":24,"./web_worker":108}],130:[function(require,module,exports){
	(function (process){
	function normalizeArray(r,t){for(var e=0,n=r.length-1;n>=0;n--){var s=r[n];"."===s?r.splice(n,1):".."===s?(r.splice(n,1),e++):e&&(r.splice(n,1),e--)}if(t)for(;e--;e)r.unshift("..");return r}function filter(r,t){if(r.filter)return r.filter(t);for(var e=[],n=0;n<r.length;n++)t(r[n],n,r)&&e.push(r[n]);return e}var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,splitPath=function(r){return splitPathRe.exec(r).slice(1)};exports.resolve=function(){for(var r="",t=!1,e=arguments.length-1;e>=-1&&!t;e--){var n=e>=0?arguments[e]:process.cwd();if("string"!=typeof n)throw new TypeError("Arguments to path.resolve must be strings");n&&(r=n+"/"+r,t="/"===n.charAt(0))}return r=normalizeArray(filter(r.split("/"),function(r){return!!r}),!t).join("/"),(t?"/":"")+r||"."},exports.normalize=function(r){var t=exports.isAbsolute(r),e="/"===substr(r,-1);return r=normalizeArray(filter(r.split("/"),function(r){return!!r}),!t).join("/"),r||t||(r="."),r&&e&&(r+="/"),(t?"/":"")+r},exports.isAbsolute=function(r){return"/"===r.charAt(0)},exports.join=function(){var r=Array.prototype.slice.call(arguments,0);return exports.normalize(filter(r,function(r,t){if("string"!=typeof r)throw new TypeError("Arguments to path.join must be strings");return r}).join("/"))},exports.relative=function(r,t){function e(r){for(var t=0;t<r.length&&""===r[t];t++);for(var e=r.length-1;e>=0&&""===r[e];e--);return t>e?[]:r.slice(t,e-t+1)}r=exports.resolve(r).substr(1),t=exports.resolve(t).substr(1);for(var n=e(r.split("/")),s=e(t.split("/")),i=Math.min(n.length,s.length),o=i,u=0;u<i;u++)if(n[u]!==s[u]){o=u;break}for(var l=[],u=o;u<n.length;u++)l.push("..");return l=l.concat(s.slice(o)),l.join("/")},exports.sep="/",exports.delimiter=":",exports.dirname=function(r){var t=splitPath(r),e=t[0],n=t[1];return e||n?(n&&(n=n.substr(0,n.length-1)),e+n):"."},exports.basename=function(r,t){var e=splitPath(r)[2];return t&&e.substr(-1*t.length)===t&&(e=e.substr(0,e.length-t.length)),e},exports.extname=function(r){return splitPath(r)[3]};var substr="b"==="ab".substr(-1)?function(r,t,e){return r.substr(t,e)}:function(r,t,e){return t<0&&(t=r.length+t),r.substr(t,e)};
	}).call(this,require('_process'))
	
	},{"_process":131}],131:[function(require,module,exports){
	function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}function runTimeout(e){if(cachedSetTimeout===setTimeout)return setTimeout(e,0);if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout)return cachedSetTimeout=setTimeout,setTimeout(e,0);try{return cachedSetTimeout(e,0)}catch(t){try{return cachedSetTimeout.call(null,e,0)}catch(t){return cachedSetTimeout.call(this,e,0)}}}function runClearTimeout(e){if(cachedClearTimeout===clearTimeout)return clearTimeout(e);if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout)return cachedClearTimeout=clearTimeout,clearTimeout(e);try{return cachedClearTimeout(e)}catch(t){try{return cachedClearTimeout.call(null,e)}catch(t){return cachedClearTimeout.call(this,e)}}}function cleanUpNextTick(){draining&&currentQueue&&(draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue())}function drainQueue(){if(!draining){var e=runTimeout(cleanUpNextTick);draining=!0;for(var t=queue.length;t;){for(currentQueue=queue,queue=[];++queueIndex<t;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,t=queue.length}currentQueue=null,draining=!1,runClearTimeout(e)}}function Item(e,t){this.fun=e,this.array=t}function noop(){}var process=module.exports={},cachedSetTimeout,cachedClearTimeout;!function(){try{cachedSetTimeout="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){cachedSetTimeout=defaultSetTimout}try{cachedClearTimeout="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){cachedClearTimeout=defaultClearTimeout}}();var queue=[],draining=!1,currentQueue,queueIndex=-1;process.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var u=1;u<arguments.length;u++)t[u-1]=arguments[u];queue.push(new Item(e,t)),1!==queue.length||draining||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.binding=function(e){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(e){throw new Error("process.chdir is not supported")},process.umask=function(){return 0};
	},{}],132:[function(require,module,exports){
	"function"==typeof Object.create?module.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:module.exports=function(t,e){t.super_=e;var o=function(){};o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t};
	},{}],133:[function(require,module,exports){
	module.exports=function(o){return o&&"object"==typeof o&&"function"==typeof o.copy&&"function"==typeof o.fill&&"function"==typeof o.readUInt8};
	},{}],134:[function(require,module,exports){
	(function (process,global){
	function inspect(e,r){var t={seen:[],stylize:stylizeNoColor};return arguments.length>=3&&(t.depth=arguments[2]),arguments.length>=4&&(t.colors=arguments[3]),isBoolean(r)?t.showHidden=r:r&&exports._extend(t,r),isUndefined(t.showHidden)&&(t.showHidden=!1),isUndefined(t.depth)&&(t.depth=2),isUndefined(t.colors)&&(t.colors=!1),isUndefined(t.customInspect)&&(t.customInspect=!0),t.colors&&(t.stylize=stylizeWithColor),formatValue(t,e,t.depth)}function stylizeWithColor(e,r){var t=inspect.styles[r];return t?"["+inspect.colors[t][0]+"m"+e+"["+inspect.colors[t][1]+"m":e}function stylizeNoColor(e,r){return e}function arrayToHash(e){var r={};return e.forEach(function(e,t){r[e]=!0}),r}function formatValue(e,r,t){if(e.customInspect&&r&&isFunction(r.inspect)&&r.inspect!==exports.inspect&&(!r.constructor||r.constructor.prototype!==r)){var n=r.inspect(t,e);return isString(n)||(n=formatValue(e,n,t)),n}var i=formatPrimitive(e,r);if(i)return i;var o=Object.keys(r),s=arrayToHash(o);if(e.showHidden&&(o=Object.getOwnPropertyNames(r)),isError(r)&&(o.indexOf("message")>=0||o.indexOf("description")>=0))return formatError(r);if(0===o.length){if(isFunction(r)){var u=r.name?": "+r.name:"";return e.stylize("[Function"+u+"]","special")}if(isRegExp(r))return e.stylize(RegExp.prototype.toString.call(r),"regexp");if(isDate(r))return e.stylize(Date.prototype.toString.call(r),"date");if(isError(r))return formatError(r)}var c="",a=!1,l=["{","}"];if(isArray(r)&&(a=!0,l=["[","]"]),isFunction(r)){var p=r.name?": "+r.name:"";c=" [Function"+p+"]"}if(isRegExp(r)&&(c=" "+RegExp.prototype.toString.call(r)),isDate(r)&&(c=" "+Date.prototype.toUTCString.call(r)),isError(r)&&(c=" "+formatError(r)),0===o.length&&(!a||0==r.length))return l[0]+c+l[1];if(t<0)return isRegExp(r)?e.stylize(RegExp.prototype.toString.call(r),"regexp"):e.stylize("[Object]","special");e.seen.push(r);var f;return f=a?formatArray(e,r,t,s,o):o.map(function(n){return formatProperty(e,r,t,s,n,a)}),e.seen.pop(),reduceToSingleString(f,c,l)}function formatPrimitive(e,r){if(isUndefined(r))return e.stylize("undefined","undefined");if(isString(r)){var t="'"+JSON.stringify(r).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(t,"string")}return isNumber(r)?e.stylize(""+r,"number"):isBoolean(r)?e.stylize(""+r,"boolean"):isNull(r)?e.stylize("null","null"):void 0}function formatError(e){return"["+Error.prototype.toString.call(e)+"]"}function formatArray(e,r,t,n,i){for(var o=[],s=0,u=r.length;s<u;++s)hasOwnProperty(r,String(s))?o.push(formatProperty(e,r,t,n,String(s),!0)):o.push("");return i.forEach(function(i){i.match(/^\d+$/)||o.push(formatProperty(e,r,t,n,i,!0))}),o}function formatProperty(e,r,t,n,i,o){var s,u,c;if(c=Object.getOwnPropertyDescriptor(r,i)||{value:r[i]},c.get?u=c.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):c.set&&(u=e.stylize("[Setter]","special")),hasOwnProperty(n,i)||(s="["+i+"]"),u||(e.seen.indexOf(c.value)<0?(u=isNull(t)?formatValue(e,c.value,null):formatValue(e,c.value,t-1),u.indexOf("\n")>-1&&(u=o?u.split("\n").map(function(e){return"  "+e}).join("\n").substr(2):"\n"+u.split("\n").map(function(e){return"   "+e}).join("\n"))):u=e.stylize("[Circular]","special")),isUndefined(s)){if(o&&i.match(/^\d+$/))return u;s=JSON.stringify(""+i),s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=e.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=e.stylize(s,"string"))}return s+": "+u}function reduceToSingleString(e,r,t){var n=0,i=e.reduce(function(e,r){return n++,r.indexOf("\n")>=0&&n++,e+r.replace(/\u001b\[\d\d?m/g,"").length+1},0);return i>60?t[0]+(""===r?"":r+"\n ")+" "+e.join(",\n  ")+" "+t[1]:t[0]+r+" "+e.join(", ")+" "+t[1]}function isArray(e){return Array.isArray(e)}function isBoolean(e){return"boolean"==typeof e}function isNull(e){return null===e}function isNullOrUndefined(e){return null==e}function isNumber(e){return"number"==typeof e}function isString(e){return"string"==typeof e}function isSymbol(e){return"symbol"==typeof e}function isUndefined(e){return void 0===e}function isRegExp(e){return isObject(e)&&"[object RegExp]"===objectToString(e)}function isObject(e){return"object"==typeof e&&null!==e}function isDate(e){return isObject(e)&&"[object Date]"===objectToString(e)}function isError(e){return isObject(e)&&("[object Error]"===objectToString(e)||e instanceof Error)}function isFunction(e){return"function"==typeof e}function isPrimitive(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||"undefined"==typeof e}function objectToString(e){return Object.prototype.toString.call(e)}function pad(e){return e<10?"0"+e.toString(10):e.toString(10)}function timestamp(){var e=new Date,r=[pad(e.getHours()),pad(e.getMinutes()),pad(e.getSeconds())].join(":");return[e.getDate(),months[e.getMonth()],r].join(" ")}function hasOwnProperty(e,r){return Object.prototype.hasOwnProperty.call(e,r)}var formatRegExp=/%[sdj%]/g;exports.format=function(e){if(!isString(e)){for(var r=[],t=0;t<arguments.length;t++)r.push(inspect(arguments[t]));return r.join(" ")}for(var t=1,n=arguments,i=n.length,o=String(e).replace(formatRegExp,function(e){if("%%"===e)return"%";if(t>=i)return e;switch(e){case"%s":return String(n[t++]);case"%d":return Number(n[t++]);case"%j":try{return JSON.stringify(n[t++])}catch(e){return"[Circular]"}default:return e}}),s=n[t];t<i;s=n[++t])o+=isNull(s)||!isObject(s)?" "+s:" "+inspect(s);return o},exports.deprecate=function(e,r){function t(){if(!n){if(process.throwDeprecation)throw new Error(r);process.traceDeprecation?console.trace(r):console.error(r),n=!0}return e.apply(this,arguments)}if(isUndefined(global.process))return function(){return exports.deprecate(e,r).apply(this,arguments)};if(process.noDeprecation===!0)return e;var n=!1;return t};var debugs={},debugEnviron;exports.debuglog=function(e){if(isUndefined(debugEnviron)&&(debugEnviron=process.env.NODE_DEBUG||""),e=e.toUpperCase(),!debugs[e])if(new RegExp("\\b"+e+"\\b","i").test(debugEnviron)){var r=process.pid;debugs[e]=function(){var t=exports.format.apply(exports,arguments);console.error("%s %d: %s",e,r,t)}}else debugs[e]=function(){};return debugs[e]},exports.inspect=inspect,inspect.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},inspect.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},exports.isArray=isArray,exports.isBoolean=isBoolean,exports.isNull=isNull,exports.isNullOrUndefined=isNullOrUndefined,exports.isNumber=isNumber,exports.isString=isString,exports.isSymbol=isSymbol,exports.isUndefined=isUndefined,exports.isRegExp=isRegExp,exports.isObject=isObject,exports.isDate=isDate,exports.isError=isError,exports.isFunction=isFunction,exports.isPrimitive=isPrimitive,exports.isBuffer=require("./support/isBuffer");var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];exports.log=function(){console.log("%s - %s",timestamp(),exports.format.apply(exports,arguments))},exports.inherits=require("inherits"),exports._extend=function(e,r){if(!r||!isObject(r))return e;for(var t=Object.keys(r),n=t.length;n--;)e[t[n]]=r[t[n]];return e};
	}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
	
	},{"./support/isBuffer":133,"_process":131,"inherits":132}],135:[function(require,module,exports){
	function clamp_css_byte(e){return e=Math.round(e),e<0?0:e>255?255:e}function clamp_css_float(e){return e<0?0:e>1?1:e}function parse_css_int(e){return clamp_css_byte("%"===e[e.length-1]?parseFloat(e)/100*255:parseInt(e))}function parse_css_float(e){return clamp_css_float("%"===e[e.length-1]?parseFloat(e)/100:parseFloat(e))}function css_hue_to_rgb(e,r,l){return l<0?l+=1:l>1&&(l-=1),6*l<1?e+(r-e)*l*6:2*l<1?r:3*l<2?e+(r-e)*(2/3-l)*6:e}function parseCSSColor(e){var r=e.replace(/ /g,"").toLowerCase();if(r in kCSSColorTable)return kCSSColorTable[r].slice();if("#"===r[0]){if(4===r.length){var l=parseInt(r.substr(1),16);return l>=0&&l<=4095?[(3840&l)>>4|(3840&l)>>8,240&l|(240&l)>>4,15&l|(15&l)<<4,1]:null}if(7===r.length){var l=parseInt(r.substr(1),16);return l>=0&&l<=16777215?[(16711680&l)>>16,(65280&l)>>8,255&l,1]:null}return null}var a=r.indexOf("("),t=r.indexOf(")");if(a!==-1&&t+1===r.length){var n=r.substr(0,a),s=r.substr(a+1,t-(a+1)).split(","),o=1;switch(n){case"rgba":if(4!==s.length)return null;o=parse_css_float(s.pop());case"rgb":return 3!==s.length?null:[parse_css_int(s[0]),parse_css_int(s[1]),parse_css_int(s[2]),o];case"hsla":if(4!==s.length)return null;o=parse_css_float(s.pop());case"hsl":if(3!==s.length)return null;var i=(parseFloat(s[0])%360+360)%360/360,u=parse_css_float(s[1]),g=parse_css_float(s[2]),d=g<=.5?g*(u+1):g+u-g*u,c=2*g-d;return[clamp_css_byte(255*css_hue_to_rgb(c,d,i+1/3)),clamp_css_byte(255*css_hue_to_rgb(c,d,i)),clamp_css_byte(255*css_hue_to_rgb(c,d,i-1/3)),o];default:return null}}return null}var kCSSColorTable={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],rebeccapurple:[102,51,153,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};try{exports.parseCSSColor=parseCSSColor}catch(e){}
	},{}],136:[function(require,module,exports){
	"use strict";function earcut(e,n,r){r=r||2;var t=n&&n.length,i=t?n[0]*r:e.length,x=linkedList(e,0,i,r,!0),a=[];if(!x)return a;var o,l,u,s,v,f,y;if(t&&(x=eliminateHoles(e,n,x,r)),e.length>80*r){o=u=e[0],l=s=e[1];for(var d=r;d<i;d+=r)v=e[d],f=e[d+1],v<o&&(o=v),f<l&&(l=f),v>u&&(u=v),f>s&&(s=f);y=Math.max(u-o,s-l)}return earcutLinked(x,a,r,o,l,y),a}function linkedList(e,n,r,t,i){var x,a;if(i===signedArea(e,n,r,t)>0)for(x=n;x<r;x+=t)a=insertNode(x,e[x],e[x+1],a);else for(x=r-t;x>=n;x-=t)a=insertNode(x,e[x],e[x+1],a);return a&&equals(a,a.next)&&(removeNode(a),a=a.next),a}function filterPoints(e,n){if(!e)return e;n||(n=e);var r,t=e;do if(r=!1,t.steiner||!equals(t,t.next)&&0!==area(t.prev,t,t.next))t=t.next;else{if(removeNode(t),t=n=t.prev,t===t.next)return null;r=!0}while(r||t!==n);return n}function earcutLinked(e,n,r,t,i,x,a){if(e){!a&&x&&indexCurve(e,t,i,x);for(var o,l,u=e;e.prev!==e.next;)if(o=e.prev,l=e.next,x?isEarHashed(e,t,i,x):isEar(e))n.push(o.i/r),n.push(e.i/r),n.push(l.i/r),removeNode(e),e=l.next,u=l.next;else if(e=l,e===u){a?1===a?(e=cureLocalIntersections(e,n,r),earcutLinked(e,n,r,t,i,x,2)):2===a&&splitEarcut(e,n,r,t,i,x):earcutLinked(filterPoints(e),n,r,t,i,x,1);break}}}function isEar(e){var n=e.prev,r=e,t=e.next;if(area(n,r,t)>=0)return!1;for(var i=e.next.next;i!==e.prev;){if(pointInTriangle(n.x,n.y,r.x,r.y,t.x,t.y,i.x,i.y)&&area(i.prev,i,i.next)>=0)return!1;i=i.next}return!0}function isEarHashed(e,n,r,t){var i=e.prev,x=e,a=e.next;if(area(i,x,a)>=0)return!1;for(var o=i.x<x.x?i.x<a.x?i.x:a.x:x.x<a.x?x.x:a.x,l=i.y<x.y?i.y<a.y?i.y:a.y:x.y<a.y?x.y:a.y,u=i.x>x.x?i.x>a.x?i.x:a.x:x.x>a.x?x.x:a.x,s=i.y>x.y?i.y>a.y?i.y:a.y:x.y>a.y?x.y:a.y,v=zOrder(o,l,n,r,t),f=zOrder(u,s,n,r,t),y=e.nextZ;y&&y.z<=f;){if(y!==e.prev&&y!==e.next&&pointInTriangle(i.x,i.y,x.x,x.y,a.x,a.y,y.x,y.y)&&area(y.prev,y,y.next)>=0)return!1;y=y.nextZ}for(y=e.prevZ;y&&y.z>=v;){if(y!==e.prev&&y!==e.next&&pointInTriangle(i.x,i.y,x.x,x.y,a.x,a.y,y.x,y.y)&&area(y.prev,y,y.next)>=0)return!1;y=y.prevZ}return!0}function cureLocalIntersections(e,n,r){var t=e;do{var i=t.prev,x=t.next.next;!equals(i,x)&&intersects(i,t,t.next,x)&&locallyInside(i,x)&&locallyInside(x,i)&&(n.push(i.i/r),n.push(t.i/r),n.push(x.i/r),removeNode(t),removeNode(t.next),t=e=x),t=t.next}while(t!==e);return t}function splitEarcut(e,n,r,t,i,x){var a=e;do{for(var o=a.next.next;o!==a.prev;){if(a.i!==o.i&&isValidDiagonal(a,o)){var l=splitPolygon(a,o);return a=filterPoints(a,a.next),l=filterPoints(l,l.next),earcutLinked(a,n,r,t,i,x),void earcutLinked(l,n,r,t,i,x)}o=o.next}a=a.next}while(a!==e)}function eliminateHoles(e,n,r,t){var i,x,a,o,l,u=[];for(i=0,x=n.length;i<x;i++)a=n[i]*t,o=i<x-1?n[i+1]*t:e.length,l=linkedList(e,a,o,t,!1),l===l.next&&(l.steiner=!0),u.push(getLeftmost(l));for(u.sort(compareX),i=0;i<u.length;i++)eliminateHole(u[i],r),r=filterPoints(r,r.next);return r}function compareX(e,n){return e.x-n.x}function eliminateHole(e,n){if(n=findHoleBridge(e,n)){var r=splitPolygon(n,e);filterPoints(r,r.next)}}function findHoleBridge(e,n){var r,t=n,i=e.x,x=e.y,a=-(1/0);do{if(x<=t.y&&x>=t.next.y){var o=t.x+(x-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(o<=i&&o>a){if(a=o,o===i){if(x===t.y)return t;if(x===t.next.y)return t.next}r=t.x<t.next.x?t:t.next}}t=t.next}while(t!==n);if(!r)return null;if(i===a)return r.prev;var l,u=r,s=r.x,v=r.y,f=1/0;for(t=r.next;t!==u;)i>=t.x&&t.x>=s&&pointInTriangle(x<v?i:a,x,s,v,x<v?a:i,x,t.x,t.y)&&(l=Math.abs(x-t.y)/(i-t.x),(l<f||l===f&&t.x>r.x)&&locallyInside(t,e)&&(r=t,f=l)),t=t.next;return r}function indexCurve(e,n,r,t){var i=e;do null===i.z&&(i.z=zOrder(i.x,i.y,n,r,t)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,sortLinked(i)}function sortLinked(e){var n,r,t,i,x,a,o,l,u=1;do{for(r=e,e=null,x=null,a=0;r;){for(a++,t=r,o=0,n=0;n<u&&(o++,t=t.nextZ,t);n++);for(l=u;o>0||l>0&&t;)0===o?(i=t,t=t.nextZ,l--):0!==l&&t?r.z<=t.z?(i=r,r=r.nextZ,o--):(i=t,t=t.nextZ,l--):(i=r,r=r.nextZ,o--),x?x.nextZ=i:e=i,i.prevZ=x,x=i;r=t}x.nextZ=null,u*=2}while(a>1);return e}function zOrder(e,n,r,t,i){return e=32767*(e-r)/i,n=32767*(n-t)/i,e=16711935&(e|e<<8),e=252645135&(e|e<<4),e=858993459&(e|e<<2),e=1431655765&(e|e<<1),n=16711935&(n|n<<8),n=252645135&(n|n<<4),n=858993459&(n|n<<2),n=1431655765&(n|n<<1),e|n<<1}function getLeftmost(e){var n=e,r=e;do n.x<r.x&&(r=n),n=n.next;while(n!==e);return r}function pointInTriangle(e,n,r,t,i,x,a,o){return(i-a)*(n-o)-(e-a)*(x-o)>=0&&(e-a)*(t-o)-(r-a)*(n-o)>=0&&(r-a)*(x-o)-(i-a)*(t-o)>=0}function isValidDiagonal(e,n){return e.next.i!==n.i&&e.prev.i!==n.i&&!intersectsPolygon(e,n)&&locallyInside(e,n)&&locallyInside(n,e)&&middleInside(e,n)}function area(e,n,r){return(n.y-e.y)*(r.x-n.x)-(n.x-e.x)*(r.y-n.y)}function equals(e,n){return e.x===n.x&&e.y===n.y}function intersects(e,n,r,t){return!!(equals(e,n)&&equals(r,t)||equals(e,t)&&equals(r,n))||area(e,n,r)>0!=area(e,n,t)>0&&area(r,t,e)>0!=area(r,t,n)>0}function intersectsPolygon(e,n){var r=e;do{if(r.i!==e.i&&r.next.i!==e.i&&r.i!==n.i&&r.next.i!==n.i&&intersects(r,r.next,e,n))return!0;r=r.next}while(r!==e);return!1}function locallyInside(e,n){return area(e.prev,e,e.next)<0?area(e,n,e.next)>=0&&area(e,e.prev,n)>=0:area(e,n,e.prev)<0||area(e,e.next,n)<0}function middleInside(e,n){var r=e,t=!1,i=(e.x+n.x)/2,x=(e.y+n.y)/2;do r.y>x!=r.next.y>x&&i<(r.next.x-r.x)*(x-r.y)/(r.next.y-r.y)+r.x&&(t=!t),r=r.next;while(r!==e);return t}function splitPolygon(e,n){var r=new Node(e.i,e.x,e.y),t=new Node(n.i,n.x,n.y),i=e.next,x=n.prev;return e.next=n,n.prev=e,r.next=i,i.prev=r,t.next=r,r.prev=t,x.next=t,t.prev=x,t}function insertNode(e,n,r,t){var i=new Node(e,n,r);return t?(i.next=t.next,i.prev=t,t.next.prev=i,t.next=i):(i.prev=i,i.next=i),i}function removeNode(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Node(e,n,r){this.i=e,this.x=n,this.y=r,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function signedArea(e,n,r,t){for(var i=0,x=n,a=r-t;x<r;x+=t)i+=(e[a]-e[x])*(e[x+1]+e[a+1]),a=x;return i}module.exports=earcut,earcut.deviation=function(e,n,r,t){var i=n&&n.length,x=i?n[0]*r:e.length,a=Math.abs(signedArea(e,0,x,r));if(i)for(var o=0,l=n.length;o<l;o++){var u=n[o]*r,s=o<l-1?n[o+1]*r:e.length;a-=Math.abs(signedArea(e,u,s,r))}var v=0;for(o=0;o<t.length;o+=3){var f=t[o]*r,y=t[o+1]*r,d=t[o+2]*r;v+=Math.abs((e[f]-e[d])*(e[y+1]-e[f+1])-(e[f]-e[y])*(e[d+1]-e[f+1]))}return 0===a&&0===v?0:Math.abs((v-a)/a)},earcut.flatten=function(e){for(var n=e[0][0].length,r={vertices:[],holes:[],dimensions:n},t=0,i=0;i<e.length;i++){for(var x=0;x<e[i].length;x++)for(var a=0;a<n;a++)r.vertices.push(e[i][x][a]);i>0&&(t+=e[i-1].length,r.holes.push(t))}return r};
	},{}],137:[function(require,module,exports){
	"use strict";function createFilter(e){return new Function("f","var p = (f && f.properties || {}); return "+compile(e))}function compile(e){if(!e)return"true";var i=e[0];if(e.length<=1)return"any"===i?"false":"true";var n="=="===i?compileComparisonOp(e[1],e[2],"===",!1):"!="===i?compileComparisonOp(e[1],e[2],"!==",!1):"<"===i||">"===i||"<="===i||">="===i?compileComparisonOp(e[1],e[2],i,!0):"any"===i?compileLogicalOp(e.slice(1),"||"):"all"===i?compileLogicalOp(e.slice(1),"&&"):"none"===i?compileNegation(compileLogicalOp(e.slice(1),"||")):"in"===i?compileInOp(e[1],e.slice(2)):"!in"===i?compileNegation(compileInOp(e[1],e.slice(2))):"has"===i?compileHasOp(e[1]):"!has"===i?compileNegation(compileHasOp([e[1]])):"true";return"("+n+")"}function compilePropertyReference(e){return"$type"===e?"f.type":"$id"===e?"f.id":"p["+JSON.stringify(e)+"]"}function compileComparisonOp(e,i,n,r){var o=compilePropertyReference(e),t="$type"===e?types.indexOf(i):JSON.stringify(i);return(r?"typeof "+o+"=== typeof "+t+"&&":"")+o+n+t}function compileLogicalOp(e,i){return e.map(compile).join(i)}function compileInOp(e,i){"$type"===e&&(i=i.map(function(e){return types.indexOf(e)}));var n=JSON.stringify(i.sort(compare)),r=compilePropertyReference(e);return i.length<=200?n+".indexOf("+r+") !== -1":"function(v, a, i, j) {while (i <= j) { var m = (i + j) >> 1;    if (a[m] === v) return true; if (a[m] > v) j = m - 1; else i = m + 1;}return false; }("+r+", "+n+",0,"+(i.length-1)+")"}function compileHasOp(e){return JSON.stringify(e)+" in p"}function compileNegation(e){return"!("+e+")"}function compare(e,i){return e<i?-1:e>i?1:0}module.exports=createFilter;var types=["Unknown","Point","LineString","Polygon"];
	},{}],138:[function(require,module,exports){
	function rewind(r,e){switch(r&&r.type||null){case"FeatureCollection":return r.features=r.features.map(curryOuter(rewind,e)),r;case"Feature":return r.geometry=rewind(r.geometry,e),r;case"Polygon":case"MultiPolygon":return correct(r,e);default:return r}}function curryOuter(r,e){return function(n){return r(n,e)}}function correct(r,e){return"Polygon"===r.type?r.coordinates=correctRings(r.coordinates,e):"MultiPolygon"===r.type&&(r.coordinates=r.coordinates.map(curryOuter(correctRings,e))),r}function correctRings(r,e){e=!!e,r[0]=wind(r[0],!e);for(var n=1;n<r.length;n++)r[n]=wind(r[n],e);return r}function wind(r,e){return cw(r)===e?r:r.reverse()}function cw(r){return geojsonArea.ring(r)>=0}var geojsonArea=require("geojson-area");module.exports=rewind;
	},{"geojson-area":139}],139:[function(require,module,exports){
	function geometry(r){if("Polygon"===r.type)return polygonArea(r.coordinates);if("MultiPolygon"===r.type){for(var e=0,n=0;n<r.coordinates.length;n++)e+=polygonArea(r.coordinates[n]);return e}return null}function polygonArea(r){var e=0;if(r&&r.length>0){e+=Math.abs(ringArea(r[0]));for(var n=1;n<r.length;n++)e-=Math.abs(ringArea(r[n]))}return e}function ringArea(r){var e=0;if(r.length>2){for(var n,t,o=0;o<r.length-1;o++)n=r[o],t=r[o+1],e+=rad(t[0]-n[0])*(2+Math.sin(rad(n[1]))+Math.sin(rad(t[1])));e=e*wgs84.RADIUS*wgs84.RADIUS/2}return e}function rad(r){return r*Math.PI/180}var wgs84=require("wgs84");module.exports.geometry=geometry,module.exports.ring=ringArea;
	},{"wgs84":140}],140:[function(require,module,exports){
	module.exports.RADIUS=6378137,module.exports.FLATTENING=1/298.257223563,module.exports.POLAR_RADIUS=6356752.3142;
	},{}],141:[function(require,module,exports){
	"use strict";function clip(e,r,t,n,u,i,l,s){if(t/=r,n/=r,l>=t&&s<=n)return e;if(l>n||s<t)return null;for(var h=[],p=0;p<e.length;p++){var a,c,o=e[p],f=o.geometry,g=o.type;if(a=o.min[u],c=o.max[u],a>=t&&c<=n)h.push(o);else if(!(a>n||c<t)){var v=1===g?clipPoints(f,t,n,u):clipGeometry(f,t,n,u,i,3===g);v.length&&h.push(createFeature(o.tags,g,v,o.id))}}return h.length?h:null}function clipPoints(e,r,t,n){for(var u=[],i=0;i<e.length;i++){var l=e[i],s=l[n];s>=r&&s<=t&&u.push(l)}return u}function clipGeometry(e,r,t,n,u,i){for(var l=[],s=0;s<e.length;s++){var h,p,a,c=0,o=0,f=null,g=e[s],v=g.area,m=g.dist,w=g.outer,S=g.length,d=[];for(p=0;p<S-1;p++)h=f||g[p],f=g[p+1],c=o||h[n],o=f[n],c<r?o>t?(d.push(u(h,f,r),u(h,f,t)),i||(d=newSlice(l,d,v,m,w))):o>=r&&d.push(u(h,f,r)):c>t?o<r?(d.push(u(h,f,t),u(h,f,r)),i||(d=newSlice(l,d,v,m,w))):o<=t&&d.push(u(h,f,t)):(d.push(h),o<r?(d.push(u(h,f,r)),i||(d=newSlice(l,d,v,m,w))):o>t&&(d.push(u(h,f,t)),i||(d=newSlice(l,d,v,m,w))));h=g[S-1],c=h[n],c>=r&&c<=t&&d.push(h),a=d[d.length-1],i&&a&&(d[0][0]!==a[0]||d[0][1]!==a[1])&&d.push(d[0]),newSlice(l,d,v,m,w)}return l}function newSlice(e,r,t,n,u){return r.length&&(r.area=t,r.dist=n,void 0!==u&&(r.outer=u),e.push(r)),[]}module.exports=clip;var createFeature=require("./feature");
	},{"./feature":143}],142:[function(require,module,exports){
	"use strict";function convert(e,t){var r=[];if("FeatureCollection"===e.type)for(var o=0;o<e.features.length;o++)convertFeature(r,e.features[o],t);else"Feature"===e.type?convertFeature(r,e,t):convertFeature(r,{geometry:e},t);return r}function convertFeature(e,t,r){if(null!==t.geometry){var o,a,i,n,u=t.geometry,c=u.type,l=u.coordinates,s=t.properties,p=t.id;if("Point"===c)e.push(createFeature(s,1,[projectPoint(l)],p));else if("MultiPoint"===c)e.push(createFeature(s,1,project(l),p));else if("LineString"===c)e.push(createFeature(s,2,[project(l,r)],p));else if("MultiLineString"===c||"Polygon"===c){for(i=[],o=0;o<l.length;o++)n=project(l[o],r),"Polygon"===c&&(n.outer=0===o),i.push(n);e.push(createFeature(s,"Polygon"===c?3:2,i,p))}else if("MultiPolygon"===c){for(i=[],o=0;o<l.length;o++)for(a=0;a<l[o].length;a++)n=project(l[o][a],r),n.outer=0===a,i.push(n);e.push(createFeature(s,3,i,p))}else{if("GeometryCollection"!==c)throw new Error("Input data is not a valid GeoJSON object.");for(o=0;o<u.geometries.length;o++)convertFeature(e,{geometry:u.geometries[o],properties:s},r)}}}function project(e,t){for(var r=[],o=0;o<e.length;o++)r.push(projectPoint(e[o]));return t&&(simplify(r,t),calcSize(r)),r}function projectPoint(e){var t=Math.sin(e[1]*Math.PI/180),r=e[0]/360+.5,o=.5-.25*Math.log((1+t)/(1-t))/Math.PI;return o=o<0?0:o>1?1:o,[r,o,0]}function calcSize(e){for(var t,r,o=0,a=0,i=0;i<e.length-1;i++)t=r||e[i],r=e[i+1],o+=t[0]*r[1]-r[0]*t[1],a+=Math.abs(r[0]-t[0])+Math.abs(r[1]-t[1]);e.area=Math.abs(o/2),e.dist=a}module.exports=convert;var simplify=require("./simplify"),createFeature=require("./feature");
	},{"./feature":143,"./simplify":145}],143:[function(require,module,exports){
	"use strict";function createFeature(e,t,a,n){var r={id:n||null,type:t,geometry:a,tags:e||null,min:[1/0,1/0],max:[-(1/0),-(1/0)]};return calcBBox(r),r}function calcBBox(e){var t=e.geometry,a=e.min,n=e.max;if(1===e.type)calcRingBBox(a,n,t);else for(var r=0;r<t.length;r++)calcRingBBox(a,n,t[r]);return e}function calcRingBBox(e,t,a){for(var n,r=0;r<a.length;r++)n=a[r],e[0]=Math.min(n[0],e[0]),t[0]=Math.max(n[0],t[0]),e[1]=Math.min(n[1],e[1]),t[1]=Math.max(n[1],t[1])}module.exports=createFeature;
	},{}],144:[function(require,module,exports){
	"use strict";function geojsonvt(e,t){return new GeoJSONVT(e,t)}function GeoJSONVT(e,t){t=this.options=extend(Object.create(this.options),t);var i=t.debug;i&&console.time("preprocess data");var o=1<<t.maxZoom,n=convert(e,t.tolerance/(o*t.extent));this.tiles={},this.tileCoords=[],i&&(console.timeEnd("preprocess data"),console.log("index: maxZoom: %d, maxPoints: %d",t.indexMaxZoom,t.indexMaxPoints),console.time("generate tiles"),this.stats={},this.total=0),n=wrap(n,t.buffer/t.extent,intersectX),n.length&&this.splitTile(n,0,0,0),i&&(n.length&&console.log("features: %d, points: %d",this.tiles[0].numFeatures,this.tiles[0].numPoints),console.timeEnd("generate tiles"),console.log("tiles generated:",this.total,JSON.stringify(this.stats)))}function toID(e,t,i){return 32*((1<<e)*i+t)+e}function intersectX(e,t,i){return[i,(i-e[0])*(t[1]-e[1])/(t[0]-e[0])+e[1],1]}function intersectY(e,t,i){return[(i-e[1])*(t[0]-e[0])/(t[1]-e[1])+e[0],i,1]}function extend(e,t){for(var i in t)e[i]=t[i];return e}function isClippedSquare(e,t,i){var o=e.source;if(1!==o.length)return!1;var n=o[0];if(3!==n.type||n.geometry.length>1)return!1;var r=n.geometry[0].length;if(5!==r)return!1;for(var s=0;s<r;s++){var l=transform.point(n.geometry[0][s],t,e.z2,e.x,e.y);if(l[0]!==-i&&l[0]!==t+i||l[1]!==-i&&l[1]!==t+i)return!1}return!0}module.exports=geojsonvt;var convert=require("./convert"),transform=require("./transform"),clip=require("./clip"),wrap=require("./wrap"),createTile=require("./tile");GeoJSONVT.prototype.options={maxZoom:14,indexMaxZoom:5,indexMaxPoints:1e5,solidChildren:!1,tolerance:3,extent:4096,buffer:64,debug:0},GeoJSONVT.prototype.splitTile=function(e,t,i,o,n,r,s){for(var l=[e,t,i,o],a=this.options,u=a.debug,c=null;l.length;){o=l.pop(),i=l.pop(),t=l.pop(),e=l.pop();var p=1<<t,d=toID(t,i,o),m=this.tiles[d],f=t===a.maxZoom?0:a.tolerance/(p*a.extent);if(!m&&(u>1&&console.time("creation"),m=this.tiles[d]=createTile(e,p,i,o,f,t===a.maxZoom),this.tileCoords.push({z:t,x:i,y:o}),u)){u>1&&(console.log("tile z%d-%d-%d (features: %d, points: %d, simplified: %d)",t,i,o,m.numFeatures,m.numPoints,m.numSimplified),console.timeEnd("creation"));var h="z"+t;this.stats[h]=(this.stats[h]||0)+1,this.total++}if(m.source=e,n){if(t===a.maxZoom||t===n)continue;var x=1<<n-t;if(i!==Math.floor(r/x)||o!==Math.floor(s/x))continue}else if(t===a.indexMaxZoom||m.numPoints<=a.indexMaxPoints)continue;if(a.solidChildren||!isClippedSquare(m,a.extent,a.buffer)){m.source=null,u>1&&console.time("clipping");var g,v,M,T,b,y,S=.5*a.buffer/a.extent,Z=.5-S,q=.5+S,w=1+S;g=v=M=T=null,b=clip(e,p,i-S,i+q,0,intersectX,m.min[0],m.max[0]),y=clip(e,p,i+Z,i+w,0,intersectX,m.min[0],m.max[0]),b&&(g=clip(b,p,o-S,o+q,1,intersectY,m.min[1],m.max[1]),v=clip(b,p,o+Z,o+w,1,intersectY,m.min[1],m.max[1])),y&&(M=clip(y,p,o-S,o+q,1,intersectY,m.min[1],m.max[1]),T=clip(y,p,o+Z,o+w,1,intersectY,m.min[1],m.max[1])),u>1&&console.timeEnd("clipping"),e.length&&(l.push(g||[],t+1,2*i,2*o),l.push(v||[],t+1,2*i,2*o+1),l.push(M||[],t+1,2*i+1,2*o),l.push(T||[],t+1,2*i+1,2*o+1))}else n&&(c=t)}return c},GeoJSONVT.prototype.getTile=function(e,t,i){var o=this.options,n=o.extent,r=o.debug,s=1<<e;t=(t%s+s)%s;var l=toID(e,t,i);if(this.tiles[l])return transform.tile(this.tiles[l],n);r>1&&console.log("drilling down to z%d-%d-%d",e,t,i);for(var a,u=e,c=t,p=i;!a&&u>0;)u--,c=Math.floor(c/2),p=Math.floor(p/2),a=this.tiles[toID(u,c,p)];if(!a||!a.source)return null;if(r>1&&console.log("found parent tile z%d-%d-%d",u,c,p),isClippedSquare(a,n,o.buffer))return transform.tile(a,n);r>1&&console.time("drilling down");var d=this.splitTile(a.source,u,c,p,e,t,i);if(r>1&&console.timeEnd("drilling down"),null!==d){var m=1<<e-d;l=toID(d,Math.floor(t/m),Math.floor(i/m))}return this.tiles[l]?transform.tile(this.tiles[l],n):null};
	},{"./clip":141,"./convert":142,"./tile":146,"./transform":147,"./wrap":148}],145:[function(require,module,exports){
	"use strict";function simplify(t,i){var e,p,r,s,o=i*i,f=t.length,u=0,n=f-1,g=[];for(t[u][2]=1,t[n][2]=1;n;){for(p=0,e=u+1;e<n;e++)r=getSqSegDist(t[e],t[u],t[n]),r>p&&(s=e,p=r);p>o?(t[s][2]=p,g.push(u),g.push(s),u=s):(n=g.pop(),u=g.pop())}}function getSqSegDist(t,i,e){var p=i[0],r=i[1],s=e[0],o=e[1],f=t[0],u=t[1],n=s-p,g=o-r;if(0!==n||0!==g){var l=((f-p)*n+(u-r)*g)/(n*n+g*g);l>1?(p=s,r=o):l>0&&(p+=n*l,r+=g*l)}return n=f-p,g=u-r,n*n+g*g}module.exports=simplify;
	},{}],146:[function(require,module,exports){
	"use strict";function createTile(e,n,r,i,t,u){for(var a={features:[],numPoints:0,numSimplified:0,numFeatures:0,source:null,x:r,y:i,z2:n,transformed:!1,min:[2,1],max:[-1,0]},m=0;m<e.length;m++){a.numFeatures++,addFeature(a,e[m],t,u);var s=e[m].min,l=e[m].max;s[0]<a.min[0]&&(a.min[0]=s[0]),s[1]<a.min[1]&&(a.min[1]=s[1]),l[0]>a.max[0]&&(a.max[0]=l[0]),l[1]>a.max[1]&&(a.max[1]=l[1])}return a}function addFeature(e,n,r,i){var t,u,a,m,s=n.geometry,l=n.type,o=[],f=r*r;if(1===l)for(t=0;t<s.length;t++)o.push(s[t]),e.numPoints++,e.numSimplified++;else for(t=0;t<s.length;t++)if(a=s[t],i||!(2===l&&a.dist<r||3===l&&a.area<f)){var d=[];for(u=0;u<a.length;u++)m=a[u],(i||m[2]>f)&&(d.push(m),e.numSimplified++),e.numPoints++;3===l&&rewind(d,a.outer),o.push(d)}else e.numPoints+=a.length;if(o.length){var g={geometry:o,type:l,tags:n.tags||null};null!==n.id&&(g.id=n.id),e.features.push(g)}}function rewind(e,n){var r=signedArea(e);r<0===n&&e.reverse()}function signedArea(e){for(var n,r,i=0,t=0,u=e.length,a=u-1;t<u;a=t++)n=e[t],r=e[a],i+=(r[0]-n[0])*(n[1]+r[1]);return i}module.exports=createTile;
	},{}],147:[function(require,module,exports){
	"use strict";function transformTile(r,t){if(r.transformed)return r;var n,e,o,f=r.z2,a=r.x,s=r.y;for(n=0;n<r.features.length;n++){var i=r.features[n],u=i.geometry,m=i.type;if(1===m)for(e=0;e<u.length;e++)u[e]=transformPoint(u[e],t,f,a,s);else for(e=0;e<u.length;e++){var l=u[e];for(o=0;o<l.length;o++)l[o]=transformPoint(l[o],t,f,a,s)}}return r.transformed=!0,r}function transformPoint(r,t,n,e,o){var f=Math.round(t*(r[0]*n-e)),a=Math.round(t*(r[1]*n-o));return[f,a]}exports.tile=transformTile,exports.point=transformPoint;
	},{}],148:[function(require,module,exports){
	"use strict";function wrap(r,e,t){var o=r,a=clip(r,1,-1-e,e,0,t,-1,2),s=clip(r,1,1-e,2+e,0,t,-1,2);return(a||s)&&(o=clip(r,1,-e,1+e,0,t,-1,2)||[],a&&(o=shiftFeatureCoords(a,1).concat(o)),s&&(o=o.concat(shiftFeatureCoords(s,-1)))),o}function shiftFeatureCoords(r,e){for(var t=[],o=0;o<r.length;o++){var a,s=r[o],i=s.type;if(1===i)a=shiftCoords(s.geometry,e);else{a=[];for(var u=0;u<s.geometry.length;u++)a.push(shiftCoords(s.geometry[u],e))}t.push(createFeature(s.tags,i,a,s.id))}return t}function shiftCoords(r,e){var t=[];t.area=r.area,t.dist=r.dist;for(var o=0;o<r.length;o++)t.push([r[o][0]+e,r[o][1],r[o][2]]);return t}var clip=require("./clip"),createFeature=require("./feature");module.exports=wrap;
	},{"./clip":141,"./feature":143}],149:[function(require,module,exports){
	exports.glMatrix=require("./gl-matrix/common.js"),exports.mat2=require("./gl-matrix/mat2.js"),exports.mat2d=require("./gl-matrix/mat2d.js"),exports.mat3=require("./gl-matrix/mat3.js"),exports.mat4=require("./gl-matrix/mat4.js"),exports.quat=require("./gl-matrix/quat.js"),exports.vec2=require("./gl-matrix/vec2.js"),exports.vec3=require("./gl-matrix/vec3.js"),exports.vec4=require("./gl-matrix/vec4.js");
	},{"./gl-matrix/common.js":150,"./gl-matrix/mat2.js":151,"./gl-matrix/mat2d.js":152,"./gl-matrix/mat3.js":153,"./gl-matrix/mat4.js":154,"./gl-matrix/quat.js":155,"./gl-matrix/vec2.js":156,"./gl-matrix/vec3.js":157,"./gl-matrix/vec4.js":158}],150:[function(require,module,exports){
	var glMatrix={};glMatrix.EPSILON=1e-6,glMatrix.ARRAY_TYPE="undefined"!=typeof Float32Array?Float32Array:Array,glMatrix.RANDOM=Math.random,glMatrix.ENABLE_SIMD=!1,glMatrix.SIMD_AVAILABLE=glMatrix.ARRAY_TYPE===Float32Array&&"SIMD"in this,glMatrix.USE_SIMD=glMatrix.ENABLE_SIMD&&glMatrix.SIMD_AVAILABLE,glMatrix.setMatrixArrayType=function(a){glMatrix.ARRAY_TYPE=a};var degree=Math.PI/180;glMatrix.toRadian=function(a){return a*degree},glMatrix.equals=function(a,r){return Math.abs(a-r)<=glMatrix.EPSILON*Math.max(1,Math.abs(a),Math.abs(r))},module.exports=glMatrix;
	},{}],151:[function(require,module,exports){
	var glMatrix=require("./common.js"),mat2={};mat2.create=function(){var t=new glMatrix.ARRAY_TYPE(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},mat2.clone=function(t){var a=new glMatrix.ARRAY_TYPE(4);return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a},mat2.copy=function(t,a){return t[0]=a[0],t[1]=a[1],t[2]=a[2],t[3]=a[3],t},mat2.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},mat2.fromValues=function(t,a,n,r){var u=new glMatrix.ARRAY_TYPE(4);return u[0]=t,u[1]=a,u[2]=n,u[3]=r,u},mat2.set=function(t,a,n,r,u){return t[0]=a,t[1]=n,t[2]=r,t[3]=u,t},mat2.transpose=function(t,a){if(t===a){var n=a[1];t[1]=a[2],t[2]=n}else t[0]=a[0],t[1]=a[2],t[2]=a[1],t[3]=a[3];return t},mat2.invert=function(t,a){var n=a[0],r=a[1],u=a[2],e=a[3],i=n*e-u*r;return i?(i=1/i,t[0]=e*i,t[1]=-r*i,t[2]=-u*i,t[3]=n*i,t):null},mat2.adjoint=function(t,a){var n=a[0];return t[0]=a[3],t[1]=-a[1],t[2]=-a[2],t[3]=n,t},mat2.determinant=function(t){return t[0]*t[3]-t[2]*t[1]},mat2.multiply=function(t,a,n){var r=a[0],u=a[1],e=a[2],i=a[3],m=n[0],o=n[1],c=n[2],M=n[3];return t[0]=r*m+e*o,t[1]=u*m+i*o,t[2]=r*c+e*M,t[3]=u*c+i*M,t},mat2.mul=mat2.multiply,mat2.rotate=function(t,a,n){var r=a[0],u=a[1],e=a[2],i=a[3],m=Math.sin(n),o=Math.cos(n);return t[0]=r*o+e*m,t[1]=u*o+i*m,t[2]=r*-m+e*o,t[3]=u*-m+i*o,t},mat2.scale=function(t,a,n){var r=a[0],u=a[1],e=a[2],i=a[3],m=n[0],o=n[1];return t[0]=r*m,t[1]=u*m,t[2]=e*o,t[3]=i*o,t},mat2.fromRotation=function(t,a){var n=Math.sin(a),r=Math.cos(a);return t[0]=r,t[1]=n,t[2]=-n,t[3]=r,t},mat2.fromScaling=function(t,a){return t[0]=a[0],t[1]=0,t[2]=0,t[3]=a[1],t},mat2.str=function(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},mat2.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))},mat2.LDU=function(t,a,n,r){return t[2]=r[2]/r[0],n[0]=r[0],n[1]=r[1],n[3]=r[3]-t[2]*n[1],[t,a,n]},mat2.add=function(t,a,n){return t[0]=a[0]+n[0],t[1]=a[1]+n[1],t[2]=a[2]+n[2],t[3]=a[3]+n[3],t},mat2.subtract=function(t,a,n){return t[0]=a[0]-n[0],t[1]=a[1]-n[1],t[2]=a[2]-n[2],t[3]=a[3]-n[3],t},mat2.sub=mat2.subtract,mat2.exactEquals=function(t,a){return t[0]===a[0]&&t[1]===a[1]&&t[2]===a[2]&&t[3]===a[3]},mat2.equals=function(t,a){var n=t[0],r=t[1],u=t[2],e=t[3],i=a[0],m=a[1],o=a[2],c=a[3];return Math.abs(n-i)<=glMatrix.EPSILON*Math.max(1,Math.abs(n),Math.abs(i))&&Math.abs(r-m)<=glMatrix.EPSILON*Math.max(1,Math.abs(r),Math.abs(m))&&Math.abs(u-o)<=glMatrix.EPSILON*Math.max(1,Math.abs(u),Math.abs(o))&&Math.abs(e-c)<=glMatrix.EPSILON*Math.max(1,Math.abs(e),Math.abs(c))},mat2.multiplyScalar=function(t,a,n){return t[0]=a[0]*n,t[1]=a[1]*n,t[2]=a[2]*n,t[3]=a[3]*n,t},mat2.multiplyScalarAndAdd=function(t,a,n,r){return t[0]=a[0]+n[0]*r,t[1]=a[1]+n[1]*r,t[2]=a[2]+n[2]*r,t[3]=a[3]+n[3]*r,t},module.exports=mat2;
	},{"./common.js":150}],152:[function(require,module,exports){
	var glMatrix=require("./common.js"),mat2d={};mat2d.create=function(){var t=new glMatrix.ARRAY_TYPE(6);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},mat2d.clone=function(t){var a=new glMatrix.ARRAY_TYPE(6);return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[4]=t[4],a[5]=t[5],a},mat2d.copy=function(t,a){return t[0]=a[0],t[1]=a[1],t[2]=a[2],t[3]=a[3],t[4]=a[4],t[5]=a[5],t},mat2d.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},mat2d.fromValues=function(t,a,n,r,u,m){var i=new glMatrix.ARRAY_TYPE(6);return i[0]=t,i[1]=a,i[2]=n,i[3]=r,i[4]=u,i[5]=m,i},mat2d.set=function(t,a,n,r,u,m,i){return t[0]=a,t[1]=n,t[2]=r,t[3]=u,t[4]=m,t[5]=i,t},mat2d.invert=function(t,a){var n=a[0],r=a[1],u=a[2],m=a[3],i=a[4],o=a[5],M=n*m-r*u;return M?(M=1/M,t[0]=m*M,t[1]=-r*M,t[2]=-u*M,t[3]=n*M,t[4]=(u*o-m*i)*M,t[5]=(r*i-n*o)*M,t):null},mat2d.determinant=function(t){return t[0]*t[3]-t[1]*t[2]},mat2d.multiply=function(t,a,n){var r=a[0],u=a[1],m=a[2],i=a[3],o=a[4],M=a[5],e=n[0],d=n[1],c=n[2],s=n[3],h=n[4],l=n[5];return t[0]=r*e+m*d,t[1]=u*e+i*d,t[2]=r*c+m*s,t[3]=u*c+i*s,t[4]=r*h+m*l+o,t[5]=u*h+i*l+M,t},mat2d.mul=mat2d.multiply,mat2d.rotate=function(t,a,n){var r=a[0],u=a[1],m=a[2],i=a[3],o=a[4],M=a[5],e=Math.sin(n),d=Math.cos(n);return t[0]=r*d+m*e,t[1]=u*d+i*e,t[2]=r*-e+m*d,t[3]=u*-e+i*d,t[4]=o,t[5]=M,t},mat2d.scale=function(t,a,n){var r=a[0],u=a[1],m=a[2],i=a[3],o=a[4],M=a[5],e=n[0],d=n[1];return t[0]=r*e,t[1]=u*e,t[2]=m*d,t[3]=i*d,t[4]=o,t[5]=M,t},mat2d.translate=function(t,a,n){var r=a[0],u=a[1],m=a[2],i=a[3],o=a[4],M=a[5],e=n[0],d=n[1];return t[0]=r,t[1]=u,t[2]=m,t[3]=i,t[4]=r*e+m*d+o,t[5]=u*e+i*d+M,t},mat2d.fromRotation=function(t,a){var n=Math.sin(a),r=Math.cos(a);return t[0]=r,t[1]=n,t[2]=-n,t[3]=r,t[4]=0,t[5]=0,t},mat2d.fromScaling=function(t,a){return t[0]=a[0],t[1]=0,t[2]=0,t[3]=a[1],t[4]=0,t[5]=0,t},mat2d.fromTranslation=function(t,a){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=a[0],t[5]=a[1],t},mat2d.str=function(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"},mat2d.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+1)},mat2d.add=function(t,a,n){return t[0]=a[0]+n[0],t[1]=a[1]+n[1],t[2]=a[2]+n[2],t[3]=a[3]+n[3],t[4]=a[4]+n[4],t[5]=a[5]+n[5],t},mat2d.subtract=function(t,a,n){return t[0]=a[0]-n[0],t[1]=a[1]-n[1],t[2]=a[2]-n[2],t[3]=a[3]-n[3],t[4]=a[4]-n[4],t[5]=a[5]-n[5],t},mat2d.sub=mat2d.subtract,mat2d.multiplyScalar=function(t,a,n){return t[0]=a[0]*n,t[1]=a[1]*n,t[2]=a[2]*n,t[3]=a[3]*n,t[4]=a[4]*n,t[5]=a[5]*n,t},mat2d.multiplyScalarAndAdd=function(t,a,n,r){return t[0]=a[0]+n[0]*r,t[1]=a[1]+n[1]*r,t[2]=a[2]+n[2]*r,t[3]=a[3]+n[3]*r,t[4]=a[4]+n[4]*r,t[5]=a[5]+n[5]*r,t},mat2d.exactEquals=function(t,a){return t[0]===a[0]&&t[1]===a[1]&&t[2]===a[2]&&t[3]===a[3]&&t[4]===a[4]&&t[5]===a[5]},mat2d.equals=function(t,a){var n=t[0],r=t[1],u=t[2],m=t[3],i=t[4],o=t[5],M=a[0],e=a[1],d=a[2],c=a[3],s=a[4],h=a[5];return Math.abs(n-M)<=glMatrix.EPSILON*Math.max(1,Math.abs(n),Math.abs(M))&&Math.abs(r-e)<=glMatrix.EPSILON*Math.max(1,Math.abs(r),Math.abs(e))&&Math.abs(u-d)<=glMatrix.EPSILON*Math.max(1,Math.abs(u),Math.abs(d))&&Math.abs(m-c)<=glMatrix.EPSILON*Math.max(1,Math.abs(m),Math.abs(c))&&Math.abs(i-s)<=glMatrix.EPSILON*Math.max(1,Math.abs(i),Math.abs(s))&&Math.abs(o-h)<=glMatrix.EPSILON*Math.max(1,Math.abs(o),Math.abs(h))},module.exports=mat2d;
	},{"./common.js":150}],153:[function(require,module,exports){
	var glMatrix=require("./common.js"),mat3={};mat3.create=function(){var t=new glMatrix.ARRAY_TYPE(9);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},mat3.fromMat4=function(t,a){return t[0]=a[0],t[1]=a[1],t[2]=a[2],t[3]=a[4],t[4]=a[5],t[5]=a[6],t[6]=a[8],t[7]=a[9],t[8]=a[10],t},mat3.clone=function(t){var a=new glMatrix.ARRAY_TYPE(9);return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[8]=t[8],a},mat3.copy=function(t,a){return t[0]=a[0],t[1]=a[1],t[2]=a[2],t[3]=a[3],t[4]=a[4],t[5]=a[5],t[6]=a[6],t[7]=a[7],t[8]=a[8],t},mat3.fromValues=function(t,a,r,n,u,M,m,o,i){var e=new glMatrix.ARRAY_TYPE(9);return e[0]=t,e[1]=a,e[2]=r,e[3]=n,e[4]=u,e[5]=M,e[6]=m,e[7]=o,e[8]=i,e},mat3.set=function(t,a,r,n,u,M,m,o,i,e){return t[0]=a,t[1]=r,t[2]=n,t[3]=u,t[4]=M,t[5]=m,t[6]=o,t[7]=i,t[8]=e,t},mat3.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},mat3.transpose=function(t,a){if(t===a){var r=a[1],n=a[2],u=a[5];t[1]=a[3],t[2]=a[6],t[3]=r,t[5]=a[7],t[6]=n,t[7]=u}else t[0]=a[0],t[1]=a[3],t[2]=a[6],t[3]=a[1],t[4]=a[4],t[5]=a[7],t[6]=a[2],t[7]=a[5],t[8]=a[8];return t},mat3.invert=function(t,a){var r=a[0],n=a[1],u=a[2],M=a[3],m=a[4],o=a[5],i=a[6],e=a[7],h=a[8],s=h*m-o*e,c=-h*M+o*i,l=e*M-m*i,f=r*s+n*c+u*l;return f?(f=1/f,t[0]=s*f,t[1]=(-h*n+u*e)*f,t[2]=(o*n-u*m)*f,t[3]=c*f,t[4]=(h*r-u*i)*f,t[5]=(-o*r+u*M)*f,t[6]=l*f,t[7]=(-e*r+n*i)*f,t[8]=(m*r-n*M)*f,t):null},mat3.adjoint=function(t,a){var r=a[0],n=a[1],u=a[2],M=a[3],m=a[4],o=a[5],i=a[6],e=a[7],h=a[8];return t[0]=m*h-o*e,t[1]=u*e-n*h,t[2]=n*o-u*m,t[3]=o*i-M*h,t[4]=r*h-u*i,t[5]=u*M-r*o,t[6]=M*e-m*i,t[7]=n*i-r*e,t[8]=r*m-n*M,t},mat3.determinant=function(t){var a=t[0],r=t[1],n=t[2],u=t[3],M=t[4],m=t[5],o=t[6],i=t[7],e=t[8];return a*(e*M-m*i)+r*(-e*u+m*o)+n*(i*u-M*o)},mat3.multiply=function(t,a,r){var n=a[0],u=a[1],M=a[2],m=a[3],o=a[4],i=a[5],e=a[6],h=a[7],s=a[8],c=r[0],l=r[1],f=r[2],b=r[3],x=r[4],v=r[5],p=r[6],g=r[7],E=r[8];return t[0]=c*n+l*m+f*e,t[1]=c*u+l*o+f*h,t[2]=c*M+l*i+f*s,t[3]=b*n+x*m+v*e,t[4]=b*u+x*o+v*h,t[5]=b*M+x*i+v*s,t[6]=p*n+g*m+E*e,t[7]=p*u+g*o+E*h,t[8]=p*M+g*i+E*s,t},mat3.mul=mat3.multiply,mat3.translate=function(t,a,r){var n=a[0],u=a[1],M=a[2],m=a[3],o=a[4],i=a[5],e=a[6],h=a[7],s=a[8],c=r[0],l=r[1];return t[0]=n,t[1]=u,t[2]=M,t[3]=m,t[4]=o,t[5]=i,t[6]=c*n+l*m+e,t[7]=c*u+l*o+h,t[8]=c*M+l*i+s,t},mat3.rotate=function(t,a,r){var n=a[0],u=a[1],M=a[2],m=a[3],o=a[4],i=a[5],e=a[6],h=a[7],s=a[8],c=Math.sin(r),l=Math.cos(r);return t[0]=l*n+c*m,t[1]=l*u+c*o,t[2]=l*M+c*i,t[3]=l*m-c*n,t[4]=l*o-c*u,t[5]=l*i-c*M,t[6]=e,t[7]=h,t[8]=s,t},mat3.scale=function(t,a,r){var n=r[0],u=r[1];return t[0]=n*a[0],t[1]=n*a[1],t[2]=n*a[2],t[3]=u*a[3],t[4]=u*a[4],t[5]=u*a[5],t[6]=a[6],t[7]=a[7],t[8]=a[8],t},mat3.fromTranslation=function(t,a){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=a[0],t[7]=a[1],t[8]=1,t},mat3.fromRotation=function(t,a){var r=Math.sin(a),n=Math.cos(a);return t[0]=n,t[1]=r,t[2]=0,t[3]=-r,t[4]=n,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},mat3.fromScaling=function(t,a){return t[0]=a[0],t[1]=0,t[2]=0,t[3]=0,t[4]=a[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},mat3.fromMat2d=function(t,a){return t[0]=a[0],t[1]=a[1],t[2]=0,t[3]=a[2],t[4]=a[3],t[5]=0,t[6]=a[4],t[7]=a[5],t[8]=1,t},mat3.fromQuat=function(t,a){var r=a[0],n=a[1],u=a[2],M=a[3],m=r+r,o=n+n,i=u+u,e=r*m,h=n*m,s=n*o,c=u*m,l=u*o,f=u*i,b=M*m,x=M*o,v=M*i;return t[0]=1-s-f,t[3]=h-v,t[6]=c+x,t[1]=h+v,t[4]=1-e-f,t[7]=l-b,t[2]=c-x,t[5]=l+b,t[8]=1-e-s,t},mat3.normalFromMat4=function(t,a){var r=a[0],n=a[1],u=a[2],M=a[3],m=a[4],o=a[5],i=a[6],e=a[7],h=a[8],s=a[9],c=a[10],l=a[11],f=a[12],b=a[13],x=a[14],v=a[15],p=r*o-n*m,g=r*i-u*m,E=r*e-M*m,w=n*i-u*o,P=n*e-M*o,S=u*e-M*i,d=h*b-s*f,I=h*x-c*f,L=h*v-l*f,N=s*x-c*b,O=s*v-l*b,A=c*v-l*x,R=p*A-g*O+E*N+w*L-P*I+S*d;return R?(R=1/R,t[0]=(o*A-i*O+e*N)*R,t[1]=(i*L-m*A-e*I)*R,t[2]=(m*O-o*L+e*d)*R,t[3]=(u*O-n*A-M*N)*R,t[4]=(r*A-u*L+M*I)*R,t[5]=(n*L-r*O-M*d)*R,t[6]=(b*S-x*P+v*w)*R,t[7]=(x*E-f*S-v*g)*R,t[8]=(f*P-b*E+v*p)*R,t):null},mat3.str=function(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"},mat3.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2))},mat3.add=function(t,a,r){return t[0]=a[0]+r[0],t[1]=a[1]+r[1],t[2]=a[2]+r[2],t[3]=a[3]+r[3],t[4]=a[4]+r[4],t[5]=a[5]+r[5],t[6]=a[6]+r[6],t[7]=a[7]+r[7],t[8]=a[8]+r[8],t},mat3.subtract=function(t,a,r){return t[0]=a[0]-r[0],t[1]=a[1]-r[1],t[2]=a[2]-r[2],t[3]=a[3]-r[3],t[4]=a[4]-r[4],t[5]=a[5]-r[5],t[6]=a[6]-r[6],t[7]=a[7]-r[7],t[8]=a[8]-r[8],t},mat3.sub=mat3.subtract,mat3.multiplyScalar=function(t,a,r){return t[0]=a[0]*r,t[1]=a[1]*r,t[2]=a[2]*r,t[3]=a[3]*r,t[4]=a[4]*r,t[5]=a[5]*r,t[6]=a[6]*r,t[7]=a[7]*r,t[8]=a[8]*r,t},mat3.multiplyScalarAndAdd=function(t,a,r,n){return t[0]=a[0]+r[0]*n,t[1]=a[1]+r[1]*n,t[2]=a[2]+r[2]*n,t[3]=a[3]+r[3]*n,t[4]=a[4]+r[4]*n,t[5]=a[5]+r[5]*n,t[6]=a[6]+r[6]*n,t[7]=a[7]+r[7]*n,t[8]=a[8]+r[8]*n,t},mat3.exactEquals=function(t,a){return t[0]===a[0]&&t[1]===a[1]&&t[2]===a[2]&&t[3]===a[3]&&t[4]===a[4]&&t[5]===a[5]&&t[6]===a[6]&&t[7]===a[7]&&t[8]===a[8]},mat3.equals=function(t,a){var r=t[0],n=t[1],u=t[2],M=t[3],m=t[4],o=t[5],i=t[6],e=t[7],h=t[8],s=a[0],c=a[1],l=a[2],f=a[3],b=a[4],x=a[5],v=t[6],p=a[7],g=a[8];return Math.abs(r-s)<=glMatrix.EPSILON*Math.max(1,Math.abs(r),Math.abs(s))&&Math.abs(n-c)<=glMatrix.EPSILON*Math.max(1,Math.abs(n),Math.abs(c))&&Math.abs(u-l)<=glMatrix.EPSILON*Math.max(1,Math.abs(u),Math.abs(l))&&Math.abs(M-f)<=glMatrix.EPSILON*Math.max(1,Math.abs(M),Math.abs(f))&&Math.abs(m-b)<=glMatrix.EPSILON*Math.max(1,Math.abs(m),Math.abs(b))&&Math.abs(o-x)<=glMatrix.EPSILON*Math.max(1,Math.abs(o),Math.abs(x))&&Math.abs(i-v)<=glMatrix.EPSILON*Math.max(1,Math.abs(i),Math.abs(v))&&Math.abs(e-p)<=glMatrix.EPSILON*Math.max(1,Math.abs(e),Math.abs(p))&&Math.abs(h-g)<=glMatrix.EPSILON*Math.max(1,Math.abs(h),Math.abs(g))},module.exports=mat3;
	},{"./common.js":150}],154:[function(require,module,exports){
	var glMatrix=require("./common.js"),mat4={scalar:{},SIMD:{}};mat4.create=function(){var a=new glMatrix.ARRAY_TYPE(16);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},mat4.clone=function(a){var t=new glMatrix.ARRAY_TYPE(16);return t[0]=a[0],t[1]=a[1],t[2]=a[2],t[3]=a[3],t[4]=a[4],t[5]=a[5],t[6]=a[6],t[7]=a[7],t[8]=a[8],t[9]=a[9],t[10]=a[10],t[11]=a[11],t[12]=a[12],t[13]=a[13],t[14]=a[14],t[15]=a[15],t},mat4.copy=function(a,t){return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[8]=t[8],a[9]=t[9],a[10]=t[10],a[11]=t[11],a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15],a},mat4.fromValues=function(a,t,l,o,M,S,x,I,D,F,r,s,u,e,m,n){var i=new glMatrix.ARRAY_TYPE(16);return i[0]=a,i[1]=t,i[2]=l,i[3]=o,i[4]=M,i[5]=S,i[6]=x,i[7]=I,i[8]=D,i[9]=F,i[10]=r,i[11]=s,i[12]=u,i[13]=e,i[14]=m,i[15]=n,i},mat4.set=function(a,t,l,o,M,S,x,I,D,F,r,s,u,e,m,n,i){return a[0]=t,a[1]=l,a[2]=o,a[3]=M,a[4]=S,a[5]=x,a[6]=I,a[7]=D,a[8]=F,a[9]=r,a[10]=s,a[11]=u,a[12]=e,a[13]=m,a[14]=n,a[15]=i,a},mat4.identity=function(a){return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},mat4.scalar.transpose=function(a,t){if(a===t){var l=t[1],o=t[2],M=t[3],S=t[6],x=t[7],I=t[11];a[1]=t[4],a[2]=t[8],a[3]=t[12],a[4]=l,a[6]=t[9],a[7]=t[13],a[8]=o,a[9]=S,a[11]=t[14],a[12]=M,a[13]=x,a[14]=I}else a[0]=t[0],a[1]=t[4],a[2]=t[8],a[3]=t[12],a[4]=t[1],a[5]=t[5],a[6]=t[9],a[7]=t[13],a[8]=t[2],a[9]=t[6],a[10]=t[10],a[11]=t[14],a[12]=t[3],a[13]=t[7],a[14]=t[11],a[15]=t[15];return a},mat4.SIMD.transpose=function(a,t){var l,o,M,S,x,I,D,F,r,s;return l=SIMD.Float32x4.load(t,0),o=SIMD.Float32x4.load(t,4),M=SIMD.Float32x4.load(t,8),S=SIMD.Float32x4.load(t,12),x=SIMD.Float32x4.shuffle(l,o,0,1,4,5),I=SIMD.Float32x4.shuffle(M,S,0,1,4,5),D=SIMD.Float32x4.shuffle(x,I,0,2,4,6),F=SIMD.Float32x4.shuffle(x,I,1,3,5,7),SIMD.Float32x4.store(a,0,D),SIMD.Float32x4.store(a,4,F),x=SIMD.Float32x4.shuffle(l,o,2,3,6,7),I=SIMD.Float32x4.shuffle(M,S,2,3,6,7),r=SIMD.Float32x4.shuffle(x,I,0,2,4,6),s=SIMD.Float32x4.shuffle(x,I,1,3,5,7),SIMD.Float32x4.store(a,8,r),SIMD.Float32x4.store(a,12,s),a},mat4.transpose=glMatrix.USE_SIMD?mat4.SIMD.transpose:mat4.scalar.transpose,mat4.scalar.invert=function(a,t){var l=t[0],o=t[1],M=t[2],S=t[3],x=t[4],I=t[5],D=t[6],F=t[7],r=t[8],s=t[9],u=t[10],e=t[11],m=t[12],n=t[13],i=t[14],h=t[15],d=l*I-o*x,z=l*D-M*x,f=l*F-S*x,c=o*D-M*I,b=o*F-S*I,w=M*F-S*D,v=r*n-s*m,p=r*i-u*m,g=r*h-e*m,E=s*i-u*n,P=s*h-e*n,O=u*h-e*i,L=d*O-z*P+f*E+c*g-b*p+w*v;return L?(L=1/L,a[0]=(I*O-D*P+F*E)*L,a[1]=(M*P-o*O-S*E)*L,a[2]=(n*w-i*b+h*c)*L,a[3]=(u*b-s*w-e*c)*L,a[4]=(D*g-x*O-F*p)*L,a[5]=(l*O-M*g+S*p)*L,a[6]=(i*f-m*w-h*z)*L,a[7]=(r*w-u*f+e*z)*L,a[8]=(x*P-I*g+F*v)*L,a[9]=(o*g-l*P-S*v)*L,a[10]=(m*b-n*f+h*d)*L,a[11]=(s*f-r*b-e*d)*L,a[12]=(I*p-x*E-D*v)*L,a[13]=(l*E-o*p+M*v)*L,a[14]=(n*z-m*c-i*d)*L,a[15]=(r*c-s*z+u*d)*L,a):null},mat4.SIMD.invert=function(a,t){var l,o,M,S,x,I,D,F,r,s,u=SIMD.Float32x4.load(t,0),e=SIMD.Float32x4.load(t,4),m=SIMD.Float32x4.load(t,8),n=SIMD.Float32x4.load(t,12);return x=SIMD.Float32x4.shuffle(u,e,0,1,4,5),o=SIMD.Float32x4.shuffle(m,n,0,1,4,5),l=SIMD.Float32x4.shuffle(x,o,0,2,4,6),o=SIMD.Float32x4.shuffle(o,x,1,3,5,7),x=SIMD.Float32x4.shuffle(u,e,2,3,6,7),S=SIMD.Float32x4.shuffle(m,n,2,3,6,7),M=SIMD.Float32x4.shuffle(x,S,0,2,4,6),S=SIMD.Float32x4.shuffle(S,x,1,3,5,7),x=SIMD.Float32x4.mul(M,S),x=SIMD.Float32x4.swizzle(x,1,0,3,2),I=SIMD.Float32x4.mul(o,x),D=SIMD.Float32x4.mul(l,x),x=SIMD.Float32x4.swizzle(x,2,3,0,1),I=SIMD.Float32x4.sub(SIMD.Float32x4.mul(o,x),I),D=SIMD.Float32x4.sub(SIMD.Float32x4.mul(l,x),D),D=SIMD.Float32x4.swizzle(D,2,3,0,1),x=SIMD.Float32x4.mul(o,M),x=SIMD.Float32x4.swizzle(x,1,0,3,2),I=SIMD.Float32x4.add(SIMD.Float32x4.mul(S,x),I),r=SIMD.Float32x4.mul(l,x),x=SIMD.Float32x4.swizzle(x,2,3,0,1),I=SIMD.Float32x4.sub(I,SIMD.Float32x4.mul(S,x)),r=SIMD.Float32x4.sub(SIMD.Float32x4.mul(l,x),r),r=SIMD.Float32x4.swizzle(r,2,3,0,1),x=SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(o,2,3,0,1),S),x=SIMD.Float32x4.swizzle(x,1,0,3,2),M=SIMD.Float32x4.swizzle(M,2,3,0,1),I=SIMD.Float32x4.add(SIMD.Float32x4.mul(M,x),I),F=SIMD.Float32x4.mul(l,x),x=SIMD.Float32x4.swizzle(x,2,3,0,1),I=SIMD.Float32x4.sub(I,SIMD.Float32x4.mul(M,x)),F=SIMD.Float32x4.sub(SIMD.Float32x4.mul(l,x),F),F=SIMD.Float32x4.swizzle(F,2,3,0,1),x=SIMD.Float32x4.mul(l,o),x=SIMD.Float32x4.swizzle(x,1,0,3,2),F=SIMD.Float32x4.add(SIMD.Float32x4.mul(S,x),F),r=SIMD.Float32x4.sub(SIMD.Float32x4.mul(M,x),r),x=SIMD.Float32x4.swizzle(x,2,3,0,1),F=SIMD.Float32x4.sub(SIMD.Float32x4.mul(S,x),F),r=SIMD.Float32x4.sub(r,SIMD.Float32x4.mul(M,x)),x=SIMD.Float32x4.mul(l,S),x=SIMD.Float32x4.swizzle(x,1,0,3,2),D=SIMD.Float32x4.sub(D,SIMD.Float32x4.mul(M,x)),F=SIMD.Float32x4.add(SIMD.Float32x4.mul(o,x),F),x=SIMD.Float32x4.swizzle(x,2,3,0,1),D=SIMD.Float32x4.add(SIMD.Float32x4.mul(M,x),D),F=SIMD.Float32x4.sub(F,SIMD.Float32x4.mul(o,x)),x=SIMD.Float32x4.mul(l,M),x=SIMD.Float32x4.swizzle(x,1,0,3,2),D=SIMD.Float32x4.add(SIMD.Float32x4.mul(S,x),D),r=SIMD.Float32x4.sub(r,SIMD.Float32x4.mul(o,x)),x=SIMD.Float32x4.swizzle(x,2,3,0,1),D=SIMD.Float32x4.sub(D,SIMD.Float32x4.mul(S,x)),r=SIMD.Float32x4.add(SIMD.Float32x4.mul(o,x),r),s=SIMD.Float32x4.mul(l,I),s=SIMD.Float32x4.add(SIMD.Float32x4.swizzle(s,2,3,0,1),s),s=SIMD.Float32x4.add(SIMD.Float32x4.swizzle(s,1,0,3,2),s),x=SIMD.Float32x4.reciprocalApproximation(s),s=SIMD.Float32x4.sub(SIMD.Float32x4.add(x,x),SIMD.Float32x4.mul(s,SIMD.Float32x4.mul(x,x))),(s=SIMD.Float32x4.swizzle(s,0,0,0,0))?(SIMD.Float32x4.store(a,0,SIMD.Float32x4.mul(s,I)),SIMD.Float32x4.store(a,4,SIMD.Float32x4.mul(s,D)),SIMD.Float32x4.store(a,8,SIMD.Float32x4.mul(s,F)),SIMD.Float32x4.store(a,12,SIMD.Float32x4.mul(s,r)),a):null},mat4.invert=glMatrix.USE_SIMD?mat4.SIMD.invert:mat4.scalar.invert,mat4.scalar.adjoint=function(a,t){var l=t[0],o=t[1],M=t[2],S=t[3],x=t[4],I=t[5],D=t[6],F=t[7],r=t[8],s=t[9],u=t[10],e=t[11],m=t[12],n=t[13],i=t[14],h=t[15];return a[0]=I*(u*h-e*i)-s*(D*h-F*i)+n*(D*e-F*u),a[1]=-(o*(u*h-e*i)-s*(M*h-S*i)+n*(M*e-S*u)),a[2]=o*(D*h-F*i)-I*(M*h-S*i)+n*(M*F-S*D),a[3]=-(o*(D*e-F*u)-I*(M*e-S*u)+s*(M*F-S*D)),a[4]=-(x*(u*h-e*i)-r*(D*h-F*i)+m*(D*e-F*u)),a[5]=l*(u*h-e*i)-r*(M*h-S*i)+m*(M*e-S*u),a[6]=-(l*(D*h-F*i)-x*(M*h-S*i)+m*(M*F-S*D)),a[7]=l*(D*e-F*u)-x*(M*e-S*u)+r*(M*F-S*D),a[8]=x*(s*h-e*n)-r*(I*h-F*n)+m*(I*e-F*s),a[9]=-(l*(s*h-e*n)-r*(o*h-S*n)+m*(o*e-S*s)),a[10]=l*(I*h-F*n)-x*(o*h-S*n)+m*(o*F-S*I),a[11]=-(l*(I*e-F*s)-x*(o*e-S*s)+r*(o*F-S*I)),a[12]=-(x*(s*i-u*n)-r*(I*i-D*n)+m*(I*u-D*s)),a[13]=l*(s*i-u*n)-r*(o*i-M*n)+m*(o*u-M*s),a[14]=-(l*(I*i-D*n)-x*(o*i-M*n)+m*(o*D-M*I)),a[15]=l*(I*u-D*s)-x*(o*u-M*s)+r*(o*D-M*I),a},mat4.SIMD.adjoint=function(a,t){var l,o,M,S,x,I,D,F,r,s,u,e,m,l=SIMD.Float32x4.load(t,0),o=SIMD.Float32x4.load(t,4),M=SIMD.Float32x4.load(t,8),S=SIMD.Float32x4.load(t,12);return r=SIMD.Float32x4.shuffle(l,o,0,1,4,5),I=SIMD.Float32x4.shuffle(M,S,0,1,4,5),x=SIMD.Float32x4.shuffle(r,I,0,2,4,6),I=SIMD.Float32x4.shuffle(I,r,1,3,5,7),r=SIMD.Float32x4.shuffle(l,o,2,3,6,7),F=SIMD.Float32x4.shuffle(M,S,2,3,6,7),D=SIMD.Float32x4.shuffle(r,F,0,2,4,6),F=SIMD.Float32x4.shuffle(F,r,1,3,5,7),r=SIMD.Float32x4.mul(D,F),r=SIMD.Float32x4.swizzle(r,1,0,3,2),s=SIMD.Float32x4.mul(I,r),u=SIMD.Float32x4.mul(x,r),r=SIMD.Float32x4.swizzle(r,2,3,0,1),s=SIMD.Float32x4.sub(SIMD.Float32x4.mul(I,r),s),u=SIMD.Float32x4.sub(SIMD.Float32x4.mul(x,r),u),u=SIMD.Float32x4.swizzle(u,2,3,0,1),r=SIMD.Float32x4.mul(I,D),r=SIMD.Float32x4.swizzle(r,1,0,3,2),s=SIMD.Float32x4.add(SIMD.Float32x4.mul(F,r),s),m=SIMD.Float32x4.mul(x,r),r=SIMD.Float32x4.swizzle(r,2,3,0,1),s=SIMD.Float32x4.sub(s,SIMD.Float32x4.mul(F,r)),m=SIMD.Float32x4.sub(SIMD.Float32x4.mul(x,r),m),m=SIMD.Float32x4.swizzle(m,2,3,0,1),r=SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(I,2,3,0,1),F),r=SIMD.Float32x4.swizzle(r,1,0,3,2),D=SIMD.Float32x4.swizzle(D,2,3,0,1),s=SIMD.Float32x4.add(SIMD.Float32x4.mul(D,r),s),e=SIMD.Float32x4.mul(x,r),r=SIMD.Float32x4.swizzle(r,2,3,0,1),s=SIMD.Float32x4.sub(s,SIMD.Float32x4.mul(D,r)),e=SIMD.Float32x4.sub(SIMD.Float32x4.mul(x,r),e),e=SIMD.Float32x4.swizzle(e,2,3,0,1),r=SIMD.Float32x4.mul(x,I),r=SIMD.Float32x4.swizzle(r,1,0,3,2),e=SIMD.Float32x4.add(SIMD.Float32x4.mul(F,r),e),m=SIMD.Float32x4.sub(SIMD.Float32x4.mul(D,r),m),r=SIMD.Float32x4.swizzle(r,2,3,0,1),e=SIMD.Float32x4.sub(SIMD.Float32x4.mul(F,r),e),m=SIMD.Float32x4.sub(m,SIMD.Float32x4.mul(D,r)),r=SIMD.Float32x4.mul(x,F),r=SIMD.Float32x4.swizzle(r,1,0,3,2),u=SIMD.Float32x4.sub(u,SIMD.Float32x4.mul(D,r)),e=SIMD.Float32x4.add(SIMD.Float32x4.mul(I,r),e),r=SIMD.Float32x4.swizzle(r,2,3,0,1),u=SIMD.Float32x4.add(SIMD.Float32x4.mul(D,r),u),e=SIMD.Float32x4.sub(e,SIMD.Float32x4.mul(I,r)),r=SIMD.Float32x4.mul(x,D),r=SIMD.Float32x4.swizzle(r,1,0,3,2),u=SIMD.Float32x4.add(SIMD.Float32x4.mul(F,r),u),m=SIMD.Float32x4.sub(m,SIMD.Float32x4.mul(I,r)),r=SIMD.Float32x4.swizzle(r,2,3,0,1),u=SIMD.Float32x4.sub(u,SIMD.Float32x4.mul(F,r)),m=SIMD.Float32x4.add(SIMD.Float32x4.mul(I,r),m),SIMD.Float32x4.store(a,0,s),SIMD.Float32x4.store(a,4,u),SIMD.Float32x4.store(a,8,e),SIMD.Float32x4.store(a,12,m),a},mat4.adjoint=glMatrix.USE_SIMD?mat4.SIMD.adjoint:mat4.scalar.adjoint,mat4.determinant=function(a){var t=a[0],l=a[1],o=a[2],M=a[3],S=a[4],x=a[5],I=a[6],D=a[7],F=a[8],r=a[9],s=a[10],u=a[11],e=a[12],m=a[13],n=a[14],i=a[15],h=t*x-l*S,d=t*I-o*S,z=t*D-M*S,f=l*I-o*x,c=l*D-M*x,b=o*D-M*I,w=F*m-r*e,v=F*n-s*e,p=F*i-u*e,g=r*n-s*m,E=r*i-u*m,P=s*i-u*n;return h*P-d*E+z*g+f*p-c*v+b*w},mat4.SIMD.multiply=function(a,t,l){var o=SIMD.Float32x4.load(t,0),M=SIMD.Float32x4.load(t,4),S=SIMD.Float32x4.load(t,8),x=SIMD.Float32x4.load(t,12),I=SIMD.Float32x4.load(l,0),D=SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(I,0,0,0,0),o),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(I,1,1,1,1),M),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(I,2,2,2,2),S),SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(I,3,3,3,3),x))));SIMD.Float32x4.store(a,0,D);var F=SIMD.Float32x4.load(l,4),r=SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(F,0,0,0,0),o),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(F,1,1,1,1),M),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(F,2,2,2,2),S),SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(F,3,3,3,3),x))));SIMD.Float32x4.store(a,4,r);var s=SIMD.Float32x4.load(l,8),u=SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s,0,0,0,0),o),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s,1,1,1,1),M),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s,2,2,2,2),S),SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s,3,3,3,3),x))));SIMD.Float32x4.store(a,8,u);var e=SIMD.Float32x4.load(l,12),m=SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e,0,0,0,0),o),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e,1,1,1,1),M),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e,2,2,2,2),S),SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e,3,3,3,3),x))));return SIMD.Float32x4.store(a,12,m),a},mat4.scalar.multiply=function(a,t,l){var o=t[0],M=t[1],S=t[2],x=t[3],I=t[4],D=t[5],F=t[6],r=t[7],s=t[8],u=t[9],e=t[10],m=t[11],n=t[12],i=t[13],h=t[14],d=t[15],z=l[0],f=l[1],c=l[2],b=l[3];return a[0]=z*o+f*I+c*s+b*n,a[1]=z*M+f*D+c*u+b*i,a[2]=z*S+f*F+c*e+b*h,a[3]=z*x+f*r+c*m+b*d,z=l[4],f=l[5],c=l[6],b=l[7],a[4]=z*o+f*I+c*s+b*n,a[5]=z*M+f*D+c*u+b*i,a[6]=z*S+f*F+c*e+b*h,a[7]=z*x+f*r+c*m+b*d,z=l[8],f=l[9],c=l[10],b=l[11],a[8]=z*o+f*I+c*s+b*n,a[9]=z*M+f*D+c*u+b*i,a[10]=z*S+f*F+c*e+b*h,a[11]=z*x+f*r+c*m+b*d,z=l[12],f=l[13],c=l[14],b=l[15],a[12]=z*o+f*I+c*s+b*n,a[13]=z*M+f*D+c*u+b*i,a[14]=z*S+f*F+c*e+b*h,a[15]=z*x+f*r+c*m+b*d,a},mat4.multiply=glMatrix.USE_SIMD?mat4.SIMD.multiply:mat4.scalar.multiply,mat4.mul=mat4.multiply,mat4.scalar.translate=function(a,t,l){var o,M,S,x,I,D,F,r,s,u,e,m,n=l[0],i=l[1],h=l[2];return t===a?(a[12]=t[0]*n+t[4]*i+t[8]*h+t[12],a[13]=t[1]*n+t[5]*i+t[9]*h+t[13],a[14]=t[2]*n+t[6]*i+t[10]*h+t[14],a[15]=t[3]*n+t[7]*i+t[11]*h+t[15]):(o=t[0],M=t[1],S=t[2],x=t[3],I=t[4],D=t[5],F=t[6],r=t[7],s=t[8],u=t[9],e=t[10],m=t[11],a[0]=o,a[1]=M,a[2]=S,a[3]=x,a[4]=I,a[5]=D,a[6]=F,a[7]=r,a[8]=s,a[9]=u,a[10]=e,a[11]=m,a[12]=o*n+I*i+s*h+t[12],a[13]=M*n+D*i+u*h+t[13],a[14]=S*n+F*i+e*h+t[14],a[15]=x*n+r*i+m*h+t[15]),a},mat4.SIMD.translate=function(a,t,l){var o=SIMD.Float32x4.load(t,0),M=SIMD.Float32x4.load(t,4),S=SIMD.Float32x4.load(t,8),x=SIMD.Float32x4.load(t,12),I=SIMD.Float32x4(l[0],l[1],l[2],0);t!==a&&(a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[8]=t[8],a[9]=t[9],a[10]=t[10],a[11]=t[11]),o=SIMD.Float32x4.mul(o,SIMD.Float32x4.swizzle(I,0,0,0,0)),M=SIMD.Float32x4.mul(M,SIMD.Float32x4.swizzle(I,1,1,1,1)),S=SIMD.Float32x4.mul(S,SIMD.Float32x4.swizzle(I,2,2,2,2));var D=SIMD.Float32x4.add(o,SIMD.Float32x4.add(M,SIMD.Float32x4.add(S,x)));return SIMD.Float32x4.store(a,12,D),a},mat4.translate=glMatrix.USE_SIMD?mat4.SIMD.translate:mat4.scalar.translate,mat4.scalar.scale=function(a,t,l){var o=l[0],M=l[1],S=l[2];return a[0]=t[0]*o,a[1]=t[1]*o,a[2]=t[2]*o,a[3]=t[3]*o,a[4]=t[4]*M,a[5]=t[5]*M,a[6]=t[6]*M,a[7]=t[7]*M,a[8]=t[8]*S,a[9]=t[9]*S,a[10]=t[10]*S,a[11]=t[11]*S,a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15],a},mat4.SIMD.scale=function(a,t,l){var o,M,S,x=SIMD.Float32x4(l[0],l[1],l[2],0);return o=SIMD.Float32x4.load(t,0),SIMD.Float32x4.store(a,0,SIMD.Float32x4.mul(o,SIMD.Float32x4.swizzle(x,0,0,0,0))),M=SIMD.Float32x4.load(t,4),SIMD.Float32x4.store(a,4,SIMD.Float32x4.mul(M,SIMD.Float32x4.swizzle(x,1,1,1,1))),S=SIMD.Float32x4.load(t,8),SIMD.Float32x4.store(a,8,SIMD.Float32x4.mul(S,SIMD.Float32x4.swizzle(x,2,2,2,2))),a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15],a},mat4.scale=glMatrix.USE_SIMD?mat4.SIMD.scale:mat4.scalar.scale,mat4.rotate=function(a,t,l,o){var M,S,x,I,D,F,r,s,u,e,m,n,i,h,d,z,f,c,b,w,v,p,g,E,P=o[0],O=o[1],L=o[2],N=Math.sqrt(P*P+O*O+L*L);return Math.abs(N)<glMatrix.EPSILON?null:(N=1/N,P*=N,O*=N,L*=N,M=Math.sin(l),S=Math.cos(l),x=1-S,I=t[0],D=t[1],F=t[2],r=t[3],s=t[4],u=t[5],e=t[6],m=t[7],n=t[8],i=t[9],h=t[10],d=t[11],z=P*P*x+S,f=O*P*x+L*M,c=L*P*x-O*M,b=P*O*x-L*M,w=O*O*x+S,v=L*O*x+P*M,p=P*L*x+O*M,g=O*L*x-P*M,E=L*L*x+S,a[0]=I*z+s*f+n*c,a[1]=D*z+u*f+i*c,a[2]=F*z+e*f+h*c,a[3]=r*z+m*f+d*c,a[4]=I*b+s*w+n*v,a[5]=D*b+u*w+i*v,a[6]=F*b+e*w+h*v,a[7]=r*b+m*w+d*v,a[8]=I*p+s*g+n*E,a[9]=D*p+u*g+i*E,a[10]=F*p+e*g+h*E,a[11]=r*p+m*g+d*E,t!==a&&(a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15]),a)},mat4.scalar.rotateX=function(a,t,l){var o=Math.sin(l),M=Math.cos(l),S=t[4],x=t[5],I=t[6],D=t[7],F=t[8],r=t[9],s=t[10],u=t[11];return t!==a&&(a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15]),a[4]=S*M+F*o,a[5]=x*M+r*o,a[6]=I*M+s*o,a[7]=D*M+u*o,a[8]=F*M-S*o,a[9]=r*M-x*o,a[10]=s*M-I*o,a[11]=u*M-D*o,a},mat4.SIMD.rotateX=function(a,t,l){var o=SIMD.Float32x4.splat(Math.sin(l)),M=SIMD.Float32x4.splat(Math.cos(l));t!==a&&(a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15]);var S=SIMD.Float32x4.load(t,4),x=SIMD.Float32x4.load(t,8);return SIMD.Float32x4.store(a,4,SIMD.Float32x4.add(SIMD.Float32x4.mul(S,M),SIMD.Float32x4.mul(x,o))),SIMD.Float32x4.store(a,8,SIMD.Float32x4.sub(SIMD.Float32x4.mul(x,M),SIMD.Float32x4.mul(S,o))),a},mat4.rotateX=glMatrix.USE_SIMD?mat4.SIMD.rotateX:mat4.scalar.rotateX,mat4.scalar.rotateY=function(a,t,l){var o=Math.sin(l),M=Math.cos(l),S=t[0],x=t[1],I=t[2],D=t[3],F=t[8],r=t[9],s=t[10],u=t[11];return t!==a&&(a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15]),a[0]=S*M-F*o,a[1]=x*M-r*o,a[2]=I*M-s*o,a[3]=D*M-u*o,a[8]=S*o+F*M,a[9]=x*o+r*M,a[10]=I*o+s*M,a[11]=D*o+u*M,a},mat4.SIMD.rotateY=function(a,t,l){var o=SIMD.Float32x4.splat(Math.sin(l)),M=SIMD.Float32x4.splat(Math.cos(l));t!==a&&(a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15]);var S=SIMD.Float32x4.load(t,0),x=SIMD.Float32x4.load(t,8);return SIMD.Float32x4.store(a,0,SIMD.Float32x4.sub(SIMD.Float32x4.mul(S,M),SIMD.Float32x4.mul(x,o))),SIMD.Float32x4.store(a,8,SIMD.Float32x4.add(SIMD.Float32x4.mul(S,o),SIMD.Float32x4.mul(x,M))),a},mat4.rotateY=glMatrix.USE_SIMD?mat4.SIMD.rotateY:mat4.scalar.rotateY,mat4.scalar.rotateZ=function(a,t,l){var o=Math.sin(l),M=Math.cos(l),S=t[0],x=t[1],I=t[2],D=t[3],F=t[4],r=t[5],s=t[6],u=t[7];return t!==a&&(a[8]=t[8],a[9]=t[9],a[10]=t[10],a[11]=t[11],a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15]),a[0]=S*M+F*o,a[1]=x*M+r*o,a[2]=I*M+s*o,a[3]=D*M+u*o,a[4]=F*M-S*o,a[5]=r*M-x*o,a[6]=s*M-I*o,a[7]=u*M-D*o,a},mat4.SIMD.rotateZ=function(a,t,l){var o=SIMD.Float32x4.splat(Math.sin(l)),M=SIMD.Float32x4.splat(Math.cos(l));t!==a&&(a[8]=t[8],a[9]=t[9],a[10]=t[10],a[11]=t[11],a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15]);var S=SIMD.Float32x4.load(t,0),x=SIMD.Float32x4.load(t,4);return SIMD.Float32x4.store(a,0,SIMD.Float32x4.add(SIMD.Float32x4.mul(S,M),SIMD.Float32x4.mul(x,o))),SIMD.Float32x4.store(a,4,SIMD.Float32x4.sub(SIMD.Float32x4.mul(x,M),SIMD.Float32x4.mul(S,o))),a},mat4.rotateZ=glMatrix.USE_SIMD?mat4.SIMD.rotateZ:mat4.scalar.rotateZ,mat4.fromTranslation=function(a,t){return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=t[0],a[13]=t[1],a[14]=t[2],a[15]=1,a},mat4.fromScaling=function(a,t){return a[0]=t[0],a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=t[1],a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=t[2],a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},mat4.fromRotation=function(a,t,l){var o,M,S,x=l[0],I=l[1],D=l[2],F=Math.sqrt(x*x+I*I+D*D);return Math.abs(F)<glMatrix.EPSILON?null:(F=1/F,x*=F,I*=F,D*=F,o=Math.sin(t),M=Math.cos(t),S=1-M,a[0]=x*x*S+M,a[1]=I*x*S+D*o,a[2]=D*x*S-I*o,a[3]=0,a[4]=x*I*S-D*o,a[5]=I*I*S+M,a[6]=D*I*S+x*o,a[7]=0,a[8]=x*D*S+I*o,a[9]=I*D*S-x*o,a[10]=D*D*S+M,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a)},mat4.fromXRotation=function(a,t){var l=Math.sin(t),o=Math.cos(t);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=o,a[6]=l,a[7]=0,a[8]=0,a[9]=-l,a[10]=o,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},mat4.fromYRotation=function(a,t){var l=Math.sin(t),o=Math.cos(t);return a[0]=o,a[1]=0,a[2]=-l,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=l,a[9]=0,a[10]=o,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},mat4.fromZRotation=function(a,t){var l=Math.sin(t),o=Math.cos(t);return a[0]=o,a[1]=l,a[2]=0,a[3]=0,a[4]=-l,a[5]=o,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},mat4.fromRotationTranslation=function(a,t,l){var o=t[0],M=t[1],S=t[2],x=t[3],I=o+o,D=M+M,F=S+S,r=o*I,s=o*D,u=o*F,e=M*D,m=M*F,n=S*F,i=x*I,h=x*D,d=x*F;return a[0]=1-(e+n),a[1]=s+d,a[2]=u-h,a[3]=0,a[4]=s-d,a[5]=1-(r+n),a[6]=m+i,a[7]=0,a[8]=u+h,a[9]=m-i,a[10]=1-(r+e),a[11]=0,a[12]=l[0],a[13]=l[1],a[14]=l[2],a[15]=1,a},mat4.getTranslation=function(a,t){return a[0]=t[12],a[1]=t[13],a[2]=t[14],a},mat4.getRotation=function(a,t){var l=t[0]+t[5]+t[10],o=0;return l>0?(o=2*Math.sqrt(l+1),a[3]=.25*o,a[0]=(t[6]-t[9])/o,a[1]=(t[8]-t[2])/o,a[2]=(t[1]-t[4])/o):t[0]>t[5]&t[0]>t[10]?(o=2*Math.sqrt(1+t[0]-t[5]-t[10]),a[3]=(t[6]-t[9])/o,a[0]=.25*o,a[1]=(t[1]+t[4])/o,a[2]=(t[8]+t[2])/o):t[5]>t[10]?(o=2*Math.sqrt(1+t[5]-t[0]-t[10]),a[3]=(t[8]-t[2])/o,a[0]=(t[1]+t[4])/o,a[1]=.25*o,a[2]=(t[6]+t[9])/o):(o=2*Math.sqrt(1+t[10]-t[0]-t[5]),a[3]=(t[1]-t[4])/o,a[0]=(t[8]+t[2])/o,a[1]=(t[6]+t[9])/o,a[2]=.25*o),a},mat4.fromRotationTranslationScale=function(a,t,l,o){var M=t[0],S=t[1],x=t[2],I=t[3],D=M+M,F=S+S,r=x+x,s=M*D,u=M*F,e=M*r,m=S*F,n=S*r,i=x*r,h=I*D,d=I*F,z=I*r,f=o[0],c=o[1],b=o[2];return a[0]=(1-(m+i))*f,a[1]=(u+z)*f,a[2]=(e-d)*f,a[3]=0,a[4]=(u-z)*c,a[5]=(1-(s+i))*c,a[6]=(n+h)*c,a[7]=0,a[8]=(e+d)*b,a[9]=(n-h)*b,a[10]=(1-(s+m))*b,a[11]=0,a[12]=l[0],a[13]=l[1],a[14]=l[2],a[15]=1,a},mat4.fromRotationTranslationScaleOrigin=function(a,t,l,o,M){var S=t[0],x=t[1],I=t[2],D=t[3],F=S+S,r=x+x,s=I+I,u=S*F,e=S*r,m=S*s,n=x*r,i=x*s,h=I*s,d=D*F,z=D*r,f=D*s,c=o[0],b=o[1],w=o[2],v=M[0],p=M[1],g=M[2];return a[0]=(1-(n+h))*c,a[1]=(e+f)*c,a[2]=(m-z)*c,a[3]=0,a[4]=(e-f)*b,a[5]=(1-(u+h))*b,a[6]=(i+d)*b,a[7]=0,a[8]=(m+z)*w,a[9]=(i-d)*w,a[10]=(1-(u+n))*w,a[11]=0,a[12]=l[0]+v-(a[0]*v+a[4]*p+a[8]*g),a[13]=l[1]+p-(a[1]*v+a[5]*p+a[9]*g),a[14]=l[2]+g-(a[2]*v+a[6]*p+a[10]*g),a[15]=1,a},mat4.fromQuat=function(a,t){var l=t[0],o=t[1],M=t[2],S=t[3],x=l+l,I=o+o,D=M+M,F=l*x,r=o*x,s=o*I,u=M*x,e=M*I,m=M*D,n=S*x,i=S*I,h=S*D;return a[0]=1-s-m,a[1]=r+h,a[2]=u-i,a[3]=0,a[4]=r-h,a[5]=1-F-m,a[6]=e+n,a[7]=0,a[8]=u+i,a[9]=e-n,a[10]=1-F-s,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},mat4.frustum=function(a,t,l,o,M,S,x){var I=1/(l-t),D=1/(M-o),F=1/(S-x);return a[0]=2*S*I,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=2*S*D,a[6]=0,a[7]=0,a[8]=(l+t)*I,a[9]=(M+o)*D,a[10]=(x+S)*F,a[11]=-1,a[12]=0,a[13]=0,a[14]=x*S*2*F,a[15]=0,a},mat4.perspective=function(a,t,l,o,M){var S=1/Math.tan(t/2),x=1/(o-M);return a[0]=S/l,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=S,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=(M+o)*x,a[11]=-1,a[12]=0,a[13]=0,a[14]=2*M*o*x,a[15]=0,a},mat4.perspectiveFromFieldOfView=function(a,t,l,o){var M=Math.tan(t.upDegrees*Math.PI/180),S=Math.tan(t.downDegrees*Math.PI/180),x=Math.tan(t.leftDegrees*Math.PI/180),I=Math.tan(t.rightDegrees*Math.PI/180),D=2/(x+I),F=2/(M+S);return a[0]=D,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=F,a[6]=0,a[7]=0,a[8]=-((x-I)*D*.5),a[9]=(M-S)*F*.5,a[10]=o/(l-o),a[11]=-1,a[12]=0,a[13]=0,a[14]=o*l/(l-o),a[15]=0,a},mat4.ortho=function(a,t,l,o,M,S,x){var I=1/(t-l),D=1/(o-M),F=1/(S-x);return a[0]=-2*I,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=-2*D,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=2*F,a[11]=0,a[12]=(t+l)*I,a[13]=(M+o)*D,a[14]=(x+S)*F,a[15]=1,a},mat4.lookAt=function(a,t,l,o){var M,S,x,I,D,F,r,s,u,e,m=t[0],n=t[1],i=t[2],h=o[0],d=o[1],z=o[2],f=l[0],c=l[1],b=l[2];return Math.abs(m-f)<glMatrix.EPSILON&&Math.abs(n-c)<glMatrix.EPSILON&&Math.abs(i-b)<glMatrix.EPSILON?mat4.identity(a):(r=m-f,s=n-c,u=i-b,e=1/Math.sqrt(r*r+s*s+u*u),r*=e,s*=e,u*=e,M=d*u-z*s,S=z*r-h*u,x=h*s-d*r,e=Math.sqrt(M*M+S*S+x*x),e?(e=1/e,M*=e,S*=e,x*=e):(M=0,S=0,x=0),I=s*x-u*S,D=u*M-r*x,F=r*S-s*M,e=Math.sqrt(I*I+D*D+F*F),e?(e=1/e,I*=e,D*=e,F*=e):(I=0,D=0,F=0),a[0]=M,a[1]=I,a[2]=r,a[3]=0,a[4]=S,a[5]=D,a[6]=s,a[7]=0,a[8]=x,a[9]=F,a[10]=u,a[11]=0,a[12]=-(M*m+S*n+x*i),a[13]=-(I*m+D*n+F*i),a[14]=-(r*m+s*n+u*i),a[15]=1,a)},mat4.str=function(a){return"mat4("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+")"},mat4.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+Math.pow(a[6],2)+Math.pow(a[7],2)+Math.pow(a[8],2)+Math.pow(a[9],2)+Math.pow(a[10],2)+Math.pow(a[11],2)+Math.pow(a[12],2)+Math.pow(a[13],2)+Math.pow(a[14],2)+Math.pow(a[15],2))},mat4.add=function(a,t,l){return a[0]=t[0]+l[0],a[1]=t[1]+l[1],a[2]=t[2]+l[2],a[3]=t[3]+l[3],a[4]=t[4]+l[4],a[5]=t[5]+l[5],a[6]=t[6]+l[6],a[7]=t[7]+l[7],a[8]=t[8]+l[8],a[9]=t[9]+l[9],a[10]=t[10]+l[10],a[11]=t[11]+l[11],a[12]=t[12]+l[12],a[13]=t[13]+l[13],a[14]=t[14]+l[14],a[15]=t[15]+l[15],a},mat4.subtract=function(a,t,l){return a[0]=t[0]-l[0],a[1]=t[1]-l[1],a[2]=t[2]-l[2],a[3]=t[3]-l[3],a[4]=t[4]-l[4],a[5]=t[5]-l[5],a[6]=t[6]-l[6],a[7]=t[7]-l[7],a[8]=t[8]-l[8],a[9]=t[9]-l[9],a[10]=t[10]-l[10],a[11]=t[11]-l[11],a[12]=t[12]-l[12],a[13]=t[13]-l[13],a[14]=t[14]-l[14],a[15]=t[15]-l[15],a},mat4.sub=mat4.subtract,mat4.multiplyScalar=function(a,t,l){return a[0]=t[0]*l,a[1]=t[1]*l,a[2]=t[2]*l,a[3]=t[3]*l,a[4]=t[4]*l,a[5]=t[5]*l,a[6]=t[6]*l,a[7]=t[7]*l,a[8]=t[8]*l,a[9]=t[9]*l,a[10]=t[10]*l,a[11]=t[11]*l,a[12]=t[12]*l,a[13]=t[13]*l,a[14]=t[14]*l,a[15]=t[15]*l,a},mat4.multiplyScalarAndAdd=function(a,t,l,o){return a[0]=t[0]+l[0]*o,a[1]=t[1]+l[1]*o,a[2]=t[2]+l[2]*o,a[3]=t[3]+l[3]*o,a[4]=t[4]+l[4]*o,a[5]=t[5]+l[5]*o,a[6]=t[6]+l[6]*o,a[7]=t[7]+l[7]*o,a[8]=t[8]+l[8]*o,a[9]=t[9]+l[9]*o,a[10]=t[10]+l[10]*o,a[11]=t[11]+l[11]*o,a[12]=t[12]+l[12]*o,a[13]=t[13]+l[13]*o,a[14]=t[14]+l[14]*o,a[15]=t[15]+l[15]*o,a},mat4.exactEquals=function(a,t){return a[0]===t[0]&&a[1]===t[1]&&a[2]===t[2]&&a[3]===t[3]&&a[4]===t[4]&&a[5]===t[5]&&a[6]===t[6]&&a[7]===t[7]&&a[8]===t[8]&&a[9]===t[9]&&a[10]===t[10]&&a[11]===t[11]&&a[12]===t[12]&&a[13]===t[13]&&a[14]===t[14]&&a[15]===t[15]},mat4.equals=function(a,t){var l=a[0],o=a[1],M=a[2],S=a[3],x=a[4],I=a[5],D=a[6],F=a[7],r=a[8],s=a[9],u=a[10],e=a[11],m=a[12],n=a[13],i=a[14],h=a[15],d=t[0],z=t[1],f=t[2],c=t[3],b=t[4],w=t[5],v=t[6],p=t[7],g=t[8],E=t[9],P=t[10],O=t[11],L=t[12],N=t[13],R=t[14],q=t[15];return Math.abs(l-d)<=glMatrix.EPSILON*Math.max(1,Math.abs(l),Math.abs(d))&&Math.abs(o-z)<=glMatrix.EPSILON*Math.max(1,Math.abs(o),Math.abs(z))&&Math.abs(M-f)<=glMatrix.EPSILON*Math.max(1,Math.abs(M),Math.abs(f))&&Math.abs(S-c)<=glMatrix.EPSILON*Math.max(1,Math.abs(S),Math.abs(c))&&Math.abs(x-b)<=glMatrix.EPSILON*Math.max(1,Math.abs(x),Math.abs(b))&&Math.abs(I-w)<=glMatrix.EPSILON*Math.max(1,Math.abs(I),Math.abs(w))&&Math.abs(D-v)<=glMatrix.EPSILON*Math.max(1,Math.abs(D),Math.abs(v))&&Math.abs(F-p)<=glMatrix.EPSILON*Math.max(1,Math.abs(F),Math.abs(p))&&Math.abs(r-g)<=glMatrix.EPSILON*Math.max(1,Math.abs(r),Math.abs(g))&&Math.abs(s-E)<=glMatrix.EPSILON*Math.max(1,Math.abs(s),Math.abs(E))&&Math.abs(u-P)<=glMatrix.EPSILON*Math.max(1,Math.abs(u),Math.abs(P))&&Math.abs(e-O)<=glMatrix.EPSILON*Math.max(1,Math.abs(e),Math.abs(O))&&Math.abs(m-L)<=glMatrix.EPSILON*Math.max(1,Math.abs(m),Math.abs(L))&&Math.abs(n-N)<=glMatrix.EPSILON*Math.max(1,Math.abs(n),Math.abs(N))&&Math.abs(i-R)<=glMatrix.EPSILON*Math.max(1,Math.abs(i),Math.abs(R))&&Math.abs(h-q)<=glMatrix.EPSILON*Math.max(1,Math.abs(h),Math.abs(q))},module.exports=mat4;
	},{"./common.js":150}],155:[function(require,module,exports){
	var glMatrix=require("./common.js"),mat3=require("./mat3.js"),vec3=require("./vec3.js"),vec4=require("./vec4.js"),quat={};quat.create=function(){var t=new glMatrix.ARRAY_TYPE(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},quat.rotationTo=function(){var t=vec3.create(),a=vec3.fromValues(1,0,0),e=vec3.fromValues(0,1,0);return function(u,r,n){var c=vec3.dot(r,n);return c<-.999999?(vec3.cross(t,a,r),vec3.length(t)<1e-6&&vec3.cross(t,e,r),vec3.normalize(t,t),quat.setAxisAngle(u,t,Math.PI),u):c>.999999?(u[0]=0,u[1]=0,u[2]=0,u[3]=1,u):(vec3.cross(t,r,n),u[0]=t[0],u[1]=t[1],u[2]=t[2],u[3]=1+c,quat.normalize(u,u))}}(),quat.setAxes=function(){var t=mat3.create();return function(a,e,u,r){return t[0]=u[0],t[3]=u[1],t[6]=u[2],t[1]=r[0],t[4]=r[1],t[7]=r[2],t[2]=-e[0],t[5]=-e[1],t[8]=-e[2],quat.normalize(a,quat.fromMat3(a,t))}}(),quat.clone=vec4.clone,quat.fromValues=vec4.fromValues,quat.copy=vec4.copy,quat.set=vec4.set,quat.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},quat.setAxisAngle=function(t,a,e){e*=.5;var u=Math.sin(e);return t[0]=u*a[0],t[1]=u*a[1],t[2]=u*a[2],t[3]=Math.cos(e),t},quat.getAxisAngle=function(t,a){var e=2*Math.acos(a[3]),u=Math.sin(e/2);return 0!=u?(t[0]=a[0]/u,t[1]=a[1]/u,t[2]=a[2]/u):(t[0]=1,t[1]=0,t[2]=0),e},quat.add=vec4.add,quat.multiply=function(t,a,e){var u=a[0],r=a[1],n=a[2],c=a[3],q=e[0],s=e[1],o=e[2],i=e[3];return t[0]=u*i+c*q+r*o-n*s,t[1]=r*i+c*s+n*q-u*o,t[2]=n*i+c*o+u*s-r*q,t[3]=c*i-u*q-r*s-n*o,t},quat.mul=quat.multiply,quat.scale=vec4.scale,quat.rotateX=function(t,a,e){e*=.5;var u=a[0],r=a[1],n=a[2],c=a[3],q=Math.sin(e),s=Math.cos(e);return t[0]=u*s+c*q,t[1]=r*s+n*q,t[2]=n*s-r*q,t[3]=c*s-u*q,t},quat.rotateY=function(t,a,e){e*=.5;var u=a[0],r=a[1],n=a[2],c=a[3],q=Math.sin(e),s=Math.cos(e);return t[0]=u*s-n*q,t[1]=r*s+c*q,t[2]=n*s+u*q,t[3]=c*s-r*q,t},quat.rotateZ=function(t,a,e){e*=.5;var u=a[0],r=a[1],n=a[2],c=a[3],q=Math.sin(e),s=Math.cos(e);return t[0]=u*s+r*q,t[1]=r*s-u*q,t[2]=n*s+c*q,t[3]=c*s-n*q,t},quat.calculateW=function(t,a){var e=a[0],u=a[1],r=a[2];return t[0]=e,t[1]=u,t[2]=r,t[3]=Math.sqrt(Math.abs(1-e*e-u*u-r*r)),t},quat.dot=vec4.dot,quat.lerp=vec4.lerp,quat.slerp=function(t,a,e,u){var r,n,c,q,s,o=a[0],i=a[1],v=a[2],l=a[3],f=e[0],h=e[1],M=e[2],m=e[3];return n=o*f+i*h+v*M+l*m,n<0&&(n=-n,f=-f,h=-h,M=-M,m=-m),1-n>1e-6?(r=Math.acos(n),c=Math.sin(r),q=Math.sin((1-u)*r)/c,s=Math.sin(u*r)/c):(q=1-u,s=u),t[0]=q*o+s*f,t[1]=q*i+s*h,t[2]=q*v+s*M,t[3]=q*l+s*m,t},quat.sqlerp=function(){var t=quat.create(),a=quat.create();return function(e,u,r,n,c,q){return quat.slerp(t,u,c,q),quat.slerp(a,r,n,q),quat.slerp(e,t,a,2*q*(1-q)),e}}(),quat.invert=function(t,a){var e=a[0],u=a[1],r=a[2],n=a[3],c=e*e+u*u+r*r+n*n,q=c?1/c:0;return t[0]=-e*q,t[1]=-u*q,t[2]=-r*q,t[3]=n*q,t},quat.conjugate=function(t,a){return t[0]=-a[0],t[1]=-a[1],t[2]=-a[2],t[3]=a[3],t},quat.length=vec4.length,quat.len=quat.length,quat.squaredLength=vec4.squaredLength,quat.sqrLen=quat.squaredLength,quat.normalize=vec4.normalize,quat.fromMat3=function(t,a){var e,u=a[0]+a[4]+a[8];if(u>0)e=Math.sqrt(u+1),t[3]=.5*e,e=.5/e,t[0]=(a[5]-a[7])*e,t[1]=(a[6]-a[2])*e,t[2]=(a[1]-a[3])*e;else{var r=0;a[4]>a[0]&&(r=1),a[8]>a[3*r+r]&&(r=2);var n=(r+1)%3,c=(r+2)%3;e=Math.sqrt(a[3*r+r]-a[3*n+n]-a[3*c+c]+1),t[r]=.5*e,e=.5/e,t[3]=(a[3*n+c]-a[3*c+n])*e,t[n]=(a[3*n+r]+a[3*r+n])*e,t[c]=(a[3*c+r]+a[3*r+c])*e}return t},quat.str=function(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},quat.exactEquals=vec4.exactEquals,quat.equals=vec4.equals,module.exports=quat;
	},{"./common.js":150,"./mat3.js":153,"./vec3.js":157,"./vec4.js":158}],156:[function(require,module,exports){
	var glMatrix=require("./common.js"),vec2={};vec2.create=function(){var n=new glMatrix.ARRAY_TYPE(2);return n[0]=0,n[1]=0,n},vec2.clone=function(n){var t=new glMatrix.ARRAY_TYPE(2);return t[0]=n[0],t[1]=n[1],t},vec2.fromValues=function(n,t){var r=new glMatrix.ARRAY_TYPE(2);return r[0]=n,r[1]=t,r},vec2.copy=function(n,t){return n[0]=t[0],n[1]=t[1],n},vec2.set=function(n,t,r){return n[0]=t,n[1]=r,n},vec2.add=function(n,t,r){return n[0]=t[0]+r[0],n[1]=t[1]+r[1],n},vec2.subtract=function(n,t,r){return n[0]=t[0]-r[0],n[1]=t[1]-r[1],n},vec2.sub=vec2.subtract,vec2.multiply=function(n,t,r){return n[0]=t[0]*r[0],n[1]=t[1]*r[1],n},vec2.mul=vec2.multiply,vec2.divide=function(n,t,r){return n[0]=t[0]/r[0],n[1]=t[1]/r[1],n},vec2.div=vec2.divide,vec2.ceil=function(n,t){return n[0]=Math.ceil(t[0]),n[1]=Math.ceil(t[1]),n},vec2.floor=function(n,t){return n[0]=Math.floor(t[0]),n[1]=Math.floor(t[1]),n},vec2.min=function(n,t,r){return n[0]=Math.min(t[0],r[0]),n[1]=Math.min(t[1],r[1]),n},vec2.max=function(n,t,r){return n[0]=Math.max(t[0],r[0]),n[1]=Math.max(t[1],r[1]),n},vec2.round=function(n,t){return n[0]=Math.round(t[0]),n[1]=Math.round(t[1]),n},vec2.scale=function(n,t,r){return n[0]=t[0]*r,n[1]=t[1]*r,n},vec2.scaleAndAdd=function(n,t,r,e){return n[0]=t[0]+r[0]*e,n[1]=t[1]+r[1]*e,n},vec2.distance=function(n,t){var r=t[0]-n[0],e=t[1]-n[1];return Math.sqrt(r*r+e*e)},vec2.dist=vec2.distance,vec2.squaredDistance=function(n,t){var r=t[0]-n[0],e=t[1]-n[1];return r*r+e*e},vec2.sqrDist=vec2.squaredDistance,vec2.length=function(n){var t=n[0],r=n[1];return Math.sqrt(t*t+r*r)},vec2.len=vec2.length,vec2.squaredLength=function(n){var t=n[0],r=n[1];return t*t+r*r},vec2.sqrLen=vec2.squaredLength,vec2.negate=function(n,t){return n[0]=-t[0],n[1]=-t[1],n},vec2.inverse=function(n,t){return n[0]=1/t[0],n[1]=1/t[1],n},vec2.normalize=function(n,t){var r=t[0],e=t[1],c=r*r+e*e;return c>0&&(c=1/Math.sqrt(c),n[0]=t[0]*c,n[1]=t[1]*c),n},vec2.dot=function(n,t){return n[0]*t[0]+n[1]*t[1]},vec2.cross=function(n,t,r){var e=t[0]*r[1]-t[1]*r[0];return n[0]=n[1]=0,n[2]=e,n},vec2.lerp=function(n,t,r,e){var c=t[0],a=t[1];return n[0]=c+e*(r[0]-c),n[1]=a+e*(r[1]-a),n},vec2.random=function(n,t){t=t||1;var r=2*glMatrix.RANDOM()*Math.PI;return n[0]=Math.cos(r)*t,n[1]=Math.sin(r)*t,n},vec2.transformMat2=function(n,t,r){var e=t[0],c=t[1];return n[0]=r[0]*e+r[2]*c,n[1]=r[1]*e+r[3]*c,n},vec2.transformMat2d=function(n,t,r){var e=t[0],c=t[1];return n[0]=r[0]*e+r[2]*c+r[4],n[1]=r[1]*e+r[3]*c+r[5],n},vec2.transformMat3=function(n,t,r){var e=t[0],c=t[1];return n[0]=r[0]*e+r[3]*c+r[6],n[1]=r[1]*e+r[4]*c+r[7],n},vec2.transformMat4=function(n,t,r){var e=t[0],c=t[1];return n[0]=r[0]*e+r[4]*c+r[12],n[1]=r[1]*e+r[5]*c+r[13],n},vec2.forEach=function(){var n=vec2.create();return function(t,r,e,c,a,u){var v,i;for(r||(r=2),e||(e=0),i=c?Math.min(c*r+e,t.length):t.length,v=e;v<i;v+=r)n[0]=t[v],n[1]=t[v+1],a(n,n,u),t[v]=n[0],t[v+1]=n[1];return t}}(),vec2.str=function(n){return"vec2("+n[0]+", "+n[1]+")"},vec2.exactEquals=function(n,t){return n[0]===t[0]&&n[1]===t[1]},vec2.equals=function(n,t){var r=n[0],e=n[1],c=t[0],a=t[1];return Math.abs(r-c)<=glMatrix.EPSILON*Math.max(1,Math.abs(r),Math.abs(c))&&Math.abs(e-a)<=glMatrix.EPSILON*Math.max(1,Math.abs(e),Math.abs(a))},module.exports=vec2;
	},{"./common.js":150}],157:[function(require,module,exports){
	var glMatrix=require("./common.js"),vec3={};vec3.create=function(){var t=new glMatrix.ARRAY_TYPE(3);return t[0]=0,t[1]=0,t[2]=0,t},vec3.clone=function(t){var n=new glMatrix.ARRAY_TYPE(3);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n},vec3.fromValues=function(t,n,r){var e=new glMatrix.ARRAY_TYPE(3);return e[0]=t,e[1]=n,e[2]=r,e},vec3.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t},vec3.set=function(t,n,r,e){return t[0]=n,t[1]=r,t[2]=e,t},vec3.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t},vec3.subtract=function(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t},vec3.sub=vec3.subtract,vec3.multiply=function(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t[2]=n[2]*r[2],t},vec3.mul=vec3.multiply,vec3.divide=function(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t[2]=n[2]/r[2],t},vec3.div=vec3.divide,vec3.ceil=function(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t[2]=Math.ceil(n[2]),t},vec3.floor=function(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t[2]=Math.floor(n[2]),t},vec3.min=function(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t[2]=Math.min(n[2],r[2]),t},vec3.max=function(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t[2]=Math.max(n[2],r[2]),t},vec3.round=function(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t[2]=Math.round(n[2]),t},vec3.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t},vec3.scaleAndAdd=function(t,n,r,e){return t[0]=n[0]+r[0]*e,t[1]=n[1]+r[1]*e,t[2]=n[2]+r[2]*e,t},vec3.distance=function(t,n){var r=n[0]-t[0],e=n[1]-t[1],a=n[2]-t[2];return Math.sqrt(r*r+e*e+a*a)},vec3.dist=vec3.distance,vec3.squaredDistance=function(t,n){var r=n[0]-t[0],e=n[1]-t[1],a=n[2]-t[2];return r*r+e*e+a*a},vec3.sqrDist=vec3.squaredDistance,vec3.length=function(t){var n=t[0],r=t[1],e=t[2];return Math.sqrt(n*n+r*r+e*e)},vec3.len=vec3.length,vec3.squaredLength=function(t){var n=t[0],r=t[1],e=t[2];return n*n+r*r+e*e},vec3.sqrLen=vec3.squaredLength,vec3.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t},vec3.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t},vec3.normalize=function(t,n){var r=n[0],e=n[1],a=n[2],c=r*r+e*e+a*a;return c>0&&(c=1/Math.sqrt(c),t[0]=n[0]*c,t[1]=n[1]*c,t[2]=n[2]*c),t},vec3.dot=function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]},vec3.cross=function(t,n,r){var e=n[0],a=n[1],c=n[2],u=r[0],v=r[1],i=r[2];return t[0]=a*i-c*v,t[1]=c*u-e*i,t[2]=e*v-a*u,t},vec3.lerp=function(t,n,r,e){var a=n[0],c=n[1],u=n[2];return t[0]=a+e*(r[0]-a),t[1]=c+e*(r[1]-c),t[2]=u+e*(r[2]-u),t},vec3.hermite=function(t,n,r,e,a,c){var u=c*c,v=u*(2*c-3)+1,i=u*(c-2)+c,o=u*(c-1),M=u*(3-2*c);return t[0]=n[0]*v+r[0]*i+e[0]*o+a[0]*M,t[1]=n[1]*v+r[1]*i+e[1]*o+a[1]*M,t[2]=n[2]*v+r[2]*i+e[2]*o+a[2]*M,t},vec3.bezier=function(t,n,r,e,a,c){var u=1-c,v=u*u,i=c*c,o=v*u,M=3*c*v,s=3*i*u,h=i*c;return t[0]=n[0]*o+r[0]*M+e[0]*s+a[0]*h,t[1]=n[1]*o+r[1]*M+e[1]*s+a[1]*h,t[2]=n[2]*o+r[2]*M+e[2]*s+a[2]*h,t},vec3.random=function(t,n){n=n||1;var r=2*glMatrix.RANDOM()*Math.PI,e=2*glMatrix.RANDOM()-1,a=Math.sqrt(1-e*e)*n;return t[0]=Math.cos(r)*a,t[1]=Math.sin(r)*a,t[2]=e*n,t},vec3.transformMat4=function(t,n,r){var e=n[0],a=n[1],c=n[2],u=r[3]*e+r[7]*a+r[11]*c+r[15];return u=u||1,t[0]=(r[0]*e+r[4]*a+r[8]*c+r[12])/u,t[1]=(r[1]*e+r[5]*a+r[9]*c+r[13])/u,t[2]=(r[2]*e+r[6]*a+r[10]*c+r[14])/u,t},vec3.transformMat3=function(t,n,r){var e=n[0],a=n[1],c=n[2];return t[0]=e*r[0]+a*r[3]+c*r[6],t[1]=e*r[1]+a*r[4]+c*r[7],t[2]=e*r[2]+a*r[5]+c*r[8],t},vec3.transformQuat=function(t,n,r){var e=n[0],a=n[1],c=n[2],u=r[0],v=r[1],i=r[2],o=r[3],M=o*e+v*c-i*a,s=o*a+i*e-u*c,h=o*c+u*a-v*e,f=-u*e-v*a-i*c;return t[0]=M*o+f*-u+s*-i-h*-v,t[1]=s*o+f*-v+h*-u-M*-i,t[2]=h*o+f*-i+M*-v-s*-u,t},vec3.rotateX=function(t,n,r,e){var a=[],c=[];return a[0]=n[0]-r[0],a[1]=n[1]-r[1],a[2]=n[2]-r[2],c[0]=a[0],c[1]=a[1]*Math.cos(e)-a[2]*Math.sin(e),c[2]=a[1]*Math.sin(e)+a[2]*Math.cos(e),t[0]=c[0]+r[0],t[1]=c[1]+r[1],t[2]=c[2]+r[2],t},vec3.rotateY=function(t,n,r,e){var a=[],c=[];return a[0]=n[0]-r[0],a[1]=n[1]-r[1],a[2]=n[2]-r[2],c[0]=a[2]*Math.sin(e)+a[0]*Math.cos(e),c[1]=a[1],c[2]=a[2]*Math.cos(e)-a[0]*Math.sin(e),t[0]=c[0]+r[0],t[1]=c[1]+r[1],t[2]=c[2]+r[2],t},vec3.rotateZ=function(t,n,r,e){var a=[],c=[];return a[0]=n[0]-r[0],a[1]=n[1]-r[1],a[2]=n[2]-r[2],c[0]=a[0]*Math.cos(e)-a[1]*Math.sin(e),c[1]=a[0]*Math.sin(e)+a[1]*Math.cos(e),c[2]=a[2],t[0]=c[0]+r[0],t[1]=c[1]+r[1],t[2]=c[2]+r[2],t},vec3.forEach=function(){var t=vec3.create();return function(n,r,e,a,c,u){var v,i;for(r||(r=3),e||(e=0),i=a?Math.min(a*r+e,n.length):n.length,v=e;v<i;v+=r)t[0]=n[v],t[1]=n[v+1],t[2]=n[v+2],c(t,t,u),n[v]=t[0],n[v+1]=t[1],n[v+2]=t[2];return n}}(),vec3.angle=function(t,n){var r=vec3.fromValues(t[0],t[1],t[2]),e=vec3.fromValues(n[0],n[1],n[2]);vec3.normalize(r,r),vec3.normalize(e,e);var a=vec3.dot(r,e);return a>1?0:Math.acos(a)},vec3.str=function(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"},vec3.exactEquals=function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]},vec3.equals=function(t,n){var r=t[0],e=t[1],a=t[2],c=n[0],u=n[1],v=n[2];return Math.abs(r-c)<=glMatrix.EPSILON*Math.max(1,Math.abs(r),Math.abs(c))&&Math.abs(e-u)<=glMatrix.EPSILON*Math.max(1,Math.abs(e),Math.abs(u))&&Math.abs(a-v)<=glMatrix.EPSILON*Math.max(1,Math.abs(a),Math.abs(v))},module.exports=vec3;
	},{"./common.js":150}],158:[function(require,module,exports){
	var glMatrix=require("./common.js"),vec4={};vec4.create=function(){var t=new glMatrix.ARRAY_TYPE(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t},vec4.clone=function(t){var n=new glMatrix.ARRAY_TYPE(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n},vec4.fromValues=function(t,n,e,r){var a=new glMatrix.ARRAY_TYPE(4);return a[0]=t,a[1]=n,a[2]=e,a[3]=r,a},vec4.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t},vec4.set=function(t,n,e,r,a){return t[0]=n,t[1]=e,t[2]=r,t[3]=a,t},vec4.add=function(t,n,e){return t[0]=n[0]+e[0],t[1]=n[1]+e[1],t[2]=n[2]+e[2],t[3]=n[3]+e[3],t},vec4.subtract=function(t,n,e){return t[0]=n[0]-e[0],t[1]=n[1]-e[1],t[2]=n[2]-e[2],t[3]=n[3]-e[3],t},vec4.sub=vec4.subtract,vec4.multiply=function(t,n,e){return t[0]=n[0]*e[0],t[1]=n[1]*e[1],t[2]=n[2]*e[2],t[3]=n[3]*e[3],t},vec4.mul=vec4.multiply,vec4.divide=function(t,n,e){return t[0]=n[0]/e[0],t[1]=n[1]/e[1],t[2]=n[2]/e[2],t[3]=n[3]/e[3],t},vec4.div=vec4.divide,vec4.ceil=function(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t[2]=Math.ceil(n[2]),t[3]=Math.ceil(n[3]),t},vec4.floor=function(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t[2]=Math.floor(n[2]),t[3]=Math.floor(n[3]),t},vec4.min=function(t,n,e){return t[0]=Math.min(n[0],e[0]),t[1]=Math.min(n[1],e[1]),t[2]=Math.min(n[2],e[2]),t[3]=Math.min(n[3],e[3]),t},vec4.max=function(t,n,e){return t[0]=Math.max(n[0],e[0]),t[1]=Math.max(n[1],e[1]),t[2]=Math.max(n[2],e[2]),t[3]=Math.max(n[3],e[3]),t},vec4.round=function(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t[2]=Math.round(n[2]),t[3]=Math.round(n[3]),t},vec4.scale=function(t,n,e){return t[0]=n[0]*e,t[1]=n[1]*e,t[2]=n[2]*e,t[3]=n[3]*e,t},vec4.scaleAndAdd=function(t,n,e,r){return t[0]=n[0]+e[0]*r,t[1]=n[1]+e[1]*r,t[2]=n[2]+e[2]*r,t[3]=n[3]+e[3]*r,t},vec4.distance=function(t,n){var e=n[0]-t[0],r=n[1]-t[1],a=n[2]-t[2],c=n[3]-t[3];return Math.sqrt(e*e+r*r+a*a+c*c)},vec4.dist=vec4.distance,vec4.squaredDistance=function(t,n){var e=n[0]-t[0],r=n[1]-t[1],a=n[2]-t[2],c=n[3]-t[3];return e*e+r*r+a*a+c*c},vec4.sqrDist=vec4.squaredDistance,vec4.length=function(t){var n=t[0],e=t[1],r=t[2],a=t[3];return Math.sqrt(n*n+e*e+r*r+a*a)},vec4.len=vec4.length,vec4.squaredLength=function(t){var n=t[0],e=t[1],r=t[2],a=t[3];return n*n+e*e+r*r+a*a},vec4.sqrLen=vec4.squaredLength,vec4.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=-n[3],t},vec4.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t[3]=1/n[3],t},vec4.normalize=function(t,n){var e=n[0],r=n[1],a=n[2],c=n[3],u=e*e+r*r+a*a+c*c;return u>0&&(u=1/Math.sqrt(u),t[0]=e*u,t[1]=r*u,t[2]=a*u,t[3]=c*u),t},vec4.dot=function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3]},vec4.lerp=function(t,n,e,r){var a=n[0],c=n[1],u=n[2],i=n[3];return t[0]=a+r*(e[0]-a),t[1]=c+r*(e[1]-c),t[2]=u+r*(e[2]-u),t[3]=i+r*(e[3]-i),t},vec4.random=function(t,n){return n=n||1,t[0]=glMatrix.RANDOM(),t[1]=glMatrix.RANDOM(),t[2]=glMatrix.RANDOM(),t[3]=glMatrix.RANDOM(),vec4.normalize(t,t),vec4.scale(t,t,n),t},vec4.transformMat4=function(t,n,e){var r=n[0],a=n[1],c=n[2],u=n[3];return t[0]=e[0]*r+e[4]*a+e[8]*c+e[12]*u,t[1]=e[1]*r+e[5]*a+e[9]*c+e[13]*u,t[2]=e[2]*r+e[6]*a+e[10]*c+e[14]*u,t[3]=e[3]*r+e[7]*a+e[11]*c+e[15]*u,t},vec4.transformQuat=function(t,n,e){var r=n[0],a=n[1],c=n[2],u=e[0],i=e[1],v=e[2],o=e[3],M=o*r+i*c-v*a,h=o*a+v*r-u*c,f=o*c+u*a-i*r,l=-u*r-i*a-v*c;return t[0]=M*o+l*-u+h*-v-f*-i,t[1]=h*o+l*-i+f*-u-M*-v,t[2]=f*o+l*-v+M*-i-h*-u,t[3]=n[3],t},vec4.forEach=function(){var t=vec4.create();return function(n,e,r,a,c,u){var i,v;for(e||(e=4),r||(r=0),v=a?Math.min(a*e+r,n.length):n.length,i=r;i<v;i+=e)t[0]=n[i],t[1]=n[i+1],t[2]=n[i+2],t[3]=n[i+3],c(t,t,u),n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2],n[i+3]=t[3];return n}}(),vec4.str=function(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},vec4.exactEquals=function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]},vec4.equals=function(t,n){var e=t[0],r=t[1],a=t[2],c=t[3],u=n[0],i=n[1],v=n[2],o=n[3];return Math.abs(e-u)<=glMatrix.EPSILON*Math.max(1,Math.abs(e),Math.abs(u))&&Math.abs(r-i)<=glMatrix.EPSILON*Math.max(1,Math.abs(r),Math.abs(i))&&Math.abs(a-v)<=glMatrix.EPSILON*Math.max(1,Math.abs(a),Math.abs(v))&&Math.abs(c-o)<=glMatrix.EPSILON*Math.max(1,Math.abs(c),Math.abs(o))},module.exports=vec4;
	},{"./common.js":150}],159:[function(require,module,exports){
	"use strict";function GridIndex(t,r,e){var s=this.cells=[];if(t instanceof ArrayBuffer){this.arrayBuffer=t;var i=new Int32Array(this.arrayBuffer);t=i[0],r=i[1],e=i[2],this.d=r+2*e;for(var h=0;h<this.d*this.d;h++){var n=i[NUM_PARAMS+h],o=i[NUM_PARAMS+h+1];s.push(n===o?null:i.subarray(n,o))}var l=i[NUM_PARAMS+s.length],a=i[NUM_PARAMS+s.length+1];this.keys=i.subarray(l,a),this.bboxes=i.subarray(a),this.insert=this._insertReadonly}else{this.d=r+2*e;for(var d=0;d<this.d*this.d;d++)s.push([]);this.keys=[],this.bboxes=[]}this.n=r,this.extent=t,this.padding=e,this.scale=r/t,this.uid=0;var f=e/r*t;this.min=-f,this.max=t+f}module.exports=GridIndex;var NUM_PARAMS=3;GridIndex.prototype.insert=function(t,r,e,s,i){this._forEachCell(r,e,s,i,this._insertCell,this.uid++),this.keys.push(t),this.bboxes.push(r),this.bboxes.push(e),this.bboxes.push(s),this.bboxes.push(i)},GridIndex.prototype._insertReadonly=function(){throw"Cannot insert into a GridIndex created from an ArrayBuffer."},GridIndex.prototype._insertCell=function(t,r,e,s,i,h){this.cells[i].push(h)},GridIndex.prototype.query=function(t,r,e,s){var i=this.min,h=this.max;if(t<=i&&r<=i&&h<=e&&h<=s)return Array.prototype.slice.call(this.keys);var n=[],o={};return this._forEachCell(t,r,e,s,this._queryCell,n,o),n},GridIndex.prototype._queryCell=function(t,r,e,s,i,h,n){var o=this.cells[i];if(null!==o)for(var l=this.keys,a=this.bboxes,d=0;d<o.length;d++){var f=o[d];if(void 0===n[f]){var u=4*f;t<=a[u+2]&&r<=a[u+3]&&e>=a[u+0]&&s>=a[u+1]?(n[f]=!0,h.push(l[f])):n[f]=!1}}},GridIndex.prototype._forEachCell=function(t,r,e,s,i,h,n){for(var o=this._convertToCellCoord(t),l=this._convertToCellCoord(r),a=this._convertToCellCoord(e),d=this._convertToCellCoord(s),f=o;f<=a;f++)for(var u=l;u<=d;u++){var y=this.d*u+f;if(i.call(this,t,r,e,s,y,h,n))return}},GridIndex.prototype._convertToCellCoord=function(t){return Math.max(0,Math.min(this.d-1,Math.floor(t*this.scale)+this.padding))},GridIndex.prototype.toArrayBuffer=function(){if(this.arrayBuffer)return this.arrayBuffer;for(var t=this.cells,r=NUM_PARAMS+this.cells.length+1+1,e=0,s=0;s<this.cells.length;s++)e+=this.cells[s].length;var i=new Int32Array(r+e+this.keys.length+this.bboxes.length);i[0]=this.extent,i[1]=this.n,i[2]=this.padding;for(var h=r,n=0;n<t.length;n++){var o=t[n];i[NUM_PARAMS+n]=h,i.set(o,h),h+=o.length}return i[NUM_PARAMS+t.length]=h,i.set(this.keys,h),h+=this.keys.length,i[NUM_PARAMS+t.length+1]=h,i.set(this.bboxes,h),h+=this.bboxes.length,i.buffer};
	},{}],160:[function(require,module,exports){
	function xyz2lab(r){return r>t3?Math.pow(r,1/3):r/t2+t0}function lab2xyz(r){return r>t1?r*r*r:t2*(r-t0)}function xyz2rgb(r){return 255*(r<=.0031308?12.92*r:1.055*Math.pow(r,1/2.4)-.055)}function rgb2xyz(r){return(r/=255)<=.04045?r/12.92:Math.pow((r+.055)/1.055,2.4)}function rgbToLab(r){var t=rgb2xyz(r[0]),a=rgb2xyz(r[1]),n=rgb2xyz(r[2]),b=xyz2lab((.4124564*t+.3575761*a+.1804375*n)/Xn),o=xyz2lab((.2126729*t+.7151522*a+.072175*n)/Yn),g=xyz2lab((.0193339*t+.119192*a+.9503041*n)/Zn);return[116*o-16,500*(b-o),200*(o-g),r[3]]}function labToRgb(r){var t=(r[0]+16)/116,a=isNaN(r[1])?t:t+r[1]/500,n=isNaN(r[2])?t:t-r[2]/200;return t=Yn*lab2xyz(t),a=Xn*lab2xyz(a),n=Zn*lab2xyz(n),[xyz2rgb(3.2404542*a-1.5371385*t-.4985314*n),xyz2rgb(-.969266*a+1.8760108*t+.041556*n),xyz2rgb(.0556434*a-.2040259*t+1.0572252*n),r[3]]}function rgbToHcl(r){var t=rgbToLab(r),a=t[0],n=t[1],b=t[2],o=Math.atan2(b,n)*rad2deg;return[o<0?o+360:o,Math.sqrt(n*n+b*b),a,r[3]]}function hclToRgb(r){var t=r[0]*deg2rad,a=r[1],n=r[2];return labToRgb([n,Math.cos(t)*a,Math.sin(t)*a,r[3]])}var Kn=18,Xn=.95047,Yn=1,Zn=1.08883,t0=4/29,t1=6/29,t2=3*t1*t1,t3=t1*t1*t1,deg2rad=Math.PI/180,rad2deg=180/Math.PI;module.exports={lab:{forward:rgbToLab,reverse:labToRgb},hcl:{forward:rgbToHcl,reverse:hclToRgb}};
	},{}],161:[function(require,module,exports){
	"use strict";function identityFunction(t){return t}function createFunction(t,o){var e;if(isFunctionDefinition(t)){var n,r=t.stops&&"object"==typeof t.stops[0][0],i=r||void 0!==t.property,s=r||!i,a=t.stops&&typeof(r?t.stops[0][0].property:t.stops[0][0]),p=t.type||o||("string"===a?"categorical":"exponential");if("exponential"===p)n=evaluateExponentialFunction;else if("interval"===p)n=evaluateIntervalFunction;else if("categorical"===p)n=evaluateCategoricalFunction;else{if("identity"!==p)throw new Error('Unknown function type "'+p+'"');n=evaluateIdentityFunction}var u;if(t.colorSpace&&"rgb"!==t.colorSpace){if(!colorSpaces[t.colorSpace])throw new Error("Unknown color space: "+t.colorSpace);var c=colorSpaces[t.colorSpace];t=JSON.parse(JSON.stringify(t));for(var l=0;l<t.stops.length;l++)t.stops[l]=[t.stops[l][0],c.forward(t.stops[l][1])];u=c.reverse}else u=identityFunction;if(r){var f={},v=[];for(l=0;l<t.stops.length;l++){var y=t.stops[l];void 0===f[y[0].zoom]&&(f[y[0].zoom]={zoom:y[0].zoom,type:t.type,property:t.property,stops:[]}),f[y[0].zoom].stops.push([y[0].value,y[1]])}for(var F in f)v.push([f[F].zoom,createFunction(f[F])]);e=function(o,e){return u(evaluateExponentialFunction({stops:v,base:t.base},o)(o,e))},e.isFeatureConstant=!1,e.isZoomConstant=!1}else s?(e=function(o){return u(n(t,o))},e.isFeatureConstant=!0,e.isZoomConstant=!1):(e=function(o,e){return u(n(t,e[t.property]))},e.isFeatureConstant=!1,e.isZoomConstant=!0)}else e=function(){return t},e.isFeatureConstant=!0,e.isZoomConstant=!0;return e}function evaluateCategoricalFunction(t,o){for(var e=0;e<t.stops.length;e++)if(o===t.stops[e][0])return t.stops[e][1];return t.stops[0][1]}function evaluateIntervalFunction(t,o){for(var e=0;e<t.stops.length&&!(o<t.stops[e][0]);e++);return t.stops[Math.max(e-1,0)][1]}function evaluateExponentialFunction(t,o){for(var e=void 0!==t.base?t.base:1,n=0;;){if(n>=t.stops.length)break;if(o<=t.stops[n][0])break;n++}return 0===n?t.stops[n][1]:n===t.stops.length?t.stops[n-1][1]:interpolate(o,e,t.stops[n-1][0],t.stops[n][0],t.stops[n-1][1],t.stops[n][1])}function evaluateIdentityFunction(t,o){return o}function interpolate(t,o,e,n,r,i){return"function"==typeof r?function(){var s=r.apply(void 0,arguments),a=i.apply(void 0,arguments);return interpolate(t,o,e,n,s,a)}:r.length?interpolateArray(t,o,e,n,r,i):interpolateNumber(t,o,e,n,r,i)}function interpolateNumber(t,o,e,n,r,i){var s,a=n-e,p=t-e;return s=1===o?p/a:(Math.pow(o,p)-1)/(Math.pow(o,a)-1),r*(1-s)+i*s}function interpolateArray(t,o,e,n,r,i){for(var s=[],a=0;a<r.length;a++)s[a]=interpolateNumber(t,o,e,n,r[a],i[a]);return s}function isFunctionDefinition(t){return"object"==typeof t&&(t.stops||"identity"===t.type)}var colorSpaces=require("./color_spaces");module.exports.isFunctionDefinition=isFunctionDefinition,module.exports.interpolated=function(t){return createFunction(t,"exponential")},module.exports["piecewise-constant"]=function(t){return createFunction(t,"interval")};
	},{"./color_spaces":160}],162:[function(require,module,exports){
	var path=require("path");module.exports={prelude:{fragmentSource:"#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n",vertexSource:"#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nfloat evaluate_zoom_function_1(const vec4 values, const float t) {\n    if (t < 1.0) {\n        return mix(values[0], values[1], t);\n    } else if (t < 2.0) {\n        return mix(values[1], values[2], t - 1.0);\n    } else {\n        return mix(values[2], values[3], t - 2.0);\n    }\n}\nvec4 evaluate_zoom_function_4(const vec4 value0, const vec4 value1, const vec4 value2, const vec4 value3, const float t) {\n    if (t < 1.0) {\n        return mix(value0, value1, t);\n    } else if (t < 2.0) {\n        return mix(value1, value2, t - 1.0);\n    } else {\n        return mix(value2, value3, t - 2.0);\n    }\n}\n\n// The offset depends on how many pixels are between the world origin and the edge of the tile:\n// vec2 offset = mod(pixel_coord, size)\n//\n// At high zoom levels there are a ton of pixels between the world origin and the edge of the tile.\n// The glsl spec only guarantees 16 bits of precision for highp floats. We need more than that.\n//\n// The pixel_coord is passed in as two 16 bit values:\n// pixel_coord_upper = floor(pixel_coord / 2^16)\n// pixel_coord_lower = mod(pixel_coord, 2^16)\n//\n// The offset is calculated in a series of steps that should preserve this precision:\nvec2 get_pattern_pos(const vec2 pixel_coord_upper, const vec2 pixel_coord_lower,\n    const vec2 pattern_size, const float tile_units_to_pixels, const vec2 pos) {\n\n    vec2 offset = mod(mod(mod(pixel_coord_upper, pattern_size) * 256.0, pattern_size) * 256.0 + pixel_coord_lower, pattern_size);\n    return (tile_units_to_pixels * pos + offset) / pattern_size;\n}\n"},circle:{fragmentSource:"#pragma mapbox: define lowp vec4 color\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n\nvarying vec2 v_extrude;\nvarying lowp float v_antialiasblur;\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n\n    float t = smoothstep(1.0 - max(blur, v_antialiasblur), 1.0, length(v_extrude));\n    gl_FragColor = color * (1.0 - t) * opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform bool u_scale_with_map;\nuniform vec2 u_extrude_scale;\nuniform float u_devicepixelratio;\n\nattribute vec2 a_pos;\n\n#pragma mapbox: define lowp vec4 color\n#pragma mapbox: define mediump float radius\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n\nvarying vec2 v_extrude;\nvarying lowp float v_antialiasblur;\n\nvoid main(void) {\n    #pragma mapbox: initialize lowp vec4 color\n    #pragma mapbox: initialize mediump float radius\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n\n    // unencode the extrusion vector that we snuck into the a_pos vector\n    v_extrude = vec2(mod(a_pos, 2.0) * 2.0 - 1.0);\n\n    vec2 extrude = v_extrude * radius * u_extrude_scale;\n    // multiply a_pos by 0.5, since we had it * 2 in order to sneak\n    // in extrusion data\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5), 0, 1);\n\n    if (u_scale_with_map) {\n        gl_Position.xy += extrude;\n    } else {\n        gl_Position.xy += extrude * gl_Position.w;\n    }\n\n    // This is a minimum blur distance that serves as a faux-antialiasing for\n    // the circle. since blur is a ratio of the circle's size and the intent is\n    // to keep the blur at roughly 1px, the two are inversely related.\n    v_antialiasblur = 1.0 / u_devicepixelratio / radius;\n}\n"},collisionBox:{fragmentSource:"uniform float u_zoom;\nuniform float u_maxzoom;\n\nvarying float v_max_zoom;\nvarying float v_placement_zoom;\n\nvoid main() {\n\n    float alpha = 0.5;\n\n    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0) * alpha;\n\n    if (v_placement_zoom > u_zoom) {\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * alpha;\n    }\n\n    if (u_zoom >= v_max_zoom) {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) * alpha * 0.25;\n    }\n\n    if (v_placement_zoom >= u_maxzoom) {\n        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0) * alpha * 0.2;\n    }\n}\n",vertexSource:"attribute vec2 a_pos;\nattribute vec2 a_extrude;\nattribute vec2 a_data;\n\nuniform mat4 u_matrix;\nuniform float u_scale;\n\nvarying float v_max_zoom;\nvarying float v_placement_zoom;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos + a_extrude / u_scale, 0.0, 1.0);\n\n    v_max_zoom = a_data.x;\n    v_placement_zoom = a_data.y;\n}\n"},debug:{fragmentSource:"uniform lowp vec4 u_color;\n\nvoid main() {\n    gl_FragColor = u_color;\n}\n",vertexSource:"attribute vec2 a_pos;\n\nuniform mat4 u_matrix;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, step(32767.0, a_pos.x), 1);\n}\n"},fill:{fragmentSource:"#pragma mapbox: define lowp vec4 color\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_FragColor = color * opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"attribute vec2 a_pos;\n\nuniform mat4 u_matrix;\n\n#pragma mapbox: define lowp vec4 color\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n}\n"},fillOutline:{fragmentSource:"#pragma mapbox: define lowp vec4 outline_color\n#pragma mapbox: define lowp float opacity\n\nvarying vec2 v_pos;\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 outline_color\n    #pragma mapbox: initialize lowp float opacity\n\n    float dist = length(v_pos - gl_FragCoord.xy);\n    float alpha = smoothstep(1.0, 0.0, dist);\n    gl_FragColor = outline_color * (alpha * opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"attribute vec2 a_pos;\n\nuniform mat4 u_matrix;\nuniform vec2 u_world;\n\nvarying vec2 v_pos;\n\n#pragma mapbox: define lowp vec4 outline_color\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 outline_color\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos = (gl_Position.xy / gl_Position.w + 1.0) / 2.0 * u_world;\n}\n"},fillOutlinePattern:{fragmentSource:"uniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec2 v_pos;\n\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp float opacity\n\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a, u_pattern_br_a, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b, u_pattern_br_b, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    // find distance to outline for alpha interpolation\n\n    float dist = length(v_pos - gl_FragCoord.xy);\n    float alpha = smoothstep(1.0, 0.0, dist);\n\n\n    gl_FragColor = mix(color1, color2, u_mix) * alpha * opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_world;\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pixel_coord_upper;\nuniform vec2 u_pixel_coord_lower;\nuniform float u_scale_a;\nuniform float u_scale_b;\nuniform float u_tile_units_to_pixels;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec2 v_pos;\n\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n\n    v_pos_a = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_a * u_pattern_size_a, u_tile_units_to_pixels, a_pos);\n    v_pos_b = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_b * u_pattern_size_b, u_tile_units_to_pixels, a_pos);\n\n    v_pos = (gl_Position.xy / gl_Position.w + 1.0) / 2.0 * u_world;\n}\n"},fillPattern:{fragmentSource:"uniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp float opacity\n\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a, u_pattern_br_a, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b, u_pattern_br_b, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    gl_FragColor = mix(color1, color2, u_mix) * opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pixel_coord_upper;\nuniform vec2 u_pixel_coord_lower;\nuniform float u_scale_a;\nuniform float u_scale_b;\nuniform float u_tile_units_to_pixels;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n\n    v_pos_a = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_a * u_pattern_size_a, u_tile_units_to_pixels, a_pos);\n    v_pos_b = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_b * u_pattern_size_b, u_tile_units_to_pixels, a_pos);\n}\n"},fillExtrusion:{fragmentSource:"varying vec4 v_color;\n#pragma mapbox: define lowp float base\n#pragma mapbox: define lowp float height\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n    #pragma mapbox: initialize lowp float base\n    #pragma mapbox: initialize lowp float height\n    #pragma mapbox: initialize lowp vec4 color\n\n    gl_FragColor = v_color;\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec3 u_lightcolor;\nuniform lowp vec3 u_lightpos;\nuniform lowp float u_lightintensity;\nuniform lowp vec4 u_outline_color;\n\nattribute vec2 a_pos;\nattribute vec3 a_normal;\nattribute float a_edgedistance;\n\nvarying vec4 v_color;\n\n#pragma mapbox: define lowp float base\n#pragma mapbox: define lowp float height\n\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n    #pragma mapbox: initialize lowp float base\n    #pragma mapbox: initialize lowp float height\n    #pragma mapbox: initialize lowp vec4 color\n\n    float ed = a_edgedistance; // use each attrib in order to not trip a VAO assert\n    float t = mod(a_normal.x, 2.0);\n\n    gl_Position = u_matrix * vec4(a_pos, t > 0.0 ? height : base, 1);\n\n#ifdef OUTLINE\n    color = u_outline_color;\n#endif\n\n    // Relative luminance (how dark/bright is the surface color?)\n    float colorvalue = color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;\n\n    v_color = vec4(0.0, 0.0, 0.0, 1.0);\n\n    // Add slight ambient lighting so no extrusions are totally black\n    vec4 ambientlight = vec4(0.03, 0.03, 0.03, 1.0);\n    color += ambientlight;\n\n    // Calculate cos(theta), where theta is the angle between surface normal and diffuse light ray\n    float directional = clamp(dot(a_normal / 16384.0, u_lightpos), 0.0, 1.0);\n\n    // Adjust directional so that\n    // the range of values for highlight/shading is narrower\n    // with lower light intensity\n    // and with lighter/brighter surface colors\n    directional = mix((1.0 - u_lightintensity), max((1.0 - colorvalue + u_lightintensity), 1.0), directional);\n\n    // Add gradient along z axis of side surfaces\n    if (a_normal.y != 0.0) {\n        directional *= clamp((t + base) * pow(height / 150.0, 0.5), mix(0.7, 0.98, 1.0 - u_lightintensity), 1.0);\n    }\n\n    // Assign final color based on surface + ambient light color, diffuse light directional, and light color\n    // with lower bounds adjusted to hue of light\n    // so that shading is tinted with the complementary (opposite) color to the light color\n    v_color.r += clamp(color.r * directional * u_lightcolor.r, mix(0.0, 0.3, 1.0 - u_lightcolor.r), 1.0);\n    v_color.g += clamp(color.g * directional * u_lightcolor.g, mix(0.0, 0.3, 1.0 - u_lightcolor.g), 1.0);\n    v_color.b += clamp(color.b * directional * u_lightcolor.b, mix(0.0, 0.3, 1.0 - u_lightcolor.b), 1.0);\n}\n"},fillExtrusionPattern:{fragmentSource:"uniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec4 v_lighting;\n\n#pragma mapbox: define lowp float base\n#pragma mapbox: define lowp float height\n\nvoid main() {\n    #pragma mapbox: initialize lowp float base\n    #pragma mapbox: initialize lowp float height\n\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a, u_pattern_br_a, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b, u_pattern_br_b, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    vec4 mixedColor = mix(color1, color2, u_mix);\n\n    gl_FragColor = mixedColor * v_lighting;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pixel_coord_upper;\nuniform vec2 u_pixel_coord_lower;\nuniform float u_scale_a;\nuniform float u_scale_b;\nuniform float u_tile_units_to_pixels;\nuniform float u_height_factor;\n\nuniform vec3 u_lightcolor;\nuniform lowp vec3 u_lightpos;\nuniform lowp float u_lightintensity;\n\nattribute vec2 a_pos;\nattribute vec3 a_normal;\nattribute float a_edgedistance;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec4 v_lighting;\nvarying float v_directional;\n\n#pragma mapbox: define lowp float base\n#pragma mapbox: define lowp float height\n\nvoid main() {\n    #pragma mapbox: initialize lowp float base\n    #pragma mapbox: initialize lowp float height\n\n    float t = mod(a_normal.x, 2.0);\n    float z = t > 0.0 ? height : base;\n\n    gl_Position = u_matrix * vec4(a_pos, z, 1);\n\n    vec2 pos = a_normal.x == 1.0 && a_normal.y == 0.0 && a_normal.z == 16384.0\n        ? a_pos // extrusion top\n        : vec2(a_edgedistance, z * u_height_factor); // extrusion side\n\n    v_pos_a = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_a * u_pattern_size_a, u_tile_units_to_pixels, pos);\n    v_pos_b = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_b * u_pattern_size_b, u_tile_units_to_pixels, pos);\n\n    v_lighting = vec4(0.0, 0.0, 0.0, 1.0);\n    float directional = clamp(dot(a_normal / 16383.0, u_lightpos), 0.0, 1.0);\n    directional = mix((1.0 - u_lightintensity), max((0.5 + u_lightintensity), 1.0), directional);\n\n    if (a_normal.y != 0.0) {\n        directional *= clamp((t + base) * pow(height / 150.0, 0.5), mix(0.7, 0.98, 1.0 - u_lightintensity), 1.0);\n    }\n\n    v_lighting.rgb += clamp(directional * u_lightcolor, mix(vec3(0.0), vec3(0.3), 1.0 - u_lightcolor), vec3(1.0));\n}\n"},extrusionTexture:{fragmentSource:"uniform sampler2D u_texture;\nuniform float u_opacity;\n\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_FragColor = texture2D(u_texture, v_pos) * u_opacity;\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform int u_xdim;\nuniform int u_ydim;\nattribute vec2 a_pos;\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n\n    v_pos.x = a_pos.x / float(u_xdim);\n    v_pos.y = 1.0 - a_pos.y / float(u_ydim);\n}\n"},line:{fragmentSource:"uniform lowp float u_opacity;\nuniform float u_blur;\n\n#pragma mapbox: define lowp vec4 color\n\nvarying vec2 v_linewidth;\nvarying vec2 v_normal;\nvarying float v_gamma_scale;\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * v_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (v_linewidth.t - blur), v_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    gl_FragColor = color * (alpha * u_opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform mat4 u_matrix;\nuniform mediump float u_ratio;\nuniform mediump float u_linewidth;\nuniform mediump float u_gapwidth;\nuniform mediump float u_antialiasing;\nuniform mediump float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform mediump float u_offset;\nuniform mediump float u_blur;\n\nvarying vec2 v_normal;\nvarying vec2 v_linewidth;\nvarying float v_gamma_scale;\n\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n\n    vec2 a_extrude = a_data.xy - 128.0;\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    mediump vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    float inset = u_gapwidth + (u_gapwidth > 0.0 ? u_antialiasing : 0.0);\n    float outset = u_gapwidth + u_linewidth * (u_gapwidth > 0.0 ? 2.0 : 1.0) + u_antialiasing;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    mediump vec2 dist = outset * a_extrude * scale;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    mediump float u = 0.5 * a_direction;\n    mediump float t = 1.0 - abs(u);\n    mediump vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist) / u_ratio, 0.0, 1.0);\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_linewidth = vec2(outset, inset);\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n"},linePattern:{fragmentSource:"uniform float u_blur;\n\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_fade;\nuniform float u_opacity;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_normal;\nvarying vec2 v_linewidth;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * v_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (v_linewidth.t - blur), v_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    float x_a = mod(v_linesofar / u_pattern_size_a.x, 1.0);\n    float x_b = mod(v_linesofar / u_pattern_size_b.x, 1.0);\n    float y_a = 0.5 + (v_normal.y * v_linewidth.s / u_pattern_size_a.y);\n    float y_b = 0.5 + (v_normal.y * v_linewidth.s / u_pattern_size_b.y);\n    vec2 pos_a = mix(u_pattern_tl_a, u_pattern_br_a, vec2(x_a, y_a));\n    vec2 pos_b = mix(u_pattern_tl_b, u_pattern_br_b, vec2(x_b, y_b));\n\n    vec4 color = mix(texture2D(u_image, pos_a), texture2D(u_image, pos_b), u_fade);\n\n    alpha *= u_opacity;\n\n    gl_FragColor = color * alpha;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\n// We scale the distance before adding it to the buffers so that we can store\n// long distances for long segments. Use this value to unscale the distance.\n#define LINE_DISTANCE_SCALE 2.0\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform mat4 u_matrix;\nuniform mediump float u_ratio;\nuniform mediump float u_linewidth;\nuniform mediump float u_gapwidth;\nuniform mediump float u_antialiasing;\nuniform mediump float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform mediump float u_offset;\n\nvarying vec2 v_normal;\nvarying vec2 v_linewidth;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_extrude = a_data.xy - 128.0;\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\n    float a_linesofar = (floor(a_data.z / 4.0) + a_data.w * 64.0) * LINE_DISTANCE_SCALE;\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    mediump vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    float inset = u_gapwidth + (u_gapwidth > 0.0 ? u_antialiasing : 0.0);\n    float outset = u_gapwidth + u_linewidth * (u_gapwidth > 0.0 ? 2.0 : 1.0) + u_antialiasing;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    mediump vec2 dist = outset * a_extrude * scale;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    mediump float u = 0.5 * a_direction;\n    mediump float t = 1.0 - abs(u);\n    mediump vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist) / u_ratio, 0.0, 1.0);\n    v_linesofar = a_linesofar;\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_linewidth = vec2(outset, inset);\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n"},lineSDF:{fragmentSource:"uniform lowp float u_opacity;\n\nuniform float u_blur;\nuniform sampler2D u_image;\nuniform float u_sdfgamma;\nuniform float u_mix;\n\nvarying vec2 v_normal;\nvarying vec2 v_linewidth;\nvarying vec2 v_tex_a;\nvarying vec2 v_tex_b;\nvarying float v_gamma_scale;\n\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * v_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (v_linewidth.t - blur), v_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    float sdfdist_a = texture2D(u_image, v_tex_a).a;\n    float sdfdist_b = texture2D(u_image, v_tex_b).a;\n    float sdfdist = mix(sdfdist_a, sdfdist_b, u_mix);\n    alpha *= smoothstep(0.5 - u_sdfgamma, 0.5 + u_sdfgamma, sdfdist);\n\n    gl_FragColor = color * (alpha * u_opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\n// We scale the distance before adding it to the buffers so that we can store\n// long distances for long segments. Use this value to unscale the distance.\n#define LINE_DISTANCE_SCALE 2.0\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform mat4 u_matrix;\nuniform mediump float u_ratio;\nuniform mediump float u_linewidth;\nuniform mediump float u_gapwidth;\nuniform mediump float u_antialiasing;\nuniform vec2 u_patternscale_a;\nuniform float u_tex_y_a;\nuniform vec2 u_patternscale_b;\nuniform float u_tex_y_b;\nuniform float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform mediump float u_offset;\n\nvarying vec2 v_normal;\nvarying vec2 v_linewidth;\nvarying vec2 v_tex_a;\nvarying vec2 v_tex_b;\nvarying float v_gamma_scale;\n\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n\n    vec2 a_extrude = a_data.xy - 128.0;\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\n    float a_linesofar = (floor(a_data.z / 4.0) + a_data.w * 64.0) * LINE_DISTANCE_SCALE;\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    mediump vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    float inset = u_gapwidth + (u_gapwidth > 0.0 ? u_antialiasing : 0.0);\n    float outset = u_gapwidth + u_linewidth * (u_gapwidth > 0.0 ? 2.0 : 1.0) + u_antialiasing;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    mediump vec2 dist = outset * a_extrude * scale;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    mediump float u = 0.5 * a_direction;\n    mediump float t = 1.0 - abs(u);\n    mediump vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist) / u_ratio, 0.0, 1.0);\n\n    v_tex_a = vec2(a_linesofar * u_patternscale_a.x, normal.y * u_patternscale_a.y + u_tex_y_a);\n    v_tex_b = vec2(a_linesofar * u_patternscale_b.x, normal.y * u_patternscale_b.y + u_tex_y_b);\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_linewidth = vec2(outset, inset);\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n"},raster:{fragmentSource:"uniform float u_opacity0;\nuniform float u_opacity1;\nuniform sampler2D u_image0;\nuniform sampler2D u_image1;\nvarying vec2 v_pos0;\nvarying vec2 v_pos1;\n\nuniform float u_brightness_low;\nuniform float u_brightness_high;\n\nuniform float u_saturation_factor;\nuniform float u_contrast_factor;\nuniform vec3 u_spin_weights;\n\nvoid main() {\n\n    // read and cross-fade colors from the main and parent tiles\n    vec4 color0 = texture2D(u_image0, v_pos0);\n    vec4 color1 = texture2D(u_image1, v_pos1);\n    vec4 color = color0 * u_opacity0 + color1 * u_opacity1;\n    vec3 rgb = color.rgb;\n\n    // spin\n    rgb = vec3(\n        dot(rgb, u_spin_weights.xyz),\n        dot(rgb, u_spin_weights.zxy),\n        dot(rgb, u_spin_weights.yzx));\n\n    // saturation\n    float average = (color.r + color.g + color.b) / 3.0;\n    rgb += (average - rgb) * u_saturation_factor;\n\n    // contrast\n    rgb = (rgb - 0.5) * u_contrast_factor + 0.5;\n\n    // brightness\n    vec3 u_high_vec = vec3(u_brightness_low, u_brightness_low, u_brightness_low);\n    vec3 u_low_vec = vec3(u_brightness_high, u_brightness_high, u_brightness_high);\n\n    gl_FragColor = vec4(mix(u_high_vec, u_low_vec, rgb), color.a);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_tl_parent;\nuniform float u_scale_parent;\nuniform float u_buffer_scale;\n\nattribute vec2 a_pos;\nattribute vec2 a_texture_pos;\n\nvarying vec2 v_pos0;\nvarying vec2 v_pos1;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos0 = (((a_texture_pos / 32767.0) - 0.5) / u_buffer_scale ) + 0.5;\n    v_pos1 = (v_pos0 * u_scale_parent) + u_tl_parent;\n}\n"},symbolIcon:{fragmentSource:"uniform sampler2D u_texture;\nuniform sampler2D u_fadetexture;\nuniform lowp float u_opacity;\n\nvarying vec2 v_tex;\nvarying vec2 v_fade_tex;\n\nvoid main() {\n    lowp float alpha = texture2D(u_fadetexture, v_fade_tex).a * u_opacity;\n    gl_FragColor = texture2D(u_texture, v_tex) * alpha;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"attribute vec2 a_pos;\nattribute vec2 a_offset;\nattribute vec2 a_texture_pos;\nattribute vec4 a_data;\n\n\n// matrix is for the vertex position.\nuniform mat4 u_matrix;\n\nuniform mediump float u_zoom;\nuniform bool u_rotate_with_map;\nuniform vec2 u_extrude_scale;\n\nuniform vec2 u_texsize;\n\nvarying vec2 v_tex;\nvarying vec2 v_fade_tex;\n\nvoid main() {\n    vec2 a_tex = a_texture_pos.xy;\n    mediump float a_labelminzoom = a_data[0];\n    mediump vec2 a_zoom = a_data.pq;\n    mediump float a_minzoom = a_zoom[0];\n    mediump float a_maxzoom = a_zoom[1];\n\n    // u_zoom is the current zoom level adjusted for the change in font size\n    mediump float z = 2.0 - step(a_minzoom, u_zoom) - (1.0 - step(a_maxzoom, u_zoom));\n\n    vec2 extrude = u_extrude_scale * (a_offset / 64.0);\n    if (u_rotate_with_map) {\n        gl_Position = u_matrix * vec4(a_pos + extrude, 0, 1);\n        gl_Position.z += z * gl_Position.w;\n    } else {\n        gl_Position = u_matrix * vec4(a_pos, 0, 1) + vec4(extrude, 0, 0);\n    }\n\n    v_tex = a_tex / u_texsize;\n    v_fade_tex = vec2(a_labelminzoom / 255.0, 0.0);\n}\n"
	},symbolSDF:{fragmentSource:"uniform sampler2D u_texture;\nuniform sampler2D u_fadetexture;\nuniform lowp vec4 u_color;\nuniform lowp float u_opacity;\nuniform lowp float u_buffer;\nuniform lowp float u_gamma;\n\nvarying vec2 v_tex;\nvarying vec2 v_fade_tex;\nvarying float v_gamma_scale;\n\nvoid main() {\n    lowp float dist = texture2D(u_texture, v_tex).a;\n    lowp float fade_alpha = texture2D(u_fadetexture, v_fade_tex).a;\n    lowp float gamma = u_gamma * v_gamma_scale;\n    lowp float alpha = smoothstep(u_buffer - gamma, u_buffer + gamma, dist) * fade_alpha;\n\n    gl_FragColor = u_color * (alpha * u_opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"const float PI = 3.141592653589793;\n\nattribute vec2 a_pos;\nattribute vec2 a_offset;\nattribute vec2 a_texture_pos;\nattribute vec4 a_data;\n\n\n// matrix is for the vertex position.\nuniform mat4 u_matrix;\n\nuniform mediump float u_zoom;\nuniform bool u_rotate_with_map;\nuniform bool u_pitch_with_map;\nuniform mediump float u_pitch;\nuniform mediump float u_bearing;\nuniform mediump float u_aspect_ratio;\nuniform vec2 u_extrude_scale;\n\nuniform vec2 u_texsize;\n\nvarying vec2 v_tex;\nvarying vec2 v_fade_tex;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_tex = a_texture_pos.xy;\n    mediump float a_labelminzoom = a_data[0];\n    mediump vec2 a_zoom = a_data.pq;\n    mediump float a_minzoom = a_zoom[0];\n    mediump float a_maxzoom = a_zoom[1];\n\n    // u_zoom is the current zoom level adjusted for the change in font size\n    mediump float z = 2.0 - step(a_minzoom, u_zoom) - (1.0 - step(a_maxzoom, u_zoom));\n\n    // pitch-alignment: map\n    // rotation-alignment: map | viewport\n    if (u_pitch_with_map) {\n        lowp float angle = u_rotate_with_map ? (a_data[1] / 256.0 * 2.0 * PI) : u_bearing;\n        lowp float asin = sin(angle);\n        lowp float acos = cos(angle);\n        mat2 RotationMatrix = mat2(acos, asin, -1.0 * asin, acos);\n        vec2 offset = RotationMatrix * a_offset;\n        vec2 extrude = u_extrude_scale * (offset / 64.0);\n        gl_Position = u_matrix * vec4(a_pos + extrude, 0, 1);\n        gl_Position.z += z * gl_Position.w;\n    // pitch-alignment: viewport\n    // rotation-alignment: map\n    } else if (u_rotate_with_map) {\n        // foreshortening factor to apply on pitched maps\n        // as a label goes from horizontal <=> vertical in angle\n        // it goes from 0% foreshortening to up to around 70% foreshortening\n        lowp float pitchfactor = 1.0 - cos(u_pitch * sin(u_pitch * 0.75));\n\n        lowp float lineangle = a_data[1] / 256.0 * 2.0 * PI;\n\n        // use the lineangle to position points a,b along the line\n        // project the points and calculate the label angle in projected space\n        // this calculation allows labels to be rendered unskewed on pitched maps\n        vec4 a = u_matrix * vec4(a_pos, 0, 1);\n        vec4 b = u_matrix * vec4(a_pos + vec2(cos(lineangle),sin(lineangle)), 0, 1);\n        lowp float angle = atan((b[1]/b[3] - a[1]/a[3])/u_aspect_ratio, b[0]/b[3] - a[0]/a[3]);\n        lowp float asin = sin(angle);\n        lowp float acos = cos(angle);\n        mat2 RotationMatrix = mat2(acos, -1.0 * asin, asin, acos);\n\n        vec2 offset = RotationMatrix * (vec2((1.0-pitchfactor)+(pitchfactor*cos(angle*2.0)), 1.0) * a_offset);\n        vec2 extrude = u_extrude_scale * (offset / 64.0);\n        gl_Position = u_matrix * vec4(a_pos, 0, 1) + vec4(extrude, 0, 0);\n        gl_Position.z += z * gl_Position.w;\n    // pitch-alignment: viewport\n    // rotation-alignment: viewport\n    } else {\n        vec2 extrude = u_extrude_scale * (a_offset / 64.0);\n        gl_Position = u_matrix * vec4(a_pos, 0, 1) + vec4(extrude, 0, 0);\n    }\n\n    v_gamma_scale = (gl_Position.w - 0.5);\n\n    v_tex = a_tex / u_texsize;\n    v_fade_tex = vec2(a_labelminzoom / 255.0, 0.0);\n}\n"}};
	},{"path":130}],163:[function(require,module,exports){
	"use strict";function deref(r,e){var t={};for(var f in r)"ref"!==f&&(t[f]=r[f]);return refProperties.forEach(function(r){r in e&&(t[r]=e[r])}),t}var refProperties=require("./util/ref_properties");module.exports=function(r){r=r.slice();var e,t=Object.create(null);for(e=0;e<r.length;e++)t[r[e].id]=r[e];for(e=0;e<r.length;e++)"ref"in r[e]&&(r[e]=deref(r[e],t[r[e].ref]));return r};
	},{"./util/ref_properties":168}],164:[function(require,module,exports){
	"use strict";function ValidationError(r,i){this.message=(r?r+": ":"")+format.apply(format,Array.prototype.slice.call(arguments,2)),null!==i&&void 0!==i&&i.__line__&&(this.line=i.__line__)}var format=require("util").format;module.exports=ValidationError;
	},{"util":134}],165:[function(require,module,exports){
	"use strict";function key(r){return stringify(refProperties.map(function(e){return r[e]}))}var refProperties=require("./util/ref_properties"),stringify=require("fast-stable-stringify");module.exports=function(r){var e,t,i={};for(e=0;e<r.length;e++){t=key(r[e]);var n=i[t];n||(n=i[t]=[]),n.push(r[e])}var s=[];for(t in i)s.push(i[t]);return s};
	},{"./util/ref_properties":168,"fast-stable-stringify":188}],166:[function(require,module,exports){
	"use strict";module.exports=function(r){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var n in e)r[n]=e[n]}return r};
	},{}],167:[function(require,module,exports){
	"use strict";module.exports=function(n){return n instanceof Number?"number":n instanceof String?"string":n instanceof Boolean?"boolean":Array.isArray(n)?"array":null===n?"null":typeof n};
	},{}],168:[function(require,module,exports){
	"use strict";module.exports=["type","source","source-layer","minzoom","maxzoom","filter","layout"];
	},{}],169:[function(require,module,exports){
	"use strict";module.exports=function(n){return n instanceof Number||n instanceof String||n instanceof Boolean?n.valueOf():n};
	},{}],170:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),getType=require("../util/get_type"),extend=require("../util/extend");module.exports=function(e){var r=require("./validate_function"),t=require("./validate_object"),a={"*":function(){return[]},array:require("./validate_array"),boolean:require("./validate_boolean"),number:require("./validate_number"),color:require("./validate_color"),constants:require("./validate_constants"),enum:require("./validate_enum"),filter:require("./validate_filter"),function:require("./validate_function"),layer:require("./validate_layer"),object:require("./validate_object"),source:require("./validate_source"),string:require("./validate_string")},i=e.value,n=e.valueSpec,u=e.key,o=e.styleSpec,l=e.style;if("string"===getType(i)&&"@"===i[0]){if(o.$version>7)return[new ValidationError(u,i,"constants have been deprecated as of v8")];if(!(i in l.constants))return[new ValidationError(u,i,'constant "%s" not found',i)];e=extend({},e,{value:l.constants[i]})}return n.function&&"object"===getType(i)?r(e):n.type&&a[n.type]?a[n.type](e):t(extend({},e,{valueSpec:n.type?o[n.type]:n}))};
	},{"../error/validation_error":164,"../util/extend":166,"../util/get_type":167,"./validate_array":171,"./validate_boolean":172,"./validate_color":173,"./validate_constants":174,"./validate_enum":175,"./validate_filter":176,"./validate_function":177,"./validate_layer":179,"./validate_number":182,"./validate_object":183,"./validate_source":185,"./validate_string":186}],171:[function(require,module,exports){
	"use strict";var getType=require("../util/get_type"),validate=require("./validate"),ValidationError=require("../error/validation_error");module.exports=function(e){var r=e.value,t=e.valueSpec,a=e.style,n=e.styleSpec,l=e.key,i=e.arrayElementValidator||validate;if("array"!==getType(r))return[new ValidationError(l,r,"array expected, %s found",getType(r))];if(t.length&&r.length!==t.length)return[new ValidationError(l,r,"array length %d expected, length %d found",t.length,r.length)];if(t["min-length"]&&r.length<t["min-length"])return[new ValidationError(l,r,"array length at least %d expected, length %d found",t["min-length"],r.length)];var o={type:t.value};n.$version<7&&(o.function=t.function),"object"===getType(t.value)&&(o=t.value);for(var u=[],d=0;d<r.length;d++)u=u.concat(i({array:r,arrayIndex:d,value:r[d],valueSpec:o,style:a,styleSpec:n,key:l+"["+d+"]"}));return u};
	},{"../error/validation_error":164,"../util/get_type":167,"./validate":170}],172:[function(require,module,exports){
	"use strict";var getType=require("../util/get_type"),ValidationError=require("../error/validation_error");module.exports=function(e){var r=e.value,o=e.key,t=getType(r);return"boolean"!==t?[new ValidationError(o,r,"boolean expected, %s found",t)]:[]};
	},{"../error/validation_error":164,"../util/get_type":167}],173:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),getType=require("../util/get_type"),parseCSSColor=require("csscolorparser").parseCSSColor;module.exports=function(r){var e=r.key,o=r.value,t=getType(o);return"string"!==t?[new ValidationError(e,o,"color expected, %s found",t)]:null===parseCSSColor(o)?[new ValidationError(e,o,'color expected, "%s" found',o)]:[]};
	},{"../error/validation_error":164,"../util/get_type":167,"csscolorparser":135}],174:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),getType=require("../util/get_type");module.exports=function(r){var e=r.key,t=r.value,a=r.styleSpec;if(a.$version>7)return t?[new ValidationError(e,t,"constants have been deprecated as of v8")]:[];var o=getType(t);if("object"!==o)return[new ValidationError(e,t,"object expected, %s found",o)];var n=[];for(var i in t)"@"!==i[0]&&n.push(new ValidationError(e+"."+i,t[i],'constants must start with "@"'));return n};
	},{"../error/validation_error":164,"../util/get_type":167}],175:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),unbundle=require("../util/unbundle_jsonlint");module.exports=function(e){var r=e.key,n=e.value,u=e.valueSpec,o=[];return Array.isArray(u.values)?u.values.indexOf(unbundle(n))===-1&&o.push(new ValidationError(r,n,"expected one of [%s], %s found",u.values.join(", "),n)):Object.keys(u.values).indexOf(unbundle(n))===-1&&o.push(new ValidationError(r,n,"expected one of [%s], %s found",Object.keys(u.values).join(", "),n)),o};
	},{"../error/validation_error":164,"../util/unbundle_jsonlint":169}],176:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),validateEnum=require("./validate_enum"),getType=require("../util/get_type"),unbundle=require("../util/unbundle_jsonlint");module.exports=function e(t){var r,a=t.value,n=t.key,l=t.styleSpec,s=[];if("array"!==getType(a))return[new ValidationError(n,a,"array expected, %s found",getType(a))];if(a.length<1)return[new ValidationError(n,a,"filter array must have at least 1 element")];switch(s=s.concat(validateEnum({key:n+"[0]",value:a[0],valueSpec:l.filter_operator,style:t.style,styleSpec:t.styleSpec})),unbundle(a[0])){case"<":case"<=":case">":case">=":a.length>=2&&"$type"==a[1]&&s.push(new ValidationError(n,a,'"$type" cannot be use with operator "%s"',a[0]));case"==":case"!=":3!=a.length&&s.push(new ValidationError(n,a,'filter array for operator "%s" must have 3 elements',a[0]));case"in":case"!in":a.length>=2&&(r=getType(a[1]),"string"!==r?s.push(new ValidationError(n+"[1]",a[1],"string expected, %s found",r)):"@"===a[1][0]&&s.push(new ValidationError(n+"[1]",a[1],"filter key cannot be a constant")));for(var o=2;o<a.length;o++)r=getType(a[o]),"$type"==a[1]?s=s.concat(validateEnum({key:n+"["+o+"]",value:a[o],valueSpec:l.geometry_type,style:t.style,styleSpec:t.styleSpec})):"string"===r&&"@"===a[o][0]?s.push(new ValidationError(n+"["+o+"]",a[o],"filter value cannot be a constant")):"string"!==r&&"number"!==r&&"boolean"!==r&&s.push(new ValidationError(n+"["+o+"]",a[o],"string, number, or boolean expected, %s found",r));break;case"any":case"all":case"none":for(o=1;o<a.length;o++)s=s.concat(e({key:n+"["+o+"]",value:a[o],style:t.style,styleSpec:t.styleSpec}));break;case"has":case"!has":r=getType(a[1]),2!==a.length?s.push(new ValidationError(n,a,'filter array for "%s" operator must have 2 elements',a[0])):"string"!==r?s.push(new ValidationError(n+"[1]",a[1],"string expected, %s found",r)):"@"===a[1][0]&&s.push(new ValidationError(n+"[1]",a[1],"filter key cannot be a constant"))}return s};
	},{"../error/validation_error":164,"../util/get_type":167,"../util/unbundle_jsonlint":169,"./validate_enum":175}],177:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),getType=require("../util/get_type"),validate=require("./validate"),validateObject=require("./validate_object"),validateArray=require("./validate_array"),validateNumber=require("./validate_number"),unbundle=require("../util/unbundle_jsonlint");module.exports=function(e){function t(e){if("identity"===unbundle(l.type))return[new ValidationError(e.key,e.value,'identity function may not have a "stops" property')];var t=[],a=e.value;return t=t.concat(validateArray({key:e.key,value:a,valueSpec:e.valueSpec,style:e.style,styleSpec:e.styleSpec,arrayElementValidator:r})),"array"===getType(a)&&0===a.length&&t.push(new ValidationError(e.key,a,"array must have at least one stop")),t}function r(e){var t=[],r=e.value,l=e.key;if("array"!==getType(r))return[new ValidationError(l,r,"array expected, %s found",getType(r))];if(2!==r.length)return[new ValidationError(l,r,"array length %d expected, length %d found",2,r.length)];var i=getType(r[0]);if(n||(n=i),i!==n)return[new ValidationError(l,r,"%s stop key type must match previous stop key type %s",i,n)];if("object"===i){if(void 0===r[0].zoom)return[new ValidationError(l,r,"object stop key must have zoom")];if(void 0===r[0].value)return[new ValidationError(l,r,"object stop key must have value")];t=t.concat(validateObject({key:l+"[0]",value:r[0],valueSpec:{zoom:{}},style:e.style,styleSpec:e.styleSpec,objectElementValidators:{zoom:validateNumber,value:a}}))}else t=t.concat((u?validateNumber:a)({key:l+"[0]",value:r[0],valueSpec:{},style:e.style,styleSpec:e.styleSpec}));return t=t.concat(validate({key:l+"[1]",value:r[1],valueSpec:o,style:e.style,styleSpec:e.styleSpec})),"number"===getType(r[0])&&("piecewise-constant"===o.function&&r[0]%1!==0&&t.push(new ValidationError(l+"[0]",r[0],"zoom level for piecewise-constant functions must be an integer")),0!==e.arrayIndex&&r[0]<e.array[e.arrayIndex-1][0]&&t.push(new ValidationError(l+"[0]",r[0],"array stops must appear in ascending order"))),t}function a(e){var t=[],r=getType(e.value);return"number"!==r&&"string"!==r&&"array"!==r&&t.push(new ValidationError(e.key,e.value,"property value must be a number, string or array")),t}var n,o=e.valueSpec,l=e.value,i=void 0!==e.value.property||"object"===n,u=void 0===e.value.property||"object"===n,s=validateObject({key:e.key,value:e.value,valueSpec:e.styleSpec.function,style:e.style,styleSpec:e.styleSpec,objectElementValidators:{stops:t}});return"identity"===unbundle(e.value.type)||e.value.stops||s.push(new ValidationError(e.key,e.value,'missing required property "stops"')),e.styleSpec.$version>=8&&(i&&!e.valueSpec["property-function"]?s.push(new ValidationError(e.key,e.value,"property functions not supported")):u&&!e.valueSpec["zoom-function"]&&s.push(new ValidationError(e.key,e.value,"zoom functions not supported"))),s};
	},{"../error/validation_error":164,"../util/get_type":167,"../util/unbundle_jsonlint":169,"./validate":170,"./validate_array":171,"./validate_number":182,"./validate_object":183}],178:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),validateString=require("./validate_string");module.exports=function(r){var e=r.value,t=r.key,a=validateString(r);return a.length?a:(e.indexOf("{fontstack}")===-1&&a.push(new ValidationError(t,e,'"glyphs" url must include a "{fontstack}" token')),e.indexOf("{range}")===-1&&a.push(new ValidationError(t,e,'"glyphs" url must include a "{range}" token')),a)};
	},{"../error/validation_error":164,"./validate_string":186}],179:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),unbundle=require("../util/unbundle_jsonlint"),validateObject=require("./validate_object"),validateFilter=require("./validate_filter"),validatePaintProperty=require("./validate_paint_property"),validateLayoutProperty=require("./validate_layout_property"),extend=require("../util/extend");module.exports=function(e){var r=[],t=e.value,a=e.key,i=e.style,l=e.styleSpec;t.type||t.ref||r.push(new ValidationError(a,t,'either "type" or "ref" is required'));var o=unbundle(t.type),u=unbundle(t.ref);if(t.id)for(var n=0;n<e.arrayIndex;n++){var s=i.layers[n];unbundle(s.id)===unbundle(t.id)&&r.push(new ValidationError(a,t.id,'duplicate layer id "%s", previously used at line %d',t.id,s.id.__line__))}if("ref"in t){["type","source","source-layer","filter","layout"].forEach(function(e){e in t&&r.push(new ValidationError(a,t[e],'"%s" is prohibited for ref layers',e))});var d;i.layers.forEach(function(e){e.id==u&&(d=e)}),d?d.ref?r.push(new ValidationError(a,t.ref,"ref cannot reference another ref layer")):o=unbundle(d.type):r.push(new ValidationError(a,t.ref,'ref layer "%s" not found',u))}else if("background"!==o)if(t.source){var y=i.sources&&i.sources[t.source];y?"vector"==y.type&&"raster"==o?r.push(new ValidationError(a,t.source,'layer "%s" requires a raster source',t.id)):"raster"==y.type&&"raster"!=o?r.push(new ValidationError(a,t.source,'layer "%s" requires a vector source',t.id)):"vector"!=y.type||t["source-layer"]||r.push(new ValidationError(a,t,'layer "%s" must specify a "source-layer"',t.id)):r.push(new ValidationError(a,t.source,'source "%s" not found',t.source))}else r.push(new ValidationError(a,t,'missing required property "source"'));return r=r.concat(validateObject({key:a,value:t,valueSpec:l.layer,style:e.style,styleSpec:e.styleSpec,objectElementValidators:{filter:validateFilter,layout:function(e){return validateObject({layer:t,key:e.key,value:e.value,style:e.style,styleSpec:e.styleSpec,objectElementValidators:{"*":function(e){return validateLayoutProperty(extend({layerType:o},e))}}})},paint:function(e){return validateObject({layer:t,key:e.key,value:e.value,style:e.style,styleSpec:e.styleSpec,objectElementValidators:{"*":function(e){return validatePaintProperty(extend({layerType:o},e))}}})}}}))};
	},{"../error/validation_error":164,"../util/extend":166,"../util/unbundle_jsonlint":169,"./validate_filter":176,"./validate_layout_property":180,"./validate_object":183,"./validate_paint_property":184}],180:[function(require,module,exports){
	"use strict";var validate=require("./validate"),ValidationError=require("../error/validation_error");module.exports=function(e){var r=e.key,t=e.style,a=e.styleSpec,i=e.value,l=e.objectKey,o=a["layout_"+e.layerType];if(!o)return[];if(e.valueSpec||o[l]){var s=[];return"symbol"===e.layerType&&("icon-image"===l&&t&&!t.sprite?s.push(new ValidationError(r,i,'use of "icon-image" requires a style "sprite" property')):"text-field"===l&&t&&!t.glyphs&&s.push(new ValidationError(r,i,'use of "text-field" requires a style "glyphs" property'))),s.concat(validate({key:e.key,value:i,valueSpec:e.valueSpec||o[l],style:t,styleSpec:a}))}return[new ValidationError(r,i,'unknown property "%s"',l)]};
	},{"../error/validation_error":164,"./validate":170}],181:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),getType=require("../util/get_type"),validate=require("./validate"),validateTypes={enum:require("./validate_enum"),color:require("./validate_color"),array:require("./validate_array"),number:require("./validate_number"),function:require("./validate_function")};module.exports=function(e){var r,t=e.value,a=e.styleSpec,i=a.light,n=e.style,l=[];for(var o in t){var u=o.match(/^(.*)-transition$/);if(u&&i[u[1]]&&i[u[1]].transition){var c=u[1];r=i[c].type,l=l.concat(validate({key:o,value:t[o],valueSpec:a.transition,style:n,styleSpec:a}))}else i[o]?(r=i[o].type,i[o].function&&"object"===getType(t[o])&&(r="function"),l=l.concat(validateTypes[r]({key:o,value:t[o],valueSpec:i[o],style:n,styleSpec:a}))):l=l.concat([new ValidationError(o,t[o],'unknown property "%s"',o)])}return l};
	},{"../error/validation_error":164,"../util/get_type":167,"./validate":170,"./validate_array":171,"./validate_color":173,"./validate_enum":175,"./validate_function":177,"./validate_number":182}],182:[function(require,module,exports){
	"use strict";var getType=require("../util/get_type"),ValidationError=require("../error/validation_error");module.exports=function(e){var r=e.key,i=e.value,m=e.valueSpec,a=getType(i);return"number"!==a?[new ValidationError(r,i,"number expected, %s found",a)]:"minimum"in m&&i<m.minimum?[new ValidationError(r,i,"%s is less than the minimum value %s",i,m.minimum)]:"maximum"in m&&i>m.maximum?[new ValidationError(r,i,"%s is greater than the maximum value %s",i,m.maximum)]:[]};
	},{"../error/validation_error":164,"../util/get_type":167}],183:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),getType=require("../util/get_type"),validate=require("./validate");module.exports=function(e){var r=e.key,t=e.value,i=e.valueSpec,o=e.objectElementValidators||{},a=e.style,l=e.styleSpec,n=[],u=getType(t);if("object"!==u)return[new ValidationError(r,t,"object expected, %s found",u)];for(var d in t){var p=d.split(".")[0],s=i&&(i[p]||i["*"]),c=o[p]||o["*"];s||c?n=n.concat((c||validate)({key:(r?r+".":r)+d,value:t[d],valueSpec:s,style:a,styleSpec:l,object:t,objectKey:d})):""!==r&&1!==r.split(".").length&&n.push(new ValidationError(r,t[d],'unknown property "%s"',d))}for(p in i)i[p].required&&void 0===i[p].default&&void 0===t[p]&&n.push(new ValidationError(r,t,'missing required property "%s"',p));return n};
	},{"../error/validation_error":164,"../util/get_type":167,"./validate":170}],184:[function(require,module,exports){
	"use strict";var validate=require("./validate"),ValidationError=require("../error/validation_error");module.exports=function(e){var r=e.key,a=e.style,t=e.styleSpec,i=e.value,l=e.objectKey,n=t["paint_"+e.layerType];if(!n)return[];var o=l.match(/^(.*)-transition$/);return o&&n[o[1]]&&n[o[1]].transition?validate({key:r,value:i,valueSpec:t.transition,style:a,styleSpec:t}):e.valueSpec||n[l]?validate({key:e.key,value:i,valueSpec:e.valueSpec||n[l],style:a,styleSpec:t}):[new ValidationError(r,i,'unknown property "%s"',l)]};
	},{"../error/validation_error":164,"./validate":170}],185:[function(require,module,exports){
	"use strict";var ValidationError=require("../error/validation_error"),unbundle=require("../util/unbundle_jsonlint"),validateObject=require("./validate_object"),validateEnum=require("./validate_enum");module.exports=function(e){var r=e.value,t=e.key,a=e.styleSpec,l=e.style;if(!r.type)return[new ValidationError(t,r,'"type" is required')];var u=unbundle(r.type);switch(u){case"vector":case"raster":var i=[];if(i=i.concat(validateObject({key:t,value:r,valueSpec:a.source_tile,style:e.style,styleSpec:a})),"url"in r)for(var s in r)["type","url","tileSize"].indexOf(s)<0&&i.push(new ValidationError(t+"."+s,r[s],'a source with a "url" property may not include a "%s" property',s));return i;case"geojson":return validateObject({key:t,value:r,valueSpec:a.source_geojson,style:l,styleSpec:a});case"video":return validateObject({key:t,value:r,valueSpec:a.source_video,style:l,styleSpec:a});case"image":return validateObject({key:t,value:r,valueSpec:a.source_image,style:l,styleSpec:a});default:return validateEnum({key:t+".type",value:r.type,valueSpec:{values:["vector","raster","geojson","video","image"]},style:l,styleSpec:a})}};
	},{"../error/validation_error":164,"../util/unbundle_jsonlint":169,"./validate_enum":175,"./validate_object":183}],186:[function(require,module,exports){
	"use strict";var getType=require("../util/get_type"),ValidationError=require("../error/validation_error");module.exports=function(r){var e=r.value,t=r.key,i=getType(e);return"string"!==i?[new ValidationError(t,e,"string expected, %s found",i)]:[]};
	},{"../error/validation_error":164,"../util/get_type":167}],187:[function(require,module,exports){
	"use strict";function validateStyleMin(e,a){a=a||latestStyleSpec;var t=[];return t=t.concat(validate({key:"",value:e,valueSpec:a.$root,styleSpec:a,style:e,objectElementValidators:{glyphs:validateGlyphsURL}})),a.$version>7&&e.constants&&(t=t.concat(validateConstants({key:"constants",value:e.constants,style:e,styleSpec:a}))),sortErrors(t)}function sortErrors(e){return[].concat(e).sort(function(e,a){return e.line-a.line})}function wrapCleanErrors(e){return function(){return sortErrors(e.apply(this,arguments))}}var validateConstants=require("./validate/validate_constants"),validate=require("./validate/validate"),latestStyleSpec=require("../reference/latest.min"),validateGlyphsURL=require("./validate/validate_glyphs_url");validateStyleMin.source=wrapCleanErrors(require("./validate/validate_source")),validateStyleMin.light=wrapCleanErrors(require("./validate/validate_light")),validateStyleMin.layer=wrapCleanErrors(require("./validate/validate_layer")),validateStyleMin.filter=wrapCleanErrors(require("./validate/validate_filter")),validateStyleMin.paintProperty=wrapCleanErrors(require("./validate/validate_paint_property")),validateStyleMin.layoutProperty=wrapCleanErrors(require("./validate/validate_layout_property")),module.exports=validateStyleMin;
	},{"../reference/latest.min":189,"./validate/validate":170,"./validate/validate_constants":174,"./validate/validate_filter":176,"./validate/validate_glyphs_url":178,"./validate/validate_layer":179,"./validate/validate_layout_property":180,"./validate/validate_light":181,"./validate/validate_paint_property":184,"./validate/validate_source":185}],188:[function(require,module,exports){
	function sss(r){var e,t,s,n,u,a;switch(typeof r){case"object":if(null===r)return null;if(isArray(r)){for(s="[",t=r.length-1,e=0;e<t;e++)s+=sss(r[e])+",";return t>-1&&(s+=sss(r[e])),s+"]"}for(n=objKeys(r).sort(),t=n.length,s="{",u=n[e=0],a=t>0&&void 0!==r[u];e<t;)a?(s+='"'+u.replace(strReg,strReplace)+'":'+sss(r[u]),u=n[++e],a=e<t&&void 0!==r[u],a&&(s+=",")):(u=n[++e],a=e<t&&void 0!==r[u]);return s+"}";case"undefined":return null;case"string":return'"'+r.replace(strReg,strReplace)+'"';default:return r}}var toString={}.toString,isArray=Array.isArray||function(r){return"[object Array]"===toString.call(r)},objKeys=Object.keys||function(r){var e=[];for(var t in r)r.hasOwnProperty(t)&&e.push(t);return e},strReg=/[\u0000-\u001f"\\]/g,strReplace=function(r){var e=r.charCodeAt(0);switch(e){case 34:return'\\"';case 92:return"\\\\";case 12:return"\\f";case 10:return"\\n";case 13:return"\\r";case 9:return"\\t";case 8:return"\\b";default:return e>15?"\\u00"+e.toString(16):"\\u000"+e.toString(16)}};module.exports=function(r){if(void 0!==r)return""+sss(r)},module.exports.stringSearch=strReg,module.exports.stringReplace=strReplace;
	},{}],189:[function(require,module,exports){
	module.exports=require("./v8.min.json");
	},{"./v8.min.json":190}],190:[function(require,module,exports){
	module.exports={"$version":8,"$root":{"version":{"required":true,"type":"enum","values":[8]},"name":{"type":"string"},"metadata":{"type":"*"},"center":{"type":"array","value":"number"},"zoom":{"type":"number"},"bearing":{"type":"number","default":0,"period":360,"units":"degrees"},"pitch":{"type":"number","default":0,"units":"degrees"},"light":{"type":"light"},"sources":{"required":true,"type":"sources"},"sprite":{"type":"string"},"glyphs":{"type":"string"},"transition":{"type":"transition"},"layers":{"required":true,"type":"array","value":"layer"}},"sources":{"*":{"type":"source"}},"source":["source_tile","source_geojson","source_video","source_image"],"source_tile":{"type":{"required":true,"type":"enum","values":{"vector":{},"raster":{}}},"url":{"type":"string"},"tiles":{"type":"array","value":"string"},"minzoom":{"type":"number","default":0},"maxzoom":{"type":"number","default":22},"tileSize":{"type":"number","default":512,"units":"pixels"},"*":{"type":"*"}},"source_geojson":{"type":{"required":true,"type":"enum","values":{"geojson":{}}},"data":{"type":"*"},"maxzoom":{"type":"number","default":18},"buffer":{"type":"number","default":128,"maximum":512,"minimum":0},"tolerance":{"type":"number","default":0.375},"cluster":{"type":"boolean","default":false},"clusterRadius":{"type":"number","default":50,"minimum":0},"clusterMaxZoom":{"type":"number"}},"source_video":{"type":{"required":true,"type":"enum","values":{"video":{}}},"urls":{"required":true,"type":"array","value":"string"},"coordinates":{"required":true,"type":"array","length":4,"value":{"type":"array","length":2,"value":"number"}}},"source_image":{"type":{"required":true,"type":"enum","values":{"image":{}}},"url":{"required":true,"type":"string"},"coordinates":{"required":true,"type":"array","length":4,"value":{"type":"array","length":2,"value":"number"}}},"layer":{"id":{"type":"string","required":true},"type":{"type":"enum","values":{"fill":{},"line":{},"symbol":{},"circle":{},"fill-extrusion":{},"raster":{},"background":{}}},"metadata":{"type":"*"},"ref":{"type":"string"},"source":{"type":"string"},"source-layer":{"type":"string"},"minzoom":{"type":"number","minimum":0,"maximum":22},"maxzoom":{"type":"number","minimum":0,"maximum":22},"filter":{"type":"filter"},"layout":{"type":"layout"},"paint":{"type":"paint"},"paint.*":{"type":"paint"}},"layout":["layout_fill","layout_line","layout_circle","layout_fill-extrusion","layout_symbol","layout_raster","layout_background"],"layout_background":{"visibility":{"type":"enum","function":"piecewise-constant","zoom-function":true,"values":{"visible":{},"none":{}},"default":"visible"}},"layout_fill":{"visibility":{"type":"enum","function":"piecewise-constant","zoom-function":true,"values":{"visible":{},"none":{}},"default":"visible"}},"layout_circle":{"visibility":{"type":"enum","function":"piecewise-constant","zoom-function":true,"values":{"visible":{},"none":{}},"default":"visible"}},"layout_fill-extrusion":{"visibility":{"type":"enum","function":"piecewise-constant","zoom-function":true,"values":{"visible":{},"none":{}},"default":"visible"}},"layout_line":{"line-cap":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"butt":{},"round":{},"square":{}},"default":"butt"},"line-join":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"bevel":{},"round":{},"miter":{}},"default":"miter"},"line-miter-limit":{"type":"number","default":2,"function":"interpolated","zoom-function":true,"property-function":true,"requires":[{"line-join":"miter"}]},"line-round-limit":{"type":"number","default":1.05,"function":"interpolated","zoom-function":true,"property-function":true,"requires":[{"line-join":"round"}]},"visibility":{"type":"enum","function":"piecewise-constant","zoom-function":true,"values":{"visible":{},"none":{}},"default":"visible"}},"layout_symbol":{"symbol-placement":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"point":{},"line":{}},"default":"point"},"symbol-spacing":{"type":"number","default":250,"minimum":1,"function":"interpolated","zoom-function":true,"property-function":true,"units":"pixels","requires":[{"symbol-placement":"line"}]},"symbol-avoid-edges":{"type":"boolean","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":false},"icon-allow-overlap":{"type":"boolean","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":false,"requires":["icon-image"]},"icon-ignore-placement":{"type":"boolean","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":false,"requires":["icon-image"]},"icon-optional":{"type":"boolean","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":false,"requires":["icon-image","text-field"]},"icon-rotation-alignment":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"map":{},"viewport":{},"auto":{}},"default":"auto","requires":["icon-image"]},"icon-size":{"type":"number","default":1,"minimum":0,"function":"interpolated","zoom-function":true,"property-function":true,"requires":["icon-image"]},"icon-text-fit":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":false,"values":{"none":{},"width":{},"height":{},"both":{}},"default":"none","requires":["icon-image","text-field"]},"icon-text-fit-padding":{"type":"array","value":"number","length":4,"default":[0,0,0,0],"units":"pixels","function":"interpolated","zoom-function":true,"property-function":true,"requires":["icon-image","text-field",{"icon-text-fit":["both","width","height"]}]},"icon-image":{"type":"string","function":"piecewise-constant","zoom-function":true,"property-function":true,"tokens":true},"icon-rotate":{"type":"number","default":0,"period":360,"function":"interpolated","zoom-function":true,"property-function":true,"units":"degrees","requires":["icon-image"]},"icon-padding":{"type":"number","default":2,"minimum":0,"function":"interpolated","zoom-function":true,"property-function":true,"units":"pixels","requires":["icon-image"]},"icon-keep-upright":{"type":"boolean","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":false,"requires":["icon-image",{"icon-rotation-alignment":"map"},{"symbol-placement":"line"}]},"icon-offset":{"type":"array","value":"number","length":2,"default":[0,0],"function":"interpolated","zoom-function":true,"property-function":true,"requires":["icon-image"]},"text-pitch-alignment":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"map":{},"viewport":{},"auto":{}},"default":"auto","requires":["text-field"]},"text-rotation-alignment":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"map":{},"viewport":{},"auto":{}},"default":"auto","requires":["text-field"]},"text-field":{"type":"string","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":"","tokens":true},"text-font":{"type":"array","value":"string","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":["Open Sans Regular","Arial Unicode MS Regular"],"requires":["text-field"]},"text-size":{"type":"number","default":16,"minimum":0,"units":"pixels","function":"interpolated","zoom-function":true,"property-function":true,"requires":["text-field"]},"text-max-width":{"type":"number","default":10,"minimum":0,"units":"ems","function":"interpolated","zoom-function":true,"property-function":true,"requires":["text-field"]},"text-line-height":{"type":"number","default":1.2,"units":"ems","function":"interpolated","zoom-function":true,"property-function":true,"requires":["text-field"]},"text-letter-spacing":{"type":"number","default":0,"units":"ems","function":"interpolated","zoom-function":true,"property-function":true,"requires":["text-field"]},"text-justify":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"left":{},"center":{},"right":{}},"default":"center","requires":["text-field"]},"text-anchor":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"center":{},"left":{},"right":{},"top":{},"bottom":{},"top-left":{},"top-right":{},"bottom-left":{},"bottom-right":{}},"default":"center","requires":["text-field"]},"text-max-angle":{"type":"number","default":45,"units":"degrees","function":"interpolated","zoom-function":true,"property-function":true,"requires":["text-field",{"symbol-placement":"line"}]},"text-rotate":{"type":"number","default":0,"period":360,"units":"degrees","function":"interpolated","zoom-function":true,"property-function":true,"requires":["text-field"]},"text-padding":{"type":"number","default":2,"minimum":0,"units":"pixels","function":"interpolated","zoom-function":true,"property-function":true,"requires":["text-field"]},"text-keep-upright":{"type":"boolean","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":true,"requires":["text-field",{"text-rotation-alignment":"map"},{"symbol-placement":"line"}]},"text-transform":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"none":{},"uppercase":{},"lowercase":{}},"default":"none","requires":["text-field"]},"text-offset":{"type":"array","value":"number","units":"ems","function":"interpolated","zoom-function":true,"property-function":true,"length":2,"default":[0,0],"requires":["text-field"]},"text-allow-overlap":{"type":"boolean","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":false,"requires":["text-field"]},"text-ignore-placement":{"type":"boolean","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":false,"requires":["text-field"]},"text-optional":{"type":"boolean","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":false,"requires":["text-field","icon-image"]},"visibility":{"type":"enum","function":"piecewise-constant","zoom-function":true,"values":{"visible":{},"none":{}},"default":"visible"}},"layout_raster":{"visibility":{"type":"enum","function":"piecewise-constant","zoom-function":true,"values":{"visible":{},"none":{}},"default":"visible"}},"filter":{"type":"array","value":"*"},"filter_operator":{"type":"enum","values":{"==":{},"!=":{},">":{},">=":{},"<":{},"<=":{},"in":{},"!in":{},"all":{},"any":{},"none":{},"has":{},"!has":{}}},"geometry_type":{"type":"enum","values":{"Point":{},"LineString":{},"Polygon":{}}},"function":{"stops":{"type":"array","value":"function_stop"},"base":{"type":"number","default":1,"minimum":0},"property":{"type":"string","default":"$zoom"},"type":{"type":"enum","values":{"identity":{},"exponential":{},"interval":{},"categorical":{}},"default":"exponential"},"colorSpace":{"type":"enum","values":{"rgb":{},"lab":{},"hcl":{}},"default":"rgb"}},"function_stop":{"type":"array","minimum":0,"maximum":22,"value":["number","color"],"length":2},"light":{"anchor":{"type":"enum","default":"viewport","values":{"map":{},"viewport":{}},"transition":false},"position":{"type":"array","default":[1.15,210,30],"length":3,"value":"number","transition":true,"function":"interpolated","zoom-function":true,"property-function":false},"color":{"type":"color","default":"#ffffff","function":"interpolated","zoom-function":true,"property-function":false,"transition":true},"intensity":{"type":"number","default":0.5,"minimum":0,"maximum":1,"function":"interpolated","zoom-function":true,"property-function":false,"transition":true}},"paint":["paint_fill","paint_line","paint_circle","paint_fill-extrusion","paint_symbol","paint_raster","paint_background"],"paint_fill":{"fill-antialias":{"type":"boolean","function":"piecewise-constant","zoom-function":true,"property-function":true,"default":true},"fill-opacity":{"type":"number","function":"interpolated","zoom-function":true,"property-function":true,"default":1,"minimum":0,"maximum":1,"transition":true},"fill-color":{"type":"color","default":"#000000","function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"requires":[{"!":"fill-pattern"}]},"fill-outline-color":{"type":"color","function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"requires":[{"!":"fill-pattern"},{"fill-antialias":true}]},"fill-translate":{"type":"array","value":"number","length":2,"default":[0,0],"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels"},"fill-translate-anchor":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"map":{},"viewport":{}},"default":"map","requires":["fill-translate"]},"fill-pattern":{"type":"string","function":"piecewise-constant","zoom-function":true,"property-function":true,"transition":true}},"paint_fill-extrusion":{"fill-extrusion-opacity":{"type":"number","function":"interpolated","zoom-function":true,"property-function":false,"default":1,"minimum":0,"maximum":1,"transition":true},"fill-extrusion-color":{"type":"color","default":"#000000","function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"requires":[{"!":"fill-pattern"}]},"fill-extrusion-translate":{"type":"array","value":"number","length":2,"default":[0,0],"function":"interpolated","zoom-function":true,"property-function":false,"transition":true,"units":"pixels"},"fill-extrusion-translate-anchor":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":false,"values":{"map":{},"viewport":{}},"default":"map","requires":["fill-extrusion-translate"]},"fill-extrusion-pattern":{"type":"string","function":"piecewise-constant","zoom-function":true,"property-function":false,"transition":true},"fill-extrusion-height":{"type":"number","function":"interpolated","zoom-function":true,"property-function":true,"default":0,"minimum":0,"units":"meters","transition":true},"fill-extrusion-base":{"type":"number","function":"interpolated","zoom-function":true,"property-function":true,"default":0,"minimum":0,"units":"meters","transition":true,"requires":[{"<=":"fill-extrusion-height"}]}},"paint_line":{"line-opacity":{"type":"number","function":"interpolated","zoom-function":true,"property-function":true,"default":1,"minimum":0,"maximum":1,"transition":true},"line-color":{"type":"color","default":"#000000","function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"requires":[{"!":"line-pattern"}]},"line-translate":{"type":"array","value":"number","length":2,"default":[0,0],"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels"},"line-translate-anchor":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"map":{},"viewport":{}},"default":"map","requires":["line-translate"]},"line-width":{"type":"number","default":1,"minimum":0,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels"},"line-gap-width":{"type":"number","default":0,"minimum":0,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels"},"line-offset":{"type":"number","default":0,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels"},"line-blur":{"type":"number","default":0,"minimum":0,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels"},"line-dasharray":{"type":"array","value":"number","function":"piecewise-constant","zoom-function":true,"property-function":true,"minimum":0,"transition":true,"units":"line widths","requires":[{"!":"line-pattern"}]},"line-pattern":{"type":"string","function":"piecewise-constant","zoom-function":true,"property-function":true,"transition":true}},"paint_circle":{"circle-radius":{"type":"number","default":5,"minimum":0,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels"},"circle-color":{"type":"color","default":"#000000","function":"interpolated","zoom-function":true,"property-function":true,"transition":true},"circle-blur":{"type":"number","default":0,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true},"circle-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true},"circle-translate":{"type":"array","value":"number","length":2,"default":[0,0],"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels"},"circle-translate-anchor":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"map":{},"viewport":{}},"default":"map","requires":["circle-translate"]},"circle-pitch-scale":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"map":{},"viewport":{}},"default":"map"}},"paint_symbol":{"icon-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"requires":["icon-image"]},"icon-color":{"type":"color","default":"#000000","function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"requires":["icon-image"]},"icon-halo-color":{"type":"color","default":"rgba(0, 0, 0, 0)","function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"requires":["icon-image"]},"icon-halo-width":{"type":"number","default":0,"minimum":0,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels","requires":["icon-image"]},"icon-halo-blur":{"type":"number","default":0,"minimum":0,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels","requires":["icon-image"]},"icon-translate":{"type":"array","value":"number","length":2,"default":[0,0],"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels","requires":["icon-image"]},"icon-translate-anchor":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"map":{},"viewport":{}},"default":"map","requires":["icon-image","icon-translate"]},"text-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"requires":["text-field"]},"text-color":{"type":"color","default":"#000000","function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"requires":["text-field"]},"text-halo-color":{"type":"color","default":"rgba(0, 0, 0, 0)","function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"requires":["text-field"]},"text-halo-width":{"type":"number","default":0,"minimum":0,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels","requires":["text-field"]},"text-halo-blur":{"type":"number","default":0,"minimum":0,"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels","requires":["text-field"]},"text-translate":{"type":"array","value":"number","length":2,"default":[0,0],"function":"interpolated","zoom-function":true,"property-function":true,"transition":true,"units":"pixels","requires":["text-field"]},"text-translate-anchor":{"type":"enum","function":"piecewise-constant","zoom-function":true,"property-function":true,"values":{"map":{},"viewport":{}},"default":"map","requires":["text-field","text-translate"]}},"paint_raster":{"raster-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"function":"interpolated","zoom-function":true,"transition":true},"raster-hue-rotate":{"type":"number","default":0,"period":360,"function":"interpolated","zoom-function":true,"transition":true,"units":"degrees"},"raster-brightness-min":{"type":"number","function":"interpolated","zoom-function":true,"default":0,"minimum":0,"maximum":1,"transition":true},"raster-brightness-max":{"type":"number","function":"interpolated","zoom-function":true,"default":1,"minimum":0,"maximum":1,"transition":true},"raster-saturation":{"type":"number","default":0,"minimum":-1,"maximum":1,"function":"interpolated","zoom-function":true,"transition":true},"raster-contrast":{"type":"number","default":0,"minimum":-1,"maximum":1,"function":"interpolated","zoom-function":true,"transition":true},"raster-fade-duration":{"type":"number","default":300,"minimum":0,"function":"interpolated","zoom-function":true,"transition":true,"units":"milliseconds"}},"paint_background":{"background-color":{"type":"color","default":"#000000","function":"interpolated","zoom-function":true,"transition":true,"requires":[{"!":"background-pattern"}]},"background-pattern":{"type":"string","function":"piecewise-constant","zoom-function":true,"transition":true},"background-opacity":{"type":"number","default":1,"minimum":0,"maximum":1,"function":"interpolated","zoom-function":true,"transition":true}},"transition":{"duration":{"type":"number","default":300,"minimum":0,"units":"milliseconds"},"delay":{"type":"number","default":0,"minimum":0,"units":"milliseconds"}}}
	},{}],191:[function(require,module,exports){
	"use strict";function isSupported(e){return!!(isBrowser()&&isArraySupported()&&isFunctionSupported()&&isObjectSupported()&&isJSONSupported()&&isWorkerSupported()&&isUint8ClampedArraySupported()&&isWebGLSupportedCached(e&&e.failIfMajorPerformanceCaveat))}function isBrowser(){return"undefined"!=typeof window&&"undefined"!=typeof document}function isArraySupported(){return Array.prototype&&Array.prototype.every&&Array.prototype.filter&&Array.prototype.forEach&&Array.prototype.indexOf&&Array.prototype.lastIndexOf&&Array.prototype.map&&Array.prototype.some&&Array.prototype.reduce&&Array.prototype.reduceRight&&Array.isArray}function isFunctionSupported(){return Function.prototype&&Function.prototype.bind}function isObjectSupported(){return Object.keys&&Object.create&&Object.getPrototypeOf&&Object.getOwnPropertyNames&&Object.isSealed&&Object.isFrozen&&Object.isExtensible&&Object.getOwnPropertyDescriptor&&Object.defineProperty&&Object.defineProperties&&Object.seal&&Object.freeze&&Object.preventExtensions}function isJSONSupported(){return"JSON"in window&&"parse"in JSON&&"stringify"in JSON}function isWorkerSupported(){return"Worker"in window}function isUint8ClampedArraySupported(){return"Uint8ClampedArray"in window}function isWebGLSupportedCached(e){return void 0===isWebGLSupportedCache[e]&&(isWebGLSupportedCache[e]=isWebGLSupported(e)),isWebGLSupportedCache[e]}function isWebGLSupported(e){var t=document.createElement("canvas"),r=Object.create(isSupported.webGLContextAttributes);return r.failIfMajorPerformanceCaveat=e,t.probablySupportsContext?t.probablySupportsContext("webgl",r)||t.probablySupportsContext("experimental-webgl",r):t.supportsContext?t.supportsContext("webgl",r)||t.supportsContext("experimental-webgl",r):t.getContext("webgl",r)||t.getContext("experimental-webgl",r)}"undefined"!=typeof module&&module.exports?module.exports=isSupported:window&&(window.mapboxgl=window.mapboxgl||{},window.mapboxgl.supported=isSupported);var isWebGLSupportedCache={};isSupported.webGLContextAttributes={antialias:!1,alpha:!0,stencil:!0,depth:!0};
	},{}],192:[function(require,module,exports){
	"use strict";function Buffer(t){var e;t&&t.length&&(e=t,t=e.length);var r=new Uint8Array(t||0);return e&&r.set(e),r.readUInt32LE=BufferMethods.readUInt32LE,r.writeUInt32LE=BufferMethods.writeUInt32LE,r.readInt32LE=BufferMethods.readInt32LE,r.writeInt32LE=BufferMethods.writeInt32LE,r.readFloatLE=BufferMethods.readFloatLE,r.writeFloatLE=BufferMethods.writeFloatLE,r.readDoubleLE=BufferMethods.readDoubleLE,r.writeDoubleLE=BufferMethods.writeDoubleLE,r.toString=BufferMethods.toString,r.write=BufferMethods.write,r.slice=BufferMethods.slice,r.copy=BufferMethods.copy,r._isBuffer=!0,r}function encodeString(t){for(var e,r,n=t.length,i=[],o=0;o<n;o++){if(e=t.charCodeAt(o),e>55295&&e<57344){if(!r){e>56319||o+1===n?i.push(239,191,189):r=e;continue}if(e<56320){i.push(239,191,189),r=e;continue}e=r-55296<<10|e-56320|65536,r=null}else r&&(i.push(239,191,189),r=null);e<128?i.push(e):e<2048?i.push(e>>6|192,63&e|128):e<65536?i.push(e>>12|224,e>>6&63|128,63&e|128):i.push(e>>18|240,e>>12&63|128,e>>6&63|128,63&e|128)}return i}module.exports=Buffer;var ieee754=require("ieee754"),BufferMethods,lastStr,lastStrEncoded;BufferMethods={readUInt32LE:function(t){return(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},writeUInt32LE:function(t,e){this[e]=t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24},readInt32LE:function(t){return(this[t]|this[t+1]<<8|this[t+2]<<16)+(this[t+3]<<24)},readFloatLE:function(t){return ieee754.read(this,t,!0,23,4)},readDoubleLE:function(t){return ieee754.read(this,t,!0,52,8)},writeFloatLE:function(t,e){return ieee754.write(this,t,e,!0,23,4)},writeDoubleLE:function(t,e){return ieee754.write(this,t,e,!0,52,8)},toString:function(t,e,r){var n="",i="";e=e||0,r=Math.min(this.length,r||this.length);for(var o=e;o<r;o++){var u=this[o];u<=127?(n+=decodeURIComponent(i)+String.fromCharCode(u),i=""):i+="%"+u.toString(16)}return n+=decodeURIComponent(i)},write:function(t,e){for(var r=t===lastStr?lastStrEncoded:encodeString(t),n=0;n<r.length;n++)this[e+n]=r[n]},slice:function(t,e){return this.subarray(t,e)},copy:function(t,e){e=e||0;for(var r=0;r<this.length;r++)t[e+r]=this[r]}},BufferMethods.writeInt32LE=BufferMethods.writeUInt32LE,Buffer.byteLength=function(t){return lastStr=t,lastStrEncoded=encodeString(t),lastStrEncoded.length},Buffer.isBuffer=function(t){return!(!t||!t._isBuffer)};
	},{"ieee754":194}],193:[function(require,module,exports){
	(function (global){
	"use strict";function Pbf(t){this.buf=Buffer.isBuffer(t)?t:new Buffer(t||0),this.pos=0,this.length=this.buf.length}function readVarintRemainder(t,i){var e,r=i.buf;if(e=r[i.pos++],t+=268435456*(127&e),e<128)return t;if(e=r[i.pos++],t+=34359738368*(127&e),e<128)return t;if(e=r[i.pos++],t+=4398046511104*(127&e),e<128)return t;if(e=r[i.pos++],t+=562949953421312*(127&e),e<128)return t;if(e=r[i.pos++],t+=72057594037927940*(127&e),e<128)return t;if(e=r[i.pos++],t+=0x8000000000000000*(127&e),e<128)return t;throw new Error("Expected varint not more than 10 bytes")}function writeBigVarint(t,i){i.realloc(10);for(var e=i.pos+10;t>=1;){if(i.pos>=e)throw new Error("Given varint doesn't fit into 10 bytes");var r=255&t;i.buf[i.pos++]=r|(t>=128?128:0),t/=128}}function reallocForRawMessage(t,i,e){var r=i<=16383?1:i<=2097151?2:i<=268435455?3:Math.ceil(Math.log(i)/(7*Math.LN2));e.realloc(r);for(var s=e.pos-1;s>=t;s--)e.buf[s+r]=e.buf[s]}function writePackedVarint(t,i){for(var e=0;e<t.length;e++)i.writeVarint(t[e])}function writePackedSVarint(t,i){for(var e=0;e<t.length;e++)i.writeSVarint(t[e])}function writePackedFloat(t,i){for(var e=0;e<t.length;e++)i.writeFloat(t[e])}function writePackedDouble(t,i){for(var e=0;e<t.length;e++)i.writeDouble(t[e])}function writePackedBoolean(t,i){for(var e=0;e<t.length;e++)i.writeBoolean(t[e])}function writePackedFixed32(t,i){for(var e=0;e<t.length;e++)i.writeFixed32(t[e])}function writePackedSFixed32(t,i){for(var e=0;e<t.length;e++)i.writeSFixed32(t[e])}function writePackedFixed64(t,i){for(var e=0;e<t.length;e++)i.writeFixed64(t[e])}function writePackedSFixed64(t,i){for(var e=0;e<t.length;e++)i.writeSFixed64(t[e])}module.exports=Pbf;var Buffer=global.Buffer||require("./buffer");Pbf.Varint=0,Pbf.Fixed64=1,Pbf.Bytes=2,Pbf.Fixed32=5;var SHIFT_LEFT_32=4294967296,SHIFT_RIGHT_32=1/SHIFT_LEFT_32,POW_2_63=Math.pow(2,63);Pbf.prototype={destroy:function(){this.buf=null},readFields:function(t,i,e){for(e=e||this.length;this.pos<e;){var r=this.readVarint(),s=r>>3,n=this.pos;t(s,i,this),this.pos===n&&this.skip(r)}return i},readMessage:function(t,i){return this.readFields(t,i,this.readVarint()+this.pos)},readFixed32:function(){var t=this.buf.readUInt32LE(this.pos);return this.pos+=4,t},readSFixed32:function(){var t=this.buf.readInt32LE(this.pos);return this.pos+=4,t},readFixed64:function(){var t=this.buf.readUInt32LE(this.pos)+this.buf.readUInt32LE(this.pos+4)*SHIFT_LEFT_32;return this.pos+=8,t},readSFixed64:function(){var t=this.buf.readUInt32LE(this.pos)+this.buf.readInt32LE(this.pos+4)*SHIFT_LEFT_32;return this.pos+=8,t},readFloat:function(){var t=this.buf.readFloatLE(this.pos);return this.pos+=4,t},readDouble:function(){var t=this.buf.readDoubleLE(this.pos);return this.pos+=8,t},readVarint:function(){var t,i,e=this.buf;return i=e[this.pos++],t=127&i,i<128?t:(i=e[this.pos++],t|=(127&i)<<7,i<128?t:(i=e[this.pos++],t|=(127&i)<<14,i<128?t:(i=e[this.pos++],t|=(127&i)<<21,i<128?t:readVarintRemainder(t,this))))},readVarint64:function(){var t=this.pos,i=this.readVarint();if(i<POW_2_63)return i;for(var e=this.pos-2;255===this.buf[e];)e--;e<t&&(e=t),i=0;for(var r=0;r<e-t+1;r++){var s=127&~this.buf[t+r];i+=r<4?s<<7*r:s*Math.pow(2,7*r)}return-i-1},readSVarint:function(){var t=this.readVarint();return t%2===1?(t+1)/-2:t/2},readBoolean:function(){return Boolean(this.readVarint())},readString:function(){var t=this.readVarint()+this.pos,i=this.buf.toString("utf8",this.pos,t);return this.pos=t,i},readBytes:function(){var t=this.readVarint()+this.pos,i=this.buf.slice(this.pos,t);return this.pos=t,i},readPackedVarint:function(){for(var t=this.readVarint()+this.pos,i=[];this.pos<t;)i.push(this.readVarint());return i},readPackedSVarint:function(){for(var t=this.readVarint()+this.pos,i=[];this.pos<t;)i.push(this.readSVarint());return i},readPackedBoolean:function(){for(var t=this.readVarint()+this.pos,i=[];this.pos<t;)i.push(this.readBoolean());return i},readPackedFloat:function(){for(var t=this.readVarint()+this.pos,i=[];this.pos<t;)i.push(this.readFloat());return i},readPackedDouble:function(){for(var t=this.readVarint()+this.pos,i=[];this.pos<t;)i.push(this.readDouble());return i},readPackedFixed32:function(){for(var t=this.readVarint()+this.pos,i=[];this.pos<t;)i.push(this.readFixed32());return i},readPackedSFixed32:function(){for(var t=this.readVarint()+this.pos,i=[];this.pos<t;)i.push(this.readSFixed32());return i},readPackedFixed64:function(){for(var t=this.readVarint()+this.pos,i=[];this.pos<t;)i.push(this.readFixed64());return i},readPackedSFixed64:function(){for(var t=this.readVarint()+this.pos,i=[];this.pos<t;)i.push(this.readSFixed64());return i},skip:function(t){var i=7&t;if(i===Pbf.Varint)for(;this.buf[this.pos++]>127;);else if(i===Pbf.Bytes)this.pos=this.readVarint()+this.pos;else if(i===Pbf.Fixed32)this.pos+=4;else{if(i!==Pbf.Fixed64)throw new Error("Unimplemented type: "+i);this.pos+=8}},writeTag:function(t,i){this.writeVarint(t<<3|i)},realloc:function(t){for(var i=this.length||16;i<this.pos+t;)i*=2;if(i!==this.length){var e=new Buffer(i);this.buf.copy(e),this.buf=e,this.length=i}},finish:function(){return this.length=this.pos,this.pos=0,this.buf.slice(0,this.length)},writeFixed32:function(t){this.realloc(4),this.buf.writeUInt32LE(t,this.pos),this.pos+=4},writeSFixed32:function(t){this.realloc(4),this.buf.writeInt32LE(t,this.pos),this.pos+=4},writeFixed64:function(t){this.realloc(8),this.buf.writeInt32LE(t&-1,this.pos),this.buf.writeUInt32LE(Math.floor(t*SHIFT_RIGHT_32),this.pos+4),this.pos+=8},writeSFixed64:function(t){this.realloc(8),this.buf.writeInt32LE(t&-1,this.pos),this.buf.writeInt32LE(Math.floor(t*SHIFT_RIGHT_32),this.pos+4),this.pos+=8},writeVarint:function(t){return t=+t,t>268435455?void writeBigVarint(t,this):(this.realloc(4),this.buf[this.pos++]=127&t|(t>127?128:0),void(t<=127||(this.buf[this.pos++]=127&(t>>>=7)|(t>127?128:0),t<=127||(this.buf[this.pos++]=127&(t>>>=7)|(t>127?128:0),t<=127||(this.buf[this.pos++]=t>>>7&127)))))},writeSVarint:function(t){this.writeVarint(t<0?2*-t-1:2*t)},writeBoolean:function(t){this.writeVarint(Boolean(t))},writeString:function(t){t=String(t);var i=Buffer.byteLength(t);this.writeVarint(i),this.realloc(i),this.buf.write(t,this.pos),this.pos+=i},writeFloat:function(t){this.realloc(4),this.buf.writeFloatLE(t,this.pos),this.pos+=4},writeDouble:function(t){this.realloc(8),this.buf.writeDoubleLE(t,this.pos),this.pos+=8},writeBytes:function(t){var i=t.length;this.writeVarint(i),this.realloc(i);for(var e=0;e<i;e++)this.buf[this.pos++]=t[e]},writeRawMessage:function(t,i){this.pos++;var e=this.pos;t(i,this);var r=this.pos-e;r>=128&&reallocForRawMessage(e,r,this),this.pos=e-1,this.writeVarint(r),this.pos+=r},writeMessage:function(t,i,e){this.writeTag(t,Pbf.Bytes),this.writeRawMessage(i,e)},writePackedVarint:function(t,i){this.writeMessage(t,writePackedVarint,i)},writePackedSVarint:function(t,i){this.writeMessage(t,writePackedSVarint,i)},writePackedBoolean:function(t,i){this.writeMessage(t,writePackedBoolean,i)},writePackedFloat:function(t,i){this.writeMessage(t,writePackedFloat,i)},writePackedDouble:function(t,i){this.writeMessage(t,writePackedDouble,i)},writePackedFixed32:function(t,i){this.writeMessage(t,writePackedFixed32,i)},writePackedSFixed32:function(t,i){this.writeMessage(t,writePackedSFixed32,i)},writePackedFixed64:function(t,i){this.writeMessage(t,writePackedFixed64,i)},writePackedSFixed64:function(t,i){this.writeMessage(t,writePackedSFixed64,i)},writeBytesField:function(t,i){this.writeTag(t,Pbf.Bytes),this.writeBytes(i)},writeFixed32Field:function(t,i){this.writeTag(t,Pbf.Fixed32),this.writeFixed32(i)},writeSFixed32Field:function(t,i){this.writeTag(t,Pbf.Fixed32),this.writeSFixed32(i)},writeFixed64Field:function(t,i){this.writeTag(t,Pbf.Fixed64),this.writeFixed64(i)},writeSFixed64Field:function(t,i){this.writeTag(t,Pbf.Fixed64),this.writeSFixed64(i)},writeVarintField:function(t,i){this.writeTag(t,Pbf.Varint),this.writeVarint(i)},writeSVarintField:function(t,i){this.writeTag(t,Pbf.Varint),this.writeSVarint(i)},writeStringField:function(t,i){this.writeTag(t,Pbf.Bytes),this.writeString(i)},writeFloatField:function(t,i){this.writeTag(t,Pbf.Fixed32),this.writeFloat(i)},writeDoubleField:function(t,i){this.writeTag(t,Pbf.Fixed64),this.writeDouble(i)},writeBooleanField:function(t,i){this.writeVarintField(t,Boolean(i))}};
	}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
	
	},{"./buffer":192}],194:[function(require,module,exports){
	exports.read=function(a,o,t,r,h){var M,p,w=8*h-r-1,f=(1<<w)-1,e=f>>1,i=-7,N=t?h-1:0,n=t?-1:1,s=a[o+N];for(N+=n,M=s&(1<<-i)-1,s>>=-i,i+=w;i>0;M=256*M+a[o+N],N+=n,i-=8);for(p=M&(1<<-i)-1,M>>=-i,i+=r;i>0;p=256*p+a[o+N],N+=n,i-=8);if(0===M)M=1-e;else{if(M===f)return p?NaN:(s?-1:1)*(1/0);p+=Math.pow(2,r),M-=e}return(s?-1:1)*p*Math.pow(2,M-r)},exports.write=function(a,o,t,r,h,M){var p,w,f,e=8*M-h-1,i=(1<<e)-1,N=i>>1,n=23===h?Math.pow(2,-24)-Math.pow(2,-77):0,s=r?0:M-1,u=r?1:-1,l=o<0||0===o&&1/o<0?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(w=isNaN(o)?1:0,p=i):(p=Math.floor(Math.log(o)/Math.LN2),o*(f=Math.pow(2,-p))<1&&(p--,f*=2),o+=p+N>=1?n/f:n*Math.pow(2,1-N),o*f>=2&&(p++,f/=2),p+N>=i?(w=0,p=i):p+N>=1?(w=(o*f-1)*Math.pow(2,h),p+=N):(w=o*Math.pow(2,N-1)*Math.pow(2,h),p=0));h>=8;a[t+s]=255&w,s+=u,w/=256,h-=8);for(p=p<<h|w,e+=h;e>0;a[t+s]=255&p,s+=u,p/=256,e-=8);a[t+s-u]|=128*l};
	},{}],195:[function(require,module,exports){
	"use strict";function Point(t,n){this.x=t,this.y=n}module.exports=Point,Point.prototype={clone:function(){return new Point(this.x,this.y)},add:function(t){return this.clone()._add(t)},sub:function(t){return this.clone()._sub(t)},mult:function(t){return this.clone()._mult(t)},div:function(t){return this.clone()._div(t)},rotate:function(t){return this.clone()._rotate(t)},matMult:function(t){return this.clone()._matMult(t)},unit:function(){return this.clone()._unit()},perp:function(){return this.clone()._perp()},round:function(){return this.clone()._round()},mag:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals:function(t){return this.x===t.x&&this.y===t.y},dist:function(t){return Math.sqrt(this.distSqr(t))},distSqr:function(t){var n=t.x-this.x,i=t.y-this.y;return n*n+i*i},angle:function(){return Math.atan2(this.y,this.x)},angleTo:function(t){return Math.atan2(this.y-t.y,this.x-t.x)},angleWith:function(t){return this.angleWithSep(t.x,t.y)},angleWithSep:function(t,n){return Math.atan2(this.x*n-this.y*t,this.x*t+this.y*n)},_matMult:function(t){var n=t[0]*this.x+t[1]*this.y,i=t[2]*this.x+t[3]*this.y;return this.x=n,this.y=i,this},_add:function(t){return this.x+=t.x,this.y+=t.y,this},_sub:function(t){return this.x-=t.x,this.y-=t.y,this},_mult:function(t){return this.x*=t,this.y*=t,this},_div:function(t){return this.x/=t,this.y/=t,this},_unit:function(){return this._div(this.mag()),this},_perp:function(){var t=this.y;return this.y=this.x,this.x=-t,this},_rotate:function(t){var n=Math.cos(t),i=Math.sin(t),s=n*this.x-i*this.y,r=i*this.x+n*this.y;return this.x=s,this.y=r,this},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}},Point.convert=function(t){return t instanceof Point?t:Array.isArray(t)?new Point(t[0],t[1]):t};
	},{}],196:[function(require,module,exports){
	"use strict";function partialSort(a,t,r,o,p){for(r=r||0,o=o||a.length-1,p=p||defaultCompare;o>r;){if(o-r>600){var f=o-r+1,e=t-r+1,l=Math.log(f),s=.5*Math.exp(2*l/3),i=.5*Math.sqrt(l*s*(f-s)/f)*(e-f/2<0?-1:1),n=Math.max(r,Math.floor(t-e*s/f+i)),h=Math.min(o,Math.floor(t+(f-e)*s/f+i));partialSort(a,t,n,h,p)}var u=a[t],M=r,w=o;for(swap(a,r,t),p(a[o],u)>0&&swap(a,r,o);M<w;){for(swap(a,M,w),M++,w--;p(a[M],u)<0;)M++;for(;p(a[w],u)>0;)w--}0===p(a[r],u)?swap(a,r,w):(w++,swap(a,w,o)),w<=t&&(r=w+1),t<=w&&(o=w-1)}}function swap(a,t,r){var o=a[t];a[t]=a[r],a[r]=o}function defaultCompare(a,t){return a<t?-1:a>t?1:0}module.exports=partialSort;
	},{}],197:[function(require,module,exports){
	!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.ShelfPack=e()}(this,function(){function t(t,e,s){s=s||{},this.w=t||64,this.h=e||64,this.autoResize=!!s.autoResize,this.shelves=[],this.stats={},this.count=function(t){this.stats[t]=(0|this.stats[t])+1}}function e(t,e,s){this.x=0,this.y=t,this.w=this.free=e,this.h=s}return t.prototype.pack=function(t,e){t=[].concat(t),e=e||{};for(var s,h,i,n=[],r=0;r<t.length;r++)if(s=t[r].w||t[r].width,h=t[r].h||t[r].height,s&&h){if(i=this.packOne(s,h),!i)continue;e.inPlace&&(t[r].x=i.x,t[r].y=i.y),n.push(i)}if(this.shelves.length>0){for(var o=0,f=0,u=0;u<this.shelves.length;u++){var l=this.shelves[u];f+=l.h,o=Math.max(l.w-l.free,o)}this.resize(o,f)}return n},t.prototype.packOne=function(t,s){for(var h,i,n=0,r={shelf:-1,waste:1/0},o=0;o<this.shelves.length;o++){if(h=this.shelves[o],n+=h.h,s===h.h&&t<=h.free)return this.count(s),h.alloc(t,s);s>h.h||t>h.free||s<h.h&&t<=h.free&&(i=h.h-s,i<r.waste&&(r.waste=i,r.shelf=o))}if(r.shelf!==-1)return h=this.shelves[r.shelf],this.count(s),h.alloc(t,s);if(s<=this.h-n&&t<=this.w)return h=new e(n,this.w,s),this.shelves.push(h),this.count(s),h.alloc(t,s);if(this.autoResize){var f,u,l,a;return f=u=this.h,l=a=this.w,(l<=f||t>l)&&(a=2*Math.max(t,l)),(f<l||s>f)&&(u=2*Math.max(s,f)),this.resize(a,u),this.packOne(t,s)}return null},t.prototype.clear=function(){this.shelves=[],this.stats={}},t.prototype.resize=function(t,e){this.w=t,this.h=e;for(var s=0;s<this.shelves.length;s++)this.shelves[s].resize(t);return!0},e.prototype.alloc=function(t,e){if(t>this.free||e>this.h)return null;var s=this.x;return this.x+=t,this.free-=t,{x:s,y:this.y,w:t,h:e,width:t,height:e}},e.prototype.resize=function(t){return this.free+=t-this.w,this.w=t,!0},t});
	},{}],198:[function(require,module,exports){
	"use strict";function supercluster(t){return new SuperCluster(t)}function SuperCluster(t){this.options=extend(Object.create(this.options),t),this.trees=new Array(this.options.maxZoom+1)}function createCluster(t,e,o,n){return{x:t,y:e,zoom:1/0,id:n,numPoints:o}}function createPointCluster(t,e){var o=t.geometry.coordinates;return createCluster(lngX(o[0]),latY(o[1]),1,e)}function getClusterJSON(t){return{type:"Feature",properties:getClusterProperties(t),geometry:{type:"Point",coordinates:[xLng(t.x),yLat(t.y)]}}}function getClusterProperties(t){var e=t.numPoints,o=e>=1e4?Math.round(e/1e3)+"k":e>=1e3?Math.round(e/100)/10+"k":e;return{cluster:!0,point_count:e,point_count_abbreviated:o}}function lngX(t){return t/360+.5}function latY(t){var e=Math.sin(t*Math.PI/180),o=.5-.25*Math.log((1+e)/(1-e))/Math.PI;return o<0?0:o>1?1:o}function xLng(t){return 360*(t-.5)}function yLat(t){var e=(180-360*t)*Math.PI/180;return 360*Math.atan(Math.exp(e))/Math.PI-90}function extend(t,e){for(var o in e)t[o]=e[o];return t}function getX(t){return t.x}function getY(t){return t.y}var kdbush=require("kdbush");module.exports=supercluster,SuperCluster.prototype={options:{minZoom:0,maxZoom:16,radius:40,extent:512,nodeSize:64,log:!1},load:function(t){var e=this.options.log;e&&console.time("total time");var o="prepare "+t.length+" points";e&&console.time(o),this.points=t;var n=t.map(createPointCluster);e&&console.timeEnd(o);for(var r=this.options.maxZoom;r>=this.options.minZoom;r--){var i=+Date.now();this.trees[r+1]=kdbush(n,getX,getY,this.options.nodeSize,Float32Array),n=this._cluster(n,r),e&&console.log("z%d: %d clusters in %dms",r,n.length,+Date.now()-i)}return this.trees[this.options.minZoom]=kdbush(n,getX,getY,this.options.nodeSize,Float32Array),e&&console.timeEnd("total time"),this},getClusters:function(t,e){for(var o=this.trees[this._limitZoom(e)],n=o.range(lngX(t[0]),latY(t[3]),lngX(t[2]),latY(t[1])),r=[],i=0;i<n.length;i++){var s=o.points[n[i]];r.push(s.id!==-1?this.points[s.id]:getClusterJSON(s))}return r},getTile:function(t,e,o){var n=this.trees[this._limitZoom(t)],r=Math.pow(2,t),i=this.options.extent,s=this.options.radius,u=s/i,a=(o-u)/r,h=(o+1+u)/r,l={features:[]};return this._addTileFeatures(n.range((e-u)/r,a,(e+1+u)/r,h),n.points,e,o,r,l),0===e&&this._addTileFeatures(n.range(1-u/r,a,1,h),n.points,r,o,r,l),e===r-1&&this._addTileFeatures(n.range(0,a,u/r,h),n.points,-1,o,r,l),l.features.length?l:null},_addTileFeatures:function(t,e,o,n,r,i){for(var s=0;s<t.length;s++){var u=e[t[s]];i.features.push({type:1,geometry:[[Math.round(this.options.extent*(u.x*r-o)),Math.round(this.options.extent*(u.y*r-n))]],tags:u.id!==-1?this.points[u.id].properties:getClusterProperties(u)})}},_limitZoom:function(t){return Math.max(this.options.minZoom,Math.min(t,this.options.maxZoom+1))},_cluster:function(t,e){for(var o=[],n=this.options.radius/(this.options.extent*Math.pow(2,e)),r=0;r<t.length;r++){var i=t[r];if(!(i.zoom<=e)){i.zoom=e;for(var s=this.trees[e+1],u=s.within(i.x,i.y,n),a=!1,h=i.numPoints,l=i.x*h,p=i.y*h,m=0;m<u.length;m++){var c=s.points[u[m]];e<c.zoom&&(a=!0,c.zoom=e,l+=c.x*c.numPoints,p+=c.y*c.numPoints,h+=c.numPoints)}o.push(a?createCluster(l/h,p/h,h,-1):i)}}return o}};
	},{"kdbush":199}],199:[function(require,module,exports){
	"use strict";function kdbush(t,i,e,s,n){return new KDBush(t,i,e,s,n)}function KDBush(t,i,e,s,n){i=i||defaultGetX,e=e||defaultGetY,n=n||Array,this.nodeSize=s||64,this.points=t,this.ids=new n(t.length),this.coords=new n(2*t.length);for(var r=0;r<t.length;r++)this.ids[r]=r,this.coords[2*r]=i(t[r]),this.coords[2*r+1]=e(t[r]);sort(this.ids,this.coords,this.nodeSize,0,this.ids.length-1,0)}function defaultGetX(t){return t[0]}function defaultGetY(t){return t[1]}var sort=require("./sort"),range=require("./range"),within=require("./within");module.exports=kdbush,KDBush.prototype={range:function(t,i,e,s){return range(this.ids,this.coords,t,i,e,s,this.nodeSize)},within:function(t,i,e){return within(this.ids,this.coords,t,i,e,this.nodeSize)}};
	},{"./range":200,"./sort":201,"./within":202}],200:[function(require,module,exports){
	"use strict";function range(p,r,s,u,h,e,o){for(var a,t,n=[0,p.length-1,0],f=[];n.length;){var l=n.pop(),v=n.pop(),g=n.pop();if(v-g<=o)for(var i=g;i<=v;i++)a=r[2*i],t=r[2*i+1],a>=s&&a<=h&&t>=u&&t<=e&&f.push(p[i]);else{var c=Math.floor((g+v)/2);a=r[2*c],t=r[2*c+1],a>=s&&a<=h&&t>=u&&t<=e&&f.push(p[c]);var d=(l+1)%2;(0===l?s<=a:u<=t)&&(n.push(g),n.push(c-1),n.push(d)),(0===l?h>=a:e>=t)&&(n.push(c+1),n.push(v),n.push(d))}}return f}module.exports=range;
	},{}],201:[function(require,module,exports){
	"use strict";function sortKD(t,a,o,s,r,e){if(!(r-s<=o)){var f=Math.floor((s+r)/2);select(t,a,f,s,r,e%2),sortKD(t,a,o,s,f-1,e+1),sortKD(t,a,o,f+1,r,e+1)}}function select(t,a,o,s,r,e){for(;r>s;){if(r-s>600){var f=r-s+1,p=o-s+1,w=Math.log(f),m=.5*Math.exp(2*w/3),n=.5*Math.sqrt(w*m*(f-m)/f)*(p-f/2<0?-1:1),c=Math.max(s,Math.floor(o-p*m/f+n)),h=Math.min(r,Math.floor(o+(f-p)*m/f+n));select(t,a,o,c,h,e)}var i=a[2*o+e],l=s,M=r;for(swapItem(t,a,s,o),a[2*r+e]>i&&swapItem(t,a,s,r);l<M;){for(swapItem(t,a,l,M),l++,M--;a[2*l+e]<i;)l++;for(;a[2*M+e]>i;)M--}a[2*s+e]===i?swapItem(t,a,s,M):(M++,swapItem(t,a,M,r)),M<=o&&(s=M+1),o<=M&&(r=M-1)}}function swapItem(t,a,o,s){swap(t,o,s),swap(a,2*o,2*s),swap(a,2*o+1,2*s+1)}function swap(t,a,o){var s=t[a];t[a]=t[o],t[o]=s}module.exports=sortKD;
	},{}],202:[function(require,module,exports){
	"use strict";function within(s,p,r,t,u,h){for(var i=[0,s.length-1,0],o=[],n=u*u;i.length;){var e=i.pop(),a=i.pop(),f=i.pop();if(a-f<=h)for(var v=f;v<=a;v++)sqDist(p[2*v],p[2*v+1],r,t)<=n&&o.push(s[v]);else{var l=Math.floor((f+a)/2),c=p[2*l],q=p[2*l+1];sqDist(c,q,r,t)<=n&&o.push(s[l]);var D=(e+1)%2;(0===e?r-u<=c:t-u<=q)&&(i.push(f),i.push(l-1),i.push(D)),(0===e?r+u>=c:t+u>=q)&&(i.push(l+1),i.push(a),i.push(D))}}return o}function sqDist(s,p,r,t){var u=s-r,h=p-t;return u*u+h*h}module.exports=within;
	},{}],203:[function(require,module,exports){
	"use strict";function TinyQueue(t,i){if(!(this instanceof TinyQueue))return new TinyQueue(t,i);if(this.data=t||[],this.length=this.data.length,this.compare=i||defaultCompare,t)for(var a=Math.floor(this.length/2);a>=0;a--)this._down(a)}function defaultCompare(t,i){return t<i?-1:t>i?1:0}function swap(t,i,a){var n=t[i];t[i]=t[a],t[a]=n}module.exports=TinyQueue,TinyQueue.prototype={push:function(t){this.data.push(t),this.length++,this._up(this.length-1)},pop:function(){var t=this.data[0];return this.data[0]=this.data[this.length-1],this.length--,this.data.pop(),this._down(0),t},peek:function(){return this.data[0]},_up:function(t){for(var i=this.data,a=this.compare;t>0;){var n=Math.floor((t-1)/2);if(!(a(i[t],i[n])<0))break;swap(i,n,t),t=n}},_down:function(t){for(var i=this.data,a=this.compare,n=this.length;;){var e=2*t+1,h=e+1,s=t;if(e<n&&a(i[e],i[s])<0&&(s=e),h<n&&a(i[h],i[s])<0&&(s=h),s===t)return;swap(i,s,t),t=s}}};
	},{}],204:[function(require,module,exports){
	function UnitBezier(t,i,e,r){this.cx=3*t,this.bx=3*(e-t)-this.cx,this.ax=1-this.cx-this.bx,this.cy=3*i,this.by=3*(r-i)-this.cy,this.ay=1-this.cy-this.by,this.p1x=t,this.p1y=r,this.p2x=e,this.p2y=r}module.exports=UnitBezier,UnitBezier.prototype.sampleCurveX=function(t){return((this.ax*t+this.bx)*t+this.cx)*t},UnitBezier.prototype.sampleCurveY=function(t){return((this.ay*t+this.by)*t+this.cy)*t},UnitBezier.prototype.sampleCurveDerivativeX=function(t){return(3*this.ax*t+2*this.bx)*t+this.cx},UnitBezier.prototype.solveCurveX=function(t,i){"undefined"==typeof i&&(i=1e-6);var e,r,s,h,n;for(s=t,n=0;n<8;n++){if(h=this.sampleCurveX(s)-t,Math.abs(h)<i)return s;var u=this.sampleCurveDerivativeX(s);if(Math.abs(u)<1e-6)break;s-=h/u}if(e=0,r=1,s=t,s<e)return e;if(s>r)return r;for(;e<r;){if(h=this.sampleCurveX(s),Math.abs(h-t)<i)return s;t>h?e=s:r=s,s=.5*(r-e)+e}return s},UnitBezier.prototype.solve=function(t,i){return this.sampleCurveY(this.solveCurveX(t,i))};
	},{}],205:[function(require,module,exports){
	module.exports.VectorTile=require("./lib/vectortile.js"),module.exports.VectorTileFeature=require("./lib/vectortilefeature.js"),module.exports.VectorTileLayer=require("./lib/vectortilelayer.js");
	},{"./lib/vectortile.js":206,"./lib/vectortilefeature.js":207,"./lib/vectortilelayer.js":208}],206:[function(require,module,exports){
	"use strict";function VectorTile(e,r){this.layers=e.readFields(readTile,{},r)}function readTile(e,r,i){if(3===e){var t=new VectorTileLayer(i,i.readVarint()+i.pos);t.length&&(r[t.name]=t)}}var VectorTileLayer=require("./vectortilelayer");module.exports=VectorTile;
	},{"./vectortilelayer":208}],207:[function(require,module,exports){
	"use strict";function VectorTileFeature(e,t,r,i,a){this.properties={},this.extent=r,this.type=0,this._pbf=e,this._geometry=-1,this._keys=i,this._values=a,e.readFields(readFeature,this,t)}function readFeature(e,t,r){1==e?t.id=r.readVarint():2==e?readTag(r,t):3==e?t.type=r.readVarint():4==e&&(t._geometry=r.pos)}function readTag(e,t){for(var r=e.readVarint()+e.pos;e.pos<r;){var i=t._keys[e.readVarint()],a=t._values[e.readVarint()];t.properties[i]=a}}function classifyRings(e){var t=e.length;if(t<=1)return[e];for(var r,i,a=[],o=0;o<t;o++){var n=signedArea(e[o]);0!==n&&(void 0===i&&(i=n<0),i===n<0?(r&&a.push(r),r=[e[o]]):r.push(e[o]))}return r&&a.push(r),a}function signedArea(e){for(var t,r,i=0,a=0,o=e.length,n=o-1;a<o;n=a++)t=e[a],r=e[n],i+=(r.x-t.x)*(t.y+r.y);return i}var Point=require("point-geometry");module.exports=VectorTileFeature,VectorTileFeature.types=["Unknown","Point","LineString","Polygon"],VectorTileFeature.prototype.loadGeometry=function(){var e=this._pbf;e.pos=this._geometry;for(var t,r=e.readVarint()+e.pos,i=1,a=0,o=0,n=0,s=[];e.pos<r;){if(!a){var p=e.readVarint();i=7&p,a=p>>3}if(a--,1===i||2===i)o+=e.readSVarint(),n+=e.readSVarint(),1===i&&(t&&s.push(t),t=[]),t.push(new Point(o,n));else{if(7!==i)throw new Error("unknown command "+i);t&&t.push(t[0].clone())}}return t&&s.push(t),s},VectorTileFeature.prototype.bbox=function(){var e=this._pbf;e.pos=this._geometry;for(var t=e.readVarint()+e.pos,r=1,i=0,a=0,o=0,n=1/0,s=-(1/0),p=1/0,h=-(1/0);e.pos<t;){if(!i){var u=e.readVarint();r=7&u,i=u>>3}if(i--,1===r||2===r)a+=e.readSVarint(),o+=e.readSVarint(),a<n&&(n=a),a>s&&(s=a),o<p&&(p=o),o>h&&(h=o);else if(7!==r)throw new Error("unknown command "+r)}return[n,p,s,h]},VectorTileFeature.prototype.toGeoJSON=function(e,t,r){function i(e){for(var t=0;t<e.length;t++){var r=e[t],i=180-360*(r.y+p)/n;e[t]=[360*(r.x+s)/n-180,360/Math.PI*Math.atan(Math.exp(i*Math.PI/180))-90]}}var a,o,n=this.extent*Math.pow(2,r),s=this.extent*e,p=this.extent*t,h=this.loadGeometry(),u=VectorTileFeature.types[this.type];switch(this.type){case 1:var d=[];for(a=0;a<h.length;a++)d[a]=h[a][0];h=d,i(h);break;case 2:for(a=0;a<h.length;a++)i(h[a]);break;case 3:for(h=classifyRings(h),a=0;a<h.length;a++)for(o=0;o<h[a].length;o++)i(h[a][o])}1===h.length?h=h[0]:u="Multi"+u;var f={type:"Feature",geometry:{type:u,coordinates:h},properties:this.properties};return"id"in this&&(f.id=this.id),f};
	},{"point-geometry":195}],208:[function(require,module,exports){
	"use strict";function VectorTileLayer(e,t){this.version=1,this.name=null,this.extent=4096,this.length=0,this._pbf=e,this._keys=[],this._values=[],this._features=[],e.readFields(readLayer,this,t),this.length=this._features.length}function readLayer(e,t,r){15===e?t.version=r.readVarint():1===e?t.name=r.readString():5===e?t.extent=r.readVarint():2===e?t._features.push(r.pos):3===e?t._keys.push(r.readString()):4===e&&t._values.push(readValueMessage(r))}function readValueMessage(e){for(var t=null,r=e.readVarint()+e.pos;e.pos<r;){var a=e.readVarint()>>3;t=1===a?e.readString():2===a?e.readFloat():3===a?e.readDouble():4===a?e.readVarint64():5===a?e.readVarint():6===a?e.readSVarint():7===a?e.readBoolean():null}return t}var VectorTileFeature=require("./vectortilefeature.js");module.exports=VectorTileLayer,VectorTileLayer.prototype.feature=function(e){if(e<0||e>=this._features.length)throw new Error("feature index out of bounds");this._pbf.pos=this._features[e];var t=this._pbf.readVarint()+this._pbf.pos;return new VectorTileFeature(this._pbf,t,this.extent,this._keys,this._values)};
	},{"./vectortilefeature.js":207}],209:[function(require,module,exports){
	function fromVectorTileJs(e){var r=[];for(var o in e.layers)r.push(prepareLayer(e.layers[o]));var t=new Pbf;return vtpb.tile.write({layers:r},t),t.finish()}function fromGeojsonVt(e){var r={};for(var o in e)r[o]=new GeoJSONWrapper(e[o].features),r[o].name=o;return fromVectorTileJs({layers:r})}function prepareLayer(e){for(var r={name:e.name||"",version:e.version||1,extent:e.extent||4096,keys:[],values:[],features:[]},o={},t={},n=0;n<e.length;n++){var a=e.feature(n);a.geometry=encodeGeometry(a.loadGeometry());var u=[];for(var s in a.properties){var i=o[s];"undefined"==typeof i&&(r.keys.push(s),i=r.keys.length-1,o[s]=i);var p=wrapValue(a.properties[s]),l=t[p.key];"undefined"==typeof l&&(r.values.push(p),l=r.values.length-1,t[p.key]=l),u.push(i),u.push(l)}a.tags=u,r.features.push(a)}return r}function command(e,r){return(r<<3)+(7&e)}function zigzag(e){return e<<1^e>>31}function encodeGeometry(e){for(var r=[],o=0,t=0,n=e.length,a=0;a<n;a++){var u=e[a];r.push(command(1,1));for(var s=0;s<u.length;s++){1===s&&r.push(command(2,u.length-1));var i=u[s].x-o,p=u[s].y-t;r.push(zigzag(i),zigzag(p)),o+=i,t+=p}}return r}function wrapValue(e){var r,o=typeof e;return"string"===o?r={string_value:e}:"boolean"===o?r={bool_value:e}:"number"===o?r=e%1!==0?{double_value:e}:e<0?{sint_value:e}:{uint_value:e}:(e=JSON.stringify(e),r={string_value:e}),r.key=o+":"+e,r}var Pbf=require("pbf"),vtpb=require("./vector-tile-pb"),GeoJSONWrapper=require("./lib/geojson_wrapper");module.exports=fromVectorTileJs,module.exports.fromVectorTileJs=fromVectorTileJs,module.exports.fromGeojsonVt=fromGeojsonVt,module.exports.GeoJSONWrapper=GeoJSONWrapper;
	},{"./lib/geojson_wrapper":210,"./vector-tile-pb":211,"pbf":193}],210:[function(require,module,exports){
	"use strict";function GeoJSONWrapper(e){this.features=e,this.length=e.length}function FeatureWrapper(e){this.id="number"==typeof e.id?e.id:void 0,this.type=e.type,this.rawGeometry=1===e.type?[e.geometry]:e.geometry,this.properties=e.tags,this.extent=4096}var Point=require("point-geometry"),VectorTileFeature=require("vector-tile").VectorTileFeature;module.exports=GeoJSONWrapper,GeoJSONWrapper.prototype.feature=function(e){return new FeatureWrapper(this.features[e])},FeatureWrapper.prototype.loadGeometry=function(){var e=this.rawGeometry;this.geometry=[];for(var t=0;t<e.length;t++){for(var r=e[t],o=[],a=0;a<r.length;a++)o.push(new Point(r[a][0],r[a][1]));this.geometry.push(o)}return this.geometry},FeatureWrapper.prototype.bbox=function(){this.geometry||this.loadGeometry();for(var e=this.geometry,t=1/0,r=-(1/0),o=1/0,a=-(1/0),i=0;i<e.length;i++)for(var p=e[i],n=0;n<p.length;n++){var h=p[n];t=Math.min(t,h.x),r=Math.max(r,h.x),o=Math.min(o,h.y),a=Math.max(a,h.y)}return[t,o,r,a]},FeatureWrapper.prototype.toGeoJSON=VectorTileFeature.prototype.toGeoJSON;
	},{"point-geometry":195,"vector-tile":205}],211:[function(require,module,exports){
	"use strict";function readTile(e,r){return e.readFields(readTileField,{layers:[]},r)}function readTileField(e,r,i){3===e&&r.layers.push(readLayer(i,i.readVarint()+i.pos))}function writeTile(e,r){var i;if(void 0!==e.layers)for(i=0;i<e.layers.length;i++)r.writeMessage(3,writeLayer,e.layers[i])}function readValue(e,r){return e.readFields(readValueField,{},r)}function readValueField(e,r,i){1===e?r.string_value=i.readString():2===e?r.float_value=i.readFloat():3===e?r.double_value=i.readDouble():4===e?r.int_value=i.readVarint():5===e?r.uint_value=i.readVarint():6===e?r.sint_value=i.readSVarint():7===e&&(r.bool_value=i.readBoolean())}function writeValue(e,r){void 0!==e.string_value&&r.writeStringField(1,e.string_value),void 0!==e.float_value&&r.writeFloatField(2,e.float_value),void 0!==e.double_value&&r.writeDoubleField(3,e.double_value),void 0!==e.int_value&&r.writeVarintField(4,e.int_value),void 0!==e.uint_value&&r.writeVarintField(5,e.uint_value),void 0!==e.sint_value&&r.writeSVarintField(6,e.sint_value),void 0!==e.bool_value&&r.writeBooleanField(7,e.bool_value)}function readFeature(e,r){var i=e.readFields(readFeatureField,{},r);return void 0===i.type&&(i.type="Unknown"),i}function readFeatureField(e,r,i){1===e?r.id=i.readVarint():2===e?r.tags=i.readPackedVarint():3===e?r.type=i.readVarint():4===e&&(r.geometry=i.readPackedVarint())}function writeFeature(e,r){void 0!==e.id&&r.writeVarintField(1,e.id),void 0!==e.tags&&r.writePackedVarint(2,e.tags),void 0!==e.type&&r.writeVarintField(3,e.type),void 0!==e.geometry&&r.writePackedVarint(4,e.geometry)}function readLayer(e,r){return e.readFields(readLayerField,{features:[],keys:[],values:[]},r)}function readLayerField(e,r,i){15===e?r.version=i.readVarint():1===e?r.name=i.readString():2===e?r.features.push(readFeature(i,i.readVarint()+i.pos)):3===e?r.keys.push(i.readString()):4===e?r.values.push(readValue(i,i.readVarint()+i.pos)):5===e&&(r.extent=i.readVarint())}function writeLayer(e,r){void 0!==e.version&&r.writeVarintField(15,e.version),void 0!==e.name&&r.writeStringField(1,e.name);var i;if(void 0!==e.features)for(i=0;i<e.features.length;i++)r.writeMessage(2,writeFeature,e.features[i]);if(void 0!==e.keys)for(i=0;i<e.keys.length;i++)r.writeStringField(3,e.keys[i]);if(void 0!==e.values)for(i=0;i<e.values.length;i++)r.writeMessage(4,writeValue,e.values[i]);void 0!==e.extent&&r.writeVarintField(5,e.extent)}var tile=exports.tile={read:readTile,write:writeTile};tile.GeomType={Unknown:0,Point:1,LineString:2,Polygon:3},tile.value={read:readValue,write:writeValue},tile.feature={read:readFeature,write:writeFeature},tile.layer={read:readLayer,write:writeLayer};
	},{}],212:[function(require,module,exports){
	var bundleFn=arguments[3],sources=arguments[4],cache=arguments[5],stringify=JSON.stringify;module.exports=function(r,e){function t(r){d[r]=!0;for(var e in sources[r][1]){var n=sources[r][1][e];d[n]||t(n)}}for(var n,o=Object.keys(cache),a=0,i=o.length;a<i;a++){var s=o[a],u=cache[s].exports;if(u===r||u&&u.default===r){n=s;break}}if(!n){n=Math.floor(Math.pow(16,8)*Math.random()).toString(16);for(var f={},a=0,i=o.length;a<i;a++){var s=o[a];f[s]=s}sources[n]=[Function(["require","module","exports"],"("+r+")(self)"),f]}var c=Math.floor(Math.pow(16,8)*Math.random()).toString(16),l={};l[n]=n,sources[c]=[Function(["require"],"var f = require("+stringify(n)+");(f.default ? f.default : f)(self);"),l];var d={};t(c);var g="("+bundleFn+")({"+Object.keys(d).map(function(r){return stringify(r)+":["+sources[r][0]+","+stringify(sources[r][1])+"]"}).join(",")+"},{},["+stringify(c)+"])",v=window.URL||window.webkitURL||window.mozURL||window.msURL,w=new Blob([g],{type:"text/javascript"});if(e&&e.bare)return w;var h=v.createObjectURL(w),b=new Worker(h);return b.objectURL=h,b};
	},{}],213:[function(require,module,exports){
	!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.WhooTS=e.WhooTS||{})}(this,function(e){function t(e,t,r,n,i,s){s=s||{};var f=e+"?"+["bbox="+o(r,n,i),"format="+(s.format||"image/png"),"service="+(s.service||"WMS"),"version="+(s.version||"1.1.1"),"request="+(s.request||"GetMap"),"srs="+(s.srs||"EPSG:3857"),"width="+(s.width||256),"height="+(s.height||256),"layers="+t].join("&");return f}function o(e,t,o){t=Math.pow(2,o)-t-1;var n=r(256*e,256*t,o),i=r(256*(e+1),256*(t+1),o);return n[0]+","+n[1]+","+i[0]+","+i[1]}function r(e,t,o){var r=2*Math.PI*6378137/256/Math.pow(2,o),n=e*r-2*Math.PI*6378137/2,i=t*r-2*Math.PI*6378137/2;return[n,i]}e.getURL=t,e.getTileBBox=o,e.getMercCoords=r,Object.defineProperty(e,"__esModule",{value:!0})});
	},{}],214:[function(require,module,exports){
	module.exports={"version":"0.28.0"}
	},{}]},{},[24])(24)
	});
	
	
	//# sourceMappingURL=mapbox-gl.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(382).Buffer, (function() { return this; }())))

/***/ }),
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _objectMerge = __webpack_require__(390);
	
	var _objectMerge2 = _interopRequireDefault(_objectMerge);
	
	var _mapConstants = __webpack_require__(126);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GeoStyles = function () {
	  function GeoStyles() {
	    _classCallCheck(this, GeoStyles);
	
	    var lineStyle = {
	      type: 'line',
	      minzoom: _mapConstants.minDetailZoom,
	      layout: {},
	      paint: {
	        'line-color': '#4d8d8e',
	        'line-width': 2
	      }
	    };
	    var pointStyle = {
	      type: 'symbol',
	      minzoom: _mapConstants.minDetailZoom,
	      layout: {
	        'icon-allow-overlap': true,
	        'icon-image': 'dot'
	      },
	      paint: {}
	    };
	    var polygonStyle = {
	      type: 'fill',
	      minzoom: _mapConstants.minDetailZoom,
	      layout: {},
	      paint: {
	        'fill-color': '#4d8d8e'
	      }
	    };
	    this.styles = {
	      default: {
	        lines: lineStyle,
	        points: pointStyle,
	        polygons: polygonStyle,
	        centroids: {
	          type: 'symbol',
	          layout: {
	            'icon-allow-overlap': true,
	            'icon-image': '{icon-image}'
	          },
	          paint: {
	            'icon-opacity': 1
	          }
	        }
	      },
	      rail: {
	        lines: (0, _objectMerge2.default)(lineStyle, {
	          paint: {
	            'line-color': '#c34242'
	          }
	        }),
	        points: (0, _objectMerge2.default)(pointStyle, {
	          layout: {
	            'icon-image': {
	              stops: [[0, 'Rail'], [_mapConstants.maxFitZoom, 'RailIcon']]
	            }
	          }
	        })
	      },
	      road: {
	        lines: (0, _objectMerge2.default)(lineStyle, {
	          paint: {
	            'line-color': '#f68b3f'
	          }
	        }),
	        points: (0, _objectMerge2.default)(pointStyle, {
	          layout: {
	            'icon-image': {
	              stops: [[0, 'Road'], [_mapConstants.maxFitZoom, 'RoadIcon']]
	            }
	          }
	        })
	      },
	      powerplant: {
	        points: (0, _objectMerge2.default)(pointStyle, {
	          layout: {
	            'icon-image': {
	              stops: [[0, 'Powerplant'], [_mapConstants.minDetailZoom, 'PowerplantIcon']]
	            }
	          }
	        })
	      },
	      seaport: {
	        points: (0, _objectMerge2.default)(pointStyle, {
	          layout: {
	            'icon-image': {
	              stops: [[0, 'Seaport'], [_mapConstants.minDetailZoom, 'SeaportIcon']]
	            }
	          }
	        })
	      },
	      pipeline: {
	        lines: (0, _objectMerge2.default)(lineStyle, {
	          paint: {
	            'line-color': '#7e3c22'
	          }
	        })
	      },
	      ict: {
	        lines: (0, _objectMerge2.default)(lineStyle, {
	          paint: {
	            'line-color': '#65bc46'
	          }
	        })
	      },
	      dryport: {
	        points: (0, _objectMerge2.default)(pointStyle, {
	          layout: {
	            'icon-image': {
	              stops: [[0, 'Dryport'], [_mapConstants.minDetailZoom, 'DryportIcon']]
	            }
	          }
	        })
	      },
	      multimodal: {
	        points: (0, _objectMerge2.default)(pointStyle, {
	          layout: {
	            'icon-image': {
	              stops: [[0, 'Dryport'], [_mapConstants.minDetailZoom, 'DryportIcon']]
	            }
	          }
	        })
	      },
	      intermodal: {
	        points: (0, _objectMerge2.default)(pointStyle, {
	          layout: {
	            'icon-image': {
	              stops: [[0, 'Dryport'], [_mapConstants.minDetailZoom, 'DryportIcon']]
	            }
	          }
	        })
	      }
	    };
	  }
	
	  _createClass(GeoStyles, [{
	    key: 'getStyleFor',
	    value: function getStyleFor(geometryType) {
	      var infrastructureType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	
	      var typeLookup = infrastructureType ? infrastructureType.toLowerCase().replace(' ', '-') : null;
	      if ({}.hasOwnProperty.call(this.styles, typeLookup)) {
	        var lookup = this.styles[typeLookup];
	        if ({}.hasOwnProperty.call(lookup, geometryType)) {
	          return lookup[geometryType];
	        }
	      }
	      return this.styles.default[geometryType];
	    }
	  }]);
	
	  return GeoStyles;
	}();
	
	exports.default = GeoStyles;

/***/ }),
/* 181 */,
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	__webpack_require__(381);
	
	__webpack_require__(416);
	
	__webpack_require__(183);
	
	if (global._babelPolyfill) {
	  throw new Error("only one instance of babel-polyfill is allowed");
	}
	global._babelPolyfill = true;
	
	var DEFINE_PROPERTY = "defineProperty";
	function define(O, key, value) {
	  O[key] || Object[DEFINE_PROPERTY](O, key, {
	    writable: true,
	    configurable: true,
	    value: value
	  });
	}
	
	define(String.prototype, "padLeft", "".padStart);
	define(String.prototype, "padRight", "".padEnd);
	
	"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
	  [][key] && define(Array, key, Function.call.bind([][key]));
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(189);
	module.exports = __webpack_require__(25).RegExp.escape;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);
	var isArray = __webpack_require__(69);
	var SPECIES = __webpack_require__(7)('species');
	
	module.exports = function (original) {
	  var C;
	  if (isArray(original)) {
	    C = original.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
	var fails = __webpack_require__(5);
	var getTime = Date.prototype.getTime;
	var $toISOString = Date.prototype.toISOString;
	
	var lz = function (num) {
	  return num > 9 ? num : '0' + num;
	};
	
	// PhantomJS / old WebKit has a broken implementations
	module.exports = (fails(function () {
	  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
	}) || !fails(function () {
	  $toISOString.call(new Date(NaN));
	})) ? function toISOString() {
	  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
	  var d = this;
	  var y = d.getUTCFullYear();
	  var m = d.getUTCMilliseconds();
	  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
	  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
	    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
	    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
	    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
	} : $toISOString;


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var anObject = __webpack_require__(3);
	var toPrimitive = __webpack_require__(33);
	var NUMBER = 'number';
	
	module.exports = function (hint) {
	  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
	  return toPrimitive(anObject(this), hint != NUMBER);
	};


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(46);
	var gOPS = __webpack_require__(73);
	var pIE = __webpack_require__(61);
	module.exports = function (it) {
	  var result = getKeys(it);
	  var getSymbols = gOPS.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = pIE.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};


/***/ }),
/* 188 */
/***/ (function(module, exports) {

	module.exports = function (regExp, replace) {
	  var replacer = replace === Object(replace) ? function (part) {
	    return replace[part];
	  } : replace;
	  return function (it) {
	    return String(it).replace(regExp, replacer);
	  };
	};


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/benjamingr/RexExp.escape
	var $export = __webpack_require__(1);
	var $re = __webpack_require__(188)(/[\\^$*+?.()|[\]{}]/g, '\\$&');
	
	$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	var $export = __webpack_require__(1);
	
	$export($export.P, 'Array', { copyWithin: __webpack_require__(128) });
	
	__webpack_require__(38)('copyWithin');


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $every = __webpack_require__(30)(4);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].every, true), 'Array', {
	  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
	  every: function every(callbackfn /* , thisArg */) {
	    return $every(this, callbackfn, arguments[1]);
	  }
	});


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	var $export = __webpack_require__(1);
	
	$export($export.P, 'Array', { fill: __webpack_require__(88) });
	
	__webpack_require__(38)('fill');


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $filter = __webpack_require__(30)(2);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].filter, true), 'Array', {
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments[1]);
	  }
	});


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
	var $export = __webpack_require__(1);
	var $find = __webpack_require__(30)(6);
	var KEY = 'findIndex';
	var forced = true;
	// Shouldn't skip holes
	if (KEY in []) Array(1)[KEY](function () { forced = false; });
	$export($export.P + $export.F * forced, 'Array', {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	__webpack_require__(38)(KEY);


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
	var $export = __webpack_require__(1);
	var $find = __webpack_require__(30)(5);
	var KEY = 'find';
	var forced = true;
	// Shouldn't skip holes
	if (KEY in []) Array(1)[KEY](function () { forced = false; });
	$export($export.P + $export.F * forced, 'Array', {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	__webpack_require__(38)(KEY);


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $forEach = __webpack_require__(30)(0);
	var STRICT = __webpack_require__(27)([].forEach, true);
	
	$export($export.P + $export.F * !STRICT, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: function forEach(callbackfn /* , thisArg */) {
	    return $forEach(this, callbackfn, arguments[1]);
	  }
	});


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ctx = __webpack_require__(26);
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var call = __webpack_require__(139);
	var isArrayIter = __webpack_require__(96);
	var toLength = __webpack_require__(8);
	var createProperty = __webpack_require__(90);
	var getIterFn = __webpack_require__(112);
	
	$export($export.S + $export.F * !__webpack_require__(71)(function (iter) { Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	    var O = toObject(arrayLike);
	    var C = typeof this == 'function' ? this : Array;
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var index = 0;
	    var iterFn = getIterFn(O);
	    var length, result, step, iterator;
	    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for (result = new C(length); length > index; index++) {
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $indexOf = __webpack_require__(66)(false);
	var $native = [].indexOf;
	var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;
	
	$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(27)($native)), 'Array', {
	  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? $native.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments[1]);
	  }
	});


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Array', { isArray: __webpack_require__(69) });


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.13 Array.prototype.join(separator)
	var $export = __webpack_require__(1);
	var toIObject = __webpack_require__(23);
	var arrayJoin = [].join;
	
	// fallback for not array-like strings
	$export($export.P + $export.F * (__webpack_require__(60) != Object || !__webpack_require__(27)(arrayJoin)), 'Array', {
	  join: function join(separator) {
	    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
	  }
	});


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toIObject = __webpack_require__(23);
	var toInteger = __webpack_require__(28);
	var toLength = __webpack_require__(8);
	var $native = [].lastIndexOf;
	var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;
	
	$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(27)($native)), 'Array', {
	  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
	  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	    // convert -0 to +0
	    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
	    var O = toIObject(this);
	    var length = toLength(O.length);
	    var index = length - 1;
	    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
	    if (index < 0) index = length + index;
	    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
	    return -1;
	  }
	});


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $map = __webpack_require__(30)(1);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].map, true), 'Array', {
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments[1]);
	  }
	});


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var createProperty = __webpack_require__(90);
	
	// WebKit Array.of isn't generic
	$export($export.S + $export.F * __webpack_require__(5)(function () {
	  function F() { /* empty */ }
	  return !(Array.of.call(F) instanceof F);
	}), 'Array', {
	  // 22.1.2.3 Array.of( ...items)
	  of: function of(/* ...args */) {
	    var index = 0;
	    var aLen = arguments.length;
	    var result = new (typeof this == 'function' ? this : Array)(aLen);
	    while (aLen > index) createProperty(result, index, arguments[index++]);
	    result.length = aLen;
	    return result;
	  }
	});


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $reduce = __webpack_require__(130);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].reduceRight, true), 'Array', {
	  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
	  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
	  }
	});


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $reduce = __webpack_require__(130);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].reduce, true), 'Array', {
	  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
	  }
	});


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var html = __webpack_require__(94);
	var cof = __webpack_require__(24);
	var toAbsoluteIndex = __webpack_require__(50);
	var toLength = __webpack_require__(8);
	var arraySlice = [].slice;
	
	// fallback for not array-like ES3 strings and DOM objects
	$export($export.P + $export.F * __webpack_require__(5)(function () {
	  if (html) arraySlice.call(html);
	}), 'Array', {
	  slice: function slice(begin, end) {
	    var len = toLength(this.length);
	    var klass = cof(this);
	    end = end === undefined ? len : end;
	    if (klass == 'Array') return arraySlice.call(this, begin, end);
	    var start = toAbsoluteIndex(begin, len);
	    var upTo = toAbsoluteIndex(end, len);
	    var size = toLength(upTo - start);
	    var cloned = new Array(size);
	    var i = 0;
	    for (; i < size; i++) cloned[i] = klass == 'String'
	      ? this.charAt(start + i)
	      : this[start + i];
	    return cloned;
	  }
	});


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $some = __webpack_require__(30)(3);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].some, true), 'Array', {
	  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
	  some: function some(callbackfn /* , thisArg */) {
	    return $some(this, callbackfn, arguments[1]);
	  }
	});


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var aFunction = __webpack_require__(13);
	var toObject = __webpack_require__(11);
	var fails = __webpack_require__(5);
	var $sort = [].sort;
	var test = [1, 2, 3];
	
	$export($export.P + $export.F * (fails(function () {
	  // IE8-
	  test.sort(undefined);
	}) || !fails(function () {
	  // V8 bug
	  test.sort(null);
	  // Old WebKit
	}) || !__webpack_require__(27)($sort)), 'Array', {
	  // 22.1.3.25 Array.prototype.sort(comparefn)
	  sort: function sort(comparefn) {
	    return comparefn === undefined
	      ? $sort.call(toObject(this))
	      : $sort.call(toObject(this), aFunction(comparefn));
	  }
	});


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(49)('Array');


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.3.3.1 / 15.9.4.4 Date.now()
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
	var $export = __webpack_require__(1);
	var toISOString = __webpack_require__(185);
	
	// PhantomJS / old WebKit has a broken implementations
	$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
	  toISOString: toISOString
	});


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var toPrimitive = __webpack_require__(33);
	
	$export($export.P + $export.F * __webpack_require__(5)(function () {
	  return new Date(NaN).toJSON() !== null
	    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
	}), 'Date', {
	  // eslint-disable-next-line no-unused-vars
	  toJSON: function toJSON(key) {
	    var O = toObject(this);
	    var pv = toPrimitive(O);
	    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
	  }
	});


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

	var TO_PRIMITIVE = __webpack_require__(7)('toPrimitive');
	var proto = Date.prototype;
	
	if (!(TO_PRIMITIVE in proto)) __webpack_require__(17)(proto, TO_PRIMITIVE, __webpack_require__(186));


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

	var DateProto = Date.prototype;
	var INVALID_DATE = 'Invalid Date';
	var TO_STRING = 'toString';
	var $toString = DateProto[TO_STRING];
	var getTime = DateProto.getTime;
	if (new Date(NaN) + '' != INVALID_DATE) {
	  __webpack_require__(18)(DateProto, TO_STRING, function toString() {
	    var value = getTime.call(this);
	    // eslint-disable-next-line no-self-compare
	    return value === value ? $toString.call(this) : INVALID_DATE;
	  });
	}


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
	var $export = __webpack_require__(1);
	
	$export($export.P, 'Function', { bind: __webpack_require__(131) });


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var isObject = __webpack_require__(6);
	var getPrototypeOf = __webpack_require__(22);
	var HAS_INSTANCE = __webpack_require__(7)('hasInstance');
	var FunctionProto = Function.prototype;
	// 19.2.3.6 Function.prototype[@@hasInstance](V)
	if (!(HAS_INSTANCE in FunctionProto)) __webpack_require__(10).f(FunctionProto, HAS_INSTANCE, { value: function (O) {
	  if (typeof this != 'function' || !isObject(O)) return false;
	  if (!isObject(this.prototype)) return O instanceof this;
	  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
	  return false;
	} });


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(10).f;
	var FProto = Function.prototype;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';
	
	// 19.2.4.2 name
	NAME in FProto || __webpack_require__(9) && dP(FProto, NAME, {
	  configurable: true,
	  get: function () {
	    try {
	      return ('' + this).match(nameRE)[1];
	    } catch (e) {
	      return '';
	    }
	  }
	});


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.3 Math.acosh(x)
	var $export = __webpack_require__(1);
	var log1p = __webpack_require__(142);
	var sqrt = Math.sqrt;
	var $acosh = Math.acosh;
	
	$export($export.S + $export.F * !($acosh
	  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
	  && Math.floor($acosh(Number.MAX_VALUE)) == 710
	  // Tor Browser bug: Math.acosh(Infinity) -> NaN
	  && $acosh(Infinity) == Infinity
	), 'Math', {
	  acosh: function acosh(x) {
	    return (x = +x) < 1 ? NaN : x > 94906265.62425156
	      ? Math.log(x) + Math.LN2
	      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
	  }
	});


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.5 Math.asinh(x)
	var $export = __webpack_require__(1);
	var $asinh = Math.asinh;
	
	function asinh(x) {
	  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
	}
	
	// Tor Browser bug: Math.asinh(0) -> -0
	$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.7 Math.atanh(x)
	var $export = __webpack_require__(1);
	var $atanh = Math.atanh;
	
	// Tor Browser bug: Math.atanh(-0) -> 0
	$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
	  atanh: function atanh(x) {
	    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
	  }
	});


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.9 Math.cbrt(x)
	var $export = __webpack_require__(1);
	var sign = __webpack_require__(100);
	
	$export($export.S, 'Math', {
	  cbrt: function cbrt(x) {
	    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
	  }
	});


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.11 Math.clz32(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  clz32: function clz32(x) {
	    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
	  }
	});


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.12 Math.cosh(x)
	var $export = __webpack_require__(1);
	var exp = Math.exp;
	
	$export($export.S, 'Math', {
	  cosh: function cosh(x) {
	    return (exp(x = +x) + exp(-x)) / 2;
	  }
	});


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.14 Math.expm1(x)
	var $export = __webpack_require__(1);
	var $expm1 = __webpack_require__(99);
	
	$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.16 Math.fround(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { fround: __webpack_require__(141) });


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
	var $export = __webpack_require__(1);
	var abs = Math.abs;
	
	$export($export.S, 'Math', {
	  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
	    var sum = 0;
	    var i = 0;
	    var aLen = arguments.length;
	    var larg = 0;
	    var arg, div;
	    while (i < aLen) {
	      arg = abs(arguments[i++]);
	      if (larg < arg) {
	        div = larg / arg;
	        sum = sum * div * div + 1;
	        larg = arg;
	      } else if (arg > 0) {
	        div = arg / larg;
	        sum += div * div;
	      } else sum += arg;
	    }
	    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
	  }
	});


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.18 Math.imul(x, y)
	var $export = __webpack_require__(1);
	var $imul = Math.imul;
	
	// some WebKit versions fails with big numbers, some has wrong arity
	$export($export.S + $export.F * __webpack_require__(5)(function () {
	  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
	}), 'Math', {
	  imul: function imul(x, y) {
	    var UINT16 = 0xffff;
	    var xn = +x;
	    var yn = +y;
	    var xl = UINT16 & xn;
	    var yl = UINT16 & yn;
	    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
	  }
	});


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.21 Math.log10(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  log10: function log10(x) {
	    return Math.log(x) * Math.LOG10E;
	  }
	});


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.20 Math.log1p(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { log1p: __webpack_require__(142) });


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.22 Math.log2(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  log2: function log2(x) {
	    return Math.log(x) / Math.LN2;
	  }
	});


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.28 Math.sign(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { sign: __webpack_require__(100) });


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.30 Math.sinh(x)
	var $export = __webpack_require__(1);
	var expm1 = __webpack_require__(99);
	var exp = Math.exp;
	
	// V8 near Chromium 38 has a problem with very small numbers
	$export($export.S + $export.F * __webpack_require__(5)(function () {
	  return !Math.sinh(-2e-17) != -2e-17;
	}), 'Math', {
	  sinh: function sinh(x) {
	    return Math.abs(x = +x) < 1
	      ? (expm1(x) - expm1(-x)) / 2
	      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
	  }
	});


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.33 Math.tanh(x)
	var $export = __webpack_require__(1);
	var expm1 = __webpack_require__(99);
	var exp = Math.exp;
	
	$export($export.S, 'Math', {
	  tanh: function tanh(x) {
	    var a = expm1(x = +x);
	    var b = expm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
	  }
	});


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.34 Math.trunc(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  trunc: function trunc(it) {
	    return (it > 0 ? Math.floor : Math.ceil)(it);
	  }
	});


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global = __webpack_require__(4);
	var has = __webpack_require__(20);
	var cof = __webpack_require__(24);
	var inheritIfRequired = __webpack_require__(95);
	var toPrimitive = __webpack_require__(33);
	var fails = __webpack_require__(5);
	var gOPN = __webpack_require__(45).f;
	var gOPD = __webpack_require__(21).f;
	var dP = __webpack_require__(10).f;
	var $trim = __webpack_require__(55).trim;
	var NUMBER = 'Number';
	var $Number = global[NUMBER];
	var Base = $Number;
	var proto = $Number.prototype;
	// Opera ~12 has broken Object#toString
	var BROKEN_COF = cof(__webpack_require__(44)(proto)) == NUMBER;
	var TRIM = 'trim' in String.prototype;
	
	// 7.1.3 ToNumber(argument)
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, false);
	  if (typeof it == 'string' && it.length > 2) {
	    it = TRIM ? it.trim() : $trim(it, 3);
	    var first = it.charCodeAt(0);
	    var third, radix, maxCode;
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
	        default: return +it;
	      }
	      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
	        code = digits.charCodeAt(i);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};
	
	if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
	  $Number = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var that = this;
	    return that instanceof $Number
	      // check on 1..constructor(foo) case
	      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
	        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
	  };
	  for (var keys = __webpack_require__(9) ? gOPN(Base) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES6 (in case, if modules with ES6 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j = 0, key; keys.length > j; j++) {
	    if (has(Base, key = keys[j]) && !has($Number, key)) {
	      dP($Number, key, gOPD(Base, key));
	    }
	  }
	  $Number.prototype = proto;
	  proto.constructor = $Number;
	  __webpack_require__(18)(global, NUMBER, $Number);
	}


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.1 Number.EPSILON
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.2 Number.isFinite(number)
	var $export = __webpack_require__(1);
	var _isFinite = __webpack_require__(4).isFinite;
	
	$export($export.S, 'Number', {
	  isFinite: function isFinite(it) {
	    return typeof it == 'number' && _isFinite(it);
	  }
	});


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Number', { isInteger: __webpack_require__(138) });


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.4 Number.isNaN(number)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Number', {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare
	    return number != number;
	  }
	});


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.5 Number.isSafeInteger(number)
	var $export = __webpack_require__(1);
	var isInteger = __webpack_require__(138);
	var abs = Math.abs;
	
	$export($export.S, 'Number', {
	  isSafeInteger: function isSafeInteger(number) {
	    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
	  }
	});


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.6 Number.MAX_SAFE_INTEGER
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.10 Number.MIN_SAFE_INTEGER
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var $parseFloat = __webpack_require__(150);
	// 20.1.2.12 Number.parseFloat(string)
	$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var $parseInt = __webpack_require__(151);
	// 20.1.2.13 Number.parseInt(string, radix)
	$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toInteger = __webpack_require__(28);
	var aNumberValue = __webpack_require__(127);
	var repeat = __webpack_require__(107);
	var $toFixed = 1.0.toFixed;
	var floor = Math.floor;
	var data = [0, 0, 0, 0, 0, 0];
	var ERROR = 'Number.toFixed: incorrect invocation!';
	var ZERO = '0';
	
	var multiply = function (n, c) {
	  var i = -1;
	  var c2 = c;
	  while (++i < 6) {
	    c2 += n * data[i];
	    data[i] = c2 % 1e7;
	    c2 = floor(c2 / 1e7);
	  }
	};
	var divide = function (n) {
	  var i = 6;
	  var c = 0;
	  while (--i >= 0) {
	    c += data[i];
	    data[i] = floor(c / n);
	    c = (c % n) * 1e7;
	  }
	};
	var numToString = function () {
	  var i = 6;
	  var s = '';
	  while (--i >= 0) {
	    if (s !== '' || i === 0 || data[i] !== 0) {
	      var t = String(data[i]);
	      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
	    }
	  } return s;
	};
	var pow = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
	};
	var log = function (x) {
	  var n = 0;
	  var x2 = x;
	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }
	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  } return n;
	};
	
	$export($export.P + $export.F * (!!$toFixed && (
	  0.00008.toFixed(3) !== '0.000' ||
	  0.9.toFixed(0) !== '1' ||
	  1.255.toFixed(2) !== '1.25' ||
	  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
	) || !__webpack_require__(5)(function () {
	  // V8 ~ Android 4.3-
	  $toFixed.call({});
	})), 'Number', {
	  toFixed: function toFixed(fractionDigits) {
	    var x = aNumberValue(this, ERROR);
	    var f = toInteger(fractionDigits);
	    var s = '';
	    var m = ZERO;
	    var e, z, j, k;
	    if (f < 0 || f > 20) throw RangeError(ERROR);
	    // eslint-disable-next-line no-self-compare
	    if (x != x) return 'NaN';
	    if (x <= -1e21 || x >= 1e21) return String(x);
	    if (x < 0) {
	      s = '-';
	      x = -x;
	    }
	    if (x > 1e-21) {
	      e = log(x * pow(2, 69, 1)) - 69;
	      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(0, z);
	        j = f;
	        while (j >= 7) {
	          multiply(1e7, 0);
	          j -= 7;
	        }
	        multiply(pow(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(1 << 23);
	          j -= 23;
	        }
	        divide(1 << j);
	        multiply(1, 1);
	        divide(2);
	        m = numToString();
	      } else {
	        multiply(0, z);
	        multiply(1 << -e, 0);
	        m = numToString() + repeat.call(ZERO, f);
	      }
	    }
	    if (f > 0) {
	      k = m.length;
	      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
	    } else {
	      m = s + m;
	    } return m;
	  }
	});


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $fails = __webpack_require__(5);
	var aNumberValue = __webpack_require__(127);
	var $toPrecision = 1.0.toPrecision;
	
	$export($export.P + $export.F * ($fails(function () {
	  // IE7-
	  return $toPrecision.call(1, undefined) !== '1';
	}) || !$fails(function () {
	  // V8 ~ Android 4.3-
	  $toPrecision.call({});
	})), 'Number', {
	  toPrecision: function toPrecision(precision) {
	    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
	    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
	  }
	});


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(1);
	
	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(144) });


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', { create: __webpack_require__(44) });


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
	$export($export.S + $export.F * !__webpack_require__(9), 'Object', { defineProperties: __webpack_require__(145) });


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(9), 'Object', { defineProperty: __webpack_require__(10).f });


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.5 Object.freeze(O)
	var isObject = __webpack_require__(6);
	var meta = __webpack_require__(40).onFreeze;
	
	__webpack_require__(32)('freeze', function ($freeze) {
	  return function freeze(it) {
	    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
	  };
	});


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(23);
	var $getOwnPropertyDescriptor = __webpack_require__(21).f;
	
	__webpack_require__(32)('getOwnPropertyDescriptor', function () {
	  return function getOwnPropertyDescriptor(it, key) {
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(32)('getOwnPropertyNames', function () {
	  return __webpack_require__(146).f;
	});


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(11);
	var $getPrototypeOf = __webpack_require__(22);
	
	__webpack_require__(32)('getPrototypeOf', function () {
	  return function getPrototypeOf(it) {
	    return $getPrototypeOf(toObject(it));
	  };
	});


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.11 Object.isExtensible(O)
	var isObject = __webpack_require__(6);
	
	__webpack_require__(32)('isExtensible', function ($isExtensible) {
	  return function isExtensible(it) {
	    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
	  };
	});


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.12 Object.isFrozen(O)
	var isObject = __webpack_require__(6);
	
	__webpack_require__(32)('isFrozen', function ($isFrozen) {
	  return function isFrozen(it) {
	    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
	  };
	});


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.13 Object.isSealed(O)
	var isObject = __webpack_require__(6);
	
	__webpack_require__(32)('isSealed', function ($isSealed) {
	  return function isSealed(it) {
	    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
	  };
	});


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.10 Object.is(value1, value2)
	var $export = __webpack_require__(1);
	$export($export.S, 'Object', { is: __webpack_require__(154) });


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(11);
	var $keys = __webpack_require__(46);
	
	__webpack_require__(32)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.15 Object.preventExtensions(O)
	var isObject = __webpack_require__(6);
	var meta = __webpack_require__(40).onFreeze;
	
	__webpack_require__(32)('preventExtensions', function ($preventExtensions) {
	  return function preventExtensions(it) {
	    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
	  };
	});


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.17 Object.seal(O)
	var isObject = __webpack_require__(6);
	var meta = __webpack_require__(40).onFreeze;
	
	__webpack_require__(32)('seal', function ($seal) {
	  return function seal(it) {
	    return $seal && isObject(it) ? $seal(meta(it)) : it;
	  };
	});


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(1);
	$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(104).set });


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.3.6 Object.prototype.toString()
	var classof = __webpack_require__(52);
	var test = {};
	test[__webpack_require__(7)('toStringTag')] = 'z';
	if (test + '' != '[object z]') {
	  __webpack_require__(18)(Object.prototype, 'toString', function toString() {
	    return '[object ' + classof(this) + ']';
	  }, true);
	}


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var $parseFloat = __webpack_require__(150);
	// 18.2.4 parseFloat(string)
	$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var $parseInt = __webpack_require__(151);
	// 18.2.5 parseInt(string, radix)
	$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(39);
	var global = __webpack_require__(4);
	var ctx = __webpack_require__(26);
	var classof = __webpack_require__(52);
	var $export = __webpack_require__(1);
	var isObject = __webpack_require__(6);
	var aFunction = __webpack_require__(13);
	var anInstance = __webpack_require__(42);
	var forOf = __webpack_require__(43);
	var speciesConstructor = __webpack_require__(62);
	var task = __webpack_require__(109).set;
	var microtask = __webpack_require__(101)();
	var newPromiseCapabilityModule = __webpack_require__(102);
	var perform = __webpack_require__(152);
	var userAgent = __webpack_require__(80);
	var promiseResolve = __webpack_require__(153);
	var PROMISE = 'Promise';
	var TypeError = global.TypeError;
	var process = global.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8 || '';
	var $Promise = global[PROMISE];
	var isNode = classof(process) == 'process';
	var empty = function () { /* empty */ };
	var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
	var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;
	
	var USE_NATIVE = !!function () {
	  try {
	    // correct subclassing with @@species support
	    var promise = $Promise.resolve(1);
	    var FakePromise = (promise.constructor = {})[__webpack_require__(7)('species')] = function (exec) {
	      exec(empty, empty);
	    };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function')
	      && promise.then(empty) instanceof FakePromise
	      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	      // we can't detect it synchronously, so just check versions
	      && v8.indexOf('6.6') !== 0
	      && userAgent.indexOf('Chrome/66') === -1;
	  } catch (e) { /* empty */ }
	}();
	
	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var notify = function (promise, isReject) {
	  if (promise._n) return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function () {
	    var value = promise._v;
	    var ok = promise._s == 1;
	    var i = 0;
	    var run = function (reaction) {
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (promise._h == 2) onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // may throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (e) {
	        if (domain && !exited) domain.exit();
	        reject(e);
	      }
	    };
	    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if (isReject && !promise._h) onUnhandled(promise);
	  });
	};
	var onUnhandled = function (promise) {
	  task.call(global, function () {
	    var value = promise._v;
	    var unhandled = isUnhandled(promise);
	    var result, handler, console;
	    if (unhandled) {
	      result = perform(function () {
	        if (isNode) {
	          process.emit('unhandledRejection', value, promise);
	        } else if (handler = global.onunhandledrejection) {
	          handler({ promise: promise, reason: value });
	        } else if ((console = global.console) && console.error) {
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if (unhandled && result.e) throw result.v;
	  });
	};
	var isUnhandled = function (promise) {
	  return promise._h !== 1 && (promise._a || promise._c).length === 0;
	};
	var onHandleUnhandled = function (promise) {
	  task.call(global, function () {
	    var handler;
	    if (isNode) {
	      process.emit('rejectionHandled', promise);
	    } else if (handler = global.onrejectionhandled) {
	      handler({ promise: promise, reason: promise._v });
	    }
	  });
	};
	var $reject = function (value) {
	  var promise = this;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if (!promise._a) promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function (value) {
	  var promise = this;
	  var then;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if (promise === value) throw TypeError("Promise can't be resolved itself");
	    if (then = isThenable(value)) {
	      microtask(function () {
	        var wrapper = { _w: promise, _d: false }; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch (e) {
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch (e) {
	    $reject.call({ _w: promise, _d: false }, e); // wrap
	  }
	};
	
	// constructor polyfill
	if (!USE_NATIVE) {
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor) {
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch (err) {
	      $reject.call(this, err);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(48)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected) {
	      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if (this._a) this._a.push(reaction);
	      if (this._s) notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject = ctx($reject, promise, 1);
	  };
	  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
	    return C === $Promise || C === Wrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
	__webpack_require__(54)($Promise, PROMISE);
	__webpack_require__(49)(PROMISE);
	Wrapper = __webpack_require__(25)[PROMISE];
	
	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    var $$reject = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x) {
	    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(71)(function (iter) {
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var values = [];
	      var index = 0;
	      var remaining = 1;
	      forOf(iterable, false, function (promise) {
	        var $index = index++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      forOf(iterable, false, function (promise) {
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  }
	});


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
	var $export = __webpack_require__(1);
	var aFunction = __webpack_require__(13);
	var anObject = __webpack_require__(3);
	var rApply = (__webpack_require__(4).Reflect || {}).apply;
	var fApply = Function.apply;
	// MS Edge argumentsList argument is optional
	$export($export.S + $export.F * !__webpack_require__(5)(function () {
	  rApply(function () { /* empty */ });
	}), 'Reflect', {
	  apply: function apply(target, thisArgument, argumentsList) {
	    var T = aFunction(target);
	    var L = anObject(argumentsList);
	    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
	  }
	});


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
	var $export = __webpack_require__(1);
	var create = __webpack_require__(44);
	var aFunction = __webpack_require__(13);
	var anObject = __webpack_require__(3);
	var isObject = __webpack_require__(6);
	var fails = __webpack_require__(5);
	var bind = __webpack_require__(131);
	var rConstruct = (__webpack_require__(4).Reflect || {}).construct;
	
	// MS Edge supports only 2 arguments and argumentsList argument is optional
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	var NEW_TARGET_BUG = fails(function () {
	  function F() { /* empty */ }
	  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
	});
	var ARGS_BUG = !fails(function () {
	  rConstruct(function () { /* empty */ });
	});
	
	$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
	  construct: function construct(Target, args /* , newTarget */) {
	    aFunction(Target);
	    anObject(args);
	    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
	    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch (args.length) {
	        case 0: return new Target();
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      $args.push.apply($args, args);
	      return new (bind.apply(Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype;
	    var instance = create(isObject(proto) ? proto : Object.prototype);
	    var result = Function.apply.call(Target, instance, args);
	    return isObject(result) ? result : instance;
	  }
	});


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
	var dP = __webpack_require__(10);
	var $export = __webpack_require__(1);
	var anObject = __webpack_require__(3);
	var toPrimitive = __webpack_require__(33);
	
	// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
	$export($export.S + $export.F * __webpack_require__(5)(function () {
	  // eslint-disable-next-line no-undef
	  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
	}), 'Reflect', {
	  defineProperty: function defineProperty(target, propertyKey, attributes) {
	    anObject(target);
	    propertyKey = toPrimitive(propertyKey, true);
	    anObject(attributes);
	    try {
	      dP.f(target, propertyKey, attributes);
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }
	});


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.4 Reflect.deleteProperty(target, propertyKey)
	var $export = __webpack_require__(1);
	var gOPD = __webpack_require__(21).f;
	var anObject = __webpack_require__(3);
	
	$export($export.S, 'Reflect', {
	  deleteProperty: function deleteProperty(target, propertyKey) {
	    var desc = gOPD(anObject(target), propertyKey);
	    return desc && !desc.configurable ? false : delete target[propertyKey];
	  }
	});


/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 26.1.5 Reflect.enumerate(target)
	var $export = __webpack_require__(1);
	var anObject = __webpack_require__(3);
	var Enumerate = function (iterated) {
	  this._t = anObject(iterated); // target
	  this._i = 0;                  // next index
	  var keys = this._k = [];      // keys
	  var key;
	  for (key in iterated) keys.push(key);
	};
	__webpack_require__(97)(Enumerate, 'Object', function () {
	  var that = this;
	  var keys = that._k;
	  var key;
	  do {
	    if (that._i >= keys.length) return { value: undefined, done: true };
	  } while (!((key = keys[that._i++]) in that._t));
	  return { value: key, done: false };
	});
	
	$export($export.S, 'Reflect', {
	  enumerate: function enumerate(target) {
	    return new Enumerate(target);
	  }
	});


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
	var gOPD = __webpack_require__(21);
	var $export = __webpack_require__(1);
	var anObject = __webpack_require__(3);
	
	$export($export.S, 'Reflect', {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
	    return gOPD.f(anObject(target), propertyKey);
	  }
	});


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.8 Reflect.getPrototypeOf(target)
	var $export = __webpack_require__(1);
	var getProto = __webpack_require__(22);
	var anObject = __webpack_require__(3);
	
	$export($export.S, 'Reflect', {
	  getPrototypeOf: function getPrototypeOf(target) {
	    return getProto(anObject(target));
	  }
	});


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.6 Reflect.get(target, propertyKey [, receiver])
	var gOPD = __webpack_require__(21);
	var getPrototypeOf = __webpack_require__(22);
	var has = __webpack_require__(20);
	var $export = __webpack_require__(1);
	var isObject = __webpack_require__(6);
	var anObject = __webpack_require__(3);
	
	function get(target, propertyKey /* , receiver */) {
	  var receiver = arguments.length < 3 ? target : arguments[2];
	  var desc, proto;
	  if (anObject(target) === receiver) return target[propertyKey];
	  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
	    ? desc.value
	    : desc.get !== undefined
	      ? desc.get.call(receiver)
	      : undefined;
	  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
	}
	
	$export($export.S, 'Reflect', { get: get });


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.9 Reflect.has(target, propertyKey)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Reflect', {
	  has: function has(target, propertyKey) {
	    return propertyKey in target;
	  }
	});


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.10 Reflect.isExtensible(target)
	var $export = __webpack_require__(1);
	var anObject = __webpack_require__(3);
	var $isExtensible = Object.isExtensible;
	
	$export($export.S, 'Reflect', {
	  isExtensible: function isExtensible(target) {
	    anObject(target);
	    return $isExtensible ? $isExtensible(target) : true;
	  }
	});


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.11 Reflect.ownKeys(target)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Reflect', { ownKeys: __webpack_require__(149) });


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.12 Reflect.preventExtensions(target)
	var $export = __webpack_require__(1);
	var anObject = __webpack_require__(3);
	var $preventExtensions = Object.preventExtensions;
	
	$export($export.S, 'Reflect', {
	  preventExtensions: function preventExtensions(target) {
	    anObject(target);
	    try {
	      if ($preventExtensions) $preventExtensions(target);
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }
	});


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.14 Reflect.setPrototypeOf(target, proto)
	var $export = __webpack_require__(1);
	var setProto = __webpack_require__(104);
	
	if (setProto) $export($export.S, 'Reflect', {
	  setPrototypeOf: function setPrototypeOf(target, proto) {
	    setProto.check(target, proto);
	    try {
	      setProto.set(target, proto);
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }
	});


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
	var dP = __webpack_require__(10);
	var gOPD = __webpack_require__(21);
	var getPrototypeOf = __webpack_require__(22);
	var has = __webpack_require__(20);
	var $export = __webpack_require__(1);
	var createDesc = __webpack_require__(47);
	var anObject = __webpack_require__(3);
	var isObject = __webpack_require__(6);
	
	function set(target, propertyKey, V /* , receiver */) {
	  var receiver = arguments.length < 4 ? target : arguments[3];
	  var ownDesc = gOPD.f(anObject(target), propertyKey);
	  var existingDescriptor, proto;
	  if (!ownDesc) {
	    if (isObject(proto = getPrototypeOf(target))) {
	      return set(proto, propertyKey, V, receiver);
	    }
	    ownDesc = createDesc(0);
	  }
	  if (has(ownDesc, 'value')) {
	    if (ownDesc.writable === false || !isObject(receiver)) return false;
	    if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
	      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
	      existingDescriptor.value = V;
	      dP.f(receiver, propertyKey, existingDescriptor);
	    } else dP.f(receiver, propertyKey, createDesc(0, V));
	    return true;
	  }
	  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
	}
	
	$export($export.S, 'Reflect', { set: set });


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var inheritIfRequired = __webpack_require__(95);
	var dP = __webpack_require__(10).f;
	var gOPN = __webpack_require__(45).f;
	var isRegExp = __webpack_require__(70);
	var $flags = __webpack_require__(59);
	var $RegExp = global.RegExp;
	var Base = $RegExp;
	var proto = $RegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;
	// "new" creates a new object, old webkit buggy here
	var CORRECT_NEW = new $RegExp(re1) !== re1;
	
	if (__webpack_require__(9) && (!CORRECT_NEW || __webpack_require__(5)(function () {
	  re2[__webpack_require__(7)('match')] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
	}))) {
	  $RegExp = function RegExp(p, f) {
	    var tiRE = this instanceof $RegExp;
	    var piRE = isRegExp(p);
	    var fiU = f === undefined;
	    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
	      : inheritIfRequired(CORRECT_NEW
	        ? new Base(piRE && !fiU ? p.source : p, f)
	        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
	      , tiRE ? this : proto, $RegExp);
	  };
	  var proxy = function (key) {
	    key in $RegExp || dP($RegExp, key, {
	      configurable: true,
	      get: function () { return Base[key]; },
	      set: function (it) { Base[key] = it; }
	    });
	  };
	  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
	  proto.constructor = $RegExp;
	  $RegExp.prototype = proto;
	  __webpack_require__(18)(global, 'RegExp', $RegExp);
	}
	
	__webpack_require__(49)('RegExp');


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var anObject = __webpack_require__(3);
	var toLength = __webpack_require__(8);
	var advanceStringIndex = __webpack_require__(87);
	var regExpExec = __webpack_require__(74);
	
	// @@match logic
	__webpack_require__(68)('match', 1, function (defined, MATCH, $match, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = defined(this);
	      var fn = regexp == undefined ? undefined : regexp[MATCH];
	      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative($match, regexp, this);
	      if (res.done) return res.value;
	      var rx = anObject(regexp);
	      var S = String(this);
	      if (!rx.global) return regExpExec(rx, S);
	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regExpExec(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var anObject = __webpack_require__(3);
	var toObject = __webpack_require__(11);
	var toLength = __webpack_require__(8);
	var toInteger = __webpack_require__(28);
	var advanceStringIndex = __webpack_require__(87);
	var regExpExec = __webpack_require__(74);
	var max = Math.max;
	var min = Math.min;
	var floor = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;
	
	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};
	
	// @@replace logic
	__webpack_require__(68)('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = defined(this);
	      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return fn !== undefined
	        ? fn.call(searchValue, O, replaceValue)
	        : $replace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      var res = maybeCallNative($replace, regexp, this, replaceValue);
	      if (res.done) return res.value;
	
	      var rx = anObject(regexp);
	      var S = String(this);
	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);
	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regExpExec(rx, S);
	        if (result === null) break;
	        results.push(result);
	        if (!global) break;
	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }
	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];
	        var matched = String(result[0]);
	        var position = max(min(toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];
	
	    // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return $replace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return ch;
	          if (n > m) {
	            var f = floor(n / 10);
	            if (f === 0) return ch;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return ch;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var anObject = __webpack_require__(3);
	var sameValue = __webpack_require__(154);
	var regExpExec = __webpack_require__(74);
	
	// @@search logic
	__webpack_require__(68)('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
	  return [
	    // `String.prototype.search` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.search
	    function search(regexp) {
	      var O = defined(this);
	      var fn = regexp == undefined ? undefined : regexp[SEARCH];
	      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	    },
	    // `RegExp.prototype[@@search]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
	    function (regexp) {
	      var res = maybeCallNative($search, regexp, this);
	      if (res.done) return res.value;
	      var rx = anObject(regexp);
	      var S = String(this);
	      var previousLastIndex = rx.lastIndex;
	      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
	      var result = regExpExec(rx, S);
	      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
	      return result === null ? -1 : result.index;
	    }
	  ];
	});


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var isRegExp = __webpack_require__(70);
	var anObject = __webpack_require__(3);
	var speciesConstructor = __webpack_require__(62);
	var advanceStringIndex = __webpack_require__(87);
	var toLength = __webpack_require__(8);
	var callRegExpExec = __webpack_require__(74);
	var regexpExec = __webpack_require__(103);
	var $min = Math.min;
	var $push = [].push;
	var $SPLIT = 'split';
	var LENGTH = 'length';
	var LAST_INDEX = 'lastIndex';
	
	// eslint-disable-next-line no-empty
	var SUPPORTS_Y = !!(function () { try { return new RegExp('x', 'y'); } catch (e) {} })();
	
	// @@split logic
	__webpack_require__(68)('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
	  var internalSplit = $split;
	  if (
	    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
	    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
	    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
	    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
	    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
	    ''[$SPLIT](/.?/)[LENGTH]
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(this);
	      if (separator === undefined && limit === 0) return [];
	      // If `separator` is not a regex, use native split
	      if (!isRegExp(separator)) return $split.call(string, separator, limit);
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy[LAST_INDEX];
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
	          lastLength = match[0][LENGTH];
	          lastLastIndex = lastIndex;
	          if (output[LENGTH] >= splitLimit) break;
	        }
	        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string[LENGTH]) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
	    };
	  // Chakra, V8
	  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
	    };
	  }
	
	  return [
	    // `String.prototype.split` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = defined(this);
	      var splitter = separator == undefined ? undefined : separator[SPLIT];
	      return splitter !== undefined
	        ? splitter.call(separator, O, limit)
	        : internalSplit.call(String(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (regexp, limit) {
	      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
	      if (res.done) return res.value;
	
	      var rx = anObject(regexp);
	      var S = String(this);
	      var C = speciesConstructor(rx, RegExp);
	
	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                    (rx.multiline ? 'm' : '') +
	                    (rx.unicode ? 'u' : '') +
	                    (SUPPORTS_Y ? 'y' : 'g');
	
	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	      var lim = limit === undefined ? 0xffffffff : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y ? q : 0;
	        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
	        ) {
	          q = advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          A.push(S.slice(p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            A.push(z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      A.push(S.slice(p));
	      return A;
	    }
	  ];
	});


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	__webpack_require__(160);
	var anObject = __webpack_require__(3);
	var $flags = __webpack_require__(59);
	var DESCRIPTORS = __webpack_require__(9);
	var TO_STRING = 'toString';
	var $toString = /./[TO_STRING];
	
	var define = function (fn) {
	  __webpack_require__(18)(RegExp.prototype, TO_STRING, fn, true);
	};
	
	// 21.2.5.14 RegExp.prototype.toString()
	if (__webpack_require__(5)(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
	  define(function toString() {
	    var R = anObject(this);
	    return '/'.concat(R.source, '/',
	      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
	  });
	// FF44- RegExp#toString has a wrong name
	} else if ($toString.name != TO_STRING) {
	  define(function toString() {
	    return $toString.call(this);
	  });
	}


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.2 String.prototype.anchor(name)
	__webpack_require__(19)('anchor', function (createHTML) {
	  return function anchor(name) {
	    return createHTML(this, 'a', 'name', name);
	  };
	});


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.3 String.prototype.big()
	__webpack_require__(19)('big', function (createHTML) {
	  return function big() {
	    return createHTML(this, 'big', '', '');
	  };
	});


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.4 String.prototype.blink()
	__webpack_require__(19)('blink', function (createHTML) {
	  return function blink() {
	    return createHTML(this, 'blink', '', '');
	  };
	});


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.5 String.prototype.bold()
	__webpack_require__(19)('bold', function (createHTML) {
	  return function bold() {
	    return createHTML(this, 'b', '', '');
	  };
	});


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $at = __webpack_require__(78)(false);
	$export($export.P, 'String', {
	  // 21.1.3.3 String.prototype.codePointAt(pos)
	  codePointAt: function codePointAt(pos) {
	    return $at(this, pos);
	  }
	});


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

	// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
	'use strict';
	var $export = __webpack_require__(1);
	var toLength = __webpack_require__(8);
	var context = __webpack_require__(106);
	var ENDS_WITH = 'endsWith';
	var $endsWith = ''[ENDS_WITH];
	
	$export($export.P + $export.F * __webpack_require__(93)(ENDS_WITH), 'String', {
	  endsWith: function endsWith(searchString /* , endPosition = @length */) {
	    var that = context(this, searchString, ENDS_WITH);
	    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
	    var len = toLength(that.length);
	    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
	    var search = String(searchString);
	    return $endsWith
	      ? $endsWith.call(that, search, end)
	      : that.slice(end - search.length, end) === search;
	  }
	});


/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.6 String.prototype.fixed()
	__webpack_require__(19)('fixed', function (createHTML) {
	  return function fixed() {
	    return createHTML(this, 'tt', '', '');
	  };
	});


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.7 String.prototype.fontcolor(color)
	__webpack_require__(19)('fontcolor', function (createHTML) {
	  return function fontcolor(color) {
	    return createHTML(this, 'font', 'color', color);
	  };
	});


/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.8 String.prototype.fontsize(size)
	__webpack_require__(19)('fontsize', function (createHTML) {
	  return function fontsize(size) {
	    return createHTML(this, 'font', 'size', size);
	  };
	});


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var toAbsoluteIndex = __webpack_require__(50);
	var fromCharCode = String.fromCharCode;
	var $fromCodePoint = String.fromCodePoint;
	
	// length should be 1, old FF problem
	$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
	  // 21.1.2.2 String.fromCodePoint(...codePoints)
	  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
	    var res = [];
	    var aLen = arguments.length;
	    var i = 0;
	    var code;
	    while (aLen > i) {
	      code = +arguments[i++];
	      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
	      res.push(code < 0x10000
	        ? fromCharCode(code)
	        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
	      );
	    } return res.join('');
	  }
	});


/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

	// 21.1.3.7 String.prototype.includes(searchString, position = 0)
	'use strict';
	var $export = __webpack_require__(1);
	var context = __webpack_require__(106);
	var INCLUDES = 'includes';
	
	$export($export.P + $export.F * __webpack_require__(93)(INCLUDES), 'String', {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~context(this, searchString, INCLUDES)
	      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.9 String.prototype.italics()
	__webpack_require__(19)('italics', function (createHTML) {
	  return function italics() {
	    return createHTML(this, 'i', '', '');
	  };
	});


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at = __webpack_require__(78)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(98)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.10 String.prototype.link(url)
	__webpack_require__(19)('link', function (createHTML) {
	  return function link(url) {
	    return createHTML(this, 'a', 'href', url);
	  };
	});


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var toIObject = __webpack_require__(23);
	var toLength = __webpack_require__(8);
	
	$export($export.S, 'String', {
	  // 21.1.2.4 String.raw(callSite, ...substitutions)
	  raw: function raw(callSite) {
	    var tpl = toIObject(callSite.raw);
	    var len = toLength(tpl.length);
	    var aLen = arguments.length;
	    var res = [];
	    var i = 0;
	    while (len > i) {
	      res.push(String(tpl[i++]));
	      if (i < aLen) res.push(String(arguments[i]));
	    } return res.join('');
	  }
	});


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	
	$export($export.P, 'String', {
	  // 21.1.3.13 String.prototype.repeat(count)
	  repeat: __webpack_require__(107)
	});


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.11 String.prototype.small()
	__webpack_require__(19)('small', function (createHTML) {
	  return function small() {
	    return createHTML(this, 'small', '', '');
	  };
	});


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

	// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
	'use strict';
	var $export = __webpack_require__(1);
	var toLength = __webpack_require__(8);
	var context = __webpack_require__(106);
	var STARTS_WITH = 'startsWith';
	var $startsWith = ''[STARTS_WITH];
	
	$export($export.P + $export.F * __webpack_require__(93)(STARTS_WITH), 'String', {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = context(this, searchString, STARTS_WITH);
	    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = String(searchString);
	    return $startsWith
	      ? $startsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.12 String.prototype.strike()
	__webpack_require__(19)('strike', function (createHTML) {
	  return function strike() {
	    return createHTML(this, 'strike', '', '');
	  };
	});


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.13 String.prototype.sub()
	__webpack_require__(19)('sub', function (createHTML) {
	  return function sub() {
	    return createHTML(this, 'sub', '', '');
	  };
	});


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.14 String.prototype.sup()
	__webpack_require__(19)('sup', function (createHTML) {
	  return function sup() {
	    return createHTML(this, 'sup', '', '');
	  };
	});


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 21.1.3.25 String.prototype.trim()
	__webpack_require__(55)('trim', function ($trim) {
	  return function trim() {
	    return $trim(this, 3);
	  };
	});


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global = __webpack_require__(4);
	var has = __webpack_require__(20);
	var DESCRIPTORS = __webpack_require__(9);
	var $export = __webpack_require__(1);
	var redefine = __webpack_require__(18);
	var META = __webpack_require__(40).KEY;
	var $fails = __webpack_require__(5);
	var shared = __webpack_require__(77);
	var setToStringTag = __webpack_require__(54);
	var uid = __webpack_require__(51);
	var wks = __webpack_require__(7);
	var wksExt = __webpack_require__(157);
	var wksDefine = __webpack_require__(111);
	var enumKeys = __webpack_require__(187);
	var isArray = __webpack_require__(69);
	var anObject = __webpack_require__(3);
	var isObject = __webpack_require__(6);
	var toIObject = __webpack_require__(23);
	var toPrimitive = __webpack_require__(33);
	var createDesc = __webpack_require__(47);
	var _create = __webpack_require__(44);
	var gOPNExt = __webpack_require__(146);
	var $GOPD = __webpack_require__(21);
	var $DP = __webpack_require__(10);
	var $keys = __webpack_require__(46);
	var gOPD = $GOPD.f;
	var dP = $DP.f;
	var gOPN = gOPNExt.f;
	var $Symbol = global.Symbol;
	var $JSON = global.JSON;
	var _stringify = $JSON && $JSON.stringify;
	var PROTOTYPE = 'prototype';
	var HIDDEN = wks('_hidden');
	var TO_PRIMITIVE = wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = shared('symbol-registry');
	var AllSymbols = shared('symbols');
	var OPSymbols = shared('op-symbols');
	var ObjectProto = Object[PROTOTYPE];
	var USE_NATIVE = typeof $Symbol == 'function';
	var QObject = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(dP({}, 'a', {
	    get: function () { return dP(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if (has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIObject(it);
	  key = toPrimitive(key, true);
	  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
	  var D = gOPD(it, key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN(toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto;
	  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f = $defineProperty;
	  __webpack_require__(45).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(61).f = $propertyIsEnumerable;
	  __webpack_require__(73).f = $getOwnPropertySymbols;
	
	  if (DESCRIPTORS && !__webpack_require__(39)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function (name) {
	    return wrap(wks(name));
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });
	
	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);
	
	for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    $replacer = replacer = args[1];
	    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    if (!isArray(replacer)) replacer = function (key, value) {
	      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(17)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $typed = __webpack_require__(79);
	var buffer = __webpack_require__(110);
	var anObject = __webpack_require__(3);
	var toAbsoluteIndex = __webpack_require__(50);
	var toLength = __webpack_require__(8);
	var isObject = __webpack_require__(6);
	var ArrayBuffer = __webpack_require__(4).ArrayBuffer;
	var speciesConstructor = __webpack_require__(62);
	var $ArrayBuffer = buffer.ArrayBuffer;
	var $DataView = buffer.DataView;
	var $isView = $typed.ABV && ArrayBuffer.isView;
	var $slice = $ArrayBuffer.prototype.slice;
	var VIEW = $typed.VIEW;
	var ARRAY_BUFFER = 'ArrayBuffer';
	
	$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });
	
	$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
	  // 24.1.3.1 ArrayBuffer.isView(arg)
	  isView: function isView(it) {
	    return $isView && $isView(it) || isObject(it) && VIEW in it;
	  }
	});
	
	$export($export.P + $export.U + $export.F * __webpack_require__(5)(function () {
	  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
	}), ARRAY_BUFFER, {
	  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
	  slice: function slice(start, end) {
	    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
	    var len = anObject(this).byteLength;
	    var first = toAbsoluteIndex(start, len);
	    var fin = toAbsoluteIndex(end === undefined ? len : end, len);
	    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(fin - first));
	    var viewS = new $DataView(this);
	    var viewT = new $DataView(result);
	    var index = 0;
	    while (first < fin) {
	      viewT.setUint8(index++, viewS.getUint8(first++));
	    } return result;
	  }
	});
	
	__webpack_require__(49)(ARRAY_BUFFER);


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	$export($export.G + $export.W + $export.F * !__webpack_require__(79).ABV, {
	  DataView: __webpack_require__(110).DataView
	});


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Float32', 4, function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Float64', 8, function (init) {
	  return function Float64Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Int16', 2, function (init) {
	  return function Int16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Int32', 4, function (init) {
	  return function Int32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Int8', 1, function (init) {
	  return function Int8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Uint16', 2, function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Uint32', 4, function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Uint8', 1, function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Uint8', 1, function (init) {
	  return function Uint8ClampedArray(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	}, true);


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var weak = __webpack_require__(134);
	var validate = __webpack_require__(56);
	var WEAK_SET = 'WeakSet';
	
	// 23.4 WeakSet Objects
	__webpack_require__(67)(WEAK_SET, function (get) {
	  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.4.3.1 WeakSet.prototype.add(value)
	  add: function add(value) {
	    return weak.def(validate(this, WEAK_SET), value, true);
	  }
	}, weak, false, true);


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
	var $export = __webpack_require__(1);
	var flattenIntoArray = __webpack_require__(135);
	var toObject = __webpack_require__(11);
	var toLength = __webpack_require__(8);
	var aFunction = __webpack_require__(13);
	var arraySpeciesCreate = __webpack_require__(89);
	
	$export($export.P, 'Array', {
	  flatMap: function flatMap(callbackfn /* , thisArg */) {
	    var O = toObject(this);
	    var sourceLen, A;
	    aFunction(callbackfn);
	    sourceLen = toLength(O.length);
	    A = arraySpeciesCreate(O, 0);
	    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
	    return A;
	  }
	});
	
	__webpack_require__(38)('flatMap');


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
	var $export = __webpack_require__(1);
	var flattenIntoArray = __webpack_require__(135);
	var toObject = __webpack_require__(11);
	var toLength = __webpack_require__(8);
	var toInteger = __webpack_require__(28);
	var arraySpeciesCreate = __webpack_require__(89);
	
	$export($export.P, 'Array', {
	  flatten: function flatten(/* depthArg = 1 */) {
	    var depthArg = arguments[0];
	    var O = toObject(this);
	    var sourceLen = toLength(O.length);
	    var A = arraySpeciesCreate(O, 0);
	    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
	    return A;
	  }
	});
	
	__webpack_require__(38)('flatten');


/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/Array.prototype.includes
	var $export = __webpack_require__(1);
	var $includes = __webpack_require__(66)(true);
	
	$export($export.P, 'Array', {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	
	__webpack_require__(38)('includes');


/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
	var $export = __webpack_require__(1);
	var microtask = __webpack_require__(101)();
	var process = __webpack_require__(4).process;
	var isNode = __webpack_require__(24)(process) == 'process';
	
	$export($export.G, {
	  asap: function asap(fn) {
	    var domain = isNode && process.domain;
	    microtask(domain ? domain.bind(fn) : fn);
	  }
	});


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/ljharb/proposal-is-error
	var $export = __webpack_require__(1);
	var cof = __webpack_require__(24);
	
	$export($export.S, 'Error', {
	  isError: function isError(it) {
	    return cof(it) === 'Error';
	  }
	});


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-global
	var $export = __webpack_require__(1);
	
	$export($export.G, { global: __webpack_require__(4) });


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
	__webpack_require__(75)('Map');


/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
	__webpack_require__(76)('Map');


/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export = __webpack_require__(1);
	
	$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(133)('Map') });


/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  clamp: function clamp(x, lower, upper) {
	    return Math.min(upper, Math.max(lower, x));
	  }
	});


/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });


/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	var RAD_PER_DEG = 180 / Math.PI;
	
	$export($export.S, 'Math', {
	  degrees: function degrees(radians) {
	    return radians * RAD_PER_DEG;
	  }
	});


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	var scale = __webpack_require__(143);
	var fround = __webpack_require__(141);
	
	$export($export.S, 'Math', {
	  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
	    return fround(scale(x, inLow, inHigh, outLow, outHigh));
	  }
	});


/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  iaddh: function iaddh(x0, x1, y0, y1) {
	    var $x0 = x0 >>> 0;
	    var $x1 = x1 >>> 0;
	    var $y0 = y0 >>> 0;
	    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
	  }
	});


/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  imulh: function imulh(u, v) {
	    var UINT16 = 0xffff;
	    var $u = +u;
	    var $v = +v;
	    var u0 = $u & UINT16;
	    var v0 = $v & UINT16;
	    var u1 = $u >> 16;
	    var v1 = $v >> 16;
	    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
	    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
	  }
	});


/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  isubh: function isubh(x0, x1, y0, y1) {
	    var $x0 = x0 >>> 0;
	    var $x1 = x1 >>> 0;
	    var $y0 = y0 >>> 0;
	    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
	  }
	});


/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });


/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	var DEG_PER_RAD = Math.PI / 180;
	
	$export($export.S, 'Math', {
	  radians: function radians(degrees) {
	    return degrees * DEG_PER_RAD;
	  }
	});


/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { scale: __webpack_require__(143) });


/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

	// http://jfbastien.github.io/papers/Math.signbit.html
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { signbit: function signbit(x) {
	  // eslint-disable-next-line no-self-compare
	  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
	} });


/***/ }),
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  umulh: function umulh(u, v) {
	    var UINT16 = 0xffff;
	    var $u = +u;
	    var $v = +v;
	    var u0 = $u & UINT16;
	    var v0 = $v & UINT16;
	    var u1 = $u >>> 16;
	    var v1 = $v >>> 16;
	    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
	    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
	  }
	});


/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var aFunction = __webpack_require__(13);
	var $defineProperty = __webpack_require__(10);
	
	// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
	__webpack_require__(9) && $export($export.P + __webpack_require__(72), 'Object', {
	  __defineGetter__: function __defineGetter__(P, getter) {
	    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
	  }
	});


/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var aFunction = __webpack_require__(13);
	var $defineProperty = __webpack_require__(10);
	
	// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
	__webpack_require__(9) && $export($export.P + __webpack_require__(72), 'Object', {
	  __defineSetter__: function __defineSetter__(P, setter) {
	    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
	  }
	});


/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export = __webpack_require__(1);
	var $entries = __webpack_require__(148)(true);
	
	$export($export.S, 'Object', {
	  entries: function entries(it) {
	    return $entries(it);
	  }
	});


/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-getownpropertydescriptors
	var $export = __webpack_require__(1);
	var ownKeys = __webpack_require__(149);
	var toIObject = __webpack_require__(23);
	var gOPD = __webpack_require__(21);
	var createProperty = __webpack_require__(90);
	
	$export($export.S, 'Object', {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIObject(object);
	    var getDesc = gOPD.f;
	    var keys = ownKeys(O);
	    var result = {};
	    var i = 0;
	    var key, desc;
	    while (keys.length > i) {
	      desc = getDesc(O, key = keys[i++]);
	      if (desc !== undefined) createProperty(result, key, desc);
	    }
	    return result;
	  }
	});


/***/ }),
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var toPrimitive = __webpack_require__(33);
	var getPrototypeOf = __webpack_require__(22);
	var getOwnPropertyDescriptor = __webpack_require__(21).f;
	
	// B.2.2.4 Object.prototype.__lookupGetter__(P)
	__webpack_require__(9) && $export($export.P + __webpack_require__(72), 'Object', {
	  __lookupGetter__: function __lookupGetter__(P) {
	    var O = toObject(this);
	    var K = toPrimitive(P, true);
	    var D;
	    do {
	      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
	    } while (O = getPrototypeOf(O));
	  }
	});


/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var toPrimitive = __webpack_require__(33);
	var getPrototypeOf = __webpack_require__(22);
	var getOwnPropertyDescriptor = __webpack_require__(21).f;
	
	// B.2.2.5 Object.prototype.__lookupSetter__(P)
	__webpack_require__(9) && $export($export.P + __webpack_require__(72), 'Object', {
	  __lookupSetter__: function __lookupSetter__(P) {
	    var O = toObject(this);
	    var K = toPrimitive(P, true);
	    var D;
	    do {
	      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
	    } while (O = getPrototypeOf(O));
	  }
	});


/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export = __webpack_require__(1);
	var $values = __webpack_require__(148)(false);
	
	$export($export.S, 'Object', {
	  values: function values(it) {
	    return $values(it);
	  }
	});


/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/zenparsing/es-observable
	var $export = __webpack_require__(1);
	var global = __webpack_require__(4);
	var core = __webpack_require__(25);
	var microtask = __webpack_require__(101)();
	var OBSERVABLE = __webpack_require__(7)('observable');
	var aFunction = __webpack_require__(13);
	var anObject = __webpack_require__(3);
	var anInstance = __webpack_require__(42);
	var redefineAll = __webpack_require__(48);
	var hide = __webpack_require__(17);
	var forOf = __webpack_require__(43);
	var RETURN = forOf.RETURN;
	
	var getMethod = function (fn) {
	  return fn == null ? undefined : aFunction(fn);
	};
	
	var cleanupSubscription = function (subscription) {
	  var cleanup = subscription._c;
	  if (cleanup) {
	    subscription._c = undefined;
	    cleanup();
	  }
	};
	
	var subscriptionClosed = function (subscription) {
	  return subscription._o === undefined;
	};
	
	var closeSubscription = function (subscription) {
	  if (!subscriptionClosed(subscription)) {
	    subscription._o = undefined;
	    cleanupSubscription(subscription);
	  }
	};
	
	var Subscription = function (observer, subscriber) {
	  anObject(observer);
	  this._c = undefined;
	  this._o = observer;
	  observer = new SubscriptionObserver(this);
	  try {
	    var cleanup = subscriber(observer);
	    var subscription = cleanup;
	    if (cleanup != null) {
	      if (typeof cleanup.unsubscribe === 'function') cleanup = function () { subscription.unsubscribe(); };
	      else aFunction(cleanup);
	      this._c = cleanup;
	    }
	  } catch (e) {
	    observer.error(e);
	    return;
	  } if (subscriptionClosed(this)) cleanupSubscription(this);
	};
	
	Subscription.prototype = redefineAll({}, {
	  unsubscribe: function unsubscribe() { closeSubscription(this); }
	});
	
	var SubscriptionObserver = function (subscription) {
	  this._s = subscription;
	};
	
	SubscriptionObserver.prototype = redefineAll({}, {
	  next: function next(value) {
	    var subscription = this._s;
	    if (!subscriptionClosed(subscription)) {
	      var observer = subscription._o;
	      try {
	        var m = getMethod(observer.next);
	        if (m) return m.call(observer, value);
	      } catch (e) {
	        try {
	          closeSubscription(subscription);
	        } finally {
	          throw e;
	        }
	      }
	    }
	  },
	  error: function error(value) {
	    var subscription = this._s;
	    if (subscriptionClosed(subscription)) throw value;
	    var observer = subscription._o;
	    subscription._o = undefined;
	    try {
	      var m = getMethod(observer.error);
	      if (!m) throw value;
	      value = m.call(observer, value);
	    } catch (e) {
	      try {
	        cleanupSubscription(subscription);
	      } finally {
	        throw e;
	      }
	    } cleanupSubscription(subscription);
	    return value;
	  },
	  complete: function complete(value) {
	    var subscription = this._s;
	    if (!subscriptionClosed(subscription)) {
	      var observer = subscription._o;
	      subscription._o = undefined;
	      try {
	        var m = getMethod(observer.complete);
	        value = m ? m.call(observer, value) : undefined;
	      } catch (e) {
	        try {
	          cleanupSubscription(subscription);
	        } finally {
	          throw e;
	        }
	      } cleanupSubscription(subscription);
	      return value;
	    }
	  }
	});
	
	var $Observable = function Observable(subscriber) {
	  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
	};
	
	redefineAll($Observable.prototype, {
	  subscribe: function subscribe(observer) {
	    return new Subscription(observer, this._f);
	  },
	  forEach: function forEach(fn) {
	    var that = this;
	    return new (core.Promise || global.Promise)(function (resolve, reject) {
	      aFunction(fn);
	      var subscription = that.subscribe({
	        next: function (value) {
	          try {
	            return fn(value);
	          } catch (e) {
	            reject(e);
	            subscription.unsubscribe();
	          }
	        },
	        error: reject,
	        complete: resolve
	      });
	    });
	  }
	});
	
	redefineAll($Observable, {
	  from: function from(x) {
	    var C = typeof this === 'function' ? this : $Observable;
	    var method = getMethod(anObject(x)[OBSERVABLE]);
	    if (method) {
	      var observable = anObject(method.call(x));
	      return observable.constructor === C ? observable : new C(function (observer) {
	        return observable.subscribe(observer);
	      });
	    }
	    return new C(function (observer) {
	      var done = false;
	      microtask(function () {
	        if (!done) {
	          try {
	            if (forOf(x, false, function (it) {
	              observer.next(it);
	              if (done) return RETURN;
	            }) === RETURN) return;
	          } catch (e) {
	            if (done) throw e;
	            observer.error(e);
	            return;
	          } observer.complete();
	        }
	      });
	      return function () { done = true; };
	    });
	  },
	  of: function of() {
	    for (var i = 0, l = arguments.length, items = new Array(l); i < l;) items[i] = arguments[i++];
	    return new (typeof this === 'function' ? this : $Observable)(function (observer) {
	      var done = false;
	      microtask(function () {
	        if (!done) {
	          for (var j = 0; j < items.length; ++j) {
	            observer.next(items[j]);
	            if (done) return;
	          } observer.complete();
	        }
	      });
	      return function () { done = true; };
	    });
	  }
	});
	
	hide($Observable.prototype, OBSERVABLE, function () { return this; });
	
	$export($export.G, { Observable: $Observable });
	
	__webpack_require__(49)('Observable');


/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-promise-finally
	'use strict';
	var $export = __webpack_require__(1);
	var core = __webpack_require__(25);
	var global = __webpack_require__(4);
	var speciesConstructor = __webpack_require__(62);
	var promiseResolve = __webpack_require__(153);
	
	$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
	  var C = speciesConstructor(this, core.Promise || global.Promise);
	  var isFunction = typeof onFinally == 'function';
	  return this.then(
	    isFunction ? function (x) {
	      return promiseResolve(C, onFinally()).then(function () { return x; });
	    } : onFinally,
	    isFunction ? function (e) {
	      return promiseResolve(C, onFinally()).then(function () { throw e; });
	    } : onFinally
	  );
	} });


/***/ }),
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-promise-try
	var $export = __webpack_require__(1);
	var newPromiseCapability = __webpack_require__(102);
	var perform = __webpack_require__(152);
	
	$export($export.S, 'Promise', { 'try': function (callbackfn) {
	  var promiseCapability = newPromiseCapability.f(this);
	  var result = perform(callbackfn);
	  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
	  return promiseCapability.promise;
	} });


/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

	var metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var toMetaKey = metadata.key;
	var ordinaryDefineOwnMetadata = metadata.set;
	
	metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
	  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
	} });


/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

	var metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var toMetaKey = metadata.key;
	var getOrCreateMetadataMap = metadata.map;
	var store = metadata.store;
	
	metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
	  var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
	  var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
	  if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
	  if (metadataMap.size) return true;
	  var targetMetadata = store.get(target);
	  targetMetadata['delete'](targetKey);
	  return !!targetMetadata.size || store['delete'](target);
	} });


/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

	var Set = __webpack_require__(161);
	var from = __webpack_require__(129);
	var metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var getPrototypeOf = __webpack_require__(22);
	var ordinaryOwnMetadataKeys = metadata.keys;
	var toMetaKey = metadata.key;
	
	var ordinaryMetadataKeys = function (O, P) {
	  var oKeys = ordinaryOwnMetadataKeys(O, P);
	  var parent = getPrototypeOf(O);
	  if (parent === null) return oKeys;
	  var pKeys = ordinaryMetadataKeys(parent, P);
	  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
	};
	
	metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
	  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
	} });


/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

	var metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var getPrototypeOf = __webpack_require__(22);
	var ordinaryHasOwnMetadata = metadata.has;
	var ordinaryGetOwnMetadata = metadata.get;
	var toMetaKey = metadata.key;
	
	var ordinaryGetMetadata = function (MetadataKey, O, P) {
	  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
	  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
	  var parent = getPrototypeOf(O);
	  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
	};
	
	metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
	  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	} });


/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

	var metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var ordinaryOwnMetadataKeys = metadata.keys;
	var toMetaKey = metadata.key;
	
	metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
	  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
	} });


/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {

	var metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var ordinaryGetOwnMetadata = metadata.get;
	var toMetaKey = metadata.key;
	
	metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
	  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
	    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	} });


/***/ }),
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

	var metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var getPrototypeOf = __webpack_require__(22);
	var ordinaryHasOwnMetadata = metadata.has;
	var toMetaKey = metadata.key;
	
	var ordinaryHasMetadata = function (MetadataKey, O, P) {
	  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
	  if (hasOwn) return true;
	  var parent = getPrototypeOf(O);
	  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
	};
	
	metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
	  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	} });


/***/ }),
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

	var metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var ordinaryHasOwnMetadata = metadata.has;
	var toMetaKey = metadata.key;
	
	metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
	  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
	    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
	} });


/***/ }),
/* 361 */
/***/ (function(module, exports, __webpack_require__) {

	var $metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var aFunction = __webpack_require__(13);
	var toMetaKey = $metadata.key;
	var ordinaryDefineOwnMetadata = $metadata.set;
	
	$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
	  return function decorator(target, targetKey) {
	    ordinaryDefineOwnMetadata(
	      metadataKey, metadataValue,
	      (targetKey !== undefined ? anObject : aFunction)(target),
	      toMetaKey(targetKey)
	    );
	  };
	} });


/***/ }),
/* 362 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
	__webpack_require__(75)('Set');


/***/ }),
/* 363 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
	__webpack_require__(76)('Set');


/***/ }),
/* 364 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export = __webpack_require__(1);
	
	$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(133)('Set') });


/***/ }),
/* 365 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/mathiasbynens/String.prototype.at
	var $export = __webpack_require__(1);
	var $at = __webpack_require__(78)(true);
	
	$export($export.P, 'String', {
	  at: function at(pos) {
	    return $at(this, pos);
	  }
	});


/***/ }),
/* 366 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/String.prototype.matchAll/
	var $export = __webpack_require__(1);
	var defined = __webpack_require__(31);
	var toLength = __webpack_require__(8);
	var isRegExp = __webpack_require__(70);
	var getFlags = __webpack_require__(59);
	var RegExpProto = RegExp.prototype;
	
	var $RegExpStringIterator = function (regexp, string) {
	  this._r = regexp;
	  this._s = string;
	};
	
	__webpack_require__(97)($RegExpStringIterator, 'RegExp String', function next() {
	  var match = this._r.exec(this._s);
	  return { value: match, done: match === null };
	});
	
	$export($export.P, 'String', {
	  matchAll: function matchAll(regexp) {
	    defined(this);
	    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
	    var S = String(this);
	    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
	    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
	    rx.lastIndex = toLength(regexp.lastIndex);
	    return new $RegExpStringIterator(rx, S);
	  }
	});


/***/ }),
/* 367 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(1);
	var $pad = __webpack_require__(155);
	var userAgent = __webpack_require__(80);
	
	// https://github.com/zloirock/core-js/issues/280
	$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
	  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
	  }
	});


/***/ }),
/* 368 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(1);
	var $pad = __webpack_require__(155);
	var userAgent = __webpack_require__(80);
	
	// https://github.com/zloirock/core-js/issues/280
	$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
	  padStart: function padStart(maxLength /* , fillString = ' ' */) {
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
	  }
	});


/***/ }),
/* 369 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
	__webpack_require__(55)('trimLeft', function ($trim) {
	  return function trimLeft() {
	    return $trim(this, 1);
	  };
	}, 'trimStart');


/***/ }),
/* 370 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
	__webpack_require__(55)('trimRight', function ($trim) {
	  return function trimRight() {
	    return $trim(this, 2);
	  };
	}, 'trimEnd');


/***/ }),
/* 371 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(111)('asyncIterator');


/***/ }),
/* 372 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(111)('observable');


/***/ }),
/* 373 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-global
	var $export = __webpack_require__(1);
	
	$export($export.S, 'System', { global: __webpack_require__(4) });


/***/ }),
/* 374 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
	__webpack_require__(75)('WeakMap');


/***/ }),
/* 375 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
	__webpack_require__(76)('WeakMap');


/***/ }),
/* 376 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
	__webpack_require__(75)('WeakSet');


/***/ }),
/* 377 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
	__webpack_require__(76)('WeakSet');


/***/ }),
/* 378 */
/***/ (function(module, exports, __webpack_require__) {

	var $iterators = __webpack_require__(113);
	var getKeys = __webpack_require__(46);
	var redefine = __webpack_require__(18);
	var global = __webpack_require__(4);
	var hide = __webpack_require__(17);
	var Iterators = __webpack_require__(53);
	var wks = __webpack_require__(7);
	var ITERATOR = wks('iterator');
	var TO_STRING_TAG = wks('toStringTag');
	var ArrayValues = Iterators.Array;
	
	var DOMIterables = {
	  CSSRuleList: true, // TODO: Not spec compliant, should be false.
	  CSSStyleDeclaration: false,
	  CSSValueList: false,
	  ClientRectList: false,
	  DOMRectList: false,
	  DOMStringList: false,
	  DOMTokenList: true,
	  DataTransferItemList: false,
	  FileList: false,
	  HTMLAllCollection: false,
	  HTMLCollection: false,
	  HTMLFormElement: false,
	  HTMLSelectElement: false,
	  MediaList: true, // TODO: Not spec compliant, should be false.
	  MimeTypeArray: false,
	  NamedNodeMap: false,
	  NodeList: true,
	  PaintRequestList: false,
	  Plugin: false,
	  PluginArray: false,
	  SVGLengthList: false,
	  SVGNumberList: false,
	  SVGPathSegList: false,
	  SVGPointList: false,
	  SVGStringList: false,
	  SVGTransformList: false,
	  SourceBufferList: false,
	  StyleSheetList: true, // TODO: Not spec compliant, should be false.
	  TextTrackCueList: false,
	  TextTrackList: false,
	  TouchList: false
	};
	
	for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
	  var NAME = collections[i];
	  var explicit = DOMIterables[NAME];
	  var Collection = global[NAME];
	  var proto = Collection && Collection.prototype;
	  var key;
	  if (proto) {
	    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
	    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
	    Iterators[NAME] = ArrayValues;
	    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
	  }
	}


/***/ }),
/* 379 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var $task = __webpack_require__(109);
	$export($export.G + $export.B, {
	  setImmediate: $task.set,
	  clearImmediate: $task.clear
	});


/***/ }),
/* 380 */
/***/ (function(module, exports, __webpack_require__) {

	// ie9- setTimeout & setInterval additional parameters fix
	var global = __webpack_require__(4);
	var $export = __webpack_require__(1);
	var userAgent = __webpack_require__(80);
	var slice = [].slice;
	var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
	var wrap = function (set) {
	  return function (fn, time /* , ...args */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice.call(arguments, 2) : false;
	    return set(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
	    } : fn, time);
	  };
	};
	$export($export.G + $export.B + $export.F * MSIE, {
	  setTimeout: wrap(global.setTimeout),
	  setInterval: wrap(global.setInterval)
	});


/***/ }),
/* 381 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(309);
	__webpack_require__(248);
	__webpack_require__(250);
	__webpack_require__(249);
	__webpack_require__(252);
	__webpack_require__(254);
	__webpack_require__(259);
	__webpack_require__(253);
	__webpack_require__(251);
	__webpack_require__(261);
	__webpack_require__(260);
	__webpack_require__(256);
	__webpack_require__(257);
	__webpack_require__(255);
	__webpack_require__(247);
	__webpack_require__(258);
	__webpack_require__(262);
	__webpack_require__(263);
	__webpack_require__(215);
	__webpack_require__(217);
	__webpack_require__(216);
	__webpack_require__(265);
	__webpack_require__(264);
	__webpack_require__(235);
	__webpack_require__(245);
	__webpack_require__(246);
	__webpack_require__(236);
	__webpack_require__(237);
	__webpack_require__(238);
	__webpack_require__(239);
	__webpack_require__(240);
	__webpack_require__(241);
	__webpack_require__(242);
	__webpack_require__(243);
	__webpack_require__(244);
	__webpack_require__(218);
	__webpack_require__(219);
	__webpack_require__(220);
	__webpack_require__(221);
	__webpack_require__(222);
	__webpack_require__(223);
	__webpack_require__(224);
	__webpack_require__(225);
	__webpack_require__(226);
	__webpack_require__(227);
	__webpack_require__(228);
	__webpack_require__(229);
	__webpack_require__(230);
	__webpack_require__(231);
	__webpack_require__(232);
	__webpack_require__(233);
	__webpack_require__(234);
	__webpack_require__(296);
	__webpack_require__(301);
	__webpack_require__(308);
	__webpack_require__(299);
	__webpack_require__(291);
	__webpack_require__(292);
	__webpack_require__(297);
	__webpack_require__(302);
	__webpack_require__(304);
	__webpack_require__(287);
	__webpack_require__(288);
	__webpack_require__(289);
	__webpack_require__(290);
	__webpack_require__(293);
	__webpack_require__(294);
	__webpack_require__(295);
	__webpack_require__(298);
	__webpack_require__(300);
	__webpack_require__(303);
	__webpack_require__(305);
	__webpack_require__(306);
	__webpack_require__(307);
	__webpack_require__(210);
	__webpack_require__(212);
	__webpack_require__(211);
	__webpack_require__(214);
	__webpack_require__(213);
	__webpack_require__(199);
	__webpack_require__(197);
	__webpack_require__(203);
	__webpack_require__(200);
	__webpack_require__(206);
	__webpack_require__(208);
	__webpack_require__(196);
	__webpack_require__(202);
	__webpack_require__(193);
	__webpack_require__(207);
	__webpack_require__(191);
	__webpack_require__(205);
	__webpack_require__(204);
	__webpack_require__(198);
	__webpack_require__(201);
	__webpack_require__(190);
	__webpack_require__(192);
	__webpack_require__(195);
	__webpack_require__(194);
	__webpack_require__(209);
	__webpack_require__(113);
	__webpack_require__(281);
	__webpack_require__(159);
	__webpack_require__(286);
	__webpack_require__(160);
	__webpack_require__(282);
	__webpack_require__(283);
	__webpack_require__(284);
	__webpack_require__(285);
	__webpack_require__(266);
	__webpack_require__(158);
	__webpack_require__(161);
	__webpack_require__(162);
	__webpack_require__(321);
	__webpack_require__(310);
	__webpack_require__(311);
	__webpack_require__(316);
	__webpack_require__(319);
	__webpack_require__(320);
	__webpack_require__(314);
	__webpack_require__(317);
	__webpack_require__(315);
	__webpack_require__(318);
	__webpack_require__(312);
	__webpack_require__(313);
	__webpack_require__(267);
	__webpack_require__(268);
	__webpack_require__(269);
	__webpack_require__(270);
	__webpack_require__(271);
	__webpack_require__(274);
	__webpack_require__(272);
	__webpack_require__(273);
	__webpack_require__(275);
	__webpack_require__(276);
	__webpack_require__(277);
	__webpack_require__(278);
	__webpack_require__(280);
	__webpack_require__(279);
	__webpack_require__(324);
	__webpack_require__(322);
	__webpack_require__(323);
	__webpack_require__(365);
	__webpack_require__(368);
	__webpack_require__(367);
	__webpack_require__(369);
	__webpack_require__(370);
	__webpack_require__(366);
	__webpack_require__(371);
	__webpack_require__(372);
	__webpack_require__(346);
	__webpack_require__(349);
	__webpack_require__(345);
	__webpack_require__(343);
	__webpack_require__(344);
	__webpack_require__(347);
	__webpack_require__(348);
	__webpack_require__(330);
	__webpack_require__(364);
	__webpack_require__(329);
	__webpack_require__(363);
	__webpack_require__(375);
	__webpack_require__(377);
	__webpack_require__(328);
	__webpack_require__(362);
	__webpack_require__(374);
	__webpack_require__(376);
	__webpack_require__(327);
	__webpack_require__(373);
	__webpack_require__(326);
	__webpack_require__(331);
	__webpack_require__(332);
	__webpack_require__(333);
	__webpack_require__(334);
	__webpack_require__(335);
	__webpack_require__(337);
	__webpack_require__(336);
	__webpack_require__(338);
	__webpack_require__(339);
	__webpack_require__(340);
	__webpack_require__(342);
	__webpack_require__(341);
	__webpack_require__(351);
	__webpack_require__(352);
	__webpack_require__(353);
	__webpack_require__(354);
	__webpack_require__(356);
	__webpack_require__(355);
	__webpack_require__(358);
	__webpack_require__(357);
	__webpack_require__(359);
	__webpack_require__(360);
	__webpack_require__(361);
	__webpack_require__(325);
	__webpack_require__(350);
	__webpack_require__(380);
	__webpack_require__(379);
	__webpack_require__(378);
	module.exports = __webpack_require__(25);


/***/ }),
/* 382 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(383)
	var ieee754 = __webpack_require__(385)
	var isArray = __webpack_require__(388)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()
	
	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }
	
	  return that
	}
	
	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */
	
	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}
	
	Buffer.poolSize = 8192 // not used by this implementation
	
	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}
	
	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }
	
	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }
	
	  return fromObject(that, value)
	}
	
	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}
	
	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}
	
	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}
	
	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}
	
	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }
	
	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }
	
	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)
	
	  var actual = that.write(string, encoding)
	
	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }
	
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer
	
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }
	
	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }
	
	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }
	
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}
	
	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)
	
	    if (that.length === 0) {
	      return that
	    }
	
	    obj.copy(that, 0, 0, len)
	    return that
	  }
	
	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }
	
	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }
	
	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }
	
	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }
	
	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}
	
	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.
	
	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }
	
	  if (end === undefined || end > this.length) {
	    end = this.length
	  }
	
	  if (end <= 0) {
	    return ''
	  }
	
	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0
	
	  if (end <= start) {
	    return ''
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true
	
	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}
	
	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}
	
	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}
	
	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }
	
	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }
	
	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }
	
	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }
	
	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0
	
	  if (this === target) return 0
	
	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)
	
	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)
	
	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1
	
	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }
	
	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }
	
	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }
	
	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length
	
	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }
	
	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }
	
	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }
	
	  return -1
	}
	
	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}
	
	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }
	
	  return len
	}
	
	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }
	
	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }
	
	  if (end <= start) {
	    return this
	  }
	
	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0
	
	  if (!val) val = 0
	
	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 383 */
/***/ (function(module, exports) {

	'use strict'
	
	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}
	
	// Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications
	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63
	
	function getLens (b64) {
	  var len = b64.length
	
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // Trim off extra bytes after placeholder bytes are found
	  // See: https://github.com/beatgammit/base64-js/issues/42
	  var validLen = b64.indexOf('=')
	  if (validLen === -1) validLen = len
	
	  var placeHoldersLen = validLen === len
	    ? 0
	    : 4 - (validLen % 4)
	
	  return [validLen, placeHoldersLen]
	}
	
	// base64 is 4/3 + up to two characters of the original data
	function byteLength (b64) {
	  var lens = getLens(b64)
	  var validLen = lens[0]
	  var placeHoldersLen = lens[1]
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}
	
	function _byteLength (b64, validLen, placeHoldersLen) {
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}
	
	function toByteArray (b64) {
	  var tmp
	  var lens = getLens(b64)
	  var validLen = lens[0]
	  var placeHoldersLen = lens[1]
	
	  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))
	
	  var curByte = 0
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  var len = placeHoldersLen > 0
	    ? validLen - 4
	    : validLen
	
	  for (var i = 0; i < len; i += 4) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 18) |
	      (revLookup[b64.charCodeAt(i + 1)] << 12) |
	      (revLookup[b64.charCodeAt(i + 2)] << 6) |
	      revLookup[b64.charCodeAt(i + 3)]
	    arr[curByte++] = (tmp >> 16) & 0xFF
	    arr[curByte++] = (tmp >> 8) & 0xFF
	    arr[curByte++] = tmp & 0xFF
	  }
	
	  if (placeHoldersLen === 2) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 2) |
	      (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[curByte++] = tmp & 0xFF
	  }
	
	  if (placeHoldersLen === 1) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 10) |
	      (revLookup[b64.charCodeAt(i + 1)] << 4) |
	      (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[curByte++] = (tmp >> 8) & 0xFF
	    arr[curByte++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] +
	    lookup[num >> 12 & 0x3F] +
	    lookup[num >> 6 & 0x3F] +
	    lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp =
	      ((uint8[i] << 16) & 0xFF0000) +
	      ((uint8[i + 1] << 8) & 0xFF00) +
	      (uint8[i + 2] & 0xFF)
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(
	      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
	    ))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    parts.push(
	      lookup[tmp >> 2] +
	      lookup[(tmp << 4) & 0x3F] +
	      '=='
	    )
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
	    parts.push(
	      lookup[tmp >> 10] +
	      lookup[(tmp >> 4) & 0x3F] +
	      lookup[(tmp << 2) & 0x3F] +
	      '='
	    )
	  }
	
	  return parts.join('')
	}


/***/ }),
/* 384 */
/***/ (function(module, exports) {

	/*
	License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
	*/
	/*jslint
	    evil: true,
	    node: true
	*/
	'use strict';
	/**
	 * Clones non native JavaScript functions, or references native functions.
	 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
	 * @param {Function} func The function to clone.
	 * @returns {Function} Returns a clone of the non native function, or a
	 *  reference to the native function.
	 */
	function cloneFunction(func) {
	    var out, str;
	    try {
	        str = func.toString();
	        if (/\[native code\]/.test(str)) {
	            out = func;
	        } else {
	            out = eval('(function(){return ' + str + '}());');
	        }
	    } catch (e) {
	        throw new Error(e.message + '\r\n\r\n' + str);
	    }
	    return out;
	}
	module.exports = cloneFunction;

/***/ }),
/* 385 */
/***/ (function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = (nBytes * 8) - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = (nBytes * 8) - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = ((value * c) - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ }),
/* 386 */,
/* 387 */,
/* 388 */
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ }),
/* 389 */
/***/ (function(module, exports) {

	/**
	 * Executes a function on each of an objects own enumerable properties. The
	 *  callback function will receive three arguments: the value of the current
	 *  property, the name of the property, and the object being processed. This is
	 *  roughly equivalent to the signature for callbacks to
	 *  Array.prototype.forEach.
	 * @param {Object} obj The object to act on.
	 * @param {Function} callback The function to execute.
	 * @returns {Object} Returns the given object.
	 */
	function objectForeach(obj, callback) {
	    "use strict";
	    Object.keys(obj).forEach(function (prop) {
	        callback(obj[prop], prop, obj);
	    });
	    return obj;
	};
	module.exports = objectForeach;

/***/ }),
/* 390 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
	*/
	/*jslint
	    white: true,
	    vars: true,
	    node: true
	*/
	function ObjectMergeOptions(opts) {
	    'use strict';
	    opts = opts || {};
	    this.depth = opts.depth || false;
	    // circular ref check is true unless explicitly set to false
	    // ignore the jslint warning here, it's pointless.
	    this.throwOnCircularRef = 'throwOnCircularRef' in opts && opts.throwOnCircularRef === false ? false : true;
	}
	/*jslint unparam:true*/
	/**
	 * Creates a new options object suitable for use with objectMerge.
	 * @memberOf objectMerge
	 * @param {Object} [opts] An object specifying the options.
	 * @param {Object} [opts.depth = false] Specifies the depth to traverse objects
	 *  during merging. If this is set to false then there will be no depth limit.
	 * @param {Object} [opts.throwOnCircularRef = true] Set to false to suppress
	 *  errors on circular references.
	 * @returns {ObjectMergeOptions} Returns an instance of ObjectMergeOptions
	 *  to be used with objectMerge.
	 * @example
	 *  var opts = objectMerge.createOptions({
	 *      depth : 2,
	 *      throwOnCircularRef : false
	 *  });
	 *  var obj1 = {
	 *      a1 : {
	 *          a2 : {
	 *              a3 : {}
	 *          }
	 *      }
	 *  };
	 *  var obj2 = {
	 *      a1 : {
	 *          a2 : {
	 *              a3 : 'will not be in output'
	 *          },
	 *          a22 : {}
	 *      }
	 *  };
	 *  objectMerge(opts, obj1, obj2);
	 */
	function createOptions(opts) {
	    'use strict';
	    var argz = Array.prototype.slice.call(arguments, 0);
	    argz.unshift(null);
	    var F = ObjectMergeOptions.bind.apply(ObjectMergeOptions, argz);
	    return new F();
	}
	/*jslint unparam:false*/
	/**
	 * Merges JavaScript objects recursively without altering the objects merged.
	 * @namespace Merges JavaScript objects recursively without altering the objects merged.
	 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
	 * @param {ObjectMergeOptions} [opts] An options object created by 
	 *  objectMerge.createOptions. Options must be specified as the first argument
	 *  and must be an object created with createOptions or else the object will
	 *  not be recognized as an options object and will be merged instead.
	 * @param {Object} shadows [[shadows]...] One or more objects to merge. Each
	 *  argument given will be treated as an object to merge. Each object
	 *  overwrites the previous objects descendant properties if the property name
	 *  matches. If objects properties are objects they will be merged recursively
	 *  as well.
	 * @returns {Object} Returns a single merged object composed from clones of the
	 *  input objects.
	 * @example
	 *  var objectMerge = require('object-merge');
	 *  var x = {
	 *      a : 'a',
	 *      b : 'b',
	 *      c : {
	 *          d : 'd',
	 *          e : 'e',
	 *          f : {
	 *              g : 'g'
	 *          }
	 *      }
	 *  };
	 *  var y = {
	 *      a : '`a',
	 *      b : '`b',
	 *      c : {
	 *          d : '`d'
	 *      }
	 *  };
	 *  var z = {
	 *      a : {
	 *          b : '``b'
	 *      },
	 *      fun : function foo () {
	 *          return 'foo';
	 *      },
	 *      aps : Array.prototype.slice
	 *  };
	 *  var out = objectMerge(x, y, z);
	 *  // out.a will be {
	 *  //         b : '``b'
	 *  //     }
	 *  // out.b will be '`b'
	 *  // out.c will be {
	 *  //         d : '`d',
	 *  //         e : 'e',
	 *  //         f : {
	 *  //             g : 'g'
	 *  //         }
	 *  //     }
	 *  // out.fun will be a clone of z.fun
	 *  // out.aps will be equal to z.aps
	 */
	function objectMerge(shadows) {
	    'use strict';
	    var objectForeach = __webpack_require__(389);
	    var cloneFunction = __webpack_require__(384);
	    // this is the queue of visited objects / properties.
	    var visited = [];
	    // various merge options
	    var options = {};
	    // gets the sequential trailing objects from array.
	    function getShadowObjects(shadows) {
	        var out = shadows.reduce(function (collector, shadow) {
	                if (shadow instanceof Object) {
	                    collector.push(shadow);
	                } else {
	                    collector = [];
	                }
	                return collector;
	            }, []);
	        return out;
	    }
	    // gets either a new object of the proper type or the last primitive value
	    function getOutputObject(shadows) {
	        var out;
	        var lastShadow = shadows[shadows.length - 1];
	        if (lastShadow instanceof Array) {
	            out = [];
	        } else if (lastShadow instanceof Function) {
	            try {
	                out = cloneFunction(lastShadow);
	            } catch (e) {
	                throw new Error(e.message);
	            }
	        } else if (lastShadow instanceof Object) {
	            out = {};
	        } else {
	            // lastShadow is a primitive value;
	            out = lastShadow;
	        }
	        return out;
	    }
	    // checks for circular references
	    function circularReferenceCheck(shadows) {
	        // if any of the current objects to process exist in the queue
	        // then throw an error.
	        shadows.forEach(function (item) {
	            if (item instanceof Object && visited.indexOf(item) > -1) {
	                throw new Error('Circular reference error');
	            }
	        });
	        // if none of the current objects were in the queue
	        // then add references to the queue.
	        visited = visited.concat(shadows);
	    }
	    function objectMergeRecursor(shadows, currentDepth) {
	        if (options.depth !== false) {
	            currentDepth = currentDepth ? currentDepth + 1 : 1;
	        } else {
	            currentDepth = 0;
	        }
	        if (options.throwOnCircularRef === true) {
	            circularReferenceCheck(shadows);
	        }
	        var out = getOutputObject(shadows);
	        /*jslint unparam: true */
	        function shadowHandler(val, prop, shadow) {
	            if (out[prop]) {
	                out[prop] = objectMergeRecursor([
	                    out[prop],
	                    shadow[prop]
	                ], currentDepth);
	            } else {
	                out[prop] = objectMergeRecursor([shadow[prop]], currentDepth);
	            }
	        }
	        /*jslint unparam:false */
	        function shadowMerger(shadow) {
	            objectForeach(shadow, shadowHandler);
	        }
	        // short circuits case where output would be a primitive value
	        // anyway.
	        if (out instanceof Object && currentDepth <= options.depth) {
	            // only merges trailing objects since primitives would wipe out
	            // previous objects, as in merging {a:'a'}, 'a', and {b:'b'}
	            // would result in {b:'b'} so the first two arguments
	            // can be ignored completely.
	            var relevantShadows = getShadowObjects(shadows);
	            relevantShadows.forEach(shadowMerger);
	        }
	        return out;
	    }
	    // determines whether an options object was passed in and
	    // uses it if present
	    // ignore the jslint warning here too.
	    if (arguments[0] instanceof ObjectMergeOptions) {
	        options = arguments[0];
	        shadows = Array.prototype.slice.call(arguments, 1);
	    } else {
	        options = createOptions();
	        shadows = Array.prototype.slice.call(arguments, 0);
	    }
	    return objectMergeRecursor(shadows);
	}
	objectMerge.createOptions = createOptions;
	module.exports = objectMerge;

/***/ }),
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */
	
	!(function(global) {
	  "use strict";
	
	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	
	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }
	
	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};
	
	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);
	
	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);
	
	    return generator;
	  }
	  runtime.wrap = wrap;
	
	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }
	
	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";
	
	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};
	
	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}
	
	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };
	
	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }
	
	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";
	
	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }
	
	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };
	
	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };
	
	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  runtime.awrap = function(arg) {
	    return { __await: arg };
	  };
	
	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }
	
	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }
	
	    if (typeof global.process === "object" && global.process.domain) {
	      invoke = global.process.domain.bind(invoke);
	    }
	
	    var previousPromise;
	
	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }
	
	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }
	
	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }
	
	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  runtime.AsyncIterator = AsyncIterator;
	
	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );
	
	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };
	
	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;
	
	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }
	
	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }
	
	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }
	
	      context.method = method;
	      context.arg = arg;
	
	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }
	
	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;
	
	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }
	
	          context.dispatchException(context.arg);
	
	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }
	
	        state = GenStateExecuting;
	
	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;
	
	          if (record.arg === ContinueSentinel) {
	            continue;
	          }
	
	          return {
	            value: record.arg,
	            done: context.done
	          };
	
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }
	
	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;
	
	      if (context.method === "throw") {
	        if (delegate.iterator.return) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined;
	          maybeInvokeDelegate(delegate, context);
	
	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }
	
	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }
	
	      return ContinueSentinel;
	    }
	
	    var record = tryCatch(method, delegate.iterator, context.arg);
	
	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }
	
	    var info = record.arg;
	
	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }
	
	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;
	
	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;
	
	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined;
	      }
	
	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }
	
	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }
	
	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);
	
	  Gp[toStringTagSymbol] = "Generator";
	
	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };
	
	  Gp.toString = function() {
	    return "[object Generator]";
	  };
	
	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };
	
	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }
	
	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }
	
	    this.tryEntries.push(entry);
	  }
	
	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }
	
	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }
	
	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();
	
	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }
	
	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };
	
	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }
	
	      if (typeof iterable.next === "function") {
	        return iterable;
	      }
	
	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }
	
	          next.value = undefined;
	          next.done = true;
	
	          return next;
	        };
	
	        return next.next = next;
	      }
	    }
	
	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;
	
	  function doneResult() {
	    return { value: undefined, done: true };
	  }
	
	  Context.prototype = {
	    constructor: Context,
	
	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;
	
	      this.method = "next";
	      this.arg = undefined;
	
	      this.tryEntries.forEach(resetTryEntry);
	
	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },
	
	    stop: function() {
	      this.done = true;
	
	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }
	
	      return this.rval;
	    },
	
	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }
	
	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	
	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined;
	        }
	
	        return !! caught;
	      }
	
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;
	
	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }
	
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");
	
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },
	
	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }
	
	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }
	
	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;
	
	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }
	
	      return this.complete(record);
	    },
	
	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }
	
	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	
	      return ContinueSentinel;
	    },
	
	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },
	
	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }
	
	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },
	
	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };
	
	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined;
	      }
	
	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this
	);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ })
/******/ ]);
//# sourceMappingURL=projectmap.js.map