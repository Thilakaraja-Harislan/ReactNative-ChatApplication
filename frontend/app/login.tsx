import API_BASE_URL from "@/services/api";
import { renderGoogleButton } from "@/services/googleAuth.web";
import Feather from "@expo/vector-icons/Feather";
import { yupResolver } from "@hookform/resolvers/yup";

import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useAuth } from "@/hooks/useAuth";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type LoginFormData = {
  email: string;
  password: string;
};

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email address is required"),

  password: yup.string().required("Password is required"),
});

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

if (!GOOGLE_WEB_CLIENT_ID) {
  console.warn("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not configured");
}



export default function LoginScreen() {
  const { login, isAuthenticated } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setLoginError("");
      const cleanedData = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(result.message || "Invalid email or password");
        return;
      }

      console.log("Login successful:", result);

      // We will improve AuthContext to store the JWT in the next step.
      await login(result.user, result.token);

      router.replace("/users");
    } catch (error) {
      console.error("Login request error:", error);
      setLoginError("Unable to login. Please try again.");
    }
  };

const handleGoogleLogin = async () => {
  setLoginError(
    "Google Sign-In requires a development build. Please use email and password in Expo Go."
  );
};

const handleGoogleWebLogin = async (idToken: string) => {
  try {
    setLoginError("");
    setGoogleLoading(true);

    const apiResponse = await fetch(
      `${API_BASE_URL}/auth/google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      }
    );

    const result = await apiResponse.json();

    if (!apiResponse.ok) {
      setLoginError(
        result.message || "Google authentication failed"
      );
      return;
    }

    await login(result.user, result.token);

    router.replace("/users");
  } catch (error: unknown) {
    console.error("Google Web Sign-In error:", error);

    setLoginError(
      error instanceof Error
        ? error.message
        : "Unable to sign in with Google."
    );
  } finally {
    setGoogleLoading(false);
  }
};

useEffect(() => {
  if (Platform.OS !== "web") {
    return;
  }

  if (!googleButtonRef.current) {
    return;
  }

  renderGoogleButton(
    googleButtonRef.current,
    handleGoogleWebLogin
  ).catch((error) => {
    console.error("Google button error:", error);

    setLoginError(
      error instanceof Error
        ? error.message
        : "Unable to load Google Sign-In."
    );
  });
}, []);

  if (isAuthenticated) {
    return <Redirect href="/users" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Top Section: Illustration & Brand Title */}
          <View style={styles.topSection}>
            <View style={styles.illustrationWrapper}>
              <Image
                source={require("@/assets/images/chat-illustration.png")}
                style={styles.illustration}
                contentFit="contain"
                accessibilityLabel="ChatConnect Messaging Illustration"
              />
            </View>

            <Text style={styles.brandTitle}>
              Chat<Text style={styles.brandTitleHighlight}>Connect</Text>
            </Text>
          </View>

          {/* Form Fields Section */}
          <View style={styles.formSection}>
            {/* Email Address Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View
                    style={[
                      styles.inputContainer,
                      errors.email && styles.inputError,
                    ]}
                  >
                    <Feather
                      name="mail"
                      size={20}
                      color="#5C6988"
                      style={styles.inputIcon}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Email Address"
                      placeholderTextColor="#7B88A4"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                    />
                  </View>

                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </>
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View
                    style={[
                      styles.inputContainer,
                      errors.password && styles.inputError,
                    ]}
                  >
                    <Feather
                      name="lock"
                      size={20}
                      color="#5C6988"
                      style={styles.inputIcon}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#7B88A4"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(handleLogin)}
                    />

                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      hitSlop={10}
                      style={styles.eyeIconWrapper}
                      accessibilityRole="button"
                      accessibilityLabel={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <Feather
                        name={showPassword ? "eye" : "eye-off"}
                        size={20}
                        color="#5C6988"
                      />
                    </Pressable>
                  </View>

                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  )}
                </>
              )}
            />

            {loginError ? (
              <Text style={styles.loginErrorText}>{loginError}</Text>
            ) : null}

            {/* Submit Button: Login */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={handleSubmit(handleLogin)}
              accessibilityRole="button"
              accessibilityLabel="Login"
            >
              <Text style={styles.primaryButtonText}>Login</Text>
              <View style={styles.buttonIconWrapper}>
                <Feather name="arrow-right" size={20} color="#FFFFFF" />
              </View>
            </Pressable>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />

              <Text style={styles.dividerText}>OR</Text>

              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign-In Button */}
{Platform.OS === "web" ? (
  <div
    style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      zIndex: 9999,
      pointerEvents: "auto",
    }}
  >
    <div
      ref={googleButtonRef}
      style={{
        width: "300px",
        height: "44px",
        position: "relative",
        zIndex: 10000,
        pointerEvents: "auto",
      }}
    />
  </div>
) : (
  <Pressable
    style={({ pressed }) => [
      styles.googleButton,
      pressed && styles.googleButtonPressed,
      googleLoading && styles.googleButtonDisabled,
    ]}
    onPress={handleGoogleLogin}
    disabled={googleLoading}
    accessibilityRole="button"
    accessibilityLabel="Continue with Google"
  >
    <Text style={styles.googleIcon}>G</Text>

    <Text style={styles.googleButtonText}>
      {googleLoading ? "Signing in..." : "Continue with Google"}
    </Text>
  </Pressable>
)}

            {/* Don't have an account? Register */}
            <View style={styles.registerRow}>
              <Text style={styles.dontHaveText}>Don't have an account? </Text>
              <Pressable
                onPress={() => router.push("/register")}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Register"
              >
                <Text style={styles.registerLink}>Register</Text>
              </Pressable>
            </View>

            {/* Terms & Privacy Notice */}
            <View style={styles.footerWrapper}>
              <Text style={styles.footerNotice}>
                By continuing, you agree to our
              </Text>
              <Pressable
                onPress={() => {
                  // Terms and privacy policy handler
                }}
                hitSlop={6}
                accessibilityRole="link"
              >
                <Text style={styles.footerLink}>Terms & Privacy Policy</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  topSection: {
    alignItems: "center",
    width: "100%",
  },
  illustrationWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  illustration: {
    width: "100%",
    maxWidth: 380,
    aspectRatio: 462 / 350,
    maxHeight: SCREEN_HEIGHT * 0.36,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#0B1220",
    letterSpacing: -0.4,
    textAlign: "center",
    marginBottom: 24,
  },
  brandTitleHighlight: {
    color: "#0C4EF6",
  },
  formSection: {
    width: "100%",
  },
  inputContainer: {
    backgroundColor: "#EFF4FB",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    fontWeight: "400",
    color: "#0B1220",
  },
  eyeIconWrapper: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#0C4EF6",
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    position: "relative",
    marginTop: 14,
    marginBottom: 22,
    shadowColor: "#0C4EF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonIconWrapper: {
    position: "absolute",
    right: 24,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 10,
  },
  dontHaveText: {
    fontSize: 14,
    color: "#667085",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0C4EF6",
  },
  footerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    paddingBottom: 4,
  },
  footerNotice: {
    fontSize: 13,
    color: "#667085",
    textAlign: "center",
    marginBottom: 4,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0C4EF6",
    textAlign: "center",
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 4,
  },
  loginErrorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  dividerText: {
    marginHorizontal: 14,
    color: "#7B88A4",
    fontSize: 12,
    fontWeight: "500",
  },

  googleButton: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#D8DEE9",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 22,
  },

  googleButtonPressed: {
    backgroundColor: "#F8FAFC",
    transform: [{ scale: 0.99 }],
  },

  googleButtonDisabled: {
    opacity: 0.6,
  },

  googleIcon: {
    position: "absolute",
    left: 24,
    fontSize: 20,
    fontWeight: "700",
    color: "#4285F4",
  },

  googleButtonText: {
    color: "#0B1220",
    fontSize: 16,
    fontWeight: "600",
  },
});
