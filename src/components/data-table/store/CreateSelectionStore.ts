import { create } from 'zustand';

export interface SelectionStoreState<T> {
  selection: T[];
  setSelection: (items: T[]) => void;
  clearSelection: () => void;
  unSelect: T[];
  setUnSelec: (item: T) => void;
}

export function createSelectionStore<T>() {
  return create<SelectionStoreState<T>>((set, get) => ({
    selection: [],
    unSelect: [],
    setSelection: (items) =>
      set({
        selection: items,
      }),

    clearSelection: () =>
      set({
        selection: [],
      }),

    setUnSelec: (item) => {
      const { unSelect, selection } = get();

      if (unSelect.includes(item)) {
        const newArrUnselect = unSelect.filter((el) => el !== item);
        return set({
          selection: [...selection, item],
          unSelect: newArrUnselect,
        });
      }

      const newArrSelection = selection.filter((el) => el !== item);
      return set({ unSelect: [...unSelect, item], selection: newArrSelection });
    },
  }));
}
