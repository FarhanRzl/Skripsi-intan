import { create } from "zustand";

// Note FAB independen dari form state -> pakai Zustand, bukan Context,
// biar gampang di-sync antar komponen/tab tanpa prop drilling
export const useNoteFabStore = create((set) => ({
  notes: [],
  isOpen: false,
  position: { x: 24, y: 24 },

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  addNote: (text) =>
    set((state) => ({
      notes: [...state.notes, { id: crypto.randomUUID(), text, createdAt: Date.now() }],
    })),

  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  setPosition: (position) => set({ position }),
}));
