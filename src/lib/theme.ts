import type { Appearance, Theme, ThemeMode } from '../types/portfolio'

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function resolveTheme(mode: ThemeMode, systemDark: boolean): Theme {
  return mode === 'system' ? (systemDark ? 'dark' : 'light') : mode
}

// Runs in the document head before styles paint. Keep it independent of React
// so saved preferences work before hydration and with the prerendered HTML.
export function createThemeBootstrap(appearance: Appearance): string {
  const config = JSON.stringify(appearance).replace(/</g, '\\u003c')
  return `(function(){var config=${config};var mode=config.defaultMode;try{var saved=localStorage.getItem(config.storageKey);if(saved==='light'||saved==='dark'||saved==='system')mode=saved;}catch(error){}var theme=mode==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):mode;document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',config.browserColors[theme]);})();`
}
