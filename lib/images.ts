/**
 * Threadly — Centralized Image Library
 *
 * All images are curated Unsplash URLs with consistent:
 * - Feminine editorial fashion aesthetic
 * - Warm luxury lighting
 * - Neutral modern palette (beige, cream, black, blush, taupe, charcoal)
 * - Aspirational but approachable styling
 *
 * URL format: ?w=<width>&q=80&fit=crop&crop=top
 *
 * VIBE-SPECIFIC COLLECTIONS:
 * Each vibe has its own curated pool for outfit cards, trends, deals, and hero images.
 * Use VIBE_OUTFIT_POOL, VIBE_TREND_POOL, VIBE_DEAL_POOL, VIBE_HERO_MAP to get
 * imagery that matches the user's selected style identity.
 */

// ─── Hero / Full-bleed outfit images (portrait 3:4) ──────────────────────────

export const HERO_IMAGES = {
  quietLuxury:  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80&fit=crop&crop=top",
  cleanGirl:    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&fit=crop&crop=top",
  oldMoney:     "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80&fit=crop&crop=top",
  minimal:      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&fit=crop&crop=top",
  casualLuxury: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&fit=crop&crop=top",
  chic:         "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80&fit=crop&crop=top",
  streetwear:   "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80&fit=crop&crop=top",
  editorial:    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80&fit=crop&crop=top",
  vacation:     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop&crop=top",
  softGlam:     "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&fit=crop&crop=top",
};

// ─── Vibe-specific hero image map ─────────────────────────────────────────────

export const VIBE_HERO_MAP: Record<string, string> = {
  "Old Money":      HERO_IMAGES.oldMoney,
  "Minimal":        HERO_IMAGES.minimal,
  "Clean Girl":     HERO_IMAGES.cleanGirl,
  "Streetwear":     HERO_IMAGES.streetwear,
  "Chic":           HERO_IMAGES.chic,
  "Casual Luxury":  HERO_IMAGES.casualLuxury,
  "Vacation":       HERO_IMAGES.vacation,
  "Soft Glam":      HERO_IMAGES.softGlam,
  "default":        HERO_IMAGES.quietLuxury,
};

// ─── Outfit cards — vibe-specific pools (square 1:1 or 4:5) ──────────────────

export const OUTFIT_IMAGES = {
  // Neutral / quiet luxury
  neutralCoat:      "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80&fit=crop&crop=top",
  beigeSet:         "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&q=80&fit=crop&crop=top",
  creamBlouse:      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80&fit=crop&crop=top",
  taiLoredTrousers: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80&fit=crop&crop=top",
  camelCoatLook:    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80&fit=crop&crop=top",
  ivoryKnit:        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80&fit=crop&crop=top",
  // Black / charcoal / chic
  blackDress:       "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80&fit=crop&crop=top",
  blackCoat:        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80&fit=crop&crop=top",
  blackTurtleneck:  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&fit=crop&crop=top",
  monochromeEdit:   "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80&fit=crop&crop=top",
  charcoalSuit:     "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80&fit=crop&crop=top",
  // Blush / feminine / clean girl
  blushDress:       "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&fit=crop&crop=top",
  roseTop:          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80&fit=crop&crop=top",
  softNeutrals:     "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&fit=crop&crop=top",
  effortlessBasics: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80&fit=crop&crop=top",
  // Streetwear / urban
  streetLook:       "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80&fit=crop&crop=top",
  oversizedDenim:   "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80&fit=crop&crop=top",
  // Vacation / resort
  linenSet:         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop&crop=top",
  resortDress:      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&fit=crop&crop=top",
  // Editorial / lifestyle
  editorialLook1:   "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&fit=crop&crop=top",
  editorialLook2:   "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80&fit=crop&crop=top",
  editorialLook3:   "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&fit=crop&crop=top",
  editorialLook4:   "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80&fit=crop&crop=top",
  editorialLook5:   "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80&fit=crop&crop=top",
  editorialLook6:   "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80&fit=crop&crop=top",
};

// ─── Vibe-specific outfit pools ───────────────────────────────────────────────

