import NumberInput from '../PropertyInputs/NumberInput';
import TextInput from '../PropertyInputs/TextInput';

const ImageProperties = ({ component, onUpdate }) => {
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
        label="Image URL"
        value={component.props.src}
        onChange={(value) => handlePropertyChange('src', value)}
        placeholder="https://example.com/image.jpg"
      />

      <TextInput
        label="Alt Text"
        value={component.props.alt}
        onChange={(value) => handlePropertyChange('alt', value)}
        placeholder="Image description"
      />

      <NumberInput
        label="Width"
        value={component.props.width}
        onChange={(value) => handlePropertyChange('width', value)}
        min={50}
        max={800}
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
        label="Border Radius"
        value={component.props.borderRadius}
        onChange={(value) => handlePropertyChange('borderRadius', value)}
        min={0}
        max={200}
        step={1}
        showSlider
      />
    </div>
  );
};

export default ImageProperties;
