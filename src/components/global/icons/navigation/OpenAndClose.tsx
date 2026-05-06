"use client";

import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { IconProps } from "@/types/icons";

interface OpenAndCloseProps extends IconProps {
  isOpen?: boolean;
}

const OpenAndClose = ({ color, size, isOpen }: IconProps) => {
  return (
    <motion.div
      animate={{
        rotate: isOpen ? 0 : 45,
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
