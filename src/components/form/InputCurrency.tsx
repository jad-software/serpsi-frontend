"use client";
import classNames from "classnames";
import { Input } from "../ui/input";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface InputCurrencyProps {
  id: string;
  label: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error?: string;
}

export function InputCurrency({
  id,
  label,
  placeholder,
  name,
  register,
  setValue,
  error,
}: InputCurrencyProps) {
  const inputClassNames = classNames("w-full rounded-md p-2 text-left", {
    "border placeholder:text-gray-500": true,
    "border-red-500 focus-visible:ring-red-600 outline-red-600": error,
    "border-primary-600 focus-visible:ring-primary-600 outline-primary-600": !error
  });

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, ""); // Remove tudo que não for número
    const numericValue = (parseFloat(rawValue) / 100).toFixed(2);
    const formattedValue = `R$ ${numericValue.replace(".", ",")}`;
    setValue(name, formattedValue, { shouldValidate: true });
  };

  return (
    <>
      <label htmlFor={id} className="mb-1 w-full text-sm font-normal text-primary-950">
        {label}
      </label>
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        className={inputClassNames}
        {...register(name)}
        onChange={handleCurrencyChange}
      />
      {error && <span className="text-sm text-red-400">{error}</span>}
    </>
  );
}
