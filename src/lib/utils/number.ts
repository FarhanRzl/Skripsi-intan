// Padanan `$lib/utils/number.ts` (project Svelte) — dipakai FormUploadTanaman
// untuk membedakan opsi tanaman existing (value = id numerik) vs nama custom
// yang diketik manual oleh surveyor.
export function isNumericString(value: string | null | undefined): boolean {
	if (value === null || value === undefined || value === '') return false;
	return /^\d+$/.test(value);
}
