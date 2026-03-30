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
	'z',
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z'
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
		const last = sorted.at(-1)!;

		return new LexicalRank(this.betweenRankRaw(last.rank, LAST_RANK));
	}

	static beforeAll(ranks: LexicalRank[]): LexicalRank {
		const sorted = this.sortRanks(ranks);
		const first = sorted.at(0)!;

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
		const resultRank: Character[] = [];

		const commonLength = Math.min(a.length, b.length);

		for (let i = 0; i < commonLength; i++) {
			if (a[i] === b[i]) {
				resultRank.push(a[i]!);
			} else {
				const aIndex = CHAR_SET.indexOf(a[i]!);
				const bIndex = CHAR_SET.indexOf(b[i]!);
				const availableCharsToEnd = CHAR_SET.slice(
					Math.min(aIndex, bIndex) + 1,
					Math.max(aIndex, bIndex) - 1
				);

				if (availableCharsToEnd.length === 0) {
					return [...resultRank, a[i]!, MIDDLE_CHAR];
				}

				return [
					...resultRank,
					availableCharsToEnd.at(
						Math.floor(availableCharsToEnd.length / 2)
					)!
				];
			}
		}

		const aLastImportant: Character | undefined = a.at(commonLength);
		const bLastImportant: Character | undefined = b.at(commonLength);

		if (aLastImportant === undefined) {
			const availableCharsToEnd = CHAR_SET.slice(
				0,
				CHAR_SET.indexOf(bLastImportant!) - 1
			);
			return [
				...resultRank,
				availableCharsToEnd.at(
					Math.floor(availableCharsToEnd.length / 2)
				) ?? MIDDLE_CHAR
			];
		}

		const availableCharsToEnd = CHAR_SET.slice(
			CHAR_SET.indexOf(bLastImportant!) + 1
		);
		return [
			...resultRank,
			availableCharsToEnd.at(
				Math.floor(availableCharsToEnd.length / 2)
			) ?? MIDDLE_CHAR
		];
	}

	private static assertIsLexicalRank(
		rank: string[]
	): asserts rank is Character[] {
		if (rank.some((char) => !CHAR_SET.includes(char as Character))) {
			throw new Error('Invalid rank string');
		}
	}
}
