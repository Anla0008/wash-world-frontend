import { IoPersonSharp } from "react-icons/io5";

type ProfileProps = {
    color?: string;
    size?: number;
};

const Profile = ({ color, size }: ProfileProps) => {
    return ( 
        <IoPersonSharp color={color} size={size} />
     );
}
 
export default Profile;