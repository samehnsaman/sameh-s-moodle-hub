// Wrapper that only renders the floating Data Source switch for logged-in
// admins. Public visitors never see it (and never even download the panel UI
// beyond this small gate).

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { DataSourceSwitch } from "./DataSourceSwitch";

export function AdminOnlyDataSourceSwitch() {
  const { loggedIn } = useAdminAuth();
  if (!loggedIn) return null;
  return <DataSourceSwitch />;
}
