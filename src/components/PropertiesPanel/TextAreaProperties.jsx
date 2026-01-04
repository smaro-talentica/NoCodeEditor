import NumberInput from '../PropertyInputs/NumberInput';
import ColorPicker from '../PropertyInputs/ColorPicker';
import TextInput from '../PropertyInputs/TextInput';
import ButtonGroup from '../PropertyInputs/ButtonGroup';

const TEXT_ALIGN_OPTIONS = [
  { value: 'left', label: 'Left', icon: '⬅️' },
  { value: 'center', label: 'Center', icon: '↔️' },
  { value: 'right', label: 'Right', icon: '➡️' },
];

const TextAreaProperties = ({ component, onUpdate }) => {
  const handlePropertyChange = (property, value) => {
    onUpdate(component.id, {
      props: {
        ...component.props,
        [property]: value,
      },
    });
  };

  return (
    <div className="component-properties">
      <TextInput
        label="Text Content"
        value={component.props.content}
        onChange={(value) => handlePropertyChange('content', value)}
        placeholder="Enter text..."
        multiline
      />

      <NumberInput
        label="Font Size"
        value={component.props.fontSize}
        onChange={(value) => handlePropertyChange('fontSize', value)}
        min={8}
        max={48}
        step={1}
        showSlider
      />

      <ColorPicker
        label="Text Color"
        value={component.props.color}
        onChange={(value) => handlePropertyChange('color', value)}
      />

      <NumberInput
        label="Width"
        value={component.props.width}
        onChange={(value) => handlePropertyChange('width', value)}
        min={100}
        max={1200}
        step={10}
        showSlider
      />

      <NumberInput
        label="Height"
        value={component.props.height}
        onChange={(value) => handlePropertyChange('height', value)}
        min={50}
        max={800}
        step={10}
        showSlider
      />

      <NumberInput
        label="Line Height"
        value={component.props.lineHeight}
        onChange={(value) => handlePropertyChange('lineHeight', value)}
        min={1}
        max={3}
        step={0.1}
        showSlider
      />

      <ButtonGroup
        label="Text Align"
        value={component.props.textAlign}
        onChange={(value) => handlePropertyChange('textAlign', value)}
        options={TEXT_ALIGN_OPTIONS}
      />
    </div>
  );
};

export default TextAreaProperties;
