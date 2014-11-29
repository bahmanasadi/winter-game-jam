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
	
});

module.exports = Generator;