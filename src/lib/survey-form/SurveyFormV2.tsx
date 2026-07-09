// Komponen orkestrator untuk 1 entri "taman" di form survey. Menyusun 10
// komponen Tahap 1 (GardenNameForm ... FormInfrastructure) atau komponen
// Tahap 2 (FormAdditionalInfo), tergantung `stage` yang sedang aktif.
// Dipanggil dari SurveyFormPage.tsx.
//
// Fitur "Tambah Isian Survey": di akhir Tahap 1, ada tombol yang membuka
// popup berisi daftar pertanyaan Tahap 2 (lihat stage2Questions.ts). Begitu
// user memilih beberapa pertanyaan dan menekan "Tambah", popup tertutup dan
// pertanyaan yang dipilih langsung muncul inline di bagian bawah Tahap 1 —
// tanpa perlu pindah ke tampilan "Info Tambahan (Opsional)" yang terpisah.
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
import FormAdditionalInfo from './Formadditionalinfo';
import AdditionalInfoQuestion from './AdditionalInfoQuestion';
import { getStage2QuestionDef, type Stage2FieldKey } from './stage2Questions';
import type { SurveyFormData } from './types';

interface SurveyFormV2Props {
	formId: string;
	surveyData: SurveyFormData;
	sizeCategory: string | number;
	showValidationWarning: boolean;
	tags: Tag[];
	updateSurveyEntries: (formId: string, patch: Partial<SurveyFormData>) => void;
	stage: 1 | 2;
	extraFieldKeys: Stage2FieldKey[];
	// Diteruskan ke tiap section supaya masing-masing bisa menawarkan saran
	// "salin jawaban dari Taman 1" per field-nya sendiri.
	firstGardenData?: SurveyFormData | null;
}

// Catatan: tombol "Tambah Isian Survey" & AddSurveyQuestionModal sekarang
// dirender di SurveyFormPage.tsx (bagian sticky footer), bukan di sini —
// supaya tombolnya selalu terlihat (fixed), sesuai desain project Svelte.
export default function SurveyFormV2({
	formId,
	surveyData,
	sizeCategory,
	showValidationWarning,
	tags,
	updateSurveyEntries,
	stage,
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

	if (stage === 2) {
		return <FormAdditionalInfo {...stage1Props} />;
	}

	return (
		<div className="space-y-8">
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
			<FormAccess {...stage1Props} />
			<hr className="mb-6 border-neutral-border" />
			<FormAreaCondition {...stage1Props} />
			<hr className="mb-6 border-neutral-border" />
			<FormLandPreparation {...stage1Props} />
			<hr className="mb-6 border-neutral-border" />
			<FormSoilCondition {...stage1Props} />

			{extraFieldKeys.map((key) => {
				const def = getStage2QuestionDef(key);
				if (!def) return null;
				return (
					<div key={key}>
					 <hr className="mb-6 border-neutral-8" />
						<AdditionalInfoQuestion {...stage1Props} def={def} />
					</div>
				);
			})}
		</div>
	);
}