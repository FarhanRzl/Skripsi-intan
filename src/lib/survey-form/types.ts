// File ini sebelumnya di-import oleh SEMUA komponen di src/lib/survey-form/
// (GardenNameForm, GardenAreaForm, FormOrientation, FormDrainage, dst) lewat
// `import type { Stage1FormProps } from './types'` tapi filenya sendiri belum
// pernah dibuat — jadi build selalu patah di titik ini. Disusun dari field
// yang benar-benar dipakai di semua komponen tsb, konsisten dengan
// DesignSurveyReportStage1BaseObject ($types/design-survey-report-stage1.ts)
// & DesignSurveyReportStage2BaseObject ($types/design-survey-report-stage2.ts).
import type { Tag } from '$types/tags';
import type { NameableFile } from '$types/files';

export type { Tag };

export interface FixedStructureEntry {
	id: string | null;
	fixedStructureId: string;
	distanceFromGardenNote: string | null;
	otherName: string | null;
	structurePhotos: NameableFile[];
}

export interface LandPreparationEntry {
	id: string | null;
	landPreparationId: string;
	surveyorNote: string | null;
}

/** FormPhotoArea */
export interface AreaPhotoEntry {
	areaName: string | null;
	photoId: string | null;
	photo: NameableFile;
}

/** FormUploadTanaman */
export interface PlantPresenceEntry {
	itemName: string;
	photoId: string | null;
	plantId: string | null;
	customName?: string | null;
	volume: number;
	denom: string;
	photo: NameableFile;
}

/** PlantRequestForm */
export interface ItemRequestEntry {
	itemableId: string | null;
	itemableName: string | null;
	itemableType: string | null;
	notExistsNote: string | null;
}

/**
 * Bentuk data 1 laporan survey ("1 taman") yang sedang diedit di form —
 * gabungan field Tahap 1 & Tahap 2. Semua field sengaja dibuat optional
 * (kecuali yang memang selalu ada) karena form diisi bertahap.
 */
export interface SurveyFormData {
	id: string | null;

	// GardenNameForm / GardenAreaForm
	gardenName: string;
	areaSize: string;

	// FormOrientation
	gardenFacingDirectionId: string | null;
	areaSunExposureTimes: string[];
	sunExposureObstructionId: string | null;

	// FormDrainage
	drainageId: string | null;

	// FormWaterElectricity
	waterSourceId: string | null;
	waterSourceDistanceNote: string | null;
	electricitySourceId: string | null;
	electricitySourceDistanceNote: string | null;

	// FormAccess
	entranceAccessId: string | null;
	gardenEntranceAccessId: string | null;
	gardenEntranceAccessNote: string | null;
	gardenEntranceAccessPhotos: NameableFile[];

	// FormAreaCondition
	groundSurfaceConditionId: string | null;

	// FormLandPreparation
	landPreparations: LandPreparationEntry[];

	// FormSoilCondition
	soilMoistureId: string | null;
	soilPlantingReadinessId: string | null;
	soilPlantingReadinessNote: string | null;

	// FormInfrastructure
	fixedStructures: FixedStructureEntry[];

	// FormAdditionalInfo (Tahap 2 — best-effort, lihat design-survey-report-stage2.ts)
	rainGutterNeedId: string | null;
	childrenPresenceId: string | null;
	animalPresenceId: string | null;
	animalPresenceOtherText: string | null;
	careLevelId: string | null;
	specialAreaId: string | null;
	specialAreaOtherText: string | null;
	gardenThemeId: string | null;
	surveyorNote: string | null;

	// ─────────────────────────────────────────────────────────────
	// Field baru dari hasil sinkronisasi dengan komponen Svelte asli
	// (FormAreaSunExposure, FormRainGutter, FormSpecialPresence, FormPhotoArea,
	// FormUploadTanaman, FormSketchUpload, FormDocumentationUpload,
	// PlantRequestForm). Field-field ini BELUM ada di alur Tahap 1/Tahap 2 yang
	// sudah berjalan (lihat catatan di FormAdditionalInfo.tsx) — ditambahkan di
	// sini secara aditif supaya komponen barunya bisa jalan & type-check, tapi
	// integrasinya ke wizard (SurveyFormV2Page, gate stage, dst) masih perlu
	// diputuskan menyusul.
	// ─────────────────────────────────────────────────────────────

	// FormAreaSunExposure (catatan tambahan pencahayaan — beda dari areaSunExposureId di atas)
	areaSunExposureNote: string | null;

	// FormRainGutter
	rainWaterFlowDirectionNote: string | null;

	// FormSpecialPresence (catatan teks; TIDAK dipakai oleh AdditionalInfoQuestion generik)
	childrenPresenceNote: string | null;
	animalPresenceNote: string | null;

	// FormPhotoArea
	areaPhotos: AreaPhotoEntry[];

	// FormUploadTanaman
	plantPresences: PlantPresenceEntry[];
	plantPresenceCloudStorageUrl: string | null;

	// FormAreaPhoto ("Foto Area", dirender di SurveyFormV3 — beda dari
	// FormPhotoArea di atas). Sebelumnya salah pakai key `documentation*`
	// yang bikin foto tercampur dengan FormExistingPlant/FormSketch/
	// FormDocumentationUpload (lihat catatan bugfix di masing-masing file).
	areaPhotoImages: NameableFile[];
	areaPhotoVideos: NameableFile[];
	areaPhotoDocuments: NameableFile[];
	areaPhotoCloudStorageUrl: string | null;

