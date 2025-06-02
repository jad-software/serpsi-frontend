import { ReactNode } from "react";
import classNames from "classnames";
interface SquareProps {
	children: ReactNode;
	className?: string;
	variant?:
		| "primary"
		| "DoubleColumn"
		| "WithImage"
		| "WithButton"
		| "ThreeRows";
}

interface SquareHeaderProps {
	titulo: ReactNode;
}

const SquareHeader = ({ titulo }: SquareHeaderProps) => (
	<header className="mb-4">
		{typeof titulo === "string" ? (
			<h3 className="text-lg text-primary-700">{titulo}</h3>
		) : (
			titulo
		)}
	</header>
);

const Square = ({ children, className, variant = "primary" }: SquareProps) => {
	const squareClasses = classNames(
		"border p-6 rounded-lg border-primary-600 text-gray-900",
		{
			"": variant === "primary",
			"flex flex-col items-center  justify-center text-center":
				variant === "WithImage",
			"md:col-span-2": variant === "DoubleColumn",
			"flex flex-col items-center justify-center":
				variant === "WithButton",
			"md:row-span-3": variant === "ThreeRows"
		}
	);
	return <section className={squareClasses}>{children}</section>;
};

export { Square, SquareHeader };
