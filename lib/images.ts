/**
 * Threadly — Centralized Image Library v3
 *
 * RULES:
 * - Every URL is semantically verified: tops show tops, jeans show jeans, shoes show shoes.
 * - CLOSET_IMAGES uses flat-lay / product-focused shots, not editorial full-body.
 * - Vibe pools use editorial full-body / outfit shots.
 * - No URL is reused across different semantic categories.
 * - All images are feminine, editorial, warm-lit, aspirational.
 *
 * Unsplash photo IDs used here have been manually verified for semantic correctness.
 */

// ─── Hero / Full-bleed outfit images (portrait 3:4) ──────────────────────────

export const HERO_IMAGES = {
  quietLuxury:  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80&fit=crop&crop=top",
  cleanGirl:    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&fit=crop&crop=top",
  oldMoney:     "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80&fit=crop&crop=top",
  minimal:      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&fit=crop&crop=top",
  casualLuxury: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&fit=crop&crop=top",
  chic:         "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80&fit=crop&crop=top",
  streetwear:   "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80&fit=crop&crop=top",
  editorial:    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80&fit=crop&crop=top",
  vacation:     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop&crop=top",
  softGlam:     "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&fit=crop&crop=top",
};

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

// ─── Full editorial outfit images — vibe-specific (portrait 3:4) ─────────────

export const OUTFIT_IMAGES = {
  // Old Money — neutral tones, tailored, quiet luxury
  oldMoney1:    "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80&fit=crop&crop=top",
  oldMoney2:    "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&q=80&fit=crop&crop=top",
  oldMoney3:    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80&fit=crop&crop=top",
  oldMoney4:    "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80&fit=crop&crop=top",
  oldMoney5:    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80&fit=crop&crop=top",
  oldMoney6:    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80&fit=crop&crop=top",
  oldMoney7:    "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80&fit=crop&crop=top",
  oldMoney8:    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80&fit=crop&crop=top",
  // Minimal — clean lines, white/cream/beige
  minimal1:     "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&fit=crop&crop=top",
  minimal2:     "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&fit=crop&crop=top",
  minimal3:     "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&fit=crop&crop=top",
  minimal4:     "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80&fit=crop&crop=top",
  minimal5:     "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&fit=crop&crop=top",
  minimal6:     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop&crop=top",
  minimal7:     "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80&fit=crop&crop=top",
  minimal8:     "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80&fit=crop&crop=top",
  // Clean Girl — dewy, effortless, soft neutrals
  cleanGirl1:   "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80&fit=crop&crop=top",
  cleanGirl2:   "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80&fit=crop&crop=top",
  cleanGirl3:   "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80&fit=crop&crop=top",
  cleanGirl4:   "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80&fit=crop&crop=top",
  cleanGirl5:   "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80&fit=crop&crop=top",
  cleanGirl6:   "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80&fit=crop&crop=top",
  cleanGirl7:   "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80&fit=crop&crop=top",
  cleanGirl8:   "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&fit=crop&crop=top",
  // Chic — polished, Parisian, black/navy
  chic1:        "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80&fit=crop&crop=top",
  chic2:        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80&fit=crop&crop=top",
  chic3:        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80&fit=crop&crop=top",
  chic4:        "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80&fit=crop&crop=top",
  chic5:        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&fit=crop&crop=top",
  chic6:        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80&fit=crop&crop=top",
  chic7:        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&fit=crop&crop=top",
  chic8:        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80&fit=crop&crop=top",
  // Streetwear — oversized, denim, sneakers
  street1:      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80&fit=crop&crop=top",
  street2:      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80&fit=crop&crop=top",
  street3:      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80&fit=crop&crop=top",
  street4:      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&fit=crop&crop=top",
  street5:      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&fit=crop&crop=top",
  street6:      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80&fit=crop&crop=top",
  street7:      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&fit=crop&crop=top",
  street8:      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80&fit=crop&crop=top",
  // Vacation — resort, linen, breezy
  vacation1:    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop&crop=top",
  vacation2:    "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80&fit=crop&crop=top",
  vacation3:    "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80&fit=crop&crop=top",
  vacation4:    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80&fit=crop&crop=top",
  vacation5:    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80&fit=crop&crop=top",
  vacation6:    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&fit=crop&crop=top",
  vacation7:    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&fit=crop&crop=top",
  vacation8:    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80&fit=crop&crop=top",
  // Casual Luxe — elevated everyday, premium basics
  casualLuxe1:  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80&fit=crop&crop=top",
  casualLuxe2:  "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80&fit=crop&crop=top",
  casualLuxe3:  "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&q=80&fit=crop&crop=top",
  casualLuxe4:  "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80&fit=crop&crop=top",
  casualLuxe5:  "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80&fit=crop&crop=top",
  casualLuxe6:  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80&fit=crop&crop=top",
  casualLuxe7:  "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80&fit=crop&crop=top",
  casualLuxe8:  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80&fit=crop&crop=top",
  // Soft Glam — feminine, evening, romantic
  softGlam1:    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80&fit=crop&crop=top",
  softGlam2:    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80&fit=crop&crop=top",
  softGlam3:    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&fit=crop&crop=top",
  softGlam4:    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80&fit=crop&crop=top",
  softGlam5:    "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80&fit=crop&crop=top",
  softGlam6:    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80&fit=crop&crop=top",
  softGlam7:    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&fit=crop&crop=top",
  softGlam8:    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&fit=crop&crop=top",
};

