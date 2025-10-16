# Simplifying Auth and Role-Based Routing with `Stack.Protected` in Expo Router

Expo Router’s latest release introduces `Stack.Protected`, a powerful, declarative way to handle route protection and role-based access in your Expo and React Native apps. This feature, combined with a thoughtful directory structure, makes authentication and authorization flows much simpler, more maintainable, and scalable.

---

## Why `Stack.Protected` Is a Game Changer

Before `Stack.Protected`, developers often relied on manual redirects, conditional rendering, or navigation hacks to protect routes. This approach has several drawbacks:

- **Scattered Logic:** Authentication checks and redirects are spread across multiple files and components, making the codebase harder to maintain and reason about.
- **Fragile Navigation:** Manual redirects can be bypassed by deep links, browser navigation, or race conditions, allowing unauthenticated users to access protected screens.
- **Boilerplate:** You end up writing repetitive code to check authentication and handle navigation in every screen or layout.
- **Poor Scalability:** As your app grows, managing access control for many routes becomes complex and error-prone.

**Example of a flawed approach:**

```tsx
// In every protected screen
if (!user) {
  return <Redirect href="/auth" />;
}
```

This pattern is easy to break and hard to scale. If you forget to add the check to a new screen, it becomes a security risk.

---

## The Power of Declarative Protection

With `Stack.Protected`, you centralize access control in your navigation tree, making your app more robust, maintainable, and secure.

```tsx
import { Stack } from "expo-router";

function useAuth() {
  // Replace with your real auth logic
  const [user] = React.useState(null); // null means not signed in
  return { user };
}

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)/index" options={{ title: "Home" }} />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
```

---

## Example Directory Structure

A clean directory structure helps Expo Router automatically map routes and segments. Here’s a typical setup for protected and public routes:

```
app/
├── _layout.tsx
├── (app)/
│   └── index.tsx      # Home screen (protected)
├── (auth)/
│   └── index.tsx      # Login screen (public)
```

- `app/_layout.tsx`: Navigation and protection logic.
- `app/(app)/index.tsx`: Main app screen, only for authenticated users.
- `app/(auth)/index.tsx`: Login screen, for unauthenticated users.

---

## Why Name Files `index.tsx` in Segments?

Naming your files `index.tsx` inside segments (like `(app)` and `(auth)`) makes them the default route for that segment. For example:

- Navigating to `/app` automatically loads `app/(app)/index.tsx`.
- Navigating to `/auth` loads `app/(auth)/index.tsx`.

This means you don’t need to manually redirect or specify a screen name—Expo Router will always show the segment’s index file as the default. It also ensures that your guards in `Stack.Protected` work as expected, because the router can always find a valid route to render.

---

## Why Segment Layout Redirects Are Still Flawed

Some developers place authentication checks and redirects in the layout file for each segment (e.g., `(app)/_layout.tsx`). While this centralizes logic for that segment, it still has flaws compared to `Stack.Protected`:

- **Manual Redirects:** You must remember to add redirect logic in every segment’s layout, which can be error-prone.
- **Duplication:** If you have multiple protected segments, you end up duplicating similar logic across layouts.
- **Less Declarative:** The navigation tree doesn’t clearly show which routes are protected; protection is hidden in layout code.
- **Edge Cases:** Deep links or navigation actions can still bypass segment-level redirects if not handled perfectly.

**With `Stack.Protected`:**

- Protection is part of your navigation tree, not hidden in layout files.
- You avoid duplication and make access control obvious and maintainable.
- The router handles fallback to allowed routes automatically.

---

## Role-Based Route Protection with `Stack.Protected`

`Stack.Protected` isn’t just for authentication—it’s also perfect for role-based access control. You can conditionally expose routes based on user roles, permissions, or any custom logic.

**Example:**

```tsx
import { Stack } from "expo-router";

function useAuth() {
  // Example user object with a role
  const [user] = React.useState({ role: "admin" }); // or null if not signed in
  return { user };
}

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <Stack>
      {/* Public route */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* User route */}
      <Stack.Protected guard={user?.role === "user"}>
        <Stack.Screen
          name="(app)/user-dashboard"
          options={{ title: "User Dashboard" }}
        />
      </Stack.Protected>

      {/* Admin route */}
      <Stack.Protected guard={user?.role === "admin"}>
        <Stack.Screen
          name="(app)/admin-dashboard"
          options={{ title: "Admin Dashboard" }}
        />
      </Stack.Protected>
    </Stack>
  );
}
```

**How it works:**

- Only users with the correct role see the corresponding routes.
- You can easily add more roles or permissions by updating the guard logic.
- Your navigation tree clearly shows which routes are exposed to which users.

---

## Final Thoughts

With `Stack.Protected` and a well-structured directory using `index.tsx` files, Expo Router makes authentication and route protection clean, declarative, and scalable. You can easily extend this pattern for role-based access, making your app secure and maintainable as it grows.

**Ready to try it?**  
Check out the [Expo Router docs](https://expo.github.io/router/docs/stack#stackprotected) and start simplifying your navigation today!
