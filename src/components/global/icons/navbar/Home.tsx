import { IoHomeSharp } from "react-icons/io5";
type HomeProps = {
    color?: string;
    size?: number;
};

const Home = ({ color, size }: HomeProps) => {
    return ( <IoHomeSharp color={color} size={size} /> );
}
 
export default Home;