// Di-port dari src/types/design-survey-report-land-preparations.ts (project Svelte).
import z from 'zod';
import { numberToString } from './utils';
import { tagResponseSchema } from './tags';

export const LandPreparationInputSubmitSchema = z.object({
	id: z.string().nullable().optional().default(null),
	landPreparationId: z.string(),
	surveyorNote: z.string().nullable().optional().default(null)
});

export const LandPreparationInputUpdateSchema = z.object({
	id: z.string().nullable().optional().default(null),
	landPreparationId: z.string(),
	surveyorNote: z.string().nullable().optional().default(null)
});

export const LandPreparationResponseSchema = z.object({
	id: numberToString,
	landPreparationId: numberToString,
	landPreparation: tagResponseSchema.nullable().optional().default(null),
	surveyorNote: z.string().nullable().optional().default(null)
});

export type LandPreparationInput = z.infer<typeof LandPreparationInputSubmitSchema>;