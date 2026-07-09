// Padanan `src/lib/api/files.ts` (project Svelte) — `uploadFile`.
// Karena mode mock `fetchClient` cuma balikin `{ data: null }` (tidak ada
// backend beneran yang menyimpan file), di mode mock kita bikin representasi
// FileInput lokal dari object URL supaya alur UI (preview, hapus, dst) tetap
// bisa dites end-to-end tanpa backend.
import { fetchClient } from './fetch-client';
import { USE_MOCK_DATA } from '../config';
import { determineCategory } from '$lib/utils/url-file';
import { FILE_CATEGORY } from '$lib/constants/file';
import type { FileInput } from '$types/files';

let localFileIdCounter = 1;

function buildLocalFileInput(file: File, type: string): FileInput {
	const url = URL.createObjectURL(file);
	return {
		id: `local-${Date.now()}-${localFileIdCounter++}`,
		url,
		type,
		category: determineCategory(file.name) ?? FILE_CATEGORY.IMAGE,
		sizeB: file.size,
		filename: file.name
	};
}

export async function uploadFile(
	fileableType: string,
	file: File,
	type: string
): Promise<FileInput> {
	if (USE_MOCK_DATA) {
		// simulasikan delay upload supaya loading state kelihatan natural
		await new Promise((resolve) => setTimeout(resolve, 400));
		return buildLocalFileInput(file, type);
	}

	const formData = new FormData();
	formData.append('fileableType', fileableType);
	formData.append('type', type);
	formData.append('file', file);

	const res = await fetchClient<FileInput>('files', {
		method: 'POST',
		body: formData
	});

	return res.data;
}

// Padanan `uploadImage` (dipakai FormPhotoArea & FormUploadTanaman, project
// Svelte) — sama seperti uploadFile di atas, dipisah supaya sinyal
// `imageableType` (bukan `fileableType`) tetap terlihat jelas di call-site.
export async function uploadImage(
	imageableType: string,
	file: File,
	type: string
): Promise<FileInput> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 400));
		return buildLocalFileInput(file, type);
	}

	const formData = new FormData();
	formData.append('imageableType', imageableType);
	formData.append('type', type);
	formData.append('file', file);

	const res = await fetchClient<FileInput>('images', {
		method: 'POST',
		body: formData
	});

	return res.data;
}