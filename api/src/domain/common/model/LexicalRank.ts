const CHAR_SET_UNORDERED = [
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z'
] as const;
const CHAR_SET = [...CHAR_SET_UNORDERED].sort((a, b) => a.localeCompare(b));

const FIRST_CHAR = CHAR_SET.at(0)!;
const MIDDLE_CHAR = CHAR_SET.at(Math.floor(CHAR_SET.length / 2))!;
const LAST_CHAR = CHAR_SET.at(-1)!;

const FIRST_RANK = [FIRST_CHAR];
const LAST_RANK = [LAST_CHAR];

type Character = (typeof CHAR_SET)[number];

export class LexicalRank {
	private constructor(private readonly rank: Character[]) {
		if (rank.length === 0) {
			throw new Error('Rank cannot be empty');
		}

		if (rank.length === 0 && rank.at(0) === FIRST_CHAR) {
			throw new Error(
				`Rank cannot be "${FIRST_CHAR}" because nothing could be before it`
			);
		}
	}

	asString(): string {
		return this.rank.join('');
	}

	static fromString(rank: string): LexicalRank {
		const arr = rank.split('');
		this.assertIsLexicalRank(arr);

		return new LexicalRank(arr);
	}

	static single(): LexicalRank {
		return new LexicalRank([MIDDLE_CHAR]);
	}

	static afterAll(ranks: LexicalRank[]): LexicalRank {
		const sorted = this.sortRanks(ranks);
		const last = sorted.at(-1);

		if (!last) {
			return this.single();
		}

		return new LexicalRank(this.betweenRankRaw(last.rank, LAST_RANK));
	}

	static beforeAll(ranks: LexicalRank[]): LexicalRank {
		const sorted = this.sortRanks(ranks);
		const first = sorted.at(0);

		if (!first) {
			return this.single();
		}

		return new LexicalRank(this.betweenRankRaw(FIRST_RANK, first.rank));
	}

	static between(a: LexicalRank, b: LexicalRank): LexicalRank {
		return new LexicalRank(this.betweenRankRaw(a.rank, b.rank));
	}

	static sortRanks(ranks: LexicalRank[]): LexicalRank[] {
		return [...ranks].sort((a, b) =>
			a.asString().localeCompare(b.asString())
		);
	}

	static compare(a: unknown, b: unknown): number {
		if (!(a instanceof LexicalRank) && !(b instanceof LexicalRank)) {
			return 0;
		}

		if (!(a instanceof LexicalRank)) {
			return 1;
		}

		if (!(b instanceof LexicalRank)) {
			return -1;
		}

		return a.asString().localeCompare(b.asString());
	}

	private static betweenRankRaw(a: Character[], b: Character[]): Character[] {
		// Ensure a < b for easier processing
		if (a.join('').localeCompare(b.join('')) > 0) {
			[a, b] = [b, a];
		}

		// Find the first position where they differ
		const maxLength = Math.max(a.length, b.length);
		let result: Character[] = [];

		for (let i = 0; i < maxLength; i++) {
			const charA = a[i] ?? FIRST_CHAR;
			const charB = b[i] ?? LAST_CHAR;

			const indexA = CHAR_SET.indexOf(charA);
			const indexB = CHAR_SET.indexOf(charB);

			if (indexA === indexB) {
				// Same character, keep it and continue
				result.push(charA);
			} else if (indexB - indexA > 1) {
				// There's a gap, we can insert a character between them
				const middleIndex = Math.floor((indexA + indexB) / 2);
				result.push(CHAR_SET[middleIndex]!);
				break;
			} else {
				// Adjacent characters (indexB - indexA === 1)
				// Keep the lower character and append something after
				result.push(charA);

				// If 'a' has more characters, find midpoint after this position
				if (i + 1 < a.length) {
					const restA = a.slice(i + 1);
					const restB: Character[] = b[i + 1]
						? b.slice(i + 1)
						: [LAST_CHAR];
					result = result.concat(this.betweenRankRaw(restA, restB));
				} else {
					// Append a middle character to make it between a and b
					result.push(MIDDLE_CHAR);
				}
				break;
			}
		}

		return result;
	}

	private static assertIsLexicalRank(
		rank: string[]
	): asserts rank is Character[] {
		if (rank.some((char) => !CHAR_SET.includes(char as Character))) {
			throw new Error('Invalid rank string');
		}
	}
}