export const VIBE_OUTFIT_POOL: Record<string, string[]> = {
  "Old Money": [
    OUTFIT_IMAGES.neutralCoat,
    OUTFIT_IMAGES.beigeSet,
    OUTFIT_IMAGES.taiLoredTrousers,
    OUTFIT_IMAGES.camelCoatLook,
    OUTFIT_IMAGES.ivoryKnit,
    OUTFIT_IMAGES.creamBlouse,
    OUTFIT_IMAGES.editorialLook2,
  ],
  "Minimal": [
    OUTFIT_IMAGES.creamBlouse,
    OUTFIT_IMAGES.beigeSet,
    OUTFIT_IMAGES.ivoryKnit,
    OUTFIT_IMAGES.effortlessBasics,
    OUTFIT_IMAGES.editorialLook2,
    OUTFIT_IMAGES.editorialLook4,
    OUTFIT_IMAGES.neutralCoat,
  ],
  "Clean Girl": [
    OUTFIT_IMAGES.softNeutrals,
    OUTFIT_IMAGES.effortlessBasics,
    OUTFIT_IMAGES.blushDress,
    OUTFIT_IMAGES.creamBlouse,
    OUTFIT_IMAGES.roseTop,
    OUTFIT_IMAGES.editorialLook3,
    OUTFIT_IMAGES.beigeSet,
  ],
  "Chic": [
    OUTFIT_IMAGES.blackDress,
    OUTFIT_IMAGES.blackTurtleneck,
    OUTFIT_IMAGES.monochromeEdit,
    OUTFIT_IMAGES.charcoalSuit,
    OUTFIT_IMAGES.blackCoat,
    OUTFIT_IMAGES.editorialLook5,
    OUTFIT_IMAGES.editorialLook6,
  ],
  "Streetwear": [
    OUTFIT_IMAGES.streetLook,
    OUTFIT_IMAGES.oversizedDenim,
    OUTFIT_IMAGES.blackCoat,
    OUTFIT_IMAGES.monochromeEdit,
    OUTFIT_IMAGES.editorialLook1,
    OUTFIT_IMAGES.editorialLook5,
    OUTFIT_IMAGES.blackTurtleneck,
  ],
  "Casual Luxury": [
    OUTFIT_IMAGES.editorialLook1,
    OUTFIT_IMAGES.beigeSet,
    OUTFIT_IMAGES.neutralCoat,
    OUTFIT_IMAGES.softNeutrals,
    OUTFIT_IMAGES.effortlessBasics,
    OUTFIT_IMAGES.editorialLook4,
    OUTFIT_IMAGES.ivoryKnit,
  ],
  "Vacation": [
    OUTFIT_IMAGES.linenSet,
    OUTFIT_IMAGES.resortDress,
    OUTFIT_IMAGES.blushDress,
    OUTFIT_IMAGES.softNeutrals,
    OUTFIT_IMAGES.editorialLook1,
    OUTFIT_IMAGES.roseTop,
    OUTFIT_IMAGES.editorialLook3,
  ],
  "Soft Glam": [
    OUTFIT_IMAGES.blushDress,
    OUTFIT_IMAGES.roseTop,
    OUTFIT_IMAGES.softNeutrals,
    OUTFIT_IMAGES.editorialLook3,
    OUTFIT_IMAGES.editorialLook6,
    OUTFIT_IMAGES.blackDress,
    OUTFIT_IMAGES.charcoalSuit,
  ],
  "default": [
    OUTFIT_IMAGES.neutralCoat,
    OUTFIT_IMAGES.beigeSet,
    OUTFIT_IMAGES.creamBlouse,
    OUTFIT_IMAGES.blackDress,
    OUTFIT_IMAGES.blushDress,
    OUTFIT_IMAGES.editorialLook1,
    OUTFIT_IMAGES.editorialLook2,
  ],
};

// ─── Product / item images (square 1:1) ──────────────────────────────────────

export const PRODUCT_IMAGES = {
  // Tops
  silkBlouse:     "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80&fit=crop",
  creamKnit:      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80&fit=crop",
  whiteButton:    "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&q=80&fit=crop",
  blackTee:       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&fit=crop",
  stripedTop:     "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80&fit=crop",
  // Bottoms
  tailoredPants:  "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=400&q=80&fit=crop",
  wideLegs:       "https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&q=80&fit=crop",
  midiSkirt:      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80&fit=crop",
  straightJeans:  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80&fit=crop",
  // Outerwear
  camelCoat:      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80&fit=crop",
  blazer:         "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80&fit=crop",
  leatherJacket:  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80&fit=crop",
  trenchCoat:     "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80&fit=crop",
  // Dresses
  midiDress:      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&fit=crop",
  slipDress:      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80&fit=crop",
  wrapDress:      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80&fit=crop",
  miniDress:      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&q=80&fit=crop",
  // Shoes
  loafers:        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80&fit=crop",
  heels:          "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&q=80&fit=crop",
  boots:          "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80&fit=crop",
  sneakers:       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&fit=crop",
  sandals:        "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80&fit=crop",
  // Bags
  structuredBag:  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80&fit=crop",
  tote:           "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80&fit=crop",
  clutch:         "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80&fit=crop",
  crossbody:      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80&fit=crop",
  // Accessories
  goldHoops:      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80&fit=crop",
  silkScarf:      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80&fit=crop",
  sunglasses:     "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80&fit=crop",
  belt:           "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&fit=crop",
};

