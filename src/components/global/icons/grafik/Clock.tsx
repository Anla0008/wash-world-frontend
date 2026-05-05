import { CiClock2 } from "react-icons/ci";

interface ClockProps {
    color?: string;
    size?: string | number;
}

const Clock = ({color, size}: ClockProps) => {
    return ( <CiClock2 color={color} size={size} /> );
}
 
export default Clock;