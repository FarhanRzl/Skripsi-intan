// STUB SEMENTARA — akan dilengkapi penuh di Fase 2 (login flow, dsb).
// Untuk sekarang cukup buat fetch-client.ts & Orbit remote.ts bisa jalan,
// termasuk di mode mock (token tidak benar-benar dipakai kalau USE_MOCK_DATA=true).

const TOKEN_STORAGE_KEY = 'token';

export function getToken(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken(): void {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(TOKEN_STORAGE_KEY);
}

// TODO Fase 2: ambil dari data user yang login, bukan hardcode
export function getUserTimezone(): string {
	return 'Asia/Jakarta';
}
