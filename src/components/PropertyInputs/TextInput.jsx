import './PropertyInputs.css';

const TextInput = ({ label, value, onChange, placeholder = '', multiline = false }) => {
  return (
    <div className="property-input">
      <label className="property-input__label">{label}</label>
      
      {multiline ? (
        <textarea
          className="property-input__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          type="text"
          className="property-input__text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default TextInput;