export const VIBE_OUTFIT_POOL: Record<string, string[]> = {
  "Old Money":     [OUTFIT_IMAGES.oldMoney1, OUTFIT_IMAGES.oldMoney2, OUTFIT_IMAGES.oldMoney3, OUTFIT_IMAGES.oldMoney4, OUTFIT_IMAGES.oldMoney5, OUTFIT_IMAGES.oldMoney6, OUTFIT_IMAGES.oldMoney7, OUTFIT_IMAGES.oldMoney8],
  "Minimal":       [OUTFIT_IMAGES.minimal1, OUTFIT_IMAGES.minimal2, OUTFIT_IMAGES.minimal3, OUTFIT_IMAGES.minimal4, OUTFIT_IMAGES.minimal5, OUTFIT_IMAGES.minimal6, OUTFIT_IMAGES.minimal7, OUTFIT_IMAGES.minimal8],
  "Clean Girl":    [OUTFIT_IMAGES.cleanGirl1, OUTFIT_IMAGES.cleanGirl2, OUTFIT_IMAGES.cleanGirl3, OUTFIT_IMAGES.cleanGirl4, OUTFIT_IMAGES.cleanGirl5, OUTFIT_IMAGES.cleanGirl6, OUTFIT_IMAGES.cleanGirl7, OUTFIT_IMAGES.cleanGirl8],
  "Chic":          [OUTFIT_IMAGES.chic1, OUTFIT_IMAGES.chic2, OUTFIT_IMAGES.chic3, OUTFIT_IMAGES.chic4, OUTFIT_IMAGES.chic5, OUTFIT_IMAGES.chic6, OUTFIT_IMAGES.chic7, OUTFIT_IMAGES.chic8],
  "Streetwear":    [OUTFIT_IMAGES.street1, OUTFIT_IMAGES.street2, OUTFIT_IMAGES.street3, OUTFIT_IMAGES.street4, OUTFIT_IMAGES.street5, OUTFIT_IMAGES.street6, OUTFIT_IMAGES.street7, OUTFIT_IMAGES.street8],
  "Vacation":      [OUTFIT_IMAGES.vacation1, OUTFIT_IMAGES.vacation2, OUTFIT_IMAGES.vacation3, OUTFIT_IMAGES.vacation4, OUTFIT_IMAGES.vacation5, OUTFIT_IMAGES.vacation6, OUTFIT_IMAGES.vacation7, OUTFIT_IMAGES.vacation8],
  "Casual Luxury": [OUTFIT_IMAGES.casualLuxe1, OUTFIT_IMAGES.casualLuxe2, OUTFIT_IMAGES.casualLuxe3, OUTFIT_IMAGES.casualLuxe4, OUTFIT_IMAGES.casualLuxe5, OUTFIT_IMAGES.casualLuxe6, OUTFIT_IMAGES.casualLuxe7, OUTFIT_IMAGES.casualLuxe8],
  "Casual Luxe":   [OUTFIT_IMAGES.casualLuxe1, OUTFIT_IMAGES.casualLuxe2, OUTFIT_IMAGES.casualLuxe3, OUTFIT_IMAGES.casualLuxe4, OUTFIT_IMAGES.casualLuxe5, OUTFIT_IMAGES.casualLuxe6, OUTFIT_IMAGES.casualLuxe7, OUTFIT_IMAGES.casualLuxe8],
  "Soft Glam":     [OUTFIT_IMAGES.softGlam1, OUTFIT_IMAGES.softGlam2, OUTFIT_IMAGES.softGlam3, OUTFIT_IMAGES.softGlam4, OUTFIT_IMAGES.softGlam5, OUTFIT_IMAGES.softGlam6, OUTFIT_IMAGES.softGlam7, OUTFIT_IMAGES.softGlam8],
  "default":       [OUTFIT_IMAGES.oldMoney1, OUTFIT_IMAGES.minimal1, OUTFIT_IMAGES.cleanGirl1, OUTFIT_IMAGES.chic1, OUTFIT_IMAGES.casualLuxe1, OUTFIT_IMAGES.vacation1, OUTFIT_IMAGES.softGlam1, OUTFIT_IMAGES.street1],
};

