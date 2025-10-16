# Expo Guard Demo with Convex

This project demonstrates authentication and role-based route protection using the latest Expo Router features, including `Stack.Protected`, with Convex as the backend.

## Features

- Expo Router navigation
- Declarative route protection with `Stack.Protected`
- Convex backend with TypeScript
- Email/password authentication
- Role-based access control (user/admin)
- Persistent authentication state with AsyncStorage
- Real-time reactive queries
- End-to-end type safety
- Clean directory structure for scalable apps

## Directory Structure

```
app/
├── _layout.tsx          # ConvexProvider + route protection
├── (app)/
│   ├── index.tsx        # User home (protected)
│   ├── admin.tsx        # Admin dashboard (protected)
│   └── about.tsx        # Public route
└── (auth)/
    └── index.tsx        # Login/signup screen (public)
config/
└── convex.ts            # Convex client configuration
hooks/
└── useAuth.ts           # Auth state management hook
convex/
├── schema.ts            # Database schema (users table)
├── auth.ts              # Auth mutations and queries
└── tsconfig.json        # Convex TypeScript config
```

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Set up Convex

**Create a Convex Project:**

1. Sign up at [convex.dev](https://convex.dev)
2. Install Convex CLI globally (if not already installed):
   ```sh
   npm install -g convex
   ```

3. Initialize Convex in this project:
   ```sh
   npx convex dev
   ```
   
   This will:
   - Create a new Convex project (or link to an existing one)
   - Generate the `convex/_generated` folder with types
   - Start the Convex development server
   - Give you your deployment URL

4. Copy your Convex deployment URL from the terminal output

5. Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   ```

**Deploy Your Schema:**

The schema is already defined in `convex/schema.ts` and will be automatically deployed when you run `npx convex dev`.

### 3. Start the Expo development server

In a **separate terminal**:

```sh
npm start
```

You need to keep `npx convex dev` running in one terminal and `npm start` in another.

## Usage

1. **Create an account**: Enter email and password, then tap "Create Account"
2. **Sign in**: Enter credentials and tap "Sign In"
3. **Navigate**: Access protected routes after authentication
4. **Sign out**: Use the "Sign Out" button from any protected screen

## Authentication Flow

- Unauthenticated users see the login/signup screen
- After sign-in, users are automatically redirected based on their role:
  - **user** role → User home screen
  - **admin** role → Admin dashboard
- Authentication state persists across app restarts using AsyncStorage
- Sign-out immediately returns users to the login screen

## Role Management

The app supports two roles: **user** and **admin**. Roles are stored in the Convex `users` table.

### Default Role

- New accounts are created with the **user** role by default
- Users with the "user" role see the main home screen  
- Users with the "admin" role see the admin dashboard

### Changing User Roles

To promote a user to admin, you can use the Convex dashboard or create a mutation.

**Option 1: Using Convex Dashboard**

1. Go to your [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Navigate to **Data** → **users** table
4. Find the user by email
5. Click on the user row and edit the `role` field from `"user"` to `"admin"`
6. User needs to sign out and sign back in to see changes

**Option 2: Using Convex CLI**

Create a script in `convex/` folder:

```typescript
// convex/setAdmin.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const setAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    await ctx.db.patch(user._id, { role: "admin" });
    return { success: true };
  },
});
```

Then run from terminal:
```sh
npx convex run setAdmin --args '{"email":"user@example.com"}'
```

**Option 3: Programmatically**

The `convex/auth.ts` file already includes a `setUserRole` mutation:

```typescript
// In your admin panel or script
await setUserRole({
  userId: "user-id-here",
  role: "admin"
});
```

## Convex Backend Functions

### Queries (Read Operations)

**`getCurrentUser`** - Gets the current user profile
```typescript
const user = useQuery(api.auth.getCurrentUser, { 
  tokenIdentifier: "token-123" 
});
```

### Mutations (Write Operations)

**`signUp`** - Creates a new user account
```typescript
await signUp({ 
  email: "user@example.com", 
  password: "password123",
  tokenIdentifier: "unique-token"
});
```

**`signIn`** - Authenticates a user
```typescript
const user = await signIn({ 
  email: "user@example.com", 
  password: "password123" 
});
```

**`setUserRole`** - Updates a user's role (admin operation)
```typescript
await setUserRole({ 
  userId: "user-id", 
  role: "admin" 
});
```

## Why Convex?

### Advantages

✅ **TypeScript-First** - Full end-to-end type safety  
✅ **Reactive Queries** - UI automatically updates when data changes  
✅ **Zero Boilerplate** - No Redux, no cache management, no API routes  
✅ **Local Development** - Test everything locally with `npx convex dev`  
✅ **Real-time by Default** - Live queries without WebSocket setup  
✅ **Strong Consistency** - No eventual consistency issues  
✅ **Excellent DX** - Hot reload, instant deploys, great debugging  

### Convex vs Others

| Feature | Convex | Firebase | Supabase |
|---------|--------|----------|----------|
| **Type Safety** | ✅ End-to-end | ❌ | ⚠️ Partial |
| **Real-time** | ✅ Built-in | ✅ | ✅ |
| **Language** | TypeScript | Multi | Multi |
| **Database** | Document + Relational | NoSQL | SQL |
| **Local Dev** | ✅ Easy | ⚠️ Emulator | ✅ Docker |
| **Open Source** | ❌ | Partial | ✅ |

## Development Workflow

### Working with Convex

1. **Start Convex dev server** (keeps running):
   ```sh
   npx convex dev
   ```

2. **Start Expo** (in separate terminal):
   ```sh
   npm start
   ```

3. **Make changes to backend functions** - They hot reload automatically

4. **View logs** in the Convex dev terminal

5. **Inspect data** at [dashboard.convex.dev](https://dashboard.convex.dev)

### Adding New Functions

1. Create a new file in `convex/` folder (e.g., `convex/users.ts`)
2. Define queries/mutations:
   ```typescript
   import { query } from "./_generated/server";
   
   export const listUsers = query({
     handler: async (ctx) => {
       return await ctx.db.query("users").collect();
     },
   });
   ```
3. Use in your app:
   ```typescript
   import { api } from "../convex/_generated/api";
   const users = useQuery(api.users.listUsers);
   ```

## Deployment

### Deploy Convex Backend

```sh
npx convex deploy
```

This deploys your backend to production. You'll get a production URL.

### Deploy Expo App

Follow standard Expo deployment:
```sh
eas build --platform ios
eas build --platform android
```

Make sure to use your production Convex URL in the environment variables.

## Security Considerations

### Current Implementation (Demo)

⚠️ This is a **demo implementation** for learning purposes. For production:

1. **Password Security**: Currently passwords are stored in plain text. Implement proper hashing (bcrypt, argon2)
2. **Authorization**: Add permission checks in mutations
3. **Rate Limiting**: Implement rate limiting for auth endpoints
4. **Email Verification**: Add email verification flow
5. **Password Reset**: Implement password reset functionality

### Adding Production Auth

Consider using [Convex Auth](https://docs.convex.dev/auth) for production:

```typescript
import { ConvexAuthProvider } from "@convex-dev/auth/react";

<ConvexAuthProvider client={convexClient}>
  <App />
</ConvexAuthProvider>
```

## Troubleshooting

### "Cannot find module '../convex/_generated/api'"

Run `npx convex dev` first. This generates the TypeScript types.

### Convex Functions Not Working

1. Check that `npx convex dev` is running
2. Verify your `.env` file has the correct `EXPO_PUBLIC_CONVEX_URL`
3. Check the Convex dev terminal for errors

### Data Not Updating

Convex queries are reactive. If data isn't updating:
1. Ensure you're using `useQuery` from "convex/react", not manual fetching
2. Check that the query is subscribed (component is mounted)
3. Verify the mutation completed successfully

## Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Convex React Guide](https://docs.convex.dev/client/react)
- [Expo Router Documentation](https://expo.github.io/router/docs)
- [Stack.Protected API](https://expo.github.io/router/docs/stack#stackprotected)

## License

MIT
