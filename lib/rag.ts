/**
 * RAG utilities for the InfluMatch chatbot.
 *
 * - Embeddings: @xenova/transformers (local, no API key)
 * - Vector DB:  Chroma Cloud
 */

import { CloudClient } from "chromadb";

const COLLECTION_NAME = "influmatch_knowledge";

// ── Chroma client singleton ────────────────────────────────────────────────────
let _client: InstanceType<typeof CloudClient> | null = null;

function getChromaClient() {
  if (_client) return _client;
  _client = new CloudClient({
    apiKey: process.env.CHROMA_API_KEY!,
    database: process.env.CHROMA_DATABASE ?? "influmatch",
  });
  return _client;
}

// ── Local embedder singleton ──────────────────────────────────────────────────
type EmbedFn = (texts: string[]) => Promise<number[][]>;
let _embedder: EmbedFn | null = null;

async function getEmbedder(): Promise<EmbedFn> {
  if (_embedder) return _embedder;

  // @xenova/transformers runs entirely in Node — no external API call needed
  const { pipeline } = await import("@xenova/transformers");

  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  _embedder = async (texts: string[]): Promise<number[][]> => {
    const out = await (extractor as any)(texts, {
      pooling: "mean",
      normalize: true,
    });
    return out.tolist() as number[][];
  };

  return _embedder;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Embed a user query and retrieve the top-K most relevant knowledge chunks
 * from Chroma Cloud using cosine similarity.
 */
export async function retrieveContext(
  query: string,
  topK = 5
): Promise<string[]> {
  try {
    const embed = await getEmbedder();
    const [queryVector] = await embed([query]);

    const client = getChromaClient();

    // getCollection with no embeddingFunction — we supply raw vectors
    const collection = await client.getCollection({ name: COLLECTION_NAME });

    const results = await collection.query({
      queryEmbeddings: [queryVector],
      nResults: topK,
    });

    const docs = (results.documents?.[0] ?? []) as (string | null)[];
    return docs.filter(Boolean) as string[];
  } catch (err) {
    console.error("[RAG] retrieveContext error:", err);
    return [];
  }
}
