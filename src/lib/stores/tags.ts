// Padanan `useTagsQuery` (react-query di project Svelte lama). Di sini cukup
// query semua `tags` dari memory Orbit.js (mode mock: sudah di-seed lewat
// seedMemory.js) lalu filter di client sesuai `types` yang diminta.
import { useMemo } from 'react';
import { useOrbitQuery } from '$data/hooks';
import type { Tag } from '$types/tags';

// PENTING: `memory.query((q) => q.findRecords('tags'))` dari @orbit/memory TIDAK
// menjamin urutan sesuai insertion order — sudah diverifikasi (repro terpisah)
// bahwa urutan yang dikembalikan bisa teracak tergantung campuran id (termasuk
// id eksplisit rendah seperti TAG.ELECTRICITY_SOURCE_NONE dkk di dummyData.js),
// meskipun hasilnya deterministic per proses. Karena id tag selalu di-assign
// berurutan sesuai urutan definisi (lihat tagIdCounter di dummyData.js), kita
// pulihkan urutan yang benar dengan sort ascending by numeric id di sini —
// satu titik pusat untuk semua pemakai useTagsQuery.
function compareTagOrder(a: { id: string; attributes?: { order?: number } }, b: { id: string; attributes?: { order?: number } }) {
	const orderA = a.attributes?.order;
	const orderB = b.attributes?.order;
	if (typeof orderA === 'number' && typeof orderB === 'number') return orderA - orderB;
	return String(a.id).localeCompare(String(b.id));
}

export function useTagsQuery(types: string[]) {
	const { data, isPending, error, refetch } = useOrbitQuery<any[]>((q) => q.findRecords('tags'), []);

	const tags = useMemo<Tag[]>(() => {
		if (!data) return [];
		return data
			.filter((tag) => types.includes(tag.attributes.type))
			.sort(compareTagOrder)
			.map((tag) => ({
				id: tag.id,
				type: tag.attributes.type,
				title: tag.attributes.title,
				technicalNote: tag.attributes.technicalNote
			}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, JSON.stringify(types)]);

	return { data: tags, isPending, error, refetch };
}
