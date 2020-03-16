
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.AsyncThreadWorker = {})));
}(this, (function (exports) { 'use strict';
    var AsyncThreadWorker=function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=1)}([function(e){e.exports=JSON.parse('{"a":"0.9.3"}')},function(e,r,t){"use strict";t.r(r),function(e){var n=t(0);function o(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var t=[],n=!0,o=!1,i=void 0;try{for(var s,a=e[Symbol.iterator]();!(n=(s=a.next()).done)&&(t.push(s.value),!r||t.length!==r);n=!0);}catch(e){o=!0,i=e}finally{try{n||null==a.return||a.return()}finally{if(o)throw i}}return t}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function i(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function s(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function a(e,r,t){return r&&s(e.prototype,r),t&&s(e,t),e}var u=function(e){return function(){for(var e=console,r=arguments.length,t=new Array(r),n=0;n<r;n++)t[n]=arguments[n];e.log.apply(e,t)}("".concat(e," ").concat(n.a))},c={ThreadWorker:function(){function r(t){var n=this,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{isNode:!1};if(i(this,r),u("AsyncThreadWorker.ThreadWorker"),this._isNode=o.isNode,this._worker=t,this._isNode){var s=e.require("worker_threads"),a=s.parentPort;this._parentPort=a,a.on("message",(function(e){return n._onMessage(e)}))}else t.onmessage=function(e){return n._onMessage(e.data)};this.onCreate(o)}return a(r,[{key:"onCreate",value:function(e){}},{key:"_onMessage",value:function(e){var r=e.id,t=e.data;this.onRequest(r,t)}},{key:"onRequest",value:function(e,r){}},{key:"_sendResponse",value:function(e,r){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n={transferables:[],error:void 0},o=Object.assign({},n,t),i=o.error,s=this._isNode?this._parentPort:this._worker;s.postMessage({id:e,result:{data:r,error:i}},o.transferables.length>0?o.transferables:void 0)}},{key:"sendResponse",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];this._sendResponse(e,r,{transferables:t})}},{key:"sendError",value:function(e,r){this._sendResponse(e,void 0,{error:r})}}]),r}(),Thread:function(){function r(t){var n,o=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{isNode:!1,optsNode:void 0};if(i(this,r),u("AsyncThreadWorker.Thread"),this._isNode=s.isNode,this._isNode){var a=e.require("worker_threads"),c=a.Worker;n=new c(t,s.optsNode)}else n=new Worker(t);this._worker=n,this._rrRequest={},this._isNode?n.on("message",(function(e){return o._onMessage(e)})):n.onmessage=function(e){return o._onMessage(e.data)}}return a(r,[{key:"_onMessage",value:function(e){var r=e.id,t=e.result,n=t.data,o=t.error;if(r in this._rrRequest){var i=this._rrRequest[r],s=i.res,a=i.rej;delete this._rrRequest[r],o?a(o):s(n)}}},{key:"_sendRequest",value:function(e){var r=this,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n={transferables:[]},o=Object.assign({},n,t);return new Promise((function(t,n){var i;do{i="req-id-".concat(Math.random())}while(i in r._rrRequest);r._rrRequest[i]={res:t,rej:n},r._worker&&r._worker.postMessage({id:i,data:e},o.transferables.length>0?o.transferables:void 0)}))}},{key:"sendRequest",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return this._sendRequest(e,{transferables:r})}},{key:"getWorker",value:function(){return this._worker}},{key:"_cancelPendingRequests",value:function(){var e=this;if(Object.entries(this._rrRequest).forEach((function(r){var t=o(r,2),n=t[0];t[1].rej("canceled: ".concat(n)),delete e._rrRequest[n],1})),0!==Object.keys(this._rrRequest).length)throw"panic: the rr map should have been cleared!"}},{key:"terminate",value:function(){this._cancelPendingRequests();var e=null;return this._isNode?e=this._worker.terminate():this._worker.terminate(),this._worker=null,e||void 0}}]),r}()};r.default=c}.call(this,t(2))},function(e,r){var t;t=function(){return this}();try{t=t||new Function("return this")()}catch(e){"object"==typeof window&&(t=window)}e.exports=t}]).default;
    exports.default = AsyncThreadWorker;
    Object.defineProperty(exports, '__esModule', { value: true });
})));