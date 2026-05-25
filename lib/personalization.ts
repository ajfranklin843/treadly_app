/**
 * Threadly Personalization Engine
 *
 * Reads the saved StyleProfile and derives all dynamic content:
 * - outfit recommendations (vibe-matched imagery)
 * - trend cards (vibe-matched imagery)
 * - deal cards (brand + vibe matched imagery)
 * - hero messaging
 * - section labels
 * - color accent hints
 *
 * Every image is now pulled from the vibe-specific pools in lib/images.ts.
 * No more generic/random fallbacks — every visual is identity-matched.
 */

import { useState, useEffect } from 'react';
import { getStyleProfile, StyleProfile } from '@/lib/onboarding-store';
import {
  VIBE_OUTFIT_POOL,
  VIBE_TREND_POOL,
  VIBE_DEAL_POOL,
  VIBE_STYLIST_POOL,
  VIBE_HERO_MAP as VIBE_HERO_IMAGE_MAP,
  pickVibeImage,
} from '@/lib/images';

// ─── Content Types ────────────────────────────────────────────────────────────

export interface OutfitCard {
  id: string;
  title: string;
  subtitle: string;
  occasion: string;
  matchPct: number;
  ownedPct: number;
  image: string;
  vibeTag: string;
  attribution: string;
}

export interface TrendCard {
  id: string;
  label: string;
  title: string;
  sub: string;
  image: string;
  vibeTag: string;
}

export interface DealCard {
  id: string;
  brand: string;
  item: string;
  original: number;
  sale: number;
  off: number;
  image: string;
  expiry: string;
  matchReason: string;
}

export interface PersonalizedContent {
  greeting: string;
  heroTagline: string;
  heroSubline: string;
  heroImage: string;        // vibe-matched full-bleed hero
  goNewLabel: string;
  sectionLabel: string;
  sectionTitle: string;
  trendSectionLabel: string;
  dealSectionLabel: string;
  insightText: string;
  outfits: OutfitCard[];
  trends: TrendCard[];
  deals: DealCard[];
  accentColor: string;
  isLoading: boolean;
}

// ─── Vibe → Outfit Content Maps (titles/metadata, images from pool) ───────────

