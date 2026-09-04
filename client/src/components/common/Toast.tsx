import React from 'react';
import { useSocket } from '../../context/SocketContext';
import { X, Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSocket();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderColor = 'border-blue-300';
        let bgColor = 'bg-blue-50';
        let textColor = 'text-blue-900';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'border-emerald-300';
          bgColor = 'bg-emerald-50';
          textColor = 'text-emerald-900';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'border-amber-300';
          bgColor = 'bg-amber-50';
          textColor = 'text-amber-900';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border ${borderColor} transition-all duration-300 transform translate-y-0`}
          >
            <div className={`p-2 rounded-lg ${bgColor} shrink-0`}>
              <Icon className={`w-5 h-5 ${textColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 font-display">
                  {toast.title}
                </p>
                <span className="text-[10px] text-slate-400">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
