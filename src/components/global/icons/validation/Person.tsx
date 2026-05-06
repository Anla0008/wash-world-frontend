import { IoPersonOutline } from "react-icons/io5";
import { IconProps } from "@/types/icons";

const Person = ({ color, size }: IconProps) => {
    return ( <IoPersonOutline color={color} size={size} /> );
}
 
export default Person;