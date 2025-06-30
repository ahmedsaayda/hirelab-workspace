import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMessageType } from './MessageUtils.jsx';
import { CheckCircle, AlertCircle,  Loader } from 'lucide-react';



export const MessageList = ({ messages }) => {
  // Render different icons based on message type
  const renderIcon = (type, index, isLatest) => {
    const iconClasses = "mr-2 flex-shrink-0";
    const iconSize = 16;
    
    if (isLatest) {
      return <Loader size={iconSize} className={`${iconClasses} text-blue-500 animate-spin`} />;
    }
    
    switch (type) {
      case 'success':
        return <CheckCircle size={iconSize} className={`${iconClasses} text-green-500`} />;
      case 'warning':
        return <AlertCircle size={iconSize} className={`${iconClasses} text-amber-500`} />;
      case 'info':
      default:
        return <CheckCircle size={iconSize} className={`${iconClasses} text-blue-500`} />;
    }
  };
  
  // Define message animation variants
  const messageVariants = {
    initial: { 
      opacity: 0, 
      y: 10,
      height: 0,
      margin: 0
    },
    animate: { 
      opacity: 1, 
      y: 0,
      height: 'auto',
      marginBottom: 8,
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0,
      height: 0,
      marginBottom: 0,
      transition: { 
        duration: 0.2
      }
    }
  };
  
  return (
    <div className="space-y-0">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => {
          const messageType = getMessageType(message);
          const isLatest = index === messages.length - 1;
          
          return (
            <motion.div
              key={`message-${index}`}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`flex items-center text-sm ${index < messages.length - 1 ? 'opacity-70' : 'font-medium'}`}
              style={{
                transition: 'opacity 0.3s ease',
              }}
            >
              {renderIcon(messageType, index, isLatest)}
              <span>{message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* {messages.length === 0 && (
        <div className="py-2 text-sm text-gray-500 italic">
          Waiting to start scraping...
        </div>
      )} */}
    </div>
  );
};
