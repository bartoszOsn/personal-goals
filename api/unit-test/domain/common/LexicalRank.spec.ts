import { LexicalRank } from '../../../src/domain/common/model/LexicalRank';

describe('LexicalRank', () => {
	describe('constructor and validation', () => {
		it('should create a rank from valid string', () => {
			const rank = LexicalRank.fromString('m');
			expect(rank.asString()).toBe('m');
		});

		it('should throw error for empty string', () => {
			expect(() => LexicalRank.fromString('')).toThrow(
				'Rank cannot be empty'
			);
		});
	});

	describe('single()', () => {
		it('should create a single rank with middle character', () => {
			const rank = LexicalRank.single();
			expect(rank.asString()).toBe('n');
		});

		it('should create consistent single ranks', () => {
			const rank1 = LexicalRank.single();
			const rank2 = LexicalRank.single();
			expect(rank1.asString()).toBe(rank2.asString());
		});
	});

	describe('afterAll()', () => {
		it('should create rank after a single rank', () => {
			const existing = LexicalRank.fromString('m');
			const after = LexicalRank.afterAll([existing]);
			expect(after.asString().localeCompare(existing.asString())).toBe(1);
		});

		it('should create rank after multiple ranks', () => {
			const ranks = [
				LexicalRank.fromString('a'),
				LexicalRank.fromString('m'),
				LexicalRank.fromString('x')
			];
			const after = LexicalRank.afterAll(ranks);
			expect(after.asString().localeCompare('x')).toBe(1);
		});

		it('should create rank after unsorted ranks', () => {
			const ranks = [
				LexicalRank.fromString('x'),
				LexicalRank.fromString('a'),
				LexicalRank.fromString('m')
			];
			const after = LexicalRank.afterAll(ranks);
			expect(after.asString().localeCompare('x')).toBe(1);
		});

		it('should create rank after rank near end of alphabet', () => {
			const existing = LexicalRank.fromString('y');
			const after = LexicalRank.afterAll([existing]);
			expect(after.asString().localeCompare('y')).toBe(1);
		});

		it('should create rank after multi-character rank', () => {
			const existing = LexicalRank.fromString('nt');
			const after = LexicalRank.afterAll([existing]);
			expect(after.asString().localeCompare('nt')).toBe(1);
		});
	});

	describe('beforeAll()', () => {
		it('should create rank before a single rank', () => {
			const existing = LexicalRank.fromString('m');
			const before = LexicalRank.beforeAll([existing]);
			expect(before.asString().localeCompare(existing.asString())).toBe(
				-1
			);
		});

		it('should create rank before multiple ranks', () => {
			const ranks = [
				LexicalRank.fromString('b'),
				LexicalRank.fromString('m'),
				LexicalRank.fromString('x')
			];
			const before = LexicalRank.beforeAll(ranks);
			expect(before.asString().localeCompare('b')).toBe(-1);
		});

		it('should create rank before unsorted ranks', () => {
			const ranks = [
				LexicalRank.fromString('x'),
				LexicalRank.fromString('b'),
				LexicalRank.fromString('m')
			];
			const before = LexicalRank.beforeAll(ranks);
			expect(before.asString().localeCompare('b')).toBe(-1);
		});

		it('should create rank before rank near start of alphabet', () => {
			const existing = LexicalRank.fromString('b');
			const before = LexicalRank.beforeAll([existing]);
			expect(before.asString().localeCompare('b')).toBe(-1);
		});
	});

	describe('between()', () => {
		it('should create rank between two ranks with gap', () => {
			const a = LexicalRank.fromString('a');
			const z = LexicalRank.fromString('z');
			const between = LexicalRank.between(a, z);

			expect(between.asString().localeCompare(a.asString())).toBe(1);
			expect(between.asString().localeCompare(z.asString())).toBe(-1);
		});

		it('should create rank between adjacent single-character ranks', () => {
			const a = LexicalRank.fromString('d');
			const b = LexicalRank.fromString('e');
			const between = LexicalRank.between(a, b);

			expect(between.asString().localeCompare(a.asString())).toBe(1);
			expect(between.asString().localeCompare(b.asString())).toBe(-1);
			expect(between.asString().length).toBeGreaterThan(1);
		});

		it('should create rank between ranks with same prefix', () => {
			const a = LexicalRank.fromString('aa');
			const ab = LexicalRank.fromString('ab');
			const between = LexicalRank.between(a, ab);

			expect(between.asString().localeCompare(a.asString())).toBe(1);
			expect(between.asString().localeCompare(ab.asString())).toBe(-1);
		});

		it('should create rank between multi-character ranks', () => {
			const a = LexicalRank.fromString('abc');
			const b = LexicalRank.fromString('xyz');
			const between = LexicalRank.between(a, b);

			expect(between.asString().localeCompare(a.asString())).toBe(1);
			expect(between.asString().localeCompare(b.asString())).toBe(-1);
		});

		it('should handle different length ranks', () => {
			const short = LexicalRank.fromString('b');
			const long = LexicalRank.fromString('bbb');
			const between = LexicalRank.between(short, long);

			expect(between.asString().localeCompare(short.asString())).toBe(1);
			expect(between.asString().localeCompare(long.asString())).toBe(-1);
		});

		it('should work in reverse order', () => {
			const a = LexicalRank.fromString('a');
			const z = LexicalRank.fromString('z');
			const between = LexicalRank.between(z, a);

			expect(between.asString().localeCompare(a.asString())).toBe(1);
			expect(between.asString().localeCompare(z.asString())).toBe(-1);
		});
	});

	describe('sortRanks()', () => {
		it('should sort ranks in lexicographical order', () => {
			const ranks = [
				LexicalRank.fromString('z'),
				LexicalRank.fromString('a'),
				LexicalRank.fromString('m')
			];
			const sorted = LexicalRank.sortRanks(ranks);

			expect(sorted[0]?.asString()).toBe('a');
			expect(sorted[1]?.asString()).toBe('m');
			expect(sorted[2]?.asString()).toBe('z');
		});

		it('should handle multi-character ranks', () => {
			const ranks = [
				LexicalRank.fromString('ab'),
				LexicalRank.fromString('aa'),
				LexicalRank.fromString('b')
			];
			const sorted = LexicalRank.sortRanks(ranks);

			expect(sorted[0]?.asString()).toBe('aa');
			expect(sorted[1]?.asString()).toBe('ab');
			expect(sorted[2]?.asString()).toBe('b');
		});

		it('should not modify original array', () => {
			const ranks = [
				LexicalRank.fromString('z'),
				LexicalRank.fromString('a')
			];
			const originalOrder = ranks.map((r) => r.asString());
			LexicalRank.sortRanks(ranks);

			expect(ranks.map((r) => r.asString())).toEqual(originalOrder);
		});
	});

	describe('integration scenarios', () => {
		it('should maintain order when creating multiple ranks', () => {
			const first = LexicalRank.single();
			const second = LexicalRank.afterAll([first]);
			const third = LexicalRank.afterAll([first, second]);

			expect(first.asString().localeCompare(second.asString())).toBe(-1);
			expect(second.asString().localeCompare(third.asString())).toBe(-1);
		});

		it('should insert rank in the middle of existing ranks', () => {
			const a = LexicalRank.fromString('a');
			const z = LexicalRank.fromString('z');
			const middle = LexicalRank.between(a, z);

			const sorted = LexicalRank.sortRanks([a, z, middle]);
			expect(sorted[1]).toBe(middle);
		});

		it('should handle repeated insertions before', () => {
			const initial = LexicalRank.single();
			const before1 = LexicalRank.beforeAll([initial]);
			const before2 = LexicalRank.beforeAll([initial, before1]);
			const before3 = LexicalRank.beforeAll([initial, before1, before2]);

			const sorted = LexicalRank.sortRanks([
				initial,
				before1,
				before2,
				before3
			]);
			expect(sorted[0]).toBe(before3);
			expect(sorted[1]).toBe(before2);
			expect(sorted[2]).toBe(before1);
			expect(sorted[3]).toBe(initial);
		});

		it('should handle repeated insertions after', () => {
			const initial = LexicalRank.single();
			const after1 = LexicalRank.afterAll([initial]);
			const after2 = LexicalRank.afterAll([initial, after1]);
			const after3 = LexicalRank.afterAll([initial, after1, after2]);

			const sorted = LexicalRank.sortRanks([
				initial,
				after1,
				after2,
				after3
			]);
			expect(sorted[0]).toBe(initial);
			expect(sorted[1]).toBe(after1);
			expect(sorted[2]).toBe(after2);
			expect(sorted[3]).toBe(after3);
		});

		it('should handle complex reordering scenario', () => {
			const ranks = [
				LexicalRank.fromString('a'),
				LexicalRank.fromString('d'),
				LexicalRank.fromString('g')
			] as const;

			// Insert between a and d
			const betweenAD = LexicalRank.between(ranks[0], ranks[1]);
			// Insert between d and g
			const betweenDG = LexicalRank.between(ranks[1], ranks[2]);

			const allRanks = [...ranks, betweenAD, betweenDG];
			const sorted = LexicalRank.sortRanks(allRanks);

			expect(sorted.length).toBe(5);
			expect(sorted[0]?.asString()).toBe('a');
			expect(sorted[1]).toBe(betweenAD);
			expect(sorted[2]?.asString()).toBe('d');
			expect(sorted[3]).toBe(betweenDG);
			expect(sorted[4]?.asString()).toBe('g');
		});
	});
});
