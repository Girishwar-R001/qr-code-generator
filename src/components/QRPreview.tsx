import React, { useState } from 'react';
import { Download, Copy, Check, AlertCircle } from 'lucide-react';
import type { QRCustomization, QRType, ReliabilityReport, ValidationResult } from '../types/qr';
import { downloadQRPNG, downloadQRJPG, downloadQRSVG, copyQRToClipboard } from '../utils/qrExport';

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  type: QRType;
  payload: string;
  customization: QRCustomization;
  validation: ValidationResult;
  reliability: ReliabilityReport;
  isGenerating?: boolean;
  onToast: (msg: string) => void;
}

type ExportFormat = 'png' | 'jpg' | 'svg';

export function QRPreview({
  canvasRef,
  type,
  payload,
  customization,
  validation,
  reliability,
  isGenerating = false,
  onToast,
}: Props) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [isCopying, setIsCopying] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const hasError = !validation.isValid || !payload;

  const handleDownload = async () => {
    if (hasError) return;
    try {
      setIsDownloading(true);
      if (format === 'png') {
        await downloadQRPNG(payload, customization, type);
        onToast(`Downloaded PNG (${customization.size}×${customization.size})`);
      } else if (format === 'jpg') {
        await downloadQRJPG(payload, customization, type);
        onToast(`Downloaded JPG (${customization.size}×${customization.size})`);
      } else {
        await downloadQRSVG(payload, customization, type);
        onToast('Downloaded SVG vector');
      }
    } catch {
      onToast('Export failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    if (hasError) return;
    try {
      setIsCopying(true);
      const res = await copyQRToClipboard(payload, customization);
      if (res.success) {
        setHasCopied(true);
        onToast('Copied to clipboard');
        setTimeout(() => setHasCopied(false), 2000);
      } else {
        onToast(res.message);
      }
    } catch {
      onToast('Could not copy to clipboard');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex flex-col items-center justify-center py-10 px-6 sm:px-12 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
        <div className="relative flex items-center justify-center p-3">
          <canvas
            ref={canvasRef}
            aria-label="Generated QR Code"
            className={`max-w-full rounded-lg transition-opacity duration-150 ${
              hasError ? 'opacity-20 blur-[1px]' : isGenerating ? 'opacity-75' : 'opacity-100'
            }`}
            style={{
              width: `${Math.min(customization.size, 320)}px`,
              height: `${Math.min(customization.size, 320)}px`,
            }}
          />

          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <AlertCircle className="w-6 h-6 text-neutral-400 mb-1.5" />
              <p className="text-xs text-neutral-500 font-medium">
                {Object.values(validation.errors)[0] || 'Complete input to view code'}
              </p>
            </div>
          )}
        </div>

        {!hasError && (
          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span
              className={`w-1.5 h-1.5 rounded-full ${reliability.level === 'good'
                  ? 'bg-emerald-500'
                  : reliability.level === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
            />
            <span>{reliability.title}</span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span>{reliability.contrastRatio}:1 contrast</span>
          </div>
        )}
      </div>

      <div className="w-full mt-5 space-y-3">
        <div className="flex items-center justify-center">
          <div
            role="group"
            aria-label="Export format"
            className="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/50 dark:border-neutral-700/50 text-xs font-medium text-neutral-500 dark:text-neutral-400"
          >
            {(['png', 'jpg', 'svg'] as ExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`px-4 py-1 rounded-lg uppercase tracking-wider text-xs transition-all cursor-pointer ${format === fmt
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                    : 'hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={hasError || isDownloading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-medium text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download {format.toUpperCase()}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={hasError || isCopying}
            title="Copy image to clipboard"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-medium text-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {hasCopied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{hasCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
