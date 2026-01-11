import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutAsync } from "../../store/slices/authSlice";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    router.replace("/login");
  };

  const dynamicStyles = {
    container: { backgroundColor: theme.colors.background },
    content: { backgroundColor: theme.colors.background },
    title: { color: theme.colors.text },
    subtitle: { color: theme.colors.textSecondary },
    logoutButton: { backgroundColor: theme.colors.error },
    logoutButtonText: { color: "#fff" },
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

        {user && (
          <View style={styles.userInfo}>
            <Text style={[styles.userEmail, { color: theme.colors.text }]}>
              {user.email}
            </Text>
            {user.name && (
              <Text style={[styles.userName, { color: theme.colors.textSecondary }]}>
                {user.name}
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.logoutButton,
            dynamicStyles.logoutButton,
            loading && styles.logoutButtonDisabled,
          ]}
          onPress={handleLogout}
          disabled={loading}
        >
          <Text style={[styles.logoutButtonText, dynamicStyles.logoutButtonText]}>
            {loading ? "Đang đăng xuất..." : "Đăng xuất"}
          </Text>
        </TouchableOpacity>
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
  userInfo: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(181, 184, 212, 0.2)",
  },
  userEmail: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
  },
  logoutButton: {
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
});
