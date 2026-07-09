// Di-port dari src/lib/survey-form/FormExistingPlant.svelte (project Svelte).
//
// Catatan: pakai field `existingPlantImages/Videos/Documents/CloudStorageUrl`
// milik section ini sendiri (types.ts) — sebelumnya sempat salah pakai key
// `documentation*` yang dipakai bareng FormAreaPhoto/FormSketch/
// FormDocumentationUpload, sehingga upload di satu section ikut muncul di
// section lain (bugfix).
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import Alert from '$lib/Alert';
import UploadFileField from '$lib/components/fields/UploadFileField';
import TextInput from '$lib/input-fields/TextInput';
import { useUploadFileMutation } from '$lib/stores/files';
import { ALLOWED_FILE_EXTS, FILE_CATEGORY, type FileCategory } from '$lib/constants/file';
import { getErrorMessage } from '$lib/utils/error';
import { isValidUrl } from '$lib/utils/url';
import type { NameableFile } from '$types/files';
import type { Stage1FormProps } from './types';

type DocumentationKey = 'existingPlantImages' | 'existingPlantVideos' | 'existingPlantDocuments';

function keyForCategory(category?: FileCategory): DocumentationKey {
	switch (category) {
		case FILE_CATEGORY.DOCUMENT:
			return 'existingPlantDocuments';
		case FILE_CATEGORY.VIDEO:
			return 'existingPlantVideos';
		default:
			return 'existingPlantImages';
	}
}

export default function FormExistingPlant({
	formId,
	surveyData,
	showValidationWarning,
	updateSurveyEntries
}: Stage1FormProps) {
	const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFileMutation();
	const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
	const [uploadError, setUploadError] = useState<string | null>(null);

	const files: NameableFile[] = [
		...(surveyData.existingPlantImages ?? []),
		...(surveyData.existingPlantVideos ?? []),
		...(surveyData.existingPlantDocuments ?? [])
	];

	const showInvalidUrlAlert =
		showValidationWarning &&
		Boolean(surveyData.existingPlantCloudStorageUrl) &&
		!isValidUrl(surveyData.existingPlantCloudStorageUrl);

	async function handleAddFile(e: ChangeEvent<HTMLInputElement>) {
		const eventFiles = e.target.files;
		if (!eventFiles || eventFiles.length === 0) return;
		setUploadError(null);

		for (const file of Array.from(eventFiles)) {
			try {
				const uploaded = await uploadFile({
					fileableType: 'designSurveyReports',
					file,
					type: 'survey_documentation'
				});

				const key = keyForCategory(uploaded.category as FileCategory);
				updateSurveyEntries(formId, {
					[key]: [...(surveyData[key] ?? []), { ...uploaded, name: null }]
				});
			} catch (error) {
				setUploadError(getErrorMessage(error));
			}
		}

		e.target.value = '';
	}

	function handleRemoveFile(fileId: string, category?: FileCategory) {
		const key = keyForCategory(category);
		updateSurveyEntries(formId, {
			[key]: (surveyData[key] ?? []).filter((x) => x.id !== fileId)
		});
	}

	function handleLinkInput(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		updateSurveyEntries(formId, { existingPlantCloudStorageUrl: e.target.value });
	}

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.existingPlantCloudStorageUrl`}>
			<h3 className="font-bold text-neutral-main">Tanaman Existing</h3>
			<p className="text-sm text-neutral-3">Upload Dokumentasi (Foto & Video) bisa lebih dari 1</p>

			<div className="flex text-sm rounded-md h-12">
				<button
					type="button"
					className={`flex flex-1 items-center gap-2 px-4 py-2 justify-center ${
						activeTab === 'upload' ? 'shadow text-primary-main rounded-md' : 'text-neutral-4 bg-gray-100 rounded-l-md'
					}`}
					onClick={() => setActiveTab('upload')}
				>
					<ImagePlus size={14} />
					Upload
				</button>

				<button
					type="button"
					className={`flex flex-1 items-center gap-2 px-4 py-2 justify-center ${
						activeTab === 'link' ? 'shadow text-primary-main rounded-md' : 'text-neutral-4 bg-gray-100 rounded-r-md'
					}`}
					onClick={() => setActiveTab('link')}
				>
					<ImagePlus size={14} />
					Link Drive
				</button>
			</div>

			{showInvalidUrlAlert && <Alert icon="error" message="Url tidak valid" />}
			{uploadError && <Alert icon="error" message={uploadError} />}

			{activeTab === 'upload' ? (
				<UploadFileField
					accept={ALLOWED_FILE_EXTS}
					files={files}
					isLoading={isUploading}
					handleAddFile={handleAddFile}
					handleRemoveFile={handleRemoveFile}
				/>
			) : (
				<TextInput
					label="Link Drive Dokumentasi"
					bg="white"
					onInput={handleLinkInput}
					value={surveyData.existingPlantCloudStorageUrl ?? ''}
				/>
			)}
			<p className="text-xs text-danger-main">*Untuk video atau dokumen lainnya dengan kapasitas besar gunakan Link Drive</p>
		</div>
	);
}
