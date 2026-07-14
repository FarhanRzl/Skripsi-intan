// Render SATU pertanyaan Tahap 2, dipakai baik oleh tampilan penuh
// FormAdditionalInfo.tsx maupun pertanyaan tambahan yang di-inject inline ke
// Tahap 1 lewat fitur "Tambah Isian Survey" (lihat AddSurveyQuestionModal.tsx
// & SurveyFormV2.tsx).
//
// Formatnya disamakan dengan komponen Tahap 1 (mis. FormOrientation.tsx):
// InfoTooltip (panduan singkat di sebelah judul), InsightBox ("Insight ke
// Designer" dari technicalNote tag yang dipilih), dan ValidationToggle
// ("Memerlukan Validasi ke Klien?") di akhir section.
import type { ChangeEvent } from 'react';
import TextInput from '$lib/input-fields/TextInput';
import RadioCard from '$lib/components/inputs/RadioCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import Alert from '$lib/Alert';
import InsightBox from './InsightBox';
import ValidationToggle from './ValidationToggle';
import DatePickerField from './DatePickerField';
import type { Tag } from '$types/tags';
import type { Stage2QuestionDef } from './stage2Questions';
import type { SurveyFormData } from './types';
import FormAreaPhoto from './FormAreaPhoto';
import PlantRequestForm from './PlantRequestForm';
import FormDocumentationUpload from './FormDocumentationUpload';
import FormSketch from './FormSketch';
import FormUploadTanaman from './FormUploadTanaman';
import FixedStructureForm from './Forminfrastructure';


interface AdditionalInfoQuestionProps {
	formId: string;
	def: Stage2QuestionDef;
	tags: Tag[];
	surveyData: SurveyFormData;
	showValidationWarning: boolean;
	updateSurveyEntries: (formId: string, patch: Partial<SurveyFormData>) => void;
}

