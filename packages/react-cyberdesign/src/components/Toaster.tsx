import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { Toast, type ToastProps } from './Toast';

export type ToastInput = Omit<ToastProps, 'onDismiss'> & {
  /** Stable id. Calling `toast` again with the id of a toast still on screen replaces it in place. */
  id?: string;
  /** Auto-dismiss ms; `0` keeps the toast up until it is dismissed. Defaults to the provider's `duration`. */
  duration?: number;
};

/** Fields to change on a toast that is on screen. A key set to `undefined` goes back to its default. */
export type ToastUpdate = Omit<ToastInput, 'id'>;

interface ToastRecord extends ToastInput {
  id: string;
}

interface ToasterContextValue {
  /** Show a toast and return its id. */
  toast: (input: ToastInput) => string;
  /**
   * Change a toast in place (e.g. the text and `progress` of a long job). Keys left out keep
   * their value, and so does the auto-dismiss timer unless `duration` is among the keys, which
   * restarts it. Does nothing if the toast is gone.
   */
  update: (id: string, patch: ToastUpdate) => void;
  /** Remove a toast now. */
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
  /** The one pending auto-dismiss timer per toast id; a toast that stays up has no entry. */
  const timers = useRef(new Map<string, number>());

  const cancelTimer = useCallback((id: string) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      cancelTimer(id);
      setItems((list) => list.filter((t) => t.id !== id));
    },
    [cancelTimer],
  );

  /** Replace the id's timer, so an earlier duration can never fire on a later state. */
  const schedule = useCallback(
    (id: string, ms: number) => {
      cancelTimer(id);
      if (ms > 0) timers.current.set(id, window.setTimeout(() => dismiss(id), ms));
    },
    [cancelTimer, dismiss],
  );

  const toast = useCallback(
    (input: ToastInput) => {
      const id = input.id ?? `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const rec: ToastRecord = { ...input, id };
      setItems((list) =>
        list.some((t) => t.id === id) ? list.map((t) => (t.id === id ? rec : t)) : [...list, rec],
      );
      schedule(id, input.duration ?? duration);
      return id;
    },
    [duration, schedule],
  );

  const update = useCallback(
    (id: string, patch: ToastUpdate) => {
      setItems((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
      // For a toast that is gone this only arms a timer whose dismiss finds nothing.
      if ('duration' in patch) schedule(id, patch.duration ?? duration);
    },
    [duration, schedule],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
      pending.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, update, dismiss }), [toast, update, dismiss]);

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
