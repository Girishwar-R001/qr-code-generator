import { describe, it, expect } from 'vitest';
import { getContrastRatio, hexToRgb, evaluateReliability } from '../utils/qrReliability';
import { DEFAULT_CUSTOMIZATION } from '../constants/presets';

describe('QR Scanner Reliability Engine', () => {
  it('converts hex to RGB correctly', () => {
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#2563eb')).toEqual([37, 99, 235]);
  });

  it('calculates maximum contrast for black on white', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBeCloseTo(21.0, 0);
  });

  it('evaluates classic high-contrast QR as good scan reliability', () => {
    const report = evaluateReliability('https://example.com', DEFAULT_CUSTOMIZATION);
    expect(report.level).toBe('good');
    expect(report.contrastRatio).toBeGreaterThan(15);
    expect(report.score).toBeGreaterThanOrEqual(80);
  });

  it('detects low contrast and flags danger status', () => {
    const report = evaluateReliability('https://example.com', {
      ...DEFAULT_CUSTOMIZATION,
      foreground: '#cbd5e1',
      background: '#ffffff',
    });
    expect(report.level).toBe('danger');
    expect(report.messages.some((m) => m.toLowerCase().includes('low contrast'))).toBe(true);
  });

  it('warns about tight margin (quiet zone < 2)', () => {
    const report = evaluateReliability('https://example.com', {
      ...DEFAULT_CUSTOMIZATION,
      margin: 1,
    });
    expect(report.messages.some((m) => m.toLowerCase().includes('quiet zone'))).toBe(true);
  });

  it('advises higher error correction when logo is present', () => {
    const report = evaluateReliability('https://example.com', {
      ...DEFAULT_CUSTOMIZATION,
      logoUrl: 'data:image/png;base64,sample',
      errorCorrection: 'L',
    });
    expect(report.messages.some((m) => m.toLowerCase().includes('logo enabled'))).toBe(true);
  });
});
