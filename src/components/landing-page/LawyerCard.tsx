"use client";

import { TestingFakeLawyers } from "@/app/find-lawyers/utils/fake-lawyers";
import { Button, Badge } from "@/components/ui";
import { Star, MapPinned } from "lucide-react";
import { useState } from "react";

type LawyerCardProps = {
  name: string;
  specialty?: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number[];
  // statusText: string;
  // yearsExperience?: number;
};

const LawyerCard = ({ name, specialty, rating, reviewCount }: LawyerCardProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    return;
    setIsClicked(!isClicked);
  };
  return (
    <div
      className="
    bg-[#eee] rounded-xl shadow-lg
    p-5 sm:p-6                
    flex flex-col items-center text-center
    transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl
    w-full max-w-sm
    mx-auto
  "
    >
      <div className="mb-4">
        <div className="w-20 h-20 bg-[#8bc34a] rounded-full mx-auto mb-3"></div>
        <h3 className="text-xl font-semibold text-[#333333] mb-0.5">{name}</h3>
        <div className="p-2">
          {specialty?.map((spec, index) => (
            <Badge
              key={index}
              onClick={handleClick}
              variant="outline"
              className="bg-[#003366] text-white px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap m-0.5 cursor-pointer"
            >
              {spec}
              {index < specialty.length - 1 && ", "}
              {/* {isClicked && `= ${TestingFakeLawyers}$/цаг`} */}
            </Badge>
          ))}
        </div>
      </div>

      <div className="w-full mb-5 text-left pl-4 mt-auto">
        <p className="flex items-center text-gray-700 text-sm mb-1.5">
          <span className="mr-1.5 text-lg text-yellow-500 flex">
            <Star />
            {rating} ({reviewCount})
          </span>
        </p>
        {/* <p className="text-lg font-semibold text-gray-800 mt-3">${hourlyRate}/цаг</p> */}

        {/* <p className="text-green-600 font-medium text-sm mt-1.5">
          <span className="mr-1.5">{statusText}</span>
        </p> */}
      </div>
      {/* <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        {hasQuickResponse && (
          <Badge variant="destructive" className="bg-[#D4AF37] border px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
            Quick Response
          </Badge>
        )}
        {hasEmergencyCases && (
          <Badge variant="outline" className="bg-[#D4AF37] border px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
            Emergency Cases
          </Badge>
        )}
        {hasCertified && (
          <Badge variant="destructive" className="bg-[#D4AF37] border px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
            Certified
          </Badge>
        )}
        {yearsExperience && (
          <Badge variant="destructive" className="bg-[#D4AF37] border px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
            {yearsExperience}+ Years
          </Badge>
        )}
      </div> */}
      <div className="w-full flex flex-col gap-2.5 mt-auto">
        <Button className="w-full bg-[#003366] text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition-colors duration-200 text-base">
          Цаг авах
        </Button>
        <Button className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold border border-gray-300 hover:bg-gray-200 transition-colors duration-200 text-base">
          Мэдээлэл харах
        </Button>
      </div>
    </div>
  );
};

export default LawyerCard;
