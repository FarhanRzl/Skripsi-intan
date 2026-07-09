// Di-port (trimmed ke lingkup Tahap 1 saja) dari src/types/design-survey-reports.ts
// (project Svelte) — `DesignSurveyReportSubmitBaseObject` & `DesignSurveyReportStage1GateSchema`.
//
// Field Tahap 2 (areaSunExposureId, rainGutterNeedId, childrenPresenceId, dst)
// sengaja tidak diikutkan di sini karena belum jadi scope Tahap 1.
import z from 'zod';
import { FileInputSchema } from './files';
import { prepEmptyStrToNull } from './utils';
import { LandPreparationInputSubmitSchema } from './design-survey-report-land-preparations';
import { FixedStructureInputSubmitSchema } from './design-survey-report-fixed-structures';

export const DesignSurveyReportStage1BaseObject = z.object({
	id: z.string().nullable().default(null),

	gardenName: z.string('Nama Taman Wajib Diisi').min(1, 'Nama Taman Wajib Diisi'),
	areaSize: z.string('Ukuran Aktual Taman Wajib Diisi').min(1, 'Ukuran Aktual Taman Wajib Diisi'),
	// Dipindah ke katalog Tahap 2 (stage2Questions.ts, key sama) lewat fitur
	// "Tambah Isian Survey" — jadi tidak lagi wajib di Tahap 1.
	gardenFacingDirectionId: z.string().nullable().optional().default(null),
	areaSunExposureTimes: z.preprocess(
		(val) => (Array.isArray(val) ? val : []),
		z
			.array(
				z
					.string()
					.regex(/^\d{2}\.\d{2}$/, 'Format waktu harus HH.mm')
					.transform((val) => {
						const [hour, minute] = val.split('.');
						return `${hour}:${minute}:00`;
					})
			)
			.min(1, 'Waktu Pencahayaan Wajib Diisi')
	),
	sunExposureObstructionId: z
		.string('Dinding Terhadap Pencahayaan Wajib Diisi')
		.min(1, 'Dinding Terhadap Pencahayaan Wajib Diisi'),

	drainageId: z.string('Kondisi Drainase Wajib Diisi').min(1, 'Kondisi Drainase Wajib Diisi'),

	waterSourceId: z.string('Sumber Air Wajib Diisi').min(1, 'Sumber Air Wajib Diisi'),
	waterSourceDistanceNote: prepEmptyStrToNull,
	electricitySourceId: z.string('Sumber Listrik Wajib Diisi').min(1, 'Sumber Listrik Wajib Diisi'),
	electricitySourceDistanceNote: prepEmptyStrToNull,
	entranceAccessId: z.string('Akses ke Rumah Wajib Diisi').min(1, 'Akses ke Rumah Wajib Diisi'),
	gardenEntranceAccessId: z
		.string('Akses Masuk Taman Wajib Diisi')
		.min(1, 'Akses Masuk Taman Wajib Diisi'),
	gardenEntranceAccessNote: prepEmptyStrToNull,
	gardenEntranceAccessPhotos: FileInputSchema.array().optional().default([]),
	groundSurfaceConditionId: z
		.string('Kondisi Area Wajib Diisi')
		.min(1, 'Kondisi Area Wajib Diisi'),
	landPreparations: z.preprocess(
		(val) => (Array.isArray(val) ? val : []),
		z
			.array(LandPreparationInputSubmitSchema)
			.min(1, 'Kebutuhan Pengolahan Lahan, Minimal Pilih 1 Kondisi')
	),
	soilMoistureId: z.string('Kelembapan Tanah Wajib Diisi').min(1, 'Kelembapan Tanah Wajib Diisi'),
	soilPlantingReadinessId: z.string().nullable().optional().default(null),
	soilPlantingReadinessNote: prepEmptyStrToNull,
	// Dibuat opsional (tidak lagi ada .min(1, ...)) — section infrastruktur
	// boleh dibiarkan kosong tanpa memblokir validasi Tahap 1.
	fixedStructures: z.preprocess(
		(val) => (Array.isArray(val) ? val : []),
		z.array(FixedStructureInputSubmitSchema)
	)
});

// ─────────────────────────────────────────────────────────────
// Gate Tahap 1 → Tahap 2 — validasi LOKAL saja (tanpa panggil API).
// Persis field yang dipakai di 10 komponen survey-form Tahap 1:
// GardenNameForm, GardenAreaForm, FormOrientation, FormDrainage,
// FormWaterElectricity, FormAccess, FormAreaCondition,
// FormLandPreparation, FormSoilCondition, FormInfrastructure.
//
// Catatan: distance notes (waterSourceDistanceNote,
// electricitySourceDistanceNote, gardenEntranceAccessNote) sengaja TIDAK
// diwajibkan di sini, mengikuti logika progress Tahap 1 yang sudah berjalan
// di project Svelte.
// ─────────────────────────────────────────────────────────────
export const DesignSurveyReportStage1GateSchema = DesignSurveyReportStage1BaseObject.pick({
	gardenName: true,
	areaSize: true,
	gardenFacingDirectionId: true,
	areaSunExposureTimes: true,
	sunExposureObstructionId: true,
	drainageId: true,
	waterSourceId: true,
	electricitySourceId: true,
	entranceAccessId: true,
	gardenEntranceAccessId: true,
	groundSurfaceConditionId: true,
	landPreparations: true,
	soilMoistureId: true,
	fixedStructures: true
});

export type DesignSurveyReportStage1Input = z.input<typeof DesignSurveyReportStage1BaseObject>;