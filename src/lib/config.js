// Config generik — TIDAK mengarah ke API perusahaan (Laravel) manapun.
// Semua alamat backend dibaca dari .env, supaya:
//   - Mode mock (VITE_USE_MOCK_DATA=true) tidak butuh backend sama sekali
//   - Kalau nanti mau konek ke backend beneran, tinggal isi VITE_API_BASE_URL
//     di .env — tidak perlu ubah kode.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
