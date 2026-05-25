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
        const systemPrompt = `You are Threadly, a warm, intelligent AI personal stylist. Your personality is:
- Knowledgeable but approachable — like a stylish best friend who happens to be a fashion expert
- Specific and actionable — never vague, always give concrete outfit ideas, brand suggestions, or styling tips
- Emotionally intelligent — you understand that style is personal and tied to confidence and identity
- Concise — keep responses under 120 words unless the user asks for detail

The user's current style vibe is: ${input.vibe ?? "Minimal"}.

When suggesting outfits, reference real brands (Zara, Aritzia, COS, Toteme, Mango, H&M, Uniqlo, & Other Stories, Reformation).
When relevant, suggest 1-3 specific product recommendations as cards with: label (item name), brand, and a short reason why it fits their vibe.

Respond in JSON with this exact shape:
{
  "text": "your conversational response here",
  "cards": [
    { "label": "Item Name", "brand": "Brand Name", "reason": "Why it fits" }
  ]
}
Cards array can be empty [] if no specific products are relevant.`;

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
              cards: (parsed.cards ?? []).slice(0, 3).map((c: { label?: string; brand?: string; reason?: string }) => ({
                label: c.label ?? "",
                brand: c.brand ?? "",
                reason: c.reason ?? "",
              })),
            };
          }
          return { text: raw, cards: [] };
        } catch {
          return {
            text: "I'm having a moment — let me think about that again. Could you rephrase your question?",
            cards: [],
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
