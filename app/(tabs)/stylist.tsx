/**
 * Threadly — Stylist
 * AI conversational stylist. Emotional outcome: "Like having a stylist who understands you."
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { usePersonalization } from '@/lib/personalization';
import { VIBE_STYLIST_POOL, VIBE_OUTFIT_POOL, pickVibeImage } from '@/lib/images';
import { useScalePress, useImageFade, hapticLight, hapticSuccess } from '@/lib/animations';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  FlatList,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import {
  ThreadlyColors,
  ThreadlySpacing,
  ThreadlyRadius,
} from "@/constants/threadly";

const { width } = Dimensions.get("window");

type Message = {
  id: string;
  role: "user" | "stylist";
  text: string;
  cards?: RecoCard[];
  timestamp: string;
};

type RecoCard = {
  id: string;
  brand: string;
  item: string;
  price: number;
  image: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "stylist",
    text: "Hi, I'm your Threadly stylist. I've analyzed your wardrobe — you have great bones to work with. What are we dressing you for today?",
    timestamp: "now",
  },
];

const SUGGESTION_CHIPS = [
  "Build me a look from what I own",
  "I have a rooftop dinner tonight",
  "Find me deals under $50",
  "What's trending this week?",
  "Make me look expensive for less",
  "Work outfit that still feels like me",
];

// MOCK_RESPONSES are built dynamically in the component using vibe-matched images
// See buildMockResponses() below
type MockResponses = Record<string, Message>;

function buildMockResponses(vibe: string): MockResponses {
  return {
    default: {
      id: "r1",
      role: "stylist",
      text: "I love that. Based on your closet, here's what I'd pull together — you already own 80% of this look. The only missing piece is a blazer, and I found one at 46% off.",
      cards: [
        { id: "c1", brand: "ZARA", item: "Tailored Blazer", price: 78, image: pickVibeImage(VIBE_STYLIST_POOL, vibe, 0) },
        { id: "c2", brand: "YOUR CLOSET", item: "Straight-Leg Jeans", price: 0, image: pickVibeImage(VIBE_OUTFIT_POOL, vibe, 1) },
        { id: "c3", brand: "YOUR CLOSET", item: "White Linen Shirt", price: 0, image: pickVibeImage(VIBE_STYLIST_POOL, vibe, 2) },
      ],
      timestamp: "now",
    },
    rooftop: {
      id: "r2",
      role: "stylist",
      text: "Rooftop dinner — I'm thinking elevated but effortless. Your camel blazer is perfect here. Pair it with the midi slip dress from your closet and these heels I found at 42% off.",
      cards: [
        { id: "c4", brand: "YOUR CLOSET", item: "Camel Blazer", price: 0, image: pickVibeImage(VIBE_OUTFIT_POOL, vibe, 0) },
        { id: "c5", brand: "YOUR CLOSET", item: "Midi Slip Dress", price: 0, image: pickVibeImage(VIBE_STYLIST_POOL, vibe, 1) },
        { id: "c6", brand: "ALDO", item: "Pointed Slingback", price: 55, image: pickVibeImage(VIBE_STYLIST_POOL, vibe, 3) },
      ],
      timestamp: "now",
    },
    deals: {
      id: "r3",
      role: "stylist",
      text: "Under $50 and on-trend? I've got you. These three pieces all match your style profile and are currently on sale. Together they build 4 different looks.",
      cards: [
        { id: "c7", brand: "H&M", item: "Linen Trousers", price: 25, image: pickVibeImage(VIBE_STYLIST_POOL, vibe, 2) },
        { id: "c8", brand: "MANGO", item: "Gold Hoops", price: 14, image: pickVibeImage(VIBE_OUTFIT_POOL, vibe, 3) },
        { id: "c9", brand: "COS", item: "White Sneakers", price: 28, image: pickVibeImage(VIBE_STYLIST_POOL, vibe, 4) },
      ],
      timestamp: "now",
    },
  };
}

function getResponse(text: string, vibe: string): Message {
  const responses = buildMockResponses(vibe);
  const lower = text.toLowerCase();
  if (lower.includes("rooftop") || lower.includes("dinner")) return { ...responses.rooftop, id: Date.now().toString(), timestamp: "now" };
  if (lower.includes("deal") || lower.includes("$50") || lower.includes("under")) return { ...responses.deals, id: Date.now().toString(), timestamp: "now" };
  return { ...responses.default, id: Date.now().toString(), timestamp: "now" };
}

export default function StylistScreen() {
  const p = usePersonalization();

  // Build personalized initial message once profile loads
  const initialMessages = useMemo((): Message[] => {
    if (p.isLoading) return INITIAL_MESSAGES;
    const vibe = p.sectionTitle.replace(' picks for you', '').replace(' for you', '');
    return [{
      id: '1',
      role: 'stylist',
      text: `Hi — I've already analyzed your wardrobe and built your ${vibe} profile. ${p.insightText} What are we dressing you for today?`,
      timestamp: 'now',
    }];
  }, [p.isLoading, p.sectionTitle, p.insightText]);

  // Build personalized suggestion chips from profile occasions
  const suggestionChips = useMemo(() => {
    if (p.isLoading) return SUGGESTION_CHIPS;
    const occasionChip = p.outfits[0]?.occasion ? `Build me a look for ${p.outfits[0].occasion}` : 'Build me a look from what I own';
    const brandChip = p.deals[0]?.brand ? `Find me deals from ${p.deals[0].brand}` : 'Find me deals under $50';
    return [
      occasionChip,
      brandChip,
      `What's trending in ${p.sectionTitle.replace(' picks for you', '')}?`,
      'Make me look expensive for less',
      'Work outfit that still feels like me',
      p.goNewLabel.replace(' →', ''),
    ];
  }, [p.isLoading, p.outfits, p.deals, p.sectionTitle, p.goNewLabel]);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  // Update messages when profile loads
  useEffect(() => {
    if (!p.isLoading) {
      setMessages(initialMessages);
    }
  }, [p.isLoading]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const primaryVibe = p.outfits[0]?.vibeTag ?? 'default';

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim(), timestamp: "now" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, getResponse(text, primaryVibe)]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1400);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarWrap}>
              <LinearGradient
                colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.avatarText}>T</Text>
            </View>
            <View>
              <Text style={styles.headerName}>Threadly Stylist</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>{p.isLoading ? 'AI-powered · Always available' : `Knows your ${p.sectionTitle.replace(' picks for you', '')} style`}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <Text style={styles.headerBtnText}>✦</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <View style={{ height: 12 }} />
        </ScrollView>

        {/* Suggestion Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
          style={styles.chipScroll}
        >
          {suggestionChips.map((chip, i) => (
            <AnimatedChip key={i} label={chip} onPress={() => { hapticLight(); sendMessage(chip); }} />
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask your stylist anything..."
            placeholderTextColor={ThreadlyColors.warmWhiteSubtle}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
            multiline={false}
          />
          <AnimatedSendButton active={!!input.trim()} onPress={() => { hapticSuccess(); sendMessage(input); }} />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// ─── Animated Chip ───────────────────────────────────────────────────────────

function AnimatedChip({ label, onPress }: { label: string; onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.93);
  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[styles.chip, { transform: [{ scale }] }]}>
        <Text style={styles.chipText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Animated Send Button ─────────────────────────────────────────────────────

function AnimatedSendButton({ active, onPress }: { active: boolean; onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.92);
  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={!active}
      style={[styles.sendBtn, !active && styles.sendBtnDisabled]}
    >
      <Animated.View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={active ? [ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight] : [ThreadlyColors.charcoal, ThreadlyColors.charcoal]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={[styles.sendBtnText, !active && styles.sendBtnTextDisabled]}>→</Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Animated Reco Card ───────────────────────────────────────────────────────

function AnimatedRecoCard({ card }: { card: RecoCard }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.96);
  const { imageOpacity, onImageLoad } = useImageFade();
  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={() => hapticLight()} style={styles.recoCard}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Animated.Image source={{ uri: card.image }} style={[styles.recoCardImage, { opacity: imageOpacity }]} resizeMode="cover" onLoad={onImageLoad} />
        <View style={styles.recoCardInfo}>
          <Text style={styles.recoCardBrand}>{card.brand}</Text>
          <Text style={styles.recoCardItem} numberOfLines={1}>{card.item}</Text>
          {card.price > 0 ? (
            <Text style={styles.recoCardPrice}>${card.price}</Text>
          ) : (
            <Text style={styles.recoCardOwned}>You own this</Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.msgWrap, isUser && styles.msgWrapUser]}>
      {!isUser && (
        <View style={styles.msgAvatar}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.msgAvatarText}>T</Text>
        </View>
      )}
      <View style={[styles.msgBubble, isUser && styles.msgBubbleUser]}>
        {!isUser && <LinearGradient colors={["#1A1410", "#1A1A1A"]} style={StyleSheet.absoluteFill} />}
        {!isUser && <View style={styles.msgBubbleBorder} />}
        <Text style={[styles.msgText, isUser && styles.msgTextUser]}>{message.text}</Text>
        {message.cards && message.cards.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recoCards}
            style={styles.recoScroll}
          >
            {message.cards.map(card => (
              <AnimatedRecoCard key={card.id} card={card} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

function TypingIndicator() {
  return (
    <View style={styles.msgWrap}>
      <View style={styles.msgAvatar}>
        <LinearGradient
          colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.msgAvatarText}>T</Text>
      </View>
      <View style={styles.typingBubble}>
        <LinearGradient colors={["#1A1410", "#1A1A1A"]} style={StyleSheet.absoluteFill} />
        <View style={styles.typingBubbleBorder} />
        <View style={styles.typingDots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={styles.typingDot} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: ThreadlyColors.charcoalLight,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarWrap: {
    width: 40, height: 40, borderRadius: 20,
    overflow: "hidden",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontFamily: "Georgia", color: ThreadlyColors.black, fontWeight: "700" },
  headerName: { fontSize: 15, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 2 },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ThreadlyColors.success },
  onlineText: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle },
  headerBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: ThreadlyColors.charcoal,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(201,149,106,0.25)",
  },
  headerBtnText: { fontSize: 16, color: ThreadlyColors.roseGold },
  messageList: { flex: 1, backgroundColor: ThreadlyColors.black },
  messageListContent: { padding: ThreadlySpacing.screenPadding, gap: 16 },
  msgWrap: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  msgWrapUser: { flexDirection: "row-reverse" },
  msgAvatar: {
    width: 28, height: 28, borderRadius: 14,
    overflow: "hidden",
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  msgAvatarText: { fontSize: 12, fontFamily: "Georgia", color: ThreadlyColors.black, fontWeight: "700" },
  msgBubble: {
    maxWidth: width * 0.72,
    borderRadius: ThreadlyRadius.xl,
    borderTopLeftRadius: 4,
    padding: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
  },
  msgBubbleUser: {
    backgroundColor: ThreadlyColors.roseGold,
    borderTopLeftRadius: ThreadlyRadius.xl,
    borderTopRightRadius: 4,
    borderColor: "transparent",
  },
  msgBubbleBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.3 },
  msgText: { fontSize: 14, color: ThreadlyColors.warmWhite, lineHeight: 21 },
  msgTextUser: { color: ThreadlyColors.black },
  recoScroll: { marginTop: 12 },
  recoCards: { gap: 10, paddingRight: 4 },
  recoCard: {
    width: 110,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  recoCardImage: { width: "100%", height: 90 },
  recoCardInfo: { padding: 8 },
  recoCardBrand: { fontSize: 7, fontWeight: "700", color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 1.2, marginBottom: 2 },
  recoCardItem: { fontSize: 11, color: ThreadlyColors.warmWhite, fontWeight: "600", marginBottom: 3 },
  recoCardPrice: { fontSize: 12, fontFamily: "Georgia", color: ThreadlyColors.roseGoldLight },
  recoCardOwned: { fontSize: 9, color: ThreadlyColors.success, fontWeight: "600" },
  typingBubble: {
    borderRadius: ThreadlyRadius.xl,
    borderTopLeftRadius: 4,
    padding: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
  },
  typingBubbleBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.3 },
  typingDots: { flexDirection: "row", gap: 5, alignItems: "center" },
  typingDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: ThreadlyColors.roseGold, opacity: 0.6 },
  chipScroll: {
    borderTopWidth: 1,
    borderTopColor: ThreadlyColors.charcoalLight,
    paddingVertical: 10,
  },
  chipList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1, borderColor: "rgba(201,149,106,0.2)",
  },
  chipText: { fontSize: 12, color: ThreadlyColors.warmWhiteMuted },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: ThreadlyColors.charcoalLight,
    backgroundColor: ThreadlyColors.black,
  },
  input: {
    flex: 1,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: ThreadlyColors.warmWhite,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    overflow: "hidden",
    alignItems: "center", justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { fontSize: 18, color: ThreadlyColors.black, fontWeight: "700" },
  sendBtnTextDisabled: { color: ThreadlyColors.warmWhiteSubtle },
});
