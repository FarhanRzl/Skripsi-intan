// Project ini belum punya sumber data daftar tanaman beneran (belum ada
// tabel/tag `plant_type`) — 5 nama dummy ini dipakai bareng oleh
// FormUploadTanaman.tsx (dropdown "Tanaman Eksisting") & PlantRequestForm.tsx
// (autocomplete "Permintaan Tanaman Khusus") supaya perilaku pilih-dari-daftar
// kelihatan & bisa dites di kedua tempat. Timpa dengan sumber data asli begitu
// sudah tersedia.
export const DUMMY_PLANT_NAMES: string[] = [
	'Palem Kuning',
	'Lidah Mertua',
	'Sirih Gading',
	'Bougenville',
	'Kamboja Jepang'
];
