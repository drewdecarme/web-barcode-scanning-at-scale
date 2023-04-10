import "./App.scss";
import { DashboardLogs } from "./DashboardLog";
import { DashboardDebugger } from "./DashboardDebugger";
import { DashboardScanner } from "./DashboardScanner";
import { DashboardUtils } from "./DashboardUtils";
import { DashboardResult } from "./DashboardResult";

import "./scanner.css";
import { Dashboard } from "./Dashboard";

function App() {
  return (
    <Dashboard>
      <DashboardUtils />
      <DashboardScanner />
      <DashboardDebugger>
        <canvas id="debug" />
      </DashboardDebugger>
      <DashboardResult />
      <DashboardLogs />
    </Dashboard>
  );
}

export default App;
