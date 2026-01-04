import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentPalette from './ComponentPalette';
import { COMPONENT_TYPES } from '../../constants/canvas';

describe('ComponentPalette', () => {
  const mockOnAddComponent = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    onAddComponent: mockOnAddComponent,
    isOpen: false,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders component palette', () => {
      const { container } = render(<ComponentPalette {...defaultProps} />);
      const palette = container.querySelector('.component-palette');
      expect(palette).toBeInTheDocument();
    });

    test('renders all component buttons', () => {
      render(<ComponentPalette {...defaultProps} />);
      
      expect(screen.getByText(/^Text$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Text Area$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Flexbox$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Image$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Button$/i)).toBeInTheDocument();
    });

    test('renders component icons', () => {
      render(<ComponentPalette {...defaultProps} />);
      
      expect(screen.getByText(/📝/)).toBeInTheDocument(); // Text
      expect(screen.getByText(/📄/)).toBeInTheDocument(); // Text Area
      expect(screen.getByText(/📦/)).toBeInTheDocument(); // Flexbox
      expect(screen.getByText(/🖼️/)).toBeInTheDocument(); // Image
      expect(screen.getByText(/🔘/)).toBeInTheDocument(); // Button
    });

    test('renders header with title', () => {
      render(<ComponentPalette {...defaultProps} />);
      expect(screen.getByText(/Components/i)).toBeInTheDocument();
    });

    test('renders drag instruction', () => {
      render(<ComponentPalette {...defaultProps} />);
      expect(screen.getByText(/Drag and drop to canvas/i)).toBeInTheDocument();
    });
  });

  // Note: Component addition is handled via drag-and-drop, not click events
  // See 'Drag and Drop' tests for component addition testing

  describe('Mobile Behavior', () => {
    test('applies open class when isOpen is true', () => {
      const { container } = render(<ComponentPalette {...defaultProps} isOpen={true} />);
      const palette = container.querySelector('.component-palette');
      expect(palette).toHaveClass('component-palette--open');
    });

    test('does not apply open class when isOpen is false', () => {
      const { container } = render(<ComponentPalette {...defaultProps} isOpen={false} />);
      const palette = container.querySelector('.component-palette');
      expect(palette).not.toHaveClass('component-palette--open');
    });

    test('renders close button', () => {
      render(<ComponentPalette {...defaultProps} />);
      const closeButton = screen.getByLabelText(/Close palette/i);
      expect(closeButton).toBeInTheDocument();
    });

    test('calls onClose when close button clicked', () => {
      render(<ComponentPalette {...defaultProps} />);
      
      const closeButton = screen.getByLabelText(/Close palette/i);
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('renders overlay', () => {
      const { container } = render(<ComponentPalette {...defaultProps} isOpen={true} />);
      const overlay = container.querySelector('.component-palette__overlay');
      expect(overlay).toBeInTheDocument();
    });

    test('overlay is visible when isOpen', () => {
      const { container } = render(<ComponentPalette {...defaultProps} isOpen={true} />);
      const overlay = container.querySelector('.component-palette__overlay');
      expect(overlay).toHaveClass('component-palette__overlay--visible');
    });

    test('calls onClose when overlay clicked', () => {
      const { container } = render(<ComponentPalette {...defaultProps} isOpen={true} />);
      
      const overlay = container.querySelector('.component-palette__overlay');
      fireEvent.click(overlay);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Drag and Drop', () => {
    test('buttons are draggable', () => {
      const { container } = render(<ComponentPalette {...defaultProps} />);
      const buttons = container.querySelectorAll('.component-palette__item');
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('draggable', 'true');
      });
    });

    test('handles dragStart event for Text', () => {
      render(<ComponentPalette {...defaultProps} />);
      
      const textItem = screen.getAllByText('Text')[0];
      const textButton = textItem.closest('.component-palette__item');
      const dataTransfer = {
        effectAllowed: '',
        setData: jest.fn(),
      };
      
      fireEvent.dragStart(textButton, { dataTransfer });
      
      expect(dataTransfer.setData).toHaveBeenCalledWith('componentType', COMPONENT_TYPES.TEXT);
      expect(dataTransfer.effectAllowed).toBe('copy');
    });

    test('handles dragStart event for Flexbox', () => {
      render(<ComponentPalette {...defaultProps} />);
      
      const flexboxItem = screen.getByText('Flexbox');
      const flexboxButton = flexboxItem.closest('.component-palette__item');
      const dataTransfer = {
        effectAllowed: '',
        setData: jest.fn(),
      };
      
      fireEvent.dragStart(flexboxButton, { dataTransfer });
      
      expect(dataTransfer.setData).toHaveBeenCalledWith('componentType', COMPONENT_TYPES.FLEXBOX);
    });

    test('handles dragStart event for Image', () => {
      render(<ComponentPalette {...defaultProps} />);
      
      const imageItem = screen.getByText('Image');
      const imageButton = imageItem.closest('.component-palette__item');
      const dataTransfer = {
        effectAllowed: '',
        setData: jest.fn(),
      };
      
      fireEvent.dragStart(imageButton, { dataTransfer });
      
      expect(dataTransfer.setData).toHaveBeenCalledWith('componentType', COMPONENT_TYPES.IMAGE);
    });
  });

  describe('Accessibility', () => {
    test('all buttons have accessible text', () => {
      render(<ComponentPalette {...defaultProps} />);
      
      expect(screen.getByText('Simple text element')).toBeInTheDocument();
      expect(screen.getByText('Text Area')).toBeInTheDocument();
      expect(screen.getByText('Flexbox')).toBeInTheDocument();
      expect(screen.getByText('Add an image')).toBeInTheDocument();
      expect(screen.getByText('Add a button')).toBeInTheDocument();
    });

    test('close button has aria-label', () => {
      render(<ComponentPalette {...defaultProps} />);
      const closeButton = screen.getByLabelText(/Close palette/i);
      expect(closeButton).toHaveAttribute('aria-label');
    });

    test('component descriptions are readable', () => {
      render(<ComponentPalette {...defaultProps} />);
      
      expect(screen.getByText(/Simple text element/i)).toBeInTheDocument();
      expect(screen.getByText(/Multi-line text/i)).toBeInTheDocument();
      expect(screen.getByText(/Resizable text container/i)).toBeInTheDocument();
      expect(screen.getByText(/Add an image/i)).toBeInTheDocument();
      expect(screen.getByText(/Add a button/i)).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders exactly 5 component items', () => {
      const { container } = render(<ComponentPalette {...defaultProps} />);
      const items = container.querySelectorAll('.component-palette__item');
      expect(items.length).toBe(5);
    });

    test('each item has icon and label', () => {
      const { container } = render(<ComponentPalette {...defaultProps} />);
      const items = container.querySelectorAll('.component-palette__item');
      
      items.forEach(item => {
        expect(item.querySelector('.component-palette__item-icon')).toBeInTheDocument();
        expect(item.querySelector('.component-palette__item-label')).toBeInTheDocument();
      });
    });

    test('each item has description', () => {
      const { container } = render(<ComponentPalette {...defaultProps} />);
      const items = container.querySelectorAll('.component-palette__item');
      
      items.forEach(item => {
        expect(item.querySelector('.component-palette__item-description')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles missing onAddComponent prop', () => {
      const { container } = render(<ComponentPalette onClose={mockOnClose} />);
      expect(container.querySelector('.component-palette')).toBeInTheDocument();
    });

    test('handles missing onClose prop', () => {
      const { container } = render(<ComponentPalette onAddComponent={mockOnAddComponent} />);
      expect(container.querySelector('.component-palette')).toBeInTheDocument();
    });

    test('handles undefined isOpen prop', () => {
      const { container } = render(
        <ComponentPalette onAddComponent={mockOnAddComponent} onClose={mockOnClose} />
      );
      const palette = container.querySelector('.component-palette');
      expect(palette).not.toHaveClass('component-palette--open');
    });

    test('handles rapid drag starts', () => {
      render(<ComponentPalette {...defaultProps} />);
      
      const textItem = screen.getAllByText('Text')[0];
      const textButton = textItem.closest('.component-palette__item');
      const dataTransfer = { setData: jest.fn(), effectAllowed: '' };
      
      // Rapid drag starts should each be handled
      fireEvent.dragStart(textButton, { dataTransfer });
      fireEvent.dragStart(textButton, { dataTransfer });
      fireEvent.dragStart(textButton, { dataTransfer });
      
      // Each drag should call setData
      expect(dataTransfer.setData).toHaveBeenCalledTimes(3);
    });

    test('handles multiple component drag starts', () => {
      render(<ComponentPalette {...defaultProps} />);
      
      const textItem = screen.getAllByText('Text')[0];
      const flexboxItem = screen.getByText('Flexbox');
      const imageItem = screen.getByText('Image');
      const dataTransfer = { setData: jest.fn(), effectAllowed: '' };
      
      fireEvent.dragStart(textItem.closest('.component-palette__item'), { dataTransfer });
      fireEvent.dragStart(flexboxItem.closest('.component-palette__item'), { dataTransfer });
      fireEvent.dragStart(imageItem.closest('.component-palette__item'), { dataTransfer });
      
      // Each drag should call setData with correct component type
      expect(dataTransfer.setData).toHaveBeenCalledTimes(3);
      expect(dataTransfer.setData).toHaveBeenNthCalledWith(1, 'componentType', COMPONENT_TYPES.TEXT);
      expect(dataTransfer.setData).toHaveBeenNthCalledWith(2, 'componentType', COMPONENT_TYPES.FLEXBOX);
      expect(dataTransfer.setData).toHaveBeenNthCalledWith(3, 'componentType', COMPONENT_TYPES.IMAGE);
    });
  });
});
