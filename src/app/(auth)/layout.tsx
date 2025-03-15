import { AppProvider } from "@/context/app.context";
import { App } from "antd";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container">
      <AppProvider>
        {children}
      </AppProvider>
    </main>
  );
}
