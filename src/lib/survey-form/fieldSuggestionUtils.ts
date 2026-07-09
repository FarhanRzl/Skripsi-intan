// Helper dipakai oleh komponen Form* Tahap 1 untuk menentukan kapan chip
// <FieldSuggestion /> perlu ditampilkan: field di taman aktif masih kosong,
// tapi Taman 1 (firstGardenData) sudah punya jawaban untuk field yang sama.
import type { Tag } from './types';

// Nama taman sumber saran untuk ditampilkan di FieldSuggestion. Selalu
// Taman 1 (firstGardenData) di alur saat ini — fallback ke "Taman 1" kalau
// gardenName-nya sendiri belum diisi.
export function getSuggestionGardenName(firstGardenData: { gardenName?: string | null } | null | undefined): string {
	return firstGardenData?.gardenName?.trim() || 'Taman 1';
}

// Resolve id tag -> title, dipakai untuk field ber-tipe *Id (radio/tag)
// supaya FieldSuggestion menampilkan jawaban asli (mis. "Tidak Ada
// Dinding/Terbuka"), bukan id mentah.
export function getTagTitle(tags: Tag[], id: string | null | undefined): string {
	if (!id) return '';
	return tags.find((t) => t.id === id)?.title ?? '';
}

// Gabungan title tag untuk beberapa id sekaligus (mis. landPreparations).
export function getTagTitles(tags: Tag[], ids: (string | null | undefined)[]): string {
	return ids
		.map((id) => getTagTitle(tags, id))
		.filter(Boolean)
		.join(', ');
}

// Format daftar jam "HH.mm" jadi teks ringkas, mis. "07.00, 08.00, 09.00".
export function formatTimeList(times: string[] | null | undefined): string {
	return (times ?? []).join(', ');
}

export function isEmptyFieldValue(value: unknown): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === 'string') return value.trim() === '';
	if (Array.isArray(value)) return value.length === 0;
	return false;
}

// true kalau field ini layak disarankan: kosong di taman aktif, tapi ada
// isinya di Taman 1.
export function shouldSuggestField(currentValue: unknown, firstGardenValue: unknown): boolean {
	return isEmptyFieldValue(currentValue) && !isEmptyFieldValue(firstGardenValue);
}
