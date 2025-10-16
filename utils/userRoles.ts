/**
 * User role management utilities for Firebase.
 * 
 * This module provides functions for managing user roles in Firebase Firestore,
 * including creating user profiles, getting roles, and updating roles.
 * 
 * Roles are stored in a 'users' collection in Firestore.
 * 
 * @module utils/userRoles
 */

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * User role type definition.
 * @typedef {"user" | "admin"} UserRole
 */
export type UserRole = "user" | "admin";

/**
 * User profile structure in Firestore users collection.
 * 
 * @interface UserProfile
 * @property {string} id - User ID (references Firebase Auth user)
 * @property {string} email - User's email address
 * @property {UserRole} role - User's role
 * @property {Date} createdAt - Profile creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Retrieves a user's role from Firebase Firestore.
 * 
 * Fetches the user profile from the 'users' collection and returns their role.
 * If the profile doesn't exist or an error occurs, defaults to "user" role.
 * 
 * @param {string} userId - The Firebase user ID
 * @returns {Promise<UserRole>} The user's role ("user" or "admin")
 * 
 * @example
 * ```typescript
 * const role = await getUserRole("user-id-123");
 * console.log(role); // "user" or "admin"
 * ```
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      return userDoc.data()?.role || "user";
    }
    
    return "user";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "user";
  }
}

/**
 * Updates a user's role in Firebase Firestore.
 * 
 * Updates the role field in the user's profile. This should typically
 * only be called by admin users or through secure server-side functions.
 * 
 * @param {string} userId - The Firebase user ID
 * @param {UserRole} role - The role to assign ("user" or "admin")
 * @returns {Promise<void>}
 * @throws {Error} If the database operation fails
 * 
 * @example
 * ```typescript
 * // Promote user to admin
 * await setUserRole("user-id-123", "admin");
 * 
 * // Demote admin to user
 * await setUserRole("user-id-123", "user");
 * ```
 */
export async function setUserRole(
  userId: string,
  role: UserRole
): Promise<void> {
  try {
    await updateDoc(doc(db, "users", userId), {
      role,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error setting user role:", error);
    throw error;
  }
}

/**
 * Creates a new user profile in Firebase Firestore during signup.
 * 
 * This should be called immediately after creating a new Firebase Auth user
 * to establish their profile and initial role in the database.
 * 
 * @param {string} userId - The Firebase user ID
 * @param {string} email - The user's email address
 * @param {UserRole} [role="user"] - The initial role (defaults to "user")
 * @returns {Promise<void>}
 * @throws {Error} If the database operation fails
 * 
 * @example
 * ```typescript
 * // Create regular user profile
 * const userCredential = await createUserWithEmailAndPassword(auth, email, password);
 * await createUserProfile(userCredential.user.uid, email);
 * 
 * // Create admin profile
 * await createUserProfile(userId, email, "admin");
 * ```
 */
export async function createUserProfile(
  userId: string,
  email: string,
  role: UserRole = "user"
): Promise<void> {
  try {
    await setDoc(doc(db, "users", userId), {
      id: userId,
      email,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}
