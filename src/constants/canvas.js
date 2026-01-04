// Canvas configuration constants
export const CANVAS_CONFIG = {
  minWidth: 800,
  minHeight: 600,
  backgroundColor: '#ffffff',
  gridSize: 10,
  snapToGrid: false,
};

// Component types that can be added to canvas
export const COMPONENT_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  FLEXBOX: 'flexbox',
  IMAGE: 'image',
  BUTTON: 'button',
};

// Default properties for each component type
export const DEFAULT_COMPONENT_PROPS = {
  [COMPONENT_TYPES.TEXT]: {
    content: 'Text',
    fontSize: 16,
    color: '#000000',
    fontWeight: 'normal',
    textAlign: 'left',
    width: 100,
    height: 30,
  },
  [COMPONENT_TYPES.TEXTAREA]: {
    content: 'This is a longer text area content that can span multiple lines.',
    fontSize: 16,
    color: '#000000',
    lineHeight: 1.5,
    textAlign: 'left',
    width: 300,
    height: 100,
  },
  [COMPONENT_TYPES.FLEXBOX]: {
    backgroundColor: '#ffffff',
    width: 200,
    height: 100,
    padding: 16,
    borderRadius: 4,
  },
  [COMPONENT_TYPES.IMAGE]: {
    src: '',
    width: 200,
    height: 200,
    alt: 'Image',
    borderRadius: 0,
  },
  [COMPONENT_TYPES.BUTTON]: {
    text: 'Button',
    url: '#',
    fontSize: 16,
    padding: 10,
    backgroundColor: '#007bff',
    color: '#ffffff',
    borderRadius: 4,
  },
};

// Z-index management
export const Z_INDEX = {
  base: 1,
  selected: 1000,
  dragging: 2000,
};

// Selection styles
export const SELECTION_STYLES = {
  border: '2px solid #007bff',
  outline: 'none',
  cursor: 'move',
};
