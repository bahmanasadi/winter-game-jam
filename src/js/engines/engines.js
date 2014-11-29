/* jshint node: true */
'use strict';

var Backbone = require('backbone'),
	resources = require('../resources.js');


var Scene = Backbone.Model.extend({
	layers: [],
	entities: [],

	initialize: function() {
	}
});

var Entity = Backbone.Model.extend({
	zIndex: 		0,
	position: 	{x:0, y:0},
	acceleration: {x:0, y:0},
	velocity: 	{x:0, y:0},

	initialize: function() {
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

	initialize: function (options) {
		this.url = options.url;
	},
	load: function () {
		var that = this;
		return resources.get(this.url).then(function (image) {
			that.image = image;
		});
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
	},
	draw: function () {

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

