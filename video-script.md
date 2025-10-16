# Video Script: Simplifying Auth and Role-Based Routing with Stack.Protected in Expo Router

---

## Slide 1: Opening Hook/Title

**Slide:**
What if you could protect every route in your Expo app with just one line of code?

**Narration:**
"What if you could protect every route in your Expo app with just one line of code? Today, I’ll show you how Expo Router’s new Stack.Protected feature makes authentication and role-based access simple, scalable, and almost effortless."

---

## Slide 2: The Problem with Old Approaches

**Slide:**

- Scattered logic
- Fragile navigation
- Boilerplate
- Poor scalability

**Code (Slide):**

```tsx
// In every protected screen
if (!user) {
  return <Redirect href="/auth" />;
}
```

**Narration:**
"Let’s start with how most apps used to handle route protection. You’d have manual redirects, conditional rendering, and authentication checks scattered across your screens and layouts. It looked something like this. This approach is fragile, hard to scale, and easy to break. If you forget a check, you risk exposing protected content."

---

## Live Code 1: The useAuth Hook

**Live Code:**

```tsx
/**
 * Custom hook to manage authentication state.
 * Replace with your real auth logic.
 */
function useAuth() {
  const [user, setUser] = React.useState(null); // null means not signed in
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate async auth check
    setTimeout(() => {
      setUser({ name: "Demo", role: "admin" }); // or null for unauthenticated
      setLoading(false);
    }, 800);
  }, []);

  return { user, loading };
}
```

**Narration:**
"Now let’s look at a custom hook that manages authentication state. In my project, I use a hook called useAuth. This hook simulates an authentication check. You can replace this with your real logic, but the key is that it returns both the user and a loading state."

---

## Slide 3: Directory Structure Diagram

**Slide:**

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

**Narration:**
"A clean directory structure makes everything easier. Here’s how I organize my routes. By naming files index.tsx inside segments like (app) and (auth), Expo Router automatically treats them as the default route for that segment. This makes routing predictable and maintainable."

---

## Live Code 2: AppLayout with Stack.Protected

**Live Code:**

```tsx
import { Stack } from "expo-router";

function AppLayout() {
  const { user, loading } = useAuth();
  if (loading) return <ScreenSuspense />;

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

**Narration:**
"Now, let’s look at the main layout file. This is where the magic happens with Stack.Protected. With just a few lines, I’ve protected my entire app. If the user is authenticated, they see the home screen. If not, they see the login screen. No more scattered logic or manual redirects."

---

## Slide 4: Why Manual Redirects Are Flawed

**Slide:**

- Manual redirects are error-prone
- Duplication across segments
- Hidden logic in layouts
- Edge cases with deep links

**Narration:**
"Some developers put authentication checks in each segment’s layout. But this leads to duplication, hidden logic, and edge cases where deep links or navigation actions can bypass your protection. With Stack.Protected, protection is part of your navigation tree, not hidden in layout files. You avoid duplication and make access control obvious and maintainable."

---

## Live Code 3: Role-Based Guards in Layout

**Live Code:**

```tsx
import { Stack } from "expo-router";

function AppLayout() {
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

**Narration:**
"Stack.Protected isn’t just for authentication. You can expose different routes based on user roles, permissions, or any custom logic. Just update the guard logic, and your navigation tree clearly shows which routes are exposed to which users. This makes role-based access control simple and declarative."

---

## Slide 5: Scalability and Maintainability

**Slide:**

- Centralized access control
- Easy to add new roles/screens
- Declarative and clear navigation tree

**Narration:**
"With this approach, your app is easier to grow and reason about. You can add new roles, screens, or segments without worrying about missing a protection check."

---

## Slide 6: Wrap Up/Call to Action

**Slide:**

- Simplify authentication and role-based access with Stack.Protected
- Use clean directory structure with index.tsx files
- Check out the blog post and Expo Router docs

**Links:**

- [Blog Post](./blog.md)
- [Expo Router docs](https://expo.github.io/router/docs/stack#stackprotected)

**Narration:**
"So, if you want to simplify authentication and role-based access in your Expo app, try out Stack.Protected and a clean directory structure with index.tsx files. For more details, check out my blog post and the Expo Router docs. Thanks for watching, and happy coding!"

---

## Suggested Video Flow

1. **Slide:** Opening hook and video title
2. **Slide:** The problem with old approaches (show flawed code)
3. **Live Code:** Show the useAuth hook
4. **Slide:** Directory structure diagram
5. **Live Code:** Walk through AppLayout with Stack.Protected
6. **Slide:** Why manual redirects are flawed
7. **Live Code:** Demo role-based guards in the layout
8. **Slide:** Scalability and maintainability
9. **Slide:** Wrap up and call to action

---

This script gives you a clear structure for your video, with slides for key concepts, live code for practical demos, and explicit narration for each section. Use it as your guide for recording and editing!
