import { supabase } from "../config/supabase";

/**
 * Valid user roles in the application.
 */
export type UserRole = "user" | "admin";

/**
 * Profile record structure from the Supabase profiles table.
 */
type Profile = {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

/**
 * Retrieves the role for a specific user from the profiles table.
 * 
 * @param {string} userId - The user's UUID from Supabase auth
 * @returns {Promise<UserRole>} The user's role, defaults to "user" if not found
 * 
 * @example
 * ```typescript
 * const role = await getUserRole(user.id);
 * if (role === "admin") {
 *   // Show admin features
 * }
 * ```
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return "user";
    }

    return (data?.role as UserRole) || "user";
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return "user";
  }
}

/**
 * Updates a user's role in the profiles table.
 * Note: This should only be called from server-side or admin contexts due to RLS policies.
 * 
 * @param {string} userId - The user's UUID
 * @param {UserRole} role - The new role to assign
 * @returns {Promise<boolean>} True if update was successful, false otherwise
 * 
 * @example
 * ```typescript
 * const success = await setUserRole(userId, "admin");
 * if (success) {
 *   console.log("User promoted to admin");
 * }
 * ```
 */
export async function setUserRole(
  userId: string,
  role: UserRole
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user role:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in setUserRole:", error);
    return false;
  }
}

/**
 * Creates a new profile record when a user signs up.
 * This should be called after successful user registration.
 * 
 * @param {string} userId - The new user's UUID from Supabase auth
 * @param {string} email - The user's email address
 * @param {UserRole} role - The initial role, defaults to "user"
 * @returns {Promise<Profile | null>} The created profile or null if creation failed
 * 
 * @example
 * ```typescript
 * const { data, error } = await supabase.auth.signUp({ email, password });
 * if (data.user) {
 *   await createUserProfile(data.user.id, email, "user");
 * }
 * ```
 */
export async function createUserProfile(
  userId: string,
  email: string,
  role: UserRole = "user"
): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email,
        role,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error("Error in createUserProfile:", error);
    return null;
  }
}
