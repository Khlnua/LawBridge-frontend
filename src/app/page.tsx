import { SignedOut, SignIn } from "@clerk/nextjs";
import MainPage from "./(landing-page)/MainPage";

const homepage = () => {
  return (
    <div>
        <MainPage />
    </div>
  );
};

export default homepage;
