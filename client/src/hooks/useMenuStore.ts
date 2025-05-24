import { create } from "zustand";

interface MenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  mode?: "create" | "view" | "delete" | "edit";
  setMode: (mode: "create" | "view" | "delete" | "edit") => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  mode: undefined,
  setMode: (mode: "create" | "view" | "delete" | "edit") => set({ mode }),
}));
