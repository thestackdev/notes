import { create } from "zustand";

interface UtilsStore {
  isOpen: boolean;
  toggle: () => void;
}

const useUtils = create<UtilsStore>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useUtils;
