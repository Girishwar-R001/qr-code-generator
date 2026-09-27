import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { QRTypeSelector } from './components/QRTypeSelector';
import { DynamicInputForm } from './components/DynamicInputForm';
import { PresetSelector } from './components/PresetSelector';
import { CustomizationPanel } from './components/CustomizationPanel';
import { QRPreview } from './components/QRPreview';
import { RecentQRs } from './components/RecentQRs';
import { Toast } from './components/Toast';

import type { QRType, QRFormDataMap, QRCustomization, HistoryItem } from './types/qr';
import { INITIAL_FORM_DATA, DEFAULT_CUSTOMIZATION } from './constants/presets';
import type { Preset } from './constants/presets';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useQRCode } from './hooks/useQRCode';

export default function App() {
  const [selectedType, setSelectedType] = useState<QRType>('url');
  const [formData, setFormData] = useState<QRFormDataMap>(INITIAL_FORM_DATA);
  const [customization, setCustomization] = useState<QRCustomization>(DEFAULT_CUSTOMIZATION);
  const [historyItems, setHistoryItems] = useLocalStorage<HistoryItem[]>('qr_studio_history_v1', []);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  const handleSaveHistory = useCallback(
    (newItem: HistoryItem) => {
      setHistoryItems((prev) => {
        const filtered = prev.filter(
          (item) => item.title !== newItem.title || item.type !== newItem.type,
        );
        return [newItem, ...filtered].slice(0, 15);
      });
    },
    [setHistoryItems],
  );

  const {
    canvasRef,
    payload,
    validation,
    reliability,
    isGenerating,
  } = useQRCode({
    type: selectedType,
    formData,
    customization,
    onSaveHistory: handleSaveHistory,
  });

  const handleFormChange = <K extends QRType>(type: K, data: QRFormDataMap[K]) => {
    setFormData((prev) => ({ ...prev, [type]: data }));
  };

  const handleCustomizationChange = (updates: Partial<QRCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectPreset = (preset: Preset) => {
    setCustomization((prev) => ({ ...prev, ...preset.customization }));
    showToast(`Applied "${preset.name}" preset`);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setSelectedType(item.type);
    if (item.config.data) setFormData(item.config.data);
    if (item.config.customization) setCustomization(item.config.customization);
    showToast(`Restored "${item.title}"`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed item from history');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your saved QR code history?')) {
      setHistoryItems([]);
      showToast('Cleared all history');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            <QRTypeSelector
              selectedType={selectedType}
              onSelectType={(t) => setSelectedType(t)}
            />

            <DynamicInputForm
              type={selectedType}
              formData={formData}
              onChange={handleFormChange}
              validation={validation}
            />

            <PresetSelector
              onSelectPreset={handleSelectPreset}
              currentCustomization={customization}
            />

            <CustomizationPanel
              customization={customization}
              onChange={handleCustomizationChange}
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-5">
            <QRPreview
              canvasRef={canvasRef}
              type={selectedType}
              payload={payload}
              customization={customization}
              validation={validation}
              reliability={reliability}
              isGenerating={isGenerating}
              onToast={showToast}
            />
          </div>
        </div>

        <section aria-label="Recent QR Codes">
          <RecentQRs
            items={historyItems}
            onSelect={handleLoadHistory}
            onDelete={handleDeleteHistory}
            onClearAll={handleClearHistory}
          />
        </section>
      </main>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
