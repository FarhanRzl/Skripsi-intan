import { TAG_TYPES, TAG } from '$lib/constants/tag';

// ── Helper bikin tag dummy ──
// Counter mulai dari 1000 supaya tidak pernah tabrakan dengan id-id "spesial"
// di TAG (constants/tag.ts) yang di-hardcode di komponen survey-form
// (mis. TAG.FIXED_STRUCTURE_NONE = '107', TAG.GARDEN_ENTRANCE_ACCESS_OTHER = '97', dst).
// Tag yang perlu id spesifik itu diberi `explicitId` di bawah.
let tagIdCounter = 1000;
// Counter urutan TERPISAH dari id — selalu naik untuk SETIAP tag sesuai urutan
// definisi, tanpa terpengaruh `explicitId`. Dipakai `useTagsQuery` untuk
// mengurutkan pilihan jawaban (lihat stores/tags.ts). Sebelumnya urutan
// dihitung dari numeric id, tapi tag ber-`explicitId` rendah (mis.
// GARDEN_ENTRANCE_ACCESS_OTHER = '97') jadi salah tempat — "Lainnya" naik ke
// paling atas padahal harusnya paling bawah.
let tagOrderCounter = 0;
function makeTag(type, title, technicalNote = '', explicitId = null) {
	return {
		type: 'tags',
		id: explicitId ?? String(tagIdCounter++),
		attributes: { type, title, technicalNote, order: tagOrderCounter++ }
	};
}

// ── Tags: Tahap 1 & 2 (sinkron dari CSV "Update Form Surveyor" yang diberikan user) ──

const gardenFacingDirectionTags = [
	makeTag(TAG_TYPES.GARDEN_FACING_DIRECTION, "Utara", "Area mendapat cahaya sedang sepanjang hari. Cocok untuk tanaman yang toleran semi-shade. Tidak ada paparan sinar matahari langsung yang ekstrem."),
	makeTag(TAG_TYPES.GARDEN_FACING_DIRECTION, "Selatan", "Area mendapat paparan sinar matahari penuh hampir sepanjang hari. Pilih tanaman yang tahan panas dan butuh penyiraman lebih sering."),
	makeTag(TAG_TYPES.GARDEN_FACING_DIRECTION, "Barat", "Area mendapat paparan sinar matahari penuh hampir sepanjang hari. Pilih tanaman yang tahan panas dan butuh penyiraman lebih sering."),
	makeTag(TAG_TYPES.GARDEN_FACING_DIRECTION, "Timur", "Mendapat sinar matahari pagi yang lembut. Ideal untuk kebanyakan tanaman. Kondisi pencahayaan paling optimal untuk berbagai jenis tanaman."),
];

const sunExposureObstructionTags = [
	makeTag(TAG_TYPES.SUN_EXPOSURE_OBSTRUCTION, "Tidak Ada Dinding/Terbuka", "Cahaya masuk penuh tanpa penghalang, cocok untuk tanaman full sun."),
	makeTag(TAG_TYPES.SUN_EXPOSURE_OBSTRUCTION, "Ada Dinding Rendah (<1,5 m)", "Mengurangi cahaya hanya sebagian, masih memungkinkan tanaman Full Sun atau Partial Shade"),
	makeTag(TAG_TYPES.SUN_EXPOSURE_OBSTRUCTION, "Ada Dinding Sedang (1,5-3 m)", "Mengurangi cahaya cukup banyak, area lebih cocok untuk tanaman Partial Shade."),
	makeTag(TAG_TYPES.SUN_EXPOSURE_OBSTRUCTION, "Ada Dinding Tinggi (>3 m)", "Hampir seluruh cahaya terhalang, area minim cahaya alami."),
	makeTag(TAG_TYPES.SUN_EXPOSURE_OBSTRUCTION, "Ada Bangunan Bertingkat / Atap Menutup", "Cahaya hampir tidak masuk, perlu alternatif pencahayaan (artificial/grow light)."),
];

