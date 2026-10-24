import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`rounded-2xl p-4 border shadow-2xl backdrop-blur-xl flex items-start gap-3 ${
          toast.type === 'success'
            ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-200'
            : toast.type === 'warning'
            ? 'bg-slate-900/95 border-amber-500/50 text-amber-200'
            : 'bg-slate-900/95 border-indigo-500/50 text-indigo-200'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
        </div>

        <div className="flex-1 text-xs sm:text-sm font-medium leading-snug text-slate-100">
          {toast.message}
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
