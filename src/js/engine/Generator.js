/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Entity = require('../engine/Entity.js');

var Generator = function () {
	Entity.apply(this, arguments);
	this.generatedEntities = [];
	this.blocks = [];
};
_.extend(Generator.prototype, Entity.prototype, {
	animate: _.throttle(function () {
		// check if new block needs to be generated
		var first = _.first(this.blocks);
		if (!first) {
			this.generateBlock(0);
		}
		var last = _.last(this.blocks);
		/*if (first && first.position.x + first.size.x / 2 + 60 < this.layer.position.x) {
			this.destroyBlock(first);
		}*/
		while (last && last.position.x + last.size.x / 2 < -this.layer.position.x + this.size.x / 2 + 768) {
			this.generateBlock(last.position.x + last.size.x / 2);
			last = _.last(this.blocks);
		}
	}, 100),
	generateBlock: function (x1) {
		var that = this,
			y1 = that.position.y - that.size.y / 2,
			block = {
				position: { x: x1 + that.blockSize.x / 2, y: that.position.y },
				size: { x: that.blockSize.x, y: that.position.y }
			};
		console.log('block', x1, y1);
		_.times(Math.round(that.entityCount.min + Math.random() * (that.entityCount.max - that.entityCount.min)), function () {
			var x = Math.round(x1 + Math.random() * that.blockSize.x),
				y = Math.round(y1 + Math.random() * that.size.y);
			that.generateEntity(x, y);
		});
		this.blocks.push(block);
	},
	generateEntity: function (x, y) {
		var entity = new Entity({
			sprite: _.sample(this.sprites),
			size: this.entitySize,
			position: { x: x, y: y }
		});
		this.layer.add(entity);
		return entity;
	}
});

module.exports = Generator;
