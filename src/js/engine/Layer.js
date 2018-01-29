import Entity from './Entity';

// Instances
// SkyLayer - tiled background image, e.g. gradient dark sky, clouds, moon, stars - procedurally placed
// BackgroundLayer - big ben, millenium wheel
// ForegroundLayer - player
export default class Layer extends Entity {
	constructor(...args) {
		super(...args);
		this.entities = [];
		this.pause = false;
		this.gameover = false;
	}
	render(time, context) {
		this.entities.forEach(entity => { 
			// Overwrite outer variable time
			if (entity.type === Entity.types.player && this.gameover) {

			} else if (this.pause) {
				time = 0;
			} else if (this.gameover) {
				time = 0;
			} else {
			}
			entity.render(time, context); 
		});
		this.animate(time);
	}
	add(entity) {
		entity.layer = this;
		this.entities.push(entity);
	}
	remove(entity) {
		entity.layer = undefined;
		let i = this.entities.indexOf(entity);
		if (i > -1) { this.entities.splice(i, 1); }
	}
}
