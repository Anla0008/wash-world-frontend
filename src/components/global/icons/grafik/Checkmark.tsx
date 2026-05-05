import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface CheckmarkProps {
    color?: string;
    size?: number;
}

const Checkmark = ({ color, size }: CheckmarkProps) => {
    return ( <IoMdCheckmarkCircleOutline color={color} size={size} />
 );
}
 
export default Checkmark;