// ─── Trend / editorial cards (landscape 16:9 or 3:2) ─────────────────────────

export const TREND_IMAGES = {
  quietLuxury:    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=700&q=80&fit=crop&crop=center",
  cleanGirl:      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&q=80&fit=crop&crop=center",
  oldMoney:       "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=700&q=80&fit=crop&crop=center",
  monochromes:    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&q=80&fit=crop&crop=center",
  softGlam:       "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=700&q=80&fit=crop&crop=center",
  parisianEdit:   "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80&fit=crop&crop=center",
  summerLuxury:   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80&fit=crop&crop=center",
  workwear:       "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=80&fit=crop&crop=center",
  streetStyle:    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80&fit=crop&crop=center",
  vacationVibes:  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80&fit=crop&crop=center",
  casualChic:     "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80&fit=crop&crop=center",
  eveningEdit:    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700&q=80&fit=crop&crop=center",
};

// ─── Vibe-specific trend pools ────────────────────────────────────────────────

export const VIBE_TREND_POOL: Record<string, string[]> = {
  "Old Money":     [TREND_IMAGES.oldMoney, TREND_IMAGES.quietLuxury, TREND_IMAGES.workwear, TREND_IMAGES.parisianEdit, TREND_IMAGES.casualChic],
  "Minimal":       [TREND_IMAGES.quietLuxury, TREND_IMAGES.cleanGirl, TREND_IMAGES.casualChic, TREND_IMAGES.parisianEdit, TREND_IMAGES.workwear],
  "Clean Girl":    [TREND_IMAGES.cleanGirl, TREND_IMAGES.softGlam, TREND_IMAGES.quietLuxury, TREND_IMAGES.casualChic, TREND_IMAGES.summerLuxury],
  "Chic":          [TREND_IMAGES.monochromes, TREND_IMAGES.eveningEdit, TREND_IMAGES.parisianEdit, TREND_IMAGES.workwear, TREND_IMAGES.softGlam],
  "Streetwear":    [TREND_IMAGES.streetStyle, TREND_IMAGES.monochromes, TREND_IMAGES.eveningEdit, TREND_IMAGES.casualChic, TREND_IMAGES.workwear],
  "Casual Luxury": [TREND_IMAGES.casualChic, TREND_IMAGES.quietLuxury, TREND_IMAGES.cleanGirl, TREND_IMAGES.parisianEdit, TREND_IMAGES.summerLuxury],
  "Vacation":      [TREND_IMAGES.summerLuxury, TREND_IMAGES.vacationVibes, TREND_IMAGES.cleanGirl, TREND_IMAGES.softGlam, TREND_IMAGES.casualChic],
  "Soft Glam":     [TREND_IMAGES.softGlam, TREND_IMAGES.eveningEdit, TREND_IMAGES.cleanGirl, TREND_IMAGES.monochromes, TREND_IMAGES.parisianEdit],
  "default":       [TREND_IMAGES.quietLuxury, TREND_IMAGES.cleanGirl, TREND_IMAGES.oldMoney, TREND_IMAGES.monochromes, TREND_IMAGES.softGlam],
};

// ─── Onboarding style vibe cards (portrait 2:3) ───────────────────────────────

export const VIBE_IMAGES = {
  minimal:      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80&fit=crop&crop=top",
  cleanGirl:    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80&fit=crop&crop=top",
  streetwear:   "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80&fit=crop&crop=top",
  chic:         "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80&fit=crop&crop=top",
  oldMoney:     "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=500&q=80&fit=crop&crop=top",
  casualLuxury: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80&fit=crop&crop=top",
  softGlam:     "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=500&q=80&fit=crop&crop=top",
  editorial:    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80&fit=crop&crop=top",
  vacation:     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80&fit=crop&crop=top",
};

