// Di-port dari src/lib/survey-form/SpecialAreaForm.svelte (project Svelte).
//
// Catatan: field `specialAreaId` / `specialAreaOtherText` sudah ditangani
// generik lewat AdditionalInfoQuestion.tsx + stage2Questions.ts ("Area
// Khusus"), termasuk textarea "lainnya" ketika TAG.SPECIAL_AREA_OTHER dipilih.
// Komponen literal ini disediakan untuk paritas 1:1 dengan Svelte (dengan
// tambahan banner Warning yang belum ada di versi generik), TIDAK dipasang
// ganda di FormAdditionalInfo.tsx.
import type { ChangeEvent } from 'react';
import Warning from '$lib/components/inline-warnings/Warning';
import RadioCard from '$lib/components/inputs/RadioCard';
import TextInput from '$lib/input-fields/TextInput';
import { TAG, TAG_TYPES } from '$lib/constants/tag';
import type { Stage1FormWithTagsProps } from './types';

export default function SpecialAreaForm({
	formId,
	surveyData,
	tags,
	updateSurveyEntries
}: Stage1FormWithTagsProps) {
	const specialAreaOpts = tags.filter((tag) => tag.type === TAG_TYPES.SPECIAL_AREA);

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.specialAreaId`}>
			<div className="flex items-center justify-between mb-2">
				<h3 className="font-bold text-neutral-main">Area Khusus</h3>
			</div>


			<div className="space-y-2">
				{specialAreaOpts.map((opt) => (
					<RadioCard
						key={opt.id}
						id={`designSurveyReports.${formId}.specialAreaId.${opt.id}`}
						name={`designSurveyReports.${formId}.specialAreaId`}
						value={opt.id}
						selectedValue={surveyData.specialAreaId}
						onchange={() => updateSurveyEntries(formId, { specialAreaId: opt.id })}
						title={opt.title}
						description={opt.technicalNote ?? ''}
					/>
				))}

				{surveyData.specialAreaId === TAG.SPECIAL_AREA_OTHER && (
					<>


						<TextInput
							id={`designSurveyReports.${formId}.specialAreaOtherText`}
							label="Penempatan Area Taman"
							bg="white"
							value={surveyData.specialAreaOtherText ?? ''}
							onInput={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
								updateSurveyEntries(formId, { specialAreaOtherText: e.target.value })
							}
						/>
					</>
				)}
			</div>

			<Warning message="Jika ada area lain (misalnya balkon, indoor, atau ruang khusus lainnya), tulis nama area dan beri keterangan singkat tentang kondisi/aturan khususnya." />
		</div>
	);
}
