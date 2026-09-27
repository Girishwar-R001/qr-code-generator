export type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface UrlFormData {
  url: string;
}

export interface TextFormData {
  text: string;
}

export interface EmailFormData {
  email: string;
  subject: string;
  message: string;
}

export interface PhoneFormData {
  phone: string;
}

export interface WifiFormData {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface QRFormDataMap {
  url: UrlFormData;
  text: TextFormData;
  email: EmailFormData;
  phone: PhoneFormData;
  wifi: WifiFormData;
}

export interface QRCustomization {
  size: number;
  foreground: string;
  background: string;
  errorCorrection: ErrorCorrectionLevel;
  margin: number;
  enableGradient: boolean;
  gradientColor: string;
  gradientDirection: 'to-br' | 'to-r' | 'to-b';
  logoUrl: string | null;
  logoSize: number;
  logoBackground: boolean;
}

export interface QRConfig {
  id: string;
  type: QRType;
  data: QRFormDataMap;
  customization: QRCustomization;
  title: string;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  type: QRType;
  title: string;
  subtitle: string;
  config: QRConfig;
  createdAt: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export type ReliabilityLevel = 'good' | 'warning' | 'danger';

export interface ReliabilityReport {
  level: ReliabilityLevel;
  score: number;
  title: string;
  contrastRatio: number;
  messages: string[];
}
