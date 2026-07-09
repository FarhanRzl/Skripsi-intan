import { FileText, X } from 'lucide-react';
import type { NameableFile } from '$types/files';

interface UploadedDocumentProps {
	file: NameableFile;
	handleRemove?: (event: React.MouseEvent) => void;
}

export default function UploadedDocument({ file, handleRemove }: UploadedDocumentProps) {
	return (
		<div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
			<FileText size={20} className="text-neutral-500 shrink-0" />
			<a
				href={file.url}
				target="_blank"
				rel="noreferrer"
				className="text-sm text-neutral-700 truncate flex-1 underline"
			>
				{file.filename}
			</a>
			{handleRemove && (
				<button type="button" onClick={handleRemove} aria-label="Hapus file">
					<X size={16} className="text-danger-main shrink-0" />
				</button>
			)}
		</div>
	);
}