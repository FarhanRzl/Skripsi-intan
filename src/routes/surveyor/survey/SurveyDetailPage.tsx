// Padanan routes/surveyor/survey/[slug]/+page.svelte
//
// Catatan scope: form survey lengkap (tag-based, per taman) belum di-port —
// itu tetap di-defer ke SurveyFormPage.tsx (Fase 5), sama seperti rencana
// awal project ini. Tab "Form Survey" di halaman ini hanya menampilkan
// ringkasan laporan yang sudah ada (kalau status in_review/finish).
//
// Fitur edit lokasi via peta (Location.tsx) juga belum dipakai di sini karena
// skema `orderDesigns` saat ini menyimpan alamat sebagai teks (`address`),
// bukan koordinat lat/lng terpisah — jadi edit alamat cukup lewat form teks.
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import NavbarTop from '$lib/navbars/NavbarTop';
import CardSurvey from '$lib/CardSurvey';
import CollapsibleSummary from '$lib/CollapsibleSummary';
import Icon from '$lib/Icon';
import Timer from '$lib/Timer';
import Edit, { type EditValues } from '$lib/modals/Edit';
import { NoFormIllustration } from '$lib/assets/Illustrations';
import { addToast } from '$lib/Toaster';
import { formatDisplay, getWaMeUrl } from '$lib/utils/phone';
import { useSurveyDetail, useSurveyReports } from '$data/useSurveys';
import { checkInSurvey, updateOrderDesign } from '$data/surveyActions';
import { useTagsQuery } from '$lib/stores/tags';
import { STAGE1_TAG_TYPES, STAGE2_TAG_TYPES } from '$lib/survey-form/tagTypes';
import { createEmptySurveyFormData } from '$lib/survey-form/types';
import SurveyReportSummary, { FileGroup } from '$lib/survey-form/SurveyReportSummary';
import SurveyResultCard from '$lib/survey-form/SurveyResultCard';

const sizeCategories = ['<= 10', '11-20', '21-30', '31-40', '41-50', '>= 51'];

type DetailTab = 'Detail Order' | 'Form Survey' | 'Log Activity';

