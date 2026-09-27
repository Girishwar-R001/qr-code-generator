import { Palette } from 'lucide-react';
import { QR_PRESETS } from '../constants/presets';
import type { Preset } from '../constants/presets';
import type { QRCustomization } from '../types/qr';

interface Props {
  onSelectPreset: (preset: Preset) => void;
  currentCustomization: QRCustomization;
}

export function PresetSelector({ onSelectPreset, currentCustomization }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-blue-500" />
          Color Presets
        </label>
        <span className="text-[11px] text-slate-400">Presets</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {QR_PRESETS.map((preset) => {
          const isActive =
            currentCustomization.foreground.toLowerCase() ===
              preset.previewFg.toLowerCase() &&
            currentCustomization.background.toLowerCase() ===
              preset.previewBg.toLowerCase();

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`group text-left p-2.5 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isActive
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500/50'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-600 shadow-inner flex items-center justify-center overflow-hidden shrink-0"
                  style={{ backgroundColor: preset.previewBg }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: preset.previewFg }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {preset.name}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 line-clamp-1 leading-tight">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