	// FormExistingPlant ("Tanaman Existing"). Sebelumnya juga salah pakai
	// key `documentation*` — lihat catatan di atas.
	existingPlantImages: NameableFile[];
	existingPlantVideos: NameableFile[];
	existingPlantDocuments: NameableFile[];
	existingPlantCloudStorageUrl: string | null;

	// FormDocumentationUpload ("Dokumentasi Lainnya")
	documentationImages: NameableFile[];
	documentationVideos: NameableFile[];
	documentationDocuments: NameableFile[];
	documentationCloudStorageUrl: string | null;

	// FormSketchUpload / FormSketch ("Sketch/Gambar"). FormSketch
	// sebelumnya juga salah pakai key `documentation*` — lihat catatan di atas.
	sketchImages: NameableFile[];
	sketchDocuments: NameableFile[];
	sketchCloudStorageUrl: string | null;

	// PlantRequestForm
	itemRequests: ItemRequestEntry[];

	// DatePickerField (SurveyFormV3) — tanggal survey, format 'yyyy-MM-dd'.
	// String kosong '' berarti belum dipilih (mengikuti pola gardenName/areaSize).
	surveyDate: string;

	// AdditionalInfoQuestion — "Tanggal Ekspektasi Build" (Tahap 2, opsional,
	// key katalog `expectedGardenBuildDate`). Disimpan per-taman (sejalan
	// dengan surveyDate di atas), format 'yyyy-MM-dd'. String kosong ''
	// berarti belum dipilih. (Beda dari `OrderDesignData.
	// expectedGardenBuildStartDates` milik ExpectedBuildDateForm.tsx, yang
	// bekerja di level ORDER dan belum terhubung ke context/API mana pun.)
	expectedGardenBuildDate: string;
	// ──────────────────────────────────────────────────
	// Toggle "Memerlukan Validasi ke Klien?" per section (lihat
	// ValidationToggle.tsx). Key = field utama section tsb (mis.
	// "drainageId", "waterSourceId", dst), value = status toggle-nya.
	// ──────────────────────────────────────────────────
	sectionValidations: Record<string, boolean>;
}

export function createEmptySurveyFormData(): SurveyFormData {
	return {
		id: null,
		gardenName: '',
		areaSize: '',
		gardenFacingDirectionId: null,
		areaSunExposureTimes: [],
		sunExposureObstructionId: null,
		drainageId: null,
		waterSourceId: null,
		waterSourceDistanceNote: null,
		electricitySourceId: null,
		electricitySourceDistanceNote: null,
		entranceAccessId: null,
		gardenEntranceAccessId: null,
		gardenEntranceAccessNote: null,
		gardenEntranceAccessPhotos: [],
		groundSurfaceConditionId: null,
		landPreparations: [],
		soilMoistureId: null,
		soilPlantingReadinessId: null,
		soilPlantingReadinessNote: null,
		fixedStructures: [],
		rainGutterNeedId: null,
		childrenPresenceId: null,
		animalPresenceId: null,
		animalPresenceOtherText: null,
		careLevelId: null,
		specialAreaId: null,
		specialAreaOtherText: null,
		gardenThemeId: null,
		surveyorNote: null,
		areaSunExposureNote: null,
		rainWaterFlowDirectionNote: null,
		childrenPresenceNote: null,
		animalPresenceNote: null,
		areaPhotos: [],
		plantPresences: [],
		plantPresenceCloudStorageUrl: null,
		areaPhotoImages: [],
		areaPhotoVideos: [],
		areaPhotoDocuments: [],
		areaPhotoCloudStorageUrl: null,
		existingPlantImages: [],
		existingPlantVideos: [],
		existingPlantDocuments: [],
		existingPlantCloudStorageUrl: null,
		documentationImages: [],
		documentationVideos: [],
		documentationDocuments: [],
		documentationCloudStorageUrl: null,
		sketchImages: [],
		sketchDocuments: [],
		sketchCloudStorageUrl: null,
		itemRequests: [],
		surveyDate: '',
		expectedGardenBuildDate: '',
		sectionValidations: {}
	};
}

/** Props dasar yang dipakai semua komponen Form* tanpa kebutuhan `tags`. */
export interface Stage1FormProps {
	formId: string;
	surveyData: SurveyFormData;
	showValidationWarning: boolean;
	updateSurveyEntries: (formId: string, patch: Partial<SurveyFormData>) => void;
	// Data jawaban Taman 1 (entries[0]), dipakai untuk saran "salin jawaban"
	// PER FIELD (lihat FieldSuggestion.tsx). null/undefined kalau taman aktif
	// adalah Taman 1 sendiri, atau Taman 1 belum punya jawaban apa pun.
	firstGardenData?: SurveyFormData | null;
}

/** Props untuk komponen Form* yang butuh daftar tag (mayoritas). */
export interface Stage1FormWithTagsProps extends Stage1FormProps {
	tags: Tag[];
}

// ─────────────────────────────────────────────────────────────
// ExpectedBuildDateForm.svelte bekerja di atas `orderDesignData` (data level
// ORDER, bukan per-taman seperti SurveyFormData di atas) — konsep ini BELUM
// ada sama sekali di project React ini (tidak ada context/route yang
// menyediakannya). Tipe & props di bawah cuma placeholder minimal supaya
// ExpectedBuildDateForm.tsx bisa di-compile; perlu diintegrasikan ke
// context/API data order yang sebenarnya sebelum dipakai di production.
// ─────────────────────────────────────────────────────────────
export interface OrderDesignData {
	expectedGardenBuildStartDates: (string | null)[];
}

export interface ExpectedBuildDateFormProps {
	formId: number;
	orderDesignData: OrderDesignData;
	showValidationWarning: boolean;
	updateOrderDesignData: (formId: number, patch: Partial<OrderDesignData>) => void;
}