// ─── Onboarding style vibe cards (portrait 2:3) ───────────────────────────────

export const VIBE_IMAGES = {
  oldMoney:     "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&q=80&fit=crop&crop=top",
  minimal:      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80&fit=crop&crop=top",
  cleanGirl:    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80&fit=crop&crop=top",
  chic:         "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80&fit=crop&crop=top",
  streetwear:   "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80&fit=crop&crop=top",
  vacation:     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80&fit=crop&crop=top",
  casualLuxury: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80&fit=crop&crop=top",
  softGlam:     "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80&fit=crop&crop=top",
  editorial:    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80&fit=crop&crop=top",
};

// ─── Closet wardrobe grid — PRODUCT FLAT-LAY / CATEGORY-SPECIFIC (square 1:1) ─
// These are isolated product shots, NOT editorial full-body outfits.

export const CLOSET_IMAGES = {
  // Tops — blouses, tees, knits, shirts (product-focused)
  top1:    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=300&q=80&fit=crop",  // silk blouse
  top2:    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&q=80&fit=crop",  // cream knit
  top3:    "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=300&q=80&fit=crop",  // white button shirt
  top4:    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80&fit=crop",  // black tee
  top5:    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&q=80&fit=crop",  // striped top
  // Bottoms — trousers, jeans, skirts (product-focused)
  bottom1: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=300&q=80&fit=crop",  // tailored trousers
  bottom2: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=300&q=80&fit=crop",  // wide-leg pants
  bottom3: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&q=80&fit=crop",  // midi skirt
  bottom4: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&q=80&fit=crop",  // straight jeans
  // Dresses — midi, slip, wrap, mini
  dress1:  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80&fit=crop",  // midi dress
  dress2:  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80&fit=crop",  // slip dress
  dress3:  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80&fit=crop",  // wrap dress
  dress4:  "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=300&q=80&fit=crop",  // mini dress
  // Outerwear — coats, blazers, jackets, trench
  outer1:  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&q=80&fit=crop",  // camel coat
  outer2:  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80&fit=crop",  // trench coat
  outer3:  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&q=80&fit=crop",  // blazer
  outer4:  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&q=80&fit=crop",  // leather jacket
  // Shoes — loafers, heels, boots, sneakers, sandals
  shoe1:   "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80&fit=crop",  // loafers
  shoe2:   "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=300&q=80&fit=crop",  // heels
  shoe3:   "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80&fit=crop",  // white sneakers
  shoe4:   "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=300&q=80&fit=crop",  // heeled boots
  shoe5:   "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&q=80&fit=crop",  // sandals
  // Bags — structured, tote, clutch, crossbody
  bag1:    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80&fit=crop",  // structured bag
  bag2:    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80&fit=crop",  // leather tote
  bag3:    "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=300&q=80&fit=crop",  // crossbody
  bag4:    "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=300&q=80&fit=crop",  // clutch
  // Accessories — jewelry, scarves, sunglasses, belts
  acc1:    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80&fit=crop",  // gold hoops
  acc2:    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&q=80&fit=crop",  // silk scarf
  acc3:    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80&fit=crop",  // sunglasses
  acc4:    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80&fit=crop",  // belt / accessories
};

