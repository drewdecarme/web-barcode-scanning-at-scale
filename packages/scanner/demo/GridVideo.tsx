import { forwardRef, useMemo } from "react";

export type GridVideoProps = JSX.IntrinsicElements["article"];

export const GridVideo = forwardRef<HTMLElement, GridVideoProps>(
  function GridVideos({ children, style, ...restProps }, ref) {
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
          <header>Video / Scanner</header>
          <div>{children}</div>
        </article>
      ),
      [children, ref, restProps, style]
    );
  }
);
