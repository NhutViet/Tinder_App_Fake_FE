import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearError, loginAsync } from "../../store/slices/authSlice";

const REMEMBER_EMAIL_KEY = "remembered_email";
const REMEMBER_PASSWORD_KEY = "remembered_password";

export default function LoginScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Load remembered credentials on mount
  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const rememberedEmail = await AsyncStorage.getItem(REMEMBER_EMAIL_KEY);
        const rememberedPassword = await AsyncStorage.getItem(REMEMBER_PASSWORD_KEY);
        
        if (rememberedEmail && rememberedPassword) {
          setEmail(rememberedEmail);
          setPassword(rememberedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error loading remembered credentials:", error);
      }
    };

    loadRememberedCredentials();
  }, []);

  // Navigate to tabs or interest screen when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if user has interests set
      if (user?.interests && user.interests.length > 0) {
        router.replace("/(tabs)");
      } else {
        router.replace("/interest");
      }
    }
  }, [isAuthenticated, user, router]);

  // Show error alert when there's an error
  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi đăng nhập", error, [
        {
          text: "OK",
          onPress: () => dispatch(clearError()),
        },
      ]);
    }
  }, [error, dispatch]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Dispatch login action
    const result = await dispatch(
      loginAsync({
        email: email.trim(),
        password: password.trim(),
      })
    );

    // Save credentials if remember me is checked and login successful
    if (rememberMe && loginAsync.fulfilled.match(result)) {
      try {
        await AsyncStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
        await AsyncStorage.setItem(REMEMBER_PASSWORD_KEY, password.trim());
      } catch (error) {
        console.error("Error saving remembered credentials:", error);
      }
    } else if (!rememberMe) {
      // Clear saved credentials if remember me is unchecked
      try {
        await AsyncStorage.removeItem(REMEMBER_EMAIL_KEY);
        await AsyncStorage.removeItem(REMEMBER_PASSWORD_KEY);
      } catch (error) {
        console.error("Error clearing remembered credentials:", error);
      }
    }
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
              <Image source={require("../../assets/images/logo.png")} style={styles.logoContainer} />                  
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={theme.colors.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Email"
                placeholderTextColor={theme.colors.inputPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
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

            {/* Remember Me Checkbox */}
            <View style={styles.rememberMeContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[
                  styles.checkbox,
                  rememberMe && { backgroundColor: theme.colors.primary },
                  !rememberMe && { borderColor: theme.colors.border, borderWidth: 2 }
                ]}>
                  {rememberMe && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={[styles.rememberMeText, { color: theme.colors.textSecondary }]}>
                  Nhớ tài khoản
                </Text>
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, dynamicStyles.forgotPasswordText]}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                dynamicStyles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.loginButtonText, dynamicStyles.loginButtonText]}>
                  Đăng nhập
                </Text>
              )}
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
  },
  logoContainer: {
    width: 200,
    height: 200,
    borderRadius: 50,
    alignItems: "center",  
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
  rememberMeContainer: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberMeText: {
    fontSize: 14,
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
  loginButtonDisabled: {
    opacity: 0.6,
  },
});
