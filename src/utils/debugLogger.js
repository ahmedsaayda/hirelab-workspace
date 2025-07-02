class DebugLogger {
  constructor() {
    this.logs = [];
    this.isEnabled = true;
    this.maxLogs = 1000;
    this.pendingLogs = [];
    this.sendQueue = false;
  }

  async log(component, event, data = {}) {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      component,
      event,
      data: JSON.parse(JSON.stringify(data)),
    };

    this.logs.push(logEntry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console log for immediate viewing
    console.log(`[${timestamp}] ${component} - ${event}:`, data);

    // Immediately send to file API
    this.sendLogToFile(component, event, data);
  }

  async sendLogToFile(component, event, data) {
    try {
      // Only run in browser environment
      if (typeof window === 'undefined') return;

      await fetch('/api/debug-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ component, event, data }),
      });
    } catch (error) {
      console.error('Failed to send log to file:', error);
    }
  }

  getLogs() {
    return this.logs;
  }

  exportToFile() {
    const logContent = this.logs
      .map(log => `[${log.timestamp}] ${log.component} - ${log.event}: ${JSON.stringify(log.data, null, 2)}`)
      .join('\n\n');

    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `debug-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  clear() {
    this.logs = [];
    console.clear();
    // Also clear the log file
    this.clearLogFile();
  }

  async clearLogFile() {
    try {
      if (typeof window === 'undefined') return;

      await fetch('/api/debug-logs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to clear log file:', error);
    }
  }
}

const debugLogger = new DebugLogger();

if (typeof window !== 'undefined') {
  window.debugLogger = debugLogger;
  
  // Initialize log file with header
  debugLogger.sendLogToFile('DebugLogger', 'SESSION_START', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
}

export default debugLogger; 