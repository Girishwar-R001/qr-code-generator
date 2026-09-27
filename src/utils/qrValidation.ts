import type { QRFormDataMap, QRType, ValidationResult } from '../types/qr';

export function validateQRInput(type: QRType, dataMap: QRFormDataMap): ValidationResult {
  const errors: Record<string, string> = {};

  switch (type) {
    case 'url': {
      const url = dataMap.url.url.trim();
      if (!url) {
        errors.url = 'Please enter a URL (e.g. https://example.com)';
      } else {
        let testUrl = url;
        if (!/^https?:\/\//i.test(testUrl)) {
          testUrl = `https://${testUrl}`;
        }
        try {
          const parsed = new URL(testUrl);
          if (!parsed.hostname || !parsed.hostname.includes('.')) {
            errors.url = 'Enter a valid web domain or URL (e.g. https://example.com)';
          }
        } catch {
          errors.url = 'Enter a valid URL (e.g. https://example.com)';
        }
      }
      break;
    }

    case 'text': {
      const text = dataMap.text.text.trim();
      if (!text) {
        errors.text = 'Please enter some text to encode';
      } else if (text.length > 2500) {
        errors.text = `Text is too long (${text.length} chars). Maximum recommended is 2500 characters.`;
      }
      break;
    }

    case 'email': {
      const email = dataMap.email.email.trim();
      if (!email) {
        errors.email = 'Please enter an email address';
      } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          errors.email = 'Enter a valid email address (e.g. user@example.com)';
        }
      }
      break;
    }

    case 'phone': {
      const phone = dataMap.phone.phone.trim();
      if (!phone) {
        errors.phone = 'Please enter a phone number';
      } else {
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 6 || digits.length > 16) {
          errors.phone = 'Enter a valid phone number (6 to 16 digits, e.g. +1 555-0199)';
        }
      }
      break;
    }

    case 'wifi': {
      const { ssid, password, security } = dataMap.wifi;
      if (!ssid.trim()) {
        errors.ssid = 'Network name (SSID) is required';
      }

      if (security === 'WPA') {
        if (!password) {
          errors.password = 'Password is required for WPA/WPA2 networks';
        } else if (password.length < 8) {
          errors.password = 'WPA/WPA2 passwords must be at least 8 characters';
        }
      } else if (security === 'WEP') {
        if (!password) {
          errors.password = 'Password is required for WEP networks';
        } else if (password.length < 5) {
          errors.password = 'WEP passwords must be at least 5 characters';
        }
      }
      break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
