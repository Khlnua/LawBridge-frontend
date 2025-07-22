import { useState } from "react";
import { LawyerCard } from "./LawyerCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Users, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; 
import { useQuery, useMutation } from "@apollo/client";
import { GET_PENDING_REQUESTS, APPROVE_LAWYER, REJECT_LAWYER } from "@/graphql/lawyerApproval";

// https://chatgpt.com/c/687f752a-9d54-8008-8257-bc99a53395cf

const mockLawyers = [
  {
    id: "1",
    name: "Сампил Ганболд",
    email: "samba@lawfirm.com",
    phone: "+976 9999-9999",
    licenseNumber: "LIC-2024-001",
    barAdmission: "МУИС, 2018",
    specialization: ["Үндсэн хууль", "Гэрээний эрх зүй", "Нийлмэл эрх зүй болон Буруутгал"],
    yearsExperience: 6,
    location: "Улаанбаатар, Монгол",
    status: "pending" as const,
    applicationDate: "2024-01-15",
    avatar: undefined,
  },
  {
    id: "2",
    name: "Магнай Раднаа",
    email: "mr.Radnaa@legalservices.com",
    phone: "+976 9987-6543",
    licenseNumber: "LIC-2024-002",
    barAdmission: "МУИС, 2015",
    specialization: ["Гэмт хэргийн хамгаалалт", "Иргэний эрх"],
    yearsExperience: 9,
    location: "Улаанбаатар, Монгол",
    status: "approved" as const,
    applicationDate: "2024-01-12",
    avatar: undefined,
  },
  {
    id: "3",
    name: "Эрэгмаа Рагчаа",
    email: "emily.r@familylaw.org",
    phone: "+976 9456-7890",
    licenseNumber: "LIC-2024-003",
    barAdmission: "Шихихутуг, 2020",
    specialization: ["Гэр бүлийн эрх зүй", "Гэрлэлт эрх зүй", "Хүүхдийн асрамж"],
    yearsExperience: 4,
    location: "Улаанбаатар, Монгол",
    status: "pending" as const,
    applicationDate: "2024-01-18",
    avatar: undefined,
  },
  {
    id: "4",
    name: "Дарлиг Жамбал",
    email: "david.kim@patentlaw.com",
    phone: "+976 9321-0987",
    licenseNumber: "LIC-2024-004",
    barAdmission: "Этүгэн, 2012",
    specialization: ["Оюуны өмч", "Патентын эрх зүй", "Технологийн эрх зүй"],
    yearsExperience: 12,
    location: "Улаанбаатар, Монгол",
    status: "rejected" as const,
    applicationDate: "2024-01-10",
    avatar: undefined,
  },
];

export function LawyerApprovalDashboard() {
  const [lawyers, setLawyers] = useState(useQuery);
  const { toast } = useToast();
  const { data, loading, error, refetch } = useQuery(GET_PENDING_REQUESTS);
  const [approveLawyer] = useMutation(APPROVE_LAWYER);
  const [rejectLawyer] = useMutation(REJECT_LAWYER);

    const handleApprove = async (id: string) => {
    await approveLawyer({ variables: { id } });
    toast({ title: "Амжилттай", description: "Хуульчийг баталгаажууллаа." });
    refetch();
    };
    
    const lawyer = lawyers.find(l => l.id === id);
    toast({
      title: "Хуульч баталгаажсан",
      description: `${lawyer?.name} Амжилттай баталгаажлаа.`,
    });
  };

    const handleReject = async (id: string) => {
    await rejectLawyer({ variables: { id } });
    toast({ title: "Татгалзсан", description: "Хүсэлтийг цуцаллаа." });
    refetch();

  };
    
    const lawyer = lawyers.find(l => l.id === id);
    toast({
      title: "Хуульчийн хүсэлт татгалзсан",
      description: `${lawyer?.name} -ийн хүсэлт татгалзлаа.`,
    });
  };

  const stats = {
    total: lawyers.length,
    pending: lawyers.filter(l => l.status === "pending").length,
    approved: lawyers.filter(l => l.status === "approved").length,
    rejected: lawyers.filter(l => l.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 shadow-elevated">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-primary-foreground/80 text-lg">
            Хуульч Өмгөөлөгчийн хүсэлтүүдийг хянах, батлах
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6"> 
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Нийт Хуульчид
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Хүлээгдэж буй
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
              <Badge variant="secondary" className="mt-1">
                Үйлдэл хүлээгдэж байна
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Баталгаажсан
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Татгалзсан
              </CardTitle>
              <div className="h-4 w-4 bg-destructive rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lawyers Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Хуульчийн хүсэлтүүд
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}