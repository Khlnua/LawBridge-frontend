import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ApolloWrapper } from "@/providers/ApolloWrapper";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { type Metadata } from "next";
import { Button } from "@/components";

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
        <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable}`}
        >
          <body
            className={`min-h-screen bg-background font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}
          >
            <SignedOut>
              <header
                className="
                flex
                justify-between
                items-center
                py-3 sm:py-4 md:py-5   
                px-4 sm:px-6 md:px-8 lg:px-10 
                h-auto               
                border-b border-gray-200 
              "
              >
                <div
                  className="
                    text-xl sm:text-2xl font-bold text-[#003366] 
                  "
                >
                  LawBridge
                </div>
                <div
                  className=" flex flex-row gap-2 sm:gap-4        
                  "
                >
                  <Button
                    asChild
                    className="
                      w-auto       
                      text-base sm:text-lg      
                      px-4 py-2 sm:px-6 sm:py-2.5  
                      bg-[#eee] hover:bg-gray-100 border border-transparent hover:border-gray-300 
                    "
                  >
                    <a
                      href="/sign-in"
                      className="text-muted-foreground hover:text-primary transition"
                    >
                      Log In
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="
                      w-auto        
                      text-base sm:text-lg     
                      px-4 py-2 sm:px-6 sm:py-2.5 
                      bg-[#003366] hover:bg-blue-700 text-white rounded-md transition 
                    "
                  >
                    <a href="/sign-up">Sign Up</a>
                  </Button>
                </div>
              </header>
            </SignedOut>

            <SignedIn>
              <header className="flex justify-between items-center px-6 h-16">
                <div className="text-lg font-bold text-blue-600">LawBridge</div>
                <UserButton afterSignOutUrl="/sign-in" />
              </header>
            </SignedIn>

            <main className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
              {children}
            </main>
          </body>
        </html>
      </ApolloWrapper>
    </ClerkProvider>
  );
}
