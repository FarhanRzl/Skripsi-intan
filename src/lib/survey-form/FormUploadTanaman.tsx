// Di-port dari src/lib/survey-form/FormUploadTanaman.svelte (project Svelte).
//
// Catatan: field `plantPresences`/`plantPresenceCloudStorageUrl` baru
// ditambahkan ke SurveyFormData (types.ts), belum ada di alur wizard yang
// sudah berjalan. Daftar pilihan tanaman existing (plant list) juga belum
// ada sumber datanya di project ini — lihat catatan di
// UploadItemableImageField.tsx.
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { ImagePlus, Link } from 'lucide-react';
import Alert from '$lib/Alert';
import TextInput from '$lib/input-fields/TextInput';
import UploadItemableImageField from '$lib/components/fields/UploadItemableImageField';
import { useUploadImageMutation } from '$lib/stores/files';
import { getErrorMessage } from '$lib/utils/error';
import { isValidUrl } from '$lib/utils/url';
import { isNumericString } from '$lib/utils/number';
import { sanitizeDecimalInput } from '$lib/utils/input';
import type { Stage1FormProps } from './types';

interface SelectOption {
	value: string;
	label: string;
}

export default function FormUploadTanaman({
	formId,
	surveyData,
	showValidationWarning,
	updateSurveyEntries
}: Stage1FormProps) {
	const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImageMutation();
	const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
	const [uploadError, setUploadError] = useState<string | null>(null);

	const plantPresences = surveyData.plantPresences ?? [];

	const showInvalidUrlAlert =
		showValidationWarning &&
		Boolean(surveyData.plantPresenceCloudStorageUrl) &&
		!isValidUrl(surveyData.plantPresenceCloudStorageUrl);

	// Wajib diisi: minimal 1 tanaman existing ATAU link Drive, mengikuti
	// referensi schema Svelte asli (design-survey-reports.ts ->
	// DesignSurveyReportInputUpdateSchema, cek plantPresences wajib).
	const showRequiredAlert =
		showValidationWarning && plantPresences.length === 0 && !surveyData.plantPresenceCloudStorageUrl;

	async function uploadFile(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		setUploadError(null);

		for (const file of Array.from(files)) {
			try {
				const uploaded = await uploadImage({
					imageableType: 'designSurveyReportPlantPresences',
					file,
					type: 'plant_presence'
				});

				updateSurveyEntries(formId, {
					plantPresences: [
						...plantPresences,
						{ itemName: '', photoId: null, plantId: null, volume: 1, denom: 'unit', photo: uploaded }
					]
				});
			} catch (error) {
				setUploadError(getErrorMessage(error));
			}
		}

		e.target.value = '';
	}

	function onRemove(fileId: string) {
		updateSurveyEntries(formId, {
			plantPresences: plantPresences.filter((data) => data.photo.id !== fileId)
		});
	}

	function onPlusVolume(_e: unknown, fileId: string) {
		updateSurveyEntries(formId, {
			plantPresences: plantPresences.map((data) =>
				data.photo.id !== fileId ? data : { ...data, volume: data.volume + 1 }
			)
		});
	}

	function onMinVolume(_e: unknown, fileId: string) {
		updateSurveyEntries(formId, {
			plantPresences: plantPresences.map((data) =>
				data.photo.id !== fileId ? data : { ...data, volume: Math.max(0, data.volume - 1) }
			)
		});
	}

	function onInputVolume(e: ChangeEvent<HTMLInputElement>, fileId: string) {
		const newVolume = sanitizeDecimalInput(e.target.value);

		updateSurveyEntries(formId, {
			plantPresences: plantPresences.map((data) =>
				data.photo.id !== fileId ? data : { ...data, volume: Number(newVolume) }
			)
		});
	}

	function handleSelectItem(_e: unknown, fileId: string, opt: SelectOption | null) {
		if (!opt) return;
		const isCustom = !isNumericString(opt.value);

		updateSurveyEntries(formId, {
			plantPresences: plantPresences.map((data) =>
				data.photo.id !== fileId
					? data
					: {
							...data,
							itemName: opt.label,
							plantId: isCustom ? null : opt.value,
							customName: isCustom ? opt.label : null
						}
			)
		});
	}

	function handleLinkInput(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		updateSurveyEntries(formId, { plantPresenceCloudStorageUrl: e.target.value });
	}

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.plantPresences`}>
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-neutral-main font-bold">Tanaman Eksisting</h3>
					<p className="text-sm text-neutral-3">Upload Dokumentasi Foto (per item tanaman)</p>
				</div>
			</div>

			<div className="flex text-sm rounded-full bg-gray-100 p-1 h-12">
				<button
					type="button"
					className={`flex flex-1 items-center gap-1.5 px-4 justify-center rounded-full font-semibold transition ${
						activeTab === 'upload' ? 'bg-white text-primary-main shadow' : 'text-neutral-4'
					}`}
					onClick={() => setActiveTab('upload')}
				>
					<ImagePlus size={14} />
					Upload
				</button>

				<button
					type="button"
					className={`flex flex-1 items-center gap-1.5 px-4 justify-center rounded-full font-semibold transition ${
						activeTab === 'link' ? 'bg-white text-primary-main shadow' : 'text-neutral-4'
					}`}
					onClick={() => setActiveTab('link')}
				>
					<Link size={14} />
					Link Drive
				</button>
			</div>

			{showRequiredAlert && (
				<Alert icon="error" message="Bagian ini wajib diisi. Silakan lengkapi." />
			)}
			{showInvalidUrlAlert && <Alert icon="error" message="Url tidak valid" />}
			{uploadError && <Alert icon="error" message={uploadError} />}

			{activeTab === 'upload' ? (
				<UploadItemableImageField
					id={`designSurveyReports.${formId}.plantPresences`}
					isUploading={isUploading}
					itemables={plantPresences}
					nameLabel="Tanaman Eksisting"
					onFileChange={uploadFile}
					onSelectItem={handleSelectItem}
					onRemove={onRemove}
					onPlusVolume={onPlusVolume}
					onMinVolume={onMinVolume}
					onInputVolume={onInputVolume}
				/>
			) : (
				<TextInput
					label="Link Drive Dokumentasi"
					bg="white"
					onInput={handleLinkInput}
					value={surveyData.plantPresenceCloudStorageUrl ?? ''}
				/>
			)}

			<p className="text-xs text-danger-main">* Untuk video dan dokumen lainnya gunakan Link Drive</p>
		</div>
	);
}
