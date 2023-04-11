import { create } from 'zustand';

interface DarkModeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useDarkModeStore = create<DarkModeState>((set) => {
  const darkMode = JSON.parse(localStorage.getItem('darkMode') ?? 'true');
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
  if (darkMode) document.documentElement.classList.add('dark');

  return {
    darkMode,
    toggleDarkMode: () =>
      set((state) => {
        const newDarkMode = !state.darkMode;
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return {
          darkMode: newDarkMode,
        };
      }),
  };
});
