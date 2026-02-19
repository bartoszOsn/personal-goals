import type { PropertyStorage } from '@/base/property-storage/propertyStorage.ts';

export const localStoragePropertyStorage: PropertyStorage = {
	getItem: <T>(key: string) => {
		const itemStr = localStorage.getItem(key);
		if (itemStr === null) {
			return Promise.resolve(null);
		}
		const item: T = JSON.parse(itemStr);
		return Promise.resolve(item);
	},

	setItem: <T>(key: string, value: T) => {
		localStorage.setItem(key, JSON.stringify(value));
		return Promise.resolve();
	},

	removeItem: (key: string) => {
		localStorage.removeItem(key);
		return Promise.resolve();
	},

	clear: () => {
		localStorage.clear();
		return Promise.resolve();
	}
}