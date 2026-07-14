// Di-port dari src/lib/survey-form/FormAccess.svelte (project Svelte).
import type { ChangeEvent } from 'react';
import RadioCard from '$lib/components/inputs/RadioCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import InsightBox from './InsightBox';
import FieldSuggestion from './FieldSuggestion';
import { shouldSuggestField, getSuggestionGardenName, getTagTitle } from './fieldSuggestionUtils';
import TextInput from '$lib/input-fields/TextInput';
import Alert from '$lib/Alert';
import UploadFileField from '$lib/components/fields/UploadFileField';
import { useUploadFileMutation } from '$lib/stores/files';
import { ALLOWED_IMAGE_EXTS, type FileCategory } from '$lib/constants/file';
import { TAG_TYPES, TAG } from '$lib/constants/tag';
import type { Stage1FormWithTagsProps } from './types';
import ValidationToggle from './ValidationToggle';

function isOtherGardenAccessTag(tagId: string, title: string): boolean {
	return tagId === TAG.GARDEN_ENTRANCE_ACCESS_OTHER || title.trim().toLowerCase() === 'lainnya';
}

interface FormAccessProps extends Stage1FormWithTagsProps {
	// Upload Foto Akses Masuk Taman cuma tampil & wajib diisi di halaman "Edit
	// Form Survey" (Tahap 2 / Lengkapi Survey) — di Tahap 1 / "Mulai Survey"
	// (isOngoing) section ini disembunyikan total, cuma inputan pilihan akses
	// + catatan yang tampil, konsisten dengan pola `showDetails` di
	// Forminfrastructure.tsx.
	photosRequired?: boolean;
}

