import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  lightEditorTheme: string;
  darkEditorTheme: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setLightEditorTheme: (theme: string) => void;
  setDarkEditorTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      lightEditorTheme: 'github-light',
      darkEditorTheme: 'github-dark',
      setTheme: (theme) => set({ theme }),
      setLightEditorTheme: (lightEditorTheme) => set({ lightEditorTheme }),
      setDarkEditorTheme: (darkEditorTheme) => set({ darkEditorTheme }),
    }),
    {
      name: 'theme-storage',
    },
  ),
);
