import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps, TargetAndTransition } from "framer-motion";

export type ScrollRevealFrom = "left" | "right" | "up" | "down";

const OFFSET_X = 18;
const OFFSET_Y = 12;

const easeOut = [0.2, 0.8, 0.2, 1] as const;

/** Alternate slide direction for grids / lists (even = left, odd = right). */
export function scrollRevealFromIndex(index: number): "left" | "right" {
  return index % 2 === 0 ? "left" : "right";
}

/**
 * Capped stagger delay for list items (scroll-in). Centralizes timing so pages
 * don’t repeat Math.min(index * step, cap) everywhere.
 */
export function scrollRevealStaggerDelay(
  index: number,
  options?: { step?: number; cap?: number },
): number {
  const step = options?.step ?? 0.04;
  const cap = options?.cap ?? 0.12;
  return Math.min(index * step, cap);
}

function motionForDirection(
  from: ScrollRevealFrom,
  reducedMotion: boolean,
): { initial: TargetAndTransition; whileInView: TargetAndTransition } {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
    };
  }
  switch (from) {
    case "left":
      return {
        initial: { opacity: 0, x: -OFFSET_X },
        whileInView: { opacity: 1, x: 0 },
      };
    case "right":
      return {
        initial: { opacity: 0, x: OFFSET_X },
        whileInView: { opacity: 1, x: 0 },
      };
    case "up":
      return {
        initial: { opacity: 0, y: OFFSET_Y },
        whileInView: { opacity: 1, y: 0 },
      };
    case "down":
      return {
        initial: { opacity: 0, y: -OFFSET_Y },
        whileInView: { opacity: 1, y: 0 },
      };
  }
}

interface ScrollAnimationProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  once?: boolean;
  amount?: number;
  margin?: string;
  duration?: number;
  delay?: number;
  from?: ScrollRevealFrom;
}

/**
 * Scroll-triggered reveal. Handles `prefers-reduced-motion` (static wrapper).
 * Use this for section copy and cards instead of repeating `motion` + viewport.
 */
export default function ScrollAnimation({
  children,
  ...props
}: ScrollAnimationProps) {
  const reducedMotion = useReducedMotion();
  const {
    once = true,
    amount = 0.2,
    margin = "-40px",
    duration = 0.35,
    delay = 0,
    from = "left",
    ...rest
  } = props;

  if (reducedMotion) {
    return (
      <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    );
  }

  const { initial, whileInView } = motionForDirection(from, false);

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={{
        once,
        amount,
        margin,
      }}
      transition={{ duration, delay, ease: easeOut }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Horizontal rule that grows in on scroll (one-off; not for every section). */
export function ScrollDividerReveal({
  className,
}: {
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className} />;
  }

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.15, ease: easeOut }}
      className={className ? `${className} origin-left` : "origin-left"}
    />
  );
}
