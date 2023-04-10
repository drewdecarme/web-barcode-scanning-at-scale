import "./App.scss";
import { GridLogs } from "./GridLog";
import { GridCanvas } from "./GridCanvas";
import { GridScanner } from "./GridScanner";
import { GridUtils } from "./GridUtils";
import { GridResult } from "./GridResult";

import "./scanner.css";
import { GridProvider } from "./Grid.context";

function App() {
  return (
    <div className="app">
      <GridProvider>
        <GridUtils />
        <GridScanner />
        <GridCanvas>
          <canvas id="debug" />
        </GridCanvas>
        <GridResult />
        <GridLogs />
      </GridProvider>
    </div>
  );
}

export default App;
