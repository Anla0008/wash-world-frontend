import PrimaryButtonAnchorTag from "../buttons/anchortag/PrimaryButtonAnchorTag";
import { WashType } from "@/types/washType";
import { useWash } from "@/hooks/useWash";
import Checkmark from "../icons/grafik/Checkmark";

const SubscriptionCard = ({ washData }: { washData: WashType[] }) => {
  const { useSingleWash } = useWash();

  const { data } = useSingleWash();

  if (!data) return null;

  return (
    <section className="max-w-lg w-full flex gap-6 overflow-x-auto scroll-smooth hide-scrollbar py-8">
      {data.types.map((wash) => (
        <article
          key={wash.id}
          className={`bg-(--gray-60) w-52 h-72 rounded-md flex flex-col gap-2 items-center justify-center shrink-0 ${
            wash.is_popular ? "relative" : ""
          }`}
        >
          {wash.is_popular && (
            <div className="absolute -top-6 right-1 bg-(--splash) px-2 py-1 z-10">
              Populær!
            </div>
          )}

          <p className="extra-bold mt-2">{wash.name}</p>

          <div className="flex items-baseline gap-2">
            <h1 className="extra-bold">{wash.price_subscription}</h1>
            <p>kr./md.</p>
          </div>

          <p className="pb-2">{wash.sub_title}</p>
          <ul>
            {wash.checkmarks.slice(0, 3).map((checkmark, index) => (
              <li key={index} className="text-sm flex items-center gap-2">
                <Checkmark size={16} color="var(--brand-green)" />
                {checkmark}
              </li>
            ))}
          </ul>

          <PrimaryButtonAnchorTag href={`/subscription-single-view/${wash.id}`}>
            Læs mere
          </PrimaryButtonAnchorTag>
        </article>
      ))}
    </section>
  );
};

export default SubscriptionCard;
