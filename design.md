# THREADLY — Design System & App Architecture

## Brand Identity

**Tagline:** "The AI stylist that shops smarter."
**Positioning:** AI stylist · smart shopping assistant · confidence engine · trend discovery platform · personal commerce OS

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--threadly-black` | `#0A0A0A` | Primary background, deep surfaces |
| `--threadly-charcoal` | `#1A1A1A` | Card backgrounds, elevated surfaces |
| `--threadly-charcoal-mid` | `#252525` | Secondary cards, borders |
| `--threadly-rose-gold` | `#C9956A` | Primary accent, CTAs, highlights |
| `--threadly-rose-gold-light` | `#E8B89A` | Hover states, soft accents |
| `--threadly-blush` | `#F2D4C8` | Soft backgrounds, pill tags |
| `--threadly-blush-deep` | `#D4A090` | Secondary accent |
| `--threadly-warm-white` | `#FAF7F4` | Text on dark, light surfaces |
| `--threadly-warm-white-muted` | `#C8C0B8` | Muted text, captions |
| `--threadly-gradient-start` | `#C9956A` | Rose gold gradient |
| `--threadly-gradient-end` | `#E8B89A` | Rose gold gradient end |

### Typography

- **Display / Hero:** Cormorant Garamond (serif) — elegant, editorial
- **Headlines:** Playfair Display (serif) — premium, fashion-forward
- **Body / UI:** DM Sans (sans-serif) — clean, modern, readable
- **Captions / Labels:** DM Sans Medium — structured, minimal

### Spacing System

- Base unit: 4px
- Component padding: 16px / 20px / 24px
- Section gaps: 32px / 48px
- Screen horizontal padding: 20px
- Card border radius: 16px / 20px / 24px
- Pill border radius: 100px

---

## Screen List

### Auth / Onboarding Group (no tab bar)
1. **Splash Screen** — animated logo, tagline
2. **Welcome Screen** — brand intro, CTA
3. **Onboarding Step 1: Style Vibe** — aesthetic selection cards
4. **Onboarding Step 2: Occasions** — occasion chips
5. **Onboarding Step 3: Favorite Brands** — brand logo grid
6. **Onboarding Step 4: Budget Range** — slider + range picker
7. **Onboarding Step 5: Color Preferences** — color swatch grid
8. **Onboarding Step 6: Sizes** — size input form
9. **Onboarding Complete** — personalization ready screen

### Main App (5-tab navigation)
10. **Home Feed** — AI discovery feed, Go New CTA, trend cards
11. **Closet** — wardrobe grid, scan CTA, AI analysis
12. **Go New** — signature feature, cinematic AI outfit builder
13. **Shop** — deal engine, brand discovery, price comparison
14. **Profile / Saved** — saved looks, moodboards, stylist chat

### Overlay / Modal Screens
15. **Closet Scan Flow** — camera → AI processing → wardrobe result
16. **Outfit Detail** — full outfit card, owned items, missing pieces
17. **AI Stylist Chat** — conversational stylist interface
18. **Deal Detail** — price comparison, brand cards
19. **Saved Looks / Collections** — moodboard grid

---

## Navigation Structure

```
Root Stack
├── Onboarding Stack (no tabs)
│   ├── splash
│   ├── welcome
│   ├── onboarding/[step] (1-6)
│   └── onboarding/complete
└── Main Tabs
    ├── (home) — Home Feed
    ├── (closet) — My Closet
    ├── (go-new) — Go New [CENTER TAB, prominent]
    ├── (shop) — Shop & Deals
    └── (profile) — Saved & Profile
```

### Tab Bar Design
- Dark background `#0A0A0A` with subtle top border in rose gold
- Center tab "Go New" is elevated with rose gold glow pill
- Active tab: rose gold icon + label
- Inactive tab: warm white muted

---

## Key User Flows

### Flow 1: First Launch → Personalized Home
Splash → Welcome → Onboarding (6 steps) → Onboarding Complete → Home Feed

### Flow 2: Go New (Signature Feature)
Home Feed (tap "Go New") → Go New Screen → AI Processing Animation → Outfit Result → Missing Pieces → Shop Deal

### Flow 3: Closet Scan
Closet Tab → Scan CTA → Camera/Upload → AI Processing → Categorization Result → Wardrobe Updated

### Flow 4: AI Stylist Chat
Profile Tab → Stylist Chat → Conversational Query → Outfit Suggestion → Add to Saved / Shop

### Flow 5: Shopping Discovery
Shop Tab → Browse Deals → Deal Detail → Price Comparison → View Deal (external)

---

## Interaction Philosophy

- **Micro-animations:** Every tap, swipe, and transition has a subtle, elegant response
- **Haptic feedback:** Light haptics on selection, medium on Go New activation
- **Progressive disclosure:** Show the most important information first; reveal depth on interaction
- **Emotional design:** Copy and UI reinforce confidence ("You already own 80% of this look")
- **Zero clutter:** One primary action per screen; secondary actions are accessible but not competing
