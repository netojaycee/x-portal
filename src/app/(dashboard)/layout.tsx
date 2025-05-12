import React from "react";
import DashboardView from "./components/view/DashboardView";

export default function DashboardLayout(props: {
  admin: React.ReactNode;
  superAdmin: React.ReactNode;
}) {
  const type = {
    admin: props.admin,
    superAdmin: props.superAdmin,
  };
  return <DashboardView type={type} />;
}
