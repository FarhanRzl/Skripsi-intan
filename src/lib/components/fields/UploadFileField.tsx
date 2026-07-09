// Di-port dari src/lib/components/fields/UploadFileField.svelte (project Svelte).
import type { ChangeEvent } from 'react';
import { FILE_CATEGORY, type FileCategory } from '$lib/constants/file';
import type { NameableFile } from '$types/files';
import UploadFileBox from '../inputs/UploadFileBox';
import UploadFileButton from '../inputs/UploadFileButton';
import UploadedDocument from '../inputs/UploadedDocument';
import UploadedImage from '../inputs/UploadedImage';
import UploadedVideo from '../inputs/UploadedVideo';

interface UploadFileFieldProps {
	id?: string;
	files: NameableFile[];
	isLoading?: boolean;
	accept?: string[];
	addButtonText?: string;
	showImageFilename?: boolean;
	handleAddFile: (event: ChangeEvent<HTMLInputElement>) => void;
	handleRemoveFile?: (fileId: string, category?: FileCategory) => void;
}

export default function UploadFileField({
	id,
	files = [],
	isLoading = false,
	accept = ['*'],
	addButtonText = 'Tambah File/Gambar',
	showImageFilename = true,
	handleAddFile,
	handleRemoveFile
}: UploadFileFieldProps) {
	const images: NameableFile[] = [];
	const videos: NameableFile[] = [];
	const documents: NameableFile[] = [];

	for (const file of files) {
		switch (file.category) {
			case FILE_CATEGORY.IMAGE:
				images.push(file);
				break;
			case FILE_CATEGORY.VIDEO:
				videos.push(file);
				break;
			case FILE_CATEGORY.DOCUMENT:
				documents.push(file);
				break;
			default:
				break;
		}
	}

	return (
		<div className="space-y-4" data-field={id}>
			<div className={`grid ${showImageFilename ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
				{images.map((file) => (
					<UploadedImage
						key={file.id}
						file={file}
						showFilename={showImageFilename}
						handleRemove={() => handleRemoveFile?.(file.id, file.category as FileCategory)}
					/>
				))}
			</div>
			<div className="w-full space-y-4">
				{videos.map((file) => (
					<UploadedVideo
						key={file.id}
						file={file}
						handleRemove={() => handleRemoveFile?.(file.id, file.category as FileCategory)}
					/>
				))}
				{documents.map((file) => (
					<UploadedDocument
						key={file.id}
						file={file}
						handleRemove={() => handleRemoveFile?.(file.id, file.category as FileCategory)}
					/>
				))}
				{isLoading ? (
					<div className="flex items-center justify-center flex-1 shrink-0 py-6">
						<div className="w-8 h-8 border-4 border-primary-main border-t-transparent rounded-full animate-spin" />
					</div>
				) : files.length === 0 ? (
					<UploadFileBox accept={accept} multiple onchange={handleAddFile} />
				) : (
					<UploadFileButton text={addButtonText} accept={accept} multiple onchange={handleAddFile} />
				)}
			</div>
		</div>
	);
}