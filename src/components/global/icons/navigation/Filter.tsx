import { IoFilter } from "react-icons/io5";

type FilterProps = {
    color?: string;
    size?: number;
};

const Filter = ({ color, size }: FilterProps) => {
    return ( <IoFilter color={color} size={size} /> );
}
 
export default Filter;