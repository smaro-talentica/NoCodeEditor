import { COMPONENT_TYPES } from '../../constants/canvas';
import './ComponentPalette.css';

const PALETTE_ITEMS = [
  {
    type: COMPONENT_TYPES.TEXT,
    label: 'Text',
    icon: '📝',
    description: 'Simple text element',
  },
  {
    type: COMPONENT_TYPES.TEXTAREA,
    label: 'Text Area',
    icon: '📄',
    description: 'Multi-line text',
  },
  {
    type: COMPONENT_TYPES.FLEXBOX,
    label: 'Flexbox',
    icon: '📦',
    description: 'Resizable text container',
  },
  {
    type: COMPONENT_TYPES.IMAGE,
    label: 'Image',
    icon: '🖼️',
    description: 'Add an image',
  },
  {
    type: COMPONENT_TYPES.BUTTON,
    label: 'Button',
    icon: '🔘',
    description: 'Add a button',
  },
];

const ComponentPalette = ({ isOpen = false, onClose = () => {} }) => {
  /**
   * Handle drag start
   */
  const handleDragStart = (e, type) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('componentType', type);
    // Auto-close on mobile after starting drag
    if (window.innerWidth <= 768) {
      setTimeout(onClose, 300);
    }
  };

  /**
   * Handle overlay click
   */
  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`component-palette__overlay ${isOpen ? 'component-palette__overlay--visible' : ''}`}
        onClick={handleOverlayClick}
      />
      
      <div className={`component-palette ${isOpen ? 'component-palette--open' : ''}`}>
        {/* Mobile close button */}
        <button 
          className="component-palette__close"
          onClick={onClose}
          aria-label="Close palette"
        >
          ×
        </button>
        
        <div className="component-palette__header">
          <h3>Components</h3>
          <p>Drag and drop to canvas</p>
        </div>
      
      <div className="component-palette__items">
        {PALETTE_ITEMS.map((item) => (
          <div
            key={item.type}
            className="component-palette__item"
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
          >
            <div className="component-palette__item-icon">{item.icon}</div>
            <div className="component-palette__item-content">
              <div className="component-palette__item-label">{item.label}</div>
              <div className="component-palette__item-description">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ComponentPalette;
