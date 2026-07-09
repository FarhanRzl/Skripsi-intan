import { fetchClient } from '$lib/api/fetch-client';
import { memory } from './memory';
import { ensureCoordinatorStarted } from './hooks';

/**
 * Padanan `checkIn` di home/+page.svelte & survey/[slug]/+page.svelte.
 * Selalu memanggil fetchClient (otomatis jadi mock kalau
 * VITE_USE_MOCK_DATA=true), lalu update status di memory Orbit.js secara
 * optimis supaya UI (list, detail) langsung ikut berubah tanpa reload.
 */
export async function checkInSurvey(surveyId: string): Promise<void> {
	await ensureCoordinatorStarted();

	await fetchClient(`surveyor/locationSurveyAssignments/${surveyId}/checkIn`, {
		method: 'POST'
	});

	await memory.update((t: any) =>
		t.updateRecord({
			type: 'locationSurveyAssignments',
			id: surveyId,
			attributes: {
				status: 'ongoing',
				checkInAt: new Date().toISOString()
			}
		})
	);
}

/**
 * Submit 1 laporan survey (1 "taman") ke backend. Padanan `SurveyReportApi.submit`
 * di project Svelte — dipakai oleh SurveyFormPage.tsx (Fase 5) setelah data
 * di-parse lewat DesignSurveyReportStage1BaseObject & Stage2BaseObject.
 *
 * Sama seperti checkInSurvey: selalu lewat fetchClient (otomatis mock kalau
 * VITE_USE_MOCK_DATA=true), lalu disalin juga ke memory Orbit.js secara
 * optimis supaya tab "Form Survey" di SurveyDetailPage langsung ikut update
 * tanpa reload.
 *
 * `clientEntryIndex` adalah `formId`/index taman di SurveyFormPage.tsx (mis.
 * "0", "1", dst) — disimpan sebagai atribut supaya saat halaman form dibuka
 * lagi (mis. status `incomplete` -> "Lengkapi Survey"), tiap laporan bisa
 * dicocokkan kembali ke tab taman yang benar.
 *
 * `existingReportId` — kalau taman ini SUDAH pernah disubmit sebelumnya (mis.
 * submit ulang setelah melengkapi Tahap 2), oper id laporan yang sudah ada di
 * sini supaya record di-UPDATE, bukan ditambahkan sebagai laporan baru yang
 * duplikat.
 *
 * Seluruh `payload` mentah (semua field Tahap 1 & Tahap 2, termasuk
 * fixedStructures, landPreparations, dsb.) disimpan apa adanya lewat
 * `rawFormData` (JSON string) supaya bisa direkonstruksi utuh saat form
 * dibuka kembali — sebelumnya hanya gardenName/areaSize/surveyorNote yang
 * disimpan, sehingga sisa data hilang begitu user pindah halaman.
 */
export async function submitDesignSurveyReport(
	locationSurveyAssignmentId: string,
	payload: Record<string, unknown>,
	options?: { existingReportId?: string | null; clientEntryIndex?: string }
): Promise<{ id: string }> {
	await ensureCoordinatorStarted();

	const res = await fetchClient<{ id?: string }>(
		`surveyor/locationSurveyAssignments/${locationSurveyAssignmentId}/designSurveyReports`,
		{
			method: 'POST',
			body: JSON.stringify(payload)
		}
	);

	// Mode mock: fetchClient balikin { data: null }, jadi tidak ada id asli dari
	// backend — bikin id lokal supaya tetap bisa disimpan & ditampilkan di memory.
	// Kalau ini submit ulang untuk taman yang sudah pernah disubmit, pakai id
	// yang sudah ada supaya record di-update, bukan menambah duplikat baru.
	const reportId =
		options?.existingReportId ??
		res.data?.id ??
		`local-report-${Date.now()}-${Math.round(Math.random() * 1000)}`;

	// Skema `designSurveyReports` mendeklarasikan `areaSize` bertipe number,
	// sementara form menyimpannya sebagai string (mis. "25") supaya gampang
	// dipakai di <input>. Konversi di sini sebelum ditulis ke memory Orbit —
	// tanpa ini, MemorySource menolak record-nya (validasi tipe otomatis).
	const areaSizeNumber = Number(payload.areaSize);

	// `locationSurveyAssignmentId` juga dideklarasikan number di skema, tapi id
	// assignment dummy di mode mock berformat "dummy-lsa-3" (bukan angka murni)
	// supaya gampang dibedakan dari id resource lain saat debugging. Ambil
	// digit di belakangnya sebagai FK numerik lokal — untuk id yang memang
	// sudah angka murni (mode non-mock/backend asli), ini tidak mengubah apa-apa.
	const numericAssignmentId = Number(
		String(locationSurveyAssignmentId).replace(/[^0-9]/g, '') || NaN
	);

	const recordAttributes = {
		locationSurveyAssignmentId: Number.isFinite(numericAssignmentId) ? numericAssignmentId : 0,
		gardenName: payload.gardenName,
		areaSize: Number.isFinite(areaSizeNumber) ? areaSizeNumber : 0,
		surveyorNote: payload.surveyorNote ?? null,
		clientEntryIndex: options?.clientEntryIndex ?? '',
		// Simpan seluruh payload mentah supaya bisa dipulihkan utuh nanti.
		rawFormData: JSON.stringify(payload)
	};

	if (options?.existingReportId) {
		await memory.update((t: any) =>
			t.updateRecord({
				type: 'designSurveyReports',
				id: reportId,
				attributes: recordAttributes
			})
		);
	} else {
		await memory.update((t: any) =>
			t.addRecord({
				type: 'designSurveyReports',
				id: reportId,
				attributes: recordAttributes
			})
		);
	}

	return { id: reportId };
}

