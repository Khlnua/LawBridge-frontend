import { MessageCircleMore } from "lucide-react";
import FooterPage from "@/components/landing-page/FooterPage";
import HeroSection from "../../components/landing-page/HeroSection";
import RecommendLawyers from "../../components/landing-page/RecommendLawyers";
import ShowArticleFromLawyers from "../../components/landing-page/ShowArticleFromLawyers";

const MainPage = () => {
  return (
    <div className="min-h-screen flex flex-col border w-screen">
      <HeroSection />

      <main className="flex-grow">
        <RecommendLawyers />
        <ShowArticleFromLawyers />
      </main>

      <FooterPage />

      <div
        className="fixed
        right-4 bottom-4        
        sm:right-8 sm:bottom-8 
        md:right-12 md:bottom-12
        lg:right-20 lg:bottom-20 
        rounded-full
        size-14 sm:size-16    
        bg-[#1453b4]
        flex justify-center items-center
        hover:bg-blue-600
        shadow-lg
        border-2
        border-[#f8f8f8]
        transition ease-in-out"
      >
        <MessageCircleMore className="size-[50%] text-white" />
      </div>
    </div>
  );
};

export default MainPage;
