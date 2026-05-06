import { IoPersonSharp } from "react-icons/io5";
import { IconProps } from "@/types/icons";

const Profile = ({ color, size }: IconProps) => {
    return ( 
        <IoPersonSharp color={color} size={size} />
     );
}
 
export default Profile;