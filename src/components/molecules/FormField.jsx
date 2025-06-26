import Input from '@/components/atoms/Input'
import { useLanguage } from '@/contexts/LanguageContext'

const FormField = ({ 
  name, 
  label, 
  labelKey,
  type = 'text',
  required = false,
  error,
  value,
  onChange,
  ...props 
}) => {
  const { t } = useLanguage();
  
  const displayLabel = labelKey ? t(labelKey, label) : label;
  const finalLabel = required ? `${displayLabel} *` : displayLabel;

  const handleChange = (e) => {
    onChange?.(name, e.target.value);
  };

  return (
    <Input
      label={finalLabel}
      type={type}
      name={name}
      value={value || ''}
      onChange={handleChange}
      error={error}
      required={required}
      {...props}
    />
  );
};

export default FormField;