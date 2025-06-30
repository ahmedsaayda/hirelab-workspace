import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';


export const ProgressBar = ({ progress }) => {
  const barRef = useRef(null);
  
  // Animate the progress bar gradient as progress increases
  useEffect(() => {
    if (barRef.current) {
      const hue = 210 + (progress / 100) * 60; // Shift from blue to purple
      barRef.current.style.background = `linear-gradient(to right, hsl(${hue}, 80%, 60%), hsl(${hue + 20}, 90%, 65%))`;
    }
  }, [progress]);
  
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        ref={barRef}
        initial={{ width: '0%' }}
        animate={{ 
          width: `${progress}%`,
          transition: { 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            mass: 0.5
          }
        }}
        className="h-full rounded-full"
      />
    </div>
  );
};
