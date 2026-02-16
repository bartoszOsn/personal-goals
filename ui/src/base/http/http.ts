import { HttpError } from '@/base/http/HttpError.ts';

export class http {
	private static token: string | null = null;

	static get<TResponse>(url: string, queryParams: Record<string, string> = {}): Promise<TResponse> {
		return this.request(this.getUrl(url, queryParams), { method: 'get' });
	}

	static post<TResponse, TBody>(url: string, body: TBody, queryParams: Record<string, string> = {}): Promise<TResponse> {
		return this.request(this.getUrl(url, queryParams), {
			method: 'post',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	static put<TResponse, TBody>(url: string, body: TBody, queryParams: Record<string, string> = {}): Promise<TResponse> {
		return this.request(this.getUrl(url, queryParams), {
			method: 'put',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	static delete<TResponse>(url: string, queryParams: Record<string, string> = {}): Promise<TResponse> {
		return this.request(this.getUrl(url, queryParams), { method: 'delete' });
	}

	static setAuthToken(token: string | null) {
		this.token = token;
	}

	private static async request<TResponse>(input: URL, init: RequestInit): Promise<TResponse> {
		let headers = init.headers ?? {};
		if (Array.isArray(headers)) {
			headers = Object.fromEntries(headers);
		}
		if (this.token) {
			// @ts-expect-error
			headers['Authorization'] = `Bearer ${this.token}`;
		}

		const response = await fetch(input, {
			...init,
			headers: headers
		});
		if (response.ok) {
			try {
				return await response.json();
			} catch {
				return null as TResponse;
			}
		}

		throw new HttpError<unknown>(response.status, await response.json());
	}

	private static getUrl(url: string, queryParams: Record<string, string>): URL {
		const result = new URL(location.protocol + location.host + url);
		result.search = new URLSearchParams(queryParams).toString();
		return result;
	}
}