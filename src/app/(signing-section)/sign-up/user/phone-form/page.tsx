"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; 

export default function PhoneFormPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const sendOtp = async () => {
    setError("");
    if (!phone) {
      setError("Утасны дугаарыг оруулна уу");
      return;
    }
    setLoading(true);

    try {

      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Алдаа гарлаа");
        setLoading(false);
        return;
      }


      router.push(`/sign-up/user/otp-form?phone=${encodeURIComponent(phone)}`);
    } catch (e) {
      setError("Сервертэй холбогдож чадсангүй");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Утасны дугаар оруулна уу</h1>
        <input
          type="tel"
          placeholder="+97688112233"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Button onClick={sendOtp} disabled={loading}>
          {loading ? "Илгээж байна..." : "OTP илгээх"}
        </Button>
      </div>
    </div>
  );
}