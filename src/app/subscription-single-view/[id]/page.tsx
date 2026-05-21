"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";
import SingleViewCard from "@/components/vask/SingleView";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";

export default function SubscriptionSingleView() {
  const { useSingleWash } = useWash();
  const { setSelectedWash } = useWashStore();
  const { data } = useSingleWash();

  const { id } = useParams();
  const router = useRouter();

  const wash = data?.types.find((wash) => String(wash.id) === String(id));

  if (!data) {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-foreground">
        <p>Indlæser vask...</p>
      </main>
    );
  }

  if (!wash) {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-foreground">
        <p>Vasken blev ikke fundet.</p>

        <Link href="/buy-wash" className="mt-4 inline-block underline">
          Tilbage til oversigt
        </Link>
      </main>
    );
  }

  const handleSelectWash = () => {
    setSelectedWash(wash);
    router.push("/waiting-line");
  };
  return (
    <>
     <Link href="/buy-wash" className="mt-4 underline flex items-center gap-2">
            <ArrowLeft size={20} color="var(--foreground)" />
      </Link>
    <SingleViewCard wash={wash} isSubscription={true} onSelect={handleSelectWash} />
    </>
  );
}
