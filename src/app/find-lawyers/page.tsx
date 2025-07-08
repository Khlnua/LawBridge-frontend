import React from "react";
import { TestingFakeLawyers } from "./utils/fake-lawyers";
import LawyerCard from "@/components/landing-page/LawyerCard";
import { Button } from "@/components/ui";
import { specializations } from "../(create-lawyer-profile)/lawyer-form/utils/specializations";

const FindLawyersPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 justify-center mb-8 sm:mb-10 w-full max-w-6xl mt-10 ">
      {TestingFakeLawyers.map((lawyer, index) => (
        <LawyerCard
          key={index}
          name={lawyer.name}
          specialty={lawyer.specialty}
          rating={lawyer.rating}
          reviewCount={lawyer.reviewCount}
          hourlyRate={lawyer.hourlyRate}
          // statusText={lawyer.statusText}
          // yearsExperience={lawyer.yearsExperience}
        />
      ))}
      <div className="w-70 h-200  flex flex-col space-y-5 fixed left-20 top-50">
        <select>
          <option value="">Өмгөөлөгчийн мэргэжил</option>
          {specializations.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FindLawyersPage;
