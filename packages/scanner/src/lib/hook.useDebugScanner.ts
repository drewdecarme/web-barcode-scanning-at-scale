import { useRef, useCallback, useEffect, useState } from "react";
import { UseScannerParams, UseScannerLog } from "./lib.types";

/**
 * A hook that removes some of the non-essential debugging
 * functionality out of the main `useScanner` hook to better
 * focus the readability of the `useScanner` hook.
 */
export const useScannerDebug = (debug: UseScannerParams["debug"]) => {
  const [logs, setLog] = useState<UseScannerLog[]>([]);
  const shouldLogRef = useRef<boolean>(debug?.enableLogging ?? false);
  const canvasDebugRef = useRef<HTMLCanvasElement | null>(debug?.canvasRef?.current ?? null);

  /**
   * This is a memoized utility to log messages or add message
   * entries to the log state declared at the top of the hook.
   * Since this can be called in event handlers, we need to use
   * mutable references to prevent their execution if a one of the
   * `debug.enableLogging` is changed to true.
   */
  const logMessage = useCallback<(params: Omit<UseScannerLog, "ts">) => void>((message) => {
    if (!shouldLogRef.current) return;
    setLog((prevLogs) => [
      ...prevLogs,
      {
        ...message,
        ts: new Date().toISOString(),
      },
    ]);
  }, []);

  /**
   * When any of the debugging parameters change, we update
   * some of the refs to either enable or prevent code execution
   * in the video listeners
   */
  useEffect(() => {
    // enable or disable logging
    shouldLogRef.current = debug?.enableLogging ?? false;
    logMessage({
      level: "INFO",
      message: `Logging ${shouldLogRef.current ? "enabled" : "disabled"}`,
    });

    // enable or disable canvas debugging
    canvasDebugRef.current = debug?.canvasRef?.current ?? null;
    logMessage({
      level: "INFO",
      message: `Canvas Debugging ${canvasDebugRef.current ? "enabled" : "disabled"}`,
    });
  }, [logMessage, debug?.canvasRef, debug?.enableLogging]);

  return {
    logs,
    logMessage,
    canvasDebugRef,
  };
};
