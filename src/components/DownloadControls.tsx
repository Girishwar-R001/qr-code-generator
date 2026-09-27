import { useState } from 'react';
import { Download, FileCode, Copy, Check, Loader2 } from 'lucide-react';
import type { QRCustomization, QRType } from '../types/qr';
import { downloadQRPNG, downloadQRSVG, copyQRToClipboard } from '../utils/qrExport';

interface Props {
  payload: string;
  customization: QRCustomization;
  qrType: QRType;
  disabled: boolean;
  onToast: (msg: string) => void;
}

export function DownloadControls({
  payload,
  customization,
  qrType,
  disabled,
  onToast,
}: Props) {
  const [isCopying, setIsCopying] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [isExportingSVG, setIsExportingSVG] = useState(false);

  const handleDownloadPNG = async () => {
    if (disabled || !payload) return;
    try {
      setIsExportingPNG(true);
      await downloadQRPNG(payload, customization, qrType);
      onToast(`Saved PNG (${customization.size}×${customization.size}px) to downloads`);
    } catch (err) {
      console.error(err);
      onToast('Failed to export PNG');
    } finally {
      setIsExportingPNG(false);
    }
  };

  const handleDownloadSVG = async () => {
    if (disabled || !payload) return;
    try {
      setIsExportingSVG(true);
      await downloadQRSVG(payload, customization, qrType);
      onToast('Saved vector SVG file to downloads');
    } catch (err) {
      console.error(err);
      onToast('Failed to export SVG');
    } finally {
      setIsExportingSVG(false);
    }
  };

  const handleCopyClipboard = async () => {
    if (disabled || !payload) return;
    try {
      setIsCopying(true);
      const res = await copyQRToClipboard(payload, customization);
      if (res.success) {
        setHasCopied(true);
        onToast('Copied QR image to clipboard!');
        setTimeout(() => setHasCopied(false), 2500);
      } else {
        onToast(res.message);
      }
    } catch {
      onToast('Could not access clipboard');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleDownloadPNG}
          disabled={disabled || isExportingPNG}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-medium text-xs shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isExportingPNG ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Download PNG</span>
          <span className="text-[10px] opacity-75 hidden sm:inline">
            ({customization.size}px)
          </span>
        </button>

        <button
          type="button"
          onClick={handleDownloadSVG}
          disabled={disabled || isExportingSVG}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-medium text-xs shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          {isExportingSVG ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileCode className="w-4 h-4" />
          )}
          <span>Download SVG</span>
          <span className="text-[10px] opacity-75 hidden sm:inline">(Vector)</span>
        </button>
      </div>

      <button
        type="button"
        onClick={handleCopyClipboard}
        disabled={disabled || isCopying}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-xs transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCopying ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : hasCopied ? (
          <Check className="w-4 h-4 text-emerald-500" />
        ) : (
          <Copy className="w-4 h-4 text-slate-500" />
        )}
        <span>{hasCopied ? 'Copied to Clipboard!' : 'Copy QR to Clipboard'}</span>
      </button>
    </div>
  );
}
