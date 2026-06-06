"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import WashWorldLogo from "@/components/global/icons/grafik/WashWorldLogo";

export default function Verify({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = use(params);
  const router = useRouter();
  const { verify } = useAuth();

  useEffect(() => {
    async function handleVerify() {
      // Kalder verify-funktionen med key og venter på, at den er færdig, før den fortsætter.
      await verify(key);
      // Når verifikationen er gennemført, omdirigeres brugeren til forsiden ("/").
      router.push("/");
    }
    handleVerify();
  }, []);

  return (
    <section className="text-center">
      <WashWorldLogo />
      <h1 className="pb-8">Verificerer din konto...</h1>
      <p>Du bliver sendt videre om et øjeblik.</p>
    </section>
  );
}
