/**
 * Convex database schema definition.
 * 
 * This schema defines the structure of the users table, which stores
 * user profiles with email and role-based access control.
 * 
 * @module convex/schema
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database schema for the Convex application.
 * 
 * Tables:
 * - users: Stores user profiles with authentication and role information
 */
export default defineSchema({
  /**
   * Users table schema.
   * 
   * @property {string} tokenIdentifier - Unique identifier from Convex Auth
   * @property {string} email - User's email address
   * @property {string} role - User's role ("user" or "admin")
   * @property {number} _creationTime - Automatically generated creation timestamp
   */
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),
});
