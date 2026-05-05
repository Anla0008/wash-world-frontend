"use client"
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";

import { useState } from "react";
interface LikeProps {
    color?: string;
    size?: string | number;
}

const Like = ({ color, size }: LikeProps) => {
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