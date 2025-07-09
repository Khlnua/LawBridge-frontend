"use client"

import { Button, GetPost } from "@/components"
import { specializations } from "../(create-lawyer-profile)/lawyer-form/utils/specializations"

const ArticlesPage = () => {
  return (
    <div className="px-6 md:px-20 py-10 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800">Нийтлэлүүд</h1>

      {/* Specialization filter buttons */}
      <div className="flex flex-wrap gap-3">
        {specializations.map((spec, index) => (
          <Button key={index} variant="outline" className="text-sm capitalize rounded-full border-gray-400">
            {spec}
          </Button>
        ))}
      </div>

      {/* Post section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Сүүлийн нийтлэлүүд</h2>
        <GetPost />
      </div>
    </div>
  )
}

export default ArticlesPage
