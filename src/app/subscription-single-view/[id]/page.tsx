import SubscriptionSingleViewPage from "@/components/wash/SubscriptionSingleViewPage";

type SubscriptionSingleViewProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubscriptionSingleView({ params }: SubscriptionSingleViewProps) {
  const { id } = await params;

  return <SubscriptionSingleViewPage id={id} />;
}
