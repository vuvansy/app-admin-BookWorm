import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from '@/lib/antd.registry';
import "./globals.css"
import { App } from "antd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookWorm",
  description: "Nhà sách BookWorm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <App>
            {children}
          </App>
        </StyledComponentsRegistry>
      </body>
    </html >
  );
}
