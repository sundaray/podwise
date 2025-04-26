"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Icons } from "@/components/icons";

const scrollVariants = {
  initial: { y: ".5rem", opacity: 0 },
  animate: {
    y: "0rem",
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  // Show button when page is scrolled upto given distance
  const toggleVisibility = () => {
    if (window.scrollY > 800) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // the scroll event fires when the document view has been scrolled
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
  }, []);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed right-4 bottom-4 flex items-center gap-1 rounded-full border p-1 transition-colors hover:bg-gray-100 md:right-8 md:bottom-8 shadow-xs"
          onClick={scrollToTop}
          variants={scrollVariants}
          initial="initial"
          animate="animate"
          exit="initial"
        >
          <Icons.chevronUp className="inline-block size-6 text-gray-500 md:size-7" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
