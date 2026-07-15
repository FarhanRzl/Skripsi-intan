// Di-port dari src/lib/survey-form/FormSketch.svelte (project Svelte).
//
// Catatan: pakai field `sketchImages/Documents/CloudStorageUrl` milik
// section ini sendiri (types.ts, sama seperti FormSketchUpload.tsx) —
// sebelumnya sempat salah pakai key `documentation*` yang dipakai bareng
// FormAreaPhoto/FormExistingPlant/FormDocumentationUpload, sehingga upload
// di satu section ikut muncul di section lain (bugfix).
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

type DocumentationKey = 'sketchImages' | 'sketchDocuments';

function keyForCategory(category?: FileCategory): DocumentationKey {
	switch (category) {
		case FILE_CATEGORY.DOCUMENT:
			return 'sketchDocuments';
		case FILE_CATEGORY.VIDEO:
		default:
			return 'sketchImages';
	}
}

export default function FormSketch({
	formId,
	surveyData,
	showValidationWarning,
	updateSurveyEntries
}: Stage1FormProps) {
	const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFileMutation();
	const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
	const [uploadError, setUploadError] = useState<string | null>(null);

	const files: NameableFile[] = [
		...(surveyData.sketchImages ?? []),
		...(surveyData.sketchDocuments ?? [])
	];

	const showInvalidUrlAlert =
		showValidationWarning &&
		Boolean(surveyData.sketchCloudStorageUrl) &&
		!isValidUrl(surveyData.sketchCloudStorageUrl);

	// Wajib diisi: minimal 1 file (foto/dokumen sketsa) ATAU link Drive,
	// mengikuti referensi schema Svelte asli (design-survey-reports.ts ->
	// DesignSurveyReportInputUpdateSchema, cek sketchImages/sketchDocuments wajib).
	const showRequiredAlert =
		showValidationWarning && files.length === 0 && !surveyData.sketchCloudStorageUrl;

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
		updateSurveyEntries(formId, { sketchCloudStorageUrl: e.target.value });
	}

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.sketchCloudStorageUrl`}>
			<h3 className="font-bold text-neutral-main">Sketch/Gambar</h3>
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

			{showRequiredAlert && (
				<Alert icon="error" message="Bagian ini wajib diisi. Silakan lengkapi." />
			)}
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
					value={surveyData.sketchCloudStorageUrl ?? ''}
				/>
			)}
			{/* <p className="text-xs text-danger-main">*Untuk video atau dokumen lainnya dengan kapasitas besar gunakan Link Drive</p> */}
		</div>
	);
}
