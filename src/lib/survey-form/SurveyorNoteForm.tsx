// Bottom-sheet "Catatan Surveyor" — pengganti popup kecil floating note
// sebelumnya, sesuai desain mockup: header + timestamp, toolbar rich text
// (bullet list, checklist, bold, italic) yang fungsional lewat
// document.execCommand pada contentEditable, kotak "Perhatikan!", dan
// tombol Kembali/Simpan Draft.
//
// Catatan: `surveyorNote` di schema backend cuma `string` — sekarang isinya
// HTML hasil rich text editor (bukan plain text lagi), karena tipe kolomnya
// tetap string biasa jadi tidak perlu perubahan skema.
import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import Icon from '$lib/Icon';
import Button from '$lib/buttons/Button';

interface SurveyorNoteSheetProps {
	visible: boolean;
	value: string;
	updatedAt: string | null;
	onClose: () => void;
	onSave: (html: string) => void;
}

export default function SurveyorNoteSheet({
	visible,
	value,
	updatedAt,
	onClose,
	onSave
}: SurveyorNoteSheetProps) {
	const editorRef = useRef<HTMLDivElement>(null);

	// Status format aktif di posisi kursor sekarang (bullet list, bold,
	// italic), supaya tombol toolbar bisa tersorot hijau seperti di desain
	// saat format tersebut sedang aktif — mirip toggle button pada umumnya.
	const [activeFormats, setActiveFormats] = useState({ list: false, bold: false, italic: false });

	function refreshActiveFormats() {
		setActiveFormats({
			list: document.queryCommandState('insertUnorderedList'),
			bold: document.queryCommandState('bold'),
			italic: document.queryCommandState('italic')
		});
	}

	// Sync isi editor cuma sekali tiap sheet dibuka (bukan tiap render),
	// supaya posisi kursor tidak lompat-lompat saat user sedang mengetik.
	useEffect(() => {
		if (visible && editorRef.current) {
			editorRef.current.innerHTML = value || '';
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	// Pantau perubahan seleksi/kursor selama sheet terbuka supaya status
	// toolbar tetap sinkron (misal saat user klik pindah baris tanpa mengetik).
	useEffect(() => {
		if (!visible) return;
		document.addEventListener('selectionchange', refreshActiveFormats);
		return () => document.removeEventListener('selectionchange', refreshActiveFormats);
	}, [visible]);

	if (!visible) return null;

	function exec(command: string) {
		editorRef.current?.focus();
		document.execCommand(command, false);
		refreshActiveFormats();
	}

	function toggleChecklist() {
		editorRef.current?.focus();
		document.execCommand(
			'insertHTML',
			false,
			'<div class="flex items-start gap-2 my-1"><input type="checkbox" class="mt-1 accent-primary-main shrink-0" /><span contenteditable="true" class="flex-1">Item baru</span></div>'
		);
		refreshActiveFormats();
	}

	function handleSave() {
		onSave(editorRef.current?.innerHTML ?? '');
		onClose();
	}

	const toolbarIconBtnClass = (active: boolean) =>
		`p-2 rounded-lg transition-colors ${
			active ? 'bg-primary-main text-white' : 'hover:bg-neutral-50 text-neutral-main'
		}`;

	const toolbarLetterBtnClass = (active: boolean) =>
		`w-9 h-9 rounded-lg transition-colors ${
			active ? 'bg-primary-main text-white' : 'hover:bg-neutral-50 text-neutral-main'
		}`;

	const now = DateTime.now();
	const updatedLabel = updatedAt ? DateTime.fromISO(updatedAt).setLocale('id').toRelative() : null;
	const dayLabel = updatedAt && !DateTime.fromISO(updatedAt).hasSame(now, 'day')
		? now.setLocale('id').toFormat('d MMM')
		: 'Today';

	return (
		<div className="fixed inset-0 z-50 flex items-end">
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />

			<div className="relative w-full bg-white rounded-t-3xl flex flex-col max-h-[85vh] pb-[env(safe-area-inset-bottom,0px)]">
				<div className="flex justify-center pt-3 pb-1 shrink-0">
					<div className="w-10 h-1.5 rounded-full bg-neutral-200" />
				</div>

				<div className="px-5 pt-2 shrink-0">
					<h2 className="text-xl font-bold text-neutral-main">Catatan Surveyor</h2>
					<div className="flex items-center gap-1.5 text-xs text-neutral-5 mt-1.5">
						<Icon name="history" size="0.9rem" />
						<span>{updatedLabel ? `Terakhir diperbarui ${updatedLabel}` : 'Belum pernah disimpan'}</span>
						<span>•</span>
						<span>
							{dayLabel}, {now.toFormat('HH:mm')}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-1 px-5 pt-4 shrink-0">
					<button
						type="button"
						onClick={() => exec('insertUnorderedList')}
						className={toolbarIconBtnClass(activeFormats.list)}
						aria-label="Bullet list"
						aria-pressed={activeFormats.list}
					>
						<Icon name="format_list_bulleted" size="1.25rem" fill={activeFormats.list ? 1 : 0} />
					</button>
					<button
						type="button"
						onClick={toggleChecklist}
						className={toolbarIconBtnClass(false)}
						aria-label="Checklist"
					>
						<Icon name="checklist" size="1.25rem" />
					</button>
					<div className="w-px h-5 bg-neutral-200 mx-1" />
					<button
						type="button"
						onClick={() => exec('bold')}
						className={`${toolbarLetterBtnClass(activeFormats.bold)} font-bold`}
						aria-label="Bold"
						aria-pressed={activeFormats.bold}
					>
						B
					</button>
					<button
						type="button"
						onClick={() => exec('italic')}
						className={`${toolbarLetterBtnClass(activeFormats.italic)} italic`}
						aria-label="Italic"
						aria-pressed={activeFormats.italic}
					>
						I
					</button>
				</div>

				<hr className="mt-3 border-neutral-100 shrink-0" />

				<div
					ref={editorRef}
					contentEditable
					suppressContentEditableWarning
					data-placeholder="Tulis catatan untuk taman ini..."
					onKeyUp={refreshActiveFormats}
					onMouseUp={refreshActiveFormats}
					onFocus={refreshActiveFormats}
					className="flex-1 overflow-y-auto px-5 py-4 text-sm text-neutral-700 leading-relaxed outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-400"
				/>

				<div className="px-5 pb-3 shrink-0">
					<div className="rounded-xl bg-orange-50 border border-orange-200 px-3 py-2.5 flex gap-2 items-start">
						<Icon name="location_on" size="1.1rem" fill={1} color="#C2410C" />
						<div>
							<p className="text-xs font-bold italic text-orange-900">Perhatikan!</p>
							<p className="text-xs text-orange-800 leading-snug">
								Catatan ini akan terlihat oleh tim desainer sebagai referensi tambahan.
							</p>
						</div>
					</div>
				</div>

				<div className="flex gap-3 px-5 pb-5 shrink-0">
					<Button label="Kembali" buttonType="secondary" style="flex-1" action={onClose} />
					<Button label="Simpan Draft" buttonType="primary" style="flex-1" action={handleSave} />
				</div>
			</div>
		</div>
	);
}