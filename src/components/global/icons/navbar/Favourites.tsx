"use client"

import { IoIosHeart } from "react-icons/io";

interface FavouritesProps {
    color?: string;
    size?: string | number;
}

const Favourites = ({ color, size }: FavouritesProps) => {

    return (
        <IoIosHeart color={color} size={size} />
    );
}
 
export default Favourites;