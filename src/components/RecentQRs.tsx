import { History, Trash2, ArrowUpRight, Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';
import type { HistoryItem, QRType } from '../types/qr';

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const TYPE_ICONS: Record<QRType, React.ComponentType<{ className?: string }>> = {
  url: Globe,
  text: FileText,
  email: Mail,
  phone: Phone,
  wifi: Wifi,
};

export function RecentQRs({ items, onSelect, onDelete, onClearAll }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <History className="w-5 h-5" />
        </div>
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          No Recent QR Codes
        </h4>
        <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">
          QR codes you generate will appear here so you can easily reload them later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Recent QR Codes
          </h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            {items.length} saved
          </span>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-[11px] font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const Icon = TYPE_ICONS[item.type] || Globe;
          const timeFormatted = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(item.createdAt));

          return (
            <div
              key={item.id}
              className="group relative p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 bg-slate-50/40 dark:bg-slate-800/40 transition-all flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-blue-100/70 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  title="Delete from history"
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400">
                <span>{timeFormatted}</span>

                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Load Settings
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
