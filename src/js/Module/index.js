/* Example module */
"use strict";

/* The only true jQuery replacement */
module.exports = sel=> [].slice.call( document.querySelectorAll(sel) );
