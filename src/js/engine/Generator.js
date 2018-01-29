import Entity from './Entity';
import utils from '../utils';

export default class Generator extends Entity {
	constructor(...args) {
		super(...args);
		this.generatedEntities = [];
		this.blocks = [];
	}
	animate() {
		let now = Date.now();
		if (now < this._lastAnim + 100) { return; } // throttle to 100ms
		this._lastAnim = now;
		// check if new block needs to be generated
		var first = this.blocks[0];
		if (!first) {
			this.generateBlock(0);
		}
		var last = this.blocks[this.blocks.length - 1];
		/*if (first && first.position.x + first.size.x / 2 + 60 < this.layer.position.x) {
			this.destroyBlock(first);
		}*/
		while (last && last.position.x + last.size.x / 2 < -this.layer.position.x + this.size.x / 2 + 768) {
			this.generateBlock(last.position.x + last.size.x / 2);
			last = this.blocks[this.blocks.length - 1];
		}
	}
	generateBlock(x1) {
		var that = this,
			y1 = that.position.y - that.size.y / 2,
			block = {
				position: { x: x1 + that.blockSize.x / 2, y: that.position.y },
				size: { x: that.blockSize.x, y: that.position.y }
			};
		console.log('block', x1, y1);
		Array(Math.round(that.entityCount.min + Math.random() * (that.entityCount.max - that.entityCount.min))).fill(null).forEach(() => {
			var x = Math.round(x1 + Math.random() * that.blockSize.x),
				y = Math.round(y1 + Math.random() * that.size.y);
			that.generateEntity(x, y);
		});
		this.blocks.push(block);
	}
	generateEntity(x, y) {
		var entity = new Entity({
			sprite: utils.randEl(this.sprites),
			size: this.entitySize,
			position: { x: x, y: y }
		});
		this.layer.add(entity);
		return entity;
	}
}
