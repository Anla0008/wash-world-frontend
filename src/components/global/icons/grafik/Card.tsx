import { IoCardOutline } from "react-icons/io5";
import { IconProps } from "@/types/icons";

const Card = ({ color, size }: IconProps) => {
    return ( <IoCardOutline color={color} size={size} /> );
}
 
export default Card;