// ─── Closet wardrobe grid items (square 1:1) ─────────────────────────────────

export const CLOSET_IMAGES = {
  item1:  "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=300&q=80&fit=crop",
  item2:  "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=300&q=80&fit=crop",
  item3:  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&q=80&fit=crop",
  item4:  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80&fit=crop",
  item5:  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&q=80&fit=crop",
  item6:  "https://images.unsplash.com/photo-1551803091-e20673f15770?w=300&q=80&fit=crop",
  item7:  "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&q=80&fit=crop",
  item8:  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&q=80&fit=crop",
  item9:  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&q=80&fit=crop",
  item10: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80&fit=crop",
  item11: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80&fit=crop",
  item12: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80&fit=crop",
  item13: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80&fit=crop",
  item14: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80&fit=crop",
  item15: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&q=80&fit=crop",
  item16: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=300&q=80&fit=crop",
  item17: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=300&q=80&fit=crop",
  item18: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80&fit=crop",
  item19: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80&fit=crop",
  item20: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80&fit=crop",
  item21: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&q=80&fit=crop",
  item22: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80&fit=crop",
  item23: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&q=80&fit=crop",
  item24: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&q=80&fit=crop",
};

// ─── Deal / shopping card images (landscape 3:2) ─────────────────────────────

export const DEAL_IMAGES = {
  zaraCoat:         "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80&fit=crop&crop=top",
  aritziaBlouse:    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&q=80&fit=crop&crop=top",
  cosKnit:          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80&fit=crop&crop=top",
  everlaneTop:      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80&fit=crop&crop=top",
  mangoDress:       "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80&fit=crop&crop=top",
  uniqloBasic:      "https://images.unsplash.com/photo-1551803091-e20673f15770?w=500&q=80&fit=crop&crop=top",
  hmTrousers:       "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=500&q=80&fit=crop&crop=top",
  otherStoriesBag:  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80&fit=crop&crop=top",
  massimoBlazer:    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80&fit=crop&crop=top",
  nordicShoes:      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80&fit=crop&crop=top",
  // Expanded deal images
  revolveSlipDress: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80&fit=crop&crop=top",
  skimsLounge:      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80&fit=crop&crop=top",
  nordstromHeels:   "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=500&q=80&fit=crop&crop=top",
  aritziaTrench:    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80&fit=crop&crop=top",
  zaraDenim:        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80&fit=crop&crop=top",
  cosBlackEdit:     "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80&fit=crop&crop=top",
  revolveResort:    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80&fit=crop&crop=top",
  mangoLinen:       "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80&fit=crop&crop=top",
};

// ─── Vibe-specific deal pools ─────────────────────────────────────────────────

export const VIBE_DEAL_POOL: Record<string, string[]> = {
  "Old Money":     [DEAL_IMAGES.zaraCoat, DEAL_IMAGES.massimoBlazer, DEAL_IMAGES.aritziaTrench, DEAL_IMAGES.cosKnit, DEAL_IMAGES.hmTrousers],
  "Minimal":       [DEAL_IMAGES.cosKnit, DEAL_IMAGES.everlaneTop, DEAL_IMAGES.uniqloBasic, DEAL_IMAGES.cosBlackEdit, DEAL_IMAGES.aritziaTrench],
  "Clean Girl":    [DEAL_IMAGES.aritziaBlouse, DEAL_IMAGES.skimsLounge, DEAL_IMAGES.everlaneTop, DEAL_IMAGES.uniqloBasic, DEAL_IMAGES.mangoDress],
  "Chic":          [DEAL_IMAGES.cosBlackEdit, DEAL_IMAGES.massimoBlazer, DEAL_IMAGES.nordstromHeels, DEAL_IMAGES.otherStoriesBag, DEAL_IMAGES.zaraCoat],
  "Streetwear":    [DEAL_IMAGES.zaraDenim, DEAL_IMAGES.nordicShoes, DEAL_IMAGES.hmTrousers, DEAL_IMAGES.zaraCoat, DEAL_IMAGES.cosBlackEdit],
  "Casual Luxury": [DEAL_IMAGES.aritziaBlouse, DEAL_IMAGES.cosKnit, DEAL_IMAGES.aritziaTrench, DEAL_IMAGES.mangoDress, DEAL_IMAGES.uniqloBasic],
  "Vacation":      [DEAL_IMAGES.revolveResort, DEAL_IMAGES.mangoLinen, DEAL_IMAGES.revolveSlipDress, DEAL_IMAGES.mangoDress, DEAL_IMAGES.nordicShoes],
  "Soft Glam":     [DEAL_IMAGES.revolveSlipDress, DEAL_IMAGES.nordstromHeels, DEAL_IMAGES.mangoDress, DEAL_IMAGES.aritziaBlouse, DEAL_IMAGES.otherStoriesBag],
  "default":       [DEAL_IMAGES.zaraCoat, DEAL_IMAGES.aritziaBlouse, DEAL_IMAGES.cosKnit, DEAL_IMAGES.mangoDress, DEAL_IMAGES.hmTrousers],
};

