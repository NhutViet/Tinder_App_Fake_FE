import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";

export default function ProfileScreen() {
  const { theme, toggleTheme, setThemeMode } = useTheme();

  const dynamicStyles = {
    container: { backgroundColor: theme.colors.background },
    content: { backgroundColor: theme.colors.background },
    title: { color: theme.colors.text },
    subtitle: { color: theme.colors.textSecondary },
    settingItem: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    settingText: { color: theme.colors.text },
    settingDescription: { color: theme.colors.textSecondary },
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, dynamicStyles.title]}>Profile</Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
            Your account settings
          </Text>
        </View>

        <View style={styles.settingsContainer}>
          {/* Theme Toggle */}
          <View style={[styles.settingItem, dynamicStyles.settingItem]}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={theme.isDark ? "moon" : "sunny"}
                size={24}
                color={theme.colors.primary}
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingText, dynamicStyles.settingText]}>
                  {theme.isDark ? "Dark Mode" : "Light Mode"}
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    dynamicStyles.settingDescription,
                  ]}
                >
                  {theme.mode === "auto"
                    ? "Theo hệ thống"
                    : theme.isDark
                    ? "Chế độ tối"
                    : "Chế độ sáng"}
                </Text>
              </View>
            </View>
            <Switch
              value={theme.isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primaryLight,
              }}
              thumbColor={theme.isDark ? theme.colors.primary : "#f4f3f4"}
            />
          </View>

          {/* Theme Mode Selection */}
          <View style={styles.themeModeContainer}>
            <TouchableOpacity
              style={[
                styles.themeModeButton,
                theme.mode === "light" && [
                  styles.themeModeButtonActive,
                  { backgroundColor: theme.colors.primary },
                ],
                { borderColor: theme.colors.border },
              ]}
              onPress={() => setThemeMode("light")}
            >
              <Ionicons
                name="sunny"
                size={20}
                color={
                  theme.mode === "light"
                    ? "#fff"
                    : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.themeModeText,
                  {
                    color:
                      theme.mode === "light"
                        ? "#fff"
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                Sáng
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeModeButton,
                theme.mode === "dark" && [
                  styles.themeModeButtonActive,
                  { backgroundColor: theme.colors.primary },
                ],
                { borderColor: theme.colors.border },
              ]}
              onPress={() => setThemeMode("dark")}
            >
              <Ionicons
                name="moon"
                size={20}
                color={
                  theme.mode === "dark" ? "#fff" : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.themeModeText,
                  {
                    color:
                      theme.mode === "dark" ? "#fff" : theme.colors.textSecondary,
                  },
                ]}
              >
                Tối
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeModeButton,
                theme.mode === "auto" && [
                  styles.themeModeButtonActive,
                  { backgroundColor: theme.colors.primary },
                ],
                { borderColor: theme.colors.border },
              ]}
              onPress={() => setThemeMode("auto")}
            >
              <Ionicons
                name="phone-portrait"
                size={20}
                color={
                  theme.mode === "auto" ? "#fff" : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.themeModeText,
                  {
                    color:
                      theme.mode === "auto" ? "#fff" : theme.colors.textSecondary,
                  },
                ]}
              >
                Tự động
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  settingsContainer: {
    gap: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  themeModeContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  themeModeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  themeModeButtonActive: {
    borderWidth: 0,
  },
  themeModeText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
