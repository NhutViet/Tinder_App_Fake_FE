import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";

export default function LoginScreen() {
  const { theme } = useTheme();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Navigate to tabs home
    router.replace("/(tabs)");
  };

  const dynamicStyles = {
    container: { backgroundColor: theme.colors.background },
    content: { backgroundColor: theme.colors.background },
    logoContainer: { backgroundColor: theme.colors.primaryLight },
    title: { color: theme.colors.primary },
    subtitle: { color: theme.colors.textSecondary },
    inputContainer: { backgroundColor: theme.colors.inputBackground },
    input: { color: theme.colors.inputText },
    inputIcon: { color: theme.colors.icon },
    eyeIcon: { color: theme.colors.icon },
    forgotPasswordText: { color: theme.colors.primary },
    loginButton: { 
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
    },
    loginButtonText: { color: "#fff" },
    dividerLine: { backgroundColor: theme.colors.divider },
    dividerText: { color: theme.colors.textSecondary },
    socialButton: { 
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border 
    },
    signUpText: { color: theme.colors.textSecondary },
    signUpLink: { color: theme.colors.primary },
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <Pressable
          style={styles.keyboardView}
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <View style={[styles.content, dynamicStyles.content]}>
          {/* Logo/Title Section */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, dynamicStyles.logoContainer]}>
              <Ionicons name="storefront" size={60} color={theme.colors.primary} />
            </View>
            <Text style={[styles.title, dynamicStyles.title]}>Shoppe</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>Đăng nhập để tiếp tục</Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {/* Phone Input */}
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Ionicons
                name="call-outline"
                size={20}
                color={theme.colors.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Số điện thoại"
                placeholderTextColor={theme.colors.inputPlaceholder}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.colors.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Mật khẩu"
                placeholderTextColor={theme.colors.inputPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={theme.colors.icon}
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, dynamicStyles.forgotPasswordText]}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={[styles.loginButton, dynamicStyles.loginButton]} onPress={handleLogin}>
              <Text style={[styles.loginButtonText, dynamicStyles.loginButtonText]}>Đăng nhập</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, dynamicStyles.dividerLine]} />
              <Text style={[styles.dividerText, dynamicStyles.dividerText]}>HOẶC</Text>
              <View style={[styles.dividerLine, dynamicStyles.dividerLine]} />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={[styles.socialButton, dynamicStyles.socialButton]}>
                <Ionicons name="logo-facebook" size={24} color="#1877f2" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, dynamicStyles.socialButton]}>
                <Ionicons name="logo-google" size={24} color="#db4437" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, dynamicStyles.socialButton]}>
                <Ionicons name="logo-apple" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpText, dynamicStyles.signUpText]}>Bạn chưa có tài khoản? </Text>
              <TouchableOpacity>
                <Text style={[styles.signUpLink, dynamicStyles.signUpLink]}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff5f3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
