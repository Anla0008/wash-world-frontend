import { IoMailOutline } from "react-icons/io5";
type MailProps = {
    color?: string;
    size?: number;
};

const Mail = ({ color, size }: MailProps) => {
    return ( <IoMailOutline color={color} size={size} /> );
}
 
export default Mail;