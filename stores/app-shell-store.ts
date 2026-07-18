import { create } from "zustand";

interface AppShellState {
  readonly isCommandMenuOpen: boolean;
  readonly setCommandMenuOpen: (isOpen: boolean) => void;
}

export const useAppShellStore = create<AppShellState>((set) => ({
  isCommandMenuOpen: false,
  setCommandMenuOpen: (isOpen) => set({ isCommandMenuOpen: isOpen })
}));
