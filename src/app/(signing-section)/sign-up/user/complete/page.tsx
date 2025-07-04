"use client";

import { useSearchParams } from "next/navigation";

export default function SignUpUserCompletePage() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-green-600">Бүртгэл амжилттай!</h1>
        <p className="text-gray-700">
          Та утасны дугаараа амжилттай баталгаажууллаа.
        </p>
        {phone && (
          <div className="bg-gray-100 p-3 rounded-md text-blue-700 font-medium">
            {phone}
          </div>
        )}
       
      </div>
    </div>
  );
}