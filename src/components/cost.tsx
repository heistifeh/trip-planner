import { Item } from "@/types";
import { StyleSheet, Text, View } from "react-native";

export default function Cost({ costs }: { costs: Item[] }) {
  return (
    <>
      <View style={styles.container}>
        {costs.map((cost) => (
          <View key={cost.id}>
            <Text style={styles.text}>{cost.title}</Text>
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
