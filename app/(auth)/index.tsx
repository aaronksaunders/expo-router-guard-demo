import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../../hooks/useAuth";

/**
 * Login screen component for unauthenticated users.
 * @returns {JSX.Element}
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { setUser } = useAuth();
  const signIn = useMutation(api.auth.signIn);
  const signUp = useMutation(api.auth.signUp);

  const generateTokenIdentifier = () => {
    return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const tokenIdentifier = generateTokenIdentifier();
        const userId = await signUp({ email, password, tokenIdentifier });
        await setUser({
          id: userId,
          email,
          role: "user",
          tokenIdentifier,
        });
      } else {
        const user = await signIn({ email, password });
        await setUser({
          id: user.id,
          email: user.email,
          role: user.role,
          tokenIdentifier: user.tokenIdentifier,
        });
      }
      router.replace("/(app)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAuth}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text style={styles.switchText}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => router.push("/(app)/about")}
      >
        <Text style={styles.aboutText}>Go to About</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: "#007AFF",
    fontSize: 14,
  },
  aboutButton: {
    marginTop: 20,
  },
  aboutText: {
    color: "#666",
    fontSize: 14,
  },
});
