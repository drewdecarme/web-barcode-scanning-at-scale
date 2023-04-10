import { FC, memo } from "react";
import { ScannerAnimation } from "./ScannerAnimation";
import { useScanner } from "../src/lib";
import { UseScannerLogger } from "../src/lib/lib.types";

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
      mask: {
        className: "scanner",
      },
      onScan,
    });

    return (
      <ScannerAnimation>
        <video ref={initScanner} />
      </ScannerAnimation>
    );
  });
