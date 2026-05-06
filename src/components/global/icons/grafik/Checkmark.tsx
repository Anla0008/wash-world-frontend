import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IconProps } from "@/types/icons";

const Checkmark = ({ color, size }: IconProps) => {
    return ( <IoMdCheckmarkCircleOutline color={color} size={size} />
 );
}
 
export default Checkmark;