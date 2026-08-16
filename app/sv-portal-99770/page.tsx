import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";

export const metadata: Metadata = {
  description: "Secure Admin Content Management System for Shree Velora Event's.",
  robots: {
    follow: false,
    index: false
  },
  title: "Admin Portal | Shree Velora Event's"
};

/** Renders the secure admin dashboard page at /sv-portal-99770. */
export default function VeloraAdminPortalPage(): React.ReactElement {
  return <AdminDashboard />;
}
