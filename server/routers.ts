import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  intelligence: router({
    // Generate AI insight for a specific wardrobe item
    itemInsight: publicProcedure
      .input(z.object({
        itemName: z.string(),
        category: z.string().optional(),
        colorDNA: z.string().optional(),
        matchScore: z.number().optional(),
        wornCount: z.number().optional(),
        vibe: z.string().optional(),
        occasions: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `You are Threadly's wardrobe intelligence engine. Generate a single, precise, emotionally resonant insight about a specific wardrobe item. 

Voice: luxury stylist, warm, specific, never generic. Under 40 words. No filler.

Respond in JSON:
{
  "insight": "one sentence insight about this specific item",
  "pairsWith": ["Item 1", "Item 2", "Item 3"],
  "occasions": ["Occasion 1", "Occasion 2"],
  "styleNote": "one sentence styling tip specific to this item"
}`;

        const userMessage = `Item: ${input.itemName}\nCategory: ${input.category ?? "Unknown"}\nColor: ${input.colorDNA ?? "Unknown"}\nMatch Score: ${input.matchScore ?? 0}%\nTimes Worn: ${input.wornCount ?? 0}\nUser Vibe: ${input.vibe ?? "Minimal"}\nOccasions: ${(input.occasions ?? []).join(", ") || "Everyday"}`;

        try {
          const result = await invokeLLM({ messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ]});
          const rawContent = result.choices?.[0]?.message?.content ?? "";
          const raw = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              insight: parsed.insight ?? null,
              pairsWith: (parsed.pairsWith ?? []).slice(0, 3) as string[],
              occasions: (parsed.occasions ?? []).slice(0, 3) as string[],
              styleNote: parsed.styleNote ?? null,
            };
          }
          return { insight: null, pairsWith: [], occasions: [], styleNote: null };
        } catch {
          return { insight: null, pairsWith: [], occasions: [], styleNote: null };
        }
      }),

    // Generate AI outfit combination insight
    outfitInsight: publicProcedure
      .input(z.object({
        anchorItem: z.string(),
        selectedPieces: z.array(z.string()),
        occasion: z.string().optional(),
        vibe: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `You are Threadly's outfit intelligence. Analyze a specific outfit combination and provide a luxury stylist's take.

Voice: precise, warm, editorial. Under 60 words total. No filler.

Respond in JSON:
{
  "whyItWorks": "one sentence of styling logic (proportion, color theory, texture, occasion fit)",
  "confidenceNote": "one sentence about why this combination is strong",
  "elevationTip": "one specific accessory or styling tweak to elevate the look"
}`;

        const userMessage = `Anchor: ${input.anchorItem}\nPieces: ${input.selectedPieces.join(", ")}\nOccasion: ${input.occasion ?? "Everyday"}\nVibe: ${input.vibe ?? "Minimal"}`;

        try {
          const result = await invokeLLM({ messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ]});
          const rawContent = result.choices?.[0]?.message?.content ?? "";
          const raw = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              whyItWorks: parsed.whyItWorks ?? null,
              confidenceNote: parsed.confidenceNote ?? null,
              elevationTip: parsed.elevationTip ?? null,
            };
          }
          return { whyItWorks: null, confidenceNote: null, elevationTip: null };
        } catch {
          return { whyItWorks: null, confidenceNote: null, elevationTip: null };
        }
      }),
  }),

  stylist: router({
    chat: publicProcedure
      .input(z.object({
        message: z.string().min(1).max(2000),
        vibe: z.string().optional(),
        history: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).max(20).optional(),
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `You are Threadly's personal stylist — a luxury fashion intelligence with the warmth of a trusted friend and the precision of a Net-a-Porter editor. You speak with quiet confidence, never filler.

Your voice:
- Warm and direct. No "Great question!" or "Absolutely!". Just style intelligence.
- Specific. Name the exact piece, the exact brand, the exact occasion.
- Emotionally resonant. You understand that dressing well is about identity, not just clothing.
- Concise. Under 100 words unless the user asks for a full breakdown. Every word earns its place.

The user's style vibe is: ${input.vibe ?? "Minimal"}. This is their identity. Honor it in every suggestion.

When suggesting pieces, use real brands that match the vibe:
- Old Money / Quiet Luxury: Toteme, The Row, COS, Massimo Dutti, Arket
- Clean Girl / Minimal: Uniqlo, COS, Aritzia, Everlane, & Other Stories
- Chic / Parisian: Sandro, Maje, Isabel Marant, Rouje, ba&sh
- Streetwear: Stüssy, Carhartt WIP, New Balance, Aime Leon Dore, Sporty & Rich
- Vacation / Resort: Faithfull the Brand, Onia, Vince, Mara Hoffman
- Casual Luxe: Aritzia, Reformation, Vince, Frame, Rag & Bone

When you suggest a specific outfit combination, include a brief "Why This Works" insight — the styling logic behind the look (proportion, color theory, occasion fit, texture contrast).

When relevant, suggest 1-3 product recommendations as cards. Each card should feel like a personal curation, not a generic suggestion.

Respond in JSON with this exact shape:
{
  "text": "your conversational response here",
  "whyItWorks": "optional: one sentence of styling logic if you suggested an outfit",
  "cards": [
    { "label": "Item Name", "brand": "Brand Name", "reason": "Why it fits their vibe specifically" }
  ]
}
Cards array can be empty [] if no specific products are relevant. whyItWorks can be omitted if no outfit was suggested.`;

        const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          { role: "system", content: systemPrompt },
          ...(input.history ?? []).map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
          { role: "user", content: input.message },
        ];

        try {
          const result = await invokeLLM({ messages });
          const rawContent = result.choices?.[0]?.message?.content ?? "";
          const raw = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
          // Parse JSON response
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              text: parsed.text ?? raw,
              whyItWorks: parsed.whyItWorks ?? null,
              cards: (parsed.cards ?? []).slice(0, 3).map((c: { label?: string; brand?: string; reason?: string }) => ({
                label: c.label ?? "",
                brand: c.brand ?? "",
                reason: c.reason ?? "",
              })),
            };
          }
          return { text: raw, whyItWorks: null, cards: [] };
        } catch {
          return {
            text: "I'm having a moment — let me think about that again. Could you rephrase your question?",
            whyItWorks: null,
            cards: [],
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
