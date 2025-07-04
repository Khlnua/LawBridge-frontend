import { NextResponse } from "next/server";
import twilioClient from "@/lib/twilio";

export async function POST(req: Request) {
  const { phone } = await req.json();

  try {
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP илгээх алдаа:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}