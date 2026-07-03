import { NextResponse } from "next/server";
import { retrieveContext } from "@/lib/rag";

// Force Node.js runtime — required for @xenova/transformers (uses fs + native ONNX bindings)
export const runtime = "nodejs";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

export async function POST(req: Request) {
  try {
    const { message, conversationHistory } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 500 }
      );
    }

    // ── Step 1: Retrieve relevant context chunks from Chroma ─────────────────
    const contextChunks = await retrieveContext(message, 5);
    const context =
      contextChunks.length > 0
        ? contextChunks
            .map((chunk, i) => `[Context ${i + 1}]\n${chunk}`)
            .join("\n\n")
        : "";

    // ── Step 2: Build system prompt ───────────────────────────────────────────
    const systemPrompt = `You are the AI assistant for InfluMatch, an influencer marketing platform that connects brands and influencers.

${
  context
    ? `Use the retrieved context below whenever it contains information relevant to the user's question.

--- RETRIEVED CONTEXT ---
${context}
--- END CONTEXT ---

`
    : ""
}Rules:
- If the context contains a relevant answer, use it. Be specific and helpful.
- If the context does not fully cover the topic but the question is clearly about InfluMatch, influencer marketing, brand collaborations, social media, or content creation, you may supplement with general knowledge.
- If the question is unrelated to InfluMatch or influencer marketing (e.g. general coding, weather, math, news, etc.), respond with exactly: "Sorry, I can only answer questions related to InfluMatch and influencer marketing. Please ask me something about the platform or influencer marketing."
- Do NOT invent InfluMatch-specific features not present in the context.
- Keep answers concise, friendly, and actionable.`;

    // ── Step 3: Build messages array with conversation history ────────────────
    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    if (Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory as { sender: string; text: string }[]) {
        if (msg.sender === "user") {
          messages.push({ role: "user", content: msg.text });
        } else if (msg.sender === "ai") {
          messages.push({ role: "assistant", content: msg.text });
        }
      }
    }

    messages.push({ role: "user", content: message });

    // ── Step 4: Call Groq ─────────────────────────────────────────────────────
    const groqRes = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.5,
        max_tokens: 1024,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("[Chatbot] Groq error:", errText);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: groqRes.status }
      );
    }

    const data = await groqRes.json();
    const aiResponse =
      data.choices?.[0]?.message?.content ??
      "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ response: aiResponse }, { status: 200 });
  } catch (error) {
    console.error("[Chatbot] Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
