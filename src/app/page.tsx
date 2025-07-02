// "use client";

// import { useGetSpecializationsQuery } from "@/generated";
// import { useAuth } from "@clerk/nextjs";

// const LawyerPendingPage = async () => {
//   const { getToken } = useAuth();
//   const clerkToken = await getToken();
//   console.log(clerkToken);

//   const { data } = useGetSpecializationsQuery();

//   console.log("dvsv", data);

//   return <div></div>;
// };

// export default LawyerPendingPage;

import { SignedOut } from "@clerk/nextjs";
import MainPage from "./(landing-page)/MainPage";

const homepage = () => {
  return (
    <div>
      <SignedOut>
        <MainPage />
      </SignedOut>
    </div>
  );
};

export default homepage;