/**
 * Tandai assignment survey sebagai selesai diisi (semua taman sudah
 * disubmit) — status pindah ke `in_review` supaya tim internal bisa
 * meninjau. Padanan tombol "Kirim Semua & Selesai" di SurveyFormPage.tsx.
 */
export async function finishSurveyAssignment(surveyId: string): Promise<void> {
	await ensureCoordinatorStarted();

	await fetchClient(`surveyor/locationSurveyAssignments/${surveyId}/finish`, {
		method: 'POST'
	});

	await memory.update((t: any) =>
		t.updateRecord({
			type: 'locationSurveyAssignments',
			id: surveyId,
			attributes: {
				status: 'finish',
				checkOutAt: new Date().toISOString()
			}
		})
	);
}

/**
 * Tandai assignment survey sebagai `incomplete` — dipakai saat surveyor
 * sudah submit Tahap 1 (wajib) tapi Tahap 2 (Info Tambahan, opsional) belum
 * diisi lengkap untuk semua taman. Beda dengan `finishSurveyAssignment`:
 * status jadi `incomplete` ("Perlu Dilengkapi" di tab Tinjauan), bukan
 * `in_review`, supaya surveyor tahu masih ada bagian opsional yang bisa
 * dilengkapi nanti lewat halaman ini lagi.
 */
export async function markSurveyIncomplete(surveyId: string): Promise<void> {
	await ensureCoordinatorStarted();

	await fetchClient(`surveyor/locationSurveyAssignments/${surveyId}/markIncomplete`, {
		method: 'POST'
	});

	await memory.update((t: any) =>
		t.updateRecord({
			type: 'locationSurveyAssignments',
			id: surveyId,
			attributes: {
				status: 'incomplete',
				checkOutAt: new Date().toISOString()
			}
		})
	);
}

/**
 * Padanan tombol "Edit Alamat" / "Edit Ukuran" / "Edit Jadwal Konsultasi" di
 * tab Detail Order (hanya muncul saat status `in_review`). Update langsung
 * ke record `orderDesigns` di memory Orbit.js — field-field ini memang
 * disimpan langsung di orderDesigns (bukan lewat relasi addressComponents),
 * jadi tidak perlu request tambahan.
 */
export async function updateOrderDesign(
	orderDesignId: string,
	attributes: Partial<{
		address: string;
		areaSize: number;
		consultationDate: string;
		consultationTime: string;
	}>
): Promise<void> {
	await ensureCoordinatorStarted();

	// Buang key yang undefined supaya tidak menimpa field lain dengan undefined
	const cleanedAttributes = Object.fromEntries(
		Object.entries(attributes).filter(([, value]) => value !== undefined)
	);

	await memory.update((t: any) =>
		t.updateRecord({
			type: 'orderDesigns',
			id: orderDesignId,
			attributes: cleanedAttributes
		})
	);
}