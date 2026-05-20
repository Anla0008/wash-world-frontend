import NavArrowRight from "../icons/navigation/NavArrowRight";

const KundeserviceCard = () => {
  return (
    <div className="bg-(--gray-10) text-(--foreground-reverse) p-4 rounded-md flex flex-col gap-2">
      <h3 className="extra-bold">Kundeservice</h3>
      <a href="/skaderapportering" className="flex justify-between">
        <span>Skaderapportering</span>
        <NavArrowRight size={30} />
      </a>
      <div className="flex pt-4 gap-1 small text-(--gray-60)">
        <p>Kontakt os:</p>
        <a href="mailto:kundeservice@washworld.dk" className="underline">
          kundeservice@washworld.dk
        </a>
      </div>
    </div>
  );
};

export default KundeserviceCard;
