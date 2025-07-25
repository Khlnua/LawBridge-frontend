"use client";

import { SignUp } from "@clerk/nextjs";
import { BriefcaseBusiness, Globe, Star, Users } from "lucide-react";

export default function UserSignUpPage() {
  return (
    <div className="min-h-screen w-full grid md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center relative bg-gradient-to-br from-blue-100 to-white">
        <div className="absolute inset-0 bg-white opacity-60 z-0" />

        <div className="relative z-10 text-center px-8 max-w-md space-y-6">
          <h2 className="text-2xl md:text-2xl font-bold leading-snug text-[#082688]">
            Танд хэрэгтэй шийдэл, бидэнд байгаа. Шуурхай, найдвартай хуульчтай
            холбогдоорой.
          </h2>
          <div className="w-80 h-80 mx-auto rounded-full">
            <img src="/lawyer-gif.gif" alt="" className="rounded-full" />
          </div>

          <ul className="text-sm md:text-base space-y-2 text-left mx-auto max-w-xl">
            <li className="flex gap-2 items-center justify-start">
              <Globe size={20} className="text-[#1164c9]" />
              <p>Өөрт тохирсон мэргэжлийн өмгөөлөгчийг хялбархан хайж олох</p>
            </li>
            <li className="flex gap-2 items-center justify-start">
              <BriefcaseBusiness size={20} className="text-[#382413]" />
              <p>Хүссэн цагтаа зөвлөгөө авах</p>
            </li>
            <li className="flex gap-2 items-center justify-start">
              <Star size={25} className="text-[#f3e30d]" />
              <p>
                Үйлчилгээний үнэлгээ, туршлага дээр үндэслэн өмгөөлөгчөө сонгох
              </p>
            </li>
            <li className="flex gap-2 items-center justify-start">
              <Users size={20} className="text-[#26a53b]" />
              <p>Бүх мэдээлэл хамгаалагдсан, нууцлалтай систем</p>
            </li>
            <li className="flex gap-2 items-center justify-start">
              <Users size={20} className="text-[#26a53b]" />
              <p>
                Хамгийн сүүлийн үеийн эрх зүйн мэдээлэл, зөвлөмжүүдийг цаг
                алдалгүй авах
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">
              Хэрэглэгчээр бүртгүүлэх
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Та өөрийн хэрэглэгчийн бүртгэлийг доорх маягтаар үүсгэнэ үү.
            </p>
          </div>

          <SignUp
            path="/sign-up/user"
            routing="path"
            signInUrl="/sign-in"
            afterSignUpUrl="/sign-up/role"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-green-600 hover:bg-green-700 text-white transition duration-200",
                card: "shadow-xl border border-green-100 rounded-2xl",
                headerTitle: "text-xl font-semibold text-green-700",
                headerSubtitle: "text-sm text-gray-500",
                formFieldLabel: "text-sm font-medium text-gray-700",
                formFieldInput:
                  "border rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500",
              },
              variables: {
                colorPrimary: "#16a34a",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