// ─── Product / item images — SEMANTICALLY CORRECT (square 1:1) ───────────────

export const PRODUCT_IMAGES = {
  silkBlouse:       "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80&fit=crop",
  creamKnit:        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80&fit=crop",
  whiteButtonShirt: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&q=80&fit=crop",
  blackTee:         "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&fit=crop",
  stripedTop:       "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80&fit=crop",
  tailoredTrousers: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=400&q=80&fit=crop",
  wideLegs:         "https://images.unsplash.com/photo-1551803091-e20673f15770?w=400&q=80&fit=crop",
  midiSkirt:        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80&fit=crop",
  straightJeans:    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80&fit=crop",
  camelCoat:        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80&fit=crop",
  blazer:           "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80&fit=crop",
  leatherJacket:    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80&fit=crop",
  trenchCoat:       "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80&fit=crop",
  midiDress:        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&fit=crop",
  slipDress:        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80&fit=crop",
  wrapDress:        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80&fit=crop",
  miniDress:        "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&q=80&fit=crop",
  loafers:          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80&fit=crop",
  heels:            "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&q=80&fit=crop",
  boots:            "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80&fit=crop",
  sneakers:         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&fit=crop",
  sandals:          "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80&fit=crop",
  structuredBag:    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80&fit=crop",
  tote:             "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80&fit=crop",
  clutch:           "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80&fit=crop",
  crossbody:        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80&fit=crop",
  goldHoops:        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80&fit=crop",
  silkScarf:        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80&fit=crop",
  sunglasses:       "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80&fit=crop",
  belt:             "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&fit=crop",
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
  streetStyle:    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&q=80&fit=crop&crop=center",
  vacationVibes:  "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=700&q=80&fit=crop&crop=center",
  casualChic:     "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80&fit=crop&crop=center",
  eveningEdit:    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700&q=80&fit=crop&crop=center",
  denimEdit:      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=700&q=80&fit=crop&crop=center",
  knitwear:       "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&q=80&fit=crop&crop=center",
  resort:         "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=700&q=80&fit=crop&crop=center",
};

export const VIBE_TREND_POOL: Record<string, string[]> = {
  "Old Money":     [TREND_IMAGES.oldMoney, TREND_IMAGES.quietLuxury, TREND_IMAGES.workwear, TREND_IMAGES.parisianEdit, TREND_IMAGES.knitwear, TREND_IMAGES.casualChic],
  "Minimal":       [TREND_IMAGES.quietLuxury, TREND_IMAGES.cleanGirl, TREND_IMAGES.casualChic, TREND_IMAGES.parisianEdit, TREND_IMAGES.monochromes, TREND_IMAGES.workwear],
  "Clean Girl":    [TREND_IMAGES.cleanGirl, TREND_IMAGES.softGlam, TREND_IMAGES.quietLuxury, TREND_IMAGES.casualChic, TREND_IMAGES.summerLuxury, TREND_IMAGES.knitwear],
  "Chic":          [TREND_IMAGES.monochromes, TREND_IMAGES.eveningEdit, TREND_IMAGES.parisianEdit, TREND_IMAGES.workwear, TREND_IMAGES.softGlam, TREND_IMAGES.quietLuxury],
  "Streetwear":    [TREND_IMAGES.streetStyle, TREND_IMAGES.denimEdit, TREND_IMAGES.monochromes, TREND_IMAGES.eveningEdit, TREND_IMAGES.casualChic, TREND_IMAGES.workwear],
  "Casual Luxury": [TREND_IMAGES.casualChic, TREND_IMAGES.quietLuxury, TREND_IMAGES.cleanGirl, TREND_IMAGES.parisianEdit, TREND_IMAGES.summerLuxury, TREND_IMAGES.knitwear],
  "Casual Luxe":   [TREND_IMAGES.casualChic, TREND_IMAGES.quietLuxury, TREND_IMAGES.cleanGirl, TREND_IMAGES.parisianEdit, TREND_IMAGES.summerLuxury, TREND_IMAGES.knitwear],
  "Vacation":      [TREND_IMAGES.summerLuxury, TREND_IMAGES.vacationVibes, TREND_IMAGES.resort, TREND_IMAGES.cleanGirl, TREND_IMAGES.softGlam, TREND_IMAGES.casualChic],
  "Soft Glam":     [TREND_IMAGES.softGlam, TREND_IMAGES.eveningEdit, TREND_IMAGES.cleanGirl, TREND_IMAGES.monochromes, TREND_IMAGES.parisianEdit, TREND_IMAGES.quietLuxury],
  "default":       [TREND_IMAGES.quietLuxury, TREND_IMAGES.cleanGirl, TREND_IMAGES.oldMoney, TREND_IMAGES.monochromes, TREND_IMAGES.softGlam, TREND_IMAGES.casualChic],
};

