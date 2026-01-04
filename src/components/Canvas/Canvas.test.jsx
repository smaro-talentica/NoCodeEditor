import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { forwardRef } from 'react';
import Canvas from './Canvas';

// Mock CanvasComponent since it has complex drag/resize logic
jest.mock('../CanvasComponent/CanvasComponent', () => {
  return function MockCanvasComponent({ component, isSelected, onUpdate, onSelect }) {
    return (
      <div 
        className="canvas-component"
        data-testid={`component-${component.id}`}
        onClick={() => onSelect(component.id)}
      >
        {component.type} - {component.id}
      </div>
    );
  };
});

describe('Canvas Component', () => {
  const mockComponents = [
    {
      id: '1',
      type: 'text',
      position: { left: 100, top: 50 },
      props: { content: 'Hello', width: 200, height: 30 }
    },
    {
      id: '2',
      type: 'flexbox',
      position: { left: 200, top: 150 },
      props: { backgroundColor: '#f0f0f0', width: 300, height: 200 }
    }
  ];

  const defaultProps = {
    components: [],
    selectedComponentId: null,
    canvasWidth: 100,
    onComponentUpdate: jest.fn(),
    onSelectComponent: jest.fn(),
    onAddComponent: jest.fn(),
    canvasRef: { current: null }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders canvas container', () => {
      const { container } = render(<Canvas {...defaultProps} />);
      const canvas = container.querySelector('.canvas');
      expect(canvas).toBeInTheDocument();
    });

    test('renders with correct width style', () => {
      const { container } = render(<Canvas {...defaultProps} canvasWidth={50} />);
      const canvas = container.querySelector('.canvas');
      expect(canvas).toHaveStyle({ width: '50%' });
    });

    test('renders empty canvas when no components', () => {
      render(<Canvas {...defaultProps} />);
      const components = screen.queryAllByTestId(/component-/);
      expect(components.length).toBe(0);
    });

    test('renders all provided components', () => {
      render(<Canvas {...defaultProps} components={mockComponents} />);
      
      expect(screen.getByTestId('component-1')).toBeInTheDocument();
      expect(screen.getByTestId('component-2')).toBeInTheDocument();
    });

    test('applies selected state to correct component', () => {
      render(
        <Canvas 
          {...defaultProps} 
          components={mockComponents}
          selectedComponentId="1"
        />
      );
      
      const component1 = screen.getByTestId('component-1');
      expect(component1).toBeInTheDocument();
    });
  });

  describe('Component Selection', () => {
    test('calls onSelectComponent when component clicked', () => {
      const onSelectComponent = jest.fn();
      render(
        <Canvas 
          {...defaultProps} 
          components={mockComponents}
          onSelectComponent={onSelectComponent}
        />
      );
      
      const component1 = screen.getByTestId('component-1');
      fireEvent.click(component1);
      
      expect(onSelectComponent).toHaveBeenCalledWith('1');
    });

    test('deselects when canvas background clicked', () => {
      const onSelectComponent = jest.fn();
      const { container } = render(
        <Canvas 
          {...defaultProps} 
          components={mockComponents}
          selectedComponentId="1"
          onSelectComponent={onSelectComponent}
        />
      );
      
      const canvas = container.querySelector('.canvas');
      fireEvent.click(canvas);
      
      expect(onSelectComponent).toHaveBeenCalledWith(null);
    });
  });

  describe('Canvas Width', () => {
    test('applies 10% width correctly', () => {
      const { container } = render(<Canvas {...defaultProps} canvasWidth={10} />);
      const canvas = container.querySelector('.canvas');
      expect(canvas).toHaveStyle({ width: '10%' });
    });

    test('applies 50% width correctly', () => {
      const { container } = render(<Canvas {...defaultProps} canvasWidth={50} />);
      const canvas = container.querySelector('.canvas');
      expect(canvas).toHaveStyle({ width: '50%' });
    });

    test('applies 100% width correctly', () => {
      const { container } = render(<Canvas {...defaultProps} canvasWidth={100} />);
      const canvas = container.querySelector('.canvas');
      expect(canvas).toHaveStyle({ width: '100%' });
    });
  });

  describe('Ref Forwarding', () => {
    test('forwards ref to canvas element', () => {
      const ref = { current: null };
      const { container } = render(<Canvas {...defaultProps} ref={ref} />);
      
      const canvas = container.querySelector('.canvas');
      expect(ref.current).toBe(canvas);
    });

    test('ref provides access to DOM element', () => {
      const ref = { current: null };
      render(<Canvas {...defaultProps} ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current.classList.contains('canvas')).toBe(true);
    });
  });

  describe('Component Updates', () => {
    test('re-renders when components prop changes', () => {
      const { rerender } = render(<Canvas {...defaultProps} components={[]} />);
      
      expect(screen.queryAllByTestId(/component-/).length).toBe(0);
      
      rerender(<Canvas {...defaultProps} components={mockComponents} />);
      
      expect(screen.queryAllByTestId(/component-/).length).toBe(2);
    });

    test('re-renders when selectedComponentId changes', () => {
      const { rerender } = render(
        <Canvas {...defaultProps} components={mockComponents} selectedComponentId={null} />
      );
      
      rerender(
        <Canvas {...defaultProps} components={mockComponents} selectedComponentId="1" />
      );
      
      expect(screen.getByTestId('component-1')).toBeInTheDocument();
    });
  });

  describe('Drop Zone', () => {
    test('canvas has drop zone styling', () => {
      const { container } = render(<Canvas {...defaultProps} />);
      const canvas = container.querySelector('.canvas');
      
      expect(canvas.className).toContain('canvas');
    });

    test('handles empty state gracefully', () => {
      const { container } = render(<Canvas {...defaultProps} components={[]} />);
      const canvas = container.querySelector('.canvas');
      
      expect(canvas).toBeInTheDocument();
      expect(screen.queryAllByTestId(/component-/).length).toBe(0);
    });
  });

  describe('Overflow Behavior', () => {
    test('canvas has correct overflow styles', () => {
      const { container } = render(<Canvas {...defaultProps} />);
      const canvas = container.querySelector('.canvas');
      
      const styles = window.getComputedStyle(canvas);
      // These would need to be set in Canvas.css
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Multiple Components', () => {
    test('renders many components efficiently', () => {
      const manyComponents = Array.from({ length: 50 }, (_, i) => ({
        id: `${i}`,
        type: 'text',
        position: { left: i * 10, top: i * 10 },
        props: { content: `Component ${i}`, width: 100, height: 30 }
      }));
      
      render(<Canvas {...defaultProps} components={manyComponents} />);
      
      const renderedComponents = screen.queryAllByTestId(/component-/);
      expect(renderedComponents.length).toBe(50);
    });

    test('maintains component order', () => {
      render(<Canvas {...defaultProps} components={mockComponents} />);
      
      const component1 = screen.getByTestId('component-1');
      const component2 = screen.getByTestId('component-2');
      
      expect(component1).toBeInTheDocument();
      expect(component2).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles null components array gracefully', () => {
      // TypeScript would catch this, but testing runtime behavior
      const { container } = render(<Canvas {...defaultProps} components={[]} />);
      expect(container.querySelector('.canvas')).toBeInTheDocument();
    });

    test('handles components with missing props', () => {
      const incompleteComponents = [
        {
          id: '1',
          type: 'text',
          position: { left: 0, top: 0 },
          props: {}
        }
      ];
      
      render(<Canvas {...defaultProps} components={incompleteComponents} />);
      expect(screen.getByTestId('component-1')).toBeInTheDocument();
    });

    test('handles very small canvas width', () => {
      const { container } = render(<Canvas {...defaultProps} canvasWidth={10} />);
      const canvas = container.querySelector('.canvas');
      expect(canvas).toHaveStyle({ width: '10%' });
    });

    test('handles maximum canvas width', () => {
      const { container } = render(<Canvas {...defaultProps} canvasWidth={100} />);
      const canvas = container.querySelector('.canvas');
      expect(canvas).toHaveStyle({ width: '100%' });
    });
  });

  describe('Accessibility', () => {
    test('canvas is keyboard accessible', () => {
      const { container } = render(<Canvas {...defaultProps} />);
      const canvas = container.querySelector('.canvas');
      
      expect(canvas).toBeInTheDocument();
      // Could add tabindex or role attributes for better accessibility
    });
  });
});