const VIBE_OUTFIT_META: Record<string, Array<{ id: string; title: string; subtitle: string; occasion: string; matchPct: number; ownedPct: number; vibeTag: string; attribution: string }>> = {
  'Old Money': [
    { id: 'om1', title: 'The Boardroom Edit', subtitle: 'Tailored, quiet, authoritative', occasion: 'Work', matchPct: 96, ownedPct: 80, vibeTag: 'Old Money', attribution: 'because you love Old Money' },
    { id: 'om2', title: 'Quiet Luxury Sunday', subtitle: 'Cashmere, neutral, effortless', occasion: 'Casual', matchPct: 92, ownedPct: 75, vibeTag: 'Old Money', attribution: 'tailored to your aesthetic' },
    { id: 'om3', title: 'Heritage Tailoring', subtitle: 'Classic cuts, modern confidence', occasion: 'Events', matchPct: 88, ownedPct: 70, vibeTag: 'Old Money', attribution: 'your Old Money signature' },
  ],
  'Minimal': [
    { id: 'min1', title: 'The Clean Edit', subtitle: 'Crisp whites, sharp lines', occasion: 'Work', matchPct: 94, ownedPct: 82, vibeTag: 'Minimal', attribution: 'built around your minimal vibe' },
    { id: 'min2', title: 'Monochrome Moment', subtitle: 'One tone, total impact', occasion: 'Date Night', matchPct: 89, ownedPct: 70, vibeTag: 'Minimal', attribution: 'because you like Minimal' },
    { id: 'min3', title: 'Architectural Ease', subtitle: 'Structure as statement', occasion: 'Casual', matchPct: 86, ownedPct: 74, vibeTag: 'Minimal', attribution: 'your minimal signature' },
  ],
  'Clean Girl': [
    { id: 'cg1', title: 'Effortless Glow', subtitle: 'Glazed, dewy, polished', occasion: 'Casual', matchPct: 93, ownedPct: 78, vibeTag: 'Clean Girl', attribution: 'your Clean Girl signature' },
    { id: 'cg2', title: 'Sunday Brunch Look', subtitle: 'Linen, gold, neutral', occasion: 'Casual', matchPct: 91, ownedPct: 76, vibeTag: 'Clean Girl', attribution: 'curated for your aesthetic' },
    { id: 'cg3', title: 'Glazed Basics', subtitle: 'Effortless, natural, radiant', occasion: 'Work', matchPct: 87, ownedPct: 80, vibeTag: 'Clean Girl', attribution: 'because you love Clean Girl' },
  ],
  'Streetwear': [
    { id: 'sw1', title: 'Off-Duty Edge', subtitle: 'Oversized, layered, bold', occasion: 'Casual', matchPct: 90, ownedPct: 72, vibeTag: 'Streetwear', attribution: 'because you love Streetwear' },
    { id: 'sw2', title: 'Statement Layers', subtitle: 'Graphic, textured, expressive', occasion: 'Casual', matchPct: 87, ownedPct: 68, vibeTag: 'Streetwear', attribution: 'trending in your aesthetic' },
    { id: 'sw3', title: 'Urban Uniform', subtitle: 'Utility, comfort, attitude', occasion: 'Casual', matchPct: 84, ownedPct: 65, vibeTag: 'Streetwear', attribution: 'your streetwear signature' },
  ],
  'Chic': [
    { id: 'ch1', title: 'Parisian Edit', subtitle: 'Effortless French elegance', occasion: 'Date Night', matchPct: 95, ownedPct: 80, vibeTag: 'Chic', attribution: 'your Chic signature look' },
    { id: 'ch2', title: 'Evening Allure', subtitle: 'Draped, sculptural, confident', occasion: 'Events', matchPct: 91, ownedPct: 65, vibeTag: 'Chic', attribution: 'because you love Chic' },
    { id: 'ch3', title: 'City Night Edit', subtitle: 'Polished, dark, editorial', occasion: 'Date Night', matchPct: 88, ownedPct: 72, vibeTag: 'Chic', attribution: 'curated for your Chic vibe' },
  ],
  'Casual Luxury': [
    { id: 'cl1', title: 'Elevated Basics', subtitle: 'Premium comfort, refined', occasion: 'Casual', matchPct: 93, ownedPct: 82, vibeTag: 'Casual Luxury', attribution: 'built around Casual Luxury' },
    { id: 'cl2', title: 'Weekend Luxe', subtitle: 'Soft fabrics, sharp details', occasion: 'Casual', matchPct: 90, ownedPct: 78, vibeTag: 'Casual Luxury', attribution: 'your Casual Luxury picks' },
    { id: 'cl3', title: 'Quiet Weekend', subtitle: 'Understated, premium, easy', occasion: 'Casual', matchPct: 86, ownedPct: 74, vibeTag: 'Casual Luxury', attribution: 'because you love Casual Luxury' },
  ],
  'Vacation': [
    { id: 'vac1', title: 'Resort Ready', subtitle: 'Linen, sun, effortless', occasion: 'Vacation', matchPct: 94, ownedPct: 76, vibeTag: 'Vacation', attribution: 'your vacation signature' },
    { id: 'vac2', title: 'Golden Hour Look', subtitle: 'Warm tones, resort styling', occasion: 'Vacation', matchPct: 90, ownedPct: 72, vibeTag: 'Vacation', attribution: 'curated for your vacation vibe' },
    { id: 'vac3', title: 'Coastal Edit', subtitle: 'Breezy, light, aspirational', occasion: 'Casual', matchPct: 86, ownedPct: 68, vibeTag: 'Vacation', attribution: 'because you love Vacation' },
  ],
  'Soft Glam': [
    { id: 'sg1', title: 'Soft Power Look', subtitle: 'Feminine, polished, confident', occasion: 'Events', matchPct: 92, ownedPct: 74, vibeTag: 'Soft Glam', attribution: 'your Soft Glam signature' },
    { id: 'sg2', title: 'Blush Hour Edit', subtitle: 'Warm tones, feminine silhouettes', occasion: 'Date Night', matchPct: 89, ownedPct: 70, vibeTag: 'Soft Glam', attribution: 'curated for your Soft Glam vibe' },
    { id: 'sg3', title: 'Evening Radiance', subtitle: 'Luminous, draped, editorial', occasion: 'Events', matchPct: 85, ownedPct: 66, vibeTag: 'Soft Glam', attribution: 'because you love Soft Glam' },
  ],
};

