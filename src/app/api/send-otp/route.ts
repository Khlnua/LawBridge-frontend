import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ message: "Утасны дугаар заавал шаардлагатай" }, { status: 400 });
    }


    await client.verify.services(serviceSid).verifications.create({
      to: phone,
      channel: "sms",
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("send-otp error:", error);
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : "OTP илгээхэд алдаа гарлаа";
    return NextResponse.json({ message }, { status: 500 });
  }
}
