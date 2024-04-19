import { TriggerRepository } from 'app/repositories/trigger';
import { TriggerUseCase } from 'app/usecases/trigger';
import { Connection } from 'config/database';

export function TriggerFactory(): TriggerUseCase {
	const repository = new TriggerRepository(Connection);
	return new TriggerUseCase(repository);
}
