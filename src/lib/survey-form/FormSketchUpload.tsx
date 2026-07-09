// Di-port dari src/lib/survey-form/FormSketchUpload.svelte (project Svelte).
//
// Catatan: field `sketchImages`/`sketchDocuments` baru ditambahkan ke
// SurveyFormData (types.ts), belum ada di alur wizard yang sudah berjalan.
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Alert from '$lib/Alert';
import UploadFileField from '$lib/components/fields/UploadFileField';
import { useUploadFileMutation } from '$lib/stores/files';
import { ALLOWED_DOCUMENT_EXTS, ALLOWED_IMAGE_EXTS, FILE_CATEGORY, type FileCategory } from '$lib/constants/file';
import { getErrorMessage } from '$lib/utils/error';
import type { Stage1FormProps } from './types';

export default function FormSketchUpload({
	formId,
	surveyData,
	updateSurveyEntries
}: Stage1FormProps) {
	const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFileMutation();
	const [uploadError, setUploadError] = useState<string | null>(null);

	const files = [...(surveyData.sketchImages ?? []), ...(surveyData.sketchDocuments ?? [])];

	async function handleAddFile(e: ChangeEvent<HTMLInputElement>) {
		const eventFiles = e.target.files;
		if (!eventFiles || eventFiles.length === 0) return;
		setUploadError(null);

		for (const file of Array.from(eventFiles)) {
			try {
				const uploaded = await uploadFile({ fileableType: 'designSurveyReports', file, type: 'sketch' });

				if (uploaded.category === FILE_CATEGORY.IMAGE) {
					updateSurveyEntries(formId, {
						sketchImages: [...(surveyData.sketchImages ?? []), { ...uploaded, name: null }]
					});
				} else if (uploaded.category === FILE_CATEGORY.DOCUMENT) {
					updateSurveyEntries(formId, {
						sketchDocuments: [...(surveyData.sketchDocuments ?? []), { ...uploaded, name: null }]
					});
				}
			} catch (error) {
				setUploadError(getErrorMessage(error));
			}
		}

		e.target.value = '';
	}

	function handleRemoveFile(fileId: string, category?: FileCategory) {
		if (category === FILE_CATEGORY.IMAGE) {
			updateSurveyEntries(formId, {
				sketchImages: (surveyData.sketchImages ?? []).filter((x) => x.id !== fileId)
			});
		}

		if (category === FILE_CATEGORY.DOCUMENT) {
			updateSurveyEntries(formId, {
				sketchDocuments: (surveyData.sketchDocuments ?? []).filter((x) => x.id !== fileId)
			});
		}
	}

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.sketchImages`}>
			<h3 className="font-bold text-nuetral-main">Sketch/Gambar</h3>
			<p className="text-neutral-3 text-sm">Upload sketch/gambar lebih dari 1</p>

			{uploadError && <Alert icon="error" message={uploadError} />}

			<UploadFileField
				accept={[...ALLOWED_IMAGE_EXTS, ...ALLOWED_DOCUMENT_EXTS]}
				files={files}
				isLoading={isUploading}
				handleAddFile={handleAddFile}
				handleRemoveFile={handleRemoveFile}
			/>
		</div>
	);
}
