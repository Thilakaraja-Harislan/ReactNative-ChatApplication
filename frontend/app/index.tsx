import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Index() {
  const { isAuthenticated } = useAuth();

if (isAuthenticated) {
  return <Redirect href="/users" />;
}

  return (
     <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark"/>

      <ScrollView
         contentContainerStyle={styles.scrollContent}
         showsVerticalScrollIndicator={false}
         bounces={false}
      >
        <View style={styles.topSection}>
          {/* Main Illustration */}
          <View style={styles.illustrationWrapper}>
            <Image
              source={require("@/assets/images/chat-illustration.png")}
              style={styles.illustration}
              contentFit="contain"
              accessibilityLabel="ChatConnect Messaging Illustration"
            />
          </View>

          {/* App Title & Subtitle */}
          <View style={styles.headerTextWrapper}>
            <Text style={styles.brandTitle}>
              Chat<Text style={styles.brandTitleHighlight}>Connect</Text>
            </Text>

            <Text style={styles.subtitle}>
              Connect easily with your family{"\n"}and friends over countries
            </Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          {/* Primary Action: Login */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
            onPress={() => router.push("/login")}
            accessibilityRole="button"
            accessibilityLabel="Login"
          >
            <Text style={styles.primaryButtonText}>Login</Text>
            <View style={styles.buttonIconWrapper}>
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </View>
          </Pressable>

          {/* Secondary Action: Create an Account */}
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={() => router.push("/register")}
            accessibilityRole="button"
            accessibilityLabel="Create an Account"
          >
            <Text style={styles.secondaryButtonText}>Create an Account</Text>
            <View style={styles.buttonIconWrapper}>
              <Feather name="arrow-right" size={20} color="#0C4EF6" />
            </View>
          </Pressable>

          {/* Footer Terms & Privacy Policy */}
          <View style={styles.footerWrapper}>
            <Text style={styles.footerNotice}>
              By continuing, you agree to our
            </Text>
            <Pressable
              onPress={() => {
                // Navigate or open Terms & Privacy Policy
              }}
              style={({ pressed }) => [pressed && styles.linkPressed]}
              accessibilityRole="link"
            >
              <Text style={styles.footerLink}>Terms & Privacy Policy</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    marginTop: 10,
    marginBottom: 16,
  },
  illustration: {
    width: "100%",
    maxWidth: 390,
    aspectRatio: 462 / 350,
    maxHeight: SCREEN_HEIGHT * 0.42,
  },
  headerTextWrapper: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#0B1220",
    letterSpacing: -0.4,
    textAlign: "center",
    marginBottom: 12,
  },
  brandTitleHighlight: {
    color: "#0C4EF6",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    color: "#53627A",
    textAlign: "center",
    maxWidth: 320,
  },
  bottomSection: {
    width: "100%",
    marginTop: 32,
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
    marginBottom: 16,
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
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#0C4EF6",
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    position: "relative",
    marginBottom: 28,
  },
  secondaryButtonPressed: {
    backgroundColor: "#F4F7FE",
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  secondaryButtonText: {
    color: "#0C4EF6",
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
  linkPressed: {
    opacity: 0.7,
  },
});