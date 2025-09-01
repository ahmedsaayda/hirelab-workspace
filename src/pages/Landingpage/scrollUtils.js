/**
 * Utility function to handle scrolling that works in both iframe and standalone contexts
 * @param {HTMLElement} element - The element to scroll to
 * @param {number} navbarHeight - Height of the navbar to account for (default: 128)
 * @param {number} additionalPadding - Extra padding to ensure content is fully visible (default: 48)
 */
export const scrollToElement = (element, navbarHeight = 128, additionalPadding = 48) => {
  if (!element) return;

  // Detect if we're in an iframe (edit mode) or standalone (public view)
  const isInIframe = window.parent !== window;
  let targetWindow = window;
  
  if (isInIframe) {
    // We're inside an iframe, use the current window (iframe's window)
    targetWindow = window;
  } else {
    // We're in standalone mode, but check if we need to target an iframe
    const iframes = document.querySelectorAll('iframe');
    if (iframes.length > 0) {
      const iframe = iframes[iframes.length - 1];
      targetWindow = iframe.contentWindow || window;
    }
  }
  
  // Try to find the section title (heading) within the element for better positioning
  let targetElement = element;
  const titleSelectors = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    '[class*="heading"]', '[class*="title"]',
    '.text-4xl', '.text-3xl', '.text-2xl', '.text-xl'
  ];
  
  for (const selector of titleSelectors) {
    const titleElement = element.querySelector(selector);
    if (titleElement) {
      targetElement = titleElement;
      break;
    }
  }
  
  // Calculate proper scroll position with navbar height + additional padding
  const elementRect = targetElement.getBoundingClientRect();
  const currentScrollTop = targetWindow.pageYOffset || targetWindow.scrollY || 0;
  const totalOffset = navbarHeight + additionalPadding;
  const offsetPosition = Math.max(0, elementRect.top + currentScrollTop - totalOffset);
  
  targetWindow.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * Enhanced scroll function with more customization options
 * @param {HTMLElement} element - The element to scroll to
 * @param {Object} options - Scroll options
 * @param {number} options.navbarHeight - Navbar height (default: 128)
 * @param {number} options.padding - Additional padding (default: 48)
 * @param {string} options.position - 'top', 'center', or 'visible' (default: 'top')
 */
export const scrollToElementEnhanced = (element, options = {}) => {
  const {
    navbarHeight = 128,
    padding = 48,
    position = 'top'
  } = options;

  if (!element) return;

  // Detect window context
  const isInIframe = window.parent !== window;
  let targetWindow = window;
  
  if (!isInIframe) {
    const iframes = document.querySelectorAll('iframe');
    if (iframes.length > 0) {
      const iframe = iframes[iframes.length - 1];
      targetWindow = iframe.contentWindow || window;
    }
  }

  const elementRect = element.getBoundingClientRect();
  const currentScrollTop = targetWindow.pageYOffset || targetWindow.scrollY || 0;
  const viewportHeight = targetWindow.innerHeight;
  
  let offsetPosition;
  
  switch (position) {
    case 'center':
      // Center the element in the viewport (accounting for navbar)
      const availableHeight = viewportHeight - navbarHeight;
      offsetPosition = elementRect.top + currentScrollTop - navbarHeight - (availableHeight / 2) + (elementRect.height / 2);
      break;
    case 'visible':
      // Ensure the entire element is visible
      offsetPosition = elementRect.top + currentScrollTop - navbarHeight - padding;
      break;
    case 'top':
    default:
      // Position at top with padding
      offsetPosition = elementRect.top + currentScrollTop - navbarHeight - padding;
      break;
  }
  
  targetWindow.scrollTo({
    top: Math.max(0, offsetPosition),
    behavior: 'smooth'
  });
};
