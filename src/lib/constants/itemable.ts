// Di-port dari `$lib/constants/itemable.ts` (project Svelte).
export const ITEMABLE_TYPE = {
	PLANT: 'plant'
} as const;

export type ItemableType = (typeof ITEMABLE_TYPE)[keyof typeof ITEMABLE_TYPE];
