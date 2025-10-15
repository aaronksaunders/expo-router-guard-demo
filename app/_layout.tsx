import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "../App";
// If your version exposes Stack.Protected, use it:
// const ProtectedStack: any = (Stack as any).Protected ?? React.Fragment;

// Fake auth hook for demo
/**
 * Custom hook to simulate authentication state.
 * Replace with your real authentication logic.
 * @returns {{ user: null | { name: string }, loading: boolean }}
 */
function useAuth() {
  // replace with your real auth logic
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<null | { name: string }>(null); // change to {} to simulate signed-in

  // wait a bit to simulate loading, then return a user
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setUser({ name: "Demo" });
      // setUser(null);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  return { user, loading };
}

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
      <Stack.Protected guard={user !== null}>
        <Stack.Screen name="(app)/index" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={user === null}>
        <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

/**
 * Root layout entry point for Expo Router.
 * @returns {JSX.Element}
 */
export default function RootLayout() {
  return <AppLayout />;
}
