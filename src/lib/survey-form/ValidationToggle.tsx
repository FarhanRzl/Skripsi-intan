// Toggle "Memerlukan Validasi ke Klien?" yang muncul di tiap section form
// survey (di bawah Insight ke Designer, kalau ada). Statusnya disimpan per
// section di dalam surveyData.sectionValidations, dikunci oleh `sectionKey`
// (biasanya sama dengan nama field utama section itu, mis. "drainageId").
import type { SurveyFormData } from './types';

interface ValidationToggleProps {
	formId: string;
	sectionKey: string;
	surveyData: SurveyFormData;
	updateSurveyEntries: (formId: string, patch: Partial<SurveyFormData>) => void;
}

export default function ValidationToggle({
	formId,
	sectionKey,
	surveyData,
	updateSurveyEntries
}: ValidationToggleProps) {
	const checked = surveyData.sectionValidations?.[sectionKey] ?? false;

	const handleToggle = () => {
		updateSurveyEntries(formId, {
			sectionValidations: {
				...surveyData.sectionValidations,
				[sectionKey]: !checked
			}
		});
	};

	return (
		<div className={`flex items-center justify-between mt-2 py-2 px-4 border border-neutral-300 rounded-lg ${checked ? 'border-primary-main' : ''}`}>
			<span className="text-xs italic text-black">Memerlukan Validasi ke Klien?</span>
			<button
				type="button"
				onClick={handleToggle}
				className={`relative w-10 rounded-full transition-colors ${
					checked ? 'bg-primary-main' : 'bg-gray-300'
				}`}
				style={{ height: '20px' }}
				aria-pressed={checked}
			>
				<span
					className={`absolute left-0 top-0 h-5 w-5 rounded-full bg-white shadow transition-transform ${
						checked ? 'translate-x-5' : 'translate-x-0'
					}`}
				/>
			</button>
		</div>
	);
}