import { forwardRef } from "react";

export type GridCanvasProps = JSX.IntrinsicElements["article"];

export const GridCanvas = forwardRef<HTMLElement, GridCanvasProps>(function GridCanvass(
  { children, style, ...restProps },
  ref
) {
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
});
