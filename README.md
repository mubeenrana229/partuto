# AutoHub GCC — Expo / React Native

Full conversion of the Next.js "AutoHub GCC" web app to a native Expo Router app.

## Run it

```bash
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator), or scan the QR code with
Expo Go on your phone. Requires Node 18+ and, for iOS, a Mac with Xcode (or just
use Expo Go on a physical device — no Mac needed).

## What changed vs. the Next.js app

| Web (Next.js) | Expo (this app) |
|---|---|
| `next/navigation`, `<Link>` | `expo-router` (file-based, same route names) |
| Tailwind + shadcn/ui | `lib/theme.ts` tokens + `components/ui.tsx` (StyleSheet-based kit) |
| `localStorage` (via zustand `persist`) | `@react-native-async-storage/async-storage`, same store shape |
| `sonner` toasts | `components/Toast.tsx` (custom, same API: `toast.success/error/message`) |
| Browser `Notification` API | `lib/notify.ts` stubbed no-op (see comment inside — swap in `expo-notifications` for real push) |
| `<img src="/assets/...">` | `require("../assets/images/...")` in `lib/mock.ts` |
| Web-only chrome (`<html>`, meta, SEO/sitemap files) | Dropped — not applicable to native |

**Every route from the original app exists here**, with the same file purpose
documented in a header comment at the top of each file (pointing back at the
original web source file it was ported from):

- Tabs: Home, Categories, Features (services), Cart, Wishlist, Profile
- Stack: Search, Product detail, Store profile, Shop (garage) profile,
  Checkout, Auth, Garage, Chat (list + thread), Inbox, Onboarding, Premium,
  Returns, Tracking, Services (quick-book)

All of them read/write through the **same `lib/store.ts`** (ported almost
line-for-line from the web version) and the **same `lib/mock.ts`** dataset, so
behavior (cart math, coupon codes, booking, wishlist, reviews, wallet, returns,
chat threads) is identical to the web app.

## Known simplifications (call these out if you need pixel-parity)

- **Chat**: text messaging is fully wired; voice-note recording/playback from
  the web version was dropped (RN needs `expo-av` + mic permissions — happy to
  add if you want it).
- **Tracking**: the animated SVG delivery-route map is replaced with a static
  placeholder + pin icons. Wire in `react-native-maps` for a real live map.
- **Search filters**: VIN lookup and the full advanced-filter sheet are
  trimmed to text search + condition/sort chips (the 90% use case).
- **Notifications**: `lib/notify.ts` is a no-op stub — add the
  `expo-notifications` config plugin + a dev build (not Expo Go) for real push.
- Icons are `@expo/vector-icons` (Ionicons) substituting for `lucide-react`
  one-for-one — different icon set, same meaning.

## Project layout

```
app/                 expo-router screens (file = route)
  (tabs)/             bottom tab screens
components/          shared UI kit, ProductCard, ScreenHeader, Toast, SosButton
lib/
  mock.ts             seed data (ported ~1:1 from the web app)
  store.ts            zustand global state (ported ~1:1, AsyncStorage-backed)
  theme.ts             design tokens (colors/spacing/radius)
  notify.ts, i18n.ts   small ported helpers
assets/images/        bundled product/shop photos
```
