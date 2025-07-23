// src/lib/livekit.ts (Client-side code)

export async function fetchLiveKitToken(
  roomName: string,
  clerkToken: string
): Promise<string> {
  try {
    const response = await fetch(
      "https://lawbridge-server.onrender.com/api/livekit-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clerkToken}`, // Authenticates the user
        },
        body: JSON.stringify({
          room: roomName, // The server expects a 'room' property
        }),
      }
    );

    if (!response.ok) {
      // The new server code provides a JSON error object, which is more useful.
      const errorData = await response.json();
      throw new Error(errorData.error || "An unknown error occurred.");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching LiveKit token:", error);
    throw error; // Re-throw the error so the calling component can handle it
  }
}
