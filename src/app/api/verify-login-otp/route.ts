import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;
const clerkSecretKey = process.env.CLERK_SECRET_KEY!;

const twilioClient = twilio(accountSid, authToken);
const clerk = createClerkClient({ secretKey: clerkSecretKey });

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { message: "Утасны дугаар болон OTP шаардлагатай" },
        { status: 400 }
      );
    }

   
    const verificationCheck = await twilioClient.verify
      .services(serviceSid)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    if (verificationCheck.status !== "approved") {
      return NextResponse.json({ message: "OTP буруу байна" }, { status: 400 });
    }

   
    const email = `${phone}@gmail.com`;
    const result = await clerk.users.getUserList({ emailAddress: [email] });

    if (result.data.length === 0) {
      return NextResponse.json({ message: "Хэрэглэгч олдсонгүй" }, { status: 404 });
    }

    const user = result.data[0];

    
    const session = await clerk.sessions.createSession({
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      userId: user.id,
    });
  } catch (error: any) {
    console.error("OTP login error:", error);
    return NextResponse.json(
      { message: error.message || "Системийн алдаа гарлаа" },
      { status: 500 }
    );
  }
}