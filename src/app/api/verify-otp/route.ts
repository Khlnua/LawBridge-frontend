import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { clerkClient } from "@clerk/nextjs/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { message: "Утасны дугаар болон OTP шаардлагатай" },
        { status: 400 }
      );
    }

    const verificationCheck = await client.verify
      .services(serviceSid)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    if (verificationCheck.status !== "approved") {
      return NextResponse.json({ message: "OTP буруу байна" }, { status: 400 });
    }


    const user = await clerkClient.users.createUser({
      primaryPhoneNumber: phone,
      password: Math.random().toString(36).slice(-8),
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: any) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { message: error.message || "OTP шалгалт алдаа гарлаа" },
      { status: 500 }
    );
  }
}