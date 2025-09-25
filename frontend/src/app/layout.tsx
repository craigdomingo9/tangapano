import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/Sonner";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "TangaPano",
    template: "%s | TangaPano",
  },
  metadataBase: new URL("https://tangapano.co.zw"),
  description: "Secure your accommodation now!",
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
    <html lang="en">
      <meta name="apple-mobile-web-app-title" content="Tangapano" />
      <meta
        name="google-site-verification"
        content="CodVIAK6BTqMp4Ci0MV3ZuqoN2eP0TVjgkLUpEaq5zI"
      />
      <body suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
