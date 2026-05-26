import WashHistory from "@/components/profil/WashHistorySingle";

const WashHistorySinglePage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return <WashHistory params={params} />;
};

export default WashHistorySinglePage;
