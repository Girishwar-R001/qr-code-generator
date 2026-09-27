import { CheckCircle2, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import type { ReliabilityReport } from '../types/qr';

interface Props {
  report: ReliabilityReport;
}

export function ReliabilityIndicator({ report }: Props) {
  const getBadgeStyle = () => {
    switch (report.level) {
      case 'good':
        return {
          icon: CheckCircle2,
          container:
            'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          pill: 'bg-emerald-600 text-white',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          container:
            'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200',
          iconColor: 'text-amber-600 dark:text-amber-400',
          pill: 'bg-amber-500 text-white',
        };
      case 'danger':
        return {
          icon: AlertOctagon,
          container:
            'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200',
          iconColor: 'text-rose-600 dark:text-rose-400',
          pill: 'bg-rose-600 text-white',
        };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  return (
    <div
      role="region"
      aria-label="Scan Reliability Assessment"
      className={`p-3.5 rounded-xl border transition-all text-xs ${style.container}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 shrink-0 ${style.iconColor}`} />
          <span className="font-semibold text-xs">{report.title}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/60 border border-current/10">
            {report.contrastRatio}:1 Contrast
          </span>
        </div>
      </div>

      {report.messages.length > 0 && (
        <ul className="mt-2.5 space-y-1 pl-5 list-disc text-[11px] opacity-90">
          {report.messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      )}

      <div className="mt-2.5 pt-2 border-t border-current/10 flex items-center gap-1 text-[10px] opacity-75">
        <Info className="w-3 h-3 shrink-0" />
        <span>
          Test scan with your phone camera before printing.
        </span>
      </div>
    </div>
  );
}
