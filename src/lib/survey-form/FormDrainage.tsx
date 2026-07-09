// Di-port dari src/lib/survey-form/FormDrainage.svelte (project Svelte).
import RadioCard from '$lib/components/inputs/RadioCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import InsightBox from './InsightBox';
import FieldSuggestion from './FieldSuggestion';
import { shouldSuggestField, getSuggestionGardenName, getTagTitle } from './fieldSuggestionUtils';
import type { Stage1FormWithTagsProps } from './types';
import ValidationToggle from './ValidationToggle';

export default function FormDrainage({
	formId,
	surveyData,
	tags,
	updateSurveyEntries,
	firstGardenData
}: Stage1FormWithTagsProps) {
	const drainageOptions = tags.filter((tag) => tag.type === 'drainage');
	const showSuggestion =
		!!firstGardenData && shouldSuggestField(surveyData.drainageId, firstGardenData.drainageId);

	const drainageInsight = (() => {
		if (!surveyData.drainageId) return null;
		const selected = drainageOptions.find((t) => t.id === surveyData.drainageId);
		return selected?.technicalNote ?? null;
	})();

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.drainageId`}>
			<div className="flex items-center justify-between">
				<h3 className="font-bold">Kondisi Drainase</h3>
				<InfoTooltip text="Uji dengan menuang air untuk melihat arah aliran dan kecepatan. Catat apakah butuh talang air tambahan dan ke arah mana air mengalir." />
			</div>

			{showSuggestion && (
				<FieldSuggestion
					gardenName={getSuggestionGardenName(firstGardenData)}
					value={getTagTitle(drainageOptions, firstGardenData!.drainageId)}
					onApply={() => updateSurveyEntries(formId, { drainageId: firstGardenData!.drainageId })}
				/>
			)}

			<div className="space-y-2">
				{drainageOptions.map((opt) => (
					<RadioCard
						key={opt.id}
						id={`designSurveyReports.${formId}.drainageId.${opt.id}`}
						name={`designSurveyReports.${formId}.drainageId`}
						value={opt.id}
						selectedValue={surveyData.drainageId}
						onchange={() => updateSurveyEntries(formId, { drainageId: opt.id })}
						title={opt.title}
						description=""
					/>
				))}
			</div>

			{drainageInsight && <InsightBox text={drainageInsight} />}
			<ValidationToggle key={formId} formId={formId} sectionKey='drainageId' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
		</div>
	);
}