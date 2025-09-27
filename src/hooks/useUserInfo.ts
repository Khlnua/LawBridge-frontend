"use client";

import { useState, useEffect } from "react";
import {
  getUsernameFromEmail,
  generateMockEmailFromUserId,
} from "./useClerkUserEmail";

import { useGetLawyerByIdQuery } from "@/generated";

// Note: GET_LAWYER_BY_CLERK_USER_ID query removed as it's not supported by the backend

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  initial: string;
  userType: "lawyer" | "client";
  email?: string;
  isOnline?: boolean;
  displayName?: string; // What to display in the chat header
}

// Cache to store fetched user data
const userInfoCache = new Map<string, UserInfo>();

export function useUserInfo(userId: string): UserInfo | null {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Try to get lawyer data
  const {
    data: lawyerData,
    loading: lawyerLoading,
  } = useGetLawyerByIdQuery({
    variables: { lawyerId: userId },
    skip: !userId,
    errorPolicy: "all",
  });

  const finalLawyerData = lawyerData?.getLawyerById;

  // If not a lawyer, try to get client email
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  const [clientLoading, setClientLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Check cache first
    if (userInfoCache.has(userId)) {
      setUserInfo(userInfoCache.get(userId)!);
      return;
    }

    // ROLE CHECK: If user is a lawyer (has lawyer data from MongoDB)
    if (finalLawyerData && !lawyerLoading) {
      const lawyer = finalLawyerData;
      const profilePicture = lawyer.profilePicture
        ? lawyer.profilePicture.startsWith("http")
          ? lawyer.profilePicture
          : `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${lawyer.profilePicture}`
        : `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/uploads/default-avatar.png`;

      const info: UserInfo = {
        id: userId,
        name:
          `${lawyer.firstName || ""} ${lawyer.lastName || ""}`.trim() ||
          "Өмгөөлөгч",
        avatar: profilePicture,
        initial: lawyer.firstName?.charAt(0) || "Ө",
        userType: "lawyer",
        email: lawyer.email,
        isOnline: false, // You might want to add this to your lawyer schema
        displayName:
          `${lawyer.firstName || ""} ${lawyer.lastName || ""}`.trim() ||
          "Өмгөөлөгч", // Full name for lawyers
      };

      userInfoCache.set(userId, info);
      setUserInfo(info);
      return;
    }

    // ROLE CHECK: If not a lawyer (no lawyer data found) and lawyer query is complete, try client data
    if (!finalLawyerData && !lawyerLoading && !clientLoading && !clientEmail) {
      setClientLoading(true);

      // Try to get client data from Clerk API
      fetch(`/api/users/${userId}/email`)
        .then((response) => response.json())
        .then((data) => {
          if (data.email) {
            setClientEmail(data.email);
            // Store client data including profile picture
            const clientInfo: UserInfo = {
              id: userId,
              name:
                data.firstName && data.lastName
                  ? `${data.firstName} ${data.lastName}`.trim()
                  : getUsernameFromEmail(data.email),
              avatar:
                data.profilePicture ||
                `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/uploads/default-avatar.png`,
              initial:
                data.firstName?.charAt(0) ||
                getUsernameFromEmail(data.email).charAt(0).toUpperCase(),
              userType: "client",
              email: data.email,
              displayName: getUsernameFromEmail(data.email), // Show username without @gmail.com
            };
            userInfoCache.set(userId, clientInfo);
            setUserInfo(clientInfo);
          } else {
            // Fallback: generate mock email
            const mockEmail = generateMockEmailFromUserId(userId);
            setClientEmail(mockEmail);
          }
        })
        .catch((error) => {
          console.error("Error fetching client data:", error);
          // Fallback: generate mock email and create client info with default avatar
          const mockEmail = generateMockEmailFromUserId(userId);
          setClientEmail(mockEmail);

          const fallbackInfo: UserInfo = {
            id: userId,
            name: getUsernameFromEmail(mockEmail),
            avatar: `${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/uploads/default-avatar.png`,
            initial: getUsernameFromEmail(mockEmail).charAt(0).toUpperCase(),
            userType: "client",
            email: mockEmail,
            displayName: getUsernameFromEmail(mockEmail), // Show username without @gmail.com
          };
          userInfoCache.set(userId, fallbackInfo);
          setUserInfo(fallbackInfo);
        })
        .finally(() => {
          setClientLoading(false);
        });
    }

    // Client info is now created in the fetch callback above
  }, [userId, finalLawyerData, clientEmail, clientLoading, lawyerLoading]);

  return userInfo;
}

// Helper functions are imported from useClerkUserEmail
