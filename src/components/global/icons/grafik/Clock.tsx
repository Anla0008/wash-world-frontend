import { CiClock2 } from "react-icons/ci";
import { IconProps } from "@/types/icons";

const Clock = ({color, size}: IconProps) => {
    return ( <CiClock2 color={color} size={size} /> );
}
 
export default Clock;