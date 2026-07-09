// Di-port dari src/types/design-survey-report-fixed-structures.ts (project Svelte).
import z from 'zod';
import { numberToString, prepEmptyStrToNull } from './utils';
import { FileResponseSchema, FileInputSchema } from './files';
import { enrichResponseFile } from '$lib/utils/url-file';
import { tagResponseSchema } from './tags';

export const FixedStructureBaseSchema = z.object({
	id: prepEmptyStrToNull.optional(),
	fixedStructureId: prepEmptyStrToNull,
	distanceFromGardenNote: z.preprocess((val) => {
		if (val === '' || val === null || val === undefined) return null;
		return String(val); // "0" tetap jadi "0"
	}, z.string().nullable().optional()),
	otherName: prepEmptyStrToNull,
	structurePhotos: FileInputSchema.array()
});

export const FixedStructureInputSubmitSchema = FixedStructureBaseSchema.transform((data) => {
	const { structurePhotos, ...rest } = data;

	return {
		...rest,
		structurePhotoIds: data.structurePhotos.map((x) => x.id)
	};
});

export const FixedStructureInputUpdateSchema = z
	.object({
		id: prepEmptyStrToNull.default(null),
		fixedStructureId: z.string('Jenis Struktur Tetap wajib diisi').min(1),
		distanceFromGardenNote: z.preprocess((val) => {
			if (val === '' || val === null || val === undefined) return null;
			return String(val);
		}, z.string().nullable().optional()), // ← ubah, hapus required dan min(1)
		otherName: prepEmptyStrToNull,
		structurePhotos: FileInputSchema.array().default([])
	})
	.transform((data) => {
		const { structurePhotos, ...rest } = data;

		return {
			...rest,
			structurePhotos,
			structurePhotoIds: data.structurePhotos.map((x) => x.id)
		};
	});

export const FixedStructureResponseSchema = FixedStructureBaseSchema.extend({
	id: numberToString,
	fixedStructureId: numberToString,
	fixedStructure: tagResponseSchema.nullable().optional(),
	structurePhotos: z.array(FileResponseSchema).optional().default([])
}).transform((data) => {
	let { structurePhotos, ...rest } = data;

	structurePhotos = structurePhotos.map(enrichResponseFile);

	return {
		...rest,
		structurePhotos,
		structurePhotoIds: structurePhotos.map((sp) => sp.id)
	};
});

export type FixedStructureInput = {
	fixedStructureId: string;
	title?: string;
	distanceFromGardenNote: string | null;
	otherName: string | null;
	structurePhotos: { id: string; url: string; type: string; category: string; sizeB: number; filename: string }[];
	structurePhotoIds?: string[];
};