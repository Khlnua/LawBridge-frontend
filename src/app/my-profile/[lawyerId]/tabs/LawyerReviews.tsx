"use client";

interface Review {
  client: string;
  rating: number;
  comment: string;
  date: string;
}

export const LawyerReviews = () => {
  // Fake review data
  const reviews: Review[] = [
    {
      client: "А. Батболд",
      rating: 5,
      comment: "Маш туршлагатай, үр дүнтэй зөвлөгөө өгсөн.",
      date: "2025-07-01",
    },
    {
      client: "С. Энхжин",
      rating: 4,
      comment: "Хурдан хариу өгсөн. Сэтгэл хангалуун байна.",
      date: "2025-06-28",
    },
  ];

  const totalClients = 22; // simulate number of unique clients

  // Badge logic
  let badge = "";
  let nextLevel = "";
  const current = totalClients;
  let max = 50;

  if (totalClients >= 50) {
    badge = "🏆 Elite Lawyer";
    max = 50;
  } else if (totalClients >= 20) {
    badge = "🥈 Pro Lawyer";
    nextLevel = "Elite Lawyer";
    max = 50;
  } else if (totalClients >= 10) {
    badge = "🥉 Good Lawyer";
    nextLevel = "Pro Lawyer";
    max = 20;
  } else {
    badge = "🔰 Шинэ өмгөөлөгч";
    nextLevel = "Good Lawyer";
    max = 10;
  }

  const progressPercent = Math.min((current / max) * 100, 100);

  return (
    <div className="p-8 space-y-8">
      <div className="bg-slate-50 rounded-2xl p-8 border border-gray-100">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Амжилтын түвшин</h2>
            <p className="text-gray-600">
              Нийт <span className="font-bold text-[#003366]">{totalClients}</span> захиалагч
            </p>
          </div>

          <div className="inline-flex items-center bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-bold text-[#003366]">{badge}</span>
          </div>

          {nextLevel && (
            <div className="text-gray-600">
              Дараагийн түвшин: <span className="font-semibold text-[#003366]">{nextLevel}</span>
            </div>
          )}

          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{current}</span>
              <span>{max}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-[#003366] h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Үйлчлүүлэгчдийн сэтгэгдэл</h2>

        <div className="grid gap-4">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-[#003366] font-medium">{review.client.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{review.client}</h4>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, starIndex) => (
                    <span key={starIndex} className={`text-lg ${starIndex < review.rating ? "text-yellow-400" : "text-gray-300"}`}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
