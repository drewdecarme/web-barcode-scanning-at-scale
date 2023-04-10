import { forwardRef } from "react";

export type DashboardDebuggerProps = JSX.IntrinsicElements["article"];

export const DashboardDebugger = forwardRef<HTMLElement, DashboardDebuggerProps>(
  function DashboardDebuggers({ children, style, ...restProps }, ref) {
    return (
      <article
        {...restProps}
        ref={ref}
        style={{
          ...style,
          gridArea: "debug-canvas",
        }}
      >
        <header>
          <div>
            This is what we're <b>processing</b>
          </div>
        </header>
        <div>{children}</div>
      </article>
    );
  }
);
