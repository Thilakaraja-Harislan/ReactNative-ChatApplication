import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Screen</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text>Back to Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  button: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
});