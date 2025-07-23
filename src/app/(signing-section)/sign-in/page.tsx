"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import OtpInput from "@/components/OtpInput";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { signIn, setActive } = useSignIn();

  const isPhone = phoneOrEmail.startsWith("+976");

  const sendOtpOrStartSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (isPhone) {
      
      const res = await fetch("/api/send-login-otp", {
        method: "POST",
        body: JSON.stringify({ phone: phoneOrEmail }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setPending(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "OTP илгээхэд алдаа гарлаа.");
      }
    } else {
      
      if (!signIn) {
        setErrorMsg("SignIn функц ачаалагдаагүй байна.");
        return;
      }

      try {
        const result = await signIn.create({
          identifier: phoneOrEmail,
          strategy: "email_code",
        });

        if (result.status === "needs_first_factor") {
          setPending(true);
        } else {
          setErrorMsg("Нэвтрэхэд алдаа гарлаа.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Email login error:", err.message);
          setErrorMsg("Email login error: " + err.message);
        } else {
          setErrorMsg("Email login error");
        }
      }
    }
  };

  const verifyOtpOrEmailCode = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (isPhone) {
      // Утасны OTP шалгах
      const res = await fetch("/api/verify-login-otp", {
        method: "POST",
        body: JSON.stringify({ phone: phoneOrEmail, otp }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        if (!setActive) {
          setErrorMsg("Системийн алдаа: setActive боломжгүй байна.");
          return;
        }

        try {
          await setActive({ session: data.sessionId });
          router.push("/");
        } catch (err) {
          console.error("setActive error:", err);
          setErrorMsg("Нэвтрэхэд алдаа гарлаа.");
        }
      } else {
        setErrorMsg(data.message || "OTP шалгахад алдаа гарлаа.");
      }
    } else {
      
      if (!signIn) {
        setErrorMsg("SignIn функц ачаалагдаагүй байна.");
        return;
      }

      try {
        const result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code: otp,
        });

        if (result.status === "complete") {
          await setActive?.({ session: result.createdSessionId });
          router.push("/");
        } else {
          setErrorMsg("Код шалгахад алдаа гарлаа.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Code verification error:", err.message);
          setErrorMsg("Код шалгахад алдаа гарлаа: " + err.message);
        } else {
          setErrorMsg("Код шалгахад алдаа гарлаа.");
        }
      }
    }
  };

  return (
<div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
  <Card className="overflow-hidden p-0 border-[#dbeafe]">
    <div style={{ position: "relative", width: "100%", height: "200px" }}>
      <Image
        src="/lawbridgeLOGO.png"
        alt="Lawbridge"
        fill
        className="absolute inset-0 object-cover"
        sizes="100vw"
        priority
      />
    </div>
    <div className="p-6 md:p-8 flex flex-col justify-center">
      <form onSubmit={pending ? verifyOtpOrEmailCode : sendOtpOrStartSignIn} className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Тавтай морилно уу?</h1>
          <p className="text-muted-foreground text-sm">
            Login to your LawBridge account
          </p>
        </div>

        {!pending ? (
          <>
            <Label>Утас эсвэл И-мэйл</Label>
            <Input
              placeholder="+976******** эсвэл name@gmail.com"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
            />
            <Button type="submit"
              className="w-full bg-[#2563eb] text-white">Үргэлжлүүлэх</Button>
          </>
        ) : (
          <>
            <Label>Баталгаажуулах код</Label>
            <OtpInput onChange={setOtp} />
            <Button type="submit">Нэвтрэх</Button>
          </>
        )}
        <Link href="/sign-up/user" className="underline text-blue-600">
          Бүртгүүлэх
        </Link>
        <div className="text-sm text-center mt-4">
          Шинэ хэрэглэгч үү?{" "}
          <Link href="/sign-up/user" className="underline text-blue-600">
            Бүртгүүлэх
          </Link>
        </div>
      </form>
      {errorMsg && (
        <div className="text-red-600 text-sm text-center mt-2">{errorMsg}</div>
      )}
    </div>
  </Card>
</div>)
}