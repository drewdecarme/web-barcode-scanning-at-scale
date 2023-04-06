import { MutableRefObject } from "react";

export type UseScannerLog = {
  ts: string;
  message: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE";
};
export type UseScannerLogger = (message: UseScannerLog) => void;

export type UseScannerParams = {
  debug?: {
    canvasRef?: MutableRefObject<HTMLCanvasElement | null>;
    enableLogging?: boolean;
  };
  video: {
    maxWidth: number;
  };
  mask?: {
    className?: string;
  };
  onScan: (result: string) => void;
};
