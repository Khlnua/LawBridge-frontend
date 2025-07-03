"use client";

import { SignUp } from "@clerk/nextjs";

export default function UserSignUpPage() {
  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-gradient-to-br from-blue-50 to-white">
      <div className="hidden md:flex items-center justify-center relative bg-black/80">
        <div className="absolute inset-0 bg-black opacity-60 z-0" />

        <div className="relative z-10 text-white text-center px-8 max-w-md space-y-6">
          <img
            src="/lawbridgeLOGO.png"
            alt="LawBridge Logo"
            className="h-10 mx-auto"
          />

          <h2 className="text-2xl md:text-3xl font-bold leading-snug">
            Хуульчтай холбогдоход
            <br /> хэзээ ч ийм амар байгаагүй.
          </h2>

          <div className="w-48 h-48 mx-auto"></div>

          <ul className="text-sm md:text-base text-white/90 space-y-2 text-left mx-auto max-w-xs">
            <li>✅ Найдвартай өмгөөлөгч олох</li>
            <li>✅ Цахимаар цаг товлох</li>
            <li>✅ Баримт бичиг хуваалцах</li>
            <li>✅ Шуурхай зөвлөгөө авах</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
              Бүртгэл үүсгэх
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Та өөрийн LawBridge бүртгэлийг доорх маягтаар үүсгэнэ үү.
            </p>
          </div>

          <SignUp
            path="/sign-up/user"
            routing="path"
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-white transition duration-200",
                card: "shadow-xl border border-blue-100 rounded-2xl",
                headerTitle: "text-xl font-semibold text-blue-700",
                headerSubtitle: "text-sm text-gray-500",
                formFieldLabel: "text-sm font-medium text-gray-700",
                formFieldInput:
                  "border rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500",
              },
              variables: {
                colorPrimary: "#2563eb",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
