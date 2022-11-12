export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

const THEME_LOCAL_STORAGE_KEY = "xdevhub.theme";

export class ThemeHelper {
  theme = Theme.LIGHT;

  getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return Theme.DARK;
    }
    return Theme.LIGHT;
  }

  constructor() {
    const localStorageTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
    if (localStorageTheme) {
      this.theme =
        localStorageTheme === Theme.DARK || localStorageTheme === Theme.LIGHT
          ? localStorageTheme
          : this.getSystemTheme();
      return;
    }
    // If no theme was set
    this.theme = this.getSystemTheme();
  }

  changeTheme(newTheme: Theme) {
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, newTheme);
    document.body.classList.replace(this.theme, newTheme);
    this.theme = newTheme;
  }
}