const DEFAULT_OUTFIT_META = [
  { id: 'def1', title: 'The Boardroom Edit', subtitle: 'Curated for your 9am meeting', occasion: 'Work', matchPct: 94, ownedPct: 80, vibeTag: 'Curated', attribution: 'built around your wardrobe' },
  { id: 'def2', title: 'Evening Allure', subtitle: 'Effortless and elegant', occasion: 'Date Night', matchPct: 91, ownedPct: 72, vibeTag: 'Editorial', attribution: 'personalized for you' },
];

// ─── Vibe → Trend Content Maps ────────────────────────────────────────────────

const VIBE_TREND_META: Record<string, Array<{ id: string; label: string; title: string; sub: string; vibeTag: string }>> = {
  'Old Money': [
    { id: 't1', label: 'TRENDING IN YOUR AESTHETIC', title: 'Quiet Luxury', sub: 'Understated elegance is everywhere', vibeTag: 'Old Money' },
    { id: 't2', label: 'RISING', title: 'Heritage Tailoring', sub: 'Classic cuts, modern confidence', vibeTag: 'Old Money' },
    { id: 't3', label: 'THIS SEASON', title: 'Coastal Prep', sub: 'Nautical meets refined', vibeTag: 'Old Money' },
  ],
  'Minimal': [
    { id: 't4', label: 'TRENDING IN YOUR AESTHETIC', title: 'Clean Minimalism', sub: 'Less is always more', vibeTag: 'Minimal' },
    { id: 't5', label: 'RISING', title: 'Monochrome Dressing', sub: 'One color, total impact', vibeTag: 'Minimal' },
    { id: 't6', label: 'THIS WEEK', title: 'Architectural Shapes', sub: 'Structure as statement', vibeTag: 'Minimal' },
  ],
  'Clean Girl': [
    { id: 't7', label: 'TRENDING IN YOUR AESTHETIC', title: 'Glazed Skin Aesthetic', sub: 'Effortless, radiant, natural', vibeTag: 'Clean Girl' },
    { id: 't8', label: 'RISING', title: 'Quiet Basics', sub: 'Elevated everyday essentials', vibeTag: 'Clean Girl' },
    { id: 't9', label: 'THIS WEEK', title: 'Linen Season', sub: 'Breathable, minimal, chic', vibeTag: 'Clean Girl' },
  ],
  'Streetwear': [
    { id: 't10', label: 'TRENDING NOW', title: 'Gorpcore', sub: 'Utility meets high fashion', vibeTag: 'Streetwear' },
    { id: 't11', label: 'RISING', title: 'Oversized Everything', sub: 'Volume is the statement', vibeTag: 'Streetwear' },
    { id: 't12', label: 'THIS WEEK', title: 'Graphic Layers', sub: 'Expressive, bold, textured', vibeTag: 'Streetwear' },
  ],
  'Chic': [
    { id: 't13', label: 'TRENDING IN YOUR AESTHETIC', title: 'Parisian Edit', sub: 'Effortless French elegance', vibeTag: 'Chic' },
    { id: 't14', label: 'RISING', title: 'Monochrome Noir', sub: 'All-black editorial moment', vibeTag: 'Chic' },
    { id: 't15', label: 'THIS SEASON', title: 'Power Dressing', sub: 'Structured silhouettes return', vibeTag: 'Chic' },
  ],
  'Casual Luxury': [
    { id: 't16', label: 'TRENDING IN YOUR AESTHETIC', title: 'Elevated Basics', sub: 'Premium comfort, refined', vibeTag: 'Casual Luxury' },
    { id: 't17', label: 'RISING', title: 'Quiet Luxury', sub: 'Understated, premium, easy', vibeTag: 'Casual Luxury' },
    { id: 't18', label: 'THIS WEEK', title: 'Cashmere Season', sub: 'Soft, warm, aspirational', vibeTag: 'Casual Luxury' },
  ],
  'Vacation': [
    { id: 't19', label: 'TRENDING IN YOUR AESTHETIC', title: 'Resort Luxe', sub: 'Linen, sun, effortless', vibeTag: 'Vacation' },
    { id: 't20', label: 'RISING', title: 'Coastal Chic', sub: 'Breezy, editorial, aspirational', vibeTag: 'Vacation' },
    { id: 't21', label: 'THIS SEASON', title: 'Golden Hour Dressing', sub: 'Warm tones, resort styling', vibeTag: 'Vacation' },
  ],
  'Soft Glam': [
    { id: 't22', label: 'TRENDING IN YOUR AESTHETIC', title: 'Soft Power', sub: 'Feminine, polished, confident', vibeTag: 'Soft Glam' },
    { id: 't23', label: 'RISING', title: 'Blush Tones', sub: 'Warm, feminine, editorial', vibeTag: 'Soft Glam' },
    { id: 't24', label: 'THIS WEEK', title: 'Evening Glamour', sub: 'Luminous, draped, aspirational', vibeTag: 'Soft Glam' },
  ],
  'default': [
    { id: 'td1', label: 'TRENDING NOW', title: 'Quiet Luxury', sub: 'Understated elegance is everywhere', vibeTag: 'Trending' },
    { id: 'td2', label: 'THIS WEEK', title: 'Coastal Chic', sub: 'Breezy, effortless, editorial', vibeTag: 'Trending' },
    { id: 'td3', label: 'RISING', title: 'Power Dressing', sub: 'Structured silhouettes return', vibeTag: 'Trending' },
  ],
};

