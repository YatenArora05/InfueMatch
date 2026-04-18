/** Same palette as legacy avatar SVGs — deterministic per first letter. */
export const AVATAR_BG_COLORS = [
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#EF4444", // red
  "#F59E0B", // amber
  "#10B981", // emerald
  "#3B82F6", // blue
  "#6366F1", // indigo
] as const;

export function getAvatarBackgroundColorFromName(name: string): string {
  const firstLetter = (name || "U").trim().charAt(0).toUpperCase();
  const colorIndex = firstLetter.charCodeAt(0) % AVATAR_BG_COLORS.length;
  return AVATAR_BG_COLORS[colorIndex];
}

/**
 * Generate an SVG avatar with the first letter of the name
 */
export function generateAvatarSvg(name: string, size: number = 200): string {
  const firstLetter = name.charAt(0).toUpperCase();
  const backgroundColor = getAvatarBackgroundColorFromName(name);

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size / 8}"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="${size * 0.5}"
        font-weight="bold"
        fill="white"
      >
        ${firstLetter}
      </text>
    </svg>
  `.trim();
}

/**
 * Convert SVG string to data URL for use in img src
 */
export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

