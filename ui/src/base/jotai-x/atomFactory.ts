import { Atom } from 'jotai';

export function atomFactory<TFactory extends (...args: unknown[]) => Record<string, Atom<unknown>>>(factoryFn: TFactory): TFactory {
	let memo: ReturnType<TFactory> | undefined = undefined;

	return ((...args: Parameters<TFactory>) => {
		if (!memo) {
			memo = factoryFn(...args) as ReturnType<TFactory>;
		}

		return memo;
	}) as unknown as TFactory;
}