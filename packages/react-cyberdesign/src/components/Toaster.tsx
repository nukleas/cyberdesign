import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { Toast, type ToastProps } from './Toast';

export type ToastInput = Omit<ToastProps, 'onDismiss'> & { id?: string; duration?: number };

interface ToastRecord extends ToastInput {
  id: string;
}

interface ToasterContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToasterContext = createContext<ToasterContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToasterContext);
  if (!ctx) throw new Error('useToast must be used within <ToasterProvider>');
  return ctx;
}

export interface ToasterProviderProps {
  children?: ReactNode;
  /** Viewport position. @default 'bottom-right' */
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  /** Default auto-dismiss ms. @default 4000 */
  duration?: number;
}

/** Sonner-style toast provider + viewport. */
export function ToasterProvider({
  children,
  position = 'bottom-right',
  duration = 4000,
}: ToasterProviderProps) {
  const [items, setItems] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = input.id ?? `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const rec: ToastRecord = { ...input, id };
      setItems((list) => [...list, rec]);
      const ms = input.duration ?? duration;
      if (ms > 0) window.setTimeout(() => dismiss(id), ms);
      return id;
    },
    [duration, dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <div className={cn('cd-toaster', `cd-toaster--${position}`)} aria-live="polite">
        {items.map(({ id, duration: _d, ...props }) => (
          <Toast key={id} {...props} onDismiss={() => dismiss(id)} />
        ))}
      </div>
    </ToasterContext.Provider>
  );
}

/** Standalone viewport alias for Sonner naming. */
export function Toaster(props: Omit<ToasterProviderProps, 'children'>) {
  return <ToasterProvider {...props} />;
}
