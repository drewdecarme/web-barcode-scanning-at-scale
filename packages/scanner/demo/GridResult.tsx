import { forwardRef, useMemo } from "react";
import { useGridContext } from "./Grid.context";

export type GridResultProps = JSX.IntrinsicElements["article"];

export const GridResult = forwardRef<HTMLElement, GridResultProps>(function GridResult(
  { style, ...restProps },
  ref
) {
  const { scanResult } = useGridContext();
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
});
