import type { QRType } from '../types/qr';

interface QRTypeOption {
  type: QRType;
  label: string;
}

const QR_TYPE_OPTIONS: QRTypeOption[] = [
  { type: 'url', label: 'Website' },
  { type: 'text', label: 'Text' },
  { type: 'email', label: 'Email' },
  { type: 'phone', label: 'Phone' },
  { type: 'wifi', label: 'Wi-Fi' },
];

interface Props {
  selectedType: QRType;
  onSelectType: (type: QRType) => void;
}

export function QRTypeSelector({ selectedType, onSelectType }: Props) {
  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="QR Code Type"
        className="inline-flex w-full p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/50 dark:border-neutral-700/50"
      >
        {QR_TYPE_OPTIONS.map((option) => {
          const isSelected = selectedType === option.type;

          return (
            <button
              key={option.type}
              role="tab"
              aria-selected={isSelected}
              id={`tab-${option.type}`}
              aria-controls={`panel-${option.type}`}
              onClick={() => onSelectType(option.type)}
              className={`flex-1 py-1.5 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer text-center ${isSelected
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
