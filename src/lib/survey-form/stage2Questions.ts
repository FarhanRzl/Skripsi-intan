// Katalog pertanyaan Tahap 2 (Info Tambahan) yang dipakai bersama oleh:
//   - FormAdditionalInfo.tsx (tampilan penuh Tahap 2 / "Isi Info Tambahan")
//   - AddSurveyQuestionModal.tsx + inline extra questions di SurveyFormV2.tsx
//     (fitur "Tambah Isian Survey" di Tahap 1)
// Satu sumber kebenaran supaya kedua tempat itu tidak duplikasi/berbeda.
import { TAG_TYPES, TAG } from '$lib/constants/tag';
import type { SurveyFormData } from './types';

export type Stage2FieldKey =
	| 'gardenFacingDirectionId'
	| 'rainGutterNeedId'
	| 'childrenPresenceId'
	| 'animalPresenceId'
	| 'careLevelId'
	| 'specialAreaId'
	| 'gardenThemeId'
	| 'fixedStructures'
	| 'plantRequests'
	| 'rainWaterFlowDirectionNote'
	| 'gardenBudgetNote'
	| 'expectedGardenBuildDate'
	| 'PhotoAreaId'
	| 'existingPlantPhoto'
	| 'sketchPhoto'
	| 'otherDocumentation';

export type Stage2OtherTextKey = 'animalPresenceOtherText' | 'specialAreaOtherText';

export interface Stage2QuestionDef {
	key: Stage2FieldKey;
	title: string;
	tagType: string | null;
	required: boolean;
	otherTagId?: string;
	otherTextKey?: Stage2OtherTextKey;
	otherTextLabel?: string;
	tooltip?: string;
}

