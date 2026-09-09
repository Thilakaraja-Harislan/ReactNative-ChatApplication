import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function UsersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users Screen</Text>

    <Pressable
       style={styles.button}
       onPress={() =>
            router.push({
            pathname: "/chat/[id]",
            params: { id: "1" },
          })
        }
     >
        <Text>Open Chat with User 1</Text>
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