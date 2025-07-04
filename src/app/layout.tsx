import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ApolloWrapper } from "@/providers/ApolloWrapper";
import { type Metadata } from "next";
import Header from "@/components/header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LawBridge",
  description: "LawBridge - Next.js with Clerk & Apollo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
      <ApolloWrapper>
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
          <body
            className={`min-h-screen bg-background font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}
          >
            <Header />

            <main className="flex justify-center items-center min-h-[calc(100vh-4rem)]">{children}</main>
          </body>
        </html>
      </ApolloWrapper>
    </ClerkProvider>
  );
}
