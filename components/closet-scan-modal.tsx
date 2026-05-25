/**
 * Threadly — Closet Scan Modal
 * The signature product moment: photographing a garment transforms into wardrobe intelligence.
 * Emotional outcome: "Threadly is learning my style."
 *
 * Flow:
 *   1. Source Picker  → camera / photo library / inspiration URL
 *   2. AI Analysis    → scan line sweep, glow pulse, step-by-step intelligence reveal
 *   3. Item Reveal    → Color DNA, Style Match, Pairs Well, outfit count, add to closet
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from "@/constants/threadly";
import { useScalePress, hapticLight, hapticSuccess } from "@/lib/animations";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

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
  pairsWith: string[];
  trendingIn: string;
  worn: number;
};

type ScanPhase = "picker" | "analyzing" | "reveal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onItemAdded: (item: ScannedItem) => void;
};

// ─── Mock AI Analysis Engine ──────────────────────────────────────────────────
// In production this calls the server LLM with the image.
// For now, it deterministically derives rich metadata from the image URI.

const BRANDS = ["Zara", "Aritzia", "COS", "Everlane", "Mango", "Uniqlo", "H&M", "& Other Stories", "Massimo Dutti"];
const CATEGORIES = ["Blazer", "Trousers", "Dress", "Blouse", "Coat", "Knitwear", "Denim", "Skirt", "Top"];
const COLORS = [
  { name: "Ivory", hex: "#FAF7F2" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Charcoal", hex: "#3A3A3A" },
  { name: "Blush", hex: "#E8C4B8" },
  { name: "Sage", hex: "#8FAF8A" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Cream", hex: "#F5F0E8" },
  { name: "Burgundy", hex: "#722F37" },
];
const STYLE_TAGS = ["Quiet Luxury", "Clean Girl", "Old Money", "Minimal Chic", "Casual Elevated", "Parisian Edit"];
const PAIRS_WITH = [
  ["Straight-leg trousers", "Loafers", "Silk scarf"],
  ["Wide-leg jeans", "White sneakers", "Gold hoops"],
  ["Midi skirt", "Block heels", "Structured bag"],
  ["Tailored shorts", "Mules", "Delicate necklace"],
];
const TRENDING = [
  "Quiet Luxury aesthetic",
  "Clean Girl wardrobe",
  "Old Money edit",
  "Minimal Chic feeds",
  "Parisian wardrobe",
];

function mockAnalyze(uri: string): ScannedItem {
  const seed = uri.length % 9;
  const color = COLORS[seed];
  return {
    id: `scan_${Date.now()}`,
    name: `${color.name} ${CATEGORIES[seed]}`,
    brand: BRANDS[seed],
    category: CATEGORIES[seed],
    color: color.name,
    colorHex: color.hex,
    styleTag: STYLE_TAGS[seed % STYLE_TAGS.length],
    image: uri,
    outfitCount: 8 + (seed * 3),
    matchScore: 88 + (seed % 10),
    pairsWith: PAIRS_WITH[seed % PAIRS_WITH.length],
    trendingIn: TRENDING[seed % TRENDING.length],
    worn: 0,
  };
}

// ─── Analysis Steps ───────────────────────────────────────────────────────────

const ANALYSIS_STEPS = [
  { label: "Identifying brand", detail: "Scanning fabric texture & label" },
  { label: "Detecting color palette", detail: "Mapping to your Color DNA" },
  { label: "Classifying category", detail: "Recognizing silhouette & cut" },
  { label: "Tagging style aesthetic", detail: "Matching to your vibes" },
  { label: "Checking outfit compatibility", detail: "Cross-referencing 24 items" },
  { label: "Building wardrobe card", detail: "Personalizing to your closet" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function ClosetScanModal({ visible, onClose, onItemAdded }: Props) {
  const [phase, setPhase] = useState<ScanPhase>("picker");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);

  // Reset on open
  useEffect(() => {
    if (visible) {
      setPhase("picker");
      setSelectedImage(null);
      setAnalysisStep(0);
      setCompletedSteps([]);
      setScannedItem(null);
    }
  }, [visible]);

  const handleImageSelected = useCallback((uri: string) => {
    setSelectedImage(uri);
    setPhase("analyzing");
    hapticLight();
    // Run mock analysis steps
    let step = 0;
    const advance = () => {
      if (step < ANALYSIS_STEPS.length) {
        setAnalysisStep(step);
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, step]);
          step++;
          setTimeout(advance, 320);
        }, 680);
      } else {
        // Reveal
        const item = mockAnalyze(uri);
        setScannedItem(item);
        setTimeout(() => {
          setPhase("reveal");
          hapticSuccess();
        }, 400);
      }
    };
    setTimeout(advance, 600);
  }, []);

  const handleLaunchCamera = useCallback(async () => {
    hapticLight();
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") return;
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      if (!result.canceled) handleImageSelected(result.assets[0].uri);
    } else {
      // Web fallback — use a fashion image
      handleImageSelected("https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80");
    }
  }, [handleImageSelected]);

  const handleLaunchLibrary = useCallback(async () => {
    hapticLight();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled) handleImageSelected(result.assets[0].uri);
  }, [handleImageSelected]);

  const handleInspirationDemo = useCallback(() => {
    hapticLight();
    // Demo with a curated fashion image
    const DEMO_IMAGES = [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    ];
    const pick = DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)];
    handleImageSelected(pick);
  }, [handleImageSelected]);

  const handleAddToCloset = useCallback(() => {
    if (!scannedItem) return;
    hapticSuccess();
    onItemAdded(scannedItem);
    onClose();
  }, [scannedItem, onItemAdded, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <View style={styles.root}>
        <LinearGradient
          colors={[ThreadlyColors.black, "#0D0D0D", ThreadlyColors.black]}
          style={StyleSheet.absoluteFill}
        />

        {phase === "picker" && (
          <PickerPhase
            onCamera={handleLaunchCamera}
            onLibrary={handleLaunchLibrary}
            onInspiration={handleInspirationDemo}
            onClose={onClose}
          />
        )}

        {phase === "analyzing" && selectedImage && (
          <AnalyzingPhase
            image={selectedImage}
            currentStep={analysisStep}
            completedSteps={completedSteps}
          />
        )}

        {phase === "reveal" && scannedItem && (
          <RevealPhase
            item={scannedItem}
            onAdd={handleAddToCloset}
            onRetry={() => setPhase("picker")}
            onClose={onClose}
          />
        )}
      </View>
    </Modal>
  );
}

// ─── Phase 1: Picker ──────────────────────────────────────────────────────────

function PickerPhase({
  onCamera,
  onLibrary,
  onInspiration,
  onClose,
}: {
  onCamera: () => void;
  onLibrary: () => void;
  onInspiration: () => void;
  onClose: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.phaseContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Header */}
      <View style={styles.pickerHeader}>
        <Pressable onPress={onClose} style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}>
          <Text style={styles.closeBtnText}>✕</Text>
        </Pressable>
        <View style={styles.pickerHeaderCenter}>
          <Text style={styles.pickerTitle}>SCAN ITEM</Text>
          <View style={styles.roseGoldDivider} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Viewfinder Frame */}
      <View style={styles.viewfinderWrap}>
        <View style={styles.viewfinder}>
          {/* Corner brackets */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          {/* Center crosshair */}
          <View style={styles.crosshairH} />
          <View style={styles.crosshairV} />
          {/* Subtle scan line */}
          <ScanLineIdle />
          {/* Center label */}
          <View style={styles.viewfinderLabel}>
            <Text style={styles.viewfinderLabelText}>Point at any garment</Text>
          </View>
        </View>
      </View>

      {/* Source Options */}
      <View style={styles.sourceOptions}>
        <Text style={styles.sourceOptionsLabel}>Choose how to scan</Text>

        <SourceButton
          icon="📷"
          title="Take Photo"
          subtitle="Use your camera"
          onPress={onCamera}
          primary
        />
        <SourceButton
          icon="🖼"
          title="Photo Library"
          subtitle="Select from your gallery"
          onPress={onLibrary}
        />
        <SourceButton
          icon="✨"
          title="Inspiration Image"
          subtitle="Upload a screenshot or Pinterest save"
          onPress={onInspiration}
        />
      </View>

      <Text style={styles.pickerFootnote}>
        Threadly identifies brand, color, and style automatically
      </Text>
    </Animated.View>
  );
}

