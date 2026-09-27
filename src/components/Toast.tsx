import { CheckCircle2, X } from 'lucide-react';

interface Props {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: Props) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-xl border border-slate-700 dark:border-slate-200 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss toast"
        className="ml-2 p-1 text-slate-400 hover:text-white dark:hover:text-slate-900 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
