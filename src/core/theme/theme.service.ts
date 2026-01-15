import { Injectable } from '@angular/core';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'unplug-kit-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme: Theme = 'dark';

  init() {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? null;
    this.setTheme(saved ?? 'dark');
  }

  get current(): Theme {
    return this.theme;
  }

  toggle() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);

    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
  }
}
