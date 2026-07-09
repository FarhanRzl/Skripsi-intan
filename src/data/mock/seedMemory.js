import { memory } from '../memory.js';
import {
	dummyTags,
	dummyUsers,
	dummyOrderDesigns,
	dummySurveyorAvailabilities,
	dummyLocationSurveyAssignments
} from './dummyData.js';

let seeded = false;

/**
 * Isi memory source dengan data dummy. Aman dipanggil berkali-kali —
 * cuma benar-benar seed sekali per sesi browser (per full reload).
 *
 * PENTING: `loadSurveys()` (lihat useSurveys.ts) men-skip sebuah
 * locationSurveyAssignment kalau orderDesign ATAU surveyorAvailability
 * terkaitnya tidak ada di memory. Makanya di sini kita wajib men-seed
 * users, orderDesigns, surveyorAvailabilities, DAN locationSurveyAssignments
 * sekaligus (sebelumnya surveyorAvailabilities & users tidak pernah di-seed
 * sama sekali, jadi semua assignment dummy selalu ke-skip dan list survey
 * selalu kosong).
 */
export async function seedDummyDataIfNeeded() {
	if (seeded) return;
	seeded = true;

	await memory.update((t) => [
		...dummyTags.map((tag) =>
			t.addRecord({ type: 'tags', id: tag.id, attributes: tag.attributes })
		),
		...dummyUsers.map((user) =>
			t.addRecord({ type: 'users', id: user.id, attributes: user.attributes })
		),
		...dummyOrderDesigns.map((orderDesign) =>
			t.addRecord({
				type: 'orderDesigns',
				id: orderDesign.id,
				attributes: orderDesign.attributes,
				relationships: {
					user: { data: { type: 'users', id: String(orderDesign.attributes.userId) } }
				}
			})
		),
		...dummySurveyorAvailabilities.map((availability) =>
			t.addRecord({
				type: 'surveyorAvailabilities',
				id: availability.id,
				attributes: availability.attributes
			})
		),
		...dummyLocationSurveyAssignments.map((assignment) =>
			t.addRecord({
				type: 'locationSurveyAssignments',
				id: assignment.id,
				attributes: assignment.attributes,
				relationships: {
					orderDesign: {
						data: { type: 'orderDesigns', id: String(assignment.attributes.orderDesignId) }
					},
					surveyorAvailability: {
						data: {
							type: 'surveyorAvailabilities',
							id: String(assignment.attributes.surveyorAvailabilityId)
						}
					}
				}
			})
		)
	]);
}

/**
 * Helper dev-only: ubah status locationSurveyAssignment dummy secara manual
 * (misal buat testing tampilan Tahap 2 tanpa harus benar-benar submit).
 */
export async function setDummyAssignmentStatus(id, status) {
	await memory.update((t) =>
		t.updateRecord({ type: 'locationSurveyAssignments', id, attributes: { status } })
	);
}
