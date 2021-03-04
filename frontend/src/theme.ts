import { writable } from 'svelte/store';

const html = document.querySelector('html');
const storageThemeKey = 'theme';

export enum Theme {
  light = 'light',
  dark = 'dark',
}

const defaultTheme = Theme.light;
const userLocalTheme = localStorage.getItem(storageThemeKey) as Theme;

const applyTheme = (theme: Theme): void => {
  switch (theme) {
    case Theme.dark:
      html.classList.add(Theme.dark);
      break;

    default:
      html.classList.remove(Theme.dark);
  }

  localStorage.setItem(storageThemeKey, theme);
};

export const currentTheme = writable(userLocalTheme || defaultTheme);
currentTheme.subscribe(applyTheme);
