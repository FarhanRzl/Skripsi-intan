// Di-port dari src/lib/survey-form/CareLevelForm.svelte (project Svelte).
//
// Catatan: field `careLevelId` sudah ada & sudah ditangani secara generik oleh
// AdditionalInfoQuestion.tsx + stage2Questions.ts (dipakai FormAdditionalInfo.tsx
// & fitur "Tambah Isian Survey"). Komponen literal ini disediakan supaya 1:1
// dengan source Svelte-nya (kalau suatu saat mau dipakai berdiri sendiri di luar
// mekanisme generik itu), tapi TIDAK dipasang di SurveyFormV2.tsx / FormAdditionalInfo.tsx
// supaya tidak dobel dengan pertanyaan "Level Perawatan yang Diinginkan" yang sudah ada.
import RadioCard from '$lib/components/inputs/RadioCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import { TAG_TYPES } from '$lib/constants/tag';
import type { Stage1FormWithTagsProps } from './types';

export default function CareLevelForm({
	formId,
	surveyData,
	tags,
	updateSurveyEntries
}: Stage1FormWithTagsProps) {
	const careOpts = tags.filter((tag) => tag.type === TAG_TYPES.CARE_LEVEL);

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.careLevelId`}>
			<div className="flex items-center justify-between">
				<h3 className="font-bold text-neutral-main">Tingkat Perawatan</h3>
				<InfoTooltip text="Pastikan klien paham bahwa high maintenance bukan berarti sulit, tapi hanya butuh perhatian lebih teratur (misalnya penyiraman harian atau pemangkasan bulanan)." />
			</div>

			<div className="space-y-2">
				{careOpts.map((opt) => (
					<RadioCard
						key={opt.id}
						id={`designSurveyReports.${formId}.careLevelId.${opt.id}`}
						name={`designSurveyReports.${formId}.careLevelId`}
						value={opt.id}
						selectedValue={surveyData.careLevelId}
						onchange={() => updateSurveyEntries(formId, { careLevelId: opt.id })}
						title={opt.title}
						description={opt.technicalNote ?? ''}
					/>
				))}
			</div>
		</div>
	);
}
