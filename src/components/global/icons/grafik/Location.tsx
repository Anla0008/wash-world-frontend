import { IoLocationOutline } from "react-icons/io5";

interface LocationProps {
    color?: string;
    size?: string | number;
}

const Location = ({color, size}: LocationProps) => {
    return ( <IoLocationOutline color={color} size={size} /> );
}
export default Location;