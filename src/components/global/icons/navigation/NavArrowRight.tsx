import { MdOutlineArrowRightAlt } from "react-icons/md";


interface NavArrowRightProps {
    color?: string;
    size?: string | number;
}

const NavArrowRight = ({color, size}: NavArrowRightProps) => {
    return ( <MdOutlineArrowRightAlt color={color} size={size} /> );
}
 
export default NavArrowRight;