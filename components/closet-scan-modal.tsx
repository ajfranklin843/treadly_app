/**
 * Threadly — Closet Scan Modal
 * The "holy shit" product moment: "Threadly is learning your identity."
 *
 * Emotional arc:
 *   1. Source Picker  — luxury dark bottom-sheet, pulsing orb, 3 source cards
 *   2. AI Analysis    — cinematic scan line sweep, rose-gold glow, step-by-step intelligence
 *   3. Item Reveal    — Color DNA, Style Match Score, Closet IQ, Pairs Well, Trending insight
 *
 * Design principles:
 *   • Apple Vision Pro + Pinterest + luxury fashion app aesthetic
 *   • NOT a utility scanner — an emotional intelligence moment
 *   • Perceived intelligence > backend sophistication
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { ThreadlyColors, ThreadlyRadius } from "@/constants/threadly";
import { hapticLight, hapticSuccess } from "@/lib/animations";
import { getAllClosetImages, ALL_PRODUCT_IMAGES, pickFromPool } from "@/lib/images";
const ALL_CLOSET_IMAGES = getAllClosetImages();

const { width: W, height: H } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScannedItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
  color: string;
  colorHex: string;
  styleTag: string;
  image: string;
  outfitCount: number;
  matchScore: number;
  closetIQ: number;
  pairsWith: string[];
  trendingIn: string;
  occasions: string[];
  worn: number;
};

type ScanPhase = "picker" | "analyzing" | "reveal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onItemAdded: (item: ScannedItem) => void;
  userVibe?: string;
};

// ─── Mock AI Engine ───────────────────────────────────────────────────────────

const CATEGORIES = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Bags", "Accessories"];
const BRANDS = ["Zara", "Mango", "H&M", "Aritzia", "COS", "Everlane", "Uniqlo", "& Other Stories", "Massimo Dutti"];
const COLORS: { name: string; hex: string }[] = [
  { name: "Ivory", hex: "#F5F0E8" },
  { name: "Camel", hex: "#C4A882" },
  { name: "Obsidian", hex: "#1A1A1A" },
  { name: "Blush", hex: "#E8C4B8" },
  { name: "Charcoal", hex: "#3A3A3A" },
  { name: "Cream", hex: "#FAF7F4" },
  { name: "Taupe", hex: "#8B7355" },
  { name: "Sage", hex: "#9CAF88" },
];
const STYLE_TAGS = ["Quiet Luxury", "Minimal Chic", "Clean Girl", "Casual Elevated", "Old Money", "Parisian Edit", "Timeless"];
const PAIRS_WITH_POOL = [
  "Tailored Trousers", "Silk Slip Skirt", "Wide-Leg Denim", "Leather Trousers",
  "Cashmere Knit", "Blazer", "Trench Coat", "White Sneakers", "Kitten Heels",
  "Gold Hoops", "Leather Tote", "Strappy Sandals",
];
const OCCASIONS_POOL = ["Work", "Date Night", "Weekend", "Travel", "Events", "Casual"];
const ITEM_NAMES: Record<string, string> = {
  Tops: "Relaxed Silk Blouse",
  Bottoms: "Tailored Wide-Leg Trousers",
  Dresses: "Midi Slip Dress",
  Outerwear: "Longline Trench Coat",
  Shoes: "Pointed-Toe Kitten Heels",
  Bags: "Structured Leather Tote",
  Accessories: "Sculptural Gold Earrings",
};

function seedHash(uri: string): number {
  let h = 0;
  for (let i = 0; i < uri.length; i++) h = (h * 31 + uri.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h);
}

function mockAnalyze(uri: string, vibe: string): ScannedItem {
  const s = seedHash(uri);
  const cat = CATEGORIES[s % CATEGORIES.length];
  const brand = BRANDS[(s >> 3) % BRANDS.length];
  const color = COLORS[(s >> 5) % COLORS.length];
  const styleTag = STYLE_TAGS[(s >> 7) % STYLE_TAGS.length];
  const outfitCount = 8 + (s % 15);
  const matchScore = 82 + (s % 17);
  const closetIQ = 74 + (s % 24);
  const pairsWith = [
    PAIRS_WITH_POOL[(s >> 2) % PAIRS_WITH_POOL.length],
    PAIRS_WITH_POOL[(s >> 4) % PAIRS_WITH_POOL.length],
    PAIRS_WITH_POOL[(s >> 6) % PAIRS_WITH_POOL.length],
  ].filter((v, i, a) => a.indexOf(v) === i);
  const occasions = [
    OCCASIONS_POOL[(s >> 1) % OCCASIONS_POOL.length],
    OCCASIONS_POOL[(s >> 3) % OCCASIONS_POOL.length],
  ].filter((v, i, a) => a.indexOf(v) === i);
  const trendingIn = vibe || styleTag;
  return {
    id: `scan_${Date.now()}`,
    name: ITEM_NAMES[cat] ?? cat,
    brand,
    category: cat,
    color: color.name,
    colorHex: color.hex,
    styleTag,
    image: uri,
    outfitCount,
    matchScore,
    closetIQ,
    pairsWith,
    trendingIn,
    occasions,
    worn: 0,
  };
}

// ─── Analysis Steps ───────────────────────────────────────────────────────────

const ANALYSIS_STEPS = [
  { label: "Detecting garment category", sub: "Reading silhouette & cut" },
  { label: "Identifying color palette", sub: "Mapping to your Color DNA" },
  { label: "Reading brand signature", sub: "Texture & label analysis" },
  { label: "Tagging aesthetic style", sub: "Matching to your vibes" },
  { label: "Checking outfit compatibility", sub: "Cross-referencing your closet" },
  { label: "Scanning wardrobe matches", sub: "Finding existing pairs" },
  { label: "Building wardrobe intelligence", sub: "Personalizing to your identity" },
];

const STEP_DURATION = 720; // ms per step

// ─── Main Component ───────────────────────────────────────────────────────────

export function ClosetScanModal({ visible, onClose, onItemAdded, userVibe = "Minimal" }: Props) {
  const [phase, setPhase] = useState<ScanPhase>("picker");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);

  // Sheet animation
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(H)).current;

  // Analysis animations
  const scanLineY = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.4)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const checkScales = useRef(ANALYSIS_STEPS.map(() => new Animated.Value(0))).current;

  // Reveal animations
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const revealSlide = useRef(new Animated.Value(50)).current;
  const imageScale = useRef(new Animated.Value(0.88)).current;

  // Open/close sheet
  useEffect(() => {
    if (visible) {
      // Reset state
      setPhase("picker");
      setImageUri(null);
      setCurrentStep(-1);
      setCompletedSteps([]);
      setScannedItem(null);
      progressAnim.setValue(0);
      revealOpacity.setValue(0);
      revealSlide.setValue(50);
      imageScale.setValue(0.88);
      checkScales.forEach(s => s.setValue(0));

      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(sheetY, { toValue: 0, tension: 60, friction: 11, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(sheetY, { toValue: H, duration: 260, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  // Glow pulse loop during analysis
  useEffect(() => {
    if (phase === "analyzing") {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowPulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
          Animated.timing(glowPulse, { toValue: 0.35, duration: 1100, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [phase]);

  // Scan line loop during analysis
  const startScanLine = useCallback(() => {
    scanLineY.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(scanLineY, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
      { iterations: 6 }
    ).start();
  }, []);

  const runAnalysis = useCallback((uri: string) => {
    setPhase("analyzing");
    startScanLine();

    ANALYSIS_STEPS.forEach((_, i) => {
      const delay = i * STEP_DURATION + 400;
      setTimeout(() => {
        setCurrentStep(i);
        hapticLight();
      }, delay);
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
        Animated.spring(checkScales[i], {
          toValue: 1, tension: 130, friction: 8, useNativeDriver: true,
        }).start();
        Animated.timing(progressAnim, {
          toValue: (i + 1) / ANALYSIS_STEPS.length,
          duration: 280,
          useNativeDriver: false,
        }).start();
      }, delay + STEP_DURATION * 0.7);
    });

    const totalDelay = ANALYSIS_STEPS.length * STEP_DURATION + 800;
    setTimeout(() => {
      const item = mockAnalyze(uri, userVibe);
      setScannedItem(item);
      setPhase("reveal");
      hapticSuccess();
      Animated.parallel([
        Animated.timing(revealOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.spring(revealSlide, { toValue: 0, tension: 65, friction: 12, useNativeDriver: true }),
        Animated.spring(imageScale, { toValue: 1, tension: 75, friction: 10, useNativeDriver: true }),
      ]).start();
    }, totalDelay);
  }, [userVibe, startScanLine]);

  const handleCamera = useCallback(async () => {
    hapticLight();
    if (Platform.OS === "web") {
      const uri = pickFromPool(ALL_CLOSET_IMAGES, Date.now());
      setImageUri(uri);
      runAnalysis(uri);
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      runAnalysis(uri);
    }
  }, [runAnalysis]);

  const handleGallery = useCallback(async () => {
    hapticLight();
    if (Platform.OS === "web") {
      const uri = pickFromPool(ALL_PRODUCT_IMAGES, Date.now() + 7);
      setImageUri(uri);
      runAnalysis(uri);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      runAnalysis(uri);
    }
  }, [runAnalysis]);

  const handleInspiration = useCallback(() => {
    hapticLight();
    const uri = pickFromPool(ALL_CLOSET_IMAGES, Date.now() + 13);
    setImageUri(uri);
    runAnalysis(uri);
  }, [runAnalysis]);

  const handleAddToCloset = useCallback(() => {
    if (!scannedItem) return;
    hapticSuccess();
    onItemAdded(scannedItem);
    onClose();
  }, [scannedItem, onItemAdded, onClose]);

  const scanLineTranslate = scanLineY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[S.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View style={[S.sheet, { transform: [{ translateY: sheetY }] }]}>
        <LinearGradient colors={["#0E0E0E", "#0A0A0A"]} style={StyleSheet.absoluteFill} />

        {/* Handle bar */}
        <View style={S.handle} />

        {/* Header */}
        <View style={S.sheetHeader}>
          <View>
            <Text style={S.sheetTitle}>Scan Item</Text>
            <Text style={S.sheetSub}>Threadly is learning your identity</Text>
          </View>
          <TouchableOpacity style={S.closeBtn} onPress={onClose}>
            <Text style={S.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Phase content */}
        {phase === "picker" && (
          <PickerPhase
            onCamera={handleCamera}
            onGallery={handleGallery}
            onInspiration={handleInspiration}
          />
        )}
        {phase === "analyzing" && imageUri && (
          <AnalysisPhase
            imageUri={imageUri}
            currentStep={currentStep}
            completedSteps={completedSteps}
            scanLineTranslate={scanLineTranslate}
            glowPulse={glowPulse}
            progressAnim={progressAnim}
            checkScales={checkScales}
          />
        )}
        {phase === "reveal" && scannedItem && imageUri && (
          <RevealPhase
            item={scannedItem}
            imageUri={imageUri}
            revealOpacity={revealOpacity}
            revealSlide={revealSlide}
            imageScale={imageScale}
            onAdd={handleAddToCloset}
            onRescan={() => setPhase("picker")}
            onClose={onClose}
          />
        )}
      </Animated.View>
    </Modal>
  );
}

