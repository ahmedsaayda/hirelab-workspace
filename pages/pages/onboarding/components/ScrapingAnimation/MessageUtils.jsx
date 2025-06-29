
/**
 * Determines the type of message based on its content
 */
export const getMessageType = (message) => {
  if (!message) return 'info';
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('complete') || 
      lowerMessage.includes('success') || 
      lowerMessage.includes('ready')) {
    return 'success';
  }
  
  if (lowerMessage.includes('no') || 
      lowerMessage.includes('try') || 
      lowerMessage.includes('fallback') ||
      lowerMessage.includes('not found')) {
    return 'warning';
  }
  
  if (lowerMessage.includes('error') || 
      lowerMessage.includes('fail')) {
    return 'error';
  }
  
  return 'info';
};

/**
 * Get a random time delay for staggered animations
 */
export const getRandomDelay = () => {
  return Math.random() * 0.3; // Random delay between 0 and 0.3 seconds
};