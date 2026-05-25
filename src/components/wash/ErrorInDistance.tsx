"use client";
import NearestWashCard from "@/components/dashboard/NearestWash";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import { useWash } from "@/hooks/useWash";
import { useRouter } from "next/navigation";

const ErrorInDistance = () => {
            const router = useRouter();
            const { navigateBasedOnStatus } = useWash();

            const handleNavigation = async () => {
                const route = await navigateBasedOnStatus();
                router.push(route);
            };
    
    return (
        <div className="flex flex-col gap-10">

            <div className="flex flex-col gap-5">
                <h1 className="extra-bold">Ingen vaskehaller i nærheden</h1>

                <p>
                Du skal befinde dig på en af WashWorlds lokationer for at kunne starte en vask. <br />
                <span className="text-(--gray-60)">Sørg for, at din GPS er aktiveret, og at du har givet tilladelse til at dele din placering.</span>
                </p>

                <div className="flex flex-col gap-3 items-center p-5 border rounded-md border-(--gray-60)">
                    <PrimaryButton onClick={handleNavigation} >Fortsæt</PrimaryButton>
                    <p className="max-w-md text-sm text-(--gray-60)">Denne knap er kun beregnet til test og bruges ikke i det normale brugerflow.</p>
                </div>
            </div>

            <div className="flex flex-col justify-baseline">
                <NearestWashCard />
            </div>

        </div>
      );
}
 
export default ErrorInDistance;