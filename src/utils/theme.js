const DEFAULT_THEME = 'light';

export const getThemeMode = () => {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
};

export const getCssVar = (name, fallback = '') => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
};

export const getChartThemeTokens = () => ({
  themeMode: getThemeMode(),
  accent: getCssVar('--color-accent', '#0bc2d6'),
  accentStrong: getCssVar('--color-accent-strong', '#0891b2'),
  accentSoft: getCssVar('--color-accent-soft', 'rgba(11, 194, 214, 0.12)'),
  accentFill: getCssVar('--color-accent-fill', '#dceff2'),
  accentContrast: getCssVar('--color-accent-contrast', '#1f5963'),
  bgCard: getCssVar('--bg-card', '#ffffff'),
  bgCardSoft: getCssVar('--bg-card-soft', '#f8fafc'),
  textPrimary: getCssVar('--text-primary', '#1e293b'),
  textSecondary: getCssVar('--text-secondary', '#475569'),
  textMuted: getCssVar('--text-muted', '#64748b'),
  textInverse: getCssVar('--text-inverse', '#ffffff'),
  borderDefault: getCssVar('--border-default', '#e2e8f0'),
  borderStrong: getCssVar('--border-strong', '#cbd5e1'),
  palette: [
    getCssVar('--color-accent', '#2f9fb1'),
    '#5b8def',
    '#58b77a',
    '#d4a65a',
    '#d46a6a',
    '#8e7cc3',
    '#5aa8bf',
    '#9db85d',
    '#d18a5d'
  ]
});
