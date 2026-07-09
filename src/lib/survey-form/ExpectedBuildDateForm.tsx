// Di-port dari src/lib/survey-form/ExpectedBuildDateForm.svelte (project Svelte).
//
// ⚠️ Beda dengan komponen Form* lain di folder ini, komponen ini bekerja di
// atas `orderDesignData` (data level ORDER), bukan `surveyData` per-taman.
// Konsep ini belum ada sama sekali di project React ini — lihat
// `OrderDesignData` & `ExpectedBuildDateFormProps` (types.ts) yang masih
// placeholder. Perlu disambungkan ke context/API order yang sebenarnya
// sebelum dipakai di production.
//
// Catatan lain: Calendar.svelte asli punya props `value`/`action`/`label`;
// Calendar.tsx yang sudah ada di project ini ($lib/Calendar, bukan
// $lib/input-fields/Calendar) API-nya beda (`selectedDate`/
// `onSelectedDateChange`, tanpa `label`) — jadi label ditaruh manual di atas
// komponen Calendar di bawah ini.
import Calendar from '$lib/Calendar';
import Alert from '$lib/Alert';
import type { ExpectedBuildDateFormProps } from './types';

export default function ExpectedBuildDateForm({
	formId,
	orderDesignData,
	showValidationWarning,
	updateOrderDesignData
}: ExpectedBuildDateFormProps) {
	const selectedDate = orderDesignData?.expectedGardenBuildStartDates?.[formId] ?? '';

	function handlePicked(date: string) {
		const expectedGardenBuildStartDates = [...(orderDesignData.expectedGardenBuildStartDates ?? [])];
		expectedGardenBuildStartDates[formId] = date;
		updateOrderDesignData(formId, { expectedGardenBuildStartDates });
	}

	return (
		<div className="space-y-2" data-field="orderDesign.expectedGardenBuildStartDates">
			{!selectedDate && showValidationWarning && (
				<Alert icon="error" message="Bagian ini wajib diisi. Silakan lengkapi." />
			)}

			<p className="block text-sm font-medium text-neutral-700">Tanggal Ekspektasi Build Client</p>
			<Calendar selectedDate={selectedDate} onSelectedDateChange={handlePicked} />
		</div>
	);
}
