"use client";

import { useState } from "react";
import { Mail, Phone, Star, Clock, FileText } from "lucide-react";
import BookAppointmentModal from "@/components/booking/BookAppointmentModal";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Input, Button } from "@/components/ui";

const GET_AVAILABILITY = gql`
  query GetAvailability($lawyerId: String!) {
    getAvailability(lawyerId: $lawyerId) {
      day
      startTime
      endTime
      availableDays
    }
  }
`;

const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      lawyerId
      schedule
      status
      chatRoomId
    }
  }
`;

import { GET_LAWYER_BY_LAWYERID_QUERY } from "@/graphql/lawyer";
import { useQuery } from "@apollo/client";
import { use } from "react";


type Props = {
  params: Promise<{ id: string }>;
};

const LawyerProfile = ({ params }: Props) => {
  const { id } = use(params);

  const { data, loading, error } = useQuery(GET_LAWYER_BY_LAWYERID_QUERY, {
    variables: { lawyerId: id },
  });
  const lawyerData = data?.getLawyerById;

  const [activeTab, setActiveTab] = useState<"posts" | "reviews" | "book">(
    "posts"
  );
  const [appointmentStatus, setAppointmentStatus] = useState<string | null>(null);

  const lawyer = {

    name: lawyerData?.firstName + " " + lawyerData?.lastName,
    specialization: "Эрүүгийн эрх зүй, Гэр бүлийн эрх зүй",
    specializationId: "spec123", // placeholder
    location: "Улаанбаатар",
    email: lawyerData?.email,
    phone: "99112233",
    rating: 4.9,
    reviews: 27,
    avatar: "/lawyer-avatar.jpg",
    description:
      "10 жилийн туршлагатай, хууль зүйн салбарт үр дүнтэй зөвлөгөө өгдөг өмгөөлөгч.",
  };
  const clientId = "client123"; // placeholder, replace with real user id

  const { data: availabilityData, refetch } = useQuery<{
    getAvailability: Array<{
      day: string;
      startTime: string;
      endTime: string;
      availableDays: string[];
    }>;
  }>(GET_AVAILABILITY, { variables: { lawyerId: lawyer.id } });
  const [createAppointment, { loading: creating }] = useMutation(CREATE_APPOINTMENT);

  // Handler for creating appointment
  const handleCreateAppointment = async (day: string, startTime: string, endTime: string) => {
    try {
      await createAppointment({
        variables: {
          input: {
            clientId,
            lawyerId: lawyer.id,
            specializationId: lawyer.specializationId,
            slot: { day, startTime, endTime },
            notes: "", // Optionally add notes
          },
        },
      });
      setAppointmentStatus("Амжилттай захиаллаа!");
    } catch (err) {
      setAppointmentStatus("Захиалга үүсгэхэд алдаа гарлаа.");
    }

    avatar: process.env.R2_PUBLIC_DOMAIN + "/" + lawyerData?.profilePicture,
    description: "10 жилийн туршлагатай, хууль зүйн салбарт үр дүнтэй зөвлөгөө өгдөг өмгөөлөгч.",

  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg">Нийтлэлүүд</h3>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              📌 Эрүүгийн хэргүүдийн шийдвэрлэлт ба эрх зүйн зөвлөгөө
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              📌 Гэр бүл салалттай холбоотой анхаарах зүйлс
            </div>
          </div>
        );
      case "reviews":
        return (
          <div className="space-y-4 text-center">
            <h3 className="font-semibold text-lg">Үйлчлүүлэгчдийн сэтгэгдэл</h3>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              ⭐⭐⭐⭐⭐ — &quot;Маш найдвартай, үр дүнтэй зөвлөгөө өгсөн.
              Баярлалаа!&quot;
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              ⭐⭐⭐⭐ — &quot;Тодорхой тайлбарлаж, хурдан шийдсэн.&quot;
            </div>
          </div>
        );
      case "book":
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-center">Боломжит өдрүүд ба цагууд</h3>
            {appointmentStatus && (
              <div className="text-center text-green-600 font-semibold">{appointmentStatus}</div>
            )}
            <div className="flex flex-col gap-2 items-center">
              {availabilityData?.getAvailability.length ? (
                availabilityData.getAvailability.map((slot, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 rounded p-3 w-full max-w-md flex flex-col items-center cursor-pointer hover:bg-blue-100 transition"
                    onClick={() => handleCreateAppointment(slot.day, slot.startTime, slot.endTime)}
                  >
                    <span className="font-medium">{slot.day}</span>
                    <span>Эхлэх: {slot.startTime} — Дуусах: {slot.endTime}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Одоогоор боломжит цаг байхгүй байна.</div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full px-4 py-8 flex flex-col items-center space-y-6">
      {/* Profile Section */}
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-2xl flex flex-col items-center space-y-3">
        <img
          src={lawyer.avatar}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <h1 className="text-2xl font-bold text-center">{lawyer.name}</h1>
        <p className="text-green-700 font-medium text-center">
          {lawyer.specialization}
        </p>

        <div className="text-sm text-gray-500 text-center">
          <div className="flex items-center justify-center gap-2">
            <Mail size={16} />
            <span>{lawyer.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone size={16} />
            <span>{lawyer.phone}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            <Star size={16} />
            <span>{lawyer.rating} / 5.0</span>
            <span className="text-gray-500">({lawyer.reviews} сэтгэгдэл)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-1 px-5 py-2 rounded-md text-sm font-medium ${
            activeTab === "posts"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <FileText size={16} /> Posts
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-1 px-5 py-2 rounded-md text-sm font-medium ${
            activeTab === "reviews"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <Star size={16} /> Reviews
        </button>
        <button
          onClick={() => setActiveTab("book")}
          className={`flex items-center gap-1 px-5 py-2 rounded-md text-sm font-medium ${
            activeTab === "book"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <Clock size={16} /> Book
        </button>
      </div>

      {/* Tab content */}
      <div className="w-full max-w-2xl bg-white shadow rounded-xl p-6 flex justify-center">
        <div className="w-full">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default LawyerProfile;
