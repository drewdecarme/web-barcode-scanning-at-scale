import { forwardRef, useMemo } from "react";
import { useDashboardContext } from "./Dashboard.context";

export type DashboardResultProps = JSX.IntrinsicElements["article"];

export const DashboardResult = forwardRef<HTMLElement, DashboardResultProps>(
  function DashboardResult({ style, ...restProps }, ref) {
    const { scanResult } = useDashboardContext();
    return useMemo(
      () => (
        <article
          {...restProps}
          ref={ref}
          style={{
            ...style,
            gridArea: "debug-result",
          }}
        >
          <header>Scan Result</header>
          <div
            style={{
              padding: "1rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                overflow: "auto",
                fontWeight: "500",
                fontSize: "1.25rem",
                whiteSpace: "nowrap",
              }}
            >
              {scanResult || "No Result"}
            </div>
          </div>
        </article>
      ),
      [ref, restProps, scanResult, style]
    );
  }
);
