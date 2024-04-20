import { Schema } from 'app/schemas';
import { z } from 'zod';

export type StoragePresigned = z.infer<typeof Schema.Storage.Presigned>;
export type StorageRemove = z.infer<typeof Schema.Storage.Remove>;
