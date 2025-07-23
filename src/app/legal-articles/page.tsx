"use client";

import { useState } from "react";
import { Button} from "@/components";
import { useGetAdminSpecializationsQuery } from "@/generated";

const ArticlesPage = () => {
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);

  const { data, loading, error } = useGetAdminSpecializationsQuery();

  const handleFilter = (category: string) => {
    setSelectedSpec((prev) => (prev === category ? null : category));
  };

  if (loading) return <p>Ачааллаж байна...</p>;
  if (error) return <p>Алдаа гарлаа: {error.message}</p>;

  const specializations = data?.getAdminSpecializations || [];

  return (
    <div className="px-6 md:px-20 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Нийтлэлүүд</h1>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3">
        {specializations.map((spec: { categoryName: string; id: string }) => (
          <Button
            key={spec.id}
            variant={selectedSpec === spec.categoryName ? "default" : "outline"}
            onClick={() => handleFilter(spec.categoryName)}
            className="text-sm capitalize rounded-full border-gray-400"
          >
            {spec.categoryName}
          </Button>
        ))}
      </div>

      {/* Post section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          {selectedSpec
            ? `"${selectedSpec}" ангилалын нийтлэлүүд`
            : "Сүүлийн нийтлэлүүд"}
        </h2>
        {/* <GetPost selectedCategory={selectedSpec} /> */}
      </div>
    </div>
  );
};

export default ArticlesPage;