const areaSunExposureTags = [
	makeTag(TAG_TYPES.AREA_SUN_EXPOSURE, "Sangat Terang", "Area terbuka penuh dengan paparan >8 jam/hari. Rekomendasi Tanaman: Agave, Kaktus, Bougenville, Palem"),
	makeTag(TAG_TYPES.AREA_SUN_EXPOSURE, "Terang", "Area dengan paparan 6-8 jam/hari. Rekomendasi Tanaman: Heliconia, Sansevieria, Pandan, Philodendron Xanadu"),
	makeTag(TAG_TYPES.AREA_SUN_EXPOSURE, "Sedang", "Area dengan paparan 4-6 jam/hari atau cahaya tidak langsung. Rekomendasi Tanaman: Aglonema, Calathea, Peace Lily, Begonia"),
	makeTag(TAG_TYPES.AREA_SUN_EXPOSURE, "Sedikit", "Area dengan paparan <4 jam/hari. Rekomendasi Tanaman: Pakis, Monstera, Pothos, Dracaena"),
	makeTag(TAG_TYPES.AREA_SUN_EXPOSURE, "Tidak Ada", "Area dengan pencahayaan teduh penuh atau indoor. Rekomendasi Tanaman: ZZ Plant, Snake Plant, Aspidistra"),
];

const drainageTags = [
	makeTag(TAG_TYPES.DRAINAGE, "Tidak Ada Drainase", "Air tergenang >24 jam.\n- Risiko tinggi: Tanaman mati, breeding nyamuk\n- Design : Dibuatkan sistem drainase komprehensif"),
	makeTag(TAG_TYPES.DRAINAGE, "Sangat Baik", "Air langsung terserap dalam 1-2 jam.\n- Kelebihan: Tidak ada genangan, akar tanaman sehat\n- Perhatian: Tanah cepat kering, butuh penyiraman lebih sering\n- Desain: Tidak perlu sistem drainase tambahan"),
	makeTag(TAG_TYPES.DRAINAGE, "Baik", "Air terserap dalam 3-6 jam.\n- Kondisi ideal untuk kebanyakan tanaman\n- Perawatan standar\n- Desain: Cukup dengan saluran existing"),
	makeTag(TAG_TYPES.DRAINAGE, "Kurang Baik", "Air terserap >6 jam, kadang menggenang.\n- Resiko: Akar busuk, pertumbuhan lumut\n- Desain : Perlu tambahan untuk sistem drainase"),
];

const rainGutterNeedTags = [
	makeTag(TAG_TYPES.RAIN_GUTTER_NEED, "Dibutuhkan", "- Budget: +Rp 200-400k per meter talang\n- Material: PVC atau metal\n- Hubungkan ke drainage system\n- Maintenance: Pembersihan setaip 3 bulan"),
	makeTag(TAG_TYPES.RAIN_GUTTER_NEED, "Tidak Dibutuhkan", "Drainase sudah baik"),
	makeTag(TAG_TYPES.RAIN_GUTTER_NEED, "Perlu Evaluasi Lebih Lanjut", "- Observasi saat hujan lebat\n- Temporary solution: Saluran sementara"),
];

const waterSourceTags = [
	makeTag(TAG_TYPES.WATER_SOURCE, "Tidak Tersedia", "- Solusi: Penyiraman manual atau water tank\n- Tidak ideal untuk sistem irigasi otomatis"),
	makeTag(TAG_TYPES.WATER_SOURCE, "Tersedia (PDAM/PAM)", "Keuntungan: Stabil, tekanan konsisten"),
	makeTag(TAG_TYPES.WATER_SOURCE, "Tersedia (Sumur/Bor)", "- Cek kualitas air (pH, mineral)\n- Cek ketersediaan pompa untuk tekanan"),
	makeTag(TAG_TYPES.WATER_SOURCE, "Air Hujan / Reservoir", "- Diperlukan talang air\n- Wajib punya plan B saat kemarau"),
];

