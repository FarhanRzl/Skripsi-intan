// Di-port dari src/lib/components/inputs/UploadFileBox.svelte (project Svelte).
import type { ChangeEvent } from 'react';
import { ImagePlus } from 'lucide-react';

interface UploadFileBoxProps {
	accept?: string[];
	allowedText?: string | null;
	multiple?: boolean;
	onchange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadFileBox({
	accept = ['*'],
	allowedText = null,
	multiple = true,
	onchange
}: UploadFileBoxProps) {
	const computedAllowedText =
		allowedText ?? (accept.includes('*') ? 'Allowed all files' : `Allowed *${accept.join(', *')}`);

	return (
		<label className="flex w-full aspect-[4/2] border-2 border-dashed border-gray-300 rounded-lg gap-2 flex-col items-center text-center justify-center text-xs text-neutral-border cursor-pointer hover:border-primary-main hover:text-primary-main transition p-2">
			<ImagePlus size={48} />
			<p>Upload</p>
			<p className="w-full break-words whitespace-normal">{computedAllowedText}</p>
			<input type="file" accept={accept.join(',')} className="hidden" multiple={multiple} onChange={onchange} />
		</label>
	);
}