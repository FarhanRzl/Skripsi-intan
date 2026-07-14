// Padanan routes/surveyor/survey/[slug]/form/+page.svelte — halaman paling
// kompleks di project ini. Mengelola beberapa entri "taman" (surveyEntries).
//
// Alur (revisi): Tahap 1 WAJIB, Tahap 2 (Info Tambahan) OPSIONAL.
//   - User isi Tahap 1 tiap taman -> boleh langsung "Kirim" begitu Tahap 1
//     semua taman valid, tanpa dipaksa isi Tahap 2 dulu.
//   - Kalau Tahap 2 belum diisi lengkap (untuk taman manapun) saat dikirim,
//     assignment ditandai `incomplete` ("Perlu Dilengkapi" di tab Tinjauan)
//     supaya bisa dilengkapi lagi nanti lewat halaman ini.
//   - Kalau semua taman SUDAH lengkap Tahap 1 & Tahap 2 saat dikirim,
//     assignment langsung ditandai `in_review`.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import NavbarTop from '$lib/navbars/NavbarTop';
import Button from '$lib/buttons/Button';
import Icon from '$lib/Icon';
import Edit, { type EditValues } from '$lib/modals/Edit';
import Confirmation from '$lib/modals/Confirmation';
import { addToast } from '$lib/Toaster';
import { useSurveyDetail, useSurveyReports } from '$data/useSurveys';
import {
	submitDesignSurveyReport,
	finishSurveyAssignment,
	markSurveyIncomplete,
	updateOrderDesign
} from '$data/surveyActions';
import { useTagsQuery } from '$lib/stores/tags';
import SurveyFormV2 from '$lib/survey-form/SurveyFormV2';
import SurveyFormV3 from '$lib/survey-form/SurveyFormV3';
import AddSurveyQuestionModal from '$lib/survey-form/AddSurveyQuestionModal';
import SurveyorNoteForm from '$lib/survey-form/SurveyorNoteForm';
import { createEmptySurveyFormData, type SurveyFormData } from '$lib/survey-form/types';
import { DesignSurveyReportStage1GateSchema } from '$types/design-survey-report-stage1';
import { DesignSurveyReportStage2GateSchema } from '$types/design-survey-report-stage2';
import { stage2QuestionCatalog, type Stage2FieldKey } from '$lib/survey-form/stage2Questions';
import { requiredMessage, DEFAULT_REQUIRED_MESSAGE } from '$lib/survey-form/requiredFieldMessages';
import { STAGE1_TAG_TYPES, STAGE2_TAG_TYPES } from '$lib/survey-form/tagTypes';
import { getStoredSurveys, saveStoredSurveys } from '../../../utils/storageHelper';
import SubmitConfirmModal from '$lib/modals/SubmitConfirmModal';
import SurveySavedScreen from './SurveySavedScreen';
const sizeCategories = ['<= 10', '11-20', '21-30', '31-40', '41-50', '>= 51'];

// Progress bar dihitung dari JUMLAH SECTION YANG BENAR-BENAR TAMPIL DI LAYAR
// (bukan jumlah field di skema Zod) — 12 section Tahap 1 yang SELALU tampil
// di SurveyFormV2/V3 (GardenNameForm s/d FormSoilCondition), dipecah PER
// SECTION UI (bukan digabung per pasangan field seperti sebelumnya) supaya
// progress naik tiap 1 section selesai diisi, bukan nunggu 2 section
// sekaligus. fixedStructures & surveyorNote SENGAJA tidak dihitung di sini:
// fixedStructures adalah bagian katalog Tahap 2 (opsional, lewat "Tambah
// Isian Survey" / bagian flat di Edit Form Survey — lihat
// isExtraFieldFilled), dan surveyorNote bukan section inline melainkan
// fitur "Catatan Surveyor" terpisah (floating note FAB) — keduanya tidak
// pernah tampil sebagai bagian dari komponen Tahap 1 di layar.
const TOTAL_SECTIONS_STAGE1 = 12;
// 3 section Dokumentasi wajib di halaman "Edit Form Survey" / SurveyFormV3 —
// sama persis dengan yang dicek firstEmptyDocumentationField (areaPhoto,
// plantPresence, sketch). "Dokumentasi Lainnya" sengaja tidak dihitung,
// konsisten dengan firstEmptyDocumentationField.
const TOTAL_SECTIONS_DOCUMENTATION = 3;

// 4 key katalog Tahap 2 yang direpresentasikan sebagai section "Dokumentasi"
// (FormAreaPhoto/FormUploadTanaman/FormSketch/FormDocumentationUpload) di
// SurveyFormV3, BUKAN section "Info Tambahan" — progress-nya dihitung lewat
// calcProgressDocumentation/TOTAL_SECTIONS_DOCUMENTATION, jadi dikeluarkan
// dari hitungan section Info Tambahan supaya tidak dobel-hitung.
const DOCUMENTATION_STAGE2_KEYS = new Set<Stage2FieldKey>([
	'PhotoAreaId',
	'existingPlantPhoto',
	'sketchPhoto',
	'otherDocumentation'
]);

const ALL_STAGE2_FIELD_KEYS = stage2QuestionCatalog.map((q) => q.key);

function calcProgressStage1(data: SurveyFormData): number {
	let filled = 0;
	if (data.gardenName) filled++;
	if (data.areaSize) filled++;
	if (data.areaSunExposureTimes?.length) filled++;
	if (data.sunExposureObstructionId) filled++;
	if (data.drainageId) filled++;
	if (data.waterSourceId) filled++;
	if (data.electricitySourceId) filled++;
	if (data.entranceAccessId) filled++;
	if (data.gardenEntranceAccessId) filled++;
	if (data.groundSurfaceConditionId) filled++;
	if (data.landPreparations?.length) filled++;
	if (data.soilMoistureId) filled++;
	return filled;
}

