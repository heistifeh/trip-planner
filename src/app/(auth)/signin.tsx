import { supabase } from "@/lib/supabase";
import { FormData } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) Alert.alert(error.message);
    } catch (e) {
      Alert.alert(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: "email" | "password") => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  return (
    <View style={styles.container}>
      <Text>Sign in Page</Text>
      <View style={styles.divider}></View>

      <TextInput
        style={styles.input}
        placeholder="email"
        onChangeText={handleChange("email")}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        onChangeText={handleChange("password")}
        secureTextEntry
      />

      <View style={styles.divider}></View>
      <Pressable onPress={handleSignIn} disabled={loading}>
        <Text> Sign in</Text>
      </Pressable>
      <Pressable onPress={() => router.replace("/(auth)/signup")}>
        <Text> Sign Up Instead</Text>
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
