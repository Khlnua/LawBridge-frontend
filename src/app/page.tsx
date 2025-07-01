import { currentUser } from "@clerk/nextjs/server";
import { useGetSpecializationsQuery } from "@/generated";
import { useAuth } from "@clerk/nextjs";

const LawyerPendingPage = async () => {
  const user = await currentUser();
  const userId = user?.id;
  const { getToken } = useAuth();
  const clerkToken = await getToken();
  console.log(clerkToken);

  const { data } = useGetSpecializationsQuery();

  console.log("dvsv", data);
  console.log();

  return <div>User ID: {userId}</div>;
};

export default LawyerPendingPage;
