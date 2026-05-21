import Link from "next/link";
import PointBadge from "../global/grafik/PointBadge";
import ArrowRight from "../global/icons/navigation/ArrowRight";
// Værdierne her skal hentes dynamisk ind fra wash_history db tabel

const HistoryCard = ({ location, date, description, price, points, href }: HistoryCardProps) => {
  return (
    <Link href={href} className="p-3 bg-(--gray-10) text-(--foreground-reverse) rounded-md flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="extra-bold">{location}</h3>
        <PointBadge points={points} />
      </div>
      <p>{date}</p>
      <p>{description}</p>
      <div className="flex justify-between items-center">
        <h3>{price} DKK</h3>
        <ArrowRight size={20} />
      </div>
    </Link>
  );
};

export default HistoryCard;
