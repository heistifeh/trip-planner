import { Item } from "@/types";
import { StyleSheet, Text, View } from "react-native";

export default function Todos({ todos }: { todos: Item[] }) {
  return (
    <>
      <View style={styles.container}>
        {todos.map((todo) => (
          <View key={todo.id}>
            <Text style={styles.text}>{todo.title}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 40,
  },
  text: {
    color: "#4f6a1f",
    fontSize: 24,
    fontWeight: "bold",
  },
});
