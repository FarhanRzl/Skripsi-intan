// Padanan src/routes/surveyor/survey/[slug]/start/+page.svelte (project Svelte).
//
// Halaman "Jumlah Taman" — muncul setelah check-in, sebelum masuk ke form
// survey per-taman. Belum ada sebelumnya di React, jadi ini halaman baru.
//
// Catatan integrasi (fase berikutnya): query param `gardenCount` di URL saat
// ini baru dikirim ke halaman /form, belum dipakai untuk menentukan jumlah
// entri taman awal di SurveyFormPage — supaya flow yang sudah berjalan di
// SurveyFormPage tidak berubah dulu di fase ini.
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import NavbarTop from '$lib/navbars/NavbarTop';
import Navbar from '$lib/navbars/Navbar';
import Alert from '$lib/Alert';
import { useSurveyDetail } from '$data/useSurveys';

const formatDigit = (digit: number) => (digit < 10 ? `0${digit}` : digit.toString());

export default function SurveyStartPage() {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();
	const { data: survey } = useSurveyDetail(slug);

	const [width, setWidth] = useState(0);
	const containerRef = useRef<HTMLElement>(null);

	const [gardenCount, setGardenCount] = useState(1);
	const [timerDisplay, setTimerDisplay] = useState('00 : 00 : 00');

	useEffect(() => {
		if (!containerRef.current) return;
		const el = containerRef.current;
		const observer = new ResizeObserver(() => setWidth(el.clientWidth));
		observer.observe(el);
		setWidth(el.clientWidth);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!survey?.checkInAt) return;

		const updateTimer = () => {
			const checkInTime = DateTime.fromISO(survey.checkInAt as string);
			const diff = Math.floor(DateTime.now().diff(checkInTime).as('seconds'));
			const hh = Math.floor(diff / 3600);
			const mm = Math.floor(diff / 60) % 60;
			const ss = diff % 60;
			setTimerDisplay(`${formatDigit(hh)} : ${formatDigit(mm)} : ${formatDigit(ss)}`);
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, [survey?.checkInAt]);

	const decrement = () => setGardenCount((c) => (c > 1 ? c - 1 : c));
	const increment = () => setGardenCount((c) => c + 1);

	const handleMulaiSurvey = () => {
		navigate(`/surveyor/survey/${slug}/form?gardenCount=${gardenCount}`);
	};

	return (
		<main ref={containerRef} className="relative min-h-screen bg-white">
			<NavbarTop pageName="Detail Survey" parentWidth={width} />

			{/* Timer Banner */}
			{survey?.checkInAt ? (
				<div className="flex justify-between items-center px-5 pt-20 pb-3">
					<p className="text-danger-main text-xs">Survey Berlangsung</p>
					<h1
						className="text-md font-bold text-primary-main"
						style={{ fontFamily: "'Libre Caslon Text', serif" }}
					>
						{timerDisplay}
					</h1>
				</div>
			) : (
				<div className="pt-20"></div>
			)}

			{/* Content */}
			<div className="px-6 pt-6 pb-36">
				<h1
					className="text-2xl font-bold text-primary-main mb-2"
					style={{ fontFamily: "'Libre Caslon Text', serif" }}
				>
					Jumlah Taman
				</h1>
				<p className="text-xs text-primary-main mb-10 leading-snug">
					Isi dengan jumlah taman yang akan Anda survey pada klien ini. Anda dapat menyesuaikannya
					nanti.
				</p>

				{/* Counter */}
				<div className="flex items-center justify-center gap-10 mb-10">
					<button
						onClick={decrement}
						disabled={gardenCount <= 1}
						className="w-10 h-10 flex items-center justify-center text-2xl font-bold text-primary-main disabled:text-neutral-300"
					>
						−
					</button>
					<span className="text-4xl font-bold text-primary-main tabular-nums w-8 text-center">
						{gardenCount}
					</span>
					<button
						onClick={increment}
						className="w-10 h-10 flex items-center justify-center text-2xl font-bold text-primary-main"
					>
						+
					</button>
				</div>

				{/* Info Note */}
				<Alert
					icon="error"
					message="Jika ada perubahan pada jumlah taman, Anda dapat menambahkan saat pengisian data survey."
				/>
			</div>

			{/* Bottom Button */}
			<div
				style={{ width: width || undefined }}
				className="fixed bottom-16 px-5 py-4 bg-white border-t border-neutral-100"
			>
				<button
					onClick={handleMulaiSurvey}
					className="w-full bg-primary-main text-white font-semibold py-3 rounded-xl text-base"
				>
					Mulai Survey
				</button>
			</div>

			<Navbar parentWidth={width} />
		</main>
	);
}
