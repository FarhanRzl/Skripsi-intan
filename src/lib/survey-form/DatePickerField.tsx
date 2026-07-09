// Komponen date picker reusable — disusun mengikuti pola GardenNameForm
// (wrapper `data-field`, `Alert` saat kosong+wajib, `label` + tanda `*`) tapi
// bersifat STANDALONE: tidak terikat surveyData, cukup `value` + `onChange`.
//
// Field-nya read-only dengan icon kalender inset di kanan; klik membuka popup
// `$lib/Calendar` yang sudah ada di project. Nilai yang dipertukarkan berformat
// 'yyyy-MM-dd' (sama seperti API Calendar).
import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import Calendar from '$lib/Calendar';
import Icon from '$lib/Icon';

interface DatePickerFieldProps {
	value?: string; // 'yyyy-MM-dd'
	onChange: (date: string) => void; // kirim 'yyyy-MM-dd'
	label?: string;
	required?: boolean;
	placeholder?: string;
	id?: string;
	// Kalau diisi, dipakai sebagai atribut `data-field` — supaya kompatibel
	// dengan mekanisme "scroll ke pertanyaan kosong" di SurveyFormPage.tsx.
	dataField?: string;
}

export default function DatePickerField({
	value,
	onChange,
	label,
	required = false,
	placeholder = 'Pilih tanggal',
	id,
	dataField
}: DatePickerFieldProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Tutup popup saat klik di luar container.
	useEffect(() => {
		if (!isOpen) return;
		function handlePointerDown(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener('mousedown', handlePointerDown);
		return () => document.removeEventListener('mousedown', handlePointerDown);
	}, [isOpen]);

	const displayText = value
		? DateTime.fromISO(value).setLocale('id-ID').toFormat('d MMMM yyyy')
		: placeholder;

	return (
		<div className="space-y-2" data-field={dataField}>
			<div className="relative space-y-1" ref={containerRef}>
				{label && (
					<label htmlFor={id} className="block text-sm font-medium text-neutral-700">
						{label}
						{required && <span className="text-danger-main"> *</span>}
					</label>
				)}

				{/* Field read-only dengan icon kalender inset di kanan */}
				<div className="relative">
					<button
						type="button"
						id={id}
						onClick={() => setIsOpen((prev) => !prev)}
						className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 pr-10 text-left text-sm outline-none focus:border-primary-main"
					>
						<span className={value ? 'text-neutral-800' : 'text-neutral-400'}>{displayText}</span>
					</button>
					<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
						<Icon name="calendar_month" size="1.25rem" color="#4ea40f" />
					</span>
				</div>

				{/* Popup kalender */}
				{isOpen && (
					<div className="absolute z-30 mt-1 w-full max-w-xs shadow-lg rounded-xl">
						<Calendar
							selectedDate={value}
							onSelectedDateChange={(date) => {
								onChange(date);
								setIsOpen(false);
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
