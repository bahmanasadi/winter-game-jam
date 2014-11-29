'use strict';

var _ = require('lodash'),
	engines = require('../engines/engines.js');

var EntityGenerotor = function (sprites, width, height) {
	var objects = [],
		i = 0;

	while (i < width) {
		if (Math.random() > 0.5) {
			i += Math.random() * 10 * Math.floor((Math.random() * 10) + 1); // Random gaps
		} else {
			var sprite = Math.floor((Math.random() * sprites.length) + 1);
			objects.push(new engines.Entity({
				sprite: 	sprite,
				position: 	{ x: i, y: 0 },
				scale: 		{ x: 1.0, y: 1.0 }
			}));
			i += sprite.width;
		}
	}

	return objects;
};

var GetEntitiesInScene = function (entities, startx, endx) {
	var sceneEntities = [];
	for (var i=0; i<entities.length; i++) {
		var entity = entities[i];
		if (entity.position.x >= startx && entity.position.x <= endx) {
			sceneEntities.push (entity);
		}
	}
	return entity;
};

module.exports  = {
	EntityGenerotor : GetEntitiesInScene
};