// Pesan alert "jawaban kosong" (wajib diisi) per pertanyaan survey.
//
// ⭐ KUSTOMISASI: cukup edit teks di REQUIRED_FIELD_MESSAGES di bawah. Key =
// nama field di SurveyFormData (sama dengan yang dipakai di atribut
// `data-field` tiap section). Field yang TIDAK terdaftar di sini otomatis
// memakai DEFAULT_REQUIRED_MESSAGE, jadi aman kalau ada field baru.
//
// Dipakai lewat helper requiredMessage(field) di komponen Form* &
// DatePickerField.

export const DEFAULT_REQUIRED_MESSAGE = 'Bagian ini wajib diisi. Silakan lengkapi.';

export const REQUIRED_FIELD_MESSAGES: Record<string, string> = {
	// ── Tahap 1 (wajib untuk submit) ──
	gardenName: 'Nama taman wajib diisi.',
	areaSize: 'Ukuran aktual taman wajib diisi.',
	areaSunExposureTimes: 'Waktu Pencahayaan Wajib Diisi',
	sunExposureObstructionId: 'Dinding Terhadap Pencahayaan Wajib Diisi',
	drainageId: 'Kondisi Drainase Wajib Diisi',
	waterSourceId: 'Sumber Air Wajib Diisi',
	electricitySourceId: 'Sumber Listrik Wajib Diisi',
	entranceAccessId: 'Akses Ke Rumah Wajib Diisi',
	gardenEntranceAccessId: 'Akses Masuk Taman Wajib Diisi',
	groundSurfaceConditionId: 'Kondisi Area Wajib Diisi',
	landPreparations: 'Kebutuhan Pengolahan Lahan, Minimal Pilih 1 Kondisi',
	soilMoistureId: 'Kelembapan Tanah Wajib Diisi',

	// ── Tahap 2 (info tambahan) ──
	// Catatan: gardenFacingDirectionId, specialAreaId, gardenThemeId,
	// fixedStructures, itemRequests, rainWaterFlowDirectionNote, dan
	// expectedGardenBuildDate SEKARANG WAJIB (lihat stage2Questions.ts +
	// DesignSurveyReportStage2GateSchema) — bukan lagi opsional.
	gardenFacingDirectionId: 'Arah Hadap Taman Wajib Diisi',
	rainGutterNeedId: 'Kebutuhan Talang Air Wajib Diisi',
	rainWaterFlowDirectionNote: 'Arah Aliran Air Hujan Wajib Diisi',
	childrenPresenceId: 'Keberadaan Anak Wajib Diisi',
	animalPresenceId: 'Keberadaan Hewan Wajib Diisi',
	careLevelId: 'Tingkat Perawatan Wajib Diisi',
	specialAreaId: 'Area Khusus Wajib Diisi',
	gardenThemeId: 'Tema Taman Wajib Diisi',
	fixedStructures: 'Infrastruktur Rumah yang Tidak Boleh Dipindahkan Wajib Diisi, atau Pilih "Tidak Ada"',
	itemRequests: 'Permintaan Tanaman Khusus Wajib Diisi',
	expectedGardenBuildDate: 'Tanggal Ekspektasi Build Wajib Diisi',

	// ── Dokumentasi (wajib di halaman Edit Form Survey / Lengkapi Survey) ──
	gardenEntranceAccessPhotos: 'Foto Akses Masuk Taman wajib diisi.',
	areaPhotoCloudStorageUrl: 'Foto Area wajib diisi (upload file atau isi link Drive).',
	plantPresences: 'Tanaman Eksisting wajib diisi (upload file atau isi link Drive).',
	sketchCloudStorageUrl: 'Sketch/Gambar wajib diisi (upload file atau isi link Drive).',

	// ── Lainnya ──
	surveyDate: 'Silakan pilih tanggal survey.'
};

/** Pesan alert "wajib diisi" untuk sebuah field; fallback ke DEFAULT. */
export function requiredMessage(field: string): string {
	return REQUIRED_FIELD_MESSAGES[field] ?? DEFAULT_REQUIRED_MESSAGE;
}