import React, { createContext, useContext } from "react";

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryLight: string;
  inputBackground: string;
  inputText: string;
  inputPlaceholder: string;
  divider: string;
  icon: string;
  iconSecondary: string;
  error: string;
  success: string;
  warning: string;
}

interface Theme {
  colors: ThemeColors;
}

interface ThemeContextType {
  theme: Theme;
}

const colors: ThemeColors = {
  background: "#0B0D17", // Deep Black
  surface: "#1A1C2A", // Dark Surface
  text: "#FFFFFF", // Primary Text
  textSecondary: "#B5B8D4", // Secondary Text
  border: "#1A1C2A", // Dark Surface for borders
  primary: "#7B61FF", // Electric Purple
  primaryLight: "#E45EFF", // Hot Pink
  inputBackground: "#1A1C2A", // Dark Surface
  inputText: "#FFFFFF", // Primary Text
  inputPlaceholder: "#B5B8D4", // Secondary Text
  divider: "#1A1C2A", // Dark Surface
  icon: "#B5B8D4", // Secondary Text
  iconSecondary: "#7B61FF", // Electric Purple
  error: "#ff453a",
  success: "#32d74b",
  warning: "#ff9f0a",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: Theme = {
    colors,
  };

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
