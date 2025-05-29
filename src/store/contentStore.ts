import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ContentState {
  markdownText: string;
  setMarkdownText: (text: string) => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      markdownText: '',
      setMarkdownText: (text) => set({ markdownText: text }),
    }),
    {
      name: 'markdown-content',
    },
  ),
);