const electricitySourceTags = [
	makeTag(TAG_TYPES.ELECTRICITY_SOURCE, "Tidak Tersedia", "- Alternatif: Sarankan Solar panel untuk lighting\n- Keterbatasan: Tidak bisa fountain, irigasi otomatis", TAG.ELECTRICITY_SOURCE_NONE),
	makeTag(TAG_TYPES.ELECTRICITY_SOURCE, "Tersedia dengan Jarak Dekat (<5m)", "Rekomendasi Material : Lampu taman, fountain, irigasi otomatis"),
	makeTag(TAG_TYPES.ELECTRICITY_SOURCE, "Terseda dengan Jarak Jauh", "- Instalasi: Butuh kabel panjang\n- Budget: +Rp 200-300k per meter kabel\n- Pertimbangkan Underground conduit (kabel listrik bawah tanah)"),
	makeTag(TAG_TYPES.ELECTRICITY_SOURCE, "Menggunakan Panel Surya", "Cocok dengan Lighting, water feature kecil"),
];

const entranceAccessTags = [
	makeTag(TAG_TYPES.ENTRANCE_ACCESS, "Pickup", "- Akses lebar >2.5m.\n- Mobilisasi: Mudah untuk material berat\n- Alat besar bisa masuk"),
	makeTag(TAG_TYPES.ENTRANCE_ACCESS, "Motor", "- Akses jalan dengan lebar 1-2m.\n- Mobilisasi: Manual atau gerobak kecil\n- Material berat dibawa bertahap"),
	makeTag(TAG_TYPES.ENTRANCE_ACCESS, "Jalan Kaki", "- Akses jalan dengan lebar <1m.\n- Mobilisasi: Full manual\n- Material terbatas ukuran kecil\n- Biaya angkut: Tinggi"),
];

const gardenEntranceAccessTags = [
	makeTag(TAG_TYPES.GARDEN_ENTRANCE_ACCESS, "Halaman Depan", "WAJIB koordinasi dengan tetangga jika jalur akses sempit"),
	makeTag(TAG_TYPES.GARDEN_ENTRANCE_ACCESS, "Lewat Pintu Depan", "WAJIB Proteksi lantai dengan terpal, cardboard atau plastik dan hindari jam sibuk rumah"),
	makeTag(TAG_TYPES.GARDEN_ENTRANCE_ACCESS, "Lewat Pintu Samping", "WAJIB Cek lebar pintu untuk jalur material"),
	makeTag(TAG_TYPES.GARDEN_ENTRANCE_ACCESS, "Lainnya", "Jelaskan rute lebih detail di kolom catatan", TAG.GARDEN_ENTRANCE_ACCESS_OTHER),
];

const groundSurfaceConditionTags = [
	makeTag(TAG_TYPES.GROUND_SURFACE_CONDITION, "Full Perkerasan", ""),
	makeTag(TAG_TYPES.GROUND_SURFACE_CONDITION, "Sebagian Perkerasan", ""),
	makeTag(TAG_TYPES.GROUND_SURFACE_CONDITION, "Lahan Tanah", ""),
];

const landPreparationTags = [
	makeTag(TAG_TYPES.LAND_PREPARATION, "Tanah Siap Tanam", "- Kondisi: Tanah gembur, subur, pH seimbang (6.0-7.0)\n- Persiapan: Membutuhkan pengolahan lahan biasa", TAG.LAND_PREPARATION_READY_TO_PLANT),
	makeTag(TAG_TYPES.LAND_PREPARATION, "Tanah Berpuing /Kerikil", "- Masalah: Akar tanaman terluka, drainase terlalu cepat (kering), tidak ada nutrisi, tanah berisi puing bangunan, batu bata, kerikil besar, sisa konstruksi\n- Persiapan: Pembersihan dengan pengolahan tanah berpuing"),
	makeTag(TAG_TYPES.LAND_PREPARATION, "Tanah Bergulma", "- Masalah: Kompetisi nutrisi, harbor hama/penyakit, estetika buruk\n- Jenis Gulma: Rumput teki (paling susah), alang-alang, rumput liar, tanaman merambat\n- Persiapan: Membutuhkan pengolahan lahan bergulma"),
	makeTag(TAG_TYPES.LAND_PREPARATION, "Tidak Diketahui", "Risiko tinggi dengan kemungkinan budget yang tidak sesuai, timeline tertunda, atau komplikasi saat eksekusi taman"),
];

