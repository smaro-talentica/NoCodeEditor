/**
 * Duplicate a component with new position
 * @param {Object} component - Component to duplicate
 * @param {number} offsetX - X offset for duplicate
 * @param {number} offsetY - Y offset for duplicate
 * @returns {Object} Duplicated component
 */
export const duplicateComponent = (component, offsetX = 20, offsetY = 20) => {
  const duplicated = {
    ...component,
    id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    position: {
      x: component.position.x + offsetX,
      y: component.position.y + offsetY,
    },
    props: { ...component.props },
  };
  
  return duplicated;
};

/**
 * Move component to front (highest z-index)
 * @param {Array} components - All components
 * @param {string} componentId - ID of component to move
 * @returns {Array} Reordered components
 */
export const bringToFront = (components, componentId) => {
  const component = components.find(c => c.id === componentId);
  if (!component) return components;
  
  return [
    ...components.filter(c => c.id !== componentId),
    component,
  ];
};

/**
 * Move component to back (lowest z-index)
 * @param {Array} components - All components
 * @param {string} componentId - ID of component to move
 * @returns {Array} Reordered components
 */
export const sendToBack = (components, componentId) => {
  const component = components.find(c => c.id === componentId);
  if (!component) return components;
  
  return [
    component,
    ...components.filter(c => c.id !== componentId),
  ];
};

/**
 * Move component forward one layer
 * @param {Array} components - All components
 * @param {string} componentId - ID of component to move
 * @returns {Array} Reordered components
 */
export const bringForward = (components, componentId) => {
  const index = components.findIndex(c => c.id === componentId);
  if (index === -1 || index === components.length - 1) return components;
  
  const newComponents = [...components];
  [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
  
  return newComponents;
};

/**
 * Move component backward one layer
 * @param {Array} components - All components
 * @param {string} componentId - ID of component to move
 * @returns {Array} Reordered components
 */
export const sendBackward = (components, componentId) => {
  const index = components.findIndex(c => c.id === componentId);
  if (index === -1 || index === 0) return components;
  
  const newComponents = [...components];
  [newComponents[index], newComponents[index - 1]] = [newComponents[index - 1], newComponents[index]];
  
  return newComponents;
};

/**
 * Get component layer index (0-based, 0 is back)
 * @param {Array} components - All components
 * @param {string} componentId - ID of component
 * @returns {number} Layer index
 */
export const getComponentLayer = (components, componentId) => {
  return components.findIndex(c => c.id === componentId);
};
