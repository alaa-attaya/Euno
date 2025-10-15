import { create } from "zustand";

interface FactsStore {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  pageIndex: number;
  setPageIndex: (index: number) => void;
}

export const useFactsStore = create<FactsStore>((set) => ({
  selectedCategory: "all",
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  pageIndex: 0,
  setPageIndex: (index) => set({ pageIndex: index }),
}));