const soilMoistureTags = [
	makeTag(TAG_TYPES.SOIL_MOISTURE, "Lembab", "Tanah terasa dingin, agak basah, atau mudah digumpalkan"),
	makeTag(TAG_TYPES.SOIL_MOISTURE, "Kering", "Tekstur tanah terasa keras, pecah-pecah, atau mudah hancur berdebu"),
];

const soilPlantingReadinessTags = [
	makeTag(TAG_TYPES.SOIL_PLANTING_READINESS, "Siap Tanam", "- Tanah gembur, subur, pH seimbang\n- Langsung tanam\n- Hanya butuh pupuk dasar"),
	makeTag(TAG_TYPES.SOIL_PLANTING_READINESS, "Tidak Siap Tanam", "", TAG.SOIL_PLANTING_READINESS_NOT_READY),
];

const fixedStructureTags = [
	makeTag(TAG_TYPES.FIXED_STRUCTURE, "Septitank", ""),
	makeTag(TAG_TYPES.FIXED_STRUCTURE, "Sumur Air/Sumur Bor", ""),
	makeTag(TAG_TYPES.FIXED_STRUCTURE, "Pipa Air utama (Air bersih & limbah)", ""),
	makeTag(TAG_TYPES.FIXED_STRUCTURE, "Meteran Listrik & Jalur Kabel Utama PLM", ""),
	makeTag(TAG_TYPES.FIXED_STRUCTURE, "Tiang Listrik/panel distribusi listrik rumah", ""),
	makeTag(TAG_TYPES.FIXED_STRUCTURE, "Tidak ada", "", TAG.FIXED_STRUCTURE_NONE),
	makeTag(TAG_TYPES.FIXED_STRUCTURE, "Lainnya", ""),
];

const childrenPresenceTags = [
	makeTag(TAG_TYPES.CHILDREN_PRESENCE, "Ada (0-5 tahun)", "- Hindari tanaman beracun (Dieffenbachia, Euphorbia) dan berduri\n- Hindari material Kolam dalam, batu tajam, edging keras"),
	makeTag(TAG_TYPES.CHILDREN_PRESENCE, "Ada (6-12 tahun)", "- Hindari tanaman beracun (Dieffenbachia, Euphorbia) dan berduri\n- Hindari material Kolam dalam, batu tajam, edging keras"),
	makeTag(TAG_TYPES.CHILDREN_PRESENCE, "Sering Berkunjung (Sarana Publik)", "- HINDARI: Tanaman sangat beracun dan berduri tinggi\n-  Area dengan keamanan tidak seketat saat anak sebagai penghuni tetap"),
	makeTag(TAG_TYPES.CHILDREN_PRESENCE, "Tidak ada", "Kebebasan penuh pemilihan tanaman, kemudian bisa menggunakan tanaman eksotis/beracun, serta dapat fokus estetika"),
];

const animalPresenceTags = [
	makeTag(TAG_TYPES.ANIMAL_PRESENCE, "Ada Kucing", "PERHATIAN: Kucing suka area tanah gembur\nHindari tanaman beracun seperti: Lily, Tulip, Aloe Vera, Pothos, Philodendron"),
	makeTag(TAG_TYPES.ANIMAL_PRESENCE, "Ada Anjing", "PERHATIAN: Anjing suka menggali\nHindari tanaman beracun seperti: Sago Palm, Azalea, Tulip, Daffodil, Lily"),
	makeTag(TAG_TYPES.ANIMAL_PRESENCE, "Ada Anjing & Kucing", "Hindari semua tanaman toxic untuk keduanya"),
	makeTag(TAG_TYPES.ANIMAL_PRESENCE, "Tidak Ada", "Kebebasan penuh pemilihan tanaman, serta dapat fokus estetika"),
	makeTag(TAG_TYPES.ANIMAL_PRESENCE, "Lainnya", "- PENTING: Informasikan jenis hewan di catatan\n- Setiap hewan punya toxicity list berbeda. Contoh: Kelinci - hindari Rhubarb, Ivy; Burung - hindari Avocado\n- Konsultasi: Cek ASPCA toxic plant database", TAG.ANIMAL_PRESENCE_OTHER),
];

