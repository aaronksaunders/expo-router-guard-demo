import { router } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";

/**
 * Admin home screen component for authenticated admin users.
 * @returns {JSX.Element}
 */
export default function AdminHome() {
  const { user, clearUser } = useAuth();

  const handleSignOut = async () => {
    await clearUser();
    router.replace("/(auth)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Home</Text>
      <Text style={styles.subtitle}>Only visible to ADMIN users</Text>
      
      {user && (
        <Text style={styles.userEmail}>Signed in as: {user.email}</Text>
      )}
      
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
