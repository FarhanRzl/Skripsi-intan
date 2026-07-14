// Di-port dari src/lib/survey-form/FormLandPreparation.svelte (project Svelte).
import CheckboxCard from '$lib/components/inputs/CheckboxCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import InsightBox from './InsightBox';
import FieldSuggestion from './FieldSuggestion';
import TextInput from '$lib/input-fields/TextInput';
import { shouldSuggestField, getSuggestionGardenName, getTagTitles } from './fieldSuggestionUtils';
import { TAG_TYPES } from '$lib/constants/tag';
import type { LandPreparationEntry, Stage1FormWithTagsProps } from './types';
import ValidationToggle from './ValidationToggle';

export default function FormLandPreparation({
	formId,
	surveyData,
	tags,
	updateSurveyEntries,
	firstGardenData
}: Stage1FormWithTagsProps) {
	const landPreparationOpts = tags.filter((tag) => tag.type === TAG_TYPES.LAND_PREPARATION);
	const selectedIds = surveyData.landPreparations?.map((lp) => lp.landPreparationId) ?? [];
	const showSuggestion =
		!!firstGardenData &&
		shouldSuggestField(surveyData.landPreparations, firstGardenData.landPreparations);

	// Salin entri sebagai laporan BARU (id: null) — landPreparations Taman 1
	// mungkin sudah punya id record sendiri yang tidak relevan untuk taman ini.
	function applyLandPreparationSuggestion() {
		if (!firstGardenData) return;
		const cloned = firstGardenData.landPreparations.map((lp) => ({
			id: null,
			landPreparationId: lp.landPreparationId,
			surveyorNote: lp.surveyorNote
		}));
		updateSurveyEntries(formId, { landPreparations: cloned });
	}

	function toggleLand(id: string) {
		let landPreparations = surveyData.landPreparations ?? [];

		if (landPreparations.some((lp) => lp.landPreparationId === id)) {
			landPreparations = landPreparations.filter((lp) => lp.landPreparationId !== id);
		} else {
			landPreparations = [...landPreparations, { id: null, landPreparationId: id, surveyorNote: null }];
		}

		updateSurveyEntries(formId, { landPreparations });
	}

	// Catatan detail per opsi yang dipilih (mis. lokasi puing, seberapa parah
	// gulmanya) — termasuk utk opsi "Tidak Diketahui", supaya surveyor tetap
	// bisa mencatat kenapa kondisinya belum diketahui.
	function patchLandNote(id: string, surveyorNote: string) {
		const landPreparations = (surveyData.landPreparations ?? []).map((lp) =>
			lp.landPreparationId === id ? { ...lp, surveyorNote: surveyorNote === '' ? null : surveyorNote } : lp
		);
		updateSurveyEntries(formId, { landPreparations });
	}

	const landInsight = (() => {
		const selected = surveyData.landPreparations ?? [];
		if (!selected.length) return null;
		const notes = selected
			.map((lp) => landPreparationOpts.find((o) => o.id === lp.landPreparationId)?.technicalNote)
			.filter(Boolean);
		return notes.length ? notes.join(' ') : null;
	})();

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.landPreparations`}>
			<div className="flex items-center justify-between">
				<h3 className="font-bold">Kebutuhan Pengolahan Lahan</h3>
				<InfoTooltip text="Cek kondisi tanah selain perkerasan apabila memungkinkan" />
			</div>
			<p className="text-sm text-neutral-500">Kondisi bisa pilih lebih dari satu</p>

			{showSuggestion && (
				<FieldSuggestion
					gardenName={getSuggestionGardenName(firstGardenData)}
					value={getTagTitles(
						landPreparationOpts,
						(firstGardenData?.landPreparations ?? []).map((lp) => lp.landPreparationId)
					)}
					onApply={applyLandPreparationSuggestion}
				/>
			)}

			<div className="space-y-2">
				{landPreparationOpts.map((opt) => {
					const entry: LandPreparationEntry | undefined = (surveyData.landPreparations ?? []).find(
						(lp) => lp.landPreparationId === opt.id
					);
					return (
						<div key={opt.id} className="space-y-2">
							<CheckboxCard
								id={`designSurveyReports.${formId}.landPreparations.${opt.id}`}
								name={`designSurveyReports.${formId}.landPreparations`}
								value={opt.id}
								selectedValues={selectedIds}
								onclick={() => toggleLand(opt.id)}
								title={opt.title}
								description=""
							/>
							{entry && (
								<TextInput
									id={`designSurveyReports.${formId}.landPreparations.${opt.id}.surveyorNote`}
									label={`Catatan Detail — ${opt.title}`}
									type="textarea"
									bg="white"
									value={entry.surveyorNote ?? ''}
									onInput={(e) => patchLandNote(opt.id, e.target.value)}
								/>
							)}
						</div>
					);
				})}
			</div>

			{landInsight && <InsightBox text={landInsight} />}
			<ValidationToggle key={formId} formId={formId} sectionKey='landPreparations' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
		</div>
	);
}