// ─── Brand → Deal Maps (images from vibe pool) ────────────────────────────────

const BRAND_DEAL_META: Record<string, Omit<DealCard, 'image'>> = {
  'Zara':      { id: 'zara',      brand: 'ZARA',      item: 'Oversized Blazer',    original: 110, sale: 59,  off: 46, expiry: '2h left',  matchReason: 'from your saved brands' },
  'H&M':       { id: 'hm',        brand: 'H&M',        item: 'Linen Shirt Dress',   original: 60,  sale: 32,  off: 47, expiry: '12h left', matchReason: 'from your saved brands' },
  'Mango':     { id: 'mango',     brand: 'MANGO',      item: 'Straight-Leg Jeans',  original: 80,  sale: 44,  off: 45, expiry: '24h left', matchReason: 'from your saved brands' },
  'Aritzia':   { id: 'aritzia',   brand: 'ARITZIA',    item: 'Wilfred Blazer',      original: 198, sale: 118, off: 40, expiry: '48h left', matchReason: 'from your saved brands' },
  'COS':       { id: 'cos',       brand: 'COS',        item: 'Relaxed Trousers',    original: 95,  sale: 55,  off: 42, expiry: '6h left',  matchReason: 'from your saved brands' },
  'Everlane':  { id: 'everlane',  brand: 'EVERLANE',   item: 'The Cashmere Crew',   original: 130, sale: 78,  off: 40, expiry: '3h left',  matchReason: 'from your saved brands' },
  'Uniqlo':    { id: 'uniqlo',    brand: 'UNIQLO',     item: 'Merino Turtleneck',   original: 50,  sale: 29,  off: 42, expiry: '18h left', matchReason: 'from your saved brands' },
  'Nordstrom': { id: 'nordstrom', brand: 'NORDSTROM',  item: 'Wrap Midi Dress',     original: 145, sale: 87,  off: 40, expiry: '36h left', matchReason: 'from your saved brands' },
  'ALDO':      { id: 'aldo',      brand: 'ALDO',       item: 'Slingback Heels',     original: 95,  sale: 55,  off: 42, expiry: '8h left',  matchReason: 'from your saved brands' },
  'Revolve':   { id: 'revolve',   brand: 'REVOLVE',    item: 'Slip Midi Dress',     original: 168, sale: 98,  off: 42, expiry: '5h left',  matchReason: 'from your saved brands' },
  'Skims':     { id: 'skims',     brand: 'SKIMS',      item: 'Lounge Set',          original: 88,  sale: 52,  off: 41, expiry: '10h left', matchReason: 'from your saved brands' },
};

const DEFAULT_DEAL_META: Array<Omit<DealCard, 'image'>> = [
  { id: 'dd1', brand: 'ZARA',  item: 'Oversized Blazer',   original: 110, sale: 59, off: 46, expiry: '2h left',  matchReason: 'trending this week' },
  { id: 'dd2', brand: 'MANGO', item: 'Straight-Leg Jeans', original: 80,  sale: 44, off: 45, expiry: '24h left', matchReason: 'matches your style' },
  { id: 'dd3', brand: 'ALDO',  item: 'Slingback Heels',    original: 95,  sale: 55, off: 42, expiry: '8h left',  matchReason: 'top pick for you' },
];

// ─── Messaging Maps ───────────────────────────────────────────────────────────

