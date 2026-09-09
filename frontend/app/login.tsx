import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.buttonText}>Go to Register</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/users")}
      >
        <Text style={styles.buttonText}>Temporary Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },

  buttonText: {
    fontSize: 16,
  },
});