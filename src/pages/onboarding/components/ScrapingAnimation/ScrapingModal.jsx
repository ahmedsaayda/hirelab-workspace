import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from './ProgressBar.jsx';
import { MessageList } from './MessageList.jsx';
import { Loader2 } from 'lucide-react';


export const ScrapingModal = ({
  isOpen,
  onCancel,
  messages,
  progress,
  style = {},
}) => {

  if (progress === 100) {
    setTimeout(() => onCancel(), 2000);
  }
  const [currentMainMessage, setCurrentMainMessage] = useState('Initializing...');

  useEffect(() => {
    if (progress <= 10) setCurrentMainMessage('Initializing scraper...');
    else if (progress <= 25) setCurrentMainMessage('Analyzing your website...');
    else if (progress <= 50) setCurrentMainMessage('Analyzing style and tone...');
    else if (progress <= 75) setCurrentMainMessage('Processing data...');
    else if (progress <= 99) setCurrentMainMessage('Finalizing results...');
    else setCurrentMainMessage('Analysis complete!');
  }, [progress]);

  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-white/95 backdrop-blur rounded-2xl shadow-md overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 pb-8">
        <div className="flex items-center justify-center mb-6">
            <motion.div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium p-6">{progress}%</span>
              </div>
              <motion.div
                animate={{
                  rotate: 360,
                  transition: { duration: 2, repeat: Infinity, ease: "linear" },
                }}
              >
                <Loader2 size={60} className="text-blue-600" />
              </motion.div>
            </motion.div>
        </div>

        <motion.h2
          key={currentMainMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center text-xl font-semibold text-gray-800"
        >
          {currentMainMessage}
        </motion.h2>

        <div className="mt-6">
          <ProgressBar progress={progress} />
        </div>
      </div>

      <div className="p-6 max-h-60 overflow-y-auto bg-white">
        <MessageList messages={messages} />
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-center">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
