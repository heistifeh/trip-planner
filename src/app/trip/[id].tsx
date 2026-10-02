import Cost from "@/components/cost";
import Places from "@/components/places";
import Todos from "@/components/todo";
import fetchTripItems from "@/lib/tripItems";
import { fetchTrip } from "@/lib/trips";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function TripBoard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState("places");

  const { data, isPending, error } = useQuery({
    queryKey: ["trips", id],
    queryFn: () => fetchTrip(id),
  });

  const {
    data: tripItems,
    isPending: isPendingItems,
    error: errorItems,
  } = useQuery({
    queryKey: ["trips", id, "items"],
    queryFn: () => fetchTripItems(id),
  });

  // console.log(places);

  if (isPending || isPendingItems) return <Text>Loading....</Text>;

  if (errorItems)
    return <Text>Something isn't quite right....{errorItems.message}</Text>;

  if (error)
    return <Text>Something isn't quite right....{error?.message}</Text>;
  const places = tripItems?.filter((item) => item.type === "place");
  const costs = tripItems?.filter((item) => item.type === "cost");
  const todos = tripItems?.filter((item) => item.type === "todo");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.name}</Text>
      <Text>
        {data.start_date} - {data.end_date}
      </Text>

      <View style={styles.tabs}>
        <Pressable onPress={() => setTab("places")}>
          <Text>PLACES</Text>
        </Pressable>
        <Pressable onPress={() => setTab("cost")}>
          <Text>COST</Text>
        </Pressable>
        <Pressable onPress={() => setTab("todos")}>
          <Text>TO-DOs</Text>
        </Pressable>
      </View>

      {tab == "places" && <Places places={places} />}
      {tab == "cost" && <Cost costs={costs} />}
      {tab == "todos" && <Todos todos={todos} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
  },
});
