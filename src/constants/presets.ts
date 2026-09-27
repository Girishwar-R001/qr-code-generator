import type { QRCustomization } from '../types/qr';

export interface Preset {
  id: string;
  name: string;
  description: string;
  customization: Partial<QRCustomization>;
  previewFg: string;
  previewBg: string;
}

export const QR_PRESETS: Preset[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'High contrast standard, optimal for all scanners',
    previewFg: '#000000',
    previewBg: '#ffffff',
    customization: {
      foreground: '#000000',
      background: '#ffffff',
      errorCorrection: 'M',
      margin: 4,
      enableGradient: false,
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark mode inverted with high fault tolerance',
    previewFg: '#f8fafc',
    previewBg: '#0f172a',
    customization: {
      foreground: '#f8fafc',
      background: '#0f172a',
      errorCorrection: 'H',
      margin: 4,
      enableGradient: false,
    },
  },
  {
    id: 'soft',
    name: 'Soft Slate',
    description: 'Warm slate on ivory for modern editorial prints',
    previewFg: '#334155',
    previewBg: '#f8fafc',
    customization: {
      foreground: '#334155',
      background: '#f8fafc',
      errorCorrection: 'M',
      margin: 4,
      enableGradient: false,
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Deep cobalt on crisp ice blue',
    previewFg: '#0284c7',
    previewBg: '#f0f9ff',
    customization: {
      foreground: '#0284c7',
      background: '#f0f9ff',
      errorCorrection: 'M',
      margin: 4,
      enableGradient: false,
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Vibrant indigo on soft warm cream',
    previewFg: '#6d28d9',
    previewBg: '#fff7ed',
    customization: {
      foreground: '#6d28d9',
      background: '#fff7ed',
      errorCorrection: 'Q',
      margin: 4,
      enableGradient: false,
    },
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    description: 'Deep botanical green on mint tone',
    previewFg: '#065f46',
    previewBg: '#ecfdf5',
    customization: {
      foreground: '#065f46',
      background: '#ecfdf5',
      errorCorrection: 'M',
      margin: 4,
      enableGradient: false,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal Quiet',
    description: 'Wide quiet zone with clean light density',
    previewFg: '#000000',
    previewBg: '#ffffff',
    customization: {
      foreground: '#000000',
      background: '#ffffff',
      errorCorrection: 'L',
      margin: 6,
      enableGradient: false,
    },
  },
  {
    id: 'cyberpunk',
    name: 'Neon Cyber',
    description: 'Electric cyan against obsidian dark background',
    previewFg: '#06b6d4',
    previewBg: '#090d16',
    customization: {
      foreground: '#06b6d4',
      background: '#090d16',
      errorCorrection: 'H',
      margin: 4,
      enableGradient: false,
    },
  },
];

export const DEFAULT_CUSTOMIZATION: QRCustomization = {
  size: 360,
  foreground: '#000000',
  background: '#ffffff',
  errorCorrection: 'M',
  margin: 4,
  enableGradient: false,
  gradientColor: '#2563eb',
  gradientDirection: 'to-br',
  logoUrl: null,
  logoSize: 20,
  logoBackground: true,
};

export const INITIAL_FORM_DATA = {
  url: { url: 'https://gdg.community.dev' },
  text: { text: 'Welcome to QR Studio! Fast, offline & privacy-first QR designer.' },
  email: {
    email: 'contact@example.com',
    subject: 'Inquiry from QR Studio',
    message: 'Hello, I scanned your QR code and would like to connect!',
  },
  phone: { phone: '+1234567890' },
  wifi: {
    ssid: 'Guest_WiFi',
    password: 'securepassword123',
    security: 'WPA' as const,
    hidden: false,
  },
};
