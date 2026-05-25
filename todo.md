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

## Phase 6 — Visual Polish Sprint (Deck Fidelity)
- [x] Rebuild Home screen — THREADLY wordmark hero, 340px outfit image, Go New CTA, trend cards, deal alerts, AI insight
- [x] Rebuild Go New screen — animated progress orb, outfit flat lay with 80% badge, missing pieces with images
- [x] Rebuild Closet screen — scan CTA, AI analysis card, color DNA, brand bars, categorized image grid
- [x] Rebuild Shop screen — deal cards with imagery, price comparison, brand carousel, savings badge
- [x] Rebuild Stylist screen — conversational chat, typing indicator, recommendation cards, suggestion chips
- [x] Update tab bar — dark luxury bar, rose gold Go New FAB, spaced labels
- [x] Update icon mappings — checkroom, local-mall, auto-awesome for all 5 tabs

## Phase 7 — Onboarding Polish Sprint
- [ ] Welcome / Brand Intro screen — cinematic hero, THREADLY wordmark, luxury feel
- [ ] Step 1: Style Vibes — large visual cards with fashion imagery, multi-select
- [ ] Step 2: Favorite Brands — visual brand grid, selectable cards
- [ ] Step 3: Shopping Personality — 4 personality archetypes with editorial imagery
- [ ] Step 4: Occasions — chip grid with icons, multi-select
- [ ] Step 5: Color + Aesthetic Preferences — visual swatch grid
- [ ] Step 6: AI Profile Build — animated progress moment "building your style profile"
- [ ] Step 7: First AI Look Reveal — "You already own 80% of this look" emotional hook
- [ ] Shared progress indicator component across all steps
- [ ] Smooth slide transitions between all steps
- [ ] Root layout anchor updated to onboarding

## Phase 7 — Onboarding Polish Sprint (COMPLETED)
- [x] Welcome / Brand Intro — cinematic full-bleed hero, THREADLY wordmark, feature pills, animated sequence
- [x] Step 1: Style Vibes — 8 large visual image cards with fashion photography, multi-select with rose-gold check
- [x] Step 2: Favorite Brands — 15 brand cards with brand colors, selectable grid
- [x] Step 3: Shopping Personality — 4 editorial archetype cards with imagery and trait pills
- [x] Step 4: Occasions — 12-item chip grid with emoji icons, multi-select
- [x] Step 5: Color + Aesthetic Preferences — 8 palette cards with color swatches, multi-select
- [x] Step 6: AI Profile Build — animated orb, 7-step build sequence, progress bar, routes to main app
- [x] Smooth slide/fade transitions between all steps via _layout.tsx
- [x] Progress bar (7 dots) on all steps
- [x] Root layout anchor set to onboarding
- [x] TypeScript clean, 12 tests passing

## Phase 8 — Deep Personalization Layer
- [x] Build personalization engine hook (usePersonalization) deriving all dynamic content from StyleProfile
- [x] Vibe → outfit recommendations map (Old Money, Minimal, Clean Girl, Streetwear, Chic, Casual Luxury)
- [x] Vibe → trend cards map with aesthetic-specific labels
- [x] Brand → deal cards map (Zara, H&M, Mango, Aritzia, COS, Everlane, Uniqlo, Nordstrom, ALDO)
- [x] Vibe → hero messaging map (tagline, subline, section titles, insight text)
- [x] Occasion → Go New label derivation
- [x] Time-aware greeting (Good morning/afternoon/evening)
- [x] Home screen: shimmer loading states while profile loads
- [x] Home screen: dynamic hero greeting, curated section labels, profile-matched outfit cards
- [x] Home screen: "because you like X" attribution labels on cards
- [x] Home screen: trend cards filtered by style vibes
- [x] Home screen: deal cards filtered by favorite brands
- [x] Home screen: color palette accent matching user's color preferences
- [x] Home screen: AI insight card with profile-specific text
- [x] Go New screen: personalized build steps with occasion and brand names
- [x] Shop screen: deal cards from profile brands, filter tabs from occasions, dynamic section labels
- [x] Stylist screen: personalized greeting message, profile-aware suggestion chips, dynamic status line

