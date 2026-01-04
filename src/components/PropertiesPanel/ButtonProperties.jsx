import NumberInput from '../PropertyInputs/NumberInput';
import ColorPicker from '../PropertyInputs/ColorPicker';
import TextInput from '../PropertyInputs/TextInput';

const ButtonProperties = ({ component, onUpdate }) => {
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
        label="Button Text"
        value={component.props.text}
        onChange={(value) => handlePropertyChange('text', value)}
        placeholder="Click me"
      />

      <TextInput
        label="URL"
        value={component.props.url}
        onChange={(value) => handlePropertyChange('url', value)}
        placeholder="https://example.com"
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

      <NumberInput
        label="Padding"
        value={component.props.padding}
        onChange={(value) => handlePropertyChange('padding', value)}
        min={0}
        max={50}
        step={1}
        showSlider
      />

      <ColorPicker
        label="Background Color"
        value={component.props.backgroundColor}
        onChange={(value) => handlePropertyChange('backgroundColor', value)}
      />

      <ColorPicker
        label="Text Color"
        value={component.props.color}
        onChange={(value) => handlePropertyChange('color', value)}
      />

      <NumberInput
        label="Border Radius"
        value={component.props.borderRadius}
        onChange={(value) => handlePropertyChange('borderRadius', value)}
        min={0}
        max={50}
        step={1}
        showSlider
      />
    </div>
  );
};

export default ButtonProperties;
