import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { store } from "../store";

function RootLayoutNav() {
  const { theme } = useTheme();
  
  return (
    <>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </Provider>
  );
}
