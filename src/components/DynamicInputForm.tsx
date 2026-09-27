import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { QRFormDataMap, QRType, ValidationResult } from '../types/qr';

interface Props {
  type: QRType;
  formData: QRFormDataMap;
  onChange: <K extends QRType>(type: K, data: QRFormDataMap[K]) => void;
  validation: ValidationResult;
}

export function DynamicInputForm({ type, formData, onChange, validation }: Props) {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  return (
    <div
      role="tabpanel"
      id={`panel-${type}`}
      aria-labelledby={`tab-${type}`}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Content
        </label>

      </div>

      {type === 'url' && (
        <div className="space-y-2">
          <label
            htmlFor="url-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Destination URL <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="url-input"
              type="text"
              value={formData.url.url}
              onChange={(e) => onChange('url', { url: e.target.value })}
              placeholder="https://example.com"
              aria-invalid={!!validation.errors.url}
              aria-describedby={validation.errors.url ? 'url-error' : undefined}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 ${validation.errors.url
                ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
            />
          </div>

        </div>
      )}

      {type === 'text' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="text-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Plain Text Content <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">
              {formData.text.text.length} characters
            </span>
          </div>
          <textarea
            id="text-input"
            rows={4}
            value={formData.text.text}
            onChange={(e) => onChange('text', { text: e.target.value })}
            placeholder="Type or paste any multiline plain text..."
            aria-invalid={!!validation.errors.text}
            aria-describedby={validation.errors.text ? 'text-error' : undefined}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 resize-y ${validation.errors.text
              ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
          />
          {validation.errors.text ? (
            <p id="text-error" className="flex items-center gap-1.5 text-xs text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {validation.errors.text}
            </p>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Supports newlines, alphanumeric characters, and international unicode.
            </p>
          )}
        </div>
      )}

      {type === 'email' && (
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <label
              htmlFor="email-address"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Recipient Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="email-address"
              type="email"
              value={formData.email.email}
              onChange={(e) =>
                onChange('email', { ...formData.email, email: e.target.value })
              }
              placeholder="recipient@company.com"
              aria-invalid={!!validation.errors.email}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${validation.errors.email
                ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
            />
            {validation.errors.email && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {validation.errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email-subject"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Email Subject <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="email-subject"
              type="text"
              value={formData.email.subject}
              onChange={(e) =>
                onChange('email', { ...formData.email, subject: e.target.value })
              }
              placeholder="e.g. Product Inquiry / Meeting Request"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email-message"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Pre-filled Message Body <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="email-message"
              rows={3}
              value={formData.email.message}
              onChange={(e) =>
                onChange('email', { ...formData.email, message: e.target.value })
              }
              placeholder="Hi there! I scanned your QR code and wanted to connect..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
            />
          </div>
        </div>
      )}

      {type === 'phone' && (
        <div className="space-y-2">
          <label
            htmlFor="phone-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            id="phone-input"
            type="tel"
            value={formData.phone.phone}
            onChange={(e) => onChange('phone', { phone: e.target.value })}
            placeholder="+1 555-0199 or +91 98765 43210"
            aria-invalid={!!validation.errors.phone}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${validation.errors.phone
              ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
          />
          {validation.errors.phone ? (
            <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {validation.errors.phone}
            </p>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              When scanned on mobile, immediately prompts one-tap dialer call.
            </p>
          )}
        </div>
      )}

      {type === 'wifi' && (
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <label
              htmlFor="wifi-ssid"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Network Name (SSID) <span className="text-rose-500">*</span>
            </label>
            <input
              id="wifi-ssid"
              type="text"
              value={formData.wifi.ssid}
              onChange={(e) =>
                onChange('wifi', { ...formData.wifi, ssid: e.target.value })
              }
              placeholder="e.g. CoffeeShop_Guest_5G"
              aria-invalid={!!validation.errors.ssid}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${validation.errors.ssid
                ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
            />
            {validation.errors.ssid && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {validation.errors.ssid}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="wifi-security"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Security Protocol
              </label>
              <select
                id="wifi-security"
                value={formData.wifi.security}
                onChange={(e) =>
                  onChange('wifi', {
                    ...formData.wifi,
                    security: e.target.value as 'WPA' | 'WEP' | 'nopass',
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">Open Network (No Password)</option>
              </select>
            </div>

            {formData.wifi.security !== 'nopass' && (
              <div className="space-y-1.5">
                <label
                  htmlFor="wifi-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="wifi-password"
                    type={showWifiPassword ? 'text' : 'password'}
                    value={formData.wifi.password}
                    onChange={(e) =>
                      onChange('wifi', { ...formData.wifi, password: e.target.value })
                    }
                    placeholder="Wireless password"
                    aria-invalid={!!validation.errors.password}
                    className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${validation.errors.password
                      ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                    aria-label={showWifiPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showWifiPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {validation.errors.password && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {validation.errors.password}
                  </p>
                )}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.wifi.hidden}
              onChange={(e) =>
                onChange('wifi', { ...formData.wifi, hidden: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Hidden Network (SSID is not broadcasting)
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
