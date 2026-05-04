import { MdLocalCarWash } from "react-icons/md";

type WashProps = {
    color?: string;
    size?: number;
};

const Wash = ({ color, size }: WashProps) => {
    return ( <MdLocalCarWash color={color} size={size} /> );
}
 
export default Wash;