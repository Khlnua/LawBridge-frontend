"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OtpForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("+976");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    const res = await fetch("/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });

    if (res.ok) {
      router.push(`/sign-up/verify?phone=${phone}&password=${password}`);
    } else {
      alert("OTP илгээхэд алдаа гарлаа.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-blue-700 text-center">
          Бүртгүүлэх
        </h1>

        <div className="space-y-4">
          <Input
            className="bg-blue-50 text-lg py-3"
            placeholder="Утасны дугаар (+97688112233)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            className="bg-blue-50 text-lg py-3"
            type="password"
            placeholder="Нууц үг"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
          >
            Үргэлжлүүлэх
          </Button>
        </div>
      </div>
    </div>
  );
}