const careLevelTags = [
	makeTag(TAG_TYPES.CARE_LEVEL, "Low Maintenance", "Tanaman tahan panas/kering, jarang disiram, cocok untuk klien yang tidak punya banyak waktu"),
	makeTag(TAG_TYPES.CARE_LEVEL, "High Maintenance", "Tanaman butuh penyiraman & pemangkasan rutin. Bukan berarti rumit, hanya lebih sering diperhatikan agar taman selalu segar & indah."),
];

const specialAreaTags = [
	makeTag(TAG_TYPES.SPECIAL_AREA, "Rooftop", "Hitung load capacity struktur bangunan rooftop dan pilih tanaman yang tahan dari angin (windproof). WAJIB lapisan waterproof"),
	makeTag(TAG_TYPES.SPECIAL_AREA, "Apartemen", "Perhatikan akses via lift, batas beban lantai, aturan manajemen gedung, ukuran material terbatas, dan pastikan drainase tidak mengganggu unit lain"),
	makeTag(TAG_TYPES.SPECIAL_AREA, "Lainnya", "", TAG.SPECIAL_AREA_OTHER),
	makeTag(TAG_TYPES.SPECIAL_AREA, "Taman Tidak di Area Khusus", ""), // dikonfirmasi dari copy alert, bukan baris tersendiri di sheet
];

const themeTags = [
	makeTag(TAG_TYPES.GARDEN_THEME, "Minimalis", ""),
	makeTag(TAG_TYPES.GARDEN_THEME, "Kering", ""),
	makeTag(TAG_TYPES.GARDEN_THEME, "Tropis", ""),
	makeTag(TAG_TYPES.GARDEN_THEME, "Zen", ""),
	makeTag(TAG_TYPES.GARDEN_THEME, "Vertical", ""),
	makeTag(TAG_TYPES.GARDEN_THEME, "Rooftop", ""),
	makeTag(TAG_TYPES.GARDEN_THEME, "Multfungsi", ""),
	makeTag(TAG_TYPES.GARDEN_THEME, "Taman Air", ""),
];

export const dummyTags = [
	...gardenFacingDirectionTags,
	...sunExposureObstructionTags,
	...drainageTags,
	...waterSourceTags,
	...electricitySourceTags,
	...entranceAccessTags,
	...gardenEntranceAccessTags,
	...groundSurfaceConditionTags,
	...landPreparationTags,
	...soilMoistureTags,
	...soilPlantingReadinessTags,
	...fixedStructureTags,
	...areaSunExposureTags,
	...rainGutterNeedTags,
	...childrenPresenceTags,
	...animalPresenceTags,
	...careLevelTags,
	...specialAreaTags,
	...themeTags
];


