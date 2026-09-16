import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import API_BASE_URL from "@/services/api";
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

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const registerSchema = yup.object({
name: yup
  .string()
  .trim()
  .min(3, "Full name must be at least 3 characters")
  .matches(/^[A-Za-z\s]+$/, "Full name can only contain letters and spaces")
  .required("Full name is required"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email address is required"),

password: yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  )
  .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),

    mode: "onTouched",
    reValidateMode: "onChange",

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleRegister = async (data: RegisterFormData) => {
  const cleanedData = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
  };

  try {
    setRegisterError("");
    setIsSubmitting(true);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedData),
    });

    const result = await response.json();

    if (!response.ok) {
      setRegisterError(
        result.message || "Registration failed. Please try again."
      );
      return;
    }

    console.log("Registration successful:", result);

    router.replace("/login");
  } catch (error) {
    console.error("Registration error:", error);

    setRegisterError(
      "Unable to connect to the server. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

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
                accessibilityLabel="ChatConnect People Messaging Illustration"
              />
            </View>

            <Text style={styles.brandTitle}>
              Chat<Text style={styles.brandTitleHighlight}>Connect</Text>
            </Text>
          </View>

          {/* Form Fields Section */}
          <View style={styles.formSection}>
            {/* Full Name Input */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View
                    style={[
                      styles.inputContainer,
                      errors.name && styles.inputError,
                    ]}
                  >
                    <Feather
                      name="user"
                      size={20}
                      color="#5C6988"
                      style={styles.inputIcon}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#7B88A4"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  </View>

                  {errors.name && (
                    <Text style={styles.errorText}>
                      {errors.name.message}
                    </Text>
                  )}
                </>
              )}
            />

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
                    <Text style={styles.errorText}>
                      {errors.email.message}
                    </Text>
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
                      returnKeyType="next"
                    />

                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      hitSlop={10}
                      style={styles.eyeIconWrapper}
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? "Hide password" : "Show password"}
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

            {/* Confirm Password Input */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <View
                   style={[
                     styles.inputContainer,
                     errors.confirmPassword && styles.inputError,
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
                      placeholder="Confirm Password"
                      placeholderTextColor="#7B88A4"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      returnKeyType="done"
                    />

                    <Pressable
                      onPress={() => setShowConfirmPassword((prev) => !prev)}
                      hitSlop={10}
                      style={styles.eyeIconWrapper}
                      accessibilityRole="button"
                      accessibilityLabel={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      <Feather
                        name={showConfirmPassword ? "eye" : "eye-off"}
                        size={20}
                        color="#5C6988"
                      />
                    </Pressable>
                  </View>

                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </>
              )}
            />

            {registerError ? (
              <Text style={styles.registerErrorText}>
                 {registerError}
              </Text>
            ) : null}

           {/* Submit Button: Create an Account */}
           <Pressable
               style={({ pressed }) => [
               styles.primaryButton,
               pressed && styles.primaryButtonPressed,
               isSubmitting && { opacity: 0.6 },
              ]}
             onPress={handleSubmit(handleRegister)}
             disabled={isSubmitting}
             accessibilityRole="button"
             accessibilityLabel="Create an Account"
            >
            <Text style={styles.primaryButtonText}>
                {isSubmitting ? "Creating Account..." : "Create an Account"}
            </Text>

             {!isSubmitting && (
            <View style={styles.buttonIconWrapper}>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </View>
             )}
            </Pressable>

            {/* Already have an account? Login */}
            <View style={styles.loginRow}>
              <Text style={styles.alreadyText}>Already have an account? </Text>
              <Pressable
                onPress={() => router.push("/login")}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Login"
              >
                <Text style={styles.loginLink}>Login</Text>
              </Pressable>
            </View>

            {/* Terms & Privacy Notice */}
            <View style={styles.footerWrapper}>
              <Text style={styles.footerNotice}>
                By creating an account, you agree to our
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
    paddingTop: 4,
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
    marginTop: 4,
    marginBottom: 8,
  },
  illustration: {
    width: "100%",
    maxWidth: 360,
    aspectRatio: 462 / 350,
    maxHeight: SCREEN_HEIGHT * 0.3,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0B1220",
    letterSpacing: -0.4,
    textAlign: "center",
    marginBottom: 20,
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
  inputError: {
  borderWidth: 1,
  borderColor: "#EF4444",
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
    marginTop: 10,
    marginBottom: 20,
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
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  alreadyText: {
    fontSize: 14,
    color: "#667085",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0C4EF6",
  },
  footerWrapper: {
    alignItems: "center",
    justifyContent: "center",
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
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 4,
  },
  registerErrorText: {
  color: "#EF4444",
  fontSize: 13,
  textAlign: "center",
  marginBottom: 8,
},
});