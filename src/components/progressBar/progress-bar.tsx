import { Step } from "./barElements";

interface ProgressBarProps {
	steps: number;
	currentStep: number;
	className?: string;
}

export function ProgressBar({
	steps,
	currentStep,
	className
}: ProgressBarProps) {
	return (
		<div className={`flex ${className} items-center justify-between p-5`}>
			{Array.from({
				length: steps
			}).map((it, index) =>
				index < currentStep ? (
					<Step
						variant="active"
						first={index === 0}
						current={index === currentStep - 1}
						key={index}
					/>
				) : (
					<Step
						variant="inactive"
						first={index === 0}
						current={index === currentStep - 1}
						key={index}
					/>
				)
			)}
		</div>
	);
}
