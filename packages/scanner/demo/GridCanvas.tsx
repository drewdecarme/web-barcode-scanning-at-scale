import { forwardRef } from "react";

export type GridCanvasProps = JSX.IntrinsicElements["article"];

export const GridCanvas = forwardRef<HTMLElement, GridCanvasProps>(
  function GridCanvass({ children, style, ...restProps }, ref) {
    return (
      <article
        {...restProps}
        ref={ref}
        style={{
          ...style,
          gridArea: "debug-canvas",
        }}
      >
        <header>Canvas</header>
        <div>{children}</div>
      </article>
    );
  }
);
