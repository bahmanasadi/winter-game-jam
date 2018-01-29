import Entity from './Entity';
import Generator from './Generator';
import utils from '../utils';

export default class CloudGenerator extends Generator {
	constructor(...args) {
		super(...args);
		this.faces = [];
	}
	generateEntity(...args) {
		let entity = super.generateEntity(...args);
		entity.face = new Entity({
			sprite: utils.randEl([this.faceSprites.happyPleased, this.faceSprites.happySmiley]),
			position: entity.position
		});
		this.layer.add(entity.face);
		this.faces.push(entity.face);
		return entity;
	}
}
