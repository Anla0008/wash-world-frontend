"use client";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { IconProps } from "@/types/icons";


const Eye = ({ color, size, isVisible, onClick }: IconProps) => {
    return (
        <>
         {isVisible ? <IoEyeOutline color={color} size={size} onClick={onClick} /> : <IoEyeOffOutline color={color} size={size} onClick={onClick} />}
        </>
    );
}
 
export default Eye;