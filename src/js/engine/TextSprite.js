import Sprite from './Sprite.js';
import resources from './resources.js';

export default class TextSprite extends Sprite {
	constructor(...args) {
		super(...args);
		this.image = resources.get(this.url);
	}
	render(context, pos) {
		context.font = (this.fontSize || 8) * context.scaleFactor + 'px "Press Start 2P"';
		context.textAlign = 'center';
		if (this.shadow) {
			context.fillStyle = 'black';
			context.fillText(this.text, pos.x + context.scaleFactor, pos.y + context.scaleFactor);
		}
		context.fillStyle = this.fill;
		context.fillText(this.text, pos.x, pos.y);
	}
}