const VIBE_MESSAGING_MAP: Record<string, {
  tagline: string; subline: string; sectionTitle: string;
  trendLabel: string; dealLabel: string; insightText: string;
}> = {
  'Old Money': {
    tagline: 'Your Quiet Luxury edit is ready.',
    subline: 'Tailored around your wardrobe.',
    sectionTitle: 'Old Money picks for you',
    trendLabel: 'TRENDING IN YOUR AESTHETIC',
    dealLabel: 'DEALS FROM YOUR BRANDS',
    insightText: 'You have 4 pieces that anchor the Quiet Luxury trend. Add a camel coat and you\'re complete.',
  },
  'Minimal': {
    tagline: 'Your Minimal edit is curated.',
    subline: 'Clean lines, built around you.',
    sectionTitle: 'Minimal luxury picks for you',
    trendLabel: 'TRENDING IN YOUR AESTHETIC',
    dealLabel: 'DEALS FROM YOUR BRANDS',
    insightText: 'Your wardrobe is 78% neutral — you\'re perfectly positioned for the Monochrome Dressing trend.',
  },
  'Clean Girl': {
    tagline: 'Your Clean Girl looks are ready.',
    subline: 'Glazed, effortless, curated.',
    sectionTitle: 'Clean Girl picks for you',
    trendLabel: 'TRENDING IN YOUR AESTHETIC',
    dealLabel: 'DEALS FROM YOUR BRANDS',
    insightText: 'You already own the foundation for 3 trending Clean Girl looks. One gold accessory completes each.',
  },
  'Streetwear': {
    tagline: 'Your street edit is live.',
    subline: 'Bold, layered, built for you.',
    sectionTitle: 'Streetwear picks for you',
    trendLabel: 'TRENDING IN YOUR AESTHETIC',
    dealLabel: 'DEALS FROM YOUR BRANDS',
    insightText: 'Gorpcore is surging in your aesthetic. You own 70% of the look — missing a utility vest.',
  },
  'Chic': {
    tagline: 'Your Chic edit is ready.',
    subline: 'Parisian elegance, personalized.',
    sectionTitle: 'Chic picks for you',
    trendLabel: 'TRENDING IN YOUR AESTHETIC',
    dealLabel: 'DEALS FROM YOUR BRANDS',
    insightText: 'The Parisian Edit trend matches 5 pieces in your wardrobe. A silk scarf is your missing piece.',
  },
  'Casual Luxury': {
    tagline: 'Your Casual Luxury edit is ready.',
    subline: 'Premium comfort, curated for you.',
    sectionTitle: 'Casual Luxury picks for you',
    trendLabel: 'TRENDING IN YOUR AESTHETIC',
    dealLabel: 'DEALS FROM YOUR BRANDS',
    insightText: 'Elevated basics are your signature. You\'re 85% ready for the Quiet Luxury moment.',
  },
  'Vacation': {
    tagline: 'Your vacation edit is ready.',
    subline: 'Resort-curated, built for you.',
    sectionTitle: 'Vacation picks for you',
    trendLabel: 'TRENDING IN YOUR AESTHETIC',
    dealLabel: 'DEALS FROM YOUR BRANDS',
    insightText: 'Resort Luxe is trending in your aesthetic. You\'re 80% ready — a linen set completes the look.',
  },
  'Soft Glam': {
    tagline: 'Your Soft Glam edit is ready.',
    subline: 'Feminine, polished, curated.',
    sectionTitle: 'Soft Glam picks for you',
    trendLabel: 'TRENDING IN YOUR AESTHETIC',
    dealLabel: 'DEALS FROM YOUR BRANDS',
    insightText: 'Soft Power dressing is rising in your aesthetic. You own 75% of the look.',
  },
  'default': {
    tagline: 'Your personalized edit is ready.',
    subline: 'Curated around your wardrobe.',
    sectionTitle: 'Curated picks for you',
    trendLabel: 'TRENDING NOW',
    dealLabel: 'DEAL ALERTS',
    insightText: 'You already own 80% of today\'s top look. Add one piece to complete the edit.',
  },
};

// ─── Occasion → Go New Label ──────────────────────────────────────────────────

function buildGoNewLabel(occasions: string[]): string {
  if (occasions.includes('Date Night')) return 'Build a look for Date Night →';
  if (occasions.includes('Work')) return 'Build a look for Work →';
  if (occasions.includes('Vacation')) return 'Build a vacation look →';
  if (occasions.includes('Events')) return 'Build a look for your next event →';
  if (occasions.includes('Casual')) return 'Build a fresh everyday look →';
  return 'Build a fresh look from your closet →';
}

function buildGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning.';
  if (hour < 17) return 'Good afternoon.';
  return 'Good evening.';
}

// ─── Main Derivation Function ─────────────────────────────────────────────────

function deriveContent(profile: StyleProfile): Omit<PersonalizedContent, 'isLoading'> {
  const primaryVibe = profile.styleVibes[0] ?? 'default';
  const messaging = VIBE_MESSAGING_MAP[primaryVibe] ?? VIBE_MESSAGING_MAP['default'];

  // Hero image — vibe-matched
  const heroImage = VIBE_HERO_IMAGE_MAP[primaryVibe] ?? VIBE_HERO_IMAGE_MAP['default'];

  // Outfits — vibe-matched metadata + vibe-matched images from pool
  const outfitMeta = VIBE_OUTFIT_META[primaryVibe] ?? DEFAULT_OUTFIT_META;
  const outfits: OutfitCard[] = outfitMeta.map((meta, i) => ({
    ...meta,
    image: pickVibeImage(VIBE_OUTFIT_POOL, primaryVibe, i),
  }));

  // Trends — vibe-matched metadata + vibe-matched images from pool
  const trendMeta = VIBE_TREND_META[primaryVibe] ?? VIBE_TREND_META['default'];
  const trends: TrendCard[] = trendMeta.map((meta, i) => ({
    ...meta,
    image: pickVibeImage(VIBE_TREND_POOL, primaryVibe, i),
  }));

  // Deals — brand-matched metadata + vibe-matched images
  const brandDeals = profile.favoriteBrands
    .map((b, i) => {
      const meta = BRAND_DEAL_META[b];
      if (!meta) return null;
      return { ...meta, image: pickVibeImage(VIBE_DEAL_POOL, primaryVibe, i) } as DealCard;
    })
    .filter(Boolean)
    .slice(0, 4) as DealCard[];

  const deals = brandDeals.length >= 2
    ? brandDeals
    : DEFAULT_DEAL_META.map((meta, i) => ({
        ...meta,
        image: pickVibeImage(VIBE_DEAL_POOL, primaryVibe, i),
      }));

  // Accent color
  const prefersBlush = profile.colorPreferences.some(c =>
    ['blush', 'pastels', 'blush & rose'].includes(c.toLowerCase())
  );

  return {
    greeting: buildGreeting(),
    heroTagline: messaging.tagline,
    heroSubline: messaging.subline,
    heroImage,
    goNewLabel: buildGoNewLabel(profile.occasions),
    sectionLabel: 'CURATED FOR YOUR STYLE',
    sectionTitle: messaging.sectionTitle,
    trendSectionLabel: messaging.trendLabel,
    dealSectionLabel: messaging.dealLabel,
    insightText: messaging.insightText,
    outfits,
    trends,
    deals,
    accentColor: prefersBlush ? '#E8B89A' : '#C9956A',
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePersonalization(): PersonalizedContent {
  const [content, setContent] = useState<PersonalizedContent>({
    greeting: buildGreeting(),
    heroTagline: 'Your personalized edit is ready.',
    heroSubline: 'Curated around your wardrobe.',
    heroImage: VIBE_HERO_IMAGE_MAP['default'],
    goNewLabel: 'Build a fresh look from your closet →',
    sectionLabel: 'CURATED FOR YOUR STYLE',
    sectionTitle: 'Curated picks for you',
    trendSectionLabel: 'TRENDING NOW',
    dealSectionLabel: 'DEAL ALERTS',
    insightText: 'You already own 80% of today\'s top look.',
    outfits: DEFAULT_OUTFIT_META.map((meta, i) => ({
      ...meta,
      image: pickVibeImage(VIBE_OUTFIT_POOL, 'default', i),
    })),
    trends: (VIBE_TREND_META['default'] ?? []).map((meta, i) => ({
      ...meta,
      image: pickVibeImage(VIBE_TREND_POOL, 'default', i),
    })),
    deals: DEFAULT_DEAL_META.map((meta, i) => ({
      ...meta,
      image: pickVibeImage(VIBE_DEAL_POOL, 'default', i),
    })),
    accentColor: '#C9956A',
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;
    getStyleProfile().then(profile => {
      if (!mounted) return;
      const derived = deriveContent(profile);
      setContent({ ...derived, isLoading: false });
    });
    return () => { mounted = false; };
  }, []);

  return content;
}
