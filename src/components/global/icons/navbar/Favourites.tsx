"use client"

import { IoIosHeart } from "react-icons/io";
import { IconProps } from "@/types/icons";

const Favourites = ({ color, size }: IconProps) => {

    return (
        <IoIosHeart color={color} size={size} />
    );
}
 
export default Favourites;