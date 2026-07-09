// Di-port dari src/lib/survey-form/GardenNameForm.svelte (project Svelte).
import type { ChangeEvent } from 'react';
import TextInput from '$lib/input-fields/TextInput';
import FieldSuggestion from './FieldSuggestion';
import { shouldSuggestField, getSuggestionGardenName } from './fieldSuggestionUtils';
import type { Stage1FormProps } from './types';

export default function GardenNameForm({
	formId,
	surveyData,
	updateSurveyEntries,
	firstGardenData
}: Stage1FormProps) {
	const showSuggestion =
		!!firstGardenData && shouldSuggestField(surveyData.gardenName, firstGardenData.gardenName);

	return (
		<div className="flex flex-col space-y-2" data-field={`designSurveyReports.${formId}.gardenName`}>
			{showSuggestion && (
				<FieldSuggestion
					gardenName={getSuggestionGardenName(firstGardenData)}
					value={firstGardenData!.gardenName}
					onApply={() =>
						updateSurveyEntries(formId, { gardenName: firstGardenData!.gardenName })
					}
				/>
			)}
			<TextInput
				id={`designSurveyReports.${formId}.gardenName`}
				name={`designSurveyReports.${formId}.gardenName`}
				label="Nama Taman"
				bg="white"
				required
				value={surveyData.gardenName ?? ''}
				onInput={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
					updateSurveyEntries(formId, { gardenName: e.target.value })
				}
			/>
		</div>
	);
}