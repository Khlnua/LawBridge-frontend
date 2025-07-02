"use client";

import React from "react";
import FooterPage from "@/components/landing-page/FooterPage";
import { MessageCircleMore } from "lucide-react";
import HeroSection from "../../components/landing-page/HeroSection";
import RecommendLawyers from "../../components/landing-page/RecommendLawyers";
import ShowArticleFromLawyers from "../../components/landing-page/ShowArticleFromLawyers";
const MainPage = () => {
  return (
    <div className="">
      <HeroSection />
      <RecommendLawyers />
      <ShowArticleFromLawyers />
      <FooterPage />
      <div className="fixed right-20 bottom-20 rounded-full size-16 bg-[#1453b4] flex justify-center items-center hover:opacity-90">
        <MessageCircleMore className="size-[60%] text-white" />
      </div>
    </div>
  );
};

export default MainPage;
