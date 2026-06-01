/** Design tokens from style-guide.md */

export const colors = {
  bgDark: '#0d1117',
  bgPanel: '#161b22',
  bgPanelBorder: '#30363d',
  jungleDeep: '#1a3c34',
  jungleAccent: '#8fbc8f',
  riverDeep: '#2c4a6e',
  riverFoam: '#a8c8e8',
  riverCurrent: '#4a7ab0',
  alliedPrimary: '#e8a838',
  alliedTracer: '#ffc857',
  alliedGlow: 'rgba(232, 168, 56, 0.4)',
  japanesePrimary: '#8b3a3a',
  japaneseAccent: '#c45c5c',
  japaneseGlow: 'rgba(139, 58, 58, 0.35)',
  hudPhosphor: '#c9a227',
  hudGreen: '#3dd68c',
  hudRed: '#f85149',
  hudAmber: '#d4a72c',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  textMuted: '#6e7681',
  hit: '#3dd68c',
  miss: '#f85149',
  neutral: '#58a6ff',
};

export const fonts = {
  headline: '"Barlow Condensed", "Arial Narrow", sans-serif',
  body: '"Source Sans 3", "Helvetica Neue", sans-serif',
  data: '"JetBrains Mono", "SF Mono", monospace',
  historical: '"Source Serif 4", Georgia, serif',
};

export const layout = {
  width: 1920,
  height: 1080,
  safeMargin: 80,
  panelRadius: 8,
  panelPadding: 24,
};

export const motion = {
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  staggerMs: 80,
  panelSlidePx: 40,
};

export const categoryColors: Record<string, string> = {
  aim: colors.hudPhosphor,
  range: colors.neutral,
  movement: colors.riverCurrent,
  situation: colors.jungleAccent,
  visibility: colors.textSecondary,
  target: colors.alliedPrimary,
  sab: colors.japaneseAccent,
  other: colors.textMuted,
};
