import { forwardRef, useMemo } from "react";
import { Scanner } from "./Scanner";
import { useDashboardContext } from "./Dashboard.context";

export type DashboardScannerProps = JSX.IntrinsicElements["article"];

export const DashboardScanner = forwardRef<HTMLElement, DashboardScannerProps>(
  function DashboardScanners({ style, ...restProps }, ref) {
    const { onScan, logger } = useDashboardContext();

    return useMemo(
      () => (
        <article
          {...restProps}
          ref={ref}
          style={{
            ...style,
            gridArea: "debug-scanner",
          }}
        >
          <header>
            <div>
              This is what we're <b>scanning</b>
            </div>
          </header>
          <div>
            <Scanner onScan={onScan} logger={logger} />
          </div>
        </article>
      ),
      [logger, onScan, ref, restProps, style]
    );
  }
);
