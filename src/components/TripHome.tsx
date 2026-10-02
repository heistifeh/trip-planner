import { fetchTrips } from "@/lib/trips";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function TripHome() {
  const { data, isPending, error } = useQuery({
    queryKey: ["trips"],
    queryFn: fetchTrips,
  });

  if (isPending) return <Text>Loading...</Text>;
  if (error) return <Text>Something went wrong...{error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Trip Home Page</Text>
      {data.map((trip) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/trip/[id]",
              params: { id: trip.id },
            })
          }
          key={trip.id}
          style={styles.card}
        >
          <Text style={styles.title}>{trip.name}</Text>
          <Text>{trip.start_date}</Text>
          <Text>{trip.end_date}</Text>
          {/* <Text>{trip.members.join(", ")}</Text>
          <Text>{trip.places} places</Text>
          <Text>₦{trip.price.toLocaleString()}</Text>
          <Text>{trip.todo} todos</Text> */}
        </Pressable>
      ))}

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>New trip</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Join with invite code</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    gap: 10,
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: "#2B6058",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#F4F2EC",
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "700",
  },
});
