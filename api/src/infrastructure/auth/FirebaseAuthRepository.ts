import { Injectable } from '@nestjs/common';
import { cert, initializeApp } from 'firebase-admin/app';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

@Injectable()
export class FirebaseAuthRepository {
	private readonly certPath = resolve(
		__dirname,
		'../../../firebase-credentials.json'
	);
	private readonly envVar = 'FIRREBASE_CREDENTIALS';

	private readonly app;
	private readonly auth;

	constructor() {
		const certStr = process.env[this.envVar];
		if (!certStr) {
			throw new Error(`Environment variable ${this.envVar} not set`);
		}

		const certDec = decodeURIComponent(certStr);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const certJson: Record<string, string> = JSON.parse(certDec);
		writeFileSync(this.certPath, JSON.stringify(certJson, null, '\t'));
		this.app = initializeApp({ credential: cert(this.certPath) });
		this.auth = getAuth(this.app);
	}

	async getUserIdByToken(token: string): Promise<DecodedIdToken | null> {
		try {
			return this.auth.verifyIdToken(token);
		} catch {
			return null;
		}
	}

	async removeUser(id: string): Promise<void> {
		await this.auth.deleteUser(id);
	}
}
