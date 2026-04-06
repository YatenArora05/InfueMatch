import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
