"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const TextReveal = ({
  children,
  className,
  blur = 10,
  delay = 0.1,
  duration = 1,
  from = "bottom",
  split = "word",
}) => {
  // Convert children to string if it's not already
  const getText = () => {
    if (typeof children === "string") {
      return children;
    }

    // Handle React elements by extracting text content
    if (React.isValidElement(children)) {
      return React.Children.toArray(children).join("");
    }

    // Handle arrays of mixed content
    if (Array.isArray(children)) {
      return children
        .map((child) => {
          if (typeof child === "string") return child;
          if (React.isValidElement(child)) return child.props?.children || "";
          return String(child);
        })
        .join("");
    }

    return String(children);
  };

  const text = getText();
  const segments = split === "word" ? text.split(" ") : text.split(/(?=.)/);

  return (
    <div>
      {segments.map((c, index) => (
        <motion.span
          key={`${c}-${index}`}
          initial={{
            opacity: 0,
            y: from === "bottom" ? "50%" : "-50%",
            filter: `blur(${blur}px)`,
          }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: index * delay,
            duration,
            ease: [0.18, 0.89, 0.82, 1.04],
          }}
          className={cn(
            "inline-flex leading-none",
            split === "word" ? "mr-[0.2em]" : "",
            className
          )}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
      <div className="sr-only">{children}</div>
    </div>
  );
};
