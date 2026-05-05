import { FaRegAddressCard } from "react-icons/fa6";

type ProfileCardProps = {
    color?: string;
    size?: number;
};

const ProfileCard = ({ color, size }: ProfileCardProps) => {
    return ( <FaRegAddressCard color={color} size={size} /> );
}
 
export default ProfileCard;