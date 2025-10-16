import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { ConvexProvider } from "convex/react";
import { convexClient } from "../config/convex";
import { useAuth } from "../hooks/useAuth";

/**
 * Suspense component shown while loading authentication state.
 * @returns {JSX.Element}
 */
function ScreenSuspense() {
  console.log("loading...");
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

/**
 * Main app layout that controls route protection and navigation.
 * @returns {JSX.Element}
 */
function AppLayout() {
  console.log("rendering layout...");
  const { user, loading } = useAuth();
  if (loading) return <ScreenSuspense />;

  console.log("user:", user);
  console.log("allowed:", !!user);

  return (
    <Stack>
      {/* admin app screens  */}
      <Stack.Protected guard={user !== null && user.role === "admin"}>
        <Stack.Screen name="(app)/admin" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* app screens  */}
      <Stack.Protected guard={user !== null && user.role !== "admin"}>
        <Stack.Screen name="(app)/index" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* auth screens  */}
      <Stack.Protected guard={user === null}>
        <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* about screen visible to all users  */}
      <Stack.Screen name="(app)/about" options={{ headerShown: false }} />
    </Stack>
  );
}

/**
 * Root layout entry point for Expo Router.
 * @returns {JSX.Element}
 */
export default function RootLayout() {
  return (
    <ConvexProvider client={convexClient}>
      <AppLayout />
    </ConvexProvider>
  );
}
