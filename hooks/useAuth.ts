/**
 * Authentication hook module for Firebase.
 * 
 * Provides a React hook for managing Firebase authentication state
 * and user roles throughout the application.
 * 
 * @module hooks/useAuth
 */

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";
import { getUserRole, UserRole } from "../utils/userRoles";

/**
 * Authenticated user object with role information.
 * 
 * @interface AuthUser
 * @property {string} id - Firebase user ID
 * @property {string | undefined} email - User's email address
 * @property {UserRole} role - User's role ("user" or "admin")
 */
export interface AuthUser {
  id: string;
  email: string | undefined;
  role: UserRole;
}

/**
 * Custom hook to manage Firebase authentication state with user roles.
 * 
 * This hook automatically subscribes to Firebase auth state changes and
 * fetches the user's role from Firestore when authenticated.
 * It handles loading states and provides the current user object throughout the app.
 * 
 * @returns {{ user: AuthUser | null, loading: boolean }} Object containing:
 *   - user: The authenticated user with role info, or null if not authenticated
 *   - loading: Boolean indicating if auth state is being initialized
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading } = useAuth();
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (!user) return <LoginScreen />;
 *   
 *   return <div>Welcome {user.email}!</div>;
 * }
 * ```
 */
export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const role = await getUserRole(firebaseUser.uid);
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email ?? undefined,
          role,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
