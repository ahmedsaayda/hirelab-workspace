import { motion } from "framer-motion";

const SkeletonLoader = () => {
    return (
      <motion.div
        className="w-full max-w-md bg-white rounded-xl shadow-md p-1 space-y-1 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Bar */}
        <div className="flex justify-between items-center">
          <div className="w-16 h-2 bg-gray-300 rounded"></div>
          <div className="w-8 h-2 bg-gray-300 rounded"></div>
        </div>
  
        {/* Image Placeholder */}
        <div className=" w-full h-32 bg-gray-200 rounded-lg flex items-center justify-between px-2">
          <div className="space-y-1">
            <div className="w-20 h-2 bg-gray-300 rounded"></div>
            <div className="w-18 h-2 bg-gray-300 rounded"></div>
            <div className="w-8 h-2 bg-gray-300 rounded"></div>
            <div className="w-16 h-2 bg-gray-300 rounded"></div>
          </div>
          <div className=" w-20 h-20 bg-gray-300 rounded-full "></div>
        </div>
  
        {/* Title and Description */}
        <div className="space-y-2">
          <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
        </div>
  
        {/* Salary & Location */}
        <div className="flex items-center space-x-4">
          <div className="w-24 h-4 bg-gray-300 rounded"></div>
          <div className="w-20 h-4 bg-gray-300 rounded"></div>
        </div>
  
        {/* Buttons */}
        <div className="flex space-x-2">
          <div className="w-16 h-6 bg-gray-300 rounded"></div>
          <div className="w-20 h-6 bg-gray-300 rounded"></div>
        </div>
  
        <div className="w-20 h-6 bg-gray-300 rounded"></div>
      </motion.div>
    );
  };


  export default SkeletonLoader;
