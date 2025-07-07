"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import OtpInput from "@/components/OtpInput";
import { BriefcaseBusiness, Globe, Star, Users } from "lucide-react";

export default function OtpFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    setError("");

    if (otp.length !== 6) {
      setError("6 оронтой OTP-г оруулна уу");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "OTP шалгалт амжилтгүй боллоо");
      } else {
        router.push("/");
      }
    } catch (e) {
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
          <h2 className="text-2xl font-bold leading-snug text-[#082688]">
            Танд хэрэгтэй шийдэл, бидэнд байгаа. Шуурхай, найдвартай хуульчтай холбогдоорой.
          </h2>
          <div className="w-80 h-80 mx-auto rounded-full">
            <img src="/lawyer-gif.gif" alt="" className="rounded-full" />
          </div>
          <ul className="text-sm space-y-2 text-left mx-auto max-w-xl">
            <li className="flex gap-2 items-center">
              <Globe size={20} className="text-[#1164c9]" />
              <p>Өөрт тохирсон мэргэжлийн өмгөөлөгчийг хялбархан хайж олох</p>
            </li>
            <li className="flex gap-2 items-center">
              <BriefcaseBusiness size={20} className="text-[#382413]" />
              <p>Хүссэн цагтаа зөвлөгөө авах</p>
            </li>
            <li className="flex gap-2 items-center">
              <Star size={25} className="text-[#f3e30d]" />
              <p>Үйлчилгээний үнэлгээ, туршлага дээр үндэслэн өмгөөлөгчөө сонгох</p>
            </li>
            <li className="flex gap-2 items-center">
              <Users size={20} className="text-[#26a53b]" />
              <p>Нууцлалтай, хамгаалагдсан систем</p>
            </li>
            <li className="flex gap-2 items-center">
              <Users size={20} className="text-[#26a53b]" />
              <p>Хамгийн сүүлийн үеийн хууль зүйн мэдээлэл цаг алдалгүй авах</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl space-y-6">
          <h1 className="text-3xl font-bold text-center text-green-700">OTP баталгаажуулалт</h1>
          <p className="text-center text-gray-600">
            Утсанд ирсэн 6 оронтой кодыг оруулна уу:
            <br />
            <span className="font-medium text-black">{phone}</span>
          </p>

          <div className="flex justify-center">
            <OtpInput onChange={setOtp} />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <Button
            onClick={verifyOtp}
            disabled={loading || otp.length !== 6}
            className="w-full"
          >
            {loading ? "Баталгаажуулж байна..." : "OTP шалгах"}
          </Button>
        </div>
      </div>
    </div>
  );
}
