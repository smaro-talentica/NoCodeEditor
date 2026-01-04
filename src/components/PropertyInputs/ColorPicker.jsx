import './PropertyInputs.css';

const ColorPicker = ({ label, value, onChange }) => {
  return (
    <div className="property-input">
      <label className="property-input__label">{label}</label>
      
      <div className="property-input__color-wrapper">
        <input
          type="color"
          className="property-input__color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          className="property-input__color-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