// ─── Phase 1: Source Picker ───────────────────────────────────────────────────

function PickerPhase({
  onCamera,
  onGallery,
  onInspiration,
}: {
  onCamera: () => void;
  onGallery: () => void;
  onInspiration: () => void;
}) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(slideIn, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[S.pickerWrap, { opacity: fadeIn, transform: [{ translateY: slideIn }] }]}>
      {/* Decorative orb */}
      <View style={S.orbContainer}>
        <LinearGradient
          colors={["rgba(201,149,106,0.25)", "rgba(201,149,106,0.06)", "transparent"]}
          style={S.orbGradient}
        />
        <OrbPulse />
        <Text style={S.orbGlyph}>✦</Text>
      </View>

      <Text style={S.pickerHeadline}>Add to Your Wardrobe</Text>
      <Text style={S.pickerBody}>
        Threadly will analyze your item and build{"\n"}intelligent outfit connections instantly.
      </Text>

      <View style={S.sourceCards}>
        <SourceCard
          icon="📷"
          title="Take a Photo"
          desc="Point your camera at any garment"
          onPress={onCamera}
          primary
        />
        <SourceCard
          icon="🖼"
          title="Upload from Library"
          desc="Choose from your photo library"
          onPress={onGallery}
        />
        <SourceCard
          icon="✨"
          title="Add Inspiration"
          desc="Screenshot or save from anywhere"
          onPress={onInspiration}
          dim
        />
      </View>

      <Text style={S.pickerNote}>
        Your images are processed privately and never shared.
      </Text>
    </Animated.View>
  );
}

