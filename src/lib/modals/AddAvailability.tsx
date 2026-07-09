// TODO: file ini BELUM ada padanan Svelte-nya (AddAvailability.svelte tidak
// ikut dikirim). Disusun dari pola pemakaian di schedule/+page.svelte:
//   <AddAvailability bind:visible {assignedDates} {availableDates} {handleSubmit} />
// handleSubmit menerima array ISO datetime string (selectedSlots).
// Timpa dengan versi asli begitu file sumbernya dikirim.
import { useState } from 'react';
import { DateTime } from 'luxon';
import Button from '$lib/buttons/Button';

interface AddAvailabilityProps {
	visible: boolean;
	onVisibleChange: (visible: boolean) => void;
	handleSubmit: (selectedSlots: string[]) => void | Promise<void>;
}

const timeOptions = [
	'07.00', '08.00', '09.00', '10.00', '11.00', '12.00',
	'13.00', '14.00', '15.00', '16.00', '17.00'
];

export default function AddAvailability({
	visible,
	onVisibleChange,
	handleSubmit
}: AddAvailabilityProps) {
	const [date, setDate] = useState(DateTime.now().toFormat('yyyy-MM-dd'));
	const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!visible) return null;

	const toggleTime = (time: string) => {
		setSelectedTimes((prev) =>
			prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
		);
	};

	const handleConfirm = async () => {
		if (!date || selectedTimes.length === 0) return;
		setIsSubmitting(true);
		try {
			const slots = selectedTimes
				.map((time) => {
					const [hour, minute] = time.split('.');
					return DateTime.fromFormat(date, 'yyyy-MM-dd')
						.set({ hour: Number(hour), minute: Number(minute) })
						.toISO();
				})
				.filter((s): s is string => Boolean(s));

			await handleSubmit(slots);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
			<div className="bg-white rounded-t-2xl w-full max-w-md p-5 space-y-4">
				<p className="text-lg font-bold text-primary-main">Tambah Jadwal</p>

				<div className="space-y-1">
					<label className="block text-sm font-medium text-neutral-700">Tanggal</label>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-primary-main"
					/>
				</div>

				<div className="space-y-1">
					<label className="block text-sm font-medium text-neutral-700">Jam Tersedia</label>
					<div className="grid grid-cols-3 gap-2">
						{timeOptions.map((time) => (
							<button
								key={time}
								onClick={() => toggleTime(time)}
								className={`rounded-lg border px-2 py-2 text-sm ${
									selectedTimes.includes(time)
										? 'border-primary-main bg-primary-main/10 text-primary-main font-semibold'
										: 'border-neutral-200 text-neutral-600'
								}`}
							>
								{time}
							</button>
						))}
					</div>
				</div>

				<div className="flex gap-3 pt-2">
					<Button
						label="Batal"
						buttonType="secondary"
						style="flex-1"
						action={() => onVisibleChange(false)}
					/>
					<Button
						label={isSubmitting ? 'Menyimpan...' : 'Simpan'}
						buttonType="primary"
						style="flex-1"
						disabled={isSubmitting || selectedTimes.length === 0}
						action={handleConfirm}
					/>
				</div>
			</div>
		</div>
	);
}