export default function SurveyDetailPage() {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();
	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);

	const { data: survey, isPending, error, refetch } = useSurveyDetail(slug);
	const { data: reports } = useSurveyReports(slug);
	const { data: tags } = useTagsQuery([...STAGE1_TAG_TYPES, ...STAGE2_TAG_TYPES]);

	const [currentTab, setCurrentTab] = useState<DetailTab>('Detail Order');
	const [editModal, setEditModal] = useState<{ visible: boolean; title: string }>({
		visible: false,
		title: ''
	});
	const [isCheckingIn, setIsCheckingIn] = useState(false);
	const [isSavingEdit, setIsSavingEdit] = useState(false);

	useEffect(() => {
		if (containerRef.current) setWidth(containerRef.current.clientWidth);
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const tab = params.get('tab') as DetailTab | null;
		if (tab) setCurrentTab(tab);
	}, []);

	const tabStyle = (tab: DetailTab) =>
		tab === currentTab
			? 'bg-white text-primary-main border border-b-0'
			: 'text-neutral-4 border-b';

	const handleCheckIn = async () => {
		if (!survey || isCheckingIn) return;
		setIsCheckingIn(true);
		try {
			if (survey.status === 'wait_to_survey') {
				await checkInSurvey(survey.id);
				await refetch();
			}

			// Survey `incomplete` sudah pernah melewati halaman "Jumlah Taman" &
			// submit Tahap 1 sebelumnya (taman-nya sudah ditentukan) — jadi
			// "Lengkapi Survey" langsung ke /form (di-hydrate dari laporan yang
			// sudah ada), tidak perlu lewat /start lagi.
			if (survey.status === 'incomplete') {
				navigate(`/surveyor/survey/${survey.id}/form`);
			} else {
				navigate(`/surveyor/survey/${survey.id}/start`);
			}
		} catch (err) {
			console.error(err);
			addToast({
				data: {
					title: 'Gagal check-in survey',
					color: 'red',
					bg: '#FDE0D5',
					border: 'red',
					icon: 'warning'
				}
			});
		} finally {
			setIsCheckingIn(false);
		}
	};

	const handleSaveEdit = async (values: EditValues) => {
		if (!survey) return;
		setIsSavingEdit(true);
		try {
			await updateOrderDesign(survey.orderDesignId, values);
			await refetch();
			addToast({
				data: {
					title: 'Perubahan berhasil disimpan',
					color: '#4EA40F',
					bg: '#EAFACC',
					border: '#4EA40F',
					icon: 'check_box'
				}
			});
		} catch (err) {
			console.error(err);
			addToast({
				data: {
					title: 'Gagal menyimpan perubahan',
					color: 'red',
					bg: '#FDE0D5',
					border: 'red',
					icon: 'warning'
				}
			});
		} finally {
			setIsSavingEdit(false);
		}
	};

	const calcDuration = () => {
		if (!survey?.checkInAt || !survey?.checkOutAt) return '-';
		const diff = Math.floor(
			DateTime.fromISO(survey.checkOutAt).diff(DateTime.fromISO(survey.checkInAt)).as('seconds')
		);
		const hh = Math.floor(diff / 3600);
		const mm = Math.floor(diff / 60) % 60;
		const ss = diff % 60;
		const pad = (n: number) => (n < 10 ? `0${n}` : n.toString());
		return `${pad(hh)} : ${pad(mm)} : ${pad(ss)}`;
	};

	if (isPending) {
		return <div className="p-5 text-sm text-neutral-5">Memuat detail survey...</div>;
	}

	if (error || !survey) {
		return <div className="p-5 text-sm text-danger-main">Survey tidak ditemukan.</div>;
	}

	const canEdit = survey.status === 'in_review';
	// "Survey Selesai" / "Sedang Ditinjau" — Ukuran & Foto Area di tab Detail
	// Order beralih dari data order (estimasi sebelum survey) ke data REAL
	// per taman yang surveyor kumpulkan di lapangan (designSurveyReports).
	const isSurveyDone = survey.status === 'in_review' || survey.status === 'finish';

	return (
		<main ref={containerRef} className="relative pb-24">
			<NavbarTop pageName="Detail Survey" parentWidth={width} />

			{editModal.visible && (
				<Edit
					visible={editModal.visible}
					onVisibleChange={(v) => setEditModal((prev) => ({ ...prev, visible: v }))}
					title={editModal.title}
					address={survey.address}
					areaSize={survey.areaSize}
					consultationDate={survey.consultationDate}
					consultationTime={survey.consultationTime}
					onSave={handleSaveEdit}
				/>
			)}

			{(survey.status === 'wait_to_survey' ||
				survey.status === 'ongoing' ||
				survey.status === 'incomplete') && (
				<div className="mx-5 mt-20">
					<CardSurvey
						page="Detail Survey"
						schedule={survey.scheduledAt}
						address={survey.address}
						status={survey.status as any}
						user={survey.user}
						buttonAction={handleCheckIn}
					/>
				</div>
			)}

			{(survey.status === 'in_review' || survey.status === 'finish') && (
				<div className="mx-4 mt-20 space-y-3">
					{reports.length > 0 ? (
						reports.map((entry) => {
							const reportData = { ...createEmptySurveyFormData(), ...(entry.rawData ?? {}) };
							return (
								<SurveyResultCard
									key={entry.id}
									gardenName={entry.gardenName}
									clientName={survey.user.name}
									checkInAt={survey.checkInAt}
									address={survey.address}
									expectedGardenBuildDate={reportData.expectedGardenBuildDate}
								/>
							);
						})
					) : (
						<div className="flex flex-col items-center bg-neutral-8 rounded-xl p-4">
							<p className="text-sm font-semibold text-primary-main">
								{survey.status === 'in_review' ? 'Sedang Ditinjau' : 'Survey Selesai'}
							</p>
						</div>
					)}
				</div>
			)}

			<div className="flex justify-between mt-6 mx-5">
				<button
					onClick={() => setCurrentTab('Detail Order')}
					className={`${tabStyle('Detail Order')} flex-1 px-3 py-2.5 font-semibold border-neutral-8 rounded rounded-b-none`}
				>
					Detail Order
				</button>
				<button
					onClick={() => setCurrentTab('Form Survey')}
					className={`${tabStyle('Form Survey')} flex-1 px-3 py-2.5 font-semibold border-neutral-8 rounded rounded-b-none`}
				>
					Form Survey
				</button>
				<button
					onClick={() => setCurrentTab('Log Activity')}
					className={`${tabStyle('Log Activity')} flex-1 px-3 py-2.5 font-semibold border-neutral-8 rounded rounded-b-none`}
				>
					Log Activity
				</button>
			</div>

			{/* Detail Order Tab */}
			{currentTab === 'Detail Order' && (
				<div className="bg-white pt-5 pb-8 px-5 space-y-7">
					<div className="space-y-3 text-sm">
						<div className="flex justify-between text-primary-main pb-3">
							<h2 className="text-lg font-bold">Design</h2>
							<p>{`#${survey.invoiceId || 'No invoice'}`}</p>
						</div>
						<div className="flex items-center space-x-2">
							<Icon name="person" fill={1} />
							<p>{survey.user.name || 'No name'}</p>
						</div>
						<div className="flex items-center space-x-2">
							<Icon name="chat" fill={1} />
							{survey.user.phone ? (
								<a
									href={getWaMeUrl(survey.user.phone)}
									target="_blank"
									rel="noreferrer"
									className="underline"
								>
									{formatDisplay(survey.user.phone)}
								</a>
							) : (
								<p>No phone number</p>
							)}
						</div>
						<div className="flex items-center space-x-2">
							<Icon name="location_on" fill={1} />
							<p>{survey.address || 'No address'}</p>
						</div>
					</div>
					<hr />
					<div>
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg text-primary-main font-bold">Alamat Lengkap</h2>
							{canEdit && (
								<button onClick={() => setEditModal({ visible: true, title: 'Edit Alamat' })}>
									<Icon name="edit" fill={1} size="1.25rem" />
								</button>
							)}
						</div>
						<p className="text-sm">{survey.address || 'No address'}</p>
					</div>
					<hr />
					<div className="space-y-3 text-sm">
						<h2 className="text-lg text-primary-main font-bold">Detail Taman</h2>
						<p>Inspirasi</p>
						{survey.inspirationPhotos.length > 0 ? (
							<div className="grid grid-cols-2 gap-y-3 gap-x-2">
								{survey.inspirationPhotos.map((photo, i) => (
									<img key={i} src={photo} alt="gambar inspirasi" className="rounded-lg" />
								))}
							</div>
						) : (
							<p className="text-xs">Tidak ada gambar inspirasi taman</p>
						)}
					</div>
					<hr />
					<div className="space-y-2 text-xs">
						<div className="flex justify-between items-center">
							<h2 className="text-lg text-primary-main font-bold">Ukuran</h2>
							{canEdit && !isSurveyDone && (
								<button onClick={() => setEditModal({ visible: true, title: 'Edit Ukuran' })}>
									<Icon name="edit" fill={1} size="1.25rem" />
								</button>
							)}
						</div>
						{isSurveyDone && reports.length > 0 ? (
							<div className="space-y-3">
								{reports.map((entry) => (
									<div key={entry.id} className="flex justify-between items-center">
										<p className="text-sm">{entry.gardenName || 'Masukkan Nama Taman'}</p>
										<p>{entry.areaSize ? `${entry.areaSize} m²` : '-'}</p>
									</div>
								))}
							</div>
						) : (
							<>
								<div className="flex justify-between items-center">
									<p className="text-sm">Kategori Ukuran</p>
									<p>
										{sizeCategories[(survey.categorySizeId ?? 0) - 1] || '-'} m<sup>2</sup>
									</p>
								</div>
								<div className="flex justify-between items-center">
									<p className="text-sm">Ukuran</p>
									<p>{survey.areaSize ? `${survey.areaSize} m²` : '-'}</p>
								</div>
							</>
						)}
					</div>
					<hr />
					<div className="space-y-2">
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg text-primary-main font-bold">Jadwal Konsultasi</h2>
							{canEdit && (
								<button
									onClick={() => setEditModal({ visible: true, title: 'Edit Jadwal Konsultasi' })}
								>
									<Icon name="edit" fill={1} size="1.25rem" />
								</button>
							)}
						</div>
						<div className="flex space-x-2 items-center">
							<Icon name="calendar_month" fill={1} />
							<p className="text-sm">
								{survey.consultationDate
									? DateTime.fromISO(survey.consultationDate)
											.setLocale('id')
											.toFormat('cccc, dd MMMM yyyy')
									: '-'}
							</p>
						</div>
						<div className="flex space-x-2 items-center">
							<Icon name="schedule" fill={1} />
							<p className="text-sm">{survey.consultationTime || '-'}</p>
						</div>
					</div>
					<hr />
					<div>
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg text-primary-main font-bold">Foto Area</h2>
						</div>
						{isSurveyDone && reports.length > 0 ? (
							<div className="space-y-4">
								{reports.map((entry) => {
									const reportData = { ...createEmptySurveyFormData(), ...(entry.rawData ?? {}) };
									return (
										<div key={entry.id} className="space-y-2">
											<p className="text-sm font-semibold">
												{entry.gardenName || 'Masukkan Nama Taman'}
											</p>
											<FileGroup
												images={reportData.areaPhotoImages}
												videos={reportData.areaPhotoVideos}
												documents={reportData.areaPhotoDocuments}
												cloudUrl={reportData.areaPhotoCloudStorageUrl}
											/>
										</div>
									);
								})}
							</div>
						) : survey.areaPhotos.length > 0 ? (
							<div className="space-y-3 text-sm">
								{survey.areaPhotos.map((photo, i) => (
									<img key={i} src={photo || ''} alt={`foto area ${i}`} className="rounded-lg" />
								))}
							</div>
						) : (
							<p className="text-xs text-neutral-5">Belum ada foto area.</p>
						)}
					</div>
				</div>
			)}

			{/* Form Survey Tab */}
			{currentTab === 'Form Survey' && (
				<>
					{(survey.status === 'wait_to_survey' ||
						survey.status === 'ongoing' ||
						survey.status === 'incomplete') && (
						<div className="flex flex-col flex-1 pt-12 pb-24 items-center bg-white">
							<NoFormIllustration className="w-1/2" />
							<h1
								className="text-2xl"
								style={{ fontFamily: "'Libre Caslon Text', serif", fontWeight: 600 }}
							>
								Belum Dilakukan Survey
							</h1>
						</div>
					)}

					{(survey.status === 'in_review' || survey.status === 'finish') && (
						<div className="py-4 space-y-4">
							{reports.length === 0 && (
								<p className="text-center text-sm text-neutral-5 px-5">
									Belum ada data laporan survey untuk taman ini.
								</p>
							)}
							{reports.map((entry) => (
								<div key={entry.id} className="bg-white rounded-xl mx-4 shadow-card">
									<CollapsibleSummary label={entry.gardenName || 'Masukkan Nama Taman'} icon="yard">
										<div className="px-4 pb-4 space-y-4">
											<div className="flex justify-end">
												<button
													type="button"
													onClick={() =>
														navigate(
															`/surveyor/survey/${survey.id}/form?entryIndex=${entry.clientEntryIndex ?? ''}`
														)
													}
													className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-primary-main text-primary-main text-xs font-semibold bg-white"
												>
													<Icon name="edit" fill={1} size="0.9rem" />
													Edit Taman Ini
												</button>
											</div>

											{entry.rawData ? (
												<SurveyReportSummary
													data={{ ...createEmptySurveyFormData(), ...entry.rawData }}
													tags={tags}
												/>
											) : (
												<div className="space-y-2">
													<p className="text-sm text-neutral-6">
														{entry.surveyorNote || 'Belum ada catatan surveyor.'}
													</p>
													<p className="text-xs text-neutral-5">
														Ukuran: {entry.areaSize ? `${entry.areaSize} m²` : '-'}
													</p>
												</div>
											)}
										</div>
									</CollapsibleSummary>
								</div>
							))}
						</div>
					)}
				</>
			)}

			{/* Log Activity Tab */}
			{currentTab === 'Log Activity' && (
				<div className="flex flex-col pt-8 pb-8 px-8 space-y-4 bg-white font-semibold">
					<div className="flex justify-between items-center">
						<p>Waktu Checkin</p>
						<p className="text-lg text-primary-main">
							{survey.checkInAt ? DateTime.fromISO(survey.checkInAt).toFormat('HH:mm') : '-'}
						</p>
					</div>
					<div className="flex justify-between items-center">
						<p>Waktu Checkout</p>
						<p className="text-lg text-primary-main">
							{survey.checkOutAt ? DateTime.fromISO(survey.checkOutAt).toFormat('HH:mm') : '-'}
						</p>
					</div>
					<hr />
					<div className="flex justify-between items-center">
						<p>Durasi Survey</p>
						{survey.checkInAt && !survey.checkOutAt ? (
							<Timer checkInAt={survey.checkInAt} />
						) : (
							<p className="text-xl text-primary-main tracking-wider">{calcDuration()}</p>
						)}
					</div>
				</div>
			)}

			{isSavingEdit && (
				<div className="fixed inset-0 z-[60] bg-white/70 flex items-center justify-center">
					<div className="w-10 h-10 border-4 border-primary-main border-t-transparent rounded-full animate-spin" />
				</div>
			)}
		</main>
	);
}