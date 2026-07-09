// Padanan `$lib/utils/input.ts` (project Svelte) — dipakai FormUploadTanaman
// untuk membersihkan input angka volume tanaman (boleh desimal, satu titik saja).
export function sanitizeDecimalInput(value: string): string {
	let cleaned = value.replace(/[^0-9.]/g, '');
	const firstDot = cleaned.indexOf('.');
	if (firstDot !== -1) {
		cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
	}
	return cleaned;
}
