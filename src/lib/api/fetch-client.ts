import type { FetchClientOptions } from '$types/api-requests';
import type { SuccessResponse } from '$types/api-responses';
import { API_BASE_URL, USE_MOCK_DATA } from '../config';
import { getToken } from '../stores/auth';

const API_VERSION = 'v2';

/**
 * Mode mock: request tidak benar-benar dikirim ke backend.
 * Cukup log payload-nya ke console dan kembalikan response sukses dummy,
 * supaya alur UI (misal handleSubmit di form survey) tetap bisa dites
 * end-to-end tanpa backend nyata.
 *
 * TODO: kalau nanti mau simulasikan validasi backend juga (Opsi B yang
 * pernah dibahas), tambahkan pengecekan payload di sini sebelum resolve.
 */
async function mockFetch<T>(path: string, options: FetchClientOptions): Promise<SuccessResponse<T>> {
	// eslint-disable-next-line no-console
	console.info(`[mock fetch-client] ${options.method ?? 'GET'} ${path}`, {
		body: options.body ? safeParseBody(options.body) : undefined
	});

	// Delay kecil biar terasa seperti network call asli (opsional, bantu tes loading state)
	await new Promise((resolve) => setTimeout(resolve, 300));

	return { data: null as T, message: 'Mock success (VITE_USE_MOCK_DATA=true)' };
}

function safeParseBody(body: BodyInit) {
	if (typeof body !== 'string') return body;
	try {
		return JSON.parse(body);
	} catch {
		return body;
	}
}

export async function fetchClient<T>(
	path: string,
	options: FetchClientOptions = {}
): Promise<SuccessResponse<T>> {
	if (USE_MOCK_DATA) {
		return mockFetch<T>(path, options);
	}

	const { auth = true, ...restOptions } = options;
	const token = getToken();

	if (auth && token == null) {
		throw new Error('Empty token, unauthenticated');
	}

	const headers: HeadersInit = {
		// Default, tapi dihapus untuk file upload (lihat di bawah)
		'Content-Type': 'application/json',
		Accept: 'application/json',
		...(auth ? { Authorization: `Bearer ${token}` } : {}),
		...restOptions.headers
	};

	// Kalau body-nya FormData, biarkan browser yang set Content-Type
	// (penting supaya multipart boundary ke-set dengan benar).
	if (restOptions.body instanceof FormData) {
		delete (headers as Record<string, string>)['Content-Type'];
	}

	const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/${path}`, {
		...restOptions,
		headers
	});

	const json = await res.json();

	if (!res.ok) {
		const message =
			json?.message || json?.error?.detail || json?.errors?.[0]?.detail || 'Unknown error';
		throw new Error(message);
	}

	return json as SuccessResponse<T>;
}
