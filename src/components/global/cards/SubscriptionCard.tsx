import PrimaryButtonAnchorTag from "../buttons/anchortag/PrimaryButtonAnchorTag";
import { useWash } from "@/hooks/useWash";
import Checkmark from "../icons/grafik/Checkmark";
import { useSubscriptionStatus } from "@/lib/wash/resolvers";


// Henter wash data fra useWash hook og viser abonnementskort
const SubscriptionCard = () => {
  const { useSingleWash } = useWash();
  const { data } = useSingleWash();
  const userSub = useSubscriptionStatus();

  if (!data) return null;

  return (
    <section className="max-w-lg w-full flex gap-6 overflow-x-auto scroll-smooth hide-scrollbar py-8">
      {data.types.map((washType) => {
        const isCurrentSubscription = userSub.hasSub && userSub.subType?.toLowerCase() === washType.name.toLowerCase();

        return (
       <article
          key={washType.id}
          className="relative bg-(--gray-60) w-52 h-72 rounded-md flex flex-col gap-2 items-center justify-center shrink-0"
        >
          {!userSub.hasSub && washType.is_popular && (
            <div className="absolute -top-6 right-2 bg-(--splash) px-2 py-1 z-5">
              Populær!
            </div>
          )}
          
          {isCurrentSubscription && (
            <div className="absolute -top-6 -right-2 bg-(--splash) px-2 py-1 z-5">
              Nuværende abonnement
            </div>
          )}

          <p className="extra-bold mt-2">{washType.name}</p>

          <div className="flex items-baseline gap-2">
            <h1 className="extra-bold">{washType.price_subscription}</h1>
            <p>kr./md.</p>
          </div>

          <p className="pb-2">{washType.sub_title}</p>
          <ul>
            {washType.checkmarks.slice(0, 3).map((checkmark, index) => (
              <li key={index} className="text-sm flex items-center gap-2">
                <Checkmark size={16} color="var(--brand-green)" />
                {checkmark}
              </li>
            ))}
          </ul>
            {userSub.hasSub && !isCurrentSubscription ?(
              
          <PrimaryButtonAnchorTag href={`/subscription-single-view/${washType.id}`}>
            Opdater
          </PrimaryButtonAnchorTag>
            ):
            <PrimaryButtonAnchorTag href={`/subscription-single-view/${washType.id}`}>
              Læs mere
            </PrimaryButtonAnchorTag>
            }
        </article>
      )})}
    </section>
  );
};

export default SubscriptionCard;
