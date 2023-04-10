import React, { useCallback, useRef, useState } from "react";
import { FC, ReactNode, useContext } from "react";
import { UseScannerLog, UseScannerLogger } from "../src/lib/lib.types";

type GridContextType = {
  logs: UseScannerLog[];
  logger: UseScannerLogger;
  scanResult: string;
  onScan: (e: string) => void;
};
const GridContext = React.createContext<GridContextType | null>(null);
export type GridProviderProps = {
  children: ReactNode;
};
export const GridProvider: FC<GridProviderProps> = ({ children }) => {
  const [logs, setLog] = useState<GridContextType["logs"]>([]);
  const [scanResult, onScan] = useState<string>("");
  const shouldLogRef = useRef<boolean>(true);

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
    <GridContext.Provider value={{ logs, logger, scanResult, onScan }}>
      {children}
    </GridContext.Provider>
  );
};

export const useGridContext = (): GridContextType => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error(
      "'useGridContext()' must be used within a <GridProvider /> component"
    );
  }
  return context;
};
