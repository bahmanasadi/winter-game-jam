'use strict';

var _ = require('lodash'),
	Entity = require('./engine/Entity.js');

var GenerateEntity = function (sprites, width, height) {
	var objects = [],
		i = 0;

	while (i < width) {
		if (Math.random() < 0.5) {
			i += Math.random() * 10 * Math.floor((Math.random() * 10) + 1); // Random gaps
		} else {
			var sprite = sprites[Math.floor((Math.random() * sprites.length))];
			objects.push(new Entity({
				sprite: 	sprite,
				position: 	{ x: i, y: height ? Math.random() * height : 22 },
				size: 		{ x: sprite.image.width, y: sprite.image.height }
			}));
			i += sprite.image.width;
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
	return sceneEntities;
};

module.exports  = {
	GenerateEntity		: GenerateEntity,
	GetEntitiesInScene  : GetEntitiesInScene
};