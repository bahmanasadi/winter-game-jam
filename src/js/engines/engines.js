/* jshint node: true */
'use strict';

var Backbone = require('backbone'),
	resources = require('../resources.js');


var Scene = Backbone.Model.extend({
	layers: undefined,
	entities: undefined,

	initialize: function() {
		this.entities = [];
		this.layers = [];
	},
	render: function (time, context) {
		this.layers.forEach(function (layer) { layer.render(time, context); });
		this.entities.forEach(function (entity) { entity.render(time, context); });
	}
});

var Entity = Backbone.Model.extend({
	zIndex: 		0,
	position: 	{x:0, y:0},
	acceleration: {x:0, y:0},
	velocity: 	{x:0, y:0},

	initialize: function (options) {
		this.sprite = options.sprite;
	},
	render: function (time, context) {
		var pos = this.absolute();
		if (this.sprite) { this.sprite.render(context, pos); }
	},
	absolute: function () {
		return { x: 0, y: 0, width: 64, height: 64 };
	}
});

// Instances
// SkyLayer - tiled background image, e.g. gradient dark sky, clouds, moon, stars - procedurally placed
// BackgroundLayer - big ben, millenium wheel
// ForegroundLayer - player
var BaseLayer = Backbone.Model.extend({
	entities: [],			// (big ben, millenium wheel)
	positionMutiplier: 0,	// (position is the player position * positionMultiplier)
	zIndex: 0,

	initialize: function() {
	}
});

var Sprite = Backbone.Model.extend({
	type: undefined, //"image", "animation", "text"
	url: undefined,
	animation : undefined,
	text: "",
	width: 0,
	height: 0,
	
	initialize: function (options) {
		this.url = options.url;
	},
	load: function () {
		var that = this;
		return resources.get(this.url).then(function (image) {
			that.image = image;
		});
	},
	render: function (context, pos) {
		if (this.image) {
			if (pos.crop) {
				context.drawImage(this.image, 
					pos.crop.x, pos.crop.y, pos.crop.width, pos.crop.height,
					pos.x, pos.y, pos.width, pos.height);
			} else {
				console.log(pos.x, pos.y, pos.width, pos.height)
				context.drawImage(this.image, pos.x, pos.y, pos.width, pos.height);
			}
		}
		if (this.gradient) {

		}
		if (this.text) {

		}
	}
});



var UISherryScale = Entity.extend({

	initialize: function() {
	}

});

var UIText = Entity.extend({
	text: "",

	initialize: function() {
	}
	
});

var UIButton = Entity.extend({

	initialize: function() {
	}
	
});

// Instances
// GameUI
// MenuUI
// PauseUI
var UIScreen = Backbone.Model.extend({
	scene: undefined,
	entities: undefined,

	initialize: function() {
		this.entities = [];
	},
	draw: function () {

	},
	render: function (time, context) {
		if (this.scene) { this.scene.render(time, context); }
		this.entities.forEach(function (entity) { entity.render(time, context); });
	}
});


module.exports  = {
	Scene 			: Scene,
	Entity 			: Entity,
	BaseLayer 		: BaseLayer,
	Sprite			: Sprite,
	UISherryScale	: UISherryScale,
	UIText			: UIText,
	UIButton		: UIButton,
	UIScreen		: UIScreen
};

