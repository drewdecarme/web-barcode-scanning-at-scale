import { forwardRef, useMemo } from "react";
import { useDashboardContext } from "./Dashboard.context";

export type DashboardUtilsProps = JSX.IntrinsicElements["article"];

export const DashboardUtils = forwardRef<HTMLElement, DashboardUtilsProps>(
  function DashboardUtils({ style, ...restProps }, ref) {
    const { toggleLog } = useDashboardContext();

    return useMemo(
      () => (
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
              {/* <label>
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
            </label> */}
              <label>
                <input type="checkbox" defaultChecked onChange={toggleLog} />
                &nbsp;Start / stop logs
              </label>
            </div>
          </div>
        </article>
      ),
      [ref, restProps, style, toggleLog]
    );
  }
);
