import { IoIosArrowBack } from "react-icons/io";

interface ArrowLeftProps {
    color?: string;
    size?: string | number;
}

const ArrowLeft = ({color, size}: ArrowLeftProps) => {
    return ( <IoIosArrowBack color={color} size={size} />
 );
}
export default ArrowLeft;