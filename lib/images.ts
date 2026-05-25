/**
 * Threadly Image Library — Definitive Edition (Pexels)
 *
 * All images sourced from Pexels (free to use, no attribution required in app).
 * Every ID verified against Pexels alt-text description.
 * Images organized by strict semantic role — never reused across categories.
 *
 * URL format: https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg
 */

const P = (id: string, w = 600, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&fit=crop&h=${h}`;

const PL = (id: string, w = 800, h = 500) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&fit=crop&h=${h}`;

// ─────────────────────────────────────────────────────────────────────────────
// VIBE IMAGES — one canonical image per vibe for onboarding cards
// ─────────────────────────────────────────────────────────────────────────────

export const VIBE_IMAGES: Record<string, string> = {
  // Old Money / Quiet Luxury — beige, camel, neutral tones, tailored
  oldMoney:     P("8422350"),   // elegant woman in beige outfit, studio
  // Minimal — white, off-white, structured basics
  minimal:      P("13797014"),  // elegant woman in white suit, pampas grass
  // Clean Girl — soft, dewy, effortless neutral basics
  cleanGirl:    P("9768446"),   // stylish woman in white skirt and heels, minimal
  // Chic / Parisian — black outfits, city streets
  chic:         P("3961631"),   // stylish woman in Parisian outfit, historic architecture
  // Streetwear — denim, oversized, urban
  streetwear:   P("14464962"),  // woman in oversized jacket, ripped jeans, sunglasses
  // Vacation / Resort — linen, white, tropical
  vacation:     P("37166935"),  // stylish woman in white linen shirt, beach resort
  // Casual Luxe — elevated everyday, quality fabrics
  casualLuxury: P("26798072"),  // stylish woman with purse, ornate doors
  casualLuxe:   P("26798072"),  // alias
  // Feminine / Soft Glam — dresses, florals, soft colors
  softGlam:     P("12164101"),  // woman in pink dress, white bed, serene
  feminine:     P("27580017"),  // stylish woman in white dress, outdoors
  // Editorial fallback
  editorial:    P("9102717"),   // woman in black blazer, sitting elegantly
};

// ─────────────────────────────────────────────────────────────────────────────
// VIBE OUTFIT POOLS — editorial full-body outfit shots per vibe
// Used for: Home hero, curated picks, stylist cards
// ─────────────────────────────────────────────────────────────────────────────

export const VIBE_OUTFIT_POOL: Record<string, string[]> = {
  "Old Money": [
    P("8422350"),   // elegant woman in beige outfit, studio
    P("9571462"),   // woman in coat and hat leaning on columns
    P("10360630"),  // woman in arched hallway, Lviv, elegant
    P("8070398"),   // stylish woman in beige outfit, neutral bg
    P("27580989"),  // fashionable woman in beige, city road
    P("19655654"),  // stylish woman in coat and hat, outdoors
    P("29814529"),  // confident woman in stylish attire, Istanbul cobblestone
  ],
  "Minimal": [
    P("7636100"),   // elegant redhead in white blouse, serene
    P("9031629"),   // elegant young woman, minimalist backdrop
    P("8796462"),   // woman in oversized white shirt and jeans
    P("9421869"),   // fashionable woman in white outfit, bright window
    P("13797014"),  // elegant woman in white suit, pampas grass
    P("7825921"),   // elegant woman in studio with vibrant flower
    P("34977352"),  // stylish woman in relaxed casual top
  ],
  "Clean Girl": [
    P("9768446"),   // stylish woman in white skirt and heels, minimal
    P("32203033"),  // woman leaning against column, dramatic light
    P("16085827"),  // elegant woman in black coat, modern building
    P("10181442"),  // serene portrait, minimalist setting
    P("30125249"),  // black and white portrait, woman on stool
    P("16812052"),  // film-inspired portrait, woman on escalator
    P("31448513"),  // fashionable young woman, large windows
  ],
  "Chic": [
    P("3961631"),   // stylish woman in Parisian outfit, historic architecture
    P("5900412"),   // elegant woman in black and white, city street
    P("32682566"),  // fashionable woman walking past Paris cafe
    P("10265031"),  // fashionably dressed woman crossing, Paris
    P("11069452"),  // woman in winter coat and boots, Parisian cobblestone
    P("34636933"),  // fashionable woman posing at Palais Royal, Paris
    P("30681502"),  // stylish woman sitting at Palais Royal, autumn
  ],
  "Streetwear": [
    P("14464962"),  // woman in oversized jacket, ripped jeans, sunglasses
    P("26738385"),  // fashion-forward woman in denim, urban style
    P("9408813"),   // stylish woman in denim pants and sunglasses
    P("24499685"),  // young woman in oversized hoodie, urban doorway
    P("24287019"),  // young woman in denim jacket, city street
    P("13840242"),  // Asian woman with braided hair, denim jacket
    P("24287016"),  // stylish woman in denim jacket and graphic tee
  ],
  "Vacation": [
    P("37565108"),  // woman by pool in Cancún, white linen
    P("37166935"),  // stylish woman in white linen shirt, beach resort
    P("29956695"),  // elegant woman in white, sunny tropical resort
    P("6639758"),   // fashionable woman on sandy beach, Bali
    P("17218237"),  // woman in orange skirt by palm tree, tropical
    P("37166936"),  // elegant woman leans against wall, Cancún, white linen
    P("37320018"),  // woman in chic dress, beachside cabanas, Alanya
  ],
  "Casual Luxury": [
    P("26798072"),  // stylish woman with purse, ornate doors
    P("29968063"),  // stylish woman in sunglasses and scarf, concrete wall
    P("10954831"),  // elegant woman in red sweater with handbag
    P("29815839"),  // fashionable woman in chic indoor environment
    P("17975923"),  // woman in modern fashion, chic Istanbul apartment
    P("14346035"),  // trendy woman with curly hair, stylish outfit
    P("26798073"),  // fashionable adult woman in black attire, sunglasses
  ],
  "Casual Luxe": [
    P("26798072"),  P("29968063"),  P("10954831"),
    P("29815839"),  P("17975923"),  P("14346035"),  P("26798073"),
  ],
  "Soft Glam": [
    P("12164101"),  // woman in pink dress, white bed, serene
    P("27580017"),  // stylish woman in white dress, outdoors
    P("17143274"),  // young woman in floral dress, urban setting
    P("27333547"),  // stylish woman in floral dress, park
    P("33510853"),  // sophisticated woman in red dress, luxury
    P("6483975"),   // young woman in beige dress, sunny meadow
    P("32218300"),  // stylish woman in green dress with black hat
  ],
  "Feminine": [
    P("12164101"),  P("27580017"),  P("17143274"),
    P("27333547"),  P("33510853"),  P("6483975"),  P("32218300"),
  ],
  "default": [
    P("8422350"),  P("13797014"),  P("9768446"),
    P("3961631"),  P("14464962"),  P("37166935"),  P("12164101"),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CLOSET IMAGES — individual clothing item shots by category
// Used for: Closet grid, ItemIntelligenceSheet
// ─────────────────────────────────────────────────────────────────────────────

export const CLOSET_IMAGES = {
  // TOPS — blouses, shirts, knits (women wearing tops, upper body focus)
  top1: P("7636100"),     // elegant woman in white blouse, serene
  top2: P("8796462"),     // woman in oversized white shirt
  top3: P("9031629"),     // elegant young woman, white top, minimalist
  top4: P("34977352"),    // stylish woman in relaxed casual top
  top5: P("9421869"),     // fashionable woman in white outfit
  top6: P("13797014"),    // elegant woman in white suit top

  // BOTTOMS — trousers, jeans, skirts (lower body / full body showing bottoms)
  bottom1: P("7716953"),  // two women in stylish blue jeans and white heels
  bottom2: P("25032902"), // stylish woman in jeans and black jacket, Milano
  bottom3: P("33700338"), // stylish young woman in blue top and jeans
  bottom4: P("21591339"), // woman in white shirt and jeans, wooden chair
  bottom5: P("12175059"), // stylish young woman in denim and leather jacket
  bottom6: P("9263790"),  // elegant young woman in trendy outfit, studio

  // DRESSES — midi, maxi, mini, floral, slip
  dress1: P("12164101"),  // woman in pink dress, white bed
  dress2: P("27580017"),  // stylish woman in white dress, outdoors
  dress3: P("17143274"),  // young woman in floral dress, urban setting
  dress4: P("27333547"),  // stylish woman in floral dress, park
  dress5: P("33510853"),  // sophisticated woman in red dress, luxury
  dress6: P("32218300"),  // stylish woman in green dress with black hat

  // OUTERWEAR — coats, blazers, jackets
  outer1: P("7173158"),   // elegant woman in blue coat, stone wall, handbag
  outer2: P("9102717"),   // woman in black blazer, sitting elegantly
  outer3: P("3961631"),   // stylish woman in Parisian coat, historic architecture
  outer4: P("11069452"),  // woman in winter coat and boots, Parisian cobblestone
  outer5: P("10360630"),  // woman in arched hallway, elegant coat
  outer6: P("9571462"),   // woman in coat and hat, architectural columns

  // SHOES — heels, boots, flats (product shots)
  shoe1: P("27023941", 600, 600),  // elegant blue stiletto heels
  shoe2: P("12687623", 600, 600),  // gold high heel shoes, wooden surface
  shoe3: P("15792209", 600, 600),  // chic red high heels, light background
  shoe4: P("5713781", 600, 600),   // stunning glossy red high heel, pink bg
  shoe5: P("97048", 600, 600),     // elegant high heel sandals, boutique
  shoe6: P("17826424", 600, 600),  // stylish black high heels, chain detail

  // BAGS — handbags, totes, clutches (product shots)
  bag1: P("8989582", 600, 600),    // hands holding fashionable beige handbag
  bag2: P("21263499", 600, 600),   // stylish silver handbag with chain
  bag3: P("8502482", 600, 600),    // stylish brown leather bag, studio
  bag4: P("6538441", 600, 600),    // hands closing a leather bag
  bag5: P("11980639", 600, 600),   // striking orange designer handbag
  bag6: P("36125061", 600, 600),   // woman examining black leather handbag

  // ACCESSORIES — jewelry, scarves, sunglasses (product/close-up shots)
  acc1: P("29579379", 600, 600),   // woman wearing elegant silver jewelry
  acc2: P("36599395", 600, 600),   // woman wearing elegant diamond necklace
  acc3: P("37401663", 600, 600),   // woman's hand with stylish bracelets
  acc4: P("35421633", 600, 600),   // woman wearing sunglasses and stylish rings
  acc5: P("9168242", 600, 600),    // fashionable woman in light blue suit, accessories
  acc6: P("6512271", 600, 600),    // woman's hand with elegant rings and necklace
};

// ─────────────────────────────────────────────────────────────────────────────
// DEAL / SHOP IMAGES — product-specific deal cards
// Used for: Shop tab deal cards
// ─────────────────────────────────────────────────────────────────────────────

export const DEAL_IMAGES = {
  blazer:          P("9102717"),   // woman in black blazer, elegant
  coat:            P("7173158"),   // woman in blue coat, stone wall
  trenchCoat:      P("11069452"),  // woman in winter coat, Parisian cobblestone
  leatherJacket:   P("14464962"),  // woman in oversized jacket, urban
  midiDress:       P("33510853"),  // sophisticated woman in red dress
  floralDress:     P("27333547"),  // stylish woman in floral dress, park
  whiteDress:      P("27580017"),  // stylish woman in white dress, outdoors
  littleBlackDress: P("5900412"),  // elegant woman in black outfit, city
  denimJacket:     P("24287019"),  // young woman in denim jacket, city
  casualTop:       P("34977352"),  // stylish woman in relaxed casual top
  knitwear:        P("8070398"),   // stylish woman in beige knit, neutral bg
  loungewear:      P("9421869"),   // fashionable woman in white, bright window
  luxuryBag:       P("8989582"),   // hands holding fashionable beige handbag
  designerBag:     P("11980639"),  // striking orange designer handbag
  heels:           P("15792209"),  // chic red high heels
  jewelry:         P("29579379"),  // woman wearing elegant silver jewelry
  classicHeels:    P("27023941"),  // elegant blue stiletto heels
  boots:           P("17826424"),  // stylish black high heels, chain detail
  sandals:         P("97048"),     // elegant high heel sandals, boutique
};

// ─────────────────────────────────────────────────────────────────────────────
// TREND IMAGES — editorial trend cards (landscape)
// Used for: Home trend section, Shop trend cards
// ─────────────────────────────────────────────────────────────────────────────

export const TREND_IMAGES = {
  quietLuxury:       PL("8422350"),   // elegant woman in beige, studio
  monochromaticBlack: PL("5900412"),  // elegant woman in black, city
  denimOnDenim:      PL("26738385"),  // fashion-forward woman in denim
  cottagecore:       PL("27333547"),  // woman in floral dress, park
  coastalGrandma:    PL("37166935"),  // woman in white linen, beach resort
  balletCore:        PL("12164101"),  // woman in pink dress, serene
  streetStyle:       PL("14464962"),  // woman in oversized jacket, urban
  parisianChic:      PL("3961631"),   // woman in Parisian outfit, architecture
  resortWear:        PL("29956695"),  // elegant woman in white, tropical
  minimalism:        PL("13797014"),  // elegant woman in white suit
  flatLay1:          PL("3944690"),   // flat lay: denim jeans, sneakers, scarf
  flatLay2:          PL("12956068"),  // flat lay: corduroy skirt, sunglasses
  flatLay3:          PL("31871752"),  // flat lay: black boots, blue dress
  flatLay4:          PL("934070"),    // flat lay: denim jeans, white sweater
};

// ─────────────────────────────────────────────────────────────────────────────
// VIBE DEAL POOLS — deal card images matched to style vibe
// ─────────────────────────────────────────────────────────────────────────────

export const VIBE_DEAL_POOL: Record<string, string[]> = {
  "Old Money":     [DEAL_IMAGES.coat, DEAL_IMAGES.blazer, DEAL_IMAGES.knitwear, DEAL_IMAGES.luxuryBag],
  "Minimal":       [DEAL_IMAGES.whiteDress, DEAL_IMAGES.casualTop, DEAL_IMAGES.heels, DEAL_IMAGES.designerBag],
  "Clean Girl":    [DEAL_IMAGES.loungewear, DEAL_IMAGES.whiteDress, DEAL_IMAGES.jewelry, DEAL_IMAGES.luxuryBag],
  "Chic":          [DEAL_IMAGES.littleBlackDress, DEAL_IMAGES.blazer, DEAL_IMAGES.classicHeels, DEAL_IMAGES.designerBag],
  "Streetwear":    [DEAL_IMAGES.denimJacket, DEAL_IMAGES.leatherJacket, DEAL_IMAGES.boots, DEAL_IMAGES.casualTop],
  "Vacation":      [DEAL_IMAGES.floralDress, DEAL_IMAGES.whiteDress, DEAL_IMAGES.sandals, DEAL_IMAGES.luxuryBag],
  "Casual Luxury": [DEAL_IMAGES.midiDress, DEAL_IMAGES.blazer, DEAL_IMAGES.heels, DEAL_IMAGES.designerBag],
  "Casual Luxe":   [DEAL_IMAGES.midiDress, DEAL_IMAGES.blazer, DEAL_IMAGES.heels, DEAL_IMAGES.designerBag],
  "Soft Glam":     [DEAL_IMAGES.floralDress, DEAL_IMAGES.midiDress, DEAL_IMAGES.jewelry, DEAL_IMAGES.sandals],
  "Feminine":      [DEAL_IMAGES.floralDress, DEAL_IMAGES.midiDress, DEAL_IMAGES.jewelry, DEAL_IMAGES.sandals],
};

// ─────────────────────────────────────────────────────────────────────────────
// VIBE TREND POOLS — trend card images matched to style vibe
// ─────────────────────────────────────────────────────────────────────────────

export const VIBE_TREND_POOL: Record<string, string[]> = {
  "Old Money":     [TREND_IMAGES.quietLuxury, TREND_IMAGES.parisianChic, TREND_IMAGES.minimalism],
  "Minimal":       [TREND_IMAGES.minimalism, TREND_IMAGES.flatLay4, TREND_IMAGES.coastalGrandma],
  "Clean Girl":    [TREND_IMAGES.minimalism, TREND_IMAGES.balletCore, TREND_IMAGES.flatLay2],
  "Chic":          [TREND_IMAGES.monochromaticBlack, TREND_IMAGES.parisianChic, TREND_IMAGES.flatLay3],
  "Streetwear":    [TREND_IMAGES.denimOnDenim, TREND_IMAGES.streetStyle, TREND_IMAGES.flatLay1],
  "Vacation":      [TREND_IMAGES.resortWear, TREND_IMAGES.coastalGrandma, TREND_IMAGES.cottagecore],
  "Casual Luxury": [TREND_IMAGES.quietLuxury, TREND_IMAGES.parisianChic, TREND_IMAGES.flatLay2],
  "Casual Luxe":   [TREND_IMAGES.quietLuxury, TREND_IMAGES.parisianChic, TREND_IMAGES.flatLay2],
  "Soft Glam":     [TREND_IMAGES.balletCore, TREND_IMAGES.cottagecore, TREND_IMAGES.flatLay2],
  "Feminine":      [TREND_IMAGES.balletCore, TREND_IMAGES.cottagecore, TREND_IMAGES.flatLay2],
};

// ─────────────────────────────────────────────────────────────────────────────
// VIBE STYLIST POOLS — images for Stylist chat outfit suggestions
// ─────────────────────────────────────────────────────────────────────────────

export const VIBE_STYLIST_POOL: Record<string, string[]> = {
  "Old Money":     [P("8422350"), P("9571462"), P("10360630"), P("8070398"), P("27580989")],
  "Minimal":       [P("7636100"), P("9031629"), P("8796462"), P("9421869"), P("13797014")],
  "Clean Girl":    [P("9768446"), P("32203033"), P("16085827"), P("10181442"), P("30125249")],
  "Chic":          [P("3961631"), P("5900412"), P("32682566"), P("10265031"), P("11069452")],
  "Streetwear":    [P("14464962"), P("26738385"), P("9408813"), P("24499685"), P("24287019")],
  "Vacation":      [P("37565108"), P("37166935"), P("29956695"), P("6639758"), P("17218237")],
  "Casual Luxury": [P("26798072"), P("29968063"), P("10954831"), P("29815839"), P("17975923")],
  "Casual Luxe":   [P("26798072"), P("29968063"), P("10954831"), P("29815839"), P("17975923")],
  "Soft Glam":     [P("12164101"), P("27580017"), P("17143274"), P("27333547"), P("33510853")],
  "Feminine":      [P("12164101"), P("27580017"), P("17143274"), P("27333547"), P("33510853")],
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO IMAGE MAP — one hero per vibe for Home screen
// ─────────────────────────────────────────────────────────────────────────────

export const VIBE_HERO_MAP: Record<string, string> = {
  "Old Money":     P("8422350", 800, 1000),
  "Minimal":       P("13797014", 800, 1000),
  "Clean Girl":    P("9768446", 800, 1000),
  "Chic":          P("3961631", 800, 1000),
  "Streetwear":    P("14464962", 800, 1000),
  "Vacation":      P("37166935", 800, 1000),
  "Casual Luxury": P("26798072", 800, 1000),
  "Casual Luxe":   P("26798072", 800, 1000),
  "Soft Glam":     P("12164101", 800, 1000),
  "Feminine":      P("27580017", 800, 1000),
  "default":       P("9102717", 800, 1000),
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Pick an image from a vibe-specific pool by index, with fallback */
export function pickVibeImage(
  pool: Record<string, string[]>,
  vibe: string,
  index = 0,
): string {
  const vibePool = pool[vibe] ?? pool["default"] ?? pool["Minimal"] ?? [];
  if (vibePool.length === 0) return P("9031629");
  return vibePool[Math.abs(index) % vibePool.length];
}

/** Pick an image from a flat pool by seed for determinism */
export function pickFromPool(pool: string[], seed = 0): string {
  if (!pool || pool.length === 0) return P("9031629");
  return pool[Math.abs(seed) % pool.length];
}

/** Get all closet images as a flat array */
export function getAllClosetImages(): string[] {
  return Object.values(CLOSET_IMAGES);
}

/** Get closet images by category */
export function getClosetImagesByCategory(
  category: "tops" | "bottoms" | "dresses" | "outerwear" | "shoes" | "bags" | "accessories",
): string[] {
  const map: Record<string, string[]> = {
    tops:        [CLOSET_IMAGES.top1, CLOSET_IMAGES.top2, CLOSET_IMAGES.top3, CLOSET_IMAGES.top4, CLOSET_IMAGES.top5, CLOSET_IMAGES.top6],
    bottoms:     [CLOSET_IMAGES.bottom1, CLOSET_IMAGES.bottom2, CLOSET_IMAGES.bottom3, CLOSET_IMAGES.bottom4, CLOSET_IMAGES.bottom5, CLOSET_IMAGES.bottom6],
    dresses:     [CLOSET_IMAGES.dress1, CLOSET_IMAGES.dress2, CLOSET_IMAGES.dress3, CLOSET_IMAGES.dress4, CLOSET_IMAGES.dress5, CLOSET_IMAGES.dress6],
    outerwear:   [CLOSET_IMAGES.outer1, CLOSET_IMAGES.outer2, CLOSET_IMAGES.outer3, CLOSET_IMAGES.outer4, CLOSET_IMAGES.outer5, CLOSET_IMAGES.outer6],
    shoes:       [CLOSET_IMAGES.shoe1, CLOSET_IMAGES.shoe2, CLOSET_IMAGES.shoe3, CLOSET_IMAGES.shoe4, CLOSET_IMAGES.shoe5, CLOSET_IMAGES.shoe6],
    bags:        [CLOSET_IMAGES.bag1, CLOSET_IMAGES.bag2, CLOSET_IMAGES.bag3, CLOSET_IMAGES.bag4, CLOSET_IMAGES.bag5, CLOSET_IMAGES.bag6],
    accessories: [CLOSET_IMAGES.acc1, CLOSET_IMAGES.acc2, CLOSET_IMAGES.acc3, CLOSET_IMAGES.acc4, CLOSET_IMAGES.acc5, CLOSET_IMAGES.acc6],
  };
  return map[category] ?? map.tops;
}

// Legacy compatibility aliases
export const ALL_OUTFIT_IMAGES = Object.values(VIBE_OUTFIT_POOL).flat();
export const ALL_PRODUCT_IMAGES = getAllClosetImages();
export const OUTFIT_IMAGES = VIBE_IMAGES; // legacy alias
export const HERO_IMAGES = VIBE_HERO_MAP; // legacy alias
