"use client";

import { useState } from "react";
import LawyerCard from "@/components/landing-page/LawyerCard";
import { TestingFakeLawyers } from "../../app/utils/fake-lawyers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAdminSpecializationsQuery } from "@/generated";
import { useQuery } from "@apollo/client";
import { GET_ALL_LAWYERS } from "@/graphql/lawyer";

interface Category {
  id: string;
  categoryName: string;
}

interface Lawyer {
  id: string;
  lawyerId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  status?: string;
  specialty?: string;
  rating?: number;
  reviewCount?: number;
}

const FilteredByCategories = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  );

  const { data } = useGetAdminSpecializationsQuery();
  const {
    data: allLawyersData,
    loading: allLawyersLoading,
    error: allLawyersError,
  } = useQuery(GET_ALL_LAWYERS);

  if (allLawyersLoading) return <div>Түр хүлээнэ үү...</div>;
  if (allLawyersError) return <div>Алдаа гарлаа.</div>;

  const lawyers = [
    ...(allLawyersData?.getLawyers || []),
    ...TestingFakeLawyers,
  ];

  const filteredLawyers = lawyers.filter((lawyer: Lawyer) => {
    if (!selectedSpecialty) return true;

    if (Array.isArray(lawyer.specialty)) {
      return lawyer.specialty.includes(selectedSpecialty);
    }

    return false;
  });

  const handleSpecaltyChange = (value: string | null) => {
    if (value === "Бүх чиглэл") {
      setSelectedSpecialty(null);
      return;
    }
    setSelectedSpecialty(value);
  };

  const specializations = data?.getAdminSpecializations || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 justify-center mb-8 sm:mb-10 w-full max-w-6xl mt-10 ">
      <div className="w-70 h-200 flex flex-col space-y-5 fixed left-20 top-30">
        <p className="text-lg font-semibold text-[#333]">Шүүлтүүр</p>

        <Select
          onValueChange={handleSpecaltyChange}
          value={selectedSpecialty || ""}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Чиглэл сонгоно уу" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem
                value="Бүх чиглэл"
                className="cursor-pointer hover:bg-gray-100"
              >
                Бүх чиглэл
              </SelectItem>
            </SelectGroup>
            <SelectGroup>
              {specializations.map((spec: Category) => (
                <SelectItem
                  key={spec.id}
                  value={spec.categoryName}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {spec.categoryName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filteredLawyers?.length > 0 ? (
        filteredLawyers.map((lawyer: any, index) => (
          <LawyerCard
            id={lawyer.lawyerId}
            key={lawyer.lawyerId || index}
            name={lawyer.firstName + " " + lawyer.lastName}
            avatarImage={lawyer.profilePicture}
            status={lawyer.status}
            rating={lawyer.rating}
            reviewCount={lawyer.reviewCount}
          />
        ))
      ) : (
        <p className="text-gray-600 text-lg md:col-span-full text-center">
          Энэ чиглэлээр хуульч олдсонгүй.
        </p>
      )}
    </div>
  );
};

export default FilteredByCategories;
