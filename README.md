# Expo Guard Demo with Firebase

This project demonstrates authentication and role-based route protection using Expo Router's `Stack.Protected` feature with Firebase Authentication and Firestore.

## Features

- Firebase Authentication (Email/Password)
- Firestore for user role management
- Declarative route protection with `Stack.Protected`
- Role-based access control (user/admin)
- Persistent authentication with AsyncStorage
- Clean directory structure for scalable apps

## Directory Structure

```
app/
├── _layout.tsx           # Main layout with route protection
├── (app)/
│   ├── index.tsx         # Home screen (protected, user role)
│   ├── admin.tsx         # Admin screen (protected, admin role)
│   └── about.tsx         # About screen (public)
└── (auth)/
    └── index.tsx         # Login/Signup screen

config/
└── firebase.ts           # Firebase configuration

hooks/
└── useAuth.ts            # Authentication hook

utils/
└── userRoles.ts          # User role management

scripts/
└── setUserRole.ts        # Script to set user roles
```

## Getting Started

### 1. Install Dependencies

```sh
npm install
```

### 2. Configure Firebase

Create a `.env` file in the root directory with your Firebase configuration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Set Up Firestore

Create a `users` collection in Firestore with the following structure:

```
users/
  {userId}/
    - id: string
    - email: string
    - role: "user" | "admin"
    - createdAt: timestamp
    - updatedAt: timestamp
```

### 4. Start the Development Server

```sh
npm start
```

## User Management

### Creating Admin Users

After signing up, you can promote a user to admin using the provided script:

```sh
npx tsx scripts/setUserRole.ts <userId> admin
```

### Role-Based Access

- **User role**: Access to home screen (`/(app)/index`)
- **Admin role**: Access to admin screen (`/(app)/admin`)
- **Public**: About screen (`/(app)/about`)

## Authentication Flow

1. User signs up with email/password
2. Profile is created in Firestore with "user" role
3. User is automatically signed in
4. Auth state is persisted with AsyncStorage
5. Route protection is handled by `Stack.Protected` based on user role

## Security Rules

Add these Firestore security rules to your Firebase project:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Learn More

- [Expo Router Documentation](https://expo.github.io/router/docs)
- [Stack.Protected API](https://expo.github.io/router/docs/stack#stackprotected)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Documentation](https://docs.expo.dev/)

## License

MIT
