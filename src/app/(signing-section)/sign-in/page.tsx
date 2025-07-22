"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import OtpInput from "@/components/OtpInput";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("+976");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [method, setMethod] = useState<"phone" | "email" | null>(null);
  const { signIn, setActive } = useSignIn();

  const sendOtpOrStartSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (method === "phone") {
      const res = await fetch("/api/send-login-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setPending(true);
      } else {
        const data = await res.json();
        setError(data.message || "OTP илгээхэд алдаа гарлаа.");
      }
    }

    if (method === "email") {
      if (!signIn) {
        setError("SignIn функц ачаалагдаагүй байна.");
        return;
      }

      try {
        const result = await signIn.create({
          identifier: email,
          strategy: "email_code",
        });

        if (result.status === "needs_first_factor") {
          setPending(true);
        } else {
          setError("Алдаатай оролдлого. Та дахин оролдоно уу.");
        }
      } catch (err: any) {
        console.error("Email login error:", err);
        setError(err.errors?.[0]?.message || "Нэвтрэхэд алдаа гарлаа.");
      }
    }
  };

  const verifyOtpOrEmailCode = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (method === "phone") {
      const res = await fetch("/api/verify-login-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        if (!setActive) {
          setError("Системийн алдаа: setActive боломжгүй байна.");
          return;
        }

        try {
          await setActive({ session: data.sessionId });
          router.push("/");
        } catch (err) {
          console.error("setActive error:", err);
          setError("Нэвтрэхэд алдаа гарлаа.");
        }
      } else {
        setError(data.message || "OTP шалгахад алдаа гарлаа.");
      }
    }

    if (method === "email") {
      try {
        const result = await signIn?.attemptFirstFactor({
          strategy: "email_code",
          code: otp,
        });

        if (result?.status === "complete") {
          await setActive?.({ session: result.createdSessionId });
          router.push("/");
        } else {
          setError("Код буруу эсвэл хугацаа дууссан.");
        }
      } catch (err: any) {
        console.error("Code verification error:", err);
        setError(err.errors?.[0]?.message || "Код шалгахад алдаа гарлаа.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Card className="overflow-hidden p-0 border-[#dbeafe]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="bg-muted relative hidden md:block">
            <img
              src="/lawbridgeLOGO.png"
              alt="Lawbridge"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            {method === null && (
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-2xl font-bold">Нэвтрэх аргаа сонгоно уу</h1>
                <Button
                  onClick={() => {
                    setMethod("phone");
                    setPhone("+976");
                    setEmail("");
                    setError("");
                    setPending(false);
                    setOtp("");
                  }}
                  className="w-full bg-blue-600 text-white"
                >
                  Утасны дугаараар нэвтрэх
                </Button>
                <Button
                  onClick={() => {
                    setMethod("email");
                    setEmail("");
                    setPhone("+976");
                    setError("");
                    setPending(false);
                    setOtp("");
                  }}
                  className="w-full bg-gray-800 text-white"
                >
                  Имэйлээр нэвтрэх
                </Button>
              </div>
            )}

            {method !== null && (
              <form
                onSubmit={pending ? verifyOtpOrEmailCode : sendOtpOrStartSignIn}
                className="flex flex-col gap-6"
              >
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Тавтай морилно уу?</h1>
                  <p className="text-muted-foreground text-sm">
                    Login to your LawBridge account
                  </p>
                </div>

                {!pending ? (
                  <>
                    <Label>
                      {method === "phone" ? "Утасны дугаар" : "Имэйл хаяг"}
                    </Label>
                    <Input
                      placeholder={
                        method === "phone" ? "+976********" : "name@gmail.com"
                      }
                      value={method === "phone" ? phone : email}
                      onChange={(e) => {
                        if (method === "phone") {
                          let val = e.target.value;
                          if (!val.startsWith("+976")) {
                            val = "+976" + val.replace(/^\+?976/, "");
                          }
                          // Утасны дугаарын уртыг хязгаарлах (жишээ: +976 + 8 орон)
                          if (val.length > 12) val = val.slice(0, 12);
                          setPhone(val);
                        } else {
                          setEmail(e.target.value);
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-[#2563eb] text-white"
                    >
                      Үргэлжлүүлэх
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setMethod(null);
                        setPhone("+976");
                        setEmail("");
                        setError("");
                        setPending(false);
                        setOtp("");
                      }}
                    >
                      Буцах
                    </Button>
                  </>
                ) : (
                  <>
                    <Label>Баталгаажуулах код</Label>
                    <OtpInput onChange={setOtp} />
                    <Button type="submit">Нэвтрэх</Button>
                  </>
                )}

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <div className="text-sm text-center mt-4">
                  Шинэ хэрэглэгч үү?{" "}
                  <a href="/sign-up/user" className="underline text-blue-600">
                    Бүртгүүлэх
                  </a>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
