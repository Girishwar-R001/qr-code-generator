import { describe, it, expect } from 'vitest';
import { generateQRPayload, escapeWifiString, getQRTitle } from '../utils/qrPayload';
import { INITIAL_FORM_DATA } from '../constants/presets';
import type { QRFormDataMap } from '../types/qr';

describe('QR Payload Generator', () => {
  it('generates proper URL payload with auto-protocol prepend', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      url: { url: 'github.com/developer' },
    };
    expect(generateQRPayload('url', data)).toBe('https://github.com/developer');
  });

  it('preserves existing https:// protocol in URL', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      url: { url: 'https://gdg.community.dev' },
    };
    expect(generateQRPayload('url', data)).toBe('https://gdg.community.dev');
  });

  it('generates exact plain text payload', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      text: { text: 'Hello World\nSecond Line!' },
    };
    expect(generateQRPayload('text', data)).toBe('Hello World\nSecond Line!');
  });

  it('generates valid mailto: RFC payload with subject and body', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      email: {
        email: 'alice@example.com',
        subject: 'Meeting Request',
        message: 'Let us meet at 2pm',
      },
    };
    const payload = generateQRPayload('email', data);
    expect(payload).toBe('mailto:alice@example.com?subject=Meeting%20Request&body=Let%20us%20meet%20at%202pm');
  });

  it('generates sanitized tel: payload for phone number', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      phone: { phone: '+1 (555) 234-5678' },
    };
    expect(generateQRPayload('phone', data)).toBe('tel:+15552345678');
  });

  it('escapes special characters in Wi-Fi SSID and password', () => {
    expect(escapeWifiString('My;Net:Work,Special\\Key')).toBe('My\\;Net\\:Work\\,Special\\\\Key');
  });

  it('generates standard ZXing Wi-Fi payload for WPA/WPA2', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      wifi: {
        ssid: 'HomeRouter',
        password: 'Pass;123',
        security: 'WPA',
        hidden: false,
      },
    };
    expect(generateQRPayload('wifi', data)).toBe('WIFI:T:WPA;S:HomeRouter;P:Pass\\;123;;');
  });

  it('generates open Wi-Fi network payload without password', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      wifi: {
        ssid: 'Airport_Free',
        password: '',
        security: 'nopass',
        hidden: true,
      },
    };
    expect(generateQRPayload('wifi', data)).toBe('WIFI:T:nopass;S:Airport_Free;H:true;;');
  });

  it('provides sensible title for history items', () => {
    const data: QRFormDataMap = {
      ...INITIAL_FORM_DATA,
      wifi: {
        ssid: 'CoffeeShop',
        password: '123',
        security: 'WPA',
        hidden: false,
      },
    };
    expect(getQRTitle('wifi', data)).toBe('Wi-Fi: CoffeeShop');
  });
});
