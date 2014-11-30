/* jshint node: true */
'use strict';

var _ = require('lodash'),
	Entity = require('../engine/Entity.js'),
	Generator = require('../engine/Generator.js');

var CloudGenerator = function () {
	Generator.apply(this, arguments);
	this.faces = [];
};
_.extend(CloudGenerator.prototype, Generator.prototype, {
	generateEntity: function () {
		var entity = Generator.prototype.generateEntity.apply(this, arguments);
		entity.face = new Entity({
			sprite: _.sample([this.faceSprites.happyPleased, this.faceSprites.happySmiley]),
			position: entity.position
		});
		this.layer.add(entity.face);
		this.faces.push(entity.face);
		return entity;
	}
});

module.exports = CloudGenerator;
