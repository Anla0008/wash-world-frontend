import VacuumCleaner from "../global/icons/grafik/VacummCleaner";

const PracticInfoVacuumCleaner = ({
  car_wash_vacuum,
}: {
  car_wash_vacuum: number;
}) => {
  return (
    <section className="bg-(--gray-60) p-6 rounded-md flex flex-col items-center gap-4">
      <VacuumCleaner size={100} />
      <p>{car_wash_vacuum} Støvsugere</p>
    </section>
  );
};

export default PracticInfoVacuumCleaner;
