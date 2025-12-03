import { create } from 'zustand';

export interface SelectionStoreState<T> {
  selectedResearch: string;
  setSelectedResearch: (id: string) => void;
  selection: T[];
  setSelection: (items: T[]) => void;
  clearSelection: () => void;
  unSelect: T[];
  setUnSelec: (item: T) => void;
}

export function createSelectionStore<T>() {
  return create<SelectionStoreState<T>>((set, get) => ({
    selection: [],
    selectedResearch: '',
    unSelect: [],
    setSelection: (items) =>
      set({
        selection: items,
      }),

    clearSelection: () =>
      set({
        selection: [],
        unSelect: [],
      }),

    setUnSelec: (item) => {
      const { unSelect, selection } = get();

      if (unSelect.includes(item)) {
        const newArrUnselect = unSelect.filter((el) => el !== item);
        return set({
          selection: [...selection, item],
          unSelect: newArrUnselect,
          selectedResearch: '',
        });
      }

      const newArrSelection = selection.filter((el) => el !== item);
      return set({ unSelect: [...unSelect, item], selection: newArrSelection });
    },
    setSelectedResearch: (id) => {
      set({ selectedResearch: id });
    },
  }));
}
