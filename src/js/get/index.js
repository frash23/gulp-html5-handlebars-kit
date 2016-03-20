"use strict";

function jsonToPostData(obj) {
	return Object.keys(data).map(k=> {
		encodeURIComponent(k) +'='+ encodeURIComponent(data[k])
	}).join('&');
};

function get(url, data=undefined, reqType='GET') {
	return new Promise( (resolve, reject)=> {
		var xhr = new XMLHttpRequest();
		xhr.open(reqType, url, true);
		xhr.send( data? jsonToPostData(data) : null );

		xhr.onload = ()=> resolve(xhr.responseText);
		xhr.onerror = ()=> reject(xhr.responseText);
	});
}

module.exports = get;
