import Verify from "@/components/authentication/Verify";

const VerifyPage = ({ params }: { params: Promise<{ key: string }> }) => {
  return <Verify params={params} />;
};

export default VerifyPage;