export default function FormAccess({
	formId,
	surveyData,
	tags,
	showValidationWarning,
	updateSurveyEntries,
	firstGardenData,
	photosRequired = false
}: FormAccessProps) {
	const homeAccessOpts = tags.filter((tag) => tag.type === TAG_TYPES.ENTRANCE_ACCESS);
	const gardenAccessOpts = tags.filter((tag) => tag.type === TAG_TYPES.GARDEN_ENTRANCE_ACCESS);
	const showHomeAccessSuggestion =
		!!firstGardenData &&
		shouldSuggestField(surveyData.entranceAccessId, firstGardenData.entranceAccessId);
	const showGardenAccessSuggestion =
		!!firstGardenData &&
		shouldSuggestField(surveyData.gardenEntranceAccessId, firstGardenData.gardenEntranceAccessId);

	// "Lainnya" pada Akses Masuk Taman -> tampilkan input catatan supaya
	// surveyor bisa jelaskan rute akses secara manual.
	const selectedGardenAccessTag = gardenAccessOpts.find(
		(t) => t.id === surveyData.gardenEntranceAccessId
	);
	const showGardenAccessOtherNote =
		!!selectedGardenAccessTag &&
		isOtherGardenAccessTag(selectedGardenAccessTag.id, selectedGardenAccessTag.title);

	const homeAccessInsight = (() => {
		if (!surveyData.entranceAccessId) return null;
		const selected = homeAccessOpts.find((t) => t.id === surveyData.entranceAccessId);
		return selected?.technicalNote ?? null;
	})();

	const { mutateAsync: uploadFile, isPending: isUploadingAccessPhoto } = useUploadFileMutation();
	const accessPhotos = surveyData.gardenEntranceAccessPhotos ?? [];

	async function handleAddAccessPhoto(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const uploaded = await Promise.all(
			Array.from(files).map((file) =>
				uploadFile({ fileableType: 'designSurveyReports', file, type: 'garden_entrance_access' })
			)
		);
		updateSurveyEntries(formId, {
			gardenEntranceAccessPhotos: [...accessPhotos, ...uploaded.map((f) => ({ ...f, name: null }))]
		});
		e.target.value = '';
	}

	function handleRemoveAccessPhoto(fileId: string, _category?: FileCategory) {
		void _category;
		updateSurveyEntries(formId, {
			gardenEntranceAccessPhotos: accessPhotos.filter((f) => f.id !== fileId)
		});
	}

	const gardenAccessInsight = (() => {
		if (!surveyData.gardenEntranceAccessId) return null;
		const selected = gardenAccessOpts.find((t) => t.id === surveyData.gardenEntranceAccessId);
		return selected?.technicalNote ?? null;
	})();

	return (
		<>
			{/* Akses ke Rumah */}
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.entranceAccessId`}>
				<div className="flex items-center justify-between relative">
					<p className="font-bold">Akses ke Rumah</p>
					<InfoTooltip text="Perhatikan rute dan akses untuk menentukan kemudahan mobilisasi material" />
				</div>

				{showHomeAccessSuggestion && (
					<FieldSuggestion
						gardenName={getSuggestionGardenName(firstGardenData)}
						value={getTagTitle(homeAccessOpts, firstGardenData!.entranceAccessId)}
						onApply={() =>
							updateSurveyEntries(formId, { entranceAccessId: firstGardenData!.entranceAccessId })
						}
					/>
				)}

				<div className="space-y-2">
					{homeAccessOpts.map((opt) => (
						<RadioCard
							key={opt.id}
							id={`designSurveyReports.${formId}.entranceAccessId.${opt.id}`}
							name={`designSurveyReports.${formId}.entranceAccessId`}
							value={opt.id}
							selectedValue={surveyData.entranceAccessId}
							onchange={() => updateSurveyEntries(formId, { entranceAccessId: opt.id })}
							title={opt.title}
							description=""
						/>
					))}
				</div>

				{homeAccessInsight && <InsightBox text={homeAccessInsight} />}
				<ValidationToggle key={formId} formId={formId} sectionKey='entranceAccessId' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
			</div>

			<hr className="mb-6 border-neutral-border" />

			{/* Akses Masuk Taman */}
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.gardenEntranceAccessId`}>
				<div className="flex items-center justify-between relative">
					<p className="font-bold">Akses Masuk Taman</p>
					<InfoTooltip text="Detail rute akses ke area taman untuk kebutuhan perencanan logistik" />
				</div>

				{showGardenAccessSuggestion && (
					<FieldSuggestion
						gardenName={getSuggestionGardenName(firstGardenData)}
						value={
							getTagTitle(gardenAccessOpts, firstGardenData!.gardenEntranceAccessId) +
							(firstGardenData!.gardenEntranceAccessNote
								? ` — ${firstGardenData!.gardenEntranceAccessNote}`
								: '')
						}
						onApply={() =>
							updateSurveyEntries(formId, {
								gardenEntranceAccessId: firstGardenData!.gardenEntranceAccessId,
								gardenEntranceAccessNote: firstGardenData!.gardenEntranceAccessNote
							})
						}
					/>
				)}

				<div className="space-y-2">
					{gardenAccessOpts.map((opt) => (
						<RadioCard
							key={opt.id}
							id={`designSurveyReports.${formId}.gardenEntranceAccessId.${opt.id}`}
							name={`designSurveyReports.${formId}.gardenEntranceAccessId`}
							value={opt.id}
							selectedValue={surveyData.gardenEntranceAccessId}
							onchange={() => updateSurveyEntries(formId, { gardenEntranceAccessId: opt.id })}
							title={opt.title}
							description=""
						/>
					))}
				</div>

				{showGardenAccessOtherNote && (
					<TextInput
						id={`designSurveyReports.${formId}.gardenEntranceAccessNote`}
						label="Catatan Akses Masuk Taman"
						bg="white"
						value={surveyData.gardenEntranceAccessNote ?? ''}
						onInput={(e) =>
							updateSurveyEntries(formId, {
								gardenEntranceAccessNote: e.target.value === '' ? null : e.target.value
							})
						}
					/>
				)}

				{photosRequired && (
					<div className="space-y-2" data-field={`designSurveyReports.${formId}.gardenEntranceAccessPhotos`}>
						<p className="text-sm font-medium text-neutral-700">
							Foto Akses Masuk Taman
							<span className="text-danger-main"> *</span>
						</p>
						{accessPhotos.length === 0 && showValidationWarning && (
							<Alert icon="error" message="Bagian ini wajib diisi. Silakan lengkapi." />
						)}
						<UploadFileField
							files={accessPhotos}
							isLoading={isUploadingAccessPhoto}
							accept={ALLOWED_IMAGE_EXTS}
							showImageFilename={false}
							handleAddFile={handleAddAccessPhoto}
							handleRemoveFile={handleRemoveAccessPhoto}
						/>
					</div>
				)}

				{gardenAccessInsight && <InsightBox text={gardenAccessInsight} />}
				<ValidationToggle key={formId} formId={formId} sectionKey='gardenEntranceAccessId' surveyData={surveyData} updateSurveyEntries={(formId, updates) => updateSurveyEntries(formId, updates)}/>
			</div>
		</>
	);
}