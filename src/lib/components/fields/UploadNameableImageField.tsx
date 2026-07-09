// Di-port dari src/lib/components/fields/UploadNameableImageField.svelte
// (project Svelte) — dipakai FormPhotoArea. Menampilkan grid foto, masing-masing
// dengan input nama (mis. "Nama Area"), plus tombol tambah & hapus.
import type { ChangeEvent } from 'react';
import { X } from 'lucide-react';
import type { NameableFile } from '$types/files';
import UploadFileBox from '../inputs/UploadFileBox';
import UploadFileButton from '../inputs/UploadFileButton';
import { ALLOWED_IMAGE_EXTS } from '$lib/constants/file';

interface UploadNameableImageFieldProps {
	id?: string;
	images: NameableFile[];
	nameLabel?: string;
	isLoading?: boolean;
	onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onRemove: (id: string) => void;
	onInputName: (event: ChangeEvent<HTMLInputElement>, id: string) => void;
}

export default function UploadNameableImageField({
	id,
	images = [],
	nameLabel = 'Nama',
	isLoading = false,
	onFileChange,
	onRemove,
	onInputName
}: UploadNameableImageFieldProps) {
	return (
		<div className="space-y-3" data-field={id}>
			<div className="grid grid-cols-2 gap-3">
				{images.map((file) => (
					<div
						key={file.id}
						className="relative rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50"
					>
						<img src={file.url} alt={file.name ?? 'foto area'} className="w-full aspect-square object-cover" />
						<button
							type="button"
							onClick={() => onRemove(file.id)}
							className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1"
							aria-label="Hapus foto"
						>
							<X size={14} />
						</button>
						<input
							type="text"
							placeholder={nameLabel}
							value={file.name ?? ''}
							onChange={(e) => onInputName(e, file.id)}
							className="w-full px-2 py-1.5 text-xs border-t border-neutral-200 outline-none focus:bg-neutral-50"
						/>
					</div>
				))}
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-6">
					<div className="w-8 h-8 border-4 border-primary-main border-t-transparent rounded-full animate-spin" />
				</div>
			) : images.length === 0 ? (
				<UploadFileBox accept={ALLOWED_IMAGE_EXTS} multiple onchange={onFileChange} />
			) : (
				<UploadFileButton text="Tambah Foto" accept={ALLOWED_IMAGE_EXTS} multiple onchange={onFileChange} />
			)}
		</div>
	);
}
