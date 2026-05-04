import { IoSearchSharp } from "react-icons/io5";

type SearchProps = {
    color?: string;
    size?: number;
};

const Search = ({ color, size }: SearchProps) => {
    return ( <IoSearchSharp color={color} size={size} /> );
}
 
export default Search;