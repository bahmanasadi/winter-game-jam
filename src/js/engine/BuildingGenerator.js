import utils from '../utils';
import Entity from './Entity';
import ImageSprite from './ImageSprite';
import Generator from './Generator';

export default class BuildingGenerator extends Generator {
	constructor(...args) {
		super(...args);
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
	}
	animate() {
		let now = Date.now();
		if (now < this._lastAnim + 100) { return; } // throttle to 100ms
		this._lastAnim = now;
		// check if new block needs to be generated
		var first = this.blocks[0],
			last = this.blocks[this.blocks.length -	1];
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
	}
	// A block consists of a left side, a number of mid parts and a right side
	generateBlock(x) {
		console.log('x', x);
		x = Math.round(x + 16 + Math.random() * 32); // create a gap
		var that = this,
			buildingWidth = 64,
			buildingHeight = 80,
			entities = [],
			sprites = utils.randEl(Object.values(this.sprites)),
			gameStart = x < 128,

			buildingCountMin = gameStart ? 4 : 2,
			buildingCountMax = sprites.keepShort ? 2 : 8, // shorter thatch
			buildingCount = Math.round(buildingCountMin + Math.random() * buildingCountMax),
			width = buildingCount * buildingWidth,
			y = buildingHeight / 2 - Math.round(3 + Math.random() * 20);
		
		var block = {
			position: { x: x + width / 2, y: y },
			size: { x: width, y: 30 }
		};
		this.blocks.push(block);

		console.log('generate', block.position.x, block.position.y, block.size.x, block.size.y);

		var chimneyProbability = 0.3;
		Array(buildingCount).fill(null).map((u, i) => {
			var midIndex = Math.random() < 0.4 ? 0 : utils.random(0, sprites.buildingMid.length - 1),
				sprite = i === 0 ? sprites.buildingLeft :
				i === buildingCount - 1 ? sprites.buildingRight :
				sprites.buildingMid[midIndex];

			var section = new Entity({
				sprite: sprite,
				position: { x: x + i * buildingWidth - i, y: y },
				size: { x: buildingWidth, y: buildingHeight }
			});
			entities.push(section);

			var hasChimney = !gameStart && i > 0 && i < buildingCount - 1 && midIndex === 0 && Math.random() < chimneyProbability;

			if (hasChimney) {
				var pos = { x: x + i * buildingWidth, y: y + 30 + utils.random(0, 10) };
				var chimneyFace = new Entity({
					sprite: that.chimneyFaceSprites.sleep,
					position: pos
				});
				var chimney = new Entity({
					sprite: utils.randEl(sprites.chimney),
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

		entities.forEach(entity => {
			that.layer.add(Object.assign(entity, {
				velocity: that.velocity,
				accelaration: that.accelaration
			}));
		});
	}
	destroyBlock() {
		// todo
	}
}
