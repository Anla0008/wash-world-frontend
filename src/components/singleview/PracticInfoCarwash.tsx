import CarWash from "../global/icons/grafik/CarWash";

const PracticInfoCarwash = ({
  car_wash_hall_number,
}: {
  car_wash_hall_number: number;
}) => {
  return (
    <section className="bg-(--gray-60) p-6 rounded-md flex flex-col items-center gap-4 text-center">
      <CarWash size={100} />
      <p>{car_wash_hall_number} vaskehaller</p>
    </section>
  );
};

export default PracticInfoCarwash;
