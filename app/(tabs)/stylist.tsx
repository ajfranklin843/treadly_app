/**
 * Threadly — AI Stylist
 * Conversational AI stylist. Ask anything about your style, get outfit builds,
 * shopping guidance, and trend advice. Feels like texting your most stylish friend.
 * Emotional outcome: "She actually gets me."
 */

import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import {
  ThreadlyColors,
  ThreadlySpacing,
  ThreadlyRadius,
  ThreadlyShadow,
} from "@/constants/threadly";

const { width } = Dimensions.get("window");

type RecoCard = {
  id: string;
  brand: string;
  item: string;
  price: number;
  salePrice?: number;
  color: string;
  tag?: string;
};

type Message = {
  id: string;
  role: "user" | "stylist";
  text: string;
  cards?: RecoCard[];
  timestamp: string;
};

const SUGGESTION_PROMPTS = [
  "Build me a look for a rooftop dinner",
  "What's trending in quiet luxury?",
  "Find a blazer under $80",
  "Style my camel coat 3 ways",
  "What am I missing in my closet?",
  "Outfit for a first date",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    role: "stylist",
    text: "Hi, I'm your Threadly stylist. I know your closet, your budget, and your vibe.\n\nWhat are we dressing you for today?",
    timestamp: "Just now",
  },
];

const MOCK_RESPONSES: Record<string, Omit<Message, "id">> = {
  "Build me a look for a rooftop dinner": {
    role: "stylist",
    text: "Rooftop dinner — elevated but effortless. Here's what I'd build for you:",
    cards: [
      { id: "c1", brand: "ZARA", item: "Satin Slip Midi Dress", price: 89, salePrice: 54, color: "#C4A882", tag: "You own this" },
      { id: "c2", brand: "MANGO", item: "Strappy Heeled Sandal", price: 79, salePrice: 49, color: "#8B5E3C" },
      { id: "c3", brand: "MEJURI", item: "Gold Layered Necklace", price: 95, color: "#C9956A", tag: "Deal found" },
    ],
    timestamp: "Just now",
  },
  "What's trending in quiet luxury?": {
    role: "stylist",
    text: "Quiet luxury is about elevated basics — nothing loud, everything intentional. Key pieces right now:",
    cards: [
      { id: "c4", brand: "ARKET", item: "Merino Crewneck", price: 85, salePrice: 59, color: "#E8DDD0", tag: "Trending" },
      { id: "c5", brand: "COS", item: "Wide-Leg Tailored Trousers", price: 110, salePrice: 72, color: "#2C2416" },
      { id: "c6", brand: "EVERLANE", item: "The Day Glove Flat", price: 145, salePrice: 87, color: "#C4A882", tag: "Best price" },
    ],
    timestamp: "Just now",
  },
  "Find a blazer under $80": {
    role: "stylist",
    text: "Found 3 blazers under $80 that match your style profile. The top pick is a near-perfect match:",
    cards: [
      { id: "c7", brand: "H&M", item: "Linen Oversized Blazer", price: 70, salePrice: 42, color: "#E8DDD0", tag: "Best match" },
      { id: "c8", brand: "ZARA", item: "Structured Blazer", price: 79, salePrice: 55, color: "#1A1A1A" },
      { id: "c9", brand: "MANGO", item: "Boyfriend Blazer", price: 89, salePrice: 49, color: "#C4A882", tag: "Deal" },
    ],
    timestamp: "Just now",
  },
  "Style my camel coat 3 ways": {
    role: "stylist",
    text: "Your camel coat is one of your most versatile pieces. Here are 3 complete looks — all using what you already own:",
    cards: [
      { id: "c10", brand: "LOOK 1", item: "Camel coat + black turtleneck + straight jeans + loafers", price: 0, color: "#C4A882", tag: "80% owned" },
      { id: "c11", brand: "LOOK 2", item: "Camel coat + white shirt + midi skirt + ankle boots", price: 0, color: "#E8DDD0", tag: "100% owned" },
      { id: "c12", brand: "LOOK 3", item: "Camel coat + monochrome beige + mules + mini bag", price: 0, color: "#8B7355", tag: "Buy 1 item" },
    ],
    timestamp: "Just now",
  },
  "What am I missing in my closet?": {
    role: "stylist",
    text: "Based on your style profile and how often you reach for certain pieces, here's what would complete your wardrobe:",
    cards: [
      { id: "c13", brand: "INVESTMENT", item: "A quality trench coat — you'll wear it 200+ times", price: 180, salePrice: 120, color: "#C4A882", tag: "High impact" },
      { id: "c14", brand: "BASICS", item: "A fitted white button-down — the most versatile piece you're missing", price: 45, salePrice: 28, color: "#FAF7F4" },
      { id: "c15", brand: "FOOTWEAR", item: "Ankle boots in a neutral — bridges casual and dressed up", price: 95, salePrice: 65, color: "#1A1A1A", tag: "Gap filler" },
    ],
    timestamp: "Just now",
  },
  "Outfit for a first date": {
    role: "stylist",
    text: "First date energy: confident, not trying too hard. You want to feel like yourself, just elevated. Here's the move:",
    cards: [
      { id: "c16", brand: "ZARA", item: "Satin Midi Skirt", price: 69, salePrice: 42, color: "#C4A882", tag: "You own this" },
      { id: "c17", brand: "EVERLANE", item: "Fitted Ribbed Tee", price: 38, color: "#FAF7F4" },
      { id: "c18", brand: "STEVE MADDEN", item: "Block Heel Mule", price: 85, salePrice: 55, color: "#8B5E3C", tag: "Best price" },
    ],
    timestamp: "Just now",
  },
};

