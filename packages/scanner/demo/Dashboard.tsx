import { FC, PropsWithChildren } from "react";
import { DashboardProvider } from "./Dashboard.context";

export const Dashboard: FC<PropsWithChildren> = ({ children }) => {
  return (
    <DashboardProvider>
      <div className="app">{children}</div>
    </DashboardProvider>
  );
};
