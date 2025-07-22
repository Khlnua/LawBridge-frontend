"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FieldErrors, useFormContext, UseFormSetValue } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { Button, Checkbox, Input } from "@/components/ui/index";
import { ZodErrors } from "../ZodError";
import { FormData } from "../../page";
import { formatMoneyDigits } from "../../../../utils/numberFormat";
import { CREATE_LAWYER_MUTATION } from "@/graphql/lawyer";
import { useUser } from "@clerk/nextjs";
import { useCreateSpecializationMutation } from "@/generated";
import { useGetAdminSpecializationsQuery } from "@/generated";

type Props = {
  errors: FieldErrors<FormData>;
  watchedSpecializations: string[];
  setValue: UseFormSetValue<FormData>;
  isSubmitting?: boolean;
  goToPreviousStep?: () => void;
};

const ThirdCardForLawyer = ({
  errors,
  watchedSpecializations,
  setValue,
  isSubmitting,
  goToPreviousStep,
}: Props) => {
  const { push } = useRouter();
  const { getValues } = useFormContext<FormData>();
  const { user } = useUser();

  const [hourlyRates, setHourlyRates] = useState<{ [key: string]: string }>({});

  const [createLawyer, { loading: creatingLawyer }] = useMutation(
    CREATE_LAWYER_MUTATION
  );

  const [createSpecialization] = useCreateSpecializationMutation();
  const [getAdminSpecializations] = useGetAdminSpecializationsQuery();

  useEffect(() => {
    setRecommendPaid((prev) => {
      const updated: { [key: string]: boolean } = {};
      watchedSpecializations.forEach((spec) => {
        updated[spec] = prev[spec] ?? false;
      });
      return updated;
    });
  }, [watchedSpecializations]);

  const handleRegister = async () => {
    const formData = getValues();
    const lawyerId = user?.id;

    if (!lawyerId) {
      console.error("lawyerId олдсонгүй");
      return alert("Нэвтэрсэн хэрэглэгчийн ID олдсонгүй.");
    }

    try {
      const { data } = await createLawyer({
        variables: {
          input: {
            lawyerId: lawyerId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            profilePicture: formData.avatar,
            licenseNumber: formData.licenseNumber,
            university: formData.university,
            bio: formData.bio,
            document: "",
          },
        },
      });

      await Promise.all(
        watchedSpecializations.map(async (spec) => {
          const price = parseInt(
            (hourlyRates[spec] || "0").replace(/,/g, ""),
            10
          );
          const sub = recommendPaid[spec] ?? false;

          await createSpecialization({
            variables: {
              input: {
                specializations: [
                  {
                    lawyerId: "687f4227390e098127a90009",
                    specializationId: "686e20e60f350225bb6ef1b7" /* spec */,
                    subscription: sub,
                    pricePerHour: sub ? price : 0,
                  },
                ],
              },
            },
          });
        })
      );

      push("/pending-approval");
    } catch (error) {
      console.error("Бүртгүүлэх үед алдаа гарлаа:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const handleCheckboxChange = (checked: boolean | string, value: string) => {
    const current = watchedSpecializations || [];
    if (checked) {
      setValue("specializations", [...current, value]);
    } else {
      setValue(
        "specializations",
        current.filter((s) => s !== value)
      );
    }
  };
  const specializations = data?.getAdminSpecializations || [];

  return (
    <div className="space-y-10">
      <div>
        <label className="block font-medium mb-4 text-[16px]">
          Ажиллах талбараа сонгоно уу
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {specializations.map((spec: { id: string; categoryName: string }) => (
            <div key={spec.id} className="flex items-center space-x-2">
              <Checkbox
                id={`spec-${spec.id}`}
                checked={watchedSpecializations.includes(spec.categoryName)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked, spec.categoryName)
                }
                className="cursor-pointer hover:bg-gray-100"
              />
              <label
                htmlFor={`spec-${spec.id}`}
                className="text-sm cursor-pointer"
              >
                {spec.categoryName}
              </label>
            </div>
          ))}
        </div>
        <ZodErrors
          error={
            errors.specializations?.message
              ? [errors.specializations.message]
              : undefined
          }
        />
      </div>

      {watchedSpecializations.length > 0 && (
        <div className="space-y-4 relative">
          <label className="block font-medium mb-4 text-[16px]">
            Та төлбөртэй үйлчилгээ санал болгох уу?
          </label>
          {watchedSpecializations.map((spec) => {
            const isChecked = recommendPaid[spec] || false;
            return (
              <div
                key={spec}
                className={`flex items-center p-3 border rounded-lg transition-colors ${
                  isChecked
                    ? "bg-green-200 border-green-500"
                    : "border-blue-300 hover:bg-gray-100"
                }`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).tagName !== "INPUT") {
                    setRecommendPaid((prev) => ({
                      ...prev,
                      [spec]: !isChecked,
                    }));
                  }
                }}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    setRecommendPaid((prev) => ({
                      ...prev,
                      [spec]: Boolean(checked),
                    }))
                  }
                />
                <label className="text-sm ml-2">
                  {`${spec} ${
                    isChecked ? "талбарт төлбөртэй ажиллана" : "үнэгүй ажиллана"
                  }`}
                </label>
                {isChecked && (
                  <div className="ml-auto">
                    <Input
                      placeholder="Цагийн хөлс"
                      value={hourlyRates[spec] || ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        setHourlyRates((prev) => ({
                          ...prev,
                          [spec]: formatMoneyDigits(raw),
                        }));
                      }}
                      className="w-32 text-xs"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 mt-6 gap-10">
        <Button
          onClick={goToPreviousStep}
          className="bg-[#333333] text-white hover:bg-gray-800"
        >
          Буцах
        </Button>
        <Button
          onClick={handleRegister}
          disabled={creatingLawyer}
          className="bg-blue-500 text-white hover:bg-blue-400"
        >
          {creatingLawyer ? "Илгээж байна..." : "Бүртгүүлэх"}
        </Button>
      </div>
    </div>
  );
};

export default ThirdCardForLawyer;
