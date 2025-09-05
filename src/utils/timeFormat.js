/**
 * Format seconds into a human-readable time string
 * @param {number} seconds - Time in seconds
 * @param {object} options - Formatting options
 * @param {boolean} options.compact - Use compact format (1h 5m vs 1 hour 5 minutes)
 * @param {boolean} options.showSeconds - Include seconds in output for short durations
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds, options = {}) => {
  const { compact = true, showSeconds = false } = options;
  
  if (!seconds || seconds < 1) {
    return compact ? '0s' : '0 seconds';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts = [];

  if (hours > 0) {
    parts.push(compact ? `${hours}h` : `${hours} hour${hours !== 1 ? 's' : ''}`);
  }

  if (minutes > 0) {
    parts.push(compact ? `${minutes}m` : `${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }

  // Show seconds only for short durations (under 2 minutes) or when explicitly requested
  if ((showSeconds || (hours === 0 && minutes < 2)) && remainingSeconds > 0) {
    parts.push(compact ? `${remainingSeconds}s` : `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`);
  }

  // If we have no parts (shouldn't happen with the checks above), return fallback
  if (parts.length === 0) {
    return compact ? `${remainingSeconds}s` : `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }

  return parts.join(' ');
};

/**
 * Format average time on site for analytics display
 * Optimized for dashboard cards and analytics
 * @param {number} seconds - Average time in seconds
 * @returns {string} Formatted time string
 */
export const formatAvgTime = (seconds) => {
  if (!seconds || seconds < 1) {
    return '0s';
  }

  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    
    // For times under 10 minutes, show seconds for precision
    if (minutes < 10) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    
    // For longer times, round to nearest minute
    return `${Math.round(seconds / 60)}m`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}m`;
};

/**
 * Examples:
 * formatTime(25) → "25s"
 * formatTime(90) → "1m 30s"
 * formatTime(3665) → "1h 1m"
 * formatAvgTime(45) → "45s"
 * formatAvgTime(125) → "2m 5s"
 * formatAvgTime(2548) → "42m"
 */
