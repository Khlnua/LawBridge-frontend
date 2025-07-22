"use client";

import { useState } from "react";
import { FileText, Star, Calendar, MessageCircleMoreIcon } from "lucide-react";
import { LawyerPosts } from "./LawyerPosts";
import { LawyerReviews } from "./LawyerReviews";
import { LawyerSchedule } from "./LawyerSchedule";
import { LawyerClients } from "./LawyerClients";

type TabType = "posts" | "reviews" | "schedule" | "clients";

const SidebarTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>("posts");

  const tabItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: "schedule",
      label: "Хуваарь",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "clients",
      label: "Үйлчлүүлэгчид",
      icon: <MessageCircleMoreIcon className="w-4 h-4" />,
    },
    {
      id: "posts",
      label: "Нийтлэлүүд",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "reviews",
      label: "Сэтгэгдлүүд",
      icon: <Star className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <aside className="md:w-60 w-full rounded-xl bg-white shadow-sm p-4 border-none">
        <nav className="flex flex-col md:space-y-2 space-x-2 md:space-x-0 gap-3">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-150 text-sm w-full justify-start
                ${
                  activeTab === tab.id
                    ? "bg-[#316eea] text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 bg-white border rounded-xl shadow-sm p-6">
        {activeTab === "posts" && <LawyerPosts />}
        {activeTab === "reviews" && <LawyerReviews />}
        {activeTab === "schedule" && <LawyerSchedule />}
        {activeTab === "clients" && <LawyerClients />}
      </section>
    </div>
  );
};

export default SidebarTabs;
