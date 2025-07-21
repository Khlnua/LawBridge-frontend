// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { message, options = {} } = await req.json();

//     if (!message) {
//       return NextResponse.json(
//         { error: "Message is required" },
//         { status: 400 }
//       );
//     }

//     // Connect to your backend GraphQL server
//     const backendUrl =
//       process.env.BACKEND_URL || "http://localhost:4000/graphql";

//     const response = await fetch(backendUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userId}`, // You might need to get a proper token
//       },
//       body: JSON.stringify({
//         query: `
//           mutation ChatWithAI($input: ChatInput!) {
//             chatWithAI(input: $input) {
//               answer
//               sourceDocuments
//               metadata {
//                 responseTime
//                 tokensUsed
//               }
//             }
//           }
//         `,
//         variables: {
//           input: {
//             message,
//             userId,
//             options: {
//               maxTokens: options.maxTokens || 600,
//               temperature: options.temperature || 0.3,
//               includeSourceDocs: options.includeSourceDocs || true,
//               maxHistoryLength: options.maxHistoryLength || 10,
//             },
//           },
//         },
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(
//         errorData.errors?.[0]?.message || `HTTP ${response.status}`
//       );
//     }

//     const data = await response.json();

//     if (data.errors) {
//       throw new Error(data.errors[0].message);
//     }

//     const result = data.data?.chatWithAI;

//     if (!result) {
//       throw new Error("No response from AI service");
//     }

//     return NextResponse.json({
//       answer: result.answer,
//       sourceDocuments: result.sourceDocuments || [],
//       metadata: result.metadata || {},
//     });
//   } catch (error) {
//     console.error("Chat API error:", error);

//     let errorMessage = "An error occurred while processing your request";
//     let statusCode = 500;

//     if (error instanceof Error) {
//       if (error.message.includes("fetch")) {
//         errorMessage = "Unable to connect to AI service";
//         statusCode = 503;
//       } else if (error.message.includes("rate limit")) {
//         errorMessage =
//           "Service is temporarily busy. Please try again in a moment.";
//         statusCode = 429;
//       } else if (error.message.includes("timeout")) {
//         errorMessage = "Request timeout. Please try with a shorter message.";
//         statusCode = 408;
//       } else {
//         errorMessage = error.message;
//       }
//     }

//     return NextResponse.json({ error: errorMessage }, { status: statusCode });
//   }
// }
