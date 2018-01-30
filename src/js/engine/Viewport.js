export default class Viewport {
	constructor(attributes) {
		Object.assign(this, attributes);
		this.layers = {};
		this.pause = false;
		this.gameover = false;
	}
	render(time, context) {
		let layers = Object.values(this.layers),
			l = layers.length,
			i, layer;
		for (i = 0; i < l; i++) {
			layer = layers[i];
			layer.pause = this.pause;
			layer.gameover = this.gameover;
			layer.render(time, context); 
		}
	}
	click() {}
}