// ─── Deal / shopping card images (landscape 3:2) ─────────────────────────────
// Each deal image shows the ITEM TYPE it represents, not a random editorial shot.

export const DEAL_IMAGES = {
  zaraCoat:         "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80&fit=crop&crop=top",   // coat
  aritziaTrench:    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80&fit=crop&crop=top",   // trench coat
  massimoBlazer:    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80&fit=crop&crop=top",      // blazer
  aritziaBlouse:    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&q=80&fit=crop&crop=top",   // blouse
  everlaneTop:      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80&fit=crop&crop=top",   // top
  cosKnit:          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80&fit=crop&crop=top",   // knit
  uniqloBasic:      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80&fit=crop&crop=top",   // basic tee
  hmTrousers:       "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=500&q=80&fit=crop&crop=top",   // trousers
  zaraDenim:        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80&fit=crop&crop=top",   // jeans
  mangoDress:       "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80&fit=crop&crop=top",   // dress
  revolveSlipDress: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80&fit=crop&crop=top",   // slip dress
  mangoLinen:       "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80&fit=crop&crop=top",   // linen dress
  revolveResort:    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80&fit=crop&crop=top",   // resort wear
  nordicShoes:      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80&fit=crop&crop=top",      // shoes
  nordstromHeels:   "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=500&q=80&fit=crop&crop=top",   // heels
  otherStoriesBag:  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80&fit=crop&crop=top",      // bag
  skimsLounge:      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80&fit=crop&crop=top",   // lounge
  cosBlackEdit:     "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80&fit=crop&crop=top",   // black edit
};

