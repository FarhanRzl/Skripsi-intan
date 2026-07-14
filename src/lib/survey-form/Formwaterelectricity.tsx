// Di-port dari src/lib/survey-form/FormWaterElectricity.svelte (project Svelte).
import RadioCard from '$lib/components/inputs/RadioCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import InsightBox from './InsightBox';
import FieldSuggestion from './FieldSuggestion';
import { shouldSuggestField, getSuggestionGardenName, getTagTitle, isSourceUnavailable } from './fieldSuggestionUtils';
import TextInput from '$lib/input-fields/TextInput';
import Alert from '$lib/Alert';
import { TAG_TYPES } from '$lib/constants/tag';
import type { Stage1FormWithTagsProps } from './types';
import ValidationToggle from './ValidationToggle';

interface FormWaterElectricityProps extends Stage1FormWithTagsProps {
	// Catatan Jarak/Ukuran baru wajib diisi di halaman "Edit Form Survey"
	// (Tahap 2 / Lengkapi Survey) — di Tahap 1 / "Mulai Survey" tetap boleh
	// diisi tapi tidak diwajibkan, konsisten dengan `photosRequired` di
	// Formaccess.tsx.
	notesRequired?: boolean;
}

export default function FormWaterElectricity({
	formId,
	surveyData,
	tags,
	showValidationWarning,
	updateSurveyEntries,
	firstGardenData,
	notesRequired = false
}: FormWaterElectricityProps) {
	const waterSourceOpts = tags.filter((tag) => tag.type === TAG_TYPES.WATER_SOURCE);
	const electricitySourceOpts = tags.filter((tag) => tag.type === TAG_TYPES.ELECTRICITY_SOURCE);

	const selectedWaterTag = waterSourceOpts.find((t) => t.id === surveyData.waterSourceId);
	const showWaterDistanceNote = !!selectedWaterTag && !isSourceUnavailable(selectedWaterTag.id, selectedWaterTag.title);

	const selectedElectricityTag = electricitySourceOpts.find((t) => t.id === surveyData.electricitySourceId);
	const showElectricityDistanceNote =
		!!selectedElectricityTag && !isSourceUnavailable(selectedElectricityTag.id, selectedElectricityTag.title);

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

				{showWaterDistanceNote && (
					<div className="space-y-2" data-field={`designSurveyReports.${formId}.waterSourceDistanceNote`}>
						{notesRequired && !surveyData.waterSourceDistanceNote && showValidationWarning && (
							<Alert icon="error" message="Bagian ini wajib diisi. Silakan lengkapi." />
						)}
						<TextInput
							id={`designSurveyReports.${formId}.waterSourceDistanceNote`}
							label="Catatan Jarak/Ukuran Sumber Air"
							bg="white"
							required={notesRequired}
							value={surveyData.waterSourceDistanceNote ?? ''}
							onInput={(e) =>
								updateSurveyEntries(formId, {
									waterSourceDistanceNote: e.target.value === '' ? null : e.target.value
								})
							}
						/>
					</div>
				)}

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

				{showElectricityDistanceNote && (
					<div className="space-y-2" data-field={`designSurveyReports.${formId}.electricitySourceDistanceNote`}>
						{notesRequired && !surveyData.electricitySourceDistanceNote && showValidationWarning && (
							<Alert icon="error" message="Bagian ini wajib diisi. Silakan lengkapi." />
						)}
						<TextInput
							id={`designSurveyReports.${formId}.electricitySourceDistanceNote`}
							label="Catatan Jarak/Ukuran Sumber Listrik"
							bg="white"
							required={notesRequired}
							value={surveyData.electricitySourceDistanceNote ?? ''}
							onInput={(e) =>
								updateSurveyEntries(formId, {
									electricitySourceDistanceNote: e.target.value === '' ? null : e.target.value
								})
							}
						/>
					</div>
				)}

				{electricityInsight && <InsightBox text={electricityInsight} />}
				<ValidationToggle key={formId} formId={formId} sectionKey='electricitySourceId' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
			</div>
		</>
	);
}