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
		var first = _.first(this.blocks),
			last = _.last(this.blocks);
		if (!first) {
			this.generateBlock(0);
		}
		/*if (first && first.position.x + first.size.x / 2 + 60 < this.layer.position.x) {
			this.destroyBlock(first);
		}*/
		while (last && last.position.x + last.size.x / 2 < -this.layer.position.x + this.size.x / 2 + 256) {
			this.generateBlock(last.position.x + last.size.x / 2);
			last = _.last(this.blocks);
		}
	}, 100),
	generateBlock: function (x1) {
		var that = this,
			block = {
				position: { x: x1 + that.blockSize.x / 2, y: 80 },
				size: { x: that.blockSize.x, y: 160 }
			};
		_.times(Math.round(that.entityCount.min + Math.random() * (that.entityCount.max - that.entityCount.min)), function () {
			var x = Math.round(x1 + Math.random() * that.blockSize.x),
				y = Math.round(Math.random() * 160);
			var entity = new Entity({
				sprite: _.sample(that.sprites),
				size: that.entitySize,
				position: { x: x, y: y }
			});
			that.layer.add(entity);
		});
		this.blocks.push(block);
	}
});

module.exports = Generator;
