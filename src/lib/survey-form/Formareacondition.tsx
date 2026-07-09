// Di-port dari src/lib/survey-form/FormAreaCondition.svelte (project Svelte).
import RadioCard from '$lib/components/inputs/RadioCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import InsightBox from './InsightBox';
import FieldSuggestion from './FieldSuggestion';
import { shouldSuggestField, getSuggestionGardenName, getTagTitle } from './fieldSuggestionUtils';
import { TAG_TYPES } from '$lib/constants/tag';
import type { Stage1FormWithTagsProps } from './types';
import ValidationToggle from './ValidationToggle';

export default function FormAreaCondition({
	formId,
	surveyData,
	tags,
	updateSurveyEntries,
	firstGardenData
}: Stage1FormWithTagsProps) {
	const groundSurfaceConditionOpts = tags.filter(
		(tag) => tag.type === TAG_TYPES.GROUND_SURFACE_CONDITION
	);
	const showSuggestion =
		!!firstGardenData &&
		shouldSuggestField(surveyData.groundSurfaceConditionId, firstGardenData.groundSurfaceConditionId);

	const areaInsight = (() => {
		if (!surveyData.groundSurfaceConditionId) return null;
		const selected = groundSurfaceConditionOpts.find(
			(t) => t.id === surveyData.groundSurfaceConditionId
		);
		return selected?.technicalNote ?? null;
	})();

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.groundSurfaceConditionId`}>
			<div className="flex items-center justify-between">
				<h3 className="font-bold">Kondisi Area</h3>
				<InfoTooltip text="Tanyakan kepada klien apakah ingin membongkar atau mempertahankan perkerasan yang ada" />
			</div>

			{showSuggestion && (
				<FieldSuggestion
					gardenName={getSuggestionGardenName(firstGardenData)}
					value={getTagTitle(groundSurfaceConditionOpts, firstGardenData!.groundSurfaceConditionId)}
					onApply={() =>
						updateSurveyEntries(formId, {
							groundSurfaceConditionId: firstGardenData!.groundSurfaceConditionId
						})
					}
				/>
			)}

			<div className="space-y-2">
				{groundSurfaceConditionOpts.map((opt) => (
					<RadioCard
						key={opt.id}
						id={`designSurveyReports.${formId}.groundSurfaceConditionId.${opt.id}`}
						name={`designSurveyReports.${formId}.groundSurfaceConditionId`}
						value={opt.id}
						selectedValue={surveyData.groundSurfaceConditionId}
						onchange={() => updateSurveyEntries(formId, { groundSurfaceConditionId: opt.id })}
						title={opt.title}
						description=""
					/>
				))}
			</div>

			{areaInsight && <InsightBox text={areaInsight} />}
			<ValidationToggle key={formId} formId={formId} sectionKey='groundSurfaceConditionId' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
		</div>
	);
}	