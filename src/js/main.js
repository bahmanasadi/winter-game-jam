/* jshint node: true */
'use strict';

var $ = require('jquery'),
	BBPromise = require('bluebird'),
	_ = require('lodash');

require('requestanimationframe');

var ctx;
var WIDTH = 640, // sizing based on width
	HEIGHT = 480;

var click = function () {

};

$(function () {
	var canvas = document.createElement('canvas');
	canvas.width = WIDTH;
	canvas.height = WIDTH;
	document.body.appendChild(canvas);
	ctx = canvas.getContext('2d');
	canvas.onclick = click;
	setup();
});

var Sprite = function (attrs) {
	_.extend(this, {
		position: {},
		size: {},
		attach: {}
	}, attrs);
	if (this.slice) {
		this.animFrames = Math.round(1 / this.slice.size.x);
		this.animFrame = 0;
	}
};
_.extend(Sprite.prototype, {
	load: function () {
		var that = this;
		return resources.get(this.url).then(function (image) {
			that.image = image;
		});
	},
	absolute: function () {
		var that = this,
			abs = {};

		if (!that.size.hasOwnProperty('x')) {
			that.size.x = (that.size.y / that.image.height) * that.image.width;
		}
		if (!that.size.hasOwnProperty('y')) {
			that.size.y = (that.size.x / that.image.width) * that.image.height;
		}

		_({ width: 'x', height: 'y'}).map(function (dim, size) {
			abs[size] = that.size[dim];

			if (that.position.hasOwnProperty(dim)) {
				abs[dim] = that.position[dim];
			} else if (that.attach.hasOwnProperty(dim))	{
				var attachment = that.attach[dim];
				abs[dim] = attachment.dest.at(dim, attachment.destPos) -
					(attachment.srcPos - 0.5) * that.size[dim];
			}
		});

		abs.width = absolute(abs.width);
		abs.height = absolute(abs.height);
		abs.x = absolute(abs.x) - abs.width / 2;
		abs.y = absolute(abs.y, true) - abs.height / 2;

		if (this.slice) {
			var sliceWidth = that.image.width * that.slice.size.x,
				sliceHeight = that.image.height * that.slice.size.y,
				sliceY = that.image.height * that.slice.offset.y;
			if (that.slice.direction === 'horizontal') {
				abs.crop = {
					x: that.animFrame * sliceWidth,
					y: sliceY,
					width: sliceWidth,
					height: sliceHeight
				};
			}
		}
		
		return abs;
	},
	at: function (dim, pos) {
		return this.position[dim] - 
			(pos - 0.5) * this.size[dim];
	},
	updateAnimation: function (now) {
		if (!this.animate) { return; }
		if (!this._lastChange || now >= this._lastChange + (1000 / this.animate.speed)) {
			this.animFrame++;
			if (this.animFrame >= this.animFrames - 1) { this.animFrame = 0; }
			this._lastChange = now;
		}
	}
});

var absolute = function (rel, isY) {
	if (isY) { rel = 1 - rel; }
	return Math.round(rel * WIDTH);
};

var sprites = {
		rail: new Sprite({
			url: 'img/sprites/rail.png',
		})
	}
;

var setup = function () {
	
	var rail = new Sprite({
		sprite: sprites.rail,
		position: { x: 0.5, y: 0.8 },
		size: { x: 1, y: 0.005 }
	});
	sprites.push(rail);
	
	var player = new Sprite({
		url: 'img/sprites/player.png',
		animate: {
			speed: 15 // fps
		},
		slice: {
			direction: 'horizontal',
			offset: { x: 0, y: 0.25 },
			margin: { x: 0, y: 0 },
			size: { x: 0.111, y: 0.25 }
		},
		position: { x: 0.5, z: 4 },
		attach: { y: { dest: rail, srcPos: 0, destPos: 1 } },
		size: { x: 0.1, y: 0.1 }
	});
	sprites.push(player);

	_.times(8, function (i) {
		var x = 0.08 + i * 0.12;
		var terminal = new Sprite({
			url: 'img/sprites/terminal.png',
			position: { x: x, z: 2 },
			size: { x: 0.04 },
			attach: { y: { dest: rail, srcPos: 0, destPos: 1 } }
		});
		sprites.push(terminal);
	});

	BBPromise.all(sprites.map(function (sprite) { 
		return sprite.load();
	})).then(function () {
		animate();
	});
};

var drawSprite = function (sprite) {
	var abs = sprite.absolute();
	if (abs.crop) {
		ctx.drawImage(sprite.image, 
			abs.crop.x, abs.crop.y, abs.crop.width, abs.crop.height,
			abs.x, abs.y, abs.width, abs.height);
	} else {
		ctx.drawImage(sprite.image, abs.x, abs.y, abs.width, abs.height);
	}
};

// The main game loop
var lastTime;
var animate = function () {
	requestAnimationFrame(animate);
	var now = Date.now(),
		dt = (now - lastTime) / 1000;

	lastTime = now;
	
	update(dt, now);
	render();
};

var update = function (dt, now) {
	sprites.map(function (sprite) { sprite.updateAnimation(now); });
};

var render = function () {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	sprites.map(drawSprite);
};


var resources = {
	_cache: {},
	// Load an image url or an array of image urls
	get: function (url) {
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
