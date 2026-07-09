// Di-port dari src/lib/survey-form/FormRainGutter.svelte (project Svelte).
//
// Catatan: `rainGutterNeedId` sudah ditangani generik lewat
// AdditionalInfoQuestion.tsx + stage2Questions.ts ("Kebutuhan Talang Air").
// Source Svelte ini menambahkan bagian "Arah Aliran Air Hujan"
// (`rainWaterFlowDirectionNote`) yang belum ada di versi generik — sudah
// ditambahkan ke SurveyFormData (types.ts). Komponen literal ini disediakan
// untuk paritas 1:1, TIDAK dipasang ganda di FormAdditionalInfo.tsx.
import type { ChangeEvent } from 'react';
import RadioCard from '$lib/components/inputs/RadioCard';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import TextInput from '$lib/input-fields/TextInput';
import { TAG_TYPES } from '$lib/constants/tag';
import type { Stage1FormWithTagsProps } from './types';

const RAIN_FLOW_DIRECTION_TOOLTIP = `
	<p class="font-semibold text-gray-800 mb-1">Arah Aliran :</p>
	<ul class="list-disc list-inside">
		<li>Penting untuk design drainage system</li>
		<li>Kanopi turun, talang air keluar</li>
		<li>Pastikan air mengalir <b>KELUAR</b> dari area tanam</li>
		<li>Test dengan menuang air saat survey</li>
	</ul>
`;

export default function FormRainGutter({
	formId,
	surveyData,
	tags,
	updateSurveyEntries
}: Stage1FormWithTagsProps) {
	const gutterOpts = tags.filter((tag) => tag.type === TAG_TYPES.RAIN_GUTTER_NEED);

	return (
		<>
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.rainWaterFlowDirectionNote`}>
				<div className="flex items-center justify-between mb-2">
					<h3 className="font-bold">Arah Aliran Air Hujan</h3>
					<InfoTooltip text={RAIN_FLOW_DIRECTION_TOOLTIP} />
				</div>

				<label
					htmlFor={`rain-water-flow-direction-note-${formId}`}
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					Tulis arah aliran air hujan (Contoh isian: Air mengalir ke arah bangunan dan menyebabkan genangan; Air
					mengalir ke arah selokan)
				</label>
				<TextInput
					id={`rain-water-flow-direction-note-${formId}`}
					bg="white"
					label="Arah aliran air hujan"
					value={surveyData.rainWaterFlowDirectionNote ?? ''}
					onInput={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
						updateSurveyEntries(formId, { rainWaterFlowDirectionNote: e.target.value })
					}
				/>
			</div>

			<div className="space-y-2" data-field={`designSurveyReports.${formId}.rainGutterNeedId`}>
				<div className="flex items-center justify-between mb-2">
					<h3 className="font-bold">Kebutuhan Talang Air</h3>
					<InfoTooltip text="Cek apakah area butuh talang tambahan berdasarkan arah aliran air" />
				</div>

				<div className="space-y-2">
					{gutterOpts.map((opt) => (
						<RadioCard
							key={opt.id}
							id={`designSurveyReports.${formId}.rainGutterNeedId.${opt.id}`}
							name={`designSurveyReports.${formId}.rainGutterNeedId`}
							value={opt.id}
							selectedValue={surveyData.rainGutterNeedId}
							onchange={() => updateSurveyEntries(formId, { rainGutterNeedId: opt.id })}
							title={opt.title}
							description={opt.technicalNote ?? ''}
						/>
					))}
				</div>
			</div>
		</>
	);
}
