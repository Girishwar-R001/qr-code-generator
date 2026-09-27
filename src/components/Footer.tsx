import { Shield, Cpu, Lock, Check } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 px-4 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-500" />
              Private & Offline
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Everything runs directly in your browser. Your text, Wi-Fi passwords, and logos
              never leave your machine or touch external servers.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-blue-500" />
              Reliable Scanning
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Uses standard QR error correction, quiet-zone margins, and real-time contrast checks
              to make sure your codes scan easily on any phone camera.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4 text-indigo-500" />
              Saved Locally
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Recent designs are stored in your browser's local storage so you can easily reload or
              clear them anytime.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} QR Studio</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              Client-side only
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
