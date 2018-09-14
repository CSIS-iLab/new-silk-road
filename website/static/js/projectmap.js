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
	
	__webpack_require__(178);
	
	__webpack_require__(120);
	
	var _mapboxGl = __webpack_require__(164);
	
	var _mapboxGl2 = _interopRequireDefault(_mapboxGl);
	
	var _GeoStyles = __webpack_require__(175);
	
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

	var store = __webpack_require__(75)('wks');
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

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(5)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(3);
	var IE8_DOM_DEFINE = __webpack_require__(132);
	var toPrimitive = __webpack_require__(33);
	var dP = Object.defineProperty;
	
	exports.f = __webpack_require__(8) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(32);
	var min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(30);
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

	var dP = __webpack_require__(9);
	var createDesc = __webpack_require__(47);
	module.exports = __webpack_require__(8) ? function (object, key, value) {
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
	var defined = __webpack_require__(30);
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

	var pIE = __webpack_require__(60);
	var createDesc = __webpack_require__(47);
	var toIObject = __webpack_require__(23);
	var toPrimitive = __webpack_require__(33);
	var has = __webpack_require__(20);
	var IE8_DOM_DEFINE = __webpack_require__(132);
	var gOPD = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(8) ? gOPD : function getOwnPropertyDescriptor(O, P) {
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
	var IE_PROTO = __webpack_require__(101)('IE_PROTO');
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
	var IObject = __webpack_require__(59);
	var defined = __webpack_require__(30);
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

	var core = module.exports = { version: '2.5.7' };
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
/* 28 */,
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx = __webpack_require__(26);
	var IObject = __webpack_require__(59);
	var toObject = __webpack_require__(11);
	var toLength = __webpack_require__(10);
	var asc = __webpack_require__(86);
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
/* 30 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ }),
/* 31 */
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
/* 32 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
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

	var Map = __webpack_require__(153);
	var $export = __webpack_require__(1);
	var shared = __webpack_require__(75)('metadata');
	var store = shared.store || (shared.store = new (__webpack_require__(156))());
	
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
	if (__webpack_require__(8)) {
	  var LIBRARY = __webpack_require__(39);
	  var global = __webpack_require__(4);
	  var fails = __webpack_require__(5);
	  var $export = __webpack_require__(1);
	  var $typed = __webpack_require__(77);
	  var $buffer = __webpack_require__(107);
	  var ctx = __webpack_require__(26);
	  var anInstance = __webpack_require__(42);
	  var propertyDesc = __webpack_require__(47);
	  var hide = __webpack_require__(17);
	  var redefineAll = __webpack_require__(48);
	  var toInteger = __webpack_require__(32);
	  var toLength = __webpack_require__(10);
	  var toIndex = __webpack_require__(151);
	  var toAbsoluteIndex = __webpack_require__(50);
	  var toPrimitive = __webpack_require__(33);
	  var has = __webpack_require__(20);
	  var classof = __webpack_require__(58);
	  var isObject = __webpack_require__(6);
	  var toObject = __webpack_require__(11);
	  var isArrayIter = __webpack_require__(93);
	  var create = __webpack_require__(44);
	  var getPrototypeOf = __webpack_require__(22);
	  var gOPN = __webpack_require__(45).f;
	  var getIterFn = __webpack_require__(109);
	  var uid = __webpack_require__(51);
	  var wks = __webpack_require__(7);
	  var createArrayMethod = __webpack_require__(29);
	  var createArrayIncludes = __webpack_require__(64);
	  var speciesConstructor = __webpack_require__(76);
	  var ArrayIterators = __webpack_require__(110);
	  var Iterators = __webpack_require__(52);
	  var $iterDetect = __webpack_require__(70);
	  var setSpecies = __webpack_require__(49);
	  var arrayFill = __webpack_require__(85);
	  var arrayCopyWithin = __webpack_require__(124);
	  var $DP = __webpack_require__(9);
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
	var setDesc = __webpack_require__(9).f;
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
	var call = __webpack_require__(135);
	var isArrayIter = __webpack_require__(93);
	var anObject = __webpack_require__(3);
	var toLength = __webpack_require__(10);
	var getIterFn = __webpack_require__(109);
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
	var dPs = __webpack_require__(141);
	var enumBugKeys = __webpack_require__(89);
	var IE_PROTO = __webpack_require__(101)('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(88)('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(91).appendChild(iframe);
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
	var $keys = __webpack_require__(143);
	var hiddenKeys = __webpack_require__(89).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(143);
	var enumBugKeys = __webpack_require__(89);
	
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
	var dP = __webpack_require__(9);
	var DESCRIPTORS = __webpack_require__(8);
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

	var toInteger = __webpack_require__(32);
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
/***/ (function(module, exports) {

	module.exports = {};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(9).f;
	var has = __webpack_require__(20);
	var TAG = __webpack_require__(7)('toStringTag');
	
	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var defined = __webpack_require__(30);
	var fails = __webpack_require__(5);
	var spaces = __webpack_require__(105);
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
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);
	module.exports = function (it, TYPE) {
	  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
	  return it;
	};


/***/ }),
/* 56 */,
/* 57 */,
/* 58 */
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
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(24);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ }),
/* 60 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(23);
	var toLength = __webpack_require__(10);
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
/* 65 */
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
	var $iterDetect = __webpack_require__(70);
	var setToStringTag = __webpack_require__(53);
	var inheritIfRequired = __webpack_require__(92);
	
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
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var hide = __webpack_require__(17);
	var redefine = __webpack_require__(18);
	var fails = __webpack_require__(5);
	var defined = __webpack_require__(30);
	var wks = __webpack_require__(7);
	
	module.exports = function (KEY, length, exec) {
	  var SYMBOL = wks(KEY);
	  var fns = exec(defined, SYMBOL, ''[KEY]);
	  var strfn = fns[0];
	  var rxfn = fns[1];
	  if (fails(function () {
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  })) {
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
/* 67 */
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
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(24);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};


/***/ }),
/* 69 */
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
/* 70 */
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
/* 71 */
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
/* 72 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 73 */
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
/* 74 */
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
/* 75 */
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
/* 76 */
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
/* 77 */
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
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var navigator = global.navigator;
	
	module.exports = navigator && navigator.userAgent || '';


/***/ }),
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	'use strict';
	var toObject = __webpack_require__(11);
	var toAbsoluteIndex = __webpack_require__(50);
	var toLength = __webpack_require__(10);
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
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var speciesConstructor = __webpack_require__(180);
	
	module.exports = function (original, length) {
	  return new (speciesConstructor(original))(length);
	};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(9);
	var createDesc = __webpack_require__(47);
	
	module.exports = function (object, index, value) {
	  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);
	var document = __webpack_require__(4).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ }),
/* 89 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ }),
/* 90 */
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
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	var document = __webpack_require__(4).document;
	module.exports = document && document.documentElement;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);
	var setPrototypeOf = __webpack_require__(100).set;
	module.exports = function (that, target, C) {
	  var S = target.constructor;
	  var P;
	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
	    setPrototypeOf(that, P);
	  } return that;
	};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators = __webpack_require__(52);
	var ITERATOR = __webpack_require__(7)('iterator');
	var ArrayProto = Array.prototype;
	
	module.exports = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create = __webpack_require__(44);
	var descriptor = __webpack_require__(47);
	var setToStringTag = __webpack_require__(53);
	var IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(17)(IteratorPrototype, __webpack_require__(7)('iterator'), function () { return this; });
	
	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(39);
	var $export = __webpack_require__(1);
	var redefine = __webpack_require__(18);
	var hide = __webpack_require__(17);
	var Iterators = __webpack_require__(52);
	var $iterCreate = __webpack_require__(94);
	var setToStringTag = __webpack_require__(53);
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
/* 96 */
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
/* 97 */
/***/ (function(module, exports) {

	// 20.2.2.28 Math.sign(x)
	module.exports = Math.sign || function sign(x) {
	  // eslint-disable-next-line no-self-compare
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var macrotask = __webpack_require__(106).set;
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
/* 99 */
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
/* 100 */
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
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(75)('keys');
	var uid = __webpack_require__(51);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(32);
	var defined = __webpack_require__(30);
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
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	// helper for String#{startsWith, endsWith, includes}
	var isRegExp = __webpack_require__(69);
	var defined = __webpack_require__(30);
	
	module.exports = function (that, searchString, NAME) {
	  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
	  return String(defined(that));
	};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var toInteger = __webpack_require__(32);
	var defined = __webpack_require__(30);
	
	module.exports = function repeat(count) {
	  var str = String(defined(this));
	  var res = '';
	  var n = toInteger(count);
	  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
	  return res;
	};


/***/ }),
/* 105 */
/***/ (function(module, exports) {

	module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx = __webpack_require__(26);
	var invoke = __webpack_require__(133);
	var html = __webpack_require__(91);
	var cel = __webpack_require__(88);
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
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global = __webpack_require__(4);
	var DESCRIPTORS = __webpack_require__(8);
	var LIBRARY = __webpack_require__(39);
	var $typed = __webpack_require__(77);
	var hide = __webpack_require__(17);
	var redefineAll = __webpack_require__(48);
	var fails = __webpack_require__(5);
	var anInstance = __webpack_require__(42);
	var toInteger = __webpack_require__(32);
	var toLength = __webpack_require__(10);
	var toIndex = __webpack_require__(151);
	var gOPN = __webpack_require__(45).f;
	var dP = __webpack_require__(9).f;
	var arrayFill = __webpack_require__(85);
	var setToStringTag = __webpack_require__(53);
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
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var core = __webpack_require__(25);
	var LIBRARY = __webpack_require__(39);
	var wksExt = __webpack_require__(152);
	var defineProperty = __webpack_require__(9).f;
	module.exports = function (name) {
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
	};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	var classof = __webpack_require__(58);
	var ITERATOR = __webpack_require__(7)('iterator');
	var Iterators = __webpack_require__(52);
	module.exports = __webpack_require__(25).getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(38);
	var step = __webpack_require__(136);
	var Iterators = __webpack_require__(52);
	var toIObject = __webpack_require__(23);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(95)(Array, 'Array', function (iterated, kind) {
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
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */
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
/* 121 */,
/* 122 */
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
	var popContentClass = 'popup-content-inner';
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
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

	var cof = __webpack_require__(24);
	module.exports = function (it, msg) {
	  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
	  return +it;
	};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	'use strict';
	var toObject = __webpack_require__(11);
	var toAbsoluteIndex = __webpack_require__(50);
	var toLength = __webpack_require__(10);
	
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
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	var forOf = __webpack_require__(43);
	
	module.exports = function (iter, ITERATOR) {
	  var result = [];
	  forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

	var aFunction = __webpack_require__(13);
	var toObject = __webpack_require__(11);
	var IObject = __webpack_require__(59);
	var toLength = __webpack_require__(10);
	
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
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var aFunction = __webpack_require__(13);
	var isObject = __webpack_require__(6);
	var invoke = __webpack_require__(133);
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
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var dP = __webpack_require__(9).f;
	var create = __webpack_require__(44);
	var redefineAll = __webpack_require__(48);
	var ctx = __webpack_require__(26);
	var anInstance = __webpack_require__(42);
	var forOf = __webpack_require__(43);
	var $iterDefine = __webpack_require__(95);
	var step = __webpack_require__(136);
	var setSpecies = __webpack_require__(49);
	var DESCRIPTORS = __webpack_require__(8);
	var fastKey = __webpack_require__(40).fastKey;
	var validate = __webpack_require__(55);
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
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var classof = __webpack_require__(58);
	var from = __webpack_require__(125);
	module.exports = function (NAME) {
	  return function toJSON() {
	    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
	    return from(this);
	  };
	};


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var redefineAll = __webpack_require__(48);
	var getWeak = __webpack_require__(40).getWeak;
	var anObject = __webpack_require__(3);
	var isObject = __webpack_require__(6);
	var anInstance = __webpack_require__(42);
	var forOf = __webpack_require__(43);
	var createArrayMethod = __webpack_require__(29);
	var $has = __webpack_require__(20);
	var validate = __webpack_require__(55);
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
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
	var isArray = __webpack_require__(68);
	var isObject = __webpack_require__(6);
	var toLength = __webpack_require__(10);
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
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(8) && !__webpack_require__(5)(function () {
	  return Object.defineProperty(__webpack_require__(88)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 133 */
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
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(6);
	var floor = Math.floor;
	module.exports = function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};


/***/ }),
/* 135 */
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
/* 136 */
/***/ (function(module, exports) {

	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.16 Math.fround(x)
	var sign = __webpack_require__(97);
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
/* 138 */
/***/ (function(module, exports) {

	// 20.2.2.20 Math.log1p(x)
	module.exports = Math.log1p || function log1p(x) {
	  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
	};


/***/ }),
/* 139 */
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
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys = __webpack_require__(46);
	var gOPS = __webpack_require__(72);
	var pIE = __webpack_require__(60);
	var toObject = __webpack_require__(11);
	var IObject = __webpack_require__(59);
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
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(9);
	var anObject = __webpack_require__(3);
	var getKeys = __webpack_require__(46);
	
	module.exports = __webpack_require__(8) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};


/***/ }),
/* 142 */
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
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

	var has = __webpack_require__(20);
	var toIObject = __webpack_require__(23);
	var arrayIndexOf = __webpack_require__(64)(false);
	var IE_PROTO = __webpack_require__(101)('IE_PROTO');
	
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
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys = __webpack_require__(46);
	var toIObject = __webpack_require__(23);
	var isEnum = __webpack_require__(60).f;
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
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

	// all object keys, includes non-enumerable and symbols
	var gOPN = __webpack_require__(45);
	var gOPS = __webpack_require__(72);
	var anObject = __webpack_require__(3);
	var Reflect = __webpack_require__(4).Reflect;
	module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
	  var keys = gOPN.f(anObject(it));
	  var getSymbols = gOPS.f;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

	var $parseFloat = __webpack_require__(4).parseFloat;
	var $trim = __webpack_require__(54).trim;
	
	module.exports = 1 / $parseFloat(__webpack_require__(105) + '-0') !== -Infinity ? function parseFloat(str) {
	  var string = $trim(String(str), 3);
	  var result = $parseFloat(string);
	  return result === 0 && string.charAt(0) == '-' ? -0 : result;
	} : $parseFloat;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

	var $parseInt = __webpack_require__(4).parseInt;
	var $trim = __webpack_require__(54).trim;
	var ws = __webpack_require__(105);
	var hex = /^[-+]?0[xX]/;
	
	module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
	  var string = $trim(String(str), 3);
	  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
	} : $parseInt;


/***/ }),
/* 148 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return { e: false, v: exec() };
	  } catch (e) {
	    return { e: true, v: e };
	  }
	};


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(3);
	var isObject = __webpack_require__(6);
	var newPromiseCapability = __webpack_require__(99);
	
	module.exports = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-string-pad-start-end
	var toLength = __webpack_require__(10);
	var repeat = __webpack_require__(104);
	var defined = __webpack_require__(30);
	
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
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/ecma262/#sec-toindex
	var toInteger = __webpack_require__(32);
	var toLength = __webpack_require__(10);
	module.exports = function (it) {
	  if (it === undefined) return 0;
	  var number = toInteger(it);
	  var length = toLength(number);
	  if (number !== length) throw RangeError('Wrong length!');
	  return length;
	};


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(7);


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(128);
	var validate = __webpack_require__(55);
	var MAP = 'Map';
	
	// 23.1 Map Objects
	module.exports = __webpack_require__(65)(MAP, function (get) {
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
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

	// 21.2.5.3 get RegExp.prototype.flags()
	if (__webpack_require__(8) && /./g.flags != 'g') __webpack_require__(9).f(RegExp.prototype, 'flags', {
	  configurable: true,
	  get: __webpack_require__(67)
	});


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(128);
	var validate = __webpack_require__(55);
	var SET = 'Set';
	
	// 23.2 Set Objects
	module.exports = __webpack_require__(65)(SET, function (get) {
	  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value) {
	    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
	  }
	}, strong);


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var each = __webpack_require__(29)(0);
	var redefine = __webpack_require__(18);
	var meta = __webpack_require__(40);
	var assign = __webpack_require__(140);
	var weak = __webpack_require__(130);
	var isObject = __webpack_require__(6);
	var fails = __webpack_require__(5);
	var validate = __webpack_require__(55);
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
	var $WeakMap = module.exports = __webpack_require__(65)(WEAK_MAP, wrapper, methods, weak, true, true);
	
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
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

	/* Mapbox GL JS is licensed under the 3-Clause BSD License. Full text of license: https://github.com/mapbox/mapbox-gl-js/blob/v0.47.0/LICENSE.txt */
	(function (global, factory) {
		 true ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.mapboxgl = factory());
	}(this, (function () { 'use strict';
	
	/* eslint-disable */
	
	var shared, worker, mapboxgl;
	// define gets called three times: one for each chunk. we rely on the order
	// they're imported to know which is which
	function define(_, chunk) {
	if (!shared) {
	    shared = chunk;
	} else if (!worker) {
	    worker = chunk;
	} else {
	    var workerBundleString = 'var sharedChunk = {}; (' + shared + ')(sharedChunk); (' + worker + ')(sharedChunk);'
	
	    var sharedChunk = {};
	    shared(sharedChunk);
	    mapboxgl = chunk(sharedChunk);
	    mapboxgl.workerUrl = window.URL.createObjectURL(new Blob([workerBundleString], { type: 'text/javascript' }));
	}
	}
	
	
	define(["exports"],function(t){"use strict";function e(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function r(t,e){return t(e={exports:{}},e.exports),e.exports}var n=self.performance&&self.performance.now?self.performance.now.bind(self.performance):Date.now.bind(Date),i=self.requestAnimationFrame||self.mozRequestAnimationFrame||self.webkitRequestAnimationFrame||self.msRequestAnimationFrame,a=self.cancelAnimationFrame||self.mozCancelAnimationFrame||self.webkitCancelAnimationFrame||self.msCancelAnimationFrame,o={now:n,frame:function(t){var e=i(t);return{cancel:function(){return a(e)}}},getImageData:function(t){var e=self.document.createElement("canvas"),r=e.getContext("2d");if(!r)throw new Error("failed to create canvas 2d context");return e.width=t.width,e.height=t.height,r.drawImage(t,0,0,t.width,t.height),r.getImageData(0,0,t.width,t.height)},resolveURL:function(t){var e=self.document.createElement("a");return e.href=t,e.href},hardwareConcurrency:self.navigator.hardwareConcurrency||4,get devicePixelRatio(){return self.devicePixelRatio},supportsWebp:!1};if(self.document){var s=self.document.createElement("img");s.onload=function(){o.supportsWebp=!0;},s.src="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=";}var u=l;function l(t,e,r,n){this.cx=3*t,this.bx=3*(r-t)-this.cx,this.ax=1-this.cx-this.bx,this.cy=3*e,this.by=3*(n-e)-this.cy,this.ay=1-this.cy-this.by,this.p1x=t,this.p1y=n,this.p2x=r,this.p2y=n;}l.prototype.sampleCurveX=function(t){return((this.ax*t+this.bx)*t+this.cx)*t},l.prototype.sampleCurveY=function(t){return((this.ay*t+this.by)*t+this.cy)*t},l.prototype.sampleCurveDerivativeX=function(t){return(3*this.ax*t+2*this.bx)*t+this.cx},l.prototype.solveCurveX=function(t,e){var r,n,i,a,o;for(void 0===e&&(e=1e-6),i=t,o=0;o<8;o++){if(a=this.sampleCurveX(i)-t,Math.abs(a)<e)return i;var s=this.sampleCurveDerivativeX(i);if(Math.abs(s)<1e-6)break;i-=a/s;}if((i=t)<(r=0))return r;if(i>(n=1))return n;for(;r<n;){if(a=this.sampleCurveX(i),Math.abs(a-t)<e)return i;t>a?r=i:n=i,i=.5*(n-r)+r;}return i},l.prototype.solve=function(t,e){return this.sampleCurveY(this.solveCurveX(t,e))};var p=function(t,e,r){this.column=t,this.row=e,this.zoom=r;};p.prototype.clone=function(){return new p(this.column,this.row,this.zoom)},p.prototype.zoomTo=function(t){return this.clone()._zoomTo(t)},p.prototype.sub=function(t){return this.clone()._sub(t)},p.prototype._zoomTo=function(t){var e=Math.pow(2,t-this.zoom);return this.column*=e,this.row*=e,this.zoom=t,this},p.prototype._sub=function(t){return t=t.zoomTo(this.zoom),this.column-=t.column,this.row-=t.row,this};var h=c;function c(t,e){this.x=t,this.y=e;}function f(t,e){if(Array.isArray(t)){if(!Array.isArray(e)||t.length!==e.length)return!1;for(var r=0;r<t.length;r++)if(!f(t[r],e[r]))return!1;return!0}if("object"==typeof t&&null!==t&&null!==e){if("object"!=typeof e)return!1;if(Object.keys(t).length!==Object.keys(e).length)return!1;for(var n in t)if(!f(t[n],e[n]))return!1;return!0}return t===e}function y(t,e,r,n){var i=new u(t,e,r,n);return function(t){return i.solve(t)}}c.prototype={clone:function(){return new c(this.x,this.y)},add:function(t){return this.clone()._add(t)},sub:function(t){return this.clone()._sub(t)},multByPoint:function(t){return this.clone()._multByPoint(t)},divByPoint:function(t){return this.clone()._divByPoint(t)},mult:function(t){return this.clone()._mult(t)},div:function(t){return this.clone()._div(t)},rotate:function(t){return this.clone()._rotate(t)},rotateAround:function(t,e){return this.clone()._rotateAround(t,e)},matMult:function(t){return this.clone()._matMult(t)},unit:function(){return this.clone()._unit()},perp:function(){return this.clone()._perp()},round:function(){return this.clone()._round()},mag:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals:function(t){return this.x===t.x&&this.y===t.y},dist:function(t){return Math.sqrt(this.distSqr(t))},distSqr:function(t){var e=t.x-this.x,r=t.y-this.y;return e*e+r*r},angle:function(){return Math.atan2(this.y,this.x)},angleTo:function(t){return Math.atan2(this.y-t.y,this.x-t.x)},angleWith:function(t){return this.angleWithSep(t.x,t.y)},angleWithSep:function(t,e){return Math.atan2(this.x*e-this.y*t,this.x*t+this.y*e)},_matMult:function(t){var e=t[0]*this.x+t[1]*this.y,r=t[2]*this.x+t[3]*this.y;return this.x=e,this.y=r,this},_add:function(t){return this.x+=t.x,this.y+=t.y,this},_sub:function(t){return this.x-=t.x,this.y-=t.y,this},_mult:function(t){return this.x*=t,this.y*=t,this},_div:function(t){return this.x/=t,this.y/=t,this},_multByPoint:function(t){return this.x*=t.x,this.y*=t.y,this},_divByPoint:function(t){return this.x/=t.x,this.y/=t.y,this},_unit:function(){return this._div(this.mag()),this},_perp:function(){var t=this.y;return this.y=this.x,this.x=-t,this},_rotate:function(t){var e=Math.cos(t),r=Math.sin(t),n=e*this.x-r*this.y,i=r*this.x+e*this.y;return this.x=n,this.y=i,this},_rotateAround:function(t,e){var r=Math.cos(t),n=Math.sin(t),i=e.x+r*(this.x-e.x)-n*(this.y-e.y),a=e.y+n*(this.x-e.x)+r*(this.y-e.y);return this.x=i,this.y=a,this},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}},c.convert=function(t){return t instanceof c?t:Array.isArray(t)?new c(t[0],t[1]):t};var d=y(.25,.1,.25,1);function m(t,e,r){return Math.min(r,Math.max(e,t))}function v(t){for(var e=[],r=arguments.length-1;r-- >0;)e[r]=arguments[r+1];for(var n=0,i=e;n<i.length;n+=1){var a=i[n];for(var o in a)t[o]=a[o];}return t}var g=1;function x(){return g++}function b(t,e){t.forEach(function(t){e[t]&&(e[t]=e[t].bind(e));});}function w(t,e){return-1!==t.indexOf(e,t.length-e.length)}function _(t,e,r){var n={};for(var i in t)n[i]=e.call(r||this,t[i],i,t);return n}function A(t,e,r){var n={};for(var i in t)e.call(r||this,t[i],i,t)&&(n[i]=t[i]);return n}function k(t){return Array.isArray(t)?t.map(k):"object"==typeof t&&t?_(t,k):t}var z={};function S(t){z[t]||("undefined"!=typeof console&&console.warn(t),z[t]=!0);}function M(t,e,r){return(r.y-t.y)*(e.x-t.x)>(e.y-t.y)*(r.x-t.x)}function B(t){for(var e=0,r=0,n=t.length,i=n-1,a=void 0,o=void 0;r<n;i=r++)a=t[r],e+=((o=t[i]).x-a.x)*(a.y+o.y);return e}var V={Unknown:"Unknown",Style:"Style",Source:"Source",Tile:"Tile",Glyphs:"Glyphs",SpriteImage:"SpriteImage",SpriteJSON:"SpriteJSON",Image:"Image"};"function"==typeof Object.freeze&&Object.freeze(V);var I=function(t){function e(e,r,n){t.call(this,e),this.status=r,this.url=n,this.name=this.constructor.name,this.message=e;}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.toString=function(){return this.name+": "+this.message+" ("+this.status+"): "+this.url},e}(Error);function C(t){var e=new self.XMLHttpRequest;for(var r in e.open("GET",t.url,!0),t.headers)e.setRequestHeader(r,t.headers[r]);return e.withCredentials="include"===t.credentials,e}var E=function(t,e){var r=C(t);return r.responseType="arraybuffer",r.onerror=function(){e(new Error(r.statusText));},r.onload=function(){var n=r.response;if(0===n.byteLength&&200===r.status)return e(new Error("http status 200 returned without content."));r.status>=200&&r.status<300&&r.response?e(null,{data:n,cacheControl:r.getResponseHeader("Cache-Control"),expires:r.getResponseHeader("Expires")}):e(new I(r.statusText,r.status,t.url));},r.send(),{cancel:function(){return r.abort()}}};function T(t,e,r){r[t]&&-1!==r[t].indexOf(e)||(r[t]=r[t]||[],r[t].push(e));}function P(t,e,r){if(r&&r[t]){var n=r[t].indexOf(e);-1!==n&&r[t].splice(n,1);}}var F=function(t,e){void 0===e&&(e={}),v(this,e),this.type=t;},L=function(t){function e(e,r){void 0===r&&(r={}),t.call(this,"error",v({error:e},r));}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e}(F),O=function(){};O.prototype.on=function(t,e){return this._listeners=this._listeners||{},T(t,e,this._listeners),this},O.prototype.off=function(t,e){return P(t,e,this._listeners),P(t,e,this._oneTimeListeners),this},O.prototype.once=function(t,e){return this._oneTimeListeners=this._oneTimeListeners||{},T(t,e,this._oneTimeListeners),this},O.prototype.fire=function(t){"string"==typeof t&&(t=new F(t,arguments[1]||{}));var e=t.type;if(this.listens(e)){t.target=this;for(var r=0,n=this._listeners&&this._listeners[e]?this._listeners[e].slice():[];r<n.length;r+=1){n[r].call(this,t);}for(var i=0,a=this._oneTimeListeners&&this._oneTimeListeners[e]?this._oneTimeListeners[e].slice():[];i<a.length;i+=1){var o=a[i];P(e,o,this._oneTimeListeners),o.call(this,t);}var s=this._eventedParent;s&&(v(t,"function"==typeof this._eventedParentData?this._eventedParentData():this._eventedParentData),s.fire(t));}else t instanceof L&&console.error(t.error);return this},O.prototype.listens=function(t){return this._listeners&&this._listeners[t]&&this._listeners[t].length>0||this._oneTimeListeners&&this._oneTimeListeners[t]&&this._oneTimeListeners[t].length>0||this._eventedParent&&this._eventedParent.listens(t)},O.prototype.setEventedParent=function(t,e){return this._eventedParent=t,this._eventedParentData=e,this};var D={$version:8,$root:{version:{required:!0,type:"enum",values:[8]},name:{type:"string"},metadata:{type:"*"},center:{type:"array",value:"number"},zoom:{type:"number"},bearing:{type:"number",default:0,period:360,units:"degrees"},pitch:{type:"number",default:0,units:"degrees"},light:{type:"light"},sources:{required:!0,type:"sources"},sprite:{type:"string"},glyphs:{type:"string"},transition:{type:"transition"},layers:{required:!0,type:"array",value:"layer"}},sources:{"*":{type:"source"}},source:["source_vector","source_raster","source_raster_dem","source_geojson","source_video","source_image"],source_vector:{type:{required:!0,type:"enum",values:{vector:{}}},url:{type:"string"},tiles:{type:"array",value:"string"},bounds:{type:"array",value:"number",length:4,default:[-180,-85.0511,180,85.0511]},scheme:{type:"enum",values:{xyz:{},tms:{}},default:"xyz"},minzoom:{type:"number",default:0},maxzoom:{type:"number",default:22},attribution:{type:"string"},"*":{type:"*"}},source_raster:{type:{required:!0,type:"enum",values:{raster:{}}},url:{type:"string"},tiles:{type:"array",value:"string"},bounds:{type:"array",value:"number",length:4,default:[-180,-85.0511,180,85.0511]},minzoom:{type:"number",default:0},maxzoom:{type:"number",default:22},tileSize:{type:"number",default:512,units:"pixels"},scheme:{type:"enum",values:{xyz:{},tms:{}},default:"xyz"},attribution:{type:"string"},"*":{type:"*"}},source_raster_dem:{type:{required:!0,type:"enum",values:{"raster-dem":{}}},url:{type:"string"},tiles:{type:"array",value:"string"},bounds:{type:"array",value:"number",length:4,default:[-180,-85.0511,180,85.0511]},minzoom:{type:"number",default:0},maxzoom:{type:"number",default:22},tileSize:{type:"number",default:512,units:"pixels"},attribution:{type:"string"},encoding:{type:"enum",values:{terrarium:{},mapbox:{}},default:"mapbox"},"*":{type:"*"}},source_geojson:{type:{required:!0,type:"enum",values:{geojson:{}}},data:{type:"*"},maxzoom:{type:"number",default:18},attribution:{type:"string"},buffer:{type:"number",default:128,maximum:512,minimum:0},tolerance:{type:"number",default:.375},cluster:{type:"boolean",default:!1},clusterRadius:{type:"number",default:50,minimum:0},clusterMaxZoom:{type:"number"},lineMetrics:{type:"boolean",default:!1}},source_video:{type:{required:!0,type:"enum",values:{video:{}}},urls:{required:!0,type:"array",value:"string"},coordinates:{required:!0,type:"array",length:4,value:{type:"array",length:2,value:"number"}}},source_image:{type:{required:!0,type:"enum",values:{image:{}}},url:{required:!0,type:"string"},coordinates:{required:!0,type:"array",length:4,value:{type:"array",length:2,value:"number"}}},layer:{id:{type:"string",required:!0},type:{type:"enum",values:{fill:{},line:{},symbol:{},circle:{},heatmap:{},"fill-extrusion":{},raster:{},hillshade:{},background:{}},required:!0},metadata:{type:"*"},source:{type:"string"},"source-layer":{type:"string"},minzoom:{type:"number",minimum:0,maximum:24},maxzoom:{type:"number",minimum:0,maximum:24},filter:{type:"filter"},layout:{type:"layout"},paint:{type:"paint"}},layout:["layout_fill","layout_line","layout_circle","layout_heatmap","layout_fill-extrusion","layout_symbol","layout_raster","layout_hillshade","layout_background"],layout_background:{visibility:{type:"enum",values:{visible:{},none:{}},default:"visible","property-type":"constant"}},layout_fill:{visibility:{type:"enum",values:{visible:{},none:{}},default:"visible","property-type":"constant"}},layout_circle:{visibility:{type:"enum",values:{visible:{},none:{}},default:"visible","property-type":"constant"}},layout_heatmap:{visibility:{type:"enum",values:{visible:{},none:{}},default:"visible","property-type":"constant"}},layout_line:{"line-cap":{type:"enum",values:{butt:{},round:{},square:{}},default:"butt",expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"line-join":{type:"enum",values:{bevel:{},round:{},miter:{}},default:"miter",expression:{interpolated:!1,parameters:["zoom","feature"]},"property-type":"data-driven"},"line-miter-limit":{type:"number",default:2,requires:[{"line-join":"miter"}],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"line-round-limit":{type:"number",default:1.05,requires:[{"line-join":"round"}],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},visibility:{type:"enum",values:{visible:{},none:{}},default:"visible","property-type":"constant"}},layout_symbol:{"symbol-placement":{type:"enum",values:{point:{},line:{},"line-center":{}},default:"point",expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"symbol-spacing":{type:"number",default:250,minimum:1,units:"pixels",requires:[{"symbol-placement":"line"}],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"symbol-avoid-edges":{type:"boolean",default:!1,expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"icon-allow-overlap":{type:"boolean",default:!1,requires:["icon-image"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"icon-ignore-placement":{type:"boolean",default:!1,requires:["icon-image"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"icon-optional":{type:"boolean",default:!1,requires:["icon-image","text-field"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"icon-rotation-alignment":{type:"enum",values:{map:{},viewport:{},auto:{}},default:"auto",requires:["icon-image"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"icon-size":{type:"number",default:1,minimum:0,units:"factor of the original icon size",requires:["icon-image"],expression:{interpolated:!0,parameters:["zoom","feature"]},"property-type":"data-driven"},"icon-text-fit":{type:"enum",values:{none:{},width:{},height:{},both:{}},default:"none",requires:["icon-image","text-field"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"icon-text-fit-padding":{type:"array",value:"number",length:4,default:[0,0,0,0],units:"pixels",requires:["icon-image","text-field",{"icon-text-fit":["both","width","height"]}],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"icon-image":{type:"string",tokens:!0,expression:{interpolated:!1,parameters:["zoom","feature"]},"property-type":"data-driven"},"icon-rotate":{type:"number",default:0,period:360,units:"degrees",requires:["icon-image"],expression:{interpolated:!0,parameters:["zoom","feature"]},"property-type":"data-driven"},"icon-padding":{type:"number",default:2,minimum:0,units:"pixels",requires:["icon-image"],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"icon-keep-upright":{type:"boolean",default:!1,requires:["icon-image",{"icon-rotation-alignment":"map"},{"symbol-placement":["line","line-center"]}],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"icon-offset":{type:"array",value:"number",length:2,default:[0,0],requires:["icon-image"],expression:{interpolated:!0,parameters:["zoom","feature"]},"property-type":"data-driven"},"icon-anchor":{type:"enum",values:{center:{},left:{},right:{},top:{},bottom:{},"top-left":{},"top-right":{},"bottom-left":{},"bottom-right":{}},default:"center",requires:["icon-image"],expression:{interpolated:!1,parameters:["zoom","feature"]},"property-type":"data-driven"},"icon-pitch-alignment":{type:"enum",values:{map:{},viewport:{},auto:{}},default:"auto",requires:["icon-image"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"text-pitch-alignment":{type:"enum",values:{map:{},viewport:{},auto:{}},default:"auto",requires:["text-field"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"text-rotation-alignment":{type:"enum",values:{map:{},viewport:{},auto:{}},default:"auto",requires:["text-field"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"text-field":{type:"string",default:"",tokens:!0,expression:{interpolated:!1,parameters:["zoom","feature"]},"property-type":"data-driven"},"text-font":{type:"array",value:"string",default:["Open Sans Regular","Arial Unicode MS Regular"],requires:["text-field"],expression:{interpolated:!1,parameters:["zoom","feature"]},"property-type":"data-driven"},"text-size":{type:"number",default:16,minimum:0,units:"pixels",requires:["text-field"],expression:{interpolated:!0,parameters:["zoom","feature"]},"property-type":"data-driven"},"text-max-width":{type:"number",default:10,minimum:0,units:"ems",requires:["text-field"],expression:{interpolated:!0,parameters:["zoom","feature"]},"property-type":"data-driven"},"text-line-height":{type:"number",default:1.2,units:"ems",requires:["text-field"],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"text-letter-spacing":{type:"number",default:0,units:"ems",requires:["text-field"],expression:{interpolated:!0,parameters:["zoom","feature"]},"property-type":"data-driven"},"text-justify":{type:"enum",values:{left:{},center:{},right:{}},default:"center",requires:["text-field"],expression:{interpolated:!1,parameters:["zoom","feature"]},"property-type":"data-driven"},"text-anchor":{type:"enum",values:{center:{},left:{},right:{},top:{},bottom:{},"top-left":{},"top-right":{},"bottom-left":{},"bottom-right":{}},default:"center",requires:["text-field"],expression:{interpolated:!1,parameters:["zoom","feature"]},"property-type":"data-driven"},"text-max-angle":{type:"number",default:45,units:"degrees",requires:["text-field",{"symbol-placement":["line","line-center"]}],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"text-rotate":{type:"number",default:0,period:360,units:"degrees",requires:["text-field"],expression:{interpolated:!0,parameters:["zoom","feature"]},"property-type":"data-driven"},"text-padding":{type:"number",default:2,minimum:0,units:"pixels",requires:["text-field"],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"text-keep-upright":{type:"boolean",default:!0,requires:["text-field",{"text-rotation-alignment":"map"},{"symbol-placement":["line","line-center"]}],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"text-transform":{type:"enum",values:{none:{},uppercase:{},lowercase:{}},default:"none",requires:["text-field"],expression:{interpolated:!1,parameters:["zoom","feature"]},"property-type":"data-driven"},"text-offset":{type:"array",value:"number",units:"ems",length:2,default:[0,0],requires:["text-field"],expression:{interpolated:!0,parameters:["zoom","feature"]},"property-type":"data-driven"},"text-allow-overlap":{type:"boolean",default:!1,requires:["text-field"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"text-ignore-placement":{type:"boolean",default:!1,requires:["text-field"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"text-optional":{type:"boolean",default:!1,requires:["text-field","icon-image"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},visibility:{type:"enum",values:{visible:{},none:{}},default:"visible","property-type":"constant"}},layout_raster:{visibility:{type:"enum",values:{visible:{},none:{}},default:"visible","property-type":"constant"}},layout_hillshade:{visibility:{type:"enum",values:{visible:{},none:{}},default:"visible","property-type":"constant"}},filter:{type:"array",value:"*"},filter_operator:{type:"enum",values:{"==":{},"!=":{},">":{},">=":{},"<":{},"<=":{},in:{},"!in":{},all:{},any:{},none:{},has:{},"!has":{}}},geometry_type:{type:"enum",values:{Point:{},LineString:{},Polygon:{}}},function_stop:{type:"array",minimum:0,maximum:22,value:["number","color"],length:2},expression:{type:"array",value:"*",minimum:1},expression_name:{type:"enum",values:{let:{group:"Variable binding"},var:{group:"Variable binding"},literal:{group:"Types"},array:{group:"Types"},at:{group:"Lookup"},case:{group:"Decision"},match:{group:"Decision"},coalesce:{group:"Decision"},step:{group:"Ramps, scales, curves"},interpolate:{group:"Ramps, scales, curves"},ln2:{group:"Math"},pi:{group:"Math"},e:{group:"Math"},typeof:{group:"Types"},string:{group:"Types"},number:{group:"Types"},boolean:{group:"Types"},object:{group:"Types"},collator:{group:"Types"},"to-string":{group:"Types"},"to-number":{group:"Types"},"to-boolean":{group:"Types"},"to-rgba":{group:"Color"},"to-color":{group:"Types"},rgb:{group:"Color"},rgba:{group:"Color"},get:{group:"Lookup"},has:{group:"Lookup"},length:{group:"Lookup"},properties:{group:"Feature data"},"feature-state":{group:"Feature data"},"geometry-type":{group:"Feature data"},id:{group:"Feature data"},zoom:{group:"Zoom"},"heatmap-density":{group:"Heatmap"},"line-progress":{group:"Heatmap"},"+":{group:"Math"},"*":{group:"Math"},"-":{group:"Math"},"/":{group:"Math"},"%":{group:"Math"},"^":{group:"Math"},sqrt:{group:"Math"},log10:{group:"Math"},ln:{group:"Math"},log2:{group:"Math"},sin:{group:"Math"},cos:{group:"Math"},tan:{group:"Math"},asin:{group:"Math"},acos:{group:"Math"},atan:{group:"Math"},min:{group:"Math"},max:{group:"Math"},round:{group:"Math"},abs:{group:"Math"},ceil:{group:"Math"},floor:{group:"Math"},"==":{group:"Decision"},"!=":{group:"Decision"},">":{group:"Decision"},"<":{group:"Decision"},">=":{group:"Decision"},"<=":{group:"Decision"},all:{group:"Decision"},any:{group:"Decision"},"!":{group:"Decision"},"is-supported-script":{group:"String"},upcase:{group:"String"},downcase:{group:"String"},concat:{group:"String"},"resolved-locale":{group:"String"}}},light:{anchor:{type:"enum",default:"viewport",values:{map:{},viewport:{}},"property-type":"data-constant",transition:!1,expression:{interpolated:!1,parameters:["zoom"]}},position:{type:"array",default:[1.15,210,30],length:3,value:"number","property-type":"data-constant",transition:!0,expression:{interpolated:!0,parameters:["zoom"]}},color:{type:"color","property-type":"data-constant",default:"#ffffff",expression:{interpolated:!0,parameters:["zoom"]},transition:!0},intensity:{type:"number","property-type":"data-constant",default:.5,minimum:0,maximum:1,expression:{interpolated:!0,parameters:["zoom"]},transition:!0}},paint:["paint_fill","paint_line","paint_circle","paint_heatmap","paint_fill-extrusion","paint_symbol","paint_raster","paint_hillshade","paint_background"],paint_fill:{"fill-antialias":{type:"boolean",default:!0,expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"fill-opacity":{type:"number",default:1,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-color":{type:"color",default:"#000000",transition:!0,requires:[{"!":"fill-pattern"}],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-outline-color":{type:"color",transition:!0,requires:[{"!":"fill-pattern"},{"fill-antialias":!0}],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-translate":{type:"array",value:"number",length:2,default:[0,0],transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"fill-translate-anchor":{type:"enum",values:{map:{},viewport:{}},default:"map",requires:["fill-translate"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"fill-pattern":{type:"string",transition:!0,expression:{interpolated:!1,parameters:["zoom"]},"property-type":"cross-faded"}},paint_line:{"line-opacity":{type:"number",default:1,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-color":{type:"color",default:"#000000",transition:!0,requires:[{"!":"line-pattern"}],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-translate":{type:"array",value:"number",length:2,default:[0,0],transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"line-translate-anchor":{type:"enum",values:{map:{},viewport:{}},default:"map",requires:["line-translate"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"line-width":{type:"number",default:1,minimum:0,transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-gap-width":{type:"number",default:0,minimum:0,transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-offset":{type:"number",default:0,transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-blur":{type:"number",default:0,minimum:0,transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"line-dasharray":{type:"array",value:"number",minimum:0,transition:!0,units:"line widths",requires:[{"!":"line-pattern"}],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"cross-faded"},"line-pattern":{type:"string",transition:!0,expression:{interpolated:!1,parameters:["zoom"]},"property-type":"cross-faded"},"line-gradient":{type:"color",transition:!1,requires:[{"!":"line-dasharray"},{"!":"line-pattern"},{source:"geojson",has:{lineMetrics:!0}}],expression:{interpolated:!0,parameters:["line-progress"]},"property-type":"color-ramp"}},paint_circle:{"circle-radius":{type:"number",default:5,minimum:0,transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-color":{type:"color",default:"#000000",transition:!0,expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-blur":{type:"number",default:0,transition:!0,expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-opacity":{type:"number",default:1,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-translate":{type:"array",value:"number",length:2,default:[0,0],transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"circle-translate-anchor":{type:"enum",values:{map:{},viewport:{}},default:"map",requires:["circle-translate"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"circle-pitch-scale":{type:"enum",values:{map:{},viewport:{}},default:"map",expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"circle-pitch-alignment":{type:"enum",values:{map:{},viewport:{}},default:"viewport",expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"circle-stroke-width":{type:"number",default:0,minimum:0,transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-stroke-color":{type:"color",default:"#000000",transition:!0,expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"circle-stroke-opacity":{type:"number",default:1,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"}},paint_heatmap:{"heatmap-radius":{type:"number",default:30,minimum:1,transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"heatmap-weight":{type:"number",default:1,minimum:0,transition:!1,expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"heatmap-intensity":{type:"number",default:1,minimum:0,transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"heatmap-color":{type:"color",default:["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",.1,"royalblue",.3,"cyan",.5,"lime",.7,"yellow",1,"red"],transition:!1,expression:{interpolated:!0,parameters:["heatmap-density"]},"property-type":"color-ramp"},"heatmap-opacity":{type:"number",default:1,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"}},paint_symbol:{"icon-opacity":{type:"number",default:1,minimum:0,maximum:1,transition:!0,requires:["icon-image"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"icon-color":{type:"color",default:"#000000",transition:!0,requires:["icon-image"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"icon-halo-color":{type:"color",default:"rgba(0, 0, 0, 0)",transition:!0,requires:["icon-image"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"icon-halo-width":{type:"number",default:0,minimum:0,transition:!0,units:"pixels",requires:["icon-image"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"icon-halo-blur":{type:"number",default:0,minimum:0,transition:!0,units:"pixels",requires:["icon-image"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"icon-translate":{type:"array",value:"number",length:2,default:[0,0],transition:!0,units:"pixels",requires:["icon-image"],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"icon-translate-anchor":{type:"enum",values:{map:{},viewport:{}},default:"map",requires:["icon-image","icon-translate"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"text-opacity":{type:"number",default:1,minimum:0,maximum:1,transition:!0,requires:["text-field"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"text-color":{type:"color",default:"#000000",transition:!0,requires:["text-field"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"text-halo-color":{type:"color",default:"rgba(0, 0, 0, 0)",transition:!0,requires:["text-field"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"text-halo-width":{type:"number",default:0,minimum:0,transition:!0,units:"pixels",requires:["text-field"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"text-halo-blur":{type:"number",default:0,minimum:0,transition:!0,units:"pixels",requires:["text-field"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"text-translate":{type:"array",value:"number",length:2,default:[0,0],transition:!0,units:"pixels",requires:["text-field"],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"text-translate-anchor":{type:"enum",values:{map:{},viewport:{}},default:"map",requires:["text-field","text-translate"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"}},paint_raster:{"raster-opacity":{type:"number",default:1,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"raster-hue-rotate":{type:"number",default:0,period:360,transition:!0,units:"degrees",expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"raster-brightness-min":{type:"number",default:0,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"raster-brightness-max":{type:"number",default:1,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"raster-saturation":{type:"number",default:0,minimum:-1,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"raster-contrast":{type:"number",default:0,minimum:-1,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"raster-resampling":{type:"enum",values:{linear:{},nearest:{}},default:"linear",expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"raster-fade-duration":{type:"number",default:300,minimum:0,transition:!1,units:"milliseconds",expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"}},paint_hillshade:{"hillshade-illumination-direction":{type:"number",default:335,minimum:0,maximum:359,transition:!1,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"hillshade-illumination-anchor":{type:"enum",values:{map:{},viewport:{}},default:"viewport",expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"hillshade-exaggeration":{type:"number",default:.5,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"hillshade-shadow-color":{type:"color",default:"#000000",transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"hillshade-highlight-color":{type:"color",default:"#FFFFFF",transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"hillshade-accent-color":{type:"color",default:"#000000",transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"}},paint_background:{"background-color":{type:"color",default:"#000000",transition:!0,requires:[{"!":"background-pattern"}],expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"background-pattern":{type:"string",transition:!0,expression:{interpolated:!1,parameters:["zoom"]},"property-type":"cross-faded"},"background-opacity":{type:"number",default:1,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"}},transition:{duration:{type:"number",default:300,minimum:0,units:"milliseconds"},delay:{type:"number",default:0,minimum:0,units:"milliseconds"}},"layout_fill-extrusion":{visibility:{type:"enum",values:{visible:{},none:{}},default:"visible","property-type":"constant"}},function:{expression:{type:"expression"},stops:{type:"array",value:"function_stop"},base:{type:"number",default:1,minimum:0},property:{type:"string",default:"$zoom"},type:{type:"enum",values:{identity:{},exponential:{},interval:{},categorical:{}},default:"exponential"},colorSpace:{type:"enum",values:{rgb:{},lab:{},hcl:{}},default:"rgb"},default:{type:"*",required:!1}},"paint_fill-extrusion":{"fill-extrusion-opacity":{type:"number",default:1,minimum:0,maximum:1,transition:!0,expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"fill-extrusion-color":{type:"color",default:"#000000",transition:!0,requires:[{"!":"fill-extrusion-pattern"}],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-extrusion-translate":{type:"array",value:"number",length:2,default:[0,0],transition:!0,units:"pixels",expression:{interpolated:!0,parameters:["zoom"]},"property-type":"data-constant"},"fill-extrusion-translate-anchor":{type:"enum",values:{map:{},viewport:{}},default:"map",requires:["fill-extrusion-translate"],expression:{interpolated:!1,parameters:["zoom"]},"property-type":"data-constant"},"fill-extrusion-pattern":{type:"string",transition:!0,expression:{interpolated:!1,parameters:["zoom"]},"property-type":"cross-faded"},"fill-extrusion-height":{type:"number",default:0,minimum:0,units:"meters",transition:!0,expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"},"fill-extrusion-base":{type:"number",default:0,minimum:0,units:"meters",transition:!0,requires:["fill-extrusion-height"],expression:{interpolated:!0,parameters:["zoom","feature","feature-state"]},"property-type":"data-driven"}},"property-type":{"data-driven":{type:"property-type"},"cross-faded":{type:"property-type"},"cross-faded-data-driven":{type:"property-type"},"color-ramp":{type:"property-type"},"data-constant":{type:"property-type"},constant:{type:"property-type"}}},q=function(t,e,r,n){this.message=(t?t+": ":"")+r,n&&(this.identifier=n),null!=e&&e.__line__&&(this.line=e.__line__);};function j(t){var e=t.key,r=t.value;return r?[new q(e,r,"constants have been deprecated as of v8")]:[]}function R(t){for(var e=[],r=arguments.length-1;r-- >0;)e[r]=arguments[r+1];for(var n=0,i=e;n<i.length;n+=1){var a=i[n];for(var o in a)t[o]=a[o];}return t}function U(t){return t instanceof Number||t instanceof String||t instanceof Boolean?t.valueOf():t}function N(t){return Array.isArray(t)?t.map(N):U(t)}var Z=function(t){function e(e,r){t.call(this,r),this.message=r,this.key=e;}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e}(Error),X=function(t,e){void 0===e&&(e=[]),this.parent=t,this.bindings={};for(var r=0,n=e;r<n.length;r+=1){var i=n[r],a=i[0],o=i[1];this.bindings[a]=o;}};X.prototype.concat=function(t){return new X(this,t)},X.prototype.get=function(t){if(this.bindings[t])return this.bindings[t];if(this.parent)return this.parent.get(t);throw new Error(t+" not found in scope.")},X.prototype.has=function(t){return!!this.bindings[t]||!!this.parent&&this.parent.has(t)};var $={kind:"null"},J={kind:"number"},H={kind:"string"},K={kind:"boolean"},G={kind:"color"},Y={kind:"object"},W={kind:"value"},Q={kind:"collator"};function tt(t,e){return{kind:"array",itemType:t,N:e}}function et(t){if("array"===t.kind){var e=et(t.itemType);return"number"==typeof t.N?"array<"+e+", "+t.N+">":"value"===t.itemType.kind?"array":"array<"+e+">"}return t.kind}var rt=[$,J,H,K,G,Y,tt(W)];function nt(t,e){if("error"===e.kind)return null;if("array"===t.kind){if("array"===e.kind&&!nt(t.itemType,e.itemType)&&("number"!=typeof t.N||t.N===e.N))return null}else{if(t.kind===e.kind)return null;if("value"===t.kind)for(var r=0,n=rt;r<n.length;r+=1){if(!nt(n[r],e))return null}}return"Expected "+et(t)+" but found "+et(e)+" instead."}var it=r(function(t,e){var r={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],rebeccapurple:[102,51,153,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};function n(t){return(t=Math.round(t))<0?0:t>255?255:t}function i(t){return t<0?0:t>1?1:t}function a(t){return"%"===t[t.length-1]?n(parseFloat(t)/100*255):n(parseInt(t))}function o(t){return"%"===t[t.length-1]?i(parseFloat(t)/100):i(parseFloat(t))}function s(t,e,r){return r<0?r+=1:r>1&&(r-=1),6*r<1?t+(e-t)*r*6:2*r<1?e:3*r<2?t+(e-t)*(2/3-r)*6:t}try{e.parseCSSColor=function(t){var e,i=t.replace(/ /g,"").toLowerCase();if(i in r)return r[i].slice();if("#"===i[0])return 4===i.length?(e=parseInt(i.substr(1),16))>=0&&e<=4095?[(3840&e)>>4|(3840&e)>>8,240&e|(240&e)>>4,15&e|(15&e)<<4,1]:null:7===i.length&&(e=parseInt(i.substr(1),16))>=0&&e<=16777215?[(16711680&e)>>16,(65280&e)>>8,255&e,1]:null;var u=i.indexOf("("),l=i.indexOf(")");if(-1!==u&&l+1===i.length){var p=i.substr(0,u),h=i.substr(u+1,l-(u+1)).split(","),c=1;switch(p){case"rgba":if(4!==h.length)return null;c=o(h.pop());case"rgb":return 3!==h.length?null:[a(h[0]),a(h[1]),a(h[2]),c];case"hsla":if(4!==h.length)return null;c=o(h.pop());case"hsl":if(3!==h.length)return null;var f=(parseFloat(h[0])%360+360)%360/360,y=o(h[1]),d=o(h[2]),m=d<=.5?d*(y+1):d+y-d*y,v=2*d-m;return[n(255*s(v,m,f+1/3)),n(255*s(v,m,f)),n(255*s(v,m,f-1/3)),c];default:return null}}return null};}catch(t){}}).parseCSSColor,at=function(t,e,r,n){void 0===n&&(n=1),this.r=t,this.g=e,this.b=r,this.a=n;};at.parse=function(t){if(t){if(t instanceof at)return t;if("string"==typeof t){var e=it(t);if(e)return new at(e[0]/255*e[3],e[1]/255*e[3],e[2]/255*e[3],e[3])}}},at.prototype.toString=function(){var t=this.toArray(),e=t[0],r=t[1],n=t[2],i=t[3];return"rgba("+Math.round(e)+","+Math.round(r)+","+Math.round(n)+","+i+")"},at.prototype.toArray=function(){var t=this.r,e=this.g,r=this.b,n=this.a;return 0===n?[0,0,0,0]:[255*t/n,255*e/n,255*r/n,n]},at.black=new at(0,0,0,1),at.white=new at(1,1,1,1),at.transparent=new at(0,0,0,0);var ot=function(t,e,r){this.sensitivity=t?e?"variant":"case":e?"accent":"base",this.locale=r,this.collator=new Intl.Collator(this.locale?this.locale:[],{sensitivity:this.sensitivity,usage:"search"});};ot.prototype.compare=function(t,e){return this.collator.compare(t,e)},ot.prototype.resolvedLocale=function(){return new Intl.Collator(this.locale?this.locale:[]).resolvedOptions().locale};var st=function(t,e,r){this.type=Q,this.locale=r,this.caseSensitive=t,this.diacriticSensitive=e;};function ut(t,e,r,n){return"number"==typeof t&&t>=0&&t<=255&&"number"==typeof e&&e>=0&&e<=255&&"number"==typeof r&&r>=0&&r<=255?void 0===n||"number"==typeof n&&n>=0&&n<=1?null:"Invalid rgba value ["+[t,e,r,n].join(", ")+"]: 'a' must be between 0 and 1.":"Invalid rgba value ["+("number"==typeof n?[t,e,r,n]:[t,e,r]).join(", ")+"]: 'r', 'g', and 'b' must be between 0 and 255."}function lt(t){if(null===t)return $;if("string"==typeof t)return H;if("boolean"==typeof t)return K;if("number"==typeof t)return J;if(t instanceof at)return G;if(t instanceof ot)return Q;if(Array.isArray(t)){for(var e,r=t.length,n=0,i=t;n<i.length;n+=1){var a=lt(i[n]);if(e){if(e===a)continue;e=W;break}e=a;}return tt(e||W,r)}return Y}st.parse=function(t,e){if(2!==t.length)return e.error("Expected one argument.");var r=t[1];if("object"!=typeof r||Array.isArray(r))return e.error("Collator options argument must be an object.");var n=e.parse(void 0!==r["case-sensitive"]&&r["case-sensitive"],1,K);if(!n)return null;var i=e.parse(void 0!==r["diacritic-sensitive"]&&r["diacritic-sensitive"],1,K);if(!i)return null;var a=null;return r.locale&&!(a=e.parse(r.locale,1,H))?null:new st(n,i,a)},st.prototype.evaluate=function(t){return new ot(this.caseSensitive.evaluate(t),this.diacriticSensitive.evaluate(t),this.locale?this.locale.evaluate(t):null)},st.prototype.eachChild=function(t){t(this.caseSensitive),t(this.diacriticSensitive),this.locale&&t(this.locale);},st.prototype.possibleOutputs=function(){return[void 0]},st.prototype.serialize=function(){var t={};return t["case-sensitive"]=this.caseSensitive.serialize(),t["diacritic-sensitive"]=this.diacriticSensitive.serialize(),this.locale&&(t.locale=this.locale.serialize()),["collator",t]};var pt=function(t,e){this.type=t,this.value=e;};pt.parse=function(t,e){if(2!==t.length)return e.error("'literal' expression requires exactly one argument, but found "+(t.length-1)+" instead.");if(!function t(e){if(null===e)return!0;if("string"==typeof e)return!0;if("boolean"==typeof e)return!0;if("number"==typeof e)return!0;if(e instanceof at)return!0;if(e instanceof ot)return!0;if(Array.isArray(e)){for(var r=0,n=e;r<n.length;r+=1)if(!t(n[r]))return!1;return!0}if("object"==typeof e){for(var i in e)if(!t(e[i]))return!1;return!0}return!1}(t[1]))return e.error("invalid value");var r=t[1],n=lt(r),i=e.expectedType;return"array"!==n.kind||0!==n.N||!i||"array"!==i.kind||"number"==typeof i.N&&0!==i.N||(n=i),new pt(n,r)},pt.prototype.evaluate=function(){return this.value},pt.prototype.eachChild=function(){},pt.prototype.possibleOutputs=function(){return[this.value]},pt.prototype.serialize=function(){return"array"===this.type.kind||"object"===this.type.kind?["literal",this.value]:this.value instanceof at?["rgba"].concat(this.value.toArray()):this.value};var ht=function(t){this.name="ExpressionEvaluationError",this.message=t;};ht.prototype.toJSON=function(){return this.message};var ct={string:H,number:J,boolean:K,object:Y},ft=function(t,e){this.type=t,this.args=e;};ft.parse=function(t,e){if(t.length<2)return e.error("Expected at least one argument.");for(var r=t[0],n=ct[r],i=[],a=1;a<t.length;a++){var o=e.parse(t[a],a,W);if(!o)return null;i.push(o);}return new ft(n,i)},ft.prototype.evaluate=function(t){for(var e=0;e<this.args.length;e++){var r=this.args[e].evaluate(t);if(!nt(this.type,lt(r)))return r;if(e===this.args.length-1)throw new ht("Expected value to be of type "+et(this.type)+", but found "+et(lt(r))+" instead.")}return null},ft.prototype.eachChild=function(t){this.args.forEach(t);},ft.prototype.possibleOutputs=function(){return(t=[]).concat.apply(t,this.args.map(function(t){return t.possibleOutputs()}));var t;},ft.prototype.serialize=function(){return[this.type.kind].concat(this.args.map(function(t){return t.serialize()}))};var yt={string:H,number:J,boolean:K},dt=function(t,e){this.type=t,this.input=e;};dt.parse=function(t,e){if(t.length<2||t.length>4)return e.error("Expected 1, 2, or 3 arguments, but found "+(t.length-1)+" instead.");var r,n;if(t.length>2){var i=t[1];if("string"!=typeof i||!(i in yt))return e.error('The item type argument of "array" must be one of string, number, boolean',1);r=yt[i];}else r=W;if(t.length>3){if("number"!=typeof t[2]||t[2]<0||t[2]!==Math.floor(t[2]))return e.error('The length argument to "array" must be a positive integer literal',2);n=t[2];}var a=tt(r,n),o=e.parse(t[t.length-1],t.length-1,W);return o?new dt(a,o):null},dt.prototype.evaluate=function(t){var e=this.input.evaluate(t);if(nt(this.type,lt(e)))throw new ht("Expected value to be of type "+et(this.type)+", but found "+et(lt(e))+" instead.");return e},dt.prototype.eachChild=function(t){t(this.input);},dt.prototype.possibleOutputs=function(){return this.input.possibleOutputs()},dt.prototype.serialize=function(){var t=["array"],e=this.type.itemType;if("string"===e.kind||"number"===e.kind||"boolean"===e.kind){t.push(e.kind);var r=this.type.N;"number"==typeof r&&t.push(r);}return t.push(this.input.serialize()),t};var mt={"to-number":J,"to-color":G},vt=function(t,e){this.type=t,this.args=e;};vt.parse=function(t,e){if(t.length<2)return e.error("Expected at least one argument.");for(var r=t[0],n=mt[r],i=[],a=1;a<t.length;a++){var o=e.parse(t[a],a,W);if(!o)return null;i.push(o);}return new vt(n,i)},vt.prototype.evaluate=function(t){if("color"===this.type.kind){for(var e,r,n=0,i=this.args;n<i.length;n+=1){if(r=null,"string"==typeof(e=i[n].evaluate(t))){var a=t.parseColor(e);if(a)return a}else if(Array.isArray(e)&&!(r=e.length<3||e.length>4?"Invalid rbga value "+JSON.stringify(e)+": expected an array containing either three or four numeric values.":ut(e[0],e[1],e[2],e[3])))return new at(e[0]/255,e[1]/255,e[2]/255,e[3])}throw new ht(r||"Could not parse color from value '"+("string"==typeof e?e:JSON.stringify(e))+"'")}for(var o=null,s=0,u=this.args;s<u.length;s+=1){if(null!==(o=u[s].evaluate(t))){var l=Number(o);if(!isNaN(l))return l}}throw new ht("Could not convert "+JSON.stringify(o)+" to number.")},vt.prototype.eachChild=function(t){this.args.forEach(t);},vt.prototype.possibleOutputs=function(){return(t=[]).concat.apply(t,this.args.map(function(t){return t.possibleOutputs()}));var t;},vt.prototype.serialize=function(){var t=["to-"+this.type.kind];return this.eachChild(function(e){t.push(e.serialize());}),t};var gt=["Unknown","Point","LineString","Polygon"],xt=function(){this._parseColorCache={};};xt.prototype.id=function(){return this.feature&&"id"in this.feature?this.feature.id:null},xt.prototype.geometryType=function(){return this.feature?"number"==typeof this.feature.type?gt[this.feature.type]:this.feature.type:null},xt.prototype.properties=function(){return this.feature&&this.feature.properties||{}},xt.prototype.parseColor=function(t){var e=this._parseColorCache[t];return e||(e=this._parseColorCache[t]=at.parse(t)),e};var bt=function(t,e,r,n){this.name=t,this.type=e,this._evaluate=r,this.args=n;};function wt(t){if(t instanceof bt){if("get"===t.name&&1===t.args.length)return!1;if("feature-state"===t.name)return!1;if("has"===t.name&&1===t.args.length)return!1;if("properties"===t.name||"geometry-type"===t.name||"id"===t.name)return!1;if(/^filter-/.test(t.name))return!1}var e=!0;return t.eachChild(function(t){e&&!wt(t)&&(e=!1);}),e}function _t(t){if(t instanceof bt&&"feature-state"===t.name)return!1;var e=!0;return t.eachChild(function(t){e&&!_t(t)&&(e=!1);}),e}function At(t,e){if(t instanceof bt&&e.indexOf(t.name)>=0)return!1;var r=!0;return t.eachChild(function(t){r&&!At(t,e)&&(r=!1);}),r}bt.prototype.evaluate=function(t){return this._evaluate(t,this.args)},bt.prototype.eachChild=function(t){this.args.forEach(t);},bt.prototype.possibleOutputs=function(){return[void 0]},bt.prototype.serialize=function(){return[this.name].concat(this.args.map(function(t){return t.serialize()}))},bt.parse=function(t,e){var r=t[0],n=bt.definitions[r];if(!n)return e.error('Unknown expression "'+r+'". If you wanted a literal array, use ["literal", [...]].',0);for(var i=Array.isArray(n)?n[0]:n.type,a=Array.isArray(n)?[[n[1],n[2]]]:n.overloads,o=a.filter(function(e){var r=e[0];return!Array.isArray(r)||r.length===t.length-1}),s=[],u=1;u<t.length;u++){var l=t[u],p=void 0;if(1===o.length){var h=o[0][0];p=Array.isArray(h)?h[u-1]:h.type;}var c=e.parse(l,1+s.length,p);if(!c)return null;s.push(c);}for(var f=null,y=0,d=o;y<d.length;y+=1){var m=d[y],v=m[0],g=m[1];if(f=new zt(e.registry,e.path,null,e.scope),Array.isArray(v)&&v.length!==s.length)f.error("Expected "+v.length+" arguments, but found "+s.length+" instead.");else{for(var x=0;x<s.length;x++){var b=Array.isArray(v)?v[x]:v.type,w=s[x];f.concat(x+1).checkSubtype(b,w.type);}if(0===f.errors.length)return new bt(r,i,g,s)}}if(1===o.length)e.errors.push.apply(e.errors,f.errors);else{var _=(o.length?o:a).map(function(t){var e,r=t[0];return e=r,Array.isArray(e)?"("+e.map(et).join(", ")+")":"("+et(e.type)+"...)"}).join(" | "),A=s.map(function(t){return et(t.type)}).join(", ");e.error("Expected arguments of type "+_+", but found ("+A+") instead.");}return null},bt.register=function(t,e){for(var r in bt.definitions=e,e)t[r]=bt;};var kt=function(t,e){this.type=e.type,this.name=t,this.boundExpression=e;};kt.parse=function(t,e){if(2!==t.length||"string"!=typeof t[1])return e.error("'var' expression requires exactly one string literal argument.");var r=t[1];return e.scope.has(r)?new kt(r,e.scope.get(r)):e.error('Unknown variable "'+r+'". Make sure "'+r+'" has been bound in an enclosing "let" expression before using it.',1)},kt.prototype.evaluate=function(t){return this.boundExpression.evaluate(t)},kt.prototype.eachChild=function(){},kt.prototype.possibleOutputs=function(){return[void 0]},kt.prototype.serialize=function(){return["var",this.name]};var zt=function(t,e,r,n,i){void 0===e&&(e=[]),void 0===n&&(n=new X),void 0===i&&(i=[]),this.registry=t,this.path=e,this.key=e.map(function(t){return"["+t+"]"}).join(""),this.scope=n,this.errors=i,this.expectedType=r;};function St(t,e){for(var r,n,i=0,a=t.length-1,o=0;i<=a;){if(r=t[o=Math.floor((i+a)/2)],n=t[o+1],e===r||e>r&&e<n)return o;if(r<e)i=o+1;else{if(!(r>e))throw new ht("Input is not a number.");a=o-1;}}return Math.max(o-1,0)}zt.prototype.parse=function(t,e,r,n,i){return void 0===i&&(i={}),e?this.concat(e,r,n)._parse(t,i):this._parse(t,i)},zt.prototype._parse=function(t,e){if(null!==t&&"string"!=typeof t&&"boolean"!=typeof t&&"number"!=typeof t||(t=["literal",t]),Array.isArray(t)){if(0===t.length)return this.error('Expected an array with at least one element. If you wanted a literal array, use ["literal", []].');var r=t[0];if("string"!=typeof r)return this.error("Expression name must be a string, but found "+typeof r+' instead. If you wanted a literal array, use ["literal", [...]].',0),null;var n=this.registry[r];if(n){var i=n.parse(t,this);if(!i)return null;if(this.expectedType){var a=this.expectedType,o=i.type;if("string"!==a.kind&&"number"!==a.kind&&"boolean"!==a.kind&&"object"!==a.kind||"value"!==o.kind)if("array"===a.kind&&"value"===o.kind)e.omitTypeAnnotations||(i=new dt(a,i));else if("color"!==a.kind||"value"!==o.kind&&"string"!==o.kind){if(this.checkSubtype(this.expectedType,i.type))return null}else e.omitTypeAnnotations||(i=new vt(a,[i]));else e.omitTypeAnnotations||(i=new ft(a,[i]));}if(!(i instanceof pt)&&function t(e){if(e instanceof kt)return t(e.boundExpression);if(e instanceof bt&&"error"===e.name)return!1;if(e instanceof st)return!1;var r=e instanceof vt||e instanceof ft||e instanceof dt;var n=!0;e.eachChild(function(e){n=r?n&&t(e):n&&e instanceof pt;});if(!n)return!1;return wt(e)&&At(e,["zoom","heatmap-density","line-progress","is-supported-script"])}(i)){var s=new xt;try{i=new pt(i.type,i.evaluate(s));}catch(t){return this.error(t.message),null}}return i}return this.error('Unknown expression "'+r+'". If you wanted a literal array, use ["literal", [...]].',0)}return void 0===t?this.error("'undefined' value invalid. Use null instead."):"object"==typeof t?this.error('Bare objects invalid. Use ["literal", {...}] instead.'):this.error("Expected an array, but found "+typeof t+" instead.")},zt.prototype.concat=function(t,e,r){var n="number"==typeof t?this.path.concat(t):this.path,i=r?this.scope.concat(r):this.scope;return new zt(this.registry,n,e||null,i,this.errors)},zt.prototype.error=function(t){for(var e=[],r=arguments.length-1;r-- >0;)e[r]=arguments[r+1];var n=""+this.key+e.map(function(t){return"["+t+"]"}).join("");this.errors.push(new Z(n,t));},zt.prototype.checkSubtype=function(t,e){var r=nt(t,e);return r&&this.error(r),r};var Mt=function(t,e,r){this.type=t,this.input=e,this.labels=[],this.outputs=[];for(var n=0,i=r;n<i.length;n+=1){var a=i[n],o=a[0],s=a[1];this.labels.push(o),this.outputs.push(s);}};function Bt(t,e,r){return t*(1-r)+e*r}Mt.parse=function(t,e){var r=t[1],n=t.slice(2);if(t.length-1<4)return e.error("Expected at least 4 arguments, but found only "+(t.length-1)+".");if((t.length-1)%2!=0)return e.error("Expected an even number of arguments.");if(!(r=e.parse(r,1,J)))return null;var i=[],a=null;e.expectedType&&"value"!==e.expectedType.kind&&(a=e.expectedType),n.unshift(-1/0);for(var o=0;o<n.length;o+=2){var s=n[o],u=n[o+1],l=o+1,p=o+2;if("number"!=typeof s)return e.error('Input/output pairs for "step" expressions must be defined using literal numeric values (not computed expressions) for the input values.',l);if(i.length&&i[i.length-1][0]>=s)return e.error('Input/output pairs for "step" expressions must be arranged with input values in strictly ascending order.',l);var h=e.parse(u,p,a);if(!h)return null;a=a||h.type,i.push([s,h]);}return new Mt(a,r,i)},Mt.prototype.evaluate=function(t){var e=this.labels,r=this.outputs;if(1===e.length)return r[0].evaluate(t);var n=this.input.evaluate(t);if(n<=e[0])return r[0].evaluate(t);var i=e.length;return n>=e[i-1]?r[i-1].evaluate(t):r[St(e,n)].evaluate(t)},Mt.prototype.eachChild=function(t){t(this.input);for(var e=0,r=this.outputs;e<r.length;e+=1){t(r[e]);}},Mt.prototype.possibleOutputs=function(){return(t=[]).concat.apply(t,this.outputs.map(function(t){return t.possibleOutputs()}));var t;},Mt.prototype.serialize=function(){for(var t=["step",this.input.serialize()],e=0;e<this.labels.length;e++)e>0&&t.push(this.labels[e]),t.push(this.outputs[e].serialize());return t};var Vt=Object.freeze({number:Bt,color:function(t,e,r){return new at(Bt(t.r,e.r,r),Bt(t.g,e.g,r),Bt(t.b,e.b,r),Bt(t.a,e.a,r))},array:function(t,e,r){return t.map(function(t,n){return Bt(t,e[n],r)})}}),It=function(t,e,r,n){this.type=t,this.interpolation=e,this.input=r,this.labels=[],this.outputs=[];for(var i=0,a=n;i<a.length;i+=1){var o=a[i],s=o[0],u=o[1];this.labels.push(s),this.outputs.push(u);}};function Ct(t,e,r,n){var i=n-r,a=t-r;return 0===i?0:1===e?a/i:(Math.pow(e,a)-1)/(Math.pow(e,i)-1)}It.interpolationFactor=function(t,e,r,n){var i=0;if("exponential"===t.name)i=Ct(e,t.base,r,n);else if("linear"===t.name)i=Ct(e,1,r,n);else if("cubic-bezier"===t.name){var a=t.controlPoints;i=new u(a[0],a[1],a[2],a[3]).solve(Ct(e,1,r,n));}return i},It.parse=function(t,e){var r=t[1],n=t[2],i=t.slice(3);if(!Array.isArray(r)||0===r.length)return e.error("Expected an interpolation type expression.",1);if("linear"===r[0])r={name:"linear"};else if("exponential"===r[0]){var a=r[1];if("number"!=typeof a)return e.error("Exponential interpolation requires a numeric base.",1,1);r={name:"exponential",base:a};}else{if("cubic-bezier"!==r[0])return e.error("Unknown interpolation type "+String(r[0]),1,0);var o=r.slice(1);if(4!==o.length||o.some(function(t){return"number"!=typeof t||t<0||t>1}))return e.error("Cubic bezier interpolation requires four numeric arguments with values between 0 and 1.",1);r={name:"cubic-bezier",controlPoints:o};}if(t.length-1<4)return e.error("Expected at least 4 arguments, but found only "+(t.length-1)+".");if((t.length-1)%2!=0)return e.error("Expected an even number of arguments.");if(!(n=e.parse(n,2,J)))return null;var s=[],u=null;e.expectedType&&"value"!==e.expectedType.kind&&(u=e.expectedType);for(var l=0;l<i.length;l+=2){var p=i[l],h=i[l+1],c=l+3,f=l+4;if("number"!=typeof p)return e.error('Input/output pairs for "interpolate" expressions must be defined using literal numeric values (not computed expressions) for the input values.',c);if(s.length&&s[s.length-1][0]>=p)return e.error('Input/output pairs for "interpolate" expressions must be arranged with input values in strictly ascending order.',c);var y=e.parse(h,f,u);if(!y)return null;u=u||y.type,s.push([p,y]);}return"number"===u.kind||"color"===u.kind||"array"===u.kind&&"number"===u.itemType.kind&&"number"==typeof u.N?new It(u,r,n,s):e.error("Type "+et(u)+" is not interpolatable.")},It.prototype.evaluate=function(t){var e=this.labels,r=this.outputs;if(1===e.length)return r[0].evaluate(t);var n=this.input.evaluate(t);if(n<=e[0])return r[0].evaluate(t);var i=e.length;if(n>=e[i-1])return r[i-1].evaluate(t);var a=St(e,n),o=e[a],s=e[a+1],u=It.interpolationFactor(this.interpolation,n,o,s),l=r[a].evaluate(t),p=r[a+1].evaluate(t);return Vt[this.type.kind.toLowerCase()](l,p,u)},It.prototype.eachChild=function(t){t(this.input);for(var e=0,r=this.outputs;e<r.length;e+=1){t(r[e]);}},It.prototype.possibleOutputs=function(){return(t=[]).concat.apply(t,this.outputs.map(function(t){return t.possibleOutputs()}));var t;},It.prototype.serialize=function(){for(var t=["interpolate","linear"===this.interpolation.name?["linear"]:"exponential"===this.interpolation.name?1===this.interpolation.base?["linear"]:["exponential",this.interpolation.base]:["cubic-bezier"].concat(this.interpolation.controlPoints),this.input.serialize()],e=0;e<this.labels.length;e++)t.push(this.labels[e],this.outputs[e].serialize());return t};var Et=function(t,e){this.type=t,this.args=e;};Et.parse=function(t,e){if(t.length<2)return e.error("Expectected at least one argument.");var r=null,n=e.expectedType;n&&"value"!==n.kind&&(r=n);for(var i=[],a=0,o=t.slice(1);a<o.length;a+=1){var s=o[a],u=e.parse(s,1+i.length,r,void 0,{omitTypeAnnotations:!0});if(!u)return null;r=r||u.type,i.push(u);}var l=n&&i.some(function(t){return nt(n,t.type)});return new Et(l?W:r,i)},Et.prototype.evaluate=function(t){for(var e=null,r=0,n=this.args;r<n.length;r+=1){if(null!==(e=n[r].evaluate(t)))break}return e},Et.prototype.eachChild=function(t){this.args.forEach(t);},Et.prototype.possibleOutputs=function(){return(t=[]).concat.apply(t,this.args.map(function(t){return t.possibleOutputs()}));var t;},Et.prototype.serialize=function(){var t=["coalesce"];return this.eachChild(function(e){t.push(e.serialize());}),t};var Tt=function(t,e){this.type=e.type,this.bindings=[].concat(t),this.result=e;};Tt.prototype.evaluate=function(t){return this.result.evaluate(t)},Tt.prototype.eachChild=function(t){for(var e=0,r=this.bindings;e<r.length;e+=1){t(r[e][1]);}t(this.result);},Tt.parse=function(t,e){if(t.length<4)return e.error("Expected at least 3 arguments, but found "+(t.length-1)+" instead.");for(var r=[],n=1;n<t.length-1;n+=2){var i=t[n];if("string"!=typeof i)return e.error("Expected string, but found "+typeof i+" instead.",n);if(/[^a-zA-Z0-9_]/.test(i))return e.error("Variable names must contain only alphanumeric characters or '_'.",n);var a=e.parse(t[n+1],n+1);if(!a)return null;r.push([i,a]);}var o=e.parse(t[t.length-1],t.length-1,void 0,r);return o?new Tt(r,o):null},Tt.prototype.possibleOutputs=function(){return this.result.possibleOutputs()},Tt.prototype.serialize=function(){for(var t=["let"],e=0,r=this.bindings;e<r.length;e+=1){var n=r[e],i=n[0],a=n[1];t.push(i,a.serialize());}return t.push(this.result.serialize()),t};var Pt=function(t,e,r){this.type=t,this.index=e,this.input=r;};Pt.parse=function(t,e){if(3!==t.length)return e.error("Expected 2 arguments, but found "+(t.length-1)+" instead.");var r=e.parse(t[1],1,J),n=e.parse(t[2],2,tt(e.expectedType||W));if(!r||!n)return null;var i=n.type;return new Pt(i.itemType,r,n)},Pt.prototype.evaluate=function(t){var e=this.index.evaluate(t),r=this.input.evaluate(t);if(e<0)throw new ht("Array index out of bounds: "+e+" < 0.");if(e>=r.length)throw new ht("Array index out of bounds: "+e+" > "+(r.length-1)+".");if(e!==Math.floor(e))throw new ht("Array index must be an integer, but found "+e+" instead.");return r[e]},Pt.prototype.eachChild=function(t){t(this.index),t(this.input);},Pt.prototype.possibleOutputs=function(){return[void 0]},Pt.prototype.serialize=function(){return["at",this.index.serialize(),this.input.serialize()]};var Ft=function(t,e,r,n,i,a){this.inputType=t,this.type=e,this.input=r,this.cases=n,this.outputs=i,this.otherwise=a;};Ft.parse=function(t,e){if(t.length<5)return e.error("Expected at least 4 arguments, but found only "+(t.length-1)+".");if(t.length%2!=1)return e.error("Expected an even number of arguments.");var r,n;e.expectedType&&"value"!==e.expectedType.kind&&(n=e.expectedType);for(var i={},a=[],o=2;o<t.length-1;o+=2){var s=t[o],u=t[o+1];Array.isArray(s)||(s=[s]);var l=e.concat(o);if(0===s.length)return l.error("Expected at least one branch label.");for(var p=0,h=s;p<h.length;p+=1){var c=h[p];if("number"!=typeof c&&"string"!=typeof c)return l.error("Branch labels must be numbers or strings.");if("number"==typeof c&&Math.abs(c)>Number.MAX_SAFE_INTEGER)return l.error("Branch labels must be integers no larger than "+Number.MAX_SAFE_INTEGER+".");if("number"==typeof c&&Math.floor(c)!==c)return l.error("Numeric branch labels must be integer values.");if(r){if(l.checkSubtype(r,lt(c)))return null}else r=lt(c);if(void 0!==i[String(c)])return l.error("Branch labels must be unique.");i[String(c)]=a.length;}var f=e.parse(u,o,n);if(!f)return null;n=n||f.type,a.push(f);}var y=e.parse(t[1],1,W);if(!y)return null;var d=e.parse(t[t.length-1],t.length-1,n);return d?"value"!==y.type.kind&&e.concat(1).checkSubtype(r,y.type)?null:new Ft(r,n,y,i,a,d):null},Ft.prototype.evaluate=function(t){var e=this.input.evaluate(t);return(lt(e)===this.inputType&&this.outputs[this.cases[e]]||this.otherwise).evaluate(t)},Ft.prototype.eachChild=function(t){t(this.input),this.outputs.forEach(t),t(this.otherwise);},Ft.prototype.possibleOutputs=function(){return(t=[]).concat.apply(t,this.outputs.map(function(t){return t.possibleOutputs()})).concat(this.otherwise.possibleOutputs());var t;},Ft.prototype.serialize=function(){for(var t=this,e=["match",this.input.serialize()],r=[],n={},i=0,a=Object.keys(this.cases).sort();i<a.length;i+=1){var o=a[i],s=n[t.cases[o]];void 0===s?(n[t.cases[o]]=r.length,r.push([t.cases[o],[o]])):r[s][1].push(o);}for(var u=function(e){return"number"===t.inputType.kind?Number(e):e},l=0,p=r;l<p.length;l+=1){var h=p[l],c=h[0],f=h[1];1===f.length?e.push(u(f[0])):e.push(f.map(u)),e.push(t.outputs[c].serialize());}return e.push(this.otherwise.serialize()),e};var Lt=function(t,e,r){this.type=t,this.branches=e,this.otherwise=r;};function Ot(t){return"string"===t.kind||"number"===t.kind||"boolean"===t.kind||"null"===t.kind}function Dt(t,e){return function(){function r(t,e,r){this.type=K,this.lhs=t,this.rhs=e,this.collator=r;}return r.parse=function(t,e){if(3!==t.length&&4!==t.length)return e.error("Expected two or three arguments.");var n=e.parse(t[1],1,W);if(!n)return null;var i=e.parse(t[2],2,W);if(!i)return null;if(!Ot(n.type)&&!Ot(i.type))return e.error("Expected at least one argument to be a string, number, boolean, or null, but found ("+et(n.type)+", "+et(i.type)+") instead.");if(n.type.kind!==i.type.kind&&"value"!==n.type.kind&&"value"!==i.type.kind)return e.error("Cannot compare "+et(n.type)+" and "+et(i.type)+".");var a=null;if(4===t.length){if("string"!==n.type.kind&&"string"!==i.type.kind)return e.error("Cannot use collator to compare non-string types.");if(!(a=e.parse(t[3],3,Q)))return null}return new r(n,i,a)},r.prototype.evaluate=function(t){var r=this.collator?0===this.collator.evaluate(t).compare(this.lhs.evaluate(t),this.rhs.evaluate(t)):this.lhs.evaluate(t)===this.rhs.evaluate(t);return e?!r:r},r.prototype.eachChild=function(t){t(this.lhs),t(this.rhs),this.collator&&t(this.collator);},r.prototype.possibleOutputs=function(){return[!0,!1]},r.prototype.serialize=function(){var e=[t];return this.eachChild(function(t){e.push(t.serialize());}),e},r}()}Lt.parse=function(t,e){if(t.length<4)return e.error("Expected at least 3 arguments, but found only "+(t.length-1)+".");if(t.length%2!=0)return e.error("Expected an odd number of arguments.");var r;e.expectedType&&"value"!==e.expectedType.kind&&(r=e.expectedType);for(var n=[],i=1;i<t.length-1;i+=2){var a=e.parse(t[i],i,K);if(!a)return null;var o=e.parse(t[i+1],i+1,r);if(!o)return null;n.push([a,o]),r=r||o.type;}var s=e.parse(t[t.length-1],t.length-1,r);return s?new Lt(r,n,s):null},Lt.prototype.evaluate=function(t){for(var e=0,r=this.branches;e<r.length;e+=1){var n=r[e],i=n[0],a=n[1];if(i.evaluate(t))return a.evaluate(t)}return this.otherwise.evaluate(t)},Lt.prototype.eachChild=function(t){for(var e=0,r=this.branches;e<r.length;e+=1){var n=r[e],i=n[0],a=n[1];t(i),t(a);}t(this.otherwise);},Lt.prototype.possibleOutputs=function(){return(t=[]).concat.apply(t,this.branches.map(function(t){t[0];return t[1].possibleOutputs()})).concat(this.otherwise.possibleOutputs());var t;},Lt.prototype.serialize=function(){var t=["case"];return this.eachChild(function(e){t.push(e.serialize());}),t};var qt=Dt("==",!1),jt=Dt("!=",!0),Rt=function(t){this.type=J,this.input=t;};Rt.parse=function(t,e){if(2!==t.length)return e.error("Expected 1 argument, but found "+(t.length-1)+" instead.");var r=e.parse(t[1],1);return r?"array"!==r.type.kind&&"string"!==r.type.kind&&"value"!==r.type.kind?e.error("Expected argument of type string or array, but found "+et(r.type)+" instead."):new Rt(r):null},Rt.prototype.evaluate=function(t){var e=this.input.evaluate(t);if("string"==typeof e)return e.length;if(Array.isArray(e))return e.length;throw new ht("Expected value to be of type string or array, but found "+et(lt(e))+" instead.")},Rt.prototype.eachChild=function(t){t(this.input);},Rt.prototype.possibleOutputs=function(){return[void 0]},Rt.prototype.serialize=function(){var t=["length"];return this.eachChild(function(e){t.push(e.serialize());}),t};var Ut={"==":qt,"!=":jt,array:dt,at:Pt,boolean:ft,case:Lt,coalesce:Et,collator:st,interpolate:It,length:Rt,let:Tt,literal:pt,match:Ft,number:ft,object:ft,step:Mt,string:ft,"to-color":vt,"to-number":vt,var:kt};function Nt(t,e){var r=e[0],n=e[1],i=e[2],a=e[3];r=r.evaluate(t),n=n.evaluate(t),i=i.evaluate(t);var o=a?a.evaluate(t):1,s=ut(r,n,i,o);if(s)throw new ht(s);return new at(r/255*o,n/255*o,i/255*o,o)}function Zt(t,e){return t in e}function Xt(t,e){var r=e[t];return void 0===r?null:r}function $t(t,e){var r=e[0],n=e[1];return r.evaluate(t)<n.evaluate(t)}function Jt(t,e){var r=e[0],n=e[1];return r.evaluate(t)>n.evaluate(t)}function Ht(t,e){var r=e[0],n=e[1];return r.evaluate(t)<=n.evaluate(t)}function Kt(t,e){var r=e[0],n=e[1];return r.evaluate(t)>=n.evaluate(t)}function Gt(t){return{type:t}}function Yt(t){return{result:"success",value:t}}function Wt(t){return{result:"error",value:t}}function Qt(t){return"data-driven"===t["property-type"]||"cross-faded-data-driven"===t["property-type"]}function te(t){return!!t.expression&&t.expression.parameters.indexOf("zoom")>-1}function ee(t){return!!t.expression&&t.expression.interpolated}bt.register(Ut,{error:[{kind:"error"},[H],function(t,e){var r=e[0];throw new ht(r.evaluate(t))}],typeof:[H,[W],function(t,e){return et(lt(e[0].evaluate(t)))}],"to-string":[H,[W],function(t,e){var r=e[0],n=typeof(r=r.evaluate(t));return null===r?"":"string"===n||"number"===n||"boolean"===n?String(r):r instanceof at?r.toString():JSON.stringify(r)}],"to-boolean":[K,[W],function(t,e){var r=e[0];return Boolean(r.evaluate(t))}],"to-rgba":[tt(J,4),[G],function(t,e){return e[0].evaluate(t).toArray()}],rgb:[G,[J,J,J],Nt],rgba:[G,[J,J,J,J],Nt],has:{type:K,overloads:[[[H],function(t,e){return Zt(e[0].evaluate(t),t.properties())}],[[H,Y],function(t,e){var r=e[0],n=e[1];return Zt(r.evaluate(t),n.evaluate(t))}]]},get:{type:W,overloads:[[[H],function(t,e){return Xt(e[0].evaluate(t),t.properties())}],[[H,Y],function(t,e){var r=e[0],n=e[1];return Xt(r.evaluate(t),n.evaluate(t))}]]},"feature-state":[W,[H],function(t,e){return Xt(e[0].evaluate(t),t.featureState||{})}],properties:[Y,[],function(t){return t.properties()}],"geometry-type":[H,[],function(t){return t.geometryType()}],id:[W,[],function(t){return t.id()}],zoom:[J,[],function(t){return t.globals.zoom}],"heatmap-density":[J,[],function(t){return t.globals.heatmapDensity||0}],"line-progress":[J,[],function(t){return t.globals.lineProgress||0}],"+":[J,Gt(J),function(t,e){for(var r=0,n=0,i=e;n<i.length;n+=1){r+=i[n].evaluate(t);}return r}],"*":[J,Gt(J),function(t,e){for(var r=1,n=0,i=e;n<i.length;n+=1){r*=i[n].evaluate(t);}return r}],"-":{type:J,overloads:[[[J,J],function(t,e){var r=e[0],n=e[1];return r.evaluate(t)-n.evaluate(t)}],[[J],function(t,e){return-e[0].evaluate(t)}]]},"/":[J,[J,J],function(t,e){var r=e[0],n=e[1];return r.evaluate(t)/n.evaluate(t)}],"%":[J,[J,J],function(t,e){var r=e[0],n=e[1];return r.evaluate(t)%n.evaluate(t)}],ln2:[J,[],function(){return Math.LN2}],pi:[J,[],function(){return Math.PI}],e:[J,[],function(){return Math.E}],"^":[J,[J,J],function(t,e){var r=e[0],n=e[1];return Math.pow(r.evaluate(t),n.evaluate(t))}],sqrt:[J,[J],function(t,e){var r=e[0];return Math.sqrt(r.evaluate(t))}],log10:[J,[J],function(t,e){var r=e[0];return Math.log10(r.evaluate(t))}],ln:[J,[J],function(t,e){var r=e[0];return Math.log(r.evaluate(t))}],log2:[J,[J],function(t,e){var r=e[0];return Math.log2(r.evaluate(t))}],sin:[J,[J],function(t,e){var r=e[0];return Math.sin(r.evaluate(t))}],cos:[J,[J],function(t,e){var r=e[0];return Math.cos(r.evaluate(t))}],tan:[J,[J],function(t,e){var r=e[0];return Math.tan(r.evaluate(t))}],asin:[J,[J],function(t,e){var r=e[0];return Math.asin(r.evaluate(t))}],acos:[J,[J],function(t,e){var r=e[0];return Math.acos(r.evaluate(t))}],atan:[J,[J],function(t,e){var r=e[0];return Math.atan(r.evaluate(t))}],min:[J,Gt(J),function(t,e){return Math.min.apply(Math,e.map(function(e){return e.evaluate(t)}))}],max:[J,Gt(J),function(t,e){return Math.max.apply(Math,e.map(function(e){return e.evaluate(t)}))}],abs:[J,[J],function(t,e){var r=e[0];return Math.abs(r.evaluate(t))}],round:[J,[J],function(t,e){var r=e[0].evaluate(t);return r<0?-Math.round(-r):Math.round(r)}],floor:[J,[J],function(t,e){var r=e[0];return Math.floor(r.evaluate(t))}],ceil:[J,[J],function(t,e){var r=e[0];return Math.ceil(r.evaluate(t))}],"filter-==":[K,[H,W],function(t,e){var r=e[0],n=e[1];return t.properties()[r.value]===n.value}],"filter-id-==":[K,[W],function(t,e){var r=e[0];return t.id()===r.value}],"filter-type-==":[K,[H],function(t,e){var r=e[0];return t.geometryType()===r.value}],"filter-<":[K,[H,W],function(t,e){var r=e[0],n=e[1],i=t.properties()[r.value],a=n.value;return typeof i==typeof a&&i<a}],"filter-id-<":[K,[W],function(t,e){var r=e[0],n=t.id(),i=r.value;return typeof n==typeof i&&n<i}],"filter->":[K,[H,W],function(t,e){var r=e[0],n=e[1],i=t.properties()[r.value],a=n.value;return typeof i==typeof a&&i>a}],"filter-id->":[K,[W],function(t,e){var r=e[0],n=t.id(),i=r.value;return typeof n==typeof i&&n>i}],"filter-<=":[K,[H,W],function(t,e){var r=e[0],n=e[1],i=t.properties()[r.value],a=n.value;return typeof i==typeof a&&i<=a}],"filter-id-<=":[K,[W],function(t,e){var r=e[0],n=t.id(),i=r.value;return typeof n==typeof i&&n<=i}],"filter->=":[K,[H,W],function(t,e){var r=e[0],n=e[1],i=t.properties()[r.value],a=n.value;return typeof i==typeof a&&i>=a}],"filter-id->=":[K,[W],function(t,e){var r=e[0],n=t.id(),i=r.value;return typeof n==typeof i&&n>=i}],"filter-has":[K,[W],function(t,e){return e[0].value in t.properties()}],"filter-has-id":[K,[],function(t){return null!==t.id()}],"filter-type-in":[K,[tt(H)],function(t,e){return e[0].value.indexOf(t.geometryType())>=0}],"filter-id-in":[K,[tt(W)],function(t,e){return e[0].value.indexOf(t.id())>=0}],"filter-in-small":[K,[H,tt(W)],function(t,e){var r=e[0];return e[1].value.indexOf(t.properties()[r.value])>=0}],"filter-in-large":[K,[H,tt(W)],function(t,e){var r=e[0],n=e[1];return function(t,e,r,n){for(;r<=n;){var i=r+n>>1;if(e[i]===t)return!0;e[i]>t?n=i-1:r=i+1;}return!1}(t.properties()[r.value],n.value,0,n.value.length-1)}],">":{type:K,overloads:[[[J,J],Jt],[[H,H],Jt],[[H,H,Q],function(t,e){var r=e[0],n=e[1];return e[2].evaluate(t).compare(r.evaluate(t),n.evaluate(t))>0}]]},"<":{type:K,overloads:[[[J,J],$t],[[H,H],$t],[[H,H,Q],function(t,e){var r=e[0],n=e[1];return e[2].evaluate(t).compare(r.evaluate(t),n.evaluate(t))<0}]]},">=":{type:K,overloads:[[[J,J],Kt],[[H,H],Kt],[[H,H,Q],function(t,e){var r=e[0],n=e[1];return e[2].evaluate(t).compare(r.evaluate(t),n.evaluate(t))>=0}]]},"<=":{type:K,overloads:[[[J,J],Ht],[[H,H],Ht],[[H,H,Q],function(t,e){var r=e[0],n=e[1];return e[2].evaluate(t).compare(r.evaluate(t),n.evaluate(t))<=0}]]},all:{type:K,overloads:[[[K,K],function(t,e){var r=e[0],n=e[1];return r.evaluate(t)&&n.evaluate(t)}],[Gt(K),function(t,e){for(var r=0,n=e;r<n.length;r+=1){if(!n[r].evaluate(t))return!1}return!0}]]},any:{type:K,overloads:[[[K,K],function(t,e){var r=e[0],n=e[1];return r.evaluate(t)||n.evaluate(t)}],[Gt(K),function(t,e){for(var r=0,n=e;r<n.length;r+=1){if(n[r].evaluate(t))return!0}return!1}]]},"!":[K,[K],function(t,e){return!e[0].evaluate(t)}],"is-supported-script":[K,[H],function(t,e){var r=e[0],n=t.globals&&t.globals.isSupportedScript;return!n||n(r.evaluate(t))}],upcase:[H,[H],function(t,e){return e[0].evaluate(t).toUpperCase()}],downcase:[H,[H],function(t,e){return e[0].evaluate(t).toLowerCase()}],concat:[H,Gt(H),function(t,e){return e.map(function(e){return e.evaluate(t)}).join("")}],"resolved-locale":[H,[Q],function(t,e){return e[0].evaluate(t).resolvedLocale()}]});var re=.95047,ne=1,ie=1.08883,ae=4/29,oe=6/29,se=3*oe*oe,ue=oe*oe*oe,le=Math.PI/180,pe=180/Math.PI;function he(t){return t>ue?Math.pow(t,1/3):t/se+ae}function ce(t){return t>oe?t*t*t:se*(t-ae)}function fe(t){return 255*(t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055)}function ye(t){return(t/=255)<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function de(t){var e=ye(t.r),r=ye(t.g),n=ye(t.b),i=he((.4124564*e+.3575761*r+.1804375*n)/re),a=he((.2126729*e+.7151522*r+.072175*n)/ne);return{l:116*a-16,a:500*(i-a),b:200*(a-he((.0193339*e+.119192*r+.9503041*n)/ie)),alpha:t.a}}function me(t){var e=(t.l+16)/116,r=isNaN(t.a)?e:e+t.a/500,n=isNaN(t.b)?e:e-t.b/200;return e=ne*ce(e),r=re*ce(r),n=ie*ce(n),new at(fe(3.2404542*r-1.5371385*e-.4985314*n),fe(-.969266*r+1.8760108*e+.041556*n),fe(.0556434*r-.2040259*e+1.0572252*n),t.alpha)}var ve={forward:de,reverse:me,interpolate:function(t,e,r){return{l:Bt(t.l,e.l,r),a:Bt(t.a,e.a,r),b:Bt(t.b,e.b,r),alpha:Bt(t.alpha,e.alpha,r)}}},ge={forward:function(t){var e=de(t),r=e.l,n=e.a,i=e.b,a=Math.atan2(i,n)*pe;return{h:a<0?a+360:a,c:Math.sqrt(n*n+i*i),l:r,alpha:t.a}},reverse:function(t){var e=t.h*le,r=t.c;return me({l:t.l,a:Math.cos(e)*r,b:Math.sin(e)*r,alpha:t.alpha})},interpolate:function(t,e,r){return{h:function(t,e,r){var n=e-t;return t+r*(n>180||n<-180?n-360*Math.round(n/360):n)}(t.h,e.h,r),c:Bt(t.c,e.c,r),l:Bt(t.l,e.l,r),alpha:Bt(t.alpha,e.alpha,r)}}},xe=Object.freeze({lab:ve,hcl:ge});function be(t){return t instanceof Number?"number":t instanceof String?"string":t instanceof Boolean?"boolean":Array.isArray(t)?"array":null===t?"null":typeof t}function we(t){return"object"==typeof t&&null!==t&&!Array.isArray(t)}function _e(t){return t}function Ae(t,e,r){return void 0!==t?t:void 0!==e?e:void 0!==r?r:void 0}function ke(t,e,r,n,i){return Ae(typeof r===i?n[r]:void 0,t.default,e.default)}function ze(t,e,r){if("number"!==be(r))return Ae(t.default,e.default);var n=t.stops.length;if(1===n)return t.stops[0][1];if(r<=t.stops[0][0])return t.stops[0][1];if(r>=t.stops[n-1][0])return t.stops[n-1][1];var i=Be(t.stops,r);return t.stops[i][1]}function Se(t,e,r){var n=void 0!==t.base?t.base:1;if("number"!==be(r))return Ae(t.default,e.default);var i=t.stops.length;if(1===i)return t.stops[0][1];if(r<=t.stops[0][0])return t.stops[0][1];if(r>=t.stops[i-1][0])return t.stops[i-1][1];var a=Be(t.stops,r),o=function(t,e,r,n){var i=n-r,a=t-r;return 0===i?0:1===e?a/i:(Math.pow(e,a)-1)/(Math.pow(e,i)-1)}(r,n,t.stops[a][0],t.stops[a+1][0]),s=t.stops[a][1],u=t.stops[a+1][1],l=Vt[e.type]||_e;if(t.colorSpace&&"rgb"!==t.colorSpace){var p=xe[t.colorSpace];l=function(t,e){return p.reverse(p.interpolate(p.forward(t),p.forward(e),o))};}return"function"==typeof s.evaluate?{evaluate:function(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];var r=s.evaluate.apply(void 0,t),n=u.evaluate.apply(void 0,t);if(void 0!==r&&void 0!==n)return l(r,n,o)}}:l(s,u,o)}function Me(t,e,r){return"color"===e.type?r=at.parse(r):be(r)===e.type||"enum"===e.type&&e.values[r]||(r=void 0),Ae(r,t.default,e.default)}function Be(t,e){for(var r,n,i=0,a=t.length-1,o=0;i<=a;){if(r=t[o=Math.floor((i+a)/2)][0],n=t[o+1][0],e===r||e>r&&e<n)return o;r<e?i=o+1:r>e&&(a=o-1);}return Math.max(o-1,0)}var Ve=function(t,e){var r;this.expression=t,this._warningHistory={},this._defaultValue="color"===(r=e).type&&we(r.default)?new at(0,0,0,0):"color"===r.type?at.parse(r.default)||null:void 0===r.default?null:r.default,"enum"===e.type&&(this._enumValues=e.values);};function Ie(t){return Array.isArray(t)&&t.length>0&&"string"==typeof t[0]&&t[0]in Ut}function Ce(t,e){var r=new zt(Ut,[],function(t){var e={color:G,string:H,number:J,enum:H,boolean:K};if("array"===t.type)return tt(e[t.value]||W,t.length);return e[t.type]||null}(e)),n=r.parse(t);return n?Yt(new Ve(n,e)):Wt(r.errors)}Ve.prototype.evaluateWithoutErrorHandling=function(t,e,r){return this._evaluator||(this._evaluator=new xt),this._evaluator.globals=t,this._evaluator.feature=e,this._evaluator.featureState=r,this.expression.evaluate(this._evaluator)},Ve.prototype.evaluate=function(t,e,r){this._evaluator||(this._evaluator=new xt),this._evaluator.globals=t,this._evaluator.feature=e,this._evaluator.featureState=r;try{var n=this.expression.evaluate(this._evaluator);if(null==n)return this._defaultValue;if(this._enumValues&&!(n in this._enumValues))throw new ht("Expected value to be one of "+Object.keys(this._enumValues).map(function(t){return JSON.stringify(t)}).join(", ")+", but found "+JSON.stringify(n)+" instead.");return n}catch(t){return this._warningHistory[t.message]||(this._warningHistory[t.message]=!0,"undefined"!=typeof console&&console.warn(t.message)),this._defaultValue}};var Ee=function(t,e){this.kind=t,this._styleExpression=e,this.isStateDependent="constant"!==t&&!_t(e.expression);};Ee.prototype.evaluateWithoutErrorHandling=function(t,e,r){return this._styleExpression.evaluateWithoutErrorHandling(t,e,r)},Ee.prototype.evaluate=function(t,e,r){return this._styleExpression.evaluate(t,e,r)};var Te=function(t,e,r){this.kind=t,this.zoomStops=r.labels,this._styleExpression=e,this.isStateDependent="camera"!==t&&!_t(e.expression),r instanceof It&&(this._interpolationType=r.interpolation);};function Pe(t,e){if("error"===(t=Ce(t,e)).result)return t;var r=t.value.expression,n=wt(r);if(!n&&!Qt(e))return Wt([new Z("","data expressions not supported")]);var i=At(r,["zoom"]);if(!i&&!te(e))return Wt([new Z("","zoom expressions not supported")]);var a=function t(e){var r=null;if(e instanceof Tt)r=t(e.result);else if(e instanceof Et)for(var n=0,i=e.args;n<i.length;n+=1){var a=i[n];if(r=t(a))break}else(e instanceof Mt||e instanceof It)&&e.input instanceof bt&&"zoom"===e.input.name&&(r=e);if(r instanceof Z)return r;e.eachChild(function(e){var n=t(e);n instanceof Z?r=n:!r&&n?r=new Z("",'"zoom" expression may only be used as input to a top-level "step" or "interpolate" expression.'):r&&n&&r!==n&&(r=new Z("",'Only one zoom-based "step" or "interpolate" subexpression may be used in an expression.'));});return r}(r);return a||i?a instanceof Z?Wt([a]):a instanceof It&&!ee(e)?Wt([new Z("",'"interpolate" expressions cannot be used with this property')]):Yt(a?new Te(n?"camera":"composite",t.value,a):new Ee(n?"constant":"source",t.value)):Wt([new Z("",'"zoom" expression may only be used as input to a top-level "step" or "interpolate" expression.')])}Te.prototype.evaluateWithoutErrorHandling=function(t,e,r){return this._styleExpression.evaluateWithoutErrorHandling(t,e,r)},Te.prototype.evaluate=function(t,e,r){return this._styleExpression.evaluate(t,e,r)},Te.prototype.interpolationFactor=function(t,e,r){return this._interpolationType?It.interpolationFactor(this._interpolationType,t,e,r):0};var Fe=function(t,e){this._parameters=t,this._specification=e,R(this,function t(e,r){var n,i,a,o="color"===r.type,s=e.stops&&"object"==typeof e.stops[0][0],u=s||void 0!==e.property,l=s||!u,p=e.type||(ee(r)?"exponential":"interval");if(o&&((e=R({},e)).stops&&(e.stops=e.stops.map(function(t){return[t[0],at.parse(t[1])]})),e.default?e.default=at.parse(e.default):e.default=at.parse(r.default)),e.colorSpace&&"rgb"!==e.colorSpace&&!xe[e.colorSpace])throw new Error("Unknown color space: "+e.colorSpace);if("exponential"===p)n=Se;else if("interval"===p)n=ze;else if("categorical"===p){n=ke,i=Object.create(null);for(var h=0,c=e.stops;h<c.length;h+=1){var f=c[h];i[f[0]]=f[1];}a=typeof e.stops[0][0];}else{if("identity"!==p)throw new Error('Unknown function type "'+p+'"');n=Me;}if(s){for(var y={},d=[],m=0;m<e.stops.length;m++){var v=e.stops[m],g=v[0].zoom;void 0===y[g]&&(y[g]={zoom:g,type:e.type,property:e.property,default:e.default,stops:[]},d.push(g)),y[g].stops.push([v[0].value,v[1]]);}for(var x=[],b=0,w=d;b<w.length;b+=1){var _=w[b];x.push([y[_].zoom,t(y[_],r)]);}return{kind:"composite",interpolationFactor:It.interpolationFactor.bind(void 0,{name:"linear"}),zoomStops:x.map(function(t){return t[0]}),evaluate:function(t,n){var i=t.zoom;return Se({stops:x,base:e.base},r,i).evaluate(i,n)}}}return l?{kind:"camera",interpolationFactor:"exponential"===p?It.interpolationFactor.bind(void 0,{name:"exponential",base:void 0!==e.base?e.base:1}):function(){return 0},zoomStops:e.stops.map(function(t){return t[0]}),evaluate:function(t){var o=t.zoom;return n(e,r,o,i,a)}}:{kind:"source",evaluate:function(t,o){var s=o&&o.properties?o.properties[e.property]:void 0;return void 0===s?Ae(e.default,r.default):n(e,r,s,i,a)}}}(this._parameters,this._specification));};function Le(t,e){if(we(t))return new Fe(t,e);if(Ie(t)){var r=Pe(t,e);if("error"===r.result)throw new Error(r.value.map(function(t){return t.key+": "+t.message}).join(", "));return r.value}var n=t;return"string"==typeof t&&"color"===e.type&&(n=at.parse(t)),{kind:"constant",evaluate:function(){return n}}}function Oe(t){var e=t.key,r=t.value,n=t.valueSpec||{},i=t.objectElementValidators||{},a=t.style,o=t.styleSpec,s=[],u=be(r);if("object"!==u)return[new q(e,r,"object expected, "+u+" found")];for(var l in r){var p=l.split(".")[0],h=n[p]||n["*"],c=void 0;if(i[p])c=i[p];else if(n[p])c=sr;else if(i["*"])c=i["*"];else{if(!n["*"]){s.push(new q(e,r[l],'unknown property "'+l+'"'));continue}c=sr;}s=s.concat(c({key:(e?e+".":e)+l,value:r[l],valueSpec:h,style:a,styleSpec:o,object:r,objectKey:l},r));}for(var f in n)i[f]||n[f].required&&void 0===n[f].default&&void 0===r[f]&&s.push(new q(e,r,'missing required property "'+f+'"'));return s}function De(t){var e=t.value,r=t.valueSpec,n=t.style,i=t.styleSpec,a=t.key,o=t.arrayElementValidator||sr;if("array"!==be(e))return[new q(a,e,"array expected, "+be(e)+" found")];if(r.length&&e.length!==r.length)return[new q(a,e,"array length "+r.length+" expected, length "+e.length+" found")];if(r["min-length"]&&e.length<r["min-length"])return[new q(a,e,"array length at least "+r["min-length"]+" expected, length "+e.length+" found")];var s={type:r.value};i.$version<7&&(s.function=r.function),"object"===be(r.value)&&(s=r.value);for(var u=[],l=0;l<e.length;l++)u=u.concat(o({array:e,arrayIndex:l,value:e[l],valueSpec:s,style:n,styleSpec:i,key:a+"["+l+"]"}));return u}function qe(t){var e=t.key,r=t.value,n=t.valueSpec,i=be(r);return"number"!==i?[new q(e,r,"number expected, "+i+" found")]:"minimum"in n&&r<n.minimum?[new q(e,r,r+" is less than the minimum value "+n.minimum)]:"maximum"in n&&r>n.maximum?[new q(e,r,r+" is greater than the maximum value "+n.maximum)]:[]}function je(t){var e,r,n,i=t.valueSpec,a=U(t.value.type),o={},s="categorical"!==a&&void 0===t.value.property,u=!s,l="array"===be(t.value.stops)&&"array"===be(t.value.stops[0])&&"object"===be(t.value.stops[0][0]),p=Oe({key:t.key,value:t.value,valueSpec:t.styleSpec.function,style:t.style,styleSpec:t.styleSpec,objectElementValidators:{stops:function(t){if("identity"===a)return[new q(t.key,t.value,'identity function may not have a "stops" property')];var e=[],r=t.value;e=e.concat(De({key:t.key,value:r,valueSpec:t.valueSpec,style:t.style,styleSpec:t.styleSpec,arrayElementValidator:h})),"array"===be(r)&&0===r.length&&e.push(new q(t.key,r,"array must have at least one stop"));return e},default:function(t){return sr({key:t.key,value:t.value,valueSpec:i,style:t.style,styleSpec:t.styleSpec})}}});return"identity"===a&&s&&p.push(new q(t.key,t.value,'missing required property "property"')),"identity"===a||t.value.stops||p.push(new q(t.key,t.value,'missing required property "stops"')),"exponential"===a&&t.valueSpec.expression&&!ee(t.valueSpec)&&p.push(new q(t.key,t.value,"exponential functions not supported")),t.styleSpec.$version>=8&&(u&&!Qt(t.valueSpec)?p.push(new q(t.key,t.value,"property functions not supported")):s&&!te(t.valueSpec)&&p.push(new q(t.key,t.value,"zoom functions not supported"))),"categorical"!==a&&!l||void 0!==t.value.property||p.push(new q(t.key,t.value,'"property" property is required')),p;function h(t){var e=[],a=t.value,s=t.key;if("array"!==be(a))return[new q(s,a,"array expected, "+be(a)+" found")];if(2!==a.length)return[new q(s,a,"array length 2 expected, length "+a.length+" found")];if(l){if("object"!==be(a[0]))return[new q(s,a,"object expected, "+be(a[0])+" found")];if(void 0===a[0].zoom)return[new q(s,a,"object stop key must have zoom")];if(void 0===a[0].value)return[new q(s,a,"object stop key must have value")];if(n&&n>U(a[0].zoom))return[new q(s,a[0].zoom,"stop zoom values must appear in ascending order")];U(a[0].zoom)!==n&&(n=U(a[0].zoom),r=void 0,o={}),e=e.concat(Oe({key:s+"[0]",value:a[0],valueSpec:{zoom:{}},style:t.style,styleSpec:t.styleSpec,objectElementValidators:{zoom:qe,value:c}}));}else e=e.concat(c({key:s+"[0]",value:a[0],valueSpec:{},style:t.style,styleSpec:t.styleSpec},a));return e.concat(sr({key:s+"[1]",value:a[1],valueSpec:i,style:t.style,styleSpec:t.styleSpec}))}function c(t,n){var s=be(t.value),u=U(t.value),l=null!==t.value?t.value:n;if(e){if(s!==e)return[new q(t.key,l,s+" stop domain type must match previous stop domain type "+e)]}else e=s;if("number"!==s&&"string"!==s&&"boolean"!==s)return[new q(t.key,l,"stop domain value must be a number, string, or boolean")];if("number"!==s&&"categorical"!==a){var p="number expected, "+s+" found";return Qt(i)&&void 0===a&&(p+='\nIf you intended to use a categorical function, specify `"type": "categorical"`.'),[new q(t.key,l,p)]}return"categorical"!==a||"number"!==s||isFinite(u)&&Math.floor(u)===u?"categorical"!==a&&"number"===s&&void 0!==r&&u<r?[new q(t.key,l,"stop domain values must appear in ascending order")]:(r=u,"categorical"===a&&u in o?[new q(t.key,l,"stop domain values must be unique")]:(o[u]=!0,[])):[new q(t.key,l,"integer expected, found "+u)]}}function Re(t){var e=("property"===t.expressionContext?Pe:Ce)(N(t.value),t.valueSpec);return"error"===e.result?e.value.map(function(e){return new q(""+t.key+e.key,t.value,e.message)}):"property"===t.expressionContext&&"text-font"===t.propertyKey&&-1!==e.value._styleExpression.expression.possibleOutputs().indexOf(void 0)?[new q(t.key,t.value,'Invalid data expression for "text-font". Output values must be contained as literals within the expression.')]:"property"!==t.expressionContext||"layout"!==t.propertyType||_t(e.value._styleExpression.expression)?[]:[new q(t.key,t.value,'"feature-state" data expressions are not supported with layout properties.')]}function Ue(t){var e=t.key,r=t.value,n=t.valueSpec,i=[];return Array.isArray(n.values)?-1===n.values.indexOf(U(r))&&i.push(new q(e,r,"expected one of ["+n.values.join(", ")+"], "+JSON.stringify(r)+" found")):-1===Object.keys(n.values).indexOf(U(r))&&i.push(new q(e,r,"expected one of ["+Object.keys(n.values).join(", ")+"], "+JSON.stringify(r)+" found")),i}function Ne(t){if(!Array.isArray(t)||0===t.length)return!1;switch(t[0]){case"has":return t.length>=2&&"$id"!==t[1]&&"$type"!==t[1];case"in":case"!in":case"!has":case"none":return!1;case"==":case"!=":case">":case">=":case"<":case"<=":return 3!==t.length||Array.isArray(t[1])||Array.isArray(t[2]);case"any":case"all":for(var e=0,r=t.slice(1);e<r.length;e+=1){var n=r[e];if(!Ne(n)&&"boolean"!=typeof n)return!1}return!0;default:return!0}}Fe.deserialize=function(t){return new Fe(t._parameters,t._specification)},Fe.serialize=function(t){return{_parameters:t._parameters,_specification:t._specification}};var Ze={type:"boolean",default:!1,transition:!1,"property-type":"data-driven",expression:{interpolated:!1,parameters:["zoom","feature"]}};function Xe(t){if(!t)return function(){return!0};Ne(t)||(t=Je(t));var e=Ce(t,Ze);if("error"===e.result)throw new Error(e.value.map(function(t){return t.key+": "+t.message}).join(", "));return function(t,r){return e.value.evaluate(t,r)}}function $e(t,e){return t<e?-1:t>e?1:0}function Je(t){if(!t)return!0;var e,r=t[0];return t.length<=1?"any"!==r:"=="===r?He(t[1],t[2],"=="):"!="===r?Ye(He(t[1],t[2],"==")):"<"===r||">"===r||"<="===r||">="===r?He(t[1],t[2],r):"any"===r?(e=t.slice(1),["any"].concat(e.map(Je))):"all"===r?["all"].concat(t.slice(1).map(Je)):"none"===r?["all"].concat(t.slice(1).map(Je).map(Ye)):"in"===r?Ke(t[1],t.slice(2)):"!in"===r?Ye(Ke(t[1],t.slice(2))):"has"===r?Ge(t[1]):"!has"!==r||Ye(Ge(t[1]))}function He(t,e,r){switch(t){case"$type":return["filter-type-"+r,e];case"$id":return["filter-id-"+r,e];default:return["filter-"+r,t,e]}}function Ke(t,e){if(0===e.length)return!1;switch(t){case"$type":return["filter-type-in",["literal",e]];case"$id":return["filter-id-in",["literal",e]];default:return e.length>200&&!e.some(function(t){return typeof t!=typeof e[0]})?["filter-in-large",t,["literal",e.sort($e)]]:["filter-in-small",t,["literal",e]]}}function Ge(t){switch(t){case"$type":return!0;case"$id":return["filter-has-id"];default:return["filter-has",t]}}function Ye(t){return["!",t]}function We(t){return Ne(N(t.value))?Re(R({},t,{expressionContext:"filter",valueSpec:{value:"boolean"}})):function t(e){var r=e.value;var n=e.key;if("array"!==be(r))return[new q(n,r,"array expected, "+be(r)+" found")];var i=e.styleSpec;var a;var o=[];if(r.length<1)return[new q(n,r,"filter array must have at least 1 element")];o=o.concat(Ue({key:n+"[0]",value:r[0],valueSpec:i.filter_operator,style:e.style,styleSpec:e.styleSpec}));switch(U(r[0])){case"<":case"<=":case">":case">=":r.length>=2&&"$type"===U(r[1])&&o.push(new q(n,r,'"$type" cannot be use with operator "'+r[0]+'"'));case"==":case"!=":3!==r.length&&o.push(new q(n,r,'filter array for operator "'+r[0]+'" must have 3 elements'));case"in":case"!in":r.length>=2&&"string"!==(a=be(r[1]))&&o.push(new q(n+"[1]",r[1],"string expected, "+a+" found"));for(var s=2;s<r.length;s++)a=be(r[s]),"$type"===U(r[1])?o=o.concat(Ue({key:n+"["+s+"]",value:r[s],valueSpec:i.geometry_type,style:e.style,styleSpec:e.styleSpec})):"string"!==a&&"number"!==a&&"boolean"!==a&&o.push(new q(n+"["+s+"]",r[s],"string, number, or boolean expected, "+a+" found"));break;case"any":case"all":case"none":for(var u=1;u<r.length;u++)o=o.concat(t({key:n+"["+u+"]",value:r[u],style:e.style,styleSpec:e.styleSpec}));break;case"has":case"!has":a=be(r[1]),2!==r.length?o.push(new q(n,r,'filter array for "'+r[0]+'" operator must have 2 elements')):"string"!==a&&o.push(new q(n+"[1]",r[1],"string expected, "+a+" found"));}return o}(t)}function Qe(t,e){var r=t.key,n=t.style,i=t.styleSpec,a=t.value,o=t.objectKey,s=i[e+"_"+t.layerType];if(!s)return[];var u=o.match(/^(.*)-transition$/);if("paint"===e&&u&&s[u[1]]&&s[u[1]].transition)return sr({key:r,value:a,valueSpec:i.transition,style:n,styleSpec:i});var l,p=t.valueSpec||s[o];if(!p)return[new q(r,a,'unknown property "'+o+'"')];if("string"===be(a)&&Qt(p)&&!p.tokens&&(l=/^{([^}]+)}$/.exec(a)))return[new q(r,a,'"'+o+'" does not support interpolation syntax\nUse an identity property function instead: `{ "type": "identity", "property": '+JSON.stringify(l[1])+" }`.")];var h=[];return"symbol"===t.layerType&&("text-field"===o&&n&&!n.glyphs&&h.push(new q(r,a,'use of "text-field" requires a style "glyphs" property')),"text-font"===o&&we(N(a))&&"identity"===U(a.type)&&h.push(new q(r,a,'"text-font" does not support identity functions'))),h.concat(sr({key:t.key,value:a,valueSpec:p,style:n,styleSpec:i,expressionContext:"property",propertyType:e,propertyKey:o}))}function tr(t){return Qe(t,"paint")}function er(t){return Qe(t,"layout")}function rr(t){var e=[],r=t.value,n=t.key,i=t.style,a=t.styleSpec;r.type||r.ref||e.push(new q(n,r,'either "type" or "ref" is required'));var o,s=U(r.type),u=U(r.ref);if(r.id)for(var l=U(r.id),p=0;p<t.arrayIndex;p++){var h=i.layers[p];U(h.id)===l&&e.push(new q(n,r.id,'duplicate layer id "'+r.id+'", previously used at line '+h.id.__line__));}if("ref"in r)["type","source","source-layer","filter","layout"].forEach(function(t){t in r&&e.push(new q(n,r[t],'"'+t+'" is prohibited for ref layers'));}),i.layers.forEach(function(t){U(t.id)===u&&(o=t);}),o?o.ref?e.push(new q(n,r.ref,"ref cannot reference another ref layer")):s=U(o.type):e.push(new q(n,r.ref,'ref layer "'+u+'" not found'));else if("background"!==s)if(r.source){var c=i.sources&&i.sources[r.source],f=c&&U(c.type);c?"vector"===f&&"raster"===s?e.push(new q(n,r.source,'layer "'+r.id+'" requires a raster source')):"raster"===f&&"raster"!==s?e.push(new q(n,r.source,'layer "'+r.id+'" requires a vector source')):"vector"!==f||r["source-layer"]?"raster-dem"===f&&"hillshade"!==s?e.push(new q(n,r.source,"raster-dem source can only be used with layer type 'hillshade'.")):"line"!==s||!r.paint||!r.paint["line-gradient"]||"geojson"===f&&c.lineMetrics||e.push(new q(n,r,'layer "'+r.id+'" specifies a line-gradient, which requires a GeoJSON source with `lineMetrics` enabled.')):e.push(new q(n,r,'layer "'+r.id+'" must specify a "source-layer"')):e.push(new q(n,r.source,'source "'+r.source+'" not found'));}else e.push(new q(n,r,'missing required property "source"'));return e=e.concat(Oe({key:n,value:r,valueSpec:a.layer,style:t.style,styleSpec:t.styleSpec,objectElementValidators:{"*":function(){return[]},type:function(){return sr({key:n+".type",value:r.type,valueSpec:a.layer.type,style:t.style,styleSpec:t.styleSpec,object:r,objectKey:"type"})},filter:We,layout:function(t){return Oe({layer:r,key:t.key,value:t.value,style:t.style,styleSpec:t.styleSpec,objectElementValidators:{"*":function(t){return er(R({layerType:s},t))}}})},paint:function(t){return Oe({layer:r,key:t.key,value:t.value,style:t.style,styleSpec:t.styleSpec,objectElementValidators:{"*":function(t){return tr(R({layerType:s},t))}}})}}}))}function nr(t){var e=t.value,r=t.key,n=t.styleSpec,i=t.style;if(!e.type)return[new q(r,e,'"type" is required')];var a=U(e.type),o=[];switch(a){case"vector":case"raster":case"raster-dem":if(o=o.concat(Oe({key:r,value:e,valueSpec:n["source_"+a.replace("-","_")],style:t.style,styleSpec:n})),"url"in e)for(var s in e)["type","url","tileSize"].indexOf(s)<0&&o.push(new q(r+"."+s,e[s],'a source with a "url" property may not include a "'+s+'" property'));return o;case"geojson":return Oe({key:r,value:e,valueSpec:n.source_geojson,style:i,styleSpec:n});case"video":return Oe({key:r,value:e,valueSpec:n.source_video,style:i,styleSpec:n});case"image":return Oe({key:r,value:e,valueSpec:n.source_image,style:i,styleSpec:n});case"canvas":return o.push(new q(r,null,"Please use runtime APIs to add canvas sources, rather than including them in stylesheets.","source.canvas")),o;default:return Ue({key:r+".type",value:e.type,valueSpec:{values:["vector","raster","raster-dem","geojson","video","image"]},style:i,styleSpec:n})}}function ir(t){var e=t.value,r=t.styleSpec,n=r.light,i=t.style,a=[],o=be(e);if(void 0===e)return a;if("object"!==o)return a=a.concat([new q("light",e,"object expected, "+o+" found")]);for(var s in e){var u=s.match(/^(.*)-transition$/);a=u&&n[u[1]]&&n[u[1]].transition?a.concat(sr({key:s,value:e[s],valueSpec:r.transition,style:i,styleSpec:r})):n[s]?a.concat(sr({key:s,value:e[s],valueSpec:n[s],style:i,styleSpec:r})):a.concat([new q(s,e[s],'unknown property "'+s+'"')]);}return a}function ar(t){var e=t.value,r=t.key,n=be(e);return"string"!==n?[new q(r,e,"string expected, "+n+" found")]:[]}var or={"*":function(){return[]},array:De,boolean:function(t){var e=t.value,r=t.key,n=be(e);return"boolean"!==n?[new q(r,e,"boolean expected, "+n+" found")]:[]},number:qe,color:function(t){var e=t.key,r=t.value,n=be(r);return"string"!==n?[new q(e,r,"color expected, "+n+" found")]:null===it(r)?[new q(e,r,'color expected, "'+r+'" found')]:[]},constants:j,enum:Ue,filter:We,function:je,layer:rr,object:Oe,source:nr,light:ir,string:ar};function sr(t){var e=t.value,r=t.valueSpec,n=t.styleSpec;return r.expression&&we(U(e))?je(t):r.expression&&Ie(N(e))?Re(t):r.type&&or[r.type]?or[r.type](t):Oe(R({},t,{valueSpec:r.type?n[r.type]:r}))}function ur(t){var e=t.value,r=t.key,n=ar(t);return n.length?n:(-1===e.indexOf("{fontstack}")&&n.push(new q(r,e,'"glyphs" url must include a "{fontstack}" token')),-1===e.indexOf("{range}")&&n.push(new q(r,e,'"glyphs" url must include a "{range}" token')),n)}function lr(t,e){e=e||D;var r=[];return r=r.concat(sr({key:"",value:t,valueSpec:e.$root,styleSpec:e,style:t,objectElementValidators:{glyphs:ur,"*":function(){return[]}}})),t.constants&&(r=r.concat(j({key:"constants",value:t.constants,style:t,styleSpec:e}))),pr(r)}function pr(t){return[].concat(t).sort(function(t,e){return t.line-e.line})}function hr(t){return function(){return pr(t.apply(this,arguments))}}lr.source=hr(nr),lr.light=hr(ir),lr.layer=hr(rr),lr.filter=hr(We),lr.paintProperty=hr(tr),lr.layoutProperty=hr(er);var cr=lr,fr=lr.light,yr=lr.paintProperty,dr=lr.layoutProperty;function mr(t,e){var r=!1;if(e&&e.length)for(var n=0,i=e;n<i.length;n+=1){var a=i[n];t.fire(new L(new Error(a.message))),r=!0;}return r}var vr=xr,gr=3;function xr(t,e,r){var n=this.cells=[];if(t instanceof ArrayBuffer){this.arrayBuffer=t;var i=new Int32Array(this.arrayBuffer);t=i[0],e=i[1],r=i[2],this.d=e+2*r;for(var a=0;a<this.d*this.d;a++){var o=i[gr+a],s=i[gr+a+1];n.push(o===s?null:i.subarray(o,s));}var u=i[gr+n.length],l=i[gr+n.length+1];this.keys=i.subarray(u,l),this.bboxes=i.subarray(l),this.insert=this._insertReadonly;}else{this.d=e+2*r;for(var p=0;p<this.d*this.d;p++)n.push([]);this.keys=[],this.bboxes=[];}this.n=e,this.extent=t,this.padding=r,this.scale=e/t,this.uid=0;var h=r/e*t;this.min=-h,this.max=t+h;}xr.prototype.insert=function(t,e,r,n,i){this._forEachCell(e,r,n,i,this._insertCell,this.uid++),this.keys.push(t),this.bboxes.push(e),this.bboxes.push(r),this.bboxes.push(n),this.bboxes.push(i);},xr.prototype._insertReadonly=function(){throw"Cannot insert into a GridIndex created from an ArrayBuffer."},xr.prototype._insertCell=function(t,e,r,n,i,a){this.cells[i].push(a);},xr.prototype.query=function(t,e,r,n){var i=this.min,a=this.max;if(t<=i&&e<=i&&a<=r&&a<=n)return Array.prototype.slice.call(this.keys);var o=[];return this._forEachCell(t,e,r,n,this._queryCell,o,{}),o},xr.prototype._queryCell=function(t,e,r,n,i,a,o){var s=this.cells[i];if(null!==s)for(var u=this.keys,l=this.bboxes,p=0;p<s.length;p++){var h=s[p];if(void 0===o[h]){var c=4*h;t<=l[c+2]&&e<=l[c+3]&&r>=l[c+0]&&n>=l[c+1]?(o[h]=!0,a.push(u[h])):o[h]=!1;}}},xr.prototype._forEachCell=function(t,e,r,n,i,a,o){for(var s=this._convertToCellCoord(t),u=this._convertToCellCoord(e),l=this._convertToCellCoord(r),p=this._convertToCellCoord(n),h=s;h<=l;h++)for(var c=u;c<=p;c++){var f=this.d*c+h;if(i.call(this,t,e,r,n,f,a,o))return}},xr.prototype._convertToCellCoord=function(t){return Math.max(0,Math.min(this.d-1,Math.floor(t*this.scale)+this.padding))},xr.prototype.toArrayBuffer=function(){if(this.arrayBuffer)return this.arrayBuffer;for(var t=this.cells,e=gr+this.cells.length+1+1,r=0,n=0;n<this.cells.length;n++)r+=this.cells[n].length;var i=new Int32Array(e+r+this.keys.length+this.bboxes.length);i[0]=this.extent,i[1]=this.n,i[2]=this.padding;for(var a=e,o=0;o<t.length;o++){var s=t[o];i[gr+o]=a,i.set(s,a),a+=s.length;}return i[gr+t.length]=a,i.set(this.keys,a),a+=this.keys.length,i[gr+t.length+1]=a,i.set(this.bboxes,a),a+=this.bboxes.length,i.buffer};var br=self.ImageData,wr={};function _r(t,e,r){void 0===r&&(r={}),Object.defineProperty(e,"_classRegistryKey",{value:t,writeable:!1}),wr[t]={klass:e,omit:r.omit||[],shallow:r.shallow||[]};}for(var Ar in _r("Object",Object),vr.serialize=function(t,e){var r=t.toArrayBuffer();return e&&e.push(r),r},vr.deserialize=function(t){return new vr(t)},_r("Grid",vr),_r("Color",at),_r("Error",Error),_r("StylePropertyFunction",Fe),_r("StyleExpression",Ve,{omit:["_evaluator"]}),_r("ZoomDependentExpression",Te),_r("ZoomConstantExpression",Ee),_r("CompoundExpression",bt,{omit:["_evaluate"]}),Ut)Ut[Ar]._classRegistryKey||_r("Expression_"+Ar,Ut[Ar]);function kr(t,e){if(null==t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||t instanceof Boolean||t instanceof Number||t instanceof String||t instanceof Date||t instanceof RegExp)return t;if(t instanceof ArrayBuffer)return e&&e.push(t),t;if(ArrayBuffer.isView(t)){var r=t;return e&&e.push(r.buffer),r}if(t instanceof br)return e&&e.push(t.data.buffer),t;if(Array.isArray(t)){for(var n=[],i=0,a=t;i<a.length;i+=1){var o=a[i];n.push(kr(o,e));}return n}if("object"==typeof t){var s=t.constructor,u=s._classRegistryKey;if(!u)throw new Error("can't serialize object of unregistered class");var l={};if(s.serialize)l._serialized=s.serialize(t,e);else{for(var p in t)if(t.hasOwnProperty(p)&&!(wr[u].omit.indexOf(p)>=0)){var h=t[p];l[p]=wr[u].shallow.indexOf(p)>=0?h:kr(h,e);}t instanceof Error&&(l.message=t.message);}return{name:u,properties:l}}throw new Error("can't serialize object of type "+typeof t)}function zr(t){if(null==t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||t instanceof Boolean||t instanceof Number||t instanceof String||t instanceof Date||t instanceof RegExp||t instanceof ArrayBuffer||ArrayBuffer.isView(t)||t instanceof br)return t;if(Array.isArray(t))return t.map(function(t){return zr(t)});if("object"==typeof t){var e=t,r=e.name,n=e.properties;if(!r)throw new Error("can't deserialize object of anonymous class");var i=wr[r].klass;if(!i)throw new Error("can't deserialize unregistered class "+r);if(i.deserialize)return i.deserialize(n._serialized);for(var a=Object.create(i.prototype),o=0,s=Object.keys(n);o<s.length;o+=1){var u=s[o];a[u]=wr[r].shallow.indexOf(u)>=0?n[u]:zr(n[u]);}return a}throw new Error("can't deserialize object of type "+typeof t)}var Sr=function(){this.first=!0;};Sr.prototype.update=function(t,e){var r=Math.floor(t);return this.first?(this.first=!1,this.lastIntegerZoom=r,this.lastIntegerZoomTime=0,this.lastZoom=t,this.lastFloorZoom=r,!0):(this.lastFloorZoom>r?(this.lastIntegerZoom=r+1,this.lastIntegerZoomTime=e):this.lastFloorZoom<r&&(this.lastIntegerZoom=r,this.lastIntegerZoomTime=e),t!==this.lastZoom&&(this.lastZoom=t,this.lastFloorZoom=r,!0))};var Mr={"Latin-1 Supplement":function(t){return t>=128&&t<=255},Arabic:function(t){return t>=1536&&t<=1791},"Arabic Supplement":function(t){return t>=1872&&t<=1919},"Arabic Extended-A":function(t){return t>=2208&&t<=2303},"Hangul Jamo":function(t){return t>=4352&&t<=4607},"Unified Canadian Aboriginal Syllabics":function(t){return t>=5120&&t<=5759},Khmer:function(t){return t>=6016&&t<=6143},"Unified Canadian Aboriginal Syllabics Extended":function(t){return t>=6320&&t<=6399},"General Punctuation":function(t){return t>=8192&&t<=8303},"Letterlike Symbols":function(t){return t>=8448&&t<=8527},"Number Forms":function(t){return t>=8528&&t<=8591},"Miscellaneous Technical":function(t){return t>=8960&&t<=9215},"Control Pictures":function(t){return t>=9216&&t<=9279},"Optical Character Recognition":function(t){return t>=9280&&t<=9311},"Enclosed Alphanumerics":function(t){return t>=9312&&t<=9471},"Geometric Shapes":function(t){return t>=9632&&t<=9727},"Miscellaneous Symbols":function(t){return t>=9728&&t<=9983},"Miscellaneous Symbols and Arrows":function(t){return t>=11008&&t<=11263},"CJK Radicals Supplement":function(t){return t>=11904&&t<=12031},"Kangxi Radicals":function(t){return t>=12032&&t<=12255},"Ideographic Description Characters":function(t){return t>=12272&&t<=12287},"CJK Symbols and Punctuation":function(t){return t>=12288&&t<=12351},Hiragana:function(t){return t>=12352&&t<=12447},Katakana:function(t){return t>=12448&&t<=12543},Bopomofo:function(t){return t>=12544&&t<=12591},"Hangul Compatibility Jamo":function(t){return t>=12592&&t<=12687},Kanbun:function(t){return t>=12688&&t<=12703},"Bopomofo Extended":function(t){return t>=12704&&t<=12735},"CJK Strokes":function(t){return t>=12736&&t<=12783},"Katakana Phonetic Extensions":function(t){return t>=12784&&t<=12799},"Enclosed CJK Letters and Months":function(t){return t>=12800&&t<=13055},"CJK Compatibility":function(t){return t>=13056&&t<=13311},"CJK Unified Ideographs Extension A":function(t){return t>=13312&&t<=19903},"Yijing Hexagram Symbols":function(t){return t>=19904&&t<=19967},"CJK Unified Ideographs":function(t){return t>=19968&&t<=40959},"Yi Syllables":function(t){return t>=40960&&t<=42127},"Yi Radicals":function(t){return t>=42128&&t<=42191},"Hangul Jamo Extended-A":function(t){return t>=43360&&t<=43391},"Hangul Syllables":function(t){return t>=44032&&t<=55215},"Hangul Jamo Extended-B":function(t){return t>=55216&&t<=55295},"Private Use Area":function(t){return t>=57344&&t<=63743},"CJK Compatibility Ideographs":function(t){return t>=63744&&t<=64255},"Arabic Presentation Forms-A":function(t){return t>=64336&&t<=65023},"Vertical Forms":function(t){return t>=65040&&t<=65055},"CJK Compatibility Forms":function(t){return t>=65072&&t<=65103},"Small Form Variants":function(t){return t>=65104&&t<=65135},"Arabic Presentation Forms-B":function(t){return t>=65136&&t<=65279},"Halfwidth and Fullwidth Forms":function(t){return t>=65280&&t<=65519}};function Br(t){for(var e=0,r=t;e<r.length;e+=1){if(Ir(r[e].charCodeAt(0)))return!0}return!1}function Vr(t){return!Mr.Arabic(t)&&(!Mr["Arabic Supplement"](t)&&(!Mr["Arabic Extended-A"](t)&&(!Mr["Arabic Presentation Forms-A"](t)&&!Mr["Arabic Presentation Forms-B"](t))))}function Ir(t){return 746===t||747===t||!(t<4352)&&(!!Mr["Bopomofo Extended"](t)||(!!Mr.Bopomofo(t)||(!(!Mr["CJK Compatibility Forms"](t)||t>=65097&&t<=65103)||(!!Mr["CJK Compatibility Ideographs"](t)||(!!Mr["CJK Compatibility"](t)||(!!Mr["CJK Radicals Supplement"](t)||(!!Mr["CJK Strokes"](t)||(!(!Mr["CJK Symbols and Punctuation"](t)||t>=12296&&t<=12305||t>=12308&&t<=12319||12336===t)||(!!Mr["CJK Unified Ideographs Extension A"](t)||(!!Mr["CJK Unified Ideographs"](t)||(!!Mr["Enclosed CJK Letters and Months"](t)||(!!Mr["Hangul Compatibility Jamo"](t)||(!!Mr["Hangul Jamo Extended-A"](t)||(!!Mr["Hangul Jamo Extended-B"](t)||(!!Mr["Hangul Jamo"](t)||(!!Mr["Hangul Syllables"](t)||(!!Mr.Hiragana(t)||(!!Mr["Ideographic Description Characters"](t)||(!!Mr.Kanbun(t)||(!!Mr["Kangxi Radicals"](t)||(!!Mr["Katakana Phonetic Extensions"](t)||(!(!Mr.Katakana(t)||12540===t)||(!(!Mr["Halfwidth and Fullwidth Forms"](t)||65288===t||65289===t||65293===t||t>=65306&&t<=65310||65339===t||65341===t||65343===t||t>=65371&&t<=65503||65507===t||t>=65512&&t<=65519)||(!(!Mr["Small Form Variants"](t)||t>=65112&&t<=65118||t>=65123&&t<=65126)||(!!Mr["Unified Canadian Aboriginal Syllabics"](t)||(!!Mr["Unified Canadian Aboriginal Syllabics Extended"](t)||(!!Mr["Vertical Forms"](t)||(!!Mr["Yijing Hexagram Symbols"](t)||(!!Mr["Yi Syllables"](t)||!!Mr["Yi Radicals"](t))))))))))))))))))))))))))))))}function Cr(t){return!(Ir(t)||function(t){return!!(Mr["Latin-1 Supplement"](t)&&(167===t||169===t||174===t||177===t||188===t||189===t||190===t||215===t||247===t)||Mr["General Punctuation"](t)&&(8214===t||8224===t||8225===t||8240===t||8241===t||8251===t||8252===t||8258===t||8263===t||8264===t||8265===t||8273===t)||Mr["Letterlike Symbols"](t)||Mr["Number Forms"](t)||Mr["Miscellaneous Technical"](t)&&(t>=8960&&t<=8967||t>=8972&&t<=8991||t>=8996&&t<=9e3||9003===t||t>=9085&&t<=9114||t>=9150&&t<=9165||9167===t||t>=9169&&t<=9179||t>=9186&&t<=9215)||Mr["Control Pictures"](t)&&9251!==t||Mr["Optical Character Recognition"](t)||Mr["Enclosed Alphanumerics"](t)||Mr["Geometric Shapes"](t)||Mr["Miscellaneous Symbols"](t)&&!(t>=9754&&t<=9759)||Mr["Miscellaneous Symbols and Arrows"](t)&&(t>=11026&&t<=11055||t>=11088&&t<=11097||t>=11192&&t<=11243)||Mr["CJK Symbols and Punctuation"](t)||Mr.Katakana(t)||Mr["Private Use Area"](t)||Mr["CJK Compatibility Forms"](t)||Mr["Small Form Variants"](t)||Mr["Halfwidth and Fullwidth Forms"](t)||8734===t||8756===t||8757===t||t>=9984&&t<=10087||t>=10102&&t<=10131||65532===t||65533===t)}(t))}function Er(t,e){return!(!e&&(t>=1424&&t<=2303||Mr["Arabic Presentation Forms-A"](t)||Mr["Arabic Presentation Forms-B"](t)))&&!(t>=2304&&t<=3583||t>=3840&&t<=4255||Mr.Khmer(t))}var Tr,Pr=!1,Fr=null,Lr=!1,Or=new O,Dr={applyArabicShaping:null,processBidirectionalText:null,isLoaded:function(){return Lr||null!=Dr.applyArabicShaping}},qr=function(t,e){this.zoom=t,e?(this.now=e.now,this.fadeDuration=e.fadeDuration,this.zoomHistory=e.zoomHistory,this.transition=e.transition):(this.now=0,this.fadeDuration=0,this.zoomHistory=new Sr,this.transition={});};qr.prototype.isSupportedScript=function(t){return function(t,e){for(var r=0,n=t;r<n.length;r+=1)if(!Er(n[r].charCodeAt(0),e))return!1;return!0}(t,Dr.isLoaded())},qr.prototype.crossFadingFactor=function(){return 0===this.fadeDuration?1:Math.min((this.now-this.zoomHistory.lastIntegerZoomTime)/this.fadeDuration,1)};var jr=function(t,e){this.property=t,this.value=e,this.expression=Le(void 0===e?t.specification.default:e,t.specification);};jr.prototype.isDataDriven=function(){return"source"===this.expression.kind||"composite"===this.expression.kind},jr.prototype.possiblyEvaluate=function(t){return this.property.possiblyEvaluate(this,t)};var Rr=function(t){this.property=t,this.value=new jr(t,void 0);};Rr.prototype.transitioned=function(t,e){return new Nr(this.property,this.value,e,v({},t.transition,this.transition),t.now)},Rr.prototype.untransitioned=function(){return new Nr(this.property,this.value,null,{},0)};var Ur=function(t){this._properties=t,this._values=Object.create(t.defaultTransitionablePropertyValues);};Ur.prototype.getValue=function(t){return k(this._values[t].value.value)},Ur.prototype.setValue=function(t,e){this._values.hasOwnProperty(t)||(this._values[t]=new Rr(this._values[t].property)),this._values[t].value=new jr(this._values[t].property,null===e?void 0:k(e));},Ur.prototype.getTransition=function(t){return k(this._values[t].transition)},Ur.prototype.setTransition=function(t,e){this._values.hasOwnProperty(t)||(this._values[t]=new Rr(this._values[t].property)),this._values[t].transition=k(e)||void 0;},Ur.prototype.serialize=function(){for(var t={},e=0,r=Object.keys(this._values);e<r.length;e+=1){var n=r[e],i=this.getValue(n);void 0!==i&&(t[n]=i);var a=this.getTransition(n);void 0!==a&&(t[n+"-transition"]=a);}return t},Ur.prototype.transitioned=function(t,e){for(var r=new Zr(this._properties),n=0,i=Object.keys(this._values);n<i.length;n+=1){var a=i[n];r._values[a]=this._values[a].transitioned(t,e._values[a]);}return r},Ur.prototype.untransitioned=function(){for(var t=new Zr(this._properties),e=0,r=Object.keys(this._values);e<r.length;e+=1){var n=r[e];t._values[n]=this._values[n].untransitioned();}return t};var Nr=function(t,e,r,n,i){this.property=t,this.value=e,this.begin=i+n.delay||0,this.end=this.begin+n.duration||0,t.specification.transition&&(n.delay||n.duration)&&(this.prior=r);};Nr.prototype.possiblyEvaluate=function(t){var e=t.now||0,r=this.value.possiblyEvaluate(t),n=this.prior;if(n){if(e>this.end)return this.prior=null,r;if(this.value.isDataDriven())return this.prior=null,r;if(e<this.begin)return n.possiblyEvaluate(t);var i=(e-this.begin)/(this.end-this.begin);return this.property.interpolate(n.possiblyEvaluate(t),r,function(t){if(t<=0)return 0;if(t>=1)return 1;var e=t*t,r=e*t;return 4*(t<.5?r:3*(t-e)+r-.75)}(i))}return r};var Zr=function(t){this._properties=t,this._values=Object.create(t.defaultTransitioningPropertyValues);};Zr.prototype.possiblyEvaluate=function(t){for(var e=new Jr(this._properties),r=0,n=Object.keys(this._values);r<n.length;r+=1){var i=n[r];e._values[i]=this._values[i].possiblyEvaluate(t);}return e},Zr.prototype.hasTransition=function(){for(var t=0,e=Object.keys(this._values);t<e.length;t+=1){var r=e[t];if(this._values[r].prior)return!0}return!1};var Xr=function(t){this._properties=t,this._values=Object.create(t.defaultPropertyValues);};Xr.prototype.getValue=function(t){return k(this._values[t].value)},Xr.prototype.setValue=function(t,e){this._values[t]=new jr(this._values[t].property,null===e?void 0:k(e));},Xr.prototype.serialize=function(){for(var t={},e=0,r=Object.keys(this._values);e<r.length;e+=1){var n=r[e],i=this.getValue(n);void 0!==i&&(t[n]=i);}return t},Xr.prototype.possiblyEvaluate=function(t){for(var e=new Jr(this._properties),r=0,n=Object.keys(this._values);r<n.length;r+=1){var i=n[r];e._values[i]=this._values[i].possiblyEvaluate(t);}return e};var $r=function(t,e,r){this.property=t,this.value=e,this.globals=r;};$r.prototype.isConstant=function(){return"constant"===this.value.kind},$r.prototype.constantOr=function(t){return"constant"===this.value.kind?this.value.value:t},$r.prototype.evaluate=function(t,e){return this.property.evaluate(this.value,this.globals,t,e)};var Jr=function(t){this._properties=t,this._values=Object.create(t.defaultPossiblyEvaluatedValues);};Jr.prototype.get=function(t){return this._values[t]};var Hr=function(t){this.specification=t;};Hr.prototype.possiblyEvaluate=function(t,e){return t.expression.evaluate(e)},Hr.prototype.interpolate=function(t,e,r){var n=Vt[this.specification.type];return n?n(t,e,r):t};var Kr=function(t){this.specification=t;};Kr.prototype.possiblyEvaluate=function(t,e){return"constant"===t.expression.kind||"camera"===t.expression.kind?new $r(this,{kind:"constant",value:t.expression.evaluate(e)},e):new $r(this,t.expression,e)},Kr.prototype.interpolate=function(t,e,r){if("constant"!==t.value.kind||"constant"!==e.value.kind)return t;if(void 0===t.value.value||void 0===e.value.value)return new $r(this,{kind:"constant",value:void 0},t.globals);var n=Vt[this.specification.type];return n?new $r(this,{kind:"constant",value:n(t.value.value,e.value.value,r)},t.globals):t},Kr.prototype.evaluate=function(t,e,r,n){return"constant"===t.kind?t.value:t.evaluate(e,r,n)};var Gr=function(t){this.specification=t;};Gr.prototype.possiblyEvaluate=function(t,e){if(void 0!==t.value){if("constant"===t.expression.kind){var r=t.expression.evaluate(e);return this._calculate(r,r,r,e)}return this._calculate(t.expression.evaluate(new qr(Math.floor(e.zoom-1),e)),t.expression.evaluate(new qr(Math.floor(e.zoom),e)),t.expression.evaluate(new qr(Math.floor(e.zoom+1),e)),e)}},Gr.prototype._calculate=function(t,e,r,n){var i=n.zoom,a=i-Math.floor(i),o=n.crossFadingFactor();return i>n.zoomHistory.lastIntegerZoom?{from:t,to:e,fromScale:2,toScale:1,t:a+(1-a)*o}:{from:r,to:e,fromScale:.5,toScale:1,t:1-(1-o)*a}},Gr.prototype.interpolate=function(t){return t};var Yr=function(t){this.specification=t;};Yr.prototype.possiblyEvaluate=function(t,e){return!!t.expression.evaluate(e)},Yr.prototype.interpolate=function(){return!1};var Wr=function(t){for(var e in this.properties=t,this.defaultPropertyValues={},this.defaultTransitionablePropertyValues={},this.defaultTransitioningPropertyValues={},this.defaultPossiblyEvaluatedValues={},t){var r=t[e],n=this.defaultPropertyValues[e]=new jr(r,void 0),i=this.defaultTransitionablePropertyValues[e]=new Rr(r);this.defaultTransitioningPropertyValues[e]=i.untransitioned(),this.defaultPossiblyEvaluatedValues[e]=n.possiblyEvaluate({});}};_r("DataDrivenProperty",Kr),_r("DataConstantProperty",Hr),_r("CrossFadedProperty",Gr),_r("ColorRampProperty",Yr);var Qr=function(t){function e(e,r){for(var n in t.call(this),this.id=e.id,this.metadata=e.metadata,this.type=e.type,this.minzoom=e.minzoom,this.maxzoom=e.maxzoom,this.visibility="visible","background"!==e.type&&(this.source=e.source,this.sourceLayer=e["source-layer"],this.filter=e.filter),this._featureFilter=function(){return!0},r.layout&&(this._unevaluatedLayout=new Xr(r.layout)),this._transitionablePaint=new Ur(r.paint),e.paint)this.setPaintProperty(n,e.paint[n],{validate:!1});for(var i in e.layout)this.setLayoutProperty(i,e.layout[i],{validate:!1});this._transitioningPaint=this._transitionablePaint.untransitioned();}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.getLayoutProperty=function(t){return"visibility"===t?this.visibility:this._unevaluatedLayout.getValue(t)},e.prototype.setLayoutProperty=function(t,e,r){if(null!=e){var n="layers."+this.id+".layout."+t;if(this._validate(dr,n,t,e,r))return}"visibility"!==t?this._unevaluatedLayout.setValue(t,e):this.visibility="none"===e?e:"visible";},e.prototype.getPaintProperty=function(t){return w(t,"-transition")?this._transitionablePaint.getTransition(t.slice(0,-"-transition".length)):this._transitionablePaint.getValue(t)},e.prototype.setPaintProperty=function(t,e,r){if(null!=e){var n="layers."+this.id+".paint."+t;if(this._validate(yr,n,t,e,r))return!1}if(w(t,"-transition"))return this._transitionablePaint.setTransition(t.slice(0,-"-transition".length),e||void 0),!1;var i=this._transitionablePaint._values[t].value.isDataDriven();this._transitionablePaint.setValue(t,e);var a=this._transitionablePaint._values[t].value.isDataDriven();return this._handleSpecialPaintPropertyUpdate(t),a||i},e.prototype._handleSpecialPaintPropertyUpdate=function(t){},e.prototype.isHidden=function(t){return!!(this.minzoom&&t<this.minzoom)||(!!(this.maxzoom&&t>=this.maxzoom)||"none"===this.visibility)},e.prototype.updateTransitions=function(t){this._transitioningPaint=this._transitionablePaint.transitioned(t,this._transitioningPaint);},e.prototype.hasTransition=function(){return this._transitioningPaint.hasTransition()},e.prototype.recalculate=function(t){this._unevaluatedLayout&&(this.layout=this._unevaluatedLayout.possiblyEvaluate(t)),this.paint=this._transitioningPaint.possiblyEvaluate(t);},e.prototype.serialize=function(){var t={id:this.id,type:this.type,source:this.source,"source-layer":this.sourceLayer,metadata:this.metadata,minzoom:this.minzoom,maxzoom:this.maxzoom,filter:this.filter,layout:this._unevaluatedLayout&&this._unevaluatedLayout.serialize(),paint:this._transitionablePaint&&this._transitionablePaint.serialize()};return"none"===this.visibility&&(t.layout=t.layout||{},t.layout.visibility="none"),A(t,function(t,e){return!(void 0===t||"layout"===e&&!Object.keys(t).length||"paint"===e&&!Object.keys(t).length)})},e.prototype._validate=function(t,e,r,n,i){return(!i||!1!==i.validate)&&mr(this,t.call(cr,{key:e,layerType:this.type,objectKey:r,value:n,styleSpec:D,style:{glyphs:!0,sprite:!0}}))},e.prototype.hasOffscreenPass=function(){return!1},e.prototype.resize=function(){},e.prototype.isStateDependent=function(){for(var t in this.paint._values){var e=this.paint.get(t);if(e instanceof $r&&Qt(e.property.specification)&&(("source"===e.value.kind||"composite"===e.value.kind)&&e.value.isStateDependent))return!0}return!1},e}(O),tn={Int8:Int8Array,Uint8:Uint8Array,Int16:Int16Array,Uint16:Uint16Array,Int32:Int32Array,Uint32:Uint32Array,Float32:Float32Array},en=function(t,e){this._structArray=t,this._pos1=e*this.size,this._pos2=this._pos1/2,this._pos4=this._pos1/4,this._pos8=this._pos1/8;},rn=function(){this.isTransferred=!1,this.capacity=-1,this.resize(0);};function nn(t,e){void 0===e&&(e=1);var r=0,n=0;return{members:t.map(function(t){var i,a=(i=t.type,tn[i].BYTES_PER_ELEMENT),o=r=an(r,Math.max(e,a)),s=t.components||1;return n=Math.max(n,a),r+=a*s,{name:t.name,type:t.type,components:s,offset:o}}),size:an(r,Math.max(n,e)),alignment:e}}function an(t,e){return Math.ceil(t/e)*e}rn.serialize=function(t,e){return t._trim(),e&&(t.isTransferred=!0,e.push(t.arrayBuffer)),{length:t.length,arrayBuffer:t.arrayBuffer}},rn.deserialize=function(t){var e=Object.create(this.prototype);return e.arrayBuffer=t.arrayBuffer,e.length=t.length,e.capacity=t.arrayBuffer.byteLength/e.bytesPerElement,e._refreshViews(),e},rn.prototype._trim=function(){this.length!==this.capacity&&(this.capacity=this.length,this.arrayBuffer=this.arrayBuffer.slice(0,this.length*this.bytesPerElement),this._refreshViews());},rn.prototype.clear=function(){this.length=0;},rn.prototype.resize=function(t){this.reserve(t),this.length=t;},rn.prototype.reserve=function(t){if(t>this.capacity){this.capacity=Math.max(t,Math.floor(5*this.capacity),128),this.arrayBuffer=new ArrayBuffer(this.capacity*this.bytesPerElement);var e=this.uint8;this._refreshViews(),e&&this.uint8.set(e);}},rn.prototype._refreshViews=function(){throw new Error("_refreshViews() must be implemented by each concrete StructArray layout")};var on=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e){var r=this.length;this.resize(r+1);var n=2*r;return this.int16[n+0]=t,this.int16[n+1]=e,r},e.prototype.emplace=function(t,e,r){var n=2*t;return this.int16[n+0]=e,this.int16[n+1]=r,t},e}(rn);on.prototype.bytesPerElement=4,_r("StructArrayLayout2i4",on);var sn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r,n){var i=this.length;this.resize(i+1);var a=4*i;return this.int16[a+0]=t,this.int16[a+1]=e,this.int16[a+2]=r,this.int16[a+3]=n,i},e.prototype.emplace=function(t,e,r,n,i){var a=4*t;return this.int16[a+0]=e,this.int16[a+1]=r,this.int16[a+2]=n,this.int16[a+3]=i,t},e}(rn);sn.prototype.bytesPerElement=8,_r("StructArrayLayout4i8",sn);var un=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r,n,i,a){var o=this.length;this.resize(o+1);var s=6*o;return this.int16[s+0]=t,this.int16[s+1]=e,this.int16[s+2]=r,this.int16[s+3]=n,this.int16[s+4]=i,this.int16[s+5]=a,o},e.prototype.emplace=function(t,e,r,n,i,a,o){var s=6*t;return this.int16[s+0]=e,this.int16[s+1]=r,this.int16[s+2]=n,this.int16[s+3]=i,this.int16[s+4]=a,this.int16[s+5]=o,t},e}(rn);un.prototype.bytesPerElement=12,_r("StructArrayLayout2i4i12",un);var ln=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r,n,i,a,o,s){var u=this.length;this.resize(u+1);var l=6*u,p=12*u;return this.int16[l+0]=t,this.int16[l+1]=e,this.int16[l+2]=r,this.int16[l+3]=n,this.uint8[p+8]=i,this.uint8[p+9]=a,this.uint8[p+10]=o,this.uint8[p+11]=s,u},e.prototype.emplace=function(t,e,r,n,i,a,o,s,u){var l=6*t,p=12*t;return this.int16[l+0]=e,this.int16[l+1]=r,this.int16[l+2]=n,this.int16[l+3]=i,this.uint8[p+8]=a,this.uint8[p+9]=o,this.uint8[p+10]=s,this.uint8[p+11]=u,t},e}(rn);ln.prototype.bytesPerElement=12,_r("StructArrayLayout4i4ub12",ln);var pn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r,n,i,a,o,s){var u=this.length;this.resize(u+1);var l=8*u;return this.int16[l+0]=t,this.int16[l+1]=e,this.int16[l+2]=r,this.int16[l+3]=n,this.uint16[l+4]=i,this.uint16[l+5]=a,this.uint16[l+6]=o,this.uint16[l+7]=s,u},e.prototype.emplace=function(t,e,r,n,i,a,o,s,u){var l=8*t;return this.int16[l+0]=e,this.int16[l+1]=r,this.int16[l+2]=n,this.int16[l+3]=i,this.uint16[l+4]=a,this.uint16[l+5]=o,this.uint16[l+6]=s,this.uint16[l+7]=u,t},e}(rn);pn.prototype.bytesPerElement=16,_r("StructArrayLayout4i4ui16",pn);var hn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r){var n=this.length;this.resize(n+1);var i=3*n;return this.float32[i+0]=t,this.float32[i+1]=e,this.float32[i+2]=r,n},e.prototype.emplace=function(t,e,r,n){var i=3*t;return this.float32[i+0]=e,this.float32[i+1]=r,this.float32[i+2]=n,t},e}(rn);hn.prototype.bytesPerElement=12,_r("StructArrayLayout3f12",hn);var cn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint32=new Uint32Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t){var e=this.length;this.resize(e+1);var r=1*e;return this.uint32[r+0]=t,e},e.prototype.emplace=function(t,e){var r=1*t;return this.uint32[r+0]=e,t},e}(rn);cn.prototype.bytesPerElement=4,_r("StructArrayLayout1ul4",cn);var fn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer),this.uint32=new Uint32Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r,n,i,a,o,s,u,l,p){var h=this.length;this.resize(h+1);var c=12*h,f=6*h;return this.int16[c+0]=t,this.int16[c+1]=e,this.int16[c+2]=r,this.int16[c+3]=n,this.int16[c+4]=i,this.int16[c+5]=a,this.uint32[f+3]=o,this.uint16[c+8]=s,this.uint16[c+9]=u,this.int16[c+10]=l,this.int16[c+11]=p,h},e.prototype.emplace=function(t,e,r,n,i,a,o,s,u,l,p,h){var c=12*t,f=6*t;return this.int16[c+0]=e,this.int16[c+1]=r,this.int16[c+2]=n,this.int16[c+3]=i,this.int16[c+4]=a,this.int16[c+5]=o,this.uint32[f+3]=s,this.uint16[c+8]=u,this.uint16[c+9]=l,this.int16[c+10]=p,this.int16[c+11]=h,t},e}(rn);fn.prototype.bytesPerElement=24,_r("StructArrayLayout6i1ul2ui2i24",fn);var yn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r,n,i,a){var o=this.length;this.resize(o+1);var s=6*o;return this.int16[s+0]=t,this.int16[s+1]=e,this.int16[s+2]=r,this.int16[s+3]=n,this.int16[s+4]=i,this.int16[s+5]=a,o},e.prototype.emplace=function(t,e,r,n,i,a,o){var s=6*t;return this.int16[s+0]=e,this.int16[s+1]=r,this.int16[s+2]=n,this.int16[s+3]=i,this.int16[s+4]=a,this.int16[s+5]=o,t},e}(rn);yn.prototype.bytesPerElement=12,_r("StructArrayLayout2i2i2i12",yn);var dn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e){var r=this.length;this.resize(r+1);var n=4*r;return this.uint8[n+0]=t,this.uint8[n+1]=e,r},e.prototype.emplace=function(t,e,r){var n=4*t;return this.uint8[n+0]=e,this.uint8[n+1]=r,t},e}(rn);dn.prototype.bytesPerElement=4,_r("StructArrayLayout2ub4",dn);var mn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer),this.uint32=new Uint32Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r,n,i,a,o,s,u,l,p,h,c,f){var y=this.length;this.resize(y+1);var d=20*y,m=10*y,v=40*y;return this.int16[d+0]=t,this.int16[d+1]=e,this.uint16[d+2]=r,this.uint16[d+3]=n,this.uint32[m+2]=i,this.uint32[m+3]=a,this.uint32[m+4]=o,this.uint16[d+10]=s,this.uint16[d+11]=u,this.uint16[d+12]=l,this.float32[m+7]=p,this.float32[m+8]=h,this.uint8[v+36]=c,this.uint8[v+37]=f,y},e.prototype.emplace=function(t,e,r,n,i,a,o,s,u,l,p,h,c,f,y){var d=20*t,m=10*t,v=40*t;return this.int16[d+0]=e,this.int16[d+1]=r,this.uint16[d+2]=n,this.uint16[d+3]=i,this.uint32[m+2]=a,this.uint32[m+3]=o,this.uint32[m+4]=s,this.uint16[d+10]=u,this.uint16[d+11]=l,this.uint16[d+12]=p,this.float32[m+7]=h,this.float32[m+8]=c,this.uint8[v+36]=f,this.uint8[v+37]=y,t},e}(rn);mn.prototype.bytesPerElement=40,_r("StructArrayLayout2i2ui3ul3ui2f2ub40",mn);var vn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t){var e=this.length;this.resize(e+1);var r=1*e;return this.float32[r+0]=t,e},e.prototype.emplace=function(t,e){var r=1*t;return this.float32[r+0]=e,t},e}(rn);vn.prototype.bytesPerElement=4,_r("StructArrayLayout1f4",vn);var gn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.int16=new Int16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r){var n=this.length;this.resize(n+1);var i=3*n;return this.int16[i+0]=t,this.int16[i+1]=e,this.int16[i+2]=r,n},e.prototype.emplace=function(t,e,r,n){var i=3*t;return this.int16[i+0]=e,this.int16[i+1]=r,this.int16[i+2]=n,t},e}(rn);gn.prototype.bytesPerElement=6,_r("StructArrayLayout3i6",gn);var xn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint32=new Uint32Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r){var n=this.length;this.resize(n+1);var i=2*n,a=4*n;return this.uint32[i+0]=t,this.uint16[a+2]=e,this.uint16[a+3]=r,n},e.prototype.emplace=function(t,e,r,n){var i=2*t,a=4*t;return this.uint32[i+0]=e,this.uint16[a+2]=r,this.uint16[a+3]=n,t},e}(rn);xn.prototype.bytesPerElement=8,_r("StructArrayLayout1ul2ui8",xn);var bn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r){var n=this.length;this.resize(n+1);var i=3*n;return this.uint16[i+0]=t,this.uint16[i+1]=e,this.uint16[i+2]=r,n},e.prototype.emplace=function(t,e,r,n){var i=3*t;return this.uint16[i+0]=e,this.uint16[i+1]=r,this.uint16[i+2]=n,t},e}(rn);bn.prototype.bytesPerElement=6,_r("StructArrayLayout3ui6",bn);var wn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.uint16=new Uint16Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e){var r=this.length;this.resize(r+1);var n=2*r;return this.uint16[n+0]=t,this.uint16[n+1]=e,r},e.prototype.emplace=function(t,e,r){var n=2*t;return this.uint16[n+0]=e,this.uint16[n+1]=r,t},e}(rn);wn.prototype.bytesPerElement=4,_r("StructArrayLayout2ui4",wn);var _n=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e){var r=this.length;this.resize(r+1);var n=2*r;return this.float32[n+0]=t,this.float32[n+1]=e,r},e.prototype.emplace=function(t,e,r){var n=2*t;return this.float32[n+0]=e,this.float32[n+1]=r,t},e}(rn);_n.prototype.bytesPerElement=8,_r("StructArrayLayout2f8",_n);var An=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._refreshViews=function(){this.uint8=new Uint8Array(this.arrayBuffer),this.float32=new Float32Array(this.arrayBuffer);},e.prototype.emplaceBack=function(t,e,r,n){var i=this.length;this.resize(i+1);var a=4*i;return this.float32[a+0]=t,this.float32[a+1]=e,this.float32[a+2]=r,this.float32[a+3]=n,i},e.prototype.emplace=function(t,e,r,n,i){var a=4*t;return this.float32[a+0]=e,this.float32[a+1]=r,this.float32[a+2]=n,this.float32[a+3]=i,t},e}(rn);An.prototype.bytesPerElement=16,_r("StructArrayLayout4f16",An);var kn=function(t){function e(){t.apply(this,arguments);}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e;var r={anchorPointX:{configurable:!0},anchorPointY:{configurable:!0},x1:{configurable:!0},y1:{configurable:!0},x2:{configurable:!0},y2:{configurable:!0},featureIndex:{configurable:!0},sourceLayerIndex:{configurable:!0},bucketIndex:{configurable:!0},radius:{configurable:!0},signedDistanceFromAnchor:{configurable:!0},anchorPoint:{configurable:!0}};return r.anchorPointX.get=function(){return this._structArray.int16[this._pos2+0]},r.anchorPointX.set=function(t){this._structArray.int16[this._pos2+0]=t;},r.anchorPointY.get=function(){return this._structArray.int16[this._pos2+1]},r.anchorPointY.set=function(t){this._structArray.int16[this._pos2+1]=t;},r.x1.get=function(){return this._structArray.int16[this._pos2+2]},r.x1.set=function(t){this._structArray.int16[this._pos2+2]=t;},r.y1.get=function(){return this._structArray.int16[this._pos2+3]},r.y1.set=function(t){this._structArray.int16[this._pos2+3]=t;},r.x2.get=function(){return this._structArray.int16[this._pos2+4]},r.x2.set=function(t){this._structArray.int16[this._pos2+4]=t;},r.y2.get=function(){return this._structArray.int16[this._pos2+5]},r.y2.set=function(t){this._structArray.int16[this._pos2+5]=t;},r.featureIndex.get=function(){return this._structArray.uint32[this._pos4+3]},r.featureIndex.set=function(t){this._structArray.uint32[this._pos4+3]=t;},r.sourceLayerIndex.get=function(){return this._structArray.uint16[this._pos2+8]},r.sourceLayerIndex.set=function(t){this._structArray.uint16[this._pos2+8]=t;},r.bucketIndex.get=function(){return this._structArray.uint16[this._pos2+9]},r.bucketIndex.set=function(t){this._structArray.uint16[this._pos2+9]=t;},r.radius.get=function(){return this._structArray.int16[this._pos2+10]},r.radius.set=function(t){this._structArray.int16[this._pos2+10]=t;},r.signedDistanceFromAnchor.get=function(){return this._structArray.int16[this._pos2+11]},r.signedDistanceFromAnchor.set=function(t){this._structArray.int16[this._pos2+11]=t;},r.anchorPoint.get=function(){return new h(this.anchorPointX,this.anchorPointY)},Object.defineProperties(e.prototype,r),e}(en);kn.prototype.size=24;var zn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.get=function(t){return new kn(this,t)},e}(fn);_r("CollisionBoxArray",zn);var Sn=function(t){function e(){t.apply(this,arguments);}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e;var r={anchorX:{configurable:!0},anchorY:{configurable:!0},glyphStartIndex:{configurable:!0},numGlyphs:{configurable:!0},vertexStartIndex:{configurable:!0},lineStartIndex:{configurable:!0},lineLength:{configurable:!0},segment:{configurable:!0},lowerSize:{configurable:!0},upperSize:{configurable:!0},lineOffsetX:{configurable:!0},lineOffsetY:{configurable:!0},writingMode:{configurable:!0},hidden:{configurable:!0}};return r.anchorX.get=function(){return this._structArray.int16[this._pos2+0]},r.anchorX.set=function(t){this._structArray.int16[this._pos2+0]=t;},r.anchorY.get=function(){return this._structArray.int16[this._pos2+1]},r.anchorY.set=function(t){this._structArray.int16[this._pos2+1]=t;},r.glyphStartIndex.get=function(){return this._structArray.uint16[this._pos2+2]},r.glyphStartIndex.set=function(t){this._structArray.uint16[this._pos2+2]=t;},r.numGlyphs.get=function(){return this._structArray.uint16[this._pos2+3]},r.numGlyphs.set=function(t){this._structArray.uint16[this._pos2+3]=t;},r.vertexStartIndex.get=function(){return this._structArray.uint32[this._pos4+2]},r.vertexStartIndex.set=function(t){this._structArray.uint32[this._pos4+2]=t;},r.lineStartIndex.get=function(){return this._structArray.uint32[this._pos4+3]},r.lineStartIndex.set=function(t){this._structArray.uint32[this._pos4+3]=t;},r.lineLength.get=function(){return this._structArray.uint32[this._pos4+4]},r.lineLength.set=function(t){this._structArray.uint32[this._pos4+4]=t;},r.segment.get=function(){return this._structArray.uint16[this._pos2+10]},r.segment.set=function(t){this._structArray.uint16[this._pos2+10]=t;},r.lowerSize.get=function(){return this._structArray.uint16[this._pos2+11]},r.lowerSize.set=function(t){this._structArray.uint16[this._pos2+11]=t;},r.upperSize.get=function(){return this._structArray.uint16[this._pos2+12]},r.upperSize.set=function(t){this._structArray.uint16[this._pos2+12]=t;},r.lineOffsetX.get=function(){return this._structArray.float32[this._pos4+7]},r.lineOffsetX.set=function(t){this._structArray.float32[this._pos4+7]=t;},r.lineOffsetY.get=function(){return this._structArray.float32[this._pos4+8]},r.lineOffsetY.set=function(t){this._structArray.float32[this._pos4+8]=t;},r.writingMode.get=function(){return this._structArray.uint8[this._pos1+36]},r.writingMode.set=function(t){this._structArray.uint8[this._pos1+36]=t;},r.hidden.get=function(){return this._structArray.uint8[this._pos1+37]},r.hidden.set=function(t){this._structArray.uint8[this._pos1+37]=t;},Object.defineProperties(e.prototype,r),e}(en);Sn.prototype.size=40;var Mn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.get=function(t){return new Sn(this,t)},e}(mn);_r("PlacedSymbolArray",Mn);var Bn=function(t){function e(){t.apply(this,arguments);}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e;var r={offsetX:{configurable:!0}};return r.offsetX.get=function(){return this._structArray.float32[this._pos4+0]},r.offsetX.set=function(t){this._structArray.float32[this._pos4+0]=t;},Object.defineProperties(e.prototype,r),e}(en);Bn.prototype.size=4;var Vn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.getoffsetX=function(t){return this.float32[1*t+0]},e.prototype.get=function(t){return new Bn(this,t)},e}(vn);_r("GlyphOffsetArray",Vn);var In=function(t){function e(){t.apply(this,arguments);}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e;var r={x:{configurable:!0},y:{configurable:!0},tileUnitDistanceFromAnchor:{configurable:!0}};return r.x.get=function(){return this._structArray.int16[this._pos2+0]},r.x.set=function(t){this._structArray.int16[this._pos2+0]=t;},r.y.get=function(){return this._structArray.int16[this._pos2+1]},r.y.set=function(t){this._structArray.int16[this._pos2+1]=t;},r.tileUnitDistanceFromAnchor.get=function(){return this._structArray.int16[this._pos2+2]},r.tileUnitDistanceFromAnchor.set=function(t){this._structArray.int16[this._pos2+2]=t;},Object.defineProperties(e.prototype,r),e}(en);In.prototype.size=6;var Cn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.getx=function(t){return this.int16[3*t+0]},e.prototype.gety=function(t){return this.int16[3*t+1]},e.prototype.gettileUnitDistanceFromAnchor=function(t){return this.int16[3*t+2]},e.prototype.get=function(t){return new In(this,t)},e}(gn);_r("SymbolLineVertexArray",Cn);var En=function(t){function e(){t.apply(this,arguments);}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e;var r={featureIndex:{configurable:!0},sourceLayerIndex:{configurable:!0},bucketIndex:{configurable:!0}};return r.featureIndex.get=function(){return this._structArray.uint32[this._pos4+0]},r.featureIndex.set=function(t){this._structArray.uint32[this._pos4+0]=t;},r.sourceLayerIndex.get=function(){return this._structArray.uint16[this._pos2+2]},r.sourceLayerIndex.set=function(t){this._structArray.uint16[this._pos2+2]=t;},r.bucketIndex.get=function(){return this._structArray.uint16[this._pos2+3]},r.bucketIndex.set=function(t){this._structArray.uint16[this._pos2+3]=t;},Object.defineProperties(e.prototype,r),e}(en);En.prototype.size=8;var Tn=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.get=function(t){return new En(this,t)},e}(xn);_r("FeatureIndexArray",Tn);var Pn=nn([{name:"a_pos",components:2,type:"Int16"}],4).members,Fn=function(t){void 0===t&&(t=[]),this.segments=t;};Fn.prototype.prepareSegment=function(t,e,r){var n=this.segments[this.segments.length-1];return t>Fn.MAX_VERTEX_ARRAY_LENGTH&&S("Max vertices per segment is "+Fn.MAX_VERTEX_ARRAY_LENGTH+": bucket requested "+t),(!n||n.vertexLength+t>Fn.MAX_VERTEX_ARRAY_LENGTH)&&(n={vertexOffset:e.length,primitiveOffset:r.length,vertexLength:0,primitiveLength:0},this.segments.push(n)),n},Fn.prototype.get=function(){return this.segments},Fn.prototype.destroy=function(){for(var t=0,e=this.segments;t<e.length;t+=1){var r=e[t];for(var n in r.vaos)r.vaos[n].destroy();}},Fn.MAX_VERTEX_ARRAY_LENGTH=Math.pow(2,16)-1,_r("SegmentVector",Fn);var Ln=function(t,e){return 256*(t=m(Math.floor(t),0,255))+(e=m(Math.floor(e),0,255))};function On(t){return[Ln(255*t.r,255*t.g),Ln(255*t.b,255*t.a)]}var Dn=function(t,e,r){this.value=t,this.name=e,this.type=r,this.statistics={max:-1/0};};Dn.prototype.defines=function(){return["#define HAS_UNIFORM_u_"+this.name]},Dn.prototype.populatePaintArray=function(){},Dn.prototype.updatePaintArray=function(){},Dn.prototype.upload=function(){},Dn.prototype.destroy=function(){},Dn.prototype.setUniforms=function(t,e,r,n){var i=n.constantOr(this.value),a=t.gl;"color"===this.type?a.uniform4f(e.uniforms["u_"+this.name],i.r,i.g,i.b,i.a):a.uniform1f(e.uniforms["u_"+this.name],i);};var qn=function(t,e,r){this.expression=t,this.name=e,this.type=r,this.statistics={max:-1/0};var n="color"===r?_n:vn;this.paintVertexAttributes=[{name:"a_"+e,type:"Float32",components:"color"===r?2:1,offset:0}],this.paintVertexArray=new n;};qn.prototype.defines=function(){return[]},qn.prototype.populatePaintArray=function(t,e){var r=this.paintVertexArray,n=r.length;r.reserve(t);var i=this.expression.evaluate(new qr(0),e,{});if("color"===this.type)for(var a=On(i),o=n;o<t;o++)r.emplaceBack(a[0],a[1]);else{for(var s=n;s<t;s++)r.emplaceBack(i);this.statistics.max=Math.max(this.statistics.max,i);}},qn.prototype.updatePaintArray=function(t,e,r,n){var i=this.paintVertexArray,a=this.expression.evaluate({zoom:0},r,n);if("color"===this.type)for(var o=On(a),s=t;s<e;s++)i.emplace(s,o[0],o[1]);else{for(var u=t;u<e;u++)i.emplace(u,a);this.statistics.max=Math.max(this.statistics.max,a);}},qn.prototype.upload=function(t){this.paintVertexArray&&this.paintVertexArray.arrayBuffer&&(this.paintVertexBuffer&&this.paintVertexBuffer.buffer?this.paintVertexBuffer.updateData(this.paintVertexArray):this.paintVertexBuffer=t.createVertexBuffer(this.paintVertexArray,this.paintVertexAttributes,this.expression.isStateDependent));},qn.prototype.destroy=function(){this.paintVertexBuffer&&this.paintVertexBuffer.destroy();},qn.prototype.setUniforms=function(t,e){t.gl.uniform1f(e.uniforms["a_"+this.name+"_t"],0);};var jn=function(t,e,r,n,i){this.expression=t,this.name=e,this.type=r,this.useIntegerZoom=n,this.zoom=i,this.statistics={max:-1/0};var a="color"===r?An:_n;this.paintVertexAttributes=[{name:"a_"+e,type:"Float32",components:"color"===r?4:2,offset:0}],this.paintVertexArray=new a;};jn.prototype.defines=function(){return[]},jn.prototype.populatePaintArray=function(t,e){var r=this.paintVertexArray,n=r.length;r.reserve(t);var i=this.expression.evaluate(new qr(this.zoom),e,{}),a=this.expression.evaluate(new qr(this.zoom+1),e,{});if("color"===this.type)for(var o=On(i),s=On(a),u=n;u<t;u++)r.emplaceBack(o[0],o[1],s[0],s[1]);else{for(var l=n;l<t;l++)r.emplaceBack(i,a);this.statistics.max=Math.max(this.statistics.max,i,a);}},jn.prototype.updatePaintArray=function(t,e,r,n){var i=this.paintVertexArray,a=this.expression.evaluate({zoom:this.zoom},r,n),o=this.expression.evaluate({zoom:this.zoom+1},r,n);if("color"===this.type)for(var s=On(a),u=On(o),l=t;l<e;l++)i.emplace(l,s[0],s[1],u[0],u[1]);else{for(var p=t;p<e;p++)i.emplace(p,a,o);this.statistics.max=Math.max(this.statistics.max,a,o);}},jn.prototype.upload=function(t){this.paintVertexArray&&this.paintVertexArray.arrayBuffer&&(this.paintVertexBuffer&&this.paintVertexBuffer.buffer?this.paintVertexBuffer.updateData(this.paintVertexArray):this.paintVertexBuffer=t.createVertexBuffer(this.paintVertexArray,this.paintVertexAttributes,this.expression.isStateDependent));},jn.prototype.destroy=function(){this.paintVertexBuffer&&this.paintVertexBuffer.destroy();},jn.prototype.interpolationFactor=function(t){return this.useIntegerZoom?this.expression.interpolationFactor(Math.floor(t),this.zoom,this.zoom+1):this.expression.interpolationFactor(t,this.zoom,this.zoom+1)},jn.prototype.setUniforms=function(t,e,r){t.gl.uniform1f(e.uniforms["a_"+this.name+"_t"],this.interpolationFactor(r.zoom));};var Rn=function(){this.binders={},this.cacheKey="",this._buffers=[],this._idMap={},this._bufferOffset=0;};Rn.createDynamic=function(t,e,r){var n=new Rn,i=[];for(var a in t.paint._values)if(r(a)){var o=t.paint.get(a);if(o instanceof $r&&Qt(o.property.specification)){var s=Nn(a,t.type),u=o.property.specification.type,l=o.property.useIntegerZoom;"constant"===o.value.kind?(n.binders[a]=new Dn(o.value,s,u),i.push("/u_"+s)):"source"===o.value.kind?(n.binders[a]=new qn(o.value,s,u),i.push("/a_"+s)):(n.binders[a]=new jn(o.value,s,u,l,e),i.push("/z_"+s));}}return n.cacheKey=i.sort().join(""),n},Rn.prototype.populatePaintArrays=function(t,e,r){for(var n in this.binders)this.binders[n].populatePaintArray(t,e);if(e.id){var i=String(e.id);this._idMap[i]=this._idMap[i]||[],this._idMap[i].push({index:r,start:this._bufferOffset,end:t});}this._bufferOffset=t;},Rn.prototype.updatePaintArrays=function(t,e,r){var n=!1;for(var i in t){var a=this._idMap[i];if(a)for(var o=t[i],s=0,u=a;s<u.length;s+=1){var l=u[s],p=e.feature(l.index);for(var h in this.binders){var c=this.binders[h];if(!(c instanceof Dn)&&!0===c.expression.isStateDependent){var f=r.paint.get(h);c.expression=f.value,c.updatePaintArray(l.start,l.end,p,o),n=!0;}}}}return n},Rn.prototype.defines=function(){var t=[];for(var e in this.binders)t.push.apply(t,this.binders[e].defines());return t},Rn.prototype.setUniforms=function(t,e,r,n){for(var i in this.binders){this.binders[i].setUniforms(t,e,n,r.get(i));}},Rn.prototype.getPaintVertexBuffers=function(){return this._buffers},Rn.prototype.upload=function(t){for(var e in this.binders)this.binders[e].upload(t);var r=[];for(var n in this.binders){var i=this.binders[n];(i instanceof qn||i instanceof jn)&&i.paintVertexBuffer&&r.push(i.paintVertexBuffer);}this._buffers=r;},Rn.prototype.destroy=function(){for(var t in this.binders)this.binders[t].destroy();};var Un=function(t,e,r,n){void 0===n&&(n=function(){return!0}),this.programConfigurations={};for(var i=0,a=e;i<a.length;i+=1){var o=a[i];this.programConfigurations[o.id]=Rn.createDynamic(o,r,n),this.programConfigurations[o.id].layoutAttributes=t;}this.needsUpload=!1;};function Nn(t,e){return{"text-opacity":"opacity","icon-opacity":"opacity","text-color":"fill_color","icon-color":"fill_color","text-halo-color":"halo_color","icon-halo-color":"halo_color","text-halo-blur":"halo_blur","icon-halo-blur":"halo_blur","text-halo-width":"halo_width","icon-halo-width":"halo_width","line-gap-width":"gapwidth"}[t]||t.replace(e+"-","").replace(/-/g,"_")}Un.prototype.populatePaintArrays=function(t,e,r){for(var n in this.programConfigurations)this.programConfigurations[n].populatePaintArrays(t,e,r);this.needsUpload=!0;},Un.prototype.updatePaintArrays=function(t,e,r){for(var n=0,i=r;n<i.length;n+=1){var a=i[n];this.needsUpload=this.programConfigurations[a.id].updatePaintArrays(t,e,a)||this.needsUpload;}},Un.prototype.get=function(t){return this.programConfigurations[t]},Un.prototype.upload=function(t){if(this.needsUpload){for(var e in this.programConfigurations)this.programConfigurations[e].upload(t);this.needsUpload=!1;}},Un.prototype.destroy=function(){for(var t in this.programConfigurations)this.programConfigurations[t].destroy();},_r("ConstantBinder",Dn),_r("SourceExpressionBinder",qn),_r("CompositeExpressionBinder",jn),_r("ProgramConfiguration",Rn,{omit:["_buffers"]}),_r("ProgramConfigurationSet",Un);var Zn=8192;var Xn,$n=(Xn=16,{min:-1*Math.pow(2,Xn-1),max:Math.pow(2,Xn-1)-1});function Jn(t){for(var e=Zn/t.extent,r=t.loadGeometry(),n=0;n<r.length;n++)for(var i=r[n],a=0;a<i.length;a++){var o=i[a];o.x=Math.round(o.x*e),o.y=Math.round(o.y*e),(o.x<$n.min||o.x>$n.max||o.y<$n.min||o.y>$n.max)&&S("Geometry exceeds allowed extent, reduce your vector tile buffer size");}return r}function Hn(t,e,r,n,i){t.emplaceBack(2*e+(n+1)/2,2*r+(i+1)/2);}var Kn=function(t){this.zoom=t.zoom,this.overscaling=t.overscaling,this.layers=t.layers,this.layerIds=this.layers.map(function(t){return t.id}),this.index=t.index,this.layoutVertexArray=new on,this.indexArray=new bn,this.segments=new Fn,this.programConfigurations=new Un(Pn,t.layers,t.zoom);};function Gn(t,e,r){for(var n=0;n<t.length;n++){var i=t[n];if(ai(i,e))return!0;if(ri(e,i,r))return!0}return!1}function Yn(t,e){if(1===t.length&&1===t[0].length)return ii(e,t[0][0]);for(var r=0;r<e.length;r++)for(var n=e[r],i=0;i<n.length;i++)if(ii(t,n[i]))return!0;for(var a=0;a<t.length;a++){for(var o=t[a],s=0;s<o.length;s++)if(ii(e,o[s]))return!0;for(var u=0;u<e.length;u++)if(ti(o,e[u]))return!0}return!1}function Wn(t,e,r){for(var n=0;n<e.length;n++)for(var i=e[n],a=0;a<t.length;a++){var o=t[a];if(o.length>=3)for(var s=0;s<i.length;s++)if(ai(o,i[s]))return!0;if(Qn(o,i,r))return!0}return!1}function Qn(t,e,r){if(t.length>1){if(ti(t,e))return!0;for(var n=0;n<e.length;n++)if(ri(e[n],t,r))return!0}for(var i=0;i<t.length;i++)if(ri(t[i],e,r))return!0;return!1}function ti(t,e){if(0===t.length||0===e.length)return!1;for(var r=0;r<t.length-1;r++)for(var n=t[r],i=t[r+1],a=0;a<e.length-1;a++){if(ei(n,i,e[a],e[a+1]))return!0}return!1}function ei(t,e,r,n){return M(t,r,n)!==M(e,r,n)&&M(t,e,r)!==M(t,e,n)}function ri(t,e,r){var n=r*r;if(1===e.length)return t.distSqr(e[0])<n;for(var i=1;i<e.length;i++){if(ni(t,e[i-1],e[i])<n)return!0}return!1}function ni(t,e,r){var n=e.distSqr(r);if(0===n)return t.distSqr(e);var i=((t.x-e.x)*(r.x-e.x)+(t.y-e.y)*(r.y-e.y))/n;return i<0?t.distSqr(e):i>1?t.distSqr(r):t.distSqr(r.sub(e)._mult(i)._add(e))}function ii(t,e){for(var r,n,i,a=!1,o=0;o<t.length;o++)for(var s=0,u=(r=t[o]).length-1;s<r.length;u=s++)n=r[s],i=r[u],n.y>e.y!=i.y>e.y&&e.x<(i.x-n.x)*(e.y-n.y)/(i.y-n.y)+n.x&&(a=!a);return a}function ai(t,e){for(var r=!1,n=0,i=t.length-1;n<t.length;i=n++){var a=t[n],o=t[i];a.y>e.y!=o.y>e.y&&e.x<(o.x-a.x)*(e.y-a.y)/(o.y-a.y)+a.x&&(r=!r);}return r}function oi(t,e,r){var n=e.paint.get(t).value;return"constant"===n.kind?n.value:r.programConfigurations.get(e.id).binders[t].statistics.max}function si(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1])}function ui(t,e,r,n,i){if(!e[0]&&!e[1])return t;var a=h.convert(e);"viewport"===r&&a._rotate(-n);for(var o=[],s=0;s<t.length;s++){for(var u=t[s],l=[],p=0;p<u.length;p++)l.push(u[p].sub(a._mult(i)));o.push(l);}return o}Kn.prototype.populate=function(t,e){for(var r=0,n=t;r<n.length;r+=1){var i=n[r],a=i.feature,o=i.index,s=i.sourceLayerIndex;if(this.layers[0]._featureFilter(new qr(this.zoom),a)){var u=Jn(a);this.addFeature(a,u,o),e.featureIndex.insert(a,u,o,s,this.index);}}},Kn.prototype.update=function(t,e){this.stateDependentLayers.length&&this.programConfigurations.updatePaintArrays(t,e,this.stateDependentLayers);},Kn.prototype.isEmpty=function(){return 0===this.layoutVertexArray.length},Kn.prototype.uploadPending=function(){return!this.uploaded||this.programConfigurations.needsUpload},Kn.prototype.upload=function(t){this.uploaded||(this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,Pn),this.indexBuffer=t.createIndexBuffer(this.indexArray)),this.programConfigurations.upload(t),this.uploaded=!0;},Kn.prototype.destroy=function(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.programConfigurations.destroy(),this.segments.destroy());},Kn.prototype.addFeature=function(t,e,r){for(var n=0,i=e;n<i.length;n+=1)for(var a=0,o=i[n];a<o.length;a+=1){var s=o[a],u=s.x,l=s.y;if(!(u<0||u>=Zn||l<0||l>=Zn)){var p=this.segments.prepareSegment(4,this.layoutVertexArray,this.indexArray),h=p.vertexLength;Hn(this.layoutVertexArray,u,l,-1,-1),Hn(this.layoutVertexArray,u,l,1,-1),Hn(this.layoutVertexArray,u,l,1,1),Hn(this.layoutVertexArray,u,l,-1,1),this.indexArray.emplaceBack(h,h+1,h+2),this.indexArray.emplaceBack(h,h+3,h+2),p.vertexLength+=4,p.primitiveLength+=2;}}this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length,t,r);},_r("CircleBucket",Kn,{omit:["layers"]});var li={paint:new Wr({"circle-radius":new Kr(D.paint_circle["circle-radius"]),"circle-color":new Kr(D.paint_circle["circle-color"]),"circle-blur":new Kr(D.paint_circle["circle-blur"]),"circle-opacity":new Kr(D.paint_circle["circle-opacity"]),"circle-translate":new Hr(D.paint_circle["circle-translate"]),"circle-translate-anchor":new Hr(D.paint_circle["circle-translate-anchor"]),"circle-pitch-scale":new Hr(D.paint_circle["circle-pitch-scale"]),"circle-pitch-alignment":new Hr(D.paint_circle["circle-pitch-alignment"]),"circle-stroke-width":new Kr(D.paint_circle["circle-stroke-width"]),"circle-stroke-color":new Kr(D.paint_circle["circle-stroke-color"]),"circle-stroke-opacity":new Kr(D.paint_circle["circle-stroke-opacity"])})},pi="undefined"!=typeof Float32Array?Float32Array:Array;Math.PI;function hi(){var t=new pi(9);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function ci(){var t=new pi(3);return t[0]=0,t[1]=0,t[2]=0,t}function fi(t){var e=t[0],r=t[1],n=t[2];return Math.sqrt(e*e+r*r+n*n)}function yi(t,e,r){var n=new pi(3);return n[0]=t,n[1]=e,n[2]=r,n}function di(t,e){var r=e[0],n=e[1],i=e[2],a=r*r+n*n+i*i;return a>0&&(a=1/Math.sqrt(a),t[0]=e[0]*a,t[1]=e[1]*a,t[2]=e[2]*a),t}function mi(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function vi(t,e,r){var n=e[0],i=e[1],a=e[2],o=r[0],s=r[1],u=r[2];return t[0]=i*u-a*s,t[1]=a*o-n*u,t[2]=n*s-i*o,t}var gi,xi=fi,bi=(gi=ci(),function(t,e,r,n,i,a){var o,s;for(e||(e=3),r||(r=0),s=n?Math.min(n*e+r,t.length):t.length,o=r;o<s;o+=e)gi[0]=t[o],gi[1]=t[o+1],gi[2]=t[o+2],i(gi,gi,a),t[o]=gi[0],t[o+1]=gi[1],t[o+2]=gi[2];return t});function wi(){var t=new pi(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t}function _i(t,e){var r=e[0],n=e[1],i=e[2],a=e[3],o=r*r+n*n+i*i+a*a;return o>0&&(o=1/Math.sqrt(o),t[0]=r*o,t[1]=n*o,t[2]=i*o,t[3]=a*o),t}function Ai(t,e,r){var n=e[0],i=e[1],a=e[2],o=e[3];return t[0]=r[0]*n+r[4]*i+r[8]*a+r[12]*o,t[1]=r[1]*n+r[5]*i+r[9]*a+r[13]*o,t[2]=r[2]*n+r[6]*i+r[10]*a+r[14]*o,t[3]=r[3]*n+r[7]*i+r[11]*a+r[15]*o,t}var ki=function(){var t=wi();return function(e,r,n,i,a,o){var s,u;for(r||(r=4),n||(n=0),u=i?Math.min(i*r+n,e.length):e.length,s=n;s<u;s+=r)t[0]=e[s],t[1]=e[s+1],t[2]=e[s+2],t[3]=e[s+3],a(t,t,o),e[s]=t[0],e[s+1]=t[1],e[s+2]=t[2],e[s+3]=t[3];return e}}();function zi(){var t=new pi(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}function Si(t,e,r,n){var i,a,o,s,u,l=e[0],p=e[1],h=e[2],c=e[3],f=r[0],y=r[1],d=r[2],m=r[3];return(a=l*f+p*y+h*d+c*m)<0&&(a=-a,f=-f,y=-y,d=-d,m=-m),1-a>1e-6?(i=Math.acos(a),o=Math.sin(i),s=Math.sin((1-n)*i)/o,u=Math.sin(n*i)/o):(s=1-n,u=n),t[0]=s*l+u*f,t[1]=s*p+u*y,t[2]=s*h+u*d,t[3]=s*c+u*m,t}var Mi,Bi,Vi,Ii,Ci,Ei,Ti=_i;Mi=ci(),Bi=yi(1,0,0),Vi=yi(0,1,0),Ii=zi(),Ci=zi(),Ei=hi();!function(){var t,e=((t=new pi(2))[0]=0,t[1]=0,t);}();var Pi=function(t){function e(e){t.call(this,e,li);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.createBucket=function(t){return new Kn(t)},e.prototype.queryRadius=function(t){var e=t;return oi("circle-radius",this,e)+oi("circle-stroke-width",this,e)+si(this.paint.get("circle-translate"))},e.prototype.queryIntersectsFeature=function(t,e,r,n,i,a,o,s){for(var u=ui(t,this.paint.get("circle-translate"),this.paint.get("circle-translate-anchor"),a.angle,o),l=this.paint.get("circle-radius").evaluate(e,r)+this.paint.get("circle-stroke-width").evaluate(e,r),p="map"===this.paint.get("circle-pitch-alignment"),h=p?u:function(t,e,r){return t.map(function(t){return t.map(function(t){return Fi(t,e,r)})})}(u,s,a),c=p?l*o:l,f=0,y=n;f<y.length;f+=1)for(var d=0,m=y[f];d<m.length;d+=1){var v=m[d],g=p?v:Fi(v,s,a),x=c,b=Ai([],[v.x,v.y,0,1],s);if("viewport"===this.paint.get("circle-pitch-scale")&&"map"===this.paint.get("circle-pitch-alignment")?x*=b[3]/a.cameraToCenterDistance:"map"===this.paint.get("circle-pitch-scale")&&"viewport"===this.paint.get("circle-pitch-alignment")&&(x*=a.cameraToCenterDistance/b[3]),Gn(h,g,x))return!0}return!1},e}(Qr);function Fi(t,e,r){var n=Ai([],[t.x,t.y,0,1],e);return new h((n[0]/n[3]+1)*r.width*.5,(n[1]/n[3]+1)*r.height*.5)}var Li=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e}(Kn);function Oi(t,e,r,n){var i=e.width,a=e.height;if(n){if(n.length!==i*a*r)throw new RangeError("mismatched image size")}else n=new Uint8Array(i*a*r);return t.width=i,t.height=a,t.data=n,t}function Di(t,e,r){var n=e.width,i=e.height;if(n!==t.width||i!==t.height){var a=Oi({},{width:n,height:i},r);qi(t,a,{x:0,y:0},{x:0,y:0},{width:Math.min(t.width,n),height:Math.min(t.height,i)},r),t.width=n,t.height=i,t.data=a.data;}}function qi(t,e,r,n,i,a){if(0===i.width||0===i.height)return e;if(i.width>t.width||i.height>t.height||r.x>t.width-i.width||r.y>t.height-i.height)throw new RangeError("out of range source coordinates for image copy");if(i.width>e.width||i.height>e.height||n.x>e.width-i.width||n.y>e.height-i.height)throw new RangeError("out of range destination coordinates for image copy");for(var o=t.data,s=e.data,u=0;u<i.height;u++)for(var l=((r.y+u)*t.width+r.x)*a,p=((n.y+u)*e.width+n.x)*a,h=0;h<i.width*a;h++)s[p+h]=o[l+h];return e}_r("HeatmapBucket",Li,{omit:["layers"]});var ji=function(t,e){Oi(this,t,1,e);};ji.prototype.resize=function(t){Di(this,t,1);},ji.prototype.clone=function(){return new ji({width:this.width,height:this.height},new Uint8Array(this.data))},ji.copy=function(t,e,r,n,i){qi(t,e,r,n,i,1);};var Ri=function(t,e){Oi(this,t,4,e);};Ri.prototype.resize=function(t){Di(this,t,4);},Ri.prototype.clone=function(){return new Ri({width:this.width,height:this.height},new Uint8Array(this.data))},Ri.copy=function(t,e,r,n,i){qi(t,e,r,n,i,4);},_r("AlphaImage",ji),_r("RGBAImage",Ri);var Ui={paint:new Wr({"heatmap-radius":new Kr(D.paint_heatmap["heatmap-radius"]),"heatmap-weight":new Kr(D.paint_heatmap["heatmap-weight"]),"heatmap-intensity":new Hr(D.paint_heatmap["heatmap-intensity"]),"heatmap-color":new Yr(D.paint_heatmap["heatmap-color"]),"heatmap-opacity":new Hr(D.paint_heatmap["heatmap-opacity"])})};function Ni(t,e){for(var r=new Uint8Array(1024),n={},i=0,a=0;i<256;i++,a+=4){n[e]=i/255;var o=t.evaluate(n);r[a+0]=Math.floor(255*o.r/o.a),r[a+1]=Math.floor(255*o.g/o.a),r[a+2]=Math.floor(255*o.b/o.a),r[a+3]=Math.floor(255*o.a);}return new Ri({width:256,height:1},r)}var Zi=function(t){function e(e){t.call(this,e,Ui),this._updateColorRamp();}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.createBucket=function(t){return new Li(t)},e.prototype._handleSpecialPaintPropertyUpdate=function(t){"heatmap-color"===t&&this._updateColorRamp();},e.prototype._updateColorRamp=function(){var t=this._transitionablePaint._values["heatmap-color"].value.expression;this.colorRamp=Ni(t,"heatmapDensity"),this.colorRampTexture=null;},e.prototype.resize=function(){this.heatmapFbo&&(this.heatmapFbo.destroy(),this.heatmapFbo=null);},e.prototype.queryRadius=function(){return 0},e.prototype.queryIntersectsFeature=function(){return!1},e.prototype.hasOffscreenPass=function(){return 0!==this.paint.get("heatmap-opacity")&&"none"!==this.visibility},e}(Qr),Xi={paint:new Wr({"hillshade-illumination-direction":new Hr(D.paint_hillshade["hillshade-illumination-direction"]),"hillshade-illumination-anchor":new Hr(D.paint_hillshade["hillshade-illumination-anchor"]),"hillshade-exaggeration":new Hr(D.paint_hillshade["hillshade-exaggeration"]),"hillshade-shadow-color":new Hr(D.paint_hillshade["hillshade-shadow-color"]),"hillshade-highlight-color":new Hr(D.paint_hillshade["hillshade-highlight-color"]),"hillshade-accent-color":new Hr(D.paint_hillshade["hillshade-accent-color"])})},$i=function(t){function e(e){t.call(this,e,Xi);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.hasOffscreenPass=function(){return 0!==this.paint.get("hillshade-exaggeration")&&"none"!==this.visibility},e}(Qr),Ji=nn([{name:"a_pos",components:2,type:"Int16"}],4).members,Hi=Gi,Ki=Gi;function Gi(t,e,r){r=r||2;var n,i,a,o,s,u,l,p=e&&e.length,h=p?e[0]*r:t.length,c=Yi(t,0,h,r,!0),f=[];if(!c)return f;if(p&&(c=function(t,e,r,n){var i,a,o,s,u,l=[];for(i=0,a=e.length;i<a;i++)o=e[i]*n,s=i<a-1?e[i+1]*n:t.length,(u=Yi(t,o,s,n,!1))===u.next&&(u.steiner=!0),l.push(sa(u));for(l.sort(ia),i=0;i<l.length;i++)aa(l[i],r),r=Wi(r,r.next);return r}(t,e,c,r)),t.length>80*r){n=a=t[0],i=o=t[1];for(var y=r;y<h;y+=r)(s=t[y])<n&&(n=s),(u=t[y+1])<i&&(i=u),s>a&&(a=s),u>o&&(o=u);l=0!==(l=Math.max(a-n,o-i))?1/l:0;}return Qi(c,f,r,n,i,l),f}function Yi(t,e,r,n,i){var a,o;if(i===ga(t,e,r,n)>0)for(a=e;a<r;a+=n)o=da(a,t[a],t[a+1],o);else for(a=r-n;a>=e;a-=n)o=da(a,t[a],t[a+1],o);return o&&ha(o,o.next)&&(ma(o),o=o.next),o}function Wi(t,e){if(!t)return t;e||(e=t);var r,n=t;do{if(r=!1,n.steiner||!ha(n,n.next)&&0!==pa(n.prev,n,n.next))n=n.next;else{if(ma(n),(n=e=n.prev)===n.next)break;r=!0;}}while(r||n!==e);return e}function Qi(t,e,r,n,i,a,o){if(t){!o&&a&&function(t,e,r,n){var i=t;do{null===i.z&&(i.z=oa(i.x,i.y,e,r,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;}while(i!==t);i.prevZ.nextZ=null,i.prevZ=null,function(t){var e,r,n,i,a,o,s,u,l=1;do{for(r=t,t=null,a=null,o=0;r;){for(o++,n=r,s=0,e=0;e<l&&(s++,n=n.nextZ);e++);for(u=l;s>0||u>0&&n;)0!==s&&(0===u||!n||r.z<=n.z)?(i=r,r=r.nextZ,s--):(i=n,n=n.nextZ,u--),a?a.nextZ=i:t=i,i.prevZ=a,a=i;r=n;}a.nextZ=null,l*=2;}while(o>1)}(i);}(t,n,i,a);for(var s,u,l=t;t.prev!==t.next;)if(s=t.prev,u=t.next,a?ea(t,n,i,a):ta(t))e.push(s.i/r),e.push(t.i/r),e.push(u.i/r),ma(t),t=u.next,l=u.next;else if((t=u)===l){o?1===o?Qi(t=ra(t,e,r),e,r,n,i,a,2):2===o&&na(t,e,r,n,i,a):Qi(Wi(t),e,r,n,i,a,1);break}}}function ta(t){var e=t.prev,r=t,n=t.next;if(pa(e,r,n)>=0)return!1;for(var i=t.next.next;i!==t.prev;){if(ua(e.x,e.y,r.x,r.y,n.x,n.y,i.x,i.y)&&pa(i.prev,i,i.next)>=0)return!1;i=i.next;}return!0}function ea(t,e,r,n){var i=t.prev,a=t,o=t.next;if(pa(i,a,o)>=0)return!1;for(var s=i.x<a.x?i.x<o.x?i.x:o.x:a.x<o.x?a.x:o.x,u=i.y<a.y?i.y<o.y?i.y:o.y:a.y<o.y?a.y:o.y,l=i.x>a.x?i.x>o.x?i.x:o.x:a.x>o.x?a.x:o.x,p=i.y>a.y?i.y>o.y?i.y:o.y:a.y>o.y?a.y:o.y,h=oa(s,u,e,r,n),c=oa(l,p,e,r,n),f=t.prevZ,y=t.nextZ;f&&f.z>=h&&y&&y.z<=c;){if(f!==t.prev&&f!==t.next&&ua(i.x,i.y,a.x,a.y,o.x,o.y,f.x,f.y)&&pa(f.prev,f,f.next)>=0)return!1;if(f=f.prevZ,y!==t.prev&&y!==t.next&&ua(i.x,i.y,a.x,a.y,o.x,o.y,y.x,y.y)&&pa(y.prev,y,y.next)>=0)return!1;y=y.nextZ;}for(;f&&f.z>=h;){if(f!==t.prev&&f!==t.next&&ua(i.x,i.y,a.x,a.y,o.x,o.y,f.x,f.y)&&pa(f.prev,f,f.next)>=0)return!1;f=f.prevZ;}for(;y&&y.z<=c;){if(y!==t.prev&&y!==t.next&&ua(i.x,i.y,a.x,a.y,o.x,o.y,y.x,y.y)&&pa(y.prev,y,y.next)>=0)return!1;y=y.nextZ;}return!0}function ra(t,e,r){var n=t;do{var i=n.prev,a=n.next.next;!ha(i,a)&&ca(i,n,n.next,a)&&fa(i,a)&&fa(a,i)&&(e.push(i.i/r),e.push(n.i/r),e.push(a.i/r),ma(n),ma(n.next),n=t=a),n=n.next;}while(n!==t);return n}function na(t,e,r,n,i,a){var o=t;do{for(var s=o.next.next;s!==o.prev;){if(o.i!==s.i&&la(o,s)){var u=ya(o,s);return o=Wi(o,o.next),u=Wi(u,u.next),Qi(o,e,r,n,i,a),void Qi(u,e,r,n,i,a)}s=s.next;}o=o.next;}while(o!==t)}function ia(t,e){return t.x-e.x}function aa(t,e){if(e=function(t,e){var r,n=e,i=t.x,a=t.y,o=-1/0;do{if(a<=n.y&&a>=n.next.y&&n.next.y!==n.y){var s=n.x+(a-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(s<=i&&s>o){if(o=s,s===i){if(a===n.y)return n;if(a===n.next.y)return n.next}r=n.x<n.next.x?n:n.next;}}n=n.next;}while(n!==e);if(!r)return null;if(i===o)return r.prev;var u,l=r,p=r.x,h=r.y,c=1/0;n=r.next;for(;n!==l;)i>=n.x&&n.x>=p&&i!==n.x&&ua(a<h?i:o,a,p,h,a<h?o:i,a,n.x,n.y)&&((u=Math.abs(a-n.y)/(i-n.x))<c||u===c&&n.x>r.x)&&fa(n,t)&&(r=n,c=u),n=n.next;return r}(t,e)){var r=ya(e,t);Wi(r,r.next);}}function oa(t,e,r,n,i){return(t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t=32767*(t-r)*i)|t<<8))|t<<4))|t<<2))|t<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=32767*(e-n)*i)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function sa(t){var e=t,r=t;do{e.x<r.x&&(r=e),e=e.next;}while(e!==t);return r}function ua(t,e,r,n,i,a,o,s){return(i-o)*(e-s)-(t-o)*(a-s)>=0&&(t-o)*(n-s)-(r-o)*(e-s)>=0&&(r-o)*(a-s)-(i-o)*(n-s)>=0}function la(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!function(t,e){var r=t;do{if(r.i!==t.i&&r.next.i!==t.i&&r.i!==e.i&&r.next.i!==e.i&&ca(r,r.next,t,e))return!0;r=r.next;}while(r!==t);return!1}(t,e)&&fa(t,e)&&fa(e,t)&&function(t,e){var r=t,n=!1,i=(t.x+e.x)/2,a=(t.y+e.y)/2;do{r.y>a!=r.next.y>a&&r.next.y!==r.y&&i<(r.next.x-r.x)*(a-r.y)/(r.next.y-r.y)+r.x&&(n=!n),r=r.next;}while(r!==t);return n}(t,e)}function pa(t,e,r){return(e.y-t.y)*(r.x-e.x)-(e.x-t.x)*(r.y-e.y)}function ha(t,e){return t.x===e.x&&t.y===e.y}function ca(t,e,r,n){return!!(ha(t,e)&&ha(r,n)||ha(t,n)&&ha(r,e))||pa(t,e,r)>0!=pa(t,e,n)>0&&pa(r,n,t)>0!=pa(r,n,e)>0}function fa(t,e){return pa(t.prev,t,t.next)<0?pa(t,e,t.next)>=0&&pa(t,t.prev,e)>=0:pa(t,e,t.prev)<0||pa(t,t.next,e)<0}function ya(t,e){var r=new va(t.i,t.x,t.y),n=new va(e.i,e.x,e.y),i=t.next,a=e.prev;return t.next=e,e.prev=t,r.next=i,i.prev=r,n.next=r,r.prev=n,a.next=n,n.prev=a,n}function da(t,e,r,n){var i=new va(t,e,r);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function ma(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ);}function va(t,e,r){this.i=t,this.x=e,this.y=r,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1;}function ga(t,e,r,n){for(var i=0,a=e,o=r-n;a<r;a+=n)i+=(t[o]-t[a])*(t[a+1]+t[o+1]),o=a;return i}Gi.deviation=function(t,e,r,n){var i=e&&e.length,a=i?e[0]*r:t.length,o=Math.abs(ga(t,0,a,r));if(i)for(var s=0,u=e.length;s<u;s++){var l=e[s]*r,p=s<u-1?e[s+1]*r:t.length;o-=Math.abs(ga(t,l,p,r));}var h=0;for(s=0;s<n.length;s+=3){var c=n[s]*r,f=n[s+1]*r,y=n[s+2]*r;h+=Math.abs((t[c]-t[y])*(t[f+1]-t[c+1])-(t[c]-t[f])*(t[y+1]-t[c+1]));}return 0===o&&0===h?0:Math.abs((h-o)/o)},Gi.flatten=function(t){for(var e=t[0][0].length,r={vertices:[],holes:[],dimensions:e},n=0,i=0;i<t.length;i++){for(var a=0;a<t[i].length;a++)for(var o=0;o<e;o++)r.vertices.push(t[i][a][o]);i>0&&(n+=t[i-1].length,r.holes.push(n));}return r},Hi.default=Ki;var xa=wa,ba=wa;function wa(t,e,r,n,i){!function t(e,r,n,i,a){for(;i>n;){if(i-n>600){var o=i-n+1,s=r-n+1,u=Math.log(o),l=.5*Math.exp(2*u/3),p=.5*Math.sqrt(u*l*(o-l)/o)*(s-o/2<0?-1:1),h=Math.max(n,Math.floor(r-s*l/o+p)),c=Math.min(i,Math.floor(r+(o-s)*l/o+p));t(e,r,h,c,a);}var f=e[r],y=n,d=i;for(_a(e,n,r),a(e[i],f)>0&&_a(e,n,i);y<d;){for(_a(e,y,d),y++,d--;a(e[y],f)<0;)y++;for(;a(e[d],f)>0;)d--;}0===a(e[n],f)?_a(e,n,d):_a(e,++d,i),d<=r&&(n=d+1),r<=d&&(i=d-1);}}(t,e,r||0,n||t.length-1,i||Aa);}function _a(t,e,r){var n=t[e];t[e]=t[r],t[r]=n;}function Aa(t,e){return t<e?-1:t>e?1:0}function ka(t,e){var r=t.length;if(r<=1)return[t];for(var n,i,a=[],o=0;o<r;o++){var s=B(t[o]);0!==s&&(t[o].area=Math.abs(s),void 0===i&&(i=s<0),i===s<0?(n&&a.push(n),n=[t[o]]):n.push(t[o]));}if(n&&a.push(n),e>1)for(var u=0;u<a.length;u++)a[u].length<=e||(xa(a[u],e,1,a[u].length-1,za),a[u]=a[u].slice(0,e));return a}function za(t,e){return e.area-t.area}xa.default=ba;var Sa=function(t){this.zoom=t.zoom,this.overscaling=t.overscaling,this.layers=t.layers,this.layerIds=this.layers.map(function(t){return t.id}),this.index=t.index,this.layoutVertexArray=new on,this.indexArray=new bn,this.indexArray2=new wn,this.programConfigurations=new Un(Ji,t.layers,t.zoom),this.segments=new Fn,this.segments2=new Fn;};Sa.prototype.populate=function(t,e){for(var r=0,n=t;r<n.length;r+=1){var i=n[r],a=i.feature,o=i.index,s=i.sourceLayerIndex;if(this.layers[0]._featureFilter(new qr(this.zoom),a)){var u=Jn(a);this.addFeature(a,u,o),e.featureIndex.insert(a,u,o,s,this.index);}}},Sa.prototype.update=function(t,e){this.stateDependentLayers.length&&this.programConfigurations.updatePaintArrays(t,e,this.stateDependentLayers);},Sa.prototype.isEmpty=function(){return 0===this.layoutVertexArray.length},Sa.prototype.uploadPending=function(){return!this.uploaded||this.programConfigurations.needsUpload},Sa.prototype.upload=function(t){this.uploaded||(this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,Ji),this.indexBuffer=t.createIndexBuffer(this.indexArray),this.indexBuffer2=t.createIndexBuffer(this.indexArray2)),this.programConfigurations.upload(t),this.uploaded=!0;},Sa.prototype.destroy=function(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.indexBuffer2.destroy(),this.programConfigurations.destroy(),this.segments.destroy(),this.segments2.destroy());},Sa.prototype.addFeature=function(t,e,r){for(var n=0,i=ka(e,500);n<i.length;n+=1){for(var a=i[n],o=0,s=0,u=a;s<u.length;s+=1){o+=u[s].length;}for(var l=this.segments.prepareSegment(o,this.layoutVertexArray,this.indexArray),p=l.vertexLength,h=[],c=[],f=0,y=a;f<y.length;f+=1){var d=y[f];if(0!==d.length){d!==a[0]&&c.push(h.length/2);var m=this.segments2.prepareSegment(d.length,this.layoutVertexArray,this.indexArray2),v=m.vertexLength;this.layoutVertexArray.emplaceBack(d[0].x,d[0].y),this.indexArray2.emplaceBack(v+d.length-1,v),h.push(d[0].x),h.push(d[0].y);for(var g=1;g<d.length;g++)this.layoutVertexArray.emplaceBack(d[g].x,d[g].y),this.indexArray2.emplaceBack(v+g-1,v+g),h.push(d[g].x),h.push(d[g].y);m.vertexLength+=d.length,m.primitiveLength+=d.length;}}for(var x=Hi(h,c),b=0;b<x.length;b+=3)this.indexArray.emplaceBack(p+x[b],p+x[b+1],p+x[b+2]);l.vertexLength+=o,l.primitiveLength+=x.length/3;}this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length,t,r);},_r("FillBucket",Sa,{omit:["layers"]});var Ma={paint:new Wr({"fill-antialias":new Hr(D.paint_fill["fill-antialias"]),"fill-opacity":new Kr(D.paint_fill["fill-opacity"]),"fill-color":new Kr(D.paint_fill["fill-color"]),"fill-outline-color":new Kr(D.paint_fill["fill-outline-color"]),"fill-translate":new Hr(D.paint_fill["fill-translate"]),"fill-translate-anchor":new Hr(D.paint_fill["fill-translate-anchor"]),"fill-pattern":new Gr(D.paint_fill["fill-pattern"])})},Ba=function(t){function e(e){t.call(this,e,Ma);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.recalculate=function(t){this.paint=this._transitioningPaint.possiblyEvaluate(t);var e=this.paint._values["fill-outline-color"];"constant"===e.value.kind&&void 0===e.value.value&&(this.paint._values["fill-outline-color"]=this.paint._values["fill-color"]);},e.prototype.createBucket=function(t){return new Sa(t)},e.prototype.queryRadius=function(){return si(this.paint.get("fill-translate"))},e.prototype.queryIntersectsFeature=function(t,e,r,n,i,a,o){return Yn(ui(t,this.paint.get("fill-translate"),this.paint.get("fill-translate-anchor"),a.angle,o),n)},e}(Qr),Va=nn([{name:"a_pos",components:2,type:"Int16"},{name:"a_normal_ed",components:4,type:"Int16"}],4).members,Ia=Math.pow(2,13);function Ca(t,e,r,n,i,a,o,s){t.emplaceBack(e,r,2*Math.floor(n*Ia)+o,i*Ia*2,a*Ia*2,Math.round(s));}var Ea=function(t){this.zoom=t.zoom,this.overscaling=t.overscaling,this.layers=t.layers,this.layerIds=this.layers.map(function(t){return t.id}),this.index=t.index,this.layoutVertexArray=new un,this.indexArray=new bn,this.programConfigurations=new Un(Va,t.layers,t.zoom),this.segments=new Fn;};function Ta(t,e){return t.x===e.x&&(t.x<0||t.x>Zn)||t.y===e.y&&(t.y<0||t.y>Zn)}function Pa(t){return t.every(function(t){return t.x<0})||t.every(function(t){return t.x>Zn})||t.every(function(t){return t.y<0})||t.every(function(t){return t.y>Zn})}Ea.prototype.populate=function(t,e){for(var r=0,n=t;r<n.length;r+=1){var i=n[r],a=i.feature,o=i.index,s=i.sourceLayerIndex;if(this.layers[0]._featureFilter(new qr(this.zoom),a)){var u=Jn(a);this.addFeature(a,u,o),e.featureIndex.insert(a,u,o,s,this.index);}}},Ea.prototype.update=function(t,e){this.stateDependentLayers.length&&this.programConfigurations.updatePaintArrays(t,e,this.stateDependentLayers);},Ea.prototype.isEmpty=function(){return 0===this.layoutVertexArray.length},Ea.prototype.uploadPending=function(){return!this.uploaded||this.programConfigurations.needsUpload},Ea.prototype.upload=function(t){this.uploaded||(this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,Va),this.indexBuffer=t.createIndexBuffer(this.indexArray)),this.programConfigurations.upload(t),this.uploaded=!0;},Ea.prototype.destroy=function(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.programConfigurations.destroy(),this.segments.destroy());},Ea.prototype.addFeature=function(t,e,r){for(var n=0,i=ka(e,500);n<i.length;n+=1){for(var a=i[n],o=0,s=0,u=a;s<u.length;s+=1){o+=u[s].length;}for(var l=this.segments.prepareSegment(4,this.layoutVertexArray,this.indexArray),p=0,h=a;p<h.length;p+=1){var c=h[p];if(0!==c.length&&!Pa(c))for(var f=0,y=0;y<c.length;y++){var d=c[y];if(y>=1){var m=c[y-1];if(!Ta(d,m)){l.vertexLength+4>Fn.MAX_VERTEX_ARRAY_LENGTH&&(l=this.segments.prepareSegment(4,this.layoutVertexArray,this.indexArray));var v=d.sub(m)._perp()._unit(),g=m.dist(d);f+g>32768&&(f=0),Ca(this.layoutVertexArray,d.x,d.y,v.x,v.y,0,0,f),Ca(this.layoutVertexArray,d.x,d.y,v.x,v.y,0,1,f),f+=g,Ca(this.layoutVertexArray,m.x,m.y,v.x,v.y,0,0,f),Ca(this.layoutVertexArray,m.x,m.y,v.x,v.y,0,1,f);var x=l.vertexLength;this.indexArray.emplaceBack(x,x+1,x+2),this.indexArray.emplaceBack(x+1,x+2,x+3),l.vertexLength+=4,l.primitiveLength+=2;}}}}l.vertexLength+o>Fn.MAX_VERTEX_ARRAY_LENGTH&&(l=this.segments.prepareSegment(o,this.layoutVertexArray,this.indexArray));for(var b=[],w=[],_=l.vertexLength,A=0,k=a;A<k.length;A+=1){var z=k[A];if(0!==z.length){z!==a[0]&&w.push(b.length/2);for(var S=0;S<z.length;S++){var M=z[S];Ca(this.layoutVertexArray,M.x,M.y,0,0,1,1,0),b.push(M.x),b.push(M.y);}}}for(var B=Hi(b,w),V=0;V<B.length;V+=3)this.indexArray.emplaceBack(_+B[V],_+B[V+1],_+B[V+2]);l.primitiveLength+=B.length/3,l.vertexLength+=o;}this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length,t,r);},_r("FillExtrusionBucket",Ea,{omit:["layers"]});var Fa={paint:new Wr({"fill-extrusion-opacity":new Hr(D["paint_fill-extrusion"]["fill-extrusion-opacity"]),"fill-extrusion-color":new Kr(D["paint_fill-extrusion"]["fill-extrusion-color"]),"fill-extrusion-translate":new Hr(D["paint_fill-extrusion"]["fill-extrusion-translate"]),"fill-extrusion-translate-anchor":new Hr(D["paint_fill-extrusion"]["fill-extrusion-translate-anchor"]),"fill-extrusion-pattern":new Gr(D["paint_fill-extrusion"]["fill-extrusion-pattern"]),"fill-extrusion-height":new Kr(D["paint_fill-extrusion"]["fill-extrusion-height"]),"fill-extrusion-base":new Kr(D["paint_fill-extrusion"]["fill-extrusion-base"])})},La=function(t){function e(e){t.call(this,e,Fa);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.createBucket=function(t){return new Ea(t)},e.prototype.queryRadius=function(){return si(this.paint.get("fill-extrusion-translate"))},e.prototype.queryIntersectsFeature=function(t,e,r,n,i,a,o){return Yn(ui(t,this.paint.get("fill-extrusion-translate"),this.paint.get("fill-extrusion-translate-anchor"),a.angle,o),n)},e.prototype.hasOffscreenPass=function(){return 0!==this.paint.get("fill-extrusion-opacity")&&"none"!==this.visibility},e.prototype.resize=function(){this.viewportFrame&&(this.viewportFrame.destroy(),this.viewportFrame=null);},e}(Qr),Oa=nn([{name:"a_pos_normal",components:4,type:"Int16"},{name:"a_data",components:4,type:"Uint8"}],4).members,Da=qa;function qa(t,e,r,n,i){this.properties={},this.extent=r,this.type=0,this._pbf=t,this._geometry=-1,this._keys=n,this._values=i,t.readFields(ja,this,e);}function ja(t,e,r){1==t?e.id=r.readVarint():2==t?function(t,e){var r=t.readVarint()+t.pos;for(;t.pos<r;){var n=e._keys[t.readVarint()],i=e._values[t.readVarint()];e.properties[n]=i;}}(r,e):3==t?e.type=r.readVarint():4==t&&(e._geometry=r.pos);}function Ra(t){for(var e,r,n=0,i=0,a=t.length,o=a-1;i<a;o=i++)e=t[i],n+=((r=t[o]).x-e.x)*(e.y+r.y);return n}qa.types=["Unknown","Point","LineString","Polygon"],qa.prototype.loadGeometry=function(){var t=this._pbf;t.pos=this._geometry;for(var e,r=t.readVarint()+t.pos,n=1,i=0,a=0,o=0,s=[];t.pos<r;){if(i<=0){var u=t.readVarint();n=7&u,i=u>>3;}if(i--,1===n||2===n)a+=t.readSVarint(),o+=t.readSVarint(),1===n&&(e&&s.push(e),e=[]),e.push(new h(a,o));else{if(7!==n)throw new Error("unknown command "+n);e&&e.push(e[0].clone());}}return e&&s.push(e),s},qa.prototype.bbox=function(){var t=this._pbf;t.pos=this._geometry;for(var e=t.readVarint()+t.pos,r=1,n=0,i=0,a=0,o=1/0,s=-1/0,u=1/0,l=-1/0;t.pos<e;){if(n<=0){var p=t.readVarint();r=7&p,n=p>>3;}if(n--,1===r||2===r)(i+=t.readSVarint())<o&&(o=i),i>s&&(s=i),(a+=t.readSVarint())<u&&(u=a),a>l&&(l=a);else if(7!==r)throw new Error("unknown command "+r)}return[o,u,s,l]},qa.prototype.toGeoJSON=function(t,e,r){var n,i,a=this.extent*Math.pow(2,r),o=this.extent*t,s=this.extent*e,u=this.loadGeometry(),l=qa.types[this.type];function p(t){for(var e=0;e<t.length;e++){var r=t[e],n=180-360*(r.y+s)/a;t[e]=[360*(r.x+o)/a-180,360/Math.PI*Math.atan(Math.exp(n*Math.PI/180))-90];}}switch(this.type){case 1:var h=[];for(n=0;n<u.length;n++)h[n]=u[n][0];p(u=h);break;case 2:for(n=0;n<u.length;n++)p(u[n]);break;case 3:for(u=function(t){var e=t.length;if(e<=1)return[t];for(var r,n,i=[],a=0;a<e;a++){var o=Ra(t[a]);0!==o&&(void 0===n&&(n=o<0),n===o<0?(r&&i.push(r),r=[t[a]]):r.push(t[a]));}r&&i.push(r);return i}(u),n=0;n<u.length;n++)for(i=0;i<u[n].length;i++)p(u[n][i]);}1===u.length?u=u[0]:l="Multi"+l;var c={type:"Feature",geometry:{type:l,coordinates:u},properties:this.properties};return"id"in this&&(c.id=this.id),c};var Ua=Na;function Na(t,e){this.version=1,this.name=null,this.extent=4096,this.length=0,this._pbf=t,this._keys=[],this._values=[],this._features=[],t.readFields(Za,this,e),this.length=this._features.length;}function Za(t,e,r){15===t?e.version=r.readVarint():1===t?e.name=r.readString():5===t?e.extent=r.readVarint():2===t?e._features.push(r.pos):3===t?e._keys.push(r.readString()):4===t&&e._values.push(function(t){var e=null,r=t.readVarint()+t.pos;for(;t.pos<r;){var n=t.readVarint()>>3;e=1===n?t.readString():2===n?t.readFloat():3===n?t.readDouble():4===n?t.readVarint64():5===n?t.readVarint():6===n?t.readSVarint():7===n?t.readBoolean():null;}return e}(r));}function Xa(t,e,r){if(3===t){var n=new Ua(r,r.readVarint()+r.pos);n.length&&(e[n.name]=n);}}Na.prototype.feature=function(t){if(t<0||t>=this._features.length)throw new Error("feature index out of bounds");this._pbf.pos=this._features[t];var e=this._pbf.readVarint()+this._pbf.pos;return new Da(this._pbf,e,this.extent,this._keys,this._values)};var $a={VectorTile:function(t,e){this.layers=t.readFields(Xa,{},e);},VectorTileFeature:Da,VectorTileLayer:Ua},Ja=$a.VectorTileFeature.types,Ha=63,Ka=Math.cos(Math.PI/180*37.5),Ga=.5,Ya=Math.pow(2,14)/Ga;function Wa(t,e,r,n,i,a,o){t.emplaceBack(e.x,e.y,n?1:0,i?1:-1,Math.round(Ha*r.x)+128,Math.round(Ha*r.y)+128,1+(0===a?0:a<0?-1:1)|(o*Ga&63)<<2,o*Ga>>6);}var Qa=function(t){this.zoom=t.zoom,this.overscaling=t.overscaling,this.layers=t.layers,this.layerIds=this.layers.map(function(t){return t.id}),this.index=t.index,this.layoutVertexArray=new ln,this.indexArray=new bn,this.programConfigurations=new Un(Oa,t.layers,t.zoom),this.segments=new Fn;};function to(t,e){return(t/e.tileTotal*(e.end-e.start)+e.start)*(Ya-1)}Qa.prototype.populate=function(t,e){for(var r=0,n=t;r<n.length;r+=1){var i=n[r],a=i.feature,o=i.index,s=i.sourceLayerIndex;if(this.layers[0]._featureFilter(new qr(this.zoom),a)){var u=Jn(a);this.addFeature(a,u,o),e.featureIndex.insert(a,u,o,s,this.index);}}},Qa.prototype.update=function(t,e){this.stateDependentLayers.length&&this.programConfigurations.updatePaintArrays(t,e,this.stateDependentLayers);},Qa.prototype.isEmpty=function(){return 0===this.layoutVertexArray.length},Qa.prototype.uploadPending=function(){return!this.uploaded||this.programConfigurations.needsUpload},Qa.prototype.upload=function(t){this.uploaded||(this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,Oa),this.indexBuffer=t.createIndexBuffer(this.indexArray)),this.programConfigurations.upload(t),this.uploaded=!0;},Qa.prototype.destroy=function(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.programConfigurations.destroy(),this.segments.destroy());},Qa.prototype.addFeature=function(t,e,r){for(var n=this.layers[0].layout,i=n.get("line-join").evaluate(t,{}),a=n.get("line-cap"),o=n.get("line-miter-limit"),s=n.get("line-round-limit"),u=0,l=e;u<l.length;u+=1){var p=l[u];this.addLine(p,t,i,a,o,s,r);}},Qa.prototype.addLine=function(t,e,r,n,i,a,o){var s=null;e.properties&&e.properties.hasOwnProperty("mapbox_clip_start")&&e.properties.hasOwnProperty("mapbox_clip_end")&&(s={start:e.properties.mapbox_clip_start,end:e.properties.mapbox_clip_end,tileTotal:void 0});for(var u="Polygon"===Ja[e.type],l=t.length;l>=2&&t[l-1].equals(t[l-2]);)l--;for(var p=0;p<l-1&&t[p].equals(t[p+1]);)p++;if(!(l<(u?3:2))){s&&(s.tileTotal=function(t,e,r){for(var n,i,a=0,o=e;o<r-1;o++)n=t[o],i=t[o+1],a+=n.dist(i);return a}(t,p,l)),"bevel"===r&&(i=1.05);var h=Zn/(512*this.overscaling)*15,c=t[p],f=this.segments.prepareSegment(10*l,this.layoutVertexArray,this.indexArray);this.distance=0;var y,d,m,v=n,g=u?"butt":n,x=!0,b=void 0,w=void 0,_=void 0,A=void 0;this.e1=this.e2=this.e3=-1,u&&(y=t[l-2],A=c.sub(y)._unit()._perp());for(var k=p;k<l;k++)if(!(w=u&&k===l-1?t[p+1]:t[k+1])||!t[k].equals(w)){A&&(_=A),y&&(b=y),y=t[k],A=w?w.sub(y)._unit()._perp():_;var z=(_=_||A).add(A);0===z.x&&0===z.y||z._unit();var S=z.x*A.x+z.y*A.y,M=0!==S?1/S:1/0,B=S<Ka&&b&&w;if(B&&k>p){var V=y.dist(b);if(V>2*h){var I=y.sub(y.sub(b)._mult(h/V)._round());this.distance+=I.dist(b),this.addCurrentVertex(I,this.distance,_.mult(1),0,0,!1,f,s),b=I;}}var C=b&&w,E=C?r:w?v:g;if(C&&"round"===E&&(M<a?E="miter":M<=2&&(E="fakeround")),"miter"===E&&M>i&&(E="bevel"),"bevel"===E&&(M>2&&(E="flipbevel"),M<i&&(E="miter")),b&&(this.distance+=y.dist(b)),"miter"===E)z._mult(M),this.addCurrentVertex(y,this.distance,z,0,0,!1,f,s);else if("flipbevel"===E){if(M>100)z=A.clone().mult(-1);else{var T=_.x*A.y-_.y*A.x>0?-1:1,P=M*_.add(A).mag()/_.sub(A).mag();z._perp()._mult(P*T);}this.addCurrentVertex(y,this.distance,z,0,0,!1,f,s),this.addCurrentVertex(y,this.distance,z.mult(-1),0,0,!1,f,s);}else if("bevel"===E||"fakeround"===E){var F=_.x*A.y-_.y*A.x>0,L=-Math.sqrt(M*M-1);if(F?(m=0,d=L):(d=0,m=L),x||this.addCurrentVertex(y,this.distance,_,d,m,!1,f,s),"fakeround"===E){for(var O=Math.floor(8*(.5-(S-.5))),D=void 0,q=0;q<O;q++)D=A.mult((q+1)/(O+1))._add(_)._unit(),this.addPieSliceVertex(y,this.distance,D,F,f,s);this.addPieSliceVertex(y,this.distance,z,F,f,s);for(var j=O-1;j>=0;j--)D=_.mult((j+1)/(O+1))._add(A)._unit(),this.addPieSliceVertex(y,this.distance,D,F,f,s);}w&&this.addCurrentVertex(y,this.distance,A,-d,-m,!1,f,s);}else"butt"===E?(x||this.addCurrentVertex(y,this.distance,_,0,0,!1,f,s),w&&this.addCurrentVertex(y,this.distance,A,0,0,!1,f,s)):"square"===E?(x||(this.addCurrentVertex(y,this.distance,_,1,1,!1,f,s),this.e1=this.e2=-1),w&&this.addCurrentVertex(y,this.distance,A,-1,-1,!1,f,s)):"round"===E&&(x||(this.addCurrentVertex(y,this.distance,_,0,0,!1,f,s),this.addCurrentVertex(y,this.distance,_,1,1,!0,f,s),this.e1=this.e2=-1),w&&(this.addCurrentVertex(y,this.distance,A,-1,-1,!0,f,s),this.addCurrentVertex(y,this.distance,A,0,0,!1,f,s)));if(B&&k<l-1){var R=y.dist(w);if(R>2*h){var U=y.add(w.sub(y)._mult(h/R)._round());this.distance+=U.dist(y),this.addCurrentVertex(U,this.distance,A.mult(1),0,0,!1,f,s),y=U;}}x=!1;}this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length,e,o);}},Qa.prototype.addCurrentVertex=function(t,e,r,n,i,a,o,s){var u,l=this.layoutVertexArray,p=this.indexArray;s&&(e=to(e,s)),u=r.clone(),n&&u._sub(r.perp()._mult(n)),Wa(l,t,u,a,!1,n,e),this.e3=o.vertexLength++,this.e1>=0&&this.e2>=0&&(p.emplaceBack(this.e1,this.e2,this.e3),o.primitiveLength++),this.e1=this.e2,this.e2=this.e3,u=r.mult(-1),i&&u._sub(r.perp()._mult(i)),Wa(l,t,u,a,!0,-i,e),this.e3=o.vertexLength++,this.e1>=0&&this.e2>=0&&(p.emplaceBack(this.e1,this.e2,this.e3),o.primitiveLength++),this.e1=this.e2,this.e2=this.e3,e>Ya/2&&!s&&(this.distance=0,this.addCurrentVertex(t,this.distance,r,n,i,a,o));},Qa.prototype.addPieSliceVertex=function(t,e,r,n,i,a){r=r.mult(n?-1:1);var o=this.layoutVertexArray,s=this.indexArray;a&&(e=to(e,a)),Wa(o,t,r,!1,n,0,e),this.e3=i.vertexLength++,this.e1>=0&&this.e2>=0&&(s.emplaceBack(this.e1,this.e2,this.e3),i.primitiveLength++),n?this.e2=this.e3:this.e1=this.e3;},_r("LineBucket",Qa,{omit:["layers"]});var eo=new Wr({"line-cap":new Hr(D.layout_line["line-cap"]),"line-join":new Kr(D.layout_line["line-join"]),"line-miter-limit":new Hr(D.layout_line["line-miter-limit"]),"line-round-limit":new Hr(D.layout_line["line-round-limit"])}),ro={paint:new Wr({"line-opacity":new Kr(D.paint_line["line-opacity"]),"line-color":new Kr(D.paint_line["line-color"]),"line-translate":new Hr(D.paint_line["line-translate"]),"line-translate-anchor":new Hr(D.paint_line["line-translate-anchor"]),"line-width":new Kr(D.paint_line["line-width"]),"line-gap-width":new Kr(D.paint_line["line-gap-width"]),"line-offset":new Kr(D.paint_line["line-offset"]),"line-blur":new Kr(D.paint_line["line-blur"]),"line-dasharray":new Gr(D.paint_line["line-dasharray"]),"line-pattern":new Gr(D.paint_line["line-pattern"]),"line-gradient":new Yr(D.paint_line["line-gradient"])}),layout:eo},no=new(function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.possiblyEvaluate=function(e,r){return r=new qr(Math.floor(r.zoom),{now:r.now,fadeDuration:r.fadeDuration,zoomHistory:r.zoomHistory,transition:r.transition}),t.prototype.possiblyEvaluate.call(this,e,r)},e.prototype.evaluate=function(e,r,n,i){return r=v({},r,{zoom:Math.floor(r.zoom)}),t.prototype.evaluate.call(this,e,r,n,i)},e}(Kr))(ro.paint.properties["line-width"].specification);no.useIntegerZoom=!0;var io=function(t){function e(e){t.call(this,e,ro);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._handleSpecialPaintPropertyUpdate=function(t){"line-gradient"===t&&this._updateGradient();},e.prototype._updateGradient=function(){var t=this._transitionablePaint._values["line-gradient"].value.expression;this.gradient=Ni(t,"lineProgress"),this.gradientTexture=null;},e.prototype.recalculate=function(e){t.prototype.recalculate.call(this,e),this.paint._values["line-floorwidth"]=no.possiblyEvaluate(this._transitioningPaint._values["line-width"].value,e);},e.prototype.createBucket=function(t){return new Qa(t)},e.prototype.queryRadius=function(t){var e=t,r=ao(oi("line-width",this,e),oi("line-gap-width",this,e)),n=oi("line-offset",this,e);return r/2+Math.abs(n)+si(this.paint.get("line-translate"))},e.prototype.queryIntersectsFeature=function(t,e,r,n,i,a,o){var s=ui(t,this.paint.get("line-translate"),this.paint.get("line-translate-anchor"),a.angle,o),u=o/2*ao(this.paint.get("line-width").evaluate(e,r),this.paint.get("line-gap-width").evaluate(e,r)),l=this.paint.get("line-offset").evaluate(e,r);return l&&(n=function(t,e){for(var r=[],n=new h(0,0),i=0;i<t.length;i++){for(var a=t[i],o=[],s=0;s<a.length;s++){var u=a[s-1],l=a[s],p=a[s+1],c=0===s?n:l.sub(u)._unit()._perp(),f=s===a.length-1?n:p.sub(l)._unit()._perp(),y=c._add(f)._unit(),d=y.x*f.x+y.y*f.y;y._mult(1/d),o.push(y._mult(e)._add(l));}r.push(o);}return r}(n,l*o)),Wn(s,n,u)},e}(Qr);function ao(t,e){return e>0?e+2*t:t}var oo=nn([{name:"a_pos_offset",components:4,type:"Int16"},{name:"a_data",components:4,type:"Uint16"}]),so=nn([{name:"a_projected_pos",components:3,type:"Float32"}],4),uo=(nn([{name:"a_fade_opacity",components:1,type:"Uint32"}],4),nn([{name:"a_placed",components:2,type:"Uint8"}],4)),lo=(nn([{type:"Int16",name:"anchorPointX"},{type:"Int16",name:"anchorPointY"},{type:"Int16",name:"x1"},{type:"Int16",name:"y1"},{type:"Int16",name:"x2"},{type:"Int16",name:"y2"},{type:"Uint32",name:"featureIndex"},{type:"Uint16",name:"sourceLayerIndex"},{type:"Uint16",name:"bucketIndex"},{type:"Int16",name:"radius"},{type:"Int16",name:"signedDistanceFromAnchor"}]),nn([{name:"a_pos",components:2,type:"Int16"},{name:"a_anchor_pos",components:2,type:"Int16"},{name:"a_extrude",components:2,type:"Int16"}],4)),po=nn([{name:"a_pos",components:2,type:"Int16"},{name:"a_anchor_pos",components:2,type:"Int16"},{name:"a_extrude",components:2,type:"Int16"}],4);nn([{type:"Int16",name:"anchorX"},{type:"Int16",name:"anchorY"},{type:"Uint16",name:"glyphStartIndex"},{type:"Uint16",name:"numGlyphs"},{type:"Uint32",name:"vertexStartIndex"},{type:"Uint32",name:"lineStartIndex"},{type:"Uint32",name:"lineLength"},{type:"Uint16",name:"segment"},{type:"Uint16",name:"lowerSize"},{type:"Uint16",name:"upperSize"},{type:"Float32",name:"lineOffsetX"},{type:"Float32",name:"lineOffsetY"},{type:"Uint8",name:"writingMode"},{type:"Uint8",name:"hidden"}]),nn([{type:"Float32",name:"offsetX"}]),nn([{type:"Int16",name:"x"},{type:"Int16",name:"y"},{type:"Int16",name:"tileUnitDistanceFromAnchor"}]);function ho(t,e,r){var n=e.layout.get("text-transform").evaluate(r,{});return"uppercase"===n?t=t.toLocaleUpperCase():"lowercase"===n&&(t=t.toLocaleLowerCase()),Dr.applyArabicShaping&&(t=Dr.applyArabicShaping(t)),t}var co={"!":"︕","#":"＃",$:"＄","%":"％","&":"＆","(":"︵",")":"︶","*":"＊","+":"＋",",":"︐","-":"︲",".":"・","/":"／",":":"︓",";":"︔","<":"︿","=":"＝",">":"﹀","?":"︖","@":"＠","[":"﹇","\\":"＼","]":"﹈","^":"＾",_:"︳","`":"｀","{":"︷","|":"―","}":"︸","~":"～","¢":"￠","£":"￡","¥":"￥","¦":"￤","¬":"￢","¯":"￣","–":"︲","—":"︱","‘":"﹃","’":"﹄","“":"﹁","”":"﹂","…":"︙","‧":"・","₩":"￦","、":"︑","。":"︒","〈":"︿","〉":"﹀","《":"︽","》":"︾","「":"﹁","」":"﹂","『":"﹃","』":"﹄","【":"︻","】":"︼","〔":"︹","〕":"︺","〖":"︗","〗":"︘","！":"︕","（":"︵","）":"︶","，":"︐","－":"︲","．":"・","：":"︓","；":"︔","＜":"︿","＞":"﹀","？":"︖","［":"﹇","］":"﹈","＿":"︳","｛":"︷","｜":"―","｝":"︸","｟":"︵","｠":"︶","｡":"︒","｢":"﹁","｣":"﹂"};var fo=function(t){function e(e,r,n,i){t.call(this,e,r),this.angle=n,void 0!==i&&(this.segment=i);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.clone=function(){return new e(this.x,this.y,this.angle,this.segment)},e}(h);function yo(t,e){var r=e.expression;if("constant"===r.kind)return{functionType:"constant",layoutSize:r.evaluate(new qr(t+1))};if("source"===r.kind)return{functionType:"source"};for(var n=r.zoomStops,i=0;i<n.length&&n[i]<=t;)i++;for(var a=i=Math.max(0,i-1);a<n.length&&n[a]<t+1;)a++;a=Math.min(n.length-1,a);var o={min:n[i],max:n[a]};return"composite"===r.kind?{functionType:"composite",zoomRange:o,propertyValue:e.value}:{functionType:"camera",layoutSize:r.evaluate(new qr(t+1)),zoomRange:o,sizeRange:{min:r.evaluate(new qr(o.min)),max:r.evaluate(new qr(o.max))},propertyValue:e.value}}_r("Anchor",fo);var mo=$a.VectorTileFeature.types,vo=[{name:"a_fade_opacity",components:1,type:"Uint8",offset:0}];function go(t,e,r,n,i,a,o,s){t.emplaceBack(e,r,Math.round(32*n),Math.round(32*i),a,o,s?s[0]:0,s?s[1]:0);}function xo(t,e,r){t.emplaceBack(e.x,e.y,r),t.emplaceBack(e.x,e.y,r),t.emplaceBack(e.x,e.y,r),t.emplaceBack(e.x,e.y,r);}var bo=function(t){this.layoutVertexArray=new pn,this.indexArray=new bn,this.programConfigurations=t,this.segments=new Fn,this.dynamicLayoutVertexArray=new hn,this.opacityVertexArray=new cn,this.placedSymbolArray=new Mn;};bo.prototype.upload=function(t,e,r,n){r&&(this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,oo.members),this.indexBuffer=t.createIndexBuffer(this.indexArray,e),this.dynamicLayoutVertexBuffer=t.createVertexBuffer(this.dynamicLayoutVertexArray,so.members,!0),this.opacityVertexBuffer=t.createVertexBuffer(this.opacityVertexArray,vo,!0),this.opacityVertexBuffer.itemSize=1),(r||n)&&this.programConfigurations.upload(t);},bo.prototype.destroy=function(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.programConfigurations.destroy(),this.segments.destroy(),this.dynamicLayoutVertexBuffer.destroy(),this.opacityVertexBuffer.destroy());},_r("SymbolBuffers",bo);var wo=function(t,e,r){this.layoutVertexArray=new t,this.layoutAttributes=e,this.indexArray=new r,this.segments=new Fn,this.collisionVertexArray=new dn;};wo.prototype.upload=function(t){this.layoutVertexBuffer=t.createVertexBuffer(this.layoutVertexArray,this.layoutAttributes),this.indexBuffer=t.createIndexBuffer(this.indexArray),this.collisionVertexBuffer=t.createVertexBuffer(this.collisionVertexArray,uo.members,!0);},wo.prototype.destroy=function(){this.layoutVertexBuffer&&(this.layoutVertexBuffer.destroy(),this.indexBuffer.destroy(),this.segments.destroy(),this.collisionVertexBuffer.destroy());},_r("CollisionBuffers",wo);var _o=function(t){this.collisionBoxArray=t.collisionBoxArray,this.zoom=t.zoom,this.overscaling=t.overscaling,this.layers=t.layers,this.layerIds=this.layers.map(function(t){return t.id}),this.index=t.index,this.pixelRatio=t.pixelRatio,this.sourceLayerIndex=t.sourceLayerIndex;var e=this.layers[0]._unevaluatedLayout._values;this.textSizeData=yo(this.zoom,e["text-size"]),this.iconSizeData=yo(this.zoom,e["icon-size"]);var r=this.layers[0].layout;this.sortFeaturesByY=r.get("text-allow-overlap")||r.get("icon-allow-overlap")||r.get("text-ignore-placement")||r.get("icon-ignore-placement"),this.sourceID=t.sourceID;};_o.prototype.createArrays=function(){this.text=new bo(new Un(oo.members,this.layers,this.zoom,function(t){return/^text/.test(t)})),this.icon=new bo(new Un(oo.members,this.layers,this.zoom,function(t){return/^icon/.test(t)})),this.collisionBox=new wo(yn,lo.members,wn),this.collisionCircle=new wo(yn,po.members,bn),this.glyphOffsetArray=new Vn,this.lineVertexArray=new Cn;},_o.prototype.populate=function(t,e){var r=this.layers[0],n=r.layout,i=n.get("text-font"),a=n.get("text-field"),o=n.get("icon-image"),s=("constant"!==a.value.kind||a.value.value.length>0)&&("constant"!==i.value.kind||i.value.value.length>0),u="constant"!==o.value.kind||o.value.value&&o.value.value.length>0;if(this.features=[],s||u){for(var l=e.iconDependencies,p=e.glyphDependencies,h=new qr(this.zoom),c=0,f=t;c<f.length;c+=1){var y=f[c],d=y.feature,m=y.index,v=y.sourceLayerIndex;if(r._featureFilter(h,d)){var g=void 0;s&&(g=ho(g=r.getValueAndResolveTokens("text-field",d),r,d));var x=void 0;if(u&&(x=r.getValueAndResolveTokens("icon-image",d)),g||x){var b={text:g,icon:x,index:m,sourceLayerIndex:v,geometry:Jn(d),properties:d.properties,type:mo[d.type]};if(void 0!==d.id&&(b.id=d.id),this.features.push(b),x&&(l[x]=!0),g)for(var w=i.evaluate(d,{}).join(","),_=p[w]=p[w]||{},A="map"===n.get("text-rotation-alignment")&&"point"!==n.get("symbol-placement"),k=Br(g),z=0;z<g.length;z++)if(_[g.charCodeAt(z)]=!0,A&&k){var S=co[g.charAt(z)];S&&(_[S.charCodeAt(0)]=!0);}}}}"line"===n.get("symbol-placement")&&(this.features=function(t){var e={},r={},n=[],i=0;function a(e){n.push(t[e]),i++;}function o(t,e,i){var a=r[t];return delete r[t],r[e]=a,n[a].geometry[0].pop(),n[a].geometry[0]=n[a].geometry[0].concat(i[0]),a}function s(t,r,i){var a=e[r];return delete e[r],e[t]=a,n[a].geometry[0].shift(),n[a].geometry[0]=i[0].concat(n[a].geometry[0]),a}function u(t,e,r){var n=r?e[0][e[0].length-1]:e[0][0];return t+":"+n.x+":"+n.y}for(var l=0;l<t.length;l++){var p=t[l],h=p.geometry,c=p.text;if(c){var f=u(c,h),y=u(c,h,!0);if(f in r&&y in e&&r[f]!==e[y]){var d=s(f,y,h),m=o(f,y,n[d].geometry);delete e[f],delete r[y],r[u(c,n[m].geometry,!0)]=m,n[d].geometry=null;}else f in r?o(f,y,h):y in e?s(f,y,h):(a(l),e[f]=i-1,r[y]=i-1);}else a(l);}return n.filter(function(t){return t.geometry})}(this.features));}},_o.prototype.update=function(t,e){this.stateDependentLayers.length&&(this.text.programConfigurations.updatePaintArrays(t,e,this.layers),this.icon.programConfigurations.updatePaintArrays(t,e,this.layers));},_o.prototype.isEmpty=function(){return 0===this.symbolInstances.length},_o.prototype.uploadPending=function(){return!this.uploaded||this.text.programConfigurations.needsUpload||this.icon.programConfigurations.needsUpload},_o.prototype.upload=function(t){this.uploaded||(this.collisionBox.upload(t),this.collisionCircle.upload(t)),this.text.upload(t,this.sortFeaturesByY,!this.uploaded,this.text.programConfigurations.needsUpload),this.icon.upload(t,this.sortFeaturesByY,!this.uploaded,this.icon.programConfigurations.needsUpload),this.uploaded=!0;},_o.prototype.destroy=function(){this.text.destroy(),this.icon.destroy(),this.collisionBox.destroy(),this.collisionCircle.destroy();},_o.prototype.addToLineVertexArray=function(t,e){var r=this.lineVertexArray.length;if(void 0!==t.segment){for(var n=t.dist(e[t.segment+1]),i=t.dist(e[t.segment]),a={},o=t.segment+1;o<e.length;o++)a[o]={x:e[o].x,y:e[o].y,tileUnitDistanceFromAnchor:n},o<e.length-1&&(n+=e[o+1].dist(e[o]));for(var s=t.segment||0;s>=0;s--)a[s]={x:e[s].x,y:e[s].y,tileUnitDistanceFromAnchor:i},s>0&&(i+=e[s-1].dist(e[s]));for(var u=0;u<e.length;u++){var l=a[u];this.lineVertexArray.emplaceBack(l.x,l.y,l.tileUnitDistanceFromAnchor);}}return{lineStartIndex:r,lineLength:this.lineVertexArray.length-r}},_o.prototype.addSymbols=function(t,e,r,n,i,a,o,s,u,l){for(var p=t.indexArray,h=t.layoutVertexArray,c=t.dynamicLayoutVertexArray,f=t.segments.prepareSegment(4*e.length,t.layoutVertexArray,t.indexArray),y=this.glyphOffsetArray.length,d=f.vertexLength,m=0,v=e;m<v.length;m+=1){var g=v[m],x=g.tl,b=g.tr,w=g.bl,_=g.br,A=g.tex,k=f.vertexLength,z=g.glyphOffset[1];go(h,s.x,s.y,x.x,z+x.y,A.x,A.y,r),go(h,s.x,s.y,b.x,z+b.y,A.x+A.w,A.y,r),go(h,s.x,s.y,w.x,z+w.y,A.x,A.y+A.h,r),go(h,s.x,s.y,_.x,z+_.y,A.x+A.w,A.y+A.h,r),xo(c,s,0),p.emplaceBack(k,k+1,k+2),p.emplaceBack(k+1,k+2,k+3),f.vertexLength+=4,f.primitiveLength+=2,this.glyphOffsetArray.emplaceBack(g.glyphOffset[0]);}t.placedSymbolArray.emplaceBack(s.x,s.y,y,this.glyphOffsetArray.length-y,d,u,l,s.segment,r?r[0]:0,r?r[1]:0,n[0],n[1],o,!1),t.programConfigurations.populatePaintArrays(t.layoutVertexArray.length,a,a.index);},_o.prototype._addCollisionDebugVertex=function(t,e,r,n,i){return e.emplaceBack(0,0),t.emplaceBack(r.x,r.y,n.x,n.y,Math.round(i.x),Math.round(i.y))},_o.prototype.addCollisionDebugVertices=function(t,e,r,n,i,a,o,s){var u=i.segments.prepareSegment(4,i.layoutVertexArray,i.indexArray),l=u.vertexLength,p=i.layoutVertexArray,c=i.collisionVertexArray;if(this._addCollisionDebugVertex(p,c,a,o.anchor,new h(t,e)),this._addCollisionDebugVertex(p,c,a,o.anchor,new h(r,e)),this._addCollisionDebugVertex(p,c,a,o.anchor,new h(r,n)),this._addCollisionDebugVertex(p,c,a,o.anchor,new h(t,n)),u.vertexLength+=4,s){var f=i.indexArray;f.emplaceBack(l,l+1,l+2),f.emplaceBack(l,l+2,l+3),u.primitiveLength+=2;}else{var y=i.indexArray;y.emplaceBack(l,l+1),y.emplaceBack(l+1,l+2),y.emplaceBack(l+2,l+3),y.emplaceBack(l+3,l),u.primitiveLength+=4;}},_o.prototype.generateCollisionDebugBuffers=function(){for(var t=0,e=this.symbolInstances;t<e.length;t+=1){var r=e[t];r.textCollisionFeature={boxStartIndex:r.textBoxStartIndex,boxEndIndex:r.textBoxEndIndex},r.iconCollisionFeature={boxStartIndex:r.iconBoxStartIndex,boxEndIndex:r.iconBoxEndIndex};for(var n=0;n<2;n++){var i=r[0===n?"textCollisionFeature":"iconCollisionFeature"];if(i)for(var a=i.boxStartIndex;a<i.boxEndIndex;a++){var o=this.collisionBoxArray.get(a),s=o.x1,u=o.y1,l=o.x2,p=o.y2,h=o.radius>0;this.addCollisionDebugVertices(s,u,l,p,h?this.collisionCircle:this.collisionBox,o.anchorPoint,r,h);}}}},_o.prototype.deserializeCollisionBoxes=function(t,e,r,n,i){for(var a={},o=e;o<r;o++){var s=t.get(o);if(0===s.radius){a.textBox={x1:s.x1,y1:s.y1,x2:s.x2,y2:s.y2,anchorPointX:s.anchorPointX,anchorPointY:s.anchorPointY},a.textFeatureIndex=s.featureIndex;break}a.textCircles||(a.textCircles=[],a.textFeatureIndex=s.featureIndex);a.textCircles.push(s.anchorPointX,s.anchorPointY,s.radius,s.signedDistanceFromAnchor,1);}for(var u=n;u<i;u++){var l=t.get(u);if(0===l.radius){a.iconBox={x1:l.x1,y1:l.y1,x2:l.x2,y2:l.y2,anchorPointX:l.anchorPointX,anchorPointY:l.anchorPointY},a.iconFeatureIndex=l.featureIndex;break}}return a},_o.prototype.hasTextData=function(){return this.text.segments.get().length>0},_o.prototype.hasIconData=function(){return this.icon.segments.get().length>0},_o.prototype.hasCollisionBoxData=function(){return this.collisionBox.segments.get().length>0},_o.prototype.hasCollisionCircleData=function(){return this.collisionCircle.segments.get().length>0},_o.prototype.sortFeatures=function(t){var e=this;if(this.sortFeaturesByY&&this.sortedAngle!==t&&(this.sortedAngle=t,!(this.text.segments.get().length>1||this.icon.segments.get().length>1))){for(var r=[],n=0;n<this.symbolInstances.length;n++)r.push(n);var i=Math.sin(t),a=Math.cos(t);r.sort(function(t,r){var n=e.symbolInstances[t],o=e.symbolInstances[r];return(0|Math.round(i*n.anchor.x+a*n.anchor.y))-(0|Math.round(i*o.anchor.x+a*o.anchor.y))||o.featureIndex-n.featureIndex}),this.text.indexArray.clear(),this.icon.indexArray.clear(),this.featureSortOrder=[];for(var o=0,s=r;o<s.length;o+=1){var u=s[o],l=e.symbolInstances[u];e.featureSortOrder.push(l.featureIndex);for(var p=0,h=l.placedTextSymbolIndices;p<h.length;p+=1)for(var c=h[p],f=e.text.placedSymbolArray.get(c),y=f.vertexStartIndex+4*f.numGlyphs,d=f.vertexStartIndex;d<y;d+=4)e.text.indexArray.emplaceBack(d,d+1,d+2),e.text.indexArray.emplaceBack(d+1,d+2,d+3);var m=e.icon.placedSymbolArray.get(u);if(m.numGlyphs){var v=m.vertexStartIndex;e.icon.indexArray.emplaceBack(v,v+1,v+2),e.icon.indexArray.emplaceBack(v+1,v+2,v+3);}}this.text.indexBuffer&&this.text.indexBuffer.updateData(this.text.indexArray),this.icon.indexBuffer&&this.icon.indexBuffer.updateData(this.icon.indexArray);}},_r("SymbolBucket",_o,{omit:["layers","collisionBoxArray","features","compareText"],shallow:["symbolInstances"]}),_o.MAX_GLYPHS=65535,_o.addDynamicAttributes=xo;var Ao=new Wr({"symbol-placement":new Hr(D.layout_symbol["symbol-placement"]),"symbol-spacing":new Hr(D.layout_symbol["symbol-spacing"]),"symbol-avoid-edges":new Hr(D.layout_symbol["symbol-avoid-edges"]),"icon-allow-overlap":new Hr(D.layout_symbol["icon-allow-overlap"]),"icon-ignore-placement":new Hr(D.layout_symbol["icon-ignore-placement"]),"icon-optional":new Hr(D.layout_symbol["icon-optional"]),"icon-rotation-alignment":new Hr(D.layout_symbol["icon-rotation-alignment"]),"icon-size":new Kr(D.layout_symbol["icon-size"]),"icon-text-fit":new Hr(D.layout_symbol["icon-text-fit"]),"icon-text-fit-padding":new Hr(D.layout_symbol["icon-text-fit-padding"]),"icon-image":new Kr(D.layout_symbol["icon-image"]),"icon-rotate":new Kr(D.layout_symbol["icon-rotate"]),"icon-padding":new Hr(D.layout_symbol["icon-padding"]),"icon-keep-upright":new Hr(D.layout_symbol["icon-keep-upright"]),"icon-offset":new Kr(D.layout_symbol["icon-offset"]),"icon-anchor":new Kr(D.layout_symbol["icon-anchor"]),"icon-pitch-alignment":new Hr(D.layout_symbol["icon-pitch-alignment"]),"text-pitch-alignment":new Hr(D.layout_symbol["text-pitch-alignment"]),"text-rotation-alignment":new Hr(D.layout_symbol["text-rotation-alignment"]),"text-field":new Kr(D.layout_symbol["text-field"]),"text-font":new Kr(D.layout_symbol["text-font"]),"text-size":new Kr(D.layout_symbol["text-size"]),"text-max-width":new Kr(D.layout_symbol["text-max-width"]),"text-line-height":new Hr(D.layout_symbol["text-line-height"]),"text-letter-spacing":new Kr(D.layout_symbol["text-letter-spacing"]),"text-justify":new Kr(D.layout_symbol["text-justify"]),"text-anchor":new Kr(D.layout_symbol["text-anchor"]),"text-max-angle":new Hr(D.layout_symbol["text-max-angle"]),"text-rotate":new Kr(D.layout_symbol["text-rotate"]),"text-padding":new Hr(D.layout_symbol["text-padding"]),"text-keep-upright":new Hr(D.layout_symbol["text-keep-upright"]),"text-transform":new Kr(D.layout_symbol["text-transform"]),"text-offset":new Kr(D.layout_symbol["text-offset"]),"text-allow-overlap":new Hr(D.layout_symbol["text-allow-overlap"]),"text-ignore-placement":new Hr(D.layout_symbol["text-ignore-placement"]),"text-optional":new Hr(D.layout_symbol["text-optional"])}),ko={paint:new Wr({"icon-opacity":new Kr(D.paint_symbol["icon-opacity"]),"icon-color":new Kr(D.paint_symbol["icon-color"]),"icon-halo-color":new Kr(D.paint_symbol["icon-halo-color"]),"icon-halo-width":new Kr(D.paint_symbol["icon-halo-width"]),"icon-halo-blur":new Kr(D.paint_symbol["icon-halo-blur"]),"icon-translate":new Hr(D.paint_symbol["icon-translate"]),"icon-translate-anchor":new Hr(D.paint_symbol["icon-translate-anchor"]),"text-opacity":new Kr(D.paint_symbol["text-opacity"]),"text-color":new Kr(D.paint_symbol["text-color"]),"text-halo-color":new Kr(D.paint_symbol["text-halo-color"]),"text-halo-width":new Kr(D.paint_symbol["text-halo-width"]),"text-halo-blur":new Kr(D.paint_symbol["text-halo-blur"]),"text-translate":new Hr(D.paint_symbol["text-translate"]),"text-translate-anchor":new Hr(D.paint_symbol["text-translate-anchor"])}),layout:Ao},zo=function(t){function e(e){t.call(this,e,ko);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.recalculate=function(e){t.prototype.recalculate.call(this,e),"auto"===this.layout.get("icon-rotation-alignment")&&("point"!==this.layout.get("symbol-placement")?this.layout._values["icon-rotation-alignment"]="map":this.layout._values["icon-rotation-alignment"]="viewport"),"auto"===this.layout.get("text-rotation-alignment")&&("point"!==this.layout.get("symbol-placement")?this.layout._values["text-rotation-alignment"]="map":this.layout._values["text-rotation-alignment"]="viewport"),"auto"===this.layout.get("text-pitch-alignment")&&(this.layout._values["text-pitch-alignment"]=this.layout.get("text-rotation-alignment")),"auto"===this.layout.get("icon-pitch-alignment")&&(this.layout._values["icon-pitch-alignment"]=this.layout.get("icon-rotation-alignment"));},e.prototype.getValueAndResolveTokens=function(t,e){var r,n=this.layout.get(t).evaluate(e,{}),i=this._unevaluatedLayout._values[t];return i.isDataDriven()||Ie(i.value)?n:(r=e.properties,n.replace(/{([^{}]+)}/g,function(t,e){return e in r?String(r[e]):""}))},e.prototype.createBucket=function(t){return new _o(t)},e.prototype.queryRadius=function(){return 0},e.prototype.queryIntersectsFeature=function(){return!1},e}(Qr),So={paint:new Wr({"background-color":new Hr(D.paint_background["background-color"]),"background-pattern":new Gr(D.paint_background["background-pattern"]),"background-opacity":new Hr(D.paint_background["background-opacity"])})},Mo=function(t){function e(e){t.call(this,e,So);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e}(Qr),Bo={paint:new Wr({"raster-opacity":new Hr(D.paint_raster["raster-opacity"]),"raster-hue-rotate":new Hr(D.paint_raster["raster-hue-rotate"]),"raster-brightness-min":new Hr(D.paint_raster["raster-brightness-min"]),"raster-brightness-max":new Hr(D.paint_raster["raster-brightness-max"]),"raster-saturation":new Hr(D.paint_raster["raster-saturation"]),"raster-contrast":new Hr(D.paint_raster["raster-contrast"]),"raster-resampling":new Hr(D.paint_raster["raster-resampling"]),"raster-fade-duration":new Hr(D.paint_raster["raster-fade-duration"])})},Vo={circle:Pi,heatmap:Zi,hillshade:$i,fill:Ba,"fill-extrusion":La,line:io,symbol:zo,background:Mo,raster:function(t){function e(e){t.call(this,e,Bo);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e}(Qr)};var Io=r(function(t,e){t.exports=function(){function t(t,e,r){r=r||{},this.w=t||64,this.h=e||64,this.autoResize=!!r.autoResize,this.shelves=[],this.freebins=[],this.stats={},this.bins={},this.maxId=0;}function e(t,e,r){this.x=0,this.y=t,this.w=this.free=e,this.h=r;}return t.prototype.pack=function(t,e){t=[].concat(t),e=e||{};for(var r,n,i,a,o=[],s=0;s<t.length;s++)if(r=t[s].w||t[s].width,n=t[s].h||t[s].height,i=t[s].id,r&&n){if(!(a=this.packOne(r,n,i)))continue;e.inPlace&&(t[s].x=a.x,t[s].y=a.y,t[s].id=a.id),o.push(a);}return this.shrink(),o},t.prototype.packOne=function(t,r,n){var i,a,o,s,u,l,p,h,c={freebin:-1,shelf:-1,waste:1/0},f=0;if("string"==typeof n||"number"==typeof n){if(i=this.getBin(n))return this.ref(i),i;"number"==typeof n&&(this.maxId=Math.max(n,this.maxId));}else n=++this.maxId;for(s=0;s<this.freebins.length;s++){if(r===(i=this.freebins[s]).maxh&&t===i.maxw)return this.allocFreebin(s,t,r,n);r>i.maxh||t>i.maxw||r<=i.maxh&&t<=i.maxw&&(o=i.maxw*i.maxh-t*r)<c.waste&&(c.waste=o,c.freebin=s);}for(s=0;s<this.shelves.length;s++)if(f+=(a=this.shelves[s]).h,!(t>a.free)){if(r===a.h)return this.allocShelf(s,t,r,n);r>a.h||r<a.h&&(o=(a.h-r)*t)<c.waste&&(c.freebin=-1,c.waste=o,c.shelf=s);}return-1!==c.freebin?this.allocFreebin(c.freebin,t,r,n):-1!==c.shelf?this.allocShelf(c.shelf,t,r,n):r<=this.h-f&&t<=this.w?(a=new e(f,this.w,r),this.allocShelf(this.shelves.push(a)-1,t,r,n)):this.autoResize?(u=l=this.h,((p=h=this.w)<=u||t>p)&&(h=2*Math.max(t,p)),(u<p||r>u)&&(l=2*Math.max(r,u)),this.resize(h,l),this.packOne(t,r,n)):null},t.prototype.allocFreebin=function(t,e,r,n){var i=this.freebins.splice(t,1)[0];return i.id=n,i.w=e,i.h=r,i.refcount=0,this.bins[n]=i,this.ref(i),i},t.prototype.allocShelf=function(t,e,r,n){var i=this.shelves[t].alloc(e,r,n);return this.bins[n]=i,this.ref(i),i},t.prototype.shrink=function(){if(this.shelves.length>0){for(var t=0,e=0,r=0;r<this.shelves.length;r++){var n=this.shelves[r];e+=n.h,t=Math.max(n.w-n.free,t);}this.resize(t,e);}},t.prototype.getBin=function(t){return this.bins[t]},t.prototype.ref=function(t){if(1==++t.refcount){var e=t.h;this.stats[e]=1+(0|this.stats[e]);}return t.refcount},t.prototype.unref=function(t){return 0===t.refcount?0:(0==--t.refcount&&(this.stats[t.h]--,delete this.bins[t.id],this.freebins.push(t)),t.refcount)},t.prototype.clear=function(){this.shelves=[],this.freebins=[],this.stats={},this.bins={},this.maxId=0;},t.prototype.resize=function(t,e){this.w=t,this.h=e;for(var r=0;r<this.shelves.length;r++)this.shelves[r].resize(t);return!0},e.prototype.alloc=function(t,e,r){if(t>this.free||e>this.h)return null;var n=this.x;return this.x+=t,this.free-=t,new function(t,e,r,n,i,a,o){this.id=t,this.x=e,this.y=r,this.w=n,this.h=i,this.maxw=a||n,this.maxh=o||i,this.refcount=0;}(r,n,this.y,t,e,t,this.h)},e.prototype.resize=function(t){return this.free+=t-this.w,this.w=t,!0},t}();}),Co=function(t,e){var r=e.pixelRatio;this.paddedRect=t,this.pixelRatio=r;},Eo={tl:{configurable:!0},br:{configurable:!0},displaySize:{configurable:!0}};Eo.tl.get=function(){return[this.paddedRect.x+1,this.paddedRect.y+1]},Eo.br.get=function(){return[this.paddedRect.x+this.paddedRect.w-1,this.paddedRect.y+this.paddedRect.h-1]},Eo.displaySize.get=function(){return[(this.paddedRect.w-2)/this.pixelRatio,(this.paddedRect.h-2)/this.pixelRatio]},Object.defineProperties(Co.prototype,Eo);var To=function(t){var e=new Ri({width:0,height:0}),r={},n=new Io(0,0,{autoResize:!0});for(var i in t){var a=t[i],o=n.packOne(a.data.width+2,a.data.height+2);e.resize({width:n.w,height:n.h}),Ri.copy(a.data,e,{x:0,y:0},{x:o.x+1,y:o.y+1},a.data),r[i]=new Co(o,a);}n.shrink(),e.resize({width:n.w,height:n.h}),this.image=e,this.positions=r;};_r("ImagePosition",Co),_r("ImageAtlas",To);var Po=self.HTMLImageElement,Fo=self.HTMLCanvasElement,Lo=self.HTMLVideoElement,Oo=self.ImageData,Do=function(t,e,r,n){this.context=t,this.format=r,this.texture=t.gl.createTexture(),this.update(e,n);};Do.prototype.update=function(t,e){var r=t.width,n=t.height,i=!this.size||this.size[0]!==r||this.size[1]!==n,a=this.context,o=a.gl;this.useMipmap=Boolean(e&&e.useMipmap),o.bindTexture(o.TEXTURE_2D,this.texture),i?(this.size=[r,n],a.pixelStoreUnpack.set(1),this.format!==o.RGBA||e&&!1===e.premultiply||a.pixelStoreUnpackPremultiplyAlpha.set(!0),t instanceof Po||t instanceof Fo||t instanceof Lo||t instanceof Oo?o.texImage2D(o.TEXTURE_2D,0,this.format,this.format,o.UNSIGNED_BYTE,t):o.texImage2D(o.TEXTURE_2D,0,this.format,r,n,0,this.format,o.UNSIGNED_BYTE,t.data)):t instanceof Po||t instanceof Fo||t instanceof Lo||t instanceof Oo?o.texSubImage2D(o.TEXTURE_2D,0,0,0,o.RGBA,o.UNSIGNED_BYTE,t):o.texSubImage2D(o.TEXTURE_2D,0,0,0,r,n,o.RGBA,o.UNSIGNED_BYTE,t.data),this.useMipmap&&this.isSizePowerOfTwo()&&o.generateMipmap(o.TEXTURE_2D);},Do.prototype.bind=function(t,e,r){var n=this.context.gl;n.bindTexture(n.TEXTURE_2D,this.texture),r!==n.LINEAR_MIPMAP_NEAREST||this.isSizePowerOfTwo()||(r=n.LINEAR),t!==this.filter&&(n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,t),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,r||t),this.filter=t),e!==this.wrap&&(n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,e),this.wrap=e);},Do.prototype.isSizePowerOfTwo=function(){return this.size[0]===this.size[1]&&Math.log(this.size[0])/Math.LN2%1==0},Do.prototype.destroy=function(){this.context.gl.deleteTexture(this.texture),this.texture=null;};var qo=function(t,e,r,n,i){var a,o,s=8*i-n-1,u=(1<<s)-1,l=u>>1,p=-7,h=r?i-1:0,c=r?-1:1,f=t[e+h];for(h+=c,a=f&(1<<-p)-1,f>>=-p,p+=s;p>0;a=256*a+t[e+h],h+=c,p-=8);for(o=a&(1<<-p)-1,a>>=-p,p+=n;p>0;o=256*o+t[e+h],h+=c,p-=8);if(0===a)a=1-l;else{if(a===u)return o?NaN:1/0*(f?-1:1);o+=Math.pow(2,n),a-=l;}return(f?-1:1)*o*Math.pow(2,a-n)},jo=function(t,e,r,n,i,a){var o,s,u,l=8*a-i-1,p=(1<<l)-1,h=p>>1,c=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,f=n?0:a-1,y=n?1:-1,d=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(s=isNaN(e)?1:0,o=p):(o=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-o))<1&&(o--,u*=2),(e+=o+h>=1?c/u:c*Math.pow(2,1-h))*u>=2&&(o++,u/=2),o+h>=p?(s=0,o=p):o+h>=1?(s=(e*u-1)*Math.pow(2,i),o+=h):(s=e*Math.pow(2,h-1)*Math.pow(2,i),o=0));i>=8;t[r+f]=255&s,f+=y,s/=256,i-=8);for(o=o<<i|s,l+=i;l>0;t[r+f]=255&o,f+=y,o/=256,l-=8);t[r+f-y]|=128*d;},Ro=Uo;function Uo(t){this.buf=ArrayBuffer.isView&&ArrayBuffer.isView(t)?t:new Uint8Array(t||0),this.pos=0,this.type=0,this.length=this.buf.length;}Uo.Varint=0,Uo.Fixed64=1,Uo.Bytes=2,Uo.Fixed32=5;function No(t){return t.type===Uo.Bytes?t.readVarint()+t.pos:t.pos+1}function Zo(t,e,r){return r?4294967296*e+(t>>>0):4294967296*(e>>>0)+(t>>>0)}function Xo(t,e,r){var n=e<=16383?1:e<=2097151?2:e<=268435455?3:Math.ceil(Math.log(e)/(7*Math.LN2));r.realloc(n);for(var i=r.pos-1;i>=t;i--)r.buf[i+n]=r.buf[i];}function $o(t,e){for(var r=0;r<t.length;r++)e.writeVarint(t[r]);}function Jo(t,e){for(var r=0;r<t.length;r++)e.writeSVarint(t[r]);}function Ho(t,e){for(var r=0;r<t.length;r++)e.writeFloat(t[r]);}function Ko(t,e){for(var r=0;r<t.length;r++)e.writeDouble(t[r]);}function Go(t,e){for(var r=0;r<t.length;r++)e.writeBoolean(t[r]);}function Yo(t,e){for(var r=0;r<t.length;r++)e.writeFixed32(t[r]);}function Wo(t,e){for(var r=0;r<t.length;r++)e.writeSFixed32(t[r]);}function Qo(t,e){for(var r=0;r<t.length;r++)e.writeFixed64(t[r]);}function ts(t,e){for(var r=0;r<t.length;r++)e.writeSFixed64(t[r]);}function es(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16)+16777216*t[e+3]}function rs(t,e,r){t[r]=e,t[r+1]=e>>>8,t[r+2]=e>>>16,t[r+3]=e>>>24;}function ns(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16)+(t[e+3]<<24)}Uo.prototype={destroy:function(){this.buf=null;},readFields:function(t,e,r){for(r=r||this.length;this.pos<r;){var n=this.readVarint(),i=n>>3,a=this.pos;this.type=7&n,t(i,e,this),this.pos===a&&this.skip(n);}return e},readMessage:function(t,e){return this.readFields(t,e,this.readVarint()+this.pos)},readFixed32:function(){var t=es(this.buf,this.pos);return this.pos+=4,t},readSFixed32:function(){var t=ns(this.buf,this.pos);return this.pos+=4,t},readFixed64:function(){var t=es(this.buf,this.pos)+4294967296*es(this.buf,this.pos+4);return this.pos+=8,t},readSFixed64:function(){var t=es(this.buf,this.pos)+4294967296*ns(this.buf,this.pos+4);return this.pos+=8,t},readFloat:function(){var t=qo(this.buf,this.pos,!0,23,4);return this.pos+=4,t},readDouble:function(){var t=qo(this.buf,this.pos,!0,52,8);return this.pos+=8,t},readVarint:function(t){var e,r,n=this.buf;return e=127&(r=n[this.pos++]),r<128?e:(e|=(127&(r=n[this.pos++]))<<7,r<128?e:(e|=(127&(r=n[this.pos++]))<<14,r<128?e:(e|=(127&(r=n[this.pos++]))<<21,r<128?e:function(t,e,r){var n,i,a=r.buf;if(i=a[r.pos++],n=(112&i)>>4,i<128)return Zo(t,n,e);if(i=a[r.pos++],n|=(127&i)<<3,i<128)return Zo(t,n,e);if(i=a[r.pos++],n|=(127&i)<<10,i<128)return Zo(t,n,e);if(i=a[r.pos++],n|=(127&i)<<17,i<128)return Zo(t,n,e);if(i=a[r.pos++],n|=(127&i)<<24,i<128)return Zo(t,n,e);if(i=a[r.pos++],n|=(1&i)<<31,i<128)return Zo(t,n,e);throw new Error("Expected varint not more than 10 bytes")}(e|=(15&(r=n[this.pos]))<<28,t,this))))},readVarint64:function(){return this.readVarint(!0)},readSVarint:function(){var t=this.readVarint();return t%2==1?(t+1)/-2:t/2},readBoolean:function(){return Boolean(this.readVarint())},readString:function(){var t=this.readVarint()+this.pos,e=function(t,e,r){var n="",i=e;for(;i<r;){var a,o,s,u=t[i],l=null,p=u>239?4:u>223?3:u>191?2:1;if(i+p>r)break;1===p?u<128&&(l=u):2===p?128==(192&(a=t[i+1]))&&(l=(31&u)<<6|63&a)<=127&&(l=null):3===p?(a=t[i+1],o=t[i+2],128==(192&a)&&128==(192&o)&&((l=(15&u)<<12|(63&a)<<6|63&o)<=2047||l>=55296&&l<=57343)&&(l=null)):4===p&&(a=t[i+1],o=t[i+2],s=t[i+3],128==(192&a)&&128==(192&o)&&128==(192&s)&&((l=(15&u)<<18|(63&a)<<12|(63&o)<<6|63&s)<=65535||l>=1114112)&&(l=null)),null===l?(l=65533,p=1):l>65535&&(l-=65536,n+=String.fromCharCode(l>>>10&1023|55296),l=56320|1023&l),n+=String.fromCharCode(l),i+=p;}return n}(this.buf,this.pos,t);return this.pos=t,e},readBytes:function(){var t=this.readVarint()+this.pos,e=this.buf.subarray(this.pos,t);return this.pos=t,e},readPackedVarint:function(t,e){var r=No(this);for(t=t||[];this.pos<r;)t.push(this.readVarint(e));return t},readPackedSVarint:function(t){var e=No(this);for(t=t||[];this.pos<e;)t.push(this.readSVarint());return t},readPackedBoolean:function(t){var e=No(this);for(t=t||[];this.pos<e;)t.push(this.readBoolean());return t},readPackedFloat:function(t){var e=No(this);for(t=t||[];this.pos<e;)t.push(this.readFloat());return t},readPackedDouble:function(t){var e=No(this);for(t=t||[];this.pos<e;)t.push(this.readDouble());return t},readPackedFixed32:function(t){var e=No(this);for(t=t||[];this.pos<e;)t.push(this.readFixed32());return t},readPackedSFixed32:function(t){var e=No(this);for(t=t||[];this.pos<e;)t.push(this.readSFixed32());return t},readPackedFixed64:function(t){var e=No(this);for(t=t||[];this.pos<e;)t.push(this.readFixed64());return t},readPackedSFixed64:function(t){var e=No(this);for(t=t||[];this.pos<e;)t.push(this.readSFixed64());return t},skip:function(t){var e=7&t;if(e===Uo.Varint)for(;this.buf[this.pos++]>127;);else if(e===Uo.Bytes)this.pos=this.readVarint()+this.pos;else if(e===Uo.Fixed32)this.pos+=4;else{if(e!==Uo.Fixed64)throw new Error("Unimplemented type: "+e);this.pos+=8;}},writeTag:function(t,e){this.writeVarint(t<<3|e);},realloc:function(t){for(var e=this.length||16;e<this.pos+t;)e*=2;if(e!==this.length){var r=new Uint8Array(e);r.set(this.buf),this.buf=r,this.length=e;}},finish:function(){return this.length=this.pos,this.pos=0,this.buf.subarray(0,this.length)},writeFixed32:function(t){this.realloc(4),rs(this.buf,t,this.pos),this.pos+=4;},writeSFixed32:function(t){this.realloc(4),rs(this.buf,t,this.pos),this.pos+=4;},writeFixed64:function(t){this.realloc(8),rs(this.buf,-1&t,this.pos),rs(this.buf,Math.floor(t*(1/4294967296)),this.pos+4),this.pos+=8;},writeSFixed64:function(t){this.realloc(8),rs(this.buf,-1&t,this.pos),rs(this.buf,Math.floor(t*(1/4294967296)),this.pos+4),this.pos+=8;},writeVarint:function(t){(t=+t||0)>268435455||t<0?function(t,e){var r,n;t>=0?(r=t%4294967296|0,n=t/4294967296|0):(n=~(-t/4294967296),4294967295^(r=~(-t%4294967296))?r=r+1|0:(r=0,n=n+1|0));if(t>=0x10000000000000000||t<-0x10000000000000000)throw new Error("Given varint doesn't fit into 10 bytes");e.realloc(10),function(t,e,r){r.buf[r.pos++]=127&t|128,t>>>=7,r.buf[r.pos++]=127&t|128,t>>>=7,r.buf[r.pos++]=127&t|128,t>>>=7,r.buf[r.pos++]=127&t|128,t>>>=7,r.buf[r.pos]=127&t;}(r,0,e),function(t,e){var r=(7&t)<<4;if(e.buf[e.pos++]|=r|((t>>>=3)?128:0),!t)return;if(e.buf[e.pos++]=127&t|((t>>>=7)?128:0),!t)return;if(e.buf[e.pos++]=127&t|((t>>>=7)?128:0),!t)return;if(e.buf[e.pos++]=127&t|((t>>>=7)?128:0),!t)return;if(e.buf[e.pos++]=127&t|((t>>>=7)?128:0),!t)return;e.buf[e.pos++]=127&t;}(n,e);}(t,this):(this.realloc(4),this.buf[this.pos++]=127&t|(t>127?128:0),t<=127||(this.buf[this.pos++]=127&(t>>>=7)|(t>127?128:0),t<=127||(this.buf[this.pos++]=127&(t>>>=7)|(t>127?128:0),t<=127||(this.buf[this.pos++]=t>>>7&127))));},writeSVarint:function(t){this.writeVarint(t<0?2*-t-1:2*t);},writeBoolean:function(t){this.writeVarint(Boolean(t));},writeString:function(t){t=String(t),this.realloc(4*t.length),this.pos++;var e=this.pos;this.pos=function(t,e,r){for(var n,i,a=0;a<e.length;a++){if((n=e.charCodeAt(a))>55295&&n<57344){if(!i){n>56319||a+1===e.length?(t[r++]=239,t[r++]=191,t[r++]=189):i=n;continue}if(n<56320){t[r++]=239,t[r++]=191,t[r++]=189,i=n;continue}n=i-55296<<10|n-56320|65536,i=null;}else i&&(t[r++]=239,t[r++]=191,t[r++]=189,i=null);n<128?t[r++]=n:(n<2048?t[r++]=n>>6|192:(n<65536?t[r++]=n>>12|224:(t[r++]=n>>18|240,t[r++]=n>>12&63|128),t[r++]=n>>6&63|128),t[r++]=63&n|128);}return r}(this.buf,t,this.pos);var r=this.pos-e;r>=128&&Xo(e,r,this),this.pos=e-1,this.writeVarint(r),this.pos+=r;},writeFloat:function(t){this.realloc(4),jo(this.buf,t,this.pos,!0,23,4),this.pos+=4;},writeDouble:function(t){this.realloc(8),jo(this.buf,t,this.pos,!0,52,8),this.pos+=8;},writeBytes:function(t){var e=t.length;this.writeVarint(e),this.realloc(e);for(var r=0;r<e;r++)this.buf[this.pos++]=t[r];},writeRawMessage:function(t,e){this.pos++;var r=this.pos;t(e,this);var n=this.pos-r;n>=128&&Xo(r,n,this),this.pos=r-1,this.writeVarint(n),this.pos+=n;},writeMessage:function(t,e,r){this.writeTag(t,Uo.Bytes),this.writeRawMessage(e,r);},writePackedVarint:function(t,e){this.writeMessage(t,$o,e);},writePackedSVarint:function(t,e){this.writeMessage(t,Jo,e);},writePackedBoolean:function(t,e){this.writeMessage(t,Go,e);},writePackedFloat:function(t,e){this.writeMessage(t,Ho,e);},writePackedDouble:function(t,e){this.writeMessage(t,Ko,e);},writePackedFixed32:function(t,e){this.writeMessage(t,Yo,e);},writePackedSFixed32:function(t,e){this.writeMessage(t,Wo,e);},writePackedFixed64:function(t,e){this.writeMessage(t,Qo,e);},writePackedSFixed64:function(t,e){this.writeMessage(t,ts,e);},writeBytesField:function(t,e){this.writeTag(t,Uo.Bytes),this.writeBytes(e);},writeFixed32Field:function(t,e){this.writeTag(t,Uo.Fixed32),this.writeFixed32(e);},writeSFixed32Field:function(t,e){this.writeTag(t,Uo.Fixed32),this.writeSFixed32(e);},writeFixed64Field:function(t,e){this.writeTag(t,Uo.Fixed64),this.writeFixed64(e);},writeSFixed64Field:function(t,e){this.writeTag(t,Uo.Fixed64),this.writeSFixed64(e);},writeVarintField:function(t,e){this.writeTag(t,Uo.Varint),this.writeVarint(e);},writeSVarintField:function(t,e){this.writeTag(t,Uo.Varint),this.writeSVarint(e);},writeStringField:function(t,e){this.writeTag(t,Uo.Bytes),this.writeString(e);},writeFloatField:function(t,e){this.writeTag(t,Uo.Fixed32),this.writeFloat(e);},writeDoubleField:function(t,e){this.writeTag(t,Uo.Fixed64),this.writeDouble(e);},writeBooleanField:function(t,e){this.writeVarintField(t,Boolean(e));}};var is=3;function as(t,e,r){1===t&&r.readMessage(os,e);}function os(t,e,r){if(3===t){var n=r.readMessage(ss,{}),i=n.id,a=n.bitmap,o=n.width,s=n.height,u=n.left,l=n.top,p=n.advance;e.push({id:i,bitmap:new ji({width:o+2*is,height:s+2*is},a),metrics:{width:o,height:s,left:u,top:l,advance:p}});}}function ss(t,e,r){1===t?e.id=r.readVarint():2===t?e.bitmap=r.readBytes():3===t?e.width=r.readVarint():4===t?e.height=r.readVarint():5===t?e.left=r.readSVarint():6===t?e.top=r.readSVarint():7===t&&(e.advance=r.readVarint());}var us=is,ls=function(t,e,r){this.target=t,this.parent=e,this.mapId=r,this.callbacks={},this.callbackID=0,b(["receive"],this),this.target.addEventListener("message",this.receive,!1);};ls.prototype.send=function(t,e,r,n){var i=r?this.mapId+":"+this.callbackID++:null;r&&(this.callbacks[i]=r);var a=[];this.target.postMessage({targetMapId:n,sourceMapId:this.mapId,type:t,id:String(i),data:kr(e,a)},a);},ls.prototype.receive=function(t){var e,r=this,n=t.data,i=n.id;if(!n.targetMapId||this.mapId===n.targetMapId){var a=function(t,e){var n=[];r.target.postMessage({sourceMapId:r.mapId,type:"<response>",id:String(i),error:t?kr(t):null,data:kr(e,n)},n);};if("<response>"===n.type)e=this.callbacks[n.id],delete this.callbacks[n.id],e&&n.error?e(zr(n.error)):e&&e(null,zr(n.data));else if(void 0!==n.id&&this.parent[n.type])this.parent[n.type](n.sourceMapId,zr(n.data),a);else if(void 0!==n.id&&this.parent.getWorkerSource){var o=n.type.split("."),s=zr(n.data);this.parent.getWorkerSource(n.sourceMapId,o[0],s.source)[o[1]](s,a);}else this.parent[n.type](zr(n.data));}},ls.prototype.remove=function(){this.target.removeEventListener("message",this.receive,!1);};var ps=r(function(t,e){!function(t){function e(t,e,n){e=Math.pow(2,n)-e-1;var i=r(256*t,256*e,n),a=r(256*(t+1),256*(e+1),n);return i[0]+","+i[1]+","+a[0]+","+a[1]}function r(t,e,r){var n=2*Math.PI*6378137/256/Math.pow(2,r),i=t*n-2*Math.PI*6378137/2,a=e*n-2*Math.PI*6378137/2;return[i,a]}t.getURL=function(t,r,n,i,a,o){return o=o||{},t+"?"+["bbox="+e(n,i,a),"format="+(o.format||"image/png"),"service="+(o.service||"WMS"),"version="+(o.version||"1.1.1"),"request="+(o.request||"GetMap"),"srs="+(o.srs||"EPSG:3857"),"width="+(o.width||256),"height="+(o.height||256),"layers="+r].join("&")},t.getTileBBox=e,t.getMercCoords=r,Object.defineProperty(t,"__esModule",{value:!0});}(e);});e(ps);var hs=ps.getTileBBox,cs=function(t,e,r){this.z=t,this.x=e,this.y=r,this.key=ds(0,t,e,r);};cs.prototype.equals=function(t){return this.z===t.z&&this.x===t.x&&this.y===t.y},cs.prototype.url=function(t,e){var r=hs(this.x,this.y,this.z),n=function(t,e,r){for(var n,i="",a=t;a>0;a--)i+=(e&(n=1<<a-1)?1:0)+(r&n?2:0);return i}(this.z,this.x,this.y);return t[(this.x+this.y)%t.length].replace("{prefix}",(this.x%16).toString(16)+(this.y%16).toString(16)).replace("{z}",String(this.z)).replace("{x}",String(this.x)).replace("{y}",String("tms"===e?Math.pow(2,this.z)-this.y-1:this.y)).replace("{quadkey}",n).replace("{bbox-epsg-3857}",r)};var fs=function(t,e){this.wrap=t,this.canonical=e,this.key=ds(t,e.z,e.x,e.y);},ys=function(t,e,r,n,i){this.overscaledZ=t,this.wrap=e,this.canonical=new cs(r,+n,+i),this.key=ds(e,t,n,i);};function ds(t,e,r,n){(t*=2)<0&&(t=-1*t-1);var i=1<<e;return 32*(i*i*t+i*n+r)+e}ys.prototype.equals=function(t){return this.overscaledZ===t.overscaledZ&&this.wrap===t.wrap&&this.canonical.equals(t.canonical)},ys.prototype.scaledTo=function(t){var e=this.canonical.z-t;return t>this.canonical.z?new ys(t,this.wrap,this.canonical.z,this.canonical.x,this.canonical.y):new ys(t,this.wrap,t,this.canonical.x>>e,this.canonical.y>>e)},ys.prototype.isChildOf=function(t){var e=this.canonical.z-t.canonical.z;return 0===t.overscaledZ||t.overscaledZ<this.overscaledZ&&t.canonical.x===this.canonical.x>>e&&t.canonical.y===this.canonical.y>>e},ys.prototype.children=function(t){if(this.overscaledZ>=t)return[new ys(this.overscaledZ+1,this.wrap,this.canonical.z,this.canonical.x,this.canonical.y)];var e=this.canonical.z+1,r=2*this.canonical.x,n=2*this.canonical.y;return[new ys(e,this.wrap,e,r,n),new ys(e,this.wrap,e,r+1,n),new ys(e,this.wrap,e,r,n+1),new ys(e,this.wrap,e,r+1,n+1)]},ys.prototype.isLessThan=function(t){return this.wrap<t.wrap||!(this.wrap>t.wrap)&&(this.overscaledZ<t.overscaledZ||!(this.overscaledZ>t.overscaledZ)&&(this.canonical.x<t.canonical.x||!(this.canonical.x>t.canonical.x)&&this.canonical.y<t.canonical.y))},ys.prototype.wrapped=function(){return new ys(this.overscaledZ,0,this.canonical.z,this.canonical.x,this.canonical.y)},ys.prototype.unwrapTo=function(t){return new ys(this.overscaledZ,t,this.canonical.z,this.canonical.x,this.canonical.y)},ys.prototype.overscaleFactor=function(){return Math.pow(2,this.overscaledZ-this.canonical.z)},ys.prototype.toUnwrapped=function(){return new fs(this.wrap,this.canonical)},ys.prototype.toString=function(){return this.overscaledZ+"/"+this.canonical.x+"/"+this.canonical.y},ys.prototype.toCoordinate=function(){return new p(this.canonical.x+Math.pow(2,this.wrap),this.canonical.y,this.canonical.z)},_r("CanonicalTileID",cs),_r("OverscaledTileID",ys,{omit:["posMatrix"]});var ms=function(t,e,r){if(t<=0)throw new RangeError("Level must have positive dimension");this.dim=t,this.border=e,this.stride=this.dim+2*this.border,this.data=r||new Int32Array((this.dim+2*this.border)*(this.dim+2*this.border));};ms.prototype.set=function(t,e,r){this.data[this._idx(t,e)]=r+65536;},ms.prototype.get=function(t,e){return this.data[this._idx(t,e)]-65536},ms.prototype._idx=function(t,e){if(t<-this.border||t>=this.dim+this.border||e<-this.border||e>=this.dim+this.border)throw new RangeError("out of range source coordinates for DEM data");return(e+this.border)*this.stride+(t+this.border)},_r("Level",ms);var vs=function(t,e,r){this.uid=t,this.scale=e||1,this.level=r||new ms(256,512),this.loaded=!!r;};vs.prototype.loadFromImage=function(t,e){if(t.height!==t.width)throw new RangeError("DEM tiles must be square");if(e&&"mapbox"!==e&&"terrarium"!==e)return S('"'+e+'" is not a valid encoding type. Valid types include "mapbox" and "terrarium".');var r=this.level=new ms(t.width,t.width/2),n=t.data;this._unpackData(r,n,e||"mapbox");for(var i=0;i<r.dim;i++)r.set(-1,i,r.get(0,i)),r.set(r.dim,i,r.get(r.dim-1,i)),r.set(i,-1,r.get(i,0)),r.set(i,r.dim,r.get(i,r.dim-1));r.set(-1,-1,r.get(0,0)),r.set(r.dim,-1,r.get(r.dim-1,0)),r.set(-1,r.dim,r.get(0,r.dim-1)),r.set(r.dim,r.dim,r.get(r.dim-1,r.dim-1)),this.loaded=!0;},vs.prototype._unpackMapbox=function(t,e,r){return(256*t*256+256*e+r)/10-1e4},vs.prototype._unpackTerrarium=function(t,e,r){return 256*t+e+r/256-32768},vs.prototype._unpackData=function(t,e,r){for(var n={mapbox:this._unpackMapbox,terrarium:this._unpackTerrarium}[r],i=0;i<t.dim;i++)for(var a=0;a<t.dim;a++){var o=4*(i*t.dim+a);t.set(a,i,this.scale*n(e[o],e[o+1],e[o+2]));}},vs.prototype.getPixels=function(){return new Ri({width:this.level.dim+2*this.level.border,height:this.level.dim+2*this.level.border},new Uint8Array(this.level.data.buffer))},vs.prototype.backfillBorder=function(t,e,r){var n=this.level,i=t.level;if(n.dim!==i.dim)throw new Error("level mismatch (dem dimension)");var a=e*n.dim,o=e*n.dim+n.dim,s=r*n.dim,u=r*n.dim+n.dim;switch(e){case-1:a=o-1;break;case 1:o=a+1;}switch(r){case-1:s=u-1;break;case 1:u=s+1;}for(var l=m(a,-n.border,n.dim+n.border),p=m(o,-n.border,n.dim+n.border),h=m(s,-n.border,n.dim+n.border),c=m(u,-n.border,n.dim+n.border),f=-e*n.dim,y=-r*n.dim,d=h;d<c;d++)for(var v=l;v<p;v++)n.set(v,d,i.get(v+f,d+y));},_r("DEMData",vs);var gs=nn([{name:"a_pos",type:"Int16",components:2},{name:"a_texture_pos",type:"Int16",components:2}]);var xs=function(t){this._stringToNumber={},this._numberToString=[];for(var e=0;e<t.length;e++){var r=t[e];this._stringToNumber[r]=e,this._numberToString[e]=r;}};xs.prototype.encode=function(t){return this._stringToNumber[t]},xs.prototype.decode=function(t){return this._numberToString[t]};var bs=function(t,e,r,n){this.type="Feature",this._vectorTileFeature=t,t._z=e,t._x=r,t._y=n,this.properties=t.properties,null!=t.id&&(this.id=t.id);},ws={geometry:{configurable:!0}};ws.geometry.get=function(){return void 0===this._geometry&&(this._geometry=this._vectorTileFeature.toGeoJSON(this._vectorTileFeature._x,this._vectorTileFeature._y,this._vectorTileFeature._z).geometry),this._geometry},ws.geometry.set=function(t){this._geometry=t;},bs.prototype.toJSON=function(){var t={geometry:this.geometry};for(var e in this)"_geometry"!==e&&"_vectorTileFeature"!==e&&(t[e]=this[e]);return t},Object.defineProperties(bs.prototype,ws);var _s=function(){this.state={},this.stateChanges={};};_s.prototype.updateState=function(t,e,r){e=String(e),this.stateChanges[t]=this.stateChanges[t]||{},this.stateChanges[t][e]=this.stateChanges[t][e]||{},v(this.stateChanges[t][e],r);},_s.prototype.getState=function(t,e){e=String(e);var r=this.state[t]||{},n=this.stateChanges[t]||{};return v({},r[e],n[e])},_s.prototype.initializeTileState=function(t,e){t.setFeatureState(this.state,e);},_s.prototype.coalesceChanges=function(t,e){var r={};for(var n in this.stateChanges){this.state[n]=this.state[n]||{};var i={};for(var a in this.stateChanges[n])this.state[n][a]||(this.state[n][a]={}),v(this.state[n][a],this.stateChanges[n][a]),i[a]=this.state[n][a];r[n]=i;}if(this.stateChanges={},0!==Object.keys(r).length)for(var o in t){t[o].setFeatureState(r,e);}};var As=function(t,e,r){this.tileID=t,this.x=t.canonical.x,this.y=t.canonical.y,this.z=t.canonical.z,this.grid=e||new vr(Zn,16,0),this.featureIndexArray=r||new Tn;};function ks(t,e){return e-t}As.prototype.insert=function(t,e,r,n,i){var a=this.featureIndexArray.length;this.featureIndexArray.emplaceBack(r,n,i);for(var o=0;o<e.length;o++){for(var s=e[o],u=[1/0,1/0,-1/0,-1/0],l=0;l<s.length;l++){var p=s[l];u[0]=Math.min(u[0],p.x),u[1]=Math.min(u[1],p.y),u[2]=Math.max(u[2],p.x),u[3]=Math.max(u[3],p.y);}u[0]<Zn&&u[1]<Zn&&u[2]>=0&&u[3]>=0&&this.grid.insert(a,u[0],u[1],u[2],u[3]);}},As.prototype.loadVTLayers=function(){return this.vtLayers||(this.vtLayers=new $a.VectorTile(new Ro(this.rawTileData)).layers,this.sourceLayerCoder=new xs(this.vtLayers?Object.keys(this.vtLayers).sort():["_geojsonTileLayer"])),this.vtLayers},As.prototype.query=function(t,e,r){var n=this;this.loadVTLayers();for(var i=t.params||{},a=Zn/t.tileSize/t.scale,o=Xe(i.filter),s=t.queryGeometry,u=t.queryPadding*a,l=1/0,p=1/0,h=-1/0,c=-1/0,f=0;f<s.length;f++)for(var y=s[f],d=0;d<y.length;d++){var m=y[d];l=Math.min(l,m.x),p=Math.min(p,m.y),h=Math.max(h,m.x),c=Math.max(c,m.y);}var v=this.grid.query(l-u,p-u,h+u,c+u);v.sort(ks);for(var g,x={},b=function(u){var l=v[u];if(l!==g){g=l;var p=n.featureIndexArray.get(l),h=null;n.loadMatchingFeature(x,p.bucketIndex,p.sourceLayerIndex,p.featureIndex,o,i.layers,e,function(e,i){h||(h=Jn(e));var o={};return e.id&&(o=r.getState(i.sourceLayer||"_geojsonTileLayer",String(e.id))),i.queryIntersectsFeature(s,e,o,h,n.z,t.transform,a,t.posMatrix)});}},w=0;w<v.length;w++)b(w);return x},As.prototype.loadMatchingFeature=function(t,e,r,n,i,a,o,s){var u=this.bucketLayerIDs[e];if(!a||function(t,e){for(var r=0;r<t.length;r++)if(e.indexOf(t[r])>=0)return!0;return!1}(a,u)){var l=this.sourceLayerCoder.decode(r),p=this.vtLayers[l].feature(n);if(i(new qr(this.tileID.overscaledZ),p))for(var h=0;h<u.length;h++){var c=u[h];if(!(a&&a.indexOf(c)<0)){var f=o[c];if(f&&(!s||s(p,f))){var y=new bs(p,this.z,this.x,this.y);y.layer=f.serialize();var d=t[c];void 0===d&&(d=t[c]=[]),d.push({featureIndex:n,feature:y});}}}}},As.prototype.lookupSymbolFeatures=function(t,e,r,n,i,a){var o={};this.loadVTLayers();for(var s=Xe(n),u=0,l=t;u<l.length;u+=1){var p=l[u];this.loadMatchingFeature(o,e,r,p,s,i,a);}return o},As.prototype.hasLayer=function(t){for(var e=0,r=this.bucketLayerIDs;e<r.length;e+=1)for(var n=0,i=r[e];n<i.length;n+=1){if(t===i[n])return!0}return!1},_r("FeatureIndex",As,{omit:["rawTileData","sourceLayerCoder"]});var zs=function(t,e){this.tileID=t,this.uid=x(),this.uses=0,this.tileSize=e,this.buckets={},this.expirationTime=null,this.queryPadding=0,this.expiredRequestCount=0,this.state="loading";};zs.prototype.registerFadeDuration=function(t){var e=t+this.timeAdded;e<o.now()||this.fadeEndTime&&e<this.fadeEndTime||(this.fadeEndTime=e);},zs.prototype.wasRequested=function(){return"errored"===this.state||"loaded"===this.state||"reloading"===this.state},zs.prototype.loadVectorData=function(t,e,r){if(this.hasData()&&this.unloadVectorData(),this.state="loaded",t){if(t.featureIndex&&(this.latestFeatureIndex=t.featureIndex,t.rawTileData?(this.latestRawTileData=t.rawTileData,this.latestFeatureIndex.rawTileData=t.rawTileData):this.latestRawTileData&&(this.latestFeatureIndex.rawTileData=this.latestRawTileData)),this.collisionBoxArray=t.collisionBoxArray,this.buckets=function(t,e){var r={};if(!e)return r;for(var n=0,i=t;n<i.length;n+=1){var a=i[n],o=a.layerIds.map(function(t){return e.getLayer(t)}).filter(Boolean);if(0!==o.length){a.layers=o,a.stateDependentLayers=o.filter(function(t){return t.isStateDependent()});for(var s=0,u=o;s<u.length;s+=1)r[u[s].id]=a;}}return r}(t.buckets,e.style),r)for(var n in this.buckets){var i=this.buckets[n];i instanceof _o&&(i.justReloaded=!0);}for(var a in this.queryPadding=0,this.buckets){var o=this.buckets[a];this.queryPadding=Math.max(this.queryPadding,e.style.getLayer(o.layerIds[0]).queryRadius(o));}t.iconAtlasImage&&(this.iconAtlasImage=t.iconAtlasImage),t.glyphAtlasImage&&(this.glyphAtlasImage=t.glyphAtlasImage);}else this.collisionBoxArray=new zn;},zs.prototype.unloadVectorData=function(){for(var t in this.buckets)this.buckets[t].destroy();this.buckets={},this.iconAtlasTexture&&this.iconAtlasTexture.destroy(),this.glyphAtlasTexture&&this.glyphAtlasTexture.destroy(),this.latestFeatureIndex=null,this.state="unloaded";},zs.prototype.unloadDEMData=function(){this.dem=null,this.neighboringTiles=null,this.state="unloaded";},zs.prototype.getBucket=function(t){return this.buckets[t.id]},zs.prototype.upload=function(t){for(var e in this.buckets){var r=this.buckets[e];r.uploadPending()&&r.upload(t);}var n=t.gl;this.iconAtlasImage&&(this.iconAtlasTexture=new Do(t,this.iconAtlasImage,n.RGBA),this.iconAtlasImage=null),this.glyphAtlasImage&&(this.glyphAtlasTexture=new Do(t,this.glyphAtlasImage,n.ALPHA),this.glyphAtlasImage=null);},zs.prototype.queryRenderedFeatures=function(t,e,r,n,i,a,o,s){return this.latestFeatureIndex&&this.latestFeatureIndex.rawTileData?this.latestFeatureIndex.query({queryGeometry:r,scale:n,tileSize:this.tileSize,posMatrix:s,transform:a,params:i,queryPadding:this.queryPadding*o},t,e):{}},zs.prototype.querySourceFeatures=function(t,e){if(this.latestFeatureIndex&&this.latestFeatureIndex.rawTileData){var r=this.latestFeatureIndex.loadVTLayers(),n=e?e.sourceLayer:"",i=r._geojsonTileLayer||r[n];if(i)for(var a=Xe(e&&e.filter),o={z:this.tileID.overscaledZ,x:this.tileID.canonical.x,y:this.tileID.canonical.y},s=0;s<i.length;s++){var u=i.feature(s);if(a(new qr(this.tileID.overscaledZ),u)){var l=new bs(u,o.z,o.x,o.y);l.tile=o,t.push(l);}}}},zs.prototype.clearMask=function(){this.segments&&(this.segments.destroy(),delete this.segments),this.maskedBoundsBuffer&&(this.maskedBoundsBuffer.destroy(),delete this.maskedBoundsBuffer),this.maskedIndexBuffer&&(this.maskedIndexBuffer.destroy(),delete this.maskedIndexBuffer);},zs.prototype.setMask=function(t,e){if(!f(this.mask,t)&&(this.mask=t,this.clearMask(),!f(t,{0:!0}))){var r=new sn,n=new bn;this.segments=new Fn,this.segments.prepareSegment(0,r,n);for(var i=Object.keys(t),a=0;a<i.length;a++){var o=t[i[a]],s=Zn>>o.z,u=new h(o.x*s,o.y*s),l=new h(u.x+s,u.y+s),p=this.segments.prepareSegment(4,r,n);r.emplaceBack(u.x,u.y,u.x,u.y),r.emplaceBack(l.x,u.y,l.x,u.y),r.emplaceBack(u.x,l.y,u.x,l.y),r.emplaceBack(l.x,l.y,l.x,l.y);var c=p.vertexLength;n.emplaceBack(c,c+1,c+2),n.emplaceBack(c+1,c+2,c+3),p.vertexLength+=4,p.primitiveLength+=2;}this.maskedBoundsBuffer=e.createVertexBuffer(r,gs.members),this.maskedIndexBuffer=e.createIndexBuffer(n);}},zs.prototype.hasData=function(){return"loaded"===this.state||"reloading"===this.state||"expired"===this.state},zs.prototype.setExpiryData=function(t){var e=this.expirationTime;if(t.cacheControl){var r=function(t){var e={};if(t.replace(/(?:^|(?:\s*\,\s*))([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)(?:\=(?:([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)|(?:\"((?:[^"\\]|\\.)*)\")))?/g,function(t,r,n,i){var a=n||i;return e[r]=!a||a.toLowerCase(),""}),e["max-age"]){var r=parseInt(e["max-age"],10);isNaN(r)?delete e["max-age"]:e["max-age"]=r;}return e}(t.cacheControl);r["max-age"]&&(this.expirationTime=Date.now()+1e3*r["max-age"]);}else t.expires&&(this.expirationTime=new Date(t.expires).getTime());if(this.expirationTime){var n=Date.now(),i=!1;if(this.expirationTime>n)i=!1;else if(e)if(this.expirationTime<e)i=!0;else{var a=this.expirationTime-e;a?this.expirationTime=n+Math.max(a,3e4):i=!0;}else i=!0;i?(this.expiredRequestCount++,this.state="expired"):this.expiredRequestCount=0;}},zs.prototype.getExpiryTimeout=function(){if(this.expirationTime)return this.expiredRequestCount?1e3*(1<<Math.min(this.expiredRequestCount-1,31)):Math.min(this.expirationTime-(new Date).getTime(),Math.pow(2,31)-1)},zs.prototype.setFeatureState=function(t,e){if(this.latestFeatureIndex&&this.latestFeatureIndex.rawTileData&&0!==Object.keys(t).length){var r=this.latestFeatureIndex.loadVTLayers();for(var n in this.buckets){var i=this.buckets[n],a=i.layers[0].sourceLayer||"_geojsonTileLayer",o=r[a],s=t[a];o&&s&&0!==Object.keys(s).length&&(i.update(s,o),e&&e.style&&(this.queryPadding=Math.max(this.queryPadding,e.style.getLayer(i.layerIds[0]).queryRadius(i))));}}};var Ss={horizontal:1,vertical:2,horizontalOnly:3};var Ms={9:!0,10:!0,11:!0,12:!0,13:!0,32:!0},Bs={};function Vs(t,e,r,n){var i=Math.pow(t-e,2);return n?t<e?i/2:2*i:i+Math.abs(r)*r}function Is(t,e){var r=0;return 10===t&&(r-=1e4),40!==t&&65288!==t||(r+=50),41!==e&&65289!==e||(r+=50),r}function Cs(t,e,r,n,i,a){for(var o=null,s=Vs(e,r,i,a),u=0,l=n;u<l.length;u+=1){var p=l[u],h=Vs(e-p.x,r,i,a)+p.badness;h<=s&&(o=p,s=h);}return{index:t,x:e,priorBreak:o,badness:s}}function Es(t,e,r,n){if(!r)return[];if(!t)return[];for(var i,a=[],o=function(t,e,r,n){for(var i=0,a=0;a<t.length;a++){var o=n[t.charCodeAt(a)];o&&(i+=o.metrics.advance+e);}return i/Math.max(1,Math.ceil(i/r))}(t,e,r,n),s=0,u=0;u<t.length;u++){var l=t.charCodeAt(u),p=n[l];p&&!Ms[l]&&(s+=p.metrics.advance+e),u<t.length-1&&(Bs[l]||!((i=l)<11904)&&(Mr["Bopomofo Extended"](i)||Mr.Bopomofo(i)||Mr["CJK Compatibility Forms"](i)||Mr["CJK Compatibility Ideographs"](i)||Mr["CJK Compatibility"](i)||Mr["CJK Radicals Supplement"](i)||Mr["CJK Strokes"](i)||Mr["CJK Symbols and Punctuation"](i)||Mr["CJK Unified Ideographs Extension A"](i)||Mr["CJK Unified Ideographs"](i)||Mr["Enclosed CJK Letters and Months"](i)||Mr["Halfwidth and Fullwidth Forms"](i)||Mr.Hiragana(i)||Mr["Ideographic Description Characters"](i)||Mr["Kangxi Radicals"](i)||Mr["Katakana Phonetic Extensions"](i)||Mr.Katakana(i)||Mr["Vertical Forms"](i)||Mr["Yi Radicals"](i)||Mr["Yi Syllables"](i)))&&a.push(Cs(u+1,s,o,a,Is(l,t.charCodeAt(u+1)),!1));}return function t(e){return e?t(e.priorBreak).concat(e.index):[]}(Cs(t.length,s,o,a,0,!0))}function Ts(t){var e=.5,r=.5;switch(t){case"right":case"top-right":case"bottom-right":e=1;break;case"left":case"top-left":case"bottom-left":e=0;}switch(t){case"bottom":case"bottom-right":case"bottom-left":r=1;break;case"top":case"top-right":case"top-left":r=0;}return{horizontalAlign:e,verticalAlign:r}}function Ps(t,e,r,n,i){if(i){var a=e[t[n].glyph];if(a)for(var o=a.metrics.advance,s=(t[n].x+o)*i,u=r;u<=n;u++)t[u].x-=s;}}Bs[10]=!0,Bs[32]=!0,Bs[38]=!0,Bs[40]=!0,Bs[41]=!0,Bs[43]=!0,Bs[45]=!0,Bs[47]=!0,Bs[173]=!0,Bs[183]=!0,Bs[8203]=!0,Bs[8208]=!0,Bs[8211]=!0,Bs[8231]=!0,t.unwrapExports=e,t.createCommonjsModule=r,t.default=h,t.default$1=self,t.default$2=o,t.getJSON=function(t,e){var r=C(t);return r.setRequestHeader("Accept","application/json"),r.onerror=function(){e(new Error(r.statusText));},r.onload=function(){if(r.status>=200&&r.status<300&&r.response){var n;try{n=JSON.parse(r.response);}catch(t){return e(t)}e(null,n);}else 401===r.status&&t.url.match(/mapbox.com/)?e(new I(r.statusText+": you may have provided an invalid Mapbox access token. See https://www.mapbox.com/api-documentation/#access-tokens",r.status,t.url)):e(new I(r.statusText,r.status,t.url));},r.send(),{cancel:function(){return r.abort()}}},t.getImage=function(t,e){return E(t,function(t,r){if(t)e(t);else if(r){var n=new self.Image,i=self.URL||self.webkitURL;n.onload=function(){e(null,n),i.revokeObjectURL(n.src);};var a=new self.Blob([new Uint8Array(r.data)],{type:"image/png"});n.cacheControl=r.cacheControl,n.expires=r.expires,n.src=r.data.byteLength?i.createObjectURL(a):"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=";}})},t.ResourceType=V,t.RGBAImage=Ri,t.default$3=Io,t.ImagePosition=Co,t.default$4=Do,t.getArrayBuffer=E,t.default$5=function(t){return new Ro(t).readFields(as,[])},t.default$6=Mr,t.asyncAll=function(t,e,r){if(!t.length)return r(null,[]);var n=t.length,i=new Array(t.length),a=null;t.forEach(function(t,o){e(t,function(t,e){t&&(a=t),i[o]=e,0==--n&&r(a,i);});});},t.AlphaImage=ji,t.default$7=D,t.endsWith=w,t.extend=v,t.sphericalToCartesian=function(t){var e=t[0],r=t[1],n=t[2];return r+=90,r*=Math.PI/180,n*=Math.PI/180,{x:e*Math.cos(r)*Math.sin(n),y:e*Math.sin(r)*Math.sin(n),z:e*Math.cos(n)}},t.Evented=O,t.validateStyle=cr,t.validateLight=fr,t.emitValidationErrors=mr,t.default$8=at,t.number=Bt,t.Properties=Wr,t.Transitionable=Ur,t.Transitioning=Zr,t.PossiblyEvaluated=Jr,t.DataConstantProperty=Hr,t.warnOnce=S,t.uniqueId=x,t.default$9=ls,t.pick=function(t,e){for(var r={},n=0;n<e.length;n++){var i=e[n];i in t&&(r[i]=t[i]);}return r},t.wrap=function(t,e,r){var n=r-e,i=((t-e)%n+n)%n+e;return i===e?r:i},t.clamp=m,t.Event=F,t.ErrorEvent=L,t.OverscaledTileID=ys,t.default$10=Zn,t.getCoordinatesCenter=function(t){for(var e=1/0,r=1/0,n=-1/0,i=-1/0,a=0;a<t.length;a++)e=Math.min(e,t[a].column),r=Math.min(r,t[a].row),n=Math.max(n,t[a].column),i=Math.max(i,t[a].row);var o=n-e,s=i-r,u=Math.max(o,s),l=Math.max(0,Math.floor(-Math.log(u)/Math.LN2));return new p((e+n)/2,(r+i)/2,0).zoomTo(l)},t.CanonicalTileID=cs,t.RasterBoundsArray=sn,t.default$11=gs,t.getVideo=function(t,e){var r,n,i=self.document.createElement("video");i.muted=!0,i.onloadstart=function(){e(null,i);};for(var a=0;a<t.length;a++){var o=self.document.createElement("source");r=t[a],n=void 0,(n=self.document.createElement("a")).href=r,(n.protocol!==self.document.location.protocol||n.host!==self.document.location.host)&&(i.crossOrigin="Anonymous"),o.src=t[a],i.appendChild(o);}return{cancel:function(){}}},t.default$12=q,t.bindAll=b,t.default$13=f,t.default$14=zs,t.default$15=p,t.keysDifference=function(t,e){var r=[];for(var n in t)n in e||r.push(n);return r},t.default$16=_s,t.default$17=["type","source","source-layer","minzoom","maxzoom","filter","layout"],t.create=function(){var t=new pi(16);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},t.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},t.invert=function(t,e){var r=e[0],n=e[1],i=e[2],a=e[3],o=e[4],s=e[5],u=e[6],l=e[7],p=e[8],h=e[9],c=e[10],f=e[11],y=e[12],d=e[13],m=e[14],v=e[15],g=r*s-n*o,x=r*u-i*o,b=r*l-a*o,w=n*u-i*s,_=n*l-a*s,A=i*l-a*u,k=p*d-h*y,z=p*m-c*y,S=p*v-f*y,M=h*m-c*d,B=h*v-f*d,V=c*v-f*m,I=g*V-x*B+b*M+w*S-_*z+A*k;return I?(I=1/I,t[0]=(s*V-u*B+l*M)*I,t[1]=(i*B-n*V-a*M)*I,t[2]=(d*A-m*_+v*w)*I,t[3]=(c*_-h*A-f*w)*I,t[4]=(u*S-o*V-l*z)*I,t[5]=(r*V-i*S+a*z)*I,t[6]=(m*b-y*A-v*x)*I,t[7]=(p*A-c*b+f*x)*I,t[8]=(o*B-s*S+l*k)*I,t[9]=(n*S-r*B-a*k)*I,t[10]=(y*_-d*b+v*g)*I,t[11]=(h*b-p*_-f*g)*I,t[12]=(s*z-o*M-u*k)*I,t[13]=(r*M-n*z+i*k)*I,t[14]=(d*x-y*w-m*g)*I,t[15]=(p*w-h*x+c*g)*I,t):null},t.multiply=function(t,e,r){var n=e[0],i=e[1],a=e[2],o=e[3],s=e[4],u=e[5],l=e[6],p=e[7],h=e[8],c=e[9],f=e[10],y=e[11],d=e[12],m=e[13],v=e[14],g=e[15],x=r[0],b=r[1],w=r[2],_=r[3];return t[0]=x*n+b*s+w*h+_*d,t[1]=x*i+b*u+w*c+_*m,t[2]=x*a+b*l+w*f+_*v,t[3]=x*o+b*p+w*y+_*g,x=r[4],b=r[5],w=r[6],_=r[7],t[4]=x*n+b*s+w*h+_*d,t[5]=x*i+b*u+w*c+_*m,t[6]=x*a+b*l+w*f+_*v,t[7]=x*o+b*p+w*y+_*g,x=r[8],b=r[9],w=r[10],_=r[11],t[8]=x*n+b*s+w*h+_*d,t[9]=x*i+b*u+w*c+_*m,t[10]=x*a+b*l+w*f+_*v,t[11]=x*o+b*p+w*y+_*g,x=r[12],b=r[13],w=r[14],_=r[15],t[12]=x*n+b*s+w*h+_*d,t[13]=x*i+b*u+w*c+_*m,t[14]=x*a+b*l+w*f+_*v,t[15]=x*o+b*p+w*y+_*g,t},t.translate=function(t,e,r){var n,i,a,o,s,u,l,p,h,c,f,y,d=r[0],m=r[1],v=r[2];return e===t?(t[12]=e[0]*d+e[4]*m+e[8]*v+e[12],t[13]=e[1]*d+e[5]*m+e[9]*v+e[13],t[14]=e[2]*d+e[6]*m+e[10]*v+e[14],t[15]=e[3]*d+e[7]*m+e[11]*v+e[15]):(n=e[0],i=e[1],a=e[2],o=e[3],s=e[4],u=e[5],l=e[6],p=e[7],h=e[8],c=e[9],f=e[10],y=e[11],t[0]=n,t[1]=i,t[2]=a,t[3]=o,t[4]=s,t[5]=u,t[6]=l,t[7]=p,t[8]=h,t[9]=c,t[10]=f,t[11]=y,t[12]=n*d+s*m+h*v+e[12],t[13]=i*d+u*m+c*v+e[13],t[14]=a*d+l*m+f*v+e[14],t[15]=o*d+p*m+y*v+e[15]),t},t.scale=function(t,e,r){var n=r[0],i=r[1],a=r[2];return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*i,t[5]=e[5]*i,t[6]=e[6]*i,t[7]=e[7]*i,t[8]=e[8]*a,t[9]=e[9]*a,t[10]=e[10]*a,t[11]=e[11]*a,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},t.rotateX=function(t,e,r){var n=Math.sin(r),i=Math.cos(r),a=e[4],o=e[5],s=e[6],u=e[7],l=e[8],p=e[9],h=e[10],c=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=a*i+l*n,t[5]=o*i+p*n,t[6]=s*i+h*n,t[7]=u*i+c*n,t[8]=l*i-a*n,t[9]=p*i-o*n,t[10]=h*i-s*n,t[11]=c*i-u*n,t},t.rotateZ=function(t,e,r){var n=Math.sin(r),i=Math.cos(r),a=e[0],o=e[1],s=e[2],u=e[3],l=e[4],p=e[5],h=e[6],c=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=a*i+l*n,t[1]=o*i+p*n,t[2]=s*i+h*n,t[3]=u*i+c*n,t[4]=l*i-a*n,t[5]=p*i-o*n,t[6]=h*i-s*n,t[7]=c*i-u*n,t},t.perspective=function(t,e,r,n,i){var a=1/Math.tan(e/2),o=1/(n-i);return t[0]=a/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(i+n)*o,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*i*n*o,t[15]=0,t},t.ortho=function(t,e,r,n,i,a,o){var s=1/(e-r),u=1/(n-i),l=1/(a-o);return t[0]=-2*s,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*u,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*l,t[11]=0,t[12]=(e+r)*s,t[13]=(i+n)*u,t[14]=(o+a)*l,t[15]=1,t},t.create$1=wi,t.normalize=_i,t.transformMat4=Ai,t.forEach=ki,t.getSizeData=yo,t.evaluateSizeForFeature=function(t,e,r){var n=e;return"source"===t.functionType?r.lowerSize/10:"composite"===t.functionType?Bt(r.lowerSize/10,r.upperSize/10,n.uSizeT):n.uSize},t.evaluateSizeForZoom=function(t,e,r){if("constant"===t.functionType)return{uSizeT:0,uSize:t.layoutSize};if("source"===t.functionType)return{uSizeT:0,uSize:0};if("camera"===t.functionType){var n=t.propertyValue,i=t.zoomRange,a=t.sizeRange,o=m(Le(n,r.specification).interpolationFactor(e,i.min,i.max),0,1);return{uSizeT:0,uSize:a.min+o*(a.max-a.min)}}var s=t.propertyValue,u=t.zoomRange;return{uSizeT:m(Le(s,r.specification).interpolationFactor(e,u.min,u.max),0,1),uSize:0}},t.addDynamicAttributes=xo,t.default$18=ko,t.WritingMode=Ss,t.multiPolygonIntersectsBufferedPoint=Gn,t.multiPolygonIntersectsMultiPolygon=Yn,t.multiPolygonIntersectsBufferedMultiLine=Wn,t.polygonIntersectsPolygon=function(t,e){for(var r=0;r<t.length;r++)if(ai(e,t[r]))return!0;for(var n=0;n<e.length;n++)if(ai(t,e[n]))return!0;return!!ti(t,e)},t.distToSegmentSquared=ni,t.default$19=Qr,t.default$20=function(t){return new Vo[t.type](t)},t.clone=k,t.filterObject=A,t.mapObject=_,t.registerForPluginAvailability=function(t){return Fr?t({pluginURL:Fr,completionCallback:Tr}):Or.once("pluginAvailable",t),t},t.evented=Or,t.default$21=Sr,t.createLayout=nn,t.default$22=Rn,t.create$2=hi,t.fromRotation=function(t,e){var r=Math.sin(e),n=Math.cos(e);return t[0]=n,t[1]=r,t[2]=0,t[3]=-r,t[4]=n,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},t.create$3=ci,t.length=fi,t.fromValues=yi,t.normalize$1=di,t.dot=mi,t.cross=vi,t.transformMat3=function(t,e,r){var n=e[0],i=e[1],a=e[2];return t[0]=n*r[0]+i*r[3]+a*r[6],t[1]=n*r[1]+i*r[4]+a*r[7],t[2]=n*r[2]+i*r[5]+a*r[8],t},t.len=xi,t.forEach$1=bi,t.PosArray=on,t.UnwrappedTileID=fs,t.create$4=function(){var t=new pi(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},t.rotate=function(t,e,r){var n=e[0],i=e[1],a=e[2],o=e[3],s=Math.sin(r),u=Math.cos(r);return t[0]=n*u+a*s,t[1]=i*u+o*s,t[2]=n*-s+a*u,t[3]=i*-s+o*u,t},t.ease=d,t.bezier=y,t.default$23=qr,t.setRTLTextPlugin=function(t,e){if(Pr)throw new Error("setRTLTextPlugin cannot be called multiple times.");Pr=!0,Fr=o.resolveURL(t),Tr=function(t){t?(Pr=!1,Fr=null,e&&e(t)):Lr=!0;},Or.fire(new F("pluginAvailable",{pluginURL:Fr,completionCallback:Tr}));},t.values=function(t){var e=[];for(var r in t)e.push(t[r]);return e},t.default$24=Xe,t.default$25=fo,t.register=_r,t.GLYPH_PBF_BORDER=us,t.shapeText=function(t,e,r,n,i,a,o,s,u,l){var p=t.trim();l===Ss.vertical&&(p=function(t){for(var e="",r=0;r<t.length;r++){var n=t.charCodeAt(r+1)||null,i=t.charCodeAt(r-1)||null;n&&Cr(n)&&!co[t[r+1]]||i&&Cr(i)&&!co[t[r-1]]||!co[t[r]]?e+=t[r]:e+=co[t[r]];}return e}(p));var h=[],c={positionedGlyphs:h,text:p,top:s[1],bottom:s[1],left:s[0],right:s[0],writingMode:l},f=Dr.processBidirectionalText;return function(t,e,r,n,i,a,o,s,u){for(var l=0,p=-17,h=0,c=t.positionedGlyphs,f="right"===a?1:"left"===a?0:.5,y=0,d=r;y<d.length;y+=1){var m=d[y];if((m=m.trim()).length){for(var v=c.length,g=0;g<m.length;g++){var x=m.charCodeAt(g),b=e[x];b&&(Ir(x)&&o!==Ss.horizontal?(c.push({glyph:x,x:l,y:0,vertical:!0}),l+=u+s):(c.push({glyph:x,x:l,y:p,vertical:!1}),l+=b.metrics.advance+s));}if(c.length!==v){var w=l-s;h=Math.max(w,h),Ps(c,e,v,c.length-1,f);}l=0,p+=n;}else p+=n;}var _=Ts(i),A=_.horizontalAlign,k=_.verticalAlign;!function(t,e,r,n,i,a,o){for(var s=(e-r)*i,u=(-n*o+.5)*a,l=0;l<t.length;l++)t[l].x+=s,t[l].y+=u;}(c,f,A,k,h,n,r.length);var z=r.length*n;t.top+=-k*z,t.bottom=t.top+z,t.left+=-A*h,t.right=t.left+h;}(c,e,f?f(p,Es(p,o,r,e)):function(t,e){for(var r=[],n=0,i=0,a=e;i<a.length;i+=1){var o=a[i];r.push(t.substring(n,o)),n=o;}return n<t.length&&r.push(t.substring(n,t.length)),r}(p,Es(p,o,r,e)),n,i,a,l,o,u),!!h.length&&c},t.shapeIcon=function(t,e,r){var n=Ts(r),i=n.horizontalAlign,a=n.verticalAlign,o=e[0],s=e[1],u=o-t.displaySize[0]*i,l=u+t.displaySize[0],p=s-t.displaySize[1]*a;return{image:t,top:p,bottom:p+t.displaySize[1],left:u,right:l}},t.allowsVerticalWritingMode=Br,t.allowsLetterSpacing=function(t){for(var e=0,r=t;e<r.length;e+=1)if(!Vr(r[e].charCodeAt(0)))return!1;return!0},t.default$26=ka,t.default$27=_o,t.default$28=As,t.CollisionBoxArray=zn,t.default$29=xs,t.default$30=To,t.default$31=$a,t.default$32=Ro,t.default$33=vs,t.__moduleExports=$a,t.default$34=h,t.__moduleExports$1=Ro,t.plugin=Dr;});
	
	define(["./chunk1.js"],function(e){"use strict";function t(e){var r=typeof e;if("number"===r||"boolean"===r||"string"===r||null==e)return JSON.stringify(e);if(Array.isArray(e)){for(var n="[",i=0,o=e;i<o.length;i+=1){n+=t(o[i])+",";}return n+"]"}for(var a=Object.keys(e).sort(),s="{",l=0;l<a.length;l++)s+=JSON.stringify(a[l])+":"+t(e[a[l]])+",";return s+"}"}function r(r){for(var n="",i=0,o=e.default$17;i<o.length;i+=1){n+="/"+t(r[o[i]]);}return n}var n=function(e){e&&this.replace(e);};function i(e,t,r,n,i){if(void 0===t.segment)return!0;for(var o=t,a=t.segment+1,s=0;s>-r/2;){if(--a<0)return!1;s-=e[a].dist(o),o=e[a];}s+=e[a].dist(e[a+1]),a++;for(var l=[],u=0;s<r/2;){var h=e[a-1],c=e[a],f=e[a+1];if(!f)return!1;var p=h.angleTo(c)-c.angleTo(f);for(p=Math.abs((p+3*Math.PI)%(2*Math.PI)-Math.PI),l.push({distance:s,angleDelta:p}),u+=p;s-l[0].distance>n;)u-=l.shift().angleDelta;if(u>i)return!1;a++,s+=c.dist(f);}return!0}function o(e){for(var t=0,r=0;r<e.length-1;r++)t+=e[r].dist(e[r+1]);return t}function a(e,t,r){return e?.6*t*r:0}function s(e,t){return Math.max(e?e.right-e.left:0,t?t.right-t.left:0)}function l(t,r,n,l,u,h){for(var c=a(n,u,h),f=s(n,l),p=0,d=o(t)/2,g=0;g<t.length-1;g++){var m=t[g],y=t[g+1],v=m.dist(y);if(p+v>d){var x=(d-p)/v,w=e.number(m.x,y.x,x),M=e.number(m.y,y.y,x),S=new e.default$25(w,M,y.angleTo(m),g);if(S._round(),c&&!i(t,S,f,c,r))return;return S}p+=v;}}function u(t,r,n,l,u,h,c,f,p){var d=a(l,h,c),g=s(l,u),m=0===t[0].x||t[0].x===p||0===t[0].y||t[0].y===p;return r-g*c<r/4&&(r=g*c+r/4),function t(r,n,a,s,l,u,h,c,f){var p=u/2;var d=o(r);var g=0,m=n-a;var y=[];for(var v=0;v<r.length-1;v++){for(var x=r[v],w=r[v+1],M=x.dist(w),S=w.angleTo(x);m+a<g+M;){var _=((m+=a)-g)/M,b=e.number(x.x,w.x,_),I=e.number(x.y,w.y,_);if(b>=0&&b<f&&I>=0&&I<f&&m-p>=0&&m+p<=d){var k=new e.default$25(b,I,S,v);k._round(),s&&!i(r,k,u,s,l)||y.push(k);}}g+=M;}c||y.length||h||(y=t(r,g/2,a,s,l,u,h,!0,f));return y}(t,m?r/2*f%r:(g/2+2*h)*c*f%r,r,d,n,g*c,m,!1,p)}n.prototype.replace=function(e){this._layerConfigs={},this._layers={},this.update(e,[]);},n.prototype.update=function(t,n){for(var i=this,o=0,a=t;o<a.length;o+=1){var s=a[o];i._layerConfigs[s.id]=s;var l=i._layers[s.id]=e.default$20(s);l._featureFilter=e.default$24(l.filter);}for(var u=0,h=n;u<h.length;u+=1){var c=h[u];delete i._layerConfigs[c],delete i._layers[c];}this.familiesBySource={};for(var f=0,p=function(e){for(var t={},n=0;n<e.length;n++){var i=r(e[n]),o=t[i];o||(o=t[i]=[]),o.push(e[n]);}var a=[];for(var s in t)a.push(t[s]);return a}(e.values(this._layerConfigs));f<p.length;f+=1){var d=p[f].map(function(e){return i._layers[e.id]}),g=d[0];if("none"!==g.visibility){var m=g.source||"",y=i.familiesBySource[m];y||(y=i.familiesBySource[m]={});var v=g.sourceLayer||"_geojsonTileLayer",x=y[v];x||(x=y[v]=[]),x.push(d);}}};var h=function(){this.opacity=0,this.targetOpacity=0,this.time=0;};h.prototype.clone=function(){var e=new h;return e.opacity=this.opacity,e.targetOpacity=this.targetOpacity,e.time=this.time,e},e.register("OpacityState",h);var c=function(t,r,n,i,o,a,s,l,u,h,c,f){var p=s.top*l-u,d=s.bottom*l+u,g=s.left*l-u,m=s.right*l+u;if(this.boxStartIndex=t.length,h){var y=d-p,v=m-g;y>0&&(y=Math.max(10*l,y),this._addLineCollisionCircles(t,r,n,n.segment,v,y,i,o,a,c));}else{if(f){var x=new e.default(g,p),w=new e.default(m,p),M=new e.default(g,d),S=new e.default(m,d),_=f*Math.PI/180;x._rotate(_),w._rotate(_),M._rotate(_),S._rotate(_),g=Math.min(x.x,w.x,M.x,S.x),m=Math.max(x.x,w.x,M.x,S.x),p=Math.min(x.y,w.y,M.y,S.y),d=Math.max(x.y,w.y,M.y,S.y);}t.emplaceBack(n.x,n.y,g,p,m,d,i,o,a,0,0);}this.boxEndIndex=t.length;};c.prototype._addLineCollisionCircles=function(e,t,r,n,i,o,a,s,l,u){var h=o/2,c=Math.floor(i/h),f=1+.4*Math.log(u)/Math.LN2,p=Math.floor(c*f/2),d=-o/2,g=r,m=n+1,y=d,v=-i/2,x=v-i/4;do{if(--m<0){if(y>v)return;m=0;break}y-=t[m].dist(g),g=t[m];}while(y>x);for(var w=t[m].dist(t[m+1]),M=-p;M<c+p;M++){var S=M*h,_=v+S;if(S<0&&(_+=S),S>i&&(_+=S-i),!(_<y)){for(;y+w<_;){if(y+=w,++m+1>=t.length)return;w=t[m].dist(t[m+1]);}var b=_-y,I=t[m],k=t[m+1].sub(I)._unit()._mult(b)._add(I)._round(),z=Math.abs(_-d)<h?0:.8*(_-d);e.emplaceBack(k.x,k.y,-o/2,-o/2,o/2,o/2,a,s,l,o/2,z);}}};var f=d,p=d;function d(e,t){if(!(this instanceof d))return new d(e,t);if(this.data=e||[],this.length=this.data.length,this.compare=t||g,this.length>0)for(var r=(this.length>>1)-1;r>=0;r--)this._down(r);}function g(e,t){return e<t?-1:e>t?1:0}function m(t,r,n){void 0===r&&(r=1),void 0===n&&(n=!1);for(var i=1/0,o=1/0,a=-1/0,s=-1/0,l=t[0],u=0;u<l.length;u++){var h=l[u];(!u||h.x<i)&&(i=h.x),(!u||h.y<o)&&(o=h.y),(!u||h.x>a)&&(a=h.x),(!u||h.y>s)&&(s=h.y);}var c=a-i,p=s-o,d=Math.min(c,p),g=d/2,m=new f(null,y);if(0===d)return new e.default(i,o);for(var x=i;x<a;x+=d)for(var w=o;w<s;w+=d)m.push(new v(x+g,w+g,g,t));for(var M=function(e){for(var t=0,r=0,n=0,i=e[0],o=0,a=i.length,s=a-1;o<a;s=o++){var l=i[o],u=i[s],h=l.x*u.y-u.x*l.y;r+=(l.x+u.x)*h,n+=(l.y+u.y)*h,t+=3*h;}return new v(r/t,n/t,0,e)}(t),S=m.length;m.length;){var _=m.pop();(_.d>M.d||!M.d)&&(M=_,n&&console.log("found best %d after %d probes",Math.round(1e4*_.d)/1e4,S)),_.max-M.d<=r||(g=_.h/2,m.push(new v(_.p.x-g,_.p.y-g,g,t)),m.push(new v(_.p.x+g,_.p.y-g,g,t)),m.push(new v(_.p.x-g,_.p.y+g,g,t)),m.push(new v(_.p.x+g,_.p.y+g,g,t)),S+=4);}return n&&(console.log("num probes: "+S),console.log("best distance: "+M.d)),M.p}function y(e,t){return t.max-e.max}function v(t,r,n,i){this.p=new e.default(t,r),this.h=n,this.d=function(t,r){for(var n=!1,i=1/0,o=0;o<r.length;o++)for(var a=r[o],s=0,l=a.length,u=l-1;s<l;u=s++){var h=a[s],c=a[u];h.y>t.y!=c.y>t.y&&t.x<(c.x-h.x)*(t.y-h.y)/(c.y-h.y)+h.x&&(n=!n),i=Math.min(i,e.distToSegmentSquared(t,h,c));}return(n?1:-1)*Math.sqrt(i)}(this.p,i),this.max=this.d+this.h*Math.SQRT2;}function x(t,r,n,i,o,a){t.createArrays(),t.symbolInstances=[];var s=512*t.overscaling;t.tilePixelRatio=e.default$10/s,t.compareText={},t.iconsNeedLinear=!1;var l=t.layers[0].layout,u=t.layers[0]._unevaluatedLayout._values,h={};if("composite"===t.textSizeData.functionType){var c=t.textSizeData.zoomRange,f=c.min,p=c.max;h.compositeTextSizes=[u["text-size"].possiblyEvaluate(new e.default$23(f)),u["text-size"].possiblyEvaluate(new e.default$23(p))];}if("composite"===t.iconSizeData.functionType){var d=t.iconSizeData.zoomRange,g=d.min,m=d.max;h.compositeIconSizes=[u["icon-size"].possiblyEvaluate(new e.default$23(g)),u["icon-size"].possiblyEvaluate(new e.default$23(m))];}h.layoutTextSize=u["text-size"].possiblyEvaluate(new e.default$23(t.zoom+1)),h.layoutIconSize=u["icon-size"].possiblyEvaluate(new e.default$23(t.zoom+1)),h.textMaxSize=u["text-size"].possiblyEvaluate(new e.default$23(18));for(var y=24*l.get("text-line-height"),v="map"===l.get("text-rotation-alignment")&&"point"!==l.get("symbol-placement"),x=l.get("text-keep-upright"),M=0,S=t.features;M<S.length;M+=1){var _=S[M],b=l.get("text-font").evaluate(_,{}).join(","),I=r[b]||{},k=n[b]||{},z={},T=_.text;if(T){var P=l.get("text-offset").evaluate(_,{}).map(function(e){return 24*e}),L=24*l.get("text-letter-spacing").evaluate(_,{}),D=e.allowsLetterSpacing(T)?L:0,O=l.get("text-anchor").evaluate(_,{}),C=l.get("text-justify").evaluate(_,{}),E="point"===l.get("symbol-placement")?24*l.get("text-max-width").evaluate(_,{}):0;z.horizontal=e.shapeText(T,I,E,y,O,C,D,P,24,e.WritingMode.horizontal),e.allowsVerticalWritingMode(T)&&v&&x&&(z.vertical=e.shapeText(T,I,E,y,O,C,D,P,24,e.WritingMode.vertical));}var N=void 0;if(_.icon){var A=i[_.icon];A&&(N=e.shapeIcon(o[_.icon],l.get("icon-offset").evaluate(_,{}),l.get("icon-anchor").evaluate(_,{})),void 0===t.sdfIcons?t.sdfIcons=A.sdf:t.sdfIcons!==A.sdf&&e.warnOnce("Style sheet warning: Cannot mix SDF and non-SDF icons in one buffer"),A.pixelRatio!==t.pixelRatio?t.iconsNeedLinear=!0:0!==l.get("icon-rotate").constantOr(1)&&(t.iconsNeedLinear=!0));}(z.horizontal||N)&&w(t,_,z,N,k,h);}a&&t.generateCollisionDebugBuffers();}function w(t,r,n,i,o,a){var s=a.layoutTextSize.evaluate(r,{}),f=a.layoutIconSize.evaluate(r,{}),p=a.textMaxSize.evaluate(r,{});void 0===p&&(p=s);var d=t.layers[0].layout,g=d.get("text-offset").evaluate(r,{}),y=d.get("icon-offset").evaluate(r,{}),v=s/24,x=t.tilePixelRatio*v,w=t.tilePixelRatio*p/24,_=t.tilePixelRatio*f,b=t.tilePixelRatio*d.get("symbol-spacing"),I=d.get("text-padding")*t.tilePixelRatio,k=d.get("icon-padding")*t.tilePixelRatio,z=d.get("text-max-angle")/180*Math.PI,T="map"===d.get("text-rotation-alignment")&&"point"!==d.get("symbol-placement"),P="map"===d.get("icon-rotation-alignment")&&"point"!==d.get("symbol-placement"),L=d.get("symbol-placement"),D=b/2,O=function(s,l){l.x<0||l.x>=e.default$10||l.y<0||l.y>=e.default$10||t.symbolInstances.push(function(t,r,n,i,o,a,s,l,u,f,p,d,g,m,y,v,x,w,S,_,b){var I,k,z=t.addToLineVertexArray(r,n),T=0,P=0,L=0,D=i.horizontal?i.horizontal.text:"",O=[];if(i.horizontal){var C=a.layout.get("text-rotate").evaluate(S,{});I=new c(s,n,r,l,u,f,i.horizontal,p,d,g,t.overscaling,C),P+=M(t,r,i.horizontal,a,g,S,m,z,i.vertical?e.WritingMode.horizontal:e.WritingMode.horizontalOnly,O,_,b),i.vertical&&(L+=M(t,r,i.vertical,a,g,S,m,z,e.WritingMode.vertical,O,_,b));}var E=I?I.boxStartIndex:t.collisionBoxArray.length,N=I?I.boxEndIndex:t.collisionBoxArray.length;if(o){var A=function(t,r,n,i,o,a){var s,l,u,h,c=r.image,f=n.layout,p=r.top-1/c.pixelRatio,d=r.left-1/c.pixelRatio,g=r.bottom+1/c.pixelRatio,m=r.right+1/c.pixelRatio;if("none"!==f.get("icon-text-fit")&&o){var y=m-d,v=g-p,x=f.get("text-size").evaluate(a,{})/24,w=o.left*x,M=o.right*x,S=o.top*x,_=M-w,b=o.bottom*x-S,I=f.get("icon-text-fit-padding")[0],k=f.get("icon-text-fit-padding")[1],z=f.get("icon-text-fit-padding")[2],T=f.get("icon-text-fit-padding")[3],P="width"===f.get("icon-text-fit")?.5*(b-v):0,L="height"===f.get("icon-text-fit")?.5*(_-y):0,D="width"===f.get("icon-text-fit")||"both"===f.get("icon-text-fit")?_:y,O="height"===f.get("icon-text-fit")||"both"===f.get("icon-text-fit")?b:v;s=new e.default(w+L-T,S+P-I),l=new e.default(w+L+k+D,S+P-I),u=new e.default(w+L+k+D,S+P+z+O),h=new e.default(w+L-T,S+P+z+O);}else s=new e.default(d,p),l=new e.default(m,p),u=new e.default(m,g),h=new e.default(d,g);var C=n.layout.get("icon-rotate").evaluate(a,{})*Math.PI/180;if(C){var E=Math.sin(C),N=Math.cos(C),A=[N,-E,E,N];s._matMult(A),l._matMult(A),h._matMult(A),u._matMult(A);}return[{tl:s,tr:l,bl:h,br:u,tex:c.paddedRect,writingMode:void 0,glyphOffset:[0,0]}]}(0,o,a,0,i.horizontal,S),B=a.layout.get("icon-rotate").evaluate(S,{});k=new c(s,n,r,l,u,f,o,y,v,!1,t.overscaling,B),T=4*A.length;var $=t.iconSizeData,R=null;"source"===$.functionType?R=[10*a.layout.get("icon-size").evaluate(S,{})]:"composite"===$.functionType&&(R=[10*b.compositeIconSizes[0].evaluate(S,{}),10*b.compositeIconSizes[1].evaluate(S,{})]),t.addSymbols(t.icon,A,R,w,x,S,!1,r,z.lineStartIndex,z.lineLength);}var F=k?k.boxStartIndex:t.collisionBoxArray.length,G=k?k.boxEndIndex:t.collisionBoxArray.length;t.glyphOffsetArray.length>=e.default$27.MAX_GLYPHS&&e.warnOnce("Too many glyphs being rendered in a tile. See https://github.com/mapbox/mapbox-gl-js/issues/2907");var J=new h,V=new h;return{key:D,textBoxStartIndex:E,textBoxEndIndex:N,iconBoxStartIndex:F,iconBoxEndIndex:G,textOffset:m,iconOffset:w,anchor:r,line:n,featureIndex:l,feature:S,numGlyphVertices:P,numVerticalGlyphVertices:L,numIconVertices:T,textOpacityState:J,iconOpacityState:V,isDuplicate:!1,placedTextSymbolIndices:O,crossTileID:0}}(t,l,s,n,i,t.layers[0],t.collisionBoxArray,r.index,r.sourceLayerIndex,t.index,x,I,T,g,_,k,P,y,r,o,a));};if("line"===L)for(var C=0,E=function(t,r,n,i,o){for(var a=[],s=0;s<t.length;s++)for(var l=t[s],u=void 0,h=0;h<l.length-1;h++){var c=l[h],f=l[h+1];c.x<r&&f.x<r||(c.x<r?c=new e.default(r,c.y+(f.y-c.y)*((r-c.x)/(f.x-c.x)))._round():f.x<r&&(f=new e.default(r,c.y+(f.y-c.y)*((r-c.x)/(f.x-c.x)))._round()),c.y<n&&f.y<n||(c.y<n?c=new e.default(c.x+(f.x-c.x)*((n-c.y)/(f.y-c.y)),n)._round():f.y<n&&(f=new e.default(c.x+(f.x-c.x)*((n-c.y)/(f.y-c.y)),n)._round()),c.x>=i&&f.x>=i||(c.x>=i?c=new e.default(i,c.y+(f.y-c.y)*((i-c.x)/(f.x-c.x)))._round():f.x>=i&&(f=new e.default(i,c.y+(f.y-c.y)*((i-c.x)/(f.x-c.x)))._round()),c.y>=o&&f.y>=o||(c.y>=o?c=new e.default(c.x+(f.x-c.x)*((o-c.y)/(f.y-c.y)),o)._round():f.y>=o&&(f=new e.default(c.x+(f.x-c.x)*((o-c.y)/(f.y-c.y)),o)._round()),u&&c.equals(u[u.length-1])||(u=[c],a.push(u)),u.push(f)))));}return a}(r.geometry,0,0,e.default$10,e.default$10);C<E.length;C+=1)for(var N=E[C],A=0,B=u(N,b,z,n.vertical||n.horizontal,i,24,w,t.overscaling,e.default$10);A<B.length;A+=1){var $=B[A],R=n.horizontal;R&&S(t,R.text,D,$)||O(N,$);}else if("line-center"===L)for(var F=0,G=r.geometry;F<G.length;F+=1){var J=G[F];if(J.length>1){var V=l(J,z,n.vertical||n.horizontal,i,24,w);V&&O(J,V);}}else if("Polygon"===r.type)for(var Z=0,j=e.default$26(r.geometry,0);Z<j.length;Z+=1){var W=j[Z],Y=m(W,16);O(W[0],new e.default$25(Y.x,Y.y,0));}else if("LineString"===r.type)for(var X=0,q=r.geometry;X<q.length;X+=1){var U=q[X];O(U,new e.default$25(U[0].x,U[0].y,0));}else if("Point"===r.type)for(var H=0,Q=r.geometry;H<Q.length;H+=1)for(var K=0,ee=Q[H];K<ee.length;K+=1){var te=ee[K];O([te],new e.default$25(te.x,te.y,0));}}function M(t,r,n,i,o,a,s,l,u,h,c,f){var p=function(t,r,n,i,o,a){for(var s=n.layout.get("text-rotate").evaluate(o,{})*Math.PI/180,l=n.layout.get("text-offset").evaluate(o,{}).map(function(e){return 24*e}),u=r.positionedGlyphs,h=[],c=0;c<u.length;c++){var f=u[c],p=a[f.glyph];if(p){var d=p.rect;if(d){var g=e.GLYPH_PBF_BORDER+1,m=p.metrics.advance/2,y=i?[f.x+m,f.y]:[0,0],v=i?[0,0]:[f.x+m+l[0],f.y+l[1]],x=p.metrics.left-g-m+v[0],w=-p.metrics.top-g+v[1],M=x+d.w,S=w+d.h,_=new e.default(x,w),b=new e.default(M,w),I=new e.default(x,S),k=new e.default(M,S);if(i&&f.vertical){var z=new e.default(-m,m),T=-Math.PI/2,P=new e.default(5,0);_._rotateAround(T,z)._add(P),b._rotateAround(T,z)._add(P),I._rotateAround(T,z)._add(P),k._rotateAround(T,z)._add(P);}if(s){var L=Math.sin(s),D=Math.cos(s),O=[D,-L,L,D];_._matMult(O),b._matMult(O),I._matMult(O),k._matMult(O);}h.push({tl:_,tr:b,bl:I,br:k,tex:d,writingMode:r.writingMode,glyphOffset:y});}}}return h}(0,n,i,o,a,c),d=t.textSizeData,g=null;return"source"===d.functionType?g=[10*i.layout.get("text-size").evaluate(a,{})]:"composite"===d.functionType&&(g=[10*f.compositeTextSizes[0].evaluate(a,{}),10*f.compositeTextSizes[1].evaluate(a,{})]),t.addSymbols(t.text,p,g,s,o,a,u,r,l.lineStartIndex,l.lineLength),h.push(t.text.placedSymbolArray.length-1),4*p.length}function S(e,t,r,n){var i=e.compareText;if(t in i){for(var o=i[t],a=o.length-1;a>=0;a--)if(n.dist(o[a])<r)return!0}else i[t]=[];return i[t].push(n),!1}d.prototype={push:function(e){this.data.push(e),this.length++,this._up(this.length-1);},pop:function(){if(0!==this.length){var e=this.data[0];return this.length--,this.length>0&&(this.data[0]=this.data[this.length],this._down(0)),this.data.pop(),e}},peek:function(){return this.data[0]},_up:function(e){for(var t=this.data,r=this.compare,n=t[e];e>0;){var i=e-1>>1,o=t[i];if(r(n,o)>=0)break;t[e]=o,e=i;}t[e]=n;},_down:function(e){for(var t=this.data,r=this.compare,n=this.length>>1,i=t[e];e<n;){var o=1+(e<<1),a=o+1,s=t[o];if(a<this.length&&r(t[a],s)<0&&(o=a,s=t[a]),r(s,i)>=0)break;t[e]=s,e=o;}t[e]=i;}},f.default=p;var _=function(t){var r=new e.AlphaImage({width:0,height:0}),n={},i=new e.default$3(0,0,{autoResize:!0});for(var o in t){var a=t[o],s=n[o]={};for(var l in a){var u=a[+l];if(u&&0!==u.bitmap.width&&0!==u.bitmap.height){var h=i.packOne(u.bitmap.width+2,u.bitmap.height+2);r.resize({width:i.w,height:i.h}),e.AlphaImage.copy(u.bitmap,r,{x:0,y:0},{x:h.x+1,y:h.y+1},u.bitmap),s[l]={rect:h,metrics:u.metrics};}}}i.shrink(),r.resize({width:i.w,height:i.h}),this.image=r,this.positions=n;};e.register("GlyphAtlas",_);var b=function(t){this.tileID=new e.OverscaledTileID(t.tileID.overscaledZ,t.tileID.wrap,t.tileID.canonical.z,t.tileID.canonical.x,t.tileID.canonical.y),this.uid=t.uid,this.zoom=t.zoom,this.pixelRatio=t.pixelRatio,this.tileSize=t.tileSize,this.source=t.source,this.overscaling=this.tileID.overscaleFactor(),this.showCollisionBoxes=t.showCollisionBoxes,this.collectResourceTiming=!!t.collectResourceTiming;};function I(t,r){for(var n=new e.default$23(r),i=0,o=t;i<o.length;i+=1){o[i].recalculate(n);}}b.prototype.parse=function(t,r,n,i){var o=this;this.status="parsing",this.data=t,this.collisionBoxArray=new e.CollisionBoxArray;var a=new e.default$29(Object.keys(t.layers).sort()),s=new e.default$28(this.tileID);s.bucketLayerIDs=[];var l,u,h,c={},f={featureIndex:s,iconDependencies:{},glyphDependencies:{}},p=r.familiesBySource[this.source];for(var d in p){var g=t.layers[d];if(g){1===g.version&&e.warnOnce('Vector tile source "'+o.source+'" layer "'+d+'" does not use vector tile spec v2 and therefore may have some rendering errors.');for(var m=a.encode(d),y=[],v=0;v<g.length;v++){var w=g.feature(v);y.push({feature:w,index:v,sourceLayerIndex:m});}for(var M=0,S=p[d];M<S.length;M+=1){var b=S[M],k=b[0];if(!(k.minzoom&&o.zoom<Math.floor(k.minzoom)))if(!(k.maxzoom&&o.zoom>=k.maxzoom))if("none"!==k.visibility)I(b,o.zoom),(c[k.id]=k.createBucket({index:s.bucketLayerIDs.length,layers:b,zoom:o.zoom,pixelRatio:o.pixelRatio,overscaling:o.overscaling,collisionBoxArray:o.collisionBoxArray,sourceLayerIndex:m,sourceID:o.source})).populate(y,f),s.bucketLayerIDs.push(b.map(function(e){return e.id}));}}}var z=e.mapObject(f.glyphDependencies,function(e){return Object.keys(e).map(Number)});Object.keys(z).length?n.send("getGlyphs",{uid:this.uid,stacks:z},function(e,t){l||(l=e,u=t,P.call(o));}):u={};var T=Object.keys(f.iconDependencies);function P(){if(l)return i(l);if(u&&h){var t=new _(u),r=new e.default$30(h);for(var n in c){var o=c[n];o instanceof e.default$27&&(I(o.layers,this.zoom),x(o,u,t.positions,h,r.positions,this.showCollisionBoxes));}this.status="done",i(null,{buckets:e.values(c).filter(function(e){return!e.isEmpty()}),featureIndex:s,collisionBoxArray:this.collisionBoxArray,glyphAtlasImage:t.image,iconAtlasImage:r.image});}}T.length?n.send("getImages",{icons:T},function(e,t){l||(l=e,h=t,P.call(o));}):h={},P.call(this);};var k="undefined"!=typeof performance,z={getEntriesByName:function(e){return!!(k&&performance&&performance.getEntriesByName)&&performance.getEntriesByName(e)},mark:function(e){return!!(k&&performance&&performance.mark)&&performance.mark(e)},measure:function(e,t,r){return!!(k&&performance&&performance.measure)&&performance.measure(e,t,r)},clearMarks:function(e){return!!(k&&performance&&performance.clearMarks)&&performance.clearMarks(e)},clearMeasures:function(e){return!!(k&&performance&&performance.clearMeasures)&&performance.clearMeasures(e)}},T=function(e){this._marks={start:[e.url,"start"].join("#"),end:[e.url,"end"].join("#"),measure:e.url.toString()},z.mark(this._marks.start);};function P(t,r){var n=e.getArrayBuffer(t.request,function(t,n){t?r(t):n&&r(null,{vectorTile:new e.default$31.VectorTile(new e.default$32(n.data)),rawData:n.data,cacheControl:n.cacheControl,expires:n.expires});});return function(){n.cancel(),r();}}T.prototype.finish=function(){z.mark(this._marks.end);var e=z.getEntriesByName(this._marks.measure);return 0===e.length&&(z.measure(this._marks.measure,this._marks.start,this._marks.end),e=z.getEntriesByName(this._marks.measure),z.clearMarks(this._marks.start),z.clearMarks(this._marks.end),z.clearMeasures(this._marks.measure)),e},z.Performance=T;var L=function(e,t,r){this.actor=e,this.layerIndex=t,this.loadVectorData=r||P,this.loading={},this.loaded={};};L.prototype.loadTile=function(t,r){var n=this,i=t.uid;this.loading||(this.loading={});var o=!!(t&&t.request&&t.request.collectResourceTiming)&&new z.Performance(t.request),a=this.loading[i]=new b(t);a.abort=this.loadVectorData(t,function(t,s){if(delete n.loading[i],t||!s)return r(t);var l=s.rawData,u={};s.expires&&(u.expires=s.expires),s.cacheControl&&(u.cacheControl=s.cacheControl);var h={};if(o){var c=o.finish();c&&(h.resourceTiming=JSON.parse(JSON.stringify(c)));}a.vectorTile=s.vectorTile,a.parse(s.vectorTile,n.layerIndex,n.actor,function(t,n){if(t||!n)return r(t);r(null,e.extend({rawTileData:l.slice(0)},n,u,h));}),n.loaded=n.loaded||{},n.loaded[i]=a;});},L.prototype.reloadTile=function(e,t){var r=this.loaded,n=e.uid,i=this;if(r&&r[n]){var o=r[n];o.showCollisionBoxes=e.showCollisionBoxes;var a=function(e,r){var n=o.reloadCallback;n&&(delete o.reloadCallback,o.parse(o.vectorTile,i.layerIndex,i.actor,n)),t(e,r);};"parsing"===o.status?o.reloadCallback=a:"done"===o.status&&o.parse(o.vectorTile,this.layerIndex,this.actor,a);}},L.prototype.abortTile=function(e,t){var r=this.loading,n=e.uid;r&&r[n]&&r[n].abort&&(r[n].abort(),delete r[n]),t();},L.prototype.removeTile=function(e,t){var r=this.loaded,n=e.uid;r&&r[n]&&delete r[n],t();};var D=function(){this.loading={},this.loaded={};};D.prototype.loadTile=function(t,r){var n=t.uid,i=t.encoding,o=new e.default$33(n);this.loading[n]=o,o.loadFromImage(t.rawImageData,i),delete this.loading[n],this.loaded=this.loaded||{},this.loaded[n]=o,r(null,o);},D.prototype.removeTile=function(e){var t=this.loaded,r=e.uid;t&&t[r]&&delete t[r];};var O={RADIUS:6378137,FLATTENING:1/298.257223563,POLAR_RADIUS:6356752.3142};function C(e){var t=0;if(e&&e.length>0){t+=Math.abs(E(e[0]));for(var r=1;r<e.length;r++)t-=Math.abs(E(e[r]));}return t}function E(e){var t,r,n,i,o,a,s=0,l=e.length;if(l>2){for(a=0;a<l;a++)a===l-2?(n=l-2,i=l-1,o=0):a===l-1?(n=l-1,i=0,o=1):(n=a,i=a+1,o=a+2),t=e[n],r=e[i],s+=(N(e[o][0])-N(t[0]))*Math.sin(N(r[1]));s=s*O.RADIUS*O.RADIUS/2;}return s}function N(e){return e*Math.PI/180}var A={geometry:function e(t){var r,n=0;switch(t.type){case"Polygon":return C(t.coordinates);case"MultiPolygon":for(r=0;r<t.coordinates.length;r++)n+=C(t.coordinates[r]);return n;case"Point":case"MultiPoint":case"LineString":case"MultiLineString":return 0;case"GeometryCollection":for(r=0;r<t.geometries.length;r++)n+=e(t.geometries[r]);return n}},ring:E},B=function e(t,r){switch(t&&t.type||null){case"FeatureCollection":return t.features=t.features.map($(e,r)),t;case"Feature":return t.geometry=e(t.geometry,r),t;case"Polygon":case"MultiPolygon":return function(e,t){"Polygon"===e.type?e.coordinates=R(e.coordinates,t):"MultiPolygon"===e.type&&(e.coordinates=e.coordinates.map($(R,t)));return e}(t,r);default:return t}};function $(e,t){return function(r){return e(r,t)}}function R(e,t){t=!!t,e[0]=F(e[0],t);for(var r=1;r<e.length;r++)e[r]=F(e[r],!t);return e}function F(e,t){return function(e){return A.ring(e)>=0}(e)===t?e:e.reverse()}var G=e.default$31.VectorTileFeature.prototype.toGeoJSON,J=function(t){this._feature=t,this.extent=e.default$10,this.type=t.type,this.properties=t.tags,"id"in t&&!isNaN(t.id)&&(this.id=parseInt(t.id,10));};J.prototype.loadGeometry=function(){if(1===this._feature.type){for(var t=[],r=0,n=this._feature.geometry;r<n.length;r+=1){var i=n[r];t.push([new e.default(i[0],i[1])]);}return t}for(var o=[],a=0,s=this._feature.geometry;a<s.length;a+=1){for(var l=[],u=0,h=s[a];u<h.length;u+=1){var c=h[u];l.push(new e.default(c[0],c[1]));}o.push(l);}return o},J.prototype.toGeoJSON=function(e,t,r){return G.call(this,e,t,r)};var V=function(t){this.layers={_geojsonTileLayer:this},this.name="_geojsonTileLayer",this.extent=e.default$10,this.length=t.length,this._features=t;};V.prototype.feature=function(e){return new J(this._features[e])};var Z=e.__moduleExports.VectorTileFeature,j=W;function W(e,t){this.options=t||{},this.features=e,this.length=e.length;}function Y(e,t){this.id="number"==typeof e.id?e.id:void 0,this.type=e.type,this.rawGeometry=1===e.type?[e.geometry]:e.geometry,this.properties=e.tags,this.extent=t||4096;}W.prototype.feature=function(e){return new Y(this.features[e],this.options.extent)},Y.prototype.loadGeometry=function(){var t=this.rawGeometry;this.geometry=[];for(var r=0;r<t.length;r++){for(var n=t[r],i=[],o=0;o<n.length;o++)i.push(new e.default$34(n[o][0],n[o][1]));this.geometry.push(i);}return this.geometry},Y.prototype.bbox=function(){this.geometry||this.loadGeometry();for(var e=this.geometry,t=1/0,r=-1/0,n=1/0,i=-1/0,o=0;o<e.length;o++)for(var a=e[o],s=0;s<a.length;s++){var l=a[s];t=Math.min(t,l.x),r=Math.max(r,l.x),n=Math.min(n,l.y),i=Math.max(i,l.y);}return[t,n,r,i]},Y.prototype.toGeoJSON=Z.prototype.toGeoJSON;var X=Q,q=Q,U=function(e,t){t=t||{};var r={};for(var n in e)r[n]=new j(e[n].features,t),r[n].name=n,r[n].version=t.version,r[n].extent=t.extent;return Q({layers:r})},H=j;function Q(t){var r=new e.__moduleExports$1;return function(e,t){for(var r in e.layers)t.writeMessage(3,K,e.layers[r]);}(t,r),r.finish()}function K(e,t){var r;t.writeVarintField(15,e.version||1),t.writeStringField(1,e.name||""),t.writeVarintField(5,e.extent||4096);var n={keys:[],values:[],keycache:{},valuecache:{}};for(r=0;r<e.length;r++)n.feature=e.feature(r),t.writeMessage(2,ee,n);var i=n.keys;for(r=0;r<i.length;r++)t.writeStringField(3,i[r]);var o=n.values;for(r=0;r<o.length;r++)t.writeMessage(4,oe,o[r]);}function ee(e,t){var r=e.feature;void 0!==r.id&&t.writeVarintField(1,r.id),t.writeMessage(2,te,e),t.writeVarintField(3,r.type),t.writeMessage(4,ie,r);}function te(e,t){var r=e.feature,n=e.keys,i=e.values,o=e.keycache,a=e.valuecache;for(var s in r.properties){var l=o[s];void 0===l&&(n.push(s),l=n.length-1,o[s]=l),t.writeVarint(l);var u=r.properties[s],h=typeof u;"string"!==h&&"boolean"!==h&&"number"!==h&&(u=JSON.stringify(u));var c=h+":"+u,f=a[c];void 0===f&&(i.push(u),f=i.length-1,a[c]=f),t.writeVarint(f);}}function re(e,t){return(t<<3)+(7&e)}function ne(e){return e<<1^e>>31}function ie(e,t){for(var r=e.loadGeometry(),n=e.type,i=0,o=0,a=r.length,s=0;s<a;s++){var l=r[s],u=1;1===n&&(u=l.length),t.writeVarint(re(1,u));for(var h=3===n?l.length-1:l.length,c=0;c<h;c++){1===c&&1!==n&&t.writeVarint(re(2,h-1));var f=l[c].x-i,p=l[c].y-o;t.writeVarint(ne(f)),t.writeVarint(ne(p)),i+=f,o+=p;}3===n&&t.writeVarint(re(7,0));}}function oe(e,t){var r=typeof e;"string"===r?t.writeStringField(1,e):"boolean"===r?t.writeBooleanField(7,e):"number"===r&&(e%1!=0?t.writeDoubleField(3,e):e<0?t.writeSVarintField(6,e):t.writeVarintField(5,e));}function ae(e,t,r,n,i,o){if(!(i-n<=r)){var a=Math.floor((n+i)/2);!function e(t,r,n,i,o,a){for(;o>i;){if(o-i>600){var s=o-i+1,l=n-i+1,u=Math.log(s),h=.5*Math.exp(2*u/3),c=.5*Math.sqrt(u*h*(s-h)/s)*(l-s/2<0?-1:1),f=Math.max(i,Math.floor(n-l*h/s+c)),p=Math.min(o,Math.floor(n+(s-l)*h/s+c));e(t,r,n,f,p,a);}var d=r[2*n+a],g=i,m=o;for(se(t,r,i,n),r[2*o+a]>d&&se(t,r,i,o);g<m;){for(se(t,r,g,m),g++,m--;r[2*g+a]<d;)g++;for(;r[2*m+a]>d;)m--;}r[2*i+a]===d?se(t,r,i,m):se(t,r,++m,o),m<=n&&(i=m+1),n<=m&&(o=m-1);}}(e,t,a,n,i,o%2),ae(e,t,r,n,a-1,o+1),ae(e,t,r,a+1,i,o+1);}}function se(e,t,r,n){le(e,r,n),le(t,2*r,2*n),le(t,2*r+1,2*n+1);}function le(e,t,r){var n=e[t];e[t]=e[r],e[r]=n;}function ue(e,t,r,n){var i=e-r,o=t-n;return i*i+o*o}function he(e,t,r,n,i){return new ce(e,t,r,n,i)}function ce(e,t,r,n,i){t=t||fe,r=r||pe,i=i||Array,this.nodeSize=n||64,this.points=e,this.ids=new i(e.length),this.coords=new i(2*e.length);for(var o=0;o<e.length;o++)this.ids[o]=o,this.coords[2*o]=t(e[o]),this.coords[2*o+1]=r(e[o]);ae(this.ids,this.coords,this.nodeSize,0,this.ids.length-1,0);}function fe(e){return e[0]}function pe(e){return e[1]}function de(e){this.options=we(Object.create(this.options),e),this.trees=new Array(this.options.maxZoom+1);}function ge(e,t,r,n,i){return{x:e,y:t,zoom:1/0,id:r,parentId:-1,numPoints:n,properties:i}}function me(e){return{type:"Feature",properties:ye(e),geometry:{type:"Point",coordinates:[(n=e.x,360*(n-.5)),(t=e.y,r=(180-360*t)*Math.PI/180,360*Math.atan(Math.exp(r))/Math.PI-90)]}};var t,r,n;}function ye(e){var t=e.numPoints,r=t>=1e4?Math.round(t/1e3)+"k":t>=1e3?Math.round(t/100)/10+"k":t;return we(we({},e.properties),{cluster:!0,cluster_id:e.id,point_count:t,point_count_abbreviated:r})}function ve(e){return e/360+.5}function xe(e){var t=Math.sin(e*Math.PI/180),r=.5-.25*Math.log((1+t)/(1-t))/Math.PI;return r<0?0:r>1?1:r}function we(e,t){for(var r in t)e[r]=t[r];return e}function Me(e){return e.x}function Se(e){return e.y}function _e(e,t,r,n,i,o){var a=i-r,s=o-n;if(0!==a||0!==s){var l=((e-r)*a+(t-n)*s)/(a*a+s*s);l>1?(r=i,n=o):l>0&&(r+=a*l,n+=s*l);}return(a=e-r)*a+(s=t-n)*s}function be(e,t,r,n){var i={id:void 0===e?null:e,type:t,geometry:r,tags:n,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0};return function(e){var t=e.geometry,r=e.type;if("Point"===r||"MultiPoint"===r||"LineString"===r)Ie(e,t);else if("Polygon"===r||"MultiLineString"===r)for(var n=0;n<t.length;n++)Ie(e,t[n]);else if("MultiPolygon"===r)for(n=0;n<t.length;n++)for(var i=0;i<t[n].length;i++)Ie(e,t[n][i]);}(i),i}function Ie(e,t){for(var r=0;r<t.length;r+=3)e.minX=Math.min(e.minX,t[r]),e.minY=Math.min(e.minY,t[r+1]),e.maxX=Math.max(e.maxX,t[r]),e.maxY=Math.max(e.maxY,t[r+1]);}function ke(e,t,r){if(t.geometry){var n=t.geometry.coordinates,i=t.geometry.type,o=Math.pow(r.tolerance/((1<<r.maxZoom)*r.extent),2),a=[];if("Point"===i)ze(n,a);else if("MultiPoint"===i)for(var s=0;s<n.length;s++)ze(n[s],a);else if("LineString"===i)Te(n,a,o,!1);else if("MultiLineString"===i){if(r.lineMetrics){for(s=0;s<n.length;s++)a=[],Te(n[s],a,o,!1),e.push(be(t.id,"LineString",a,t.properties));return}Pe(n,a,o,!1);}else if("Polygon"===i)Pe(n,a,o,!0);else{if("MultiPolygon"!==i){if("GeometryCollection"===i){for(s=0;s<t.geometry.geometries.length;s++)ke(e,{id:t.id,geometry:t.geometry.geometries[s],properties:t.properties},r);return}throw new Error("Input data is not a valid GeoJSON object.")}for(s=0;s<n.length;s++){var l=[];Pe(n[s],l,o,!0),a.push(l);}}e.push(be(t.id,i,a,t.properties));}}function ze(e,t){t.push(Le(e[0])),t.push(De(e[1])),t.push(0);}function Te(e,t,r,n){for(var i,o,a=0,s=0;s<e.length;s++){var l=Le(e[s][0]),u=De(e[s][1]);t.push(l),t.push(u),t.push(0),s>0&&(a+=n?(i*u-l*o)/2:Math.sqrt(Math.pow(l-i,2)+Math.pow(u-o,2))),i=l,o=u;}var h=t.length-3;t[2]=1,function e(t,r,n,i){for(var o,a=i,s=n-r>>1,l=n-r,u=t[r],h=t[r+1],c=t[n],f=t[n+1],p=r+3;p<n;p+=3){var d=_e(t[p],t[p+1],u,h,c,f);if(d>a)o=p,a=d;else if(d===a){var g=Math.abs(p-s);g<l&&(o=p,l=g);}}a>i&&(o-r>3&&e(t,r,o,i),t[o+2]=a,n-o>3&&e(t,o,n,i));}(t,0,h,r),t[h+2]=1,t.size=Math.abs(a),t.start=0,t.end=t.size;}function Pe(e,t,r,n){for(var i=0;i<e.length;i++){var o=[];Te(e[i],o,r,n),t.push(o);}}function Le(e){return e/360+.5}function De(e){var t=Math.sin(e*Math.PI/180),r=.5-.25*Math.log((1+t)/(1-t))/Math.PI;return r<0?0:r>1?1:r}function Oe(e,t,r,n,i,o,a,s){if(n/=t,o>=(r/=t)&&a<n)return e;if(a<r||o>=n)return null;for(var l=[],u=0;u<e.length;u++){var h=e[u],c=h.geometry,f=h.type,p=0===i?h.minX:h.minY,d=0===i?h.maxX:h.maxY;if(p>=r&&d<n)l.push(h);else if(!(d<r||p>=n)){var g=[];if("Point"===f||"MultiPoint"===f)Ce(c,g,r,n,i);else if("LineString"===f)Ee(c,g,r,n,i,!1,s.lineMetrics);else if("MultiLineString"===f)Ae(c,g,r,n,i,!1);else if("Polygon"===f)Ae(c,g,r,n,i,!0);else if("MultiPolygon"===f)for(var m=0;m<c.length;m++){var y=[];Ae(c[m],y,r,n,i,!0),y.length&&g.push(y);}if(g.length){if(s.lineMetrics&&"LineString"===f){for(m=0;m<g.length;m++)l.push(be(h.id,f,g[m],h.tags));continue}"LineString"!==f&&"MultiLineString"!==f||(1===g.length?(f="LineString",g=g[0]):f="MultiLineString"),"Point"!==f&&"MultiPoint"!==f||(f=3===g.length?"Point":"MultiPoint"),l.push(be(h.id,f,g,h.tags));}}}return l.length?l:null}function Ce(e,t,r,n,i){for(var o=0;o<e.length;o+=3){var a=e[o+i];a>=r&&a<=n&&(t.push(e[o]),t.push(e[o+1]),t.push(e[o+2]));}}function Ee(e,t,r,n,i,o,a){for(var s,l,u=Ne(e),h=0===i?$e:Re,c=e.start,f=0;f<e.length-3;f+=3){var p=e[f],d=e[f+1],g=e[f+2],m=e[f+3],y=e[f+4],v=0===i?p:d,x=0===i?m:y,w=!1;a&&(s=Math.sqrt(Math.pow(p-m,2)+Math.pow(d-y,2))),v<r?x>=r&&(l=h(u,p,d,m,y,r),a&&(u.start=c+s*l)):v>=n?x<n&&(l=h(u,p,d,m,y,n),a&&(u.start=c+s*l)):Be(u,p,d,g),x<r&&v>=r&&(l=h(u,p,d,m,y,r),w=!0),x>n&&v<=n&&(l=h(u,p,d,m,y,n),w=!0),!o&&w&&(a&&(u.end=c+s*l),t.push(u),u=Ne(e)),a&&(c+=s);}var M=e.length-3;p=e[M],d=e[M+1],g=e[M+2],(v=0===i?p:d)>=r&&v<=n&&Be(u,p,d,g),M=u.length-3,o&&M>=3&&(u[M]!==u[0]||u[M+1]!==u[1])&&Be(u,u[0],u[1],u[2]),u.length&&t.push(u);}function Ne(e){var t=[];return t.size=e.size,t.start=e.start,t.end=e.end,t}function Ae(e,t,r,n,i,o){for(var a=0;a<e.length;a++)Ee(e[a],t,r,n,i,o,!1);}function Be(e,t,r,n){e.push(t),e.push(r),e.push(n);}function $e(e,t,r,n,i,o){var a=(o-t)/(n-t);return e.push(o),e.push(r+(i-r)*a),e.push(1),a}function Re(e,t,r,n,i,o){var a=(o-r)/(i-r);return e.push(t+(n-t)*a),e.push(o),e.push(1),a}function Fe(e,t){for(var r=[],n=0;n<e.length;n++){var i,o=e[n],a=o.type;if("Point"===a||"MultiPoint"===a||"LineString"===a)i=Ge(o.geometry,t);else if("MultiLineString"===a||"Polygon"===a){i=[];for(var s=0;s<o.geometry.length;s++)i.push(Ge(o.geometry[s],t));}else if("MultiPolygon"===a)for(i=[],s=0;s<o.geometry.length;s++){for(var l=[],u=0;u<o.geometry[s].length;u++)l.push(Ge(o.geometry[s][u],t));i.push(l);}r.push(be(o.id,a,i,o.tags));}return r}function Ge(e,t){var r=[];r.size=e.size,void 0!==e.start&&(r.start=e.start,r.end=e.end);for(var n=0;n<e.length;n+=3)r.push(e[n]+t,e[n+1],e[n+2]);return r}function Je(e,t){if(e.transformed)return e;var r,n,i,o=1<<e.z,a=e.x,s=e.y;for(r=0;r<e.features.length;r++){var l=e.features[r],u=l.geometry,h=l.type;if(l.geometry=[],1===h)for(n=0;n<u.length;n+=2)l.geometry.push(Ve(u[n],u[n+1],t,o,a,s));else for(n=0;n<u.length;n++){var c=[];for(i=0;i<u[n].length;i+=2)c.push(Ve(u[n][i],u[n][i+1],t,o,a,s));l.geometry.push(c);}}return e.transformed=!0,e}function Ve(e,t,r,n,i,o){return[Math.round(r*(e*n-i)),Math.round(r*(t*n-o))]}function Ze(e,t,r,n,i){for(var o=t===i.maxZoom?0:i.tolerance/((1<<t)*i.extent),a={features:[],numPoints:0,numSimplified:0,numFeatures:0,source:null,x:r,y:n,z:t,transformed:!1,minX:2,minY:1,maxX:-1,maxY:0},s=0;s<e.length;s++){a.numFeatures++,je(a,e[s],o,i);var l=e[s].minX,u=e[s].minY,h=e[s].maxX,c=e[s].maxY;l<a.minX&&(a.minX=l),u<a.minY&&(a.minY=u),h>a.maxX&&(a.maxX=h),c>a.maxY&&(a.maxY=c);}return a}function je(e,t,r,n){var i=t.geometry,o=t.type,a=[];if("Point"===o||"MultiPoint"===o)for(var s=0;s<i.length;s+=3)a.push(i[s]),a.push(i[s+1]),e.numPoints++,e.numSimplified++;else if("LineString"===o)We(a,i,e,r,!1,!1);else if("MultiLineString"===o||"Polygon"===o)for(s=0;s<i.length;s++)We(a,i[s],e,r,"Polygon"===o,0===s);else if("MultiPolygon"===o)for(var l=0;l<i.length;l++){var u=i[l];for(s=0;s<u.length;s++)We(a,u[s],e,r,!0,0===s);}if(a.length){var h=t.tags||null;if("LineString"===o&&n.lineMetrics){for(var c in h={},t.tags)h[c]=t.tags[c];h.mapbox_clip_start=i.start/i.size,h.mapbox_clip_end=i.end/i.size;}var f={geometry:a,type:"Polygon"===o||"MultiPolygon"===o?3:"LineString"===o||"MultiLineString"===o?2:1,tags:h};null!==t.id&&(f.id=t.id),e.features.push(f);}}function We(e,t,r,n,i,o){var a=n*n;if(n>0&&t.size<(i?a:n))r.numPoints+=t.length/3;else{for(var s=[],l=0;l<t.length;l+=3)(0===n||t[l+2]>a)&&(r.numSimplified++,s.push(t[l]),s.push(t[l+1])),r.numPoints++;i&&function(e,t){for(var r=0,n=0,i=e.length,o=i-2;n<i;o=n,n+=2)r+=(e[n]-e[o])*(e[n+1]+e[o+1]);if(r>0===t)for(n=0,i=e.length;n<i/2;n+=2){var a=e[n],s=e[n+1];e[n]=e[i-2-n],e[n+1]=e[i-1-n],e[i-2-n]=a,e[i-1-n]=s;}}(s,o),e.push(s);}}function Ye(e,t){var r=(t=this.options=function(e,t){for(var r in t)e[r]=t[r];return e}(Object.create(this.options),t)).debug;if(r&&console.time("preprocess data"),t.maxZoom<0||t.maxZoom>24)throw new Error("maxZoom should be in the 0-24 range");var n=function(e,t){var r=[];if("FeatureCollection"===e.type)for(var n=0;n<e.features.length;n++)ke(r,e.features[n],t);else"Feature"===e.type?ke(r,e,t):ke(r,{geometry:e},t);return r}(e,t);this.tiles={},this.tileCoords=[],r&&(console.timeEnd("preprocess data"),console.log("index: maxZoom: %d, maxPoints: %d",t.indexMaxZoom,t.indexMaxPoints),console.time("generate tiles"),this.stats={},this.total=0),(n=function(e,t){var r=t.buffer/t.extent,n=e,i=Oe(e,1,-1-r,r,0,-1,2,t),o=Oe(e,1,1-r,2+r,0,-1,2,t);return(i||o)&&(n=Oe(e,1,-r,1+r,0,-1,2,t)||[],i&&(n=Fe(i,1).concat(n)),o&&(n=n.concat(Fe(o,-1)))),n}(n,t)).length&&this.splitTile(n,0,0,0),r&&(n.length&&console.log("features: %d, points: %d",this.tiles[0].numFeatures,this.tiles[0].numPoints),console.timeEnd("generate tiles"),console.log("tiles generated:",this.total,JSON.stringify(this.stats)));}function Xe(e,t,r){return 32*((1<<e)*r+t)+e}function qe(e,t){var r=e.tileID.canonical;if(!this._geoJSONIndex)return t(null,null);var n=this._geoJSONIndex.getTile(r.z,r.x,r.y);if(!n)return t(null,null);var i=new V(n.features),o=X(i);0===o.byteOffset&&o.byteLength===o.buffer.byteLength||(o=new Uint8Array(o)),t(null,{vectorTile:i,rawData:o.buffer});}X.fromVectorTileJs=q,X.fromGeojsonVt=U,X.GeoJSONWrapper=H,ce.prototype={range:function(e,t,r,n){return function(e,t,r,n,i,o,a){for(var s,l,u=[0,e.length-1,0],h=[];u.length;){var c=u.pop(),f=u.pop(),p=u.pop();if(f-p<=a)for(var d=p;d<=f;d++)s=t[2*d],l=t[2*d+1],s>=r&&s<=i&&l>=n&&l<=o&&h.push(e[d]);else{var g=Math.floor((p+f)/2);s=t[2*g],l=t[2*g+1],s>=r&&s<=i&&l>=n&&l<=o&&h.push(e[g]);var m=(c+1)%2;(0===c?r<=s:n<=l)&&(u.push(p),u.push(g-1),u.push(m)),(0===c?i>=s:o>=l)&&(u.push(g+1),u.push(f),u.push(m));}}return h}(this.ids,this.coords,e,t,r,n,this.nodeSize)},within:function(e,t,r){return function(e,t,r,n,i,o){for(var a=[0,e.length-1,0],s=[],l=i*i;a.length;){var u=a.pop(),h=a.pop(),c=a.pop();if(h-c<=o)for(var f=c;f<=h;f++)ue(t[2*f],t[2*f+1],r,n)<=l&&s.push(e[f]);else{var p=Math.floor((c+h)/2),d=t[2*p],g=t[2*p+1];ue(d,g,r,n)<=l&&s.push(e[p]);var m=(u+1)%2;(0===u?r-i<=d:n-i<=g)&&(a.push(c),a.push(p-1),a.push(m)),(0===u?r+i>=d:n+i>=g)&&(a.push(p+1),a.push(h),a.push(m));}}return s}(this.ids,this.coords,e,t,r,this.nodeSize)}},de.prototype={options:{minZoom:0,maxZoom:16,radius:40,extent:512,nodeSize:64,log:!1,reduce:null,initial:function(){return{}},map:function(e){return e}},load:function(e){var t=this.options.log;t&&console.time("total time");var r="prepare "+e.length+" points";t&&console.time(r),this.points=e;for(var n,i,o,a=[],s=0;s<e.length;s++)e[s].geometry&&a.push((n=e[s],i=s,void 0,{x:ve((o=n.geometry.coordinates)[0]),y:xe(o[1]),zoom:1/0,id:i,parentId:-1}));this.trees[this.options.maxZoom+1]=he(a,Me,Se,this.options.nodeSize,Float32Array),t&&console.timeEnd(r);for(var l=this.options.maxZoom;l>=this.options.minZoom;l--){var u=+Date.now();a=this._cluster(a,l),this.trees[l]=he(a,Me,Se,this.options.nodeSize,Float32Array),t&&console.log("z%d: %d clusters in %dms",l,a.length,+Date.now()-u);}return t&&console.timeEnd("total time"),this},getClusters:function(e,t){var r=((e[0]+180)%360+360)%360-180,n=Math.max(-90,Math.min(90,e[1])),i=180===e[2]?180:((e[2]+180)%360+360)%360-180,o=Math.max(-90,Math.min(90,e[3]));if(e[2]-e[0]>=360)r=-180,i=180;else if(r>i){var a=this.getClusters([r,n,180,o],t),s=this.getClusters([-180,n,i,o],t);return a.concat(s)}for(var l=this.trees[this._limitZoom(t)],u=l.range(ve(r),xe(o),ve(i),xe(n)),h=[],c=0;c<u.length;c++){var f=l.points[u[c]];h.push(f.numPoints?me(f):this.points[f.id]);}return h},getChildren:function(e){var t=e>>5,r=e%32,n="No cluster with the specified id.",i=this.trees[r];if(!i)throw new Error(n);var o=i.points[t];if(!o)throw new Error(n);for(var a=this.options.radius/(this.options.extent*Math.pow(2,r-1)),s=i.within(o.x,o.y,a),l=[],u=0;u<s.length;u++){var h=i.points[s[u]];h.parentId===e&&l.push(h.numPoints?me(h):this.points[h.id]);}if(0===l.length)throw new Error(n);return l},getLeaves:function(e,t,r){t=t||10,r=r||0;var n=[];return this._appendLeaves(n,e,t,r,0),n},getTile:function(e,t,r){var n=this.trees[this._limitZoom(e)],i=Math.pow(2,e),o=this.options.extent,a=this.options.radius/o,s=(r-a)/i,l=(r+1+a)/i,u={features:[]};return this._addTileFeatures(n.range((t-a)/i,s,(t+1+a)/i,l),n.points,t,r,i,u),0===t&&this._addTileFeatures(n.range(1-a/i,s,1,l),n.points,i,r,i,u),t===i-1&&this._addTileFeatures(n.range(0,s,a/i,l),n.points,-1,r,i,u),u.features.length?u:null},getClusterExpansionZoom:function(e){for(var t=e%32-1;t<this.options.maxZoom;){var r=this.getChildren(e);if(t++,1!==r.length)break;e=r[0].properties.cluster_id;}return t},_appendLeaves:function(e,t,r,n,i){for(var o=this.getChildren(t),a=0;a<o.length;a++){var s=o[a].properties;if(s&&s.cluster?i+s.point_count<=n?i+=s.point_count:i=this._appendLeaves(e,s.cluster_id,r,n,i):i<n?i++:e.push(o[a]),e.length===r)break}return i},_addTileFeatures:function(e,t,r,n,i,o){for(var a=0;a<e.length;a++){var s=t[e[a]];o.features.push({type:1,geometry:[[Math.round(this.options.extent*(s.x*i-r)),Math.round(this.options.extent*(s.y*i-n))]],tags:s.numPoints?ye(s):this.points[s.id].properties});}},_limitZoom:function(e){return Math.max(this.options.minZoom,Math.min(e,this.options.maxZoom+1))},_cluster:function(e,t){for(var r=[],n=this.options.radius/(this.options.extent*Math.pow(2,t)),i=0;i<e.length;i++){var o=e[i];if(!(o.zoom<=t)){o.zoom=t;var a=this.trees[t+1],s=a.within(o.x,o.y,n),l=o.numPoints||1,u=o.x*l,h=o.y*l,c=null;this.options.reduce&&(c=this.options.initial(),this._accumulate(c,o));for(var f=(i<<5)+(t+1),p=0;p<s.length;p++){var d=a.points[s[p]];if(!(d.zoom<=t)){d.zoom=t;var g=d.numPoints||1;u+=d.x*g,h+=d.y*g,l+=g,d.parentId=f,this.options.reduce&&this._accumulate(c,d);}}1===l?r.push(o):(o.parentId=f,r.push(ge(u/l,h/l,f,l,c)));}}return r},_accumulate:function(e,t){var r=t.numPoints?t.properties:this.options.map(this.points[t.id].properties);this.options.reduce(e,r);}},Ye.prototype.options={maxZoom:14,indexMaxZoom:5,indexMaxPoints:1e5,tolerance:3,extent:4096,buffer:64,lineMetrics:!1,debug:0},Ye.prototype.splitTile=function(e,t,r,n,i,o,a){for(var s=[e,t,r,n],l=this.options,u=l.debug;s.length;){n=s.pop(),r=s.pop(),t=s.pop(),e=s.pop();var h=1<<t,c=Xe(t,r,n),f=this.tiles[c];if(!f&&(u>1&&console.time("creation"),f=this.tiles[c]=Ze(e,t,r,n,l),this.tileCoords.push({z:t,x:r,y:n}),u)){u>1&&(console.log("tile z%d-%d-%d (features: %d, points: %d, simplified: %d)",t,r,n,f.numFeatures,f.numPoints,f.numSimplified),console.timeEnd("creation"));var p="z"+t;this.stats[p]=(this.stats[p]||0)+1,this.total++;}if(f.source=e,i){if(t===l.maxZoom||t===i)continue;var d=1<<i-t;if(r!==Math.floor(o/d)||n!==Math.floor(a/d))continue}else if(t===l.indexMaxZoom||f.numPoints<=l.indexMaxPoints)continue;if(f.source=null,0!==e.length){u>1&&console.time("clipping");var g,m,y,v,x,w,M=.5*l.buffer/l.extent,S=.5-M,_=.5+M,b=1+M;g=m=y=v=null,x=Oe(e,h,r-M,r+_,0,f.minX,f.maxX,l),w=Oe(e,h,r+S,r+b,0,f.minX,f.maxX,l),e=null,x&&(g=Oe(x,h,n-M,n+_,1,f.minY,f.maxY,l),m=Oe(x,h,n+S,n+b,1,f.minY,f.maxY,l),x=null),w&&(y=Oe(w,h,n-M,n+_,1,f.minY,f.maxY,l),v=Oe(w,h,n+S,n+b,1,f.minY,f.maxY,l),w=null),u>1&&console.timeEnd("clipping"),s.push(g||[],t+1,2*r,2*n),s.push(m||[],t+1,2*r,2*n+1),s.push(y||[],t+1,2*r+1,2*n),s.push(v||[],t+1,2*r+1,2*n+1);}}},Ye.prototype.getTile=function(e,t,r){var n=this.options,i=n.extent,o=n.debug;if(e<0||e>24)return null;var a=1<<e,s=Xe(e,t=(t%a+a)%a,r);if(this.tiles[s])return Je(this.tiles[s],i);o>1&&console.log("drilling down to z%d-%d-%d",e,t,r);for(var l,u=e,h=t,c=r;!l&&u>0;)u--,h=Math.floor(h/2),c=Math.floor(c/2),l=this.tiles[Xe(u,h,c)];return l&&l.source?(o>1&&console.log("found parent tile z%d-%d-%d",u,h,c),o>1&&console.time("drilling down"),this.splitTile(l.source,u,h,c,e,t,r),o>1&&console.timeEnd("drilling down"),this.tiles[s]?Je(this.tiles[s],i):null):null};var Ue=function(t){function r(e,r,n){t.call(this,e,r,qe),n&&(this.loadGeoJSON=n);}return t&&(r.__proto__=t),r.prototype=Object.create(t&&t.prototype),r.prototype.constructor=r,r.prototype.loadData=function(e,t){this._pendingCallback&&this._pendingCallback(null,{abandoned:!0}),this._pendingCallback=t,this._pendingLoadDataParams=e,this._state&&"Idle"!==this._state?this._state="NeedsLoadData":(this._state="Coalescing",this._loadData());},r.prototype._loadData=function(){var e=this;if(this._pendingCallback&&this._pendingLoadDataParams){var t=this._pendingCallback,r=this._pendingLoadDataParams;delete this._pendingCallback,delete this._pendingLoadDataParams;var n=!!(r&&r.request&&r.request.collectResourceTiming)&&new z.Performance(r.request);this.loadGeoJSON(r,function(i,o){if(i||!o)return t(i);if("object"!=typeof o)return t(new Error("Input data is not a valid GeoJSON object."));B(o,!0);try{e._geoJSONIndex=r.cluster?(a=r.superclusterOptions,new de(a)).load(o.features):function(e,t){return new Ye(e,t)}(o,r.geojsonVtOptions);}catch(i){return t(i)}e.loaded={};var a,s={};if(n){var l=n.finish();l&&(s.resourceTiming={},s.resourceTiming[r.source]=JSON.parse(JSON.stringify(l)));}t(null,s);});}},r.prototype.coalesce=function(){"Coalescing"===this._state?this._state="Idle":"NeedsLoadData"===this._state&&(this._state="Coalescing",this._loadData());},r.prototype.reloadTile=function(e,r){var n=this.loaded,i=e.uid;return n&&n[i]?t.prototype.reloadTile.call(this,e,r):this.loadTile(e,r)},r.prototype.loadGeoJSON=function(t,r){if(t.request)e.getJSON(t.request,r);else{if("string"!=typeof t.data)return r(new Error("Input data is not a valid GeoJSON object."));try{return r(null,JSON.parse(t.data))}catch(e){return r(new Error("Input data is not a valid GeoJSON object."))}}},r.prototype.removeSource=function(e,t){this._pendingCallback&&this._pendingCallback(null,{abandoned:!0}),t();},r.prototype.getClusterExpansionZoom=function(e,t){t(null,this._geoJSONIndex.getClusterExpansionZoom(e.clusterId));},r.prototype.getClusterChildren=function(e,t){t(null,this._geoJSONIndex.getChildren(e.clusterId));},r.prototype.getClusterLeaves=function(e,t){t(null,this._geoJSONIndex.getLeaves(e.clusterId,e.limit,e.offset));},r}(L),He=function(t){var r=this;this.self=t,this.actor=new e.default$9(t,this),this.layerIndexes={},this.workerSourceTypes={vector:L,geojson:Ue},this.workerSources={},this.demWorkerSources={},this.self.registerWorkerSource=function(e,t){if(r.workerSourceTypes[e])throw new Error('Worker source with name "'+e+'" already registered.');r.workerSourceTypes[e]=t;},this.self.registerRTLTextPlugin=function(t){if(e.plugin.isLoaded())throw new Error("RTL text plugin already registered.");e.plugin.applyArabicShaping=t.applyArabicShaping,e.plugin.processBidirectionalText=t.processBidirectionalText;};};return He.prototype.setLayers=function(e,t,r){this.getLayerIndex(e).replace(t),r();},He.prototype.updateLayers=function(e,t,r){this.getLayerIndex(e).update(t.layers,t.removedIds),r();},He.prototype.loadTile=function(e,t,r){this.getWorkerSource(e,t.type,t.source).loadTile(t,r);},He.prototype.loadDEMTile=function(e,t,r){this.getDEMWorkerSource(e,t.source).loadTile(t,r);},He.prototype.reloadTile=function(e,t,r){this.getWorkerSource(e,t.type,t.source).reloadTile(t,r);},He.prototype.abortTile=function(e,t,r){this.getWorkerSource(e,t.type,t.source).abortTile(t,r);},He.prototype.removeTile=function(e,t,r){this.getWorkerSource(e,t.type,t.source).removeTile(t,r);},He.prototype.removeDEMTile=function(e,t){this.getDEMWorkerSource(e,t.source).removeTile(t);},He.prototype.removeSource=function(e,t,r){if(this.workerSources[e]&&this.workerSources[e][t.type]&&this.workerSources[e][t.type][t.source]){var n=this.workerSources[e][t.type][t.source];delete this.workerSources[e][t.type][t.source],void 0!==n.removeSource?n.removeSource(t,r):r();}},He.prototype.loadWorkerSource=function(e,t,r){try{this.self.importScripts(t.url),r();}catch(e){r(e.toString());}},He.prototype.loadRTLTextPlugin=function(t,r,n){try{e.plugin.isLoaded()||(this.self.importScripts(r),n(e.plugin.isLoaded()?null:new Error("RTL Text Plugin failed to import scripts from "+r)));}catch(e){n(e.toString());}},He.prototype.getLayerIndex=function(e){var t=this.layerIndexes[e];return t||(t=this.layerIndexes[e]=new n),t},He.prototype.getWorkerSource=function(e,t,r){var n=this;if(this.workerSources[e]||(this.workerSources[e]={}),this.workerSources[e][t]||(this.workerSources[e][t]={}),!this.workerSources[e][t][r]){var i={send:function(t,r,i){n.actor.send(t,r,i,e);}};this.workerSources[e][t][r]=new this.workerSourceTypes[t](i,this.getLayerIndex(e));}return this.workerSources[e][t][r]},He.prototype.getDEMWorkerSource=function(e,t){return this.demWorkerSources[e]||(this.demWorkerSources[e]={}),this.demWorkerSources[e][t]||(this.demWorkerSources[e][t]=new D),this.demWorkerSources[e][t]},"undefined"!=typeof WorkerGlobalScope&&"undefined"!=typeof self&&self instanceof WorkerGlobalScope&&new He(self),He});
	
	define(["./chunk1.js"],function(t){"use strict";var e=t.createCommonjsModule(function(t){function e(t){return!!("undefined"!=typeof window&&"undefined"!=typeof document&&Array.prototype&&Array.prototype.every&&Array.prototype.filter&&Array.prototype.forEach&&Array.prototype.indexOf&&Array.prototype.lastIndexOf&&Array.prototype.map&&Array.prototype.some&&Array.prototype.reduce&&Array.prototype.reduceRight&&Array.isArray&&Function.prototype&&Function.prototype.bind&&Object.keys&&Object.create&&Object.getPrototypeOf&&Object.getOwnPropertyNames&&Object.isSealed&&Object.isFrozen&&Object.isExtensible&&Object.getOwnPropertyDescriptor&&Object.defineProperty&&Object.defineProperties&&Object.seal&&Object.freeze&&Object.preventExtensions&&"JSON"in window&&"parse"in JSON&&"stringify"in JSON&&function(){if(!("Worker"in window&&"Blob"in window&&"URL"in window))return!1;var t,e,i=new Blob([""],{type:"text/javascript"}),n=URL.createObjectURL(i);try{e=new Worker(n),t=!0;}catch(e){t=!1;}e&&e.terminate();return URL.revokeObjectURL(n),t}()&&"Uint8ClampedArray"in window&&ArrayBuffer.isView&&function(t){void 0===i[t]&&(i[t]=function(t){var i=document.createElement("canvas"),n=Object.create(e.webGLContextAttributes);return n.failIfMajorPerformanceCaveat=t,i.probablySupportsContext?i.probablySupportsContext("webgl",n)||i.probablySupportsContext("experimental-webgl",n):i.supportsContext?i.supportsContext("webgl",n)||i.supportsContext("experimental-webgl",n):i.getContext("webgl",n)||i.getContext("experimental-webgl",n)}(t));return i[t]}(t&&t.failIfMajorPerformanceCaveat))}t.exports?t.exports=e:window&&(window.mapboxgl=window.mapboxgl||{},window.mapboxgl.supported=e);var i={};e.webGLContextAttributes={antialias:!1,alpha:!0,stencil:!0,depth:!0};}),i={create:function(e,i,n){var o=t.default$1.document.createElement(e);return i&&(o.className=i),n&&n.appendChild(o),o},createNS:function(e,i){return t.default$1.document.createElementNS(e,i)}},n=t.default$1.document?t.default$1.document.documentElement.style:null;function o(t){if(!n)return null;for(var e=0;e<t.length;e++)if(t[e]in n)return t[e];return t[0]}var r,a=o(["userSelect","MozUserSelect","WebkitUserSelect","msUserSelect"]);i.disableDrag=function(){n&&a&&(r=n[a],n[a]="none");},i.enableDrag=function(){n&&a&&(n[a]=r);};var s=o(["transform","WebkitTransform"]);i.setTransform=function(t,e){t.style[s]=e;};var l=!1;try{var c=Object.defineProperty({},"passive",{get:function(){l=!0;}});t.default$1.addEventListener("test",c,c),t.default$1.removeEventListener("test",c,c);}catch(t){l=!1;}i.addEventListener=function(t,e,i,n){void 0===n&&(n={}),"passive"in n&&l?t.addEventListener(e,i,n):t.addEventListener(e,i,n.capture);},i.removeEventListener=function(t,e,i,n){void 0===n&&(n={}),"passive"in n&&l?t.removeEventListener(e,i,n):t.removeEventListener(e,i,n.capture);};var u=function(e){e.preventDefault(),e.stopPropagation(),t.default$1.removeEventListener("click",u,!0);};i.suppressClick=function(){t.default$1.addEventListener("click",u,!0),t.default$1.setTimeout(function(){t.default$1.removeEventListener("click",u,!0);},0);},i.mousePos=function(e,i){var n=e.getBoundingClientRect();return i=i.touches?i.touches[0]:i,new t.default(i.clientX-n.left-e.clientLeft,i.clientY-n.top-e.clientTop)},i.touchPos=function(e,i){for(var n=e.getBoundingClientRect(),o=[],r="touchend"===i.type?i.changedTouches:i.touches,a=0;a<r.length;a++)o.push(new t.default(r[a].clientX-n.left-e.clientLeft,r[a].clientY-n.top-e.clientTop));return o},i.mouseButton=function(e){return void 0!==t.default$1.InstallTrigger&&2===e.button&&e.ctrlKey&&t.default$1.navigator.platform.toUpperCase().indexOf("MAC")>=0?0:e.button},i.remove=function(t){t.parentNode&&t.parentNode.removeChild(t);};var h={API_URL:"https://api.mapbox.com",REQUIRE_ACCESS_TOKEN:!0,ACCESS_TOKEN:null},p="See https://www.mapbox.com/api-documentation/#access-tokens";function d(t,e){var i=b(h.API_URL);if(t.protocol=i.protocol,t.authority=i.authority,"/"!==i.path&&(t.path=""+i.path+t.path),!h.REQUIRE_ACCESS_TOKEN)return w(t);if(!(e=e||h.ACCESS_TOKEN))throw new Error("An API access token is required to use Mapbox GL. "+p);if("s"===e[0])throw new Error("Use a public access token (pk.*) with Mapbox GL, not a secret access token (sk.*). "+p);return t.params.push("access_token="+e),w(t)}function f(t){return 0===t.indexOf("mapbox:")}var m=function(t,e){if(!f(t))return t;var i=b(t);return i.path="/fonts/v1"+i.path,d(i,e)},_=function(t,e){if(!f(t))return t;var i=b(t);return i.path="/v4/"+i.authority+".json",i.params.push("secure"),d(i,e)},g=function(t,e,i,n){var o=b(t);return f(t)?(o.path="/styles/v1"+o.path+"/sprite"+e+i,d(o,n)):(o.path+=""+e+i,w(o))},v=/(\.(png|jpg)\d*)(?=$)/,y=function(e,i,n){if(!i||!f(i))return e;var o=b(e),r=t.default$2.devicePixelRatio>=2||512===n?"@2x":"",a=t.default$2.supportsWebp?".webp":"$1";return o.path=o.path.replace(v,""+r+a),function(t){for(var e=0;e<t.length;e++)0===t[e].indexOf("access_token=tk.")&&(t[e]="access_token="+(h.ACCESS_TOKEN||""));}(o.params),w(o)};var x=/^(\w+):\/\/([^/?]*)(\/[^?]+)?\??(.+)?/;function b(t){var e=t.match(x);if(!e)throw new Error("Unable to parse URL object");return{protocol:e[1],authority:e[2],path:e[3]||"/",params:e[4]?e[4].split("&"):[]}}function w(t){var e=t.params.length?"?"+t.params.join("&"):"";return t.protocol+"://"+t.authority+t.path+e}var E=function(){this.images={},this.loaded=!1,this.requestors=[],this.shelfPack=new t.default$3(64,64,{autoResize:!0}),this.patterns={},this.atlasImage=new t.RGBAImage({width:64,height:64}),this.dirty=!0;};E.prototype.isLoaded=function(){return this.loaded},E.prototype.setLoaded=function(t){if(this.loaded!==t&&(this.loaded=t,t)){for(var e=0,i=this.requestors;e<i.length;e+=1){var n=i[e],o=n.ids,r=n.callback;this._notify(o,r);}this.requestors=[];}},E.prototype.getImage=function(t){return this.images[t]},E.prototype.addImage=function(t,e){this.images[t]=e;},E.prototype.removeImage=function(t){delete this.images[t];var e=this.patterns[t];e&&(this.shelfPack.unref(e.bin),delete this.patterns[t]);},E.prototype.listImages=function(){return Object.keys(this.images)},E.prototype.getImages=function(t,e){var i=!0;if(!this.isLoaded())for(var n=0,o=t;n<o.length;n+=1){var r=o[n];this.images[r]||(i=!1);}this.isLoaded()||i?this._notify(t,e):this.requestors.push({ids:t,callback:e});},E.prototype._notify=function(t,e){for(var i={},n=0,o=t;n<o.length;n+=1){var r=o[n],a=this.images[r];a&&(i[r]={data:a.data.clone(),pixelRatio:a.pixelRatio,sdf:a.sdf});}e(null,i);},E.prototype.getPixelSize=function(){return{width:this.shelfPack.w,height:this.shelfPack.h}},E.prototype.getPattern=function(e){var i=this.patterns[e];if(i)return i.position;var n=this.getImage(e);if(!n)return null;var o=n.data.width+2,r=n.data.height+2,a=this.shelfPack.packOne(o,r);if(!a)return null;this.atlasImage.resize(this.getPixelSize());var s=n.data,l=this.atlasImage,c=a.x+1,u=a.y+1,h=s.width,p=s.height;t.RGBAImage.copy(s,l,{x:0,y:0},{x:c,y:u},{width:h,height:p}),t.RGBAImage.copy(s,l,{x:0,y:p-1},{x:c,y:u-1},{width:h,height:1}),t.RGBAImage.copy(s,l,{x:0,y:0},{x:c,y:u+p},{width:h,height:1}),t.RGBAImage.copy(s,l,{x:h-1,y:0},{x:c-1,y:u},{width:1,height:p}),t.RGBAImage.copy(s,l,{x:0,y:0},{x:c+h,y:u},{width:1,height:p}),this.dirty=!0;var d=new t.ImagePosition(a,n);return this.patterns[e]={bin:a,position:d},d},E.prototype.bind=function(e){var i=e.gl;this.atlasTexture?this.dirty&&(this.atlasTexture.update(this.atlasImage),this.dirty=!1):this.atlasTexture=new t.default$4(e,this.atlasImage,i.RGBA),this.atlasTexture.bind(i.LINEAR,i.CLAMP_TO_EDGE);};var T=C,I=1e20;function C(t,e,i,n,o,r){this.fontSize=t||24,this.buffer=void 0===e?3:e,this.cutoff=n||.25,this.fontFamily=o||"sans-serif",this.fontWeight=r||"normal",this.radius=i||8;var a=this.size=this.fontSize+2*this.buffer;this.canvas=document.createElement("canvas"),this.canvas.width=this.canvas.height=a,this.ctx=this.canvas.getContext("2d"),this.ctx.font=this.fontWeight+" "+this.fontSize+"px "+this.fontFamily,this.ctx.textBaseline="middle",this.ctx.fillStyle="black",this.gridOuter=new Float64Array(a*a),this.gridInner=new Float64Array(a*a),this.f=new Float64Array(a),this.d=new Float64Array(a),this.z=new Float64Array(a+1),this.v=new Int16Array(a),this.middle=Math.round(a/2*(navigator.userAgent.indexOf("Gecko/")>=0?1.2:1));}function S(t,e,i,n,o,r,a){for(var s=0;s<e;s++){for(var l=0;l<i;l++)n[l]=t[l*e+s];for(z(n,o,r,a,i),l=0;l<i;l++)t[l*e+s]=o[l];}for(l=0;l<i;l++){for(s=0;s<e;s++)n[s]=t[l*e+s];for(z(n,o,r,a,e),s=0;s<e;s++)t[l*e+s]=Math.sqrt(o[s]);}}function z(t,e,i,n,o){i[0]=0,n[0]=-I,n[1]=+I;for(var r=1,a=0;r<o;r++){for(var s=(t[r]+r*r-(t[i[a]]+i[a]*i[a]))/(2*r-2*i[a]);s<=n[a];)a--,s=(t[r]+r*r-(t[i[a]]+i[a]*i[a]))/(2*r-2*i[a]);i[++a]=r,n[a]=s,n[a+1]=+I;}for(r=0,a=0;r<o;r++){for(;n[a+1]<r;)a++;e[r]=(r-i[a])*(r-i[a])+t[i[a]];}}C.prototype.draw=function(t){this.ctx.clearRect(0,0,this.size,this.size),this.ctx.fillText(t,this.buffer,this.middle);for(var e=this.ctx.getImageData(0,0,this.size,this.size),i=new Uint8ClampedArray(this.size*this.size),n=0;n<this.size*this.size;n++){var o=e.data[4*n+3]/255;this.gridOuter[n]=1===o?0:0===o?I:Math.pow(Math.max(0,.5-o),2),this.gridInner[n]=1===o?I:0===o?0:Math.pow(Math.max(0,o-.5),2);}for(S(this.gridOuter,this.size,this.size,this.f,this.d,this.v,this.z),S(this.gridInner,this.size,this.size,this.f,this.d,this.v,this.z),n=0;n<this.size*this.size;n++){var r=this.gridOuter[n]-this.gridInner[n];i[n]=Math.max(0,Math.min(255,Math.round(255-255*(r/this.radius+this.cutoff))));}return i};var A=function(t,e){this.requestTransform=t,this.localIdeographFontFamily=e,this.entries={};};A.prototype.setURL=function(t){this.url=t;},A.prototype.getGlyphs=function(e,i){var n=this,o=[];for(var r in e)for(var a=0,s=e[r];a<s.length;a+=1){var l=s[a];o.push({stack:r,id:l});}t.asyncAll(o,function(t,e){var i=t.stack,o=t.id,r=n.entries[i];r||(r=n.entries[i]={glyphs:{},requests:{}});var a=r.glyphs[o];if(void 0===a)if(a=n._tinySDF(r,i,o))e(null,{stack:i,id:o,glyph:a});else{var s=Math.floor(o/256);if(256*s>65535)e(new Error("glyphs > 65535 not supported"));else{var l=r.requests[s];l||(l=r.requests[s]=[],A.loadGlyphRange(i,s,n.url,n.requestTransform,function(t,e){if(e)for(var i in e)r.glyphs[+i]=e[+i];for(var n=0,o=l;n<o.length;n+=1){(0,o[n])(t,e);}delete r.requests[s];})),l.push(function(t,n){t?e(t):n&&e(null,{stack:i,id:o,glyph:n[o]||null});});}}else e(null,{stack:i,id:o,glyph:a});},function(t,e){if(t)i(t);else if(e){for(var n={},o=0,r=e;o<r.length;o+=1){var a=r[o],s=a.stack,l=a.id,c=a.glyph;(n[s]||(n[s]={}))[l]=c&&{id:c.id,bitmap:c.bitmap.clone(),metrics:c.metrics};}i(null,n);}});},A.prototype._tinySDF=function(e,i,n){var o=this.localIdeographFontFamily;if(o&&(t.default$6["CJK Unified Ideographs"](n)||t.default$6["Hangul Syllables"](n))){var r=e.tinySDF;if(!r){var a="400";/bold/i.test(i)?a="900":/medium/i.test(i)?a="500":/light/i.test(i)&&(a="200"),r=e.tinySDF=new A.TinySDF(24,3,8,.25,o,a);}return{id:n,bitmap:new t.AlphaImage({width:30,height:30},r.draw(String.fromCharCode(n))),metrics:{width:24,height:24,left:0,top:-8,advance:24}}}},A.loadGlyphRange=function(e,i,n,o,r){var a=256*i,s=a+255,l=o(m(n).replace("{fontstack}",e).replace("{range}",a+"-"+s),t.ResourceType.Glyphs);t.getArrayBuffer(l,function(e,i){if(e)r(e);else if(i){for(var n={},o=0,a=t.default$5(i.data);o<a.length;o+=1){var s=a[o];n[s.id]=s;}r(null,n);}});},A.TinySDF=T;var M=function(){this.specification=t.default$7.light.position;};M.prototype.possiblyEvaluate=function(e,i){return t.sphericalToCartesian(e.expression.evaluate(i))},M.prototype.interpolate=function(e,i,n){return{x:t.number(e.x,i.x,n),y:t.number(e.y,i.y,n),z:t.number(e.z,i.z,n)}};var R=new t.Properties({anchor:new t.DataConstantProperty(t.default$7.light.anchor),position:new M,color:new t.DataConstantProperty(t.default$7.light.color),intensity:new t.DataConstantProperty(t.default$7.light.intensity)}),D=function(e){function i(i){e.call(this),this._transitionable=new t.Transitionable(R),this.setLight(i),this._transitioning=this._transitionable.untransitioned();}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.getLight=function(){return this._transitionable.serialize()},i.prototype.setLight=function(e){if(!this._validate(t.validateLight,e))for(var i in e){var n=e[i];t.endsWith(i,"-transition")?this._transitionable.setTransition(i.slice(0,-"-transition".length),n):this._transitionable.setValue(i,n);}},i.prototype.updateTransitions=function(t){this._transitioning=this._transitionable.transitioned(t,this._transitioning);},i.prototype.hasTransition=function(){return this._transitioning.hasTransition()},i.prototype.recalculate=function(t){this.properties=this._transitioning.possiblyEvaluate(t);},i.prototype._validate=function(e,i){return t.emitValidationErrors(this,e.call(t.validateStyle,t.extend({value:i,style:{glyphs:!0,sprite:!0},styleSpec:t.default$7})))},i}(t.Evented),L=function(t,e){this.width=t,this.height=e,this.nextRow=0,this.bytes=4,this.data=new Uint8Array(this.width*this.height*this.bytes),this.positions={};};L.prototype.getDash=function(t,e){var i=t.join(",")+String(e);return this.positions[i]||(this.positions[i]=this.addDash(t,e)),this.positions[i]},L.prototype.addDash=function(e,i){var n=i?7:0,o=2*n+1;if(this.nextRow+o>this.height)return t.warnOnce("LineAtlas out of space"),null;for(var r=0,a=0;a<e.length;a++)r+=e[a];for(var s=this.width/r,l=s/2,c=e.length%2==1,u=-n;u<=n;u++)for(var h=this.nextRow+n+u,p=this.width*h,d=c?-e[e.length-1]:0,f=e[0],m=1,_=0;_<this.width;_++){for(;f<_/s;)d=f,f+=e[m],c&&m===e.length-1&&(f+=e[0]),m++;var g=Math.abs(_-d*s),v=Math.abs(_-f*s),y=Math.min(g,v),x=m%2==1,b=void 0;if(i){var w=n?u/n*(l+1):0;if(x){var E=l-Math.abs(w);b=Math.sqrt(y*y+E*E);}else b=l-Math.sqrt(y*y+w*w);}else b=(x?1:-1)*y;this.data[3+4*(p+_)]=Math.max(0,Math.min(255,b+128));}var T={y:(this.nextRow+n+.5)/this.height,height:2*n/this.height,width:r};return this.nextRow+=o,this.dirty=!0,T},L.prototype.bind=function(t){var e=t.gl;this.texture?(e.bindTexture(e.TEXTURE_2D,this.texture),this.dirty&&(this.dirty=!1,e.texSubImage2D(e.TEXTURE_2D,0,0,0,this.width,this.height,e.RGBA,e.UNSIGNED_BYTE,this.data))):(this.texture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,this.width,this.height,0,e.RGBA,e.UNSIGNED_BYTE,this.data));};var P=function e(i,n){this.workerPool=i,this.actors=[],this.currentActor=0,this.id=t.uniqueId();for(var o=this.workerPool.acquire(this.id),r=0;r<o.length;r++){var a=o[r],s=new e.Actor(a,n,this.id);s.name="Worker "+r,this.actors.push(s);}};function k(e,i,n){var o=function(e,i){if(e)return n(e);if(i){var o=t.pick(i,["tiles","minzoom","maxzoom","attribution","mapbox_logo","bounds"]);i.vector_layers&&(o.vectorLayers=i.vector_layers,o.vectorLayerIds=o.vectorLayers.map(function(t){return t.id})),n(null,o);}};return e.url?t.getJSON(i(_(e.url),t.ResourceType.Source),o):t.default$2.frame(function(){return o(null,e)})}P.prototype.broadcast=function(e,i,n){n=n||function(){},t.asyncAll(this.actors,function(t,n){t.send(e,i,n);},n);},P.prototype.send=function(t,e,i,n){return("number"!=typeof n||isNaN(n))&&(n=this.currentActor=(this.currentActor+1)%this.actors.length),this.actors[n].send(t,e,i),n},P.prototype.remove=function(){this.actors.forEach(function(t){t.remove();}),this.actors=[],this.workerPool.release(this.id);},P.Actor=t.default$9;var B=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid LngLat object: ("+t+", "+e+")");if(this.lng=+t,this.lat=+e,this.lat>90||this.lat<-90)throw new Error("Invalid LngLat latitude value: must be between -90 and 90")};B.prototype.wrap=function(){return new B(t.wrap(this.lng,-180,180),this.lat)},B.prototype.toArray=function(){return[this.lng,this.lat]},B.prototype.toString=function(){return"LngLat("+this.lng+", "+this.lat+")"},B.prototype.toBounds=function(t){var e=360*t/40075017,i=e/Math.cos(Math.PI/180*this.lat);return new O(new B(this.lng-i,this.lat-e),new B(this.lng+i,this.lat+e))},B.convert=function(t){if(t instanceof B)return t;if(Array.isArray(t)&&(2===t.length||3===t.length))return new B(Number(t[0]),Number(t[1]));if(!Array.isArray(t)&&"object"==typeof t&&null!==t)return new B(Number(t.lng),Number(t.lat));throw new Error("`LngLatLike` argument must be specified as a LngLat instance, an object {lng: <lng>, lat: <lat>}, or an array of [<lng>, <lat>]")};var O=function(t,e){t&&(e?this.setSouthWest(t).setNorthEast(e):4===t.length?this.setSouthWest([t[0],t[1]]).setNorthEast([t[2],t[3]]):this.setSouthWest(t[0]).setNorthEast(t[1]));};O.prototype.setNorthEast=function(t){return this._ne=t instanceof B?new B(t.lng,t.lat):B.convert(t),this},O.prototype.setSouthWest=function(t){return this._sw=t instanceof B?new B(t.lng,t.lat):B.convert(t),this},O.prototype.extend=function(t){var e,i,n=this._sw,o=this._ne;if(t instanceof B)e=t,i=t;else{if(!(t instanceof O))return Array.isArray(t)?t.every(Array.isArray)?this.extend(O.convert(t)):this.extend(B.convert(t)):this;if(e=t._sw,i=t._ne,!e||!i)return this}return n||o?(n.lng=Math.min(e.lng,n.lng),n.lat=Math.min(e.lat,n.lat),o.lng=Math.max(i.lng,o.lng),o.lat=Math.max(i.lat,o.lat)):(this._sw=new B(e.lng,e.lat),this._ne=new B(i.lng,i.lat)),this},O.prototype.getCenter=function(){return new B((this._sw.lng+this._ne.lng)/2,(this._sw.lat+this._ne.lat)/2)},O.prototype.getSouthWest=function(){return this._sw},O.prototype.getNorthEast=function(){return this._ne},O.prototype.getNorthWest=function(){return new B(this.getWest(),this.getNorth())},O.prototype.getSouthEast=function(){return new B(this.getEast(),this.getSouth())},O.prototype.getWest=function(){return this._sw.lng},O.prototype.getSouth=function(){return this._sw.lat},O.prototype.getEast=function(){return this._ne.lng},O.prototype.getNorth=function(){return this._ne.lat},O.prototype.toArray=function(){return[this._sw.toArray(),this._ne.toArray()]},O.prototype.toString=function(){return"LngLatBounds("+this._sw.toString()+", "+this._ne.toString()+")"},O.prototype.isEmpty=function(){return!(this._sw&&this._ne)},O.convert=function(t){return!t||t instanceof O?t:new O(t)};var F=function(t,e,i){this.bounds=O.convert(this.validateBounds(t)),this.minzoom=e||0,this.maxzoom=i||24;};F.prototype.validateBounds=function(t){return Array.isArray(t)&&4===t.length?[Math.max(-180,t[0]),Math.max(-90,t[1]),Math.min(180,t[2]),Math.min(90,t[3])]:[-180,-90,180,90]},F.prototype.contains=function(t){var e=Math.floor(this.lngX(this.bounds.getWest(),t.z)),i=Math.floor(this.latY(this.bounds.getNorth(),t.z)),n=Math.ceil(this.lngX(this.bounds.getEast(),t.z)),o=Math.ceil(this.latY(this.bounds.getSouth(),t.z));return t.x>=e&&t.x<n&&t.y>=i&&t.y<o},F.prototype.lngX=function(t,e){return(t+180)*(Math.pow(2,e)/360)},F.prototype.latY=function(e,i){var n=t.clamp(Math.sin(Math.PI/180*e),-.9999,.9999),o=Math.pow(2,i)/(2*Math.PI);return Math.pow(2,i-1)+.5*Math.log((1+n)/(1-n))*-o};var N=function(e){function i(i,n,o,r){if(e.call(this),this.id=i,this.dispatcher=o,this.type="vector",this.minzoom=0,this.maxzoom=22,this.scheme="xyz",this.tileSize=512,this.reparseOverscaled=!0,this.isTileClipped=!0,t.extend(this,t.pick(n,["url","scheme","tileSize"])),this._options=t.extend({type:"vector"},n),this._collectResourceTiming=n.collectResourceTiming,512!==this.tileSize)throw new Error("vector tile sources must have a tileSize of 512");this.setEventedParent(r);}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.load=function(){var e=this;this.fire(new t.Event("dataloading",{dataType:"source"})),this._tileJSONRequest=k(this._options,this.map._transformRequest,function(i,n){e._tileJSONRequest=null,i?e.fire(new t.ErrorEvent(i)):n&&(t.extend(e,n),n.bounds&&(e.tileBounds=new F(n.bounds,e.minzoom,e.maxzoom)),e.fire(new t.Event("data",{dataType:"source",sourceDataType:"metadata"})),e.fire(new t.Event("data",{dataType:"source",sourceDataType:"content"})));});},i.prototype.hasTile=function(t){return!this.tileBounds||this.tileBounds.contains(t.canonical)},i.prototype.onAdd=function(t){this.map=t,this.load();},i.prototype.onRemove=function(){this._tileJSONRequest&&(this._tileJSONRequest.cancel(),this._tileJSONRequest=null);},i.prototype.serialize=function(){return t.extend({},this._options)},i.prototype.loadTile=function(e,i){var n=y(e.tileID.canonical.url(this.tiles,this.scheme),this.url),o={request:this.map._transformRequest(n,t.ResourceType.Tile),uid:e.uid,tileID:e.tileID,zoom:e.tileID.overscaledZ,tileSize:this.tileSize*e.tileID.overscaleFactor(),type:this.type,source:this.id,pixelRatio:t.default$2.devicePixelRatio,showCollisionBoxes:this.map.showCollisionBoxes};function r(t,n){return e.aborted?i(null):t?i(t):(n&&n.resourceTiming&&(e.resourceTiming=n.resourceTiming),this.map._refreshExpiredTiles&&e.setExpiryData(n),e.loadVectorData(n,this.map.painter),i(null),void(e.reloadCallback&&(this.loadTile(e,e.reloadCallback),e.reloadCallback=null)))}o.request.collectResourceTiming=this._collectResourceTiming,void 0===e.workerID||"expired"===e.state?e.workerID=this.dispatcher.send("loadTile",o,r.bind(this)):"loading"===e.state?e.reloadCallback=i:this.dispatcher.send("reloadTile",o,r.bind(this),e.workerID);},i.prototype.abortTile=function(t){this.dispatcher.send("abortTile",{uid:t.uid,type:this.type,source:this.id},void 0,t.workerID);},i.prototype.unloadTile=function(t){t.unloadVectorData(),this.dispatcher.send("removeTile",{uid:t.uid,type:this.type,source:this.id},void 0,t.workerID);},i.prototype.hasTransition=function(){return!1},i}(t.Evented),$=function(e){function i(i,n,o,r){e.call(this),this.id=i,this.dispatcher=o,this.setEventedParent(r),this.type="raster",this.minzoom=0,this.maxzoom=22,this.roundZoom=!0,this.scheme="xyz",this.tileSize=512,this._loaded=!1,this._options=t.extend({},n),t.extend(this,t.pick(n,["url","scheme","tileSize"]));}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.load=function(){var e=this;this.fire(new t.Event("dataloading",{dataType:"source"})),this._tileJSONRequest=k(this._options,this.map._transformRequest,function(i,n){e._tileJSONRequest=null,i?e.fire(new t.ErrorEvent(i)):n&&(t.extend(e,n),n.bounds&&(e.tileBounds=new F(n.bounds,e.minzoom,e.maxzoom)),e.fire(new t.Event("data",{dataType:"source",sourceDataType:"metadata"})),e.fire(new t.Event("data",{dataType:"source",sourceDataType:"content"})));});},i.prototype.onAdd=function(t){this.map=t,this.load();},i.prototype.onRemove=function(){this._tileJSONRequest&&(this._tileJSONRequest.cancel(),this._tileJSONRequest=null);},i.prototype.serialize=function(){return t.extend({},this._options)},i.prototype.hasTile=function(t){return!this.tileBounds||this.tileBounds.contains(t.canonical)},i.prototype.loadTile=function(e,i){var n=this,o=y(e.tileID.canonical.url(this.tiles,this.scheme),this.url,this.tileSize);e.request=t.getImage(this.map._transformRequest(o,t.ResourceType.Tile),function(o,r){if(delete e.request,e.aborted)e.state="unloaded",i(null);else if(o)e.state="errored",i(o);else if(r){n.map._refreshExpiredTiles&&e.setExpiryData(r),delete r.cacheControl,delete r.expires;var a=n.map.painter.context,s=a.gl;e.texture=n.map.painter.getTileTexture(r.width),e.texture?e.texture.update(r,{useMipmap:!0}):(e.texture=new t.default$4(a,r,s.RGBA,{useMipmap:!0}),e.texture.bind(s.LINEAR,s.CLAMP_TO_EDGE,s.LINEAR_MIPMAP_NEAREST),a.extTextureFilterAnisotropic&&s.texParameterf(s.TEXTURE_2D,a.extTextureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT,a.extTextureFilterAnisotropicMax)),e.state="loaded",i(null);}});},i.prototype.abortTile=function(t,e){t.request&&(t.request.cancel(),delete t.request),e();},i.prototype.unloadTile=function(t,e){t.texture&&this.map.painter.saveTileTexture(t.texture),e();},i.prototype.hasTransition=function(){return!1},i}(t.Evented),U=function(e){function i(i,n,o,r){e.call(this,i,n,o,r),this.type="raster-dem",this.maxzoom=22,this._options=t.extend({},n),this.encoding=n.encoding||"mapbox";}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.serialize=function(){return{type:"raster-dem",url:this.url,tileSize:this.tileSize,tiles:this.tiles,bounds:this.bounds,encoding:this.encoding}},i.prototype.loadTile=function(e,i){var n=y(e.tileID.canonical.url(this.tiles,this.scheme),this.url,this.tileSize);e.request=t.getImage(this.map._transformRequest(n,t.ResourceType.Tile),function(n,o){if(delete e.request,e.aborted)e.state="unloaded",i(null);else if(n)e.state="errored",i(n);else if(o){this.map._refreshExpiredTiles&&e.setExpiryData(o),delete o.cacheControl,delete o.expires;var r=t.default$2.getImageData(o),a={uid:e.uid,coord:e.tileID,source:this.id,rawImageData:r,encoding:this.encoding};e.workerID&&"expired"!==e.state||(e.workerID=this.dispatcher.send("loadDEMTile",a,function(t,n){t&&(e.state="errored",i(t));n&&(e.dem=n,e.needsHillshadePrepare=!0,e.state="loaded",i(null));}.bind(this)));}}.bind(this)),e.neighboringTiles=this._getNeighboringTiles(e.tileID);},i.prototype._getNeighboringTiles=function(e){var i=e.canonical,n=Math.pow(2,i.z),o=(i.x-1+n)%n,r=0===i.x?e.wrap-1:e.wrap,a=(i.x+1+n)%n,s=i.x+1===n?e.wrap+1:e.wrap,l={};return l[new t.OverscaledTileID(e.overscaledZ,r,i.z,o,i.y).key]={backfilled:!1},l[new t.OverscaledTileID(e.overscaledZ,s,i.z,a,i.y).key]={backfilled:!1},i.y>0&&(l[new t.OverscaledTileID(e.overscaledZ,r,i.z,o,i.y-1).key]={backfilled:!1},l[new t.OverscaledTileID(e.overscaledZ,e.wrap,i.z,i.x,i.y-1).key]={backfilled:!1},l[new t.OverscaledTileID(e.overscaledZ,s,i.z,a,i.y-1).key]={backfilled:!1}),i.y+1<n&&(l[new t.OverscaledTileID(e.overscaledZ,r,i.z,o,i.y+1).key]={backfilled:!1},l[new t.OverscaledTileID(e.overscaledZ,e.wrap,i.z,i.x,i.y+1).key]={backfilled:!1},l[new t.OverscaledTileID(e.overscaledZ,s,i.z,a,i.y+1).key]={backfilled:!1}),l},i.prototype.unloadTile=function(t){t.demTexture&&this.map.painter.saveTileTexture(t.demTexture),t.fbo&&(t.fbo.destroy(),delete t.fbo),t.dem&&delete t.dem,delete t.neighboringTiles,t.state="unloaded",this.dispatcher.send("removeDEMTile",{uid:t.uid,source:this.id},void 0,t.workerID);},i}($),Z=function(e){function i(i,n,o,r){e.call(this),this.id=i,this.type="geojson",this.minzoom=0,this.maxzoom=18,this.tileSize=512,this.isTileClipped=!0,this.reparseOverscaled=!0,this._removed=!1,this.dispatcher=o,this.setEventedParent(r),this._data=n.data,this._options=t.extend({},n),this._collectResourceTiming=n.collectResourceTiming,this._resourceTiming=[],void 0!==n.maxzoom&&(this.maxzoom=n.maxzoom),n.type&&(this.type=n.type),n.attribution&&(this.attribution=n.attribution);var a=t.default$10/this.tileSize;this.workerOptions=t.extend({source:this.id,cluster:n.cluster||!1,geojsonVtOptions:{buffer:(void 0!==n.buffer?n.buffer:128)*a,tolerance:(void 0!==n.tolerance?n.tolerance:.375)*a,extent:t.default$10,maxZoom:this.maxzoom,lineMetrics:n.lineMetrics||!1},superclusterOptions:{maxZoom:void 0!==n.clusterMaxZoom?Math.min(n.clusterMaxZoom,this.maxzoom-1):this.maxzoom-1,extent:t.default$10,radius:(n.clusterRadius||50)*a,log:!1}},n.workerOptions);}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.load=function(){var e=this;this.fire(new t.Event("dataloading",{dataType:"source"})),this._updateWorkerData(function(i){if(i)e.fire(new t.ErrorEvent(i));else{var n={dataType:"source",sourceDataType:"metadata"};e._collectResourceTiming&&e._resourceTiming&&e._resourceTiming.length>0&&(n.resourceTiming=e._resourceTiming,e._resourceTiming=[]),e.fire(new t.Event("data",n));}});},i.prototype.onAdd=function(t){this.map=t,this.load();},i.prototype.setData=function(e){var i=this;return this._data=e,this.fire(new t.Event("dataloading",{dataType:"source"})),this._updateWorkerData(function(e){if(e)i.fire(new t.ErrorEvent(e));else{var n={dataType:"source",sourceDataType:"content"};i._collectResourceTiming&&i._resourceTiming&&i._resourceTiming.length>0&&(n.resourceTiming=i._resourceTiming,i._resourceTiming=[]),i.fire(new t.Event("data",n));}}),this},i.prototype.getClusterExpansionZoom=function(t,e){return this.dispatcher.send("geojson.getClusterExpansionZoom",{clusterId:t,source:this.id},e,this.workerID),this},i.prototype.getClusterChildren=function(t,e){return this.dispatcher.send("geojson.getClusterChildren",{clusterId:t,source:this.id},e,this.workerID),this},i.prototype.getClusterLeaves=function(t,e,i,n){return this.dispatcher.send("geojson.getClusterLeaves",{source:this.id,clusterId:t,limit:e,offset:i},n,this.workerID),this},i.prototype._updateWorkerData=function(e){var i=this,n=t.extend({},this.workerOptions),o=this._data;"string"==typeof o?(n.request=this.map._transformRequest(t.default$2.resolveURL(o),t.ResourceType.Source),n.request.collectResourceTiming=this._collectResourceTiming):n.data=JSON.stringify(o),this.workerID=this.dispatcher.send(this.type+".loadData",n,function(t,o){i._removed||o&&o.abandoned||(i._loaded=!0,o&&o.resourceTiming&&o.resourceTiming[i.id]&&(i._resourceTiming=o.resourceTiming[i.id].slice(0)),i.dispatcher.send(i.type+".coalesce",{source:n.source},null,i.workerID),e(t));},this.workerID);},i.prototype.loadTile=function(e,i){var n=this,o=void 0===e.workerID?"loadTile":"reloadTile",r={type:this.type,uid:e.uid,tileID:e.tileID,zoom:e.tileID.overscaledZ,maxZoom:this.maxzoom,tileSize:this.tileSize,source:this.id,pixelRatio:t.default$2.devicePixelRatio,showCollisionBoxes:this.map.showCollisionBoxes};e.workerID=this.dispatcher.send(o,r,function(t,r){return e.unloadVectorData(),e.aborted?i(null):t?i(t):(e.loadVectorData(r,n.map.painter,"reloadTile"===o),i(null))},this.workerID);},i.prototype.abortTile=function(t){t.aborted=!0;},i.prototype.unloadTile=function(t){t.unloadVectorData(),this.dispatcher.send("removeTile",{uid:t.uid,type:this.type,source:this.id},null,t.workerID);},i.prototype.onRemove=function(){this._removed=!0,this.dispatcher.send("removeSource",{type:this.type,source:this.id},null,this.workerID);},i.prototype.serialize=function(){return t.extend({},this._options,{type:this.type,data:this._data})},i.prototype.hasTransition=function(){return!1},i}(t.Evented),V=function(){this.boundProgram=null,this.boundLayoutVertexBuffer=null,this.boundPaintVertexBuffers=[],this.boundIndexBuffer=null,this.boundVertexOffset=null,this.boundDynamicVertexBuffer=null,this.vao=null;};V.prototype.bind=function(t,e,i,n,o,r,a,s){this.context=t;for(var l=this.boundPaintVertexBuffers.length!==n.length,c=0;!l&&c<n.length;c++)this.boundPaintVertexBuffers[c]!==n[c]&&(l=!0);var u=!this.vao||this.boundProgram!==e||this.boundLayoutVertexBuffer!==i||l||this.boundIndexBuffer!==o||this.boundVertexOffset!==r||this.boundDynamicVertexBuffer!==a||this.boundDynamicVertexBuffer2!==s;!t.extVertexArrayObject||u?this.freshBind(e,i,n,o,r,a,s):(t.bindVertexArrayOES.set(this.vao),a&&a.bind(),o&&o.dynamicDraw&&o.bind(),s&&s.bind());},V.prototype.freshBind=function(t,e,i,n,o,r,a){var s,l=t.numAttributes,c=this.context,u=c.gl;if(c.extVertexArrayObject)this.vao&&this.destroy(),this.vao=c.extVertexArrayObject.createVertexArrayOES(),c.bindVertexArrayOES.set(this.vao),s=0,this.boundProgram=t,this.boundLayoutVertexBuffer=e,this.boundPaintVertexBuffers=i,this.boundIndexBuffer=n,this.boundVertexOffset=o,this.boundDynamicVertexBuffer=r,this.boundDynamicVertexBuffer2=a;else{s=c.currentNumAttributes||0;for(var h=l;h<s;h++)u.disableVertexAttribArray(h);}e.enableAttributes(u,t);for(var p=0,d=i;p<d.length;p+=1){d[p].enableAttributes(u,t);}r&&r.enableAttributes(u,t),a&&a.enableAttributes(u,t),e.bind(),e.setVertexAttribPointers(u,t,o);for(var f=0,m=i;f<m.length;f+=1){var _=m[f];_.bind(),_.setVertexAttribPointers(u,t,o);}r&&(r.bind(),r.setVertexAttribPointers(u,t,o)),n&&n.bind(),a&&(a.bind(),a.setVertexAttribPointers(u,t,o)),c.currentNumAttributes=l;},V.prototype.destroy=function(){this.vao&&(this.context.extVertexArrayObject.deleteVertexArrayOES(this.vao),this.vao=null);};var j=function(e){function i(t,i,n,o){e.call(this),this.id=t,this.dispatcher=n,this.coordinates=i.coordinates,this.type="image",this.minzoom=0,this.maxzoom=22,this.tileSize=512,this.tiles={},this.setEventedParent(o),this.options=i;}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.load=function(){var e=this;this.fire(new t.Event("dataloading",{dataType:"source"})),this.url=this.options.url,t.getImage(this.map._transformRequest(this.url,t.ResourceType.Image),function(i,n){i?e.fire(new t.ErrorEvent(i)):n&&(e.image=t.default$2.getImageData(n),e._finishLoading());});},i.prototype._finishLoading=function(){this.map&&(this.setCoordinates(this.coordinates),this.fire(new t.Event("data",{dataType:"source",sourceDataType:"metadata"})));},i.prototype.onAdd=function(t){this.map=t,this.load();},i.prototype.setCoordinates=function(e){this.coordinates=e;var i=this.map,n=e.map(function(t){return i.transform.locationCoordinate(B.convert(t)).zoomTo(0)}),o=this.centerCoord=t.getCoordinatesCenter(n);o.column=Math.floor(o.column),o.row=Math.floor(o.row),this.tileID=new t.CanonicalTileID(o.zoom,o.column,o.row),this.minzoom=this.maxzoom=o.zoom;var r=n.map(function(e){var i=e.zoomTo(o.zoom);return new t.default(Math.round((i.column-o.column)*t.default$10),Math.round((i.row-o.row)*t.default$10))});return this._boundsArray=new t.RasterBoundsArray,this._boundsArray.emplaceBack(r[0].x,r[0].y,0,0),this._boundsArray.emplaceBack(r[1].x,r[1].y,t.default$10,0),this._boundsArray.emplaceBack(r[3].x,r[3].y,0,t.default$10),this._boundsArray.emplaceBack(r[2].x,r[2].y,t.default$10,t.default$10),this.boundsBuffer&&(this.boundsBuffer.destroy(),delete this.boundsBuffer),this.fire(new t.Event("data",{dataType:"source",sourceDataType:"content"})),this},i.prototype.prepare=function(){if(0!==Object.keys(this.tiles).length&&this.image){var e=this.map.painter.context,i=e.gl;for(var n in this.boundsBuffer||(this.boundsBuffer=e.createVertexBuffer(this._boundsArray,t.default$11.members)),this.boundsVAO||(this.boundsVAO=new V),this.texture||(this.texture=new t.default$4(e,this.image,i.RGBA),this.texture.bind(i.LINEAR,i.CLAMP_TO_EDGE)),this.tiles){var o=this.tiles[n];"loaded"!==o.state&&(o.state="loaded",o.texture=this.texture);}}},i.prototype.loadTile=function(t,e){this.tileID&&this.tileID.equals(t.tileID.canonical)?(this.tiles[String(t.tileID.wrap)]=t,t.buckets={},e(null)):(t.state="errored",e(null));},i.prototype.serialize=function(){return{type:"image",url:this.options.url,coordinates:this.coordinates}},i.prototype.hasTransition=function(){return!1},i}(t.Evented),G=function(e){function i(t,i,n,o){e.call(this,t,i,n,o),this.roundZoom=!0,this.type="video",this.options=i;}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.load=function(){var e=this,i=this.options;this.urls=[];for(var n=0,o=i.urls;n<o.length;n+=1){var r=o[n];e.urls.push(e.map._transformRequest(r,t.ResourceType.Source).url);}t.getVideo(this.urls,function(i,n){i?e.fire(new t.ErrorEvent(i)):n&&(e.video=n,e.video.loop=!0,e.video.addEventListener("playing",function(){e.map._rerender();}),e.map&&e.video.play(),e._finishLoading());});},i.prototype.getVideo=function(){return this.video},i.prototype.onAdd=function(t){this.map||(this.map=t,this.load(),this.video&&(this.video.play(),this.setCoordinates(this.coordinates)));},i.prototype.prepare=function(){if(!(0===Object.keys(this.tiles).length||this.video.readyState<2)){var e=this.map.painter.context,i=e.gl;for(var n in this.boundsBuffer||(this.boundsBuffer=e.createVertexBuffer(this._boundsArray,t.default$11.members)),this.boundsVAO||(this.boundsVAO=new V),this.texture?this.video.paused||(this.texture.bind(i.LINEAR,i.CLAMP_TO_EDGE),i.texSubImage2D(i.TEXTURE_2D,0,0,0,i.RGBA,i.UNSIGNED_BYTE,this.video)):(this.texture=new t.default$4(e,this.video,i.RGBA),this.texture.bind(i.LINEAR,i.CLAMP_TO_EDGE)),this.tiles){var o=this.tiles[n];"loaded"!==o.state&&(o.state="loaded",o.texture=this.texture);}}},i.prototype.serialize=function(){return{type:"video",urls:this.urls,coordinates:this.coordinates}},i.prototype.hasTransition=function(){return this.video&&!this.video.paused},i}(j),W=function(e){function i(i,n,o,r){e.call(this,i,n,o,r),n.coordinates?Array.isArray(n.coordinates)&&4===n.coordinates.length&&!n.coordinates.some(function(t){return!Array.isArray(t)||2!==t.length||t.some(function(t){return"number"!=typeof t})})||this.fire(new t.ErrorEvent(new t.default$12("sources."+i,null,'"coordinates" property must be an array of 4 longitude/latitude array pairs'))):this.fire(new t.ErrorEvent(new t.default$12("sources."+i,null,'missing required property "coordinates"'))),n.animate&&"boolean"!=typeof n.animate&&this.fire(new t.ErrorEvent(new t.default$12("sources."+i,null,'optional "animate" property must be a boolean value'))),n.canvas?"string"==typeof n.canvas||n.canvas instanceof t.default$1.HTMLCanvasElement||this.fire(new t.ErrorEvent(new t.default$12("sources."+i,null,'"canvas" must be either a string representing the ID of the canvas element from which to read, or an HTMLCanvasElement instance'))):this.fire(new t.ErrorEvent(new t.default$12("sources."+i,null,'missing required property "canvas"'))),this.options=n,this.animate=void 0===n.animate||n.animate;}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.load=function(){this.canvas||(this.canvas=this.options.canvas instanceof t.default$1.HTMLCanvasElement?this.options.canvas:t.default$1.document.getElementById(this.options.canvas)),this.width=this.canvas.width,this.height=this.canvas.height,this._hasInvalidDimensions()?this.fire(new t.ErrorEvent(new Error("Canvas dimensions cannot be less than or equal to zero."))):(this.play=function(){this._playing=!0,this.map._rerender();},this.pause=function(){this._playing=!1;},this._finishLoading());},i.prototype.getCanvas=function(){return this.canvas},i.prototype.onAdd=function(t){this.map=t,this.load(),this.canvas&&this.animate&&this.play();},i.prototype.onRemove=function(){this.pause();},i.prototype.prepare=function(){var e=!1;if(this.canvas.width!==this.width&&(this.width=this.canvas.width,e=!0),this.canvas.height!==this.height&&(this.height=this.canvas.height,e=!0),!this._hasInvalidDimensions()&&0!==Object.keys(this.tiles).length){var i=this.map.painter.context,n=i.gl;for(var o in this.boundsBuffer||(this.boundsBuffer=i.createVertexBuffer(this._boundsArray,t.default$11.members)),this.boundsVAO||(this.boundsVAO=new V),this.texture?e?this.texture.update(this.canvas):this._playing&&(this.texture.bind(n.LINEAR,n.CLAMP_TO_EDGE),n.texSubImage2D(n.TEXTURE_2D,0,0,0,n.RGBA,n.UNSIGNED_BYTE,this.canvas)):(this.texture=new t.default$4(i,this.canvas,n.RGBA),this.texture.bind(n.LINEAR,n.CLAMP_TO_EDGE)),this.tiles){var r=this.tiles[o];"loaded"!==r.state&&(r.state="loaded",r.texture=this.texture);}}},i.prototype.serialize=function(){return{type:"canvas",coordinates:this.coordinates}},i.prototype.hasTransition=function(){return this._playing},i.prototype._hasInvalidDimensions=function(){for(var t=0,e=[this.canvas.width,this.canvas.height];t<e.length;t+=1){var i=e[t];if(isNaN(i)||i<=0)return!0}return!1},i}(j),q={vector:N,raster:$,"raster-dem":U,geojson:Z,video:G,image:j,canvas:W},X=function(e,i,n,o){var r=new q[i.type](e,i,n,o);if(r.id!==e)throw new Error("Expected Source id to be "+e+" instead of "+r.id);return t.bindAll(["load","abort","unload","serialize","prepare"],r),r};function H(t,e,i,n,o){var r=o.maxPitchScaleFactor(),a=t.tilesIn(i,r);a.sort(K);for(var s=[],l=0,c=a;l<c.length;l+=1){var u=c[l];s.push({wrappedTileID:u.tileID.wrapped().key,queryResults:u.tile.queryRenderedFeatures(e,t._state,u.queryGeometry,u.scale,n,o,r,t.transform.calculatePosMatrix(u.tileID.toUnwrapped()))});}var h=function(t){for(var e={},i={},n=0,o=t;n<o.length;n+=1){var r=o[n],a=r.queryResults,s=r.wrappedTileID,l=i[s]=i[s]||{};for(var c in a)for(var u=a[c],h=l[c]=l[c]||{},p=e[c]=e[c]||[],d=0,f=u;d<f.length;d+=1){var m=f[d];h[m.featureIndex]||(h[m.featureIndex]=!0,p.push(m.feature));}}return e}(s);for(var p in h)h[p].forEach(function(e){var i=t.getFeatureState(e.layer["source-layer"],e.id);e.source=e.layer.source,e.layer["source-layer"]&&(e.sourceLayer=e.layer["source-layer"]),e.state=i;});return h}function K(t,e){var i=t.tileID,n=e.tileID;return i.overscaledZ-n.overscaledZ||i.canonical.y-n.canonical.y||i.wrap-n.wrap||i.canonical.x-n.canonical.x}var Y=function(t,e){this.max=t,this.onRemove=e,this.reset();};Y.prototype.reset=function(){for(var t in this.data)for(var e=0,i=this.data[t];e<i.length;e+=1){var n=i[e];n.timeout&&clearTimeout(n.timeout),this.onRemove(n.value);}return this.data={},this.order=[],this},Y.prototype.add=function(t,e,i){var n=this,o=t.wrapped().key;void 0===this.data[o]&&(this.data[o]=[]);var r={value:e,timeout:void 0};if(void 0!==i&&(r.timeout=setTimeout(function(){n.remove(t,r);},i)),this.data[o].push(r),this.order.push(o),this.order.length>this.max){var a=this._getAndRemoveByKey(this.order[0]);a&&this.onRemove(a);}return this},Y.prototype.has=function(t){return t.wrapped().key in this.data},Y.prototype.getAndRemove=function(t){return this.has(t)?this._getAndRemoveByKey(t.wrapped().key):null},Y.prototype._getAndRemoveByKey=function(t){var e=this.data[t].shift();return e.timeout&&clearTimeout(e.timeout),0===this.data[t].length&&delete this.data[t],this.order.splice(this.order.indexOf(t),1),e.value},Y.prototype.get=function(t){return this.has(t)?this.data[t.wrapped().key][0].value:null},Y.prototype.remove=function(t,e){if(!this.has(t))return this;var i=t.wrapped().key,n=void 0===e?0:this.data[i].indexOf(e),o=this.data[i][n];return this.data[i].splice(n,1),o.timeout&&clearTimeout(o.timeout),0===this.data[i].length&&delete this.data[i],this.onRemove(o.value),this.order.splice(this.order.indexOf(i),1),this},Y.prototype.setMaxSize=function(t){for(this.max=t;this.order.length>this.max;){var e=this._getAndRemoveByKey(this.order[0]);e&&this.onRemove(e);}return this};var J=function(t,e,i){this.context=t;var n=t.gl;this.buffer=n.createBuffer(),this.dynamicDraw=Boolean(i),this.unbindVAO(),t.bindElementBuffer.set(this.buffer),n.bufferData(n.ELEMENT_ARRAY_BUFFER,e.arrayBuffer,this.dynamicDraw?n.DYNAMIC_DRAW:n.STATIC_DRAW),this.dynamicDraw||delete e.arrayBuffer;};J.prototype.unbindVAO=function(){this.context.extVertexArrayObject&&this.context.bindVertexArrayOES.set(null);},J.prototype.bind=function(){this.context.bindElementBuffer.set(this.buffer);},J.prototype.updateData=function(t){var e=this.context.gl;this.unbindVAO(),this.bind(),e.bufferSubData(e.ELEMENT_ARRAY_BUFFER,0,t.arrayBuffer);},J.prototype.destroy=function(){var t=this.context.gl;this.buffer&&(t.deleteBuffer(this.buffer),delete this.buffer);};var Q={Int8:"BYTE",Uint8:"UNSIGNED_BYTE",Int16:"SHORT",Uint16:"UNSIGNED_SHORT",Int32:"INT",Uint32:"UNSIGNED_INT",Float32:"FLOAT"},tt=function(t,e,i,n){this.length=e.length,this.attributes=i,this.itemSize=e.bytesPerElement,this.dynamicDraw=n,this.context=t;var o=t.gl;this.buffer=o.createBuffer(),t.bindVertexBuffer.set(this.buffer),o.bufferData(o.ARRAY_BUFFER,e.arrayBuffer,this.dynamicDraw?o.DYNAMIC_DRAW:o.STATIC_DRAW),this.dynamicDraw||delete e.arrayBuffer;};tt.prototype.bind=function(){this.context.bindVertexBuffer.set(this.buffer);},tt.prototype.updateData=function(t){var e=this.context.gl;this.bind(),e.bufferSubData(e.ARRAY_BUFFER,0,t.arrayBuffer);},tt.prototype.enableAttributes=function(t,e){for(var i=0;i<this.attributes.length;i++){var n=this.attributes[i],o=e.attributes[n.name];void 0!==o&&t.enableVertexAttribArray(o);}},tt.prototype.setVertexAttribPointers=function(t,e,i){for(var n=0;n<this.attributes.length;n++){var o=this.attributes[n],r=e.attributes[o.name];void 0!==r&&t.vertexAttribPointer(r,o.components,t[Q[o.type]],!1,this.itemSize,o.offset+this.itemSize*(i||0));}},tt.prototype.destroy=function(){var t=this.context.gl;this.buffer&&(t.deleteBuffer(this.buffer),delete this.buffer);};var et=function(e){this.context=e,this.current=t.default$8.transparent;};et.prototype.get=function(){return this.current},et.prototype.set=function(t){var e=this.current;t.r===e.r&&t.g===e.g&&t.b===e.b&&t.a===e.a||(this.context.gl.clearColor(t.r,t.g,t.b,t.a),this.current=t);};var it=function(t){this.context=t,this.current=1;};it.prototype.get=function(){return this.current},it.prototype.set=function(t){this.current!==t&&(this.context.gl.clearDepth(t),this.current=t);};var nt=function(t){this.context=t,this.current=0;};nt.prototype.get=function(){return this.current},nt.prototype.set=function(t){this.current!==t&&(this.context.gl.clearStencil(t),this.current=t);};var ot=function(t){this.context=t,this.current=[!0,!0,!0,!0];};ot.prototype.get=function(){return this.current},ot.prototype.set=function(t){var e=this.current;t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]||(this.context.gl.colorMask(t[0],t[1],t[2],t[3]),this.current=t);};var rt=function(t){this.context=t,this.current=!0;};rt.prototype.get=function(){return this.current},rt.prototype.set=function(t){this.current!==t&&(this.context.gl.depthMask(t),this.current=t);};var at=function(t){this.context=t,this.current=255;};at.prototype.get=function(){return this.current},at.prototype.set=function(t){this.current!==t&&(this.context.gl.stencilMask(t),this.current=t);};var st=function(t){this.context=t,this.current={func:t.gl.ALWAYS,ref:0,mask:255};};st.prototype.get=function(){return this.current},st.prototype.set=function(t){var e=this.current;t.func===e.func&&t.ref===e.ref&&t.mask===e.mask||(this.context.gl.stencilFunc(t.func,t.ref,t.mask),this.current=t);};var lt=function(t){this.context=t;var e=this.context.gl;this.current=[e.KEEP,e.KEEP,e.KEEP];};lt.prototype.get=function(){return this.current},lt.prototype.set=function(t){var e=this.current;t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]||(this.context.gl.stencilOp(t[0],t[1],t[2]),this.current=t);};var ct=function(t){this.context=t,this.current=!1;};ct.prototype.get=function(){return this.current},ct.prototype.set=function(t){if(this.current!==t){var e=this.context.gl;t?e.enable(e.STENCIL_TEST):e.disable(e.STENCIL_TEST),this.current=t;}};var ut=function(t){this.context=t,this.current=[0,1];};ut.prototype.get=function(){return this.current},ut.prototype.set=function(t){var e=this.current;t[0]===e[0]&&t[1]===e[1]||(this.context.gl.depthRange(t[0],t[1]),this.current=t);};var ht=function(t){this.context=t,this.current=!1;};ht.prototype.get=function(){return this.current},ht.prototype.set=function(t){if(this.current!==t){var e=this.context.gl;t?e.enable(e.DEPTH_TEST):e.disable(e.DEPTH_TEST),this.current=t;}};var pt=function(t){this.context=t,this.current=t.gl.LESS;};pt.prototype.get=function(){return this.current},pt.prototype.set=function(t){this.current!==t&&(this.context.gl.depthFunc(t),this.current=t);};var dt=function(t){this.context=t,this.current=!1;};dt.prototype.get=function(){return this.current},dt.prototype.set=function(t){if(this.current!==t){var e=this.context.gl;t?e.enable(e.BLEND):e.disable(e.BLEND),this.current=t;}};var ft=function(t){this.context=t;var e=this.context.gl;this.current=[e.ONE,e.ZERO];};ft.prototype.get=function(){return this.current},ft.prototype.set=function(t){var e=this.current;t[0]===e[0]&&t[1]===e[1]||(this.context.gl.blendFunc(t[0],t[1]),this.current=t);};var mt=function(e){this.context=e,this.current=t.default$8.transparent;};mt.prototype.get=function(){return this.current},mt.prototype.set=function(t){var e=this.current;t.r===e.r&&t.g===e.g&&t.b===e.b&&t.a===e.a||(this.context.gl.blendColor(t.r,t.g,t.b,t.a),this.current=t);};var _t=function(t){this.context=t,this.current=null;};_t.prototype.get=function(){return this.current},_t.prototype.set=function(t){this.current!==t&&(this.context.gl.useProgram(t),this.current=t);};var gt=function(t){this.context=t,this.current=t.gl.TEXTURE0;};gt.prototype.get=function(){return this.current},gt.prototype.set=function(t){this.current!==t&&(this.context.gl.activeTexture(t),this.current=t);};var vt=function(t){this.context=t;var e=this.context.gl;this.current=[0,0,e.drawingBufferWidth,e.drawingBufferHeight];};vt.prototype.get=function(){return this.current},vt.prototype.set=function(t){var e=this.current;t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]||(this.context.gl.viewport(t[0],t[1],t[2],t[3]),this.current=t);};var yt=function(t){this.context=t,this.current=null;};yt.prototype.get=function(){return this.current},yt.prototype.set=function(t){if(this.current!==t){var e=this.context.gl;e.bindFramebuffer(e.FRAMEBUFFER,t),this.current=t;}};var xt=function(t){this.context=t,this.current=null;};xt.prototype.get=function(){return this.current},xt.prototype.set=function(t){if(this.current!==t){var e=this.context.gl;e.bindRenderbuffer(e.RENDERBUFFER,t),this.current=t;}};var bt=function(t){this.context=t,this.current=null;};bt.prototype.get=function(){return this.current},bt.prototype.set=function(t){if(this.current!==t){var e=this.context.gl;e.bindTexture(e.TEXTURE_2D,t),this.current=t;}};var wt=function(t){this.context=t,this.current=null;};wt.prototype.get=function(){return this.current},wt.prototype.set=function(t){if(this.current!==t){var e=this.context.gl;e.bindBuffer(e.ARRAY_BUFFER,t),this.current=t;}};var Et=function(t){this.context=t,this.current=null;};Et.prototype.get=function(){return this.current},Et.prototype.set=function(t){var e=this.context.gl;e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t),this.current=t;};var Tt=function(t){this.context=t,this.current=null;};Tt.prototype.get=function(){return this.current},Tt.prototype.set=function(t){this.current!==t&&this.context.extVertexArrayObject&&(this.context.extVertexArrayObject.bindVertexArrayOES(t),this.current=t);};var It=function(t){this.context=t,this.current=4;};It.prototype.get=function(){return this.current},It.prototype.set=function(t){if(this.current!==t){var e=this.context.gl;e.pixelStorei(e.UNPACK_ALIGNMENT,t),this.current=t;}};var Ct=function(t){this.context=t,this.current=!1;};Ct.prototype.get=function(){return this.current},Ct.prototype.set=function(t){if(this.current!==t){var e=this.context.gl;e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t),this.current=t;}};var St=function(t,e){this.context=t,this.current=null,this.parent=e;};St.prototype.get=function(){return this.current};var zt=function(t){function e(e,i){t.call(this,e,i),this.dirty=!1;}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.set=function(t){if(this.dirty||this.current!==t){var e=this.context.gl;this.context.bindFramebuffer.set(this.parent),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0),this.current=t,this.dirty=!1;}},e.prototype.setDirty=function(){this.dirty=!0;},e}(St),At=function(t){function e(){t.apply(this,arguments);}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.set=function(t){if(this.current!==t){var e=this.context.gl;this.context.bindFramebuffer.set(this.parent),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,t),this.current=t;}},e}(St),Mt=function(t,e,i){this.context=t,this.width=e,this.height=i;var n=t.gl,o=this.framebuffer=n.createFramebuffer();this.colorAttachment=new zt(t,o),this.depthAttachment=new At(t,o);};Mt.prototype.destroy=function(){var t=this.context.gl,e=this.colorAttachment.get();e&&t.deleteTexture(e);var i=this.depthAttachment.get();i&&t.deleteRenderbuffer(i),t.deleteFramebuffer(this.framebuffer);};var Rt=function(t,e,i){this.func=t,this.mask=e,this.range=i;};Rt.ReadOnly=!1,Rt.ReadWrite=!0,Rt.disabled=new Rt(519,Rt.ReadOnly,[0,1]);var Dt=function(t,e,i,n,o,r){this.test=t,this.ref=e,this.mask=i,this.fail=n,this.depthFail=o,this.pass=r;};Dt.disabled=new Dt({func:519,mask:0},0,0,7680,7680,7680);var Lt=function(t,e,i){this.blendFunction=t,this.blendColor=e,this.mask=i;};Lt.Replace=[1,0],Lt.disabled=new Lt(Lt.Replace,t.default$8.transparent,[!1,!1,!1,!1]),Lt.unblended=new Lt(Lt.Replace,t.default$8.transparent,[!0,!0,!0,!0]),Lt.alphaBlended=new Lt([1,771],t.default$8.transparent,[!0,!0,!0,!0]);var Pt=function(t){this.gl=t,this.extVertexArrayObject=this.gl.getExtension("OES_vertex_array_object"),this.clearColor=new et(this),this.clearDepth=new it(this),this.clearStencil=new nt(this),this.colorMask=new ot(this),this.depthMask=new rt(this),this.stencilMask=new at(this),this.stencilFunc=new st(this),this.stencilOp=new lt(this),this.stencilTest=new ct(this),this.depthRange=new ut(this),this.depthTest=new ht(this),this.depthFunc=new pt(this),this.blend=new dt(this),this.blendFunc=new ft(this),this.blendColor=new mt(this),this.program=new _t(this),this.activeTexture=new gt(this),this.viewport=new vt(this),this.bindFramebuffer=new yt(this),this.bindRenderbuffer=new xt(this),this.bindTexture=new bt(this),this.bindVertexBuffer=new wt(this),this.bindElementBuffer=new Et(this),this.bindVertexArrayOES=this.extVertexArrayObject&&new Tt(this),this.pixelStoreUnpack=new It(this),this.pixelStoreUnpackPremultiplyAlpha=new Ct(this),this.extTextureFilterAnisotropic=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic"),this.extTextureFilterAnisotropic&&(this.extTextureFilterAnisotropicMax=t.getParameter(this.extTextureFilterAnisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT)),this.extTextureHalfFloat=t.getExtension("OES_texture_half_float"),this.extTextureHalfFloat&&t.getExtension("OES_texture_half_float_linear");};Pt.prototype.createIndexBuffer=function(t,e){return new J(this,t,e)},Pt.prototype.createVertexBuffer=function(t,e,i){return new tt(this,t,e,i)},Pt.prototype.createRenderbuffer=function(t,e,i){var n=this.gl,o=n.createRenderbuffer();return this.bindRenderbuffer.set(o),n.renderbufferStorage(n.RENDERBUFFER,t,e,i),this.bindRenderbuffer.set(null),o},Pt.prototype.createFramebuffer=function(t,e){return new Mt(this,t,e)},Pt.prototype.clear=function(t){var e=t.color,i=t.depth,n=this.gl,o=0;e&&(o|=n.COLOR_BUFFER_BIT,this.clearColor.set(e),this.colorMask.set([!0,!0,!0,!0])),void 0!==i&&(o|=n.DEPTH_BUFFER_BIT,this.clearDepth.set(i),this.depthMask.set(!0)),n.clear(o);},Pt.prototype.setDepthMode=function(t){t.func!==this.gl.ALWAYS||t.mask?(this.depthTest.set(!0),this.depthFunc.set(t.func),this.depthMask.set(t.mask),this.depthRange.set(t.range)):this.depthTest.set(!1);},Pt.prototype.setStencilMode=function(t){t.test.func!==this.gl.ALWAYS||t.mask?(this.stencilTest.set(!0),this.stencilMask.set(t.mask),this.stencilOp.set([t.fail,t.depthFail,t.pass]),this.stencilFunc.set({func:t.test.func,ref:t.ref,mask:t.test.mask})):this.stencilTest.set(!1);},Pt.prototype.setColorMode=function(e){t.default$13(e.blendFunction,Lt.Replace)?this.blend.set(!1):(this.blend.set(!0),this.blendFunc.set(e.blendFunction),this.blendColor.set(e.blendColor)),this.colorMask.set(e.mask);};var kt=function(e){function i(i,n,o){var r=this;e.call(this),this.id=i,this.dispatcher=o,this.on("data",function(t){"source"===t.dataType&&"metadata"===t.sourceDataType&&(r._sourceLoaded=!0),r._sourceLoaded&&!r._paused&&"source"===t.dataType&&"content"===t.sourceDataType&&(r.reload(),r.transform&&r.update(r.transform));}),this.on("error",function(){r._sourceErrored=!0;}),this._source=X(i,n,o,this),this._tiles={},this._cache=new Y(0,this._unloadTile.bind(this)),this._timers={},this._cacheTimers={},this._maxTileCacheSize=null,this._isIdRenderable=this._isIdRenderable.bind(this),this._coveredTiles={},this._state=new t.default$16;}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.onAdd=function(t){this.map=t,this._maxTileCacheSize=t?t._maxTileCacheSize:null,this._source&&this._source.onAdd&&this._source.onAdd(t);},i.prototype.onRemove=function(t){this._source&&this._source.onRemove&&this._source.onRemove(t);},i.prototype.loaded=function(){if(this._sourceErrored)return!0;if(!this._sourceLoaded)return!1;for(var t in this._tiles){var e=this._tiles[t];if("loaded"!==e.state&&"errored"!==e.state)return!1}return!0},i.prototype.getSource=function(){return this._source},i.prototype.pause=function(){this._paused=!0;},i.prototype.resume=function(){if(this._paused){var t=this._shouldReloadOnResume;this._paused=!1,this._shouldReloadOnResume=!1,t&&this.reload(),this.transform&&this.update(this.transform);}},i.prototype._loadTile=function(t,e){return this._source.loadTile(t,e)},i.prototype._unloadTile=function(t){if(this._source.unloadTile)return this._source.unloadTile(t,function(){})},i.prototype._abortTile=function(t){if(this._source.abortTile)return this._source.abortTile(t,function(){})},i.prototype.serialize=function(){return this._source.serialize()},i.prototype.prepare=function(t){for(var e in this._source.prepare&&this._source.prepare(),this._state.coalesceChanges(this._tiles,this.map?this.map.painter:null),this._tiles)this._tiles[e].upload(t);},i.prototype.getIds=function(){var e=this;return Object.keys(this._tiles).map(Number).sort(function(i,n){var o=e._tiles[i].tileID,r=e._tiles[n].tileID,a=new t.default(o.canonical.x,o.canonical.y).rotate(e.transform.angle),s=new t.default(r.canonical.x,r.canonical.y).rotate(e.transform.angle);return o.overscaledZ-r.overscaledZ||s.y-a.y||s.x-a.x})},i.prototype.getRenderableIds=function(){return this.getIds().filter(this._isIdRenderable)},i.prototype.hasRenderableParent=function(t){var e=this.findLoadedParent(t,0,{});return!!e&&this._isIdRenderable(e.tileID.key)},i.prototype._isIdRenderable=function(t){return this._tiles[t]&&this._tiles[t].hasData()&&!this._coveredTiles[t]},i.prototype.reload=function(){if(this._paused)this._shouldReloadOnResume=!0;else for(var t in this._cache.reset(),this._tiles)"errored"!==this._tiles[t].state&&this._reloadTile(t,"reloading");},i.prototype._reloadTile=function(t,e){var i=this._tiles[t];i&&("loading"!==i.state&&(i.state=e),this._loadTile(i,this._tileLoaded.bind(this,i,t,e)));},i.prototype._tileLoaded=function(e,i,n,o){if(o)return e.state="errored",void(404!==o.status?this._source.fire(new t.ErrorEvent(o,{tile:e})):this.update(this.transform));e.timeAdded=t.default$2.now(),"expired"===n&&(e.refreshedUponExpiration=!0),this._setTileReloadTimer(i,e),"raster-dem"===this.getSource().type&&e.dem&&this._backfillDEM(e),this._state.initializeTileState(e,this.map?this.map.painter:null),this._source.fire(new t.Event("data",{dataType:"source",tile:e,coord:e.tileID})),this.map&&(this.map.painter.tileExtentVAO.vao=null);},i.prototype._backfillDEM=function(t){for(var e=this.getRenderableIds(),i=0;i<e.length;i++){var n=e[i];if(t.neighboringTiles&&t.neighboringTiles[n]){var o=this.getTileByID(n);r(t,o),r(o,t);}}function r(t,e){t.needsHillshadePrepare=!0;var i=e.tileID.canonical.x-t.tileID.canonical.x,n=e.tileID.canonical.y-t.tileID.canonical.y,o=Math.pow(2,t.tileID.canonical.z),r=e.tileID.key;0===i&&0===n||Math.abs(n)>1||(Math.abs(i)>1&&(1===Math.abs(i+o)?i+=o:1===Math.abs(i-o)&&(i-=o)),e.dem&&t.dem&&(t.dem.backfillBorder(e.dem,i,n),t.neighboringTiles&&t.neighboringTiles[r]&&(t.neighboringTiles[r].backfilled=!0)));}},i.prototype.getTile=function(t){return this.getTileByID(t.key)},i.prototype.getTileByID=function(t){return this._tiles[t]},i.prototype.getZoom=function(t){return t.zoom+t.scaleZoom(t.tileSize/this._source.tileSize)},i.prototype._findLoadedChildren=function(t,e,i){var n=!1;for(var o in this._tiles){var r=this._tiles[o];if(!(i[o]||!r.hasData()||r.tileID.overscaledZ<=t.overscaledZ||r.tileID.overscaledZ>e)){var a=Math.pow(2,r.tileID.canonical.z-t.canonical.z);if(Math.floor(r.tileID.canonical.x/a)===t.canonical.x&&Math.floor(r.tileID.canonical.y/a)===t.canonical.y)for(i[o]=r.tileID,n=!0;r&&r.tileID.overscaledZ-1>t.overscaledZ;){var s=r.tileID.scaledTo(r.tileID.overscaledZ-1);if(!s)break;(r=this._tiles[s.key])&&r.hasData()&&(delete i[o],i[s.key]=s);}}}return n},i.prototype.findLoadedParent=function(t,e,i){for(var n=t.overscaledZ-1;n>=e;n--){var o=t.scaledTo(n);if(!o)return;var r=String(o.key),a=this._tiles[r];if(a&&a.hasData())return i[r]=o,a;if(this._cache.has(o))return i[r]=o,this._cache.get(o)}},i.prototype.updateCacheSize=function(t){var e=(Math.ceil(t.width/this._source.tileSize)+1)*(Math.ceil(t.height/this._source.tileSize)+1),i=Math.floor(5*e),n="number"==typeof this._maxTileCacheSize?Math.min(this._maxTileCacheSize,i):i;this._cache.setMaxSize(n);},i.prototype.handleWrapJump=function(t){var e=(t-(void 0===this._prevLng?t:this._prevLng))/360,i=Math.round(e);if(this._prevLng=t,i){var n={};for(var o in this._tiles){var r=this._tiles[o];r.tileID=r.tileID.unwrapTo(r.tileID.wrap+i),n[r.tileID.key]=r;}for(var a in this._tiles=n,this._timers)clearTimeout(this._timers[a]),delete this._timers[a];for(var s in this._tiles){var l=this._tiles[s];this._setTileReloadTimer(s,l);}}},i.prototype.update=function(e){var n=this;if(this.transform=e,this._sourceLoaded&&!this._paused){var o;this.updateCacheSize(e),this.handleWrapJump(this.transform.center.lng),this._coveredTiles={},this.used?this._source.tileID?o=e.getVisibleUnwrappedCoordinates(this._source.tileID).map(function(e){return new t.OverscaledTileID(e.canonical.z,e.wrap,e.canonical.z,e.canonical.x,e.canonical.y)}):(o=e.coveringTiles({tileSize:this._source.tileSize,minzoom:this._source.minzoom,maxzoom:this._source.maxzoom,roundZoom:this._source.roundZoom,reparseOverscaled:this._source.reparseOverscaled}),this._source.hasTile&&(o=o.filter(function(t){return n._source.hasTile(t)}))):o=[];var r,a=(this._source.roundZoom?Math.round:Math.floor)(this.getZoom(e)),s=Math.max(a-i.maxOverzooming,this._source.minzoom),l=Math.max(a+i.maxUnderzooming,this._source.minzoom),c=this._updateRetainedTiles(o,a),u={};if(Ot(this._source.type))for(var h=Object.keys(c),p=0;p<h.length;p++){var d=h[p],f=c[d],m=n._tiles[d];if(m&&(void 0===m.fadeEndTime||m.fadeEndTime>=t.default$2.now())){n._findLoadedChildren(f,l,c)&&(c[d]=f);var _=n.findLoadedParent(f,s,u);_&&n._addTile(_.tileID);}}for(r in u)c[r]||(n._coveredTiles[r]=!0);for(r in u)c[r]=u[r];for(var g=t.keysDifference(this._tiles,c),v=0;v<g.length;v++)n._removeTile(g[v]);}},i.prototype._updateRetainedTiles=function(t,e){for(var n={},o={},r=Math.max(e-i.maxOverzooming,this._source.minzoom),a=Math.max(e+i.maxUnderzooming,this._source.minzoom),s=0;s<t.length;s++){var l=t[s],c=this._addTile(l),u=!1;if(c.hasData())n[l.key]=l;else{u=c.wasRequested(),n[l.key]=l;var h=!0;if(e+1>this._source.maxzoom){var p=l.children(this._source.maxzoom)[0],d=this.getTile(p);d&&d.hasData()?n[p.key]=p:h=!1;}else{this._findLoadedChildren(l,a,n);for(var f=l.children(this._source.maxzoom),m=0;m<f.length;m++)if(!n[f[m].key]){h=!1;break}}if(!h)for(var _=l.overscaledZ-1;_>=r;--_){var g=l.scaledTo(_);if(o[g.key])break;if(o[g.key]=!0,!(c=this.getTile(g))&&u&&(c=this._addTile(g)),c&&(n[g.key]=g,u=c.wasRequested(),c.hasData()))break}}}return n},i.prototype._addTile=function(e){var i=this._tiles[e.key];if(i)return i;(i=this._cache.getAndRemove(e))&&(this._setTileReloadTimer(e.key,i),i.tileID=e,this._state.initializeTileState(i,this.map?this.map.painter:null),this._cacheTimers[e.key]&&(clearTimeout(this._cacheTimers[e.key]),delete this._cacheTimers[e.key],this._setTileReloadTimer(e.key,i)));var n=Boolean(i);return n||(i=new t.default$14(e,this._source.tileSize*e.overscaleFactor()),this._loadTile(i,this._tileLoaded.bind(this,i,e.key,i.state))),i?(i.uses++,this._tiles[e.key]=i,n||this._source.fire(new t.Event("dataloading",{tile:i,coord:i.tileID,dataType:"source"})),i):null},i.prototype._setTileReloadTimer=function(t,e){var i=this;t in this._timers&&(clearTimeout(this._timers[t]),delete this._timers[t]);var n=e.getExpiryTimeout();n&&(this._timers[t]=setTimeout(function(){i._reloadTile(t,"expired"),delete i._timers[t];},n));},i.prototype._removeTile=function(t){var e=this._tiles[t];e&&(e.uses--,delete this._tiles[t],this._timers[t]&&(clearTimeout(this._timers[t]),delete this._timers[t]),e.uses>0||(e.hasData()?this._cache.add(e.tileID,e,e.getExpiryTimeout()):(e.aborted=!0,this._abortTile(e),this._unloadTile(e))));},i.prototype.clearTiles=function(){for(var t in this._shouldReloadOnResume=!1,this._paused=!1,this._tiles)this._removeTile(t);this._cache.reset();},i.prototype.tilesIn=function(e,i){for(var n=[],o=this.getIds(),r=1/0,a=1/0,s=-1/0,l=-1/0,c=e[0].zoom,u=0;u<e.length;u++){var h=e[u];r=Math.min(r,h.column),a=Math.min(a,h.row),s=Math.max(s,h.column),l=Math.max(l,h.row);}for(var p=0;p<o.length;p++){var d=this._tiles[o[p]],f=d.tileID,m=Math.pow(2,this.transform.zoom-d.tileID.overscaledZ),_=i*d.queryPadding*t.default$10/d.tileSize/m,g=[Bt(f,new t.default$15(r,a,c)),Bt(f,new t.default$15(s,l,c))];if(g[0].x-_<t.default$10&&g[0].y-_<t.default$10&&g[1].x+_>=0&&g[1].y+_>=0){for(var v=[],y=0;y<e.length;y++)v.push(Bt(f,e[y]));n.push({tile:d,tileID:f,queryGeometry:[v],scale:m});}}return n},i.prototype.getVisibleCoordinates=function(){for(var t=this,e=this.getRenderableIds().map(function(e){return t._tiles[e].tileID}),i=0,n=e;i<n.length;i+=1){var o=n[i];o.posMatrix=t.transform.calculatePosMatrix(o.toUnwrapped());}return e},i.prototype.hasTransition=function(){if(this._source.hasTransition())return!0;if(Ot(this._source.type))for(var e in this._tiles){var i=this._tiles[e];if(void 0!==i.fadeEndTime&&i.fadeEndTime>=t.default$2.now())return!0}return!1},i.prototype.setFeatureState=function(t,e,i){t=t||"_geojsonTileLayer",this._state.updateState(t,e,i);},i.prototype.getFeatureState=function(t,e){return t=t||"_geojsonTileLayer",this._state.getState(t,e)},i}(t.Evented);function Bt(e,i){var n=i.zoomTo(e.canonical.z);return new t.default((n.column-(e.canonical.x+e.wrap*Math.pow(2,e.canonical.z)))*t.default$10,(n.row-e.canonical.y)*t.default$10)}function Ot(t){return"raster"===t||"image"===t||"video"===t}function Ft(){return new t.default$1.Worker(pn.workerUrl)}kt.maxOverzooming=10,kt.maxUnderzooming=3;var Nt,$t=function(){this.active={};};function Ut(e,i){var n={};for(var o in e)"ref"!==o&&(n[o]=e[o]);return t.default$17.forEach(function(t){t in i&&(n[t]=i[t]);}),n}function Zt(t){t=t.slice();for(var e=Object.create(null),i=0;i<t.length;i++)e[t[i].id]=t[i];for(var n=0;n<t.length;n++)"ref"in t[n]&&(t[n]=Ut(t[n],e[t[n].ref]));return t}$t.prototype.acquire=function(t){if(!this.workers){var e=pn.workerCount;for(this.workers=[];this.workers.length<e;)this.workers.push(new Ft);}return this.active[t]=!0,this.workers.slice()},$t.prototype.release=function(t){delete this.active[t],0===Object.keys(this.active).length&&(this.workers.forEach(function(t){t.terminate();}),this.workers=null);};var Vt={setStyle:"setStyle",addLayer:"addLayer",removeLayer:"removeLayer",setPaintProperty:"setPaintProperty",setLayoutProperty:"setLayoutProperty",setFilter:"setFilter",addSource:"addSource",removeSource:"removeSource",setGeoJSONSourceData:"setGeoJSONSourceData",setLayerZoomRange:"setLayerZoomRange",setLayerProperty:"setLayerProperty",setCenter:"setCenter",setZoom:"setZoom",setBearing:"setBearing",setPitch:"setPitch",setSprite:"setSprite",setGlyphs:"setGlyphs",setTransition:"setTransition",setLight:"setLight"};function jt(t,e,i){i.push({command:Vt.addSource,args:[t,e[t]]});}function Gt(t,e,i){e.push({command:Vt.removeSource,args:[t]}),i[t]=!0;}function Wt(t,e,i,n){Gt(t,i,n),jt(t,e,i);}function qt(e,i,n){var o;for(o in e[n])if(e[n].hasOwnProperty(o)&&"data"!==o&&!t.default$13(e[n][o],i[n][o]))return!1;for(o in i[n])if(i[n].hasOwnProperty(o)&&"data"!==o&&!t.default$13(e[n][o],i[n][o]))return!1;return!0}function Xt(e,i,n,o,r,a){var s;for(s in i=i||{},e=e||{})e.hasOwnProperty(s)&&(t.default$13(e[s],i[s])||n.push({command:a,args:[o,s,i[s],r]}));for(s in i)i.hasOwnProperty(s)&&!e.hasOwnProperty(s)&&(t.default$13(e[s],i[s])||n.push({command:a,args:[o,s,i[s],r]}));}function Ht(t){return t.id}function Kt(t,e){return t[e.id]=e,t}function Yt(e,i){if(!e)return[{command:Vt.setStyle,args:[i]}];var n=[];try{if(!t.default$13(e.version,i.version))return[{command:Vt.setStyle,args:[i]}];t.default$13(e.center,i.center)||n.push({command:Vt.setCenter,args:[i.center]}),t.default$13(e.zoom,i.zoom)||n.push({command:Vt.setZoom,args:[i.zoom]}),t.default$13(e.bearing,i.bearing)||n.push({command:Vt.setBearing,args:[i.bearing]}),t.default$13(e.pitch,i.pitch)||n.push({command:Vt.setPitch,args:[i.pitch]}),t.default$13(e.sprite,i.sprite)||n.push({command:Vt.setSprite,args:[i.sprite]}),t.default$13(e.glyphs,i.glyphs)||n.push({command:Vt.setGlyphs,args:[i.glyphs]}),t.default$13(e.transition,i.transition)||n.push({command:Vt.setTransition,args:[i.transition]}),t.default$13(e.light,i.light)||n.push({command:Vt.setLight,args:[i.light]});var o={},r=[];!function(e,i,n,o){var r;for(r in i=i||{},e=e||{})e.hasOwnProperty(r)&&(i.hasOwnProperty(r)||Gt(r,n,o));for(r in i)i.hasOwnProperty(r)&&(e.hasOwnProperty(r)?t.default$13(e[r],i[r])||("geojson"===e[r].type&&"geojson"===i[r].type&&qt(e,i,r)?n.push({command:Vt.setGeoJSONSourceData,args:[r,i[r].data]}):Wt(r,i,n,o)):jt(r,i,n));}(e.sources,i.sources,r,o);var a=[];e.layers&&e.layers.forEach(function(t){o[t.source]?n.push({command:Vt.removeLayer,args:[t.id]}):a.push(t);}),n=n.concat(r),function(e,i,n){i=i||[];var o,r,a,s,l,c,u,h=(e=e||[]).map(Ht),p=i.map(Ht),d=e.reduce(Kt,{}),f=i.reduce(Kt,{}),m=h.slice(),_=Object.create(null);for(o=0,r=0;o<h.length;o++)a=h[o],f.hasOwnProperty(a)?r++:(n.push({command:Vt.removeLayer,args:[a]}),m.splice(m.indexOf(a,r),1));for(o=0,r=0;o<p.length;o++)a=p[p.length-1-o],m[m.length-1-o]!==a&&(d.hasOwnProperty(a)?(n.push({command:Vt.removeLayer,args:[a]}),m.splice(m.lastIndexOf(a,m.length-r),1)):r++,c=m[m.length-o],n.push({command:Vt.addLayer,args:[f[a],c]}),m.splice(m.length-o,0,a),_[a]=!0);for(o=0;o<p.length;o++)if(s=d[a=p[o]],l=f[a],!_[a]&&!t.default$13(s,l))if(t.default$13(s.source,l.source)&&t.default$13(s["source-layer"],l["source-layer"])&&t.default$13(s.type,l.type)){for(u in Xt(s.layout,l.layout,n,a,null,Vt.setLayoutProperty),Xt(s.paint,l.paint,n,a,null,Vt.setPaintProperty),t.default$13(s.filter,l.filter)||n.push({command:Vt.setFilter,args:[a,l.filter]}),t.default$13(s.minzoom,l.minzoom)&&t.default$13(s.maxzoom,l.maxzoom)||n.push({command:Vt.setLayerZoomRange,args:[a,l.minzoom,l.maxzoom]}),s)s.hasOwnProperty(u)&&"layout"!==u&&"paint"!==u&&"filter"!==u&&"metadata"!==u&&"minzoom"!==u&&"maxzoom"!==u&&(0===u.indexOf("paint.")?Xt(s[u],l[u],n,a,u.slice(6),Vt.setPaintProperty):t.default$13(s[u],l[u])||n.push({command:Vt.setLayerProperty,args:[a,u,l[u]]}));for(u in l)l.hasOwnProperty(u)&&!s.hasOwnProperty(u)&&"layout"!==u&&"paint"!==u&&"filter"!==u&&"metadata"!==u&&"minzoom"!==u&&"maxzoom"!==u&&(0===u.indexOf("paint.")?Xt(s[u],l[u],n,a,u.slice(6),Vt.setPaintProperty):t.default$13(s[u],l[u])||n.push({command:Vt.setLayerProperty,args:[a,u,l[u]]}));}else n.push({command:Vt.removeLayer,args:[a]}),c=m[m.lastIndexOf(a)+1],n.push({command:Vt.addLayer,args:[l,c]});}(a,i.layers,n);}catch(t){console.warn("Unable to compute style diff:",t),n=[{command:Vt.setStyle,args:[i]}];}return n}var Jt=function(t,e,i){var n=this.boxCells=[],o=this.circleCells=[];this.xCellCount=Math.ceil(t/i),this.yCellCount=Math.ceil(e/i);for(var r=0;r<this.xCellCount*this.yCellCount;r++)n.push([]),o.push([]);this.circleKeys=[],this.boxKeys=[],this.bboxes=[],this.circles=[],this.width=t,this.height=e,this.xScale=this.xCellCount/t,this.yScale=this.yCellCount/e,this.boxUid=0,this.circleUid=0;};Jt.prototype.keysLength=function(){return this.boxKeys.length+this.circleKeys.length},Jt.prototype.insert=function(t,e,i,n,o){this._forEachCell(e,i,n,o,this._insertBoxCell,this.boxUid++),this.boxKeys.push(t),this.bboxes.push(e),this.bboxes.push(i),this.bboxes.push(n),this.bboxes.push(o);},Jt.prototype.insertCircle=function(t,e,i,n){this._forEachCell(e-n,i-n,e+n,i+n,this._insertCircleCell,this.circleUid++),this.circleKeys.push(t),this.circles.push(e),this.circles.push(i),this.circles.push(n);},Jt.prototype._insertBoxCell=function(t,e,i,n,o,r){this.boxCells[o].push(r);},Jt.prototype._insertCircleCell=function(t,e,i,n,o,r){this.circleCells[o].push(r);},Jt.prototype._query=function(t,e,i,n,o,r){if(i<0||t>this.width||n<0||e>this.height)return!o&&[];var a=[];if(t<=0&&e<=0&&this.width<=i&&this.height<=n){if(o)return!0;for(var s=0;s<this.boxKeys.length;s++)a.push({key:this.boxKeys[s],x1:this.bboxes[4*s],y1:this.bboxes[4*s+1],x2:this.bboxes[4*s+2],y2:this.bboxes[4*s+3]});for(var l=0;l<this.circleKeys.length;l++){var c=this.circles[3*l],u=this.circles[3*l+1],h=this.circles[3*l+2];a.push({key:this.circleKeys[l],x1:c-h,y1:u-h,x2:c+h,y2:u+h});}return r?a.filter(r):a}var p={hitTest:o,seenUids:{box:{},circle:{}}};return this._forEachCell(t,e,i,n,this._queryCell,a,p,r),o?a.length>0:a},Jt.prototype._queryCircle=function(t,e,i,n,o){var r=t-i,a=t+i,s=e-i,l=e+i;if(a<0||r>this.width||l<0||s>this.height)return!n&&[];var c=[],u={hitTest:n,circle:{x:t,y:e,radius:i},seenUids:{box:{},circle:{}}};return this._forEachCell(r,s,a,l,this._queryCellCircle,c,u,o),n?c.length>0:c},Jt.prototype.query=function(t,e,i,n,o){return this._query(t,e,i,n,!1,o)},Jt.prototype.hitTest=function(t,e,i,n,o){return this._query(t,e,i,n,!0,o)},Jt.prototype.hitTestCircle=function(t,e,i,n){return this._queryCircle(t,e,i,!0,n)},Jt.prototype._queryCell=function(t,e,i,n,o,r,a,s){var l=a.seenUids,c=this.boxCells[o];if(null!==c)for(var u=this.bboxes,h=0,p=c;h<p.length;h+=1){var d=p[h];if(!l.box[d]){l.box[d]=!0;var f=4*d;if(t<=u[f+2]&&e<=u[f+3]&&i>=u[f+0]&&n>=u[f+1]&&(!s||s(this.boxKeys[d]))){if(a.hitTest)return r.push(!0),!0;r.push({key:this.boxKeys[d],x1:u[f],y1:u[f+1],x2:u[f+2],y2:u[f+3]});}}}var m=this.circleCells[o];if(null!==m)for(var _=this.circles,g=0,v=m;g<v.length;g+=1){var y=v[g];if(!l.circle[y]){l.circle[y]=!0;var x=3*y;if(this._circleAndRectCollide(_[x],_[x+1],_[x+2],t,e,i,n)&&(!s||s(this.circleKeys[y]))){if(a.hitTest)return r.push(!0),!0;var b=_[x],w=_[x+1],E=_[x+2];r.push({key:this.circleKeys[y],x1:b-E,y1:w-E,x2:b+E,y2:w+E});}}}},Jt.prototype._queryCellCircle=function(t,e,i,n,o,r,a,s){var l=a.circle,c=a.seenUids,u=this.boxCells[o];if(null!==u)for(var h=this.bboxes,p=0,d=u;p<d.length;p+=1){var f=d[p];if(!c.box[f]){c.box[f]=!0;var m=4*f;if(this._circleAndRectCollide(l.x,l.y,l.radius,h[m+0],h[m+1],h[m+2],h[m+3])&&(!s||s(this.boxKeys[f])))return r.push(!0),!0}}var _=this.circleCells[o];if(null!==_)for(var g=this.circles,v=0,y=_;v<y.length;v+=1){var x=y[v];if(!c.circle[x]){c.circle[x]=!0;var b=3*x;if(this._circlesCollide(g[b],g[b+1],g[b+2],l.x,l.y,l.radius)&&(!s||s(this.circleKeys[x])))return r.push(!0),!0}}},Jt.prototype._forEachCell=function(t,e,i,n,o,r,a,s){for(var l=this._convertToXCellCoord(t),c=this._convertToYCellCoord(e),u=this._convertToXCellCoord(i),h=this._convertToYCellCoord(n),p=l;p<=u;p++)for(var d=c;d<=h;d++){var f=this.xCellCount*d+p;if(o.call(this,t,e,i,n,f,r,a,s))return}},Jt.prototype._convertToXCellCoord=function(t){return Math.max(0,Math.min(this.xCellCount-1,Math.floor(t*this.xScale)))},Jt.prototype._convertToYCellCoord=function(t){return Math.max(0,Math.min(this.yCellCount-1,Math.floor(t*this.yScale)))},Jt.prototype._circlesCollide=function(t,e,i,n,o,r){var a=n-t,s=o-e,l=i+r;return l*l>a*a+s*s},Jt.prototype._circleAndRectCollide=function(t,e,i,n,o,r,a){var s=(r-n)/2,l=Math.abs(t-(n+s));if(l>s+i)return!1;var c=(a-o)/2,u=Math.abs(e-(o+c));if(u>c+i)return!1;if(l<=s||u<=c)return!0;var h=l-s,p=u-c;return h*h+p*p<=i*i};var Qt=t.default$18.layout;function te(e,i,n,o,r){var a=t.identity(new Float32Array(16));return i?(t.identity(a),t.scale(a,a,[1/r,1/r,1]),n||t.rotateZ(a,a,o.angle)):(t.scale(a,a,[o.width/2,-o.height/2,1]),t.translate(a,a,[1,-1,0]),t.multiply(a,a,e)),a}function ee(e,i,n,o,r){var a=t.identity(new Float32Array(16));return i?(t.multiply(a,a,e),t.scale(a,a,[r,r,1]),n||t.rotateZ(a,a,-o.angle)):(t.scale(a,a,[1,-1,1]),t.translate(a,a,[-1,-1,0]),t.scale(a,a,[2/o.width,2/o.height,1])),a}function ie(e,i){var n=[e.x,e.y,0,1];pe(n,n,i);var o=n[3];return{point:new t.default(n[0]/o,n[1]/o),signedDistanceFromCamera:o}}function ne(t,e){var i=t[0]/t[3],n=t[1]/t[3];return i>=-e[0]&&i<=e[0]&&n>=-e[1]&&n<=e[1]}function oe(e,i,n,o,r,a,s,l){var c=o?e.textSizeData:e.iconSizeData,u=t.evaluateSizeForZoom(c,n.transform.zoom,Qt.properties[o?"text-size":"icon-size"]),h=[256/n.width*2+1,256/n.height*2+1],p=o?e.text.dynamicLayoutVertexArray:e.icon.dynamicLayoutVertexArray;p.clear();for(var d=e.lineVertexArray,f=o?e.text.placedSymbolArray:e.icon.placedSymbolArray,m=n.transform.width/n.transform.height,_=!1,g=0;g<f.length;g++){var v=f.get(g);if(v.hidden||v.writingMode===t.WritingMode.vertical&&!_)he(v.numGlyphs,p);else{_=!1;var y=[v.anchorX,v.anchorY,0,1];if(t.transformMat4(y,y,i),ne(y,h)){var x=.5+y[3]/n.transform.cameraToCenterDistance*.5,b=t.evaluateSizeForFeature(c,u,v),w=s?b*x:b/x,E=new t.default(v.anchorX,v.anchorY),T=ie(E,r).point,I={},C=se(v,w,!1,l,i,r,a,e.glyphOffsetArray,d,p,T,E,I,m);_=C.useVertical,(C.notEnoughRoom||_||C.needsFlipping&&se(v,w,!0,l,i,r,a,e.glyphOffsetArray,d,p,T,E,I,m).notEnoughRoom)&&he(v.numGlyphs,p);}else he(v.numGlyphs,p);}}o?e.text.dynamicLayoutVertexBuffer.updateData(p):e.icon.dynamicLayoutVertexBuffer.updateData(p);}function re(t,e,i,n,o,r,a,s,l,c,u,h){var p=s.glyphStartIndex+s.numGlyphs,d=s.lineStartIndex,f=s.lineStartIndex+s.lineLength,m=e.getoffsetX(s.glyphStartIndex),_=e.getoffsetX(p-1),g=ce(t*m,i,n,o,r,a,s.segment,d,f,l,c,u,h);if(!g)return null;var v=ce(t*_,i,n,o,r,a,s.segment,d,f,l,c,u,h);return v?{first:g,last:v}:null}function ae(e,i,n,o){if(e===t.WritingMode.horizontal&&Math.abs(n.y-i.y)>Math.abs(n.x-i.x)*o)return{useVertical:!0};return(e===t.WritingMode.vertical?i.y<n.y:i.x>n.x)?{needsFlipping:!0}:null}function se(e,i,n,o,r,a,s,l,c,u,h,p,d,f){var m,_=i/24,g=e.lineOffsetX*i,v=e.lineOffsetY*i;if(e.numGlyphs>1){var y=e.glyphStartIndex+e.numGlyphs,x=e.lineStartIndex,b=e.lineStartIndex+e.lineLength,w=re(_,l,g,v,n,h,p,e,c,a,d,!1);if(!w)return{notEnoughRoom:!0};var E=ie(w.first.point,s).point,T=ie(w.last.point,s).point;if(o&&!n){var I=ae(e.writingMode,E,T,f);if(I)return I}m=[w.first];for(var C=e.glyphStartIndex+1;C<y-1;C++)m.push(ce(_*l.getoffsetX(C),g,v,n,h,p,e.segment,x,b,c,a,d,!1));m.push(w.last);}else{if(o&&!n){var S=ie(p,r).point,z=e.lineStartIndex+e.segment+1,A=new t.default(c.getx(z),c.gety(z)),M=ie(A,r),R=M.signedDistanceFromCamera>0?M.point:le(p,A,S,1,r),D=ae(e.writingMode,S,R,f);if(D)return D}var L=ce(_*l.getoffsetX(e.glyphStartIndex),g,v,n,h,p,e.segment,e.lineStartIndex,e.lineStartIndex+e.lineLength,c,a,d,!1);if(!L)return{notEnoughRoom:!0};m=[L];}for(var P=0,k=m;P<k.length;P+=1){var B=k[P];t.addDynamicAttributes(u,B.point,B.angle);}return{}}function le(t,e,i,n,o){var r=ie(t.add(t.sub(e)._unit()),o).point,a=i.sub(r);return i.add(a._mult(n/a.mag()))}function ce(e,i,n,o,r,a,s,l,c,u,h,p,d){var f=o?e-i:e+i,m=f>0?1:-1,_=0;o&&(m*=-1,_=Math.PI),m<0&&(_+=Math.PI);for(var g=m>0?l+s:l+s+1,v=g,y=r,x=r,b=0,w=0,E=Math.abs(f);b+w<=E;){if((g+=m)<l||g>=c)return null;if(x=y,void 0===(y=p[g])){var T=new t.default(u.getx(g),u.gety(g)),I=ie(T,h);if(I.signedDistanceFromCamera>0)y=p[g]=I.point;else{var C=g-m;y=le(0===b?a:new t.default(u.getx(C),u.gety(C)),T,x,E-b+1,h);}}b+=w,w=x.dist(y);}var S=(E-b)/w,z=y.sub(x),A=z.mult(S)._add(x);return A._add(z._unit()._perp()._mult(n*m)),{point:A,angle:_+Math.atan2(y.y-x.y,y.x-x.x),tileDistance:d?{prevTileDistance:g-m===v?0:u.gettileUnitDistanceFromAnchor(g-m),lastSegmentViewportDistance:E-b}:null}}var ue=new Float32Array([-1/0,-1/0,0,-1/0,-1/0,0,-1/0,-1/0,0,-1/0,-1/0,0]);function he(t,e){for(var i=0;i<t;i++){var n=e.length;e.resize(n+4),e.float32.set(ue,3*n);}}function pe(t,e,i){var n=e[0],o=e[1];return t[0]=i[0]*n+i[4]*o+i[12],t[1]=i[1]*n+i[5]*o+i[13],t[3]=i[3]*n+i[7]*o+i[15],t}var de=function(t,e,i){void 0===e&&(e=new Jt(t.width+200,t.height+200,25)),void 0===i&&(i=new Jt(t.width+200,t.height+200,25)),this.transform=t,this.grid=e,this.ignoredGrid=i,this.pitchfactor=Math.cos(t._pitch)*t.cameraToCenterDistance,this.screenRightBoundary=t.width+100,this.screenBottomBoundary=t.height+100,this.gridRightBoundary=t.width+200,this.gridBottomBoundary=t.height+200;};function fe(t,e,i){t[e+4]=i?1:0;}function me(e,i,n){return i*(t.default$10/(e.tileSize*Math.pow(2,n-e.tileID.overscaledZ)))}de.prototype.placeCollisionBox=function(t,e,i,n,o){var r=this.projectAndGetPerspectiveRatio(n,t.anchorPointX,t.anchorPointY),a=i*r.perspectiveRatio,s=t.x1*a+r.point.x,l=t.y1*a+r.point.y,c=t.x2*a+r.point.x,u=t.y2*a+r.point.y;return!this.isInsideGrid(s,l,c,u)||!e&&this.grid.hitTest(s,l,c,u,o)?{box:[],offscreen:!1}:{box:[s,l,c,u],offscreen:this.isOffscreen(s,l,c,u)}},de.prototype.approximateTileDistance=function(t,e,i,n,o){var r=o?1:n/this.pitchfactor,a=t.lastSegmentViewportDistance*i;return t.prevTileDistance+a+(r-1)*a*Math.abs(Math.sin(e))},de.prototype.placeCollisionCircles=function(e,i,n,o,r,a,s,l,c,u,h,p,d,f){var m=[],_=this.projectAnchor(u,a.anchorX,a.anchorY),g=c/24,v=a.lineOffsetX*c,y=a.lineOffsetY*c,x=new t.default(a.anchorX,a.anchorY),b=re(g,l,v,y,!1,ie(x,h).point,x,a,s,h,{},!0),w=!1,E=!1,T=!0,I=_.perspectiveRatio*o,C=1/(o*n),S=0,z=0;b&&(S=this.approximateTileDistance(b.first.tileDistance,b.first.angle,C,_.cameraDistance,d),z=this.approximateTileDistance(b.last.tileDistance,b.last.angle,C,_.cameraDistance,d));for(var A=0;A<e.length;A+=5){var M=e[A],R=e[A+1],D=e[A+2],L=e[A+3];if(!b||L<-S||L>z)fe(e,A,!1);else{var P=this.projectPoint(u,M,R),k=D*I;if(m.length>0){var B=P.x-m[m.length-4],O=P.y-m[m.length-3];if(k*k*2>B*B+O*O)if(A+8<e.length){var F=e[A+8];if(F>-S&&F<z){fe(e,A,!1);continue}}}var N=A/5;m.push(P.x,P.y,k,N),fe(e,A,!0);var $=P.x-k,U=P.y-k,Z=P.x+k,V=P.y+k;if(T=T&&this.isOffscreen($,U,Z,V),E=E||this.isInsideGrid($,U,Z,V),!i&&this.grid.hitTestCircle(P.x,P.y,k,f)){if(!p)return{circles:[],offscreen:!1};w=!0;}}}return{circles:w||!E?[]:m,offscreen:T}},de.prototype.queryRenderedSymbols=function(e){if(0===e.length||0===this.grid.keysLength()&&0===this.ignoredGrid.keysLength())return{};for(var i=[],n=1/0,o=1/0,r=-1/0,a=-1/0,s=0,l=e;s<l.length;s+=1){var c=l[s],u=new t.default(c.x+100,c.y+100);n=Math.min(n,u.x),o=Math.min(o,u.y),r=Math.max(r,u.x),a=Math.max(a,u.y),i.push(u);}for(var h={},p={},d=0,f=this.grid.query(n,o,r,a).concat(this.ignoredGrid.query(n,o,r,a));d<f.length;d+=1){var m=f[d],_=m.key;if(void 0===h[_.bucketInstanceId]&&(h[_.bucketInstanceId]={}),!h[_.bucketInstanceId][_.featureIndex]){var g=[new t.default(m.x1,m.y1),new t.default(m.x2,m.y1),new t.default(m.x2,m.y2),new t.default(m.x1,m.y2)];t.polygonIntersectsPolygon(i,g)&&(h[_.bucketInstanceId][_.featureIndex]=!0,void 0===p[_.bucketInstanceId]&&(p[_.bucketInstanceId]=[]),p[_.bucketInstanceId].push(_.featureIndex));}}return p},de.prototype.insertCollisionBox=function(t,e,i,n,o){var r={bucketInstanceId:i,featureIndex:n,collisionGroupID:o};(e?this.ignoredGrid:this.grid).insert(r,t[0],t[1],t[2],t[3]);},de.prototype.insertCollisionCircles=function(t,e,i,n,o){for(var r=e?this.ignoredGrid:this.grid,a={bucketInstanceId:i,featureIndex:n,collisionGroupID:o},s=0;s<t.length;s+=4)r.insertCircle(a,t[s],t[s+1],t[s+2]);},de.prototype.projectAnchor=function(t,e,i){var n=[e,i,0,1];return pe(n,n,t),{perspectiveRatio:.5+this.transform.cameraToCenterDistance/n[3]*.5,cameraDistance:n[3]}},de.prototype.projectPoint=function(e,i,n){var o=[i,n,0,1];return pe(o,o,e),new t.default((o[0]/o[3]+1)/2*this.transform.width+100,(-o[1]/o[3]+1)/2*this.transform.height+100)},de.prototype.projectAndGetPerspectiveRatio=function(e,i,n){var o=[i,n,0,1];return pe(o,o,e),{point:new t.default((o[0]/o[3]+1)/2*this.transform.width+100,(-o[1]/o[3]+1)/2*this.transform.height+100),perspectiveRatio:.5+this.transform.cameraToCenterDistance/o[3]*.5}},de.prototype.isOffscreen=function(t,e,i,n){return i<100||t>=this.screenRightBoundary||n<100||e>this.screenBottomBoundary},de.prototype.isInsideGrid=function(t,e,i,n){return i>=0&&t<this.gridRightBoundary&&n>=0&&e<this.gridBottomBoundary};var _e=t.default$18.layout,ge=function(t,e,i,n){this.opacity=t?Math.max(0,Math.min(1,t.opacity+(t.placed?e:-e))):n&&i?1:0,this.placed=i;};ge.prototype.isHidden=function(){return 0===this.opacity&&!this.placed};var ve=function(t,e,i,n,o){this.text=new ge(t?t.text:null,e,i,o),this.icon=new ge(t?t.icon:null,e,n,o);};ve.prototype.isHidden=function(){return this.text.isHidden()&&this.icon.isHidden()};var ye=function(t,e,i){this.text=t,this.icon=e,this.skipFade=i;},xe=function(t){this.crossSourceCollisions=t,this.maxGroupID=0,this.collisionGroups={};};xe.prototype.get=function(t){if(this.crossSourceCollisions)return{ID:0,predicate:null};if(!this.collisionGroups[t]){var e=++this.maxGroupID;this.collisionGroups[t]={ID:e,predicate:function(t){return t.collisionGroupID===e}};}return this.collisionGroups[t]};var be=function(t,e,i){this.transform=t.clone(),this.collisionIndex=new de(this.transform),this.placements={},this.opacities={},this.stale=!1,this.fadeDuration=e,this.retainedQueryData={},this.collisionGroups=new xe(i);};function we(t,e,i){t.emplaceBack(e?1:0,i?1:0),t.emplaceBack(e?1:0,i?1:0),t.emplaceBack(e?1:0,i?1:0),t.emplaceBack(e?1:0,i?1:0);}be.prototype.placeLayerTile=function(e,i,n,o){var r=i.getBucket(e),a=i.latestFeatureIndex;if(r&&a&&e.id===r.layerIds[0]){var s=i.collisionBoxArray,l=r.layers[0].layout,c=Math.pow(2,this.transform.zoom-i.tileID.overscaledZ),u=i.tileSize/t.default$10,h=this.transform.calculatePosMatrix(i.tileID.toUnwrapped()),p=te(h,"map"===l.get("text-pitch-alignment"),"map"===l.get("text-rotation-alignment"),this.transform,me(i,1,this.transform.zoom)),d=te(h,"map"===l.get("icon-pitch-alignment"),"map"===l.get("icon-rotation-alignment"),this.transform,me(i,1,this.transform.zoom));this.retainedQueryData[r.bucketInstanceId]=new function(t,e,i,n,o){this.bucketInstanceId=t,this.featureIndex=e,this.sourceLayerIndex=i,this.bucketIndex=n,this.tileID=o;}(r.bucketInstanceId,a,r.sourceLayerIndex,r.index,i.tileID),this.placeLayerBucket(r,h,p,d,c,u,n,o,s);}},be.prototype.placeLayerBucket=function(e,i,n,o,r,a,s,l,c){for(var u=e.layers[0].layout,h=t.evaluateSizeForZoom(e.textSizeData,this.transform.zoom,_e.properties["text-size"]),p=!e.hasTextData()||u.get("text-optional"),d=!e.hasIconData()||u.get("icon-optional"),f=this.collisionGroups.get(e.sourceID),m=0,_=e.symbolInstances;m<_.length;m+=1){var g=_[m];if(!l[g.crossTileID]){var v=void 0!==g.feature.text,y=void 0!==g.feature.icon,x=!0,b=null,w=null,E=null,T=0,I=0;g.collisionArrays||(g.collisionArrays=e.deserializeCollisionBoxes(c,g.textBoxStartIndex,g.textBoxEndIndex,g.iconBoxStartIndex,g.iconBoxEndIndex)),g.collisionArrays.textFeatureIndex&&(T=g.collisionArrays.textFeatureIndex),g.collisionArrays.textBox&&(v=(b=this.collisionIndex.placeCollisionBox(g.collisionArrays.textBox,u.get("text-allow-overlap"),a,i,f.predicate)).box.length>0,x=x&&b.offscreen);var C=g.collisionArrays.textCircles;if(C){var S=e.text.placedSymbolArray.get(g.placedTextSymbolIndices[0]),z=t.evaluateSizeForFeature(e.textSizeData,h,S);w=this.collisionIndex.placeCollisionCircles(C,u.get("text-allow-overlap"),r,a,g.key,S,e.lineVertexArray,e.glyphOffsetArray,z,i,n,s,"map"===u.get("text-pitch-alignment"),f.predicate),v=u.get("text-allow-overlap")||w.circles.length>0,x=x&&w.offscreen;}g.collisionArrays.iconFeatureIndex&&(I=g.collisionArrays.iconFeatureIndex),g.collisionArrays.iconBox&&(y=(E=this.collisionIndex.placeCollisionBox(g.collisionArrays.iconBox,u.get("icon-allow-overlap"),a,i,f.predicate)).box.length>0,x=x&&E.offscreen),p||d?d?p||(y=y&&v):v=y&&v:y=v=y&&v,v&&b&&this.collisionIndex.insertCollisionBox(b.box,u.get("text-ignore-placement"),e.bucketInstanceId,T,f.ID),y&&E&&this.collisionIndex.insertCollisionBox(E.box,u.get("icon-ignore-placement"),e.bucketInstanceId,I,f.ID),v&&w&&this.collisionIndex.insertCollisionCircles(w.circles,u.get("text-ignore-placement"),e.bucketInstanceId,T,f.ID),this.placements[g.crossTileID]=new ye(v,y,x||e.justReloaded),l[g.crossTileID]=!0;}}e.justReloaded=!1;},be.prototype.commit=function(t,e){this.commitTime=e;var i=!1,n=t&&0!==this.fadeDuration?(this.commitTime-t.commitTime)/this.fadeDuration:1,o=t?t.opacities:{};for(var r in this.placements){var a=this.placements[r],s=o[r];s?(this.opacities[r]=new ve(s,n,a.text,a.icon),i=i||a.text!==s.text.placed||a.icon!==s.icon.placed):(this.opacities[r]=new ve(null,n,a.text,a.icon,a.skipFade),i=i||a.text||a.icon);}for(var l in o){var c=o[l];if(!this.opacities[l]){var u=new ve(c,n,!1,!1);u.isHidden()||(this.opacities[l]=u,i=i||c.text.placed||c.icon.placed);}}i?this.lastPlacementChangeTime=e:"number"!=typeof this.lastPlacementChangeTime&&(this.lastPlacementChangeTime=t?t.lastPlacementChangeTime:e);},be.prototype.updateLayerOpacities=function(t,e){for(var i={},n=0,o=e;n<o.length;n+=1){var r=o[n],a=r.getBucket(t);a&&r.latestFeatureIndex&&t.id===a.layerIds[0]&&this.updateBucketOpacities(a,i,r.collisionBoxArray);}},be.prototype.updateBucketOpacities=function(t,e,i){t.hasTextData()&&t.text.opacityVertexArray.clear(),t.hasIconData()&&t.icon.opacityVertexArray.clear(),t.hasCollisionBoxData()&&t.collisionBox.collisionVertexArray.clear(),t.hasCollisionCircleData()&&t.collisionCircle.collisionVertexArray.clear();for(var n=t.layers[0].layout,o=new ve(null,0,!1,!1,!0),r=new ve(null,0,n.get("text-allow-overlap"),n.get("icon-allow-overlap"),!0),a=0;a<t.symbolInstances.length;a++){var s=t.symbolInstances[a],l=e[s.crossTileID],c=this.opacities[s.crossTileID];l?c=o:c||(c=r,this.opacities[s.crossTileID]=c),e[s.crossTileID]=!0;var u=s.numGlyphVertices>0||s.numVerticalGlyphVertices>0,h=s.numIconVertices>0;if(u){for(var p=Me(c.text),d=(s.numGlyphVertices+s.numVerticalGlyphVertices)/4,f=0;f<d;f++)t.text.opacityVertexArray.emplaceBack(p);for(var m=0,_=s.placedTextSymbolIndices;m<_.length;m+=1){var g=_[m];t.text.placedSymbolArray.get(g).hidden=c.text.isHidden();}}if(h){for(var v=Me(c.icon),y=0;y<s.numIconVertices/4;y++)t.icon.opacityVertexArray.emplaceBack(v);t.icon.placedSymbolArray.get(a).hidden=c.icon.isHidden();}s.collisionArrays||(s.collisionArrays=t.deserializeCollisionBoxes(i,s.textBoxStartIndex,s.textBoxEndIndex,s.iconBoxStartIndex,s.iconBoxEndIndex));var x=s.collisionArrays;if(x){x.textBox&&t.hasCollisionBoxData()&&we(t.collisionBox.collisionVertexArray,c.text.placed,!1),x.iconBox&&t.hasCollisionBoxData()&&we(t.collisionBox.collisionVertexArray,c.icon.placed,!1);var b=x.textCircles;if(b&&t.hasCollisionCircleData())for(var w=0;w<b.length;w+=5){var E=l||0===b[w+4];we(t.collisionCircle.collisionVertexArray,c.text.placed,E);}}}t.sortFeatures(this.transform.angle),this.retainedQueryData[t.bucketInstanceId]&&(this.retainedQueryData[t.bucketInstanceId].featureSortOrder=t.featureSortOrder),t.hasTextData()&&t.text.opacityVertexBuffer&&t.text.opacityVertexBuffer.updateData(t.text.opacityVertexArray),t.hasIconData()&&t.icon.opacityVertexBuffer&&t.icon.opacityVertexBuffer.updateData(t.icon.opacityVertexArray),t.hasCollisionBoxData()&&t.collisionBox.collisionVertexBuffer&&t.collisionBox.collisionVertexBuffer.updateData(t.collisionBox.collisionVertexArray),t.hasCollisionCircleData()&&t.collisionCircle.collisionVertexBuffer&&t.collisionCircle.collisionVertexBuffer.updateData(t.collisionCircle.collisionVertexArray);},be.prototype.symbolFadeChange=function(t){return 0===this.fadeDuration?1:(t-this.commitTime)/this.fadeDuration},be.prototype.hasTransitions=function(t){return this.stale||t-this.lastPlacementChangeTime<this.fadeDuration},be.prototype.stillRecent=function(t){return"undefined"!==this.commitTime&&this.commitTime+this.fadeDuration>t},be.prototype.setStale=function(){this.stale=!0;};var Ee=Math.pow(2,25),Te=Math.pow(2,24),Ie=Math.pow(2,17),Ce=Math.pow(2,16),Se=Math.pow(2,9),ze=Math.pow(2,8),Ae=Math.pow(2,1);function Me(t){if(0===t.opacity&&!t.placed)return 0;if(1===t.opacity&&t.placed)return 4294967295;var e=t.placed?1:0,i=Math.floor(127*t.opacity);return i*Ee+e*Te+i*Ie+e*Ce+i*Se+e*ze+i*Ae+e}var Re=function(){this._currentTileIndex=0,this._seenCrossTileIDs={};};Re.prototype.continuePlacement=function(t,e,i,n,o){for(;this._currentTileIndex<t.length;){var r=t[this._currentTileIndex];if(e.placeLayerTile(n,r,i,this._seenCrossTileIDs),this._currentTileIndex++,o())return!0}};var De=function(t,e,i,n,o,r){this.placement=new be(t,o,r),this._currentPlacementIndex=e.length-1,this._forceFullPlacement=i,this._showCollisionBoxes=n,this._done=!1;};De.prototype.isDone=function(){return this._done},De.prototype.continuePlacement=function(e,i,n){for(var o=this,r=t.default$2.now(),a=function(){var e=t.default$2.now()-r;return!o._forceFullPlacement&&e>2};this._currentPlacementIndex>=0;){var s=i[e[o._currentPlacementIndex]],l=o.placement.collisionIndex.transform.zoom;if("symbol"===s.type&&(!s.minzoom||s.minzoom<=l)&&(!s.maxzoom||s.maxzoom>l)){if(o._inProgressLayer||(o._inProgressLayer=new Re),o._inProgressLayer.continuePlacement(n[s.source],o.placement,o._showCollisionBoxes,s,a))return;delete o._inProgressLayer;}o._currentPlacementIndex--;}this._done=!0;},De.prototype.commit=function(t,e){return this.placement.commit(t,e),this.placement};var Le=512/t.default$10/2,Pe=function(t,e,i){this.tileID=t,this.indexedSymbolInstances={},this.bucketInstanceId=i;for(var n=0,o=e;n<o.length;n+=1){var r=o[n],a=r.key;this.indexedSymbolInstances[a]||(this.indexedSymbolInstances[a]=[]),this.indexedSymbolInstances[a].push({crossTileID:r.crossTileID,coord:this.getScaledCoordinates(r,t)});}};Pe.prototype.getScaledCoordinates=function(e,i){var n=i.canonical.z-this.tileID.canonical.z,o=Le/Math.pow(2,n),r=e.anchor;return{x:Math.floor((i.canonical.x*t.default$10+r.x)*o),y:Math.floor((i.canonical.y*t.default$10+r.y)*o)}},Pe.prototype.findMatches=function(t,e,i){for(var n=this.tileID.canonical.z<e.canonical.z?1:Math.pow(2,this.tileID.canonical.z-e.canonical.z),o=0,r=t;o<r.length;o+=1){var a=r[o];if(!a.crossTileID){var s=this.indexedSymbolInstances[a.key];if(s)for(var l=this.getScaledCoordinates(a,e),c=0,u=s;c<u.length;c+=1){var h=u[c];if(Math.abs(h.coord.x-l.x)<=n&&Math.abs(h.coord.y-l.y)<=n&&!i[h.crossTileID]){i[h.crossTileID]=!0,a.crossTileID=h.crossTileID;break}}}}};var ke=function(){this.maxCrossTileID=0;};ke.prototype.generate=function(){return++this.maxCrossTileID};var Be=function(){this.indexes={},this.usedCrossTileIDs={},this.lng=0;};Be.prototype.handleWrapJump=function(t){var e=Math.round((t-this.lng)/360);if(0!==e)for(var i in this.indexes){var n=this.indexes[i],o={};for(var r in n){var a=n[r];a.tileID=a.tileID.unwrapTo(a.tileID.wrap+e),o[a.tileID.key]=a;}this.indexes[i]=o;}this.lng=t;},Be.prototype.addBucket=function(t,e,i){if(this.indexes[t.overscaledZ]&&this.indexes[t.overscaledZ][t.key]){if(this.indexes[t.overscaledZ][t.key].bucketInstanceId===e.bucketInstanceId)return!1;this.removeBucketCrossTileIDs(t.overscaledZ,this.indexes[t.overscaledZ][t.key]);}for(var n=0,o=e.symbolInstances;n<o.length;n+=1){o[n].crossTileID=0;}this.usedCrossTileIDs[t.overscaledZ]||(this.usedCrossTileIDs[t.overscaledZ]={});var r=this.usedCrossTileIDs[t.overscaledZ];for(var a in this.indexes){var s=this.indexes[a];if(Number(a)>t.overscaledZ)for(var l in s){var c=s[l];c.tileID.isChildOf(t)&&c.findMatches(e.symbolInstances,t,r);}else{var u=s[t.scaledTo(Number(a)).key];u&&u.findMatches(e.symbolInstances,t,r);}}for(var h=0,p=e.symbolInstances;h<p.length;h+=1){var d=p[h];d.crossTileID||(d.crossTileID=i.generate(),r[d.crossTileID]=!0);}return void 0===this.indexes[t.overscaledZ]&&(this.indexes[t.overscaledZ]={}),this.indexes[t.overscaledZ][t.key]=new Pe(t,e.symbolInstances,e.bucketInstanceId),!0},Be.prototype.removeBucketCrossTileIDs=function(t,e){for(var i in e.indexedSymbolInstances)for(var n=0,o=e.indexedSymbolInstances[i];n<o.length;n+=1){var r=o[n];delete this.usedCrossTileIDs[t][r.crossTileID];}},Be.prototype.removeStaleBuckets=function(t){var e=!1;for(var i in this.indexes){var n=this.indexes[i];for(var o in n)t[n[o].bucketInstanceId]||(this.removeBucketCrossTileIDs(i,n[o]),delete n[o],e=!0);}return e};var Oe=function(){this.layerIndexes={},this.crossTileIDs=new ke,this.maxBucketInstanceId=0,this.bucketsInCurrentPlacement={};};Oe.prototype.addLayer=function(t,e,i){var n=this.layerIndexes[t.id];void 0===n&&(n=this.layerIndexes[t.id]=new Be);var o=!1,r={};n.handleWrapJump(i);for(var a=0,s=e;a<s.length;a+=1){var l=s[a],c=l.getBucket(t);c&&t.id===c.layerIds[0]&&(c.bucketInstanceId||(c.bucketInstanceId=++this.maxBucketInstanceId),n.addBucket(l.tileID,c,this.crossTileIDs)&&(o=!0),r[c.bucketInstanceId]=!0);}return n.removeStaleBuckets(r)&&(o=!0),o},Oe.prototype.pruneUnusedLayers=function(t){var e={};for(var i in t.forEach(function(t){e[t]=!0;}),this.layerIndexes)e[i]||delete this.layerIndexes[i];};var Fe=function(e,i){return t.emitValidationErrors(e,i&&i.filter(function(t){return"source.canvas"!==t.identifier}))},Ne=t.pick(Vt,["addLayer","removeLayer","setPaintProperty","setLayoutProperty","setFilter","addSource","removeSource","setLayerZoomRange","setLight","setTransition","setGeoJSONSourceData"]),$e=t.pick(Vt,["setCenter","setZoom","setBearing","setPitch"]),Ue=function(e){function i(n,o){var r=this;void 0===o&&(o={}),e.call(this),this.map=n,this.dispatcher=new P((Nt||(Nt=new $t),Nt),this),this.imageManager=new E,this.glyphManager=new A(n._transformRequest,o.localIdeographFontFamily),this.lineAtlas=new L(256,512),this.crossTileSymbolIndex=new Oe,this._layers={},this._order=[],this.sourceCaches={},this.zoomHistory=new t.default$21,this._loaded=!1,this._resetUpdates();var a=this;this._rtlTextPluginCallback=i.registerForPluginAvailability(function(t){for(var e in a.dispatcher.broadcast("loadRTLTextPlugin",t.pluginURL,t.completionCallback),a.sourceCaches)a.sourceCaches[e].reload();}),this.on("data",function(t){if("source"===t.dataType&&"metadata"===t.sourceDataType){var e=r.sourceCaches[t.sourceId];if(e){var i=e.getSource();if(i&&i.vectorLayerIds)for(var n in r._layers){var o=r._layers[n];o.source===i.id&&r._validateLayer(o);}}}});}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.loadURL=function(e,i){var n=this;void 0===i&&(i={}),this.fire(new t.Event("dataloading",{dataType:"style"}));var o="boolean"==typeof i.validate?i.validate:!f(e);e=function(t,e){if(!f(t))return t;var i=b(t);return i.path="/styles/v1"+i.path,d(i,e)}(e,i.accessToken);var r=this.map._transformRequest(e,t.ResourceType.Style);this._request=t.getJSON(r,function(e,i){n._request=null,e?n.fire(new t.ErrorEvent(e)):i&&n._load(i,o);});},i.prototype.loadJSON=function(e,i){var n=this;void 0===i&&(i={}),this.fire(new t.Event("dataloading",{dataType:"style"})),this._request=t.default$2.frame(function(){n._request=null,n._load(e,!1!==i.validate);});},i.prototype._load=function(e,i){var n=this;if(!i||!Fe(this,t.validateStyle(e))){for(var o in this._loaded=!0,this.stylesheet=e,e.sources)n.addSource(o,e.sources[o],{validate:!1});e.sprite?this._spriteRequest=function(e,i,n){var o,r,a,s=t.default$2.devicePixelRatio>1?"@2x":"",l=t.getJSON(i(g(e,s,".json"),t.ResourceType.SpriteJSON),function(t,e){l=null,a||(a=t,o=e,u());}),c=t.getImage(i(g(e,s,".png"),t.ResourceType.SpriteImage),function(t,e){c=null,a||(a=t,r=e,u());});function u(){if(a)n(a);else if(o&&r){var e=t.default$2.getImageData(r),i={};for(var s in o){var l=o[s],c=l.width,u=l.height,h=l.x,p=l.y,d=l.sdf,f=l.pixelRatio,m=new t.RGBAImage({width:c,height:u});t.RGBAImage.copy(e,m,{x:h,y:p},{x:0,y:0},{width:c,height:u}),i[s]={data:m,pixelRatio:f,sdf:d};}n(null,i);}}return{cancel:function(){l&&(l.cancel(),l=null),c&&(c.cancel(),c=null);}}}(e.sprite,this.map._transformRequest,function(e,i){if(n._spriteRequest=null,e)n.fire(new t.ErrorEvent(e));else if(i)for(var o in i)n.imageManager.addImage(o,i[o]);n.imageManager.setLoaded(!0),n.fire(new t.Event("data",{dataType:"style"}));}):this.imageManager.setLoaded(!0),this.glyphManager.setURL(e.glyphs);var r=Zt(this.stylesheet.layers);this._order=r.map(function(t){return t.id}),this._layers={};for(var a=0,s=r;a<s.length;a+=1){var l=s[a];(l=t.default$20(l)).setEventedParent(n,{layer:{id:l.id}}),n._layers[l.id]=l;}this.dispatcher.broadcast("setLayers",this._serializeLayers(this._order)),this.light=new D(this.stylesheet.light),this.fire(new t.Event("data",{dataType:"style"})),this.fire(new t.Event("style.load"));}},i.prototype._validateLayer=function(e){var i=this.sourceCaches[e.source];if(i){var n=e.sourceLayer;if(n){var o=i.getSource();("geojson"===o.type||o.vectorLayerIds&&-1===o.vectorLayerIds.indexOf(n))&&this.fire(new t.ErrorEvent(new Error('Source layer "'+n+'" does not exist on source "'+o.id+'" as specified by style layer "'+e.id+'"')));}}},i.prototype.loaded=function(){if(!this._loaded)return!1;if(Object.keys(this._updatedSources).length)return!1;for(var t in this.sourceCaches)if(!this.sourceCaches[t].loaded())return!1;return!!this.imageManager.isLoaded()},i.prototype._serializeLayers=function(t){var e=this;return t.map(function(t){return e._layers[t].serialize()})},i.prototype.hasTransitions=function(){if(this.light&&this.light.hasTransition())return!0;for(var t in this.sourceCaches)if(this.sourceCaches[t].hasTransition())return!0;for(var e in this._layers)if(this._layers[e].hasTransition())return!0;return!1},i.prototype._checkLoaded=function(){if(!this._loaded)throw new Error("Style is not done loading")},i.prototype.update=function(e){if(this._loaded){if(this._changed){var i=Object.keys(this._updatedLayers),n=Object.keys(this._removedLayers);for(var o in(i.length||n.length)&&this._updateWorkerLayers(i,n),this._updatedSources){var r=this._updatedSources[o];"reload"===r?this._reloadSource(o):"clear"===r&&this._clearSource(o);}for(var a in this._updatedPaintProps)this._layers[a].updateTransitions(e);this.light.updateTransitions(e),this._resetUpdates(),this.fire(new t.Event("data",{dataType:"style"}));}for(var s in this.sourceCaches)this.sourceCaches[s].used=!1;for(var l=0,c=this._order;l<c.length;l+=1){var u=c[l],h=this._layers[u];h.recalculate(e),!h.isHidden(e.zoom)&&h.source&&(this.sourceCaches[h.source].used=!0);}this.light.recalculate(e),this.z=e.zoom;}},i.prototype._updateWorkerLayers=function(t,e){this.dispatcher.broadcast("updateLayers",{layers:this._serializeLayers(t),removedIds:e});},i.prototype._resetUpdates=function(){this._changed=!1,this._updatedLayers={},this._removedLayers={},this._updatedSources={},this._updatedPaintProps={};},i.prototype.setState=function(e){var i=this;if(this._checkLoaded(),Fe(this,t.validateStyle(e)))return!1;(e=t.clone(e)).layers=Zt(e.layers);var n=Yt(this.serialize(),e).filter(function(t){return!(t.command in $e)});if(0===n.length)return!1;var o=n.filter(function(t){return!(t.command in Ne)});if(o.length>0)throw new Error("Unimplemented: "+o.map(function(t){return t.command}).join(", ")+".");return n.forEach(function(t){"setTransition"!==t.command&&i[t.command].apply(i,t.args);}),this.stylesheet=e,!0},i.prototype.addImage=function(e,i){if(this.getImage(e))return this.fire(new t.ErrorEvent(new Error("An image with this name already exists.")));this.imageManager.addImage(e,i),this.fire(new t.Event("data",{dataType:"style"}));},i.prototype.getImage=function(t){return this.imageManager.getImage(t)},i.prototype.removeImage=function(e){if(!this.getImage(e))return this.fire(new t.ErrorEvent(new Error("No image with this name exists.")));this.imageManager.removeImage(e),this.fire(new t.Event("data",{dataType:"style"}));},i.prototype.listImages=function(){return this._checkLoaded(),this.imageManager.listImages()},i.prototype.addSource=function(e,i,n){var o=this;if(this._checkLoaded(),void 0!==this.sourceCaches[e])throw new Error("There is already a source with this ID");if(!i.type)throw new Error("The type property must be defined, but the only the following properties were given: "+Object.keys(i).join(", ")+".");if(!(["vector","raster","geojson","video","image"].indexOf(i.type)>=0)||!this._validate(t.validateStyle.source,"sources."+e,i,null,n)){this.map&&this.map._collectResourceTiming&&(i.collectResourceTiming=!0);var r=this.sourceCaches[e]=new kt(e,i,this.dispatcher);r.style=this,r.setEventedParent(this,function(){return{isSourceLoaded:o.loaded(),source:r.serialize(),sourceId:e}}),r.onAdd(this.map),this._changed=!0;}},i.prototype.removeSource=function(e){if(this._checkLoaded(),void 0===this.sourceCaches[e])throw new Error("There is no source with this ID");for(var i in this._layers)if(this._layers[i].source===e)return this.fire(new t.ErrorEvent(new Error('Source "'+e+'" cannot be removed while layer "'+i+'" is using it.')));var n=this.sourceCaches[e];delete this.sourceCaches[e],delete this._updatedSources[e],n.fire(new t.Event("data",{sourceDataType:"metadata",dataType:"source",sourceId:e})),n.setEventedParent(null),n.clearTiles(),n.onRemove&&n.onRemove(this.map),this._changed=!0;},i.prototype.setGeoJSONSourceData=function(t,e){this._checkLoaded(),this.sourceCaches[t].getSource().setData(e),this._changed=!0;},i.prototype.getSource=function(t){return this.sourceCaches[t]&&this.sourceCaches[t].getSource()},i.prototype.addLayer=function(e,i,n){this._checkLoaded();var o=e.id;if(this.getLayer(o))this.fire(new t.ErrorEvent(new Error('Layer with id "'+o+'" already exists on this map')));else if("object"==typeof e.source&&(this.addSource(o,e.source),e=t.clone(e),e=t.extend(e,{source:o})),!this._validate(t.validateStyle.layer,"layers."+o,e,{arrayIndex:-1},n)){var r=t.default$20(e);this._validateLayer(r),r.setEventedParent(this,{layer:{id:o}});var a=i?this._order.indexOf(i):this._order.length;if(i&&-1===a)this.fire(new t.ErrorEvent(new Error('Layer with id "'+i+'" does not exist on this map.')));else{if(this._order.splice(a,0,o),this._layerOrderChanged=!0,this._layers[o]=r,this._removedLayers[o]&&r.source){var s=this._removedLayers[o];delete this._removedLayers[o],s.type!==r.type?this._updatedSources[r.source]="clear":(this._updatedSources[r.source]="reload",this.sourceCaches[r.source].pause());}this._updateLayer(r);}}},i.prototype.moveLayer=function(e,i){if(this._checkLoaded(),this._changed=!0,this._layers[e]){if(e!==i){var n=this._order.indexOf(e);this._order.splice(n,1);var o=i?this._order.indexOf(i):this._order.length;i&&-1===o?this.fire(new t.ErrorEvent(new Error('Layer with id "'+i+'" does not exist on this map.'))):(this._order.splice(o,0,e),this._layerOrderChanged=!0);}}else this.fire(new t.ErrorEvent(new Error("The layer '"+e+"' does not exist in the map's style and cannot be moved.")));},i.prototype.removeLayer=function(e){this._checkLoaded();var i=this._layers[e];if(i){i.setEventedParent(null);var n=this._order.indexOf(e);this._order.splice(n,1),this._layerOrderChanged=!0,this._changed=!0,this._removedLayers[e]=i,delete this._layers[e],delete this._updatedLayers[e],delete this._updatedPaintProps[e];}else this.fire(new t.ErrorEvent(new Error("The layer '"+e+"' does not exist in the map's style and cannot be removed.")));},i.prototype.getLayer=function(t){return this._layers[t]},i.prototype.setLayerZoomRange=function(e,i,n){this._checkLoaded();var o=this.getLayer(e);o?o.minzoom===i&&o.maxzoom===n||(null!=i&&(o.minzoom=i),null!=n&&(o.maxzoom=n),this._updateLayer(o)):this.fire(new t.ErrorEvent(new Error("The layer '"+e+"' does not exist in the map's style and cannot have zoom extent.")));},i.prototype.setFilter=function(e,i){this._checkLoaded();var n=this.getLayer(e);if(n){if(!t.default$13(n.filter,i))return null==i?(n.filter=void 0,void this._updateLayer(n)):void(this._validate(t.validateStyle.filter,"layers."+n.id+".filter",i)||(n.filter=t.clone(i),this._updateLayer(n)))}else this.fire(new t.ErrorEvent(new Error("The layer '"+e+"' does not exist in the map's style and cannot be filtered.")));},i.prototype.getFilter=function(e){return t.clone(this.getLayer(e).filter)},i.prototype.setLayoutProperty=function(e,i,n){this._checkLoaded();var o=this.getLayer(e);o?t.default$13(o.getLayoutProperty(i),n)||(o.setLayoutProperty(i,n),this._updateLayer(o)):this.fire(new t.ErrorEvent(new Error("The layer '"+e+"' does not exist in the map's style and cannot be styled.")));},i.prototype.getLayoutProperty=function(t,e){return this.getLayer(t).getLayoutProperty(e)},i.prototype.setPaintProperty=function(e,i,n){this._checkLoaded();var o=this.getLayer(e);o?t.default$13(o.getPaintProperty(i),n)||(o.setPaintProperty(i,n)&&this._updateLayer(o),this._changed=!0,this._updatedPaintProps[e]=!0):this.fire(new t.ErrorEvent(new Error("The layer '"+e+"' does not exist in the map's style and cannot be styled.")));},i.prototype.getPaintProperty=function(t,e){return this.getLayer(t).getPaintProperty(e)},i.prototype.setFeatureState=function(e,i){this._checkLoaded();var n=e.source,o=e.sourceLayer,r=this.sourceCaches[n];void 0!==r?"vector"!==r.getSource().type||o?r.setFeatureState(o,e.id,i):this.fire(new t.ErrorEvent(new Error("The sourceLayer parameter must be provided for vector source types."))):this.fire(new t.ErrorEvent(new Error("The source '"+n+"' does not exist in the map's style.")));},i.prototype.getFeatureState=function(e){this._checkLoaded();var i=e.source,n=e.sourceLayer,o=this.sourceCaches[i];if(void 0!==o){if("vector"!==o.getSource().type||n)return o.getFeatureState(n,e.id);this.fire(new t.ErrorEvent(new Error("The sourceLayer parameter must be provided for vector source types.")));}else this.fire(new t.ErrorEvent(new Error("The source '"+i+"' does not exist in the map's style.")));},i.prototype.getTransition=function(){return t.extend({duration:300,delay:0},this.stylesheet&&this.stylesheet.transition)},i.prototype.serialize=function(){var e=this;return t.filterObject({version:this.stylesheet.version,name:this.stylesheet.name,metadata:this.stylesheet.metadata,light:this.stylesheet.light,center:this.stylesheet.center,zoom:this.stylesheet.zoom,bearing:this.stylesheet.bearing,pitch:this.stylesheet.pitch,sprite:this.stylesheet.sprite,glyphs:this.stylesheet.glyphs,transition:this.stylesheet.transition,sources:t.mapObject(this.sourceCaches,function(t){return t.serialize()}),layers:this._order.map(function(t){return e._layers[t].serialize()})},function(t){return void 0!==t})},i.prototype._updateLayer=function(t){this._updatedLayers[t.id]=!0,t.source&&!this._updatedSources[t.source]&&(this._updatedSources[t.source]="reload",this.sourceCaches[t.source].pause()),this._changed=!0;},i.prototype._flattenRenderedFeatures=function(t){for(var e=[],i=this._order.length-1;i>=0;i--)for(var n=this._order[i],o=0,r=t;o<r.length;o+=1){var a=r[o][n];if(a)for(var s=0,l=a;s<l.length;s+=1){var c=l[s];e.push(c);}}return e},i.prototype.queryRenderedFeatures=function(e,i,n){i&&i.filter&&this._validate(t.validateStyle.filter,"queryRenderedFeatures.filter",i.filter);var o={};if(i&&i.layers){if(!Array.isArray(i.layers))return this.fire(new t.ErrorEvent(new Error("parameters.layers must be an Array."))),[];for(var r=0,a=i.layers;r<a.length;r+=1){var s=a[r],l=this._layers[s];if(!l)return this.fire(new t.ErrorEvent(new Error("The layer '"+s+"' does not exist in the map's style and cannot be queried for features."))),[];o[l.source]=!0;}}var c=[];for(var u in this.sourceCaches)i.layers&&!o[u]||c.push(H(this.sourceCaches[u],this._layers,e.worldCoordinate,i,n));return this.placement&&c.push(function(t,e,i,n,o,r){for(var a={},s=o.queryRenderedSymbols(i),l=[],c=0,u=Object.keys(s).map(Number);c<u.length;c+=1){var h=u[c];l.push(r[h]);}l.sort(K);for(var p=function(){var e=f[d],i=e.featureIndex.lookupSymbolFeatures(s[e.bucketInstanceId],e.bucketIndex,e.sourceLayerIndex,n.filter,n.layers,t);for(var o in i){var r=a[o]=a[o]||[],l=i[o];l.sort(function(t,i){var n=e.featureSortOrder;if(n){var o=n.indexOf(t.featureIndex);return n.indexOf(i.featureIndex)-o}return i.featureIndex-t.featureIndex});for(var c=0,u=l;c<u.length;c+=1){var h=u[c];r.push(h.feature);}}},d=0,f=l;d<f.length;d+=1)p();var m=function(i){a[i].forEach(function(n){var o=t[i],r=e[o.source].getFeatureState(n.layer["source-layer"],n.id);n.source=n.layer.source,n.layer["source-layer"]&&(n.sourceLayer=n.layer["source-layer"]),n.state=r;});};for(var _ in a)m(_);return a}(this._layers,this.sourceCaches,e.viewport,i,this.placement.collisionIndex,this.placement.retainedQueryData)),this._flattenRenderedFeatures(c)},i.prototype.querySourceFeatures=function(e,i){i&&i.filter&&this._validate(t.validateStyle.filter,"querySourceFeatures.filter",i.filter);var n=this.sourceCaches[e];return n?function(t,e){for(var i=t.getRenderableIds().map(function(e){return t.getTileByID(e)}),n=[],o={},r=0;r<i.length;r++){var a=i[r],s=a.tileID.canonical.key;o[s]||(o[s]=!0,a.querySourceFeatures(n,e));}return n}(n,i):[]},i.prototype.addSourceType=function(t,e,n){return i.getSourceType(t)?n(new Error('A source type called "'+t+'" already exists.')):(i.setSourceType(t,e),e.workerSourceURL?void this.dispatcher.broadcast("loadWorkerSource",{name:t,url:e.workerSourceURL},n):n(null,null))},i.prototype.getLight=function(){return this.light.getLight()},i.prototype.setLight=function(e){this._checkLoaded();var i=this.light.getLight(),n=!1;for(var o in e)if(!t.default$13(e[o],i[o])){n=!0;break}if(n){var r={now:t.default$2.now(),transition:t.extend({duration:300,delay:0},this.stylesheet.transition)};this.light.setLight(e),this.light.updateTransitions(r);}},i.prototype._validate=function(e,i,n,o,r){return(!r||!1!==r.validate)&&Fe(this,e.call(t.validateStyle,t.extend({key:i,style:this.serialize(),value:n,styleSpec:t.default$7},o)))},i.prototype._remove=function(){for(var e in this._request&&(this._request.cancel(),this._request=null),this._spriteRequest&&(this._spriteRequest.cancel(),this._spriteRequest=null),t.evented.off("pluginAvailable",this._rtlTextPluginCallback),this.sourceCaches)this.sourceCaches[e].clearTiles();this.dispatcher.remove();},i.prototype._clearSource=function(t){this.sourceCaches[t].clearTiles();},i.prototype._reloadSource=function(t){this.sourceCaches[t].resume(),this.sourceCaches[t].reload();},i.prototype._updateSources=function(t){for(var e in this.sourceCaches)this.sourceCaches[e].update(t);},i.prototype._generateCollisionBoxes=function(){for(var t in this.sourceCaches)this._reloadSource(t);},i.prototype._updatePlacement=function(e,i,n,o){for(var r=!1,a=!1,s={},l=0,c=this._order;l<c.length;l+=1){var u=c[l],h=this._layers[u];if("symbol"===h.type){if(!s[h.source]){var p=this.sourceCaches[h.source];s[h.source]=p.getRenderableIds().map(function(t){return p.getTileByID(t)}).sort(function(t,e){return e.tileID.overscaledZ-t.tileID.overscaledZ||(t.tileID.isLessThan(e.tileID)?-1:1)});}var d=this.crossTileSymbolIndex.addLayer(h,s[h.source],e.center.lng);r=r||d;}}this.crossTileSymbolIndex.pruneUnusedLayers(this._order);var f=this._layerOrderChanged;if((f||!this.pauseablePlacement||this.pauseablePlacement.isDone()&&!this.placement.stillRecent(t.default$2.now()))&&(this.pauseablePlacement=new De(e,this._order,f,i,n,o),this._layerOrderChanged=!1),this.pauseablePlacement.isDone()?this.placement.setStale():(this.pauseablePlacement.continuePlacement(this._order,this._layers,s),this.pauseablePlacement.isDone()&&(this.placement=this.pauseablePlacement.commit(this.placement,t.default$2.now()),a=!0),r&&this.pauseablePlacement.placement.setStale()),a||r)for(var m=0,_=this._order;m<_.length;m+=1){var g=_[m],v=this._layers[g];"symbol"===v.type&&this.placement.updateLayerOpacities(v,s[v.source]);}return!this.pauseablePlacement.isDone()||this.placement.hasTransitions(t.default$2.now())},i.prototype.getImages=function(t,e,i){this.imageManager.getImages(e.icons,i);},i.prototype.getGlyphs=function(t,e,i){this.glyphManager.getGlyphs(e.stacks,i);},i}(t.Evented);Ue.getSourceType=function(t){return q[t]},Ue.setSourceType=function(t,e){q[t]=e;},Ue.registerForPluginAvailability=t.registerForPluginAvailability;var Ze=t.createLayout([{name:"a_pos",type:"Int16",components:2}]),Ve={prelude:{fragmentSource:"#ifdef GL_ES\nprecision mediump float;\n#else\n\n#if !defined(lowp)\n#define lowp\n#endif\n\n#if !defined(mediump)\n#define mediump\n#endif\n\n#if !defined(highp)\n#define highp\n#endif\n\n#endif\n",vertexSource:"#ifdef GL_ES\nprecision highp float;\n#else\n\n#if !defined(lowp)\n#define lowp\n#endif\n\n#if !defined(mediump)\n#define mediump\n#endif\n\n#if !defined(highp)\n#define highp\n#endif\n\n#endif\n\n// Unpack a pair of values that have been packed into a single float.\n// The packed values are assumed to be 8-bit unsigned integers, and are\n// packed like so:\n// packedValue = floor(input[0]) * 256 + input[1],\nvec2 unpack_float(const float packedValue) {\n    int packedIntValue = int(packedValue);\n    int v0 = packedIntValue / 256;\n    return vec2(v0, packedIntValue - v0 * 256);\n}\n\nvec2 unpack_opacity(const float packedOpacity) {\n    int intOpacity = int(packedOpacity) / 2;\n    return vec2(float(intOpacity) / 127.0, mod(packedOpacity, 2.0));\n}\n\n// To minimize the number of attributes needed, we encode a 4-component\n// color into a pair of floats (i.e. a vec2) as follows:\n// [ floor(color.r * 255) * 256 + color.g * 255,\n//   floor(color.b * 255) * 256 + color.g * 255 ]\nvec4 decode_color(const vec2 encodedColor) {\n    return vec4(\n        unpack_float(encodedColor[0]) / 255.0,\n        unpack_float(encodedColor[1]) / 255.0\n    );\n}\n\n// Unpack a pair of paint values and interpolate between them.\nfloat unpack_mix_vec2(const vec2 packedValue, const float t) {\n    return mix(packedValue[0], packedValue[1], t);\n}\n\n// Unpack a pair of paint values and interpolate between them.\nvec4 unpack_mix_vec4(const vec4 packedColors, const float t) {\n    vec4 minColor = decode_color(vec2(packedColors[0], packedColors[1]));\n    vec4 maxColor = decode_color(vec2(packedColors[2], packedColors[3]));\n    return mix(minColor, maxColor, t);\n}\n\n// The offset depends on how many pixels are between the world origin and the edge of the tile:\n// vec2 offset = mod(pixel_coord, size)\n//\n// At high zoom levels there are a ton of pixels between the world origin and the edge of the tile.\n// The glsl spec only guarantees 16 bits of precision for highp floats. We need more than that.\n//\n// The pixel_coord is passed in as two 16 bit values:\n// pixel_coord_upper = floor(pixel_coord / 2^16)\n// pixel_coord_lower = mod(pixel_coord, 2^16)\n//\n// The offset is calculated in a series of steps that should preserve this precision:\nvec2 get_pattern_pos(const vec2 pixel_coord_upper, const vec2 pixel_coord_lower,\n    const vec2 pattern_size, const float tile_units_to_pixels, const vec2 pos) {\n\n    vec2 offset = mod(mod(mod(pixel_coord_upper, pattern_size) * 256.0, pattern_size) * 256.0 + pixel_coord_lower, pattern_size);\n    return (tile_units_to_pixels * pos + offset) / pattern_size;\n}\n"},background:{fragmentSource:"uniform vec4 u_color;\nuniform float u_opacity;\n\nvoid main() {\n    gl_FragColor = u_color * u_opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"attribute vec2 a_pos;\n\nuniform mat4 u_matrix;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n}\n"},backgroundPattern:{fragmentSource:"uniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform vec2 u_texsize;\nuniform float u_mix;\nuniform float u_opacity;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\nvoid main() {\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a / u_texsize, u_pattern_br_a / u_texsize, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b / u_texsize, u_pattern_br_b / u_texsize, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    gl_FragColor = mix(color1, color2, u_mix) * u_opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pixel_coord_upper;\nuniform vec2 u_pixel_coord_lower;\nuniform float u_scale_a;\nuniform float u_scale_b;\nuniform float u_tile_units_to_pixels;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n\n    v_pos_a = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_a * u_pattern_size_a, u_tile_units_to_pixels, a_pos);\n    v_pos_b = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_b * u_pattern_size_b, u_tile_units_to_pixels, a_pos);\n}\n"},circle:{fragmentSource:"#pragma mapbox: define highp vec4 color\n#pragma mapbox: define mediump float radius\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n#pragma mapbox: define highp vec4 stroke_color\n#pragma mapbox: define mediump float stroke_width\n#pragma mapbox: define lowp float stroke_opacity\n\nvarying vec3 v_data;\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 color\n    #pragma mapbox: initialize mediump float radius\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n    #pragma mapbox: initialize highp vec4 stroke_color\n    #pragma mapbox: initialize mediump float stroke_width\n    #pragma mapbox: initialize lowp float stroke_opacity\n\n    vec2 extrude = v_data.xy;\n    float extrude_length = length(extrude);\n\n    lowp float antialiasblur = v_data.z;\n    float antialiased_blur = -max(blur, antialiasblur);\n\n    float opacity_t = smoothstep(0.0, antialiased_blur, extrude_length - 1.0);\n\n    float color_t = stroke_width < 0.01 ? 0.0 : smoothstep(\n        antialiased_blur,\n        0.0,\n        extrude_length - radius / (radius + stroke_width)\n    );\n\n    gl_FragColor = opacity_t * mix(color * opacity, stroke_color * stroke_opacity, color_t);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform bool u_scale_with_map;\nuniform bool u_pitch_with_map;\nuniform vec2 u_extrude_scale;\nuniform highp float u_camera_to_center_distance;\n\nattribute vec2 a_pos;\n\n#pragma mapbox: define highp vec4 color\n#pragma mapbox: define mediump float radius\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n#pragma mapbox: define highp vec4 stroke_color\n#pragma mapbox: define mediump float stroke_width\n#pragma mapbox: define lowp float stroke_opacity\n\nvarying vec3 v_data;\n\nvoid main(void) {\n    #pragma mapbox: initialize highp vec4 color\n    #pragma mapbox: initialize mediump float radius\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n    #pragma mapbox: initialize highp vec4 stroke_color\n    #pragma mapbox: initialize mediump float stroke_width\n    #pragma mapbox: initialize lowp float stroke_opacity\n\n    // unencode the extrusion vector that we snuck into the a_pos vector\n    vec2 extrude = vec2(mod(a_pos, 2.0) * 2.0 - 1.0);\n\n    // multiply a_pos by 0.5, since we had it * 2 in order to sneak\n    // in extrusion data\n    vec2 circle_center = floor(a_pos * 0.5);\n    if (u_pitch_with_map) {\n        vec2 corner_position = circle_center;\n        if (u_scale_with_map) {\n            corner_position += extrude * (radius + stroke_width) * u_extrude_scale;\n        } else {\n            // Pitching the circle with the map effectively scales it with the map\n            // To counteract the effect for pitch-scale: viewport, we rescale the\n            // whole circle based on the pitch scaling effect at its central point\n            vec4 projected_center = u_matrix * vec4(circle_center, 0, 1);\n            corner_position += extrude * (radius + stroke_width) * u_extrude_scale * (projected_center.w / u_camera_to_center_distance);\n        }\n\n        gl_Position = u_matrix * vec4(corner_position, 0, 1);\n    } else {\n        gl_Position = u_matrix * vec4(circle_center, 0, 1);\n\n        if (u_scale_with_map) {\n            gl_Position.xy += extrude * (radius + stroke_width) * u_extrude_scale * u_camera_to_center_distance;\n        } else {\n            gl_Position.xy += extrude * (radius + stroke_width) * u_extrude_scale * gl_Position.w;\n        }\n    }\n\n    // This is a minimum blur distance that serves as a faux-antialiasing for\n    // the circle. since blur is a ratio of the circle's size and the intent is\n    // to keep the blur at roughly 1px, the two are inversely related.\n    lowp float antialiasblur = 1.0 / DEVICE_PIXEL_RATIO / (radius + stroke_width);\n\n    v_data = vec3(extrude.x, extrude.y, antialiasblur);\n}\n"},clippingMask:{fragmentSource:"void main() {\n    gl_FragColor = vec4(1.0);\n}\n",vertexSource:"attribute vec2 a_pos;\n\nuniform mat4 u_matrix;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n}\n"},heatmap:{fragmentSource:"#pragma mapbox: define highp float weight\n\nuniform highp float u_intensity;\nvarying vec2 v_extrude;\n\n// Gaussian kernel coefficient: 1 / sqrt(2 * PI)\n#define GAUSS_COEF 0.3989422804014327\n\nvoid main() {\n    #pragma mapbox: initialize highp float weight\n\n    // Kernel density estimation with a Gaussian kernel of size 5x5\n    float d = -0.5 * 3.0 * 3.0 * dot(v_extrude, v_extrude);\n    float val = weight * u_intensity * GAUSS_COEF * exp(d);\n\n    gl_FragColor = vec4(val, 1.0, 1.0, 1.0);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"#pragma mapbox: define highp float weight\n#pragma mapbox: define mediump float radius\n\nuniform mat4 u_matrix;\nuniform float u_extrude_scale;\nuniform float u_opacity;\nuniform float u_intensity;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_extrude;\n\n// Effective \"0\" in the kernel density texture to adjust the kernel size to;\n// this empirically chosen number minimizes artifacts on overlapping kernels\n// for typical heatmap cases (assuming clustered source)\nconst highp float ZERO = 1.0 / 255.0 / 16.0;\n\n// Gaussian kernel coefficient: 1 / sqrt(2 * PI)\n#define GAUSS_COEF 0.3989422804014327\n\nvoid main(void) {\n    #pragma mapbox: initialize highp float weight\n    #pragma mapbox: initialize mediump float radius\n\n    // unencode the extrusion vector that we snuck into the a_pos vector\n    vec2 unscaled_extrude = vec2(mod(a_pos, 2.0) * 2.0 - 1.0);\n\n    // This 'extrude' comes in ranging from [-1, -1], to [1, 1].  We'll use\n    // it to produce the vertices of a square mesh framing the point feature\n    // we're adding to the kernel density texture.  We'll also pass it as\n    // a varying, so that the fragment shader can determine the distance of\n    // each fragment from the point feature.\n    // Before we do so, we need to scale it up sufficiently so that the\n    // kernel falls effectively to zero at the edge of the mesh.\n    // That is, we want to know S such that\n    // weight * u_intensity * GAUSS_COEF * exp(-0.5 * 3.0^2 * S^2) == ZERO\n    // Which solves to:\n    // S = sqrt(-2.0 * log(ZERO / (weight * u_intensity * GAUSS_COEF))) / 3.0\n    float S = sqrt(-2.0 * log(ZERO / weight / u_intensity / GAUSS_COEF)) / 3.0;\n\n    // Pass the varying in units of radius\n    v_extrude = S * unscaled_extrude;\n\n    // Scale by radius and the zoom-based scale factor to produce actual\n    // mesh position\n    vec2 extrude = v_extrude * radius * u_extrude_scale;\n\n    // multiply a_pos by 0.5, since we had it * 2 in order to sneak\n    // in extrusion data\n    vec4 pos = vec4(floor(a_pos * 0.5) + extrude, 0, 1);\n\n    gl_Position = u_matrix * pos;\n}\n"},heatmapTexture:{fragmentSource:"uniform sampler2D u_image;\nuniform sampler2D u_color_ramp;\nuniform float u_opacity;\nvarying vec2 v_pos;\n\nvoid main() {\n    float t = texture2D(u_image, v_pos).r;\n    vec4 color = texture2D(u_color_ramp, vec2(t, 0.5));\n    gl_FragColor = color * u_opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(0.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_world;\nattribute vec2 a_pos;\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos * u_world, 0, 1);\n\n    v_pos.x = a_pos.x;\n    v_pos.y = 1.0 - a_pos.y;\n}\n"},collisionBox:{fragmentSource:"\nvarying float v_placed;\nvarying float v_notUsed;\n\nvoid main() {\n\n    float alpha = 0.5;\n\n    // Red = collision, hide label\n    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * alpha;\n\n    // Blue = no collision, label is showing\n    if (v_placed > 0.5) {\n        gl_FragColor = vec4(0.0, 0.0, 1.0, 0.5) * alpha;\n    }\n\n    if (v_notUsed > 0.5) {\n        // This box not used, fade it out\n        gl_FragColor *= .1;\n    }\n}",vertexSource:"attribute vec2 a_pos;\nattribute vec2 a_anchor_pos;\nattribute vec2 a_extrude;\nattribute vec2 a_placed;\n\nuniform mat4 u_matrix;\nuniform vec2 u_extrude_scale;\nuniform float u_camera_to_center_distance;\n\nvarying float v_placed;\nvarying float v_notUsed;\n\nvoid main() {\n    vec4 projectedPoint = u_matrix * vec4(a_anchor_pos, 0, 1);\n    highp float camera_to_anchor_distance = projectedPoint.w;\n    highp float collision_perspective_ratio = clamp(\n        0.5 + 0.5 * (u_camera_to_center_distance / camera_to_anchor_distance),\n        0.0, // Prevents oversized near-field boxes in pitched/overzoomed tiles\n        4.0);\n\n    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);\n    gl_Position.xy += a_extrude * u_extrude_scale * gl_Position.w * collision_perspective_ratio;\n\n    v_placed = a_placed.x;\n    v_notUsed = a_placed.y;\n}\n"},collisionCircle:{fragmentSource:"uniform float u_overscale_factor;\n\nvarying float v_placed;\nvarying float v_notUsed;\nvarying float v_radius;\nvarying vec2 v_extrude;\nvarying vec2 v_extrude_scale;\n\nvoid main() {\n    float alpha = 0.5;\n\n    // Red = collision, hide label\n    vec4 color = vec4(1.0, 0.0, 0.0, 1.0) * alpha;\n\n    // Blue = no collision, label is showing\n    if (v_placed > 0.5) {\n        color = vec4(0.0, 0.0, 1.0, 0.5) * alpha;\n    }\n\n    if (v_notUsed > 0.5) {\n        // This box not used, fade it out\n        color *= .2;\n    }\n\n    float extrude_scale_length = length(v_extrude_scale);\n    float extrude_length = length(v_extrude) * extrude_scale_length;\n    float stroke_width = 15.0 * extrude_scale_length / u_overscale_factor;\n    float radius = v_radius * extrude_scale_length;\n\n    float distance_to_edge = abs(extrude_length - radius);\n    float opacity_t = smoothstep(-stroke_width, 0.0, -distance_to_edge);\n\n    gl_FragColor = opacity_t * color;\n}\n",vertexSource:"attribute vec2 a_pos;\nattribute vec2 a_anchor_pos;\nattribute vec2 a_extrude;\nattribute vec2 a_placed;\n\nuniform mat4 u_matrix;\nuniform vec2 u_extrude_scale;\nuniform float u_camera_to_center_distance;\n\nvarying float v_placed;\nvarying float v_notUsed;\nvarying float v_radius;\n\nvarying vec2 v_extrude;\nvarying vec2 v_extrude_scale;\n\nvoid main() {\n    vec4 projectedPoint = u_matrix * vec4(a_anchor_pos, 0, 1);\n    highp float camera_to_anchor_distance = projectedPoint.w;\n    highp float collision_perspective_ratio = clamp(\n        0.5 + 0.5 * (u_camera_to_center_distance / camera_to_anchor_distance),\n        0.0, // Prevents oversized near-field circles in pitched/overzoomed tiles\n        4.0);\n\n    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);\n\n    highp float padding_factor = 1.2; // Pad the vertices slightly to make room for anti-alias blur\n    gl_Position.xy += a_extrude * u_extrude_scale * padding_factor * gl_Position.w * collision_perspective_ratio;\n\n    v_placed = a_placed.x;\n    v_notUsed = a_placed.y;\n    v_radius = abs(a_extrude.y); // We don't pitch the circles, so both units of the extrusion vector are equal in magnitude to the radius\n\n    v_extrude = a_extrude * padding_factor;\n    v_extrude_scale = u_extrude_scale * u_camera_to_center_distance * collision_perspective_ratio;\n}\n"},debug:{fragmentSource:"uniform highp vec4 u_color;\n\nvoid main() {\n    gl_FragColor = u_color;\n}\n",vertexSource:"attribute vec2 a_pos;\n\nuniform mat4 u_matrix;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n}\n"},fill:{fragmentSource:"#pragma mapbox: define highp vec4 color\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 color\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_FragColor = color * opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"attribute vec2 a_pos;\n\nuniform mat4 u_matrix;\n\n#pragma mapbox: define highp vec4 color\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 color\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n}\n"},fillOutline:{fragmentSource:"#pragma mapbox: define highp vec4 outline_color\n#pragma mapbox: define lowp float opacity\n\nvarying vec2 v_pos;\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 outline_color\n    #pragma mapbox: initialize lowp float opacity\n\n    float dist = length(v_pos - gl_FragCoord.xy);\n    float alpha = 1.0 - smoothstep(0.0, 1.0, dist);\n    gl_FragColor = outline_color * (alpha * opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"attribute vec2 a_pos;\n\nuniform mat4 u_matrix;\nuniform vec2 u_world;\n\nvarying vec2 v_pos;\n\n#pragma mapbox: define highp vec4 outline_color\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 outline_color\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos = (gl_Position.xy / gl_Position.w + 1.0) / 2.0 * u_world;\n}\n"},fillOutlinePattern:{fragmentSource:"uniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform vec2 u_texsize;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec2 v_pos;\n\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp float opacity\n\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a / u_texsize, u_pattern_br_a / u_texsize, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b / u_texsize, u_pattern_br_b / u_texsize, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    // find distance to outline for alpha interpolation\n\n    float dist = length(v_pos - gl_FragCoord.xy);\n    float alpha = 1.0 - smoothstep(0.0, 1.0, dist);\n\n\n    gl_FragColor = mix(color1, color2, u_mix) * alpha * opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_world;\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pixel_coord_upper;\nuniform vec2 u_pixel_coord_lower;\nuniform float u_scale_a;\nuniform float u_scale_b;\nuniform float u_tile_units_to_pixels;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec2 v_pos;\n\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n\n    v_pos_a = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_a * u_pattern_size_a, u_tile_units_to_pixels, a_pos);\n    v_pos_b = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_b * u_pattern_size_b, u_tile_units_to_pixels, a_pos);\n\n    v_pos = (gl_Position.xy / gl_Position.w + 1.0) / 2.0 * u_world;\n}\n"},fillPattern:{fragmentSource:"uniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform vec2 u_texsize;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp float opacity\n\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a / u_texsize, u_pattern_br_a / u_texsize, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b / u_texsize, u_pattern_br_b / u_texsize, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    gl_FragColor = mix(color1, color2, u_mix) * opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pixel_coord_upper;\nuniform vec2 u_pixel_coord_lower;\nuniform float u_scale_a;\nuniform float u_scale_b;\nuniform float u_tile_units_to_pixels;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n\n    v_pos_a = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_a * u_pattern_size_a, u_tile_units_to_pixels, a_pos);\n    v_pos_b = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_b * u_pattern_size_b, u_tile_units_to_pixels, a_pos);\n}\n"},fillExtrusion:{fragmentSource:"varying vec4 v_color;\n#pragma mapbox: define lowp float base\n#pragma mapbox: define lowp float height\n#pragma mapbox: define highp vec4 color\n\nvoid main() {\n    #pragma mapbox: initialize lowp float base\n    #pragma mapbox: initialize lowp float height\n    #pragma mapbox: initialize highp vec4 color\n\n    gl_FragColor = v_color;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec3 u_lightcolor;\nuniform lowp vec3 u_lightpos;\nuniform lowp float u_lightintensity;\n\nattribute vec2 a_pos;\nattribute vec4 a_normal_ed;\n\nvarying vec4 v_color;\n\n#pragma mapbox: define lowp float base\n#pragma mapbox: define lowp float height\n\n#pragma mapbox: define highp vec4 color\n\nvoid main() {\n    #pragma mapbox: initialize lowp float base\n    #pragma mapbox: initialize lowp float height\n    #pragma mapbox: initialize highp vec4 color\n\n    vec3 normal = a_normal_ed.xyz;\n\n    base = max(0.0, base);\n    height = max(0.0, height);\n\n    float t = mod(normal.x, 2.0);\n\n    gl_Position = u_matrix * vec4(a_pos, t > 0.0 ? height : base, 1);\n\n    // Relative luminance (how dark/bright is the surface color?)\n    float colorvalue = color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;\n\n    v_color = vec4(0.0, 0.0, 0.0, 1.0);\n\n    // Add slight ambient lighting so no extrusions are totally black\n    vec4 ambientlight = vec4(0.03, 0.03, 0.03, 1.0);\n    color += ambientlight;\n\n    // Calculate cos(theta), where theta is the angle between surface normal and diffuse light ray\n    float directional = clamp(dot(normal / 16384.0, u_lightpos), 0.0, 1.0);\n\n    // Adjust directional so that\n    // the range of values for highlight/shading is narrower\n    // with lower light intensity\n    // and with lighter/brighter surface colors\n    directional = mix((1.0 - u_lightintensity), max((1.0 - colorvalue + u_lightintensity), 1.0), directional);\n\n    // Add gradient along z axis of side surfaces\n    if (normal.y != 0.0) {\n        directional *= clamp((t + base) * pow(height / 150.0, 0.5), mix(0.7, 0.98, 1.0 - u_lightintensity), 1.0);\n    }\n\n    // Assign final color based on surface + ambient light color, diffuse light directional, and light color\n    // with lower bounds adjusted to hue of light\n    // so that shading is tinted with the complementary (opposite) color to the light color\n    v_color.r += clamp(color.r * directional * u_lightcolor.r, mix(0.0, 0.3, 1.0 - u_lightcolor.r), 1.0);\n    v_color.g += clamp(color.g * directional * u_lightcolor.g, mix(0.0, 0.3, 1.0 - u_lightcolor.g), 1.0);\n    v_color.b += clamp(color.b * directional * u_lightcolor.b, mix(0.0, 0.3, 1.0 - u_lightcolor.b), 1.0);\n}\n"},fillExtrusionPattern:{fragmentSource:"uniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform vec2 u_texsize;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec4 v_lighting;\n\n#pragma mapbox: define lowp float base\n#pragma mapbox: define lowp float height\n\nvoid main() {\n    #pragma mapbox: initialize lowp float base\n    #pragma mapbox: initialize lowp float height\n\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a / u_texsize, u_pattern_br_a / u_texsize, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b / u_texsize, u_pattern_br_b / u_texsize, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    vec4 mixedColor = mix(color1, color2, u_mix);\n\n    gl_FragColor = mixedColor * v_lighting;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pixel_coord_upper;\nuniform vec2 u_pixel_coord_lower;\nuniform float u_scale_a;\nuniform float u_scale_b;\nuniform float u_tile_units_to_pixels;\nuniform float u_height_factor;\n\nuniform vec3 u_lightcolor;\nuniform lowp vec3 u_lightpos;\nuniform lowp float u_lightintensity;\n\nattribute vec2 a_pos;\nattribute vec4 a_normal_ed;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec4 v_lighting;\nvarying float v_directional;\n\n#pragma mapbox: define lowp float base\n#pragma mapbox: define lowp float height\n\nvoid main() {\n    #pragma mapbox: initialize lowp float base\n    #pragma mapbox: initialize lowp float height\n\n    vec3 normal = a_normal_ed.xyz;\n    float edgedistance = a_normal_ed.w;\n\n    base = max(0.0, base);\n    height = max(0.0, height);\n\n    float t = mod(normal.x, 2.0);\n    float z = t > 0.0 ? height : base;\n\n    gl_Position = u_matrix * vec4(a_pos, z, 1);\n\n    vec2 pos = normal.x == 1.0 && normal.y == 0.0 && normal.z == 16384.0\n        ? a_pos // extrusion top\n        : vec2(edgedistance, z * u_height_factor); // extrusion side\n\n    v_pos_a = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_a * u_pattern_size_a, u_tile_units_to_pixels, pos);\n    v_pos_b = get_pattern_pos(u_pixel_coord_upper, u_pixel_coord_lower, u_scale_b * u_pattern_size_b, u_tile_units_to_pixels, pos);\n\n    v_lighting = vec4(0.0, 0.0, 0.0, 1.0);\n    float directional = clamp(dot(normal / 16383.0, u_lightpos), 0.0, 1.0);\n    directional = mix((1.0 - u_lightintensity), max((0.5 + u_lightintensity), 1.0), directional);\n\n    if (normal.y != 0.0) {\n        directional *= clamp((t + base) * pow(height / 150.0, 0.5), mix(0.7, 0.98, 1.0 - u_lightintensity), 1.0);\n    }\n\n    v_lighting.rgb += clamp(directional * u_lightcolor, mix(vec3(0.0), vec3(0.3), 1.0 - u_lightcolor), vec3(1.0));\n}\n"},extrusionTexture:{fragmentSource:"uniform sampler2D u_image;\nuniform float u_opacity;\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_FragColor = texture2D(u_image, v_pos) * u_opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(0.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_world;\nattribute vec2 a_pos;\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos * u_world, 0, 1);\n\n    v_pos.x = a_pos.x;\n    v_pos.y = 1.0 - a_pos.y;\n}\n"},hillshadePrepare:{fragmentSource:"#ifdef GL_ES\nprecision highp float;\n#endif\n\nuniform sampler2D u_image;\nvarying vec2 v_pos;\nuniform vec2 u_dimension;\nuniform float u_zoom;\nuniform float u_maxzoom;\n\nfloat getElevation(vec2 coord, float bias) {\n    // Convert encoded elevation value to meters\n    vec4 data = texture2D(u_image, coord) * 255.0;\n    return (data.r + data.g * 256.0 + data.b * 256.0 * 256.0) / 4.0;\n}\n\nvoid main() {\n    vec2 epsilon = 1.0 / u_dimension;\n\n    // queried pixels:\n    // +-----------+\n    // |   |   |   |\n    // | a | b | c |\n    // |   |   |   |\n    // +-----------+\n    // |   |   |   |\n    // | d | e | f |\n    // |   |   |   |\n    // +-----------+\n    // |   |   |   |\n    // | g | h | i |\n    // |   |   |   |\n    // +-----------+\n\n    float a = getElevation(v_pos + vec2(-epsilon.x, -epsilon.y), 0.0);\n    float b = getElevation(v_pos + vec2(0, -epsilon.y), 0.0);\n    float c = getElevation(v_pos + vec2(epsilon.x, -epsilon.y), 0.0);\n    float d = getElevation(v_pos + vec2(-epsilon.x, 0), 0.0);\n    float e = getElevation(v_pos, 0.0);\n    float f = getElevation(v_pos + vec2(epsilon.x, 0), 0.0);\n    float g = getElevation(v_pos + vec2(-epsilon.x, epsilon.y), 0.0);\n    float h = getElevation(v_pos + vec2(0, epsilon.y), 0.0);\n    float i = getElevation(v_pos + vec2(epsilon.x, epsilon.y), 0.0);\n\n    // here we divide the x and y slopes by 8 * pixel size\n    // where pixel size (aka meters/pixel) is:\n    // circumference of the world / (pixels per tile * number of tiles)\n    // which is equivalent to: 8 * 40075016.6855785 / (512 * pow(2, u_zoom))\n    // which can be reduced to: pow(2, 19.25619978527 - u_zoom)\n    // we want to vertically exaggerate the hillshading though, because otherwise\n    // it is barely noticeable at low zooms. to do this, we multiply this by some\n    // scale factor pow(2, (u_zoom - u_maxzoom) * a) where a is an arbitrary value\n    // Here we use a=0.3 which works out to the expression below. see \n    // nickidlugash's awesome breakdown for more info\n    // https://github.com/mapbox/mapbox-gl-js/pull/5286#discussion_r148419556\n    float exaggeration = u_zoom < 2.0 ? 0.4 : u_zoom < 4.5 ? 0.35 : 0.3;\n\n    vec2 deriv = vec2(\n        (c + f + f + i) - (a + d + d + g),\n        (g + h + h + i) - (a + b + b + c)\n    ) /  pow(2.0, (u_zoom - u_maxzoom) * exaggeration + 19.2562 - u_zoom);\n\n    gl_FragColor = clamp(vec4(\n        deriv.x / 2.0 + 0.5,\n        deriv.y / 2.0 + 0.5,\n        1.0,\n        1.0), 0.0, 1.0);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\n\nattribute vec2 a_pos;\nattribute vec2 a_texture_pos;\n\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos = (a_texture_pos / 8192.0) / 2.0 + 0.25;\n}\n"},hillshade:{fragmentSource:"uniform sampler2D u_image;\nvarying vec2 v_pos;\n\nuniform vec2 u_latrange;\nuniform vec2 u_light;\nuniform vec4 u_shadow;\nuniform vec4 u_highlight;\nuniform vec4 u_accent;\n\n#define PI 3.141592653589793\n\nvoid main() {\n    vec4 pixel = texture2D(u_image, v_pos);\n\n    vec2 deriv = ((pixel.rg * 2.0) - 1.0);\n\n    // We divide the slope by a scale factor based on the cosin of the pixel's approximate latitude\n    // to account for mercator projection distortion. see #4807 for details\n    float scaleFactor = cos(radians((u_latrange[0] - u_latrange[1]) * (1.0 - v_pos.y) + u_latrange[1]));\n    // We also multiply the slope by an arbitrary z-factor of 1.25\n    float slope = atan(1.25 * length(deriv) / scaleFactor);\n    float aspect = deriv.x != 0.0 ? atan(deriv.y, -deriv.x) : PI / 2.0 * (deriv.y > 0.0 ? 1.0 : -1.0);\n\n    float intensity = u_light.x;\n    // We add PI to make this property match the global light object, which adds PI/2 to the light's azimuthal\n    // position property to account for 0deg corresponding to north/the top of the viewport in the style spec\n    // and the original shader was written to accept (-illuminationDirection - 90) as the azimuthal.\n    float azimuth = u_light.y + PI;\n\n    // We scale the slope exponentially based on intensity, using a calculation similar to\n    // the exponential interpolation function in the style spec:\n    // https://github.com/mapbox/mapbox-gl-js/blob/master/src/style-spec/expression/definitions/interpolate.js#L217-L228\n    // so that higher intensity values create more opaque hillshading.\n    float base = 1.875 - intensity * 1.75;\n    float maxValue = 0.5 * PI;\n    float scaledSlope = intensity != 0.5 ? ((pow(base, slope) - 1.0) / (pow(base, maxValue) - 1.0)) * maxValue : slope;\n\n    // The accent color is calculated with the cosine of the slope while the shade color is calculated with the sine\n    // so that the accent color's rate of change eases in while the shade color's eases out.\n    float accent = cos(scaledSlope);\n    // We multiply both the accent and shade color by a clamped intensity value\n    // so that intensities >= 0.5 do not additionally affect the color values\n    // while intensity values < 0.5 make the overall color more transparent.\n    vec4 accent_color = (1.0 - accent) * u_accent * clamp(intensity * 2.0, 0.0, 1.0);\n    float shade = abs(mod((aspect + azimuth) / PI + 0.5, 2.0) - 1.0);\n    vec4 shade_color = mix(u_shadow, u_highlight, shade) * sin(scaledSlope) * clamp(intensity * 2.0, 0.0, 1.0);\n    gl_FragColor = accent_color * (1.0 - shade_color.a) + shade_color;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\n\nattribute vec2 a_pos;\nattribute vec2 a_texture_pos;\n\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos = a_texture_pos / 8192.0;\n}\n"},line:{fragmentSource:"#pragma mapbox: define highp vec4 color\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n\nvarying vec2 v_width2;\nvarying vec2 v_normal;\nvarying float v_gamma_scale;\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 color\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * v_width2.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_width2.t) or when fading out\n    // (v_width2.s)\n    float blur2 = (blur + 1.0 / DEVICE_PIXEL_RATIO) * v_gamma_scale;\n    float alpha = clamp(min(dist - (v_width2.t - blur2), v_width2.s - dist) / blur2, 0.0, 1.0);\n\n    gl_FragColor = color * (alpha * opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"\n\n// the distance over which the line edge fades out.\n// Retina devices need a smaller distance to avoid aliasing.\n#define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\nattribute vec4 a_pos_normal;\nattribute vec4 a_data;\n\nuniform mat4 u_matrix;\nuniform mediump float u_ratio;\nuniform vec2 u_gl_units_to_pixels;\n\nvarying vec2 v_normal;\nvarying vec2 v_width2;\nvarying float v_gamma_scale;\nvarying highp float v_linesofar;\n\n#pragma mapbox: define highp vec4 color\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n#pragma mapbox: define mediump float gapwidth\n#pragma mapbox: define lowp float offset\n#pragma mapbox: define mediump float width\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 color\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n    #pragma mapbox: initialize mediump float gapwidth\n    #pragma mapbox: initialize lowp float offset\n    #pragma mapbox: initialize mediump float width\n\n    vec2 a_extrude = a_data.xy - 128.0;\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\n\n    v_linesofar = (floor(a_data.z / 4.0) + a_data.w * 64.0) * 2.0;\n\n    vec2 pos = a_pos_normal.xy;\n\n    // x is 1 if it's a round cap, 0 otherwise\n    // y is 1 if the normal points up, and -1 if it points down\n    mediump vec2 normal = a_pos_normal.zw;\n    v_normal = normal;\n\n    // these transformations used to be applied in the JS and native code bases.\n    // moved them into the shader for clarity and simplicity.\n    gapwidth = gapwidth / 2.0;\n    float halfwidth = width / 2.0;\n    offset = -1.0 * offset;\n\n    float inset = gapwidth + (gapwidth > 0.0 ? ANTIALIASING : 0.0);\n    float outset = gapwidth + halfwidth * (gapwidth > 0.0 ? 2.0 : 1.0) + (halfwidth == 0.0 ? 0.0 : ANTIALIASING);\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    mediump vec2 dist = outset * a_extrude * scale;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    mediump float u = 0.5 * a_direction;\n    mediump float t = 1.0 - abs(u);\n    mediump vec2 offset2 = offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    vec4 projected_extrude = u_matrix * vec4(dist / u_ratio, 0.0, 0.0);\n    gl_Position = u_matrix * vec4(pos + offset2 / u_ratio, 0.0, 1.0) + projected_extrude;\n\n    // calculate how much the perspective view squishes or stretches the extrude\n    float extrude_length_without_perspective = length(dist);\n    float extrude_length_with_perspective = length(projected_extrude.xy / gl_Position.w * u_gl_units_to_pixels);\n    v_gamma_scale = extrude_length_without_perspective / extrude_length_with_perspective;\n\n    v_width2 = vec2(outset, inset);\n}\n"},lineGradient:{fragmentSource:"\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n\nuniform sampler2D u_image;\n\nvarying vec2 v_width2;\nvarying vec2 v_normal;\nvarying float v_gamma_scale;\nvarying highp float v_lineprogress;\n\nvoid main() {\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * v_width2.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_width2.t) or when fading out\n    // (v_width2.s)\n    float blur2 = (blur + 1.0 / DEVICE_PIXEL_RATIO) * v_gamma_scale;\n    float alpha = clamp(min(dist - (v_width2.t - blur2), v_width2.s - dist) / blur2, 0.0, 1.0);\n\n    // For gradient lines, v_lineprogress is the ratio along the entire line,\n    // scaled to [0, 2^15), and the gradient ramp is stored in a texture.\n    vec4 color = texture2D(u_image, vec2(v_lineprogress, 0.5));\n\n    gl_FragColor = color * (alpha * opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"\n// the attribute conveying progress along a line is scaled to [0, 2^15)\n#define MAX_LINE_DISTANCE 32767.0\n\n// the distance over which the line edge fades out.\n// Retina devices need a smaller distance to avoid aliasing.\n#define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\nattribute vec4 a_pos_normal;\nattribute vec4 a_data;\n\nuniform mat4 u_matrix;\nuniform mediump float u_ratio;\nuniform vec2 u_gl_units_to_pixels;\n\nvarying vec2 v_normal;\nvarying vec2 v_width2;\nvarying float v_gamma_scale;\nvarying highp float v_lineprogress;\n\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n#pragma mapbox: define mediump float gapwidth\n#pragma mapbox: define lowp float offset\n#pragma mapbox: define mediump float width\n\nvoid main() {\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n    #pragma mapbox: initialize mediump float gapwidth\n    #pragma mapbox: initialize lowp float offset\n    #pragma mapbox: initialize mediump float width\n\n    vec2 a_extrude = a_data.xy - 128.0;\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\n\n    v_lineprogress = (floor(a_data.z / 4.0) + a_data.w * 64.0) * 2.0 / MAX_LINE_DISTANCE;\n\n    vec2 pos = a_pos_normal.xy;\n\n    // x is 1 if it's a round cap, 0 otherwise\n    // y is 1 if the normal points up, and -1 if it points down\n    mediump vec2 normal = a_pos_normal.zw;\n    v_normal = normal;\n\n    // these transformations used to be applied in the JS and native code bases.\n    // moved them into the shader for clarity and simplicity.\n    gapwidth = gapwidth / 2.0;\n    float halfwidth = width / 2.0;\n    offset = -1.0 * offset;\n\n    float inset = gapwidth + (gapwidth > 0.0 ? ANTIALIASING : 0.0);\n    float outset = gapwidth + halfwidth * (gapwidth > 0.0 ? 2.0 : 1.0) + (halfwidth == 0.0 ? 0.0 : ANTIALIASING);\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    mediump vec2 dist = outset * a_extrude * scale;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    mediump float u = 0.5 * a_direction;\n    mediump float t = 1.0 - abs(u);\n    mediump vec2 offset2 = offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    vec4 projected_extrude = u_matrix * vec4(dist / u_ratio, 0.0, 0.0);\n    gl_Position = u_matrix * vec4(pos + offset2 / u_ratio, 0.0, 1.0) + projected_extrude;\n\n    // calculate how much the perspective view squishes or stretches the extrude\n    float extrude_length_without_perspective = length(dist);\n    float extrude_length_with_perspective = length(projected_extrude.xy / gl_Position.w * u_gl_units_to_pixels);\n    v_gamma_scale = extrude_length_without_perspective / extrude_length_with_perspective;\n\n    v_width2 = vec2(outset, inset);\n}\n"},linePattern:{fragmentSource:"uniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform vec2 u_texsize;\nuniform float u_fade;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_normal;\nvarying vec2 v_width2;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * v_width2.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_width2.t) or when fading out\n    // (v_width2.s)\n    float blur2 = (blur + 1.0 / DEVICE_PIXEL_RATIO) * v_gamma_scale;\n    float alpha = clamp(min(dist - (v_width2.t - blur2), v_width2.s - dist) / blur2, 0.0, 1.0);\n\n    float x_a = mod(v_linesofar / u_pattern_size_a.x, 1.0);\n    float x_b = mod(v_linesofar / u_pattern_size_b.x, 1.0);\n\n    // v_normal.y is 0 at the midpoint of the line, -1 at the lower edge, 1 at the upper edge\n    // we clamp the line width outset to be between 0 and half the pattern height plus padding (2.0)\n    // to ensure we don't sample outside the designated symbol on the sprite sheet.\n    // 0.5 is added to shift the component to be bounded between 0 and 1 for interpolation of\n    // the texture coordinate\n    float y_a = 0.5 + (v_normal.y * clamp(v_width2.s, 0.0, (u_pattern_size_a.y + 2.0) / 2.0) / u_pattern_size_a.y);\n    float y_b = 0.5 + (v_normal.y * clamp(v_width2.s, 0.0, (u_pattern_size_b.y + 2.0) / 2.0) / u_pattern_size_b.y);\n    vec2 pos_a = mix(u_pattern_tl_a / u_texsize, u_pattern_br_a / u_texsize, vec2(x_a, y_a));\n    vec2 pos_b = mix(u_pattern_tl_b / u_texsize, u_pattern_br_b / u_texsize, vec2(x_b, y_b));\n\n    vec4 color = mix(texture2D(u_image, pos_a), texture2D(u_image, pos_b), u_fade);\n\n    gl_FragColor = color * alpha * opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\n// We scale the distance before adding it to the buffers so that we can store\n// long distances for long segments. Use this value to unscale the distance.\n#define LINE_DISTANCE_SCALE 2.0\n\n// the distance over which the line edge fades out.\n// Retina devices need a smaller distance to avoid aliasing.\n#define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0\n\nattribute vec4 a_pos_normal;\nattribute vec4 a_data;\n\nuniform mat4 u_matrix;\nuniform mediump float u_ratio;\nuniform vec2 u_gl_units_to_pixels;\n\nvarying vec2 v_normal;\nvarying vec2 v_width2;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n#pragma mapbox: define lowp float offset\n#pragma mapbox: define mediump float gapwidth\n#pragma mapbox: define mediump float width\n\nvoid main() {\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n    #pragma mapbox: initialize lowp float offset\n    #pragma mapbox: initialize mediump float gapwidth\n    #pragma mapbox: initialize mediump float width\n\n    vec2 a_extrude = a_data.xy - 128.0;\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\n    float a_linesofar = (floor(a_data.z / 4.0) + a_data.w * 64.0) * LINE_DISTANCE_SCALE;\n\n    vec2 pos = a_pos_normal.xy;\n\n    // x is 1 if it's a round cap, 0 otherwise\n    // y is 1 if the normal points up, and -1 if it points down\n    mediump vec2 normal = a_pos_normal.zw;\n    v_normal = normal;\n\n    // these transformations used to be applied in the JS and native code bases.\n    // moved them into the shader for clarity and simplicity.\n    gapwidth = gapwidth / 2.0;\n    float halfwidth = width / 2.0;\n    offset = -1.0 * offset;\n\n    float inset = gapwidth + (gapwidth > 0.0 ? ANTIALIASING : 0.0);\n    float outset = gapwidth + halfwidth * (gapwidth > 0.0 ? 2.0 : 1.0) + (halfwidth == 0.0 ? 0.0 : ANTIALIASING);\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    mediump vec2 dist = outset * a_extrude * scale;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    mediump float u = 0.5 * a_direction;\n    mediump float t = 1.0 - abs(u);\n    mediump vec2 offset2 = offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    vec4 projected_extrude = u_matrix * vec4(dist / u_ratio, 0.0, 0.0);\n    gl_Position = u_matrix * vec4(pos + offset2 / u_ratio, 0.0, 1.0) + projected_extrude;\n\n    // calculate how much the perspective view squishes or stretches the extrude\n    float extrude_length_without_perspective = length(dist);\n    float extrude_length_with_perspective = length(projected_extrude.xy / gl_Position.w * u_gl_units_to_pixels);\n    v_gamma_scale = extrude_length_without_perspective / extrude_length_with_perspective;\n\n    v_linesofar = a_linesofar;\n    v_width2 = vec2(outset, inset);\n}\n"},lineSDF:{fragmentSource:"\nuniform sampler2D u_image;\nuniform float u_sdfgamma;\nuniform float u_mix;\n\nvarying vec2 v_normal;\nvarying vec2 v_width2;\nvarying vec2 v_tex_a;\nvarying vec2 v_tex_b;\nvarying float v_gamma_scale;\n\n#pragma mapbox: define highp vec4 color\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n#pragma mapbox: define mediump float width\n#pragma mapbox: define lowp float floorwidth\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 color\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n    #pragma mapbox: initialize mediump float width\n    #pragma mapbox: initialize lowp float floorwidth\n\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * v_width2.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_width2.t) or when fading out\n    // (v_width2.s)\n    float blur2 = (blur + 1.0 / DEVICE_PIXEL_RATIO) * v_gamma_scale;\n    float alpha = clamp(min(dist - (v_width2.t - blur2), v_width2.s - dist) / blur2, 0.0, 1.0);\n\n    float sdfdist_a = texture2D(u_image, v_tex_a).a;\n    float sdfdist_b = texture2D(u_image, v_tex_b).a;\n    float sdfdist = mix(sdfdist_a, sdfdist_b, u_mix);\n    alpha *= smoothstep(0.5 - u_sdfgamma / floorwidth, 0.5 + u_sdfgamma / floorwidth, sdfdist);\n\n    gl_FragColor = color * (alpha * opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\n// We scale the distance before adding it to the buffers so that we can store\n// long distances for long segments. Use this value to unscale the distance.\n#define LINE_DISTANCE_SCALE 2.0\n\n// the distance over which the line edge fades out.\n// Retina devices need a smaller distance to avoid aliasing.\n#define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0\n\nattribute vec4 a_pos_normal;\nattribute vec4 a_data;\n\nuniform mat4 u_matrix;\nuniform mediump float u_ratio;\nuniform vec2 u_patternscale_a;\nuniform float u_tex_y_a;\nuniform vec2 u_patternscale_b;\nuniform float u_tex_y_b;\nuniform vec2 u_gl_units_to_pixels;\n\nvarying vec2 v_normal;\nvarying vec2 v_width2;\nvarying vec2 v_tex_a;\nvarying vec2 v_tex_b;\nvarying float v_gamma_scale;\n\n#pragma mapbox: define highp vec4 color\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n#pragma mapbox: define mediump float gapwidth\n#pragma mapbox: define lowp float offset\n#pragma mapbox: define mediump float width\n#pragma mapbox: define lowp float floorwidth\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 color\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n    #pragma mapbox: initialize mediump float gapwidth\n    #pragma mapbox: initialize lowp float offset\n    #pragma mapbox: initialize mediump float width\n    #pragma mapbox: initialize lowp float floorwidth\n\n    vec2 a_extrude = a_data.xy - 128.0;\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\n    float a_linesofar = (floor(a_data.z / 4.0) + a_data.w * 64.0) * LINE_DISTANCE_SCALE;\n\n    vec2 pos = a_pos_normal.xy;\n\n    // x is 1 if it's a round cap, 0 otherwise\n    // y is 1 if the normal points up, and -1 if it points down\n    mediump vec2 normal = a_pos_normal.zw;\n    v_normal = normal;\n\n    // these transformations used to be applied in the JS and native code bases.\n    // moved them into the shader for clarity and simplicity.\n    gapwidth = gapwidth / 2.0;\n    float halfwidth = width / 2.0;\n    offset = -1.0 * offset;\n\n    float inset = gapwidth + (gapwidth > 0.0 ? ANTIALIASING : 0.0);\n    float outset = gapwidth + halfwidth * (gapwidth > 0.0 ? 2.0 : 1.0) + (halfwidth == 0.0 ? 0.0 : ANTIALIASING);\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    mediump vec2 dist =outset * a_extrude * scale;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    mediump float u = 0.5 * a_direction;\n    mediump float t = 1.0 - abs(u);\n    mediump vec2 offset2 = offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    vec4 projected_extrude = u_matrix * vec4(dist / u_ratio, 0.0, 0.0);\n    gl_Position = u_matrix * vec4(pos + offset2 / u_ratio, 0.0, 1.0) + projected_extrude;\n\n    // calculate how much the perspective view squishes or stretches the extrude\n    float extrude_length_without_perspective = length(dist);\n    float extrude_length_with_perspective = length(projected_extrude.xy / gl_Position.w * u_gl_units_to_pixels);\n    v_gamma_scale = extrude_length_without_perspective / extrude_length_with_perspective;\n\n    v_tex_a = vec2(a_linesofar * u_patternscale_a.x / floorwidth, normal.y * u_patternscale_a.y + u_tex_y_a);\n    v_tex_b = vec2(a_linesofar * u_patternscale_b.x / floorwidth, normal.y * u_patternscale_b.y + u_tex_y_b);\n\n    v_width2 = vec2(outset, inset);\n}\n"},raster:{fragmentSource:"uniform float u_fade_t;\nuniform float u_opacity;\nuniform sampler2D u_image0;\nuniform sampler2D u_image1;\nvarying vec2 v_pos0;\nvarying vec2 v_pos1;\n\nuniform float u_brightness_low;\nuniform float u_brightness_high;\n\nuniform float u_saturation_factor;\nuniform float u_contrast_factor;\nuniform vec3 u_spin_weights;\n\nvoid main() {\n\n    // read and cross-fade colors from the main and parent tiles\n    vec4 color0 = texture2D(u_image0, v_pos0);\n    vec4 color1 = texture2D(u_image1, v_pos1);\n    if (color0.a > 0.0) {\n        color0.rgb = color0.rgb / color0.a;\n    }\n    if (color1.a > 0.0) {\n        color1.rgb = color1.rgb / color1.a;\n    }\n    vec4 color = mix(color0, color1, u_fade_t);\n    color.a *= u_opacity;\n    vec3 rgb = color.rgb;\n\n    // spin\n    rgb = vec3(\n        dot(rgb, u_spin_weights.xyz),\n        dot(rgb, u_spin_weights.zxy),\n        dot(rgb, u_spin_weights.yzx));\n\n    // saturation\n    float average = (color.r + color.g + color.b) / 3.0;\n    rgb += (average - rgb) * u_saturation_factor;\n\n    // contrast\n    rgb = (rgb - 0.5) * u_contrast_factor + 0.5;\n\n    // brightness\n    vec3 u_high_vec = vec3(u_brightness_low, u_brightness_low, u_brightness_low);\n    vec3 u_low_vec = vec3(u_brightness_high, u_brightness_high, u_brightness_high);\n\n    gl_FragColor = vec4(mix(u_high_vec, u_low_vec, rgb) * color.a, color.a);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"uniform mat4 u_matrix;\nuniform vec2 u_tl_parent;\nuniform float u_scale_parent;\nuniform float u_buffer_scale;\n\nattribute vec2 a_pos;\nattribute vec2 a_texture_pos;\n\nvarying vec2 v_pos0;\nvarying vec2 v_pos1;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    // We are using Int16 for texture position coordinates to give us enough precision for\n    // fractional coordinates. We use 8192 to scale the texture coordinates in the buffer\n    // as an arbitrarily high number to preserve adequate precision when rendering.\n    // This is also the same value as the EXTENT we are using for our tile buffer pos coordinates,\n    // so math for modifying either is consistent.\n    v_pos0 = (((a_texture_pos / 8192.0) - 0.5) / u_buffer_scale ) + 0.5;\n    v_pos1 = (v_pos0 * u_scale_parent) + u_tl_parent;\n}\n"},symbolIcon:{fragmentSource:"uniform sampler2D u_texture;\n\n#pragma mapbox: define lowp float opacity\n\nvarying vec2 v_tex;\nvarying float v_fade_opacity;\n\nvoid main() {\n    #pragma mapbox: initialize lowp float opacity\n\n    lowp float alpha = opacity * v_fade_opacity;\n    gl_FragColor = texture2D(u_texture, v_tex) * alpha;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"const float PI = 3.141592653589793;\n\nattribute vec4 a_pos_offset;\nattribute vec4 a_data;\nattribute vec3 a_projected_pos;\nattribute float a_fade_opacity;\n\nuniform bool u_is_size_zoom_constant;\nuniform bool u_is_size_feature_constant;\nuniform highp float u_size_t; // used to interpolate between zoom stops when size is a composite function\nuniform highp float u_size; // used when size is both zoom and feature constant\nuniform highp float u_camera_to_center_distance;\nuniform highp float u_pitch;\nuniform bool u_rotate_symbol;\nuniform highp float u_aspect_ratio;\nuniform float u_fade_change;\n\n#pragma mapbox: define lowp float opacity\n\nuniform mat4 u_matrix;\nuniform mat4 u_label_plane_matrix;\nuniform mat4 u_gl_coord_matrix;\n\nuniform bool u_is_text;\nuniform bool u_pitch_with_map;\n\nuniform vec2 u_texsize;\n\nvarying vec2 v_tex;\nvarying float v_fade_opacity;\n\nvoid main() {\n    #pragma mapbox: initialize lowp float opacity\n\n    vec2 a_pos = a_pos_offset.xy;\n    vec2 a_offset = a_pos_offset.zw;\n\n    vec2 a_tex = a_data.xy;\n    vec2 a_size = a_data.zw;\n\n    highp float segment_angle = -a_projected_pos[2];\n\n    float size;\n    if (!u_is_size_zoom_constant && !u_is_size_feature_constant) {\n        size = mix(a_size[0], a_size[1], u_size_t) / 10.0;\n    } else if (u_is_size_zoom_constant && !u_is_size_feature_constant) {\n        size = a_size[0] / 10.0;\n    } else if (!u_is_size_zoom_constant && u_is_size_feature_constant) {\n        size = u_size;\n    } else {\n        size = u_size;\n    }\n\n    vec4 projectedPoint = u_matrix * vec4(a_pos, 0, 1);\n    highp float camera_to_anchor_distance = projectedPoint.w;\n    // See comments in symbol_sdf.vertex\n    highp float distance_ratio = u_pitch_with_map ?\n        camera_to_anchor_distance / u_camera_to_center_distance :\n        u_camera_to_center_distance / camera_to_anchor_distance;\n    highp float perspective_ratio = clamp(\n            0.5 + 0.5 * distance_ratio,\n            0.0, // Prevents oversized near-field symbols in pitched/overzoomed tiles\n            4.0);\n\n    size *= perspective_ratio;\n\n    float fontScale = u_is_text ? size / 24.0 : size;\n\n    highp float symbol_rotation = 0.0;\n    if (u_rotate_symbol) {\n        // See comments in symbol_sdf.vertex\n        vec4 offsetProjectedPoint = u_matrix * vec4(a_pos + vec2(1, 0), 0, 1);\n\n        vec2 a = projectedPoint.xy / projectedPoint.w;\n        vec2 b = offsetProjectedPoint.xy / offsetProjectedPoint.w;\n\n        symbol_rotation = atan((b.y - a.y) / u_aspect_ratio, b.x - a.x);\n    }\n\n    highp float angle_sin = sin(segment_angle + symbol_rotation);\n    highp float angle_cos = cos(segment_angle + symbol_rotation);\n    mat2 rotation_matrix = mat2(angle_cos, -1.0 * angle_sin, angle_sin, angle_cos);\n\n    vec4 projected_pos = u_label_plane_matrix * vec4(a_projected_pos.xy, 0.0, 1.0);\n    gl_Position = u_gl_coord_matrix * vec4(projected_pos.xy / projected_pos.w + rotation_matrix * (a_offset / 32.0 * fontScale), 0.0, 1.0);\n\n    v_tex = a_tex / u_texsize;\n    vec2 fade_opacity = unpack_opacity(a_fade_opacity);\n    float fade_change = fade_opacity[1] > 0.5 ? u_fade_change : -u_fade_change;\n    v_fade_opacity = max(0.0, min(1.0, fade_opacity[0] + fade_change));\n}\n"},symbolSDF:{fragmentSource:"#define SDF_PX 8.0\n#define EDGE_GAMMA 0.105/DEVICE_PIXEL_RATIO\n\nuniform bool u_is_halo;\n#pragma mapbox: define highp vec4 fill_color\n#pragma mapbox: define highp vec4 halo_color\n#pragma mapbox: define lowp float opacity\n#pragma mapbox: define lowp float halo_width\n#pragma mapbox: define lowp float halo_blur\n\nuniform sampler2D u_texture;\nuniform highp float u_gamma_scale;\nuniform bool u_is_text;\n\nvarying vec2 v_data0;\nvarying vec3 v_data1;\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 fill_color\n    #pragma mapbox: initialize highp vec4 halo_color\n    #pragma mapbox: initialize lowp float opacity\n    #pragma mapbox: initialize lowp float halo_width\n    #pragma mapbox: initialize lowp float halo_blur\n\n    vec2 tex = v_data0.xy;\n    float gamma_scale = v_data1.x;\n    float size = v_data1.y;\n    float fade_opacity = v_data1[2];\n\n    float fontScale = u_is_text ? size / 24.0 : size;\n\n    lowp vec4 color = fill_color;\n    highp float gamma = EDGE_GAMMA / (fontScale * u_gamma_scale);\n    lowp float buff = (256.0 - 64.0) / 256.0;\n    if (u_is_halo) {\n        color = halo_color;\n        gamma = (halo_blur * 1.19 / SDF_PX + EDGE_GAMMA) / (fontScale * u_gamma_scale);\n        buff = (6.0 - halo_width / fontScale) / SDF_PX;\n    }\n\n    lowp float dist = texture2D(u_texture, tex).a;\n    highp float gamma_scaled = gamma * gamma_scale;\n    highp float alpha = smoothstep(buff - gamma_scaled, buff + gamma_scaled, dist);\n\n    gl_FragColor = color * (alpha * opacity * fade_opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",vertexSource:"const float PI = 3.141592653589793;\n\nattribute vec4 a_pos_offset;\nattribute vec4 a_data;\nattribute vec3 a_projected_pos;\nattribute float a_fade_opacity;\n\n// contents of a_size vary based on the type of property value\n// used for {text,icon}-size.\n// For constants, a_size is disabled.\n// For source functions, we bind only one value per vertex: the value of {text,icon}-size evaluated for the current feature.\n// For composite functions:\n// [ text-size(lowerZoomStop, feature),\n//   text-size(upperZoomStop, feature) ]\nuniform bool u_is_size_zoom_constant;\nuniform bool u_is_size_feature_constant;\nuniform highp float u_size_t; // used to interpolate between zoom stops when size is a composite function\nuniform highp float u_size; // used when size is both zoom and feature constant\n\n#pragma mapbox: define highp vec4 fill_color\n#pragma mapbox: define highp vec4 halo_color\n#pragma mapbox: define lowp float opacity\n#pragma mapbox: define lowp float halo_width\n#pragma mapbox: define lowp float halo_blur\n\nuniform mat4 u_matrix;\nuniform mat4 u_label_plane_matrix;\nuniform mat4 u_gl_coord_matrix;\n\nuniform bool u_is_text;\nuniform bool u_pitch_with_map;\nuniform highp float u_pitch;\nuniform bool u_rotate_symbol;\nuniform highp float u_aspect_ratio;\nuniform highp float u_camera_to_center_distance;\nuniform float u_fade_change;\n\nuniform vec2 u_texsize;\n\nvarying vec2 v_data0;\nvarying vec3 v_data1;\n\nvoid main() {\n    #pragma mapbox: initialize highp vec4 fill_color\n    #pragma mapbox: initialize highp vec4 halo_color\n    #pragma mapbox: initialize lowp float opacity\n    #pragma mapbox: initialize lowp float halo_width\n    #pragma mapbox: initialize lowp float halo_blur\n\n    vec2 a_pos = a_pos_offset.xy;\n    vec2 a_offset = a_pos_offset.zw;\n\n    vec2 a_tex = a_data.xy;\n    vec2 a_size = a_data.zw;\n\n    highp float segment_angle = -a_projected_pos[2];\n    float size;\n\n    if (!u_is_size_zoom_constant && !u_is_size_feature_constant) {\n        size = mix(a_size[0], a_size[1], u_size_t) / 10.0;\n    } else if (u_is_size_zoom_constant && !u_is_size_feature_constant) {\n        size = a_size[0] / 10.0;\n    } else if (!u_is_size_zoom_constant && u_is_size_feature_constant) {\n        size = u_size;\n    } else {\n        size = u_size;\n    }\n\n    vec4 projectedPoint = u_matrix * vec4(a_pos, 0, 1);\n    highp float camera_to_anchor_distance = projectedPoint.w;\n    // If the label is pitched with the map, layout is done in pitched space,\n    // which makes labels in the distance smaller relative to viewport space.\n    // We counteract part of that effect by multiplying by the perspective ratio.\n    // If the label isn't pitched with the map, we do layout in viewport space,\n    // which makes labels in the distance larger relative to the features around\n    // them. We counteract part of that effect by dividing by the perspective ratio.\n    highp float distance_ratio = u_pitch_with_map ?\n        camera_to_anchor_distance / u_camera_to_center_distance :\n        u_camera_to_center_distance / camera_to_anchor_distance;\n    highp float perspective_ratio = clamp(\n        0.5 + 0.5 * distance_ratio,\n        0.0, // Prevents oversized near-field symbols in pitched/overzoomed tiles\n        4.0);\n\n    size *= perspective_ratio;\n\n    float fontScale = u_is_text ? size / 24.0 : size;\n\n    highp float symbol_rotation = 0.0;\n    if (u_rotate_symbol) {\n        // Point labels with 'rotation-alignment: map' are horizontal with respect to tile units\n        // To figure out that angle in projected space, we draw a short horizontal line in tile\n        // space, project it, and measure its angle in projected space.\n        vec4 offsetProjectedPoint = u_matrix * vec4(a_pos + vec2(1, 0), 0, 1);\n\n        vec2 a = projectedPoint.xy / projectedPoint.w;\n        vec2 b = offsetProjectedPoint.xy / offsetProjectedPoint.w;\n\n        symbol_rotation = atan((b.y - a.y) / u_aspect_ratio, b.x - a.x);\n    }\n\n    highp float angle_sin = sin(segment_angle + symbol_rotation);\n    highp float angle_cos = cos(segment_angle + symbol_rotation);\n    mat2 rotation_matrix = mat2(angle_cos, -1.0 * angle_sin, angle_sin, angle_cos);\n\n    vec4 projected_pos = u_label_plane_matrix * vec4(a_projected_pos.xy, 0.0, 1.0);\n    gl_Position = u_gl_coord_matrix * vec4(projected_pos.xy / projected_pos.w + rotation_matrix * (a_offset / 32.0 * fontScale), 0.0, 1.0);\n    float gamma_scale = gl_Position.w;\n\n    vec2 tex = a_tex / u_texsize;\n    vec2 fade_opacity = unpack_opacity(a_fade_opacity);\n    float fade_change = fade_opacity[1] > 0.5 ? u_fade_change : -u_fade_change;\n    float interpolated_fade_opacity = max(0.0, min(1.0, fade_opacity[0] + fade_change));\n\n    v_data0 = vec2(tex.x, tex.y);\n    v_data1 = vec3(gamma_scale, size, interpolated_fade_opacity);\n}\n"}},je=/#pragma mapbox: ([\w]+) ([\w]+) ([\w]+) ([\w]+)/g,Ge=function(t){var e=Ve[t],i={};e.fragmentSource=e.fragmentSource.replace(je,function(t,e,n,o,r){return i[r]=!0,"define"===e?"\n#ifndef HAS_UNIFORM_u_"+r+"\nvarying "+n+" "+o+" "+r+";\n#else\nuniform "+n+" "+o+" u_"+r+";\n#endif\n":"\n#ifdef HAS_UNIFORM_u_"+r+"\n    "+n+" "+o+" "+r+" = u_"+r+";\n#endif\n"}),e.vertexSource=e.vertexSource.replace(je,function(t,e,n,o,r){var a="float"===o?"vec2":"vec4";return i[r]?"define"===e?"\n#ifndef HAS_UNIFORM_u_"+r+"\nuniform lowp float a_"+r+"_t;\nattribute "+n+" "+a+" a_"+r+";\nvarying "+n+" "+o+" "+r+";\n#else\nuniform "+n+" "+o+" u_"+r+";\n#endif\n":"\n#ifndef HAS_UNIFORM_u_"+r+"\n    "+r+" = unpack_mix_"+a+"(a_"+r+", a_"+r+"_t);\n#else\n    "+n+" "+o+" "+r+" = u_"+r+";\n#endif\n":"define"===e?"\n#ifndef HAS_UNIFORM_u_"+r+"\nuniform lowp float a_"+r+"_t;\nattribute "+n+" "+a+" a_"+r+";\n#else\nuniform "+n+" "+o+" u_"+r+";\n#endif\n":"\n#ifndef HAS_UNIFORM_u_"+r+"\n    "+n+" "+o+" "+r+" = unpack_mix_"+a+"(a_"+r+", a_"+r+"_t);\n#else\n    "+n+" "+o+" "+r+" = u_"+r+";\n#endif\n"});};for(var We in Ve)Ge(We);var qe=Ve,Xe=function(e,i,n,o){var r=e.gl;this.program=r.createProgram();var a=n.defines().concat("#define DEVICE_PIXEL_RATIO "+t.default$2.devicePixelRatio.toFixed(1));o&&a.push("#define OVERDRAW_INSPECTOR;");var s=a.concat(qe.prelude.fragmentSource,i.fragmentSource).join("\n"),l=a.concat(qe.prelude.vertexSource,i.vertexSource).join("\n"),c=r.createShader(r.FRAGMENT_SHADER);r.shaderSource(c,s),r.compileShader(c),r.attachShader(this.program,c);var u=r.createShader(r.VERTEX_SHADER);r.shaderSource(u,l),r.compileShader(u),r.attachShader(this.program,u);for(var h=n.layoutAttributes||[],p=0;p<h.length;p++)r.bindAttribLocation(this.program,p,h[p].name);r.linkProgram(this.program),this.numAttributes=r.getProgramParameter(this.program,r.ACTIVE_ATTRIBUTES),this.attributes={},this.uniforms={};for(var d=0;d<this.numAttributes;d++){var f=r.getActiveAttrib(this.program,d);f&&(this.attributes[f.name]=r.getAttribLocation(this.program,f.name));}for(var m=r.getProgramParameter(this.program,r.ACTIVE_UNIFORMS),_=0;_<m;_++){var g=r.getActiveUniform(this.program,_);g&&(this.uniforms[g.name]=r.getUniformLocation(this.program,g.name));}};function He(e,i,n,o,r){for(var a=0;a<n.length;a++){var s=n[a];if(o.isLessThan(s.tileID))break;if(i.key===s.tileID.key)return;if(s.tileID.isChildOf(i)){for(var l=i.children(1/0),c=0;c<l.length;c++){He(e,l[c],n.slice(a),o,r);}return}}var u=i.overscaledZ-e.overscaledZ,h=new t.CanonicalTileID(u,i.canonical.x-(e.canonical.x<<u),i.canonical.y-(e.canonical.y<<u));r[h.key]=r[h.key]||h;}function Ke(t,e,i,n,o){var r=t.context,a=r.gl,s=o?t.useProgram("collisionCircle"):t.useProgram("collisionBox");r.setDepthMode(Rt.disabled),r.setStencilMode(Dt.disabled),r.setColorMode(t.colorModeForRenderPass());for(var l=0;l<n.length;l++){var c=n[l],u=e.getTile(c),h=u.getBucket(i);if(h){var p=o?h.collisionCircle:h.collisionBox;if(p){a.uniformMatrix4fv(s.uniforms.u_matrix,!1,c.posMatrix),a.uniform1f(s.uniforms.u_camera_to_center_distance,t.transform.cameraToCenterDistance);var d=me(u,1,t.transform.zoom),f=Math.pow(2,t.transform.zoom-u.tileID.overscaledZ);a.uniform1f(s.uniforms.u_pixels_to_tile_units,d),a.uniform2f(s.uniforms.u_extrude_scale,t.transform.pixelsToGLUnits[0]/(d*f),t.transform.pixelsToGLUnits[1]/(d*f)),a.uniform1f(s.uniforms.u_overscale_factor,u.tileID.overscaleFactor()),s.draw(r,o?a.TRIANGLES:a.LINES,i.id,p.layoutVertexBuffer,p.indexBuffer,p.segments,null,p.collisionVertexBuffer,null);}}}}Xe.prototype.draw=function(t,e,i,n,o,r,a,s,l){for(var c,u=t.gl,h=(c={},c[u.LINES]=2,c[u.TRIANGLES]=3,c)[e],p=0,d=r.get();p<d.length;p+=1){var f=d[p],m=f.vaos||(f.vaos={});(m[i]||(m[i]=new V)).bind(t,this,n,a?a.getPaintVertexBuffers():[],o,f.vertexOffset,s,l),u.drawElements(e,f.primitiveLength*h,u.UNSIGNED_SHORT,f.primitiveOffset*h*2);}};var Ye=t.identity(new Float32Array(16)),Je=t.default$18.layout;function Qe(t,e,i,n,o,r,a,s,l,c){var u,h=t.context,p=h.gl,d=t.transform,f="map"===s,m="map"===l,_=f&&"point"!==i.layout.get("symbol-placement"),g=f&&!m&&!_,v=m;h.setDepthMode(v?t.depthModeForSublayer(0,Rt.ReadOnly):Rt.disabled);for(var y=0,x=n;y<x.length;y+=1){var b=x[y],w=e.getTile(b),E=w.getBucket(i);if(E){var T=o?E.text:E.icon;if(T&&T.segments.get().length){var I=T.programConfigurations.get(i.id),C=o||E.sdfIcons,S=o?E.textSizeData:E.iconSizeData;if(u||(u=t.useProgram(C?"symbolSDF":"symbolIcon",I),I.setUniforms(t.context,u,i.paint,{zoom:t.transform.zoom}),ti(u,t,i,o,g,m,S)),h.activeTexture.set(p.TEXTURE0),p.uniform1i(u.uniforms.u_texture,0),o)w.glyphAtlasTexture.bind(p.LINEAR,p.CLAMP_TO_EDGE),p.uniform2fv(u.uniforms.u_texsize,w.glyphAtlasTexture.size);else{var z=1!==i.layout.get("icon-size").constantOr(0)||E.iconsNeedLinear,A=m||0!==d.pitch;w.iconAtlasTexture.bind(C||t.options.rotating||t.options.zooming||z||A?p.LINEAR:p.NEAREST,p.CLAMP_TO_EDGE),p.uniform2fv(u.uniforms.u_texsize,w.iconAtlasTexture.size);}p.uniformMatrix4fv(u.uniforms.u_matrix,!1,t.translatePosMatrix(b.posMatrix,w,r,a));var M=me(w,1,t.transform.zoom),R=te(b.posMatrix,m,f,t.transform,M),D=ee(b.posMatrix,m,f,t.transform,M);p.uniformMatrix4fv(u.uniforms.u_gl_coord_matrix,!1,t.translatePosMatrix(D,w,r,a,!0)),_?(p.uniformMatrix4fv(u.uniforms.u_label_plane_matrix,!1,Ye),oe(E,b.posMatrix,t,o,R,D,m,c)):p.uniformMatrix4fv(u.uniforms.u_label_plane_matrix,!1,R),p.uniform1f(u.uniforms.u_fade_change,t.options.fadeDuration?t.symbolFadeChange:1),ei(u,I,t,i,w,T,o,C,m);}}}}function ti(e,i,n,o,r,a,s){var l=i.context.gl,c=i.transform;l.uniform1i(e.uniforms.u_pitch_with_map,a?1:0),l.uniform1f(e.uniforms.u_is_text,o?1:0),l.uniform1f(e.uniforms.u_pitch,c.pitch/360*2*Math.PI);var u="constant"===s.functionType||"source"===s.functionType,h="constant"===s.functionType||"camera"===s.functionType;l.uniform1i(e.uniforms.u_is_size_zoom_constant,u?1:0),l.uniform1i(e.uniforms.u_is_size_feature_constant,h?1:0),l.uniform1f(e.uniforms.u_camera_to_center_distance,c.cameraToCenterDistance);var p=t.evaluateSizeForZoom(s,c.zoom,Je.properties[o?"text-size":"icon-size"]);void 0!==p.uSizeT&&l.uniform1f(e.uniforms.u_size_t,p.uSizeT),void 0!==p.uSize&&l.uniform1f(e.uniforms.u_size,p.uSize),l.uniform1f(e.uniforms.u_aspect_ratio,c.width/c.height),l.uniform1i(e.uniforms.u_rotate_symbol,r?1:0);}function ei(t,e,i,n,o,r,a,s,l){var c=i.context,u=c.gl,h=i.transform;if(s){var p=0!==n.paint.get(a?"text-halo-width":"icon-halo-width").constantOr(1),d=l?Math.cos(h._pitch)*h.cameraToCenterDistance:1;u.uniform1f(t.uniforms.u_gamma_scale,d),p&&(u.uniform1f(t.uniforms.u_is_halo,1),ii(r,n,c,t)),u.uniform1f(t.uniforms.u_is_halo,0);}ii(r,n,c,t);}function ii(t,e,i,n){n.draw(i,i.gl.TRIANGLES,e.id,t.layoutVertexBuffer,t.indexBuffer,t.segments,t.programConfigurations.get(e.id),t.dynamicLayoutVertexBuffer,t.opacityVertexBuffer);}function ni(e,i,n,o,r,a,s,l,c){var u,h,p,d,f=i.context,m=f.gl,_=r.paint.get("line-dasharray"),g=r.paint.get("line-pattern");if(l||c){var v=1/me(n,1,i.transform.tileZoom);if(_){u=i.lineAtlas.getDash(_.from,"round"===r.layout.get("line-cap")),h=i.lineAtlas.getDash(_.to,"round"===r.layout.get("line-cap"));var y=u.width*_.fromScale,x=h.width*_.toScale;m.uniform2f(e.uniforms.u_patternscale_a,v/y,-u.height/2),m.uniform2f(e.uniforms.u_patternscale_b,v/x,-h.height/2),m.uniform1f(e.uniforms.u_sdfgamma,i.lineAtlas.width/(256*Math.min(y,x)*t.default$2.devicePixelRatio)/2);}else if(g){if(p=i.imageManager.getPattern(g.from),d=i.imageManager.getPattern(g.to),!p||!d)return;m.uniform2f(e.uniforms.u_pattern_size_a,p.displaySize[0]*g.fromScale/v,p.displaySize[1]),m.uniform2f(e.uniforms.u_pattern_size_b,d.displaySize[0]*g.toScale/v,d.displaySize[1]);var b=i.imageManager.getPixelSize(),w=b.width,E=b.height;m.uniform2fv(e.uniforms.u_texsize,[w,E]);}m.uniform2f(e.uniforms.u_gl_units_to_pixels,1/i.transform.pixelsToGLUnits[0],1/i.transform.pixelsToGLUnits[1]);}l&&(_?(m.uniform1i(e.uniforms.u_image,0),f.activeTexture.set(m.TEXTURE0),i.lineAtlas.bind(f),m.uniform1f(e.uniforms.u_tex_y_a,u.y),m.uniform1f(e.uniforms.u_tex_y_b,h.y),m.uniform1f(e.uniforms.u_mix,_.t)):g&&(m.uniform1i(e.uniforms.u_image,0),f.activeTexture.set(m.TEXTURE0),i.imageManager.bind(f),m.uniform2fv(e.uniforms.u_pattern_tl_a,p.tl),m.uniform2fv(e.uniforms.u_pattern_br_a,p.br),m.uniform2fv(e.uniforms.u_pattern_tl_b,d.tl),m.uniform2fv(e.uniforms.u_pattern_br_b,d.br),m.uniform1f(e.uniforms.u_fade,g.t))),f.setStencilMode(i.stencilModeForClipping(a));var T=i.translatePosMatrix(a.posMatrix,n,r.paint.get("line-translate"),r.paint.get("line-translate-anchor"));if(m.uniformMatrix4fv(e.uniforms.u_matrix,!1,T),m.uniform1f(e.uniforms.u_ratio,1/me(n,1,i.transform.zoom)),r.paint.get("line-gradient")){f.activeTexture.set(m.TEXTURE0);var I=r.gradientTexture;if(!r.gradient)return;I||(I=r.gradientTexture=new t.default$4(f,r.gradient,m.RGBA)),I.bind(m.LINEAR,m.CLAMP_TO_EDGE),m.uniform1i(e.uniforms.u_image,0);}e.draw(f,m.TRIANGLES,r.id,o.layoutVertexBuffer,o.indexBuffer,o.segments,s);}var oi=function(t,e){if(!t)return!1;var i=e.imageManager.getPattern(t.from),n=e.imageManager.getPattern(t.to);return!i||!n},ri=function(t,e,i){var n=e.context,o=n.gl,r=e.imageManager.getPattern(t.from),a=e.imageManager.getPattern(t.to);o.uniform1i(i.uniforms.u_image,0),o.uniform2fv(i.uniforms.u_pattern_tl_a,r.tl),o.uniform2fv(i.uniforms.u_pattern_br_a,r.br),o.uniform2fv(i.uniforms.u_pattern_tl_b,a.tl),o.uniform2fv(i.uniforms.u_pattern_br_b,a.br);var s=e.imageManager.getPixelSize(),l=s.width,c=s.height;o.uniform2fv(i.uniforms.u_texsize,[l,c]),o.uniform1f(i.uniforms.u_mix,t.t),o.uniform2fv(i.uniforms.u_pattern_size_a,r.displaySize),o.uniform2fv(i.uniforms.u_pattern_size_b,a.displaySize),o.uniform1f(i.uniforms.u_scale_a,t.fromScale),o.uniform1f(i.uniforms.u_scale_b,t.toScale),n.activeTexture.set(o.TEXTURE0),e.imageManager.bind(e.context);},ai=function(t,e,i){var n=e.context.gl;n.uniform1f(i.uniforms.u_tile_units_to_pixels,1/me(t,1,e.transform.tileZoom));var o=Math.pow(2,t.tileID.overscaledZ),r=t.tileSize*Math.pow(2,e.transform.tileZoom)/o,a=r*(t.tileID.canonical.x+t.tileID.wrap*o),s=r*t.tileID.canonical.y;n.uniform2f(i.uniforms.u_pixel_coord_upper,a>>16,s>>16),n.uniform2f(i.uniforms.u_pixel_coord_lower,65535&a,65535&s);};function si(t,e,i,n,o){if(!oi(i.paint.get("fill-pattern"),t))for(var r=!0,a=0,s=n;a<s.length;a+=1){var l=s[a],c=e.getTile(l),u=c.getBucket(i);u&&(t.context.setStencilMode(t.stencilModeForClipping(l)),o(t,e,i,c,l,u,r),r=!1);}}function li(t,e,i,n,o,r,a){var s=t.context.gl,l=r.programConfigurations.get(i.id);ui("fill",i.paint.get("fill-pattern"),t,l,i,n,o,a).draw(t.context,s.TRIANGLES,i.id,r.layoutVertexBuffer,r.indexBuffer,r.segments,l);}function ci(t,e,i,n,o,r,a){var s=t.context.gl,l=r.programConfigurations.get(i.id),c=ui("fillOutline",i.getPaintProperty("fill-outline-color")?null:i.paint.get("fill-pattern"),t,l,i,n,o,a);s.uniform2f(c.uniforms.u_world,s.drawingBufferWidth,s.drawingBufferHeight),c.draw(t.context,s.LINES,i.id,r.layoutVertexBuffer,r.indexBuffer2,r.segments2,l);}function ui(t,e,i,n,o,r,a,s){var l,c=i.context.program.get();return e?(l=i.useProgram(t+"Pattern",n),(s||l.program!==c)&&(n.setUniforms(i.context,l,o.paint,{zoom:i.transform.zoom}),ri(e,i,l)),ai(r,i,l)):(l=i.useProgram(t,n),(s||l.program!==c)&&n.setUniforms(i.context,l,o.paint,{zoom:i.transform.zoom})),i.context.gl.uniformMatrix4fv(l.uniforms.u_matrix,!1,i.translatePosMatrix(a.posMatrix,r,o.paint.get("fill-translate"),o.paint.get("fill-translate-anchor"))),l}function hi(e,i,n,o,r,a,s){var l=e.context,c=l.gl,u=n.paint.get("fill-extrusion-pattern"),h=e.context.program.get(),p=a.programConfigurations.get(n.id),d=e.useProgram(u?"fillExtrusionPattern":"fillExtrusion",p);if((s||d.program!==h)&&p.setUniforms(l,d,n.paint,{zoom:e.transform.zoom}),u){if(oi(u,e))return;ri(u,e,d),ai(o,e,d),c.uniform1f(d.uniforms.u_height_factor,-Math.pow(2,r.overscaledZ)/o.tileSize/8);}e.context.gl.uniformMatrix4fv(d.uniforms.u_matrix,!1,e.translatePosMatrix(r.posMatrix,o,n.paint.get("fill-extrusion-translate"),n.paint.get("fill-extrusion-translate-anchor"))),function(e,i){var n=i.context.gl,o=i.style.light,r=o.properties.get("position"),a=[r.x,r.y,r.z],s=t.create$2();"viewport"===o.properties.get("anchor")&&t.fromRotation(s,-i.transform.angle);t.transformMat3(a,a,s);var l=o.properties.get("color");n.uniform3fv(e.uniforms.u_lightpos,a),n.uniform1f(e.uniforms.u_lightintensity,o.properties.get("intensity")),n.uniform3f(e.uniforms.u_lightcolor,l.r,l.g,l.b);}(d,e),d.draw(l,c.TRIANGLES,n.id,a.layoutVertexBuffer,a.indexBuffer,a.segments,p);}function pi(e,i,n){var o=e.context,r=o.gl,a=i.fbo;if(a){var s=e.useProgram("hillshade"),l=e.transform.calculatePosMatrix(i.tileID.toUnwrapped(),!0);!function(t,e,i){var n=i.paint.get("hillshade-illumination-direction")*(Math.PI/180);"viewport"===i.paint.get("hillshade-illumination-anchor")&&(n-=e.transform.angle),e.context.gl.uniform2f(t.uniforms.u_light,i.paint.get("hillshade-exaggeration"),n);}(s,e,n);var c=function(e,i){var n=i.toCoordinate(),o=new t.default$15(n.column,n.row+1,n.zoom);return[e.transform.coordinateLocation(n).lat,e.transform.coordinateLocation(o).lat]}(e,i.tileID);o.activeTexture.set(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,a.colorAttachment.get()),r.uniformMatrix4fv(s.uniforms.u_matrix,!1,l),r.uniform2fv(s.uniforms.u_latrange,c),r.uniform1i(s.uniforms.u_image,0);var u=n.paint.get("hillshade-shadow-color");r.uniform4f(s.uniforms.u_shadow,u.r,u.g,u.b,u.a);var h=n.paint.get("hillshade-highlight-color");r.uniform4f(s.uniforms.u_highlight,h.r,h.g,h.b,h.a);var p=n.paint.get("hillshade-accent-color");if(r.uniform4f(s.uniforms.u_accent,p.r,p.g,p.b,p.a),i.maskedBoundsBuffer&&i.maskedIndexBuffer&&i.segments)s.draw(o,r.TRIANGLES,n.id,i.maskedBoundsBuffer,i.maskedIndexBuffer,i.segments);else{var d=e.rasterBoundsBuffer;e.rasterBoundsVAO.bind(o,s,d,[]),r.drawArrays(r.TRIANGLE_STRIP,0,d.length);}}}function di(e,i,n){var o=e.context,r=o.gl;if(i.dem&&i.dem.level){var a=i.dem.level.dim,s=i.dem.getPixels();if(o.activeTexture.set(r.TEXTURE1),o.pixelStoreUnpackPremultiplyAlpha.set(!1),i.demTexture=i.demTexture||e.getTileTexture(i.tileSize),i.demTexture){var l=i.demTexture;l.update(s,{premultiply:!1}),l.bind(r.NEAREST,r.CLAMP_TO_EDGE);}else i.demTexture=new t.default$4(o,s,r.RGBA,{premultiply:!1}),i.demTexture.bind(r.NEAREST,r.CLAMP_TO_EDGE);o.activeTexture.set(r.TEXTURE0);var c=i.fbo;if(!c){var u=new t.default$4(o,{width:a,height:a,data:null},r.RGBA);u.bind(r.LINEAR,r.CLAMP_TO_EDGE),(c=i.fbo=o.createFramebuffer(a,a)).colorAttachment.set(u.texture);}o.bindFramebuffer.set(c.framebuffer),o.viewport.set([0,0,a,a]);var h=t.create();t.ortho(h,0,t.default$10,-t.default$10,0,0,1),t.translate(h,h,[0,-t.default$10,0]);var p=e.useProgram("hillshadePrepare");r.uniformMatrix4fv(p.uniforms.u_matrix,!1,h),r.uniform1f(p.uniforms.u_zoom,i.tileID.overscaledZ),r.uniform2fv(p.uniforms.u_dimension,[2*a,2*a]),r.uniform1i(p.uniforms.u_image,1),r.uniform1f(p.uniforms.u_maxzoom,n);var d=e.rasterBoundsBuffer;e.rasterBoundsVAO.bind(o,p,d,[]),r.drawArrays(r.TRIANGLE_STRIP,0,d.length),i.needsHillshadePrepare=!1;}}function fi(e,i,n,o,r){var a=o.paint.get("raster-fade-duration");if(a>0){var s=t.default$2.now(),l=(s-e.timeAdded)/a,c=i?(s-i.timeAdded)/a:-1,u=n.getSource(),h=r.coveringZoomLevel({tileSize:u.tileSize,roundZoom:u.roundZoom}),p=!i||Math.abs(i.tileID.overscaledZ-h)>Math.abs(e.tileID.overscaledZ-h),d=p&&e.refreshedUponExpiration?1:t.clamp(p?l:1-c,0,1);return e.refreshedUponExpiration&&l>=1&&(e.refreshedUponExpiration=!1),i?{opacity:1,mix:1-d}:{opacity:d,mix:0}}return{opacity:1,mix:0}}function mi(e,i,n){var o=e.context,r=o.gl,a=n.posMatrix,s=e.useProgram("debug");o.setDepthMode(Rt.disabled),o.setStencilMode(Dt.disabled),o.setColorMode(e.colorModeForRenderPass()),r.uniformMatrix4fv(s.uniforms.u_matrix,!1,a),r.uniform4f(s.uniforms.u_color,1,0,0,1),e.debugVAO.bind(o,s,e.debugBuffer,[]),r.drawArrays(r.LINE_STRIP,0,e.debugBuffer.length);for(var l=function(t,e,i,n){n=n||1;var o,r,a,s,l,c,u,h,p=[];for(o=0,r=t.length;o<r;o++)if(l=_i[t[o]]){for(h=null,a=0,s=l[1].length;a<s;a+=2)-1===l[1][a]&&-1===l[1][a+1]?h=null:(c=e+l[1][a]*n,u=i-l[1][a+1]*n,h&&p.push(h.x,h.y,c,u),h={x:c,y:u});e+=l[0]*n;}return p}(n.toString(),50,200,5),c=new t.PosArray,u=0;u<l.length;u+=2)c.emplaceBack(l[u],l[u+1]);var h=o.createVertexBuffer(c,Ze.members);(new V).bind(o,s,h,[]),r.uniform4f(s.uniforms.u_color,1,1,1,1);for(var p=i.getTile(n).tileSize,d=t.default$10/(Math.pow(2,e.transform.zoom-n.overscaledZ)*p),f=[[-1,-1],[-1,1],[1,-1],[1,1]],m=0;m<f.length;m++){var _=f[m];r.uniformMatrix4fv(s.uniforms.u_matrix,!1,t.translate([],a,[d*_[0],d*_[1],0])),r.drawArrays(r.LINES,0,h.length);}r.uniform4f(s.uniforms.u_color,0,0,0,1),r.uniformMatrix4fv(s.uniforms.u_matrix,!1,a),r.drawArrays(r.LINES,0,h.length);}var _i={" ":[16,[]],"!":[10,[5,21,5,7,-1,-1,5,2,4,1,5,0,6,1,5,2]],'"':[16,[4,21,4,14,-1,-1,12,21,12,14]],"#":[21,[11,25,4,-7,-1,-1,17,25,10,-7,-1,-1,4,12,18,12,-1,-1,3,6,17,6]],$:[20,[8,25,8,-4,-1,-1,12,25,12,-4,-1,-1,17,18,15,20,12,21,8,21,5,20,3,18,3,16,4,14,5,13,7,12,13,10,15,9,16,8,17,6,17,3,15,1,12,0,8,0,5,1,3,3]],"%":[24,[21,21,3,0,-1,-1,8,21,10,19,10,17,9,15,7,14,5,14,3,16,3,18,4,20,6,21,8,21,10,20,13,19,16,19,19,20,21,21,-1,-1,17,7,15,6,14,4,14,2,16,0,18,0,20,1,21,3,21,5,19,7,17,7]],"&":[26,[23,12,23,13,22,14,21,14,20,13,19,11,17,6,15,3,13,1,11,0,7,0,5,1,4,2,3,4,3,6,4,8,5,9,12,13,13,14,14,16,14,18,13,20,11,21,9,20,8,18,8,16,9,13,11,10,16,3,18,1,20,0,22,0,23,1,23,2]],"'":[10,[5,19,4,20,5,21,6,20,6,18,5,16,4,15]],"(":[14,[11,25,9,23,7,20,5,16,4,11,4,7,5,2,7,-2,9,-5,11,-7]],")":[14,[3,25,5,23,7,20,9,16,10,11,10,7,9,2,7,-2,5,-5,3,-7]],"*":[16,[8,21,8,9,-1,-1,3,18,13,12,-1,-1,13,18,3,12]],"+":[26,[13,18,13,0,-1,-1,4,9,22,9]],",":[10,[6,1,5,0,4,1,5,2,6,1,6,-1,5,-3,4,-4]],"-":[26,[4,9,22,9]],".":[10,[5,2,4,1,5,0,6,1,5,2]],"/":[22,[20,25,2,-7]],0:[20,[9,21,6,20,4,17,3,12,3,9,4,4,6,1,9,0,11,0,14,1,16,4,17,9,17,12,16,17,14,20,11,21,9,21]],1:[20,[6,17,8,18,11,21,11,0]],2:[20,[4,16,4,17,5,19,6,20,8,21,12,21,14,20,15,19,16,17,16,15,15,13,13,10,3,0,17,0]],3:[20,[5,21,16,21,10,13,13,13,15,12,16,11,17,8,17,6,16,3,14,1,11,0,8,0,5,1,4,2,3,4]],4:[20,[13,21,3,7,18,7,-1,-1,13,21,13,0]],5:[20,[15,21,5,21,4,12,5,13,8,14,11,14,14,13,16,11,17,8,17,6,16,3,14,1,11,0,8,0,5,1,4,2,3,4]],6:[20,[16,18,15,20,12,21,10,21,7,20,5,17,4,12,4,7,5,3,7,1,10,0,11,0,14,1,16,3,17,6,17,7,16,10,14,12,11,13,10,13,7,12,5,10,4,7]],7:[20,[17,21,7,0,-1,-1,3,21,17,21]],8:[20,[8,21,5,20,4,18,4,16,5,14,7,13,11,12,14,11,16,9,17,7,17,4,16,2,15,1,12,0,8,0,5,1,4,2,3,4,3,7,4,9,6,11,9,12,13,13,15,14,16,16,16,18,15,20,12,21,8,21]],9:[20,[16,14,15,11,13,9,10,8,9,8,6,9,4,11,3,14,3,15,4,18,6,20,9,21,10,21,13,20,15,18,16,14,16,9,15,4,13,1,10,0,8,0,5,1,4,3]],":":[10,[5,14,4,13,5,12,6,13,5,14,-1,-1,5,2,4,1,5,0,6,1,5,2]],";":[10,[5,14,4,13,5,12,6,13,5,14,-1,-1,6,1,5,0,4,1,5,2,6,1,6,-1,5,-3,4,-4]],"<":[24,[20,18,4,9,20,0]],"=":[26,[4,12,22,12,-1,-1,4,6,22,6]],">":[24,[4,18,20,9,4,0]],"?":[18,[3,16,3,17,4,19,5,20,7,21,11,21,13,20,14,19,15,17,15,15,14,13,13,12,9,10,9,7,-1,-1,9,2,8,1,9,0,10,1,9,2]],"@":[27,[18,13,17,15,15,16,12,16,10,15,9,14,8,11,8,8,9,6,11,5,14,5,16,6,17,8,-1,-1,12,16,10,14,9,11,9,8,10,6,11,5,-1,-1,18,16,17,8,17,6,19,5,21,5,23,7,24,10,24,12,23,15,22,17,20,19,18,20,15,21,12,21,9,20,7,19,5,17,4,15,3,12,3,9,4,6,5,4,7,2,9,1,12,0,15,0,18,1,20,2,21,3,-1,-1,19,16,18,8,18,6,19,5]],A:[18,[9,21,1,0,-1,-1,9,21,17,0,-1,-1,4,7,14,7]],B:[21,[4,21,4,0,-1,-1,4,21,13,21,16,20,17,19,18,17,18,15,17,13,16,12,13,11,-1,-1,4,11,13,11,16,10,17,9,18,7,18,4,17,2,16,1,13,0,4,0]],C:[21,[18,16,17,18,15,20,13,21,9,21,7,20,5,18,4,16,3,13,3,8,4,5,5,3,7,1,9,0,13,0,15,1,17,3,18,5]],D:[21,[4,21,4,0,-1,-1,4,21,11,21,14,20,16,18,17,16,18,13,18,8,17,5,16,3,14,1,11,0,4,0]],E:[19,[4,21,4,0,-1,-1,4,21,17,21,-1,-1,4,11,12,11,-1,-1,4,0,17,0]],F:[18,[4,21,4,0,-1,-1,4,21,17,21,-1,-1,4,11,12,11]],G:[21,[18,16,17,18,15,20,13,21,9,21,7,20,5,18,4,16,3,13,3,8,4,5,5,3,7,1,9,0,13,0,15,1,17,3,18,5,18,8,-1,-1,13,8,18,8]],H:[22,[4,21,4,0,-1,-1,18,21,18,0,-1,-1,4,11,18,11]],I:[8,[4,21,4,0]],J:[16,[12,21,12,5,11,2,10,1,8,0,6,0,4,1,3,2,2,5,2,7]],K:[21,[4,21,4,0,-1,-1,18,21,4,7,-1,-1,9,12,18,0]],L:[17,[4,21,4,0,-1,-1,4,0,16,0]],M:[24,[4,21,4,0,-1,-1,4,21,12,0,-1,-1,20,21,12,0,-1,-1,20,21,20,0]],N:[22,[4,21,4,0,-1,-1,4,21,18,0,-1,-1,18,21,18,0]],O:[22,[9,21,7,20,5,18,4,16,3,13,3,8,4,5,5,3,7,1,9,0,13,0,15,1,17,3,18,5,19,8,19,13,18,16,17,18,15,20,13,21,9,21]],P:[21,[4,21,4,0,-1,-1,4,21,13,21,16,20,17,19,18,17,18,14,17,12,16,11,13,10,4,10]],Q:[22,[9,21,7,20,5,18,4,16,3,13,3,8,4,5,5,3,7,1,9,0,13,0,15,1,17,3,18,5,19,8,19,13,18,16,17,18,15,20,13,21,9,21,-1,-1,12,4,18,-2]],R:[21,[4,21,4,0,-1,-1,4,21,13,21,16,20,17,19,18,17,18,15,17,13,16,12,13,11,4,11,-1,-1,11,11,18,0]],S:[20,[17,18,15,20,12,21,8,21,5,20,3,18,3,16,4,14,5,13,7,12,13,10,15,9,16,8,17,6,17,3,15,1,12,0,8,0,5,1,3,3]],T:[16,[8,21,8,0,-1,-1,1,21,15,21]],U:[22,[4,21,4,6,5,3,7,1,10,0,12,0,15,1,17,3,18,6,18,21]],V:[18,[1,21,9,0,-1,-1,17,21,9,0]],W:[24,[2,21,7,0,-1,-1,12,21,7,0,-1,-1,12,21,17,0,-1,-1,22,21,17,0]],X:[20,[3,21,17,0,-1,-1,17,21,3,0]],Y:[18,[1,21,9,11,9,0,-1,-1,17,21,9,11]],Z:[20,[17,21,3,0,-1,-1,3,21,17,21,-1,-1,3,0,17,0]],"[":[14,[4,25,4,-7,-1,-1,5,25,5,-7,-1,-1,4,25,11,25,-1,-1,4,-7,11,-7]],"\\":[14,[0,21,14,-3]],"]":[14,[9,25,9,-7,-1,-1,10,25,10,-7,-1,-1,3,25,10,25,-1,-1,3,-7,10,-7]],"^":[16,[6,15,8,18,10,15,-1,-1,3,12,8,17,13,12,-1,-1,8,17,8,0]],_:[16,[0,-2,16,-2]],"`":[10,[6,21,5,20,4,18,4,16,5,15,6,16,5,17]],a:[19,[15,14,15,0,-1,-1,15,11,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],b:[19,[4,21,4,0,-1,-1,4,11,6,13,8,14,11,14,13,13,15,11,16,8,16,6,15,3,13,1,11,0,8,0,6,1,4,3]],c:[18,[15,11,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],d:[19,[15,21,15,0,-1,-1,15,11,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],e:[18,[3,8,15,8,15,10,14,12,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],f:[12,[10,21,8,21,6,20,5,17,5,0,-1,-1,2,14,9,14]],g:[19,[15,14,15,-2,14,-5,13,-6,11,-7,8,-7,6,-6,-1,-1,15,11,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],h:[19,[4,21,4,0,-1,-1,4,10,7,13,9,14,12,14,14,13,15,10,15,0]],i:[8,[3,21,4,20,5,21,4,22,3,21,-1,-1,4,14,4,0]],j:[10,[5,21,6,20,7,21,6,22,5,21,-1,-1,6,14,6,-3,5,-6,3,-7,1,-7]],k:[17,[4,21,4,0,-1,-1,14,14,4,4,-1,-1,8,8,15,0]],l:[8,[4,21,4,0]],m:[30,[4,14,4,0,-1,-1,4,10,7,13,9,14,12,14,14,13,15,10,15,0,-1,-1,15,10,18,13,20,14,23,14,25,13,26,10,26,0]],n:[19,[4,14,4,0,-1,-1,4,10,7,13,9,14,12,14,14,13,15,10,15,0]],o:[19,[8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3,16,6,16,8,15,11,13,13,11,14,8,14]],p:[19,[4,14,4,-7,-1,-1,4,11,6,13,8,14,11,14,13,13,15,11,16,8,16,6,15,3,13,1,11,0,8,0,6,1,4,3]],q:[19,[15,14,15,-7,-1,-1,15,11,13,13,11,14,8,14,6,13,4,11,3,8,3,6,4,3,6,1,8,0,11,0,13,1,15,3]],r:[13,[4,14,4,0,-1,-1,4,8,5,11,7,13,9,14,12,14]],s:[17,[14,11,13,13,10,14,7,14,4,13,3,11,4,9,6,8,11,7,13,6,14,4,14,3,13,1,10,0,7,0,4,1,3,3]],t:[12,[5,21,5,4,6,1,8,0,10,0,-1,-1,2,14,9,14]],u:[19,[4,14,4,4,5,1,7,0,10,0,12,1,15,4,-1,-1,15,14,15,0]],v:[16,[2,14,8,0,-1,-1,14,14,8,0]],w:[22,[3,14,7,0,-1,-1,11,14,7,0,-1,-1,11,14,15,0,-1,-1,19,14,15,0]],x:[17,[3,14,14,0,-1,-1,14,14,3,0]],y:[16,[2,14,8,0,-1,-1,14,14,8,0,6,-4,4,-6,2,-7,1,-7]],z:[17,[14,14,3,0,-1,-1,3,14,14,14,-1,-1,3,0,14,0]],"{":[14,[9,25,7,24,6,23,5,21,5,19,6,17,7,16,8,14,8,12,6,10,-1,-1,7,24,6,22,6,20,7,18,8,17,9,15,9,13,8,11,4,9,8,7,9,5,9,3,8,1,7,0,6,-2,6,-4,7,-6,-1,-1,6,8,8,6,8,4,7,2,6,1,5,-1,5,-3,6,-5,7,-6,9,-7]],"|":[8,[4,25,4,-7]],"}":[14,[5,25,7,24,8,23,9,21,9,19,8,17,7,16,6,14,6,12,8,10,-1,-1,7,24,8,22,8,20,7,18,6,17,5,15,5,13,6,11,10,9,6,7,5,5,5,3,6,1,7,0,8,-2,8,-4,7,-6,-1,-1,8,8,6,6,6,4,7,2,8,1,9,-1,9,-3,8,-5,7,-6,5,-7]],"~":[24,[3,6,3,8,4,11,6,12,8,12,10,11,14,8,16,7,18,7,20,8,21,10,-1,-1,3,8,4,10,6,11,8,11,10,10,14,7,16,6,18,6,20,7,21,10,21,12]]};var gi={symbol:function(t,e,i,n){if("translucent"===t.renderPass){var o=t.context;o.setStencilMode(Dt.disabled),o.setColorMode(t.colorModeForRenderPass()),0!==i.paint.get("icon-opacity").constantOr(1)&&Qe(t,e,i,n,!1,i.paint.get("icon-translate"),i.paint.get("icon-translate-anchor"),i.layout.get("icon-rotation-alignment"),i.layout.get("icon-pitch-alignment"),i.layout.get("icon-keep-upright")),0!==i.paint.get("text-opacity").constantOr(1)&&Qe(t,e,i,n,!0,i.paint.get("text-translate"),i.paint.get("text-translate-anchor"),i.layout.get("text-rotation-alignment"),i.layout.get("text-pitch-alignment"),i.layout.get("text-keep-upright")),e.map.showCollisionBoxes&&function(t,e,i,n){Ke(t,e,i,n,!1),Ke(t,e,i,n,!0);}(t,e,i,n);}},circle:function(t,e,i,n){if("translucent"===t.renderPass){var o=i.paint.get("circle-opacity"),r=i.paint.get("circle-stroke-width"),a=i.paint.get("circle-stroke-opacity");if(0!==o.constantOr(1)||0!==r.constantOr(1)&&0!==a.constantOr(1)){var s=t.context,l=s.gl;s.setDepthMode(t.depthModeForSublayer(0,Rt.ReadOnly)),s.setStencilMode(Dt.disabled),s.setColorMode(t.colorModeForRenderPass());for(var c=!0,u=0;u<n.length;u++){var h=n[u],p=e.getTile(h),d=p.getBucket(i);if(d){var f=t.context.program.get(),m=d.programConfigurations.get(i.id),_=t.useProgram("circle",m);if((c||_.program!==f)&&(m.setUniforms(s,_,i.paint,{zoom:t.transform.zoom}),c=!1),l.uniform1f(_.uniforms.u_camera_to_center_distance,t.transform.cameraToCenterDistance),l.uniform1i(_.uniforms.u_scale_with_map,"map"===i.paint.get("circle-pitch-scale")?1:0),"map"===i.paint.get("circle-pitch-alignment")){l.uniform1i(_.uniforms.u_pitch_with_map,1);var g=me(p,1,t.transform.zoom);l.uniform2f(_.uniforms.u_extrude_scale,g,g);}else l.uniform1i(_.uniforms.u_pitch_with_map,0),l.uniform2fv(_.uniforms.u_extrude_scale,t.transform.pixelsToGLUnits);l.uniformMatrix4fv(_.uniforms.u_matrix,!1,t.translatePosMatrix(h.posMatrix,p,i.paint.get("circle-translate"),i.paint.get("circle-translate-anchor"))),_.draw(s,l.TRIANGLES,i.id,d.layoutVertexBuffer,d.indexBuffer,d.segments,m);}}}}},heatmap:function(e,i,n,o){if(0!==n.paint.get("heatmap-opacity"))if("offscreen"===e.renderPass){var r=e.context,a=r.gl;r.setDepthMode(e.depthModeForSublayer(0,Rt.ReadOnly)),r.setStencilMode(Dt.disabled),function(t,e,i){var n=t.gl;t.activeTexture.set(n.TEXTURE1),t.viewport.set([0,0,e.width/4,e.height/4]);var o=i.heatmapFbo;if(o)n.bindTexture(n.TEXTURE_2D,o.colorAttachment.get()),t.bindFramebuffer.set(o.framebuffer);else{var r=n.createTexture();n.bindTexture(n.TEXTURE_2D,r),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),o=i.heatmapFbo=t.createFramebuffer(e.width/4,e.height/4),function t(e,i,n,o){var r=e.gl;r.texImage2D(r.TEXTURE_2D,0,r.RGBA,i.width/4,i.height/4,0,r.RGBA,e.extTextureHalfFloat?e.extTextureHalfFloat.HALF_FLOAT_OES:r.UNSIGNED_BYTE,null),o.colorAttachment.set(n),e.extTextureHalfFloat&&r.checkFramebufferStatus(r.FRAMEBUFFER)!==r.FRAMEBUFFER_COMPLETE&&(e.extTextureHalfFloat=null,o.colorAttachment.setDirty(),t(e,i,n,o));}(t,e,r,o);}}(r,e,n),r.clear({color:t.default$8.transparent}),r.setColorMode(new Lt([a.ONE,a.ONE],t.default$8.transparent,[!0,!0,!0,!0]));for(var s=!0,l=0;l<o.length;l++){var c=o[l];if(!i.hasRenderableParent(c)){var u=i.getTile(c),h=u.getBucket(n);if(h){var p=e.context.program.get(),d=h.programConfigurations.get(n.id),f=e.useProgram("heatmap",d),m=e.transform.zoom;(s||f.program!==p)&&(d.setUniforms(e.context,f,n.paint,{zoom:m}),s=!1),a.uniform1f(f.uniforms.u_extrude_scale,me(u,1,m)),a.uniform1f(f.uniforms.u_intensity,n.paint.get("heatmap-intensity")),a.uniformMatrix4fv(f.uniforms.u_matrix,!1,c.posMatrix),f.draw(r,a.TRIANGLES,n.id,h.layoutVertexBuffer,h.indexBuffer,h.segments,d);}}}r.viewport.set([0,0,e.width,e.height]);}else"translucent"===e.renderPass&&(e.context.setColorMode(e.colorModeForRenderPass()),function(e,i){var n=e.context,o=n.gl,r=i.heatmapFbo;if(r){n.activeTexture.set(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,r.colorAttachment.get()),n.activeTexture.set(o.TEXTURE1);var a=i.colorRampTexture;a||(a=i.colorRampTexture=new t.default$4(n,i.colorRamp,o.RGBA)),a.bind(o.LINEAR,o.CLAMP_TO_EDGE),n.setDepthMode(Rt.disabled),n.setStencilMode(Dt.disabled);var s=e.useProgram("heatmapTexture"),l=i.paint.get("heatmap-opacity");o.uniform1f(s.uniforms.u_opacity,l),o.uniform1i(s.uniforms.u_image,0),o.uniform1i(s.uniforms.u_color_ramp,1);var c=t.create();t.ortho(c,0,e.width,e.height,0,0,1),o.uniformMatrix4fv(s.uniforms.u_matrix,!1,c),o.uniform2f(s.uniforms.u_world,o.drawingBufferWidth,o.drawingBufferHeight),e.viewportVAO.bind(e.context,s,e.viewportBuffer,[]),o.drawArrays(o.TRIANGLE_STRIP,0,4);}}(e,n));},line:function(t,e,i,n){if("translucent"===t.renderPass){var o=i.paint.get("line-opacity"),r=i.paint.get("line-width");if(0!==o.constantOr(1)&&0!==r.constantOr(1)){var a=t.context;a.setDepthMode(t.depthModeForSublayer(0,Rt.ReadOnly)),a.setColorMode(t.colorModeForRenderPass());for(var s,l=i.paint.get("line-dasharray")?"lineSDF":i.paint.get("line-pattern")?"linePattern":i.paint.get("line-gradient")?"lineGradient":"line",c=!0,u=0,h=n;u<h.length;u+=1){var p=h[u],d=e.getTile(p),f=d.getBucket(i);if(f){var m=f.programConfigurations.get(i.id),_=t.context.program.get(),g=t.useProgram(l,m),v=c||g.program!==_,y=s!==d.tileID.overscaledZ;v&&m.setUniforms(t.context,g,i.paint,{zoom:t.transform.zoom}),ni(g,t,d,f,i,p,m,v,y),s=d.tileID.overscaledZ,c=!1;}}}}},fill:function(e,i,n,o){var r=n.paint.get("fill-color"),a=n.paint.get("fill-opacity");if(0!==a.constantOr(1)){var s=e.context;s.setColorMode(e.colorModeForRenderPass());var l=n.paint.get("fill-pattern")||1!==r.constantOr(t.default$8.transparent).a||1!==a.constantOr(0)?"translucent":"opaque";e.renderPass===l&&(s.setDepthMode(e.depthModeForSublayer(1,"opaque"===e.renderPass?Rt.ReadWrite:Rt.ReadOnly)),si(e,i,n,o,li)),"translucent"===e.renderPass&&n.paint.get("fill-antialias")&&(s.setDepthMode(e.depthModeForSublayer(n.getPaintProperty("fill-outline-color")?2:0,Rt.ReadOnly)),si(e,i,n,o,ci));}},"fill-extrusion":function(e,i,n,o){if(0!==n.paint.get("fill-extrusion-opacity"))if("offscreen"===e.renderPass){!function(e,i){var n=e.context,o=n.gl,r=i.viewportFrame;if(e.depthRboNeedsClear&&e.setupOffscreenDepthRenderbuffer(),!r){var a=new t.default$4(n,{width:e.width,height:e.height,data:null},o.RGBA);a.bind(o.LINEAR,o.CLAMP_TO_EDGE),(r=i.viewportFrame=n.createFramebuffer(e.width,e.height)).colorAttachment.set(a.texture);}n.bindFramebuffer.set(r.framebuffer),r.depthAttachment.set(e.depthRbo),e.depthRboNeedsClear&&(n.clear({depth:1}),e.depthRboNeedsClear=!1),n.clear({color:t.default$8.transparent}),n.setStencilMode(Dt.disabled),n.setDepthMode(new Rt(o.LEQUAL,Rt.ReadWrite,[0,1])),n.setColorMode(e.colorModeForRenderPass());}(e,n);for(var r=!0,a=0,s=o;a<s.length;a+=1){var l=s[a],c=i.getTile(l),u=c.getBucket(n);u&&(hi(e,0,n,c,l,u,r),r=!1);}}else"translucent"===e.renderPass&&function(e,i){var n=i.viewportFrame;if(n){var o=e.context,r=o.gl,a=e.useProgram("extrusionTexture");o.setStencilMode(Dt.disabled),o.setDepthMode(Rt.disabled),o.setColorMode(e.colorModeForRenderPass()),o.activeTexture.set(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,n.colorAttachment.get()),r.uniform1f(a.uniforms.u_opacity,i.paint.get("fill-extrusion-opacity")),r.uniform1i(a.uniforms.u_image,0);var s=t.create();t.ortho(s,0,e.width,e.height,0,0,1),r.uniformMatrix4fv(a.uniforms.u_matrix,!1,s),r.uniform2f(a.uniforms.u_world,r.drawingBufferWidth,r.drawingBufferHeight),e.viewportVAO.bind(o,a,e.viewportBuffer,[]),r.drawArrays(r.TRIANGLE_STRIP,0,4);}}(e,n);},hillshade:function(t,e,i,n){if("offscreen"===t.renderPass||"translucent"===t.renderPass){var o=t.context,r=e.getSource().maxzoom;o.setDepthMode(t.depthModeForSublayer(0,Rt.ReadOnly)),o.setStencilMode(Dt.disabled),o.setColorMode(t.colorModeForRenderPass());for(var a=0,s=n;a<s.length;a+=1){var l=s[a],c=e.getTile(l);c.needsHillshadePrepare&&"offscreen"===t.renderPass?di(t,c,r):"translucent"===t.renderPass&&pi(t,c,i);}o.viewport.set([0,0,t.width,t.height]);}},raster:function(t,e,i,n){if("translucent"===t.renderPass&&0!==i.paint.get("raster-opacity")){var o,r,a=t.context,s=a.gl,l=e.getSource(),c=t.useProgram("raster");a.setStencilMode(Dt.disabled),a.setColorMode(t.colorModeForRenderPass()),s.uniform1f(c.uniforms.u_brightness_low,i.paint.get("raster-brightness-min")),s.uniform1f(c.uniforms.u_brightness_high,i.paint.get("raster-brightness-max")),s.uniform1f(c.uniforms.u_saturation_factor,(o=i.paint.get("raster-saturation"))>0?1-1/(1.001-o):-o),s.uniform1f(c.uniforms.u_contrast_factor,(r=i.paint.get("raster-contrast"))>0?1/(1-r):1+r),s.uniform3fv(c.uniforms.u_spin_weights,function(t){t*=Math.PI/180;var e=Math.sin(t),i=Math.cos(t);return[(2*i+1)/3,(-Math.sqrt(3)*e-i+1)/3,(Math.sqrt(3)*e-i+1)/3]}(i.paint.get("raster-hue-rotate"))),s.uniform1f(c.uniforms.u_buffer_scale,1),s.uniform1i(c.uniforms.u_image0,0),s.uniform1i(c.uniforms.u_image1,1);for(var u=n.length&&n[0].overscaledZ,h=0,p=n;h<p.length;h+=1){var d=p[h];a.setDepthMode(t.depthModeForSublayer(d.overscaledZ-u,1===i.paint.get("raster-opacity")?Rt.ReadWrite:Rt.ReadOnly,s.LESS));var f=e.getTile(d),m=t.transform.calculatePosMatrix(d.toUnwrapped(),!0);f.registerFadeDuration(i.paint.get("raster-fade-duration")),s.uniformMatrix4fv(c.uniforms.u_matrix,!1,m);var _=e.findLoadedParent(d,0,{}),g=fi(f,_,e,i,t.transform),v=void 0,y=void 0,x="nearest"===i.paint.get("raster-resampling")?s.NEAREST:s.LINEAR;if(a.activeTexture.set(s.TEXTURE0),f.texture.bind(x,s.CLAMP_TO_EDGE,s.LINEAR_MIPMAP_NEAREST),a.activeTexture.set(s.TEXTURE1),_?(_.texture.bind(x,s.CLAMP_TO_EDGE,s.LINEAR_MIPMAP_NEAREST),v=Math.pow(2,_.tileID.overscaledZ-f.tileID.overscaledZ),y=[f.tileID.canonical.x*v%1,f.tileID.canonical.y*v%1]):f.texture.bind(x,s.CLAMP_TO_EDGE,s.LINEAR_MIPMAP_NEAREST),s.uniform2fv(c.uniforms.u_tl_parent,y||[0,0]),s.uniform1f(c.uniforms.u_scale_parent,v||1),s.uniform1f(c.uniforms.u_fade_t,g.mix),s.uniform1f(c.uniforms.u_opacity,g.opacity*i.paint.get("raster-opacity")),l instanceof j){var b=l.boundsBuffer;l.boundsVAO.bind(a,c,b,[]),s.drawArrays(s.TRIANGLE_STRIP,0,b.length);}else if(f.maskedBoundsBuffer&&f.maskedIndexBuffer&&f.segments)c.draw(a,s.TRIANGLES,i.id,f.maskedBoundsBuffer,f.maskedIndexBuffer,f.segments);else{var w=t.rasterBoundsBuffer;t.rasterBoundsVAO.bind(a,c,w,[]),s.drawArrays(s.TRIANGLE_STRIP,0,w.length);}}}},background:function(t,e,i){var n=i.paint.get("background-color"),o=i.paint.get("background-opacity");if(0!==o){var r=t.context,a=r.gl,s=t.transform,l=s.tileSize,c=i.paint.get("background-pattern"),u=c||1!==n.a||1!==o?"translucent":"opaque";if(t.renderPass===u){var h;if(r.setStencilMode(Dt.disabled),r.setDepthMode(t.depthModeForSublayer(0,"opaque"===u?Rt.ReadWrite:Rt.ReadOnly)),r.setColorMode(t.colorModeForRenderPass()),c){if(oi(c,t))return;h=t.useProgram("backgroundPattern"),ri(c,t,h),t.tileExtentPatternVAO.bind(r,h,t.tileExtentBuffer,[]);}else h=t.useProgram("background"),a.uniform4fv(h.uniforms.u_color,[n.r,n.g,n.b,n.a]),t.tileExtentVAO.bind(r,h,t.tileExtentBuffer,[]);a.uniform1f(h.uniforms.u_opacity,o);for(var p=0,d=s.coveringTiles({tileSize:l});p<d.length;p+=1){var f=d[p];c&&ai({tileID:f,tileSize:l},t,h),a.uniformMatrix4fv(h.uniforms.u_matrix,!1,t.transform.calculatePosMatrix(f.toUnwrapped())),a.drawArrays(a.TRIANGLE_STRIP,0,t.tileExtentBuffer.length);}}}},debug:function(t,e,i){for(var n=0;n<i.length;n++)mi(t,e,i[n]);}},vi=function(e,i){this.context=new Pt(e),this.transform=i,this._tileTextures={},this.setup(),this.numSublayers=kt.maxUnderzooming+kt.maxOverzooming+1,this.depthEpsilon=1/Math.pow(2,16),this.depthRboNeedsClear=!0,this.emptyProgramConfiguration=new t.default$22,this.crossTileSymbolIndex=new Oe;};function yi(t,e){if(t.row>e.row){var i=t;t=e,e=i;}return{x0:t.column,y0:t.row,x1:e.column,y1:e.row,dx:e.column-t.column,dy:e.row-t.row}}function xi(t,e,i,n,o){var r=Math.max(i,Math.floor(e.y0)),a=Math.min(n,Math.ceil(e.y1));if(t.x0===e.x0&&t.y0===e.y0?t.x0+e.dy/t.dy*t.dx<e.x1:t.x1-e.dy/t.dy*t.dx<e.x0){var s=t;t=e,e=s;}for(var l=t.dx/t.dy,c=e.dx/e.dy,u=t.dx>0,h=e.dx<0,p=r;p<a;p++){var d=l*Math.max(0,Math.min(t.dy,p+u-t.y0))+t.x0,f=c*Math.max(0,Math.min(e.dy,p+h-e.y0))+e.x0;o(Math.floor(f),Math.ceil(d),p);}}function bi(t,e,i,n,o,r){var a,s=yi(t,e),l=yi(e,i),c=yi(i,t);s.dy>l.dy&&(a=s,s=l,l=a),s.dy>c.dy&&(a=s,s=c,c=a),l.dy>c.dy&&(a=l,l=c,c=a),s.dy&&xi(c,s,n,o,r),l.dy&&xi(c,l,n,o,r);}vi.prototype.resize=function(e,i){var n=this.context.gl;if(this.width=e*t.default$2.devicePixelRatio,this.height=i*t.default$2.devicePixelRatio,this.context.viewport.set([0,0,this.width,this.height]),this.style)for(var o=0,r=this.style._order;o<r.length;o+=1){var a=r[o];this.style._layers[a].resize();}this.depthRbo&&(n.deleteRenderbuffer(this.depthRbo),this.depthRbo=null);},vi.prototype.setup=function(){var e=this.context,i=new t.PosArray;i.emplaceBack(0,0),i.emplaceBack(t.default$10,0),i.emplaceBack(0,t.default$10),i.emplaceBack(t.default$10,t.default$10),this.tileExtentBuffer=e.createVertexBuffer(i,Ze.members),this.tileExtentVAO=new V,this.tileExtentPatternVAO=new V;var n=new t.PosArray;n.emplaceBack(0,0),n.emplaceBack(t.default$10,0),n.emplaceBack(t.default$10,t.default$10),n.emplaceBack(0,t.default$10),n.emplaceBack(0,0),this.debugBuffer=e.createVertexBuffer(n,Ze.members),this.debugVAO=new V;var o=new t.RasterBoundsArray;o.emplaceBack(0,0,0,0),o.emplaceBack(t.default$10,0,t.default$10,0),o.emplaceBack(0,t.default$10,0,t.default$10),o.emplaceBack(t.default$10,t.default$10,t.default$10,t.default$10),this.rasterBoundsBuffer=e.createVertexBuffer(o,t.default$11.members),this.rasterBoundsVAO=new V;var r=new t.PosArray;r.emplaceBack(0,0),r.emplaceBack(1,0),r.emplaceBack(0,1),r.emplaceBack(1,1),this.viewportBuffer=e.createVertexBuffer(r,Ze.members),this.viewportVAO=new V;},vi.prototype.clearStencil=function(){var e=this.context,i=e.gl;e.setColorMode(Lt.disabled),e.setDepthMode(Rt.disabled),e.setStencilMode(new Dt({func:i.ALWAYS,mask:0},0,255,i.ZERO,i.ZERO,i.ZERO));var n=t.create();t.ortho(n,0,this.width,this.height,0,0,1),t.scale(n,n,[i.drawingBufferWidth,i.drawingBufferHeight,0]);var o=this.useProgram("clippingMask");i.uniformMatrix4fv(o.uniforms.u_matrix,!1,n),this.viewportVAO.bind(e,o,this.viewportBuffer,[]),i.drawArrays(i.TRIANGLE_STRIP,0,4);},vi.prototype._renderTileClippingMasks=function(t){var e=this.context,i=e.gl;e.setColorMode(Lt.disabled),e.setDepthMode(Rt.disabled);var n=1;this._tileClippingMaskIDs={};for(var o=0,r=t;o<r.length;o+=1){var a=r[o],s=this._tileClippingMaskIDs[a.key]=n++;e.setStencilMode(new Dt({func:i.ALWAYS,mask:0},s,255,i.KEEP,i.KEEP,i.REPLACE));var l=this.useProgram("clippingMask");i.uniformMatrix4fv(l.uniforms.u_matrix,!1,a.posMatrix),this.tileExtentVAO.bind(this.context,l,this.tileExtentBuffer,[]),i.drawArrays(i.TRIANGLE_STRIP,0,this.tileExtentBuffer.length);}},vi.prototype.stencilModeForClipping=function(t){var e=this.context.gl;return new Dt({func:e.EQUAL,mask:255},this._tileClippingMaskIDs[t.key],0,e.KEEP,e.KEEP,e.REPLACE)},vi.prototype.colorModeForRenderPass=function(){var e=this.context.gl;if(this._showOverdrawInspector){return new Lt([e.CONSTANT_COLOR,e.ONE],new t.default$8(1/8,1/8,1/8,0),[!0,!0,!0,!0])}return"opaque"===this.renderPass?Lt.unblended:Lt.alphaBlended},vi.prototype.depthModeForSublayer=function(t,e,i){var n=1-((1+this.currentLayer)*this.numSublayers+t)*this.depthEpsilon,o=n-1+this.depthRange;return new Rt(i||this.context.gl.LEQUAL,e,[o,n])},vi.prototype.render=function(e,i){var n=this;for(var o in this.style=e,this.options=i,this.lineAtlas=e.lineAtlas,this.imageManager=e.imageManager,this.glyphManager=e.glyphManager,this.symbolFadeChange=e.placement.symbolFadeChange(t.default$2.now()),e.sourceCaches){var r=n.style.sourceCaches[o];r.used&&r.prepare(n.context);}var a=this.style._order,s=t.filterObject(this.style.sourceCaches,function(t){return"raster"===t.getSource().type||"raster-dem"===t.getSource().type}),l=function(e){var i=s[e];!function(e,i){for(var n=e.sort(function(t,e){return t.tileID.isLessThan(e.tileID)?-1:e.tileID.isLessThan(t.tileID)?1:0}),o=0;o<n.length;o++){var r={},a=n[o],s=n.slice(o+1);He(a.tileID.wrapped(),a.tileID,s,new t.OverscaledTileID(0,a.tileID.wrap+1,0,0,0),r),a.setMask(r,i);}}(i.getVisibleCoordinates().map(function(t){return i.getTile(t)}),n.context);};for(var c in s)l(c);this.renderPass="offscreen";var u,h=[];this.depthRboNeedsClear=!0;for(var p=0;p<a.length;p++){var d=n.style._layers[a[p]];d.hasOffscreenPass()&&!d.isHidden(n.transform.zoom)&&(d.source!==(u&&u.id)&&(h=[],(u=n.style.sourceCaches[d.source])&&(h=u.getVisibleCoordinates()).reverse()),h.length&&n.renderLayer(n,u,d,h));}this.context.bindFramebuffer.set(null),this.context.clear({color:i.showOverdrawInspector?t.default$8.black:t.default$8.transparent,depth:1}),this._showOverdrawInspector=i.showOverdrawInspector,this.depthRange=(e._order.length+2)*this.numSublayers*this.depthEpsilon,this.renderPass="opaque";var f,m=[];for(this.currentLayer=a.length-1,this.currentLayer;this.currentLayer>=0;this.currentLayer--){var _=n.style._layers[a[n.currentLayer]];_.source!==(f&&f.id)&&(m=[],(f=n.style.sourceCaches[_.source])&&(n.clearStencil(),m=f.getVisibleCoordinates(),f.getSource().isTileClipped&&n._renderTileClippingMasks(m))),n.renderLayer(n,f,_,m);}this.renderPass="translucent";var g,v=[];for(this.currentLayer=0,this.currentLayer;this.currentLayer<a.length;this.currentLayer++){var y=n.style._layers[a[n.currentLayer]];y.source!==(g&&g.id)&&(v=[],(g=n.style.sourceCaches[y.source])&&(n.clearStencil(),v=g.getVisibleCoordinates(),g.getSource().isTileClipped&&n._renderTileClippingMasks(v)),v.reverse()),n.renderLayer(n,g,y,v);}if(this.options.showTileBoundaries){var x=this.style.sourceCaches[Object.keys(this.style.sourceCaches)[0]];x&&gi.debug(this,x,x.getVisibleCoordinates());}},vi.prototype.setupOffscreenDepthRenderbuffer=function(){var t=this.context;this.depthRbo||(this.depthRbo=t.createRenderbuffer(t.gl.DEPTH_COMPONENT16,this.width,this.height));},vi.prototype.renderLayer=function(t,e,i,n){i.isHidden(this.transform.zoom)||("background"===i.type||n.length)&&(this.id=i.id,gi[i.type](t,e,i,n));},vi.prototype.translatePosMatrix=function(e,i,n,o,r){if(!n[0]&&!n[1])return e;var a=r?"map"===o?this.transform.angle:0:"viewport"===o?-this.transform.angle:0;if(a){var s=Math.sin(a),l=Math.cos(a);n=[n[0]*l-n[1]*s,n[0]*s+n[1]*l];}var c=[r?n[0]:me(i,n[0],this.transform.zoom),r?n[1]:me(i,n[1],this.transform.zoom),0],u=new Float32Array(16);return t.translate(u,e,c),u},vi.prototype.saveTileTexture=function(t){var e=this._tileTextures[t.size[0]];e?e.push(t):this._tileTextures[t.size[0]]=[t];},vi.prototype.getTileTexture=function(t){var e=this._tileTextures[t];return e&&e.length>0?e.pop():null},vi.prototype._createProgramCached=function(t,e){this.cache=this.cache||{};var i=""+t+(e.cacheKey||"")+(this._showOverdrawInspector?"/overdraw":"");return this.cache[i]||(this.cache[i]=new Xe(this.context,qe[t],e,this._showOverdrawInspector)),this.cache[i]},vi.prototype.useProgram=function(t,e){var i=this._createProgramCached(t,e||this.emptyProgramConfiguration);return this.context.program.set(i.program),i};var wi=function(t,e,i){this.tileSize=512,this._renderWorldCopies=void 0===i||i,this._minZoom=t||0,this._maxZoom=e||22,this.latRange=[-85.05113,85.05113],this.width=0,this.height=0,this._center=new B(0,0),this.zoom=0,this.angle=0,this._fov=.6435011087932844,this._pitch=0,this._unmodified=!0,this._posMatrixCache={},this._alignedPosMatrixCache={};},Ei={minZoom:{configurable:!0},maxZoom:{configurable:!0},renderWorldCopies:{configurable:!0},worldSize:{configurable:!0},centerPoint:{configurable:!0},size:{configurable:!0},bearing:{configurable:!0},pitch:{configurable:!0},fov:{configurable:!0},zoom:{configurable:!0},center:{configurable:!0},unmodified:{configurable:!0},x:{configurable:!0},y:{configurable:!0},point:{configurable:!0}};wi.prototype.clone=function(){var t=new wi(this._minZoom,this._maxZoom,this._renderWorldCopies);return t.tileSize=this.tileSize,t.latRange=this.latRange,t.width=this.width,t.height=this.height,t._center=this._center,t.zoom=this.zoom,t.angle=this.angle,t._fov=this._fov,t._pitch=this._pitch,t._unmodified=this._unmodified,t._calcMatrices(),t},Ei.minZoom.get=function(){return this._minZoom},Ei.minZoom.set=function(t){this._minZoom!==t&&(this._minZoom=t,this.zoom=Math.max(this.zoom,t));},Ei.maxZoom.get=function(){return this._maxZoom},Ei.maxZoom.set=function(t){this._maxZoom!==t&&(this._maxZoom=t,this.zoom=Math.min(this.zoom,t));},Ei.renderWorldCopies.get=function(){return this._renderWorldCopies},Ei.renderWorldCopies.set=function(t){void 0===t?t=!0:null===t&&(t=!1),this._renderWorldCopies=t;},Ei.worldSize.get=function(){return this.tileSize*this.scale},Ei.centerPoint.get=function(){return this.size._div(2)},Ei.size.get=function(){return new t.default(this.width,this.height)},Ei.bearing.get=function(){return-this.angle/Math.PI*180},Ei.bearing.set=function(e){var i=-t.wrap(e,-180,180)*Math.PI/180;this.angle!==i&&(this._unmodified=!1,this.angle=i,this._calcMatrices(),this.rotationMatrix=t.create$4(),t.rotate(this.rotationMatrix,this.rotationMatrix,this.angle));},Ei.pitch.get=function(){return this._pitch/Math.PI*180},Ei.pitch.set=function(e){var i=t.clamp(e,0,60)/180*Math.PI;this._pitch!==i&&(this._unmodified=!1,this._pitch=i,this._calcMatrices());},Ei.fov.get=function(){return this._fov/Math.PI*180},Ei.fov.set=function(t){t=Math.max(.01,Math.min(60,t)),this._fov!==t&&(this._unmodified=!1,this._fov=t/180*Math.PI,this._calcMatrices());},Ei.zoom.get=function(){return this._zoom},Ei.zoom.set=function(t){var e=Math.min(Math.max(t,this.minZoom),this.maxZoom);this._zoom!==e&&(this._unmodified=!1,this._zoom=e,this.scale=this.zoomScale(e),this.tileZoom=Math.floor(e),this.zoomFraction=e-this.tileZoom,this._constrain(),this._calcMatrices());},Ei.center.get=function(){return this._center},Ei.center.set=function(t){t.lat===this._center.lat&&t.lng===this._center.lng||(this._unmodified=!1,this._center=t,this._constrain(),this._calcMatrices());},wi.prototype.coveringZoomLevel=function(t){return(t.roundZoom?Math.round:Math.floor)(this.zoom+this.scaleZoom(this.tileSize/t.tileSize))},wi.prototype.getVisibleUnwrappedCoordinates=function(e){var i=this.pointCoordinate(new t.default(0,0),0),n=this.pointCoordinate(new t.default(this.width,0),0),o=Math.floor(i.column),r=Math.floor(n.column),a=[new t.UnwrappedTileID(0,e)];if(this._renderWorldCopies)for(var s=o;s<=r;s++)0!==s&&a.push(new t.UnwrappedTileID(s,e));return a},wi.prototype.coveringTiles=function(e){var i=this.coveringZoomLevel(e),n=i;if(void 0!==e.minzoom&&i<e.minzoom)return[];void 0!==e.maxzoom&&i>e.maxzoom&&(i=e.maxzoom);var o=this.pointCoordinate(this.centerPoint,i),r=new t.default(o.column-.5,o.row-.5);return function(e,i,n,o){void 0===o&&(o=!0);var r=1<<e,a={};function s(i,s,l){var c,u,h,p;if(l>=0&&l<=r)for(c=i;c<s;c++)u=Math.floor(c/r),h=(c%r+r)%r,0!==u&&!0!==o||(p=new t.OverscaledTileID(n,u,e,h,l),a[p.key]=p);}return bi(i[0],i[1],i[2],0,r,s),bi(i[2],i[3],i[0],0,r,s),Object.keys(a).map(function(t){return a[t]})}(i,[this.pointCoordinate(new t.default(0,0),i),this.pointCoordinate(new t.default(this.width,0),i),this.pointCoordinate(new t.default(this.width,this.height),i),this.pointCoordinate(new t.default(0,this.height),i)],e.reparseOverscaled?n:i,this._renderWorldCopies).sort(function(t,e){return r.dist(t.canonical)-r.dist(e.canonical)})},wi.prototype.resize=function(t,e){this.width=t,this.height=e,this.pixelsToGLUnits=[2/t,-2/e],this._constrain(),this._calcMatrices();},Ei.unmodified.get=function(){return this._unmodified},wi.prototype.zoomScale=function(t){return Math.pow(2,t)},wi.prototype.scaleZoom=function(t){return Math.log(t)/Math.LN2},wi.prototype.project=function(e){return new t.default(this.lngX(e.lng),this.latY(e.lat))},wi.prototype.unproject=function(t){return new B(this.xLng(t.x),this.yLat(t.y))},Ei.x.get=function(){return this.lngX(this.center.lng)},Ei.y.get=function(){return this.latY(this.center.lat)},Ei.point.get=function(){return new t.default(this.x,this.y)},wi.prototype.lngX=function(t){return(180+t)*this.worldSize/360},wi.prototype.latY=function(t){return(180-180/Math.PI*Math.log(Math.tan(Math.PI/4+t*Math.PI/360)))*this.worldSize/360},wi.prototype.xLng=function(t){return 360*t/this.worldSize-180},wi.prototype.yLat=function(t){var e=180-360*t/this.worldSize;return 360/Math.PI*Math.atan(Math.exp(e*Math.PI/180))-90},wi.prototype.setLocationAtPoint=function(t,e){var i=this.pointCoordinate(e)._sub(this.pointCoordinate(this.centerPoint));this.center=this.coordinateLocation(this.locationCoordinate(t)._sub(i)),this._renderWorldCopies&&(this.center=this.center.wrap());},wi.prototype.locationPoint=function(t){return this.coordinatePoint(this.locationCoordinate(t))},wi.prototype.pointLocation=function(t){return this.coordinateLocation(this.pointCoordinate(t))},wi.prototype.locationCoordinate=function(e){return new t.default$15(this.lngX(e.lng)/this.tileSize,this.latY(e.lat)/this.tileSize,this.zoom).zoomTo(this.tileZoom)},wi.prototype.coordinateLocation=function(t){var e=t.zoomTo(this.zoom);return new B(this.xLng(e.column*this.tileSize),this.yLat(e.row*this.tileSize))},wi.prototype.pointCoordinate=function(e,i){void 0===i&&(i=this.tileZoom);var n=[e.x,e.y,0,1],o=[e.x,e.y,1,1];t.transformMat4(n,n,this.pixelMatrixInverse),t.transformMat4(o,o,this.pixelMatrixInverse);var r=n[3],a=o[3],s=n[0]/r,l=o[0]/a,c=n[1]/r,u=o[1]/a,h=n[2]/r,p=o[2]/a,d=h===p?0:(0-h)/(p-h);return new t.default$15(t.number(s,l,d)/this.tileSize,t.number(c,u,d)/this.tileSize,this.zoom)._zoomTo(i)},wi.prototype.coordinatePoint=function(e){var i=e.zoomTo(this.zoom),n=[i.column*this.tileSize,i.row*this.tileSize,0,1];return t.transformMat4(n,n,this.pixelMatrix),new t.default(n[0]/n[3],n[1]/n[3])},wi.prototype.calculatePosMatrix=function(e,i){void 0===i&&(i=!1);var n=e.key,o=i?this._alignedPosMatrixCache:this._posMatrixCache;if(o[n])return o[n];var r=e.canonical,a=this.worldSize/this.zoomScale(r.z),s=r.x+Math.pow(2,r.z)*e.wrap,l=t.identity(new Float64Array(16));return t.translate(l,l,[s*a,r.y*a,0]),t.scale(l,l,[a/t.default$10,a/t.default$10,1]),t.multiply(l,i?this.alignedProjMatrix:this.projMatrix,l),o[n]=new Float32Array(l),o[n]},wi.prototype._constrain=function(){if(this.center&&this.width&&this.height&&!this._constraining){this._constraining=!0;var e,i,n,o,r=-90,a=90,s=-180,l=180,c=this.size,u=this._unmodified;if(this.latRange){var h=this.latRange;r=this.latY(h[1]),e=(a=this.latY(h[0]))-r<c.y?c.y/(a-r):0;}if(this.lngRange){var p=this.lngRange;s=this.lngX(p[0]),i=(l=this.lngX(p[1]))-s<c.x?c.x/(l-s):0;}var d=Math.max(i||0,e||0);if(d)return this.center=this.unproject(new t.default(i?(l+s)/2:this.x,e?(a+r)/2:this.y)),this.zoom+=this.scaleZoom(d),this._unmodified=u,void(this._constraining=!1);if(this.latRange){var f=this.y,m=c.y/2;f-m<r&&(o=r+m),f+m>a&&(o=a-m);}if(this.lngRange){var _=this.x,g=c.x/2;_-g<s&&(n=s+g),_+g>l&&(n=l-g);}void 0===n&&void 0===o||(this.center=this.unproject(new t.default(void 0!==n?n:this.x,void 0!==o?o:this.y))),this._unmodified=u,this._constraining=!1;}},wi.prototype._calcMatrices=function(){if(this.height){this.cameraToCenterDistance=.5/Math.tan(this._fov/2)*this.height;var e=this._fov/2,i=Math.PI/2+this._pitch,n=Math.sin(e)*this.cameraToCenterDistance/Math.sin(Math.PI-i-e),o=this.x,r=this.y,a=1.01*(Math.cos(Math.PI/2-this._pitch)*n+this.cameraToCenterDistance),s=new Float64Array(16);t.perspective(s,this._fov,this.width/this.height,1,a),t.scale(s,s,[1,-1,1]),t.translate(s,s,[0,0,-this.cameraToCenterDistance]),t.rotateX(s,s,this._pitch),t.rotateZ(s,s,this.angle),t.translate(s,s,[-o,-r,0]);var l=this.worldSize/(2*Math.PI*6378137*Math.abs(Math.cos(this.center.lat*(Math.PI/180))));t.scale(s,s,[1,1,l,1]),this.projMatrix=s;var c=this.width%2/2,u=this.height%2/2,h=Math.cos(this.angle),p=Math.sin(this.angle),d=o-Math.round(o)+h*c+p*u,f=r-Math.round(r)+h*u+p*c,m=new Float64Array(s);if(t.translate(m,m,[d>.5?d-1:d,f>.5?f-1:f,0]),this.alignedProjMatrix=m,s=t.create(),t.scale(s,s,[this.width/2,-this.height/2,1]),t.translate(s,s,[1,-1,0]),this.pixelMatrix=t.multiply(new Float64Array(16),s,this.projMatrix),!(s=t.invert(new Float64Array(16),this.pixelMatrix)))throw new Error("failed to invert matrix");this.pixelMatrixInverse=s,this._posMatrixCache={},this._alignedPosMatrixCache={};}},wi.prototype.maxPitchScaleFactor=function(){if(!this.pixelMatrixInverse)return 1;var e=this.pointCoordinate(new t.default(0,0)).zoomTo(this.zoom),i=[e.column*this.tileSize,e.row*this.tileSize,0,1];return t.transformMat4(i,i,this.pixelMatrix)[3]/this.cameraToCenterDistance},Object.defineProperties(wi.prototype,Ei);var Ti=function(){var e,i,n,o,r;t.bindAll(["_onHashChange","_updateHash"],this),this._updateHash=(e=this._updateHashUnthrottled.bind(this),i=300,n=!1,o=0,r=function(){o=0,n&&(e(),o=setTimeout(r,i),n=!1);},function(){return n=!0,o||r(),o});};Ti.prototype.addTo=function(e){return this._map=e,t.default$1.addEventListener("hashchange",this._onHashChange,!1),this._map.on("moveend",this._updateHash),this},Ti.prototype.remove=function(){return t.default$1.removeEventListener("hashchange",this._onHashChange,!1),this._map.off("moveend",this._updateHash),clearTimeout(this._updateHash()),delete this._map,this},Ti.prototype.getHashString=function(t){var e=this._map.getCenter(),i=Math.round(100*this._map.getZoom())/100,n=Math.ceil((i*Math.LN2+Math.log(512/360/.5))/Math.LN10),o=Math.pow(10,n),r=Math.round(e.lng*o)/o,a=Math.round(e.lat*o)/o,s=this._map.getBearing(),l=this._map.getPitch(),c="";return c+=t?"#/"+r+"/"+a+"/"+i:"#"+i+"/"+a+"/"+r,(s||l)&&(c+="/"+Math.round(10*s)/10),l&&(c+="/"+Math.round(l)),c},Ti.prototype._onHashChange=function(){var e=t.default$1.location.hash.replace("#","").split("/");return e.length>=3&&(this._map.jumpTo({center:[+e[2],+e[1]],zoom:+e[0],bearing:+(e[3]||0),pitch:+(e[4]||0)}),!0)},Ti.prototype._updateHashUnthrottled=function(){var e=this.getHashString();t.default$1.history.replaceState(t.default$1.history.state,"",e);};var Ii=function(e){function n(n,o,r,a){void 0===a&&(a={});var s=i.mousePos(o.getCanvasContainer(),r),l=o.unproject(s);e.call(this,n,t.extend({point:s,lngLat:l,originalEvent:r},a)),this._defaultPrevented=!1,this.target=o;}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var o={defaultPrevented:{configurable:!0}};return n.prototype.preventDefault=function(){this._defaultPrevented=!0;},o.defaultPrevented.get=function(){return this._defaultPrevented},Object.defineProperties(n.prototype,o),n}(t.Event),Ci=function(e){function n(n,o,r){var a=i.touchPos(o.getCanvasContainer(),r),s=a.map(function(t){return o.unproject(t)}),l=a.reduce(function(t,e,i,n){return t.add(e.div(n.length))},new t.default(0,0)),c=o.unproject(l);e.call(this,n,{points:a,point:l,lngLats:s,lngLat:c,originalEvent:r}),this._defaultPrevented=!1;}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var o={defaultPrevented:{configurable:!0}};return n.prototype.preventDefault=function(){this._defaultPrevented=!0;},o.defaultPrevented.get=function(){return this._defaultPrevented},Object.defineProperties(n.prototype,o),n}(t.Event),Si=function(t){function e(e,i,n){t.call(this,e,{originalEvent:n}),this._defaultPrevented=!1;}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e;var i={defaultPrevented:{configurable:!0}};return e.prototype.preventDefault=function(){this._defaultPrevented=!0;},i.defaultPrevented.get=function(){return this._defaultPrevented},Object.defineProperties(e.prototype,i),e}(t.Event),zi=function(e){this._map=e,this._el=e.getCanvasContainer(),this._delta=0,t.bindAll(["_onWheel","_onTimeout","_onScrollFrame","_onScrollFinished"],this);};zi.prototype.isEnabled=function(){return!!this._enabled},zi.prototype.isActive=function(){return!!this._active},zi.prototype.enable=function(t){this.isEnabled()||(this._enabled=!0,this._aroundCenter=t&&"center"===t.around);},zi.prototype.disable=function(){this.isEnabled()&&(this._enabled=!1);},zi.prototype.onWheel=function(e){if(this.isEnabled()){var i=e.deltaMode===t.default$1.WheelEvent.DOM_DELTA_LINE?40*e.deltaY:e.deltaY,n=t.default$2.now(),o=n-(this._lastWheelEventTime||0);this._lastWheelEventTime=n,0!==i&&i%4.000244140625==0?this._type="wheel":0!==i&&Math.abs(i)<4?this._type="trackpad":o>400?(this._type=null,this._lastValue=i,this._timeout=setTimeout(this._onTimeout,40,e)):this._type||(this._type=Math.abs(o*i)<200?"trackpad":"wheel",this._timeout&&(clearTimeout(this._timeout),this._timeout=null,i+=this._lastValue)),e.shiftKey&&i&&(i/=4),this._type&&(this._lastWheelEvent=e,this._delta-=i,this.isActive()||this._start(e)),e.preventDefault();}},zi.prototype._onTimeout=function(t){this._type="wheel",this._delta-=this._lastValue,this.isActive()||this._start(t);},zi.prototype._start=function(e){if(this._delta){this._frameId&&(this._map._cancelRenderFrame(this._frameId),this._frameId=null),this._active=!0,this._map.fire(new t.Event("movestart",{originalEvent:e})),this._map.fire(new t.Event("zoomstart",{originalEvent:e})),this._finishTimeout&&clearTimeout(this._finishTimeout);var n=i.mousePos(this._el,e);this._around=B.convert(this._aroundCenter?this._map.getCenter():this._map.unproject(n)),this._aroundPoint=this._map.transform.locationPoint(this._around),this._frameId||(this._frameId=this._map._requestRenderFrame(this._onScrollFrame));}},zi.prototype._onScrollFrame=function(){var e=this;if(this._frameId=null,this.isActive()){var i=this._map.transform;if(0!==this._delta){var n="wheel"===this._type&&Math.abs(this._delta)>4.000244140625?1/450:.01,o=2/(1+Math.exp(-Math.abs(this._delta*n)));this._delta<0&&0!==o&&(o=1/o);var r="number"==typeof this._targetZoom?i.zoomScale(this._targetZoom):i.scale;this._targetZoom=Math.min(i.maxZoom,Math.max(i.minZoom,i.scaleZoom(r*o))),"wheel"===this._type&&(this._startZoom=i.zoom,this._easing=this._smoothOutEasing(200)),this._delta=0;}var a="number"==typeof this._targetZoom?this._targetZoom:i.zoom,s=this._startZoom,l=this._easing,c=!1;if("wheel"===this._type&&s&&l){var u=Math.min((t.default$2.now()-this._lastWheelEventTime)/200,1),h=l(u);i.zoom=t.number(s,a,h),u<1?this._frameId||(this._frameId=this._map._requestRenderFrame(this._onScrollFrame)):c=!0;}else i.zoom=a,c=!0;i.setLocationAtPoint(this._around,this._aroundPoint),this._map.fire(new t.Event("move",{originalEvent:this._lastWheelEvent})),this._map.fire(new t.Event("zoom",{originalEvent:this._lastWheelEvent})),c&&(this._active=!1,this._finishTimeout=setTimeout(function(){e._map.fire(new t.Event("zoomend",{originalEvent:e._lastWheelEvent})),e._map.fire(new t.Event("moveend",{originalEvent:e._lastWheelEvent})),delete e._targetZoom;},200));}},zi.prototype._smoothOutEasing=function(e){var i=t.ease;if(this._prevEase){var n=this._prevEase,o=(t.default$2.now()-n.start)/n.duration,r=n.easing(o+.01)-n.easing(o),a=.27/Math.sqrt(r*r+1e-4)*.01,s=Math.sqrt(.0729-a*a);i=t.bezier(a,s,.25,1);}return this._prevEase={start:t.default$2.now(),duration:e,easing:i},i};var Ai=function(e,i){this._map=e,this._el=e.getCanvasContainer(),this._container=e.getContainer(),this._clickTolerance=i.clickTolerance||1,t.bindAll(["_onMouseMove","_onMouseUp","_onKeyDown"],this);};Ai.prototype.isEnabled=function(){return!!this._enabled},Ai.prototype.isActive=function(){return!!this._active},Ai.prototype.enable=function(){this.isEnabled()||(this._enabled=!0);},Ai.prototype.disable=function(){this.isEnabled()&&(this._enabled=!1);},Ai.prototype.onMouseDown=function(e){this.isEnabled()&&e.shiftKey&&0===e.button&&(t.default$1.document.addEventListener("mousemove",this._onMouseMove,!1),t.default$1.document.addEventListener("keydown",this._onKeyDown,!1),t.default$1.document.addEventListener("mouseup",this._onMouseUp,!1),i.disableDrag(),this._startPos=this._lastPos=i.mousePos(this._el,e),this._active=!0);},Ai.prototype._onMouseMove=function(t){var e=i.mousePos(this._el,t);if(!(this._lastPos.equals(e)||!this._box&&e.dist(this._startPos)<this._clickTolerance)){var n=this._startPos;this._lastPos=e,this._box||(this._box=i.create("div","mapboxgl-boxzoom",this._container),this._container.classList.add("mapboxgl-crosshair"),this._fireEvent("boxzoomstart",t));var o=Math.min(n.x,e.x),r=Math.max(n.x,e.x),a=Math.min(n.y,e.y),s=Math.max(n.y,e.y);i.setTransform(this._box,"translate("+o+"px,"+a+"px)"),this._box.style.width=r-o+"px",this._box.style.height=s-a+"px";}},Ai.prototype._onMouseUp=function(e){if(0===e.button){var n=this._startPos,o=i.mousePos(this._el,e),r=(new O).extend(this._map.unproject(n)).extend(this._map.unproject(o));this._finish(),i.suppressClick(),n.x===o.x&&n.y===o.y?this._fireEvent("boxzoomcancel",e):this._map.fitBounds(r,{linear:!0}).fire(new t.Event("boxzoomend",{originalEvent:e,boxZoomBounds:r}));}},Ai.prototype._onKeyDown=function(t){27===t.keyCode&&(this._finish(),this._fireEvent("boxzoomcancel",t));},Ai.prototype._finish=function(){this._active=!1,t.default$1.document.removeEventListener("mousemove",this._onMouseMove,!1),t.default$1.document.removeEventListener("keydown",this._onKeyDown,!1),t.default$1.document.removeEventListener("mouseup",this._onMouseUp,!1),this._container.classList.remove("mapboxgl-crosshair"),this._box&&(i.remove(this._box),this._box=null),i.enableDrag(),delete this._startPos,delete this._lastPos;},Ai.prototype._fireEvent=function(e,i){return this._map.fire(new t.Event(e,{originalEvent:i}))};var Mi=t.bezier(0,0,.25,1),Ri=function(e,i){this._map=e,this._el=i.element||e.getCanvasContainer(),this._state="disabled",this._button=i.button||"right",this._bearingSnap=i.bearingSnap||0,this._pitchWithRotate=!1!==i.pitchWithRotate,t.bindAll(["onMouseDown","_onMouseMove","_onMouseUp","_onBlur","_onDragFrame"],this);};Ri.prototype.isEnabled=function(){return"disabled"!==this._state},Ri.prototype.isActive=function(){return"active"===this._state},Ri.prototype.enable=function(){this.isEnabled()||(this._state="enabled");},Ri.prototype.disable=function(){if(this.isEnabled())switch(this._state){case"active":this._state="disabled",this._unbind(),this._deactivate(),this._fireEvent("rotateend"),this._pitchWithRotate&&this._fireEvent("pitchend"),this._fireEvent("moveend");break;case"pending":this._state="disabled",this._unbind();break;default:this._state="disabled";}},Ri.prototype.onMouseDown=function(e){if("enabled"===this._state){if("right"===this._button){if(this._eventButton=i.mouseButton(e),this._eventButton!==(e.ctrlKey?0:2))return}else{if(e.ctrlKey||0!==i.mouseButton(e))return;this._eventButton=0;}i.disableDrag(),t.default$1.document.addEventListener("mousemove",this._onMouseMove,{capture:!0}),t.default$1.document.addEventListener("mouseup",this._onMouseUp),t.default$1.addEventListener("blur",this._onBlur),this._state="pending",this._inertia=[[t.default$2.now(),this._map.getBearing()]],this._startPos=this._lastPos=i.mousePos(this._el,e),this._center=this._map.transform.centerPoint,e.preventDefault();}},Ri.prototype._onMouseMove=function(t){var e=i.mousePos(this._el,t);this._lastPos.equals(e)||(this._lastMoveEvent=t,this._lastPos=e,"pending"===this._state&&(this._state="active",this._fireEvent("rotatestart",t),this._fireEvent("movestart",t),this._pitchWithRotate&&this._fireEvent("pitchstart",t)),this._frameId||(this._frameId=this._map._requestRenderFrame(this._onDragFrame)));},Ri.prototype._onDragFrame=function(){this._frameId=null;var e=this._lastMoveEvent;if(e){var i=this._map.transform,n=this._startPos,o=this._lastPos,r=.8*(n.x-o.x),a=-.5*(n.y-o.y),s=i.bearing-r,l=i.pitch-a,c=this._inertia,u=c[c.length-1];this._drainInertiaBuffer(),c.push([t.default$2.now(),this._map._normalizeBearing(s,u[1])]),i.bearing=s,this._pitchWithRotate&&(this._fireEvent("pitch",e),i.pitch=l),this._fireEvent("rotate",e),this._fireEvent("move",e),delete this._lastMoveEvent,this._startPos=this._lastPos;}},Ri.prototype._onMouseUp=function(t){if(i.mouseButton(t)===this._eventButton)switch(this._state){case"active":this._state="enabled",i.suppressClick(),this._unbind(),this._deactivate(),this._inertialRotate(t);break;case"pending":this._state="enabled",this._unbind();}},Ri.prototype._onBlur=function(t){switch(this._state){case"active":this._state="enabled",this._unbind(),this._deactivate(),this._fireEvent("rotateend",t),this._pitchWithRotate&&this._fireEvent("pitchend",t),this._fireEvent("moveend",t);break;case"pending":this._state="enabled",this._unbind();}},Ri.prototype._unbind=function(){t.default$1.document.removeEventListener("mousemove",this._onMouseMove,{capture:!0}),t.default$1.document.removeEventListener("mouseup",this._onMouseUp),t.default$1.removeEventListener("blur",this._onBlur),i.enableDrag();},Ri.prototype._deactivate=function(){this._frameId&&(this._map._cancelRenderFrame(this._frameId),this._frameId=null),delete this._lastMoveEvent,delete this._startPos,delete this._lastPos;},Ri.prototype._inertialRotate=function(t){var e=this;this._fireEvent("rotateend",t),this._drainInertiaBuffer();var i=this._map,n=i.getBearing(),o=this._inertia,r=function(){Math.abs(n)<e._bearingSnap?i.resetNorth({noMoveStart:!0},{originalEvent:t}):e._fireEvent("moveend",t),e._pitchWithRotate&&e._fireEvent("pitchend",t);};if(o.length<2)r();else{var a=o[0],s=o[o.length-1],l=o[o.length-2],c=i._normalizeBearing(n,l[1]),u=s[1]-a[1],h=u<0?-1:1,p=(s[0]-a[0])/1e3;if(0!==u&&0!==p){var d=Math.abs(u*(.25/p));d>180&&(d=180);var f=d/180;c+=h*d*(f/2),Math.abs(i._normalizeBearing(c,0))<this._bearingSnap&&(c=i._normalizeBearing(0,c)),i.rotateTo(c,{duration:1e3*f,easing:Mi,noMoveStart:!0},{originalEvent:t});}else r();}},Ri.prototype._fireEvent=function(e,i){return this._map.fire(new t.Event(e,i?{originalEvent:i}:{}))},Ri.prototype._drainInertiaBuffer=function(){for(var e=this._inertia,i=t.default$2.now();e.length>0&&i-e[0][0]>160;)e.shift();};var Di=t.bezier(0,0,.3,1),Li=function(e,i){this._map=e,this._el=e.getCanvasContainer(),this._state="disabled",this._clickTolerance=i.clickTolerance||1,t.bindAll(["_onMove","_onMouseUp","_onTouchEnd","_onBlur","_onDragFrame"],this);};Li.prototype.isEnabled=function(){return"disabled"!==this._state},Li.prototype.isActive=function(){return"active"===this._state},Li.prototype.enable=function(){this.isEnabled()||(this._el.classList.add("mapboxgl-touch-drag-pan"),this._state="enabled");},Li.prototype.disable=function(){if(this.isEnabled())switch(this._el.classList.remove("mapboxgl-touch-drag-pan"),this._state){case"active":this._state="disabled",this._unbind(),this._deactivate(),this._fireEvent("dragend"),this._fireEvent("moveend");break;case"pending":this._state="disabled",this._unbind();break;default:this._state="disabled";}},Li.prototype.onMouseDown=function(e){"enabled"===this._state&&(e.ctrlKey||0!==i.mouseButton(e)||(i.addEventListener(t.default$1.document,"mousemove",this._onMove,{capture:!0}),i.addEventListener(t.default$1.document,"mouseup",this._onMouseUp),this._start(e)));},Li.prototype.onTouchStart=function(e){"enabled"===this._state&&(e.touches.length>1||(i.addEventListener(t.default$1.document,"touchmove",this._onMove,{capture:!0,passive:!1}),i.addEventListener(t.default$1.document,"touchend",this._onTouchEnd),this._start(e)));},Li.prototype._start=function(e){t.default$1.addEventListener("blur",this._onBlur),this._state="pending",this._startPos=this._mouseDownPos=this._lastPos=i.mousePos(this._el,e),this._inertia=[[t.default$2.now(),this._startPos]];},Li.prototype._onMove=function(e){e.preventDefault();var n=i.mousePos(this._el,e);this._lastPos.equals(n)||"pending"===this._state&&n.dist(this._mouseDownPos)<this._clickTolerance||(this._lastMoveEvent=e,this._lastPos=n,this._drainInertiaBuffer(),this._inertia.push([t.default$2.now(),this._lastPos]),"pending"===this._state&&(this._state="active",this._fireEvent("dragstart",e),this._fireEvent("movestart",e)),this._frameId||(this._frameId=this._map._requestRenderFrame(this._onDragFrame)));},Li.prototype._onDragFrame=function(){this._frameId=null;var t=this._lastMoveEvent;if(t){var e=this._map.transform;e.setLocationAtPoint(e.pointLocation(this._startPos),this._lastPos),this._fireEvent("drag",t),this._fireEvent("move",t),this._startPos=this._lastPos,delete this._lastMoveEvent;}},Li.prototype._onMouseUp=function(t){if(0===i.mouseButton(t))switch(this._state){case"active":this._state="enabled",i.suppressClick(),this._unbind(),this._deactivate(),this._inertialPan(t);break;case"pending":this._state="enabled",this._unbind();}},Li.prototype._onTouchEnd=function(t){switch(this._state){case"active":this._state="enabled",this._unbind(),this._deactivate(),this._inertialPan(t);break;case"pending":this._state="enabled",this._unbind();}},Li.prototype._onBlur=function(t){switch(this._state){case"active":this._state="enabled",this._unbind(),this._deactivate(),this._fireEvent("dragend",t),this._fireEvent("moveend",t);break;case"pending":this._state="enabled",this._unbind();}},Li.prototype._unbind=function(){i.removeEventListener(t.default$1.document,"touchmove",this._onMove,{capture:!0,passive:!1}),i.removeEventListener(t.default$1.document,"touchend",this._onTouchEnd),i.removeEventListener(t.default$1.document,"mousemove",this._onMove,{capture:!0}),i.removeEventListener(t.default$1.document,"mouseup",this._onMouseUp),i.removeEventListener(t.default$1,"blur",this._onBlur);},Li.prototype._deactivate=function(){this._frameId&&(this._map._cancelRenderFrame(this._frameId),this._frameId=null),delete this._lastMoveEvent,delete this._startPos,delete this._mouseDownPos,delete this._lastPos;},Li.prototype._inertialPan=function(t){this._fireEvent("dragend",t),this._drainInertiaBuffer();var e=this._inertia;if(e.length<2)this._fireEvent("moveend",t);else{var i=e[e.length-1],n=e[0],o=i[1].sub(n[1]),r=(i[0]-n[0])/1e3;if(0===r||i[1].equals(n[1]))this._fireEvent("moveend",t);else{var a=o.mult(.3/r),s=a.mag();s>1400&&(s=1400,a._unit()._mult(s));var l=s/750,c=a.mult(-l/2);this._map.panBy(c,{duration:1e3*l,easing:Di,noMoveStart:!0},{originalEvent:t});}}},Li.prototype._fireEvent=function(e,i){return this._map.fire(new t.Event(e,i?{originalEvent:i}:{}))},Li.prototype._drainInertiaBuffer=function(){for(var e=this._inertia,i=t.default$2.now();e.length>0&&i-e[0][0]>160;)e.shift();};var Pi=function(e){this._map=e,this._el=e.getCanvasContainer(),t.bindAll(["_onKeyDown"],this);};function ki(t){return t*(2-t)}Pi.prototype.isEnabled=function(){return!!this._enabled},Pi.prototype.enable=function(){this.isEnabled()||(this._el.addEventListener("keydown",this._onKeyDown,!1),this._enabled=!0);},Pi.prototype.disable=function(){this.isEnabled()&&(this._el.removeEventListener("keydown",this._onKeyDown),this._enabled=!1);},Pi.prototype._onKeyDown=function(t){if(!(t.altKey||t.ctrlKey||t.metaKey)){var e=0,i=0,n=0,o=0,r=0;switch(t.keyCode){case 61:case 107:case 171:case 187:e=1;break;case 189:case 109:case 173:e=-1;break;case 37:t.shiftKey?i=-1:(t.preventDefault(),o=-1);break;case 39:t.shiftKey?i=1:(t.preventDefault(),o=1);break;case 38:t.shiftKey?n=1:(t.preventDefault(),r=-1);break;case 40:t.shiftKey?n=-1:(r=1,t.preventDefault());break;default:return}var a=this._map,s=a.getZoom(),l={duration:300,delayEndEvents:500,easing:ki,zoom:e?Math.round(s)+e*(t.shiftKey?2:1):s,bearing:a.getBearing()+15*i,pitch:a.getPitch()+10*n,offset:[100*-o,100*-r],center:a.getCenter()};a.easeTo(l,{originalEvent:t});}};var Bi=function(e){this._map=e,t.bindAll(["_onDblClick","_onZoomEnd"],this);};Bi.prototype.isEnabled=function(){return!!this._enabled},Bi.prototype.isActive=function(){return!!this._active},Bi.prototype.enable=function(){this.isEnabled()||(this._enabled=!0);},Bi.prototype.disable=function(){this.isEnabled()&&(this._enabled=!1);},Bi.prototype.onTouchStart=function(t){var e=this;this.isEnabled()&&(t.points.length>1||(this._tapped?(clearTimeout(this._tapped),this._tapped=null,this._zoom(t)):this._tapped=setTimeout(function(){e._tapped=null;},300)));},Bi.prototype.onDblClick=function(t){this.isEnabled()&&(t.originalEvent.preventDefault(),this._zoom(t));},Bi.prototype._zoom=function(t){this._active=!0,this._map.on("zoomend",this._onZoomEnd),this._map.zoomTo(this._map.getZoom()+(t.originalEvent.shiftKey?-1:1),{around:t.lngLat},t);},Bi.prototype._onZoomEnd=function(){this._active=!1,this._map.off("zoomend",this._onZoomEnd);};var Oi=t.bezier(0,0,.15,1),Fi=function(e){this._map=e,this._el=e.getCanvasContainer(),t.bindAll(["_onMove","_onEnd","_onTouchFrame"],this);};Fi.prototype.isEnabled=function(){return!!this._enabled},Fi.prototype.enable=function(t){this.isEnabled()||(this._el.classList.add("mapboxgl-touch-zoom-rotate"),this._enabled=!0,this._aroundCenter=!!t&&"center"===t.around);},Fi.prototype.disable=function(){this.isEnabled()&&(this._el.classList.remove("mapboxgl-touch-zoom-rotate"),this._enabled=!1);},Fi.prototype.disableRotation=function(){this._rotationDisabled=!0;},Fi.prototype.enableRotation=function(){this._rotationDisabled=!1;},Fi.prototype.onStart=function(e){if(this.isEnabled()&&2===e.touches.length){var n=i.mousePos(this._el,e.touches[0]),o=i.mousePos(this._el,e.touches[1]);this._startVec=n.sub(o),this._gestureIntent=void 0,this._inertia=[],i.addEventListener(t.default$1.document,"touchmove",this._onMove,{passive:!1}),i.addEventListener(t.default$1.document,"touchend",this._onEnd);}},Fi.prototype._getTouchEventData=function(t){var e=i.mousePos(this._el,t.touches[0]),n=i.mousePos(this._el,t.touches[1]),o=e.sub(n);return{vec:o,center:e.add(n).div(2),scale:o.mag()/this._startVec.mag(),bearing:this._rotationDisabled?0:180*o.angleWith(this._startVec)/Math.PI}},Fi.prototype._onMove=function(e){if(2===e.touches.length){var i=this._getTouchEventData(e),n=i.vec,o=i.scale,r=i.bearing;if(!this._gestureIntent){var a=Math.abs(1-o)>.15;Math.abs(r)>10?this._gestureIntent="rotate":a&&(this._gestureIntent="zoom"),this._gestureIntent&&(this._map.fire(new t.Event(this._gestureIntent+"start",{originalEvent:e})),this._map.fire(new t.Event("movestart",{originalEvent:e})),this._startVec=n);}this._lastTouchEvent=e,this._frameId||(this._frameId=this._map._requestRenderFrame(this._onTouchFrame)),e.preventDefault();}},Fi.prototype._onTouchFrame=function(){this._frameId=null;var e=this._gestureIntent;if(e){var i=this._map.transform;this._startScale||(this._startScale=i.scale,this._startBearing=i.bearing);var n=this._getTouchEventData(this._lastTouchEvent),o=n.center,r=n.bearing,a=n.scale,s=i.pointLocation(o),l=i.locationPoint(s);"rotate"===e&&(i.bearing=this._startBearing+r),i.zoom=i.scaleZoom(this._startScale*a),i.setLocationAtPoint(s,l),this._map.fire(new t.Event(e,{originalEvent:this._lastTouchEvent})),this._map.fire(new t.Event("move",{originalEvent:this._lastTouchEvent})),this._drainInertiaBuffer(),this._inertia.push([t.default$2.now(),a,o]);}},Fi.prototype._onEnd=function(e){i.removeEventListener(t.default$1.document,"touchmove",this._onMove,{passive:!1}),i.removeEventListener(t.default$1.document,"touchend",this._onEnd);var n=this._gestureIntent,o=this._startScale;if(this._frameId&&(this._map._cancelRenderFrame(this._frameId),this._frameId=null),delete this._gestureIntent,delete this._startScale,delete this._startBearing,delete this._lastTouchEvent,n){this._map.fire(new t.Event(n+"end",{originalEvent:e})),this._drainInertiaBuffer();var r=this._inertia,a=this._map;if(r.length<2)a.snapToNorth({},{originalEvent:e});else{var s=r[r.length-1],l=r[0],c=a.transform.scaleZoom(o*s[1]),u=a.transform.scaleZoom(o*l[1]),h=c-u,p=(s[0]-l[0])/1e3,d=s[2];if(0!==p&&c!==u){var f=.15*h/p;Math.abs(f)>2.5&&(f=f>0?2.5:-2.5);var m=1e3*Math.abs(f/(12*.15)),_=c+f*m/2e3;_<0&&(_=0),a.easeTo({zoom:_,duration:m,easing:Oi,around:this._aroundCenter?a.getCenter():a.unproject(d),noMoveStart:!0},{originalEvent:e});}else a.snapToNorth({},{originalEvent:e});}}},Fi.prototype._drainInertiaBuffer=function(){for(var e=this._inertia,i=t.default$2.now();e.length>2&&i-e[0][0]>160;)e.shift();};var Ni={scrollZoom:zi,boxZoom:Ai,dragRotate:Ri,dragPan:Li,keyboard:Pi,doubleClickZoom:Bi,touchZoomRotate:Fi};var $i=function(e){function i(i,n){e.call(this),this._moving=!1,this._zooming=!1,this.transform=i,this._bearingSnap=n.bearingSnap,t.bindAll(["_renderFrameCallback"],this);}return e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i,i.prototype.getCenter=function(){return this.transform.center},i.prototype.setCenter=function(t,e){return this.jumpTo({center:t},e)},i.prototype.panBy=function(e,i,n){return e=t.default.convert(e).mult(-1),this.panTo(this.transform.center,t.extend({offset:e},i),n)},i.prototype.panTo=function(e,i,n){return this.easeTo(t.extend({center:e},i),n)},i.prototype.getZoom=function(){return this.transform.zoom},i.prototype.setZoom=function(t,e){return this.jumpTo({zoom:t},e),this},i.prototype.zoomTo=function(e,i,n){return this.easeTo(t.extend({zoom:e},i),n)},i.prototype.zoomIn=function(t,e){return this.zoomTo(this.getZoom()+1,t,e),this},i.prototype.zoomOut=function(t,e){return this.zoomTo(this.getZoom()-1,t,e),this},i.prototype.getBearing=function(){return this.transform.bearing},i.prototype.setBearing=function(t,e){return this.jumpTo({bearing:t},e),this},i.prototype.rotateTo=function(e,i,n){return this.easeTo(t.extend({bearing:e},i),n)},i.prototype.resetNorth=function(e,i){return this.rotateTo(0,t.extend({duration:1e3},e),i),this},i.prototype.snapToNorth=function(t,e){return Math.abs(this.getBearing())<this._bearingSnap?this.resetNorth(t,e):this},i.prototype.getPitch=function(){return this.transform.pitch},i.prototype.setPitch=function(t,e){return this.jumpTo({pitch:t},e),this},i.prototype.cameraForBounds=function(e,i){if("number"==typeof(i=t.extend({padding:{top:0,bottom:0,right:0,left:0},offset:[0,0],maxZoom:this.transform.maxZoom},i)).padding){var n=i.padding;i.padding={top:n,bottom:n,right:n,left:n};}if(t.default$13(Object.keys(i.padding).sort(function(t,e){return t<e?-1:t>e?1:0}),["bottom","left","right","top"])){e=O.convert(e);var o=[(i.padding.left-i.padding.right)/2,(i.padding.top-i.padding.bottom)/2],r=Math.min(i.padding.right,i.padding.left),a=Math.min(i.padding.top,i.padding.bottom);i.offset=[i.offset[0]+o[0],i.offset[1]+o[1]];var s=t.default.convert(i.offset),l=this.transform,c=l.project(e.getNorthWest()),u=l.project(e.getSouthEast()),h=u.sub(c),p=(l.width-2*r-2*Math.abs(s.x))/h.x,d=(l.height-2*a-2*Math.abs(s.y))/h.y;if(!(d<0||p<0))return i.center=l.unproject(c.add(u).div(2)),i.zoom=Math.min(l.scaleZoom(l.scale*Math.min(p,d)),i.maxZoom),i.bearing=0,i;t.warnOnce("Map cannot fit within canvas with the given bounds, padding, and/or offset.");}else t.warnOnce("options.padding must be a positive number, or an Object with keys 'bottom', 'left', 'right', 'top'");},i.prototype.fitBounds=function(e,i,n){var o=this.cameraForBounds(e,i);return o?(i=t.extend(o,i)).linear?this.easeTo(i,n):this.flyTo(i,n):this},i.prototype.jumpTo=function(e,i){this.stop();var n=this.transform,o=!1,r=!1,a=!1;return"zoom"in e&&n.zoom!==+e.zoom&&(o=!0,n.zoom=+e.zoom),void 0!==e.center&&(n.center=B.convert(e.center)),"bearing"in e&&n.bearing!==+e.bearing&&(r=!0,n.bearing=+e.bearing),"pitch"in e&&n.pitch!==+e.pitch&&(a=!0,n.pitch=+e.pitch),this.fire(new t.Event("movestart",i)).fire(new t.Event("move",i)),o&&this.fire(new t.Event("zoomstart",i)).fire(new t.Event("zoom",i)).fire(new t.Event("zoomend",i)),r&&this.fire(new t.Event("rotatestart",i)).fire(new t.Event("rotate",i)).fire(new t.Event("rotateend",i)),a&&this.fire(new t.Event("pitchstart",i)).fire(new t.Event("pitch",i)).fire(new t.Event("pitchend",i)),this.fire(new t.Event("moveend",i))},i.prototype.easeTo=function(e,i){var n=this;this.stop(),!1===(e=t.extend({offset:[0,0],duration:500,easing:t.ease},e)).animate&&(e.duration=0);var o=this.transform,r=this.getZoom(),a=this.getBearing(),s=this.getPitch(),l="zoom"in e?+e.zoom:r,c="bearing"in e?this._normalizeBearing(e.bearing,a):a,u="pitch"in e?+e.pitch:s,h=o.centerPoint.add(t.default.convert(e.offset)),p=o.pointLocation(h),d=B.convert(e.center||p);this._normalizeCenter(d);var f,m,_=o.project(p),g=o.project(d).sub(_),v=o.zoomScale(l-r);return e.around&&(f=B.convert(e.around),m=o.locationPoint(f)),this._zooming=l!==r,this._rotating=a!==c,this._pitching=u!==s,this._prepareEase(i,e.noMoveStart),clearTimeout(this._easeEndTimeoutID),this._ease(function(e){if(n._zooming&&(o.zoom=t.number(r,l,e)),n._rotating&&(o.bearing=t.number(a,c,e)),n._pitching&&(o.pitch=t.number(s,u,e)),f)o.setLocationAtPoint(f,m);else{var p=o.zoomScale(o.zoom-r),d=l>r?Math.min(2,v):Math.max(.5,v),y=Math.pow(d,1-e),x=o.unproject(_.add(g.mult(e*y)).mult(p));o.setLocationAtPoint(o.renderWorldCopies?x.wrap():x,h);}n._fireMoveEvents(i);},function(){e.delayEndEvents?n._easeEndTimeoutID=setTimeout(function(){return n._afterEase(i)},e.delayEndEvents):n._afterEase(i);},e),this},i.prototype._prepareEase=function(e,i){this._moving=!0,i||this.fire(new t.Event("movestart",e)),this._zooming&&this.fire(new t.Event("zoomstart",e)),this._rotating&&this.fire(new t.Event("rotatestart",e)),this._pitching&&this.fire(new t.Event("pitchstart",e));},i.prototype._fireMoveEvents=function(e){this.fire(new t.Event("move",e)),this._zooming&&this.fire(new t.Event("zoom",e)),this._rotating&&this.fire(new t.Event("rotate",e)),this._pitching&&this.fire(new t.Event("pitch",e));},i.prototype._afterEase=function(e){var i=this._zooming,n=this._rotating,o=this._pitching;this._moving=!1,this._zooming=!1,this._rotating=!1,this._pitching=!1,i&&this.fire(new t.Event("zoomend",e)),n&&this.fire(new t.Event("rotateend",e)),o&&this.fire(new t.Event("pitchend",e)),this.fire(new t.Event("moveend",e));},i.prototype.flyTo=function(e,i){var n=this;this.stop(),e=t.extend({offset:[0,0],speed:1.2,curve:1.42,easing:t.ease},e);var o=this.transform,r=this.getZoom(),a=this.getBearing(),s=this.getPitch(),l="zoom"in e?t.clamp(+e.zoom,o.minZoom,o.maxZoom):r,c="bearing"in e?this._normalizeBearing(e.bearing,a):a,u="pitch"in e?+e.pitch:s,h=o.zoomScale(l-r),p=o.centerPoint.add(t.default.convert(e.offset)),d=o.pointLocation(p),f=B.convert(e.center||d);this._normalizeCenter(f);var m=o.project(d),_=o.project(f).sub(m),g=e.curve,v=Math.max(o.width,o.height),y=v/h,x=_.mag();if("minZoom"in e){var b=t.clamp(Math.min(e.minZoom,r,l),o.minZoom,o.maxZoom),w=v/o.zoomScale(b-r);g=Math.sqrt(w/x*2);}var E=g*g;function T(t){var e=(y*y-v*v+(t?-1:1)*E*E*x*x)/(2*(t?y:v)*E*x);return Math.log(Math.sqrt(e*e+1)-e)}function I(t){return(Math.exp(t)-Math.exp(-t))/2}function C(t){return(Math.exp(t)+Math.exp(-t))/2}var S=T(0),z=function(t){return C(S)/C(S+g*t)},A=function(t){return v*((C(S)*(I(e=S+g*t)/C(e))-I(S))/E)/x;var e;},M=(T(1)-S)/g;if(Math.abs(x)<1e-6||!isFinite(M)){if(Math.abs(v-y)<1e-6)return this.easeTo(e,i);var R=y<v?-1:1;M=Math.abs(Math.log(y/v))/g,A=function(){return 0},z=function(t){return Math.exp(R*g*t)};}if("duration"in e)e.duration=+e.duration;else{var D="screenSpeed"in e?+e.screenSpeed/g:+e.speed;e.duration=1e3*M/D;}return e.maxDuration&&e.duration>e.maxDuration&&(e.duration=0),this._zooming=!0,this._rotating=a!==c,this._pitching=u!==s,this._prepareEase(i,!1),this._ease(function(e){var h=e*M,d=1/z(h);o.zoom=1===e?l:r+o.scaleZoom(d),n._rotating&&(o.bearing=t.number(a,c,e)),n._pitching&&(o.pitch=t.number(s,u,e));var f=o.unproject(m.add(_.mult(A(h))).mult(d));o.setLocationAtPoint(o.renderWorldCopies?f.wrap():f,p),n._fireMoveEvents(i);},function(){return n._afterEase(i)},e),this},i.prototype.isEasing=function(){return!!this._easeFrameId},i.prototype.stop=function(){if(this._easeFrameId&&(this._cancelRenderFrame(this._easeFrameId),delete this._easeFrameId,delete this._onEaseFrame),this._onEaseEnd){var t=this._onEaseEnd;delete this._onEaseEnd,t.call(this);}return this},i.prototype._ease=function(e,i,n){!1===n.animate||0===n.duration?(e(1),i()):(this._easeStart=t.default$2.now(),this._easeOptions=n,this._onEaseFrame=e,this._onEaseEnd=i,this._easeFrameId=this._requestRenderFrame(this._renderFrameCallback));},i.prototype._renderFrameCallback=function(){var e=Math.min((t.default$2.now()-this._easeStart)/this._easeOptions.duration,1);this._onEaseFrame(this._easeOptions.easing(e)),e<1?this._easeFrameId=this._requestRenderFrame(this._renderFrameCallback):this.stop();},i.prototype._normalizeBearing=function(e,i){e=t.wrap(e,-180,180);var n=Math.abs(e-i);return Math.abs(e-360-i)<n&&(e-=360),Math.abs(e+360-i)<n&&(e+=360),e},i.prototype._normalizeCenter=function(t){var e=this.transform;if(e.renderWorldCopies&&!e.lngRange){var i=t.lng-e.center.lng;t.lng+=i>180?-360:i<-180?360:0;}},i}(t.Evented),Ui=function(e){void 0===e&&(e={}),this.options=e,t.bindAll(["_updateEditLink","_updateData","_updateCompact"],this);};Ui.prototype.getDefaultPosition=function(){return"bottom-right"},Ui.prototype.onAdd=function(t){var e=this.options&&this.options.compact;return this._map=t,this._container=i.create("div","mapboxgl-ctrl mapboxgl-ctrl-attrib"),e&&this._container.classList.add("mapboxgl-compact"),this._updateAttributions(),this._updateEditLink(),this._map.on("sourcedata",this._updateData),this._map.on("moveend",this._updateEditLink),void 0===e&&(this._map.on("resize",this._updateCompact),this._updateCompact()),this._container},Ui.prototype.onRemove=function(){i.remove(this._container),this._map.off("sourcedata",this._updateData),this._map.off("moveend",this._updateEditLink),this._map.off("resize",this._updateCompact),this._map=void 0;},Ui.prototype._updateEditLink=function(){var t=this._editLink;t||(t=this._editLink=this._container.querySelector(".mapbox-improve-map"));var e=[{key:"owner",value:this.styleOwner},{key:"id",value:this.styleId},{key:"access_token",value:h.ACCESS_TOKEN}];if(t){var i=e.reduce(function(t,i,n){return i.value&&(t+=i.key+"="+i.value+(n<e.length-1?"&":"")),t},"?");t.href="https://www.mapbox.com/feedback/"+i+(this._map._hash?this._map._hash.getHashString(!0):"");}},Ui.prototype._updateData=function(t){t&&"metadata"===t.sourceDataType&&(this._updateAttributions(),this._updateEditLink());},Ui.prototype._updateAttributions=function(){if(this._map.style){var t=[];if(this._map.style.stylesheet){var e=this._map.style.stylesheet;this.styleOwner=e.owner,this.styleId=e.id;}var i=this._map.style.sourceCaches;for(var n in i){var o=i[n].getSource();o.attribution&&t.indexOf(o.attribution)<0&&t.push(o.attribution);}t.sort(function(t,e){return t.length-e.length}),(t=t.filter(function(e,i){for(var n=i+1;n<t.length;n++)if(t[n].indexOf(e)>=0)return!1;return!0})).length?(this._container.innerHTML=t.join(" | "),this._container.classList.remove("mapboxgl-attrib-empty")):this._container.classList.add("mapboxgl-attrib-empty"),this._editLink=null;}},Ui.prototype._updateCompact=function(){this._map.getCanvasContainer().offsetWidth<=640?this._container.classList.add("mapboxgl-compact"):this._container.classList.remove("mapboxgl-compact");};var Zi=function(){t.bindAll(["_updateLogo"],this),t.bindAll(["_updateCompact"],this);};Zi.prototype.onAdd=function(t){this._map=t,this._container=i.create("div","mapboxgl-ctrl");var e=i.create("a","mapboxgl-ctrl-logo");return e.target="_blank",e.href="https://www.mapbox.com/",e.setAttribute("aria-label","Mapbox logo"),e.setAttribute("rel","noopener"),this._container.appendChild(e),this._container.style.display="none",this._map.on("sourcedata",this._updateLogo),this._updateLogo(),this._map.on("resize",this._updateCompact),this._updateCompact(),this._container},Zi.prototype.onRemove=function(){i.remove(this._container),this._map.off("sourcedata",this._updateLogo),this._map.off("resize",this._updateCompact);},Zi.prototype.getDefaultPosition=function(){return"bottom-left"},Zi.prototype._updateLogo=function(t){t&&"metadata"!==t.sourceDataType||(this._container.style.display=this._logoRequired()?"block":"none");},Zi.prototype._logoRequired=function(){if(this._map.style){var t=this._map.style.sourceCaches;for(var e in t){if(t[e].getSource().mapbox_logo)return!0}return!1}},Zi.prototype._updateCompact=function(){var t=this._container.children;if(t.length){var e=t[0];this._map.getCanvasContainer().offsetWidth<250?e.classList.add("mapboxgl-compact"):e.classList.remove("mapboxgl-compact");}};var Vi=function(){this._queue=[],this._id=0,this._cleared=!1,this._currentlyRunning=!1;};Vi.prototype.add=function(t){var e=++this._id;return this._queue.push({callback:t,id:e,cancelled:!1}),e},Vi.prototype.remove=function(t){for(var e=this._currentlyRunning,i=0,n=e?this._queue.concat(e):this._queue;i<n.length;i+=1){var o=n[i];if(o.id===t)return void(o.cancelled=!0)}},Vi.prototype.run=function(){var t=this._currentlyRunning=this._queue;this._queue=[];for(var e=0,i=t;e<i.length;e+=1){var n=i[e];if(!n.cancelled&&(n.callback(),this._cleared))break}this._cleared=!1,this._currentlyRunning=!1;},Vi.prototype.clear=function(){this._currentlyRunning&&(this._cleared=!0),this._queue=[];};var ji=t.default$1.HTMLImageElement,Gi=t.default$1.HTMLElement,Wi={center:[0,0],zoom:0,bearing:0,pitch:0,minZoom:0,maxZoom:22,interactive:!0,scrollZoom:!0,boxZoom:!0,dragRotate:!0,dragPan:!0,keyboard:!0,doubleClickZoom:!0,touchZoomRotate:!0,bearingSnap:7,clickTolerance:3,hash:!1,attributionControl:!0,failIfMajorPerformanceCaveat:!1,preserveDrawingBuffer:!1,trackResize:!0,renderWorldCopies:!0,refreshExpiredTiles:!0,maxTileCacheSize:null,transformRequest:null,fadeDuration:300,crossSourceCollisions:!0},qi=function(n){function o(e){if(null!=(e=t.extend({},Wi,e)).minZoom&&null!=e.maxZoom&&e.minZoom>e.maxZoom)throw new Error("maxZoom must be greater than minZoom");var o=new wi(e.minZoom,e.maxZoom,e.renderWorldCopies);n.call(this,o,e),this._interactive=e.interactive,this._maxTileCacheSize=e.maxTileCacheSize,this._failIfMajorPerformanceCaveat=e.failIfMajorPerformanceCaveat,this._preserveDrawingBuffer=e.preserveDrawingBuffer,this._trackResize=e.trackResize,this._bearingSnap=e.bearingSnap,this._refreshExpiredTiles=e.refreshExpiredTiles,this._fadeDuration=e.fadeDuration,this._crossSourceCollisions=e.crossSourceCollisions,this._crossFadingFactor=1,this._collectResourceTiming=e.collectResourceTiming,this._renderTaskQueue=new Vi;var r=e.transformRequest;if(this._transformRequest=r?function(t,e){return r(t,e)||{url:t}}:function(t){return{url:t}},"string"==typeof e.container){var a=t.default$1.document.getElementById(e.container);if(!a)throw new Error("Container '"+e.container+"' not found.");this._container=a;}else{if(!(e.container instanceof Gi))throw new Error("Invalid type: 'container' must be a String or HTMLElement.");this._container=e.container;}if(e.maxBounds&&this.setMaxBounds(e.maxBounds),t.bindAll(["_onWindowOnline","_onWindowResize","_contextLost","_contextRestored","_update","_render","_onData","_onDataLoading"],this),this._setupContainer(),this._setupPainter(),void 0===this.painter)throw new Error("Failed to initialize WebGL.");this.on("move",this._update.bind(this,!1)),this.on("zoom",this._update.bind(this,!0)),void 0!==t.default$1&&(t.default$1.addEventListener("online",this._onWindowOnline,!1),t.default$1.addEventListener("resize",this._onWindowResize,!1)),function(t,e){var n=t.getCanvasContainer(),o=null,r=!1,a=null;for(var s in Ni)t[s]=new Ni[s](t,e),e.interactive&&e[s]&&t[s].enable(e[s]);i.addEventListener(n,"mouseout",function(e){t.fire(new Ii("mouseout",t,e));}),i.addEventListener(n,"mousedown",function(o){r=!0,a=i.mousePos(n,o);var s=new Ii("mousedown",t,o);t.fire(s),s.defaultPrevented||(e.interactive&&!t.doubleClickZoom.isActive()&&t.stop(),t.boxZoom.onMouseDown(o),t.boxZoom.isActive()||t.dragPan.isActive()||t.dragRotate.onMouseDown(o),t.boxZoom.isActive()||t.dragRotate.isActive()||t.dragPan.onMouseDown(o));}),i.addEventListener(n,"mouseup",function(e){var i=t.dragRotate.isActive();o&&!i&&t.fire(new Ii("contextmenu",t,o)),o=null,r=!1,t.fire(new Ii("mouseup",t,e));}),i.addEventListener(n,"mousemove",function(e){if(!t.dragPan.isActive()&&!t.dragRotate.isActive()){for(var i=e.target;i&&i!==n;)i=i.parentNode;i===n&&t.fire(new Ii("mousemove",t,e));}}),i.addEventListener(n,"mouseover",function(e){for(var i=e.target;i&&i!==n;)i=i.parentNode;i===n&&t.fire(new Ii("mouseover",t,e));}),i.addEventListener(n,"touchstart",function(i){var n=new Ci("touchstart",t,i);t.fire(n),n.defaultPrevented||(e.interactive&&t.stop(),t.boxZoom.isActive()||t.dragRotate.isActive()||t.dragPan.onTouchStart(i),t.touchZoomRotate.onStart(i),t.doubleClickZoom.onTouchStart(n));},{passive:!1}),i.addEventListener(n,"touchmove",function(e){t.fire(new Ci("touchmove",t,e));},{passive:!1}),i.addEventListener(n,"touchend",function(e){t.fire(new Ci("touchend",t,e));}),i.addEventListener(n,"touchcancel",function(e){t.fire(new Ci("touchcancel",t,e));}),i.addEventListener(n,"click",function(o){var r=i.mousePos(n,o);(r.equals(a)||r.dist(a)<e.clickTolerance)&&t.fire(new Ii("click",t,o));}),i.addEventListener(n,"dblclick",function(e){var i=new Ii("dblclick",t,e);t.fire(i),i.defaultPrevented||t.doubleClickZoom.onDblClick(i);}),i.addEventListener(n,"contextmenu",function(e){var i=t.dragRotate.isActive();r||i?r&&(o=e):t.fire(new Ii("contextmenu",t,e)),e.preventDefault();}),i.addEventListener(n,"wheel",function(i){e.interactive&&t.stop();var n=new Si("wheel",t,i);t.fire(n),n.defaultPrevented||t.scrollZoom.onWheel(i);},{passive:!1});}(this,e),this._hash=e.hash&&(new Ti).addTo(this),this._hash&&this._hash._onHashChange()||this.jumpTo({center:e.center,zoom:e.zoom,bearing:e.bearing,pitch:e.pitch}),this.resize(),e.style&&this.setStyle(e.style,{localIdeographFontFamily:e.localIdeographFontFamily}),e.attributionControl&&this.addControl(new Ui),this.addControl(new Zi,e.logoPosition),this.on("style.load",function(){this.transform.unmodified&&this.jumpTo(this.style.stylesheet);}),this.on("data",this._onData),this.on("dataloading",this._onDataLoading);}n&&(o.__proto__=n),o.prototype=Object.create(n&&n.prototype),o.prototype.constructor=o;var r={showTileBoundaries:{configurable:!0},showCollisionBoxes:{configurable:!0},showOverdrawInspector:{configurable:!0},repaint:{configurable:!0},vertices:{configurable:!0}};return o.prototype.addControl=function(t,e){void 0===e&&t.getDefaultPosition&&(e=t.getDefaultPosition()),void 0===e&&(e="top-right");var i=t.onAdd(this),n=this._controlPositions[e];return-1!==e.indexOf("bottom")?n.insertBefore(i,n.firstChild):n.appendChild(i),this},o.prototype.removeControl=function(t){return t.onRemove(this),this},o.prototype.resize=function(e){var i=this._containerDimensions(),n=i[0],o=i[1];return this._resizeCanvas(n,o),this.transform.resize(n,o),this.painter.resize(n,o),this.fire(new t.Event("movestart",e)).fire(new t.Event("move",e)).fire(new t.Event("resize",e)).fire(new t.Event("moveend",e)),this},o.prototype.getBounds=function(){return(new O).extend(this.transform.pointLocation(new t.default(0,0))).extend(this.transform.pointLocation(new t.default(this.transform.width,0))).extend(this.transform.pointLocation(new t.default(this.transform.width,this.transform.height))).extend(this.transform.pointLocation(new t.default(0,this.transform.height)))},o.prototype.getMaxBounds=function(){return this.transform.latRange&&2===this.transform.latRange.length&&this.transform.lngRange&&2===this.transform.lngRange.length?new O([this.transform.lngRange[0],this.transform.latRange[0]],[this.transform.lngRange[1],this.transform.latRange[1]]):null},o.prototype.setMaxBounds=function(t){if(t){var e=O.convert(t);this.transform.lngRange=[e.getWest(),e.getEast()],this.transform.latRange=[e.getSouth(),e.getNorth()],this.transform._constrain(),this._update();}else null==t&&(this.transform.lngRange=null,this.transform.latRange=null,this._update());return this},o.prototype.setMinZoom=function(t){if((t=null==t?0:t)>=0&&t<=this.transform.maxZoom)return this.transform.minZoom=t,this._update(),this.getZoom()<t&&this.setZoom(t),this;throw new Error("minZoom must be between 0 and the current maxZoom, inclusive")},o.prototype.getMinZoom=function(){return this.transform.minZoom},o.prototype.setMaxZoom=function(t){if((t=null==t?22:t)>=this.transform.minZoom)return this.transform.maxZoom=t,this._update(),this.getZoom()>t&&this.setZoom(t),this;throw new Error("maxZoom must be greater than the current minZoom")},o.prototype.getRenderWorldCopies=function(){return this.transform.renderWorldCopies},o.prototype.setRenderWorldCopies=function(t){return this.transform.renderWorldCopies=t,this._update(),this},o.prototype.getMaxZoom=function(){return this.transform.maxZoom},o.prototype.project=function(t){return this.transform.locationPoint(B.convert(t))},o.prototype.unproject=function(e){return this.transform.pointLocation(t.default.convert(e))},o.prototype.isMoving=function(){return this._moving||this.dragPan.isActive()||this.dragRotate.isActive()||this.scrollZoom.isActive()},o.prototype.isZooming=function(){return this._zooming||this.scrollZoom.isActive()},o.prototype.isRotating=function(){return this._rotating||this.dragRotate.isActive()},o.prototype.on=function(t,e,i){var o,r=this;if(void 0===i)return n.prototype.on.call(this,t,e);var a=function(){if("mouseenter"===t||"mouseover"===t){var n=!1;return{layer:e,listener:i,delegates:{mousemove:function(o){var a=r.getLayer(e)?r.queryRenderedFeatures(o.point,{layers:[e]}):[];a.length?n||(n=!0,i.call(r,new Ii(t,r,o.originalEvent,{features:a}))):n=!1;},mouseout:function(){n=!1;}}}}if("mouseleave"===t||"mouseout"===t){var a=!1;return{layer:e,listener:i,delegates:{mousemove:function(n){(r.getLayer(e)?r.queryRenderedFeatures(n.point,{layers:[e]}):[]).length?a=!0:a&&(a=!1,i.call(r,new Ii(t,r,n.originalEvent)));},mouseout:function(e){a&&(a=!1,i.call(r,new Ii(t,r,e.originalEvent)));}}}}return{layer:e,listener:i,delegates:(o={},o[t]=function(t){var n=r.getLayer(e)?r.queryRenderedFeatures(t.point,{layers:[e]}):[];n.length&&(t.features=n,i.call(r,t),delete t.features);},o)}}();for(var s in this._delegatedListeners=this._delegatedListeners||{},this._delegatedListeners[t]=this._delegatedListeners[t]||[],this._delegatedListeners[t].push(a),a.delegates)r.on(s,a.delegates[s]);return this},o.prototype.off=function(t,e,i){if(void 0===i)return n.prototype.off.call(this,t,e);if(this._delegatedListeners&&this._delegatedListeners[t])for(var o=this._delegatedListeners[t],r=0;r<o.length;r++){var a=o[r];if(a.layer===e&&a.listener===i){for(var s in a.delegates)this.off(s,a.delegates[s]);return o.splice(r,1),this}}return this},o.prototype.queryRenderedFeatures=function(e,i){var n;return 2===arguments.length?(e=arguments[0],i=arguments[1]):1===arguments.length&&((n=arguments[0])instanceof t.default||Array.isArray(n))?(e=arguments[0],i={}):1===arguments.length?(e=void 0,i=arguments[0]):(e=void 0,i={}),this.style?this.style.queryRenderedFeatures(this._makeQueryGeometry(e),i,this.transform):[]},o.prototype._makeQueryGeometry=function(e){var i,n=this;if(void 0===e&&(e=[t.default.convert([0,0]),t.default.convert([this.transform.width,this.transform.height])]),e instanceof t.default||"number"==typeof e[0]){i=[t.default.convert(e)];}else{var o=[t.default.convert(e[0]),t.default.convert(e[1])];i=[o[0],new t.default(o[1].x,o[0].y),o[1],new t.default(o[0].x,o[1].y),o[0]];}return{viewport:i,worldCoordinate:i.map(function(t){return n.transform.pointCoordinate(t)})}},o.prototype.querySourceFeatures=function(t,e){return this.style.querySourceFeatures(t,e)},o.prototype.setStyle=function(e,i){if((!i||!1!==i.diff&&!i.localIdeographFontFamily)&&this.style&&e&&"object"==typeof e)try{return this.style.setState(e)&&this._update(!0),this}catch(e){t.warnOnce("Unable to perform style diff: "+(e.message||e.error||e)+".  Rebuilding the style from scratch.");}return this.style&&(this.style.setEventedParent(null),this.style._remove()),e?(this.style=new Ue(this,i||{}),this.style.setEventedParent(this,{style:this.style}),"string"==typeof e?this.style.loadURL(e):this.style.loadJSON(e),this):(delete this.style,this)},o.prototype.getStyle=function(){if(this.style)return this.style.serialize()},o.prototype.isStyleLoaded=function(){return this.style?this.style.loaded():t.warnOnce("There is no style added to the map.")},o.prototype.addSource=function(t,e){return this.style.addSource(t,e),this._update(!0),this},o.prototype.isSourceLoaded=function(e){var i=this.style&&this.style.sourceCaches[e];if(void 0!==i)return i.loaded();this.fire(new t.ErrorEvent(new Error("There is no source with ID '"+e+"'")));},o.prototype.areTilesLoaded=function(){var t=this.style&&this.style.sourceCaches;for(var e in t){var i=t[e]._tiles;for(var n in i){var o=i[n];if("loaded"!==o.state&&"errored"!==o.state)return!1}}return!0},o.prototype.addSourceType=function(t,e,i){return this.style.addSourceType(t,e,i)},o.prototype.removeSource=function(t){return this.style.removeSource(t),this._update(!0),this},o.prototype.getSource=function(t){return this.style.getSource(t)},o.prototype.addImage=function(e,i,n){void 0===n&&(n={});var o=n.pixelRatio;void 0===o&&(o=1);var r=n.sdf;if(void 0===r&&(r=!1),i instanceof ji){var a=t.default$2.getImageData(i),s=a.width,l=a.height,c=a.data;this.style.addImage(e,{data:new t.RGBAImage({width:s,height:l},c),pixelRatio:o,sdf:r});}else{if(void 0===i.width||void 0===i.height)return this.fire(new t.ErrorEvent(new Error("Invalid arguments to map.addImage(). The second argument must be an `HTMLImageElement`, `ImageData`, or object with `width`, `height`, and `data` properties with the same format as `ImageData`")));var u=i.width,h=i.height,p=i.data;this.style.addImage(e,{data:new t.RGBAImage({width:u,height:h},new Uint8Array(p)),pixelRatio:o,sdf:r});}},o.prototype.hasImage=function(e){return e?!!this.style.getImage(e):(this.fire(new t.ErrorEvent(new Error("Missing required image id"))),!1)},o.prototype.removeImage=function(t){this.style.removeImage(t);},o.prototype.loadImage=function(e,i){t.getImage(this._transformRequest(e,t.ResourceType.Image),i);},o.prototype.listImages=function(){return this.style.listImages()},o.prototype.addLayer=function(t,e){return this.style.addLayer(t,e),this._update(!0),this},o.prototype.moveLayer=function(t,e){return this.style.moveLayer(t,e),this._update(!0),this},o.prototype.removeLayer=function(t){return this.style.removeLayer(t),this._update(!0),this},o.prototype.getLayer=function(t){return this.style.getLayer(t)},o.prototype.setFilter=function(t,e){return this.style.setFilter(t,e),this._update(!0),this},o.prototype.setLayerZoomRange=function(t,e,i){return this.style.setLayerZoomRange(t,e,i),this._update(!0),this},o.prototype.getFilter=function(t){return this.style.getFilter(t)},o.prototype.setPaintProperty=function(t,e,i){return this.style.setPaintProperty(t,e,i),this._update(!0),this},o.prototype.getPaintProperty=function(t,e){return this.style.getPaintProperty(t,e)},o.prototype.setLayoutProperty=function(t,e,i){return this.style.setLayoutProperty(t,e,i),this._update(!0),this},o.prototype.getLayoutProperty=function(t,e){return this.style.getLayoutProperty(t,e)},o.prototype.setLight=function(t){return this.style.setLight(t),this._update(!0),this},o.prototype.getLight=function(){return this.style.getLight()},o.prototype.setFeatureState=function(t,e){this.style.setFeatureState(t,e),this._update();},o.prototype.getFeatureState=function(t){return this.style.getFeatureState(t)},o.prototype.getContainer=function(){return this._container},o.prototype.getCanvasContainer=function(){return this._canvasContainer},o.prototype.getCanvas=function(){return this._canvas},o.prototype._containerDimensions=function(){var t=0,e=0;return this._container&&(t=this._container.offsetWidth||400,e=this._container.offsetHeight||300),[t,e]},o.prototype._detectMissingCSS=function(){"rgb(250, 128, 114)"!==t.default$1.getComputedStyle(this._missingCSSCanary).getPropertyValue("background-color")&&t.warnOnce("This page appears to be missing CSS declarations for Mapbox GL JS, which may cause the map to display incorrectly. Please ensure your page includes mapbox-gl.css, as described in https://www.mapbox.com/mapbox-gl-js/api/.");},o.prototype._setupContainer=function(){var t=this._container;t.classList.add("mapboxgl-map"),(this._missingCSSCanary=i.create("div","mapboxgl-canary",t)).style.visibility="hidden",this._detectMissingCSS();var e=this._canvasContainer=i.create("div","mapboxgl-canvas-container",t);this._interactive&&e.classList.add("mapboxgl-interactive"),this._canvas=i.create("canvas","mapboxgl-canvas",e),this._canvas.style.position="absolute",this._canvas.addEventListener("webglcontextlost",this._contextLost,!1),this._canvas.addEventListener("webglcontextrestored",this._contextRestored,!1),this._canvas.setAttribute("tabindex","0"),this._canvas.setAttribute("aria-label","Map");var n=this._containerDimensions();this._resizeCanvas(n[0],n[1]);var o=this._controlContainer=i.create("div","mapboxgl-control-container",t),r=this._controlPositions={};["top-left","top-right","bottom-left","bottom-right"].forEach(function(t){r[t]=i.create("div","mapboxgl-ctrl-"+t,o);});},o.prototype._resizeCanvas=function(e,i){var n=t.default$1.devicePixelRatio||1;this._canvas.width=n*e,this._canvas.height=n*i,this._canvas.style.width=e+"px",this._canvas.style.height=i+"px";},o.prototype._setupPainter=function(){var i=t.extend({failIfMajorPerformanceCaveat:this._failIfMajorPerformanceCaveat,preserveDrawingBuffer:this._preserveDrawingBuffer},e.webGLContextAttributes),n=this._canvas.getContext("webgl",i)||this._canvas.getContext("experimental-webgl",i);n?this.painter=new vi(n,this.transform):this.fire(new t.ErrorEvent(new Error("Failed to initialize WebGL")));},o.prototype._contextLost=function(e){e.preventDefault(),this._frame&&(this._frame.cancel(),this._frame=null),this.fire(new t.Event("webglcontextlost",{originalEvent:e}));},o.prototype._contextRestored=function(e){this._setupPainter(),this.resize(),this._update(),this.fire(new t.Event("webglcontextrestored",{originalEvent:e}));},o.prototype.loaded=function(){return!this._styleDirty&&!this._sourcesDirty&&!(!this.style||!this.style.loaded())},o.prototype._update=function(t){this.style&&(this._styleDirty=this._styleDirty||t,this._sourcesDirty=!0,this._rerender());},o.prototype._requestRenderFrame=function(t){return this._update(),this._renderTaskQueue.add(t)},o.prototype._cancelRenderFrame=function(t){this._renderTaskQueue.remove(t);},o.prototype._render=function(){this._renderTaskQueue.run();var e=!1;if(this.style&&this._styleDirty){this._styleDirty=!1;var i=this.transform.zoom,n=t.default$2.now();this.style.zoomHistory.update(i,n);var o=new t.default$23(i,{now:n,fadeDuration:this._fadeDuration,zoomHistory:this.style.zoomHistory,transition:this.style.getTransition()}),r=o.crossFadingFactor();1===r&&r===this._crossFadingFactor||(e=!0,this._crossFadingFactor=r),this.style.update(o);}return this.style&&this._sourcesDirty&&(this._sourcesDirty=!1,this.style._updateSources(this.transform)),this._placementDirty=this.style&&this.style._updatePlacement(this.painter.transform,this.showCollisionBoxes,this._fadeDuration,this._crossSourceCollisions),this.painter.render(this.style,{showTileBoundaries:this.showTileBoundaries,showOverdrawInspector:this._showOverdrawInspector,rotating:this.isRotating(),zooming:this.isZooming(),fadeDuration:this._fadeDuration}),this.fire(new t.Event("render")),this.loaded()&&!this._loaded&&(this._loaded=!0,this.fire(new t.Event("load"))),this.style&&(this.style.hasTransitions()||e)&&(this._styleDirty=!0),(this._sourcesDirty||this._repaint||this._styleDirty||this._placementDirty)&&this._rerender(),this},o.prototype.remove=function(){this._hash&&this._hash.remove(),this._frame&&(this._frame.cancel(),this._frame=null),this._renderTaskQueue.clear(),this.setStyle(null),void 0!==t.default$1&&(t.default$1.removeEventListener("resize",this._onWindowResize,!1),t.default$1.removeEventListener("online",this._onWindowOnline,!1));var e=this.painter.context.gl.getExtension("WEBGL_lose_context");e&&e.loseContext(),Xi(this._canvasContainer),Xi(this._controlContainer),Xi(this._missingCSSCanary),this._container.classList.remove("mapboxgl-map"),this.fire(new t.Event("remove"));},o.prototype._rerender=function(){var e=this;this.style&&!this._frame&&(this._frame=t.default$2.frame(function(){e._frame=null,e._render();}));},o.prototype._onWindowOnline=function(){this._update();},o.prototype._onWindowResize=function(){this._trackResize&&this.resize()._update();},r.showTileBoundaries.get=function(){return!!this._showTileBoundaries},r.showTileBoundaries.set=function(t){this._showTileBoundaries!==t&&(this._showTileBoundaries=t,this._update());},r.showCollisionBoxes.get=function(){return!!this._showCollisionBoxes},r.showCollisionBoxes.set=function(t){this._showCollisionBoxes!==t&&(this._showCollisionBoxes=t,t?this.style._generateCollisionBoxes():this._update());},r.showOverdrawInspector.get=function(){return!!this._showOverdrawInspector},r.showOverdrawInspector.set=function(t){this._showOverdrawInspector!==t&&(this._showOverdrawInspector=t,this._update());},r.repaint.get=function(){return!!this._repaint},r.repaint.set=function(t){this._repaint=t,this._update();},r.vertices.get=function(){return!!this._vertices},r.vertices.set=function(t){this._vertices=t,this._update();},o.prototype._onData=function(e){this._update("style"===e.dataType),this.fire(new t.Event(e.dataType+"data",e));},o.prototype._onDataLoading=function(e){this.fire(new t.Event(e.dataType+"dataloading",e));},Object.defineProperties(o.prototype,r),o}($i);function Xi(t){t.parentNode&&t.parentNode.removeChild(t);}var Hi={showCompass:!0,showZoom:!0},Ki=function(e){var n=this;this.options=t.extend({},Hi,e),this._container=i.create("div","mapboxgl-ctrl mapboxgl-ctrl-group"),this._container.addEventListener("contextmenu",function(t){return t.preventDefault()}),this.options.showZoom&&(this._zoomInButton=this._createButton("mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-in","Zoom In",function(){return n._map.zoomIn()}),this._zoomOutButton=this._createButton("mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-out","Zoom Out",function(){return n._map.zoomOut()})),this.options.showCompass&&(t.bindAll(["_rotateCompassArrow"],this),this._compass=this._createButton("mapboxgl-ctrl-icon mapboxgl-ctrl-compass","Reset North",function(){return n._map.resetNorth()}),this._compassArrow=i.create("span","mapboxgl-ctrl-compass-arrow",this._compass));};function Yi(t,e,i){if(t=new B(t.lng,t.lat),e){var n=new B(t.lng-360,t.lat),o=new B(t.lng+360,t.lat),r=i.locationPoint(t).distSqr(e);i.locationPoint(n).distSqr(e)<r?t=n:i.locationPoint(o).distSqr(e)<r&&(t=o);}for(;Math.abs(t.lng-i.center.lng)>180;){var a=i.locationPoint(t);if(a.x>=0&&a.y>=0&&a.x<=i.width&&a.y<=i.height)break;t.lng>i.center.lng?t.lng-=360:t.lng+=360;}return t}Ki.prototype._rotateCompassArrow=function(){var t="rotate("+this._map.transform.angle*(180/Math.PI)+"deg)";this._compassArrow.style.transform=t;},Ki.prototype.onAdd=function(t){return this._map=t,this.options.showCompass&&(this._map.on("rotate",this._rotateCompassArrow),this._rotateCompassArrow(),this._handler=new Ri(t,{button:"left",element:this._compass}),i.addEventListener(this._compass,"mousedown",this._handler.onMouseDown),this._handler.enable()),this._container},Ki.prototype.onRemove=function(){i.remove(this._container),this.options.showCompass&&(this._map.off("rotate",this._rotateCompassArrow),i.removeEventListener(this._compass,"mousedown",this._handler.onMouseDown),this._handler.disable(),delete this._handler),delete this._map;},Ki.prototype._createButton=function(t,e,n){var o=i.create("button",t,this._container);return o.type="button",o.setAttribute("aria-label",e),o.addEventListener("click",n),o};var Ji={center:"translate(-50%,-50%)",top:"translate(-50%,0)","top-left":"translate(0,0)","top-right":"translate(-100%,0)",bottom:"translate(-50%,-100%)","bottom-left":"translate(0,-100%)","bottom-right":"translate(-100%,-100%)",left:"translate(0,-50%)",right:"translate(-100%,-50%)"};function Qi(t,e,i){var n=t.classList;for(var o in Ji)n.remove("mapboxgl-"+i+"-anchor-"+o);n.add("mapboxgl-"+i+"-anchor-"+e);}var tn,en=function(e){function n(n){if(e.call(this),(arguments[0]instanceof t.default$1.HTMLElement||2===arguments.length)&&(n=t.extend({element:n},arguments[1])),t.bindAll(["_update","_onMove","_onUp","_addDragHandler","_onMapClick"],this),this._anchor=n&&n.anchor||"center",this._color=n&&n.color||"#3FB1CE",this._draggable=n&&n.draggable||!1,this._state="inactive",n&&n.element)this._element=n.element,this._offset=t.default.convert(n&&n.offset||[0,0]);else{this._defaultMarker=!0,this._element=i.create("div");var o=i.createNS("http://www.w3.org/2000/svg","svg");o.setAttributeNS(null,"height","41px"),o.setAttributeNS(null,"width","27px"),o.setAttributeNS(null,"viewBox","0 0 27 41");var r=i.createNS("http://www.w3.org/2000/svg","g");r.setAttributeNS(null,"stroke","none"),r.setAttributeNS(null,"stroke-width","1"),r.setAttributeNS(null,"fill","none"),r.setAttributeNS(null,"fill-rule","evenodd");var a=i.createNS("http://www.w3.org/2000/svg","g");a.setAttributeNS(null,"fill-rule","nonzero");var s=i.createNS("http://www.w3.org/2000/svg","g");s.setAttributeNS(null,"transform","translate(3.0, 29.0)"),s.setAttributeNS(null,"fill","#000000");for(var l=0,c=[{rx:"10.5",ry:"5.25002273"},{rx:"10.5",ry:"5.25002273"},{rx:"9.5",ry:"4.77275007"},{rx:"8.5",ry:"4.29549936"},{rx:"7.5",ry:"3.81822308"},{rx:"6.5",ry:"3.34094679"},{rx:"5.5",ry:"2.86367051"},{rx:"4.5",ry:"2.38636864"}];l<c.length;l+=1){var u=c[l],h=i.createNS("http://www.w3.org/2000/svg","ellipse");h.setAttributeNS(null,"opacity","0.04"),h.setAttributeNS(null,"cx","10.5"),h.setAttributeNS(null,"cy","5.80029008"),h.setAttributeNS(null,"rx",u.rx),h.setAttributeNS(null,"ry",u.ry),s.appendChild(h);}var p=i.createNS("http://www.w3.org/2000/svg","g");p.setAttributeNS(null,"fill",this._color);var d=i.createNS("http://www.w3.org/2000/svg","path");d.setAttributeNS(null,"d","M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z"),p.appendChild(d);var f=i.createNS("http://www.w3.org/2000/svg","g");f.setAttributeNS(null,"opacity","0.25"),f.setAttributeNS(null,"fill","#000000");var m=i.createNS("http://www.w3.org/2000/svg","path");m.setAttributeNS(null,"d","M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z M13.5,1 C20.415404,1 26,6.584596 26,13.5 C26,15.898657 24.495584,19.181431 22.220703,22.738281 C19.945823,26.295132 16.705119,30.142167 13.943359,33.908203 C13.743445,34.180814 13.612715,34.322738 13.5,34.441406 C13.387285,34.322738 13.256555,34.180814 13.056641,33.908203 C10.284481,30.127985 7.4148684,26.314159 5.015625,22.773438 C2.6163816,19.232715 1,15.953538 1,13.5 C1,6.584596 6.584596,1 13.5,1 Z"),f.appendChild(m);var _=i.createNS("http://www.w3.org/2000/svg","g");_.setAttributeNS(null,"transform","translate(6.0, 7.0)"),_.setAttributeNS(null,"fill","#FFFFFF");var g=i.createNS("http://www.w3.org/2000/svg","g");g.setAttributeNS(null,"transform","translate(8.0, 8.0)");var v=i.createNS("http://www.w3.org/2000/svg","circle");v.setAttributeNS(null,"fill","#000000"),v.setAttributeNS(null,"opacity","0.25"),v.setAttributeNS(null,"cx","5.5"),v.setAttributeNS(null,"cy","5.5"),v.setAttributeNS(null,"r","5.4999962");var y=i.createNS("http://www.w3.org/2000/svg","circle");y.setAttributeNS(null,"fill","#FFFFFF"),y.setAttributeNS(null,"cx","5.5"),y.setAttributeNS(null,"cy","5.5"),y.setAttributeNS(null,"r","5.4999962"),g.appendChild(v),g.appendChild(y),a.appendChild(s),a.appendChild(p),a.appendChild(f),a.appendChild(_),a.appendChild(g),o.appendChild(a),this._element.appendChild(o),this._offset=t.default.convert(n&&n.offset||[0,-14]);}this._element.classList.add("mapboxgl-marker"),this._popup=null;}return e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n,n.prototype.addTo=function(t){return this.remove(),this._map=t,t.getCanvasContainer().appendChild(this._element),t.on("move",this._update),t.on("moveend",this._update),this.setDraggable(this._draggable),this._update(),this._map.on("click",this._onMapClick),this},n.prototype.remove=function(){return this._map&&(this._map.off("click",this._onMapClick),this._map.off("move",this._update),this._map.off("moveend",this._update),this._map.off("mousedown",this._addDragHandler),this._map.off("touchstart",this._addDragHandler),delete this._map),i.remove(this._element),this._popup&&this._popup.remove(),this},n.prototype.getLngLat=function(){return this._lngLat},n.prototype.setLngLat=function(t){return this._lngLat=B.convert(t),this._pos=null,this._popup&&this._popup.setLngLat(this._lngLat),this._update(),this},n.prototype.getElement=function(){return this._element},n.prototype.setPopup=function(t){if(this._popup&&(this._popup.remove(),this._popup=null),t){if(!("offset"in t.options)){var e=Math.sqrt(Math.pow(13.5,2)/2);t.options.offset=this._defaultMarker?{top:[0,0],"top-left":[0,0],"top-right":[0,0],bottom:[0,-38.1],"bottom-left":[e,-1*(24.6+e)],"bottom-right":[-e,-1*(24.6+e)],left:[13.5,-24.6],right:[-13.5,-24.6]}:this._offset;}this._popup=t,this._lngLat&&this._popup.setLngLat(this._lngLat);}return this},n.prototype._onMapClick=function(t){var e=t.originalEvent.target,i=this._element;this._popup&&(e===i||i.contains(e))&&this.togglePopup();},n.prototype.getPopup=function(){return this._popup},n.prototype.togglePopup=function(){var t=this._popup;return t?(t.isOpen()?t.remove():t.addTo(this._map),this):this},n.prototype._update=function(t){this._map&&(this._map.transform.renderWorldCopies&&(this._lngLat=Yi(this._lngLat,this._pos,this._map.transform)),this._pos=this._map.project(this._lngLat)._add(this._offset),t&&"moveend"!==t.type||(this._pos=this._pos.round()),i.setTransform(this._element,Ji[this._anchor]+" translate("+this._pos.x+"px, "+this._pos.y+"px)"),Qi(this._element,this._anchor,"marker"));},n.prototype.getOffset=function(){return this._offset},n.prototype.setOffset=function(e){return this._offset=t.default.convert(e),this._update(),this},n.prototype._onMove=function(e){this._pos=e.point.sub(this._positionDelta),this._lngLat=this._map.unproject(this._pos),this.setLngLat(this._lngLat),this._element.style.pointerEvents="none","pending"===this._state&&(this._state="active",this.fire(new t.Event("dragstart"))),this.fire(new t.Event("drag"));},n.prototype._onUp=function(){this._element.style.pointerEvents="auto",this._positionDelta=null,this._map.off("mousemove",this._onMove),this._map.off("touchmove",this._onMove),"active"===this._state&&this.fire(new t.Event("dragend")),this._state="inactive";},n.prototype._addDragHandler=function(t){this._element.contains(t.originalEvent.target)&&(t.preventDefault(),this._positionDelta=t.point.sub(this._pos).add(this._offset),this._state="pending",this._map.on("mousemove",this._onMove),this._map.on("touchmove",this._onMove),this._map.once("mouseup",this._onUp),this._map.once("touchend",this._onUp));},n.prototype.setDraggable=function(t){return this._draggable=!!t,this._map&&(t?(this._map.on("mousedown",this._addDragHandler),this._map.on("touchstart",this._addDragHandler)):(this._map.off("mousedown",this._addDragHandler),this._map.off("touchstart",this._addDragHandler))),this},n.prototype.isDraggable=function(){return this._draggable},n}(t.Evented),nn={positionOptions:{enableHighAccuracy:!1,maximumAge:0,timeout:6e3},fitBoundsOptions:{maxZoom:15},trackUserLocation:!1,showUserLocation:!0};var on=function(e){function n(i){e.call(this),this.options=t.extend({},nn,i),t.bindAll(["_onSuccess","_onError","_finish","_setupUI","_updateCamera","_updateMarker"],this);}return e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n,n.prototype.onAdd=function(e){var n;return this._map=e,this._container=i.create("div","mapboxgl-ctrl mapboxgl-ctrl-group"),n=this._setupUI,void 0!==tn?n(tn):void 0!==t.default$1.navigator.permissions?t.default$1.navigator.permissions.query({name:"geolocation"}).then(function(t){tn="denied"!==t.state,n(tn);}):(tn=!!t.default$1.navigator.geolocation,n(tn)),this._container},n.prototype.onRemove=function(){void 0!==this._geolocationWatchID&&(t.default$1.navigator.geolocation.clearWatch(this._geolocationWatchID),this._geolocationWatchID=void 0),this.options.showUserLocation&&this._userLocationDotMarker.remove(),i.remove(this._container),this._map=void 0;},n.prototype._onSuccess=function(e){if(this.options.trackUserLocation)switch(this._lastKnownPosition=e,this._watchState){case"WAITING_ACTIVE":case"ACTIVE_LOCK":case"ACTIVE_ERROR":this._watchState="ACTIVE_LOCK",this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-waiting"),this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-active-error"),this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-active");break;case"BACKGROUND":case"BACKGROUND_ERROR":this._watchState="BACKGROUND",this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-waiting"),this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-background-error"),this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-background");}this.options.showUserLocation&&"OFF"!==this._watchState&&this._updateMarker(e),this.options.trackUserLocation&&"ACTIVE_LOCK"!==this._watchState||this._updateCamera(e),this.options.showUserLocation&&this._dotElement.classList.remove("mapboxgl-user-location-dot-stale"),this.fire(new t.Event("geolocate",e)),this._finish();},n.prototype._updateCamera=function(t){var e=new B(t.coords.longitude,t.coords.latitude),i=t.coords.accuracy;this._map.fitBounds(e.toBounds(i),this.options.fitBoundsOptions,{geolocateSource:!0});},n.prototype._updateMarker=function(t){t?this._userLocationDotMarker.setLngLat([t.coords.longitude,t.coords.latitude]).addTo(this._map):this._userLocationDotMarker.remove();},n.prototype._onError=function(e){if(this.options.trackUserLocation)if(1===e.code)this._watchState="OFF",this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-waiting"),this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-active"),this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-active-error"),this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-background"),this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-background-error"),void 0!==this._geolocationWatchID&&this._clearWatch();else switch(this._watchState){case"WAITING_ACTIVE":this._watchState="ACTIVE_ERROR",this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-active"),this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-active-error");break;case"ACTIVE_LOCK":this._watchState="ACTIVE_ERROR",this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-active"),this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-active-error"),this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-waiting");break;case"BACKGROUND":this._watchState="BACKGROUND_ERROR",this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-background"),this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-background-error"),this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-waiting");}"OFF"!==this._watchState&&this.options.showUserLocation&&this._dotElement.classList.add("mapboxgl-user-location-dot-stale"),this.fire(new t.Event("error",e)),this._finish();},n.prototype._finish=function(){this._timeoutId&&clearTimeout(this._timeoutId),this._timeoutId=void 0;},n.prototype._setupUI=function(e){var n=this;!1!==e?(this._container.addEventListener("contextmenu",function(t){return t.preventDefault()}),this._geolocateButton=i.create("button","mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate",this._container),this._geolocateButton.type="button",this._geolocateButton.setAttribute("aria-label","Geolocate"),this.options.trackUserLocation&&(this._geolocateButton.setAttribute("aria-pressed","false"),this._watchState="OFF"),this.options.showUserLocation&&(this._dotElement=i.create("div","mapboxgl-user-location-dot"),this._userLocationDotMarker=new en(this._dotElement),this.options.trackUserLocation&&(this._watchState="OFF")),this._geolocateButton.addEventListener("click",this.trigger.bind(this)),this._setup=!0,this.options.trackUserLocation&&this._map.on("movestart",function(e){e.geolocateSource||"ACTIVE_LOCK"!==n._watchState||(n._watchState="BACKGROUND",n._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-background"),n._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-active"),n.fire(new t.Event("trackuserlocationend")));})):t.warnOnce("Geolocation support is not available, the GeolocateControl will not be visible.");},n.prototype.trigger=function(){if(!this._setup)return t.warnOnce("Geolocate control triggered before added to a map"),!1;if(this.options.trackUserLocation){switch(this._watchState){case"OFF":this._watchState="WAITING_ACTIVE",this.fire(new t.Event("trackuserlocationstart"));break;case"WAITING_ACTIVE":case"ACTIVE_LOCK":case"ACTIVE_ERROR":case"BACKGROUND_ERROR":this._watchState="OFF",this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-waiting"),this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-active"),this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-active-error"),this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-background"),this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-background-error"),this.fire(new t.Event("trackuserlocationend"));break;case"BACKGROUND":this._watchState="ACTIVE_LOCK",this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-background"),this._lastKnownPosition&&this._updateCamera(this._lastKnownPosition),this.fire(new t.Event("trackuserlocationstart"));}switch(this._watchState){case"WAITING_ACTIVE":this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-waiting"),this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-active");break;case"ACTIVE_LOCK":this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-active");break;case"ACTIVE_ERROR":this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-waiting"),this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-active-error");break;case"BACKGROUND":this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-background");break;case"BACKGROUND_ERROR":this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-waiting"),this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-background-error");}"OFF"===this._watchState&&void 0!==this._geolocationWatchID?this._clearWatch():void 0===this._geolocationWatchID&&(this._geolocateButton.classList.add("mapboxgl-ctrl-geolocate-waiting"),this._geolocateButton.setAttribute("aria-pressed","true"),this._geolocationWatchID=t.default$1.navigator.geolocation.watchPosition(this._onSuccess,this._onError,this.options.positionOptions));}else t.default$1.navigator.geolocation.getCurrentPosition(this._onSuccess,this._onError,this.options.positionOptions),this._timeoutId=setTimeout(this._finish,1e4);return!0},n.prototype._clearWatch=function(){t.default$1.navigator.geolocation.clearWatch(this._geolocationWatchID),this._geolocationWatchID=void 0,this._geolocateButton.classList.remove("mapboxgl-ctrl-geolocate-waiting"),this._geolocateButton.setAttribute("aria-pressed","false"),this.options.showUserLocation&&this._updateMarker(null);},n}(t.Evented),rn={maxWidth:100,unit:"metric"},an=function(e){this.options=t.extend({},rn,e),t.bindAll(["_onMove","setUnit"],this);};function sn(t,e,i){var n,o,r,a,s,l,c=i&&i.maxWidth||100,u=t._container.clientHeight/2,h=(n=t.unproject([0,u]),o=t.unproject([c,u]),r=Math.PI/180,a=n.lat*r,s=o.lat*r,l=Math.sin(a)*Math.sin(s)+Math.cos(a)*Math.cos(s)*Math.cos((o.lng-n.lng)*r),6371e3*Math.acos(Math.min(l,1)));if(i&&"imperial"===i.unit){var p=3.2808*h;if(p>5280)ln(e,c,p/5280,"mi");else ln(e,c,p,"ft");}else if(i&&"nautical"===i.unit){ln(e,c,h/1852,"nm");}else ln(e,c,h,"m");}function ln(t,e,i,n){var o,r,a,s=(o=i,(r=Math.pow(10,(""+Math.floor(o)).length-1))*(a=(a=o/r)>=10?10:a>=5?5:a>=3?3:a>=2?2:1)),l=s/i;"m"===n&&s>=1e3&&(s/=1e3,n="km"),t.style.width=e*l+"px",t.innerHTML=s+n;}an.prototype.getDefaultPosition=function(){return"bottom-left"},an.prototype._onMove=function(){sn(this._map,this._container,this.options);},an.prototype.onAdd=function(t){return this._map=t,this._container=i.create("div","mapboxgl-ctrl mapboxgl-ctrl-scale",t.getContainer()),this._map.on("move",this._onMove),this._onMove(),this._container},an.prototype.onRemove=function(){i.remove(this._container),this._map.off("move",this._onMove),this._map=void 0;},an.prototype.setUnit=function(t){this.options.unit=t,sn(this._map,this._container,this.options);};var cn=function(){this._fullscreen=!1,t.bindAll(["_onClickFullscreen","_changeIcon"],this),"onfullscreenchange"in t.default$1.document?this._fullscreenchange="fullscreenchange":"onmozfullscreenchange"in t.default$1.document?this._fullscreenchange="mozfullscreenchange":"onwebkitfullscreenchange"in t.default$1.document?this._fullscreenchange="webkitfullscreenchange":"onmsfullscreenchange"in t.default$1.document&&(this._fullscreenchange="MSFullscreenChange"),this._className="mapboxgl-ctrl";};cn.prototype.onAdd=function(e){return this._map=e,this._mapContainer=this._map.getContainer(),this._container=i.create("div",this._className+" mapboxgl-ctrl-group"),this._checkFullscreenSupport()?this._setupUI():(this._container.style.display="none",t.warnOnce("This device does not support fullscreen mode.")),this._container},cn.prototype.onRemove=function(){i.remove(this._container),this._map=null,t.default$1.document.removeEventListener(this._fullscreenchange,this._changeIcon);},cn.prototype._checkFullscreenSupport=function(){return!!(t.default$1.document.fullscreenEnabled||t.default$1.document.mozFullScreenEnabled||t.default$1.document.msFullscreenEnabled||t.default$1.document.webkitFullscreenEnabled)},cn.prototype._setupUI=function(){var e=this._fullscreenButton=i.create("button",this._className+"-icon "+this._className+"-fullscreen",this._container);e.setAttribute("aria-label","Toggle fullscreen"),e.type="button",this._fullscreenButton.addEventListener("click",this._onClickFullscreen),t.default$1.document.addEventListener(this._fullscreenchange,this._changeIcon);},cn.prototype._isFullscreen=function(){return this._fullscreen},cn.prototype._changeIcon=function(){(t.default$1.document.fullscreenElement||t.default$1.document.mozFullScreenElement||t.default$1.document.webkitFullscreenElement||t.default$1.document.msFullscreenElement)===this._mapContainer!==this._fullscreen&&(this._fullscreen=!this._fullscreen,this._fullscreenButton.classList.toggle(this._className+"-shrink"),this._fullscreenButton.classList.toggle(this._className+"-fullscreen"));},cn.prototype._onClickFullscreen=function(){this._isFullscreen()?t.default$1.document.exitFullscreen?t.default$1.document.exitFullscreen():t.default$1.document.mozCancelFullScreen?t.default$1.document.mozCancelFullScreen():t.default$1.document.msExitFullscreen?t.default$1.document.msExitFullscreen():t.default$1.document.webkitCancelFullScreen&&t.default$1.document.webkitCancelFullScreen():this._mapContainer.requestFullscreen?this._mapContainer.requestFullscreen():this._mapContainer.mozRequestFullScreen?this._mapContainer.mozRequestFullScreen():this._mapContainer.msRequestFullscreen?this._mapContainer.msRequestFullscreen():this._mapContainer.webkitRequestFullscreen&&this._mapContainer.webkitRequestFullscreen();};var un={closeButton:!0,closeOnClick:!0,className:""},hn=function(e){function n(i){e.call(this),this.options=t.extend(Object.create(un),i),t.bindAll(["_update","_onClickClose"],this);}return e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n,n.prototype.addTo=function(e){return this._map=e,this._map.on("move",this._update),this.options.closeOnClick&&this._map.on("click",this._onClickClose),this._update(),this.fire(new t.Event("open")),this},n.prototype.isOpen=function(){return!!this._map},n.prototype.remove=function(){return this._content&&i.remove(this._content),this._container&&(i.remove(this._container),delete this._container),this._map&&(this._map.off("move",this._update),this._map.off("click",this._onClickClose),delete this._map),this.fire(new t.Event("close")),this},n.prototype.getLngLat=function(){return this._lngLat},n.prototype.setLngLat=function(t){return this._lngLat=B.convert(t),this._pos=null,this._update(),this},n.prototype.setText=function(e){return this.setDOMContent(t.default$1.document.createTextNode(e))},n.prototype.setHTML=function(e){var i,n=t.default$1.document.createDocumentFragment(),o=t.default$1.document.createElement("body");for(o.innerHTML=e;i=o.firstChild;)n.appendChild(i);return this.setDOMContent(n)},n.prototype.setDOMContent=function(t){return this._createContent(),this._content.appendChild(t),this._update(),this},n.prototype._createContent=function(){this._content&&i.remove(this._content),this._content=i.create("div","mapboxgl-popup-content",this._container),this.options.closeButton&&(this._closeButton=i.create("button","mapboxgl-popup-close-button",this._content),this._closeButton.type="button",this._closeButton.setAttribute("aria-label","Close popup"),this._closeButton.innerHTML="&#215;",this._closeButton.addEventListener("click",this._onClickClose));},n.prototype._update=function(){var e=this;if(this._map&&this._lngLat&&this._content){this._container||(this._container=i.create("div","mapboxgl-popup",this._map.getContainer()),this._tip=i.create("div","mapboxgl-popup-tip",this._container),this._container.appendChild(this._content),this.options.className&&this.options.className.split(" ").forEach(function(t){return e._container.classList.add(t)})),this._map.transform.renderWorldCopies&&(this._lngLat=Yi(this._lngLat,this._pos,this._map.transform));var n=this._pos=this._map.project(this._lngLat),o=this.options.anchor,r=function e(i){if(i){if("number"==typeof i){var n=Math.round(Math.sqrt(.5*Math.pow(i,2)));return{center:new t.default(0,0),top:new t.default(0,i),"top-left":new t.default(n,n),"top-right":new t.default(-n,n),bottom:new t.default(0,-i),"bottom-left":new t.default(n,-n),"bottom-right":new t.default(-n,-n),left:new t.default(i,0),right:new t.default(-i,0)}}if(i instanceof t.default||Array.isArray(i)){var o=t.default.convert(i);return{center:o,top:o,"top-left":o,"top-right":o,bottom:o,"bottom-left":o,"bottom-right":o,left:o,right:o}}return{center:t.default.convert(i.center||[0,0]),top:t.default.convert(i.top||[0,0]),"top-left":t.default.convert(i["top-left"]||[0,0]),"top-right":t.default.convert(i["top-right"]||[0,0]),bottom:t.default.convert(i.bottom||[0,0]),"bottom-left":t.default.convert(i["bottom-left"]||[0,0]),"bottom-right":t.default.convert(i["bottom-right"]||[0,0]),left:t.default.convert(i.left||[0,0]),right:t.default.convert(i.right||[0,0])}}return e(new t.default(0,0))}(this.options.offset);if(!o){var a,s=this._container.offsetWidth,l=this._container.offsetHeight;a=n.y+r.bottom.y<l?["top"]:n.y>this._map.transform.height-l?["bottom"]:[],n.x<s/2?a.push("left"):n.x>this._map.transform.width-s/2&&a.push("right"),o=0===a.length?"bottom":a.join("-");}var c=n.add(r[o]).round();i.setTransform(this._container,Ji[o]+" translate("+c.x+"px,"+c.y+"px)"),Qi(this._container,o,"popup");}},n.prototype._onClickClose=function(){this.remove();},n}(t.Evented);var pn={version:"0.47.0",supported:e,workerCount:Math.max(Math.floor(t.default$2.hardwareConcurrency/2),1),setRTLTextPlugin:t.setRTLTextPlugin,Map:qi,NavigationControl:Ki,GeolocateControl:on,AttributionControl:Ui,ScaleControl:an,FullscreenControl:cn,Popup:hn,Marker:en,Style:Ue,LngLat:B,LngLatBounds:O,Point:t.default,Evented:t.Evented,config:h,get accessToken(){return h.ACCESS_TOKEN},set accessToken(t){h.ACCESS_TOKEN=t;},workerUrl:""};return pn});
	
	//
	
	return mapboxgl;
	
	})));
	//# sourceMappingURL=mapbox-gl.js.map


/***/ }),
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _objectMerge = __webpack_require__(383);
	
	var _objectMerge2 = _interopRequireDefault(_objectMerge);
	
	var _mapConstants = __webpack_require__(122);
	
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
/* 176 */,
/* 177 */,
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	__webpack_require__(378);
	
	__webpack_require__(409);
	
	__webpack_require__(179);
	
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
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(186);
	module.exports = __webpack_require__(25).RegExp.escape;


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);
	var isArray = __webpack_require__(68);
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
/* 181 */
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
/* 182 */
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
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(46);
	var gOPS = __webpack_require__(72);
	var pIE = __webpack_require__(60);
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
/* 184 */
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
/* 185 */
/***/ (function(module, exports) {

	// 7.2.9 SameValue(x, y)
	module.exports = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/benjamingr/RexExp.escape
	var $export = __webpack_require__(1);
	var $re = __webpack_require__(184)(/[\\^$*+?.()|[\]{}]/g, '\\$&');
	
	$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	var $export = __webpack_require__(1);
	
	$export($export.P, 'Array', { copyWithin: __webpack_require__(124) });
	
	__webpack_require__(38)('copyWithin');


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $every = __webpack_require__(29)(4);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].every, true), 'Array', {
	  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
	  every: function every(callbackfn /* , thisArg */) {
	    return $every(this, callbackfn, arguments[1]);
	  }
	});


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	var $export = __webpack_require__(1);
	
	$export($export.P, 'Array', { fill: __webpack_require__(85) });
	
	__webpack_require__(38)('fill');


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $filter = __webpack_require__(29)(2);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].filter, true), 'Array', {
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments[1]);
	  }
	});


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
	var $export = __webpack_require__(1);
	var $find = __webpack_require__(29)(6);
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
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
	var $export = __webpack_require__(1);
	var $find = __webpack_require__(29)(5);
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
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $forEach = __webpack_require__(29)(0);
	var STRICT = __webpack_require__(27)([].forEach, true);
	
	$export($export.P + $export.F * !STRICT, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: function forEach(callbackfn /* , thisArg */) {
	    return $forEach(this, callbackfn, arguments[1]);
	  }
	});


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ctx = __webpack_require__(26);
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var call = __webpack_require__(135);
	var isArrayIter = __webpack_require__(93);
	var toLength = __webpack_require__(10);
	var createProperty = __webpack_require__(87);
	var getIterFn = __webpack_require__(109);
	
	$export($export.S + $export.F * !__webpack_require__(70)(function (iter) { Array.from(iter); }), 'Array', {
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
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $indexOf = __webpack_require__(64)(false);
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
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

	// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Array', { isArray: __webpack_require__(68) });


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 22.1.3.13 Array.prototype.join(separator)
	var $export = __webpack_require__(1);
	var toIObject = __webpack_require__(23);
	var arrayJoin = [].join;
	
	// fallback for not array-like strings
	$export($export.P + $export.F * (__webpack_require__(59) != Object || !__webpack_require__(27)(arrayJoin)), 'Array', {
	  join: function join(separator) {
	    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
	  }
	});


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toIObject = __webpack_require__(23);
	var toInteger = __webpack_require__(32);
	var toLength = __webpack_require__(10);
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
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $map = __webpack_require__(29)(1);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].map, true), 'Array', {
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments[1]);
	  }
	});


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var createProperty = __webpack_require__(87);
	
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
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $reduce = __webpack_require__(126);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].reduceRight, true), 'Array', {
	  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
	  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
	  }
	});


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $reduce = __webpack_require__(126);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].reduce, true), 'Array', {
	  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
	  }
	});


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var html = __webpack_require__(91);
	var cof = __webpack_require__(24);
	var toAbsoluteIndex = __webpack_require__(50);
	var toLength = __webpack_require__(10);
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
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $some = __webpack_require__(29)(3);
	
	$export($export.P + $export.F * !__webpack_require__(27)([].some, true), 'Array', {
	  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
	  some: function some(callbackfn /* , thisArg */) {
	    return $some(this, callbackfn, arguments[1]);
	  }
	});


/***/ }),
/* 205 */
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
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(49)('Array');


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.3.3.1 / 15.9.4.4 Date.now()
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
	var $export = __webpack_require__(1);
	var toISOString = __webpack_require__(181);
	
	// PhantomJS / old WebKit has a broken implementations
	$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
	  toISOString: toISOString
	});


/***/ }),
/* 209 */
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
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

	var TO_PRIMITIVE = __webpack_require__(7)('toPrimitive');
	var proto = Date.prototype;
	
	if (!(TO_PRIMITIVE in proto)) __webpack_require__(17)(proto, TO_PRIMITIVE, __webpack_require__(182));


/***/ }),
/* 211 */
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
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
	var $export = __webpack_require__(1);
	
	$export($export.P, 'Function', { bind: __webpack_require__(127) });


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var isObject = __webpack_require__(6);
	var getPrototypeOf = __webpack_require__(22);
	var HAS_INSTANCE = __webpack_require__(7)('hasInstance');
	var FunctionProto = Function.prototype;
	// 19.2.3.6 Function.prototype[@@hasInstance](V)
	if (!(HAS_INSTANCE in FunctionProto)) __webpack_require__(9).f(FunctionProto, HAS_INSTANCE, { value: function (O) {
	  if (typeof this != 'function' || !isObject(O)) return false;
	  if (!isObject(this.prototype)) return O instanceof this;
	  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
	  return false;
	} });


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(9).f;
	var FProto = Function.prototype;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';
	
	// 19.2.4.2 name
	NAME in FProto || __webpack_require__(8) && dP(FProto, NAME, {
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
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.3 Math.acosh(x)
	var $export = __webpack_require__(1);
	var log1p = __webpack_require__(138);
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
/* 216 */
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
/* 217 */
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
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.9 Math.cbrt(x)
	var $export = __webpack_require__(1);
	var sign = __webpack_require__(97);
	
	$export($export.S, 'Math', {
	  cbrt: function cbrt(x) {
	    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
	  }
	});


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.11 Math.clz32(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  clz32: function clz32(x) {
	    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
	  }
	});


/***/ }),
/* 220 */
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
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.14 Math.expm1(x)
	var $export = __webpack_require__(1);
	var $expm1 = __webpack_require__(96);
	
	$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.16 Math.fround(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { fround: __webpack_require__(137) });


/***/ }),
/* 223 */
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
/* 224 */
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
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.21 Math.log10(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  log10: function log10(x) {
	    return Math.log(x) * Math.LOG10E;
	  }
	});


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.20 Math.log1p(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { log1p: __webpack_require__(138) });


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.22 Math.log2(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  log2: function log2(x) {
	    return Math.log(x) / Math.LN2;
	  }
	});


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.28 Math.sign(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { sign: __webpack_require__(97) });


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.30 Math.sinh(x)
	var $export = __webpack_require__(1);
	var expm1 = __webpack_require__(96);
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
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.33 Math.tanh(x)
	var $export = __webpack_require__(1);
	var expm1 = __webpack_require__(96);
	var exp = Math.exp;
	
	$export($export.S, 'Math', {
	  tanh: function tanh(x) {
	    var a = expm1(x = +x);
	    var b = expm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
	  }
	});


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.2.2.34 Math.trunc(x)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  trunc: function trunc(it) {
	    return (it > 0 ? Math.floor : Math.ceil)(it);
	  }
	});


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global = __webpack_require__(4);
	var has = __webpack_require__(20);
	var cof = __webpack_require__(24);
	var inheritIfRequired = __webpack_require__(92);
	var toPrimitive = __webpack_require__(33);
	var fails = __webpack_require__(5);
	var gOPN = __webpack_require__(45).f;
	var gOPD = __webpack_require__(21).f;
	var dP = __webpack_require__(9).f;
	var $trim = __webpack_require__(54).trim;
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
	  for (var keys = __webpack_require__(8) ? gOPN(Base) : (
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
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.1 Number.EPSILON
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });


/***/ }),
/* 234 */
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
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Number', { isInteger: __webpack_require__(134) });


/***/ }),
/* 236 */
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
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.5 Number.isSafeInteger(number)
	var $export = __webpack_require__(1);
	var isInteger = __webpack_require__(134);
	var abs = Math.abs;
	
	$export($export.S, 'Number', {
	  isSafeInteger: function isSafeInteger(number) {
	    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
	  }
	});


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.6 Number.MAX_SAFE_INTEGER
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.10 Number.MIN_SAFE_INTEGER
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var $parseFloat = __webpack_require__(146);
	// 20.1.2.12 Number.parseFloat(string)
	$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var $parseInt = __webpack_require__(147);
	// 20.1.2.13 Number.parseInt(string, radix)
	$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toInteger = __webpack_require__(32);
	var aNumberValue = __webpack_require__(123);
	var repeat = __webpack_require__(104);
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
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $fails = __webpack_require__(5);
	var aNumberValue = __webpack_require__(123);
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
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(1);
	
	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(140) });


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', { create: __webpack_require__(44) });


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
	$export($export.S + $export.F * !__webpack_require__(8), 'Object', { defineProperties: __webpack_require__(141) });


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(8), 'Object', { defineProperty: __webpack_require__(9).f });


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.5 Object.freeze(O)
	var isObject = __webpack_require__(6);
	var meta = __webpack_require__(40).onFreeze;
	
	__webpack_require__(31)('freeze', function ($freeze) {
	  return function freeze(it) {
	    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
	  };
	});


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(23);
	var $getOwnPropertyDescriptor = __webpack_require__(21).f;
	
	__webpack_require__(31)('getOwnPropertyDescriptor', function () {
	  return function getOwnPropertyDescriptor(it, key) {
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(31)('getOwnPropertyNames', function () {
	  return __webpack_require__(142).f;
	});


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(11);
	var $getPrototypeOf = __webpack_require__(22);
	
	__webpack_require__(31)('getPrototypeOf', function () {
	  return function getPrototypeOf(it) {
	    return $getPrototypeOf(toObject(it));
	  };
	});


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.11 Object.isExtensible(O)
	var isObject = __webpack_require__(6);
	
	__webpack_require__(31)('isExtensible', function ($isExtensible) {
	  return function isExtensible(it) {
	    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
	  };
	});


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.12 Object.isFrozen(O)
	var isObject = __webpack_require__(6);
	
	__webpack_require__(31)('isFrozen', function ($isFrozen) {
	  return function isFrozen(it) {
	    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
	  };
	});


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.13 Object.isSealed(O)
	var isObject = __webpack_require__(6);
	
	__webpack_require__(31)('isSealed', function ($isSealed) {
	  return function isSealed(it) {
	    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
	  };
	});


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.10 Object.is(value1, value2)
	var $export = __webpack_require__(1);
	$export($export.S, 'Object', { is: __webpack_require__(185) });


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(11);
	var $keys = __webpack_require__(46);
	
	__webpack_require__(31)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.15 Object.preventExtensions(O)
	var isObject = __webpack_require__(6);
	var meta = __webpack_require__(40).onFreeze;
	
	__webpack_require__(31)('preventExtensions', function ($preventExtensions) {
	  return function preventExtensions(it) {
	    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
	  };
	});


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.17 Object.seal(O)
	var isObject = __webpack_require__(6);
	var meta = __webpack_require__(40).onFreeze;
	
	__webpack_require__(31)('seal', function ($seal) {
	  return function seal(it) {
	    return $seal && isObject(it) ? $seal(meta(it)) : it;
	  };
	});


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(1);
	$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(100).set });


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.3.6 Object.prototype.toString()
	var classof = __webpack_require__(58);
	var test = {};
	test[__webpack_require__(7)('toStringTag')] = 'z';
	if (test + '' != '[object z]') {
	  __webpack_require__(18)(Object.prototype, 'toString', function toString() {
	    return '[object ' + classof(this) + ']';
	  }, true);
	}


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var $parseFloat = __webpack_require__(146);
	// 18.2.4 parseFloat(string)
	$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var $parseInt = __webpack_require__(147);
	// 18.2.5 parseInt(string, radix)
	$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(39);
	var global = __webpack_require__(4);
	var ctx = __webpack_require__(26);
	var classof = __webpack_require__(58);
	var $export = __webpack_require__(1);
	var isObject = __webpack_require__(6);
	var aFunction = __webpack_require__(13);
	var anInstance = __webpack_require__(42);
	var forOf = __webpack_require__(43);
	var speciesConstructor = __webpack_require__(76);
	var task = __webpack_require__(106).set;
	var microtask = __webpack_require__(98)();
	var newPromiseCapabilityModule = __webpack_require__(99);
	var perform = __webpack_require__(148);
	var userAgent = __webpack_require__(78);
	var promiseResolve = __webpack_require__(149);
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
	__webpack_require__(53)($Promise, PROMISE);
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
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(70)(function (iter) {
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
/* 264 */
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
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
	var $export = __webpack_require__(1);
	var create = __webpack_require__(44);
	var aFunction = __webpack_require__(13);
	var anObject = __webpack_require__(3);
	var isObject = __webpack_require__(6);
	var fails = __webpack_require__(5);
	var bind = __webpack_require__(127);
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
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
	var dP = __webpack_require__(9);
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
/* 267 */
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
/* 268 */
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
	__webpack_require__(94)(Enumerate, 'Object', function () {
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
/* 269 */
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
/* 270 */
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
/* 271 */
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
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.9 Reflect.has(target, propertyKey)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Reflect', {
	  has: function has(target, propertyKey) {
	    return propertyKey in target;
	  }
	});


/***/ }),
/* 273 */
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
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.11 Reflect.ownKeys(target)
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Reflect', { ownKeys: __webpack_require__(145) });


/***/ }),
/* 275 */
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
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.14 Reflect.setPrototypeOf(target, proto)
	var $export = __webpack_require__(1);
	var setProto = __webpack_require__(100);
	
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
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

	// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
	var dP = __webpack_require__(9);
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
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4);
	var inheritIfRequired = __webpack_require__(92);
	var dP = __webpack_require__(9).f;
	var gOPN = __webpack_require__(45).f;
	var isRegExp = __webpack_require__(69);
	var $flags = __webpack_require__(67);
	var $RegExp = global.RegExp;
	var Base = $RegExp;
	var proto = $RegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;
	// "new" creates a new object, old webkit buggy here
	var CORRECT_NEW = new $RegExp(re1) !== re1;
	
	if (__webpack_require__(8) && (!CORRECT_NEW || __webpack_require__(5)(function () {
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
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

	// @@match logic
	__webpack_require__(66)('match', 1, function (defined, MATCH, $match) {
	  // 21.1.3.11 String.prototype.match(regexp)
	  return [function match(regexp) {
	    'use strict';
	    var O = defined(this);
	    var fn = regexp == undefined ? undefined : regexp[MATCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	  }, $match];
	});


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

	// @@replace logic
	__webpack_require__(66)('replace', 2, function (defined, REPLACE, $replace) {
	  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
	  return [function replace(searchValue, replaceValue) {
	    'use strict';
	    var O = defined(this);
	    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
	    return fn !== undefined
	      ? fn.call(searchValue, O, replaceValue)
	      : $replace.call(String(O), searchValue, replaceValue);
	  }, $replace];
	});


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

	// @@search logic
	__webpack_require__(66)('search', 1, function (defined, SEARCH, $search) {
	  // 21.1.3.15 String.prototype.search(regexp)
	  return [function search(regexp) {
	    'use strict';
	    var O = defined(this);
	    var fn = regexp == undefined ? undefined : regexp[SEARCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	  }, $search];
	});


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

	// @@split logic
	__webpack_require__(66)('split', 2, function (defined, SPLIT, $split) {
	  'use strict';
	  var isRegExp = __webpack_require__(69);
	  var _split = $split;
	  var $push = [].push;
	  var $SPLIT = 'split';
	  var LENGTH = 'length';
	  var LAST_INDEX = 'lastIndex';
	  if (
	    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
	    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
	    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
	    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
	    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
	    ''[$SPLIT](/.?/)[LENGTH]
	  ) {
	    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
	    // based on es5-shim implementation, need to rework it
	    $split = function (separator, limit) {
	      var string = String(this);
	      if (separator === undefined && limit === 0) return [];
	      // If `separator` is not a regex, use native split
	      if (!isRegExp(separator)) return _split.call(string, separator, limit);
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var separator2, match, lastIndex, lastLength, i;
	      // Doesn't need flags gy, but they don't hurt
	      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
	      while (match = separatorCopy.exec(string)) {
	        // `separatorCopy.lastIndex` is not reliable cross-browser
	        lastIndex = match.index + match[0][LENGTH];
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
	          // eslint-disable-next-line no-loop-func
	          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
	            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
	          });
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
	    $split = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
	    };
	  }
	  // 21.1.3.17 String.prototype.split(separator, limit)
	  return [function split(separator, limit) {
	    var O = defined(this);
	    var fn = separator == undefined ? undefined : separator[SPLIT];
	    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
	  }, $split];
	});


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	__webpack_require__(154);
	var anObject = __webpack_require__(3);
	var $flags = __webpack_require__(67);
	var DESCRIPTORS = __webpack_require__(8);
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
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.2 String.prototype.anchor(name)
	__webpack_require__(19)('anchor', function (createHTML) {
	  return function anchor(name) {
	    return createHTML(this, 'a', 'name', name);
	  };
	});


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.3 String.prototype.big()
	__webpack_require__(19)('big', function (createHTML) {
	  return function big() {
	    return createHTML(this, 'big', '', '');
	  };
	});


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.4 String.prototype.blink()
	__webpack_require__(19)('blink', function (createHTML) {
	  return function blink() {
	    return createHTML(this, 'blink', '', '');
	  };
	});


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.5 String.prototype.bold()
	__webpack_require__(19)('bold', function (createHTML) {
	  return function bold() {
	    return createHTML(this, 'b', '', '');
	  };
	});


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $at = __webpack_require__(102)(false);
	$export($export.P, 'String', {
	  // 21.1.3.3 String.prototype.codePointAt(pos)
	  codePointAt: function codePointAt(pos) {
	    return $at(this, pos);
	  }
	});


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

	// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
	'use strict';
	var $export = __webpack_require__(1);
	var toLength = __webpack_require__(10);
	var context = __webpack_require__(103);
	var ENDS_WITH = 'endsWith';
	var $endsWith = ''[ENDS_WITH];
	
	$export($export.P + $export.F * __webpack_require__(90)(ENDS_WITH), 'String', {
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
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.6 String.prototype.fixed()
	__webpack_require__(19)('fixed', function (createHTML) {
	  return function fixed() {
	    return createHTML(this, 'tt', '', '');
	  };
	});


/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.7 String.prototype.fontcolor(color)
	__webpack_require__(19)('fontcolor', function (createHTML) {
	  return function fontcolor(color) {
	    return createHTML(this, 'font', 'color', color);
	  };
	});


/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.8 String.prototype.fontsize(size)
	__webpack_require__(19)('fontsize', function (createHTML) {
	  return function fontsize(size) {
	    return createHTML(this, 'font', 'size', size);
	  };
	});


/***/ }),
/* 293 */
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
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

	// 21.1.3.7 String.prototype.includes(searchString, position = 0)
	'use strict';
	var $export = __webpack_require__(1);
	var context = __webpack_require__(103);
	var INCLUDES = 'includes';
	
	$export($export.P + $export.F * __webpack_require__(90)(INCLUDES), 'String', {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~context(this, searchString, INCLUDES)
	      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});


/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.9 String.prototype.italics()
	__webpack_require__(19)('italics', function (createHTML) {
	  return function italics() {
	    return createHTML(this, 'i', '', '');
	  };
	});


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at = __webpack_require__(102)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(95)(String, 'String', function (iterated) {
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
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.10 String.prototype.link(url)
	__webpack_require__(19)('link', function (createHTML) {
	  return function link(url) {
	    return createHTML(this, 'a', 'href', url);
	  };
	});


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var toIObject = __webpack_require__(23);
	var toLength = __webpack_require__(10);
	
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
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	
	$export($export.P, 'String', {
	  // 21.1.3.13 String.prototype.repeat(count)
	  repeat: __webpack_require__(104)
	});


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.11 String.prototype.small()
	__webpack_require__(19)('small', function (createHTML) {
	  return function small() {
	    return createHTML(this, 'small', '', '');
	  };
	});


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

	// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
	'use strict';
	var $export = __webpack_require__(1);
	var toLength = __webpack_require__(10);
	var context = __webpack_require__(103);
	var STARTS_WITH = 'startsWith';
	var $startsWith = ''[STARTS_WITH];
	
	$export($export.P + $export.F * __webpack_require__(90)(STARTS_WITH), 'String', {
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
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.12 String.prototype.strike()
	__webpack_require__(19)('strike', function (createHTML) {
	  return function strike() {
	    return createHTML(this, 'strike', '', '');
	  };
	});


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.13 String.prototype.sub()
	__webpack_require__(19)('sub', function (createHTML) {
	  return function sub() {
	    return createHTML(this, 'sub', '', '');
	  };
	});


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// B.2.3.14 String.prototype.sup()
	__webpack_require__(19)('sup', function (createHTML) {
	  return function sup() {
	    return createHTML(this, 'sup', '', '');
	  };
	});


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 21.1.3.25 String.prototype.trim()
	__webpack_require__(54)('trim', function ($trim) {
	  return function trim() {
	    return $trim(this, 3);
	  };
	});


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global = __webpack_require__(4);
	var has = __webpack_require__(20);
	var DESCRIPTORS = __webpack_require__(8);
	var $export = __webpack_require__(1);
	var redefine = __webpack_require__(18);
	var META = __webpack_require__(40).KEY;
	var $fails = __webpack_require__(5);
	var shared = __webpack_require__(75);
	var setToStringTag = __webpack_require__(53);
	var uid = __webpack_require__(51);
	var wks = __webpack_require__(7);
	var wksExt = __webpack_require__(152);
	var wksDefine = __webpack_require__(108);
	var enumKeys = __webpack_require__(183);
	var isArray = __webpack_require__(68);
	var anObject = __webpack_require__(3);
	var isObject = __webpack_require__(6);
	var toIObject = __webpack_require__(23);
	var toPrimitive = __webpack_require__(33);
	var createDesc = __webpack_require__(47);
	var _create = __webpack_require__(44);
	var gOPNExt = __webpack_require__(142);
	var $GOPD = __webpack_require__(21);
	var $DP = __webpack_require__(9);
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
	  __webpack_require__(60).f = $propertyIsEnumerable;
	  __webpack_require__(72).f = $getOwnPropertySymbols;
	
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
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var $typed = __webpack_require__(77);
	var buffer = __webpack_require__(107);
	var anObject = __webpack_require__(3);
	var toAbsoluteIndex = __webpack_require__(50);
	var toLength = __webpack_require__(10);
	var isObject = __webpack_require__(6);
	var ArrayBuffer = __webpack_require__(4).ArrayBuffer;
	var speciesConstructor = __webpack_require__(76);
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
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	$export($export.G + $export.W + $export.F * !__webpack_require__(77).ABV, {
	  DataView: __webpack_require__(107).DataView
	});


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Float32', 4, function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Float64', 8, function (init) {
	  return function Float64Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Int16', 2, function (init) {
	  return function Int16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Int32', 4, function (init) {
	  return function Int32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Int8', 1, function (init) {
	  return function Int8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Uint16', 2, function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Uint32', 4, function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Uint8', 1, function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(37)('Uint8', 1, function (init) {
	  return function Uint8ClampedArray(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	}, true);


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var weak = __webpack_require__(130);
	var validate = __webpack_require__(55);
	var WEAK_SET = 'WeakSet';
	
	// 23.4 WeakSet Objects
	__webpack_require__(65)(WEAK_SET, function (get) {
	  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.4.3.1 WeakSet.prototype.add(value)
	  add: function add(value) {
	    return weak.def(validate(this, WEAK_SET), value, true);
	  }
	}, weak, false, true);


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
	var $export = __webpack_require__(1);
	var flattenIntoArray = __webpack_require__(131);
	var toObject = __webpack_require__(11);
	var toLength = __webpack_require__(10);
	var aFunction = __webpack_require__(13);
	var arraySpeciesCreate = __webpack_require__(86);
	
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
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
	var $export = __webpack_require__(1);
	var flattenIntoArray = __webpack_require__(131);
	var toObject = __webpack_require__(11);
	var toLength = __webpack_require__(10);
	var toInteger = __webpack_require__(32);
	var arraySpeciesCreate = __webpack_require__(86);
	
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
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/Array.prototype.includes
	var $export = __webpack_require__(1);
	var $includes = __webpack_require__(64)(true);
	
	$export($export.P, 'Array', {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	
	__webpack_require__(38)('includes');


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
	var $export = __webpack_require__(1);
	var microtask = __webpack_require__(98)();
	var process = __webpack_require__(4).process;
	var isNode = __webpack_require__(24)(process) == 'process';
	
	$export($export.G, {
	  asap: function asap(fn) {
	    var domain = isNode && process.domain;
	    microtask(domain ? domain.bind(fn) : fn);
	  }
	});


/***/ }),
/* 323 */
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
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-global
	var $export = __webpack_require__(1);
	
	$export($export.G, { global: __webpack_require__(4) });


/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
	__webpack_require__(73)('Map');


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
	__webpack_require__(74)('Map');


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export = __webpack_require__(1);
	
	$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(129)('Map') });


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', {
	  clamp: function clamp(x, lower, upper) {
	    return Math.min(upper, Math.max(lower, x));
	  }
	});


/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });


/***/ }),
/* 330 */
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
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	var scale = __webpack_require__(139);
	var fround = __webpack_require__(137);
	
	$export($export.S, 'Math', {
	  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
	    return fround(scale(x, inLow, inHigh, outLow, outHigh));
	  }
	});


/***/ }),
/* 332 */
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
/* 333 */
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
/* 334 */
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
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });


/***/ }),
/* 336 */
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
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

	// https://rwaldron.github.io/proposal-math-extensions/
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { scale: __webpack_require__(139) });


/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

	// http://jfbastien.github.io/papers/Math.signbit.html
	var $export = __webpack_require__(1);
	
	$export($export.S, 'Math', { signbit: function signbit(x) {
	  // eslint-disable-next-line no-self-compare
	  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
	} });


/***/ }),
/* 339 */
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
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var aFunction = __webpack_require__(13);
	var $defineProperty = __webpack_require__(9);
	
	// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
	__webpack_require__(8) && $export($export.P + __webpack_require__(71), 'Object', {
	  __defineGetter__: function __defineGetter__(P, getter) {
	    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
	  }
	});


/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var aFunction = __webpack_require__(13);
	var $defineProperty = __webpack_require__(9);
	
	// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
	__webpack_require__(8) && $export($export.P + __webpack_require__(71), 'Object', {
	  __defineSetter__: function __defineSetter__(P, setter) {
	    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
	  }
	});


/***/ }),
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export = __webpack_require__(1);
	var $entries = __webpack_require__(144)(true);
	
	$export($export.S, 'Object', {
	  entries: function entries(it) {
	    return $entries(it);
	  }
	});


/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-getownpropertydescriptors
	var $export = __webpack_require__(1);
	var ownKeys = __webpack_require__(145);
	var toIObject = __webpack_require__(23);
	var gOPD = __webpack_require__(21);
	var createProperty = __webpack_require__(87);
	
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
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var toPrimitive = __webpack_require__(33);
	var getPrototypeOf = __webpack_require__(22);
	var getOwnPropertyDescriptor = __webpack_require__(21).f;
	
	// B.2.2.4 Object.prototype.__lookupGetter__(P)
	__webpack_require__(8) && $export($export.P + __webpack_require__(71), 'Object', {
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
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export = __webpack_require__(1);
	var toObject = __webpack_require__(11);
	var toPrimitive = __webpack_require__(33);
	var getPrototypeOf = __webpack_require__(22);
	var getOwnPropertyDescriptor = __webpack_require__(21).f;
	
	// B.2.2.5 Object.prototype.__lookupSetter__(P)
	__webpack_require__(8) && $export($export.P + __webpack_require__(71), 'Object', {
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
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-object-values-entries
	var $export = __webpack_require__(1);
	var $values = __webpack_require__(144)(false);
	
	$export($export.S, 'Object', {
	  values: function values(it) {
	    return $values(it);
	  }
	});


/***/ }),
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/zenparsing/es-observable
	var $export = __webpack_require__(1);
	var global = __webpack_require__(4);
	var core = __webpack_require__(25);
	var microtask = __webpack_require__(98)();
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
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-promise-finally
	'use strict';
	var $export = __webpack_require__(1);
	var core = __webpack_require__(25);
	var global = __webpack_require__(4);
	var speciesConstructor = __webpack_require__(76);
	var promiseResolve = __webpack_require__(149);
	
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
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-promise-try
	var $export = __webpack_require__(1);
	var newPromiseCapability = __webpack_require__(99);
	var perform = __webpack_require__(148);
	
	$export($export.S, 'Promise', { 'try': function (callbackfn) {
	  var promiseCapability = newPromiseCapability.f(this);
	  var result = perform(callbackfn);
	  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
	  return promiseCapability.promise;
	} });


/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

	var metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var toMetaKey = metadata.key;
	var ordinaryDefineOwnMetadata = metadata.set;
	
	metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
	  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
	} });


/***/ }),
/* 351 */
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
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

	var Set = __webpack_require__(155);
	var from = __webpack_require__(125);
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
/* 353 */
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
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

	var metadata = __webpack_require__(36);
	var anObject = __webpack_require__(3);
	var ordinaryOwnMetadataKeys = metadata.keys;
	var toMetaKey = metadata.key;
	
	metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
	  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
	} });


/***/ }),
/* 355 */
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
/* 356 */
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
/* 357 */
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
/* 358 */
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
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
	__webpack_require__(73)('Set');


/***/ }),
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
	__webpack_require__(74)('Set');


/***/ }),
/* 361 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export = __webpack_require__(1);
	
	$export($export.P + $export.R, 'Set', { toJSON: __webpack_require__(129)('Set') });


/***/ }),
/* 362 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/mathiasbynens/String.prototype.at
	var $export = __webpack_require__(1);
	var $at = __webpack_require__(102)(true);
	
	$export($export.P, 'String', {
	  at: function at(pos) {
	    return $at(this, pos);
	  }
	});


/***/ }),
/* 363 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://tc39.github.io/String.prototype.matchAll/
	var $export = __webpack_require__(1);
	var defined = __webpack_require__(30);
	var toLength = __webpack_require__(10);
	var isRegExp = __webpack_require__(69);
	var getFlags = __webpack_require__(67);
	var RegExpProto = RegExp.prototype;
	
	var $RegExpStringIterator = function (regexp, string) {
	  this._r = regexp;
	  this._s = string;
	};
	
	__webpack_require__(94)($RegExpStringIterator, 'RegExp String', function next() {
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
/* 364 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(1);
	var $pad = __webpack_require__(150);
	var userAgent = __webpack_require__(78);
	
	// https://github.com/zloirock/core-js/issues/280
	$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
	  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
	  }
	});


/***/ }),
/* 365 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-string-pad-start-end
	var $export = __webpack_require__(1);
	var $pad = __webpack_require__(150);
	var userAgent = __webpack_require__(78);
	
	// https://github.com/zloirock/core-js/issues/280
	$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
	  padStart: function padStart(maxLength /* , fillString = ' ' */) {
	    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
	  }
	});


/***/ }),
/* 366 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
	__webpack_require__(54)('trimLeft', function ($trim) {
	  return function trimLeft() {
	    return $trim(this, 1);
	  };
	}, 'trimStart');


/***/ }),
/* 367 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
	__webpack_require__(54)('trimRight', function ($trim) {
	  return function trimRight() {
	    return $trim(this, 2);
	  };
	}, 'trimEnd');


/***/ }),
/* 368 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(108)('asyncIterator');


/***/ }),
/* 369 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(108)('observable');


/***/ }),
/* 370 */
/***/ (function(module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-global
	var $export = __webpack_require__(1);
	
	$export($export.S, 'System', { global: __webpack_require__(4) });


/***/ }),
/* 371 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
	__webpack_require__(73)('WeakMap');


/***/ }),
/* 372 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
	__webpack_require__(74)('WeakMap');


/***/ }),
/* 373 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
	__webpack_require__(73)('WeakSet');


/***/ }),
/* 374 */
/***/ (function(module, exports, __webpack_require__) {

	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
	__webpack_require__(74)('WeakSet');


/***/ }),
/* 375 */
/***/ (function(module, exports, __webpack_require__) {

	var $iterators = __webpack_require__(110);
	var getKeys = __webpack_require__(46);
	var redefine = __webpack_require__(18);
	var global = __webpack_require__(4);
	var hide = __webpack_require__(17);
	var Iterators = __webpack_require__(52);
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
/* 376 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(1);
	var $task = __webpack_require__(106);
	$export($export.G + $export.B, {
	  setImmediate: $task.set,
	  clearImmediate: $task.clear
	});


/***/ }),
/* 377 */
/***/ (function(module, exports, __webpack_require__) {

	// ie9- setTimeout & setInterval additional parameters fix
	var global = __webpack_require__(4);
	var $export = __webpack_require__(1);
	var userAgent = __webpack_require__(78);
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
/* 378 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(306);
	__webpack_require__(245);
	__webpack_require__(247);
	__webpack_require__(246);
	__webpack_require__(249);
	__webpack_require__(251);
	__webpack_require__(256);
	__webpack_require__(250);
	__webpack_require__(248);
	__webpack_require__(258);
	__webpack_require__(257);
	__webpack_require__(253);
	__webpack_require__(254);
	__webpack_require__(252);
	__webpack_require__(244);
	__webpack_require__(255);
	__webpack_require__(259);
	__webpack_require__(260);
	__webpack_require__(212);
	__webpack_require__(214);
	__webpack_require__(213);
	__webpack_require__(262);
	__webpack_require__(261);
	__webpack_require__(232);
	__webpack_require__(242);
	__webpack_require__(243);
	__webpack_require__(233);
	__webpack_require__(234);
	__webpack_require__(235);
	__webpack_require__(236);
	__webpack_require__(237);
	__webpack_require__(238);
	__webpack_require__(239);
	__webpack_require__(240);
	__webpack_require__(241);
	__webpack_require__(215);
	__webpack_require__(216);
	__webpack_require__(217);
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
	__webpack_require__(293);
	__webpack_require__(298);
	__webpack_require__(305);
	__webpack_require__(296);
	__webpack_require__(288);
	__webpack_require__(289);
	__webpack_require__(294);
	__webpack_require__(299);
	__webpack_require__(301);
	__webpack_require__(284);
	__webpack_require__(285);
	__webpack_require__(286);
	__webpack_require__(287);
	__webpack_require__(290);
	__webpack_require__(291);
	__webpack_require__(292);
	__webpack_require__(295);
	__webpack_require__(297);
	__webpack_require__(300);
	__webpack_require__(302);
	__webpack_require__(303);
	__webpack_require__(304);
	__webpack_require__(207);
	__webpack_require__(209);
	__webpack_require__(208);
	__webpack_require__(211);
	__webpack_require__(210);
	__webpack_require__(196);
	__webpack_require__(194);
	__webpack_require__(200);
	__webpack_require__(197);
	__webpack_require__(203);
	__webpack_require__(205);
	__webpack_require__(193);
	__webpack_require__(199);
	__webpack_require__(190);
	__webpack_require__(204);
	__webpack_require__(188);
	__webpack_require__(202);
	__webpack_require__(201);
	__webpack_require__(195);
	__webpack_require__(198);
	__webpack_require__(187);
	__webpack_require__(189);
	__webpack_require__(192);
	__webpack_require__(191);
	__webpack_require__(206);
	__webpack_require__(110);
	__webpack_require__(278);
	__webpack_require__(283);
	__webpack_require__(154);
	__webpack_require__(279);
	__webpack_require__(280);
	__webpack_require__(281);
	__webpack_require__(282);
	__webpack_require__(263);
	__webpack_require__(153);
	__webpack_require__(155);
	__webpack_require__(156);
	__webpack_require__(318);
	__webpack_require__(307);
	__webpack_require__(308);
	__webpack_require__(313);
	__webpack_require__(316);
	__webpack_require__(317);
	__webpack_require__(311);
	__webpack_require__(314);
	__webpack_require__(312);
	__webpack_require__(315);
	__webpack_require__(309);
	__webpack_require__(310);
	__webpack_require__(264);
	__webpack_require__(265);
	__webpack_require__(266);
	__webpack_require__(267);
	__webpack_require__(268);
	__webpack_require__(271);
	__webpack_require__(269);
	__webpack_require__(270);
	__webpack_require__(272);
	__webpack_require__(273);
	__webpack_require__(274);
	__webpack_require__(275);
	__webpack_require__(277);
	__webpack_require__(276);
	__webpack_require__(321);
	__webpack_require__(319);
	__webpack_require__(320);
	__webpack_require__(362);
	__webpack_require__(365);
	__webpack_require__(364);
	__webpack_require__(366);
	__webpack_require__(367);
	__webpack_require__(363);
	__webpack_require__(368);
	__webpack_require__(369);
	__webpack_require__(343);
	__webpack_require__(346);
	__webpack_require__(342);
	__webpack_require__(340);
	__webpack_require__(341);
	__webpack_require__(344);
	__webpack_require__(345);
	__webpack_require__(327);
	__webpack_require__(361);
	__webpack_require__(326);
	__webpack_require__(360);
	__webpack_require__(372);
	__webpack_require__(374);
	__webpack_require__(325);
	__webpack_require__(359);
	__webpack_require__(371);
	__webpack_require__(373);
	__webpack_require__(324);
	__webpack_require__(370);
	__webpack_require__(323);
	__webpack_require__(328);
	__webpack_require__(329);
	__webpack_require__(330);
	__webpack_require__(331);
	__webpack_require__(332);
	__webpack_require__(334);
	__webpack_require__(333);
	__webpack_require__(335);
	__webpack_require__(336);
	__webpack_require__(337);
	__webpack_require__(339);
	__webpack_require__(338);
	__webpack_require__(348);
	__webpack_require__(349);
	__webpack_require__(350);
	__webpack_require__(351);
	__webpack_require__(353);
	__webpack_require__(352);
	__webpack_require__(355);
	__webpack_require__(354);
	__webpack_require__(356);
	__webpack_require__(357);
	__webpack_require__(358);
	__webpack_require__(322);
	__webpack_require__(347);
	__webpack_require__(377);
	__webpack_require__(376);
	__webpack_require__(375);
	module.exports = __webpack_require__(25);


/***/ }),
/* 379 */
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
/* 380 */,
/* 381 */,
/* 382 */
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
/* 383 */
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
	    var objectForeach = __webpack_require__(382);
	    var cloneFunction = __webpack_require__(379);
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
/* 384 */,
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
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
/* 409 */
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