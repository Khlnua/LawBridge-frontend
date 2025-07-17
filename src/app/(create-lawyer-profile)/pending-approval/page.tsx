// components/AdminSpecializations.tsx
"use client";

import { NotificationBell } from "@/components/notfication";
import { gql, useQuery } from "@apollo/client";

const GET_ADMIN_SPECIALIZATIONS = gql`
  query GetAdminSpecializations {
    getAdminSpecializations {
      id
      categoryName
    }
  }
`;

export default function AdminSpecializations() {
  const { data, loading, error } = useQuery(GET_ADMIN_SPECIALIZATIONS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("🎯 Admin Specializations:", data.getAdminSpecializations);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Admin Specializations</h2>
      <ul className="list-disc list-inside">
        {data.getAdminSpecializations.map((spec: any) => (
          <li key={spec.id}>
            {spec.categoryName} (ID: {spec.id})
          </li>
        ))}
      </ul>
      <NotificationBell/>
    </div>
  );
}