// "Sudah diisi?" per section Tahap 2 / Info Tambahan (katalog
// stage2Questions.ts) — dipakai baik utk section yang sudah ditambahkan
// lewat "Tambah Isian Survey" (Tahap 1/isOngoing) maupun section flat di
// Edit Form Survey (SurveyFormV3). Key Dokumentasi selalu dianggap "belum
// terisi" di sini karena progress-nya dihitung terpisah lewat
// calcProgressDocumentation (lihat DOCUMENTATION_STAGE2_KEYS).
function isExtraFieldFilled(data: SurveyFormData, key: Stage2FieldKey): boolean {
	if (key === 'fixedStructures') return (data.fixedStructures?.length ?? 0) > 0;
	if (key === 'plantRequests') return (data.itemRequests?.length ?? 0) > 0;
	if (
		key === 'PhotoAreaId' ||
		key === 'existingPlantPhoto' ||
		key === 'sketchPhoto' ||
		key === 'otherDocumentation'
	) {
		return false;
	}
	return Boolean(data[key]);
}

function calcExtraFieldsProgress(data: SurveyFormData, keys: Stage2FieldKey[]): number {
	return keys.reduce((sum, key) => sum + (isExtraFieldFilled(data, key) ? 1 : 0), 0);
}

// Padanan firstEmptyDocumentationField, tapi berupa hitungan (bukan cari
// field kosong pertama) — dipakai supaya progress bar di "Edit Form Survey"
// (SurveyFormV3) ikut menghitung section Dokumentasi, bukan cuma Tahap 1.
function calcProgressDocumentation(data: SurveyFormData): number {
	let filled = 0;

	const hasAreaPhoto =
		(data.areaPhotoImages?.length ?? 0) > 0 ||
		(data.areaPhotoVideos?.length ?? 0) > 0 ||
		(data.areaPhotoDocuments?.length ?? 0) > 0 ||
		Boolean(data.areaPhotoCloudStorageUrl);
	if (hasAreaPhoto) filled++;

	const hasPlantPresence =
		(data.plantPresences?.length ?? 0) > 0 || Boolean(data.plantPresenceCloudStorageUrl);
	if (hasPlantPresence) filled++;

	const hasSketch =
		(data.sketchImages?.length ?? 0) > 0 ||
		(data.sketchDocuments?.length ?? 0) > 0 ||
		Boolean(data.sketchCloudStorageUrl);
	if (hasSketch) filled++;

	return filled;
}


const formatTimerDigit = (digit: number) => (digit < 10 ? `0${digit}` : digit.toString());

interface SurveyEntry {
	index: string;
	data: SurveyFormData;
	showValidationWarning: boolean;
	// Pertanyaan Tahap 2 yang sudah ditambahkan inline ke Tahap 1 lewat
	// tombol "Tambah Isian Survey" (lihat SurveyFormV2.tsx).
	extraFields: Stage2FieldKey[];
	// Id laporan (designSurveyReports) yang sudah tersimpan di backend untuk
	// taman ini, kalau sebelumnya sudah pernah disubmit (mis. status
	// `incomplete` -> dibuka lagi lewat "Lengkapi Survey"). Dipakai supaya
	// submit berikutnya meng-UPDATE laporan yang sama, bukan menambah baru.
	reportId: string | null;
}

function makeEntry(index: string): SurveyEntry {
	return {
		index,
		data: createEmptySurveyFormData(),
		showValidationWarning: false,
		extraFields: [],
		reportId: null
	};
}

// Catatan: fungsi deriveExtraFieldsFromData & hydrateEntryFromReport
// `rawData` designSurveyReports) sebelumnya dipakai di sini, tapi alur
// hydrasinya sudah dinonaktifkan (lihat komentar di dekat `hydratedRef` di
// bawah) — digantikan hydrasi dari localStorage (getStoredSurveys) berbasis
// `survey`. Dihapus supaya tidak jadi dead code.

