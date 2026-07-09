// Layar konfirmasi yang tampil setelah "Submit" di SurveyFormPage berhasil
// tersimpan TAPI Tahap 2 belum lengkap di salah satu taman (assignment jadi
// `incomplete`). Menggantikan toast info + navigate langsung ke Detail
// Survey untuk kasus ini, supaya surveyor bisa langsung memilih lanjut
// melengkapi form atau kembali ke Beranda — sesuai mockup "Survey Berhasil
// Disimpan!".
import NavbarTop from '$lib/navbars/NavbarTop';
import Icon from '$lib/Icon';

interface SurveySavedScreenProps {
	/** 0–100, gabungan progres Tahap 1 + Tahap 2 di semua taman */
	percentage: number;
	parentWidth?: number;
	onBackToHome: () => void;
	onContinueFilling: () => void;
}

export default function SurveySavedScreen({
	percentage,
	parentWidth,
	onBackToHome,
	onContinueFilling
}: SurveySavedScreenProps) {
	const clamped = Math.max(0, Math.min(100, Math.round(percentage)));

	return (
		<main className="relative min-h-screen bg-white">
			<NavbarTop pageName="Detail Survey" parentWidth={parentWidth} />

			<div className="flex flex-col items-center px-6 pt-28 pb-10">
				<div className="flex items-center justify-center w-28 h-28 rounded-full bg-primary-main mb-6 shadow-card">
					<svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M22.9333 38.9333L41.7333 20.1333L38 16.4L22.9333 31.4667L15.3333 23.8667L11.6 27.6L22.9333 38.9333ZM26.6667 53.3333C22.9778 53.3333 19.5111 52.6333 16.2667 51.2333C13.0222 49.8333 10.2 47.9333 7.8 45.5333C5.4 43.1333 3.5 40.3111 2.1 37.0667C0.7 33.8222 0 30.3556 0 26.6667C0 22.9778 0.7 19.5111 2.1 16.2667C3.5 13.0222 5.4 10.2 7.8 7.8C10.2 5.4 13.0222 3.5 16.2667 2.1C19.5111 0.7 22.9778 0 26.6667 0C30.3556 0 33.8222 0.7 37.0667 2.1C40.3111 3.5 43.1333 5.4 45.5333 7.8C47.9333 10.2 49.8333 13.0222 51.2333 16.2667C52.6333 19.5111 53.3333 22.9778 53.3333 26.6667C53.3333 30.3556 52.6333 33.8222 51.2333 37.0667C49.8333 40.3111 47.9333 43.1333 45.5333 45.5333C43.1333 47.9333 40.3111 49.8333 37.0667 51.2333C33.8222 52.6333 30.3556 53.3333 26.6667 53.3333Z"
							fill="#D3FFC1"
						/>
					</svg>
				</div>

				<h1
					className="text-2xl text-neutral-main text-center mb-3"
					style={{ fontFamily: "'Libre Caslon Text', serif", fontWeight: 600 }}
				>
					Survey Berhasil Disimpan!
				</h1>
				<p className="text-sm text-neutral-4 text-center mb-8 max-w-xs">
					Silahkan ubah dan lengkapi data survey untuk segera diproses oleh designer.
				</p>

				<div className="w-full bg-white rounded-xl border border-neutral-8 shadow-card p-4 mb-8">
					<div className="flex items-center justify-between mb-3">
						<p className="font-bold text-neutral-main">Kelengkapan Survey</p>
						<span className="text-xs font-semibold text-success-hover bg-primary-surface rounded-full px-3 py-1">
							{clamped}% Selesai
						</span>
					</div>
					<div className="w-full h-2 rounded-full bg-neutral-8 overflow-hidden">
						<div
							className="h-full rounded-full bg-primary-main transition-all duration-500"
							style={{ width: `${clamped}%` }}
						/>
					</div>
				</div>

				<div className="w-full space-y-3">
					<button
						type="button"
						onClick={onBackToHome}
						className="w-full py-3 rounded-xl bg-primary-main text-white font-semibold text-sm"
					>
						Kembali ke Beranda
					</button>
					<button
						type="button"
						onClick={onContinueFilling}
						className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary-main text-primary-main font-semibold text-sm"
					>
						Lanjutkan Pengisian
						<Icon name="arrow_forward" size="1.1rem" />
					</button>
				</div>
			</div>
		</main>
	);
}