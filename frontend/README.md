# Smart Expert System for Mental Health Support

An Expo + React Native application that provides mental health support features such as:

- AI-assisted chat support
- A curated Education/resources feed
- A Therapists directory with filtering and details
- A user Profile screen with persistent preferences and profile data

This repository uses **Expo Router** for file-based navigation and **NativeWind/Tailwind** for styling.

## Tech stack

- **Expo** (React Native)
- **Expo Router** (file-based routing)
- **TypeScript**
- **NativeWind** + **TailwindCSS**

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the app

```bash
npm run start
```

Then open the app using one of:

- Android emulator
- iOS simulator
- Expo Go

## Scripts

- **Start dev server**
  `npm run start`
- **Start on Android**
  `npm run android`
- **Start on iOS**
  `npm run ios`
- **Start on Web**
  `npm run web`
- **Lint**
  `npm run lint`
- **Typecheck**
  `npx tsc -p . --noEmit`

## Project structure

- `app/`
  Expo Router routes.
  - `app/(tabs)/` main tab screens (Home, Chat, Therapists, Education, Profile)
  - `app/(tabs)/_layout.tsx` tab navigator configuration
- `components/`
  Reusable UI components and screen-specific components.
- `hooks/`
  Custom React hooks (theme, auth theme helpers, etc.).
- `lib/`
  Shared non-UI logic (data access, parsing, helpers).
- `constants/`
  Theme tokens and app constants.
- `assets/`
  Images, icons, etc.

## Storage conventions

This app uses a small storage wrapper in `lib/storage.ts` to ensure consistent behavior on:

- Native (`AsyncStorage`)
- Web (`localStorage`)

Prefer these helpers instead of using `AsyncStorage` directly:

- `getStoredString`, `setStoredString`, `removeStoredItem`
- `getStoredJson`, `setStoredJson`

Current keys in use include (subject to change):

- `profileData`
- `profilePhotoUri`
- `themeMode`

## UI / styling conventions

- Use `className` with NativeWind for styling.
- Prefer `AppText` (from `components/ui/text`) over raw `Text` to keep typography consistent.

## Navigation conventions (Expo Router)

- Use `router.push(...)` for normal forward navigation.
- Use `router.replace(...)` only when you explicitly do *not* want a back-stack entry.
- When a screen must always return to a specific place, pass a `from` param and use it on back.

## Troubleshooting

- **Metro cache issues**
  Run `npx expo start -c`
- **Type errors**
  Run `npx tsc -p . --noEmit`
- **Lint issues**
  Run `npm run lint`
