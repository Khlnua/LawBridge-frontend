import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    console.log("API Route: Fetching email for userId:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if Clerk secret key is configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Clerk not configured" },
        { status: 500 }
      );
    }

    // Create Clerk client
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // Get user data from Clerk
    console.log("API Route: Calling clerkClient.users.getUser...");
    const user = await clerkClient.users.getUser(userId);
    console.log("API Route: User data received:", {
      id: user.id,
      emailAddresses: user.emailAddresses?.map((e) => e.emailAddress),
      firstName: user.firstName,
      lastName: user.lastName,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract email and other info
    const emailAddress = user.emailAddresses[0]?.emailAddress;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const profilePicture = user.imageUrl;

    if (!emailAddress) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: emailAddress,
      firstName,
      lastName,
      profilePicture,
    });
  } catch (error) {
    console.error("Error fetching user email:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
