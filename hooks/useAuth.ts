import { useEffect, useState } from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../config/supabase";
import { getUserRole } from "../utils/userRoles";

/**
 * Extended user object that includes role information from profiles table.
 */
export type User = {
  id: string;
  email?: string;
  role: "user" | "admin";
};

/**
 * Custom hook for Supabase authentication with role-based access control.
 * Fetches user role from the profiles table on authentication.
 * 
 * @returns {Object} Authentication state
 * @returns {User | null} user - Current authenticated user with role, or null if not authenticated
 * @returns {boolean} loading - Whether authentication state is being loaded
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading } = useAuth();
 *   
 *   if (loading) return <Spinner />;
 *   if (!user) return <Login />;
 *   
 *   return <Dashboard user={user} />;
 * }
 * ```
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the user's role from the profiles table and creates an extended user object.
   * 
   * @param {SupabaseUser} supabaseUser - The authenticated user from Supabase auth
   * @returns {Promise<User>} User object with role information
   */
  async function fetchUserWithRole(supabaseUser: SupabaseUser): Promise<User> {
    const role = await getUserRole(supabaseUser.id);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      role,
    };
  }

  useEffect(() => {
    /**
     * Checks for existing session on mount and sets up auth state listener.
     */
    async function initAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const userWithRole = await fetchUserWithRole(session.user);
          setUser(userWithRole);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userWithRole = await fetchUserWithRole(session.user);
        setUser(userWithRole);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
