import type { QRFormDataMap, QRType } from '../types/qr';

export function escapeWifiString(str: string): string {
  return str.replace(/([\\;,":])/g, '\\$1');
}

export function generateQRPayload(type: QRType, dataMap: QRFormDataMap): string {
  switch (type) {
    case 'url': {
      const raw = dataMap.url.url.trim();
      if (!raw) return '';
      if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(raw)) {
        return `https://${raw}`;
      }
      return raw;
    }

    case 'text': {
      return dataMap.text.text;
    }

    case 'email': {
      const email = dataMap.email.email.trim();
      if (!email) return '';
      const params: string[] = [];
      if (dataMap.email.subject.trim()) {
        params.push(`subject=${encodeURIComponent(dataMap.email.subject.trim())}`);
      }
      if (dataMap.email.message.trim()) {
        params.push(`body=${encodeURIComponent(dataMap.email.message.trim())}`);
      }
      const query = params.length > 0 ? `?${params.join('&')}` : '';
      return `mailto:${email}${query}`;
    }

    case 'phone': {
      const raw = dataMap.phone.phone.trim();
      if (!raw) return '';
      const hasPlus = raw.startsWith('+');
      const digits = raw.replace(/\D/g, '');
      const cleaned = hasPlus ? `+${digits}` : digits;
      return `tel:${cleaned}`;
    }

    case 'wifi': {
      const { ssid, password, security, hidden } = dataMap.wifi;
      const cleanSSID = escapeWifiString(ssid.trim());
      const cleanPassword = security !== 'nopass' && password ? escapeWifiString(password) : '';
      const secType = security === 'nopass' ? 'nopass' : security;

      let payload = `WIFI:T:${secType};S:${cleanSSID};`;
      if (secType !== 'nopass' && cleanPassword) {
        payload += `P:${cleanPassword};`;
      }
      if (hidden) {
        payload += `H:true;`;
      }
      payload += `;`;
      return payload;
    }

    default:
      return '';
  }
}

export function getQRTitle(type: QRType, dataMap: QRFormDataMap): string {
  switch (type) {
    case 'url':
      return dataMap.url.url || 'Web Link';
    case 'text':
      return dataMap.text.text.slice(0, 32) || 'Plain Text';
    case 'email':
      return dataMap.email.email || 'Email Address';
    case 'phone':
      return dataMap.phone.phone || 'Phone Number';
    case 'wifi':
      return dataMap.wifi.ssid ? `Wi-Fi: ${dataMap.wifi.ssid}` : 'Wi-Fi Network';
    default:
      return 'QR Code';
  }
}

export function getQRSubtitle(type: QRType, dataMap: QRFormDataMap): string {
  switch (type) {
    case 'url':
      return 'Website link';
    case 'text':
      return `${dataMap.text.text.length} characters`;
    case 'email':
      return dataMap.email.subject ? `Subject: ${dataMap.email.subject}` : 'Email mailto';
    case 'phone':
      return 'Phone call direct';
    case 'wifi':
      return `Security: ${dataMap.wifi.security.toUpperCase()}${dataMap.wifi.hidden ? ' (Hidden)' : ''}`;
    default:
      return '';
  }
}
