import { IoIosArrowForward } from "react-icons/io";
interface ArrowRightProps {
    color?: string;
    size?: string | number;
}

const ArrowRight = ({color, size}: ArrowRightProps) => {
    return ( <IoIosArrowForward color={color} size={size} />
 );
}
export default ArrowRight;