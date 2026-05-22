# ToonCraft Pro — React Native Setup Guide

## Prerequisites

- Node.js 18+
- React Native CLI (`npm install -g react-native-cli`)
- Android Studio (for Android) / Xcode 14+ (for iOS)
- JDK 17 (for Android)

---

## Installation

```bash
cd ToonCraftPro
npm install
```

### iOS (Mac only)
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

---

## Required Native Linking (Auto-linked in RN 0.73+)

All packages use auto-linking. Manual steps needed for:

### 1. react-native-vector-icons
Add to `android/app/build.gradle`:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

For iOS, add fonts in `Info.plist`:
```xml
<key>UIAppFonts</key>
<array>
  <string>MaterialCommunityIcons.ttf</string>
  <string>Ionicons.ttf</string>
</array>
```

### 2. react-native-linear-gradient
iOS: `pod install` handles it automatically.
Android: Auto-linked.

### 3. react-native-reanimated
Add to `babel.config.js` (already done):
```js
plugins: ['react-native-reanimated/plugin']
```

### 4. RevenueCat (Subscriptions)
Replace `YOUR_REVENUECAT_KEY` in `src/utils/constants.ts` with your actual key.
Configure products in App Store Connect / Google Play Console:
- Monthly: `tooncraftpro_monthly_99` — ₹99/month
- Yearly: `tooncraftpro_yearly_799` — ₹799/year

---

## App Store / Play Store Configuration

### android/app/src/main/AndroidManifest.xml
Add these permissions:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

### iOS Info.plist
Add usage descriptions:
```xml
<key>NSCameraUsageDescription</key>
<string>ToonCraft Pro uses your camera to capture video for your cartoon projects</string>
<key>NSMicrophoneUsageDescription</key>
<string>ToonCraft Pro needs microphone access for voice recording</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>ToonCraft Pro needs access to your photos to import media</string>
```

---

## App Store Optimization (ASO) Keywords

**Primary Keywords:**
cartoon video maker, animated video creator, cartoon animation app, toon maker, video cartoon filter

**Secondary Keywords:**
anime video maker, comic animation, cartoon effects, animated reels creator, story video maker

**App Store Category:** Photo & Video  
**Google Play Category:** Creativity

---

## Production Checklist

- [ ] Replace RevenueCat API key
- [ ] Configure actual video export (FFmpeg or native)
- [ ] Set up cloud storage (AWS S3 / Firebase)
- [ ] Configure push notifications (Firebase / APNs)
- [ ] Add analytics (Firebase Analytics / Mixpanel)
- [ ] Set up crash reporting (Sentry / Crashlytics)
- [ ] Add AI background removal (remove.bg API / TensorFlow Lite)
- [ ] Integrate AI scene generation (Stable Diffusion API)
- [ ] Add lip sync (Ready Player Me API)
- [ ] Set up CDN for character/template assets
- [ ] App signing (keystore for Android, certificates for iOS)
- [ ] Privacy Policy & Terms of Service URLs
- [ ] GDPR/compliance review

---

## Architecture Overview

```
src/
├── App.tsx                    # Root component with loading
├── navigation/               # React Navigation setup
│   ├── RootNavigator.tsx     # Stack navigator
│   ├── MainTabNavigator.tsx  # Bottom tab navigator
│   └── types.ts              # Navigation type definitions
├── store/                    # Zustand state management
│   ├── useAppStore.ts        # User, preferences, theme
│   ├── useProjectStore.ts    # Projects, editor state
│   └── useSubscriptionStore.ts # Plans, billing
├── screens/                  # Full-screen views
│   ├── Onboarding/           # 5-slide onboarding flow
│   ├── Home/                 # Dashboard with quick actions
│   ├── Editor/               # Full-featured video editor
│   ├── Templates/            # Template browser & preview
│   ├── Projects/             # Project manager
│   ├── Subscription/         # Pro plans & payment
│   └── Profile/              # Settings & account
├── components/
│   ├── ui/                   # Reusable: Button, Card, Badge, etc.
│   └── editor/               # Editor-specific panels
│       ├── Canvas.tsx        # Video preview canvas
│       ├── Timeline.tsx      # Multi-track timeline
│       ├── ToolBar.tsx       # Tool selection
│       ├── EffectsPanel.tsx  # Cartoon effects & styles
│       ├── AudioPanel.tsx    # Music, SFX, voice recording
│       ├── TextPanel.tsx     # Typography editor
│       ├── CharacterPanel.tsx # Character library
│       ├── StickersPanel.tsx # Sticker picker
│       └── TransitionsPanel.tsx # Scene transitions
├── hooks/
│   ├── useOrientation.ts     # Portrait/landscape detection
│   ├── useVideoEditor.ts     # Editor convenience hook
│   ├── useSubscription.ts    # Pro gating hook
│   └── useAnimation.ts      # Reanimated helpers
├── services/
│   ├── VideoService.ts       # Export pipeline
│   ├── CartoonEffectsService.ts # Effect presets
│   └── StorageService.ts    # AsyncStorage wrapper
├── theme/                   # Design system
│   ├── colors.ts            # 50+ color tokens
│   ├── typography.ts        # Type scale
│   └── spacing.ts           # Spacing & shadows
├── types/                   # TypeScript interfaces
│   └── index.ts             # All app types
└── utils/
    ├── constants.ts         # App constants & config
    ├── helpers.ts           # Pure utility functions
    └── formatters.ts        # Date/number formatters
```

---

## Monetization Strategy

| Tier | Price | Target |
|------|-------|--------|
| Free | ₹0 one-time | Discovery, virality |
| Pro Monthly | ₹99/month | Casual creators |
| Pro Yearly | ₹799/year | Power users (33% savings) |

**Revenue Projections** (with 10K downloads/month):
- 5% conversion × 10K = 500 Pro users
- 500 × ₹99 = ₹49,500/month
- Yearly users at 40%: ₹799 × 200 = ₹159,800/year additional

---

## Play Store Ranking Tips

1. ✅ Target keywords: "cartoon video maker", "anime video creator"
2. ✅ High-quality screenshots showing 4K export & AI features
3. ✅ Response to reviews within 24 hours
4. ✅ Update every 2-4 weeks with new templates
5. ✅ In-app sharing buttons → organic growth
6. ✅ Referral program (future)
7. ✅ A/B test store listing screenshots
8. ✅ Localize to Hindi, Tamil, Telugu (India-first)
