import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInput from './TextInput';
import NumberInput from './NumberInput';
import ColorPicker from './ColorPicker';
import ButtonGroup from './ButtonGroup';

describe('PropertyInputs', () => {
  describe('TextInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders text input with label', () => {
      render(<TextInput label="Test Label" value="test" onChange={mockOnChange} />);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    });

    test('renders single-line input by default', () => {
      const { container } = render(<TextInput label="Label" value="" onChange={mockOnChange} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(container.querySelector('textarea')).not.toBeInTheDocument();
    });

    test('renders textarea when multiline is true', () => {
      render(<TextInput label="Label" value="" onChange={mockOnChange} multiline />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    test('calls onChange when text changes', () => {
      render(<TextInput label="Label" value="" onChange={mockOnChange} />);
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'new text' } });
      expect(mockOnChange).toHaveBeenCalledWith('new text');
    });

    test('displays placeholder', () => {
      render(<TextInput label="Label" value="" onChange={mockOnChange} placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });

    test('updates value when prop changes', () => {
      const { rerender } = render(<TextInput label="Label" value="initial" onChange={mockOnChange} />);
      expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
      
      rerender(<TextInput label="Label" value="updated" onChange={mockOnChange} />);
      expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
    });

    test('handles empty value', () => {
      render(<TextInput label="Label" value="" onChange={mockOnChange} />);
      const input = screen.getByRole('textbox');
      expect(input.value).toBe('');
    });

    test('handles multiline text', () => {
      const multilineText = 'Line 1\nLine 2\nLine 3';
      const { container } = render(<TextInput label="Label" value={multilineText} onChange={mockOnChange} multiline />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toBeInTheDocument();
      expect(textarea.value).toBe(multilineText);
    });
  });

  describe('NumberInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders number input with label', () => {
      render(<NumberInput label="Size" value={16} onChange={mockOnChange} />);
      expect(screen.getByText('Size')).toBeInTheDocument();
      const inputs = screen.getAllByDisplayValue('16');
      expect(inputs.length).toBeGreaterThan(0);
    });

    test('calls onChange when number changes', () => {
      render(<NumberInput label="Size" value={16} onChange={mockOnChange} />);
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: '20' } });
      expect(mockOnChange).toHaveBeenCalledWith(20);
    });

    test('applies min and max constraints', () => {
      render(<NumberInput label="Size" value={16} onChange={mockOnChange} min={10} max={30} />);
      const input = screen.getByRole('spinbutton');
      
      expect(input).toHaveAttribute('min', '10');
      expect(input).toHaveAttribute('max', '30');
    });

    test('applies step value', () => {
      render(<NumberInput label="Size" value={16} onChange={mockOnChange} step={2} />);
      const input = screen.getByRole('spinbutton');
      
      expect(input).toHaveAttribute('step', '2');
    });

    test('renders slider when showSlider is true', () => {
      render(<NumberInput label="Size" value={16} onChange={mockOnChange} showSlider min={10} max={30} />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });

    test('does not render slider when showSlider is false', () => {
      render(<NumberInput label="Size" value={16} onChange={mockOnChange} showSlider={false} />);
      expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    });

    test('slider and input are synchronized', () => {
      render(<NumberInput label="Size" value={16} onChange={mockOnChange} showSlider min={10} max={30} />);
      const slider = screen.getByRole('slider');
      
      fireEvent.change(slider, { target: { value: '25' } });
      expect(mockOnChange).toHaveBeenCalledWith(25);
    });

    test('handles decimal values with step', () => {
      render(<NumberInput label="Line Height" value={1.5} onChange={mockOnChange} step={0.1} min={1} max={3} />);
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: '1.8' } });
      expect(mockOnChange).toHaveBeenCalledWith(1.8);
    });

    test('displays current value correctly', () => {
      render(<NumberInput label="Size" value={42} onChange={mockOnChange} />);
      const inputs = screen.getAllByDisplayValue('42');
      expect(inputs.length).toBeGreaterThan(0);
    });

    test('handles zero value', () => {
      render(<NumberInput label="Border" value={0} onChange={mockOnChange} min={0} />);
      const inputs = screen.getAllByDisplayValue('0');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('ColorPicker', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders color picker with label', () => {
      render(<ColorPicker label="Background Color" value="#ffffff" onChange={mockOnChange} />);
      expect(screen.getByText('Background Color')).toBeInTheDocument();
    });

    test('displays current color value', () => {
      render(<ColorPicker label="Color" value="#ff0000" onChange={mockOnChange} />);
      const inputs = screen.getAllByDisplayValue('#ff0000');
      expect(inputs.length).toBeGreaterThan(0);
    });

    test('calls onChange when color changes', () => {
      render(<ColorPicker label="Color" value="#ffffff" onChange={mockOnChange} />);
      const colorInput = screen.getAllByDisplayValue('#ffffff')[0];
      
      fireEvent.change(colorInput, { target: { value: '#000000' } });
      expect(mockOnChange).toHaveBeenCalledWith('#000000');
    });

    test('renders native color input', () => {
      const { container } = render(<ColorPicker label="Color" value="#ffffff" onChange={mockOnChange} />);
      const colorInput = container.querySelector('input[type="color"]');
      expect(colorInput).toBeInTheDocument();
    });

    test('renders text input for hex value', () => {
      render(<ColorPicker label="Color" value="#ffffff" onChange={mockOnChange} />);
      const inputs = screen.getAllByDisplayValue('#ffffff');
      expect(inputs.length).toBeGreaterThan(0);
    });

    test('color picker and text input are synchronized', () => {
      const { container } = render(<ColorPicker label="Color" value="#ffffff" onChange={mockOnChange} />);
      const textInput = container.querySelector('.property-input__color-text');
      
      fireEvent.change(textInput, { target: { value: '#ff5500' } });
      expect(mockOnChange).toHaveBeenCalledWith('#ff5500');
    });

    test('handles uppercase hex values', () => {
      render(<ColorPicker label="Color" value="#FFFFFF" onChange={mockOnChange} />);
      expect(screen.getByDisplayValue('#FFFFFF')).toBeInTheDocument();
    });

    test('handles short hex values', () => {
      render(<ColorPicker label="Color" value="#fff" onChange={mockOnChange} />);
      expect(screen.getByDisplayValue('#fff')).toBeInTheDocument();
    });
  });

  describe('ButtonGroup', () => {
    const mockOnChange = jest.fn();
    const options = [
      { value: 'left', label: 'Left', icon: '⬅️' },
      { value: 'center', label: 'Center', icon: '↔️' },
      { value: 'right', label: 'Right', icon: '➡️' },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders button group with label', () => {
      render(<ButtonGroup label="Text Align" value="left" onChange={mockOnChange} options={options} />);
      expect(screen.getByText('Text Align')).toBeInTheDocument();
    });

    test('renders all option buttons', () => {
      render(<ButtonGroup label="Align" value="left" onChange={mockOnChange} options={options} />);
      
      expect(screen.getByTitle('Left')).toBeInTheDocument();
      expect(screen.getByTitle('Center')).toBeInTheDocument();
      expect(screen.getByTitle('Right')).toBeInTheDocument();
    });

    test('renders option icons', () => {
      render(<ButtonGroup label="Align" value="left" onChange={mockOnChange} options={options} />);
      
      expect(screen.getByText('⬅️')).toBeInTheDocument();
      expect(screen.getByText('↔️')).toBeInTheDocument();
      expect(screen.getByText('➡️')).toBeInTheDocument();
    });

    test('calls onChange when button clicked', () => {
      render(<ButtonGroup label="Align" value="left" onChange={mockOnChange} options={options} />);
      
      const centerButton = screen.getByTitle('Center');
      fireEvent.click(centerButton);
      
      expect(mockOnChange).toHaveBeenCalledWith('center');
    });

    test('applies active class to selected button', () => {
      render(<ButtonGroup label="Align" value="center" onChange={mockOnChange} options={options} />);
      
      const centerButton = screen.getByTitle('Center');
      expect(centerButton).toHaveClass('property-input__button--active');
    });

    test('only one button is active at a time', () => {
      const { container } = render(<ButtonGroup label="Align" value="left" onChange={mockOnChange} options={options} />);
      
      const activeButtons = container.querySelectorAll('.property-input__button--active');
      expect(activeButtons.length).toBe(1);
    });

    test('updates active button when value changes', () => {
      const { rerender } = render(<ButtonGroup label="Align" value="left" onChange={mockOnChange} options={options} />);
      
      let leftButton = screen.getByTitle('Left');
      expect(leftButton).toHaveClass('property-input__button--active');
      
      rerender(<ButtonGroup label="Align" value="right" onChange={mockOnChange} options={options} />);
      
      const rightButton = screen.getByTitle('Right');
      expect(rightButton).toHaveClass('property-input__button--active');
      leftButton = screen.getByTitle('Left');
      expect(leftButton).not.toHaveClass('property-input__button--active');
    });

    test('handles options without icons', () => {
      const simpleOptions = [
        { value: 'normal', label: 'Normal' },
        { value: 'bold', label: 'Bold' },
      ];
      
      render(<ButtonGroup label="Font Weight" value="normal" onChange={mockOnChange} options={simpleOptions} />);
      
      expect(screen.getByText('Normal')).toBeInTheDocument();
      expect(screen.getByText('Bold')).toBeInTheDocument();
    });

    test('handles empty options array', () => {
      render(<ButtonGroup label="Empty" value="" onChange={mockOnChange} options={[]} />);
      expect(screen.getByText('Empty')).toBeInTheDocument();
    });

    test('handles single option', () => {
      const singleOption = [{ value: 'only', label: 'Only Option' }];
      render(<ButtonGroup label="Single" value="only" onChange={mockOnChange} options={singleOption} />);
      
      expect(screen.getByText('Only Option')).toBeInTheDocument();
    });

    test('handles many options', () => {
      const manyOptions = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
        { value: '4', label: 'Option 4' },
        { value: '5', label: 'Option 5' },
      ];
      
      render(<ButtonGroup label="Many" value="1" onChange={mockOnChange} options={manyOptions} />);
      
      manyOptions.forEach(opt => {
        expect(screen.getByText(opt.label)).toBeInTheDocument();
      });
    });

    test('each button triggers onChange with correct value', () => {
      render(<ButtonGroup label="Align" value="left" onChange={mockOnChange} options={options} />);
      
      fireEvent.click(screen.getByTitle('Left'));
      expect(mockOnChange).toHaveBeenLastCalledWith('left');
      
      fireEvent.click(screen.getByTitle('Center'));
      expect(mockOnChange).toHaveBeenLastCalledWith('center');
      
      fireEvent.click(screen.getByTitle('Right'));
      expect(mockOnChange).toHaveBeenLastCalledWith('right');
    });

    test('buttons are keyboard accessible', () => {
      render(<ButtonGroup label="Align" value="left" onChange={mockOnChange} options={options} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Integration', () => {
    test('all property inputs have consistent label styling', () => {
      const { container: textContainer } = render(
        <TextInput label="Text" value="" onChange={() => {}} />
      );
      const { container: numberContainer } = render(
        <NumberInput label="Number" value={0} onChange={() => {}} />
      );
      const { container: colorContainer } = render(
        <ColorPicker label="Color" value="#fff" onChange={() => {}} />
      );
      
      const textLabel = textContainer.querySelector('.property-input__label');
      const numberLabel = numberContainer.querySelector('.property-input__label');
      const colorLabel = colorContainer.querySelector('.property-input__label');
      
      expect(textLabel).toBeInTheDocument();
      expect(numberLabel).toBeInTheDocument();
      expect(colorLabel).toBeInTheDocument();
    });

    test('all inputs are controlled components', () => {
      const { rerender: rerenderText } = render(
        <TextInput label="Text" value="initial" onChange={() => {}} />
      );
      rerenderText(<TextInput label="Text" value="updated" onChange={() => {}} />);
      expect(screen.getByDisplayValue('updated')).toBeInTheDocument();

      const { rerender: rerenderNumber } = render(
        <NumberInput label="Number" value={10} onChange={() => {}} />
      );
      rerenderNumber(<NumberInput label="Number" value={20} onChange={() => {}} />);
      const numberInputs = screen.getAllByDisplayValue('20');
      expect(numberInputs.length).toBeGreaterThan(0);

      const { rerender: rerenderColor } = render(
        <ColorPicker label="Color" value="#ffffff" onChange={() => {}} />
      );
      rerenderColor(<ColorPicker label="Color" value="#000000" onChange={() => {}} />);
      const colorInputs = screen.getAllByDisplayValue('#000000');
      expect(colorInputs.length).toBeGreaterThan(0);
    });
  });
});
