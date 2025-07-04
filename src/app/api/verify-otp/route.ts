import { NextResponse } from "next/server";
import twilioClient from "@/lib/twilio";

export async function POST(req: Request) {
  const { phone, otp } = await req.json();

  const sanitizedPhone = phone.startsWith("+") ? phone : `+${phone.trim()}`;

  try {
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: sanitizedPhone,
        code: otp,
      });

    if (verification.status === "approved") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "OTP буруу байна" }, { status: 400 });
    }
  } catch (error) {
    console.error("OTP шалгах үед алдаа:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}