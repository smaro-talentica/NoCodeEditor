import NumberInput from '../PropertyInputs/NumberInput';
import ColorPicker from '../PropertyInputs/ColorPicker';

const FlexboxProperties = ({ component, onUpdate }) => {
  const { props } = component;

  const handlePropChange = (propName, value) => {
    onUpdate(component.id, {
      props: {
        ...props,
        [propName]: value,
      },
    });
  };

  return (
    <div className="component-properties">
      <ColorPicker
        label="Background Color"
        value={props.backgroundColor}
        onChange={(value) => handlePropChange('backgroundColor', value)}
      />

      <NumberInput
        label="Width"
        value={props.width}
        onChange={(value) => handlePropChange('width', value)}
        min={50}
        max={1200}
        step={1}
      />

      <NumberInput
        label="Height"
        value={props.height}
        onChange={(value) => handlePropChange('height', value)}
        min={50}
        max={800}
        step={1}
      />

      <NumberInput
        label="Padding"
        value={props.padding}
        onChange={(value) => handlePropChange('padding', value)}
        min={0}
        max={100}
        step={1}
      />

      <NumberInput
        label="Border Radius"
        value={props.borderRadius}
        onChange={(value) => handlePropChange('borderRadius', value)}
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
};

export default FlexboxProperties;
