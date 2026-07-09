import { useCallback, useEffect, useState } from 'react';
import { memory } from './memory';
import { ensureCoordinatorStarted } from './hooks';

export interface SurveyUser {
	id?: string;
	name: string;
	phone?: string;
	address?: string;
}

export interface SurveyItem {
	id: string;
	status: string;
	scheduledAt: string;
	checkInAt?: string | null;
	checkOutAt?: string | null;
	address: string;
	invoiceId?: string;
	areaSize?: number;
	categorySizeId?: number;
	consultationDate?: string;
	consultationTime?: string;
	orderDesignId: string;
	user: SurveyUser;
	inspirationPhotos: string[];
	areaPhotos: string[];
}

/**
 * Padanan `querySurvey` + `sortedSurveysStore` di stores.js (Svelte lama):
 * query langsung ke `memory` Orbit.js (yang sudah di-seed dummy data di mode
 * mock, atau di-sync dari remote lewat coordinator di mode API beneran), lalu
 * gabungkan record-record terkait lewat foreign key di attributes.
 */
async function loadSurveys(): Promise<SurveyItem[]> {
	await ensureCoordinatorStarted();

	const assignments = (await memory.query((q: any) =>
		q.findRecords('locationSurveyAssignments')
	)) as any[];

	const [allOrderDesigns, allAvailabilities, allUsers, allImages] = await Promise.all([
		memory.query((q: any) => q.findRecords('orderDesigns')) as Promise<any[]>,
		memory.query((q: any) => q.findRecords('surveyorAvailabilities')) as Promise<any[]>,
		memory.query((q: any) => q.findRecords('users')) as Promise<any[]>,
		memory.query((q: any) => q.findRecords('images')) as Promise<any[]>
	]);

	const surveys: SurveyItem[] = [];

	for (const assignment of assignments) {
		const orderDesignId = assignment.attributes.orderDesignId?.toString();
		const surveyorAvailabilityId = assignment.attributes.surveyorAvailabilityId?.toString();

		const orderDesign = allOrderDesigns.find((od) => od.id === orderDesignId);
		if (!orderDesign) continue; // sama seperti versi lama: skip kalau order design tidak ketemu

		const surveyorAvailability = allAvailabilities.find((sa) => sa.id === surveyorAvailabilityId);
		if (!surveyorAvailability) continue;

		const user = allUsers.find((u) => u.id === orderDesign.attributes.userId?.toString());

		const inspirationPhotos = allImages
			.filter((img) => img.attributes.imageableId?.toString() === orderDesign.id)
			.map((img) => img.attributes.url)
			.filter(Boolean);

		surveys.push({
			id: assignment.id,
			status: assignment.attributes.status,
			scheduledAt: surveyorAvailability.attributes.availableAt,
			checkInAt: assignment.attributes.checkInAt,
			checkOutAt: assignment.attributes.checkOutAt,
			address: orderDesign.attributes.address,
			invoiceId: orderDesign.attributes.invoiceId,
			areaSize: orderDesign.attributes.areaSize,
			categorySizeId: orderDesign.attributes.categorySizeId,
			consultationDate: orderDesign.attributes.consultationDate,
			consultationTime: orderDesign.attributes.consultationTime,
			orderDesignId: orderDesign.id,
			user: {
				id: user?.id,
				name: user?.attributes?.name ?? 'No name',
				phone: user?.attributes?.phone,
				address: user?.attributes?.address
			},
			inspirationPhotos,
			areaPhotos: Array.isArray(orderDesign.attributes.areaPhotos)
				? orderDesign.attributes.areaPhotos
				: []
		});
	}

	return surveys.sort(
		(a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
	);
}

interface UseSurveysState {
	data: SurveyItem[] | null;
	isPending: boolean;
	error: unknown;
}

/** Padanan `sortedSurveysStore` — daftar semua survey milik surveyor. */
export function useSurveys() {
	const [state, setState] = useState<UseSurveysState>({
		data: null,
		isPending: true,
		error: null
	});

	const refetch = useCallback(async () => {
		setState((prev) => ({ ...prev, isPending: true }));
		try {
			const result = await loadSurveys();
			setState({ data: result, isPending: false, error: null });
		} catch (error) {
			setState({ data: null, isPending: false, error });
		}
	}, []);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			setState((prev) => ({ ...prev, isPending: true }));
			try {
				const result = await loadSurveys();
				if (!cancelled) setState({ data: result, isPending: false, error: null });
			} catch (error) {
				if (!cancelled) setState({ data: null, isPending: false, error });
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	return { ...state, refetch };
}

export interface SurveyReportItem {
	id: string;
	gardenName?: string;
	areaSize?: number;
	surveyorNote?: string;
	// Index taman ("0", "1", dst) di SurveyFormPage.tsx saat laporan ini
	// disubmit — dipakai untuk mencocokkan laporan ke tab taman yang benar
	// saat form dibuka kembali (mis. status `incomplete`).
	clientEntryIndex?: string | null;
	// Payload mentah lengkap (semua field Tahap 1 & Tahap 2) yang disimpan
	// saat submit — dipakai untuk memulihkan data form secara utuh.
	rawData?: Record<string, unknown> | null;
}

/**
 * Ambil designSurveyReports milik satu locationSurveyAssignment
 * (dipakai di tab "Form Survey" untuk status in_review/finish).
 */
export function useSurveyReports(surveyId: string | undefined) {
	const [state, setState] = useState<{ data: SurveyReportItem[]; isPending: boolean }>({
		data: [],
		isPending: true
	});

	useEffect(() => {
		let cancelled = false;
		if (!surveyId) {
			setState({ data: [], isPending: false });
			return;
		}

		(async () => {
			await ensureCoordinatorStarted();
			const reports = (await memory.query((q: any) =>
				q.findRecords('designSurveyReports')
			)) as any[];

			// `locationSurveyAssignmentId` di record disimpan sebagai angka murni
			// (lihat catatan di surveyActions.ts submitDesignSurveyReport), sedangkan
			// `surveyId` di sini adalah id assignment penuh (mis. "dummy-lsa-1" di
			// mode mock, atau angka murni di mode non-mock). Bandingkan lewat digit
			// yang diekstrak dari `surveyId` supaya cocok di kedua mode.
			const numericSurveyId = Number(surveyId.replace(/[^0-9]/g, '') || NaN);
			const filtered = reports
				.filter((r) => r.attributes.locationSurveyAssignmentId === numericSurveyId)
				.map((r) => {
					let rawData: Record<string, unknown> | null = null;
					if (typeof r.attributes.rawFormData === 'string') {
						try {
							rawData = JSON.parse(r.attributes.rawFormData);
						} catch {
							rawData = null;
						}
					}

					return {
						id: r.id,
						gardenName: r.attributes.gardenName,
						areaSize: r.attributes.areaSize,
						surveyorNote: r.attributes.surveyorNote,
						clientEntryIndex: r.attributes.clientEntryIndex ?? null,
						rawData
					};
				});

			if (!cancelled) setState({ data: filtered, isPending: false });
		})();

		return () => {
			cancelled = true;
		};
	}, [surveyId]);

	return state;
}

/**
 * Ambil satu survey by id, dipakai di halaman detail
 * (padanan +layout.ts `getById(params.slug)`).
 */
export function useSurveyDetail(id: string | undefined) {
	const [state, setState] = useState<{ data: SurveyItem | null; isPending: boolean; error: unknown }>(
		{ data: null, isPending: true, error: null }
	);

	const refetch = useCallback(async () => {
		if (!id) return;
		setState((prev) => ({ ...prev, isPending: true }));
		try {
			const all = await loadSurveys();
			const found = all.find((s) => s.id === id) ?? null;
			setState({ data: found, isPending: false, error: found ? null : new Error('Not found') });
		} catch (error) {
			setState({ data: null, isPending: false, error });
		}
	}, [id]);

	useEffect(() => {
		let cancelled = false;
		if (!id) {
			setState({ data: null, isPending: false, error: new Error('Missing id') });
			return;
		}

		(async () => {
			setState((prev) => ({ ...prev, isPending: true }));
			try {
				const all = await loadSurveys();
				const found = all.find((s) => s.id === id) ?? null;
				if (!cancelled) {
					setState({ data: found, isPending: false, error: found ? null : new Error('Not found') });
				}
			} catch (error) {
				if (!cancelled) setState({ data: null, isPending: false, error });
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [id]);

	return { ...state, refetch };
}