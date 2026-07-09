// Di-port dari src/lib/components/fields/UploadItemableImageField.svelte
// (project Svelte) — dipakai FormUploadTanaman. Tiap foto tanaman punya:
// pilihan/nama tanaman (boleh ketik nama baru, lihat isNumericString di
// FormUploadTanaman.tsx), dan stepper volume (+/-, atau ketik langsung).
//
// Restyle: kartu horizontal (foto kiri, nama + counter unit kanan) supaya
// sesuai desain — pola diambil dari UploadNameableImageField (field "Foto
// Area") lalu ditambahkan counter unit di bawah nama.
//
// Catatan: project ini belum punya sumber data daftar tanaman (plant list),
// jadi `plantOptions` default kosong — surveyor tetap bisa mengetik nama
// tanaman custom lewat CreatableSelect.
import type { ChangeEvent } from 'react';
import CreatableSelect from 'react-select/creatable';
import type { StylesConfig } from 'react-select';
import { Minus, Plus, X } from 'lucide-react';
import type { PlantPresenceEntry } from '$lib/survey-form/types';
import UploadFileBox from '../inputs/UploadFileBox';
import UploadFileButton from '../inputs/UploadFileButton';
import { ALLOWED_IMAGE_EXTS } from '$lib/constants/file';

interface SelectOption {
	value: string;
	label: string;
}

interface UploadItemableImageFieldProps {
	id?: string;
	itemables: PlantPresenceEntry[];
	nameLabel?: string;
	isUploading?: boolean;
	plantOptions?: SelectOption[];
	onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onSelectItem: (event: unknown, fileId: string, opt: SelectOption | null) => void;
	onRemove: (fileId: string) => void;
	onPlusVolume: (event: unknown, fileId: string) => void;
	onMinVolume: (event: unknown, fileId: string) => void;
	onInputVolume: (event: ChangeEvent<HTMLInputElement>, fileId: string) => void;
}

// Select tanpa border/background sendiri — border & label mengambang
// disediakan oleh wrapper fieldset di bawah, biar CreatableSelect terasa
// menyatu dengan kotak nama tanaman.
const selectStyles: StylesConfig<SelectOption, false> = {
	control: (base) => ({
		...base,
		border: 'none',
		boxShadow: 'none',
		minHeight: 'auto',
		background: 'transparent',
		cursor: 'text'
	}),
	valueContainer: (base) => ({ ...base, padding: 0 }),
	input: (base) => ({ ...base, margin: 0, padding: 0 }),
	singleValue: (base) => ({ ...base, fontWeight: 600, fontSize: '0.9375rem', color: '#1F2937' }),
	placeholder: (base) => ({ ...base, fontWeight: 600, fontSize: '0.9375rem', color: '#9CA3AF' }),
	indicatorsContainer: (base) => ({ ...base, padding: 0 }),
	dropdownIndicator: (base) => ({ ...base, padding: 0, paddingLeft: 4 }),
	clearIndicator: (base) => ({ ...base, padding: 0 }),
	menu: (base) => ({ ...base, zIndex: 20 })
};

function unitLabel(denom: string) {
	if (!denom) return 'Unit';
	return denom.charAt(0).toUpperCase() + denom.slice(1);
}

export default function UploadItemableImageField({
	id,
	itemables = [],
	nameLabel = 'Nama Tanaman',
	isUploading = false,
	plantOptions = [],
	onFileChange,
	onSelectItem,
	onRemove,
	onPlusVolume,
	onMinVolume,
	onInputVolume
}: UploadItemableImageFieldProps) {
	return (
		<div className="space-y-3" data-field={id}>
			{itemables.length > 0 && (
				<div className="space-y-3">
					{itemables.map((item) => (
						<div
							key={item.photo.id}
							className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-2.5"
						>
							<div className="relative shrink-0">
								<img
									src={item.photo.url}
									alt={item.itemName || 'foto tanaman'}
									className="w-20 h-20 rounded-lg object-cover"
								/>
								<button
									type="button"
									onClick={() => onRemove(item.photo.id)}
									className="absolute -top-1.5 -right-1.5 bg-black/60 text-white rounded-full p-1"
									aria-label="Hapus foto"
								>
									<X size={12} />
								</button>
							</div>

							<div className="flex flex-1 flex-col justify-between min-w-0">
								{/* kotak nama tanaman dengan label mengambang di border */}
								<div className="relative rounded-xl border border-neutral-300 px-3 pt-3 pb-2.5">
									<span className="absolute -top-2 left-2.5 bg-white px-1 text-[11px] leading-none text-neutral-400">
										{nameLabel}
									</span>
									<CreatableSelect
										placeholder={nameLabel}
										classNamePrefix="rselect"
										styles={selectStyles}
										components={{ IndicatorSeparator: () => null }}
										value={
											item.itemName
												? { value: item.plantId ?? item.itemName, label: item.itemName }
												: null
										}
										options={plantOptions}
										onChange={(opt) => onSelectItem(null, item.photo.id, opt as SelectOption | null)}
										formatCreateLabel={(input) => `Gunakan "${input}"`}
									/>
								</div>

								{/* counter unit */}
								<div className="flex items-center gap-2 mt-2">
									<button
										type="button"
										onClick={(e) => onMinVolume(e, item.photo.id)}
										className="w-7 h-7 flex shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:border-primary-main hover:text-primary-main transition"
										aria-label="Kurangi volume"
									>
										<Minus size={14} />
									</button>
									<input
										type="text"
										inputMode="decimal"
										value={item.volume}
										onChange={(e) => onInputVolume(e, item.photo.id)}
										className="w-9 shrink-0 text-center text-sm font-semibold outline-none bg-transparent"
									/>
									<button
										type="button"
										onClick={(e) => onPlusVolume(e, item.photo.id)}
										className="w-7 h-7 flex shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:border-primary-main hover:text-primary-main transition"
										aria-label="Tambah volume"
									>
										<Plus size={14} />
									</button>
									<span className="text-sm text-neutral-500">{unitLabel(item.denom)}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{isUploading ? (
				<div className="flex items-center justify-center py-6">
					<div className="w-8 h-8 border-4 border-primary-main border-t-transparent rounded-full animate-spin" />
				</div>
			) : itemables.length === 0 ? (
				<UploadFileBox accept={ALLOWED_IMAGE_EXTS} multiple onchange={onFileChange} />
			) : (
				<UploadFileButton text="Tambah File/Gambar" accept={ALLOWED_IMAGE_EXTS} multiple onchange={onFileChange} />
			)}
		</div>
	);
}
