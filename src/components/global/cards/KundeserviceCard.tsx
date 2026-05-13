const KundeserviceCard = () => {
  return (
    <div className="bg-foreground text-background p-4 rounded-md min-w-100 flex flex-col gap-2">
      <h3 className="extra-bold">Kontakt os</h3>
      <div className="flex justify-between">
        <p>Kundeservice</p>
        <a href="mailto:kundeservice@washworld.dk">kundeservice@washworld.dk</a>
      </div>
    </div>
  );
};

export default KundeserviceCard;
