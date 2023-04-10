import { forwardRef, useMemo } from "react";
import { Scanner } from "./Scanner";
import { useGridContext } from "./Grid.context";

export type GridScannerProps = JSX.IntrinsicElements["article"];

export const GridScanner = forwardRef<HTMLElement, GridScannerProps>(
  function GridScanners({ style, ...restProps }, ref) {
    const { onScan, logger } = useGridContext();

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
