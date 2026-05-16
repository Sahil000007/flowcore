/**
 * FormInput Component - Reusable form input with label and error handling
 */
export const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  helpText,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 
          ${error && touched ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}`}
        {...props}
      />
      {helpText && <p className="text-sm text-gray-600 mt-1">{helpText}</p>}
      {error && touched && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

/**
 * FormSelect Component - Reusable form select with label and error handling
 */
export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600
          ${error && touched ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && touched && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

/**
 * FormTextArea Component - Reusable textarea with label and error handling
 */
export const FormTextArea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600
          ${error && touched ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}`}
        {...props}
      />
      {error && touched && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

/**
 * FormCheckbox Component - Reusable checkbox with label
 */
export const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4 flex items-center">
      <input
        id={name}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600 ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={name} className={`ml-2 text-sm text-gray-700 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
    </div>
  );
};
