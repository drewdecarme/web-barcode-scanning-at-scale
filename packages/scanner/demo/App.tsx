import "./App.scss";
import { useScanner } from "../src/lib";
import { useMemo, useRef, useState } from "react";
import { GridLogs } from "./GridLog";
import { GridCanvas } from "./GridCanvas";
import { GridVideo } from "./GridVideo";
import { GridUtils } from "./GridUtils";
import { GridScan } from "./GridScan";
import { motion } from "framer-motion";

import "./scanner.css";

function App() {
  const debugCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [display, setDisplay] = useState<{ logs: boolean; canvas: boolean }>({
    logs: true,
    canvas: true,
  });
  const [result, setResult] = useState<string>("");

  const { initScanner, logs } = useScanner({
    debug: {
      canvasRef: display?.canvas ? debugCanvasRef : undefined,
      enableLogging: display?.logs,
    },
    video: {
      maxWidth: 300,
    },
    mask: {
      className: "scanner",
    },
    onScan: setResult,
  });

  return (
    <div className="app">
      <GridUtils setDisplay={setDisplay} />
      <GridVideo>
        <div
          style={{
            position: "relative",
          }}
        >
          {useMemo(
            () => (
              <motion.div
                className="scanner-animation"
                animate={{
                  scale: [0.8, 0.7, 0.8],
                  borderWidth: [6, 2, 6],
                  borderColor: ["#ffffff0", "#fff", "#ffffff0"],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            ),
            []
          )}
          <video ref={initScanner} />
        </div>
      </GridVideo>
      <GridCanvas>
        <canvas ref={debugCanvasRef} />
      </GridCanvas>
      <GridScan>{result}</GridScan>
      <GridLogs logs={logs} />
    </div>
  );
}

export default App;
