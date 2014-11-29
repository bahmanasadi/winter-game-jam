'use strict';

var _ = require('lodash'),
	Entity = require('./engine/Entity.js');

var GenerateEntity = function (sprites, width) {
	var objects = [],
		i = 0;

	while (i < width) {
		if (Math.random() < 0.5) {
			i += Math.random() * 10 * Math.floor((Math.random() * 10) + 1); // Random gaps
		} else {
			var sprite = sprites[Math.floor((Math.random() * sprites.length))];
			objects.push(new Entity({
				sprite: 	sprite,
				position: 	{ x: i, y: 22 },
				size: 		{ x: sprite.image.width, y: sprite.image.height }
			}));
			i += sprite.image.width;
		}
	}

	return objects;
};

var GetEntitiesInScene = function (entities, startX, endX) {
	var sceneEntities = [];
	for (var i=0; i<entities.length; i++) {
		var entity = entities[i];
		if (entity.position.x >= startX && entity.position.x <= endX) {
			sceneEntities.push (entity);
		}
	}
	return sceneEntities;
};

var DetectCollision = function (entity, entities) {
	var startX = entity.position.x;
	var endX = startX + entity.size.x;

	var startY = entity.position.y;

	for (var i=0; i < entities.length; i++) {
		var otherEntity = entities[i];
		if (entity == otherEntity) {
			continue;
		}

		var otherStartX = otherEntity.position.x;
		var otherEndX = otherStartX + otherEntity.size.x;

		var otherStartY = otherEntity.position.y - (otherEntity.size.y/2);
		var otherEndY = otherStartY + otherEntity.size.y;
		// TODO Check for height
		if ( (startX > otherStartX && startX < otherEndX)
			 || (endX > otherStartX && endX < otherEndX)
			 || (startY >= otherStartY && startY <= otherEndY) ) {
			return otherEntity;
		}
	}
	return undefined;
};

module.exports  = {
	GenerateEntity		: GenerateEntity,
	GetEntitiesInScene  : GetEntitiesInScene,
	DetectCollision		: DetectCollision
};