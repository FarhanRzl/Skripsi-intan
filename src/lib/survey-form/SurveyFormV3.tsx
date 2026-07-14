// Komponen orkestrator untuk 1 entri "taman" di form survey. Menyusun 10
// komponen Tahap 1 (GardenNameForm ... FormInfrastructure).
// Dipanggil dari SurveyFormPage.tsx.
//
// Fitur "Tambah Isian Survey": di akhir Tahap 1, ada tombol yang membuka
// popup berisi daftar pertanyaan Tahap 2 (lihat stage2Questions.ts). Begitu
// user memilih beberapa pertanyaan dan menekan "Tambah", popup tertutup dan
// pertanyaan yang dipilih (radio button dkk, lewat AdditionalInfoQuestion)
// langsung muncul inline di bagian bawah Tahap 1 — SEBELUM section
// "Dokumentasi", tanpa perlu pindah ke tampilan "Info Tambahan (Opsional)"
// yang terpisah.
//
// Urutan render: ... FormInfrastructure -> Tanggal Survey -> pertanyaan
// tambahan (radio button, dari extraFieldKeys) -> heading "Dokumentasi" ->
// 4 komponen upload dokumentasi (FormAreaPhoto, FormUploadTanaman,
// FormSketch, FormDocumentationUpload), masing-masing dirender SEKALI saja
// (bukan di dalam .map extraFieldKeys — sebelumnya sempat ikut ke-duplikasi
// tiap ada extra field yang ditambahkan).
//
// Catatan: field "Tanaman Existing" sebelumnya dirender oleh FormExistingPlant
// (model data existingPlantImages/Videos/Documents, tanpa nama tanaman/unit).
// Diganti ke FormUploadTanaman (model plantPresences: nama tanaman + counter
// unit per foto) supaya sesuai desain. FormExistingPlant.tsx dibiarkan ada di
// project (belum dipakai lagi) kalau-kalau masih dibutuhkan referensinya.
import type { Tag } from '$types/tags';
import GardenNameForm from './GardenNameForm';
import GardenAreaForm from './GardenAreaForm';
import FormOrientation from './FormOrientation';
import FormDrainage from './FormDrainage';
import FormWaterElectricity from './Formwaterelectricity';
import FormAccess from './Formaccess';
import FormAreaCondition from './Formareacondition';
import FormLandPreparation from './Formlandpreparation';
import FormSoilCondition from './Formsoilcondition';
import AdditionalInfoQuestion from './AdditionalInfoQuestion';
import { getStage2QuestionDef, type Stage2FieldKey } from './stage2Questions';
import type { SurveyFormData } from './types';
import FormDocumentationUpload from './FormDocumentationUpload';
import FormAreaPhoto from './FormAreaPhoto';
import FormUploadTanaman from './FormUploadTanaman';
import FormSketch from './FormSketch';
interface SurveyFormV2Props {
	formId: string;
	surveyData: SurveyFormData;
	sizeCategory: string | number;
	showValidationWarning: boolean;
	tags: Tag[];
	updateSurveyEntries: (formId: string, patch: Partial<SurveyFormData>) => void;
	extraFieldKeys: Stage2FieldKey[];
	firstGardenData?: SurveyFormData | null;
}

// 4 key pertanyaan upload dokumentasi di stage2Questions.ts. Tetap bisa
// dipilih di popup "Tambah Isian Survey" (tidak dihapus dari catalog), tapi
// SENGAJA tidak dirender inline di sini kalau terpilih — karena representasi
// upload-nya sudah ada secara permanen di section "Dokumentasi" di bawah
// (FormAreaPhoto, FormUploadTanaman, FormSketch, FormDocumentationUpload).
// Ini supaya tidak muncul field upload dobel di halaman edit form survey.
const UPLOAD_FIELD_KEYS: Stage2FieldKey[] = [
	'PhotoAreaId',
	'existingPlantPhoto',
	'sketchPhoto',
	'otherDocumentation'
];

// Catatan: tombol "Tambah Isian Survey" & AddSurveyQuestionModal sekarang
// dirender di SurveyFormPage.tsx (bagian sticky footer), bukan di sini —
// supaya tombolnya selalu terlihat (fixed), sesuai desain project Svelte.
export default function SurveyFormV3({
	formId,
	surveyData,
	sizeCategory,
	showValidationWarning,
	tags,
	updateSurveyEntries,
	extraFieldKeys,
	firstGardenData
}: SurveyFormV2Props) {
	const stage1Props = {
		formId,
		surveyData,
		showValidationWarning,
		tags,
		updateSurveyEntries,
		firstGardenData
	};

	return (
		<div className="space-y-6">
			<GardenNameForm
				formId={formId}
				surveyData={surveyData}
				showValidationWarning={showValidationWarning}
				updateSurveyEntries={updateSurveyEntries}
			/>
			<hr className="mb-6 border-neutral-border" />
			<GardenAreaForm
				formId={formId}
				surveyData={surveyData}
				sizeCategory={sizeCategory}
				showValidationWarning={showValidationWarning}
				updateSurveyEntries={updateSurveyEntries}
			/>
			<hr className="mb-6 border-neutral-border" />
			<FormOrientation {...stage1Props} />
			<hr className="mb-6 border-neutral-border" />
			<FormDrainage {...stage1Props} />
			<hr className="mb-6 border-neutral-border" />
			<FormWaterElectricity {...stage1Props} />
			<hr className="mb-6 border-neutral-border" />
			<FormAccess {...stage1Props} photosRequired />
			<hr className="mb-6 border-neutral-border" />
			<FormAreaCondition {...stage1Props} />
			<hr className="mb-6 border-neutral-border" />
			<FormLandPreparation {...stage1Props} />
			<hr className="mb-6 border-neutral-border" />
			<FormSoilCondition {...stage1Props} />
			<hr className="mb-6 border-neutral-border" />
			{extraFieldKeys
				.filter((key) => !UPLOAD_FIELD_KEYS.includes(key))
				.map((key) => {
					const def = getStage2QuestionDef(key);
					if (!def) return null;
					return (
						<div key={key}>
							<hr className="mb-6 border-neutral-8" />
							<AdditionalInfoQuestion {...stage1Props} def={def} />
						</div>
					);
				})}

			<h4 className="text-primary-main text-2xl text-center">Dokumentasi</h4>
			<FormAreaPhoto {...stage1Props} />
			<FormUploadTanaman {...stage1Props} />
			<FormSketch {...stage1Props} />
			<FormDocumentationUpload {...stage1Props} />
		</div>
	);
}