import { create } from 'zustand';

export interface SelectionStoreState<T> {
  selection: T[];
  setSelection: (items: T[]) => void;
  clearSelection: () => void;
}

export function createSelectionStore<T>() {
  return create<SelectionStoreState<T>>((set) => ({
    selection: [],

    setSelection: (items) =>
      set({
        selection: items,
      }),

    clearSelection: () =>
      set({
        selection: [],
      }),
  }));
}
