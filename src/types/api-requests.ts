// TODO: lengkapi/sesuaikan kalau ada field lain yang dipakai di api/*.ts project Svelte
export interface FetchClientOptions extends Omit<RequestInit, 'headers'> {
	auth?: boolean;
	headers?: Record<string, string>;
}
