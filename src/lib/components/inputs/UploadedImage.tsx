// Disusun dari pola pemakaian di UploadFileField/UploadFileBox (project Svelte).
import { X } from 'lucide-react';
import type { NameableFile } from '$types/files';

interface UploadedImageProps {
	file: NameableFile;
	showFilename?: boolean;
	handleRemove?: (event: React.MouseEvent) => void;
}

export default function UploadedImage({ file, showFilename = true, handleRemove }: UploadedImageProps) {
	return (
		<div className="relative rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
			<img src={file.url} alt={file.filename ?? 'uploaded'} className="w-full aspect-square object-cover" />
			{handleRemove && (
				<button
					type="button"
					onClick={handleRemove}
					className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1"
					aria-label="Hapus file"
				>
					<X size={14} />
				</button>
			)}
			{showFilename && (
				<p className="px-2 py-1 text-xs text-neutral-600 truncate">{file.filename}</p>
			)}
		</div>
	);
}