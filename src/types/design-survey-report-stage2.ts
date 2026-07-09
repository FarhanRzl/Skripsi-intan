// ⚠️ BEST-EFFORT / BELUM TERVERIFIKASI ⚠️
// Beda dengan design-survey-report-stage1.ts (di-port dari file svelte asli
// yang jelas), file ini TIDAK punya sumber svelte/spec asli — file itu tidak
// pernah ikut dikirim ke saya sama sekali. Disusun dari sinyal yang memang
// SUDAH ADA di project ini:
//   - TAG_TYPES di $lib/constants/tag.ts: AREA_SUN_EXPOSURE, RAIN_GUTTER_NEED,
//     CHILDREN_PRESENCE, ANIMAL_PRESENCE, CARE_LEVEL, SPECIAL_AREA, GARDEN_THEME
//   - Tag dummy Tahap 2 yang sudah di-seed di data/mock/dummyData.js
//   - Atribut designSurveyReports di data/schema.js (careLevelId, specialAreaId,
//     gardenThemeId, surveyorNote, dst — walau schema.js ini sendiri kelihatan
//     dari model lama & tidak 100% konsisten dengan Tahap 1 yang sudah pasti)
//
// TIMPA/sesuaikan skema ini begitu file svelte asli Tahap 2
// (SurveyFormV2Stage2 dkk.) dikirim — terutama untuk memastikan field mana
// yang benar-benar wajib, dan apakah ada field lain yang belum tercakup.
import z from 'zod';
import { prepEmptyStrToNull } from './utils';

export const DesignSurveyReportStage2BaseObject = z.object({
	// Dipindah dari Tahap 1 (design-survey-report-stage1.ts) — sekarang jadi
	// pertanyaan opsional lewat "Tambah Isian Survey" (lihat stage2Questions.ts).
	gardenFacingDirectionId: z.string().nullable().optional().default(null),
	rainGutterNeedId: z.string('Kebutuhan Talang Air Wajib Diisi').min(1, 'Kebutuhan Talang Air Wajib Diisi'),
	childrenPresenceId: z.string('Info Keberadaan Anak-anak Wajib Diisi').min(1, 'Info Keberadaan Anak-anak Wajib Diisi'),
	animalPresenceId: z.string('Info Keberadaan Hewan Peliharaan Wajib Diisi').min(1, 'Info Keberadaan Hewan Peliharaan Wajib Diisi'),
	animalPresenceOtherText: prepEmptyStrToNull,
	careLevelId: z.string('Level Perawatan Wajib Diisi').min(1, 'Level Perawatan Wajib Diisi'),
	specialAreaId: z.string().nullable().optional().default(null),
	specialAreaOtherText: prepEmptyStrToNull,
	gardenThemeId: z.string().nullable().optional().default(null),
	surveyorNote: prepEmptyStrToNull
});

// Gate lokal Tahap 2 → siap submit. Field yang di-`pick` di sini adalah yang
// paling yakin wajib berdasarkan sinyal di atas; specialArea & gardenTheme
// sengaja TIDAK diwajibkan (bersifat preferensi klien, bukan temuan lapangan).
export const DesignSurveyReportStage2GateSchema = DesignSurveyReportStage2BaseObject.pick({
	rainGutterNeedId: true,
	childrenPresenceId: true,
	animalPresenceId: true,
	careLevelId: true
});

export type DesignSurveyReportStage2Input = z.input<typeof DesignSurveyReportStage2BaseObject>;