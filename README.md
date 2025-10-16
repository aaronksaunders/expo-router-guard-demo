# Expo Guard Demo with Supabase

This project demonstrates authentication and role-based route protection using the latest Expo Router features, including `Stack.Protected`, with Supabase Authentication and Database.

## Features

- Expo Router navigation
- Declarative route protection with `Stack.Protected`
- Supabase Authentication integration
- Email/password authentication
- Role-based access control example
- Persistent authentication state with AsyncStorage
- Clean directory structure for scalable apps

## Directory Structure

```
app/
├── _layout.tsx
├── (app)/
│   ├── index.tsx      # User home (protected)
│   ├── admin.tsx      # Admin dashboard (protected)
│   └── about.tsx      # Public route
├── (auth)/
│   └── index.tsx      # Login screen (public)
config/
└── supabase.ts         # Supabase configuration
hooks/
└── useAuth.ts          # Supabase auth hook
utils/
└── userRoles.ts        # Role management utilities
scripts/
└── setAdminRole.ts     # Admin promotion script
```

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Set up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Enable Email/Password authentication in Supabase Dashboard:
   - Go to **Authentication** → **Providers**
   - Enable **Email** provider
3. Create the `profiles` table in your Supabase database by running this SQL:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text not null default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Policy: Users can insert their own profile (for signup)
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Policy: Users can update their own profile (but not role)
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from profiles where id = auth.uid())
  );
```

4. Get your Supabase credentials from **Settings** → **API**:
   - Project URL
   - Anon/Public Key

5. Create a `.env` file in the root directory (copy from `.env.example`):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Start the development server

```sh
npm start
```

## Usage

1. **Create an account**: Use the "Create Account" button on the login screen
2. **Sign in**: Enter your email and password
3. **Navigate**: Access protected routes after authentication
4. **Sign out**: Use the "Sign Out" button from any protected screen

## Authentication Flow

- Unauthenticated users see the login screen
- After sign-in, users are automatically redirected to the home screen
- Authentication state persists across app restarts using AsyncStorage
- Sign-out immediately returns users to the login screen

## Role Management

The app supports two roles: **user** and **admin**. Roles are stored in the Supabase `profiles` table.

### Default Role

- New accounts are created with the **user** role by default
- Users with the "user" role see the main home screen
- Users with the "admin" role see the admin dashboard

### Changing User Roles

To promote a user to admin, you have several options:

**Option 1: Using Supabase Dashboard**
1. Go to Supabase Dashboard → **Table Editor** → **profiles**
2. Find the user by email or ID
3. Edit the `role` field and change it from `"user"` to `"admin"`
4. User needs to sign out and sign back in to see the change

**Option 2: Using SQL Editor**

Run this SQL in your Supabase SQL Editor:

```sql
-- Replace user_id_here with actual user ID
update profiles 
set role = 'admin', updated_at = now() 
where id = 'user_id_here';
```

**Option 3: Using the Promotion Script**

```bash
# Install ts-node (if needed)
npm install -D ts-node

# Edit scripts/setAdminRole.ts and replace USER_ID
# Then run:
npx ts-node scripts/setAdminRole.ts
```

### Row Level Security (RLS)

The profiles table uses Supabase RLS policies to ensure:

- ✅ Users can view their own profile
- ✅ Users can create their profile during signup
- ✅ Users can update their profile (email, etc.)
- ❌ Users **cannot** change their own role (prevents self-promotion)

Only database admins or server-side functions can change user roles, ensuring proper security.

### For Production

Consider implementing:
- **Supabase Edge Functions** to handle role changes securely
- **Admin panel** to manage users and roles
- **Database triggers** to automatically create profiles when users sign up:

```sql
-- Optional: Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Learn More

- [Expo Router Documentation](https://expo.github.io/router/docs)
- [Stack.Protected API](https://expo.github.io/router/docs/stack#stackprotected)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Expo Documentation](https://docs.expo.dev/)

## License

MIT
