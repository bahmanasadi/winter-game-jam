/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Entity = require('../engine/Entity.js'),
	RectangleSprite = require('../engine/RectangleSprite.js');

var BuildingGenerator = function () {
	Entity.apply(this, arguments);
	this.generatedEntities = [];
	this.blocks = [];
	this.sprites = {
		wallStyles: {
			brick: {
				buildingLeft: new RectangleSprite({ fill: 'red' }),
				buildingRight: new RectangleSprite({ fill: 'red' }),
				buildingMid: new RectangleSprite({ fill: 'red' })
			},
			plaster: {
				buildingLeft: new RectangleSprite({ fill: 'white' }),
				buildingRight: new RectangleSprite({ fill: 'white' }),
				buildingMid: new RectangleSprite({ fill: 'white' })
			}
		},
		roofStyles: {
			greyTile: {

			},
			redTile: {

			},
			thatch: {

			}
		}
	};
};
_.extend(BuildingGenerator.prototype, Entity.prototype, {
	animate: _.throttle(function () {
		// check if new block needs to be generated
		var first = _.first(this.blocks),
			last = _.last(this.blocks);
		if (!first) {
			this.generateBlock(0);
		}
		/*if (first && first.position.x + first.size.x / 2 + 60 < this.layer.position.x) {
			this.destroyBlock(first);
		}*/
		if (last && last.position.x + last.size.x / 2 < -this.layer.position.x + this.size.x / 2 + 256) {
			this.generateBlock(last.position.x + last.size.x / 2);
		}
	}, 100),
	// A block consists of a left side, a number of mid parts and a right side
	generateBlock: function (x) {
		console.log('x', x);
		x = Math.round(x + 32 + Math.random() * 128); // create a gap
		var that = this,
			buildingWidth = 64,
			entities = [],
			wallStyle = _.sample(_.keys(this.sprites.wallStyles)),
			roofStyle = _.sample(_.keys(this.sprites.roofStyles)),

			buildingCount = Math.round(2 + Math.random() * 8),
			width = buildingCount * buildingWidth,
			y = Math.round(3 + Math.random() * 5),
			sprites = _.extend({}, this.sprites.wallStyles[wallStyle], this.sprites.roofStyles[roofStyle]);

		
		var block = {
			position: { x: x + width / 2, y: y },
			size: { x: width, y: 30 }
		};
		this.blocks.push(block);

		var marker = new Entity(_.extend({
			sprite: new RectangleSprite({ fill: 'red' })
		}, block));

		entities.push(marker);

		console.log('generate', block.position.x, block.position.y, block.size.x, block.size.y);

		/*entities.push(leftSide);
		entities.push(rightSide);

		_.times(buildingCount, function (i) {
			var leftSide = new Entity({
				sprite: sprites.buildingLeft,
				position: { x: x, y: y }
			}),
			rightSide = new Entity({
				sprite: sprites.buildingRight,
				position: { x: x + sideWidth + buildingCount * midWidth, y: y }
			});
			var midBuilding = new Entity({
				sprite: sprites.buildingMid,
				position: { x: x + sideWidth + i * midWidth }
			});
			entities.push(midBuilding);
		});
		entities.push(rightSide);	*/

		entities.forEach(function (entity) {
			that.layer.add(_.extend(entity, {
				velocity: that.velocity,
				accelaration: that.accelaration
			}));
		});
	},
	destroyBlock: function (block) {
		// todo
	}
});

module.exports = BuildingGenerator;