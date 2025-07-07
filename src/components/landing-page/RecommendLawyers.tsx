"use client"

import LawyerCard from "./LawyerCard";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

const RecommendLawyers = () => {
  const {push} = useRouter()
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 md:px-8 lg:px-10 text-center flex flex-col items-center">
      <header className="mb-8 sm:mb-10 md:mb-12 w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#333333] mb-3 sm:mb-4 leading-tight">
          Өмгөөлөгчөө хайж олоорой
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[#555555] max-w-2xl mx-auto leading-relaxed">
          Хуулийн мэргэжилтнүүдээс шууд цаг аван цаг аван өөрийн цагаа хэмнээрэй
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 justify-center mb-8 sm:mb-10 w-full max-w-6xl">
        <LawyerCard
          name="Sarah Johnson"
          specialty="Corporate Law"
          location="New York, NY"
          rating={4.9}
          reviewCount={197}
          hourlyRate={450}
          statusText="Available Today"
          hasQuickResponse={true}
        />
        <LawyerCard
          name="Michael Chen"
          specialty="Family Law"
          location="Los Angeles, CA"
          rating={4.8}
          reviewCount={205}
          hourlyRate={300}
          statusText="Available Today"
          hasCertified={true}
          yearsExperience={16}
        />
        <LawyerCard
          name="Emily Rodriguez"
          specialty="Criminal Defense"
          location="Chicago, IL"
          rating={4.9}
          reviewCount={189}
          hourlyRate={375}
          statusText="Available Today"
          hasEmergencyCases={true}
        />
      </div>
      <div className="sm:mt-4">
        <Button onClick={()=>(push("/find-lawyers"))} className="bg-[#003366] text-[#f8f8f8] text-base sm:text-lg font-medium px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:opacity-90 transition-colors duration-200">
          Бусад өмгөөлөгчдийг харах
        </Button>
      </div>
    </div>
  );
};

export default RecommendLawyers;
