import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@xenova/transformers",
    "chromadb",
    "onnxruntime-node",
    "sharp",
  ],
};

export default nextConfig;
