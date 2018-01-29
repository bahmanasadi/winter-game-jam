import Sprite from './Sprite';
import resources from './resources';

export default class ImageSprite extends Sprite {
	constructor(...args) {
		super(...args);
		this.image = resources.get(this.url);
		if (this.animate) {
			this.frameCount = Math.floor(this.image.width / this.animate.slice.x);
			this.currentFrame = 0;
			setInterval(() => {
				this.currentFrame++;
				if (this.currentFrame === this.frameCount) {
					this.currentFrame = 0;
				}
			}, 1 / this.animate.speed * 1000);
		}
	}
	render(context, pos) {
		context.save();
		context.translate(pos.x, pos.y);
		if (this.rotation) {
			context.rotate(this.rotation || 0);
		}
		if (this.animate) {
			context.drawImage(this.image, 
				this.currentFrame * this.animate.slice.x, 0, this.animate.slice.x, this.animate.slice.y,
				0, 0, pos.width, pos.height);
		} else {
			context.drawImage(this.image, 0, 0, pos.width, pos.height);
		}
		context.restore();
	}
}
