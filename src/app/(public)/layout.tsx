
import AdminLayout from "@/components/admin-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
          <AdminLayout>
            {children}
          </AdminLayout>
    
  );
}
