// Di-port dari src/lib/survey-form/FormAreaPhoto.svelte (project Svelte).
//
// Catatan: pakai field `areaPhotoImages/Videos/Documents/CloudStorageUrl`
// milik section ini sendiri (types.ts) — sebelumnya sempat salah pakai key
// `documentation*` yang dipakai bareng FormExistingPlant/FormSketch/
// FormDocumentationUpload, sehingga upload di satu section ikut muncul di
// section lain (bugfix).
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import Alert from '$lib/Alert';
import UploadFileBox from '$lib/components/inputs/UploadFileBox';
import UploadedNamedImageRow from '$lib/components/inputs/UploadedNamedImageRow';
import UploadedVideo from '$lib/components/inputs/UploadedVideo';
import UploadedDocument from '$lib/components/inputs/UploadedDocument';
import TextInput from '$lib/input-fields/TextInput';
import { useUploadFileMutation } from '$lib/stores/files';
import { ALLOWED_FILE_EXTS, FILE_CATEGORY, type FileCategory } from '$lib/constants/file';
import { getErrorMessage } from '$lib/utils/error';
import { isValidUrl } from '$lib/utils/url';
import type { Stage1FormProps } from './types';

type DocumentationKey = 'areaPhotoImages' | 'areaPhotoVideos' | 'areaPhotoDocuments';

function keyForCategory(category?: FileCategory): DocumentationKey {
	switch (category) {
		case FILE_CATEGORY.DOCUMENT:
			return 'areaPhotoDocuments';
		case FILE_CATEGORY.VIDEO:
			return 'areaPhotoVideos';
		default:
			return 'areaPhotoImages';
	}
}

export default function FormAreaPhoto({
	formId,
	surveyData,
	showValidationWarning,
	updateSurveyEntries
}: Stage1FormProps) {
	const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFileMutation();
	const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
	const [uploadError, setUploadError] = useState<string | null>(null);

	const images = surveyData.areaPhotoImages ?? [];
	const videos = surveyData.areaPhotoVideos ?? [];
	const documents = surveyData.areaPhotoDocuments ?? [];
	const totalFiles = images.length + videos.length + documents.length;

	function handleInputImageName(fileId: string, value: string) {
		updateSurveyEntries(formId, {
			areaPhotoImages: images.map((img) => (img.id !== fileId ? img : { ...img, name: value }))
		});
	}

	const showInvalidUrlAlert =
		showValidationWarning &&
		Boolean(surveyData.areaPhotoCloudStorageUrl) &&
		!isValidUrl(surveyData.areaPhotoCloudStorageUrl);

	// Wajib diisi: minimal 1 file (foto/video/dokumen) ATAU link Drive,
	// mengikuti referensi schema Svelte asli (design-survey-reports.ts ->
	// DesignSurveyReportInputUpdateSchema, cek areaPhotos wajib).
	const showRequiredAlert =
		showValidationWarning && totalFiles === 0 && !surveyData.areaPhotoCloudStorageUrl;

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
		updateSurveyEntries(formId, { areaPhotoCloudStorageUrl: e.target.value });
	}

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.areaPhotoCloudStorageUrl`}>
			<h3 className="font-bold text-neutral-main">Foto Area</h3>
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
				<div className="space-y-4">
					{totalFiles > 0 && (
						<div className="space-y-3">
							{images.map((file) => (
								<UploadedNamedImageRow
									key={file.id}
									file={file}
									nameLabel="Nama Area"
									onNameChange={(value) => handleInputImageName(file.id, value)}
									handleRemove={() => handleRemoveFile(file.id, file.category as FileCategory)}
								/>
							))}
							{videos.map((file) => (
								<UploadedVideo
									key={file.id}
									file={file}
									handleRemove={() => handleRemoveFile(file.id, file.category as FileCategory)}
								/>
							))}
							{documents.map((file) => (
								<UploadedDocument
									key={file.id}
									file={file}
									handleRemove={() => handleRemoveFile(file.id, file.category as FileCategory)}
								/>
							))}
						</div>
					)}

					{isUploading ? (
						<div className="flex items-center justify-center py-6">
							<div className="w-8 h-8 border-4 border-primary-main border-t-transparent rounded-full animate-spin" />
						</div>
					) : totalFiles === 0 ? (
						// Belum ada file — tampilan sama dengan field upload lain
						// (Tanaman Existing, Sketch/Gambar, dst).
						<UploadFileBox accept={ALLOWED_FILE_EXTS} multiple onchange={handleAddFile} />
					) : (
						// Sudah ada file — tombol "Tambah File/Gambar" sesuai desain.
						<label className="flex items-center justify-center gap-1 w-full border-2 border-primary-main rounded-xl py-3 cursor-pointer hover:bg-primary-surface/40 transition">
							<ImagePlus size={22} className="text-primary-main mt-1" />
							<span className="text-sm font-bold text-primary-main mt-1">Tambah File/Gambar</span>
							<input
								type="file"
								accept={ALLOWED_FILE_EXTS.join(',')}
								className="hidden"
								multiple
								onChange={handleAddFile}
							/>
						</label>
					)}
				</div>
			) : (
				<TextInput
					label="Link Drive Dokumentasi"
					bg="white"
					onInput={handleLinkInput}
					value={surveyData.areaPhotoCloudStorageUrl ?? ''}
				/>
			)}
			{/* <p className="text-xs text-danger-main">*Untuk video atau dokumen lainnya dengan kapasitas besar gunakan Link Drive</p> */}
		</div>
	);
}