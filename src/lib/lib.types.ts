export type UseScannerLog = {
  message: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE";
};
export type UseScannerLogger = (message: UseScannerLog) => void;

export type UseScannerParams = {
  debug?: {
    id?: string;
    logger?: UseScannerLogger;
  };
  video: {
    maxWidth: number;
  };
  onScan: (result: string) => void;
};
