import './PropertyInputs.css';

const ButtonGroup = ({ label, value, onChange, options }) => {
  return (
    <div className="property-input">
      <label className="property-input__label">{label}</label>
      
      <div className="property-input__button-group">
        {options.map((option) => (
          <button
            key={option.value}
            className={`property-input__button ${
              value === option.value ? 'property-input__button--active' : ''
            }`}
            onClick={() => onChange(option.value)}
            title={option.label}
          >
            {option.icon || option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGroup;
