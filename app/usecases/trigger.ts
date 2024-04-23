import { CreateTrigger, FindTrigger, UpdateTrigger } from 'app/dtos/trigger';
import { TriggerRepository } from 'app/repositories/trigger';

export class TriggerUseCase {
	constructor(private repository: TriggerRepository) {}
	async create(payload: CreateTrigger) {
		return this.repository.create(payload);
	}

	async findBy(payload: FindTrigger) {
		return this.repository.findBy(payload);
	}

	async update(payload: UpdateTrigger) {
		const trigger = await this.repository.findBy({ id: payload.id });

		if (!trigger) throw new Error('Trigger not found');

		return this.repository.update(payload);
	}

	async list() {
		return this.repository.list();
	}
}
