import { CreateTrigger } from 'app/dtos/trigger';
import { TriggerRepository } from 'app/repositories/trigger';

export class TriggerUseCase {
	constructor(private repository: TriggerRepository) {}
	async create(payload: CreateTrigger) {
		return this.repository.create(payload);
	}
}
