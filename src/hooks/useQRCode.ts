import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type {
  QRType,
  QRFormDataMap,
  QRCustomization,
  HistoryItem,
} from '../types/qr';
import { generateQRPayload, getQRTitle, getQRSubtitle } from '../utils/qrPayload';
import { validateQRInput } from '../utils/qrValidation';
import { evaluateReliability } from '../utils/qrReliability';
import { renderQRToCanvas } from '../utils/qrExport';

interface UseQRCodeProps {
  type: QRType;
  formData: QRFormDataMap;
  customization: QRCustomization;
  onSaveHistory: (item: HistoryItem) => void;
}

export function useQRCode({
  type,
  formData,
  customization,
  onSaveHistory,
}: UseQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const validation = useMemo(() => validateQRInput(type, formData), [type, formData]);

  const payload = useMemo(() => {
    return validation.isValid ? generateQRPayload(type, formData) : '';
  }, [type, formData, validation.isValid]);

  const reliability = useMemo(
    () => evaluateReliability(payload, customization),
    [payload, customization],
  );

  const renderCode = useCallback(async () => {
    if (!canvasRef.current || !payload || !validation.isValid) return;

    try {
      setIsGenerating(true);
      setRenderError(null);
      await renderQRToCanvas(canvasRef.current, { payload, customization });
    } catch (err: unknown) {
      console.error('QR Render Failed:', err);
      setRenderError(err instanceof Error ? err.message : 'QR Rendering error');
    } finally {
      setIsGenerating(false);
    }
  }, [payload, customization, validation.isValid]);

  useEffect(() => {
    const timer = setTimeout(renderCode, 60);
    return () => clearTimeout(timer);
  }, [renderCode]);

  useEffect(() => {
    if (!payload || !validation.isValid) return;

    const timer = setTimeout(() => {
      const title = getQRTitle(type, formData);
      const subtitle = getQRSubtitle(type, formData);

      const historyItem: HistoryItem = {
        id: `${type}-${Date.now()}`,
        type,
        title,
        subtitle,
        config: {
          id: `${type}-${Date.now()}`,
          type,
          data: structuredClone(formData),
          customization: { ...customization },
          title,
          createdAt: Date.now(),
        },
        createdAt: Date.now(),
      };

      onSaveHistory(historyItem);
    }, 1800);

    return () => clearTimeout(timer);
  }, [type, formData, customization, payload, validation.isValid, onSaveHistory]);

  return {
    canvasRef,
    payload,
    validation,
    reliability,
    isGenerating,
    renderError,
    renderCode,
  };
}