function ScanLineIdle() {
  const pos = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pos, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(pos, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const translateY = pos.interpolate({ inputRange: [0, 1], outputRange: [0, VIEWFINDER_H - 2] });
  return (
    <Animated.View
      style={[styles.scanLineIdle, { transform: [{ translateY }] }]}
      pointerEvents="none"
    />
  );
}

function SourceButton({
  icon,
  title,
  subtitle,
  onPress,
  primary = false,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  primary?: boolean;
}) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.97);
  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[styles.sourceBtn, primary && styles.sourceBtnPrimary, { transform: [{ scale }] }]}>
        {primary && (
          <LinearGradient
            colors={[ThreadlyColors.roseGold + "33", ThreadlyColors.roseGold + "11"]}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={[styles.sourceBtnBorder, primary && styles.sourceBtnBorderPrimary]} />
        <Text style={styles.sourceBtnIcon}>{icon}</Text>
        <View style={styles.sourceBtnText}>
          <Text style={[styles.sourceBtnTitle, primary && styles.sourceBtnTitlePrimary]}>{title}</Text>
          <Text style={styles.sourceBtnSub}>{subtitle}</Text>
        </View>
        <Text style={[styles.sourceBtnArrow, primary && styles.sourceBtnArrowPrimary]}>→</Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Phase 2: Analyzing ───────────────────────────────────────────────────────

function AnalyzingPhase({
  image,
  currentStep,
  completedSteps,
}: {
  image: string;
  currentStep: number;
  completedSteps: number[];
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scanPos = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    Animated.timing(imageOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    // Scan line sweep
    Animated.loop(
      Animated.timing(scanPos, { toValue: 1, duration: 1400, useNativeDriver: true })
    ).start();
    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.9, duration: 900, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scanTranslateY = scanPos.interpolate({
    inputRange: [0, 1],
    outputRange: [0, ANALYSIS_IMAGE_H],
  });

  return (
    <Animated.View style={[styles.phaseContainer, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.analysisHeader}>
        <Text style={styles.analysisHeaderTitle}>ANALYZING</Text>
        <View style={styles.roseGoldDivider} />
        <Text style={styles.analysisHeaderSub}>Threadly is learning this piece</Text>
      </View>

      {/* Image with scan overlay */}
      <View style={styles.analysisImageWrap}>
        <Animated.Image
          source={{ uri: image }}
          style={[styles.analysisImage, { opacity: imageOpacity }]}
          resizeMode="cover"
        />
        {/* Dark overlay */}
        <LinearGradient
          colors={["transparent", ThreadlyColors.black + "88", "transparent"]}
          style={StyleSheet.absoluteFill}
        />
        {/* Scan line */}
        <Animated.View
          style={[styles.scanLine, { transform: [{ translateY: scanTranslateY }] }]}
          pointerEvents="none"
        />
        {/* Rose-gold glow border */}
        <Animated.View
          style={[styles.analysisGlowBorder, { opacity: glowOpacity }]}
          pointerEvents="none"
        />
        {/* Corner brackets */}
        <View style={[styles.corner, styles.cornerTL, styles.cornerAnalysis]} />
        <View style={[styles.corner, styles.cornerTR, styles.cornerAnalysis]} />
        <View style={[styles.corner, styles.cornerBL, styles.cornerAnalysis]} />
        <View style={[styles.corner, styles.cornerBR, styles.cornerAnalysis]} />
      </View>

      {/* Step list */}
      <View style={styles.stepList}>
        {ANALYSIS_STEPS.map((step, i) => (
          <AnalysisStepRow
            key={i}
            label={step.label}
            detail={step.detail}
            state={
              completedSteps.includes(i)
                ? "done"
                : i === currentStep
                ? "active"
                : "pending"
            }
          />
        ))}
      </View>
    </Animated.View>
  );
}

function AnalysisStepRow({
  label,
  detail,
  state,
}: {
  label: string;
  detail: string;
  state: "pending" | "active" | "done";
}) {
  const opacity = useRef(new Animated.Value(state === "pending" ? 0.3 : 1)).current;
  const scale = useRef(new Animated.Value(state === "active" ? 1.02 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: state === "pending" ? 0.3 : 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: state === "active" ? 1.02 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [state]);

  return (
    <Animated.View style={[styles.stepRow, { opacity, transform: [{ scale }] }]}>
      <View style={styles.stepIconWrap}>
        {state === "done" ? (
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            style={styles.stepIconDone}
          >
            <Text style={styles.stepCheckmark}>✓</Text>
          </LinearGradient>
        ) : state === "active" ? (
          <View style={styles.stepIconActive}>
            <ActiveDot />
          </View>
        ) : (
          <View style={styles.stepIconPending} />
        )}
      </View>
      <View style={styles.stepTextWrap}>
        <Text style={[styles.stepLabel, state === "done" && styles.stepLabelDone, state === "active" && styles.stepLabelActive]}>
          {label}
        </Text>
        {state === "active" && <Text style={styles.stepDetail}>{detail}</Text>}
      </View>
    </Animated.View>
  );
}

function ActiveDot() {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.activeDot, { opacity: pulse }]} />;
}

// ─── Phase 3: Reveal ──────────────────────────────────────────────────────────

function RevealPhase({
  item,
  onAdd,
  onRetry,
  onClose,
}: {
  item: ScannedItem;
  onAdd: () => void;
  onRetry: () => void;
  onClose: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      Animated.timing(imageOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, tension: 55, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);

  const { scale: addScale, onPressIn: addIn, onPressOut: addOut } = useScalePress(0.96);
  const { scale: retryScale, onPressIn: retryIn, onPressOut: retryOut } = useScalePress(0.96);

  return (
    <Animated.ScrollView
      style={[styles.phaseContainer, { opacity: fadeAnim }]}
      contentContainerStyle={styles.revealScroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.revealHeader}>
        <Pressable onPress={onClose} style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}>
          <Text style={styles.closeBtnText}>✕</Text>
        </Pressable>
        <View style={styles.revealHeaderCenter}>
          <Text style={styles.revealTitle}>ITEM IDENTIFIED</Text>
          <View style={styles.roseGoldDivider} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Item Card */}
      <Animated.View style={[styles.revealCard, { transform: [{ scale: cardScale }, { translateY: slideAnim }] }]}>
        <LinearGradient colors={["#1A1410", "#161616"]} style={StyleSheet.absoluteFill} />
        <View style={styles.revealCardBorder} />

        {/* Image + overlay */}
        <View style={styles.revealImageWrap}>
          <Animated.Image
            source={{ uri: item.image }}
            style={[styles.revealImage, { opacity: imageOpacity }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", ThreadlyColors.black + "CC"]}
            style={[StyleSheet.absoluteFill, { borderRadius: ThreadlyRadius.lg }]}
          />
          {/* Match score badge */}
          <View style={styles.matchBadge}>
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.matchBadgeText}>{item.matchScore}%</Text>
            <Text style={styles.matchBadgeLabel}>match</Text>
          </View>
          {/* Style tag */}
          <View style={styles.styleTagBadge}>
            <Text style={styles.styleTagText}>{item.styleTag}</Text>
          </View>
        </View>

        {/* Item identity */}
        <View style={styles.revealIdentity}>
          <Text style={styles.revealBrand}>{item.brand.toUpperCase()}</Text>
          <Text style={styles.revealItemName}>{item.name}</Text>
          <Text style={styles.revealCategory}>{item.category}</Text>
        </View>

        {/* Color DNA */}
        <View style={styles.dnaRow}>
          <View style={styles.dnaSection}>
            <Text style={styles.dnaSectionLabel}>COLOR DNA</Text>
            <View style={styles.dnaColorRow}>
              <View style={[styles.dnaColorSwatch, { backgroundColor: item.colorHex }]} />
              <Text style={styles.dnaColorName}>{item.color}</Text>
            </View>
          </View>
          <View style={styles.dnaDivider} />
          <View style={styles.dnaSection}>
            <Text style={styles.dnaSectionLabel}>WORKS WITH</Text>
            <Text style={styles.dnaOutfitCount}>{item.outfitCount} outfits</Text>
            <Text style={styles.dnaOutfitSub}>in your closet</Text>
          </View>
        </View>

        {/* Pairs Well */}
        <View style={styles.pairsSection}>
          <Text style={styles.pairsSectionLabel}>PAIRS WELL WITH</Text>
          <View style={styles.pairsChips}>
            {item.pairsWith.map((pair, i) => (
              <View key={i} style={styles.pairsChip}>
                <Text style={styles.pairsChipText}>{pair}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trending */}
        <View style={styles.trendingRow}>
          <View style={styles.trendingDot} />
          <Text style={styles.trendingText}>
            Trending in <Text style={styles.trendingHighlight}>{item.trendingIn}</Text>
          </Text>
        </View>

        {/* Intelligence insight */}
        <View style={styles.insightRow}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold + "18", ThreadlyColors.roseGold + "08"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.insightBorder} />
          <Text style={styles.insightIcon}>✦</Text>
          <Text style={styles.insightText}>
            Adding this piece increases your outfit combinations by{" "}
            <Text style={styles.insightHighlight}>{item.outfitCount} new looks</Text>
          </Text>
        </View>
      </Animated.View>

      {/* Actions */}
      <View style={styles.revealActions}>
        <Pressable onPressIn={addIn} onPressOut={addOut} onPress={onAdd}>
          <Animated.View style={[styles.addBtn, { transform: [{ scale: addScale }] }]}>
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.addBtnText}>Add to My Closet</Text>
          </Animated.View>
        </Pressable>

        <Pressable onPressIn={retryIn} onPressOut={retryOut} onPress={onRetry}>
          <Animated.View style={[styles.retryBtn, { transform: [{ scale: retryScale }] }]}>
            <View style={styles.retryBtnBorder} />
            <Text style={styles.retryBtnText}>Scan Another Item</Text>
          </Animated.View>
        </Pressable>
      </View>

      <View style={{ height: 40 }} />
    </Animated.ScrollView>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VIEWFINDER_W = SCREEN_W - 64;
const VIEWFINDER_H = VIEWFINDER_W * 1.25;
const ANALYSIS_IMAGE_H = 220;
const CORNER_SIZE = 22;
const CORNER_THICKNESS = 2;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThreadlyColors.black,
  },
  phaseContainer: {
    flex: 1,
  },

  // ── Picker ──
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: ThreadlyColors.warmWhite,
    fontSize: 18,
    opacity: 0.7,
  },
  pickerHeaderCenter: {
    alignItems: "center",
    gap: 6,
  },
  pickerTitle: {
    fontFamily: "Georgia",
    fontSize: 13,
    letterSpacing: 4,
    color: ThreadlyColors.warmWhite,
  },
  roseGoldDivider: {
    width: 32,
    height: 1,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.8,
  },
  viewfinderWrap: {
    alignItems: "center",
    paddingVertical: 20,
  },
  viewfinder: {
    width: VIEWFINDER_W,
    height: VIEWFINDER_H,
    backgroundColor: ThreadlyColors.charcoal + "44",
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: ThreadlyColors.roseGold,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: ThreadlyColors.roseGold,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: ThreadlyColors.roseGold,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: ThreadlyColors.roseGold,
  },
  cornerAnalysis: {
    borderColor: ThreadlyColors.roseGold,
    opacity: 0.8,
  },
  crosshairH: {
    position: "absolute",
    top: "50%",
    left: "20%",
    right: "20%",
    height: 0.5,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.25,
  },
  crosshairV: {
    position: "absolute",
    left: "50%",
    top: "20%",
    bottom: "20%",
    width: 0.5,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.25,
  },
  scanLineIdle: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.35,
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  viewfinderLabel: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  viewfinderLabelText: {
    color: ThreadlyColors.warmWhite,
    fontSize: 11,
    letterSpacing: 1.5,
    opacity: 0.5,
  },
  sourceOptions: {
    paddingHorizontal: 24,
    gap: 10,
  },
  sourceOptionsLabel: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  sourceBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    padding: 16,
    gap: 14,
    overflow: "hidden",
  },
  sourceBtnPrimary: {
    backgroundColor: "#1A1410",
  },
  sourceBtnBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ThreadlyRadius.lg,
    borderWidth: 0.5,
    borderColor: ThreadlyColors.charcoalLight,
  },
  sourceBtnBorderPrimary: {
    borderColor: ThreadlyColors.roseGold,
    opacity: 0.6,
  },
  sourceBtnIcon: { fontSize: 22 },
  sourceBtnText: { flex: 1 },
  sourceBtnTitle: {
    color: ThreadlyColors.warmWhite,
    fontSize: 15,
    fontWeight: "600",
  },
  sourceBtnTitlePrimary: {
    color: ThreadlyColors.roseGoldLight,
  },
  sourceBtnSub: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 12,
    marginTop: 2,
  },
  sourceBtnArrow: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 18,
  },
  sourceBtnArrowPrimary: {
    color: ThreadlyColors.roseGold,
  },
  pickerFootnote: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 32,
    paddingTop: 16,
    opacity: 0.6,
    letterSpacing: 0.3,
  },

  // ── Analyzing ──
  analysisHeader: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    gap: 8,
  },
  analysisHeaderTitle: {
    fontFamily: "Georgia",
    fontSize: 13,
    letterSpacing: 4,
    color: ThreadlyColors.warmWhite,
  },
  analysisHeaderSub: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  analysisImageWrap: {
    marginHorizontal: 32,
    height: ANALYSIS_IMAGE_H,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    position: "relative",
  },
  analysisImage: {
    width: "100%",
    height: "100%",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.85,
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  analysisGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ThreadlyRadius.xl,
    borderWidth: 1.5,
    borderColor: ThreadlyColors.roseGold,
  },
  stepList: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 12,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  stepIconWrap: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepIconDone: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCheckmark: {
    color: ThreadlyColors.black,
    fontSize: 11,
    fontWeight: "700",
  },
  stepIconActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: ThreadlyColors.roseGold,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThreadlyColors.roseGold,
  },
  stepIconPending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  stepTextWrap: { flex: 1 },
  stepLabel: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  stepLabelDone: {
    color: ThreadlyColors.warmWhite,
  },
  stepLabelActive: {
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },
  stepDetail: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 11,
    marginTop: 2,
    opacity: 0.7,
  },

  // ── Reveal ──
  revealScroll: {
    paddingBottom: 20,
  },
  revealHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  revealHeaderCenter: {
    alignItems: "center",
    gap: 6,
  },
  revealTitle: {
    fontFamily: "Georgia",
    fontSize: 13,
    letterSpacing: 4,
    color: ThreadlyColors.warmWhite,
  },
  revealCard: {
    marginHorizontal: 20,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    position: "relative",
  },
  revealCardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ThreadlyRadius.xl,
    borderWidth: 0.5,
    borderColor: ThreadlyColors.roseGold,
    opacity: 0.4,
    zIndex: 10,
  },
  revealImageWrap: {
    height: 280,
    position: "relative",
  },
  revealImage: {
    width: "100%",
    height: "100%",
  },
  matchBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  matchBadgeText: {
    color: ThreadlyColors.black,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 18,
  },
  matchBadgeLabel: {
    color: ThreadlyColors.black,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  styleTagBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: ThreadlyColors.black + "CC",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: ThreadlyColors.roseGold + "66",
  },
  styleTagText: {
    color: ThreadlyColors.roseGoldLight,
    fontSize: 11,
    letterSpacing: 1,
  },
  revealIdentity: {
    padding: 20,
    paddingBottom: 12,
    gap: 3,
  },
  revealBrand: {
    color: ThreadlyColors.roseGold,
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "600",
  },
  revealItemName: {
    color: ThreadlyColors.warmWhite,
    fontSize: 22,
    fontFamily: "Georgia",
    fontWeight: "400",
    lineHeight: 28,
  },
  revealCategory: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 13,
  },
  dnaRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: ThreadlyColors.charcoal + "88",
    borderRadius: ThreadlyRadius.md,
    padding: 16,
    alignItems: "center",
  },
  dnaSection: { flex: 1, gap: 6 },
  dnaSectionLabel: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 9,
    letterSpacing: 2,
  },
  dnaColorRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dnaColorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: ThreadlyColors.charcoalLight,
  },
  dnaColorName: {
    color: ThreadlyColors.warmWhite,
    fontSize: 14,
    fontWeight: "600",
  },
  dnaDivider: {
    width: 0.5,
    height: 40,
    backgroundColor: ThreadlyColors.charcoalLight,
    marginHorizontal: 16,
  },
  dnaOutfitCount: {
    color: ThreadlyColors.warmWhite,
    fontSize: 20,
    fontWeight: "700",
  },
  dnaOutfitSub: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 11,
  },
  pairsSection: {
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 10,
  },
  pairsSectionLabel: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 9,
    letterSpacing: 2,
  },
  pairsChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pairsChip: {
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: ThreadlyColors.charcoalLight,
  },
  pairsChipText: {
    color: ThreadlyColors.warmWhite,
    fontSize: 12,
  },
  trendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  trendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ThreadlyColors.roseGold,
  },
  trendingText: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 12,
  },
  trendingHighlight: {
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: ThreadlyRadius.md,
    padding: 14,
    overflow: "hidden",
    position: "relative",
  },
  insightBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 0.5,
    borderColor: ThreadlyColors.roseGold,
    opacity: 0.3,
  },
  insightIcon: {
    color: ThreadlyColors.roseGold,
    fontSize: 14,
  },
  insightText: {
    flex: 1,
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  insightHighlight: {
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },
  revealActions: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  addBtn: {
    height: 56,
    borderRadius: ThreadlyRadius.pill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  addBtnText: {
    color: ThreadlyColors.black,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  retryBtn: {
    height: 52,
    borderRadius: ThreadlyRadius.pill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  retryBtnBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ThreadlyRadius.pill,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  retryBtnText: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 15,
    fontWeight: "500",
  },
});
