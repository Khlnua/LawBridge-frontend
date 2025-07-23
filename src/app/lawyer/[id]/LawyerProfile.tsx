"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Mail, Phone, Star, Clock, FileText } from "lucide-react";
import { GET_LAWYER_BY_LAWYERID_QUERY } from "@/graphql/lawyer";

type Props = {
  lawyerId: string;
};

export default function LawyerProfile({lawyerId}: { lawyerId: string }) {
  const [activeTab, setActiveTab] = useState<"posts" | "reviews" | "book">("posts");

  const { data, loading, error } = useQuery(GET_LAWYER_BY_LAWYERID_QUERY, {
    variables: { lawyerId },
    skip: !lawyerId,
  });

  if (loading) return <p className="text-center">Уншжына хөө...</p>;
  if (error || !data?.getLawyerById) return <p className="text-center">Хуульч олдсонгүй</p>;

  const lawyer = data.getLawyerById;

  return (
    <div className="w-full px-4 py-8 flex flex-col items-center space-y-6">
      {/* Profile Section */}
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-2xl flex flex-col items-center space-y-3">
        <img
          src={lawyer.profilePicture || "/lawyer-avatar.jpg"}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <h1 className="text-2xl font-bold text-center">
          {lawyer.firstName} {lawyer.lastName}
        </h1>
        <p className="text-green-700 font-medium text-center">{lawyer.bio}</p>

        <div className="text-sm text-gray-500 text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Mail size={16} />
            <span>{lawyer.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            <Star size={16} />
            <span>{lawyer.rating?.toFixed(1) ?? "5.0"} / 5.0</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 flex-wrap">
        {["posts", "reviews", "book"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex items-center gap-1 px-5 py-2 rounded-md text-sm font-medium ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab === "posts" && <><FileText size={16} /> Posts</>}
            {tab === "reviews" && <><Star size={16} /> Reviews</>}
            {tab === "book" && <><Clock size={16} /> Book</>}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="w-full max-w-2xl bg-white shadow rounded-xl p-6 flex justify-center">
        <div className="w-full">
          {activeTab === "posts" && (
            <div className="space-y-4 text-center">
              <h3 className="font-semibold text-lg">Нийтлэлүүд</h3>
              <div className="bg-gray-50 p-4 rounded-lg shadow">📌 Эрүүгийн хэргүүдийн шийдвэрлэлт ба эрх зүйн зөвлөгөө</div>
              <div className="bg-gray-50 p-4 rounded-lg shadow">📌 Гэр бүл салалттай холбоотой анхаарах зүйлс</div>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4 text-center">
              <h3 className="font-semibold text-lg">Үйлчлүүлэгчдийн сэтгэгдэл</h3>
              <div className="bg-green-50 p-4 rounded-lg shadow">
                ⭐⭐⭐⭐⭐ — &quot;Маш найдвартай, үр дүнтэй зөвлөгөө өгсөн. Баярлалаа!&quot;
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow">
                ⭐⭐⭐⭐ — &quot;Тодорхой тайлбарлаж, хурдан шийдсэн.&quot;
              </div>
            </div>
          )}
          {activeTab === "book" && (
            <div className="space-y-4 text-center">
              <h3 className="font-semibold text-lg">Цаг захиалах</h3>
              <p className="text-sm text-gray-600">Энд цаг захиалах форм эсвэл товч байрлана.</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                Цаг захиалах
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