function OrbPulse() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.15, duration: 1400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.15, duration: 1400, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1, duration: 1400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5, duration: 1400, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={[S.orbRing, { transform: [{ scale }], opacity }]}
    />
  );
}

function SourceCard({
  icon,
  title,
  desc,
  onPress,
  primary = false,
  dim = false,
}: {
  icon: string;
  title: string;
  desc: string;
  onPress: () => void;
  primary?: boolean;
  dim?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  function pressIn() {
    Animated.spring(scale, { toValue: 0.97, tension: 200, friction: 10, useNativeDriver: true }).start();
  }
  function pressOut() {
    Animated.spring(scale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }).start();
  }
  return (
    <Animated.View style={[{ transform: [{ scale }] }, dim && S.cardDim]}>
      <Pressable
        style={[S.sourceCard, primary && S.sourceCardPrimary]}
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={onPress}
      >
        {primary && (
          <LinearGradient
            colors={["rgba(201,149,106,0.13)", "rgba(201,149,106,0.04)"]}
            style={StyleSheet.absoluteFill}
          />
        )}
        {primary && <View style={S.sourceCardTopBorder} />}
        <View style={S.sourceIconCircle}>
          <Text style={S.sourceIconText}>{icon}</Text>
        </View>
        <View style={S.sourceCardBody}>
          <Text style={[S.sourceCardTitle, primary && S.sourceCardTitlePrimary]}>{title}</Text>
          <Text style={S.sourceCardDesc}>{desc}</Text>
        </View>
        <Text style={[S.sourceArrow, primary && S.sourceArrowPrimary]}>→</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Phase 2: AI Analysis ─────────────────────────────────────────────────────

function AnalysisPhase({
  imageUri,
  currentStep,
  completedSteps,
  scanLineTranslate,
  glowPulse,
  progressAnim,
  checkScales,
}: {
  imageUri: string;
  currentStep: number;
  completedSteps: number[];
  scanLineTranslate: Animated.AnimatedInterpolation<number>;
  glowPulse: Animated.Value;
  progressAnim: Animated.Value;
  checkScales: Animated.Value[];
}) {
  const glowBorderOpacity = glowPulse.interpolate({
    inputRange: [0.35, 1],
    outputRange: [0.4, 1],
  });
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={S.analysisWrap}>
      {/* Scanned image with cinematic overlays */}
      <View style={S.scanImageContainer}>
        <Image source={{ uri: imageUri }} style={S.scanImage} resizeMode="cover" />

        {/* Vignette */}
        <LinearGradient
          colors={["rgba(10,10,10,0.4)", "transparent", "rgba(10,10,10,0.4)"]}
          style={StyleSheet.absoluteFill}
        />

        {/* Rose-gold glow border */}
        <Animated.View style={[S.scanGlowBorder, { opacity: glowBorderOpacity }]} />

        {/* Animated scan line */}
        <Animated.View
          style={[S.scanLine, { transform: [{ translateY: scanLineTranslate }] }]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={["transparent", ThreadlyColors.roseGold, "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={S.scanLineGrad}
          />
        </Animated.View>

        {/* Corner guides */}
        <View style={[S.corner, S.cornerTL]} />
        <View style={[S.corner, S.cornerTR]} />
        <View style={[S.corner, S.cornerBL]} />
        <View style={[S.corner, S.cornerBR]} />

        {/* AI label badge */}
        <View style={S.aiLabel}>
          <Animated.View style={[S.aiLabelDot, { opacity: glowPulse }]} />
          <Text style={S.aiLabelText}>THREADLY AI</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={S.progressTrack}>
        <Animated.View style={[S.progressFill, { width: progressWidth }]}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* Step list */}
      <ScrollView style={S.stepsList} showsVerticalScrollIndicator={false}>
        {ANALYSIS_STEPS.map((step, i) => {
          const done = completedSteps.includes(i);
          const active = currentStep === i && !done;
          return (
            <View key={i} style={S.stepRow}>
              <Animated.View
                style={[
                  S.stepBullet,
                  done && S.stepBulletDone,
                  active && S.stepBulletActive,
                  { transform: [{ scale: done ? checkScales[i] : 1 }] },
                ]}
              >
                <Text style={[S.stepBulletText, done && S.stepBulletTextDone]}>
                  {done ? "✓" : `${i + 1}`}
                </Text>
              </Animated.View>
              <View style={S.stepTextCol}>
                <Text style={[S.stepLabel, done && S.stepLabelDone, active && S.stepLabelActive]}>
                  {step.label}
                </Text>
                {active && <Text style={S.stepSub}>{step.sub}</Text>}
              </View>
              {active && <Text style={S.stepDots}>• • •</Text>}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Phase 3: Item Reveal ─────────────────────────────────────────────────────

function RevealPhase({
  item,
  imageUri,
  revealOpacity,
  revealSlide,
  imageScale,
  onAdd,
  onRescan,
  onClose,
}: {
  item: ScannedItem;
  imageUri: string;
  revealOpacity: Animated.Value;
  revealSlide: Animated.Value;
  imageScale: Animated.Value;
  onAdd: () => void;
  onRescan: () => void;
  onClose: () => void;
}) {
  const addScale = useRef(new Animated.Value(1)).current;
  function addIn() {
    Animated.spring(addScale, { toValue: 0.96, tension: 200, friction: 10, useNativeDriver: true }).start();
  }
  function addOut() {
    Animated.spring(addScale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }).start();
  }

  return (
    <Animated.View
      style={[S.revealWrap, { opacity: revealOpacity, transform: [{ translateY: revealSlide }] }]}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={S.revealScroll}>

        {/* Success indicator */}
        <View style={S.revealSuccessRow}>
          <View style={S.revealSuccessDot} />
          <Text style={S.revealSuccessLabel}>ITEM IDENTIFIED</Text>
        </View>

        {/* Image + metadata */}
        <View style={S.revealTopRow}>
          <Animated.View style={[S.revealImgWrap, { transform: [{ scale: imageScale }] }]}>
            <Image source={{ uri: imageUri }} style={S.revealImg} resizeMode="cover" />
            <LinearGradient
              colors={["transparent", "rgba(10,10,10,0.65)"]}
              style={StyleSheet.absoluteFill}
            />
            {/* Match score badge */}
            <View style={S.matchBadge}>
              <LinearGradient
                colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
                style={StyleSheet.absoluteFill}
              />
              <Text style={S.matchBadgeNum}>{item.matchScore}%</Text>
              <Text style={S.matchBadgeSub}>match</Text>
            </View>
          </Animated.View>

          <View style={S.revealMeta}>
            <Text style={S.revealItemName}>{item.name}</Text>
            <Text style={S.revealBrand}>{item.brand}</Text>
            <View style={S.revealCatChip}>
              <Text style={S.revealCatText}>{item.category}</Text>
            </View>
            <View style={S.styleTagChip}>
              <Text style={S.styleTagText}>✦ {item.styleTag}</Text>
            </View>
            {/* Occasions */}
            <View style={S.occasionRow}>
              {item.occasions.map((o, i) => (
                <View key={i} style={S.occasionChip}>
                  <Text style={S.occasionText}>{o}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Color DNA */}
        <View style={S.sectionBlock}>
          <Text style={S.sectionLabel}>COLOR DNA</Text>
          <View style={S.colorDnaCard}>
            <View style={[S.colorSwatch, { backgroundColor: item.colorHex }]} />
            <View style={S.colorDnaInfo}>
              <Text style={S.colorDnaName}>{item.color}</Text>
              <Text style={S.colorDnaHex}>{item.colorHex}</Text>
            </View>
            <View style={S.colorDnaFitBadge}>
              <Text style={S.colorDnaFitText}>Fits your palette</Text>
            </View>
          </View>
        </View>

        {/* Intelligence cards */}
        <View style={S.intelRow}>
          <View style={S.intelCard}>
            <Text style={S.intelNum}>{item.outfitCount}</Text>
            <Text style={S.intelCardLabel}>outfit{"\n"}combinations</Text>
          </View>
          <View style={S.intelCard}>
            <Text style={S.intelNum}>{item.matchScore}%</Text>
            <Text style={S.intelCardLabel}>style{"\n"}match score</Text>
          </View>
          <View style={S.intelCard}>
            <Text style={S.intelNum}>{item.closetIQ}</Text>
            <Text style={S.intelCardLabel}>closet{"\n"}IQ boost</Text>
          </View>
        </View>

        {/* Pairs Well With */}
        <View style={S.sectionBlock}>
          <Text style={S.sectionLabel}>PAIRS WELL WITH</Text>
          <View style={S.pairsRow}>
            {item.pairsWith.map((p, i) => (
              <View key={i} style={S.pairsChip}>
                <Text style={S.pairsChipText}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trending insight card */}
        <View style={S.trendCard}>
          <LinearGradient
            colors={["rgba(201,149,106,0.1)", "rgba(201,149,106,0.03)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={S.trendCardTopBorder} />
          <Text style={S.trendCardIcon}>✦</Text>
          <View style={S.trendCardBody}>
            <Text style={S.trendCardText}>
              Trending in{" "}
              <Text style={S.trendCardHighlight}>{item.trendingIn}</Text>
              {" "}aesthetics right now.
            </Text>
            <Text style={S.trendCardSub}>
              Already works with{" "}
              <Text style={S.trendCardHighlight}>{item.outfitCount} saved looks</Text>
              {" "}in your wardrobe.
            </Text>
          </View>
        </View>

        {/* Add CTA */}
        <Animated.View style={{ transform: [{ scale: addScale }] }}>
          <Pressable
            style={S.addBtn}
            onPressIn={addIn}
            onPressOut={addOut}
            onPress={onAdd}
          >
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={S.addBtnText}>Add to My Wardrobe</Text>
          </Pressable>
        </Animated.View>

        <TouchableOpacity style={S.rescanBtn} onPress={onRescan}>
          <Text style={S.rescanBtnText}>Scan Another Item</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  // Sheet
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.78)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: H * 0.92,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 2,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  sheetTitle: {
    fontSize: 17,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 2,
  },
  sheetSub: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 0.3,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteMuted,
  },

  // Picker
  pickerWrap: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  orbContainer: {
    alignSelf: "center",
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  orbGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
  },
  orbRing: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: ThreadlyColors.roseGold,
  },
  orbGlyph: {
    fontSize: 26,
    color: ThreadlyColors.roseGold,
  },
  pickerHeadline: {
    fontSize: 20,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    textAlign: "center",
    marginBottom: 8,
  },
  pickerBody: {
    fontSize: 13,
    color: ThreadlyColors.warmWhiteSubtle,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  sourceCards: { gap: 10 },
  cardDim: { opacity: 0.68 },
  sourceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: ThreadlyRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    padding: 16,
    gap: 14,
    overflow: "hidden",
  },
  sourceCardPrimary: {
    backgroundColor: "rgba(201,149,106,0.06)",
    borderColor: "rgba(201,149,106,0.3)",
  },
  sourceCardTopBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.5,
  },
  sourceIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(201,149,106,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  sourceIconText: { fontSize: 19 },
  sourceCardBody: { flex: 1 },
  sourceCardTitle: {
    fontSize: 14,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    marginBottom: 2,
  },
  sourceCardTitlePrimary: { color: ThreadlyColors.roseGoldLight },
  sourceCardDesc: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
  },
  sourceArrow: {
    fontSize: 16,
    color: ThreadlyColors.warmWhiteMuted,
  },
  sourceArrowPrimary: { color: ThreadlyColors.roseGold },
  pickerNote: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
    textAlign: "center",
    marginTop: 18,
    opacity: 0.55,
  },

  // Analysis
  analysisWrap: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 14,
  },
  scanImageContainer: {
    width: "100%",
    height: 210,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    marginBottom: 14,
    position: "relative",
  },
  scanImage: { width: "100%", height: "100%" },
  scanGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ThreadlyRadius.lg,
    borderWidth: 1.5,
    borderColor: ThreadlyColors.roseGold,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    top: 0,
  },
  scanLineGrad: { flex: 1, height: 2 },
  corner: {
    position: "absolute",
    width: 18,
    height: 18,
    borderColor: ThreadlyColors.roseGoldLight,
    borderWidth: 2,
  },
  cornerTL: { top: 8, left: 8, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 8, right: 8, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 8, left: 8, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 8, right: 8, borderLeftWidth: 0, borderTopWidth: 0 },
  aiLabel: {
    position: "absolute",
    bottom: 8,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(10,10,10,0.72)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  aiLabelDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: ThreadlyColors.roseGold,
  },
  aiLabelText: {
    fontSize: 8,
    fontWeight: "700",
    color: ThreadlyColors.roseGoldLight,
    letterSpacing: 1.8,
  },
  progressTrack: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 1,
    marginBottom: 18,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 1,
  },
  stepsList: { flex: 1 },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
    gap: 11,
  },
  stepBullet: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBulletDone: {
    backgroundColor: "rgba(201,149,106,0.18)",
    borderColor: ThreadlyColors.roseGold,
  },
  stepBulletActive: {
    borderColor: ThreadlyColors.roseGoldLight,
    backgroundColor: "rgba(201,149,106,0.07)",
  },
  stepBulletText: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteSubtle,
    fontWeight: "600",
  },
  stepBulletTextDone: { color: ThreadlyColors.roseGoldLight },
  stepTextCol: { flex: 1 },
  stepLabel: {
    fontSize: 13,
    color: ThreadlyColors.warmWhiteSubtle,
  },
  stepLabelDone: { color: ThreadlyColors.warmWhite },
  stepLabelActive: { color: ThreadlyColors.warmWhite, fontWeight: "600" },
  stepSub: {
    fontSize: 10,
    color: ThreadlyColors.roseGoldLight,
    marginTop: 1,
    opacity: 0.8,
  },
  stepDots: {
    fontSize: 11,
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
  },

  // Reveal
  revealWrap: { flex: 1 },
  revealScroll: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 28,
  },
  revealSuccessRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  revealSuccessDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: ThreadlyColors.roseGold,
  },
  revealSuccessLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGoldLight,
    letterSpacing: 2.2,
  },
  revealTopRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },
  revealImgWrap: {
    width: 110,
    height: 148,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  revealImg: { width: "100%", height: "100%" },
  matchBadge: {
    position: "absolute",
    bottom: 7,
    left: 7,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignItems: "center",
    overflow: "hidden",
  },
  matchBadgeNum: {
    fontSize: 13,
    fontFamily: "Georgia",
    color: "#0A0A0A",
    fontWeight: "700",
  },
  matchBadgeSub: {
    fontSize: 7,
    color: "#0A0A0A",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  revealMeta: { flex: 1, paddingTop: 2 },
  revealItemName: {
    fontSize: 16,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 3,
    lineHeight: 21,
  },
  revealBrand: {
    fontSize: 11,
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  revealCatChip: {
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  revealCatText: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteMuted,
    fontWeight: "600",
  },
  styleTagChip: {
    backgroundColor: "rgba(201,149,106,0.1)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.22)",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  styleTagText: {
    fontSize: 10,
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },
  occasionRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  occasionChip: {
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  occasionText: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle },

  sectionBlock: { marginBottom: 14 },
  sectionLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 2.2,
    marginBottom: 9,
  },
  colorDnaCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: ThreadlyRadius.md,
    padding: 13,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  colorSwatch: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.12)",
  },
  colorDnaInfo: { flex: 1 },
  colorDnaName: {
    fontSize: 13,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    marginBottom: 2,
  },
  colorDnaHex: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteSubtle,
    fontFamily: "monospace",
  },
  colorDnaFitBadge: {
    backgroundColor: "rgba(201,149,106,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  colorDnaFitText: {
    fontSize: 9,
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },

  intelRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  intelCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: ThreadlyRadius.md,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  intelNum: {
    fontSize: 18,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGoldLight,
    marginBottom: 3,
  },
  intelCardLabel: {
    fontSize: 8,
    color: ThreadlyColors.warmWhiteSubtle,
    textAlign: "center",
    lineHeight: 12,
    letterSpacing: 0.3,
  },

  pairsRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  pairsChip: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  pairsChipText: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteMuted,
  },

  trendCard: {
    borderRadius: ThreadlyRadius.lg,
    padding: 14,
    marginBottom: 18,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.18)",
  },
  trendCardTopBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.45,
  },
  trendCardIcon: {
    fontSize: 15,
    color: ThreadlyColors.roseGold,
    marginTop: 1,
  },
  trendCardBody: { flex: 1 },
  trendCardText: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 18,
    marginBottom: 4,
  },
  trendCardSub: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    lineHeight: 18,
  },
  trendCardHighlight: {
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },

  addBtn: {
    height: 52,
    borderRadius: ThreadlyRadius.pill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 11,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0A0A0A",
    letterSpacing: 0.3,
  },
  rescanBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  rescanBtnText: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
  },
});
