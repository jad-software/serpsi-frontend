interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
	variant?: "default" | "second";
}

export function Button({
	text,
	variant = "default",
	className = "",
	...props
}: ButtonProps) {
	const getVariantClassName = (): string => {
		let base = "w-full rounded-md border disabled:pointer-events-none disabled:opacity-60";
		if (variant == "second") {
			base += " border-primary-500 bg-primary-50 text-primary-700";
		} else {
			base += " bg-primary-600 text-primary-50";
		}
		return base;
	};

	return (
		<>
			<button
				className={`${getVariantClassName()} ${className}`}
				{...props}
			>
				{text}
			</button>
		</>
	);
}
