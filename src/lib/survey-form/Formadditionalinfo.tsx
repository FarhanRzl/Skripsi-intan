// ⚠️ BEST-EFFORT — lihat catatan panjang di
// src/types/design-survey-report-stage2.ts. Tidak ada file svelte asli untuk
// Tahap 2 yang pernah dikirim, jadi komponen ini disusun dari TAG_TYPES yang
// sudah ada + tag dummy yang sudah di-seed. Timpa kalau source aslinya sudah
// ada.
//
// Direfactor supaya definisi tiap pertanyaan diambil dari satu sumber
// (stage2Questions.ts) yang dipakai bareng dengan fitur "Tambah Isian Survey"
// di SurveyFormV2.tsx / AddSurveyQuestionModal.tsx — supaya tidak ada 2 versi
// yang bisa berbeda-beda.
import type { ChangeEvent } from 'react';
import Warning from '$lib/components/inline-warnings/Warning';
import TextInput from '$lib/input-fields/TextInput';
import { stage2QuestionCatalog } from './stage2Questions';
import AdditionalInfoQuestion from './AdditionalInfoQuestion';
import type { Stage1FormWithTagsProps } from './types';

export default function FormAdditionalInfo({
	formId,
	surveyData,
	showValidationWarning,
	tags,
	updateSurveyEntries
}: Stage1FormWithTagsProps) {
	return (
		<div className="space-y-8">
			<Warning message='Bagian "Info Tambahan" (Tahap 2) ini disusun berdasarkan data tag yang tersedia di project, belum dikonfirmasi dari desain asli. Mohon dicek ulang sebelum dipakai produksi.' />

			{stage2QuestionCatalog.map((def) => (
				<div key={def.key} className="space-y-4">
					<AdditionalInfoQuestion
						formId={formId}
						def={def}
						tags={tags}
						surveyData={surveyData}
						showValidationWarning={showValidationWarning}
						updateSurveyEntries={updateSurveyEntries}
					/>
				</div>
			))}

			<TextInput
				id={`designSurveyReports.${formId}.surveyorNote`}
				label="Catatan Tambahan Surveyor"
				type="textarea"
				bg="white"
				value={surveyData.surveyorNote ?? ''}
				onInput={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
					updateSurveyEntries(formId, { surveyorNote: e.target.value })
				}
			/>
		</div>
	);
}