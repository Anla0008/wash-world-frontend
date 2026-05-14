import { IoIosArrowBack } from "react-icons/io";
import { IconProps } from "@/types/icons";

const ArrowLeft = ({ color, size, onClick }: IconProps) => {
  return <IoIosArrowBack color={color} size={size} onClick={onClick} />;
};
export default ArrowLeft;
