import { RxCross2 } from "react-icons/rx";
import { IconProps } from "@/types/icons";

const Cross = ({ color, size, onClick }: IconProps) => {
  return (
    <div className="flex justify-end" onClick={onClick}>
      <RxCross2 color={color} size={size} />
    </div>
  );
};
export default Cross;
