# Pulsae app (version 2): run it on your iPhone

This is the full front-end prototype of the Pulsae iOS app (React Native with Expo), in English and Arabic.
It runs on sample data stored on the phone. Nothing is connected to a server, payment provider, SMS or email service.

IMPORTANT: this code was written without being compiled or run (the tools I work with cannot install the app libraries).
It passed an offline syntax and type check, but expect a few small errors on first run. Copy any red error message and send it to me.

## One-time setup (on a computer where you can install software)
1. Install Node.js (LTS) from https://nodejs.org
2. On your iPhone, install the free "Expo Go" app from the App Store.
3. Open PowerShell and create the project:

   npx create-expo-app@latest pulsae-app --template blank-typescript
   cd pulsae-app

4. Install the libraries:

   npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context expo-font expo-status-bar @expo-google-fonts/poppins @expo-google-fonts/baloo-2 @expo-google-fonts/cairo @expo/vector-icons

5. From this zip, copy the `src` folder into `pulsae-app` and replace `App.tsx` with the one from the zip.

## Run
   npx expo start

Scan the QR code with the iPhone camera. If it does not connect (office Wi-Fi): npx expo start --tunnel

## No laptop with install rights?
Paste the files into https://snack.expo.dev (free, runs in the browser and on your phone through Expo Go).

## What is in the app
Both sides, with one shared demo state, so a booking made as a customer shows up for the professional.
- Open and log in: opening animation, log in with password, forgot password (code 123456), language switch English / العربية (right-to-left).
- Customer: sign-up (gender required), contact verification (code 123456), preference survey, Discover with search, category and full filters,
  professional profile (About, Certifications, Reviews with replies), choose time from real availability, saved addresses,
  checkout (1, 4 or 8 sessions with pack discount, weekly repeat, promo code WELCOME, credits), confirmation,
  Bookings (upcoming, past, weekly series, community events), booking detail (move, cancel with the 24-hour credit rule, confirm session, rate, report),
  weekly series (next charge 48 hours before the first session of the week, stop series), chat per booking, notifications,
  Community (RSVP), Profile (details, addresses, payment methods, credits and referrals, saved professionals, notification settings, help, contact).
- Professional: join flow (details, verification, credentials upload, terms with discount funding, review and approval),
  Bookings (mark complete, cancel, message, report customer), Earnings (25% first-booking commission, 5% fee, payout 48 hours after confirmation),
  Availability and blocked times, Service area, Saved places, Profile (price, specialties, pack discounts, weekly repeat on/off that stops running series),
  Community posts (go to "In review" until Pulsae approves), bank account, documents, notifications.
- Demo helpers: switch between customer and professional in Profile / Settings, "Demo: run this charge now", "Demo: simulate approval", Reset demo data.

## Simulated (not real yet)
Payments and payouts, SMS and email codes, document upload, push notifications, accounts and data on a server, admin panel,
Pulsae approval of posts and professionals. Arabic text is a first draft and needs review by a native speaker.

## Later: a real iPhone build without a Mac
npm install -g eas-cli, then eas build --platform ios. This needs an Apple Developer account.
