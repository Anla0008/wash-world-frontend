import HistorikCard from "@/components/profil/HistorikCard";

export default async function Vaskehistorik() {
  const res = await fetch("http://localhost:5000/wash-history/2"); // Skift 2 ud med brugerens pk fra JWT
  const data = await res.json();

  return (
    <div>
      <h1 className="extra-bold">Vaskehistorik</h1>
      <div className="flex flex-col gap-3">
        {data.history.map((wash: any) => (
          <HistorikCard key={wash.car_wash_history_pk} location={wash.location_name} date={new Date(wash.date_of_wash).toLocaleDateString("da-DK")} description={wash.car_wash_type} price={wash.car_wash_price} points={wash.car_wash_price} href={`/historik/${wash.car_wash_history_pk}`} />
        ))}
      </div>
    </div>
  );
}
