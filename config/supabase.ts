/**
 * Supabase configuration and initialization module.
 * 
 * This module initializes the Supabase client with AsyncStorage for
 * session persistence in React Native. It handles authentication state
 * across app restarts.
 * 
 * @module config/supabase
 */

import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Supabase project URL from environment variables.
 * Get this from your Supabase project settings.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";

/**
 * Supabase anonymous/public API key from environment variables.
 * This is safe to use in client-side code.
 */
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabase client instance configured for React Native.
 * 
 * Features:
 * - AsyncStorage integration for session persistence
 * - Auto token refresh
 * - Secure authentication flow
 * 
 * @constant
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
