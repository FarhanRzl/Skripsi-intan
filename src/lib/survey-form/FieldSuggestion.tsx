// Pengganti tombol besar "Salin jawaban dari Taman 1" yang dulu ada di
// SurveyFormPage.tsx (menyalin SEMUA jawaban sekaligus). Sekarang tiap
// section/field punya saran sendiri-sendiri lewat komponen kecil ini —
// muncul HANYA kalau field terkait di taman aktif masih kosong dan Taman 1
// sudah punya jawaban untuk field itu. User bisa pilih mau isi field mana
// saja lewat saran, sisanya tetap diisi manual.
//
// Tampilan disesuaikan dengan desain: chip hijau pastel dengan ikon
// sparkle, teks "Disarankan dari {nama taman sumber}:" + jawaban yang
// disarankan (italic, dalam tanda kutip), dan tombol pill hijau solid
// "Terapkan" dengan ikon centang.
import { Check } from 'lucide-react';

interface FieldSuggestionProps {
	// Nama taman sumber saran (Taman 1 / firstGardenData.gardenName).
	// Fallback ke "Taman 1" kalau taman itu belum sempat diberi nama.
	gardenName: string;
	// Jawaban yang disarankan, ditampilkan dalam tanda kutip miring.
	value: string;
	onApply: () => void;
}

function SparkleIcon() {
	return (
		<svg
			width="19"
			height="18"
			viewBox="0 0 19 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="shrink-0"
			aria-hidden="true"
		>
			<path
				d="M7.12484 3L9.104 7.125L13.4582 9L9.104 10.875L7.12484 15L5.14567 10.875L0.791504 9L5.14567 7.125L7.12484 3ZM7.12484 6.6225L6.33317 8.25L4.61525 9L6.33317 9.75L7.12484 11.3775L7.9165 9.75L9.63442 9L7.9165 8.25L7.12484 6.6225ZM15.0415 6.75L14.044 4.695L11.8748 3.75L14.044 2.8125L15.0415 0.75L16.0311 2.8125L18.2082 3.75L16.0311 4.695L15.0415 6.75ZM15.0415 17.25L14.044 15.195L11.8748 14.25L14.044 13.3125L15.0415 11.25L16.0311 13.3125L18.2082 14.25L16.0311 15.195L15.0415 17.25Z"
				fill="#37602C"
			/>
		</svg>
	);
}

export default function FieldSuggestion({ gardenName, value, onApply }: FieldSuggestionProps) {
	return (
		<div className="w-full flex items-center gap-3 rounded-xl border border-primary-main bg-primary-surface px-3 py-2.5">
			<SparkleIcon />

			<div className="flex-1 min-w-0">
				<p className="text-xs font-bold text-[#37602C] leading-snug">
					Disarankan dari {gardenName}:
				</p>
				{value && (
					<p className="text-xs italic text-neutral-2 leading-snug break-words">
						&ldquo;{value}&rdquo;
					</p>
				)}
			</div>

			<button
				type="button"
				onClick={onApply}
				className="shrink-0 flex items-center gap-1.5 rounded-lg bg-primary-main px-3 py-2 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
			>
				<Check size={16} strokeWidth={3} />
				Terapkan
			</button>
		</div>
	);
}
