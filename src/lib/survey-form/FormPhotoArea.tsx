// Di-port dari src/lib/survey-form/FormPhotoArea.svelte (project Svelte).
//
// Catatan: field `areaPhotos` baru ditambahkan ke SurveyFormData (types.ts),
// belum ada di alur wizard Tahap 1/Tahap 2 yang sudah berjalan — lihat
// catatan integrasi di FormAdditionalInfo.tsx & SurveyFormV2.tsx.
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Alert from '$lib/Alert';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import UploadNameableImageField from '$lib/components/fields/UploadNameableImageField';
import { useUploadImageMutation } from '$lib/stores/files';
import { isValidImage } from '$lib/utils/file';
import { getErrorMessage } from '$lib/utils/error';
import type { Stage1FormProps } from './types';

export default function FormPhotoArea({
	formId,
	surveyData,
	updateSurveyEntries
}: Stage1FormProps) {
	const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImageMutation();
	const [uploadError, setUploadError] = useState<string | null>(null);

	async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		setUploadError(null);

		for (const file of Array.from(files)) {
			try {
				if (isValidImage(file)) {
					const uploaded = await uploadImage({
						imageableType: 'designSurveyReportAreaPhotos',
						file,
						type: 'area_photo'
					});

					updateSurveyEntries(formId, {
						areaPhotos: [
							...(surveyData.areaPhotos ?? []),
							{ areaName: null, photoId: null, photo: { ...uploaded, name: null } }
						]
					});
				}
			} catch (error) {
				setUploadError(getErrorMessage(error));
			}
		}

		e.target.value = '';
	}

	function removePhoto(id: string) {
		updateSurveyEntries(formId, {
			areaPhotos: (surveyData.areaPhotos ?? []).filter((data) => data.photo?.id !== id)
		});
	}

	function handleInputName(e: ChangeEvent<HTMLInputElement>, id: string) {
		if (!surveyData.areaPhotos) return;

		updateSurveyEntries(formId, {
			areaPhotos: surveyData.areaPhotos.map((data) =>
				data.photo?.id !== id ? data : { ...data, photo: { ...data.photo, name: e.target.value } }
			)
		});
	}

	return (
		<div className="relative space-y-2" data-field={`designSurveyReports.${formId}.areaPhotos`}>
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-neutral-main font-bold">Foto Area</h3>
					<p className="text-sm text-neutral-3">Upload Dokumentasi bisa lebih dari 1</p>
				</div>
				<InfoTooltip text="Angle foto akan digunakan menjadi patokan designer dan gardener saat mengunggah dokumentasi untuk ensiklopedia" />
			</div>

			{uploadError && <Alert icon="error" message={uploadError} />}

			<div>
				<UploadNameableImageField
					id={`designSurveyReports.${formId}.areaPhotos`}
					images={surveyData.areaPhotos?.map((x) => x.photo) ?? []}
					nameLabel="Nama Area"
					isLoading={isUploading}
					onFileChange={handleFileUpload}
					onRemove={removePhoto}
					onInputName={handleInputName}
				/>
			</div>
		</div>
	);
}
