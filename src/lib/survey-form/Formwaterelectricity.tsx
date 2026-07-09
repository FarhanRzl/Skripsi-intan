// Di-port dari src/lib/survey-form/FormWaterElectricity.svelte (project Svelte).
import RadioCard from '$lib/components/inputs/RadioCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import InsightBox from './InsightBox';
import FieldSuggestion from './FieldSuggestion';
import { shouldSuggestField, getSuggestionGardenName, getTagTitle } from './fieldSuggestionUtils';
import { TAG_TYPES } from '$lib/constants/tag';
import type { Stage1FormWithTagsProps } from './types';
import ValidationToggle from './ValidationToggle';

export default function FormWaterElectricity({
	formId,
	surveyData,
	tags,
	updateSurveyEntries,
	firstGardenData
}: Stage1FormWithTagsProps) {
	const waterSourceOpts = tags.filter((tag) => tag.type === TAG_TYPES.WATER_SOURCE);
	const electricitySourceOpts = tags.filter((tag) => tag.type === TAG_TYPES.ELECTRICITY_SOURCE);
	const showWaterSuggestion =
		!!firstGardenData && shouldSuggestField(surveyData.waterSourceId, firstGardenData.waterSourceId);
	const showElectricitySuggestion =
		!!firstGardenData &&
		shouldSuggestField(surveyData.electricitySourceId, firstGardenData.electricitySourceId);

	const waterInsight = (() => {
		if (!surveyData.waterSourceId) return null;
		const selected = waterSourceOpts.find((t) => t.id === surveyData.waterSourceId);
		return selected?.technicalNote ?? null;
	})();

	const electricityInsight = (() => {
		if (!surveyData.electricitySourceId) return null;
		const selected = electricitySourceOpts.find((t) => t.id === surveyData.electricitySourceId);
		return selected?.technicalNote ?? null;
	})();

	return (
		<>
			{/* Sumber Air */}
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.waterSourceId`}>
				<div className="flex items-center justify-between">
					<p className="font-bold">Sumber Air</p>
					<InfoTooltip text="Cek ketersediaan dan kualitas sumber air" />
				</div>

				{showWaterSuggestion && (
					<FieldSuggestion
						gardenName={getSuggestionGardenName(firstGardenData)}
						value={
							getTagTitle(waterSourceOpts, firstGardenData!.waterSourceId) +
							(firstGardenData!.waterSourceDistanceNote
								? ` — ${firstGardenData!.waterSourceDistanceNote}`
								: '')
						}
						onApply={() =>
							updateSurveyEntries(formId, {
								waterSourceId: firstGardenData!.waterSourceId,
								waterSourceDistanceNote: firstGardenData!.waterSourceDistanceNote
							})
						}
					/>
				)}

				<div className="space-y-2">
					{waterSourceOpts.map((opt) => (
						<RadioCard
							key={opt.id}
							id={`designSurveyReports.${formId}.waterSourceId.${opt.id}`}
							name={`designSurveyReports.${formId}.waterSourceId`}
							value={opt.id}
							selectedValue={surveyData.waterSourceId}
							onchange={() => updateSurveyEntries(formId, { waterSourceId: opt.id })}
							title={opt.title}
							description=""
						/>
					))}
				</div>

				{waterInsight && <InsightBox text={waterInsight} />}
						<ValidationToggle key={formId} formId={formId} sectionKey='waterSourceId' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
			</div>

			<hr className="mb-6 border-neutral-border" />

			{/* Sumber Listrik */}
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.electricitySourceId`}>
				<div className="flex items-center justify-between">
					<p className="font-bold">Sumber Listrik</p>
					<InfoTooltip text="Ukur jarak dari sumber listrik terdekat. Catat apakah perlu instalasi tambahan" />
				</div>

				{showElectricitySuggestion && (
					<FieldSuggestion
						gardenName={getSuggestionGardenName(firstGardenData)}
						value={
							getTagTitle(electricitySourceOpts, firstGardenData!.electricitySourceId) +
							(firstGardenData!.electricitySourceDistanceNote
								? ` — ${firstGardenData!.electricitySourceDistanceNote}`
								: '')
						}
						onApply={() =>
							updateSurveyEntries(formId, {
								electricitySourceId: firstGardenData!.electricitySourceId,
								electricitySourceDistanceNote: firstGardenData!.electricitySourceDistanceNote
							})
						}
					/>
				)}

				<div className="space-y-2">
					{electricitySourceOpts.map((opt) => (
						<RadioCard
							key={opt.id}
							id={`designSurveyReports.${formId}.electricitySourceId.${opt.id}`}
							name={`designSurveyReports.${formId}.electricitySourceId`}
							value={opt.id}
							selectedValue={surveyData.electricitySourceId}
							onchange={() => updateSurveyEntries(formId, { electricitySourceId: opt.id })}
							title={opt.title}
							description=""
						/>
					))}
				</div>

				{electricityInsight && <InsightBox text={electricityInsight} />}
				<ValidationToggle key={formId} formId={formId} sectionKey='electricitySourceId' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
			</div>
		</>
	);
}