const DEFAULT_RESPONSE: Omit<Message, "id"> = {
  role: "stylist",
  text: "Great question. Based on your style profile and what's in your closet, here's what I'd suggest. Want me to go deeper on any of these?",
  timestamp: "Just now",
};

export default function StylistScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: "Just now",
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const base = MOCK_RESPONSES[text.trim()] ?? DEFAULT_RESPONSE;
      const response: Message = { ...base, id: Date.now().toString() + "_r" };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarRing}>
              <LinearGradient
                colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>T</Text>
              </LinearGradient>
            </View>
            <View>
              <Text style={styles.headerName}>Threadly Stylist</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online · Knows your closet</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.headerAction} activeOpacity={0.7}>
            <Text style={styles.headerActionText}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <View style={styles.typingRow}>
              <View style={styles.typingBubble}>
                <Text style={styles.typingDots}>● ● ●</Text>
              </View>
            </View>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Suggestion Chips */}
        {showSuggestions && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestions}
            style={styles.suggestionsScroll}
          >
            {SUGGESTION_PROMPTS.map((prompt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.suggestionChip}
                onPress={() => sendMessage(prompt)}
                activeOpacity={0.75}
              >
                <Text style={styles.suggestionText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputAction} activeOpacity={0.7}>
            <Text style={styles.inputActionIcon}>◈</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ask your stylist anything..."
            placeholderTextColor={ThreadlyColors.warmWhiteSubtle}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={300}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(inputText)}
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => sendMessage(inputText)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                inputText.trim()
                  ? [ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]
                  : [ThreadlyColors.charcoal, ThreadlyColors.charcoal]
              }
              style={styles.sendBtnGradient}
            >
              <Text style={styles.sendBtnIcon}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
      {!isUser && (
        <View style={styles.msgAvatar}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            style={styles.msgAvatarGradient}
          >
            <Text style={styles.msgAvatarText}>T</Text>
          </LinearGradient>
        </View>
      )}
      <View style={[styles.msgContent, isUser && styles.msgContentUser]}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleStylist]}>
          <Text style={styles.bubbleText}>{message.text}</Text>
        </View>
        {message.cards && message.cards.length > 0 && (
          <FlatList
            data={message.cards}
            keyExtractor={c => c.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardList}
            renderItem={({ item: card }) => <RecommendationCard card={card} />}
          />
        )}
        <Text style={[styles.msgTimestamp, isUser && styles.msgTimestampUser]}>
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
}

// ─── Recommendation Card ──────────────────────────────────────────────────────