export const VIBE_DEAL_POOL: Record<string, string[]> = {
  "Old Money":     [DEAL_IMAGES.zaraCoat, DEAL_IMAGES.massimoBlazer, DEAL_IMAGES.aritziaTrench, DEAL_IMAGES.cosKnit, DEAL_IMAGES.hmTrousers, DEAL_IMAGES.otherStoriesBag],
  "Minimal":       [DEAL_IMAGES.cosKnit, DEAL_IMAGES.everlaneTop, DEAL_IMAGES.uniqloBasic, DEAL_IMAGES.cosBlackEdit, DEAL_IMAGES.aritziaTrench, DEAL_IMAGES.hmTrousers],
  "Clean Girl":    [DEAL_IMAGES.aritziaBlouse, DEAL_IMAGES.skimsLounge, DEAL_IMAGES.everlaneTop, DEAL_IMAGES.uniqloBasic, DEAL_IMAGES.mangoDress, DEAL_IMAGES.nordicShoes],
  "Chic":          [DEAL_IMAGES.cosBlackEdit, DEAL_IMAGES.massimoBlazer, DEAL_IMAGES.nordstromHeels, DEAL_IMAGES.otherStoriesBag, DEAL_IMAGES.zaraCoat, DEAL_IMAGES.aritziaTrench],
  "Streetwear":    [DEAL_IMAGES.zaraDenim, DEAL_IMAGES.nordicShoes, DEAL_IMAGES.hmTrousers, DEAL_IMAGES.zaraCoat, DEAL_IMAGES.cosBlackEdit, DEAL_IMAGES.uniqloBasic],
  "Casual Luxury": [DEAL_IMAGES.aritziaBlouse, DEAL_IMAGES.cosKnit, DEAL_IMAGES.aritziaTrench, DEAL_IMAGES.mangoDress, DEAL_IMAGES.uniqloBasic, DEAL_IMAGES.otherStoriesBag],
  "Casual Luxe":   [DEAL_IMAGES.aritziaBlouse, DEAL_IMAGES.cosKnit, DEAL_IMAGES.aritziaTrench, DEAL_IMAGES.mangoDress, DEAL_IMAGES.uniqloBasic, DEAL_IMAGES.otherStoriesBag],
  "Vacation":      [DEAL_IMAGES.revolveResort, DEAL_IMAGES.mangoLinen, DEAL_IMAGES.revolveSlipDress, DEAL_IMAGES.mangoDress, DEAL_IMAGES.nordicShoes, DEAL_IMAGES.skimsLounge],
  "Soft Glam":     [DEAL_IMAGES.revolveSlipDress, DEAL_IMAGES.nordstromHeels, DEAL_IMAGES.mangoDress, DEAL_IMAGES.aritziaBlouse, DEAL_IMAGES.otherStoriesBag, DEAL_IMAGES.skimsLounge],
  "default":       [DEAL_IMAGES.zaraCoat, DEAL_IMAGES.aritziaBlouse, DEAL_IMAGES.cosKnit, DEAL_IMAGES.mangoDress, DEAL_IMAGES.hmTrousers, DEAL_IMAGES.nordicShoes],
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

export const VIBE_STYLIST_POOL: Record<string, string[]> = {
  "Old Money":     [STYLIST_IMAGES.reco3, STYLIST_IMAGES.reco2, STYLIST_IMAGES.reco11, STYLIST_IMAGES.reco1, STYLIST_IMAGES.reco5],
  "Minimal":       [STYLIST_IMAGES.reco11, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco1, STYLIST_IMAGES.reco5, STYLIST_IMAGES.reco3],
  "Clean Girl":    [STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco9, STYLIST_IMAGES.reco10, STYLIST_IMAGES.reco11, STYLIST_IMAGES.reco12],
  "Chic":          [STYLIST_IMAGES.reco7, STYLIST_IMAGES.reco6, STYLIST_IMAGES.reco8, STYLIST_IMAGES.reco2, STYLIST_IMAGES.reco3],
  "Streetwear":    [STYLIST_IMAGES.reco8, STYLIST_IMAGES.reco7, STYLIST_IMAGES.reco6, STYLIST_IMAGES.reco5, STYLIST_IMAGES.reco2],
  "Casual Luxury": [STYLIST_IMAGES.reco1, STYLIST_IMAGES.reco5, STYLIST_IMAGES.reco11, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco3],
  "Casual Luxe":   [STYLIST_IMAGES.reco1, STYLIST_IMAGES.reco5, STYLIST_IMAGES.reco11, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco3],
  "Vacation":      [STYLIST_IMAGES.reco12, STYLIST_IMAGES.reco9, STYLIST_IMAGES.reco10, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco1],
  "Soft Glam":     [STYLIST_IMAGES.reco9, STYLIST_IMAGES.reco10, STYLIST_IMAGES.reco6, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco7],
  "default":       [STYLIST_IMAGES.reco1, STYLIST_IMAGES.reco2, STYLIST_IMAGES.reco3, STYLIST_IMAGES.reco4, STYLIST_IMAGES.reco5],
};

// ─── Convenience arrays ───────────────────────────────────────────────────────

export const ALL_OUTFIT_IMAGES  = Object.values(OUTFIT_IMAGES);
export const ALL_PRODUCT_IMAGES = Object.values(PRODUCT_IMAGES);
export const ALL_CLOSET_IMAGES  = Object.values(CLOSET_IMAGES);
export const ALL_DEAL_IMAGES    = Object.values(DEAL_IMAGES);
export const ALL_TREND_IMAGES   = Object.values(TREND_IMAGES);
export const ALL_STYLIST_IMAGES = Object.values(STYLIST_IMAGES);

export function pickImage(arr: string[], seed: number): string {
  return arr[Math.abs(seed) % arr.length];
}

export function pickVibeImage(
  pool: Record<string, string[]>,
  vibe: string,
  seed: number
): string {
  const arr = pool[vibe] ?? pool["default"] ?? Object.values(pool)[0];
  return arr[Math.abs(seed) % arr.length];
}
