"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const Timer = () => {
    return (
    <motion.div className="h-30 w-30 rounded-full">

            <div
                className="absolute  w-30 h-30 rounded-full border-6 animate-pulse"
                style={{
                boxShadow: "0 0 14px #06C167, 0 0 60px #06C16788, inset 0 0 14px #06C16722",
                }}
            >

            </div>
    </motion.div>
);
}
 
export default Timer;