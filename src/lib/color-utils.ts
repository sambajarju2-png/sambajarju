// Calculate relative luminance per WCAG
function luminance(hex: string): number {
  const rgb = hex.replace('#', '').match(/.{2}/g)?.map(c => {
    const v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }) || [0, 0, 0];
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

// Contrast ratio between two colors
export function contrastRatio(c1: string, c2: string): number {
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Is a color "light" (needs dark text)?
export function isLight(hex: string): boolean {
  return luminance(hex) > 0.35;
}

// Get safe text color for a background
export function textOnBg(bgHex: string): string {
  return isLight(bgHex) ? '#0f172a' : '#ffffff';
}

// Ensure brand colors work for a CV. If primary is too light for dark sidebar,
// swap to a darkened version. Returns safe primary + secondary.
export function safeBrandColors(primary: string, secondary: string): {
  sidebarBg: string;
  sidebarText: string;
  accent: string;
  accentText: string;
  headerBg: string;
  headerText: string;
  dateBadgeBg: string;
  dateBadgeText: string;
} {
  const primaryIsLight = isLight(primary);
  const secondaryIsLight = isLight(secondary);

  // Sidebar should always be dark — if primary is light, use #023047 as sidebar
  const sidebarBg = primaryIsLight ? '#023047' : primary;
  const sidebarText = '#ffffff';

  // Accent = the more vibrant/contrasting color
  const accent = secondaryIsLight && !primaryIsLight ? primary : secondary;
  const accentText = textOnBg(accent);

  // Header area on right side
  const headerBg = primaryIsLight ? primary + '15' : primary + '08';
  const headerText = primaryIsLight ? primary : primary;

  // Date badges — use primary if dark enough, else use darkened primary
  const dateBadgeBg = primaryIsLight ? '#023047' : primary;
  const dateBadgeText = '#ffffff';

  return { sidebarBg, sidebarText, accent, accentText, headerBg, headerText, dateBadgeBg, dateBadgeText };
}
