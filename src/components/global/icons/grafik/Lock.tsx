import { CiLock } from "react-icons/ci";

type LockProps = {
    color?: string;
    size?: number;
};  

const Lock = ({ color, size }: LockProps) => {
    return ( <CiLock color={color} size={size} /> );
}
 
export default Lock;