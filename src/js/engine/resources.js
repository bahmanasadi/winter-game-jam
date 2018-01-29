const cache = {};

// Load an image url
const load = url => {
	console.log('GET', url);
	return new Promise(function (resolve, reject) {
		var img = new Image();
		img.onload = function () {
			cache[url] = img;
			// console.log('success');
			resolve(img);
		};
		img.onerror = function () {
			reject('url not found ' + url);
		};
		img.src = url;
	});
};

const get = url => cache[url];

export default { load, get };