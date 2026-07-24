"use client";

import { cn } from "@/lib/utils";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

import { useEffect, useState, useCallback } from "react";

type Badges = {
  name: string;
  designation: string;
  src: string;
};
export const AnimatedBadges = ({
  badges,
  autoplay = false,
  className,
  controls = true
}: {
  badges: Badges[];
  autoplay?: boolean;
  className?: string
  controls?: boolean
}) => {
  const [active, setActive] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % badges.length);
  }, [badges.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + badges.length) % badges.length);
  }, [badges.length]);

  const isActive = (index: number) => {
    return index === active;
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleDragEnd = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dragEnd = e.clientX;
    const diff = dragStart - dragEnd;
    const threshold = 50; // minimum drag distance to trigger change

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    setIsDragging(false);
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 2000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) + 5;
  };
  return (
    <div className={cn('relative grid grid-cols-1 gap-5 w-56', className)}>
      <div>
        <div
          className={cn('relative h-56 w-5h-56 w-full cursor-grab active:cursor-grabbing', className)}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <AnimatePresence>
            {badges.map((badge, index) => (
              <motion.div
                key={badge.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : randomRotateY(),
                  zIndex: isActive(index) ? 40 : badges.length + 2 - index,
                  y: isActive(index) ? [0, -80, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 origin-bottom border bg-black rounded-3xl p-2 border-gray-200"
              >
                <div className="relative h-full w-full group overflow-hidden select-none">
                  <img
                    src={badge.src}
                    alt={badge.name}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-contain object-center group-hover:scale-105 transition-transform duration-300 group-hover:opacity-20"
                  />
                  <div className="mt-2 text-center absolute top-1/2 opacity-0 group-hover:opacity-100 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300">
                    <h3 className="text-sm font-semibold text-nowrap select-none">{badge.name}</h3>
                    <p className="text-xs text-gray-400 select-none">{badge.designation}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      {controls && <div className="flex flex-col justify-center py-4 items-center">
        <div className="flex gap-4 pt-12 md:pt-0">
          <button
            className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
            onClick={handlePrev}
          >
            <IconArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
          </button>
          <button
            className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
            onClick={handleNext}
          >
            <IconArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
          </button>
        </div>
      </div>}
    </div>
  );
};
