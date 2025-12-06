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
  metadataBase: new URL("https://tangapano.co.zw"),
  generator: "Next.js",
  applicationName: "TangaPano",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Accommodation",
    "University",
    "Hostel",
    "Booking",
    "Boarding Rooms",
  ],
  authors: [
    { name: "Craig" },
    { name: "Domingo", url: "https://github.com/craigdomingo9" },
  ],
  creator: "Craig Domingo",
  publisher: "Craig Domingo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google",
  },
  category: "technology",
  manifest: "https://tangapano.co.zw/manifest.json",
  icons: {
    icon: "/web-app-manifest-512x512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="apple-mobile-web-app-title" content="Tangapano" />
      <meta
        name="google-site-verification"
        content="CodVIAK6BTqMp4Ci0MV3ZuqoN2eP0TVjgkLUpEaq5zI"
      />
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
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
