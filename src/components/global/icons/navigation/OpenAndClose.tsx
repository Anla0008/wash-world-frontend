"use client";

import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

interface OpenAndCloseProps {
    color?: string;
    size?: string | number;
    isOpen?: boolean;
}

const OpenAndClose = ({
    color,
    size,
    isOpen,
}: OpenAndCloseProps) => {
    return (
        <motion.div
            animate={{
                rotate: isOpen ? 45 : 0,
            }}
            transition={{
                duration: 0.3,
                ease: "easeInOut",
            }}
        >
            <IoMdClose color={color} size={size} />
        </motion.div>
    );
};

export default OpenAndClose;