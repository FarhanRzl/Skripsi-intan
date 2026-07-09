// Di-port dari src/lib/survey-form/ThemeForm.svelte (project Svelte).
//
// Catatan: sama seperti CareLevelForm.tsx — field `gardenThemeId` sudah
// ditangani generik lewat AdditionalInfoQuestion.tsx + stage2Questions.ts
// ("Tema Taman yang Diinginkan"). Komponen literal ini disediakan untuk
// paritas 1:1 dengan Svelte, TIDAK dipasang di FormAdditionalInfo.tsx supaya
// tidak dobel.
import RadioCard from '$lib/components/inputs/RadioCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import { TAG_TYPES } from '$lib/constants/tag';
import type { Stage1FormWithTagsProps } from './types';

export default function ThemeForm({
	formId,
	surveyData,
	tags,
	updateSurveyEntries
}: Stage1FormWithTagsProps) {
	const themeOpts = tags.filter((tag) => tag.type === TAG_TYPES.DESIGN);

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.gardenThemeId`}>
			<div className="flex items-center justify-between">
				<h3 className="font-bold text-neutral-main">Tema & Estetika</h3>
				<InfoTooltip text="Diskusikan preferensi dengan klien dan untuk kesesuaian desain taman" />
			</div>

			<div className="space-y-2">
				{themeOpts.map((opt) => (
					<RadioCard
						key={opt.id}
						id={`designSurveyReports.${formId}.gardenThemeId.${opt.id}`}
						name={`designSurveyReports.${formId}.gardenThemeId`}
						value={opt.id}
						selectedValue={surveyData.gardenThemeId}
						onchange={() => updateSurveyEntries(formId, { gardenThemeId: opt.id })}
						title={opt.title}
						description={opt.technicalNote ?? ''}
					/>
				))}
			</div>
		</div>
	);
}
