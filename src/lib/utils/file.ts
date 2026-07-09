// Padanan `$lib/utils/file.ts` (project Svelte) — dipakai FormPhotoArea untuk
// memastikan file yang diupload memang gambar sebelum dikirim ke server.
import { ALLOWED_IMAGE_EXTS, ALLOWED_IMAGE_MIMES } from '$lib/constants/file';

export function isValidImage(file: File): boolean {
	if (ALLOWED_IMAGE_MIMES.includes(file.type)) return true;
	const lower = file.name.toLowerCase();
	return ALLOWED_IMAGE_EXTS.some((ext) => lower.endsWith(ext));
}
