import Checkmark from "../global/icons/grafik/Checkmark";
import PrimaryButton from "../global/buttons/onClick/PrimaryButton";
import SecondaryButtonAnchorTag from "../global/buttons/anchortag/SecondaryButtonAnchorTag";
import Swipe from "../global/buttons/onClick/Swipe";
import Image from "next/image";
import { SingleViewCardProps } from "@/types/washType";

const SingleViewCard = ({ wash, isSubscription, onSelect }: SingleViewCardProps) => {

    return (
        <div className="space-y-6">
            <h1 className="extra-bold">
                <span className="foreground">{wash.name}</span>
                <span className="text-(--brand-green)"> - {wash.sub_title}</span>
            </h1>

            <p>{wash.description}</p>
            <Image src={`/images/${wash.image}`} alt={wash.name} width={500} height={300} className="w-full items-center"/>

            <div>
                <h2 className="extra-bold">Det får du med {wash.name}</h2>
            <div className="grid grid-cols-2">
                {wash.checkmarks.map((checkmark, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Checkmark size={20} color="var(--brand-green)" />
                        <span>{checkmark}</span>
                    </div>
                ))}
            </div>
            </div>
        
        <div className="ml-auto flex flex-col items-end text-right">
            <div className="flex gap-2 items-baseline">
                <h1 className="extra-bold">{isSubscription ? wash.price_subscription : wash.price_single}</h1>
                <span>kr.</span>
            </div>
            {isSubscription ? null : <p className="text-sm">Eller for {wash.price_subscription} kr./pr. måned ubegrænset</p>}
            {isSubscription ? 
              (
                <Swipe onComplete={onSelect}>Køb abonnement</Swipe>
              )
            : (
            <div className="flex py-2 gap-2">
                <SecondaryButtonAnchorTag href={`/subscription-single-view/${wash.id}`} >Køb abonnement</SecondaryButtonAnchorTag>
                <PrimaryButton onClick={onSelect}>Vælg vask</PrimaryButton>
            </div>
            )}
        </div>
        
        </div>
    );
};
 
export default SingleViewCard;