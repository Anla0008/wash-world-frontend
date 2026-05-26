import ResetPassword from "@/components/authentication/ResetPassword";

const ResetPasswordPage = ({
  params,
}: {
  params: Promise<{ key: string }>;
}) => {
  return <ResetPassword params={params} />;
};

export default ResetPasswordPage;
