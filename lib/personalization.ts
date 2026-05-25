/**
 * Threadly Personalization Engine
 *
 * Reads the saved StyleProfile and derives all dynamic content:
 * - outfit recommendations
 * - trend cards
 * - deal cards
 * - hero messaging
 * - section labels
 * - color accent hints
 *
 * The intelligence should feel invisible, emotional, and effortless.
 */

import { useState, useEffect } from 'react';
import { getStyleProfile, StyleProfile, defaultProfile } from '@/lib/onboarding-store';

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
  attribution: string; // "because you like Old Money"
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
  matchReason: string; // "from your saved brands"
}

export interface PersonalizedContent {
  greeting: string;           // "Good morning, Sofia."
  heroTagline: string;        // "Your Minimal Luxury edit is ready."
  heroSubline: string;        // "Curated around your wardrobe."
  goNewLabel: string;         // "Build a look for Date Night →"
  sectionLabel: string;       // "CURATED FOR YOUR STYLE"
  sectionTitle: string;       // "Minimal Luxury picks for you"
  trendSectionLabel: string;  // "TRENDING IN YOUR AESTHETIC"
  dealSectionLabel: string;   // "DEALS FROM YOUR BRANDS"
  insightText: string;        // "You have 3 pieces that match the Quiet Luxury trend..."
  outfits: OutfitCard[];
  trends: TrendCard[];
  deals: DealCard[];
  accentColor: string;        // rose gold or blush depending on palette prefs
  isLoading: boolean;
}

// ─── Vibe → Content Maps ──────────────────────────────────────────────────────

const VIBE_OUTFIT_MAP: Record<string, OutfitCard[]> = {
  'Old Money': [
    {
      id: 'om1',
      title: 'The Boardroom Edit',
      subtitle: 'Tailored, quiet, authoritative',
      occasion: 'Work',
      matchPct: 96,
      ownedPct: 80,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=800&q=80',
      vibeTag: 'Old Money',
      attribution: 'because you love Old Money',
    },
    {
      id: 'om2',
      title: 'Quiet Luxury Sunday',
      subtitle: 'Cashmere, neutral, effortless',
      occasion: 'Casual',
      matchPct: 92,
      ownedPct: 75,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      vibeTag: 'Old Money',
      attribution: 'tailored to your aesthetic',
    },
  ],
  'Minimal': [
    {
      id: 'min1',
      title: 'The Clean Edit',
      subtitle: 'Crisp whites, sharp lines',
      occasion: 'Work',
      matchPct: 94,
      ownedPct: 82,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      vibeTag: 'Minimal',
      attribution: 'built around your minimal vibe',
    },
    {
      id: 'min2',
      title: 'Monochrome Moment',
      subtitle: 'One tone, total impact',
      occasion: 'Date Night',
      matchPct: 89,
      ownedPct: 70,
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      vibeTag: 'Minimal',
      attribution: 'because you like Minimal',
    },
  ],
  'Clean Girl': [
    {
      id: 'cg1',
      title: 'Effortless Glow',
      subtitle: 'Glazed, dewy, polished',
      occasion: 'Casual',
      matchPct: 93,
      ownedPct: 78,
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
      vibeTag: 'Clean Girl',
      attribution: 'your Clean Girl signature',
    },
    {
      id: 'cg2',
      title: 'Sunday Brunch Look',
      subtitle: 'Linen, gold, neutral',
      occasion: 'Casual',
      matchPct: 91,
      ownedPct: 76,
      image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80',
      vibeTag: 'Clean Girl',
      attribution: 'curated for your aesthetic',
    },
  ],
  'Streetwear': [
    {
      id: 'sw1',
      title: 'Off-Duty Edge',
      subtitle: 'Oversized, layered, bold',
      occasion: 'Casual',
      matchPct: 90,
      ownedPct: 72,
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      vibeTag: 'Streetwear',
      attribution: 'because you love Streetwear',
    },
    {
      id: 'sw2',
      title: 'Statement Layers',
      subtitle: 'Graphic, textured, expressive',
      occasion: 'Casual',
      matchPct: 87,
      ownedPct: 68,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      vibeTag: 'Streetwear',
      attribution: 'trending in your aesthetic',
    },
  ],
  'Chic': [
    {
      id: 'ch1',
      title: 'Parisian Edit',
      subtitle: 'Effortless French elegance',
      occasion: 'Date Night',
      matchPct: 95,
      ownedPct: 80,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
      vibeTag: 'Chic',
      attribution: 'your Chic signature look',
    },
    {
      id: 'ch2',
      title: 'Evening Allure',
      subtitle: 'Draped, sculptural, confident',
      occasion: 'Events',
      matchPct: 91,
      ownedPct: 65,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=800&q=80',
      vibeTag: 'Chic',
      attribution: 'because you love Chic',
    },
  ],
  'Casual Luxury': [
    {
      id: 'cl1',
      title: 'Elevated Basics',
      subtitle: 'Premium comfort, refined',
      occasion: 'Casual',
      matchPct: 93,
      ownedPct: 82,
      image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80',
      vibeTag: 'Casual Luxury',
      attribution: 'built around Casual Luxury',
    },
    {
      id: 'cl2',
      title: 'Weekend Luxe',
      subtitle: 'Soft fabrics, sharp details',
      occasion: 'Casual',
      matchPct: 90,
      ownedPct: 78,
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
      vibeTag: 'Casual Luxury',
      attribution: 'your Casual Luxury picks',
    },
  ],
};

