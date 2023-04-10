import { motion } from "framer-motion";
import { forwardRef } from "react";

export const ScannerAnimation = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function ScannerAnimation({ children, ...restProps }, ref) {
    return (
      <div
        {...restProps}
        ref={ref}
        style={{
          ...restProps.style,
          position: "relative",
        }}
      >
        <motion.div
          className="scanner-animation"
          animate={{
            scale: [0.8, 0.7, 0.8],
            borderWidth: [6, 2, 6],
            borderColor: ["#ffffff0", "#fff", "#ffffff0"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        {children}
      </div>
    );
  }
);
