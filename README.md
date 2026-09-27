# denly-mobile

The Denly app for Android and iOS (ADR 0010): scan food, detect its ingredients on the phone,
and explain them. React Native + TypeScript on **Expo SDK 57** (React Native 0.86, React 19.2)
as an **Expo dev build** with Continuous Native Generation — `android/` and `ios/` are generated
by `expo prebuild` and never committed. Expo Go is not supported (the ingredient detector will be
a native module).

Status: frontend only, example data (no backend calls). Theme, UI kit and Denly components are
in place (plan 0003 phases 1–2); the screens are placeholders being built from the prototype.
All app state is the in-memory demo store in `src/features/demo/`; only the appearance
preference is persisted. The API client (`src/lib/api/`) exists but nothing calls it yet, so
`EXPO_PUBLIC_API_URL` is not read at startup.

## Styling (ADR 0009)

- NativeWind v4 (Tailwind v3) + React Native Reusables components copied into
  `src/components/ui/` and restyled to Denly. Denly components live in `src/components/denly/`.
- Colours are tokens: `src/global.css` (HSL CSS variables, light `:root` and `.dark:root`)
  mirrored as hex in `src/lib/theme.ts`. Use classes (`bg-primary`, `text-detected`,
  `bg-hero`); never hex in components. `theme-sync.spec.ts` fails when the two files drift, and
  `theme-contrast.spec.ts` checks every text/surface pair in both modes.
- Appearance: System · Light · Dark (`useAppearance()`), stored with `expo-sqlite/kv-store`.
- `/design` is a dev route that shows every component.

## Requirements

- Node 24 LTS and pnpm 10 (`node-linker=hoisted` in `.npmrc` — Metro needs a flat `node_modules`)
- To run the app: a Mac with Xcode (iOS 16.4+ SDK) and a physical iPhone (iPhone 13 or newer),
  or an EAS development build installed on the iPhone
- The camera and the Neural Engine need a real device; the simulator is for layout only

## Setup

```bash
pnpm install
cp .env.example .env   # then set EXPO_PUBLIC_API_URL
```

### Environment

| Name | Required | Notes |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | yes | Denly API base URL **including the `/api` prefix**, no trailing slash (e.g. `http://192.168.1.10:3000/api`; the client appends `/health`, `/v1/...`). `http` is accepted in development builds only; release builds require `https`. On a physical iPhone use your computer's LAN IP. |

`EXPO_PUBLIC_*` values are compiled into the bundle and are public — never put a secret in one.
The app stops at boot with a clear message when the variable is missing or invalid
(`src/lib/config.ts`). For EAS builds, set it per environment (`development`, `preview`) in EAS
environment variables, not in `eas.json`.

## Run

```bash
pnpm start          # Metro for the dev client (expo start --dev-client)
pnpm ios            # macOS only: prebuild + build + install the dev client (expo run:ios)
pnpm android        # prebuild + Gradle build + install on a connected device/emulator
pnpm prebuild       # regenerate ios/ from app.json (clean)
pnpm prebuild:android  # regenerate android/ from app.json (clean)
```

### EAS build profiles (`eas.json`)

| Profile | What | Command |
|---|---|---|
| `development` | Dev client, internal distribution (ad hoc, registered devices) | `eas build --profile development --platform ios` |
| `preview` | Release build, internal distribution, for testers | `eas build --profile preview --platform ios` |

Requires `eas login` and an Apple developer account. Not set up yet; no store profile yet.
Before any build leaves the team, the YOLOv8 licence route must be recorded (open decision).

## Check

```bash
pnpm typecheck      # tsc --noEmit
pnpm lint           # expo lint (ESLint flat config, no console.* outside src/lib/logger.ts)
pnpm test           # Jest (jest-expo) + React Native Testing Library
pnpm doctor         # expo-doctor
pnpm export:ios     # production iOS JS bundle to dist/ — proves the bundle builds without a Mac
pnpm export:android # production Android JS bundle to dist/
```

Set `EXPO_PUBLIC_API_URL` (an `https` URL) in the environment or `.env` for exports, so the value
is inlined once the API is called.

## Windows

Development happens on Windows, which cannot build or run iOS. On Windows you can install,
type-check, lint, test, run `expo-doctor`, export both bundles, and build and install the
Android app locally (JDK + Android SDK; `pnpm android`). iOS builds go through EAS (cloud) or a
Mac. Start Metro on Windows and point an installed dev client at it over the LAN.

### Installable demo APK

```bash
pnpm apk:android    # -> dist/denly-demo-<version>-arm64.apk (JS embedded, runs without Metro)
```

Install it by copying the APK to an Android phone (allow "install unknown apps") or with
`adb install -r dist/denly-demo-0.1.0-arm64.apk`. It is arm64-v8a only (all recent phones) and
debug-signed — for testing, not for the Play Store.

**Windows path limit.** From this workspace path the native build hits Windows' 260-character
limit: `react-native.config.js` keeps `react-native-gesture-handler` (an unused optional peer of
expo-router) out of autolinking, and `plugins/with-short-native-build-dirs.js` shortens the CMake
staging dirs. The release variant still exceeds the limit in the app's autolinked codegen, so the
script builds the **debug** variant with `-PdenlyEmbedJs` (production JS bundle embedded). For a
real release build: run from a short folder (e.g. `D:\dn`) or enable Windows long paths, then
`cd android && gradlew assembleRelease`.

## Layout

```
src/
  app/                    Expo Router routes (typed routes on): (auth)/, (tabs)/, scan/, settings/, design
  components/ui/          React Native Reusables components (owned, restyled to Denly)
  components/denly/       Denly components: rows, tiles, confidence label, hero card, tab bar, …
  features/demo/          DEMO: example data + in-memory store (useDemo) until the backend exists
  features/scan/detection/  detector port: IngredientDetector, DetectionRun, DetectionResult
  lib/                    config, logger, query client, api/, theme tokens, appearance, cn()
  global.css              design tokens (CSS variables) for NativeWind
```
