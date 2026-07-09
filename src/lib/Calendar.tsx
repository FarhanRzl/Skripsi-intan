// TODO: file ini BELUM ada padanan Svelte-nya (Calendar.svelte tidak ikut
// dikirim). Disusun dari pola pemakaian di schedule/+page.svelte:
//   <Calendar bind:selectedDate {assignedDates} {availableDates} allowAll={true} />
// Timpa dengan versi asli begitu file sumbernya dikirim.
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import Icon from './Icon';

interface CalendarProps {
	selectedDate?: string; // format 'yyyy-MM-dd'
	onSelectedDateChange: (date: string) => void;
	assignedDates?: string[]; // ISO datetime — tanggal yang sudah ada survey
	availableDates?: string[]; // ISO datetime — tanggal ketersediaan surveyor
	allowAll?: boolean; // kalau false, tanggal tanpa assigned/available di-disable
}

export default function Calendar({
	selectedDate,
	onSelectedDateChange,
	assignedDates = [],
	availableDates = [],
	allowAll = true
}: CalendarProps) {
	const [viewMonth, setViewMonth] = useState(() => DateTime.now().startOf('month'));

	const assignedDaySet = useMemo(
		() => new Set(assignedDates.map((d) => DateTime.fromISO(d).toFormat('yyyy-MM-dd'))),
		[assignedDates]
	);
	const availableDaySet = useMemo(
		() => new Set(availableDates.map((d) => DateTime.fromISO(d).toFormat('yyyy-MM-dd'))),
		[availableDates]
	);

	const daysInMonth = viewMonth.daysInMonth ?? 30;
	// Luxon: Senin=1 .. Minggu=7 -> geser supaya kolom pertama = Minggu
	const firstWeekday = viewMonth.weekday % 7;

	const cells = useMemo(() => {
		const arr: (DateTime | null)[] = Array(firstWeekday).fill(null);
		for (let d = 1; d <= daysInMonth; d++) {
			arr.push(viewMonth.set({ day: d }));
		}
		return arr;
	}, [viewMonth, daysInMonth, firstWeekday]);

	const weekdayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

	return (
		<div className="bg-white rounded-xl border border-neutral-100 p-4">
			<div className="flex items-center justify-between mb-3">
				<button
					onClick={() => setViewMonth((prev) => prev.minus({ months: 1 }))}
					aria-label="Bulan sebelumnya"
				>
					<Icon name="chevron_left" />
				</button>
				<p className="font-semibold text-sm">
					{viewMonth.setLocale('id-ID').toFormat('MMMM yyyy')}
				</p>
				<button
					onClick={() => setViewMonth((prev) => prev.plus({ months: 1 }))}
					aria-label="Bulan berikutnya"
				>
					<Icon name="chevron_right" />
				</button>
			</div>

			<div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-400 mb-1">
				{weekdayLabels.map((label) => (
					<div key={label}>{label}</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-1">
				{cells.map((date, i) => {
					if (!date) return <div key={`empty-${i}`} />;
					const key = date.toFormat('yyyy-MM-dd');
					const isSelected = selectedDate === key;
					const isAssigned = assignedDaySet.has(key);
					const isAvailable = availableDaySet.has(key);
					const disabled = !allowAll && !isAvailable && !isAssigned;

					return (
						<button
							key={key}
							disabled={disabled}
							onClick={() => onSelectedDateChange(key)}
							className={`relative aspect-square rounded-lg text-xs flex items-center justify-center ${
								isSelected
									? 'bg-primary-main text-white font-semibold'
									: disabled
										? 'text-neutral-300'
										: 'text-neutral-700 hover:bg-neutral-50'
							}`}
						>
							{date.day}
							{(isAssigned || isAvailable) && (
								<span
									className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
										isAssigned ? 'bg-danger-main' : 'bg-primary-main'
									}`}
								/>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}