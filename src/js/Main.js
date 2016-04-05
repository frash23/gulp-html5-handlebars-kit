"use strict"; /* Use strict mode to improve performance and prevent mistakes */

const get = require('./get');

get('/static/test.txt').then(res=> {
	console.log(res);
});
