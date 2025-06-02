"use client";
import classNames from "classnames";
import { Input } from "../ui/input";
import { UseFormRegister } from "react-hook-form";
import InputMask from "react-input-mask-next";

interface InputTextProps {
	id: string;
	label: string;
	placeholder: string;
	type: string;
	maskPlaceholder?: string;
	name?: string;
	register?: UseFormRegister<any>;
	variant?: "primary" | "secondary";
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
	variant = "primary",
	mask,
	error,
	autoComplete,
	...rest
}: InputTextProps) {
	const inputClassNames = classNames("w-full rounded-md  p-2 text-left", {
		"border placeholder:text-gray-500 ": variant === "primary",
		"border bg-primary-50 text-primary-800": variant === "secondary",
		"border-red-500 focus-visible:ring-red-600 outline-red-600": error,
		"border-primary-600 focus-visible:ring-primary-600 outline-primary-600":
			!error
	});

	return (
		<>
			<label
				htmlFor={id}
				className="mb-1 w-full text-sm font-normal text-primary-950"
			>
				{label}
			</label>
			{mask ? (
				<InputMask
					id={id}
					type={type}
					mask={mask}
					placeholder={placeholder}
					maskPlaceholder={maskPlaceholder && maskPlaceholder}
					className={inputClassNames}
					{...(register ? register(name ? name : id) : {})}
				/>
			) : (
				<Input
					id={id}
					type={type}
					placeholder={placeholder}
					className={inputClassNames}
					defaultValue={rest.defaultValue}
					autoComplete={
						type === "password" ? "new-password" : "new-email"
					}
					{...(register ? register(name ? name : id) : {})}
					{...(type === "uniqueFile" && {
						multiple: false,
						type: "file",
						accept: "application/pdf"
					})}
					{...(type === "file" && { multiple: true })}
					{...(type === "file" &&
						rest.accept && { accept: rest.accept })}
				/>
			)}
			{error !== undefined && (
				<span className="text-sm text-red-400">{error}</span>
			)}
		</>
	);
}
