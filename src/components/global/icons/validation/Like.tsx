"use client"
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";

import { useState } from "react";
import { IconProps } from "@/types/icons";

const Like = ({ color, size }: IconProps) => {
    const [liked, setLiked] = useState(false);

    const toggleLike = () => {
        setLiked(!liked);
    };

    return (
        <>
        {liked ? (
            <IoIosHeart color={color} size={size} onClick={toggleLike} />
        ) : (
            <IoIosHeartEmpty color={color} size={size} onClick={toggleLike}/>
        )}
        </>

    );
}
 
export default Like;