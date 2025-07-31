
"use client";
import React, { useEffect, useRef, useState } from "react";

interface UserCounterProps {
  target: number;
  duration?: number; // ms
  className?: string;
}

export default function UserCounter({ target, duration = 2000, className = "" }: UserCounterProps) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration]);

  // Format with commas
  const formatted = count.toLocaleString();

  return (
    <span className={className}>{formatted}</span>
  );
}
