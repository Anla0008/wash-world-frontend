// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { Location } from "@/types/locations";
// import VaskehalCard from "@/components/global/cards/VaskehalCard";

// export default function FindVaskehal() {
//   const { getLocations } = useAuth();
//   const [locations, setLocations] = useState<Location[]>([]);

//   useEffect(() => {
//     async function loadLocations() {
//       const data = await getLocations();
//       setLocations(data);
//     }

//     loadLocations();
//   }, [getLocations]);

//   return (
//     <main className="w-full">
//       <section className="flex w-full flex-col gap-5">
//         {locations.map((location) => (
//           <VaskehalCard key={location.location_pk} city={location.location_city} address={location.location_address} openingHours="07 - 22" image={location.location_img} href="#" location_pk={""} />
//         ))}
//       </section>
//     </main>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { Location } from "@/types/locations";
// import FindVaskehalBottomSheet from "@/components/findVaskehal/FindVaskehalBottomSheet";

// export default function FindVaskehal() {
//   const { getLocations } = useAuth();
//   const [locations, setLocations] = useState<Location[]>([]);

//   useEffect(() => {
//     async function loadLocations() {
//       const data = await getLocations();
//       setLocations(data);
//     }

//     loadLocations();
//   }, [getLocations]);

//   return (
//     <main className="relative h-dvh w-full overflow-hidden bg-background text-foreground">
//       {/* Baggrund / senere Google Maps */}
//       <section className="absolute inset-0 bg-(--gray-80)">
//         <div className="p-5">
//           <h1>
//             <span className="light">Find</span> <span className="extra-bold">vaskehal</span>
//           </h1>

//           <p className="text-(--gray-10)">Her kan Google Maps senere ligge</p>
//         </div>
//       </section>

//       <FindVaskehalBottomSheet locations={locations} />
//     </main>
//   );
// }

"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/locations";
import FindVaskehalBottomSheet from "@/components/findVaskehal/FindVaskehalBottomSheet";

const FindVaskehalMap = dynamic(() => import("@/components/findVaskehal/FindVaskehalMap"), {
  ssr: false,
});

export default function FindVaskehal() {
  const { getLocations } = useAuth();

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationPk, setSelectedLocationPk] = useState<string | null>(null);

  useEffect(() => {
    async function loadLocations() {
      const data = await getLocations();
      setLocations(data);
    }

    loadLocations();
  }, [getLocations]);

  return (
    <main className="-mx-8 relative h-dvh overflow-hidden bg-background text-foreground">
      <section className="absolute inset-0 z-0 h-full w-full">
        <FindVaskehalMap locations={locations} onSelectLocation={(location) => setSelectedLocationPk(location.location_pk)} />
      </section>

      <FindVaskehalBottomSheet locations={locations} selectedLocationPk={selectedLocationPk} />
    </main>
  );
}
