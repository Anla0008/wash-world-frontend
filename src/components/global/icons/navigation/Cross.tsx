import { RxCross2 } from "react-icons/rx";
import { IconProps } from "@/types/icons";

const Cross = ({ color, size }: IconProps) => {
  return (
    <div className="flex justify-end">
      <RxCross2 color={color} size={size} />
    </div>
  );
};
export default Cross;
