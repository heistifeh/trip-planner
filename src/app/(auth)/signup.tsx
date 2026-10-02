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

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) Alert.alert(error.message);
      else if (!session) {
        Alert.alert("Please check your inbox for email verification!");
        router.push({ pathname: "/otp", params: { email: formData.email } });
      }
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
      <Text>Sign Up Page</Text>
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
      <Pressable onPress={handleSignUp} disabled={loading}>
        <Text> Sign Up</Text>
      </Pressable>
      <Pressable onPress={() => router.replace("/(auth)/signin")}>
        <Text> Back to Sign In</Text>
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
