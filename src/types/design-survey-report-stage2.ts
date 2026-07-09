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
import { FixedStructureInputSubmitSchema } from './design-survey-report-fixed-structures';

export const DesignSurveyReportStage2BaseObject = z.object({
	// Dulu opsional (dipindah dari Tahap 1) — sekarang diwajibkan kembali
	// mengikuti stage2Questions.ts (required: true untuk key yang sama).
	gardenFacingDirectionId: z.string('Arah Hadap Taman Wajib Diisi').min(1, 'Arah Hadap Taman Wajib Diisi'),
	rainGutterNeedId: z.string('Kebutuhan Talang Air Wajib Diisi').min(1, 'Kebutuhan Talang Air Wajib Diisi'),
	// "Arah Aliran Air Hujan" — field teks bebas, lihat AdditionalInfoQuestion.tsx.
	rainWaterFlowDirectionNote: z
		.string('Arah Aliran Air Hujan Wajib Diisi')
		.min(1, 'Arah Aliran Air Hujan Wajib Diisi'),
	childrenPresenceId: z.string('Info Keberadaan Anak-anak Wajib Diisi').min(1, 'Info Keberadaan Anak-anak Wajib Diisi'),
	animalPresenceId: z.string('Info Keberadaan Hewan Peliharaan Wajib Diisi').min(1, 'Info Keberadaan Hewan Peliharaan Wajib Diisi'),
	animalPresenceOtherText: prepEmptyStrToNull,
	careLevelId: z.string('Level Perawatan Wajib Diisi').min(1, 'Level Perawatan Wajib Diisi'),
	specialAreaId: z.string('Area Khusus Wajib Diisi').min(1, 'Area Khusus Wajib Diisi'),
	specialAreaOtherText: prepEmptyStrToNull,
	gardenThemeId: z.string('Tema Taman Wajib Diisi').min(1, 'Tema Taman Wajib Diisi'),
	// "Infrastruktur Rumah yang Tidak Boleh Dipindahkan" — minimal 1 entri
	// (termasuk kalau user pilih tag "Tidak Ada").
	fixedStructures: z.preprocess(
		(val) => (Array.isArray(val) ? val : []),
		z
			.array(FixedStructureInputSubmitSchema)
			.min(1, 'Infrastruktur Rumah yang Tidak Boleh Dipindahkan Wajib Diisi')
	),
	// "Permintaan Tanaman Khusus" — disimpan di surveyData.itemRequests
	// (lihat PlantRequestForm.tsx), bukan `plantRequests` — nama field
	// skema di sini SENGAJA disamakan dgn nama datanya (`itemRequests`)
	// supaya `data-field` di komponen & path issue Zod cocok persis.
	itemRequests: z.preprocess(
		(val) => (Array.isArray(val) ? val : []),
		z.array(z.any()).min(1, 'Permintaan Tanaman Khusus Wajib Diisi')
	),
	// "Tanggal Ekspektasi Build" — date picker per-taman (surveyData.expectedGardenBuildDate).
	expectedGardenBuildDate: z
		.string('Tanggal Ekspektasi Build Wajib Diisi')
		.min(1, 'Tanggal Ekspektasi Build Wajib Diisi'),
	surveyorNote: prepEmptyStrToNull
});

// Gate lokal Tahap 2 → siap submit. Diperluas supaya 7 field yang tadinya
// tidak ikut dicek (gardenFacingDirectionId, specialAreaId, gardenThemeId,
// fixedStructures, itemRequests/plantRequests, rainWaterFlowDirectionNote,
// expectedGardenBuildDate) sekarang ikut memicu Alert + auto-scroll di
// SurveyFormPage.tsx (firstEmptyStage2Field / firstEmptyFullField), sama
// seperti field Tahap 2 lain yang sudah wajib sebelumnya.
export const DesignSurveyReportStage2GateSchema = DesignSurveyReportStage2BaseObject.pick({
	gardenFacingDirectionId: true,
	rainGutterNeedId: true,
	rainWaterFlowDirectionNote: true,
	childrenPresenceId: true,
	animalPresenceId: true,
	careLevelId: true,
	specialAreaId: true,
	gardenThemeId: true,
	fixedStructures: true,
	itemRequests: true,
	expectedGardenBuildDate: true
});

export type DesignSurveyReportStage2Input = z.input<typeof DesignSurveyReportStage2BaseObject>;