import { forwardRef, useMemo } from "react";

export type GridScanProps = JSX.IntrinsicElements["article"];

export const GridScan = forwardRef<HTMLElement, GridScanProps>(
  function GridScan({ children, style, ...restProps }, ref) {
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
              {children || "No Result"}
            </div>
          </div>
        </article>
      ),
      [children, ref, restProps, style]
    );
  }
);
