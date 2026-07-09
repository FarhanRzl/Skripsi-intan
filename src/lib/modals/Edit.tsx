// Disusun dari pola pemakaian di survey/[slug]/+page.svelte:
//   <Edit bind:modal title address size /> dst.
// Versi sederhana: menangani edit "Alamat Lengkap", "Ukuran", dan
// "Jadwal Konsultasi" — field yang datanya ada langsung di record orderDesigns.
// "Foto Area" belum didukung (placeholder), nunggu fase upload foto.
import { useState } from 'react';
import Button from '../buttons/Button';
import TextInput from '../input-fields/TextInput';
import Icon from '../Icon';

export interface EditValues {
	address?: string;
	areaSize?: number;
	consultationDate?: string; // yyyy-MM-dd
	consultationTime?: string; // HH:mm
}

interface EditProps {
	visible: boolean;
	onVisibleChange: (visible: boolean) => void;
	title: string;
	address?: string;
	areaSize?: number;
	consultationDate?: string;
	consultationTime?: string;
	onSave: (values: EditValues) => Promise<void> | void;
}

export default function Edit({
	visible,
	onVisibleChange,
	title,
	address,
	areaSize,
	consultationDate,
	consultationTime,
	onSave
}: EditProps) {
	const [addressValue, setAddressValue] = useState(address ?? '');
	const [sizeValue, setSizeValue] = useState(areaSize?.toString() ?? '');
	const [dateValue, setDateValue] = useState(consultationDate ?? '');
	const [timeValue, setTimeValue] = useState(consultationTime ?? '');
	const [isSaving, setIsSaving] = useState(false);

	if (!visible) return null;

	const isAddress = title.includes('Alamat');
	const isSize = title.includes('Ukuran');
	const isSchedule = title.includes('Jadwal');

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await onSave({
				address: isAddress ? addressValue : undefined,
				areaSize: isSize ? Number(sizeValue) : undefined,
				consultationDate: isSchedule ? dateValue : undefined,
				consultationTime: isSchedule ? timeValue : undefined
			});
			onVisibleChange(false);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
			<div className="bg-white rounded-2xl p-5 space-y-4 max-w-sm w-[85%]">
				<div className="flex justify-between items-center">
					<h2 className="text-base font-bold text-neutral-2">{title}</h2>
					<button onClick={() => onVisibleChange(false)} aria-label="Tutup">
						<Icon name="close" />
					</button>
				</div>

				{isAddress && (
					<TextInput
						id="edit-address"
						label="Alamat Lengkap"
						type="textarea"
						value={addressValue}
						onInput={(e) => setAddressValue(e.target.value)}
					/>
				)}

				{isSize && (
					<TextInput
						id="edit-size"
						label="Ukuran (m²)"
						type="number"
						value={sizeValue}
						onInput={(e) => setSizeValue(e.target.value)}
					/>
				)}

				{isSchedule && (
					<div className="space-y-3">
						<TextInput
							id="edit-consultation-date"
							label="Tanggal Konsultasi"
							type="text"
							placeholder="yyyy-mm-dd"
							value={dateValue}
							onInput={(e) => setDateValue(e.target.value)}
						/>
						<TextInput
							id="edit-consultation-time"
							label="Jam Konsultasi"
							type="text"
							placeholder="HH:mm"
							value={timeValue}
							onInput={(e) => setTimeValue(e.target.value)}
						/>
					</div>
				)}

				{!isAddress && !isSize && !isSchedule && (
					<p className="text-sm text-neutral-5">Form untuk "{title}" akan tersedia di fase berikutnya.</p>
				)}

				<div className="flex gap-3">
					<Button
						label="Batal"
						buttonType="secondary"
						style="flex-1"
						action={() => onVisibleChange(false)}
					/>
					<Button
						label={isSaving ? 'Menyimpan...' : 'Simpan'}
						style="flex-1"
						isLoading={isSaving}
						disabled={!isAddress && !isSize && !isSchedule}
						action={handleSave}
					/>
				</div>
			</div>
		</div>
	);
}
