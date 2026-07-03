# RAG Chatbot Implementation

This project uses **Retrieval-Augmented Generation (RAG)** to power the InfluMatch chatbot with accurate, context-aware responses.

## Architecture

```
User Question
    ↓
Embed with @xenova/transformers (local)
    ↓
Query Chroma Cloud (vector similarity search)
    ↓
Retrieve top-5 relevant chunks
    ↓
Build prompt with context + question
    ↓
Send to Groq (LLM)
    ↓
Return answer to user
```

## Components

### 1. Knowledge Base
- **Location**: `knowledge/influmatch.md`
- Contains all platform information: features, FAQs, policies, workflows, etc.
- Plain markdown with `---` section dividers

### 2. Ingestion Script
- **File**: `scripts/ingest.mjs`
- **Run once** to populate the vector database:
  ```bash
  npm run ingest
  ```
- What it does:
  1. Reads `knowledge/influmatch.md`
  2. Splits into ~350-word chunks (24 chunks total)
  3. Generates embeddings using `@xenova/transformers` (local, no API key)
  4. Stores in Chroma Cloud

### 3. RAG Library
- **File**: `lib/rag.ts`
- `retrieveContext(query, topK=5)` → retrieves relevant knowledge chunks
- Uses local embeddings (no external API calls)

### 4. Chatbot API
- **File**: `app/api/chatbot/route.ts`
- On each user message:
  1. Calls `retrieveContext()` to get relevant chunks
  2. Builds a prompt with context + conversation history
  3. Sends to Groq LLM
  4. Returns the AI response

## Technology Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| **Embeddings** | `@xenova/transformers` | Runs 100% locally in Node.js. No API key needed. Fast and reliable. Uses `all-MiniLM-L6-v2` (384-dim vectors). |
| **Vector DB** | Chroma Cloud | Free tier, simple API, cosine similarity search. Stores 24 chunks. |
| **LLM** | Groq (`llama-3.1-8b-instant`) | Fast inference, already integrated. |

## Environment Variables

Required in `.env`:

```env
# Chroma Cloud (vector database)
CHROMA_API_KEY=ck-...
CHROMA_DATABASE=influmatch

# Groq (LLM)
GROQ_API_KEY=gsk_...
```

## Usage

### First Time Setup

1. Ingest the knowledge base:
   ```bash
   npm run ingest
   ```
   This creates the `influmatch_knowledge` collection in Chroma Cloud.

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Test the chatbot on the frontend (should respond using the knowledge base)

### Updating the Knowledge Base

1. Edit `knowledge/influmatch.md`
2. Re-run ingestion:
   ```bash
   npm run ingest
   ```
   This deletes the old collection and creates a fresh one.

## How It Works

### Example Query: "How do I create a campaign?"

1. **Embed the question** → `[0.123, -0.45, 0.67, ...]` (384 floats)
2. **Search Chroma** → top 3 chunks retrieved:
   - Chunk 8: "Brands can create campaigns by providing: Campaign title, description, budget..."
   - Chunk 10: "Campaign requirements: minimum followers, engagement rate..."
   - Chunk 12: "Campaign status: Draft, Active, Under Review..."
3. **Build prompt**:
   ```
   You are the AI assistant for InfluMatch.
   
   Use the retrieved context below:
   
   [Context 1]
   Brands can create campaigns by providing...
   
   [Context 2]
   Campaign requirements...
   
   Question: How do I create a campaign?
   ```
4. **Groq returns**:
   ```
   To create a campaign on InfluMatch:
   1. Login as a brand
   2. Go to Dashboard
   3. Click "Create Campaign"
   4. Fill in: title, description, budget, category
   5. Set target audience and deadline
   6. Publish
   ```

## Prompt Strategy

The chatbot uses a **flexible RAG prompt**:

- ✅ **If context is relevant** → use it
- ✅ **If context is empty but question is about influencer marketing** → use general knowledge
- ✅ **If question is unrelated to InfluMatch** → still answer politely
- ❌ **Never invent InfluMatch-specific features** not in the context

This prevents hallucinations while remaining helpful for general questions.

## Files

```
knowledge/
  influmatch.md              # Source of truth

scripts/
  ingest.mjs                 # One-time ingestion script

lib/
  rag.ts                     # Query function for retrieval

app/api/chatbot/
  route.ts                   # Main chatbot endpoint (RAG-powered)

.cache/xenova/               # Local model cache (auto-created)
```

## Troubleshooting

**"Cannot instantiate a collection with the DefaultEmbeddingFunction"**
- Harmless warning. Chroma tries to auto-load a default embedder, but we supply our own vectors, so it's ignored.

**"Failed to fetch... ENOTFOUND"**
- Check network connectivity to `api.trychroma.com`
- Verify `CHROMA_API_KEY` and `CHROMA_DATABASE` in `.env`

**Chatbot returns generic answers not from knowledge base**
- Verify ingestion ran successfully: `npm run ingest`
- Check that 24 chunks are stored in Chroma Cloud
- Test retrieval manually by calling `/api/chatbot` endpoint

## Performance

- **Ingestion**: ~30s (downloads model on first run, then < 10s)
- **Query time**: ~300-500ms (embedding + Chroma search + Groq inference)
- **Embedding**: 384-dimensional vectors
- **Storage**: 24 chunks in Chroma Cloud (free tier supports 1000s)

## Next Steps

- Add more content to `knowledge/influmatch.md` (pricing, tutorials, FAQs)
- Tune chunk size (currently 350 words — can go up to 500 for denser content)
- Add metadata filtering (e.g., filter by section type: "faq", "policy", "feature")
- Implement caching for frequently asked questions
