import "./App.scss";
import { useScanner } from "../src/lib";
import { useRef, useState } from "react";
import { GridLogs } from "./GridLog";
import { GridCanvas } from "./GridCanvas";
import { GridVideo } from "./GridVideo";
import { GridUtils } from "./GridUtils";

function App() {
  const debugCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [display, setDisplay] = useState<{ logs: boolean; canvas: boolean }>({
    logs: true,
    canvas: true,
  });

  const { setVideoRef, logs } = useScanner({
    debug: {
      canvasRef: display?.canvas ? debugCanvasRef : undefined,
      enableLogging: display?.logs,
    },
    video: {
      maxWidth: 300,
    },
  });

  return (
    <div className="app">
      <GridUtils setDisplay={setDisplay} />
      <GridVideo>
        <video ref={setVideoRef} />
      </GridVideo>
      <GridCanvas>
        <canvas ref={debugCanvasRef}></canvas>
      </GridCanvas>
      <GridLogs logs={logs} />
    </div>
  );
}

export default App;
