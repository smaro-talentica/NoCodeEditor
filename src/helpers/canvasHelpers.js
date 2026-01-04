/**
 * Generate unique ID for canvas components
 */
export const generateUniqueId = () => {
  return `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate drop position on canvas
 * @param {DragEvent} event - Drop event
 * @param {DOMRect} canvasRect - Canvas bounding rectangle
 * @returns {{x: number, y: number}} Position coordinates
 */
export const calculateDropPosition = (event, canvasRect) => {
  const x = event.clientX - canvasRect.left;
  const y = event.clientY - canvasRect.top;
  
  return { x, y };
};

/**
 * Snap position to grid
 * @param {number} value - Position value
 * @param {number} gridSize - Grid size
 * @returns {number} Snapped value
 */
export const snapToGrid = (value, gridSize) => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Check if position is within canvas bounds
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @returns {boolean} True if within bounds
 */
export const isWithinBounds = (x, y, canvasWidth, canvasHeight) => {
  return x >= 0 && y >= 0 && x <= canvasWidth && y <= canvasHeight;
};

/**
 * Calculate new position for dragging component
 * @param {number} startX - Initial X position
 * @param {number} startY - Initial Y position
 * @param {number} deltaX - X movement delta
 * @param {number} deltaY - Y movement delta
 * @returns {{x: number, y: number}} New position
 */
export const calculateDragPosition = (startX, startY, deltaX, deltaY) => {
  return {
    x: startX + deltaX,
    y: startY + deltaY,
  };
};

/**
 * Get component bounds
 * @param {Object} component - Component object
 * @returns {{left: number, top: number, right: number, bottom: number}} Bounds
 */
export const getComponentBounds = (component) => {
  const { position, props } = component;
  const width = props.width || 100;
  const height = props.height || 50;
  
  return {
    left: position.x,
    top: position.y,
    right: position.x + width,
    bottom: position.y + height,
  };
};
