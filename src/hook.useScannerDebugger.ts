import { useRef, useCallback } from "react";
import { UseScannerLogger, UseScannerParams } from "./hook.useScanner.types";

export const useScannerDebugger = (debug: UseScannerParams["debug"]) => {
  const canvasDebugRef = useRef<HTMLCanvasElement | null>(null);
  const log = useCallback<UseScannerLogger>(
    (params) => {
      if (!debug?.logger) return;
      debug.logger(params);
    },
    [debug]
  );

  const getCanvasDebugNode = () => {
    if (!canvasDebugRef.current && debug?.id) {
      canvasDebugRef.current = document.getElementById(debug.id) as HTMLCanvasElement;
    }
    if (!canvasDebugRef.current && !debug?.id) {
      canvasDebugRef.current = document.createElement("canvas");
    }
    return canvasDebugRef.current;
  };

  return { log, getCanvasDebugNode };
};
