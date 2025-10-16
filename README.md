# Expo Guard Demo

This project demonstrates authentication and role-based route protection using the latest Expo Router features, including `Stack.Protected`.

SEE VIDEO HERE - https://youtu.be/XzsQIOgKt9s

## Features

- Expo Router navigation
- Declarative route protection with `Stack.Protected`
- Role-based access control example
- Clean directory structure for scalable apps

## Directory Structure

```
app/
├── _layout.tsx
├── (app)/
│   └── index.tsx      # Home screen (protected)
├── (auth)/
│   └── index.tsx      # Login screen (public)
```

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```

## Learn More

- [Expo Router Documentation](https://expo.github.io/router/docs)
- [Stack.Protected API](https://expo.github.io/router/docs/stack#stackprotected)
- [Expo Documentation](https://docs.expo.dev/)

## License

MIT
