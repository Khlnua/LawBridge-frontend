"use client";

import { useState } from "react";
import LawyerCard from "@/components/landing-page/LawyerCard";
import { TestingFakeLawyers } from "../../app/utils/fake-lawyers";
import { specializations } from "@/app/utils/specializations";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FilteredByCategories = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const filteredLawyers = TestingFakeLawyers.filter((lawyer) => {
    if (!selectedSpecialty) {
      return true;
    }
    return lawyer.specialty.includes(selectedSpecialty);
  });

  const handleSpecaltyChange = (value: string | null) => {
    if (value === "Бүх чиглэл") {
      setSelectedSpecialty(null);
      return;
    }
    setSelectedSpecialty(value);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 justify-center mb-8 sm:mb-10 w-full max-w-6xl mt-10 ">
      <div className="w-70 h-200  flex flex-col space-y-5 fixed left-20 top-30">
        <p className="text-lg font-semibold text-[#333]">Шүүлтүүр</p>

        <Select onValueChange={handleSpecaltyChange} value={selectedSpecialty || ""}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Чиглэл сонгоно уу" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Бүх чиглэл" className="cursor-pointer hover:bg-gray-100">
                Бүх чиглэл
              </SelectItem>
            </SelectGroup>
            <SelectGroup>
              {specializations.map((spec, index) => (
                <SelectItem key={index} value={spec} className="cursor-pointer hover:bg-gray-100">
                  {spec}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filteredLawyers.length > 0 ? (
        filteredLawyers.map((lawyer, index) => (
          <LawyerCard
            key={index}
            name={lawyer.name}
            specialty={lawyer.specialty}
            rating={lawyer.rating}
            reviewCount={lawyer.reviewCount}
            hourlyRate={lawyer.hourlyRate}
          />
        ))
      ) : (
        <p className="text-gray-600 text-lg md:col-span-full text-center">Энэ чиглэлээр хуульч олдсонгүй.</p>
      )}
    </div>
  );
};

export default FilteredByCategories;
