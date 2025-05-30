import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorState {
  editorFontSize: number;
  setEditorFontSize: (editorFontSize: number | ((prev: number) => number)) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      editorFontSize: 14,
      setEditorFontSize: (editorFontSize) => {
        if (typeof editorFontSize === 'function') {
          set({ editorFontSize: editorFontSize(get().editorFontSize) });
        } else {
          set({ editorFontSize });
        }
      },
    }),
    {
      name: 'editor-storage',
    },
  ),
);
