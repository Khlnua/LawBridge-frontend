import { NextResponse } from "next/server";
import twilioClient from "@/lib/twilio";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function POST(req: Request) {
  const { phone, code, password } = await req.json();

  try {
    const result = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verificationChecks.create({
        to: phone,
        code,
      });

    if (result.status === "approved") {
      const user = await clerkClient.users.createUser({
        phoneNumber: phone,
        password,
      });

      return NextResponse.json({ success: true, userId: user.id });
    } else {
      return NextResponse.json({ success: false, error: "Код буруу байна." }, { status: 400 });
    }
  } catch (error) {
    console.error("OTP шалгах алдаа:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}