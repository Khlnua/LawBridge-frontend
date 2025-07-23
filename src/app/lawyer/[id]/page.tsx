import LawyerProfile from "./LawyerProfile";

export default function LawyerPage({ params }: { params: { id: string } }) {
  return <LawyerProfile lawyerId={params.id} />;
}
