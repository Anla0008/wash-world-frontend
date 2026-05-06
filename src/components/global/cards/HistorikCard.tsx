import ArrowRight from "../icons/navigation/ArrowRight";
import PointBadge from "../grafik/PointBadge";

// Værdierne her skal hentes dynamisk ind fra wash_history db tabel

const HistorikCard = () => {
  return (
    <div className="p-3 bg-(--gray-10) text-(--foreground-reverse) rounded-md flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="extra-bold">Højbjerg</h3>
        <PointBadge points={15} />
      </div>
      <p>12-01-2026</p>
      <p>Brilliant</p>
      <div className="flex justify-between items-center">
        <h3>189 DKK</h3>
        <ArrowRight size={20}></ArrowRight>
      </div>
    </div>
  );
};

export default HistorikCard;
