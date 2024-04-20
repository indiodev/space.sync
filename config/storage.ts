import { S3ClientConfig } from '@aws-sdk/client-s3';

import { Env } from './env';

export const S3_CLIENT_CONFIG: S3ClientConfig = {
	credentials: {
		accessKeyId: Env.STORAGE_ACCESS_KEY_ID,
		secretAccessKey: Env.STORAGE_SECRET_ACCESS_KEY,
	},
	region: Env.STORAGE_DEFAULT_REGION,
};
