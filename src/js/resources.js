/* jshint node: true */
'use strict';


var BBPromise = require('bluebird');

var resources = {
	_cache: {},
	// Load an image url or an array of image urls
	get: function (url) {
		console.log('GET', url);
		if (url instanceof Array) {
			return BBPromise.all(url.map(resources.load));
		}

		return new BBPromise(function (resolve, reject) {
			if (resources._cache[url]) {
				resolve(resources._cache[url]);
			} else {
				var img = new Image();
				img.onload = function () {
					resources._cache[url] = img;
					resolve(img);
				};
				img.onerror = function () {
					reject();
				};
				img.src = url;
			}
		});
    }
};

module.exports = resources;