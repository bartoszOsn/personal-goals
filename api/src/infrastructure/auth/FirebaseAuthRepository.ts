import { Injectable } from '@nestjs/common';
import { cert, initializeApp } from 'firebase-admin/app';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { resolve } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class FirebaseAuthRepository {
	private readonly certPath = resolve(
		__dirname,
		'../../../firebase-credentials.json'
	);
	private readonly app = initializeApp({ credential: cert(this.certPath) });
	private readonly auth = getAuth(this.app);

	constructor() {
		// Validate that file at certPath exists
		if (!existsSync(this.certPath)) {
			throw new Error('No certificate found');
		}
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