export const stage2QuestionCatalog: Stage2QuestionDef[] = [
	{
		// Dipindah dari Tahap 1 (FormOrientation.tsx) — sekarang opsional,
		// ditambahkan lewat "Tambah Isian Survey" atau tampilan Tahap 2 penuh.
		key: 'gardenFacingDirectionId',
		title: 'Arah Hadap Taman',
		tagType: TAG_TYPES.GARDEN_FACING_DIRECTION,
		required: false,
		tooltip: 'Gunakan kompas (HP) untuk cek arah hadap taman. Berdiri menghadap area terbuka lalu catat arah utamanya.'
	},
	{
		key: 'rainGutterNeedId',
		title: 'Kebutuhan Talang Air',
		tagType: TAG_TYPES.RAIN_GUTTER_NEED,
		required: true,
		tooltip: 'Cek apakah air hujan dari atap/bangunan sekitar bisa langsung jatuh ke area taman tanpa saluran.'
	},
	{
		key: 'childrenPresenceId',
		title: 'Keberadaan Anak-anak di Lokasi',
		tagType: TAG_TYPES.CHILDREN_PRESENCE,
		required: true,
		tooltip: 'Tanyakan ke pemilik rumah apakah ada anak-anak yang akan sering beraktivitas di sekitar taman.'
	},
	{
		key: 'animalPresenceId',
		title: 'Keberadaan Hewan Peliharaan',
		tagType: TAG_TYPES.ANIMAL_PRESENCE,
		required: true,
		otherTagId: TAG.ANIMAL_PRESENCE_OTHER,
		otherTextKey: 'animalPresenceOtherText',
		otherTextLabel: 'Sebutkan Hewan Lainnya',
		tooltip: 'Cek keberadaan hewan peliharaan yang bisa mempengaruhi pemilihan jenis tanaman (mis. tanaman beracun).'
	},
	{
		key: 'careLevelId',
		title: 'Level Perawatan yang Diinginkan',
		tagType: TAG_TYPES.CARE_LEVEL,
		required: true,
		tooltip: 'Tanyakan seberapa sering pemilik rumah bersedia meluangkan waktu untuk merawat taman ke depannya.'
	},
	{
		key: 'specialAreaId',
		title: 'Area Khusus',
		tagType: TAG_TYPES.SPECIAL_AREA,
		required: false,
		otherTagId: TAG.SPECIAL_AREA_OTHER,
		otherTextKey: 'specialAreaOtherText',
		otherTextLabel: 'Sebutkan Area Khusus Lainnya',
		tooltip: 'Catat kalau taman berada di lokasi khusus seperti balkon atau indoor — mempengaruhi jenis tanaman yang cocok.'
	},
	{
		key: 'gardenThemeId',
		title: 'Tema Taman yang Diinginkan',
		tagType: TAG_TYPES.GARDEN_THEME,
		required: false,
		tooltip: 'Tanyakan gaya/tema taman yang diinginkan pemilik rumah (mis. tropis, minimalis modern, Jepang/Zen).'
	},
	{
		key: 'fixedStructures',
		title: 'Infrastruktur Rumah yang Tidak Boleh Dipindahkan',
		tagType: null,
		required: false,
		tooltip: 'Tanyakan infrastruktur rumah yang tidak boleh dipindahkan (mis. kolam, taman, dll).'
	},
	{
		// PlantRequestForm — tag-input bebas (nama tanaman), bukan RadioCard
		// dari tag, lihat penanganan khusus di AdditionalInfoQuestion.tsx.
		// `tagType: null` supaya tidak ikut ke alur options.map generik.
		key: 'plantRequests',
		title: 'Permintaan Tanaman Khusus',
		tagType: null,
		required: false,
		tooltip: 'Catat permintaan tanaman khusus dari klien (mis. jenis, warna bunga, atau tinggi tertentu).'
	},

		{
		// Field teks bebas (bukan RadioCard dari tag), lihat penanganan khusus
		// di AdditionalInfoQuestion.tsx. `tagType: null` supaya tidak ikut ke
		// alur options.map generik.
		key: 'rainWaterFlowDirectionNote',
		title: 'Arah Aliran Air Hujan',
		tagType: null,
		required: false,
		tooltip: 'Tanyakan arah aliran air hujan di area taman.'
	},
		{
		// Field teks bebas (bukan RadioCard dari tag), sama seperti
		// rainWaterFlowDirectionNote di atas — lihat penanganan khusus di
		// AdditionalInfoQuestion.tsx. `tagType: null` supaya tidak ikut ke
		// alur options.map generik.
		key: 'gardenBudgetNote',
		title: 'Anggaran Pembuatan Taman',
		tagType: null,
		required: false,
		tooltip: 'Tanyakan ekspektasi budget klien untuk pembuatan taman (mis. rentang nominal yang disiapkan).'
	},
			{
		// Date picker (bukan RadioCard dari tag), lihat penanganan khusus di
		// AdditionalInfoQuestion.tsx. `tagType: null` supaya tidak ikut ke alur
		// options.map generik.
		key: 'expectedGardenBuildDate',
		title: 'Tanggal Ekspektasi Build',
		tagType: null,
		required: false,
		tooltip: 'Tanyakan tanggal ekspektasi pembangunan taman.'
	},
	{
	key: 'PhotoAreaId',
	title: 'Dokumentasi Foto Area',
	tagType: null,
	required: false,
	tooltip: 'Upload foto, video, dokumen, atau masukkan link Google Drive.'
	},
		{
	key: 'existingPlantPhoto',
	title: 'Dokumentasi (Tanaman Eksisting)',
	tagType: null,
	required: false,
	tooltip: 'Upload foto, video, dokumen, atau masukkan link Google Drive.'
	},
			{
	key: 'sketchPhoto',
	title: 'Dokumentasi (Sketch/ Gambar)',
	tagType: null,
	required: false,
	tooltip: 'Upload foto, video, dokumen, atau masukkan link Google Drive.'
	},
				{
	key: 'otherDocumentation',
	title: 'Dokumentasi (Dokumentasi Lainnya)',
	tagType: null,
	required: false,
	tooltip: 'Upload foto, video, dokumen, atau masukkan link Google Drive.'
	},
];

export function getStage2QuestionDef(key: Stage2FieldKey): Stage2QuestionDef | undefined {
	return stage2QuestionCatalog.find((q) => q.key === key);
}

/** Type guard kecil supaya key dari luar (mis. localStorage draft lama) aman dipakai. */
export function isStage2FieldKey(key: string): key is Stage2FieldKey {
	return stage2QuestionCatalog.some((q) => q.key === key);
}

export type { SurveyFormData };