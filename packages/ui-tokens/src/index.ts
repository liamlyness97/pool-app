export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;
export const radii = { sm: 10, md: 14, pill: 22 } as const;

export interface Theme {
  name: string;
  colors: {
    bg: string;
    surface: string;
    ink: string;
    muted: string;
    border: string;
    accent: string;
    onAccent: string;
    freeBg: string;
    freeText: string;
    busyBg: string;
    busyText: string;
    reservedBg: string;
    reservedText: string;
  };
}

export const chalkTheme: Theme = {
  name: "chalk",
  colors: {
    bg: "#f6f4ef",
    surface: "#ffffff",
    ink: "#1c1c1c",
    muted: "#5b574e",
    border: "#1c1c1c",
    accent: "#2f7d5b",
    onAccent: "#ffffff",
    freeBg: "#dcebe3",
    freeText: "#1f5a40",
    busyBg: "#e6e3dc",
    busyText: "#4a463d",
    reservedBg: "#f1e6c8",
    reservedText: "#6b5210",
  },
};

export const neonTheme: Theme = {
  name: "neon",
  colors: {
    bg: "#101418",
    surface: "#1a2027",
    ink: "#f2f4f5",
    muted: "#9aa4ad",
    border: "#3a444d",
    accent: "#c42f66",
    onAccent: "#ffffff",
    freeBg: "#17352a",
    freeText: "#8fd9b4",
    busyBg: "#2a3139",
    busyText: "#b9c2ca",
    reservedBg: "#3a3014",
    reservedText: "#e6c76a",
  },
};