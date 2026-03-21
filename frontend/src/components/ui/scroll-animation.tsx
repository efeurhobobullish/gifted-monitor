import React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface ScrollAnimationProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  once?: boolean;
  amount?: number;
  margin?: string;
  duration?: number;
  delay?: number;
}

export default function ScrollAnimation({
  children,
  ...props
}: ScrollAnimationProps) {
  const {
    once = false,
    amount = 0.3,
    margin = "-50px",
    duration = 0.6,
    delay = 0.3,
    ...rest
  } = props;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once,
        amount,
        margin,
      }}
      transition={{ duration, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
