import { IoPersonOutline } from "react-icons/io5";
type PersonProps = {
    color?: string;
    size?: number;
};

const Person = ({ color, size }: PersonProps) => {
    return ( <IoPersonOutline color={color} size={size} /> );
}
 
export default Person;