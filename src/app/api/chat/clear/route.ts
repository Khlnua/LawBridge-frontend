// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = await auth();
    
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { userId: requestUserId } = await req.json();

//     if (!requestUserId) {
//       return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//     }

//     // Connect to your backend GraphQL server
//     const backendUrl = process.env.BACKEND_URL || "http://localhost:4000/graphql";
    
//     const response = await fetch(backendUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${userId}`,
//       },
//       body: JSON.stringify({
//         query: `
//           mutation ClearChatHistory($userId: String!) {
//             clearChatHistory(userId: $userId) {
//               success
//               message
//               clearedCount
//             }
//           }
//         `,
//         variables: {
//           userId: requestUserId
//         }
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.errors?.[0]?.message || `HTTP ${response.status}`);
//     }

//     const data = await response.json();
    
//     if (data.errors) {
//       throw new Error(data.errors[0].message);
//     }

//     const result = data.data?.clearChatHistory;
    
//     if (!result?.success) {
//       throw new Error(result?.message || "Failed to clear chat history");
//     }

//     return NextResponse.json({
//       success: true,
//       message: result.message || "Chat history cleared successfully",
//       clearedCount: result.clearedCount || 0,
//     });

//   } catch (error) {
//     console.error("Clear chat API error:", error);
    
//     return NextResponse.json({ 
//       error: "Failed to clear chat history" 
//     }, { status: 500 });
//   }
// } 