// ── Helper bikin 1 paket survey dummy yang lengkap & konsisten ──
// (user + orderDesign + surveyorAvailability + locationSurveyAssignment)
// PENTING: `loadSurveys()` di useSurveys.ts men-skip assignment kalau
// orderDesign ATAU surveyorAvailability terkait tidak ketemu di memory.
// Jadi ke-4 record ini wajib selalu dibuat berpasangan & konsisten id-nya.
function makeDummySurveyPackage({
	index,
	userName,
	userPhone,
	address,
	areaSize,
	invoiceId,
	status,
	availableAt,
	checkInAt = null,
	checkOutAt = null
}) {
	const userId = String(index);
	const orderDesignId = String(index);
	const availabilityId = String(index);
	const assignmentId = `dummy-lsa-${index}`;

	return {
		user: {
			type: 'users',
			id: userId,
			attributes: {
				name: userName,
				phone: userPhone,
				address,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		},
		orderDesign: {
			type: 'orderDesigns',
			id: orderDesignId,
			attributes: {
				invoiceId,
				userId: Number(userId),
				areaSize,
				areaPhotos: [],
				address,
				categorySizeId: 2,
				status: 'survey',
				consultationDate: new Date().toISOString().slice(0, 10),
				consultationTime: '10:00'
			}
		},
		surveyorAvailability: {
			type: 'surveyorAvailabilities',
			id: availabilityId,
			attributes: {
				surveyorId: 1,
				availableAt
			}
		},
		locationSurveyAssignment: {
			type: 'locationSurveyAssignments',
			id: assignmentId,
			attributes: {
				orderDesignId: Number(orderDesignId),
				surveyorAvailabilityId: Number(availabilityId),
				checkInAt,
				checkOutAt,
				status,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		}
	};
}

// ── Beberapa contoh survey dummy, mencakup semua tab status di SurveyListPage:
// "Dalam Proses" -> wait_to_survey, ongoing
// "Tinjauan"     -> incomplete, in_review
// "Selesai"      -> finish
export const dummySurveyPackages = [
	makeDummySurveyPackage({
		index: 1,
		userName: 'Budi Santoso',
		userPhone: '081234567890',
		address: 'Jl. Contoh Dummy No. 123, Blitar',
		areaSize: 25,
		invoiceId: 'INV-DUMMY-001',
		status: 'wait_to_survey',
		availableAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
	}),
	makeDummySurveyPackage({
		index: 2,
		userName: 'Siti Aminah',
		userPhone: '081298765432',
		address: 'Jl. Mawar No. 45, Blitar',
		areaSize: 40,
		invoiceId: 'INV-DUMMY-002',
		status: 'ongoing',
		availableAt: new Date().toISOString(),
		checkInAt: new Date().toISOString()
	}),
	makeDummySurveyPackage({
		index: 3,
		userName: 'Andi Wijaya',
		userPhone: '081211122233',
		address: 'Jl. Melati No. 7, Blitar',
		areaSize: 18,
		invoiceId: 'INV-DUMMY-003',
		status: 'incomplete',
		availableAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		checkInAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		checkOutAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString()
	}),
	makeDummySurveyPackage({
		index: 4,
		userName: 'Rina Kusuma',
		userPhone: '081244455566',
		address: 'Jl. Anggrek No. 12, Blitar',
		areaSize: 30,
		invoiceId: 'INV-DUMMY-004',
		status: 'in_review',
		availableAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		checkInAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		checkOutAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString()
	}),
	makeDummySurveyPackage({
		index: 5,
		userName: 'Dedi Kurniawan',
		userPhone: '081266677788',
		address: 'Jl. Kenanga No. 9, Blitar',
		areaSize: 22,
		invoiceId: 'INV-DUMMY-005',
		status: 'finish',
		availableAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		checkInAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		checkOutAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString()
	})
];

// Kumpulan flat per tipe, siap di-seed ke memory Orbit.js
export const dummyUsers = dummySurveyPackages.map((p) => p.user);
export const dummyOrderDesigns = dummySurveyPackages.map((p) => p.orderDesign);
export const dummySurveyorAvailabilities = dummySurveyPackages.map((p) => p.surveyorAvailability);
export const dummyLocationSurveyAssignments = dummySurveyPackages.map(
	(p) => p.locationSurveyAssignment
);

// Dipertahankan untuk kompatibilitas mundur (siapa tahu dipakai di tempat lain):
// merujuk ke paket kedua ('ongoing') seperti perilaku dummy lama.
export const dummyLocationSurveyAssignment = dummyLocationSurveyAssignments[1];
export const dummyOrderDesign = dummyOrderDesigns[1];

// Bentuk ini disesuaikan supaya bisa langsung dipakai di komponen
// (client.name, dsb) — sesuaikan lagi kalau struktur asli beda.
export const dummyClient = {
	name: 'Budi Santoso (Dummy)'
};