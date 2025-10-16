/**
 * Authentication hook module for Convex.
 * 
 * Provides a React hook for managing Convex authentication state
 * and user roles throughout the application with automatic reactivity.
 * 
 * @module hooks/useAuth
 */

import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * User role type definition.
 * @typedef {"user" | "admin"} UserRole
 */
export type UserRole = "user" | "admin";

/**
 * Authenticated user object with role information.
 * 
 * @interface AuthUser
 * @property {string} id - User's unique identifier
 * @property {string} email - User's email address
 * @property {UserRole} role - User's role ("user" or "admin")
 * @property {string} tokenIdentifier - Session token identifier
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  tokenIdentifier: string;
}

const USER_STORAGE_KEY = "@convex_user";
const TOKEN_STORAGE_KEY = "@convex_token";

/**
 * Custom hook to manage Convex authentication state with user roles.
 * 
 * This hook manages local authentication state using AsyncStorage for persistence.
 * It provides the current user object and loading state throughout the app.
 * 
 * Features:
 * - Persistent authentication across app restarts
 * - Loading state management
 * - Type-safe user object with role information
 * 
 * @returns {{ user: AuthUser | null, loading: boolean, setUser: Function, clearUser: Function }} Object containing:
 *   - user: The authenticated user with role info, or null if not authenticated
 *   - loading: Boolean indicating if auth state is being initialized
 *   - setUser: Function to set the authenticated user
 *   - clearUser: Function to clear authentication (sign out)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading, setUser, clearUser } = useAuth();
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (!user) return <LoginScreen />;
 *   
 *   return (
 *     <View>
 *       <Text>Welcome {user.email}!</Text>
 *       <Text>Role: {user.role}</Text>
 *       <Button title="Sign Out" onPress={clearUser} />
 *     </View>
 *   );
 * }
 * ```
 */
export function useAuth() {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sets the authenticated user and persists to storage.
   * 
   * @param {AuthUser} userData - User data to store
   */
  const setUser = async (userData: AuthUser) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, userData.tokenIdentifier);
      setUserState(userData);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  /**
   * Clears the authenticated user and removes from storage.
   * Use this function to sign out the user.
   */
  const clearUser = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      setUserState(null);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };

  /**
   * Gets the current session token identifier.
   * 
   * @returns {Promise<string | null>} The token identifier or null
   */
  const getTokenIdentifier = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  useEffect(() => {
    /**
     * Loads user data from storage on mount.
     */
    async function loadUser() {
      try {
        const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userData) {
          setUserState(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return { user, loading, setUser, clearUser, getTokenIdentifier };
}
