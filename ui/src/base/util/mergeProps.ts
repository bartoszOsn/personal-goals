export function mergeProps<T extends Record<string, any>>(a: T, b: T): T {
	const result: T = { ...a };
	for (const key in b) {
		if (!(key in a)) {
			result[key] = b[key];
			continue;
		}
		
		if (key === 'className') {
			result[key] = `${a[key]} ${b[key]}` as never;
			continue;
		}

		if (typeof a[key] === 'object' && typeof b[key] === 'object') {
			result[key] = mergeProps(a[key], b[key]);
			continue;
		}

		if (typeof a[key] === 'function' && typeof b[key] === 'function') {
			result[key] = ((...args: never[]) => {
				a[key](...args);
				return b[key](...args);
			}) as never;
		}

		result[key] = b[key];
	}

	return result;
}