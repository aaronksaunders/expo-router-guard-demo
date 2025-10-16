/**
 * Admin role promotion script for Supabase.
 * 
 * This script promotes a user to admin role by updating their role in the profiles table.
 * Useful for creating the first admin user or promoting trusted users.
 * 
 * @module scripts/setAdminRole
 * 
 * @usage
 * 1. Replace 'USER_ID_HERE' with the actual user ID from Supabase Auth
 * 2. Ensure you have a .env file with valid Supabase credentials
 * 3. Install ts-node if not already installed: `npm install -D ts-node`
 * 4. Run: `npx ts-node scripts/setAdminRole.ts`
 * 
 * @note
 * The user must sign out and sign back in for the role change to take effect.
 * 
 * @example
 * ```bash
 * # Install ts-node (if needed)
 * npm install -D ts-node
 * 
 * # Edit this file and replace USER_ID with actual user ID
 * # Then run:
 * npx ts-node scripts/setAdminRole.ts
 * ```
 */

import { setUserRole } from "../utils/userRoles";

/**
 * The user ID to promote to admin.
 * Replace this with the actual Supabase user ID from your Supabase Dashboard.
 * You can find user IDs under: Authentication > Users > ID column
 */
const USER_ID = "USER_ID_HERE";

/**
 * Promotes the specified user to admin role.
 * 
 * This function updates the user's role in the profiles table from "user" to "admin".
 * After running, the user needs to sign out and sign back in to have their
 * new role reflected in the app.
 * 
 * @async
 * @function promoteToAdmin
 * @returns {Promise<void>}
 */
async function promoteToAdmin() {
  try {
    console.log(`🔄 Promoting user ${USER_ID} to admin...`);
    await setUserRole(USER_ID, "admin");
    console.log("✅ User successfully promoted to admin!");
    console.log("⚠️  User needs to sign out and sign back in to see changes.");
  } catch (error) {
    console.error("❌ Error promoting user:", error);
    process.exit(1);
  }
}

promoteToAdmin();
