import { Trigger } from 'app/entities/trigger';
import { Schema } from 'app/schemas';
import { z } from 'zod';

export type CreateTrigger = z.infer<typeof Schema.Trigger.Create>;

export type UpdateTrigger = z.infer<typeof Schema.Trigger.Update>;

export type FindTrigger = Partial<
	Omit<Trigger, 'images' | 'groups'> & { op: 'AND' | 'OR' }
>;
