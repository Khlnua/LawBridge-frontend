"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; 
import { BriefcaseBusiness, Globe, Star, Users } from "lucide-react";


export default function UserSignUpPage() {

   const [number, setNumber] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const sendOtp = async () => {
    setError("");

    const fullPhone = `+976${number}`;

    if (!/^\d{8}$/.test(number)) {
      setError("8 оронтой утасны дугаар оруулна уу");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Алдаа гарлаа");
        setLoading(false);
        return;
      }

      router.push(`/sign-up/user/otp-form?phone=${encodeURIComponent(fullPhone)}`);
    } catch {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-gradient-to-br from-blue-50 to-white">
   <div className="hidden md:flex items-center justify-center relative bg-gradient-to-br from-blue-100 to-white">
        <div className="absolute inset-0 bg-white opacity-60 z-0" />

        <div className="relative z-10 text-center px-8 max-w-md space-y-6">
          <h2 className="text-2xl md:text-2xl font-bold leading-snug text-[#082688]">
            Танд хэрэгтэй шийдэл, бидэнд байгаа. Шуурхай, найдвартай хуульчтай холбогдоорой.
          </h2>
          <div className="w-80 h-80 mx-auto rounded-full">
            <img src="/lawyer-gif.gif" alt="" className="rounded-full" />
          </div>

          <ul className="text-sm md:text-base  space-y-2 text-left mx-auto max-w-xl">
            <li className="flex gap-2 items-center justify-start">
              <Globe size={20} className="text-[#1164c9]" />
              <p>Өөрт тохирсон мэргэжлийн өмгөөлөгчийг хялбархан хайж олох</p>
            </li>
            <li className="flex gap-2 items-center justify-startr">
              <BriefcaseBusiness size={20} className="text-[#382413]" />
              <p>	Хүссэн цагтаа зөвлөгөө авах</p>
            </li>
            <li className="flex gap-2 items-center justify-start">
              <Star size={25} className="text-[#f3e30d]" />
              <p>
               Үйлчилгээний үнэлгээ, туршлага дээр үндэслэн өмгөөлөгчөө сонгох
              </p>
            </li>
            <li className="flex gap-2 items-center justify-start">
              <Users size={20} className="text-[#26a53b]" />
              <p> Бүх мэдээлэл хамгаалагдсан, нууцлалтай систем</p>
            </li>
            <li className="flex gap-2 items-center justify-start">
             <Users size={20} className="text-[#26a53b]" />
              <p> Хамгийн сүүлийн үеийн эрх зүйн мэдээлэл, зөвлөмжүүдийг цаг алдалгүй авах</p>
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

            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Утасны дугаар оруулна уу</h1>
        <div className="flex mb-4">
          <span className="p-3 bg-gray-100 border border-r-0 rounded-l text-gray-600">+976</span>
          <input
            type="tel"
            placeholder="88112233"
            value={number}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, ""); 
              if (val.length <= 8) setNumber(val);
            }}
            className="w-full p-3 border border-l-0 rounded-r"
          />
        </div>
        {error && <p className="text-red-500 mb-4 ">{error}</p>}
        <Button onClick={sendOtp} disabled={loading}>
          {loading ? "Илгээж байна..." : "OTP илгээх"}
        </Button>
      </div>
        </div>
      </div>
    </div>
  );
}


