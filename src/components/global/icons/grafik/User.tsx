import { IoPerson } from "react-icons/io5";
import { IconProps } from "@/types/icons";

const User = ({ color, size }: IconProps) => {
  return <IoPerson color={color} size={size} />;
};

export default User;