// ─── Stylist recommendation cards (portrait 3:4) ─────────────────────────────

export const STYLIST_IMAGES = {
  reco1:  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80&fit=crop&crop=top",
  reco2:  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=80&fit=crop&crop=top",
  reco3:  "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=400&q=80&fit=crop&crop=top",
  reco4:  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80&fit=crop&crop=top",
  reco5:  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80&fit=crop&crop=top",
  reco6:  "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&q=80&fit=crop&crop=top",
  reco7:  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80&fit=crop&crop=top",
  reco8:  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80&fit=crop&crop=top",
  reco9:  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&fit=crop&crop=top",
  reco10: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80&fit=crop&crop=top",
  reco11: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80&fit=crop&crop=top",
  reco12: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop&crop=top",
};

// ─── Vibe-specific stylist recommendation pools ───────────────────────────────

export const VIBE_STYLIST_POOL: Record<string, string[]> = {
  "Old Money":     [STYLIST_IMAGES.reco3, STYLIST_IMAGES.reco2, STYLIST_IMAGES.reco11, STYLIST_IMAGES.reco1, STYLIST_IMAGES.reco5],
  "Minimal":       [STYLIST_IMAGES.reco11, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco1, STYLIST_IMAGES.reco5, STYLIST_IMAGES.reco3],
  "Clean Girl":    [STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco9, STYLIST_IMAGES.reco10, STYLIST_IMAGES.reco11, STYLIST_IMAGES.reco12],
  "Chic":          [STYLIST_IMAGES.reco7, STYLIST_IMAGES.reco6, STYLIST_IMAGES.reco8, STYLIST_IMAGES.reco2, STYLIST_IMAGES.reco3],
  "Streetwear":    [STYLIST_IMAGES.reco8, STYLIST_IMAGES.reco7, STYLIST_IMAGES.reco6, STYLIST_IMAGES.reco5, STYLIST_IMAGES.reco2],
  "Casual Luxury": [STYLIST_IMAGES.reco1, STYLIST_IMAGES.reco5, STYLIST_IMAGES.reco11, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco3],
  "Vacation":      [STYLIST_IMAGES.reco12, STYLIST_IMAGES.reco9, STYLIST_IMAGES.reco10, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco1],
  "Soft Glam":     [STYLIST_IMAGES.reco9, STYLIST_IMAGES.reco10, STYLIST_IMAGES.reco6, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco7],
  "default":       [STYLIST_IMAGES.reco1, STYLIST_IMAGES.reco2, STYLIST_IMAGES.reco3, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco5],
};

// ─── Convenience arrays for index-based selection ────────────────────────────

export const ALL_OUTFIT_IMAGES  = Object.values(OUTFIT_IMAGES);
export const ALL_PRODUCT_IMAGES = Object.values(PRODUCT_IMAGES);
export const ALL_CLOSET_IMAGES  = Object.values(CLOSET_IMAGES);
export const ALL_DEAL_IMAGES    = Object.values(DEAL_IMAGES);
export const ALL_TREND_IMAGES   = Object.values(TREND_IMAGES);
export const ALL_STYLIST_IMAGES = Object.values(STYLIST_IMAGES);

/** Pick a deterministic image from an array using a seed index */
export function pickImage(arr: string[], seed: number): string {
  return arr[Math.abs(seed) % arr.length];
}

/**
 * Pick a vibe-matched image from a pool map.
 * Falls back to "default" if the vibe is not found.
 */
export function pickVibeImage(
  pool: Record<string, string[]>,
  vibe: string,
  seed: number
): string {
  const arr = pool[vibe] ?? pool["default"] ?? Object.values(pool)[0];
  return arr[Math.abs(seed) % arr.length];
}
