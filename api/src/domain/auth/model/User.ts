export class User {
	constructor(
		public readonly id: UserId,
		public readonly email: string,
		public readonly passwordHash: string
	) {}
}

export class UserId {
	constructor(public readonly id: string) {}
}
