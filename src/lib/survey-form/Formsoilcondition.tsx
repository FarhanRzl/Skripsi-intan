// Di-port dari src/lib/survey-form/FormSoilCondition.svelte (project Svelte).
//
// Catatan: file Svelte yang dikirim hanya berisi bagian "Kelembapan Tanah"
// (soilMoistureId). Field soilPlantingReadinessId/-Note tetap dipertahankan
// di bawahnya (belum ada referensi Svelte utk bagian itu) supaya flow yang
// sudah berjalan tidak berubah.
import RadioCard from '$lib/components/inputs/RadioCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import InsightBox from './InsightBox';
import TextInput from '$lib/input-fields/TextInput';
import FieldSuggestion from './FieldSuggestion';
import { shouldSuggestField, getSuggestionGardenName, getTagTitle } from './fieldSuggestionUtils';
import { TAG_TYPES, TAG } from '$lib/constants/tag';
import type { Stage1FormWithTagsProps } from './types';
import ValidationToggle from './ValidationToggle';

export default function FormSoilCondition({
	formId,
	surveyData,
	tags,
	updateSurveyEntries,
	firstGardenData
}: Stage1FormWithTagsProps) {
	const soilMoistureOpts = tags.filter((tag) => tag.type === TAG_TYPES.SOIL_MOISTURE);
	const showSuggestion =
		!!firstGardenData && shouldSuggestField(surveyData.soilMoistureId, firstGardenData.soilMoistureId);
	const soilPlantingReadinessOpts = tags.filter(
		(tag) => tag.type === TAG_TYPES.SOIL_PLANTING_READINESS
	);

	const soilInsight = (() => {
		if (!surveyData.soilMoistureId) return null;
		const selected = soilMoistureOpts.find((t) => t.id === surveyData.soilMoistureId);
		return selected?.technicalNote ?? null;
	})();

	const showReadinessNote = surveyData.soilPlantingReadinessId === TAG.SOIL_PLANTING_READINESS_NOT_READY;

	return (
		<>
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.soilMoistureId`}>
				<div className="flex items-center justify-between">
					<h3 className="font-bold text-neutral-main">Kelembapan Tanah</h3>
					<InfoTooltip text="Rasakan kondisi tanah dengan tangan dan pastikan mengecek tanah di beberapa titik area taman" />
				</div>

				{showSuggestion && (
					<FieldSuggestion
						gardenName={getSuggestionGardenName(firstGardenData)}
						value={getTagTitle(soilMoistureOpts, firstGardenData!.soilMoistureId)}
						onApply={() =>
							updateSurveyEntries(formId, { soilMoistureId: firstGardenData!.soilMoistureId })
						}
					/>
				)}

				<div className="space-y-2">
					{soilMoistureOpts.map((opt) => (
						<RadioCard
							key={opt.id}
							id={`designSurveyReports.${formId}.soilMoistureId.${opt.id}`}
							name={`designSurveyReports.${formId}.soilMoistureId`}
							value={opt.id}
							selectedValue={surveyData.soilMoistureId}
							onchange={() => updateSurveyEntries(formId, { soilMoistureId: opt.id })}
							title={opt.title}
							description=""
						/>
					))}
				</div>

				{soilInsight && <InsightBox text={soilInsight} />}
				<ValidationToggle key={formId} formId={formId} sectionKey='soilMoistureId' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
			</div>

			{soilPlantingReadinessOpts.length > 0 && (
				<>
					
					<div
						className="space-y-2"
						data-field={`designSurveyReports.${formId}.soilPlantingReadinessId`}
					>
						{showReadinessNote && (
							<TextInput
								id={`designSurveyReports.${formId}.soilPlantingReadinessNote`}
								label="Catatan Kesiapan Tanah"
								bg="white"
								value={surveyData.soilPlantingReadinessNote ?? ''}
								onInput={(e) =>
									updateSurveyEntries(formId, { soilPlantingReadinessNote: e.target.value })
								}
							/>
						)}
					</div>
				</>
			)}
		</>
	);
}