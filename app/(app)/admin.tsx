import { View, Text, Button, StyleSheet } from "react-native";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../hooks/useAuth";

/**
 * Admin dashboard component for admin users only.
 * @returns {JSX.Element}
 */
export default function AdminHome() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Home</Text>
      <Text style={styles.subtitle}>Only visible to ADMIN users</Text>
      {user && (
        <Text style={styles.userInfo}>
          Logged in as: {user.email || "No email"}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={handleSignOut} color="#ff3b30" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
});
