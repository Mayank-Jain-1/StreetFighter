export class EntityList {
	entities = [];

	addEntity = (EntityClass, ...args) => {
		this.entities.push(new EntityClass(...args, this));
	};

	// Either use arrow function as i keeps the 'this' reference of parent always and doesnt have own 'this'
	// Or use normal function and use this.removeEntity.bind(this)

	removeEntity = (entity) => {
		this.entities = this.entities.filter((thisEntity) => thisEntity !== entity);
	};

	update = (time, camera) => {
		for (const entity of this.entities) {
			entity.update(time, camera);
		}
	};

	draw = (context, camera) => {
		this.entities.map((entity) => entity.draw(context, camera));
	};
}
