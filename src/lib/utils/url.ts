// Padanan `$lib/utils/url.ts` (project Svelte) — dipakai FormDocumentationUpload
// & FormUploadTanaman untuk validasi input "Link Drive".
export function isValidUrl(value: string | null | undefined): boolean {
	if (!value) return false;
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
}
