import type { QRCustomization, ReliabilityReport } from '../types/qr';

export function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hexToRgb(hex1));
  const lum2 = getRelativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function evaluateReliability(
  payload: string,
  customization: QRCustomization,
): ReliabilityReport {
  const messages: string[] = [];
  let score = 100;

  const contrast = getContrastRatio(customization.foreground, customization.background);
  const lumFg = getRelativeLuminance(hexToRgb(customization.foreground));
  const lumBg = getRelativeLuminance(hexToRgb(customization.background));

  if (lumFg > lumBg) {
    messages.push('Inverted colors (light on dark): some older scanners might struggle.');
    score -= 5;
  }

  let effectiveContrast = contrast;
  if (customization.enableGradient) {
    const gradContrast = getContrastRatio(customization.gradientColor, customization.background);
    effectiveContrast = Math.min(contrast, gradContrast);
    if (gradContrast < 3.5) {
      messages.push('Gradient end color has low contrast with the background.');
      score -= 20;
    }
  }

  if (effectiveContrast < 2.5) {
    messages.push('Low contrast: cameras may struggle to scan this.');
    score -= 45;
  } else if (effectiveContrast < 4.0) {
    messages.push('Low contrast between foreground and background.');
    score -= 25;
  }

  if (customization.margin < 2) {
    messages.push('Quiet zone is tight (margin < 2). Leave border space for easy scanning.');
    score -= 15;
  } else if (customization.margin < 3) {
    messages.push('A quiet zone margin of 4 is recommended.');
    score -= 5;
  }

  const payloadLen = payload.length;
  if (payloadLen > 400 && customization.size < 320) {
    messages.push('Dense payload with small size. Dots may blur when printed.');
    score -= 20;
  } else if (payloadLen > 150 && customization.size < 200) {
    messages.push('Small export size. Recommend 320px or higher for reliable scanning.');
    score -= 10;
  }

  if (customization.logoUrl) {
    if (customization.errorCorrection === 'L' || customization.errorCorrection === 'M') {
      messages.push('Logo enabled: set error correction to Q or H for better tolerance.');
      score -= 20;
    }
    if (customization.logoSize > 25) {
      messages.push('Logo takes up > 25% of QR area and may block scanning.');
      score -= 25;
    }
  }

  score = Math.max(10, Math.min(100, score));

  let level: 'good' | 'warning' | 'danger' = 'good';
  let title = 'Good scan reliability';

  if (score < 55 || effectiveContrast < 2.5) {
    level = 'danger';
    title = 'Poor scan reliability — scanner may fail';
  } else if (score < 80 || effectiveContrast < 4.0) {
    level = 'warning';
    title = 'Moderate scan reliability — check contrast & margin';
  }

  return {
    level,
    score,
    title,
    contrastRatio: Number(effectiveContrast.toFixed(2)),
    messages,
  };
}
