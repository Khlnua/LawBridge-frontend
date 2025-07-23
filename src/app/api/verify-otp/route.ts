import { createClerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;
const clerkSecretKey = process.env.CLERK_SECRET_KEY!;

const client = twilio(accountSid, authToken);
const clerkClient = createClerkClient({ secretKey: clerkSecretKey });

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
      .verificationChecks.create({ to: phone, code: otp });

    if (verificationCheck.status !== "approved") {
      return NextResponse.json({ message: "OTP буруу байна" }, { status: 400 });
    }

    const existingUserResponse = await clerkClient.users.getUserList({
      emailAddress: [`${phone}@gmail.com`],
    });
    let user;

    if (existingUserResponse.data.length === 0) {
      user = await clerkClient.users.createUser({
        emailAddress: [`${phone}@gmail.com`],
        password: Math.random().toString(36).slice(-8),
      });
    } else {
      user = existingUserResponse.data[0];
    }

    const session = await clerkClient.sessions.createSession({ userId: user.id });

    // ✅ Session cookie-г тавих
    const response = NextResponse.json({
      success: true,
      userId: user.id,
    });

    response.cookies.set("__session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("OTP verification error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "OTP шалгалт амжилтгүй";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}