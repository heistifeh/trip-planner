import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function Otp() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });
      if (error) Alert.alert(error.message);
    } catch (e) {
      Alert.alert(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        onChangeText={setOtp}
        placeholder="otp"
        value={otp}
        keyboardType="number-pad"
      />

      <Pressable onPress={handleVerifyOtp} disabled={loading}>
        <Text>Confirm OTP</Text>
      </Pressable>
    </View>
  );
}
