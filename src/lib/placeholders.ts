/** SVG data URLs — no third-party image CDN required for demo photos */
export function gradientPlaceholder(
  seed: number,
  label: string,
  width = 800,
  height = 600,
): string {
  const hues = [18, 32, 45, 200, 280];
  const h1 = hues[seed % hues.length];
  const h2 = (h1 + 25) % 360;
  const safeLabel = label.replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${h1},45%,72%)"/>
      <stop offset="100%" style="stop-color:hsl(${h2},35%,58%)"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
  <text x="50%" y="48%" text-anchor="middle" fill="rgba(40,30,20,0.75)" font-family="Georgia,serif" font-size="28">${safeLabel}</text>
  <text x="50%" y="56%" text-anchor="middle" fill="rgba(40,30,20,0.5)" font-family="sans-serif" font-size="14">毕业照档案馆 · 示意影像</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
