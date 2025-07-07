"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; 

export default function PhoneFormPage() {
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
    } catch (e) {
      setError("Сервертэй холбогдож чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Утасны дугаар оруулна уу</h1>
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
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Button onClick={sendOtp} disabled={loading}>
          {loading ? "Илгээж байна..." : "OTP илгээх"}
        </Button>
      </div>
    </div>
  );
}
