import { KeywordResearchEntity } from '@/core/entities';
import { create } from 'zustand';

export interface SelectionStoreState<T> {
  selectedResearch: KeywordResearchEntity;
  setSelectedResearch: (item: KeywordResearchEntity) => void;
  selection: T[];
  setSelection: (items: T[]) => void;
  clearSelection: () => void;
  unSelect: T[];
  setUnSelec: (item: T) => void;
  positivesToNewKeyword: T[];
  setPositiveToNewKeyword: (item: T) => void;
  setUnselectPositiveToKeyword: (item: T) => void;
  hidrateUnSelect: (items: T[] | null) => void;
  hidratePositiveToNewKeyword: (items: T[] | null) => void;
}

export function createSelectionStore<T>() {
  return create<SelectionStoreState<T>>((set, get) => ({
    selection: [],
    selectedResearch: '',
    unSelect: [],
    positivesToNewKeyword: [],

    setPositiveToNewKeyword: (item) => {
      const { positivesToNewKeyword, selection } = get();
      const newArr = selection.filter((el) => el !== item);
      set({
        positivesToNewKeyword: [...positivesToNewKeyword, item],
        selection: [...newArr],
      });
    },

    setUnselectPositiveToKeyword: (item) => {
      const { positivesToNewKeyword, selection } = get();

      if (positivesToNewKeyword.includes(item)) {
        const newArrUnselect = positivesToNewKeyword.filter(
          (el) => el !== item
        );
        return set({
          selection: [...selection, item],
          positivesToNewKeyword: newArrUnselect,
          selectedResearch: null,
        });
      }

      const newArrSelection = selection.filter((el) => el !== item);
      return set({
        positivesToNewKeyword: [...positivesToNewKeyword, item],
        selection: newArrSelection,
      });
    },

    setSelection: (items) =>
      set({
        selection: items,
      }),

    clearSelection: () =>
      set({
        selection: [],
        unSelect: [],
        positivesToNewKeyword: [],
      }),

    setUnSelec: (item) => {
      const { unSelect, selection } = get();

      if (unSelect.includes(item)) {
        const newArrUnselect = unSelect.filter((el) => el !== item);
        return set({
          selection: [...selection, item],
          unSelect: newArrUnselect,
          selectedResearch: null,
        });
      }

      const newArrSelection = selection.filter((el) => el !== item);
      return set({ unSelect: [...unSelect, item], selection: newArrSelection });
    },
    setSelectedResearch: (id) => {
      set({ selectedResearch: id });
    },
    hidrateUnSelect: (newWords) => {
      if (!!newWords) {
        set({ unSelect: [...newWords] });
      }
      return;
    },
    hidratePositiveToNewKeyword: (newWords) => {
      if (!!newWords) set({ positivesToNewKeyword: [...newWords] });
    },
  }));
}
