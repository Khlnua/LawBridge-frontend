"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const navLinks = [
  { label: "Find Lawyers", href: "/find-lawyers" },
  { label: "Legal Articles", href: "/legal-articles" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#003366]">
          LawBridge
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex gap-6 items-center">
          <SignedOut>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#003366]"
                asChild
              >
                <Link href="/sign-in">Log In</Link>
              </Button>
              <Button size="sm" className="bg-[#003366] text-cyan-50" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
        </div>

        <button className="md:hidden text-gray-600">
          {isOpen ? (
            <X className="w-6 h-6" onClick={() => setIsOpen(!isOpen)} />
          ) : (
            <div className="flex gap-2 justify-center items-center">
              <SignedIn>
                <div className="flex justify-end">
                  <UserButton afterSignOutUrl="/sign-in" />
                </div>
              </SignedIn>
              <Menu className="w-6 h-6" onClick={() => setIsOpen(!isOpen)} />
            </div>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <SignedOut>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border border-[#003366] text-[#003366]"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/sign-in">Log In</Link>
              </Button>
              <Button
                size="sm"
                className="w-full bg-[#003366] text-cyan-50"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>
        </div>
      )}
    </header>
  );
}
