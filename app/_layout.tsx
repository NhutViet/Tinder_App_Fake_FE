import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "../contexts/ThemeContext";
import { store } from "../store";

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
