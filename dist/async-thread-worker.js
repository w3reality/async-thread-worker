(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AsyncThreadWorker"] = factory();
	else
		root["AsyncThreadWorker"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n// async-thread-worker - https://github.com/w3reality/async-thread-worker\n// async/await abstraction for Web Workers (MIT License)\nvar __version = \"0.9.2dev\";\n\nvar __consoleLog = function __consoleLog() {\n  var _console = console;\n\n  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n    args[_key] = arguments[_key];\n  }\n\n  _console.log.apply(_console, args);\n};\n\nvar __consoleVer = function __consoleVer(name) {\n  return __consoleLog(\"\".concat(name, \" \").concat(__version));\n};\n\nvar ThreadWorker =\n/*#__PURE__*/\nfunction () {\n  function ThreadWorker(self) {\n    var _this = this;\n\n    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n\n    _classCallCheck(this, ThreadWorker);\n\n    __consoleVer('AsyncThreadWorker.ThreadWorker'); // https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/self\n\n\n    this._worker = self;\n\n    self.onmessage = function (e) {\n      return _this._onMessage(e);\n    };\n\n    this.onCreate(opts);\n  }\n\n  _createClass(ThreadWorker, [{\n    key: \"onCreate\",\n    value: function onCreate(opts) {}\n  }, {\n    key: \"_onMessage\",\n    value: function _onMessage(e) {\n      var _e$data = e.data,\n          id = _e$data.id,\n          data = _e$data.data;\n      this.onRequest(id, data);\n    } // abstract\n\n  }, {\n    key: \"onRequest\",\n    value: function onRequest(id, payload) {}\n  }, {\n    key: \"_sendResponse\",\n    value: function _sendResponse(id, data) {\n      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n      var defaults = {\n        transferables: [],\n        error: undefined\n      };\n      var actual = Object.assign({}, defaults, opts);\n      var error = actual.error;\n\n      this._worker.postMessage({\n        id: id,\n        result: {\n          data: data,\n          error: error\n        }\n      }, actual.transferables.length > 0 ? actual.transferables : undefined);\n    }\n  }, {\n    key: \"sendResponse\",\n    value: function sendResponse(id) {\n      var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;\n      var transferables = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];\n\n      this._sendResponse(id, payload, {\n        transferables: transferables\n      });\n    }\n  }, {\n    key: \"sendError\",\n    value: function sendError(id, error) {\n      this._sendResponse(id, undefined, {\n        error: error\n      });\n    }\n  }]);\n\n  return ThreadWorker;\n}();\n\nvar Thread =\n/*#__PURE__*/\nfunction () {\n  function Thread(path) {\n    var _this2 = this;\n\n    _classCallCheck(this, Thread);\n\n    __consoleVer('AsyncThreadWorker.Thread');\n\n    var _worker = new Worker(path);\n\n    this._worker = _worker;\n    this._rrRequest = {};\n\n    _worker.onmessage = function (e) {\n      if (false) {}\n\n      var _e$data2 = e.data,\n          id = _e$data2.id,\n          result = _e$data2.result;\n      console.log('result for id:', id);\n      var data = result.data,\n          error = result.error;\n\n      if (id in _this2._rrRequest) {\n        var _this2$_rrRequest$id = _this2._rrRequest[id],\n            res = _this2$_rrRequest$id.res,\n            rej = _this2$_rrRequest$id.rej;\n        delete _this2._rrRequest[id];\n        error ? rej(error) : res(data);\n      } else {\n        console.log('nop; invalid request id:', id);\n      }\n    };\n  }\n\n  _createClass(Thread, [{\n    key: \"_sendRequest\",\n    value: function _sendRequest(data) {\n      var _this3 = this;\n\n      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n      // returns a Promise object\n      var defaults = {\n        transferables: []\n      };\n      var actual = Object.assign({}, defaults, opts);\n      return new Promise(function (res, rej) {\n        var id;\n\n        do {\n          id = \"req-id-\".concat(Math.random());\n        } while (id in _this3._rrRequest);\n\n        console.log('_sendRequest(): id:', id);\n        _this3._rrRequest[id] = {\n          res: res,\n          rej: rej\n        };\n\n        if (_this3._worker) {\n          _this3._worker.postMessage({\n            id: id,\n            data: data\n          }, actual.transferables.length > 0 ? actual.transferables : undefined);\n        } else {\n          console.log('_sendRequest(): nop (worker already terminated?)');\n        }\n      });\n    }\n  }, {\n    key: \"sendRequest\",\n    value: function sendRequest() {\n      var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;\n      var transferables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n      return this._sendRequest(payload, {\n        transferables: transferables\n      });\n    }\n  }, {\n    key: \"getWorker\",\n    value: function getWorker() {\n      return this._worker;\n    }\n  }, {\n    key: \"terminate\",\n    value: function terminate() {\n      this._worker.terminate();\n\n      this._worker = null;\n    }\n  }]);\n\n  return Thread;\n}();\n\nvar AsyncThreadWorker = {\n  ThreadWorker: ThreadWorker,\n  Thread: Thread\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (AsyncThreadWorker);\n\n//# sourceURL=webpack://AsyncThreadWorker/./src/index.js?");

/***/ })

/******/ })["default"];
});