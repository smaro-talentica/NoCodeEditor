import NumberInput from '../PropertyInputs/NumberInput';
import ColorPicker from '../PropertyInputs/ColorPicker';
import TextInput from '../PropertyInputs/TextInput';
import ButtonGroup from '../PropertyInputs/ButtonGroup';

const TEXT_ALIGN_OPTIONS = [
  { value: 'left', label: 'Left', icon: '⬅️' },
  { value: 'center', label: 'Center', icon: '↔️' },
  { value: 'right', label: 'Right', icon: '➡️' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
];

const TextProperties = ({ component, onUpdate }) => {
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
        max={120}
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
        min={50}
        max={1200}
        step={10}
        showSlider
      />

      <NumberInput
        label="Height"
        value={component.props.height}
        onChange={(value) => handlePropertyChange('height', value)}
        min={20}
        max={200}
        step={5}
        showSlider
      />

      <ButtonGroup
        label="Font Weight"
        value={component.props.fontWeight}
        onChange={(value) => handlePropertyChange('fontWeight', value)}
        options={FONT_WEIGHT_OPTIONS}
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

export default TextProperties;
