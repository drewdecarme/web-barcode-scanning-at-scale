/* eslint-disable @typescript-eslint/ban-ts-comment */
import { forwardRef, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useState } from "react";
import { useGridContext } from "./Grid.context";

export type GridLogProps = JSX.IntrinsicElements["article"];

export const GridLogs = forwardRef<HTMLElement, GridLogProps>(function GridLogs(
  { style, ...restProps },
  ref
) {
  const [shouldTail, setShouldTail] = useState(true);
  const { logs } = useGridContext();

  const rowVirtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
  });

  // Sticky headers
  const parentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (logs.length === 0 || !shouldTail) return;
    rowVirtualizer.scrollToIndex(logs.length - 1);
  });

  return (
    <article
      {...restProps}
      ref={ref}
      style={{
        ...style,
        gridArea: "debug-output",
      }}
    >
      <header>
        Output
        <label>
          <input
            type="checkbox"
            defaultChecked={shouldTail}
            onChange={(e) => setShouldTail(e.currentTarget.checked)}
          />
          &nbsp; Tail
        </label>
      </header>
      <div className="logger">
        <div className="parent" ref={parentRef}>
          {/* The large inner element to hold all of the items */}
          <ul
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {/* Only the visible items in the virtualizer, manually positioned to be in view */}
            {rowVirtualizer.getVirtualItems().map((virtualItem) => (
              <li
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <pre>
                  {/* @ts-ignore */}
                  {logs[virtualItem.index]?.ts} - {logs[virtualItem.index].level} -{" "}
                  {logs[virtualItem.index].message}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
});
