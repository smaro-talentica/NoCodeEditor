import { COMPONENT_TYPES } from '../../constants/canvas';
import TextProperties from './TextProperties';
import TextAreaProperties from './TextAreaProperties';
import FlexboxProperties from './FlexboxProperties';
import ImageProperties from './ImageProperties';
import ButtonProperties from './ButtonProperties';
import './PropertiesPanel.css';

const PropertiesPanel = ({
  selectedComponent,
  onUpdate,
  onDelete,
  onDuplicate,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  totalComponents,
  isOpen = false,
  onClose = () => {},
}) => {
  /**
   * Render appropriate properties editor based on component type
   */
  const renderProperties = () => {
    if (!selectedComponent) {
      return (
        <div className="properties-panel__empty">
          <div className="properties-panel__empty-icon">🎨</div>
          <p>Select a component to edit its properties</p>
        </div>
      );
    }

    const commonProps = {
      component: selectedComponent,
      onUpdate,
    };

    switch (selectedComponent.type) {
      case COMPONENT_TYPES.TEXT:
        return <TextProperties {...commonProps} />;
      
      case COMPONENT_TYPES.TEXTAREA:
        return <TextAreaProperties {...commonProps} />;
      
      case COMPONENT_TYPES.FLEXBOX:
        return <FlexboxProperties {...commonProps} />;
      
      case COMPONENT_TYPES.IMAGE:
        return <ImageProperties {...commonProps} />;
      
      case COMPONENT_TYPES.BUTTON:
        return <ButtonProperties {...commonProps} />;
      
      default:
        return <p>Unknown component type</p>;
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
        className={`properties-panel__overlay ${isOpen ? 'properties-panel__overlay--visible' : ''}`}
        onClick={handleOverlayClick}
      />
      
      <div className={`properties-panel ${isOpen ? 'properties-panel--open' : ''}`}>
        {/* Mobile close button */}
        <button 
          className="properties-panel__close"
          onClick={onClose}
          aria-label="Close properties"
        >
          ×
        </button>
      <div className="properties-panel__header">
        <h3>Properties</h3>
        {selectedComponent && (
          <button
            className="properties-panel__delete-btn"
            onClick={() => onDelete(selectedComponent.id)}
            title="Delete component (Del)"
          >
            🗑️
          </button>
        )}
      </div>
      
      <div className="properties-panel__content">
        {selectedComponent && (
          <>
            <div className="properties-panel__component-info">
              <span className="properties-panel__component-type">
                {selectedComponent.type.toUpperCase()}
              </span>
            </div>

            <div className="properties-panel__actions">
              <button
                className="properties-panel__action-btn"
                onClick={() => onDuplicate(selectedComponent.id)}
                title="Duplicate (Ctrl/Cmd + D)"
              >
                📋 Duplicate
              </button>
            </div>

            <div className="properties-panel__divider"></div>
          </>
        )}
        
        {renderProperties()}
      </div>
    </div>
    </>
  );
};

export default PropertiesPanel;
