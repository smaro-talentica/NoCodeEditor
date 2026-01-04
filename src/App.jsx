import { useState, useEffect, useRef } from 'react';
import Canvas from './components/Canvas/Canvas';
import ComponentPalette from './components/ComponentPalette/ComponentPalette';
import PropertiesPanel from './components/PropertiesPanel/PropertiesPanel';
import ExportModal from './components/ExportModal/ExportModal';
import { DEFAULT_COMPONENT_PROPS } from './constants/canvas';
import { generateUniqueId } from './helpers/canvasHelpers';
import {
  duplicateComponent,
  bringToFront,
  sendToBack,
  bringForward,
  sendBackward,
} from './helpers/componentHelpers';
import { useHistory } from './hooks/useHistory';
import './App.css';

export default function App() {
  const canvasRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(100); // Canvas width percentage
  
  // Use history hook for undo/redo
  const {
    state: components,
    setState: setComponents,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory([]);

  /**
   * Add new component to canvas
   */
  const handleComponentAdd = (type, position) => {
    const newComponent = {
      id: generateUniqueId(),
      type,
      position,
      props: { ...DEFAULT_COMPONENT_PROPS[type] },
    };

    setComponents([...components, newComponent]);
    setSelectedId(newComponent.id);
  };

  /**
   * Update component properties with boundary constraints
   */
  const handleComponentUpdate = (id, updates) => {
    setComponents(components.map((comp) => {
      if (comp.id !== id) return comp;
      
      const updatedComp = { ...comp, ...updates };
      
      // Apply boundary constraints if canvas ref is available
      if (canvasRef.current && (updates.position || updates.props)) {
        const canvasWidth = canvasRef.current.clientWidth;
        
        const width = updatedComp.props?.width || comp.props?.width || 200;
        
        // Constrain position (left, right, top only - allow infinite bottom)
        if (updatedComp.position) {
          updatedComp.position = {
            x: Math.max(0, Math.min(updatedComp.position.x, canvasWidth - width)),
            y: Math.max(0, updatedComp.position.y) // Only constrain top
          };
        }
      }
      
      return updatedComp;
    }));
  };

  /**
   * Delete component
   */
  const handleComponentDelete = (id) => {
    setComponents(components.filter((comp) => comp.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  /**
   * Duplicate component
   */
  const handleComponentDuplicate = (id) => {
    const component = components.find((comp) => comp.id === id);
    if (!component) return;

    const duplicated = duplicateComponent(component);
    setComponents([...components, duplicated]);
    setSelectedId(duplicated.id);
  };

  /**
   * Layer management functions
   */
  const handleBringToFront = (id) => {
    setComponents(bringToFront(components, id));
  };

  const handleSendToBack = (id) => {
    setComponents(sendToBack(components, id));
  };

  const handleBringForward = (id) => {
    setComponents(bringForward(components, id));
  };

  const handleSendBackward = (id) => {
    setComponents(sendBackward(components, id));
  };

  /**
   * Clear all components from canvas
   */
  const handleClearCanvas = () => {
    if (components.length > 0 && window.confirm('Are you sure you want to clear the canvas?')) {
      setComponents([]);
      setSelectedId(null);
    }
  };

  /**
   * Select component
   */
  const handleSelectComponent = (id) => {
    setSelectedId(id);
    // Auto-open properties panel on mobile when component is selected
    if (window.innerWidth <= 768) {
      setIsPropertiesOpen(true);
    }
  };

  /**
   * Toggle mobile panels
   */
  const togglePalette = () => {
    setIsPaletteOpen(!isPaletteOpen);
    if (isPropertiesOpen) setIsPropertiesOpen(false);
  };

  const toggleProperties = () => {
    setIsPropertiesOpen(!isPropertiesOpen);
    if (isPaletteOpen) setIsPaletteOpen(false);
  };

  const closePalette = () => setIsPaletteOpen(false);
  const closeProperties = () => setIsPropertiesOpen(false);

  /**
   * Handle export modal
   */
  const openExportModal = () => {
    setIsExportModalOpen(true);
  };

  const closeExportModal = () => {
    setIsExportModalOpen(false);
  };

  /**
   * Handle project import
   */
  const handleImport = (importedComponents, importedCanvasWidth) => {
    if (components.length > 0) {
      const confirmReplace = window.confirm(
        'Importing will replace all current components. Continue?'
      );
      if (!confirmReplace) return;
    }
    setComponents(importedComponents);
    if (importedCanvasWidth) {
      setCanvasWidth(importedCanvasWidth);
    }
    setSelectedId(null);
  };

  /**
   * Handle canvas width change
   */
  const handleCanvasWidthChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string for user to clear and retype
    if (value === '') {
      setCanvasWidth('');
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    // Allow any numeric input while typing, but clamp on blur
    if (!isNaN(numValue)) {
      setCanvasWidth(numValue);
    }
  };

  /**
   * Handle canvas width blur - validate and clamp value
   */
  const handleCanvasWidthBlur = () => {
    if (canvasWidth === '' || canvasWidth < 10) {
      setCanvasWidth(10);
    } else if (canvasWidth > 100) {
      setCanvasWidth(100);
    }
  };

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete key - delete selected component
      if (e.key === 'Delete' && selectedId) {
        e.preventDefault();
        handleComponentDelete(selectedId);
      }

      // Ctrl/Cmd + D - duplicate selected component
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedId) {
        e.preventDefault();
        handleComponentDuplicate(selectedId);
      }

      // Ctrl/Cmd + Z - undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl/Cmd + Shift + Z OR Ctrl/Cmd + Y - redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        redo();
      }

      // Ctrl/Cmd + ] - bring forward
      if ((e.ctrlKey || e.metaKey) && e.key === ']' && selectedId) {
        e.preventDefault();
        handleBringForward(selectedId);
      }

      // Ctrl/Cmd + [ - send backward
      if ((e.ctrlKey || e.metaKey) && e.key === '[' && selectedId) {
        e.preventDefault();
        handleSendBackward(selectedId);
      }

      // Escape - deselect
      if (e.key === 'Escape' && selectedId) {
        e.preventDefault();
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, components, undo, redo]);

  // Get selected component
  const selectedComponent = components.find((comp) => comp.id === selectedId) || null;

  return (
    <div className="app">
      <header className="app__header">
        <h1>No-Code Editor</h1>
        <div className="app__header-actions">
          <div className="app__canvas-width">
            <label htmlFor="canvas-width" className="app__canvas-width-label">
              Canvas Width:
            </label>
            <input
              type="number"
              id="canvas-width"
              className="app__canvas-width-input"
              value={canvasWidth}
              onChange={handleCanvasWidthChange}
              onBlur={handleCanvasWidthBlur}
              min="10"
              max="100"
              step="5"
            />
            <span className="app__canvas-width-unit">%</span>
          </div>
          <button
            className="app__button app__button--secondary"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl/Cmd + Z)"
          >
            ↶ Undo
          </button>
          <button
            className="app__button app__button--secondary"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl/Cmd + Shift + Z)"
          >
            ↷ Redo
          </button>
          <button
            className="app__button app__button--secondary"
            onClick={handleClearCanvas}
            disabled={components.length === 0}
          >
            Clear Canvas ({components.length})
          </button>
          <button 
            className="app__button app__button--primary"
            onClick={openExportModal}
          >
            Export
          </button>
        </div>
      </header>
      
      <div className="app__workspace">
        <ComponentPalette 
          isOpen={isPaletteOpen}
          onClose={closePalette}
        />
        
        <Canvas
          ref={canvasRef}
          components={components}
          onComponentAdd={handleComponentAdd}
          selectedId={selectedId}
          onSelectComponent={handleSelectComponent}
          onComponentUpdate={handleComponentUpdate}
          canvasWidth={canvasWidth}
        />
        
        <PropertiesPanel
          selectedComponent={selectedComponent}
          onUpdate={handleComponentUpdate}
          onDelete={handleComponentDelete}
          onDuplicate={handleComponentDuplicate}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          totalComponents={components.length}
          isOpen={isPropertiesOpen}
          onClose={closeProperties}
        />

        {/* Mobile toggle button */}
        <button 
          className="app__mobile-toggle"
          onClick={selectedId ? toggleProperties : togglePalette}
        >
          {selectedId ? '⚙️ Properties' : '🧩 Components'}
        </button>
      </div>

      {/* Export/Import Modal */}
      {isExportModalOpen && (
        <ExportModal
          components={components}
          canvasWidth={canvasWidth}
          canvasRef={canvasRef}
          onClose={closeExportModal}
          onImport={handleImport}
        />
      )}
    </div>
  );
}
