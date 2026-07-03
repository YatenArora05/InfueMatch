/**
 * RAG Ingestion Script — run ONCE to populate Chroma Cloud.
 *
 * Embeddings: @xenova/transformers  (local, no API key, ~25 MB download on first run)
 * Vector DB:  Chroma Cloud          (uses CHROMA_API_KEY + CHROMA_DATABASE from .env)
 *
 * Usage:
 *   node scripts/ingest.mjs
 */

import fs from "fs";
import path from "path";
import { CloudClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const COLLECTION_NAME = "influmatch_knowledge";

// ── Chunker ───────────────────────────────────────────────────────────────────
// Split on blank lines that precede "---" or on heading blocks.
// Targets ~300-400 words per chunk.
function chunkText(text, maxWords = 350) {
  // Normalise line endings
  const normalised = text.replace(/\r\n/g, "\n");

  // Split on lines that are only dashes (section separators in the MD)
  const sections = normalised.split(/\n-{3,}\n/).filter((s) => s.trim());

  const chunks = [];
  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const words = trimmed.split(/\s+/);
    if (words.length <= maxWords) {
      chunks.push(trimmed);
    } else {
      // Further split large sections into overlapping windows
      for (let i = 0; i < words.length; i += maxWords) {
        const slice = words.slice(i, i + maxWords).join(" ");
        if (slice.trim()) chunks.push(slice);
      }
    }
  }

  return chunks;
}

// ── Local Embedder ────────────────────────────────────────────────────────────
async function buildEmbedder() {
  const { pipeline, env } = await import("@xenova/transformers");

  // Cache downloaded model locally so it doesn't re-download
  env.cacheDir = path.resolve(process.cwd(), ".cache", "xenova");

  console.log("⏳ Loading embedding model (first run downloads ~25 MB)...");
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  console.log("✔ Embedding model ready");

  // Returns float[][] — one vector per input string
  return async (texts) => {
    const out = await extractor(texts, { pooling: "mean", normalize: true });
    return out.tolist();
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Read knowledge base
  const mdPath = path.resolve(process.cwd(), "knowledge", "influmatch.md");
  const mdText = fs.readFileSync(mdPath, "utf-8");
  console.log(`✔ Loaded knowledge base (${mdText.length} chars)`);

  // 2. Chunk
  const chunks = chunkText(mdText);
  console.log(`✔ Split into ${chunks.length} chunks`);

  if (chunks.length === 0) {
    console.error("❌ No chunks produced — check the knowledge base file.");
    process.exit(1);
  }

  // 3. Build local embedder
  const embed = await buildEmbedder();

  // 4. Connect to Chroma Cloud (v2 SDK)
  const client = new CloudClient({
    apiKey: process.env.CHROMA_API_KEY,
    database: process.env.CHROMA_DATABASE || "influmatch",
  });
  console.log("✔ Connected to Chroma Cloud");

  // 5. Delete old collection for a clean re-ingest
  try {
    await client.deleteCollection({ name: COLLECTION_NAME });
    console.log("✔ Cleared old collection");
  } catch {
    console.log("ℹ  No existing collection — starting fresh");
  }

  // 6. Create collection with cosine similarity
  const collection = await client.createCollection({
    name: COLLECTION_NAME,
    metadata: { "hnsw:space": "cosine" },
  });
  console.log(`✔ Created collection "${COLLECTION_NAME}"`);

  // 7. Embed in batches of 8 (keeps memory reasonable)
  const BATCH = 8;
  const allEmbeddings = [];

  console.log(`\n⏳ Embedding ${chunks.length} chunks...`);
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const batchNo = Math.floor(i / BATCH) + 1;
    const totalBatches = Math.ceil(chunks.length / BATCH);
    process.stdout.write(`  Batch ${batchNo}/${totalBatches}...`);
    const vecs = await embed(batch);
    allEmbeddings.push(...vecs);
    console.log(` ✔  (dim=${vecs[0].length})`);
  }

  // 8. Store everything in Chroma
  await collection.add({
    ids: chunks.map((_, i) => `chunk_${i}`),
    documents: chunks,
    embeddings: allEmbeddings,
    metadatas: chunks.map((c, i) => ({
      source: "influmatch.md",
      chunk_index: i,
      preview: c.slice(0, 100),
    })),
  });

  const count = await collection.count();
  console.log(`\n✅ Ingestion complete! ${count} chunks stored in Chroma Cloud.`);
}

main().catch((err) => {
  console.error("\n❌ Ingestion failed:", err.message ?? err);
  process.exit(1);
});
