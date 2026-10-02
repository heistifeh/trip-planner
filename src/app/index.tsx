import TripHome from "@/components/TripHome";
import { supabase } from "@/lib/supabase";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }
  return (
    <View style={styles.container}>
      {/* <Text>Trip Planner</Text>
      <Text>YOU ARE SEEING THIS BECAUSE YOU ARE LOGGED IN</Text> */}

      <TripHome />
      <Pressable onPress={signOut}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    color: "#f43432",
  },
});
