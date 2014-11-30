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
	this.chimneys = [];
	
	this.sprites = [
		{
			buildingLeft: new ImageSprite({ url: 'img/sprites/building-blue-roof-brick-left.png' }),
			buildingMid: [
				new ImageSprite({ url: 'img/sprites/building-blue-roof-brick-mid.png' }),
				new ImageSprite({ url: 'img/sprites/building-blue-roof-brick-mid-window.png' })
			],
			buildingRight: new ImageSprite({ url: 'img/sprites/building-blue-roof-brick-right.png' }),
			chimney: [
				new ImageSprite({ url: 'img/sprites/chimney-brick1.png' }),
				new ImageSprite({ url: 'img/sprites/chimney-brick2.png' })
			]
		},
		{
			buildingLeft: new ImageSprite({ url: 'img/sprites/building-red-roof-brick-left.png' }),
			buildingMid: [
				new ImageSprite({ url: 'img/sprites/building-red-roof-brick-mid.png', }),
				new ImageSprite({ url: 'img/sprites/building-red-roof-brick-mid-window.png' })
			],
			buildingRight: new ImageSprite({ url: 'img/sprites/building-red-roof-brick-right.png' }),
			chimney: [
				new ImageSprite({ url: 'img/sprites/chimney-brick1.png' }),
				new ImageSprite({ url: 'img/sprites/chimney-brick2.png' })
			]
		},
		{
			keepShort: true,
			buildingLeft: new ImageSprite({ url: 'img/sprites/building-thatch-left.png' }),
			buildingMid: [
				new ImageSprite({ url: 'img/sprites/building-thatch-mid.png' }),
				new ImageSprite({ url: 'img/sprites/building-thatch-mid-window.png' })
			],
			buildingRight: new ImageSprite({ url: 'img/sprites/building-thatch-right.png' }),
			chimney: [
				new ImageSprite({ url: 'img/sprites/chimney-paint1.png' })
			]
		},
		{
			buildingLeft: new ImageSprite({ url: 'img/sprites/building-blue-roof-plaster-left.png' }),
			buildingMid: [
				new ImageSprite({ url: 'img/sprites/building-blue-roof-plaster-mid.png' }),
				new ImageSprite({ url: 'img/sprites/building-blue-roof-plaster-mid-dormer.png' }),
				new ImageSprite({ url: 'img/sprites/building-blue-roof-plaster-mid-window.png' })
			],
			buildingRight: new ImageSprite({ url: 'img/sprites/building-blue-roof-plaster-right.png' }),
			chimney: [
				new ImageSprite({ url: 'img/sprites/chimney-paint1.png' })
			]
		},
		{
			keepShort: true,
			buildingLeft: new ImageSprite({ url: 'img/sprites/building-thatch-tudor-left.png' }),
			buildingMid: [
				new ImageSprite({ url: 'img/sprites/building-thatch-tudor-mid.png' }),
				new ImageSprite({ url: 'img/sprites/building-thatch-tudor-mid-window.png' }),
				new ImageSprite({ url: 'img/sprites/building-thatch-tudor-mid-crossdown.png' }),
				new ImageSprite({ url: 'img/sprites/building-thatch-tudor-mid-crossup.png' })
			],
			buildingRight: new ImageSprite({ url: 'img/sprites/building-thatch-tudor-right.png' }),
			chimney: [
				new ImageSprite({ url: 'img/sprites/chimney-paint1.png' })
			]
		}
	];
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
			//this.player.score++;
			console.log('score++');
		}
	}, 100),
	// A block consists of a left side, a number of mid parts and a right side
	generateBlock: function (x) {
		console.log('x', x);
		x = Math.round(x + 32 + Math.random() * 32); // create a gap
		var that = this,
			buildingWidth = 64,
			buildingHeight = 80,
			entities = [],
			sprites = _.sample(_.values(this.sprites)),

			buildingCountMax = sprites.keepShort ? 2 : 8, // shorter thatch
			buildingCount = Math.round(2 + Math.random() * buildingCountMax),
			width = buildingCount * buildingWidth,
			y = buildingHeight / 2 - Math.round(3 + Math.random() * 20);
		
		var block = {
			position: { x: x + width / 2, y: y },
			size: { x: width, y: 30 }
		};
		this.blocks.push(block);

		console.log('generate', block.position.x, block.position.y, block.size.x, block.size.y);

		var chimneyProbability = 0.3;
		_.times(buildingCount, function (i) {
			var midIndex = Math.random() < 0.4 ? 0 : _.random(0, sprites.buildingMid.length - 1),
				sprite = i === 0 ? sprites.buildingLeft :
				i === buildingCount - 1 ? sprites.buildingRight :
				sprites.buildingMid[midIndex];

			var section = new Entity({
				sprite: sprite,
				position: { x: x + i * buildingWidth, y: y },
				size: { x: buildingWidth, y: buildingHeight }
			});
			entities.push(section);

			var hasChimney = i > 0 && i < buildingCount - 1 && midIndex === 0 && Math.random() < chimneyProbability;

			if (hasChimney) {
				var pos = { x: x + i * buildingWidth, y: y + 30 + _.random(0, 10) };
				var chimneyFace = new Entity({
					sprite: that.chimneyFaceSprites.sleep,
					position: pos
				});
				var chimney = new Entity({
					sprite: _.sample(sprites.chimney),
					position: pos,
					face: chimneyFace
				});
				entities.push(chimney);
				entities.push(chimneyFace);
				that.chimneys.push(chimney);
				chimneyProbability = -0.2;
			} else {
				chimneyProbability += 0.45;
			}
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