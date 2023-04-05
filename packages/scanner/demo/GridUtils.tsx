import { SetStateAction, forwardRef } from "react";

export type GridUtilsProps = JSX.IntrinsicElements["article"] & {
  setDisplay: React.Dispatch<
    SetStateAction<{ logs: boolean; canvas: boolean }>
  >;
};

export const GridUtils = forwardRef<HTMLElement, GridUtilsProps>(
  function GridUtils({ style, setDisplay, ...restProps }, ref) {
    return (
      <article
        {...restProps}
        ref={ref}
        style={{
          ...style,
          background: "#fff",
          gridArea: "debug-utils",
        }}
      >
        <header>Utils</header>
        <div className="utils">
          <div className="util-section">
            <div className="util-title">Display</div>
            <label>
              <input
                type="checkbox"
                defaultChecked
                onChange={() => {
                  setDisplay((prevState) => ({
                    ...prevState,
                    canvas: !prevState.canvas,
                  }));
                }}
              />
              &nbsp;Display canvas output
            </label>
            <label>
              <input
                type="checkbox"
                defaultChecked
                onChange={() =>
                  setDisplay((prevState) => ({
                    ...prevState,
                    logs: !prevState.logs,
                  }))
                }
              />
              &nbsp;Start / stop logs
            </label>
          </div>
        </div>
      </article>
    );
  }
);
