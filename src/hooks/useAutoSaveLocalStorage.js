import { useEffect } from "react";

// Auto-save draft form ke localStorage tiap value berubah,
// biar kalau tab ke-refresh gak hilang progress-nya
export function useAutoSaveLocalStorage(key, watchedValues) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(watchedValues));
      } catch (err) {
        console.error("Gagal menyimpan draft ke localStorage:", err);
      }
    }, 500); // debounce biar gak nulis tiap keystroke

    return () => clearTimeout(timeout);
  }, [key, watchedValues]);
}

export function loadDraftFromLocalStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Gagal membaca draft dari localStorage:", err);
    return null;
  }
}
