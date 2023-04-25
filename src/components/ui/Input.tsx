import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { forwardRef, InputHTMLAttributes, Ref } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  labelClassName?: string;
  inputClass?: string;
  label?: string;
  errorMsg?: string;
}

const Input = forwardRef(function Input(
  { className, labelClassName, label, errorMsg, inputClass, ...props }: Props,
  ref: Ref<HTMLInputElement>
) {
  return (
    <div className={className}>
      {label && (
        <label className={clsx('flex justify-between', labelClassName)}>
          <span>{label}</span>
        </label>
      )}
      <div className={clsx('relative', { 'mt-1': label })}>
        <input
          disabled={props.disabled}
          ref={ref}
          className={clsx(
            'w-full rounded-xl border border-gray-500 py-3 px-4',
            inputClass,
            {
              'pr-16': errorMsg,
            }
          )}
          {...props}
        />
        {errorMsg && (
          <ExclamationCircleIcon className='absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500' />
        )}
      </div>
      {errorMsg && <p className='mt-1 pl-1 text-sm text-red-500'>{errorMsg}</p>}
    </div>
  );
});

export default Input;
