import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

/**
 * Script to promote a user to admin role.
 * This bypasses RLS policies by using the service role key.
 * 
 * IMPORTANT: This requires the Supabase service role key (not the anon key).
 * The service role key should NEVER be used in client-side code.
 * 
 * Usage:
 * 1. Set SUPABASE_SERVICE_ROLE_KEY environment variable
 * 2. Update USER_ID constant below with target user's UUID
 * 3. Run: npx ts-node scripts/setAdminRole.ts
 * 
 * @example
 * ```bash
 * export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
 * npx ts-node scripts/setAdminRole.ts
 * ```
 */

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID = "REPLACE_WITH_USER_ID";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "❌ Missing required environment variables:"
  );
  console.error("   - EXPO_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  console.error("\nGet your service role key from Supabase Dashboard:");
  console.error("   Settings → API → service_role key");
  process.exit(1);
}

if (USER_ID === "REPLACE_WITH_USER_ID") {
  console.error("❌ Please update USER_ID in scripts/setAdminRole.ts");
  process.exit(1);
}

/**
 * Admin client with elevated permissions using service role key.
 * WARNING: Service role key bypasses Row Level Security.
 */
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Promotes a user to admin role by updating the profiles table.
 * 
 * @param {string} userId - UUID of the user to promote
 */
async function setAdminRole(userId: string) {
  console.log(`🔄 Promoting user ${userId} to admin...`);

  try {
    const { data: profile, error: fetchError } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("❌ Error fetching user profile:", fetchError.message);
      return;
    }

    if (!profile) {
      console.error(`❌ User profile not found for ID: ${userId}`);
      console.error("   Make sure the user has signed up and created a profile");
      return;
    }

    console.log(`📋 Current profile:`, {
      email: profile.email,
      role: profile.role,
    });

    if (profile.role === "admin") {
      console.log("✅ User is already an admin");
      return;
    }

    const { error: updateError } = await adminClient
      .from("profiles")
      .update({
        role: "admin",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ Error updating role:", updateError.message);
      return;
    }

    console.log("✅ Successfully promoted user to admin!");
    console.log("   User must sign out and sign back in to see changes");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

setAdminRole(USER_ID);
