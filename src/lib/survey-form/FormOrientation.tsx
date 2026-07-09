// Di-port dari src/lib/survey-form/FormOrientation.svelte (project Svelte).
import CheckboxCard from '$lib/components/inputs/CheckboxCard';
import RadioCard from '$lib/components/inputs/RadioCard';
import { TAG_TYPES } from '$lib/constants/tag';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import InsightBox from './InsightBox';
import FieldSuggestion from './FieldSuggestion';
import { shouldSuggestField, getSuggestionGardenName, getTagTitle, formatTimeList } from './fieldSuggestionUtils';
import type { Stage1FormWithTagsProps } from './types';
import ValidationToggle from './ValidationToggle';

const SUN_EXPOSURE_TIME_OPTS = [
	'07.00',
	'08.00',
	'09.00',
	'10.00',
	'11.00',
	'12.00',
	'13.00',
	'14.00',
	'15.00',
	'16.00',
	'17.00',
	'18.00'
];

export default function FormOrientation({
	formId,
	surveyData,
	tags,
	updateSurveyEntries,
	firstGardenData
}: Stage1FormWithTagsProps) {
	const sunExposureObstructionTags = tags.filter((tag) => tag.type === TAG_TYPES.SUN_EXPOSURE_OBSTRUCTION);

	const showTimeSuggestion =
		!!firstGardenData &&
		shouldSuggestField(surveyData.areaSunExposureTimes, firstGardenData.areaSunExposureTimes);
	const showObstructionSuggestion =
		!!firstGardenData &&
		shouldSuggestField(surveyData.sunExposureObstructionId, firstGardenData.sunExposureObstructionId);

	function toggleTime(time: string) {
		const current: string[] = surveyData.areaSunExposureTimes || [];
		const areaSunExposureTimes = current.includes(time)
			? current.filter((t) => t !== time)
			: [...current, time];
		updateSurveyEntries(formId, { areaSunExposureTimes });
	}

	// Insight: muncul jika minimal 1 waktu dipilih
	const sunTimeInsight = (() => {
		const times: string[] = surveyData.areaSunExposureTimes || [];
		if (!times.length) return null;
		const hours = times.map((t) => parseInt(t)).sort((a, b) => a - b);
		if (hours.length >= 8)
			return 'Area terbuka penuh dengan paparan >8 jam/hari. Rekomendasi Tanaman: Agave, Kaktus, dan Bougenvile.';
		if (hours.length >= 5) return 'Paparan sedang 5–8 jam/hari. Cocok untuk tanaman semi-tropis dan herba.';
		return 'Paparan minim <5 jam/hari. Rekomendasi tanaman toleran naungan seperti Pakis, Sirih Gading.';
	})();

	// Insight: dari technicalNote tag yang dipilih
	const obstructionInsight = (() => {
		if (!surveyData.sunExposureObstructionId) return null;
		const selected = sunExposureObstructionTags.find((t) => t.id === surveyData.sunExposureObstructionId);
		return selected?.technicalNote ?? null;
	})();

	return (
		<>
			{/* Waktu Pencahayaan */}
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.areaSunExposureTimes`}>
				<div className="flex items-center justify-between">
					<h3 className="font-bold">Waktu Pencahayaan</h3>
					<InfoTooltip text="Evaluasi intensitas cahaya dan pertimbangkan bayangan dari bangunan/pohon existing. Cek bayangan: tegas = terang, samar = sedang, tidak ada = minim" />
				</div>
				<p className="text-sm text-neutral-500">Pilih jam-jam ketika taman terkena sinar matahari.</p>

				{showTimeSuggestion && (
					<FieldSuggestion
						gardenName={getSuggestionGardenName(firstGardenData)}
						value={formatTimeList(firstGardenData!.areaSunExposureTimes)}
						onApply={() =>
							updateSurveyEntries(formId, {
								areaSunExposureTimes: [...firstGardenData!.areaSunExposureTimes]
							})
						}
					/>
				)}

				<div className="grid grid-cols-3 gap-2">
					{SUN_EXPOSURE_TIME_OPTS.map((opt) => (
						<CheckboxCard
							key={opt}
							id={`designSurveyReports.${formId}.areaSunExposureTimes.${opt}`}
							name={`designSurveyReports.${formId}.areaSunExposureTimes`}
							value={opt}
							selectedValues={surveyData.areaSunExposureTimes || []}
							onclick={() => toggleTime(opt)}
							title={opt}
							description=""
						/>
					))}
				</div>

				{sunTimeInsight && <InsightBox text={sunTimeInsight} iconSize={25} />}
				<ValidationToggle key={formId} formId={formId} sectionKey='areaSunExposureTimes' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
			</div>

			<hr className="mb-6 border-neutral-border" />

			{/* Dinding terhadap Pencahayaan */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<h3 className="font-bold">Dinding terhadap Pencahayaan</h3>
					<InfoTooltip text="Cek apakah ada dinding atau bangunan yang menghalangi cahaya matahari masuk ke taman. Perhatikan tinggi dinding dan arah condong taman (misal Barat–Utara condong ke Barat)." />
				</div>

				<div className="space-y-2" data-field={`designSurveyReports.${formId}.sunExposureObstructionId`}>
					{showObstructionSuggestion && (
						<FieldSuggestion
							gardenName={getSuggestionGardenName(firstGardenData)}
							value={getTagTitle(sunExposureObstructionTags, firstGardenData!.sunExposureObstructionId)}
							onApply={() =>
								updateSurveyEntries(formId, {
									sunExposureObstructionId: firstGardenData!.sunExposureObstructionId
								})
							}
						/>
					)}
					{sunExposureObstructionTags.map((opt) => (
						<RadioCard
							key={opt.id}
							id={`designSurveyReports.${formId}.sunExposureObstructionId-${opt.id}`}
							name={`designSurveyReports.${formId}.sunExposureObstructionId`}
							value={opt.id}
							selectedValue={surveyData.sunExposureObstructionId}
							onchange={() => updateSurveyEntries(formId, { sunExposureObstructionId: opt.id })}
							title={opt.title}
							description=""
						/>
					))}
				</div>

				{obstructionInsight && <InsightBox text={obstructionInsight} iconSize={25} />}
				<ValidationToggle key={formId} formId={formId} sectionKey='sunExposureObstructionId' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
			</div>
		</>
	);
}