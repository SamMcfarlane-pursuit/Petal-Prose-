import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'error';
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'info' | 'error', duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success', duration: number = 3000) => {
        const id = Math.random().toString(36).substring(2, 11);
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-8 right-8 z-[3000] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, [toast, onRemove]);

    const bgColor = toast.type === 'success'
        ? 'bg-green-500'
        : toast.type === 'error'
            ? 'bg-red-500'
            : 'bg-stone-900';

    const icon = toast.type === 'success'
        ? 'fa-check-circle'
        : toast.type === 'error'
            ? 'fa-exclamation-circle'
            : 'fa-info-circle';

    return (
        <div
            className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto animate-in slide-in-from-right duration-300 min-w-[280px]`}
        >
            <i className={`fa-solid ${icon} text-lg`}></i>
            <span className="font-medium text-sm flex-1">{toast.message}</span>
            <button
                onClick={() => onRemove(toast.id)}
                className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
                <i className="fa-solid fa-xmark text-xs"></i>
            </button>
        </div>
    );
};

export default ToastProvider;
