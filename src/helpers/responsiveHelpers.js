/**
 * Responsive breakpoint constants
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1440,
};

/**
 * Check if current viewport is mobile
 */
export const isMobileViewport = () => {
  return window.innerWidth <= BREAKPOINTS.MOBILE;
};

/**
 * Check if current viewport is tablet
 */
export const isTabletViewport = () => {
  return window.innerWidth > BREAKPOINTS.MOBILE && window.innerWidth <= BREAKPOINTS.TABLET;
};

/**
 * Check if current viewport is desktop
 */
export const isDesktopViewport = () => {
  return window.innerWidth > BREAKPOINTS.TABLET;
};

/**
 * Get viewport size category
 */
export const getViewportCategory = () => {
  if (isMobileViewport()) return 'mobile';
  if (isTabletViewport()) return 'tablet';
  return 'desktop';
};

/**
 * Add resize event listener with debounce
 */
export const addResizeListener = (callback, delay = 250) => {
  let timeoutId;

  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback({
        width: window.innerWidth,
        height: window.innerHeight,
        category: getViewportCategory(),
      });
    }, delay);
  };

  window.addEventListener('resize', handleResize);

  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('resize', handleResize);
  };
};
