import { Item } from "@/types";
import { StyleSheet, Text, View } from "react-native";
export default function Places({ places }: { places: Item[] }) {
  return (
    <>
      <View style={styles.container}>
        {places?.map((place) => (
          <View key={place.id}>
            <Text style={styles.text}>{place.title}</Text>
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
