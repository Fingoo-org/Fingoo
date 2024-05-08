import clsx from 'clsx';
import Button from '../../atom/button/button';
import { useContext } from 'react';
import { FormContext } from './form.context';
import { useFormStatus } from 'react-dom';
import { ButtonVariant, Size } from '@/app/utils/style';
import { Color } from '@tremor/react';

interface FormSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  position?: 'left' | 'right' | 'center';
  variant?: ButtonVariant;
  size?: Size;
  color?: Color;
}

export function FormSubmitButton({
  label,
  position = 'right',
  variant = 'primary',
  size = 'md',
  color,
  ...props
}: FormSubmitButtonProps) {
  const { formId } = useContext(FormContext);
  const { pending } = useFormStatus();

  return (
    <div
      className={clsx('flex', {
        'justify-start': position === 'left',
        'justify-center': position === 'center',
        'justify-end': position === 'right',
      })}
    >
      <Button
        // loading={pending}
        aria-label="submit-button"
        form={formId}
        size={size}
        variant={variant}
        type="submit"
        color={color}
        {...props}
      >
        {pending ? label : <LoadingSpinner className="h-6 w-6" style={{ transition: `width 150ms` }} />}
      </Button>
    </div>
  );
}

const LoadingSpinner = ({ ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z" />
  </svg>
);
