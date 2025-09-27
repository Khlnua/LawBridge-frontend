"use client";

import { useState } from "react";

import { FileText, Star, Calendar, UserPenIcon, Newspaper } from "lucide-react";
import CreatePost from "./post/CreatePost";
import { ShowLawyerPosts } from "./ShowLawyerPosts";
import { LawyerReviews } from "./LawyerReviews";
import LawyerSchedule from "./LawyerSchedule";
import { LawyerProfileHeader } from "@/app/my-profile/[lawyerId]/tabs/LawyerHeader";
import { Button } from "@/components";

type TabType = "profile" | "posts" | "reviews" | "schedule" | "clients" | "createPost";

type SidebarTabsProps = {
  lawyerId: string;
};

const SidebarTabs = ({ lawyerId }: SidebarTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: "profile",
      label: "Профайл",
      icon: <UserPenIcon className="w-4 h-4" />,
    },
    {
      id: "createPost",
      label: "Нийтлэл үүсгэх",
      icon: <Newspaper className="w-4 h-4" />,
    },
    {
      id: "schedule",
      label: "Хуваарь",
      icon: <Calendar className="w-4 h-4" />,
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
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <nav className="border-b border-gray-200">
          <div className="grid grid-cols-5">
            {tabItems.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="ghost"
                className={`flex items-center gap-2 px-6 py-6 whitespace-nowrap border-b-2 transition-all duration-200 font-medium hover:cursor-pointer rounded-none justify-center ${
                  activeTab === tab.id
                    ? "border-[#003366] text-[#003366] bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                <span className="text-sm">{tab.label}</span>
              </Button>
            ))}
          </div>
        </nav>

        <div className="w-full">
          <div className="">
            {activeTab === "profile" && <LawyerProfileHeader lawyerId={lawyerId} />}
            {activeTab === "schedule" && <LawyerSchedule lawyerId={lawyerId} />}
            {activeTab === "posts" && <ShowLawyerPosts lawyerId={lawyerId} />}
            {activeTab === "reviews" && <LawyerReviews />}
            {activeTab === "createPost" && <CreatePost />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarTabs;
