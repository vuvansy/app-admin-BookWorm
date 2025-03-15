import AdminLayout from "@/components/admin-layout";
import { AppProvider } from "@/context/app.context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AppProvider>
  );
}
