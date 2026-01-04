import './PropertyInputs.css';

const NumberInput = ({ label, value, onChange, min = 0, max = 1000, step = 1, showSlider = true }) => {
  return (
    <div className="property-input">
      <label className="property-input__label">
        {label}
        <span className="property-input__value">{value}</span>
      </label>
      
      {showSlider && (
        <input
          type="range"
          className="property-input__slider"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
        />
      )}
      
      <input
        type="number"
        className="property-input__number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

export default NumberInput;
