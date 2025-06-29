import React, { useState, Suspense, useEffect } from 'react';
import { Button } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



const CustomCarousel = ({ data, ApplicationSubmission, themeData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  // Function to move to the previous item with infinite loop
  const handlePrevious = () => {
    setDirection('previous');
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : data.length - 1));
  };

  // Function to move to the next item with infinite loop
  const handleNext = () => {
    setDirection('next');
    setCurrentIndex((prev) => (prev < data.length - 1 ? prev + 1 : 0));
  };

  // Handle swipe gesture
  const handleSwipe = (e, info) => {
    if (info.offset.x > 100) {
      // Swipe right (previous)
      handlePrevious();
    } else if (info.offset.x < -100) {
      // Swipe left (next)
      handleNext();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data.length]);

  // Define animation variants with conditional movement based on direction
  const variants = {
    enter: (direction) => ({
      opacity: 0,
      x: direction === 'next' ? 100 : direction === 'previous' ? -100 : 0, // Adjust based on direction
    }),
    center: { opacity: 1, x: 0 },
    exit: (direction) => ({
      opacity: 0,
      x: direction === 'next' ? -100 : direction === 'previous' ? 100 : 0, // Adjust based on direction
    }),
  };

  return (
    <div className="relative w-full py-2 overflow-hidden">
      <Button
        type="text"
        className="absolute text-gray-400 left-0 top-1/2 -translate-y-1/2 z-10"
        onClick={handlePrevious}
        icon={<ChevronLeft className="w-6 h-6" />}
      />

      <div className="w-full px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction} // Pass direction as a custom prop
            transition={{ duration: 0.5 }}
            className="w-full"
            drag="x" // Enable horizontal dragging
            dragConstraints={{ left: 0, right: 0 }} // Prevent dragging outside the bounds
            onDragEnd={handleSwipe} // Call the swipe handler when dragging ends
          >
            <Suspense fallback={<div>Loading...</div>}>
              <ApplicationSubmission
                {...data[currentIndex]}
                headingText={("0" + (currentIndex + 1)).slice(-2)}
                className="w-full bg-[#F5F5F2] flex flex-col justify-end"
                textColor="#000000"
              />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        type="text"
        className="absolute text-gray-400 right-0 top-1/2 -translate-y-1/2 z-10"
        onClick={handleNext}
        icon={<ChevronRight className="w-6 h-6" />}
      />

      <div className="flex justify-center gap-2 mt-4">
        {data.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full cursor-pointer transition-all ${
              currentIndex === index ? 'bg-blue-600 w-4' : 'bg-gray-300 w-2'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export { CustomCarousel };
