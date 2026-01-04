import { useState, useRef, forwardRef } from 'react';
import { CANVAS_CONFIG, Z_INDEX, DEFAULT_COMPONENT_PROPS, COMPONENT_TYPES } from '../../constants/canvas';
import { calculateDropPosition } from '../../helpers/canvasHelpers';
import CanvasComponent from '../CanvasComponent/CanvasComponent';
import './Canvas.css';

const Canvas = forwardRef(({ components, onComponentAdd, selectedId, onSelectComponent, onComponentUpdate, canvasWidth = 100 }, ref) => {
  const internalCanvasRef = useRef(null);
  const canvasRef = ref || internalCanvasRef;
  const [isDragOver, setIsDragOver] = useState(false);

  // Ensure canvasWidth is a valid number
  const validCanvasWidth = canvasWidth === '' || isNaN(canvasWidth) ? 100 : Math.max(10, Math.min(100, canvasWidth));

  /**
   * Handle drag over canvas
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  /**
   * Handle drag leave canvas
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    if (e.target === canvasRef.current) {
      setIsDragOver(false);
    }
  };

  /**
   * Handle drop on canvas
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const componentType = e.dataTransfer.getData('componentType');
    if (!componentType) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const dropPosition = calculateDropPosition(e, canvasRect);
    
    // Get default component dimensions
    const defaultProps = DEFAULT_COMPONENT_PROPS[componentType] || {};
    const defaultWidth = defaultProps.width || 200;
    
    // Constrain drop position to keep component within canvas bounds (horizontally and top only)
    const canvasWidth = canvasRef.current.clientWidth;
    
    const constrainedPosition = {
      x: Math.max(0, Math.min(dropPosition.x, canvasWidth - defaultWidth)),
      y: Math.max(0, dropPosition.y) // Only constrain top
    };

    // Notify parent component about new component
    onComponentAdd(componentType, constrainedPosition);
  };

  /**
   * Handle canvas click (deselect components)
   */
  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      onSelectComponent(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      className={`canvas ${isDragOver ? 'canvas--drag-over' : ''}`}
      style={{
        width: `${validCanvasWidth}%`,
        minWidth: Math.min(CANVAS_CONFIG.minWidth, (window.innerWidth * validCanvasWidth) / 100),
        minHeight: CANVAS_CONFIG.minHeight,
        backgroundColor: CANVAS_CONFIG.backgroundColor,
        margin: '0 auto',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
    >
      {components.map((component) => (
        <CanvasComponent
          key={component.id}
          component={component}
          isSelected={component.id === selectedId}
          onSelect={() => onSelectComponent(component.id)}
          onUpdate={onComponentUpdate}
          zIndex={component.id === selectedId ? Z_INDEX.selected : Z_INDEX.base}
          canvasRef={canvasRef}
        />
      ))}
      
      {isDragOver && (
        <div className="canvas__drop-indicator">
          Drop component here
        </div>
      )}
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
