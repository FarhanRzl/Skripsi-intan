// Di-port dari src/types/files.ts (project Svelte).
import { FILE_CATEGORY, type FileCategory } from '$lib/constants/file';
import { determineCategory, getFilename } from '$lib/utils/url-file';
import z from 'zod';
import { numberToString } from './utils';

export const FileInputSchema = z.object({
	id: z.string(),
	url: z.string(),
	type: z.string(),
	category: z.enum(Object.values(FILE_CATEGORY) as [FileCategory, ...FileCategory[]]),
	sizeB: z.number(),
	filename: z.string()
});

export const FileResponseSchema = FileInputSchema.extend({
	id: numberToString,
	category: z.string().nullable().default(null),
	sizeB: z.number().nullable().default(null),
	filename: z.string().nullable().default(null)
}).transform((data) => {
	return {
		...data,
		id: data.id,
		filename: getFilename(data.url) ?? 'unknown-filename',
		category: determineCategory(data.url) ?? FILE_CATEGORY.IMAGE,
		sizeB: 0 // enrich later karena butuh request tambahan untuk dapat ukuran file
	};
});

export type FileResponse = z.infer<typeof FileResponseSchema>;

export type FileInput = z.infer<typeof FileInputSchema>;

export const NameableFileSchema = FileInputSchema.extend({
	name: z.string().nullable()
});

export type NameableFile = z.infer<typeof NameableFileSchema>;