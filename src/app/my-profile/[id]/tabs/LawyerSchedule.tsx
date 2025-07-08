"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const generateTimeSlots = () => {
  const slots: string[] = [];
  let start = 0; // start from 00:00

  while (start + 30 <= 1440) {
    const hour = Math.floor(start / 60);
    const minute = start % 60;
    const formatted = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    slots.push(formatted);
    start += 40; // 30min slot + 10min break
  }

  return slots;
};

export const LawyerSchedule = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [availability, setAvailability] = React.useState<
    Record<string, string[]>
  >({});

  const selectedDateKey = date?.toISOString().split("T")[0] || "";
  const selectedTimeSlots = availability[selectedDateKey] || [];

  // Автоматаар хуучирсан огноог устгах (анхны render үед)
  React.useEffect(() => {
    const now = new Date();
    const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const weekLater = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 7
    );

    const newAvailability = Object.entries(availability).reduce(
      (acc, [dateKey, slots]) => {
        const dateObj = new Date(dateKey);
        if (dateObj >= cutoff && dateObj <= weekLater) {
          acc[dateKey] = slots;
        }
        return acc;
      },
      {} as Record<string, string[]>
    );

    setAvailability(newAvailability);
  }, []);

  const toggleTime = (time: string) => {
    setAvailability((prev) => {
      const current = prev[selectedDateKey] || [];
      const updated = current.includes(time)
        ? current.filter((t) => t !== time)
        : [...current, time];
      return {
        ...prev,
        [selectedDateKey]: updated,
      };
    });
  };

  const removeSlot = (dateKey: string, time: string) => {
    setAvailability((prev) => {
      const filtered = prev[dateKey].filter((t) => t !== time);
      const updated = { ...prev, [dateKey]: filtered };
      if (filtered.length === 0) delete updated[dateKey];
      return updated;
    });
  };

  const saveAvailability = () => {
    console.log("📝 Хадгалсан өдрүүд:", availability);
    // Backend руу илгээх хүсэлт энд бичнэ
  };

  const now = new Date();
  const maxDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 хоног

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-60">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            fromDate={now}
            toDate={maxDate}
            showOutsideDays={false}
            className="bg-transparent p-0"
            formatters={{
              formatWeekdayName: (date) =>
                date.toLocaleString("mn-MN", { weekday: "short" }),
            }}
          />
        </div>

        {/* Time slots: right side */}
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-96 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-60 md:border-t-0 md:border-l">
          <div className="grid grid-cols-2 gap-2">
            {generateTimeSlots().map((time) => (
              <Button
                key={time}
                variant={selectedTimeSlots.includes(time) ? "default" : "outline"}
                onClick={() => toggleTime(time)}
                className="w-full shadow-none text-xs"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {selectedDateKey && selectedTimeSlots.length > 0 ? (
            <>
              <span className="font-medium">{selectedDateKey}</span> өдөр дараах
              цагаар боломжтой:{" "}
              <span className="font-semibold">{selectedTimeSlots.join(", ")}</span>
            </>
          ) : (
            <>Өдөр болон цаг сонгоно уу.</>
          )}
        </div>

        <Button
          onClick={saveAvailability}
          disabled={!selectedDateKey || selectedTimeSlots.length === 0}
          className="w-full md:ml-auto md:w-auto"
        >
          Хадгалах
        </Button>
      </CardFooter>

      {/* ⬇️ Бүх сонгосон цагуудыг харуулах + remove */}
      {Object.keys(availability).length > 0 && (
        <div className="border-t px-6 py-5 space-y-4">
          <h3 className="font-semibold text-base">🗓 Сонгосон боломжит хуваарь:</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(availability).map(([dateKey, slots]) => (
              <div key={dateKey}>
                <div className="font-medium text-gray-700">📅 {dateKey}</div>
                <div className="ml-4 text-gray-600 flex flex-wrap gap-2 mt-1">
                  {slots.map((slot) => (
                    <div
                      key={slot}
                      className="flex items-center gap-1 text-xs bg-gray-100 rounded px-2 py-1"
                    >
                      {slot}
                      <button
                        onClick={() => removeSlot(dateKey, slot)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
