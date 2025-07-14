import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LawyerProfileHeader } from "./tabs"; 
import Tabs from "./tabs/Tabs";

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
    <div className="w-full px-4 py-8 flex flex-col items-center space-y-6">
      <LawyerProfileHeader />
      <Tabs />
    </div>

  );
};

export default LawyerProfilePageForLawyers;
