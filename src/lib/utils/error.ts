// Padanan `$lib/utils/error.ts` (project Svelte) — dipakai FormInfrastructure,
// FormDocumentationUpload, FormSketchUpload, FormPhotoArea, FormUploadTanaman
// untuk menampilkan pesan error upload/validasi ke toast.
export function getErrorMessage(err: unknown): string {
	if (err instanceof Error) return err.message;
	if (typeof err === 'string') return err;
	if (err && typeof err === 'object' && 'message' in err) {
		const message = (err as { message?: unknown }).message;
		if (typeof message === 'string') return message;
	}
	return 'Terjadi kesalahan. Silakan coba lagi.';
}
