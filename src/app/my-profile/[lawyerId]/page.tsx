import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LawyerProfileHeader } from "./tabs"; 
import SidebarTabs from "./tabs/Tabs";

type PageProps = {
  params: {
    lawyerId: string;
  };
};

const LawyerProfilePageForLawyers = async ({ params }: PageProps) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const loggedInUserId = user.id;
  const requestedLawyerId = params.lawyerId;

  if (loggedInUserId !== requestedLawyerId) {
    redirect("/unauthorized");
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6 border-none">
      <LawyerProfileHeader />
      <SidebarTabs />
    </div>
  );
  
};

export default LawyerProfilePageForLawyers;
