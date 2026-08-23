/**
 * FILE: lib/theme.ts
 * Design tokens ported from the Next.js app's globals.css (oklch CSS vars -> RN-friendly hex).
 * Every screen should pull colors/spacing from here instead of hardcoding values.
 */
export const colors = {
  background: "#FAFAFA",
  foreground: "#17181F",
  card: "#FFFFFF",
  cardForeground: "#17181F",
  primary: "#1F2547",
  primaryForeground: "#FFFFFF",
  secondary: "#F1F2F5",
  secondaryForeground: "#24283A",
  muted: "#F0F1F4",
  mutedForeground: "#767A8C",
  accent: "#FF7A1A",
  accentForeground: "#FFFFFF",
  accentSoft: "#FFEAD3",
  brand: "#33406B",
  brandSoft: "#E9ECF6",
  gold: "#E0AA3E",
  goldSoft: "#FBF1DC",
  deal: "#E1432B",
  dealSoft: "#FBE6E2",
  success: "#3FA35B",
  successForeground: "#FFFFFF",
  successSoft: "#E7F6EB",
  warning: "#E0AA3E",
  warningForeground: "#3A2C0A",
  warningSoft: "#FBF1DC",
  border: "#E7E8ED",
  white: "#FFFFFF",
  black: "#000000",
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

export const spacing = (n: number) => n * 4;

export const shadow = {
  card: {
    shadowColor: "#0B1030",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cta: {
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
};

export const fonts = {
  display: { fontWeight: "800" as const },
  bold: { fontWeight: "700" as const },
  semibold: { fontWeight: "600" as const },
  medium: { fontWeight: "500" as const },
};
