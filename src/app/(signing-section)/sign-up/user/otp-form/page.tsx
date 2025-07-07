"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OtpFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!phone) {
    return <p>Утасны дугаар олдсонгүй. Буцах уу?</p>;
  }

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

      console.log("res",res);
      

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "OTP шалгалт амжилтгүй боллоо");
        setLoading(false);
        return;
      }


      router.push("/sign-up/user/success");
    } catch (e) {
      setError("Сервертэй холбогдож чадсангүй");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">OTP баталгаажуулалт</h1>
        <p className="mb-4">Утсанд ирсэн 6 оронтой кодыг оруулна уу: {phone}</p>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full p-3 border rounded mb-4 text-center text-xl tracking-widest"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Button onClick={verifyOtp} disabled={loading}>
          {loading ? "Баталгаажуулж байна..." : "OTP шалгах"}
        </Button>
      </div>
    </div>
  );
}