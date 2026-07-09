// Di-port dari src/lib/survey-form/GardenAreaForm.svelte (project Svelte).
import type { ChangeEvent } from 'react';
import TextInput from '$lib/input-fields/TextInput';
import FieldSuggestion from './FieldSuggestion';
import { shouldSuggestField, getSuggestionGardenName } from './fieldSuggestionUtils';
import type { Stage1FormProps } from './types';

interface GardenAreaFormProps extends Stage1FormProps {
	sizeCategory: string | number;
}

export default function GardenAreaForm({
	formId,
	surveyData,
	sizeCategory,
	updateSurveyEntries,
	firstGardenData
}: GardenAreaFormProps) {
	const showSuggestion =
		!!firstGardenData && shouldSuggestField(surveyData.areaSize, firstGardenData.areaSize);

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.areaSize`}>
			{showSuggestion && (
				<FieldSuggestion
					gardenName={getSuggestionGardenName(firstGardenData)}
					value={`${firstGardenData!.areaSize} m²`}
					onApply={() => updateSurveyEntries(formId, { areaSize: firstGardenData!.areaSize })}
				/>
			)}
			<TextInput
				id={`designSurveyReports.${formId}.areaSize`}
				name={`designSurveyReports.${formId}.areaSize`}
				label="Ukuran Aktual Taman"
				type="tel"
				bg="white"
				required
				value={surveyData.areaSize ?? ''}
				onInput={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
					updateSurveyEntries(formId, { areaSize: e.target.value })
				}
			/>

			<div className="flex justify-between text-primary-main text-xs">
				<p>
					Estimasi Luas Area dari Klien (m<sup>2</sup>)
				</p>
				<p>
					{sizeCategory} m<sup>2</sup>
				</p>
			</div>
		</div>
	);
}