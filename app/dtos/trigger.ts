import { Schema } from 'app/schemas';
import { z } from 'zod';

export type CreateTrigger = z.infer<typeof Schema.Trigger>;
