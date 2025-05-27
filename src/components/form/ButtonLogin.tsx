import { Button } from "../ui/button";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
	variant?: "default" | "second";
}

export function ButtonLogin({
	text,
	variant = "default",
	className = "",
	...props
}: ButtonProps) {
	const getVariantClassName = (): string => {
		let base = "w-full rounded-md border ";
		if (variant == "second") {
			base +=
				"border-primary-600 bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-400 hover:border-primary-400";
		} else {
			base +=
				"border-none bg-primary-600 text-primary-50 hover:bg-primary-400 hover:text-white";
		}
		return base;
	};

	return (
		<>
			<Button
				variant={"outline"}
				className={`${getVariantClassName()} ${className}`}
				{...props}
			>
				{text}
			</Button>
		</>
	);
}
