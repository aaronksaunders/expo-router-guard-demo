import { router } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";

/**
 * Home screen component for authenticated users.
 * @returns {JSX.Element}
 */
export default function Home() {
  const { user, clearUser } = useAuth();

  const handleSignOut = async () => {
    await clearUser();
    router.replace("/(auth)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Only visible to signed-in users</Text>
      
      {user && (
        <Text style={styles.userEmail}>Signed in as: {user.email}</Text>
      )}
      
      <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => router.push("/(app)/about")}
      >
        <Text style={styles.aboutButtonText}>Go to About</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  userEmail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 30,
  },
  aboutButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginBottom: 15,
  },
  aboutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
