"use client";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { useState } from "react";
import { IconProps } from "@/types/icons";


const Eye = ({ color, size, isVisible }: IconProps) => {
    const [visible, setVisible] = useState(isVisible);

    const toggleVisibility = () => {
        setVisible(!visible);
    }

    return ( 
        <>
         {visible ? <IoEyeOutline color={color} size={size} onClick={toggleVisibility} /> : <IoEyeOffOutline color={color} size={size} onClick={toggleVisibility} />}
        </>
    );
}
 
export default Eye;