const DEFAULT_OUTFITS: OutfitCard[] = [
  {
    id: 'def1',
    title: 'The Boardroom Edit',
    subtitle: 'Curated for your 9am meeting',
    occasion: 'Work',
    matchPct: 94,
    ownedPct: 80,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=800&q=80',
    vibeTag: 'Curated',
    attribution: 'built around your wardrobe',
  },
  {
    id: 'def2',
    title: 'Evening Allure',
    subtitle: 'Effortless and elegant',
    occasion: 'Date Night',
    matchPct: 91,
    ownedPct: 72,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    vibeTag: 'Editorial',
    attribution: 'personalized for you',
  },
];

// ─── Vibe → Trend Maps ────────────────────────────────────────────────────────

const VIBE_TREND_MAP: Record<string, TrendCard[]> = {
  'Old Money': [
    { id: 't1', label: 'TRENDING IN YOUR AESTHETIC', title: 'Quiet Luxury', sub: 'Understated elegance is everywhere', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', vibeTag: 'Old Money' },
    { id: 't2', label: 'RISING', title: 'Heritage Tailoring', sub: 'Classic cuts, modern confidence', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', vibeTag: 'Old Money' },
    { id: 't3', label: 'THIS SEASON', title: 'Coastal Prep', sub: 'Nautical meets refined', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', vibeTag: 'Old Money' },
  ],
  'Minimal': [
    { id: 't4', label: 'TRENDING IN YOUR AESTHETIC', title: 'Clean Minimalism', sub: 'Less is always more', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', vibeTag: 'Minimal' },
    { id: 't5', label: 'RISING', title: 'Monochrome Dressing', sub: 'One color, total impact', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', vibeTag: 'Minimal' },
    { id: 't6', label: 'THIS WEEK', title: 'Architectural Shapes', sub: 'Structure as statement', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80', vibeTag: 'Minimal' },
  ],
  'Streetwear': [
    { id: 't7', label: 'TRENDING NOW', title: 'Gorpcore', sub: 'Utility meets high fashion', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', vibeTag: 'Streetwear' },
    { id: 't8', label: 'RISING', title: 'Oversized Everything', sub: 'Volume is the statement', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', vibeTag: 'Streetwear' },
    { id: 't9', label: 'THIS WEEK', title: 'Graphic Layers', sub: 'Expressive, bold, textured', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', vibeTag: 'Streetwear' },
  ],
  'default': [
    { id: 'td1', label: 'TRENDING NOW', title: 'Quiet Luxury', sub: 'Understated elegance is everywhere', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', vibeTag: 'Trending' },
    { id: 'td2', label: 'THIS WEEK', title: 'Coastal Chic', sub: 'Breezy, effortless, editorial', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', vibeTag: 'Trending' },
    { id: 'td3', label: 'RISING', title: 'Power Dressing', sub: 'Structured silhouettes return', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', vibeTag: 'Trending' },
  ],
};

// ─── Brand → Deal Maps ────────────────────────────────────────────────────────

const BRAND_DEAL_MAP: Record<string, DealCard> = {
  'Zara': { id: 'zara', brand: 'ZARA', item: 'Oversized Blazer', original: 110, sale: 59, off: 46, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80', expiry: '2h left', matchReason: 'from your saved brands' },
  'H&M': { id: 'hm', brand: 'H&M', item: 'Linen Shirt Dress', original: 60, sale: 32, off: 47, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80', expiry: '12h left', matchReason: 'from your saved brands' },
  'Mango': { id: 'mango', brand: 'MANGO', item: 'Straight-Leg Jeans', original: 80, sale: 44, off: 45, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80', expiry: '24h left', matchReason: 'from your saved brands' },
  'Aritzia': { id: 'aritzia', brand: 'ARITZIA', item: 'Wilfred Blazer', original: 198, sale: 118, off: 40, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=300&q=80', expiry: '48h left', matchReason: 'from your saved brands' },
  'COS': { id: 'cos', brand: 'COS', item: 'Relaxed Trousers', original: 95, sale: 55, off: 42, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', expiry: '6h left', matchReason: 'from your saved brands' },
  'Everlane': { id: 'everlane', brand: 'EVERLANE', item: 'The Cashmere Crew', original: 130, sale: 78, off: 40, image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80', expiry: '3h left', matchReason: 'from your saved brands' },
  'Uniqlo': { id: 'uniqlo', brand: 'UNIQLO', item: 'Merino Turtleneck', original: 50, sale: 29, off: 42, image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&q=80', expiry: '18h left', matchReason: 'from your saved brands' },
  'Nordstrom': { id: 'nordstrom', brand: 'NORDSTROM', item: 'Wrap Midi Dress', original: 145, sale: 87, off: 40, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&q=80', expiry: '36h left', matchReason: 'from your saved brands' },
  'ALDO': { id: 'aldo', brand: 'ALDO', item: 'Slingback Heels', original: 95, sale: 55, off: 42, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80', expiry: '8h left', matchReason: 'from your saved brands' },
};

const DEFAULT_DEALS: DealCard[] = [
  { id: 'dd1', brand: 'ZARA', item: 'Oversized Blazer', original: 110, sale: 59, off: 46, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80', expiry: '2h left', matchReason: 'trending this week' },
  { id: 'dd2', brand: 'MANGO', item: 'Straight-Leg Jeans', original: 80, sale: 44, off: 45, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80', expiry: '24h left', matchReason: 'matches your style' },
  { id: 'dd3', brand: 'ALDO', item: 'Slingback Heels', original: 95, sale: 55, off: 42, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80', expiry: '8h left', matchReason: 'top pick for you' },
];

// ─── Messaging Maps ───────────────────────────────────────────────────────────

const VIBE_HERO_MAP: Record<string, { tagline: string; subline: string; sectionTitle: string; trendLabel: string; dealLabel: string; insightText: string }> = {
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
  'default': {
    tagline: 'Your personalized edit is ready.',
    subline: 'Curated around your wardrobe.',
    sectionTitle: 'Curated picks for you',
    trendLabel: 'TRENDING NOW',
    dealLabel: 'DEAL ALERTS',
    insightText: 'You already own 80% of today\'s top look. Add one piece to complete the edit.',
  },
};

// ─── Occasion → Greeting ──────────────────────────────────────────────────────

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
  const heroMap = VIBE_HERO_MAP[primaryVibe] ?? VIBE_HERO_MAP['default'];

  // Outfits: pick from primary vibe, fall back to default
  const vibeOutfits = VIBE_OUTFIT_MAP[primaryVibe] ?? [];
  const outfits = vibeOutfits.length > 0 ? vibeOutfits : DEFAULT_OUTFITS;

  // Trends: pick from primary vibe
  const trends = VIBE_TREND_MAP[primaryVibe] ?? VIBE_TREND_MAP['default'];

  // Deals: match against saved brands
  const brandDeals = profile.favoriteBrands
    .map(b => BRAND_DEAL_MAP[b])
    .filter(Boolean)
    .slice(0, 4) as DealCard[];
  const deals = brandDeals.length >= 2 ? brandDeals : DEFAULT_DEALS;

  // Accent color: if user prefers blush/rose, use blush; otherwise rose gold
  const prefersBlush = profile.colorPreferences.some(c =>
    ['blush', 'pastels', 'blush & rose'].includes(c.toLowerCase())
  );

  return {
    greeting: buildGreeting(),
    heroTagline: heroMap.tagline,
    heroSubline: heroMap.subline,
    goNewLabel: buildGoNewLabel(profile.occasions),
    sectionLabel: 'CURATED FOR YOUR STYLE',
    sectionTitle: heroMap.sectionTitle,
    trendSectionLabel: heroMap.trendLabel,
    dealSectionLabel: heroMap.dealLabel,
    insightText: heroMap.insightText,
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
    goNewLabel: 'Build a fresh look from your closet →',
    sectionLabel: 'CURATED FOR YOUR STYLE',
    sectionTitle: 'Curated picks for you',
    trendSectionLabel: 'TRENDING NOW',
    dealSectionLabel: 'DEAL ALERTS',
    insightText: 'You already own 80% of today\'s top look.',
    outfits: DEFAULT_OUTFITS,
    trends: VIBE_TREND_MAP['default'],
    deals: DEFAULT_DEALS,
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
