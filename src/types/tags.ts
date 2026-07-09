// Disusun berdasarkan model `tags` di data/schema.js (attributes: type, title,
// technicalNote) — dipakai sebagai bentuk relasi `*Response` di
// design-survey-reports (mis. gardenFacingDirection, drainage, dst).
import z from 'zod';
import { numberToString } from './utils';

export const tagResponseSchema = z.object({
	id: numberToString,
	type: z.string().nullable().default(null),
	title: z.string().nullable().default(null),
	technicalNote: z.string().nullable().default(null)
});

export type TagResponse = z.infer<typeof tagResponseSchema>;

// Bentuk tag yang dipakai di komponen Form* (langsung dari `useOrbitQuery`
// findRecords('tags'), sebelum lewat *ResponseSchema).
export interface Tag {
	id: string;
	type: string;
	title: string;
	technicalNote?: string | null;
}