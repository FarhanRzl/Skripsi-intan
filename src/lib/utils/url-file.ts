// Disusun dari pola pemakaian `$lib/utils/url-file` di project Svelte:
//   determineCategory(url), getFilename(url), enrichResponseFile(fileResponse)

import {
	ALLOWED_IMAGE_EXTS,
	ALLOWED_VIDEO_EXTS,
	ALLOWED_DOCUMENT_EXTS,
	FILE_CATEGORY,
	type FileCategory
} from '$lib/constants/file';

function getExt(url: string): string {
	const clean = url.split('?')[0].split('#')[0];
	const parts = clean.split('.');
	if (parts.length < 2) return '';
	return `.${parts[parts.length - 1].toLowerCase()}`;
}

export function getFilename(url?: string | null): string | null {
	if (!url) return null;
	const clean = url.split('?')[0].split('#')[0];
	const segments = clean.split('/');
	return segments[segments.length - 1] || null;
}

export function determineCategory(url?: string | null): FileCategory | null {
	if (!url) return null;
	const ext = getExt(url);
	if (ALLOWED_IMAGE_EXTS.includes(ext)) return FILE_CATEGORY.IMAGE;
	if (ALLOWED_VIDEO_EXTS.includes(ext)) return FILE_CATEGORY.VIDEO;
	if (ALLOWED_DOCUMENT_EXTS.includes(ext)) return FILE_CATEGORY.DOCUMENT;
	return null;
}

/**
 * Padanan `enrichResponseFile` — melengkapi field turunan (filename, category)
 * dari `url` untuk data file yang datang dari response backend.
 */
export function enrichResponseFile<T extends { url: string; filename?: string | null; category?: string | null }>(
	file: T
): T {
	return {
		...file,
		filename: file.filename ?? getFilename(file.url) ?? 'unknown-filename',
		category: file.category ?? determineCategory(file.url) ?? FILE_CATEGORY.IMAGE
	};
}