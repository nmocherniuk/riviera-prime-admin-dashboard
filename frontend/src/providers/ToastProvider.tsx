import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type AlertColor,
} from "@mui/material";
import Toast from "../components/Toast";

export type ToastSeverity = AlertColor;

export type ShowToastOptions = {
  message: string;
  severity?: ToastSeverity;
  autoHideDuration?: number | null;
};

type ToastContextValue = {
  showToast: (options: ShowToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<ToastSeverity>("info");
  const [autoHideMs, setAutoHideMs] = useState<number | null>(6000);

  const showToast = useCallback((options: ShowToastOptions) => {
    setMessage(options.message);
    setSeverity(options.severity ?? "info");
    setAutoHideMs(
      options.autoHideDuration === undefined ? 6000 : options.autoHideDuration,
    );
    setOpen(true);
  }, []);

  const handleClose = useCallback(
    (_event?: unknown, reason?: string) => {
      if (reason === "clickaway") return;
      setOpen(false);
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      <Toast open={open} autoHideMs={autoHideMs} handleClose={handleClose} severity={severity} message={message}>{children}</Toast>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
