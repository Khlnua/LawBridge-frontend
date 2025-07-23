"use client";

import { Button, Badge } from "@/components/ui";
import { Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LawyerCardProps = {
  id: string;
  name: string;
  status: string;
  avatarImage?: string;
  specialty?: string[];
  rating?: number;
  reviewCount?: number;
  hourlyRate?: number[];
};

const LawyerCard = ({ id, name, status, avatarImage, specialty, rating, reviewCount, hourlyRate }: LawyerCardProps) => {
  const [activeSpecialtyIndex, setActiveSpecialtyIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setActiveSpecialtyIndex(activeSpecialtyIndex === index ? null : index);
  };

  const router = useRouter();

  const handleDelgerenguiClick = () => {
    router.push(`/lawyer/${id}`);
  };

  return (
    <div
      className="
    bg-[#eee] rounded-xl shadow-lg
    p-5 sm:p-6                
    flex flex-col flex-grow-0 items-center text-center
    transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl
    w-full max-w-sm
    mx-auto
  "
    >
      <div className="mb-4">
        <div className="w-20 h-20 bg-[#8bc34a] rounded-full mx-auto mb-3">
          {avatarImage && <img src={process.env.R2_PUBLIC_DOMAIN + "/" + avatarImage} className="size-full rounded-full " />}
        </div>
        <h3 className="text-xl font-semibold text-[#333333] mb-0.5">{name}</h3>
        <div className="p-2">
          {specialty?.map((spec, index) => (
            <Badge
              key={index}
              onClick={() => handleClick(index)}
              variant="default"
              className={`
                px-2 py-1 rounded-full text-[13px] font-medium  m-0.5 cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200
                ${activeSpecialtyIndex === index ? "bg-blue-600 text-white" : "bg-[#003366] text-white hover:bg-[#2EC4B6] hover:text-black"}
              `}
            >
              {spec}
              {activeSpecialtyIndex === index && hourlyRate?.[index] !== undefined ? (
                <span className="ml-1">₮{hourlyRate[index]}/цаг</span>
              ) : (
                ""
              )}
            </Badge>
          ))}
        </div>
      </div>

      <div className="w-full mb-5 text-left pl-4 mt-auto">
        <p className="flex items-center text-gray-700 text-sm mb-1.5">
          <span className={`mr-1.5 text-lg flex ${status?.toLowerCase() === "verified" ? "text-green-500" : "text-yellow-500"}`}>
            {status}
            {rating} ({reviewCount})
          </span>
        </p>
      </div>

      <div className="w-full flex flex-col gap-2.5 mt-auto">
        <Button
          onClick={handleDelgerenguiClick}
          className="w-full bg-[#003366] text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition-colors duration-200 text-base"
        >
          Мэдээлэл харах
        </Button>
      </div>
    </div>
  );
};

export default LawyerCard;
