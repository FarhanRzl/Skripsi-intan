// Di-port dari src/lib/survey-form/PlantRequestForm.svelte (project Svelte),
// disesuaikan dengan desain terbaru: "Permintaan Tanaman Khusus" berupa
// tag-input bebas — ketik nama tanaman lalu Enter/koma untuk menambah,
// tiap tanaman muncul sebagai chip dengan tombol hapus (×).
//
// Catatan: sebelumnya field ini pakai MultiSelect (pilih dari daftar plant
// options) + textarea "Tanaman Lainnya" terpisah. Karena project ini memang
// belum punya sumber data daftar tanaman (`plantOptions` selalu kosong,
// lihat catatan lama), dan desain yang dikirim menunjukkan satu input teks
// bebas + chip, komponen ini disederhanakan jadi tag-input murni. Field
// `itemRequests` (types.ts) tetap dipakai sebagai penyimpanannya — tiap
// entry diberi `itemableId` lokal (bukan id dari database) supaya tetap bisa
// dihapus per-item.
import { useState, type KeyboardEvent } from 'react';
import Icon from '$lib/Icon';
import { ITEMABLE_TYPE } from '$lib/constants/itemable';
import type { ItemRequestEntry, Stage1FormProps } from './types';

function generateLocalId() {
	return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function PlantRequestForm({ formId, surveyData, updateSurveyEntries }: Stage1FormProps) {
	const itemRequests = surveyData.itemRequests ?? [];
	const [draft, setDraft] = useState('');

	function addPlant() {
		const name = draft.trim();
		if (!name) return;

		const newEntry: ItemRequestEntry = {
			itemableId: generateLocalId(),
			itemableName: name,
			itemableType: ITEMABLE_TYPE.PLANT,
			notExistsNote: null
		};

		updateSurveyEntries(formId, { itemRequests: [...itemRequests, newEntry] });
		setDraft('');
	}

	function handleRemove(itemableId: string | null) {
		updateSurveyEntries(formId, {
			itemRequests: itemRequests.filter((data) => data.itemableId !== itemableId)
		});
	}

	function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addPlant();
		}
	}

	return (
		<div className="space-y-3">
			<p className="font-bold text-neutral-main">Permintaan Tanaman Khusus</p>

			<input
				type="text"
				value={draft}
				onChange={(e) => setDraft(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={addPlant}
				placeholder="Nama Tanaman"
				className="w-full rounded-xl border border-neutral-border bg-white px-3.5 py-2.5 text-sm text-neutral-main placeholder-neutral-6 outline-none focus:border-primary-main"
			/>

			{itemRequests.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{itemRequests.map((item) => (
						<div
							key={item.itemableId}
							className="flex items-center gap-1.5 rounded-xl border border-primary-main bg-white px-3 py-1.5 text-xs font-medium text-primary-main"
						>
							<span>{item.itemableName}</span>
							<button
								type="button"
								onClick={() => handleRemove(item.itemableId)}
								aria-label={`Hapus ${item.itemableName}`}
								className="shrink-0 flex items-center"
							>
								<Icon name="close" size="0.9rem" color="#DB303E" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}