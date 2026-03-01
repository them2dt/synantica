/**
 * Toast notification system for displaying global messages
 * Provides success, error, warning, and info notifications
 */

"use client";

import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import {
    useEffect,
    useState,
    createContext,
    useContext,
    useCallback,
    ReactNode,
} from "react";

/**
 * Toast types for different notification styles
 */
export type ToastType = "success" | "error" | "warning" | "info";

/**
 * Toast configuration interface
 */
export interface ToastConfig {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * Toast component props
 */
interface ToastProps extends ToastConfig {
    onDismiss: (id: string) => void;
}

/**
 * Individual toast notification component
 */
function Toast({
    id,
    type,
    title,
    description,
    duration = 5000,
    action,
    onDismiss,
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const handleDismiss = useCallback(() => {
        setIsLeaving(true);
        setTimeout(() => onDismiss(id), 300);
    }, [onDismiss, id]);

    useEffect(() => {
        // Animate in
        const timer = setTimeout(() => setIsVisible(true), 100);

        // Auto dismiss
        const dismissTimer = setTimeout(() => {
            handleDismiss();
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(dismissTimer);
        };
    }, [duration, handleDismiss]);

    const getToastStyles = () => {
        const baseStyles =
            "relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-none border border-slate-200 bg-slate-50 p-5 pr-8 transition-all";
        switch (type) {
            case "success":
                return cn(baseStyles, "border-emerald-600/40");
            case "error":
                return cn(baseStyles, "border-red-600 text-slate-50 bg-red-600");
            case "warning":
                return cn(
                    baseStyles,
                    "border-amber-500/60 bg-amber-500 text-slate-50"
                );
            case "info":
                return cn(baseStyles, "border-slate-200");
            default:
                return cn(baseStyles, "border-slate-200");
        }
    };

    const getIcon = () => {
        const iconProps = { className: "h-5 w-5 flex-shrink-0" };
        switch (type) {
            case "success":
                return (
                    <CheckCircle {...iconProps} className={cn(iconProps.className, "text-emerald-600")} />
                );
            case "error":
                return (
                    <AlertCircle
                        {...iconProps}
                        className={cn(iconProps.className, "text-slate-50")}
                    />
                );
            case "warning":
                return (
                    <AlertTriangle
                        {...iconProps}
                        className={cn(iconProps.className, "text-slate-50")}
                    />
                );
            case "info":
                return <Info {...iconProps} className={cn(iconProps.className, "text-slate-500")} />;
            default:
                return <Info {...iconProps} className={cn(iconProps.className, "text-slate-500")} />;
        }
    };

    return (
        <div
            className={cn(
                "transform transition-all duration-300 ease-in-out",
                isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            )}
        >
            <div className={getToastStyles()}>
                <div className="flex items-start space-x-3">
                    {getIcon()}
                    <div className="flex-1">
                        <div className="text-sm">{title}</div>
                        {description && <div className="mt-1 text-sm opacity-90">{description}</div>}
                        {action && (
                            <button onClick={action.onClick} className="mt-2 text-sm underline hover:no-underline">
                                {action.label}
                            </button>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    className="absolute right-2 top-2 rounded-none p-1 hover:bg-slate-100/60 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

/**
 * Toast container component
 */
interface ToastContainerProps {
    toasts: ToastConfig[];
    onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    if (toasts.length === 0) return null;
    return (
        <div className="fixed top-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col space-y-2 overflow-hidden">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

/**
 * Toast context and hook for managing toasts
 */
interface ToastContextType {
    toasts: ToastConfig[];
    addToast: (toast: Omit<ToastConfig, "id">) => void;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast provider component
 */
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastConfig[]>([]);

    const addToast = useCallback((toast: Omit<ToastConfig, "id">) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: ToastConfig = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
}

/**
 * Hook to use toast notifications
 */
export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    const { addToast, removeToast, clearAllToasts } = context;

    const toast = useCallback(
        (config: Omit<ToastConfig, "id">) => {
            addToast(config);
        },
        [addToast]
    );

    // Convenience methods
    const success = useCallback(
        (title: string, description?: string, options?: Partial<ToastConfig>) => {
            toast({ type: "success", title, description, ...options });
        },
        [toast]
    );

    const error = useCallback(
        (title: string, description?: string, options?: Partial<ToastConfig>) => {
            toast({ type: "error", title, description, ...options });
        },
        [toast]
    );

    const warning = useCallback(
        (title: string, description?: string, options?: Partial<ToastConfig>) => {
            toast({ type: "warning", title, description, ...options });
        },
        [toast]
    );

    const info = useCallback(
        (title: string, description?: string, options?: Partial<ToastConfig>) => {
            toast({ type: "info", title, description, ...options });
        },
        [toast]
    );

    return {
        toast,
        success,
        error,
        warning,
        info,
        removeToast,
        clearAllToasts,
    };
}