## Phase 9 — Premium Micro-Interactions
- [ ] Build shared animation utilities (useScalePress, useFadeIn, useGlowPulse)
- [ ] Build AnimatedPressable component with scale + haptic
- [ ] Build AnimatedCard component with press state + rose-gold glow border
- [ ] Home: outfit card press scale (0.97) + haptic light
- [ ] Home: image fade-in on load (opacity 0→1, 300ms)
- [ ] Home: heart save animation (scale burst + rose-gold fill)
- [ ] Home: Go New CTA animated pulse glow
- [ ] Home: deal card press state with scale + opacity
- [ ] Home: trend card horizontal scroll with momentum feel
- [ ] Go New: start button animated press + glow ring
- [ ] Go New: step completion checkmark animate in
- [ ] Go New: outfit reveal fade-in with stagger
- [ ] Go New: missing piece cards stagger entrance
- [ ] Shop: deal card press scale + haptic
- [ ] Shop: brand card press glow
- [ ] Shop: filter tab active state animated underline
- [ ] Closet: wardrobe item press scale
- [ ] Closet: category filter animated active state
- [ ] Stylist: send button press animation
- [ ] Stylist: message bubble fade-in entrance
- [ ] Stylist: suggestion chip press scale
- [ ] Tab bar: active tab icon scale bounce on select
- [ ] Go New FAB: continuous subtle pulse animation

## Phase 9 — Completed Items
- [x] Build shared animation utilities library (lib/animations.ts) — useScalePress (accepts any scale), useImageFade, useGlowPulse, useStaggerEntrance, hapticLight, hapticSuccess
- [x] Build AnimatedPressable and AnimatedCard shared components (components/ui/animated-pressable.tsx)
- [x] Home screen: AnimatedCard for outfit hero with scale press + rose-gold glow border
- [x] Home screen: Heart save button with burst animation and haptic
- [x] Home screen: Go New CTA with pulsing glow ring animation
- [x] Home screen: Image fade-in on all outfit and trend card images
- [x] Home screen: Stagger entrance animation for curated picks
- [x] Home screen: Deal card press states with scale + glow
- [x] Go New screen: AnimatedPromptChip with scale press + haptic
- [x] Go New screen: GoNewStartButton with scale press + glow ring pulse
- [x] Go New screen: MissingPieceCard with scale press + rose-gold glow border
- [x] Go New screen: ReadyActionButton with scale press + gradient
- [x] Shop screen: DealCard with scale press + image fade-in + glow border + animated View Deal button
- [x] Closet screen: AnimatedScanCard with scale press + rose-gold glow border
- [x] Closet screen: AnimatedItemCard with scale press for all wardrobe grid items
- [x] Closet screen: Category tab press states with haptic
- [x] Stylist screen: AnimatedChip with scale press for suggestion chips
- [x] Stylist screen: AnimatedSendButton with scale press + gradient activation
- [x] Stylist screen: AnimatedRecoCard with scale press + image fade-in
- [x] TypeScript clean (0 errors), 12 tests passing

## Phase 10 — Closet Scan Signature Experience
- [ ] Read Expo camera + image-picker docs for correct SDK 54 usage
- [ ] Build ScanModal component — luxury dark camera UI with framing guides, source picker (camera / photo library / inspiration)
- [ ] Build AI analysis animation — scan line sweep, glow pulse, step-by-step intelligence reveal (brand, color, category, style tags, outfit compatibility)
- [ ] Build item reveal card — Color DNA swatch, Style Match score, Pairs Well section, outfit count, "Trending in your aesthetic"
- [ ] Animate item card into Closet grid on confirmation
- [ ] Wire ScanModal into Closet screen "Scan a New Item" CTA
- [ ] Update Closet wardrobe grid to accept dynamically added items
- [ ] TypeScript clean, tests passing

## Phase 11 — Cohesive Feminine Editorial Image System
- [ ] Build centralized ThreadlyImages library (lib/images.ts) with curated Unsplash URLs
- [ ] Home: hero outfit card, curated picks, trend cards, deal cards — all with feminine editorial imagery
- [ ] Go New: outfit flat lay, missing pieces product shots — cohesive aesthetic
- [ ] Closet: wardrobe grid items, scan examples — feminine wardrobe editorial
- [ ] Shop: deal card product images, brand imagery, trending picks — luxury feminine shopping
- [ ] Stylist: recommendation card images — editorial fashion previews
- [ ] Onboarding: style vibe cards (Minimal, Clean Girl, Old Money, etc.) — editorial fashion photography
- [ ] Consistent aspect ratios, rounded corners, fade-in loading across all image surfaces
- [ ] TypeScript clean, tests passing

## Phase 12 — Closet Scan + Refinements

- [x] Build ClosetScanModal — camera/gallery picker, AI analysis cinematic sequence, item reveal card
- [x] Wire scan modal into Closet screen with wardrobe grid insertion animation
- [x] Add wardrobe intelligence panel (pairs well, outfit count, aesthetic match)
- [ ] Dynamic vibe-matched imagery on Home outfit picks (Old Money, Chic, Clean Girl, etc.)
- [x] Reset onboarding long-press shortcut on THREADLY wordmark with haptic + glow
- [ ] Premium image motion polish (parallax, fade-in, shimmer, card entrance animations)
