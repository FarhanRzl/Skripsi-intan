// Popup "Tambah Isian Survey": muncul di Tahap 1, menampilkan daftar
// pertanyaan Tahap 2 (stage2Questions.ts) yang belum ditambahkan, bisa
// dipilih beberapa sekaligus (checkbox), lalu di-inject inline ke Tahap 1
// lewat SurveyFormV2.tsx begitu tombol "Tambah" ditekan.
import { useMemo, useState } from 'react';
import { stage2QuestionCatalog, type Stage2FieldKey } from './stage2Questions';

interface AddSurveyQuestionModalProps {
	open: boolean;
	existingKeys: Stage2FieldKey[];
	onClose: () => void;
	onAdd: (keys: Stage2FieldKey[]) => void;
}

export default function AddSurveyQuestionModal({
	open,
	existingKeys,
	onClose,
	onAdd
}: AddSurveyQuestionModalProps) {
	const [selectedKeys, setSelectedKeys] = useState<Stage2FieldKey[]>([]);
	const [search, setSearch] = useState('');

	const availableQuestions = useMemo(
		() => stage2QuestionCatalog.filter((q) => !existingKeys.includes(q.key)),
		[existingKeys]
	);

	const filteredQuestions = useMemo(
		() =>
			availableQuestions.filter((q) =>
				q.title.toLowerCase().includes(search.trim().toLowerCase())
			),
		[availableQuestions, search]
	);

	if (!open) return null;

	function toggleKey(key: Stage2FieldKey) {
		setSelectedKeys((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
		);
	}

	function handleClose() {
		setSelectedKeys([]);
		setSearch('');
		onClose();
	}

	function handleSubmit() {
		if (selectedKeys.length === 0) return;
		onAdd(selectedKeys);
		setSelectedKeys([]);
		setSearch('');
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
			<div className="w-full max-w-md max-h-[85vh] flex flex-col bg-white rounded-t-3xl overflow-hidden">
				{/* Drag handle */}
				<div className="flex justify-center pt-2.5 pb-1 shrink-0">
					<span className="w-10 h-1.5 rounded-full bg-neutral-7" />
				</div>

				<h2 className="px-5 pt-2 pb-4 text-lg font-bold text-neutral-main shrink-0">
					Tambahkan Pertanyaan Lainnya
				</h2>

				{/* Search box */}
				<div className="px-5 pb-3 shrink-0">
					<div className="flex items-center gap-2 bg-neutral-8 rounded-xl px-3.5 py-2.5">
						<span
							className="material-symbols-outlined text-neutral-5"
							style={{ fontSize: '1.1rem' }}
						>
							search
						</span>
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Cari pertanyaan..."
							className="flex-1 bg-transparent text-sm text-neutral-2 placeholder-neutral-5 outline-none"
						/>
					</div>
				</div>

				{/* List */}
				<div className="flex-1 overflow-y-auto px-5 pb-3 flex flex-col gap-2.5">
					{filteredQuestions.length === 0 && (
						<p className="text-sm text-neutral-5 text-center py-6">
							{availableQuestions.length === 0
								? 'Semua pertanyaan sudah ditambahkan.'
								: 'Pertanyaan tidak ditemukan.'}
						</p>
					)}

					{filteredQuestions.map((q) => {
						const isChecked = selectedKeys.includes(q.key);
						return (
							<button
								key={q.key}
								type="button"
								onClick={() => toggleKey(q.key)}
								className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-sm font-semibold text-left transition-colors ${
									isChecked
										? 'border-primary-main bg-white text-neutral-main'
										: 'border-neutral-8 bg-white text-neutral-3'
								}`}
							>
								<span
									className={`w-5 h-5 rounded-md shrink-0 flex items-center justify-center ${
										isChecked ? 'bg-primary-main' : 'border-2 border-neutral-7'
									}`}
								>
									{isChecked && (
										<span className="text-white text-[11px] leading-none">✓</span>
									)}
								</span>
								<span className="flex-1">{q.title}</span>
							</button>
						);
					})}
				</div>

				{/* Footer actions */}
				<div className="px-5 py-4 border-t border-neutral-8 flex items-center gap-3 shrink-0">
					<button
						type="button"
						onClick={handleClose}
						className="flex-1 py-3 rounded-full font-semibold text-sm border-2 border-primary-main text-primary-main bg-white"
					>
						Kembali
					</button>
					<button
						type="button"
						disabled={selectedKeys.length === 0}
						onClick={handleSubmit}
						className={`flex-1 py-3 rounded-full font-semibold text-sm ${
							selectedKeys.length === 0
								? 'bg-neutral-8 text-neutral-6'
								: 'bg-primary-main text-white'
						}`}
					>
						Tambah{selectedKeys.length > 0 ? ` (${selectedKeys.length} Pertanyaan)` : ''}
					</button>
				</div>
			</div>
		</div>
	);
}
