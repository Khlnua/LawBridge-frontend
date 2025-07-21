import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestUserId = searchParams.get("userId");

    if (!requestUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Connect to your backend GraphQL server
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000/graphql";
    
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userId}`,
      },
      body: JSON.stringify({
        query: `
          query GetChatStats($userId: String!) {
            getChatStats(userId: $userId) {
              messageCount
              lastMessageTime
              sessionCount
              averageResponseTime
            }
          }
        `,
        variables: {
          userId: requestUserId
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const stats = data.data?.getChatStats || {
      messageCount: 0,
      lastMessageTime: null,
      sessionCount: 0,
      averageResponseTime: 0,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error("Chat stats API error:", error);
    
    // Return default stats if backend is not available
    return NextResponse.json({
      messageCount: 0,
      lastMessageTime: null,
      sessionCount: 0,
      averageResponseTime: 0,
    });
  }
} 