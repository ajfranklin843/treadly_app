# Threadly App TODO

## Phase 1 — Foundation & Design System
- [x] Rename app from Treadly to Threadly across all files
- [x] Update theme.config.js with Threadly luxury dark palette
- [x] Update tailwind.config.js with Threadly design tokens
- [x] Create global.css with Threadly CSS variables
- [x] Create ThreadlyColors, ThreadlySpacing, ThreadlyRadius, ThreadlyShadow constants
- [x] Create reusable UI components (TText, TCard, TButton, TPill, TDivider)
- [x] Generate Threadly app icon (rose gold T + needle monogram on black)
- [x] Update app.config.ts with Threadly branding and logo URL

## Phase 2 — Navigation Architecture
- [x] Set up onboarding stack (no tab bar, slide transitions)
- [x] Set up 5-tab main navigation (Home, Closet, Go New FAB, Shop, Stylist)
- [x] Style tab bar with dark luxury aesthetic + rose gold center FAB
- [x] Set up onboarding state management (AsyncStorage)
- [x] Root _layout.tsx routing logic (onboarding vs main app)

## Phase 3 — Onboarding Flow
- [x] Splash screen with animated Threadly logo
- [x] Welcome screen (hero tagline, CTA)
- [x] Step 1: Style Vibe (8 aesthetic archetypes, multi-select)
- [x] Step 2: Occasions (chip selection)
- [x] Step 3: Favorite Brands (brand grid)
- [x] Step 4: Budget Range (slider)
- [x] Step 5: Color Preferences (swatch grid)
- [x] Step 6: Closet Size + animated profile build + complete routing

## Phase 4 — Main App Screens
- [x] Home screen — AI Stylist greeting, Today's Look card, AI Recommendations, Deals
- [x] Go New screen — Idle, Building animation, Ready state with missing pieces
- [x] Closet screen — Digital wardrobe grid, category filters, Closet Analysis
- [x] Looks/Stylist screen — Occasion tabs, outfit cards with match %, AI Stylist conversational chat
- [x] Shop screen — AI Shopping Engine, Price Comparison, Deals, Trend Matches

## Phase 5 — Testing
- [x] Unit tests for onboarding store (7 tests passing)
- [x] Unit tests for design tokens (5 tests passing)

## Future Enhancements
- [ ] Closet scan camera flow (add item via camera)
- [x] AI Stylist conversational screen (Stylist tab) — suggestion chips, recommendation cards, typing indicator
- [ ] Profile / settings screen
- [ ] Haptic feedback on key interactions
- [ ] Animated transitions between onboarding steps
- [ ] Real AI integration via server LLM for outfit generation
- [ ] Backend persistence of style profile (cross-device sync)
- [ ] Push notifications for daily look and deals
- [ ] Social sharing / virality features
- [ ] Virtual try-on feature
