import { IoIosArrowDown } from "react-icons/io";
interface ArrowDownProps {
    color?: string;
    size?: string | number;
}

const ArrowDown = ({color, size}: ArrowDownProps) => {
    return ( <IoIosArrowDown color={color} size={size} />
 );
}
export default ArrowDown;