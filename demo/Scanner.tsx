import { FC, memo } from "react";
import { ScannerAnimation } from "./ScannerAnimation";
import { useScanner, type UseScannerLogger } from "../src";

export const Scanner: FC<{ onScan: (e: string) => void; logger?: UseScannerLogger }> =
  memo(function Scanner({ onScan, logger }) {
    const initScanner = useScanner({
      debug: {
        id: "debug",
        logger,
      },
      video: {
        maxWidth: 300,
      },
      onScan,
    });

    return (
      <ScannerAnimation>
        <video ref={initScanner} />
      </ScannerAnimation>
    );
  });
