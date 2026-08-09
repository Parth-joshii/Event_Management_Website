import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Panel | Shree Velora Event's",
  description: "Secure Admin Content Management System for Shree Velora Event's."
};

/** Renders the secure admin dashboard page at /velora-admin. */
export default function VeloraAdminPage(): React.ReactElement {
  return <AdminDashboard />;
}
