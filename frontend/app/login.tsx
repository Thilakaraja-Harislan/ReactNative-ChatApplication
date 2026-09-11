import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Frontend navigation placeholder ready for backend integration
    router.push("/users");
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
            <View style={styles.inputContainer}>
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
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
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
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
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

            {/* Submit Button: Login */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={handleLogin}
              accessibilityRole="button"
              accessibilityLabel="Login"
            >
              <Text style={styles.primaryButtonText}>Login</Text>
              <View style={styles.buttonIconWrapper}>
                <Feather name="arrow-right" size={20} color="#FFFFFF" />
              </View>
            </Pressable>

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
});