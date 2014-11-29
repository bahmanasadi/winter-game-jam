/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Viewport = require('../engine/Viewport.js'),
	Entity = require('../engine/Entity.js'),
	Layer = require('../engine/Layer.js'),
	Sprite = require('../engine/Sprite.js'),
	Generotor = require('../generator.js');

// Instances
// GameUI
// MenuUI
// PauseUI
var GameViewport = function (attributes) {
	Viewport.apply(this, attributes); // super()

	var sprites = {
		idle: new Sprite({
			url: 'img/sprites/s_idle.png'
		}),
		house1: new Sprite({
			url: 'img/sprites/house1.png'
		}),
		cloud1: new Sprite({
			url: 'img/sprites/cloud1.png'
		})
		//run: new Sprite({}),
		//jump: new Sprite({}),
		//tumble: new Sprite({})
	};

	this.layers = [
		new Layer(), // sky
		new Layer(), // background -- landmarks
		new Layer()  // foreground -- player + obstacles
	];


	var eHouse = new Entity({
		sprite: sprites.house1,
		position: {x: 25, y: 60},
		size: {x: 50, y: 44}
	});

	var eCloud = new Entity({
		sprite: sprites.cloud1,
		position: {x: 25, y: 100},
		size: {x: 50, y: 15}
	});

	var ePlayer = new Entity({
		sprite: sprites.idle,
		position: { x: 20, y: 20 },
		size: { x: 18, y: 32 }
	});
	
	// this.layers[2].entities.push(eCloud);
	// this.layers[2].entities.push(eHouse);
	// this.layers[2].entities.push(ePlayer);
	this.entities = {
		player: new Entity({
			sprite: sprites.idle,
			position: { x: 20, y: 20 },
			size: { x: 18, y: 32 }
		})
	};
	
	this.layers[2].entities.push(this.entities.player);

	var obstacles = Generotor.GenerateEntity([sprites.house1, sprites.cloud1], 1000.0);
	var that = this;
	_.each(obstacles, function (entity) {
		that.layers[2].entities.push(entity);
	});
	console.log(obstacles);
};

_.extend(GameViewport.prototype, Viewport.prototype, {
	click: function () {
		this.entities.player.velocity = { y: 5 };
		this.entities.player.accelaration = { y: -1 };
	}
});

module.exports = GameViewport;