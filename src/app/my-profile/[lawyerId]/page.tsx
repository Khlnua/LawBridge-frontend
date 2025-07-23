import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LawyerProfileHeader } from "./tabs";
import SidebarTabs from "./tabs/Tabs";

const LawyerProfilePageForLawyers = async ({ params }: { params: { lawyerId: string } }) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { lawyerId: requestedLawyerId } = await params;
  const loggedInUserId = user.id;

  if (loggedInUserId !== requestedLawyerId) {
    redirect("/unauthorized");
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6 border-none">
      <LawyerProfileHeader lawyerId={requestedLawyerId} />
      <SidebarTabs />
    </div>
  );
};

export default LawyerProfilePageForLawyers;
