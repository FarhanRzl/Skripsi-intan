// Disusun dari pola pemakaian di UploadFileField.svelte:
//   <UploadFileButton text={addButtonText} {accept} multiple onchange={handleAddFile} />
import type { ChangeEvent } from 'react';
import { Plus } from 'lucide-react';

interface UploadFileButtonProps {
	text?: string;
	accept?: string[];
	multiple?: boolean;
	onchange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadFileButton({
	text = 'Tambah File/Gambar',
	accept = ['*'],
	multiple = true,
	onchange
}: UploadFileButtonProps) {
	return (
		<label className="flex items-center justify-center gap-1.5 w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-xs font-semibold text-primary-main cursor-pointer hover:border-primary-main transition">
			<Plus size={16} />
			<span>{text}</span>
			<input type="file" accept={accept.join(',')} className="hidden" multiple={multiple} onChange={onchange} />
		</label>
	);
}