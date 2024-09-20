import { get } from "lodash-es"

export function getStorage<T = any>(
	key: string,
	path?: string,
	defaultValue?: any
): T | null {
	let data: T | null
	try {
		data = JSON.parse(localStorage.getItem(key)!)
		if (path) {
			data = get(data, path, defaultValue)
		}
		data = data === undefined ? defaultValue : data
	} catch {
		data = null
	}
	return data
}

export function setStorage(key: string, value: any): void {
	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch {}
}

export function removeStorage(key: string | string[]): void {
	if (typeof key === "string") {
		return localStorage.removeItem(key)
	} else if (Array.isArray(key)) {
		for (let i = 0; i < key.length; i++) {
			localStorage.removeItem(key[i])
		}
	}
}
