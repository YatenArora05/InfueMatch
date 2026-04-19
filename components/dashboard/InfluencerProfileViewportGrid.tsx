"use client";

/**
 * Full-viewport blueprint grid + radial wash — only used on the influencer profile route
 * so other dashboard pages keep a flat #060d24 canvas.
 */
export default function InfluencerProfileViewportGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_38%,rgba(37,99,235,0.14),rgba(6,13,36,0.55)_52%,rgba(2,6,12,0.96)_100%)]"
      />
      <div
        className="absolute inset-0 opacity-[0.38]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59,130,246,0.26) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59,130,246,0.26) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59,130,246,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59,130,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          filter: "blur(0.4px)",
        }}
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,13,36,0.35)_55%,rgba(3,7,18,0.92)_100%)]"
      />
    </div>
  );
}
