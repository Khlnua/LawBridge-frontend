"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ApolloWrapper } from "@/providers/ApolloWrapper";
import Header from "@/components/header/Header";
import { SocketProvider } from "@/context/SocketContext";
import { AuthRedirectGuard } from "@/components";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideHeader =
    pathname.startsWith("/chat") || pathname.startsWith("/admin");
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className={`min-h-screen bg-background font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}
      >
        <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
          <ApolloWrapper>
            {!hideHeader && <Header />}
            <SocketProvider>
              <Toaster richColors position="top-right" />

              <main className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <AuthRedirectGuard />
                {children}
              </main>
            </SocketProvider>
          </ApolloWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