function RecommendationCard({ card }: { card: RecoCard }) {
  return (
    <TouchableOpacity style={styles.recoCard} activeOpacity={0.85}>
      <View style={[styles.recoCardVisual, { backgroundColor: card.color }]}>
        {card.tag && (
          <View style={styles.recoCardTag}>
            <Text style={styles.recoCardTagText}>{card.tag}</Text>
          </View>
        )}
      </View>
      <View style={styles.recoCardInfo}>
        <Text style={styles.recoCardBrand}>{card.brand}</Text>
        <Text style={styles.recoCardItem} numberOfLines={2}>{card.item}</Text>
        {card.price > 0 && (
          <View style={styles.recoCardPricing}>
            {card.salePrice ? (
              <>
                <Text style={styles.recoCardOriginal}>${card.price}</Text>
                <Text style={styles.recoCardSale}>${card.salePrice}</Text>
              </>
            ) : (
              <Text style={styles.recoCardSale}>${card.price}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  kav: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: ThreadlyColors.charcoalLight,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: ThreadlyColors.roseGold,
    padding: 2,
    ...ThreadlyShadow.roseGlow,
  },
  avatar: {
    flex: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontFamily: "Georgia",
    color: ThreadlyColors.black,
    fontWeight: "700",
  },
  headerName: {
    fontSize: 15,
    fontWeight: "700",
    color: ThreadlyColors.warmWhite,
    marginBottom: 2,
  },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ThreadlyColors.success,
  },
  onlineText: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle },
  headerAction: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  headerActionText: { fontSize: 18, color: ThreadlyColors.warmWhiteSubtle, lineHeight: 22 },

  messages: { flex: 1 },
  messagesContent: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 20,
  },

  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 16,
  },
  msgRowUser: { flexDirection: "row-reverse" },
  msgAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGold,
  },
  msgAvatarGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
  msgAvatarText: { fontSize: 12, color: ThreadlyColors.black, fontWeight: "700" },
  msgContent: { maxWidth: width * 0.72 },
  msgContentUser: { alignItems: "flex-end" },

  bubble: {
    borderRadius: ThreadlyRadius.xl,
    padding: 14,
    marginBottom: 4,
  },
  bubbleStylist: {
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: "rgba(201,149,106,0.15)",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    color: ThreadlyColors.warmWhite,
    lineHeight: 21,
  },

  cardList: { gap: 10, paddingVertical: 8 },
  recoCard: {
    width: 150,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  recoCardVisual: { height: 100, position: "relative" },
  recoCardTag: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(201,149,106,0.2)",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.4)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: ThreadlyRadius.pill,
  },
  recoCardTagText: {
    fontSize: 8,
    fontWeight: "700",
    color: ThreadlyColors.roseGoldLight,
    letterSpacing: 0.5,
  },
  recoCardInfo: { padding: 10 },
  recoCardBrand: {
    fontSize: 8,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  recoCardItem: {
    fontSize: 12,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    lineHeight: 16,
    marginBottom: 5,
  },
  recoCardPricing: { flexDirection: "row", alignItems: "center", gap: 5 },
  recoCardOriginal: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteSubtle,
    textDecorationLine: "line-through",
  },
  recoCardSale: { fontSize: 13, fontWeight: "700", color: ThreadlyColors.success },

  msgTimestamp: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteSubtle2,
    marginTop: 2,
    marginLeft: 4,
  },
  msgTimestampUser: { textAlign: "right", marginRight: 4 },

  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  typingDots: {
    fontSize: 10,
    color: ThreadlyColors.roseGold,
    letterSpacing: 4,
  },

  suggestionsScroll: { maxHeight: 56 },
  suggestions: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 8,
    paddingVertical: 10,
  },
  suggestionChip: {
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
  },
  suggestionText: {
    fontSize: 12,
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "500",
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingVertical: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: ThreadlyColors.charcoalLight,
    backgroundColor: ThreadlyColors.black,
  },
  inputAction: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  inputActionIcon: { fontSize: 18, color: ThreadlyColors.roseGold },
  input: {
    flex: 1,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: ThreadlyColors.warmWhite,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    maxHeight: 100,
    lineHeight: 20,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  sendBtnGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnIcon: { fontSize: 18, color: ThreadlyColors.warmWhite, fontWeight: "700" },
});
