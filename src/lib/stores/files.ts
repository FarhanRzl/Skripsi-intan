// Padanan `useUploadFileMutation` (src/lib/stores/files.ts, project Svelte),
// disusun ulang jadi React hook biasa (tanpa @tanstack/svelte-query).
import { useCallback, useState } from 'react';
import { uploadFile, uploadImage } from '$lib/api/files';
import type { FileInput } from '$types/files';

interface UploadFileParams {
	fileableType: string;
	file: File;
	type: string;
}

interface UploadImageParams {
	imageableType: string;
	file: File;
	type: string;
}

export function useUploadFileMutation() {
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<unknown>(null);

	const mutateAsync = useCallback(async (params: UploadFileParams): Promise<FileInput> => {
		setIsPending(true);
		setError(null);
		try {
			const result = await uploadFile(params.fileableType, params.file, params.type);
			return result;
		} catch (err) {
			setError(err);
			throw err;
		} finally {
			setIsPending(false);
		}
	}, []);

	return { mutateAsync, isPending, error };
}

// Padanan `useUploadImageMutation` (src/lib/stores/files.ts, project Svelte),
// dipakai FormPhotoArea & FormUploadTanaman.
export function useUploadImageMutation() {
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<unknown>(null);

	const mutateAsync = useCallback(async (params: UploadImageParams): Promise<FileInput> => {
		setIsPending(true);
		setError(null);
		try {
			const result = await uploadImage(params.imageableType, params.file, params.type);
			return result;
		} catch (err) {
			setError(err);
			throw err;
		} finally {
			setIsPending(false);
		}
	}, []);

	return { mutateAsync, isPending, error };
}