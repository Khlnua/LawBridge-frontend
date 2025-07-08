"use client";

import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";

export const LawyerProfileHeader= () => {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    avatar: "/lawyer-avatar.jpg",
    firstName: "Номин",
    lastName: "Батболд",
    email: "nomin@example.com",
    phone: "99112233",
    location: "Улаанбаатар",
    specialization: "Эрүүгийн эрх зүй, Гэр бүлийн эрх зүй",
    bio: "10 жилийн туршлагатай, хууль зүйн салбарт үр дүнтэй зөвлөгөө өгдөг өмгөөлөгч.",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Хадгалсан мэдээлэл:", form);
    // 🎯 Backend руу PATCH хүсэлт явуулж болно
  };

  return (
    <div className="w-full max-w-4xl bg-white border shadow rounded-xl p-6 space-y-4 flex flex-col items-center text-center">
      {/* Profile image */}
      <div className="relative">
        <img
          src={form.avatar}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />
        {/* Future: Upload image feature */}
      </div>

      {isEditing ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Нэр"
              className="border rounded-md p-2 text-sm"
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Овог"
              className="border rounded-md p-2 text-sm"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Имэйл"
              className="border rounded-md p-2 text-sm"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Утас"
              className="border rounded-md p-2 text-sm"
            />
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Байршил"
              className="border rounded-md p-2 text-sm"
            />
            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Мэргэжлийн чиглэл"
              className="border rounded-md p-2 text-sm"
            />
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Танилцуулга"
              className="col-span-full border rounded-md p-2 text-sm min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <Save size={16} />
              Хадгалах
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              <X size={16} />
              Болих
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">
            {form.lastName} {form.firstName}
          </h2>
          <p className="text-green-700 font-medium">{form.specialization}</p>
          <div className="text-sm text-gray-500 space-y-1">
            <div>📍 {form.location}</div>
            <div>📞 {form.phone}</div>
            <div>✉️ {form.email}</div>
          </div>
          <p className="text-sm text-gray-700 max-w-xl mt-2">{form.bio}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 flex items-center gap-1 text-sm px-4 py-2 border rounded-md hover:bg-gray-100 transition"
          >
            <Pencil size={16} />
            Засварлах
          </button>
        </>
      )}
    </div>
  );
}
