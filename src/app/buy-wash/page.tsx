import ProgressBar from "@/components/global/grafik/ProgressBar";
import SingleWash from "@/components/wash/SingleWash";

const BuyWash = () => {
  return (
    <div>
      <ProgressBar activeIndex={1} isWashProcess={true} />
      <SingleWash isSubscription={false} />
    </div>
  );
};

export default BuyWash;
