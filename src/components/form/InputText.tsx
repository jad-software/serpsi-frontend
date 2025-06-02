'use client';

import classNames from 'classnames';
import { Input } from '../ui/input';
import { Controller, UseFormRegister, Control } from 'react-hook-form';
import { IMaskInput } from 'react-imask';

interface InputTextProps {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  maskPlaceholder?: string;
  name?: string;
  register?: UseFormRegister<any>;
  control?: Control<any>; // <-- necessário para Controller
  variant?: 'primary' | 'secondary';
  mask?: string;
  error?: string;
  accept?: string;
  defaultValue?: any;
  autoComplete?: string;
}

export function InputText({
  id,
  label,
  placeholder,
  type,
  name,
  maskPlaceholder,
  register,
  control,
  variant = 'primary',
  mask,
  error,
  autoComplete,
  ...rest
}: InputTextProps) {
  const inputClassNames = classNames('w-full rounded-md p-2 text-left', {
    'border placeholder:text-gray-500': variant === 'primary',
    'border bg-primary-50 text-primary-800': variant === 'secondary',
    'border-red-500 focus-visible:ring-red-600 outline-red-600': error,
    'border-primary-600 focus-visible:ring-primary-600 outline-primary-600': !error,
  });

  const registerProps = register ? register(name ?? id) : {};

  return (
    <>
      <label htmlFor={id} className="mb-1 w-full text-sm font-normal text-primary-950">
        {label}
      </label>

      {mask && control ? (
        <Controller
          name={name ?? id}
          control={control}
          defaultValue={rest.defaultValue ?? ''}
          render={({ field }) => (
            <IMaskInput
              {...field}
              id={id}
              mask={mask}
              placeholder={placeholder}
              className={inputClassNames}
              onAccept={(value: any) => field.onChange(value)}
              overwrite
              {...rest}
            />
          )}
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={inputClassNames}
          defaultValue={rest.defaultValue}
          autoComplete={type === 'password' ? 'new-password' : autoComplete ?? 'new-email'}
          {...registerProps}
          {...(type === 'uniqueFile' && {
            multiple: false,
            type: 'file',
            accept: 'application/pdf',
          })}
          {...(type === 'file' && { multiple: true })}
          {...(type === 'file' && rest.accept && { accept: rest.accept })}
        />
      )}

      {error && <span className="text-sm text-red-400">{error}</span>}
    </>
  );
}
