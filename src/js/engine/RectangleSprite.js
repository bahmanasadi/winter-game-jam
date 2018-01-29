import Sprite from './Sprite';

export default class RectangleSprite extends Sprite {
	render(context, pos) {
		context.fillStyle = this.fill;
		context.fillRect(pos.x, pos.y, pos.width, pos.height);
	}
}
