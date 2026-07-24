import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Panel | Shree Velora Event's",
  description: "Admin content control panel for Shree Velora Event's platform."
};

/** Renders the admin dashboard page. */
export default function AdminPage(): React.ReactElement {
  return <AdminDashboard />;
}
