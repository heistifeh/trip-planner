import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignUp() {
  return (
    <View style={styles.container}>
      <Text>Sign Up Page</Text>
      <View style={styles.divider}></View>

      <TextInput style={styles.input} placeholder="email" />
      <TextInput style={styles.input} placeholder="password" />

      <View style={styles.divider}></View>
      <Pressable>
        <Text> Sign Up</Text>
      </Pressable>
      <Pressable>
        <Text> Sign Up</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  divider: {
    marginTop: 22,
  },
});
