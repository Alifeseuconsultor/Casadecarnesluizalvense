/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#f6f4ef",
      "foreground": "#1d3029",
      "border": "#ddd8cf",
      "card": "#fbfbf8",
      "cardForeground": "#1d3029",
      "popover": "#fbfbf8",
      "popoverForeground": "#1d3029",
      "primary": "#2a4c3f",
      "primaryForeground": "#f8f6ef",
      "secondary": "#ede2cf",
      "secondaryForeground": "#244236",
      "muted": "#ebe7e0",
      "mutedForeground": "#63796f",
      "accent": "#e8b254",
      "accentForeground": "#1f382e",
      "destructive": "#c53c30",
      "destructiveForeground": "#ffffff",
      "input": "#d5cec3",
      "ring": "#3c6d5a",
      "chart1": "#366352",
      "chart2": "#e8b254",
      "chart3": "#cf7d54",
      "chart4": "#8ca960",
      "chart5": "#6c859d",
      "sidebar": "#1f382e",
      "sidebarForeground": "#f4f2eb",
      "sidebarBorder": "#345146",
      "sidebarPrimary": "#e8b254",
      "sidebarPrimaryForeground": "#1f382e",
      "sidebarAccent": "#2f4c41",
      "sidebarAccentForeground": "#f4f2eb",
      "sidebarRing": "#e8b254"
    },
    "dark": {
      "background": "#16251d",
      "foreground": "#f3f0e6",
      "border": "#43564a",
      "card": "#20372e",
      "cardForeground": "#f3f0e6",
      "popover": "#263d32",
      "popoverForeground": "#f3f0e6",
      "primary": "#ddb96d",
      "primaryForeground": "#203a30",
      "secondary": "#294439",
      "secondaryForeground": "#f3f0e6",
      "muted": "#30473b",
      "mutedForeground": "#c4cec2",
      "accent": "#e3c47a",
      "accentForeground": "#203a30",
      "destructive": "#c76252",
      "destructiveForeground": "#ffffff",
      "input": "#4b5d51",
      "ring": "#ddb96d",
      "chart1": "#a9c985",
      "chart2": "#ddb96d",
      "chart3": "#df8c68",
      "chart4": "#8cae68",
      "chart5": "#93b8c2",
      "sidebar": "#122119",
      "sidebarForeground": "#f3f0e6",
      "sidebarBorder": "#2d4639",
      "sidebarPrimary": "#ddb96d",
      "sidebarPrimaryForeground": "#203a30",
      "sidebarAccent": "#213b2d",
      "sidebarAccentForeground": "#f3f0e6",
      "sidebarRing": "#ddb96d"
    }
  },
  "fontFamily": {
    "sans": [
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif"
    ],
    "serif": [
      "ui-sans-serif",
      "system-ui",
      "sans-serif"
    ],
    "mono": [
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Consolas",
      "monospace"
    ]
  },
  "radius": "0.5rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
