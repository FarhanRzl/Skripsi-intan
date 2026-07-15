// Di-port dari src/lib/survey-form/FormDocumentationUpload.svelte (project Svelte).
//
// Catatan: field `documentationImages/Videos/Documents/CloudStorageUrl` baru
// ditambahkan ke SurveyFormData (types.ts), belum ada di alur wizard yang
// sudah berjalan.
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

type DocumentationKey = 'documentationImages' | 'documentationVideos' | 'documentationDocuments';

function keyForCategory(category?: FileCategory): DocumentationKey {
	switch (category) {
		case FILE_CATEGORY.DOCUMENT:
			return 'documentationDocuments';
		case FILE_CATEGORY.VIDEO:
			return 'documentationVideos';
		default:
			return 'documentationImages';
	}
}

export default function FormDocumentationUpload({
	formId,
	surveyData,
	showValidationWarning,
	updateSurveyEntries
}: Stage1FormProps) {
	const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFileMutation();
	const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
	const [uploadError, setUploadError] = useState<string | null>(null);

	const files: NameableFile[] = [
		...(surveyData.documentationImages ?? []),
		...(surveyData.documentationVideos ?? []),
		...(surveyData.documentationDocuments ?? [])
	];

	const showInvalidUrlAlert =
		showValidationWarning &&
		Boolean(surveyData.documentationCloudStorageUrl) &&
		!isValidUrl(surveyData.documentationCloudStorageUrl);

	async function handleAddFile(e: ChangeEvent<HTMLInputElement>) {
		const eventFiles = e.target.files;
		if (!eventFiles || eventFiles.length === 0) return;
		setUploadError(null);

		// Upload semua file SEKALIGUS lalu gabung jadi SATU updateSurveyEntries
		// di akhir — kalau tiap file langsung updateSurveyEntries di dalam loop
		// (kode lama), tiap panggilan masih baca `surveyData` dari closure lama
		// (props belum ke-refresh di antara await), jadi upload berikutnya
		// menimpa hasil upload sebelumnya ("ketumpuk", cuma foto terakhir yang
		// tersimpan).
		const results = await Promise.allSettled(
			Array.from(eventFiles).map((file) =>
				uploadFile({ fileableType: 'designSurveyReports', file, type: 'survey_documentation' })
			)
		);

		const patch: Partial<Record<DocumentationKey, NameableFile[]>> = {};
		let firstError: string | null = null;
		for (const result of results) {
			if (result.status === 'fulfilled') {
				const key = keyForCategory(result.value.category as FileCategory);
				const base = patch[key] ?? surveyData[key] ?? [];
				patch[key] = [...base, { ...result.value, name: null }];
			} else if (!firstError) {
				firstError = getErrorMessage(result.reason);
			}
		}

		if (Object.keys(patch).length > 0) updateSurveyEntries(formId, patch);
		if (firstError) setUploadError(firstError);

		e.target.value = '';
	}

	function handleRemoveFile(fileId: string, category?: FileCategory) {
		const key = keyForCategory(category);
		updateSurveyEntries(formId, {
			[key]: (surveyData[key] ?? []).filter((x) => x.id !== fileId)
		});
	}

	function handleLinkInput(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		updateSurveyEntries(formId, { documentationCloudStorageUrl: e.target.value });
	}

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.documentationCloudStorageUrl`}>
			<h3 className="font-bold text-neutral-main">Dokumentasi Lainnya</h3>
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
					value={surveyData.documentationCloudStorageUrl ?? ''}
				/>
			)}
			<p className="text-xs text-danger-main">*Untuk video atau dokumen lainnya dengan kapasitas besar gunakan Link Drive</p>
		</div>
	);
}
