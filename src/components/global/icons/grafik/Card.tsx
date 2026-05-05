import { IoCardOutline } from "react-icons/io5";

type CardProps = {
    color?: string;
    size?: number;
};

const Card = ({ color, size }: CardProps) => {
    return ( <IoCardOutline color={color} size={size} /> );
}
 
export default Card;