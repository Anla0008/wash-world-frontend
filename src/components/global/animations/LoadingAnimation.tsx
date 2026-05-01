"use client";

import { motion } from "motion/react";
import { useState } from "react";

const LoadingAnimation = () => {
    const [isAnimating, setIsAnimating] = useState(true);

    const progress = {
        from: { scaleY: 1 },
        to: { scaleY: 0 },
    };
    {/* #TODO: få animationen duration til at svare til loading state*/}
    const transition = {
        duration: isAnimating ? 1 : 0,
        repeat: false,
        ease: "easeInOut",
    };

    return ( 
        <motion.div className="top-9 left-0 absolute w-1 p-2 bg-foreground"></motion.div>
     );
}
 
export default LoadingAnimation;