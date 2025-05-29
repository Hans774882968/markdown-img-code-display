import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  editorTheme: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setEditorTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      editorTheme: 'github-dark',
      setTheme: (theme) => set({ theme }),
      setEditorTheme: (editorTheme) => set({ editorTheme }),
    }),
    {
      name: 'theme-storage',
    },
  ),
);