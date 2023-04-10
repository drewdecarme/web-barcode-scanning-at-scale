import React, { useCallback, useRef, useState } from "react";
import { FC, ReactNode, useContext } from "react";
import { UseScannerLog, UseScannerLogger } from "../src/lib/lib.types";

type DashboardContextType = {
  logs: UseScannerLog[];
  logger: UseScannerLogger;
  scanResult: string;
  onScan: (e: string) => void;
  toggleLog: () => void;
};
const DashboardContext = React.createContext<DashboardContextType | null>(null);
export type DashboardProviderProps = {
  children: ReactNode;
};
export const DashboardProvider: FC<DashboardProviderProps> = ({ children }) => {
  const [logs, setLog] = useState<DashboardContextType["logs"]>([]);
  const [scanResult, onScan] = useState<string>("");
  const shouldLogRef = useRef<boolean>(true);

  const toggleLog = useCallback(() => {
    shouldLogRef.current = !shouldLogRef.current;
  }, []);

  /**
   * This is a memoized utility to log messages or add message
   * entries to the log state declared at the top of the hook.
   * Since this can be called in event handlers, we need to use
   * mutable references to prevent their execution if a one of the
   * `debug.enableLogging` is changed to true.
   */
  const logger = useCallback<UseScannerLogger>((message) => {
    if (!shouldLogRef.current) return;
    setLog((prevLogs) => [
      ...prevLogs,
      {
        ...message,
        ts: new Date().toISOString(),
      },
    ]);
  }, []);

  return (
    <DashboardContext.Provider value={{ logs, logger, scanResult, onScan, toggleLog }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "'useDashboardContext()' must be used within a <DashboardProvider /> component"
    );
  }
  return context;
};
