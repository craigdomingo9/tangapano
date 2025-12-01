import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/react-query-providers";
import { ThemeProvider } from "@/providers/theme-provider";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

// 2. Configure the local font
const inter = localFont({
  src: "../fonts/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TangaPano",
  description: "Find your home away from home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalLoader />
            {children}
          </ThemeProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
