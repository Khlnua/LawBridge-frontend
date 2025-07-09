"use client";

import { useState } from "react";
import { FileText, Star, Clock } from "lucide-react";
import {LawyerReviews, LawyerSchedule , LawyerProfileHeader  } from "./tabs"; 
import LawyerPosts from "./tabs/LawyerPosts";


const LawyerProfilePageForLawyers = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "reviews" | "schedule">("posts");

  const renderTab = () => {
    switch (activeTab) {
      case "posts":
        return <LawyerPosts />;
      case "reviews":
        return <LawyerReviews />;
      case "schedule":
        return <LawyerSchedule />;
    }
  };
  return (
     <div className="w-full px-4 py-8 flex flex-col items-center space-y-6">
      <LawyerProfileHeader/>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
            activeTab === "posts" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          <FileText size={16} />
          Posts
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
            activeTab === "reviews" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          <Star size={16} />
          Reviews
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
            activeTab === "schedule" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          <Clock size={16} />
          Schedule
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white shadow rounded-xl p-6">{renderTab()}</div>
    </div>
  )
}

export default LawyerProfilePageForLawyers



