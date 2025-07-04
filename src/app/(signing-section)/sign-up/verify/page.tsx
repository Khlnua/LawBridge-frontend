"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; 

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const phone = searchParams.get("phone");
  const password = searchParams.get("password");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!phone || !password) {
      toast.error("Хэрэглэгчийн мэдээлэл дутуу байна.");
      router.push("/sign-up/user");
    }
  }, [phone, password, router]);

  const handleVerify = async () => {
    if (!otp) return toast.error("OTP кодоо оруулна уу");

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Баталгаажуулалт амжилттай!");
       
        router.push(`/sign-up/complete?phone=${phone}&password=${password}`);
      } else {
        toast.error(data.message || "OTP буруу байна.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Сүлжээний алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">OTP Баталгаажуулалт</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Утасны дугаар: <strong>{phone}</strong>
      </p>

      <Input
        placeholder="6 оронтой OTP код"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
      />

      <Button className="mt-4 w-full" onClick={handleVerify} disabled={loading}>
        {loading ? "Шалгаж байна..." : "Баталгаажуулах"}
      </Button>
    </div>
  );
}