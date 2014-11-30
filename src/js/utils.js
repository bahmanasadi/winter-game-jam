/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Entity = require('./engine/Entity.js');

var generateEntity = function (sprites, width, height) {
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

var getEntitiesInScene = function (entities, startX, endX) {
	var sceneEntities = [];
	for (var i=0; i<entities.length; i++) {
		var entity = entities[i];
		if (entity.position.x >= startX && entity.position.x <= endX) {
			sceneEntities.push (entity);
		}
	}
	return sceneEntities;
};

var detectCollision = function (entitya, entities, horiz, vert)   {
	var ax1 = entitya.position.x - entitya.size.x / 2,
		ax2 = ax1 + entitya.size.x,
		ay1 = entitya.position.y - entitya.size.y / 2,
		ay2 = ay1 + entitya.size.y;

	return _.find(entities, function (entityb) {
		if (entitya === entityb) { return; }

		var bx1 = entityb.position.x - entityb.size.x / 2,
			bx2 = bx1 + entityb.size.x,
			by1 = entityb.position.y - entityb.size.y / 2,
			by2 = by1 + entityb.size.y,
			horizCollision = ax2 > bx1 && ax1 < bx2,
			vertCollection = ay2 > by1 && ay1 < by2;

		if ((horiz && horizCollision) ||
			(vert && vertCollection) ||
			(horizCollision && vertCollection)) {
			return entityb;
		}
	});
};

var detectJumpingOver = function (entitya, entities)   {
	var ax1 = entitya.position.x - entitya.size.x / 2,
		ax2 = ax1 + entitya.size.x,
		ay1 = entitya.position.y - entitya.size.y / 2,
		ay2 = ay1 + entitya.size.y;

	return _.find(entities, function (entityb) {
		if (entitya === entityb) { return; }

		var bx1 = entityb.position.x, // bit of a hack to drop presents entityb.position.x - entityb.size.x / 2,
			bx2 = bx1 + entityb.size.x,
			by1 = entityb.position.y - entityb.size.y / 2,
			by2 = by1 + entityb.size.y,
			horizCollision = ax2 > bx1 && ax1 < bx2,
			over = ay2 > by1;

		if (horizCollision && over) {
			return entityb;
		}
	});
};

var detectVerticalCollision = function (entitya, entities) {
	return detectCollision(entitya, entities, true, false);
};
var detectHorizontalCollision = function (entitya, entities) {
	return detectCollision(entitya, entities, false, true);
};

module.exports  = {
	generateEntity		: generateEntity,
	getEntitiesInScene  : getEntitiesInScene,
	detectCollision		: detectCollision,
	detectHorizontalCollision: detectHorizontalCollision,
	detectVerticalCollision: detectVerticalCollision,
	detectJumpingOver: detectJumpingOver
};