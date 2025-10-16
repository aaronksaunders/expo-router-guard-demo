/**
 * Convex authentication functions.
 * 
 * This module handles user authentication, including sign-up, sign-in,
 * and user profile retrieval with role-based access control.
 * 
 * @module convex/auth
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Creates a new user account with email and password.
 * 
 * This mutation creates a user profile in the database with the "user" role by default.
 * In a production app, you would hash the password and implement proper authentication.
 * 
 * @param {Object} args
 * @param {string} args.email - User's email address
 * @param {string} args.password - User's password (should be hashed in production)
 * @param {string} args.tokenIdentifier - Unique token identifier for the session
 * @returns {Promise<Id<"users">>} The ID of the created user document
 * 
 * @example
 * ```typescript
 * const userId = await signUp({
 *   email: "user@example.com",
 *   password: "securePassword123",
 *   tokenIdentifier: "unique-token-id"
 * });
 * ```
 */
export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user with "user" role by default
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      email: args.email,
      role: "user",
    });

    return userId;
  },
});

/**
 * Signs in a user with email and password.
 * 
 * This mutation validates credentials and returns the user profile.
 * In production, implement proper password hashing and validation.
 * 
 * @param {Object} args
 * @param {string} args.email - User's email address
 * @param {string} args.password - User's password
 * @returns {Promise<Object>} User profile with id, email, and role
 * @throws {Error} If credentials are invalid
 * 
 * @example
 * ```typescript
 * const user = await signIn({
 *   email: "user@example.com",
 *   password: "securePassword123"
 * });
 * ```
 */
export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // In production, validate password hash here

    return {
      id: user._id,
      email: user.email,
      role: user.role,
      tokenIdentifier: user.tokenIdentifier,
    };
  },
});

/**
 * Retrieves the current user's profile based on their token identifier.
 * 
 * This query is reactive - it automatically updates when user data changes.
 * 
 * @param {Object} args
 * @param {string} args.tokenIdentifier - User's unique token identifier
 * @returns {Promise<Object | null>} User profile or null if not found
 * 
 * @example
 * ```typescript
 * const user = await getCurrentUser({ tokenIdentifier: "token-123" });
 * if (user) {
 *   console.log(`Role: ${user.role}`);
 * }
 * ```
 */
export const getCurrentUser = query({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();

    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      role: user.role,
    };
  },
});

/**
 * Updates a user's role (admin operation).
 * 
 * This mutation should only be callable by administrators.
 * In production, add proper authorization checks.
 * 
 * @param {Object} args
 * @param {Id<"users">} args.userId - ID of the user to update
 * @param {string} args.role - New role ("user" or "admin")
 * @returns {Promise<void>}
 * 
 * @example
 * ```typescript
 * await setUserRole({
 *   userId: "user-id-123",
 *   role: "admin"
 * });
 * ```
 */
export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    // In production, check if the caller is an admin
    await ctx.db.patch(args.userId, {
      role: args.role,
    });
  },
});
