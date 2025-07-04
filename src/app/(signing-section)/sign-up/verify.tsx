"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import OtpInput from "@/components/OtpInput";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone");
  const password = params.get("password");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setLoading(true);
    const res = await fetch("/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code, password }),
    });

    if (res.ok) {
      router.push("/sign-up/user/complete");
    } else {
      alert("OTP код буруу байна.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-lg font-bold">OTP код оруулна уу</h2>
      <OtpInput onChange={setCode} />
      <Button onClick={verify}>Баталгаажуулах</Button>
    </div>
  );
}