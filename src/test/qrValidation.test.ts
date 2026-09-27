import { describe, it, expect } from 'vitest';
import { validateQRInput } from '../utils/qrValidation';
import { INITIAL_FORM_DATA } from '../constants/presets';
import type { QRFormDataMap } from '../types/qr';

describe('QR Input Validation', () => {
  it('validates correct URL format', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      url: { url: 'https://example.com/page' },
    };
    const res = validateQRInput('url', data);
    expect(res.isValid).toBe(true);
    expect(res.errors.url).toBeUndefined();
  });

  it('rejects empty URL', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      url: { url: '   ' },
    };
    const res = validateQRInput('url', data);
    expect(res.isValid).toBe(false);
    expect(res.errors.url).toBeDefined();
  });

  it('rejects malformed URL without domain dot', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      url: { url: 'htt://invalid' },
    };
    const res = validateQRInput('url', data);
    expect(res.isValid).toBe(false);
  });

  it('validates plain text and flags empty text', () => {
    const valid = validateQRInput('text', {
      ...INITIAL_FORM_DATA,
      text: { text: 'Some text' },
    });
    expect(valid.isValid).toBe(true);

    const empty = validateQRInput('text', {
      ...INITIAL_FORM_DATA,
      text: { text: '' },
    });
    expect(empty.isValid).toBe(false);
    expect(empty.errors.text).toBeDefined();
  });

  it('validates valid email address', () => {
    const res = validateQRInput('email', {
      ...INITIAL_FORM_DATA,
      email: {
        email: 'user.name@domain.co.uk',
        subject: '',
        message: '',
      },
    });
    expect(res.isValid).toBe(true);
  });

  it('rejects invalid email address', () => {
    const res = validateQRInput('email', {
      ...INITIAL_FORM_DATA,
      email: {
        email: 'invalid-email-without-at',
        subject: '',
        message: '',
      },
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.email).toBeDefined();
  });

  it('validates international phone numbers', () => {
    const res = validateQRInput('phone', {
      ...INITIAL_FORM_DATA,
      phone: { phone: '+44 20 7946 0958' },
    });
    expect(res.isValid).toBe(true);
  });

  it('rejects too short phone numbers', () => {
    const res = validateQRInput('phone', {
      ...INITIAL_FORM_DATA,
      phone: { phone: '123' },
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.phone).toBeDefined();
  });

  it('requires SSID for Wi-Fi', () => {
    const res = validateQRInput('wifi', {
      ...INITIAL_FORM_DATA,
      wifi: {
        ssid: '',
        password: 'password123',
        security: 'WPA',
        hidden: false,
      },
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.ssid).toBeDefined();
  });

  it('enforces min 8-character password for WPA Wi-Fi', () => {
    const res = validateQRInput('wifi', {
      ...INITIAL_FORM_DATA,
      wifi: {
        ssid: 'MyNet',
        password: 'short',
        security: 'WPA',
        hidden: false,
      },
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.password).toBe('WPA/WPA2 passwords must be at least 8 characters');
  });

  it('allows empty password for open Wi-Fi network', () => {
    const res = validateQRInput('wifi', {
      ...INITIAL_FORM_DATA,
      wifi: {
        ssid: 'PublicHotspot',
        password: '',
        security: 'nopass',
        hidden: false,
      },
    });
    expect(res.isValid).toBe(true);
  });
});
