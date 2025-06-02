import { forwardRef } from "react";

interface InputTextProps {
	name: string;
	type: "text" | "password";
	label: string;
	id: string;
	placeholder: string;
	error?: string;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
	({ name, type, label, id, placeholder, error, ...rest }, ref) => {
		return (
			<div>
				<label htmlFor={id}>{label}</label>
				<input
					name={name}
					type={type}
					id={id}
					placeholder={placeholder}
					ref={ref}
					{...rest}
					className="w-full rounded-xl border border-primary-500 bg-vidro p-2 text-primary-800 focus:outline focus:outline-primary-800"
				/>
				{error && <p className="text-red-500">{error}</p>}{" "}
				{/* Exibe o erro */}
			</div>
		);
	}
);
InputText.displayName = "InputText";
