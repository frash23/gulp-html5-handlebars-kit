/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* Sample main.js. Imports a module and exports it to the window
	 * object so you can call properties from it in your console for
	 * testing */

	'use strict';

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _nq = __webpack_require__(1);

	var _nq2 = _interopRequireDefault(_nq);

	var _Module = __webpack_require__(2);

	var mod = _interopRequireWildcard(_Module);

	window.$ = _nq2['default'];
	window.mod = mod;

/***/ },
/* 1 */
/***/ function(module, exports) {

	/* nq - the only true jQuery replacement */

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports["default"] = function (sel) {
	  return [].slice.call(document.querySelectorAll(sel));
	};

	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports) {

	/* Example module to demonstrate the import functionality */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.log = log;

	function log() {
	  console.log('You called log() in Module.js!');
	}

	;
	var testInterpolation = function testInterpolation() {
	  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    rest[_key - 1] = arguments[_key];
	  }

	  var str = arguments.length <= 0 || arguments[0] === undefined ? 'nothing' : arguments[0];
	  return 'You wrote: "' + str + '". ' + (rest.length > 0 ? 'Additional arguments where passed: ' + rest : 'No additional arguments passed.');
	};
	exports.testInterpolation = testInterpolation;
	var variable = 'I\'m a member of Module.js, nice to meet you!';

	exports.variable = variable;
	var def = 'I\'m the default value.';
	exports['default'] = def;

/***/ }
/******/ ]);