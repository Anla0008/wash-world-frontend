import { FaRegAddressCard } from "react-icons/fa6";
import { IconProps } from "@/types/icons";

const ProfileCard = ({ color, size }: IconProps) => {
    return ( <FaRegAddressCard color={color} size={size} /> );
}
 
export default ProfileCard;