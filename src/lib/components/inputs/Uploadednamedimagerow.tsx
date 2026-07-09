// Kartu baris untuk 1 foto ber-nama (dipakai FormAreaPhoto untuk "Foto Area").
// Layout: thumbnail persegi di kiri, di kanan input bergaya "notched label"
// (label mengambang di garis border atas, mis. "Nama Area") lalu nama file
// asli di bawahnya — sesuai desain yang dikirim.
import { X } from 'lucide-react';
import type { NameableFile } from '$types/files';

interface UploadedNamedImageRowProps {
	file: NameableFile;
	nameLabel?: string;
	onNameChange: (value: string) => void;
	handleRemove?: (event: React.MouseEvent) => void;
}

export default function UploadedNamedImageRow({
	file,
	nameLabel = 'Nama Area',
	onNameChange,
	handleRemove
}: UploadedNamedImageRowProps) {
	return (
		<div className="flex items-start gap-3 rounded-2xl border border-neutral-100 shadow-sm p-3">
			<img
				src={file.url}
				alt={file.name ?? file.filename ?? 'foto area'}
				className="w-20 h-20 rounded-xl object-cover shrink-0 border border-neutral-200"
			/>

			<div className="flex-1 min-w-0 space-y-1.5">
				<div className="relative">
					<span className="absolute -top-2 left-3 px-1 bg-white text-xs text-neutral-4 leading-none">
						{nameLabel}
					</span>
					<input
						type="text"
						value={file.name ?? ''}
						onChange={(e) => onNameChange(e.target.value)}
						placeholder={file.filename ?? nameLabel}
						className="w-full rounded-xl border border-neutral-border px-3 pt-3.5 pb-2 text-sm font-semibold text-neutral-main placeholder:font-normal placeholder:text-neutral-5 outline-none focus:border-primary-main"
					/>
				</div>
				<p className="text-xs text-neutral-4 break-words">{file.filename}</p>
			</div>

			{handleRemove && (
				<button
					type="button"
					onClick={handleRemove}
					aria-label="Hapus foto"
					className="shrink-0 mt-1 text-neutral-5 hover:text-danger-main"
				>
					<X size={16} />
				</button>
			)}
		</div>
	);
}