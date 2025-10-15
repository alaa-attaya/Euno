import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface FactsStore {
  selectedCategory: Id<"categories"> | "all";
  setSelectedCategory: (category: Id<"categories"> | "all") => void;

  pageIndexes: Record<string, number>; // store page index per category
  setPageIndex: (category: Id<"categories"> | "all", index: number) => void;
  getPageIndex: (category: Id<"categories"> | "all") => number;
}

export const useFactsStore = create<FactsStore>((set, get) => ({
  selectedCategory: "all",
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  pageIndexes: {},
  setPageIndex: (category, index) =>
    set((state) => ({
      pageIndexes: { ...state.pageIndexes, [category]: index },
    })),
  getPageIndex: (category) => get().pageIndexes[category] || 0,
}));
