import { IoIosArrowUp } from "react-icons/io";


interface ArrowUpProps {
    color?: string;
    size?: string | number;
}

const ArrowUp = ({color, size}: ArrowUpProps) => {
    return ( <IoIosArrowUp color={color} size={size} />
 );
}
export default ArrowUp;