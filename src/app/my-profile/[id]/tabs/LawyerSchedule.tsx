"use client";

import { useState } from "react";

const days = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба", "Ням"];
const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

export const LawyerSchedule = () => {
  const [availability, setAvailability] = useState<Record<string, string[]>>({});

  const toggleTime = (day: string, time: string) => {
    setAvailability((prev) => {
      const currentDaySlots = prev[day] || [];
      const updatedSlots = currentDaySlots.includes(time)
        ? currentDaySlots.filter((t) => t !== time)
        : [...currentDaySlots, time];

      return {
        ...prev,
        [day]: updatedSlots,
      };
    });
  };

  const saveAvailability = () => {
    console.log("📝 Хадгалсан боломжит цагууд:", availability);
    // Энд API руу хадгалах хүсэлт явуулж болно
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">Захиалгад зориулсан боломжит цаг</h2>
      <p className="text-center text-sm text-gray-500">
        Өдөр бүрийн боломжтой цагаа сонгоно уу
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => (
          <div key={day} className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">{day}</h3>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((time) => {
                const selected = availability[day]?.includes(time);
                return (
                  <button
                    key={time}
                    onClick={() => toggleTime(day, time)}
                    className={`px-3 py-1 text-sm rounded-md border ${
                      selected
                        ? "bg-green-600 text-white border-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={saveAvailability}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Хадгалах
        </button>
      </div>
    </div>
  );
}
