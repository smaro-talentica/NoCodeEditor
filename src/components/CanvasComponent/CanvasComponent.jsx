import { useState, useRef, useEffect } from 'react';
import { SELECTION_STYLES } from '../../constants/canvas';
import { calculateDragPosition } from '../../helpers/canvasHelpers';
import './CanvasComponent.css';

const CanvasComponent = ({ component, isSelected, onSelect, onUpdate, zIndex, canvasRef }) => {
  const componentRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });

  /**
   * Handle mouse/touch start for dragging
   */
  const handleMouseDown = (e) => {
    if (e.target.closest('.canvas-component__resize-handle')) return;
    
    e.stopPropagation();
    onSelect();
    
    if (!canvasRef?.current) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    setIsDragging(true);
    setDragStart({
      x: clientX - canvasRect.left - component.position.x,
      y: clientY - canvasRect.top - component.position.y,
    });
  };

  /**
   * Handle mouse/touch move for dragging
   */
  const handleMouseMove = (e) => {
    if (!isDragging || !canvasRef?.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    // Use clientWidth/clientHeight to get the actual inner dimensions (excluding scrollbars)
    const canvasWidth = canvasRef.current.clientWidth;
    const componentWidth = component.props.width || 200;

    // Calculate new position relative to canvas
    let newX = clientX - canvasRect.left - dragStart.x;
    let newY = clientY - canvasRect.top - dragStart.y;

    // Constrain horizontally within canvas boundaries (left, right)
    newX = Math.max(0, Math.min(newX, canvasWidth - componentWidth));
    // Only constrain top (y >= 0), allow infinite bottom
    newY = Math.max(0, newY);

    onUpdate(component.id, {
      position: { x: newX, y: newY },
    });
  };

  /**
   * Handle mouse/touch up to stop dragging
   */
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  /**
   * Handle resize start
   */
  const handleResizeStart = (e, handle) => {
    e.stopPropagation();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: clientX, y: clientY });
    setInitialSize({
      width: component.props.width || 200,
      height: component.props.height || 100,
    });
  };

  /**
   * Handle resize move
   */
  const handleResizeMove = (e) => {
    if (!isResizing || !resizeHandle || !canvasRef?.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    // Use clientWidth to get the actual inner width
    const canvasWidth = canvasRef.current.clientWidth;

    let newWidth = initialSize.width;
    let newHeight = initialSize.height;
    let newX = component.position.x;
    let newY = component.position.y;

    // For text components, only allow horizontal resizing
    const isTextComponent = component.type === 'text';

    // Calculate new dimensions based on resize handle
    switch (resizeHandle) {
      case 'e': // right (text only)
        newWidth = Math.max(50, initialSize.width + deltaX);
        newWidth = Math.min(newWidth, canvasWidth - newX);
        break;
      case 'w': // left (text only)
        newWidth = Math.max(50, initialSize.width - deltaX);
        newX = component.position.x + (initialSize.width - newWidth);
        newX = Math.max(0, newX);
        newWidth = component.position.x + initialSize.width - newX;
        break;
      case 'se': // bottom-right
        newWidth = Math.max(50, initialSize.width + deltaX);
        if (!isTextComponent) {
          newHeight = Math.max(50, initialSize.height + deltaY);
        }
        // Constrain width to canvas bounds
        newWidth = Math.min(newWidth, canvasWidth - newX);
        break;
      case 'sw': // bottom-left
        newWidth = Math.max(50, initialSize.width - deltaX);
        if (!isTextComponent) {
          newHeight = Math.max(50, initialSize.height + deltaY);
        }
        newX = component.position.x + (initialSize.width - newWidth);
        // Constrain to canvas bounds
        newX = Math.max(0, newX);
        newWidth = component.position.x + initialSize.width - newX;
        break;
      case 'ne': // top-right
        newWidth = Math.max(50, initialSize.width + deltaX);
        if (!isTextComponent) {
          newHeight = Math.max(50, initialSize.height - deltaY);
          newY = component.position.y + (initialSize.height - newHeight);
          // Only constrain top (y >= 0)
          newY = Math.max(0, newY);
          newHeight = component.position.y + initialSize.height - newY;
        }
        // Constrain width to canvas bounds
        newWidth = Math.min(newWidth, canvasWidth - newX);
        break;
      case 'nw': // top-left
        newWidth = Math.max(50, initialSize.width - deltaX);
        if (!isTextComponent) {
          newHeight = Math.max(50, initialSize.height - deltaY);
          newY = component.position.y + (initialSize.height - newHeight);
          newY = Math.max(0, newY);
          newHeight = component.position.y + initialSize.height - newY;
        }
        newX = component.position.x + (initialSize.width - newWidth);
        newY = component.position.y + (initialSize.height - newHeight);
        // Constrain to canvas bounds
        newX = Math.max(0, newX);
        newWidth = component.position.x + initialSize.width - newX;
        newX = component.position.x + (initialSize.width - newWidth);
        newY = component.position.y + (initialSize.height - newHeight);
        // Constrain to canvas bounds
        newX = Math.max(0, newX);
        newY = Math.max(0, newY);
        newWidth = component.position.x + initialSize.width - newX;
        newHeight = component.position.y + initialSize.height - newY;
        break;
    }

    onUpdate(component.id, {
      position: { x: newX, y: newY },
      props: {
        ...component.props,
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      },
    });
  };

  // Add global mouse and touch event listeners for dragging and resizing
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
    
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleResizeMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeHandle, initialSize]);

  /**
   * Render component based on type
   */
  const renderComponent = () => {
    const { type, props } = component;

    switch (type) {
      case 'text':
        return (
          <div
            style={{
              fontSize: `${props.fontSize}px`,
              color: props.color,
              fontWeight: props.fontWeight,
              textAlign: props.textAlign,
              width: `${props.width}px`,
              height: `${props.height}px`,
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {props.content}
          </div>
        );

      case 'textarea':
        return (
          <div
            style={{
              fontSize: `${props.fontSize}px`,
              color: props.color,
              lineHeight: props.lineHeight,
              textAlign: props.textAlign,
              width: `${props.width}px`,
              height: `${props.height}px`,
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {props.content}
          </div>
        );

      case 'flexbox':
        return (
          <div
            style={{
              width: `${props.width}px`,
              height: `${props.height}px`,
              backgroundColor: props.backgroundColor,
              padding: `${props.padding}px`,
              borderRadius: `${props.borderRadius}px`,
              border: '1px solid #e0e0e0',
            }}
          />
        );

      case 'image':
        return (
          <img
            src={props.src || 'https://via.placeholder.com/200'}
            alt={props.alt}
            style={{
              width: `${props.width}px`,
              height: `${props.height}px`,
              borderRadius: `${props.borderRadius}px`,
              display: 'block',
            }}
          />
        );

      case 'button':
        return (
          <button
            style={{
              fontSize: `${props.fontSize}px`,
              padding: `${props.padding}px ${props.padding * 2}px`,
              backgroundColor: props.backgroundColor,
              color: props.color,
              borderRadius: `${props.borderRadius}px`,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {props.text}
          </button>
        );

      default:
        return null;
    }
  };

  /**
   * Render resize handles for resizable components
   */
  const renderResizeHandles = () => {
    const resizableTypes = ['text', 'textarea', 'flexbox', 'image'];
    if (!isSelected || !resizableTypes.includes(component.type)) return null;

    // For text components, only show horizontal resize handles
    if (component.type === 'text') {
      return (
        <>
          <div
            className="canvas-component__resize-handle canvas-component__resize-handle--e"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            onTouchStart={(e) => handleResizeStart(e, 'e')}
          />
          <div
            className="canvas-component__resize-handle canvas-component__resize-handle--w"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            onTouchStart={(e) => handleResizeStart(e, 'w')}
          />
        </>
      );
    }

    // For other resizable components, show all 4 corner handles
    return (
      <>
        <div
          className="canvas-component__resize-handle canvas-component__resize-handle--nw"
          onMouseDown={(e) => handleResizeStart(e, 'nw')}
          onTouchStart={(e) => handleResizeStart(e, 'nw')}
        />
        <div
          className="canvas-component__resize-handle canvas-component__resize-handle--ne"
          onMouseDown={(e) => handleResizeStart(e, 'ne')}
          onTouchStart={(e) => handleResizeStart(e, 'ne')}
        />
        <div
          className="canvas-component__resize-handle canvas-component__resize-handle--sw"
          onMouseDown={(e) => handleResizeStart(e, 'sw')}
          onTouchStart={(e) => handleResizeStart(e, 'sw')}
        />
        <div
          className="canvas-component__resize-handle canvas-component__resize-handle--se"
          onMouseDown={(e) => handleResizeStart(e, 'se')}
          onTouchStart={(e) => handleResizeStart(e, 'se')}
        />
      </>
    );
  };

  return (
    <div
      ref={componentRef}
      className={`canvas-component ${isSelected ? 'canvas-component--selected' : ''} ${
        isDragging ? 'canvas-component--dragging' : ''
      } ${isResizing ? 'canvas-component--resizing' : ''}`}
      style={{
        position: 'absolute',
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
        zIndex: isDragging || isResizing ? 2000 : zIndex,
        cursor: isDragging ? 'grabbing' : isResizing ? 'nwse-resize' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {renderComponent()}
      {renderResizeHandles()}
      
      {isSelected && (
        <div className="canvas-component__selection-border" />
      )}
    </div>
  );
};

export default CanvasComponent;