export default function SurveyFormPage() {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();

	const { data: survey, isPending: isSurveyPending, refetch: refetchSurvey } = useSurveyDetail(slug);
	const { isPending: isReportsPending } = useSurveyReports(slug);
	const { data: tags, isPending: isTagsPending } = useTagsQuery([
		...STAGE1_TAG_TYPES,
		...STAGE2_TAG_TYPES
	]);

	// Padanan `gardenCount` yang dikirim dari SurveyStartPage.tsx (halaman
	// "Jumlah Taman" setelah check-in) lewat query param — dipakai sebagai
	// jumlah entri taman AWAL di sini. Kalau tidak ada / tidak valid, default
	// ke 1 taman (perilaku lama). Dibaca sekali lewat lazy initializer supaya
	// tidak ke-reset kalau komponen re-render.
	const [entries, setEntries] = useState<SurveyEntry[]>(() => {
		const params = new URLSearchParams(window.location.search);
		const gardenCount = Math.max(1, Number(params.get('gardenCount')) || 1);
		return Array.from({ length: gardenCount }, (_, i) => makeEntry(String(i)));
	});
	const [activeIndex, setActiveIndex] = useState('0');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isNoteOpen, setIsNoteOpen] = useState(false);
	// Padanan `updatedAt` catatan surveyor — belum ada kolomnya di schema
	// backend (surveyorNote cuma string), jadi disimpan lokal per taman
	// (key = entry.index) supaya label "Terakhir diperbarui ..." di
	// SurveyorNoteForm tetap akurat selama sesi pengisian form ini.
	const [noteUpdatedAt, setNoteUpdatedAt] = useState<Record<string, string>>({});
	const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);

	// Padanan tombol "Edit Alamat" di tab Detail Order (SurveyDetailPage.tsx) —
	// dipakai di sini supaya alamat juga bisa diedit langsung dari halaman
	// pengisian form, tanpa perlu berpindah halaman.
	const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
	const [isSavingAddress, setIsSavingAddress] = useState(false);

	// Konfirmasi hapus taman — hanya relevan kalau taman lebih dari 1
	// (removeEntry sendiri sudah menolak hapus taman terakhir).
	const [deleteConfirm, setDeleteConfirm] = useState<{ visible: boolean; index: string | null }>({
		visible: false,
		index: null
	});

	// Modal konfirmasi sebelum submit final — ditampilkan setelah validasi
	// Tahap 1 semua taman lolos, sebelum benar-benar mengirim data ke backend.
	const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
	// Diisi setelah performSubmitAll berhasil TAPI Tahap 2 belum lengkap di
	// salah satu taman (assignment -> `incomplete`) — memicu tampilan
	// SurveySavedScreen ("Survey Berhasil Disimpan!") menggantikan form,
	// alih-alih langsung navigate ke Detail Survey seperti kasus `in_review`.
	const [savedScreenPercentage, setSavedScreenPercentage] = useState<number | null>(null);

	const handleSaveAddress = async (values: EditValues) => {
		if (!survey || values.address === undefined) return;
		setIsSavingAddress(true);
		try {
			await updateOrderDesign(survey.orderDesignId, { address: values.address });
			await refetchSurvey();
			addToast({
				data: {
					title: 'Alamat berhasil diperbarui',
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
					title: 'Gagal menyimpan alamat',
					color: 'red',
					bg: '#FDE0D5',
					border: 'red',
					icon: 'warning'
				}
			});
		} finally {
			setIsSavingAddress(false);
		}
	};

	const confirmRemoveEntry = () => {
		if (deleteConfirm.index) removeEntry(deleteConfirm.index);
		setDeleteConfirm({ visible: false, index: null });
	};

	// Hydrasi entries dari laporan yang sudah pernah disubmit (mis. Tahap 1
	// sudah dikirim, assignment berstatus `incomplete`, lalu surveyor buka
	// lagi halaman ini buat "Lengkapi Survey"). Tanpa ini, form selalu mulai
	// kosong dan data Tahap 1 yang sudah diisi terlihat "hilang". Hanya
	// dijalankan SEKALI per kunjungan halaman (hydratedRef) supaya tidak
	// menimpa perubahan yang sedang diketik user kalau `reports` refetch.
	const hydratedRef = useRef(false);
	// useEffect(() => {
	// 	if (hydratedRef.current || isReportsPending) return;
	// 	hydratedRef.current = true;

	// 	if (reports.length === 0) return;

	// 	const sorted = [...reports].sort((a, b) => {
	// 		const ai = Number(a.clientEntryIndex ?? 0);
	// 		const bi = Number(b.clientEntryIndex ?? 0);
	// 		return ai - bi;
	// 	});

	// 	const hydrated = sorted.map((report, i) =>
	// 		hydrateEntryFromReport(report, report.clientEntryIndex || String(i))
	// 	);

	// 	setEntries(hydrated);
	// 	setActiveIndex(hydrated[0].index);
	// }, [reports, isReportsPending]);
	useEffect(() => {
		if (hydratedRef.current || !survey) return;
		hydratedRef.current = true;

		const surveys = getStoredSurveys();
		const savedSurvey = surveys[survey.id];

		if (!savedSurvey) return;

		setEntries(savedSurvey.entries);
		setActiveIndex(savedSurvey.entries[0]?.index);
	}, [survey]);

	const containerRef = useRef<HTMLElement>(null);
	const [width, setWidth] = useState(0);
	const [timerDisplay, setTimerDisplay] = useState('00 : 00 : 00');

	// Header sticky (progress bar + info + tab taman) sekarang bisa berubah
	// tinggi kalau tab taman wrap ke lebih dari satu baris (nama taman
	// panjang / taman banyak) — jadi tinggi spacer di bawahnya diukur live
	// lewat ResizeObserver, bukan angka tetap seperti sebelumnya.
	const stickyHeaderRef = useRef<HTMLDivElement>(null);
	const [stickyHeaderHeight, setStickyHeaderHeight] = useState(108); // fallback: progress+info(~100) + tabs(~8 margin)

	useEffect(() => {
		if (!containerRef.current) return;
		const el = containerRef.current;
		const observer = new ResizeObserver(() => setWidth(el.clientWidth));
		observer.observe(el);
		setWidth(el.clientWidth);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!stickyHeaderRef.current) return;
		const el = stickyHeaderRef.current;
		const observer = new ResizeObserver(() => setStickyHeaderHeight(el.offsetHeight));
		observer.observe(el);
		setStickyHeaderHeight(el.offsetHeight);
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
			setTimerDisplay(`${formatTimerDigit(hh)} : ${formatTimerDigit(mm)} : ${formatTimerDigit(ss)}`);
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, [survey?.checkInAt]);

	const sizeCategory = useMemo(() => {
		if (!survey) return '-';
		return sizeCategories[(survey.categorySizeId ?? 0) - 1] || '-';
	}, [survey]);

	const activeEntry = entries.find((e) => e.index === activeIndex) ?? entries[0];

	function updateSurveyEntries(formId: string, patch: Partial<SurveyFormData>) {
		setEntries((prev) =>
			prev.map((entry) =>
				entry.index === formId ? { ...entry, data: { ...entry.data, ...patch } } : entry
			)
		);
	}

	// Dipanggil dari tombol "Tambah Isian Survey" (lewat popup) di Tahap 1 —
	// menambahkan pertanyaan Tahap 2 yang dipilih supaya dirender inline,
	// tanpa memindahkan user ke tampilan Tahap 2 yang terpisah.
	function addExtraFields(formId: string, keys: Stage2FieldKey[]) {
		setEntries((prev) =>
			prev.map((entry) =>
				entry.index === formId
					? { ...entry, extraFields: Array.from(new Set([...entry.extraFields, ...keys])) }
					: entry
			)
		);
	}

	function addEntry() {
		const nextIndex = (
			entries.reduce((max, e) => Math.max(max, Number(e.index)), -1) + 1
		).toString();
		setEntries((prev) => [...prev, makeEntry(nextIndex)]);
		setActiveIndex(nextIndex);
	}
	// Taman "sumber saran" = taman pertama (entries[0], tampil sebagai "Taman 1").
	// Dari sini jawaban bisa disalin ke taman baru yang masih kosong.
	const firstEntry = entries[0];

	// Taman dianggap "masih kosong" kalau belum ada satu pun jawaban Tahap 1
	// maupun Tahap 2, dan belum ada pertanyaan tambahan yang ditambahkan.
	function isEntryEmpty(entry: SurveyEntry) {
		return (
			calcProgressStage1(entry.data) === 0 &&
			calcExtraFieldsProgress(entry.data, ALL_STAGE2_FIELD_KEYS) === 0 &&
			entry.extraFields.length === 0
		);
	}

	// Data Taman 1 yang diteruskan ke tiap section form (GardenNameForm,
	// FormOrientation, dst) supaya masing-masing bisa menawarkan saran
	// "salin jawaban dari Taman 1" PER FIELD — bukan tombol tunggal yang
	// menyalin semuanya sekaligus seperti sebelumnya. null kalau taman aktif
	// adalah Taman 1 sendiri, atau Taman 1 belum punya jawaban apa pun untuk
	// disarankan.
	const firstGardenDataForSuggestion: SurveyFormData | null =
		firstEntry && activeEntry && firstEntry.index !== activeEntry.index && !isEntryEmpty(firstEntry)
			? firstEntry.data
			: null;
	function removeEntry(index: string) {
		if (entries.length <= 1) return;
		const remaining = entries.filter((e) => e.index !== index);
		setEntries(remaining);
		if (activeIndex === index) setActiveIndex(remaining[0].index);

		// Hapus juga jawaban taman ini dari cache localStorage (kalau ada) —
		// supaya taman yang dihapus tidak muncul lagi saat form dibuka ulang
		// (mis. "Lengkapi Survey"). Kalau belum pernah tersimpan, tidak ada
		// yang perlu dihapus.
		if (survey) {
			const surveys = getStoredSurveys();
			const saved = surveys[survey.id];
			if (saved) {
				surveys[survey.id] = {
					...saved,
					entries: (saved.entries ?? []).filter((e: SurveyEntry) => e.index !== index),
					updatedAt: new Date().toISOString()
				};
				saveStoredSurveys(surveys);
			}
		}
	}

	function isStage1Valid(entry: SurveyEntry) {
		return DesignSurveyReportStage1GateSchema.safeParse(entry.data).success;
	}

		// Cari pertanyaan Tahap 1 pertama yang masih kosong (urutan issue Zod =
	// urutan field di skema = urutan tampilan form dari atas ke bawah), lalu
	// scroll ke section pertanyaannya. Tiap section punya atribut
	// `data-field="designSurveyReports.<index>.<fieldKey>"` (lihat komponen di
	// $lib/survey-form). Dipanggil saat user klik "Submit" tapi masih ada isian
	// wajib yang kosong. Pakai setTimeout supaya tab taman yang baru di-set
	// aktif sempat dirender dulu sebelum elemennya dicari & di-scroll.
	function firstEmptyStage1Field(entry: SurveyEntry): string | null {
		const result = DesignSurveyReportStage1GateSchema.safeParse(entry.data);
		if (result.success) return null;
		const firstPath = result.error.issues[0]?.path[0];
		return firstPath === undefined ? null : String(firstPath);
	}

	// Helper generik: scroll ke section dengan `data-field` tertentu milik
	// taman `entryIndex`. Dipakai baik untuk Tahap 1 (scrollToFirstEmptyField
	// di bawah) maupun untuk validasi gabungan Tahap 1 + Tahap 2 + Dokumentasi
	// di halaman "Edit Form Survey" / SurveyFormV3 (lihat firstEmptyFullField).
	//
	// Pakai retry/poll (bukan setTimeout sekali tembak) karena elemen
	// targetnya kadang belum ada di DOM tepat 100ms setelah dipanggil —
	// misalnya kalau invalidEntry beda dari taman yang lagi aktif (perlu
	// pindah tab dulu, re-render form barunya), atau section Alert yang baru
	// muncul (showValidationWarning baru di-set true) menggeser posisi
	// elemen setelah layout-nya berubah. Tanpa retry, querySelector bisa
	// return null di percobaan pertama dan scroll gagal tanpa ada error sama
	// sekali (silent fail) — persis gejala "auto scroll tidak jalan".
	function scrollToField(entryIndex: string, field: string | null) {
		if (!field) return;
		const selector = `[data-field="designSurveyReports.${entryIndex}.${field}"]`;
		let attempts = 0;
		const maxAttempts = 20; // total ~1 detik (20 x 50ms)

		const tryScroll = () => {
			const el = document.querySelector(selector);
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'center' });
				return;
			}
			attempts += 1;
			if (attempts < maxAttempts) {
				setTimeout(tryScroll, 50);
			}
		};

		setTimeout(tryScroll, 50);
	}

	function scrollToFirstEmptyField(entry: SurveyEntry) {
		scrollToField(entry.index, firstEmptyStage1Field(entry));
	}

	function isStage2Valid(entry: SurveyEntry) {
		return DesignSurveyReportStage2GateSchema.safeParse(entry.data).success;
	}

	// Padanan firstEmptyStage1Field, tapi untuk 5 field Tahap 2 yang memang
	// wajib (lihat DesignSurveyReportStage2GateSchema): areaSunExposureId,
	// rainGutterNeedId, childrenPresenceId, animalPresenceId, careLevelId.
	// Urutan issue Zod = urutan field di-`pick` di schema tsb, yang kebetulan
	// sama dengan urutan tampilnya di SurveyFormV3 (ikut stage2QuestionCatalog).
	function firstEmptyStage2Field(entry: SurveyEntry): string | null {
		const result = DesignSurveyReportStage2GateSchema.safeParse(entry.data);
		if (result.success) return null;
		const firstPath = result.error.issues[0]?.path[0];
		return firstPath === undefined ? null : String(firstPath);
	}

	// Section "Dokumentasi" di SurveyFormV3 (FormAreaPhoto, FormUploadTanaman,
	// FormSketch) — mengikuti referensi schema Svelte asli
	// (design-survey-reports.ts -> DesignSurveyReportInputUpdateSchema):
	// masing-masing wajib diisi minimal 1 file ATAU link Drive.
	// "Dokumentasi Lainnya" (FormDocumentationUpload) SENGAJA tidak diwajibkan,
	// konsisten dengan schema referensi tsb.
	function firstEmptyDocumentationField(entry: SurveyEntry): string | null {
		const d = entry.data;

		const hasAreaPhoto =
			(d.areaPhotoImages?.length ?? 0) > 0 ||
			(d.areaPhotoVideos?.length ?? 0) > 0 ||
			(d.areaPhotoDocuments?.length ?? 0) > 0 ||
			Boolean(d.areaPhotoCloudStorageUrl);
		if (!hasAreaPhoto) return 'areaPhotoCloudStorageUrl';

		const hasPlantPresence =
			(d.plantPresences?.length ?? 0) > 0 || Boolean(d.plantPresenceCloudStorageUrl);
		if (!hasPlantPresence) return 'plantPresences';

		const hasSketch =
			(d.sketchImages?.length ?? 0) > 0 ||
			(d.sketchDocuments?.length ?? 0) > 0 ||
			Boolean(d.sketchCloudStorageUrl);
		if (!hasSketch) return 'sketchCloudStorageUrl';

		return null;
	}

	// Gate lengkap untuk halaman "Edit Form Survey" / SurveyFormV3 — di sini
	// SEMUA pertanyaan (Tahap 1 + Tahap 2 wajib + Dokumentasi wajib) tampil
	// sekaligus dalam satu halaman flat (lihat activeExtraFieldKeys di bawah),
	// jadi validasi submit-nya juga mencakup ketiganya, dengan urutan yang
	// sama dengan urutan tampil di form supaya auto-scroll konsisten.
	function firstEmptyFullField(entry: SurveyEntry): string | null {
		return (
			firstEmptyStage1Field(entry) ?? firstEmptyStage2Field(entry) ?? firstEmptyDocumentationField(entry)
		);
	}



	// Tombol kirim aktif begitu Tahap 1 valid di SEMUA taman — Tahap 2 tidak
	// lagi jadi syarat.
	const canSubmit = entries.length > 0 && entries.every((e) => isStage1Valid(e));

	// Submit final: kirim tiap laporan taman ke backend/memory (source of
	// truth yang dibaca useSurveyDetail/useSurveys di seluruh halaman lain),
	// lalu update status assignment (in_review kalau semua Tahap 2 lengkap,
	// incomplete kalau belum) supaya alur "Lengkapi Survey" (CardSurvey label,
	// handleCheckIn di SurveyDetailPage, link di SurveyListPage) benar-benar
	// jalan. localStorage tetap dipakai sebagai cache draft tambahan saja —
	// bukan pengganti update status.
	// Dipanggil dari tombol "Submit". Hanya melakukan validasi Tahap 1 dan,
	// kalau lolos, membuka modal konfirmasi — TIDAK langsung mengirim data.
	// Pengiriman sebenarnya baru terjadi di performSubmitAll(), setelah user
	// menekan "Submit" di SubmitConfirmModal.
	function handleSubmitAll() {
		if (!survey || isSubmitting) return;

		if (isOngoing) {
			// "Mulai Survey" / SurveyFormV2 — hanya Tahap 1 yang wajib di sini
			// (Tahap 2 opsional, boleh dikirim lalu dilengkapi belakangan lewat
			// "Lengkapi Survey"). Kalau ada taman yang Tahap 1-nya belum valid:
			// tampilkan warning tiap section, pindah ke tab taman tsb, scroll ke
			// pertanyaan pertama yang masih kosong, lalu tampilkan alert. Submit
			// dihentikan sampai semua isian wajib Tahap 1 terisi.
			const invalidEntry = entries.find((e) => !isStage1Valid(e));
			if (invalidEntry) {
				setEntries((prev) =>
					prev.map((e) =>
						e.index === invalidEntry.index ? { ...e, showValidationWarning: true } : e
					)
				);
				setActiveIndex(invalidEntry.index);
				scrollToFirstEmptyField(invalidEntry);
				const emptyField = firstEmptyStage1Field(invalidEntry);
				addToast({
					data: {
						title: emptyField ? requiredMessage(emptyField) : DEFAULT_REQUIRED_MESSAGE,
						color: 'red',
						bg: '#FDE0D5',
						border: 'red',
						icon: 'warning'
					}
				});
				return;
			}
		} else {
			// "Edit Form Survey" / "Lengkapi Survey" (SurveyFormV3) — semua
			// pertanyaan (Tahap 1 + Tahap 2 wajib + Dokumentasi wajib) tampil
			// sekaligus di satu halaman flat, jadi validasi submit-nya juga
			// mencakup ketiganya sekaligus. Pola alert + auto-scroll-nya sama
			// persis seperti Tahap 1 SurveyFormV2 di atas (referensi), hanya
			// gate-nya yang diperluas lewat firstEmptyFullField.
			const invalidEntry = entries.find((e) => firstEmptyFullField(e) !== null);
			if (invalidEntry) {
				setEntries((prev) =>
					prev.map((e) => (e.index === invalidEntry.index ? { ...e, showValidationWarning: true } : e))
				);
				setActiveIndex(invalidEntry.index);
				const emptyField = firstEmptyFullField(invalidEntry);
				scrollToField(invalidEntry.index, emptyField);
				addToast({
					data: {
						title: emptyField ? requiredMessage(emptyField) : DEFAULT_REQUIRED_MESSAGE,
						color: 'red',
						bg: '#FDE0D5',
						border: 'red',
						icon: 'warning'
					}
				});
				return;
			}
		}

		setIsSubmitConfirmOpen(true);
	}

	async function performSubmitAll() {
		if (!survey || isSubmitting) return;

		setIsSubmitConfirmOpen(false);
		setIsSubmitting(true);
		try {
			const updatedReportIds: Record<string, string> = {};
			for (const entry of entries) {
				const { id } = await submitDesignSurveyReport(
					survey.id,
					entry.data as unknown as Record<string, unknown>,
					{ existingReportId: entry.reportId, clientEntryIndex: entry.index }
				);
				updatedReportIds[entry.index] = id;
			}

			const updatedEntries = entries.map((e) => ({
				...e,
				reportId: updatedReportIds[e.index] ?? e.reportId
			}));
			setEntries(updatedEntries);

			// Cache draft lokal (opsional) — supaya kalau "Lengkapi Survey"
			// dibuka lagi sebelum data hasil refetch sempat sampai, isian form
			// tetap utuh tanpa nunggu round-trip.
			const surveys = getStoredSurveys();
			surveys[survey.id] = {
				id: survey.id,
				entries: updatedEntries,
				updatedAt: new Date().toISOString()
			};
			saveStoredSurveys(surveys);

			const allStage2Complete = updatedEntries.every((e) => isStage2Valid(e));

			if (allStage2Complete) {
				await finishSurveyAssignment(survey.id);
				addToast({
					data: {
						title: 'Survey berhasil dikirim & telah selesai',
						color: '#4EA40F',
						bg: '#EAFACC',
						border: '#4EA40F',
						icon: 'check_box'
					}
				});
				await refetchSurvey();
				navigate(`/surveyor/survey/${survey.id}`);
			} else {
				await markSurveyIncomplete(survey.id);
				await refetchSurvey();

				// Padanan progress bar "Kelengkapan Survey" di SurveySavedScreen —
				// gabungan Tahap 1 + section Info Tambahan yang aktif di semua taman
				// (sama seperti activeTotalSections/activeProgress di bawah), bukan
				// cuma taman aktif.
				let totalPossible = 0;
				let totalFilled = 0;
				for (const e of updatedEntries) {
					const extraKeys = (isOngoing ? e.extraFields : ALL_STAGE2_FIELD_KEYS).filter(
						(key) => !DOCUMENTATION_STAGE2_KEYS.has(key)
					);
					totalPossible += TOTAL_SECTIONS_STAGE1 + extraKeys.length;
					totalFilled += calcProgressStage1(e.data) + calcExtraFieldsProgress(e.data, extraKeys);
				}
				setSavedScreenPercentage(
					totalPossible > 0 ? Math.round((totalFilled / totalPossible) * 100) : 0
				);
			}
		} catch (err) {
			console.error(err);
			addToast({
				data: {
					title: 'Gagal mengirim survey',
					color: 'red',
					bg: '#FDE0D5',
					border: 'red',
					icon: 'warning'
				}
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	if (isSurveyPending || isTagsPending || isReportsPending) {
		return <div className="p-5 text-sm text-neutral-500">Memuat form survey...</div>;
	}

	if (!survey) {
		return <div className="p-5 text-sm text-danger-main">Survey tidak ditemukan.</div>;
	}

	if (savedScreenPercentage !== null) {
		return (
			<SurveySavedScreen
				percentage={savedScreenPercentage}
				parentWidth={width || undefined}
				onBackToHome={() => navigate('/surveyor/home')}
				onContinueFilling={() => setSavedScreenPercentage(null)}
			/>
		);
	}

	const isOngoing = survey.status === 'ongoing';

	// Di halaman "Edit Form Survey" (Lengkapi Survey, status `incomplete`),
	// semua pertanyaan Tahap 2 langsung ditampilkan inline di bawah Tahap 1 —
	// tidak lagi lewat pilih-pilih manual via "Tambah Isian Survey". Saat isi
	// survey pertama kali (status `ongoing`), perilaku lama tetap dipakai:
	// hanya pertanyaan yang sudah ditambahkan lewat modal yang muncul.
	const activeExtraFieldKeys = isOngoing ? activeEntry.extraFields : ALL_STAGE2_FIELD_KEYS;
	// Key Dokumentasi dikeluarkan dari hitungan "Info Tambahan" karena
	// progress-nya sudah dihitung terpisah lewat calcProgressDocumentation/
	// TOTAL_SECTIONS_DOCUMENTATION di bawah.
	const activeExtraQuestionKeys = activeExtraFieldKeys.filter(
		(key) => !DOCUMENTATION_STAGE2_KEYS.has(key)
	);

	// Di "Mulai Survey" (isOngoing, SurveyFormV2), hanya Tahap 1 + section
	// Info Tambahan yang sudah ditambahkan (activeExtraQuestionKeys) yang
	// dihitung — belum ada section Dokumentasi di flow ini.
	//
	// Di "Edit Form Survey" / "Lengkapi Survey" (!isOngoing, SurveyFormV3),
	// Tahap 1 + SEMUA section Info Tambahan + Dokumentasi tampil FLAT
	// sekaligus di satu halaman, jadi totalnya digabung ketiganya.
	const activeTotalSections =
		TOTAL_SECTIONS_STAGE1 +
		activeExtraQuestionKeys.length +
		(!isOngoing ? TOTAL_SECTIONS_DOCUMENTATION : 0);
	const activeProgress =
		calcProgressStage1(activeEntry.data) +
		calcExtraFieldsProgress(activeEntry.data, activeExtraQuestionKeys) +
		(!isOngoing ? calcProgressDocumentation(activeEntry.data) : 0);

	// Survey `incomplete` berarti taman-tamannya sudah ditentukan & Tahap 1
	// sudah pernah disubmit sebelumnya — jadi di sesi "Lengkapi Survey" ini
	// user cuma boleh melengkapi taman yang sudah ada, tidak boleh nambah
	// taman baru lagi.
	const canAddGarden = survey.status !== 'incomplete';
	const scheduleLuxon = survey.scheduledAt ? DateTime.fromISO(survey.scheduledAt) : null;

	// Tab taman — dipakai baik di layout sticky (isOngoing) maupun layout
	// normal-flow (!isOngoing, "Edit Form Survey"). Nama taman yang panjang
	// akan wrap ke baris baru DI DALAM tombolnya sendiri (bukan dipotong
	// "..."), dan kalau satu baris tab sudah penuh, tab berikutnya turun ke
	// baris baru juga (flex-wrap) — bukan discroll menyamping.
	const gardenTabs = (
		<div className="mx-3 my-2 bg-neutral-100 rounded-2xl px-1.5 py-1.5 ">
			<div className="flex overflow-x-auto scrollbar-hide gap-1.5">
				{entries.map((entry) => (
					<button
						key={entry.index}
						onClick={() => {
							setActiveIndex(entry.index);
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}}
						className={`px-5 py-4 rounded-lg transition-all duration-150 text-center max-w-[100px] ${
							activeIndex === entry.index
								? 'bg-primary-main text-white shadow-sm'
								: 'text-neutral-600'
						}`}
					>
						<span className="line-clamp-2 break-words">
							{entry.data.gardenName || `Taman ${Number(entry.index) + 1}`}
						</span>
					</button>
				))}
				{canAddGarden && (
					<button
						onClick={addEntry}
						className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-neutral-600 whitespace-nowrap"
					>
						+ Tambah Taman
					</button>
				)}
			</div>
		</div>
	);

	// Baris progress bar + info stage — dipakai baik di layout sticky
	// (isOngoing) maupun layout normal-flow (!isOngoing).
	const isStage2OrLengkapi = !isOngoing;

	const stageProgressInfo = (
		<>
			<div className="h-1.5 bg-neutral-100 w-full">
				<div
					className="h-full bg-primary-main transition-all duration-300 rounded-r-full"
					style={{ width: `${Math.round((activeProgress / activeTotalSections) * 100)}%` }}
				/>
			</div>

			{isStage2OrLengkapi ? (
				<div className="px-4 py-2 border-b border-neutral-100">
					<p className="text-xs text-neutral-500">
						{activeProgress} dari {activeTotalSections} Pertanyaan
					</p>
				</div>
			) : (
				<div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100">
					<div>
						<p className="text-xs font-semibold text-danger-main">Survey Berlangsung</p>
						<p className="text-xs text-neutral-500">
							{activeProgress} dari {activeTotalSections} Pertanyaan
						</p>
						{scheduleLuxon && (
							<p className="text-xs text-neutral-400">
								{scheduleLuxon.setLocale('id-ID').toFormat('cccc, dd MMMM yyyy')}
							</p>
						)}
					</div>
					{isOngoing && <p className="text-lg font-bold text-primary-main tabular-nums">{timerDisplay}</p>}
				</div>
			)}
		</>
	);
	return (
		<main ref={containerRef} className="pb-17 bg-neutral-50 min-h-screen">
			<NavbarTop pageName={isOngoing ? 'Detail Survey' : 'Edit Form Survey'} parentWidth={width} />

			{isOngoing ? (
				<>
					{/* ── Sticky header: progress bar + info + tab taman ── */}
					<div
						ref={stickyHeaderRef}
						className="fixed top-[56px] z-20 bg-white shadow-sm transition-shadow duration-200 w-full"
					>
						{stageProgressInfo}
						{gardenTabs}
					</div>

					{/* spacer untuk fixed header (NavbarTop + progress bar + info + tabs) —
					    tingginya diukur live karena tab taman bisa wrap ke beberapa baris */}
					<div style={{ height: 56 + stickyHeaderHeight }} />

					{/* Hero timer section */}
					<div className="bg-white px-4 py-5 mb-3 mt-16 shadow-sm flex flex-col items-center text-center gap-1">
						<h2 className="text-3xl font-bold text-primary-main tabular-nums">{timerDisplay}</h2>
						<p className="text-xs text-neutral-400">Hour/ min/sec</p>
						<p className="text-base font-bold text-primary-main mt-1">{survey.user.name || 'No name'}</p>
						{scheduleLuxon && (
							<p className="text-xs text-neutral-400">
								{scheduleLuxon.setLocale('id-ID').toFormat('cccc, dd MMMM yyyy')}
							</p>
						)}
					</div>

					<div className="mx-5 mt-3 mb-3 bg-white rounded-xl border border-neutral-8 p-3 space-y-1">
						<div className="flex items-start justify-between gap-2">
							<p className="text-sm font-bold text-primary-main">Alamat Lengkap</p>
							<button
								onClick={() => setIsAddressModalOpen(true)}
								className="shrink-0"
								aria-label="Edit alamat"
							>
								<Icon name="edit" fill={1} size="1rem" />
							</button>
						</div>
						<p className="text-xs text-neutral-5">{survey.address || 'Alamat belum diisi'}</p>
					</div>
				</>
			) : (
				<>
					{/* spacer untuk NavbarTop yang fixed */}
					<div className="pt-16" />

					{/* ── Alamat Lengkap — ditaruh di atas judul "Edit Form Survey" & tab ── */}
					<div className="mx-5 mt-3 bg-white rounded-xl border border-neutral-8 p-3 space-y-1">
						<div className="flex items-start justify-between gap-2">
							<p className="text-sm font-bold text-primary-main">Alamat Lengkap</p>
							<button
								onClick={() => setIsAddressModalOpen(true)}
								className="shrink-0"
								aria-label="Edit alamat"
							>
								<Icon name="edit" fill={1} size="1rem" />
							</button>
						</div>
						<p className="text-xs text-neutral-5">{survey.address || 'Alamat belum diisi'}</p>
					</div>

					{/* Alert perubahan alamat mempengaruhi taman lainnya */}
					<div className="mx-5 mt-3 flex items-start gap-2 rounded-xl border border-[#F2B705] bg-[#FEF7CC] px-3 py-2.5">
						<div className="shrink-0 mt-0.5">
							<Icon name="info" fill={1} size="1.1rem" color="#8a6d00" />
						</div>
						<p className="text-xs text-[#8a6d00] leading-snug">
							Perubahan alamat lengkap taman ini akan mempengaruhi taman lainnya. Mohon cek kembali.
						</p>
					</div>

					{/* Judul "Edit Form Survey" — di atas tab taman */}
					<h1 className="text-center text-2xl font-bold text-primary-main mt-5 mb-2">Edit Form Survey</h1>

					{/* Tab taman */}
					{gardenTabs}

					{/* Progress bar + info stage — sticky: tetap di posisi normal (di
					    bawah tab taman) selama belum discroll, lalu otomatis "menempel"
					    persis di bawah NavbarTop (top-16 = tinggi NavbarTop) begitu
					    posisi normalnya sudah lewat batas atas layar saat discroll. */}
					<div className="sticky top-16 z-20 mx-3 mb-2 bg-white rounded-md border border-neutral-8 overflow-hidden shadow-sm">
						{stageProgressInfo}
					</div>
				</>
			)}

			{activeEntry && (
				<div className="mx-5 bg-white rounded-xl border border-neutral-8 p-4">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-bold text-primary-main">
							{activeEntry.data.gardenName || `Taman ${Number(activeEntry.index) + 1}`}
						</h2>
						{entries.length > 1 && (
							<button
								onClick={() => setDeleteConfirm({ visible: true, index: activeEntry.index })}
								className="flex items-center gap-1 text-danger-main font-semibold text-sm"
							>
								<Icon name="delete" color="currentColor" size="1.25rem" />
								Hapus
							</button>
						)}
					</div>
					{/* Saran salin jawaban dari Taman 1 sekarang ditampilkan PER FIELD di
					    dalam masing-masing section (lihat FieldSuggestion di
					    GardenNameForm, FormOrientation, FormDrainage, dst) lewat prop
					    firstGardenData di bawah — bukan satu tombol besar yang menyalin
					    semua jawaban sekaligus. */}
					{/* Tahap 1 / "Mulai Survey" (status ongoing) pakai SurveyFormV2
					    (tanpa section Dokumentasi). Begitu masuk ke halaman "Edit Form
					    Survey" / "Lengkapi Survey" (status incomplete, isOngoing false),
					    pakai SurveyFormV3 yang menambahkan section Dokumentasi (foto
					    area, tanaman existing, sketsa, upload dokumentasi). */}
					{isOngoing ? (
						<SurveyFormV2
							formId={activeEntry.index}
							surveyData={activeEntry.data}
							sizeCategory={sizeCategory}
							showValidationWarning={activeEntry.showValidationWarning}
							tags={tags}
							updateSurveyEntries={updateSurveyEntries}
							extraFieldKeys={activeExtraFieldKeys}
							firstGardenData={firstGardenDataForSuggestion}
						/>
					) : (
						<SurveyFormV3
							formId={activeEntry.index}
							surveyData={activeEntry.data}
							sizeCategory={sizeCategory}
							showValidationWarning={activeEntry.showValidationWarning}
							tags={tags}
							updateSurveyEntries={updateSurveyEntries}
							extraFieldKeys={activeExtraFieldKeys}
							firstGardenData={firstGardenDataForSuggestion}
						/>
					)}
				</div>
			)}

			{/* Floating note FAB — catatan surveyor cepat, tanpa pindah ke Tahap 2.
			    Sticky (bukan fixed) supaya begitu discroll sampai akhir, FAB ini
			    "mentok" berhenti pas di atas bar Tambah Isian Survey/Submit,
			    bukan menimpanya terus seperti kalau posisinya fixed. */}
			<div
				className="sticky z-40 flex justify-end pr-4 pointer-events-none"
				style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 90px)' }}
			>
				<div className="pointer-events-auto">
					<button
						type="button"
						onClick={() => setIsNoteOpen(true)}
						className="w-12 h-12 rounded-full bg-primary-main text-white shadow-lg flex items-center justify-center"
						aria-label="Catatan Surveyor"
					>
						<Icon name="edit_note" fill={1} size="1.5rem" />
					</button>
				</div>
			</div>

			<SurveyorNoteForm
				visible={isNoteOpen}
				value={activeEntry.data.surveyorNote ?? ''}
				updatedAt={noteUpdatedAt[activeEntry.index] ?? null}
				onClose={() => setIsNoteOpen(false)}
				onSave={(html) => {
					updateSurveyEntries(activeEntry.index, { surveyorNote: html });
					setNoteUpdatedAt((prev) => ({
						...prev,
						[activeEntry.index]: new Date().toISOString()
					}));
				}}
			/>

			{/* Sticky bottom action bar */}
			<div
				className="bottom-0 z-30 bg-white p-4 border-t border-neutral-8 rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] space-y-3"
				style={{ width: width || undefined }}
			>
				{isOngoing && (
					<button
						type="button"
						onClick={() => setIsAddQuestionModalOpen(true)}
						className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary-main text-primary-main text-sm font-semibold bg-white"
					>
						<span className="w-5 h-5 rounded-full border-2 border-primary-main flex items-center justify-center text-xs leading-none">
							+
						</span>
						Tambah Isian Survey
					</button>
				)}

				<div>
					<Button
						label={isSubmitting ? 'Mengirim...' : 'Submit'}
						style="w-full"
						isLoading={isSubmitting}
						disabled={isSubmitting}
						action={handleSubmitAll}
					/>
					{canSubmit && !entries.every((e) => isStage2Valid(e)) && (
						<p className="text-center text-xs text-neutral-4 mt-2">
							Info tambahan belum lengkap — survey akan dikirim dengan status "Perlu Dilengkapi".
						</p>
					)}
				</div>
			</div>

			{isOngoing && (
				<AddSurveyQuestionModal
					open={isAddQuestionModalOpen}
					existingKeys={activeEntry.extraFields}
					onClose={() => setIsAddQuestionModalOpen(false)}
					onAdd={(keys) => {
						addExtraFields(activeEntry.index, keys);
						setIsAddQuestionModalOpen(false);
					}}
				/>
			)}

			{isAddressModalOpen && (
				<Edit
					visible={isAddressModalOpen}
					onVisibleChange={setIsAddressModalOpen}
					title="Edit Alamat"
					address={survey.address}
					onSave={handleSaveAddress}
				/>
			)}

			{isSavingAddress && (
				<div className="fixed inset-0 z-[60] bg-white/70 flex items-center justify-center">
					<div className="w-10 h-10 border-4 border-primary-main border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			{deleteConfirm.visible && (
				<Confirmation
					visible={deleteConfirm.visible}
					onVisibleChange={(v) => setDeleteConfirm({ visible: v, index: v ? deleteConfirm.index : null })}
					parentWidth={width}
					action={confirmRemoveEntry}
					title="Apakah Anda Yakin Ingin Menghapus Data Survey Taman Ini?"
					desc="Semua informasi yang telah diisi akan hilang dan tidak dapat dikembalikan"
					button={{ label: 'Hapus', buttonType: 'danger' }}
				/>
			)}

			<SubmitConfirmModal
				open={isSubmitConfirmOpen}
				onClose={() => setIsSubmitConfirmOpen(false)}
				onConfirm={performSubmitAll}
			/>
		</main>
	);
}