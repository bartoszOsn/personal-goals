export class User {
	constructor(
		public readonly id: UserId,
		public readonly displayName: string | null,
		public readonly email: string | null,
		public readonly picture: string | null
	) {}
}

export class UserId {
	constructor(public readonly id: string) {}
}
