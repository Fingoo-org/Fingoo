import TextInput from '../../atom/text-input/text-input';
import { FormContext } from './form.context';
import { useContext } from 'react';
import { useFormStatus } from 'react-dom';

interface FormPasswordInputProps {
  label: string;
  id: string;
  placeholder: string;
  required?: boolean;
}

export function FormPasswordInput({ label, id, placeholder, required = false }: FormPasswordInputProps) {
  const { errors } = useContext(FormContext);
  const { pending } = useFormStatus();

  return (
    <div className="group">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium group-has-[:required]:after:pl-1 group-has-[:required]:after:text-red-400 group-has-[:required]:after:content-['*']"
      >
        {label}
      </label>
      <TextInput
        required={required}
        disabled={pending}
        error={errors[id] ? true : false}
        errorMessages={errors[id]}
        type={'password'}
        id={id}
        name={id}
        placeholder={placeholder}
      />
    </div>
  );
}
