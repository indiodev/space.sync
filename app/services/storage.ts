import {
	DeleteObjectCommand,
	PutObjectCommand,
	PutObjectCommandInput,
	S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StoragePresigned } from 'app/dtos/storage';
import { Env } from 'config/env';
import { S3_CLIENT_CONFIG } from 'config/storage';
import { randomUUID } from 'crypto';

const SIGNED_URL_EXPIRE_IN = 60 * 5; // 5 minutes

export class Storage {
	constructor(private storage = new S3Client(S3_CLIENT_CONFIG)) {}

	async presigned(
		opt: StoragePresigned,
	): Promise<{ path: string; url: string }> {
		const filename = randomUUID();
		const input: PutObjectCommandInput = {
			Key: `${filename}.${opt.extname}`,
			ContentType: opt['type'],
			ACL: 'public-read',
			Bucket: Env.STORAGE_BUCKET_NAME,
			Metadata: {
				'content-type': opt['type'],
			},
		};
		const command = new PutObjectCommand(input);
		const url = await getSignedUrl(this.storage, command, {
			expiresIn: SIGNED_URL_EXPIRE_IN,
		});

		const path = `https://${Env.STORAGE_BUCKET_NAME}.s3.sa-east-1.amazonaws.com/${filename}.${opt.extname}`;

		return { path, url };
	}

	async remove(path: string): Promise<void> {
		const command = new DeleteObjectCommand({
			Bucket: Env.STORAGE_BUCKET_NAME,
			Key: path,
		});
		await this.storage.send(command);
	}
}

export default new Storage();
