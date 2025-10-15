import { View, Text, Button } from "react-native";
import { router, Stack } from "expo-router";
import { useState } from "react";

export default function Login() {
  console.log("rendering login...");
  const [loading, setLoading] = useState(false);
  return (
    <>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Login</Text>
        <Button
          title={loading ? "Signing in..." : "Sign in"}
          onPress={async () => {
            setLoading(true);
            // pretend to sign in, then go to home
            setTimeout(() => {
              router.replace("/(app)");
            }, 600);
          }}
        />
      </View>
    </>
  );
}
