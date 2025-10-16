/**
 * Convex client configuration and initialization module.
 * 
 * This module initializes the Convex client with AsyncStorage for
 * session persistence in React Native. It provides a configured client
 * that can be used throughout the application.
 * 
 * @module config/convex
 */

import { ConvexReactClient } from "convex/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Convex deployment URL from environment variables.
 * Get this from your Convex dashboard after deploying.
 * 
 * @constant {string}
 */
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL || "";

if (!CONVEX_URL) {
  throw new Error(
    "Missing EXPO_PUBLIC_CONVEX_URL. Please set it in your .env file."
  );
}

/**
 * Convex React client instance configured for React Native.
 * 
 * Features:
 * - AsyncStorage integration for persistence
 * - Automatic reconnection
 * - Optimistic updates
 * - Real-time query subscriptions
 * 
 * @constant {ConvexReactClient}
 * 
 * @example
 * ```typescript
 * import { convexClient } from "./config/convex";
 * import { useQuery } from "convex/react";
 * 
 * function MyComponent() {
 *   const data = useQuery(api.myModule.myQuery);
 *   // data automatically updates in real-time
 * }
 * ```
 */
export const convexClient = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

/**
 * Storage adapter for Convex auth using AsyncStorage.
 * This enables persistent authentication across app restarts.
 */
export const convexAuthStorage = AsyncStorage;
