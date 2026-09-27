import React, { useRef } from 'react';
import {
  Sliders,
  ArrowLeftRight,
  ShieldCheck,
  Image as ImageIcon,
  Trash2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import type { QRCustomization, ErrorCorrectionLevel } from '../types/qr';

interface Props {
  customization: QRCustomization;
  onChange: (updates: Partial<QRCustomization>) => void;
}

const ERROR_LEVELS: {
  level: ErrorCorrectionLevel;
  name: string;
  recovery: string;
  description: string;
}[] = [
  {
    level: 'L',
    name: 'Low',
    recovery: '~7%',
    description: 'Lowest density, best for clean displays',
  },
  {
    level: 'M',
    name: 'Medium',
    recovery: '~15%',
    description: 'Standard balance of density and tolerance',
  },
  {
    level: 'Q',
    name: 'Quartile',
    recovery: '~25%',
    description: 'Recommended when adding logos or textures',
  },
  {
    level: 'H',
    name: 'High',
    recovery: '~30%',
    description: 'Maximum resilience to tears, smudges & overlays',
  },
];

export function CustomizationPanel({ customization, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSwapColors = () => {
    onChange({
      foreground: customization.background,
      background: customization.foreground,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Logo file should be under 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const recommendedEC =
        customization.errorCorrection === 'L' || customization.errorCorrection === 'M'
          ? 'Q'
          : customization.errorCorrection;

      onChange({
        logoUrl: dataUrl,
        errorCorrection: recommendedEC,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange({ logoUrl: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-blue-500" />
          3. Customize Design
        </label>
        <span className="text-[11px] text-slate-400">Colors & Layout</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Colors & Appearance
          </span>
          <button
            type="button"
            onClick={handleSwapColors}
            title="Invert foreground and background"
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium cursor-pointer"
          >
            <ArrowLeftRight className="w-3 h-3" />
            Invert Colors
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="fg-color"
              className="text-[11px] font-medium text-slate-500 dark:text-slate-400"
            >
              Foreground (Modules)
            </label>
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <input
                id="fg-color"
                type="color"
                value={customization.foreground}
                onChange={(e) => onChange({ foreground: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
              />
              <input
                type="text"
                value={customization.foreground}
                onChange={(e) => onChange({ foreground: e.target.value })}
                aria-label="Foreground hex color code"
                className="w-full text-xs font-mono uppercase bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="bg-color"
              className="text-[11px] font-medium text-slate-500 dark:text-slate-400"
            >
              Background
            </label>
            <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <input
                id="bg-color"
                type="color"
                value={customization.background}
                onChange={(e) => onChange({ background: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 bg-transparent shrink-0"
              />
              <input
                type="text"
                value={customization.background}
                onChange={(e) => onChange({ background: e.target.value })}
                aria-label="Background hex color code"
                className="w-full text-xs font-mono uppercase bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={customization.enableGradient}
                onChange={(e) => onChange({ enableGradient: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Enable Module Gradient
              </span>
            </label>
          </div>

          {customization.enableGradient && (
            <div className="mt-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    End Gradient Color
                  </span>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <input
                      type="color"
                      value={customization.gradientColor}
                      onChange={(e) => onChange({ gradientColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={customization.gradientColor}
                      onChange={(e) => onChange({ gradientColor: e.target.value })}
                      aria-label="Gradient hex color code"
                      className="w-full text-xs font-mono uppercase bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="gradient-dir"
                    className="text-[11px] text-slate-500 dark:text-slate-400"
                  >
                    Gradient Angle
                  </label>
                  <select
                    id="gradient-dir"
                    value={customization.gradientDirection}
                    onChange={(e) =>
                      onChange({
                        gradientDirection: e.target.value as 'to-br' | 'to-r' | 'to-b',
                      })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="to-br">Diagonal (Top-Left → Bottom-Right)</option>
                    <option value="to-r">Horizontal (Left → Right)</option>
                    <option value="to-b">Vertical (Top → Bottom)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Error Correction Level
          </label>
          <span className="text-[11px] text-slate-400">Damage tolerance</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ERROR_LEVELS.map((item) => {
            const isSelected = customization.errorCorrection === item.level;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => onChange({ errorCorrection: item.level })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {item.name} ({item.level})
                  </span>
                  <span className="text-[10px] font-semibold px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.recovery}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="size-slider"
              className="text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Export Resolution & Size
            </label>
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
              {customization.size} × {customization.size} px
            </span>
          </div>

          <input
            id="size-slider"
            type="range"
            min={128}
            max={1024}
            step={32}
            value={customization.size}
            onChange={(e) => onChange({ size: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 mr-1">Quick:</span>
            {[256, 360, 512, 1024].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => onChange({ size: sz })}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                  customization.size === sz
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {sz}px
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="margin-slider"
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1"
            >
              Quiet Zone (Margin)
              <span
                title="Margin around the QR code so camera sensors can isolate and scan it."
                className="cursor-help"
              >
                <HelpCircle className="w-3 h-3 text-slate-400" />
              </span>
            </label>
            <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
              {customization.margin} modules
            </span>
          </div>

          <input
            id="margin-slider"
            type="range"
            min={0}
            max={8}
            step={1}
            value={customization.margin}
            onChange={(e) => onChange({ margin: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0 (None)</span>
            <span>4 (Standard)</span>
            <span>8 (Wide)</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
            Center Brand Logo (Optional)
          </label>
          <span className="text-[11px] text-slate-400">Optional</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={handleLogoUpload}
          className="hidden"
          id="logo-upload-input"
        />

        {!customization.logoUrl ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            Upload Brand Logo / Icon (PNG, SVG, JPG)
          </button>
        ) : (
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={customization.logoUrl}
                    alt="Logo Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    Custom Logo Active
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Centered inside the QR code
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveLogo}
                title="Remove logo"
                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  Logo Area Coverage ({customization.logoSize}%)
                </span>
                <span className="text-[10px] text-slate-400">
                  Max 25% recommended
                </span>
              </div>
              <input
                type="range"
                min={12}
                max={26}
                step={1}
                value={customization.logoSize}
                onChange={(e) => onChange({ logoSize: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={customization.logoBackground}
                onChange={(e) => onChange({ logoBackground: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300">
                Add solid background behind logo
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
