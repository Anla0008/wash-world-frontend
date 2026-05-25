import Swipe from "@/components/global/buttons/onClick/Swipe";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import SingleWash from "@/components/wash/SingleWash";

const BuyWash = () => {
  return (
    <div className="flex flex-col gap-5">
      <ProgressBar activeIndex={1} isWashProcess={true} />
      <SingleWash />
    </div>
  );
};

export default BuyWash;
