import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "auto";

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
  mode: ThemeMode;
  isDark: boolean;
}

interface ThemeContextType {
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const lightColors: ThemeColors = {
  background: "#ffffff",
  surface: "#f5f5f5",
  text: "#333333",
  textSecondary: "#666666",
  border: "#e0e0e0",
  primary: "#ee4d2d",
  primaryLight: "#fff5f3",
  inputBackground: "#f5f5f5",
  inputText: "#333333",
  inputPlaceholder: "#999999",
  divider: "#e0e0e0",
  icon: "#666666",
  iconSecondary: "#999999",
  error: "#ff3b30",
  success: "#34c759",
  warning: "#ff9500",
};

const darkColors: ThemeColors = {
  background: "#000000",
  surface: "#1c1c1e",
  text: "#ffffff",
  textSecondary: "#a1a1a6",
  border: "#38383a",
  primary: "#ee4d2d",
  primaryLight: "#2a1a15",
  inputBackground: "#1c1c1e",
  inputText: "#ffffff",
  inputPlaceholder: "#6e6e73",
  divider: "#38383a",
  icon: "#a1a1a6",
  iconSecondary: "#6e6e73",
  error: "#ff453a",
  success: "#32d74b",
  warning: "#ff9f0a",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@shoppe_theme_mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("auto");
  const [isInitialized, setIsInitialized] = useState(false);

  // Determine if dark mode should be active
  const isDark =
    themeMode === "dark" ||
    (themeMode === "auto" && systemColorScheme === "dark");

  const colors = isDark ? darkColors : lightColors;

  const theme: Theme = {
    colors,
    mode: themeMode,
    isDark,
  };

  // Load theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "auto")) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadTheme();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newMode = isDark ? "light" : "dark";
    await setThemeMode(newMode);
  };

  // Don't render until theme is loaded to avoid flash
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode, toggleTheme }}>
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
