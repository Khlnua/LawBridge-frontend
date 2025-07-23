import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;
const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ message: "Утасны дугаар шаардлагатай" }, { status: 400 });
  }

  try {
    await client.verify.services(serviceSid).verifications.create({
      to: phone,
      channel: "sms",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP илгээхэд алдаа гарлаа:", error);
    return NextResponse.json({ message: "OTP илгээхэд алдаа гарлаа" }, { status: 500 });
  }
}