import { X } from 'lucide-react';
import type { NameableFile } from '$types/files';

interface UploadedVideoProps {
	file: NameableFile;
	handleRemove?: (event: React.MouseEvent) => void;
}

export default function UploadedVideo({ file, handleRemove }: UploadedVideoProps) {
	return (
		<div className="relative rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
			<video src={file.url} controls className="w-full max-h-56" />
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
			<p className="px-2 py-1 text-xs text-neutral-600 truncate">{file.filename}</p>
		</div>
	);
}