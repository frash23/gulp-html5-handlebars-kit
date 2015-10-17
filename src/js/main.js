/* Demonstration of the EcmaScript 2015 module syntax */
import * as mod from './Module';

(function() {
	"use strict";

	/* Export the above module to the global scope */
	window.mod = mod;

	/* The only true jQuery replacement */
	window.$ = sel=> [].slice.call( document.querySelectorAll(sel) );

/* Apply a map as `this` so we don't accidentally pollute the global namespace */
}.call({}));
