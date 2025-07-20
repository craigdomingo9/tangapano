import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/HomePage/Header";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/Sonner";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "TangaPano",
  description: "Secure your accommodation now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
