// Di-port dari src/types/utils.ts (project Svelte).
import z from 'zod';

// preprocess
export const prepEmptyStrToNull = z.preprocess(
	(val) => (val === '' ? null : val),
	z.string().nullable().optional()
);

export const prepEmptyUrlToNull = z.preprocess(
	(val) => (val === '' ? null : val),
	z.url().nullable().optional()
);

export const prepStrToNumber = z.preprocess(
	(val) => (val === null || val === undefined ? 0 : Number(val)),
	z.number().nullable().optional().default(null)
);
// end preprocess

// transform
export const numberToString = z
	.union([z.string(), z.number()])
	.nullable()
	.optional()
	.default(null)
	.transform((val) => (val ? val.toString() : null));

export const stringToNumber = z
	.union([z.string(), z.number()])
	.nullable()
	.optional()
	.default(null)
	.transform((val) => (val ? Number(val) : null));
// end transform