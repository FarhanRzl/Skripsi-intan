import { baseRemote, setToken } from './remote.js';
import { API_BASE_URL, USE_MOCK_DATA } from '$lib/config';

export interface UserAttributes {
	name?: string;
	email?: string;
	phone?: string;
	telegram?: string;
	address?: string;
	photo?: string;
	roleId?: number | null;
}

/**
 * Padanan `updateUser` di stores.js (Svelte lama). Di mode mock, tidak ada
 * request ke backend sama sekali — attribute yang dikirim langsung dianggap
 * berhasil disimpan (dipakai EditProfilePage untuk update localStorage).
 */
export async function updateUserProfile(
	token: string,
	userId: string,
	attributes: UserAttributes
): Promise<UserAttributes> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return attributes;
	}

	setToken(token, 'base');
	const response = await baseRemote.update((t: any) =>
		t.updateRecord({
			type: 'users',
			keys: { remoteId: userId.toString() },
			attributes
		})
	);

	return (response as any)?.attributes ?? attributes;
}

/**
 * Upload foto profil. Endpoint ini pakai versi API lama (v1, bukan lewat
 * fetchClient v2) — sama seperti project Svelte asli. Di mode mock,
 * langsung kembalikan object URL lokal (cukup untuk preview/dev).
 */
export async function uploadProfilePhoto(token: string, file: File): Promise<string> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return URL.createObjectURL(file);
	}

	const formData = new FormData();
	formData.append('type', 'profile_picture');
	formData.append('file', file);
	formData.append('schema', 'users');

	const response = await fetch(`${API_BASE_URL}/api/v1/file/images/upload`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: formData
	});

	if (!response.ok) throw new Error('Gagal upload foto');

	const json = await response.json();
	return json.data.attributes.url;
}