export default function AdditionalInfoQuestion({
	formId,
	def,
	tags,
	surveyData,
	showValidationWarning,
	updateSurveyEntries
}: AdditionalInfoQuestionProps) {
	if (def.key === 'PhotoAreaId') {
  return (
    <FormAreaPhoto
      formId={formId}
      surveyData={surveyData}
      showValidationWarning={showValidationWarning}
      updateSurveyEntries={updateSurveyEntries}
    />
  );
}
	if (def.key === 'existingPlantPhoto') {
  return (
    <FormUploadTanaman
      formId={formId}
      surveyData={surveyData}
      showValidationWarning={showValidationWarning}
      updateSurveyEntries={updateSurveyEntries}
    />
  );
}
	if (def.key === 'sketchPhoto') {
  return (
    <FormSketch
      formId={formId}
      surveyData={surveyData}
      showValidationWarning={showValidationWarning}
      updateSurveyEntries={updateSurveyEntries}
    />
  );
}
	if (def.key === 'otherDocumentation') {
  return (
    <FormDocumentationUpload
      formId={formId}
      surveyData={surveyData}
      showValidationWarning={showValidationWarning}
      updateSurveyEntries={updateSurveyEntries}
    />
  );
}
	if (def.key === 'fixedStructures') {
  return (
    <FixedStructureForm
      formId={formId}
      tags={tags}
      surveyData={surveyData}
      showValidationWarning={showValidationWarning}
      updateSurveyEntries={updateSurveyEntries}
    />
  );
}
	if (def.key === 'plantRequests') {
  return (
    <PlantRequestForm
      formId={formId}
      surveyData={surveyData}
      showValidationWarning={showValidationWarning}
      updateSurveyEntries={updateSurveyEntries}
    />
  );
}
	// "Arah Aliran Air Hujan" — field teks bebas, bukan pilihan tag, jadi tidak
	// bisa lewat alur RadioCard generik di bawah (options-nya akan selalu
	// kosong karena tidak ada tag yang cocok, sehingga tidak ada isian yang
	// muncul sama sekali). Ditulis ke surveyData.rainWaterFlowDirectionNote.
	if (def.key === 'rainWaterFlowDirectionNote') {
		const value = surveyData.rainWaterFlowDirectionNote ?? '';
		return (
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.rainWaterFlowDirectionNote`}>
				<div className="flex items-center justify-between">
					<h3 className="font-bold">
						{def.title}
					</h3>
					{def.tooltip && <InfoTooltip text={def.tooltip} />}
				</div>
				{!value && def.required && showValidationWarning && (
					<Alert icon="error" message="Bagian ini wajib diisi. Silakan lengkapi." />
				)}
				<TextInput
					id={`designSurveyReports.${formId}.rainWaterFlowDirectionNote`}
					label="Tulis arah aliran air hujan"
					placeholder="Contoh: Air mengalir ke arah bangunan dan menyebabkan genangan"
					bg="white"
					required={def.required}
					value={value}
					onInput={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
						updateSurveyEntries(formId, { rainWaterFlowDirectionNote: e.target.value })
					}
				/>
				<ValidationToggle
					key={formId}
					formId={formId}
					sectionKey={def.key}
					surveyData={surveyData}
					updateSurveyEntries={updateSurveyEntries}
				/>
			</div>
		);
	}
	// "Anggaran Pembuatan Taman" — field teks bebas, sama seperti
	// rainWaterFlowDirectionNote di atas. Ditulis ke surveyData.gardenBudgetNote.
	if (def.key === 'gardenBudgetNote') {
		const value = surveyData.gardenBudgetNote ?? '';
		return (
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.gardenBudgetNote`}>
				<div className="flex items-center justify-between">
					<h3 className="font-bold">
						{def.title}
					</h3>
					{def.tooltip && <InfoTooltip text={def.tooltip} />}
				</div>
				{!value && def.required && showValidationWarning && (
					<Alert icon="error" message="Bagian ini wajib diisi. Silakan lengkapi." />
				)}
				<TextInput
					id={`designSurveyReports.${formId}.gardenBudgetNote`}
					label="Tulis ekspektasi anggaran pembuatan taman"
					placeholder="Contoh: Rp 15.000.000 - Rp 20.000.000"
					bg="white"
					required={def.required}
					value={value}
					onInput={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
						updateSurveyEntries(formId, { gardenBudgetNote: e.target.value })
					}
				/>
				<ValidationToggle
					key={formId}
					formId={formId}
					sectionKey={def.key}
					surveyData={surveyData}
					updateSurveyEntries={updateSurveyEntries}
				/>
			</div>
		);
	}
	// "Tanggal Ekspektasi Build" — sama seperti di atas, ini date picker, bukan
	// pilihan tag. Ditulis ke surveyData.expectedGardenBuildDate (per-taman,
	// bukan level order — lihat catatan di types.ts).
	if (def.key === 'expectedGardenBuildDate') {
		const value = surveyData.expectedGardenBuildDate ?? '';
		return (
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.expectedGardenBuildDate`}>
				<div className="flex items-center justify-between">
					<h3 className="font-bold">
						{def.title}
					</h3>
					{def.tooltip && <InfoTooltip text={def.tooltip} />}
				</div>
				{!value && def.required && showValidationWarning && (
					<Alert icon="error" message="Bagian ini wajib diisi. Silakan lengkapi." />
				)}
				<DatePickerField
					value={value}
					onChange={(date) => updateSurveyEntries(formId, { expectedGardenBuildDate: date })}
					placeholder="Pilih tanggal ekspektasi build"
					required={def.required}
				/>
				<p className="text-xs text-primary-main leading-snug">
					*Rekomendasi Build Tercepat : 17 Agustus - 20 Agustus 2026
				</p>
				<ValidationToggle
					key={formId}
					formId={formId}
					sectionKey={def.key}
					surveyData={surveyData}
					updateSurveyEntries={updateSurveyEntries}
				/>
			</div>
		);
	}
	const options = tags.filter((t) => t.type === def.tagType);
	const value = surveyData[def.key];
	const showOtherText = Boolean(def.otherTagId) && value === def.otherTagId;
	const selectedInsight = options.find((opt) => opt.id === value)?.technicalNote ?? null;

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.${def.key}`}>
			<div className="flex items-center justify-between">
				<h3 className="font-bold">
					{def.title}
				</h3>
				{def.tooltip && <InfoTooltip text={def.tooltip} />}
			</div>
			{!value && def.required && showValidationWarning && (
				<Alert icon="error" message="Bagian ini wajib diisi. Silakan lengkapi." />
			)}
			<div className="space-y-2">
				{options.map((opt) => (
					<RadioCard
						key={opt.id}
						id={`designSurveyReports.${formId}.${def.key}.${opt.id}`}
						name={`designSurveyReports.${formId}.${def.key}`}
						value={opt.id}
						selectedValue={value}
						onchange={() =>
							updateSurveyEntries(formId, { [def.key]: opt.id } as Partial<SurveyFormData>)
						}
						title={opt.title}
					/>
				))}
			</div>
			{showOtherText && def.otherTextKey && (
				<TextInput
					id={`designSurveyReports.${formId}.${def.otherTextKey}`}
					label={def.otherTextLabel ?? 'Sebutkan lainnya'}
					bg="white"
					required
					value={(surveyData[def.otherTextKey] as string) ?? ''}
					onInput={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
						updateSurveyEntries(formId, {
							[def.otherTextKey as string]: e.target.value
						} as Partial<SurveyFormData>)
					}
				/>
			)}
			{selectedInsight && <InsightBox text={selectedInsight} iconSize={25} />}
			<ValidationToggle
				key={formId}
				formId={formId}
				sectionKey={def.key}
				surveyData={surveyData}
				updateSurveyEntries={updateSurveyEntries}
			/>
		</div>
	);
}