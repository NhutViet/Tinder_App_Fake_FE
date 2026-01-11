import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";

export default function ProfileScreen() {
  const { theme } = useTheme();

  const dynamicStyles = {
    container: { backgroundColor: theme.colors.background },
    content: { backgroundColor: theme.colors.background },
    title: { color: theme.colors.text },
    subtitle: { color: theme.colors.textSecondary },
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
});
