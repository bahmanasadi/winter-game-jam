/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Entity = require('../engine/Entity.js'),
	ImageSprite = require('../engine/ImageSprite.js'),
	Generator = require('../engine/Generator.js');

var BuildingGenerator = function () {
	Generator.apply(this, arguments);
	this.generatedEntities = [];
	this.blocks = [];
			
	this.sprites = {
		wallStyles: {
			plaster: {
				buildingLeft: new ImageSprite({ url: 'img/sprites/building-blue-roof-plaster-left.png' }),
				buildingMid: new ImageSprite({ url: 'img/sprites/building-blue-roof-plaster-mid.png' }),
				buildingMidDormer: new ImageSprite({ url: 'img/sprites/building-blue-roof-plaster-mid-dormer.png' }),
				buildingMidWindow: new ImageSprite({ url: 'img/sprites/building-blue-roof-plaster-mid-window.png' }),
				buildingRight: new ImageSprite({ url: 'img/sprites/building-blue-roof-plaster-right.png' })
			},
			thatch: {
				buildingLeft: new ImageSprite({ url: 'img/sprites/building-thatch-left.png' }),
				buildingMid: new ImageSprite({ url: 'img/sprites/building-thatch-mid.png' }),
				buildingMidWindow: new ImageSprite({ url: 'img/sprites/building-thatch-mid-window.png' }),
				buildingRight: new ImageSprite({ url: 'img/sprites/building-thatch-right.png' })
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
_.extend(BuildingGenerator.prototype, Generator.prototype, {
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
			buildingHeight = 80,
			entities = [],
			sprites = _.sample(_.values(this.sprites.wallStyles)),

			buildingCountMax = !sprites.buildingMidDormer ? 2 : 8, // shorter thatch
			buildingCount = Math.round(2 + Math.random() * buildingCountMax),
			width = buildingCount * buildingWidth,
			y = buildingHeight / 2 - Math.round(3 + Math.random() * 20);
		
		var block = {
			position: { x: x + width / 2, y: y },
			size: { x: width, y: 30 }
		};
		this.blocks.push(block);

		console.log('generate', block.position.x, block.position.y, block.size.x, block.size.y);

		_.times(buildingCount, function (i) {
			var sprite = i === 0 ? sprites.buildingLeft :
				i === buildingCount - 1 ? sprites.buildingRight :
				Math.random() < 0.6 ? sprites.buildingMidWindow :
				sprites.buildingMidDormer && Math.random() < 0.4 ? sprites.buildingMidDormer :
				sprites.buildingMid;

			var section = new Entity({
				sprite: sprite,
				position: { x: x + i * buildingWidth, y: y },
				size: { x: buildingWidth, y: buildingHeight }
			});
			entities.push(section);
		});

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