export const randEl = items => items[Math.floor(Math.random() * items.length)];

export const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randomFloat = (min, max) => Math.random() * (max - min) + min;

export const detectCollision = function (entitya, entities)   {
	var ax1 = entitya.position.x - entitya.size.x / 2,
		ax2 = ax1 + entitya.size.x,
		ay1 = entitya.position.y - entitya.size.y / 2,
		ay2 = ay1 + entitya.size.y;

	return entities.find(entityb => {
		if (entitya === entityb) { return; }

		var bx1 = entityb.position.x - entityb.size.x / 2,
			bx2 = bx1 + entityb.size.x,
			by1 = entityb.position.y - entityb.size.y / 2,
			by2 = by1 + entityb.size.y,
			horizCollision = ax2 > bx1 && ax1 < bx2,
			vertCollection = ay2 > by1 && ay1 < by2;

		if (horizCollision && vertCollection) {
			return entityb;
		}
	});
};

export const detectJumpingOver = function (entitya, entities)   {
	var ax1 = entitya.position.x - entitya.size.x / 2,
		ax2 = ax1 + entitya.size.x,
		ay1 = entitya.position.y - entitya.size.y / 2,
		ay2 = ay1 + entitya.size.y;

	return entities.find(entityb => {
		if (entitya === entityb) { return; }

		var bx1 = entityb.position.x, // bit of a hack to drop presents entityb.position.x - entityb.size.x / 2,
			bx2 = bx1 + entityb.size.x,
			by1 = entityb.position.y - entityb.size.y / 2,
			horizCollision = ax2 > bx1 && ax1 < bx2,
			over = ay2 > by1;

		if (horizCollision && over) {
			return entityb;
		}
	});
};

export default { randEl, detectCollision, detectJumpingOver, random, randomFloat };
