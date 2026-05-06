import { FaLocationPin } from "react-icons/fa6";
import { IconProps } from "@/types/icons";

const Map = ({ color, size }: IconProps) => {
    return (
    <div className="relative">
        <h3 className="absolute text-forground extra-bold left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">W</h3>
        <FaLocationPin color={color} size={size} /> 
    </div>
    );
}
 
export default Map;