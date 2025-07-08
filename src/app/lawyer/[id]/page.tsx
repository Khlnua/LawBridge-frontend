"use client";

import { useState } from "react";
import { Mail, Phone, Star, Clock, FileText } from "lucide-react";

const LawyerProfile = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "reviews" | "book">("posts");

  const lawyer = {
    name: "Б. Номин",
    specialization: "Эрүүгийн эрх зүй, Гэр бүлийн эрх зүй",
    location: "Улаанбаатар",
    email: "nomin@example.com",
    phone: "99112233",
    rating: 4.9,
    reviews: 27,
    avatar: "/lawyer-avatar.jpg",
    description:
      "10 жилийн туршлагатай, хууль зүйн салбарт үр дүнтэй зөвлөгөө өгдөг өмгөөлөгч.",
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg">Нийтлэлүүд</h3>
            <div className="bg-gray-50 p-4 rounded-lg shadow">📌 Эрүүгийн хэргүүдийн шийдвэрлэлт ба эрх зүйн зөвлөгөө</div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">📌 Гэр бүл салалттай холбоотой анхаарах зүйлс</div>
          </div>
        );
      case "reviews":
        return (
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg">Үйлчлүүлэгчдийн сэтгэгдэл</h3>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              ⭐⭐⭐⭐⭐ — &quot;Маш найдвартай, үр дүнтэй зөвлөгөө өгсөн. Баярлалаа!&quot;
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              ⭐⭐⭐⭐ — &quot;Тодорхой тайлбарлаж, хурдан шийдсэн.&quot;
            </div>
          </div>
        );
      case "book":
        return (
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg">Цаг захиалах</h3>
            <p className="text-sm text-gray-600">Энд цаг захиалах форм эсвэл товч байрлана.</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
              Цаг захиалах
            </button>
          </div>
        );
    }
  };

  return (
    <div className="w-full px-4 py-8 flex flex-col items-center space-y-6">
      {/* Profile Section */}
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-2xl flex flex-col items-center space-y-3">
        <img
          src={lawyer.avatar}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <h1 className="text-2xl font-bold text-center">{lawyer.name}</h1>
        <p className="text-green-700 font-medium text-center">{lawyer.specialization}</p>

        <div className="text-sm text-gray-500 text-center">
          
          <div className="flex items-center justify-center gap-2">
            <Mail size={16} />
            <span>{lawyer.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone size={16} />
            <span>{lawyer.phone}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            <Star size={16} />
            <span>{lawyer.rating} / 5.0</span>
            <span className="text-gray-500">({lawyer.reviews} сэтгэгдэл)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-1 px-5 py-2 rounded-md text-sm font-medium ${
            activeTab === "posts" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <FileText size={16} /> Posts
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-1 px-5 py-2 rounded-md text-sm font-medium ${
            activeTab === "reviews" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <Star size={16} /> Reviews
        </button>
        <button
          onClick={() => setActiveTab("book")}
          className={`flex items-center gap-1 px-5 py-2 rounded-md text-sm font-medium ${
            activeTab === "book" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <Clock size={16} /> Book
        </button>
      </div>

      {/* Tab content */}
      <div className="w-full max-w-2xl bg-white shadow rounded-xl p-6 flex justify-center">
        <div className="w-full">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default LawyerProfile;

