import { randomFloat } from '../utils';

export default class Entity {
	constructor(attributes) {
		Object.assign(this, {
			position: {x:0, y:0},
			acceleration: {x:0, y:0},
			velocity: {x:0, y:0}
		}, attributes);
		if (this.sprite && !this.size) {
			this.size = { x: this.sprite.image.width, y: this.sprite.image.height };
		}
	}
	render(time, context) {
		var pos = this.absolute(context);
		if (this.sprite) { this.sprite.render(context, pos); }
		this.animate(time);
	}
	animate(time) {
		this.position.x += (this.velocity.x || 0) * time;
		this.position.y += (this.velocity.y || 0) * time;
		this.velocity.x += (this.acceleration.x || 0) * time;
		this.velocity.y += (this.acceleration.y || 0) * time;
	}
	haze() {
		return window.game.drunkenness * (Math.max(0, this.position.x - this.size.x / 2 + this.layer.position.x - 60 + window.game.drunkenness * 40) / 60);
	}
	absolute(context) {
		var sf = context.scaleFactor,
			marginTop = context.marginTop,
			haze = window.game.gameover ? 0 : this.haze();
		return {
			x: Math.round((this.position.x + this.layer.position.x - this.size.x / 2 + randomFloat(-haze, haze)) * sf),
			y: marginTop + Math.round((160 - this.position.y + this.layer.position.y - this.size.y / 2  + randomFloat(-haze, haze)) * sf),
			width: Math.round(this.size.x) * sf, 
			height: Math.round(this.size.y) * sf
		};
	}
}

Entity.types = { player: 'player', other: 'other' };
