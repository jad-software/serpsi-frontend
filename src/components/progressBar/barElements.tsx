import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const ballVariants = cva("h-5 min-w-5 rounded-full", {
	variants: {
		variant: {
			inactive: "bg-gray-500 shadow",
			active: "bg-primary-500 shadow"
		},
		current: {
			true: "bg-secondary-pink-200 ring-4 ring-secondary-pink-200 shadow"
		}
	},
	defaultVariants: {
		variant: "inactive",
		current: false
	}
});

const Ball = React.forwardRef<null, VariantProps<typeof ballVariants>>(
	({ variant, current }, ref) => (
		<div ref={ref} className={cn(ballVariants({ variant, current }))} />
	)
);

Ball.displayName = "Ball";

const barVariants = cva("h-0.5 min-w-5 w-full mx-5 hidden lg:block", {
	variants: {
		variant: {
			inactive: "bg-gray-500 shadow",
			active: "bg-primary-500 shadow"
		}
	},
	defaultVariants: {
		variant: "inactive"
	}
});

const Bar = React.forwardRef<null, VariantProps<typeof barVariants>>(
	({ variant }, ref) => (
		<div ref={ref} className={cn(barVariants({ variant }))} />
	)
);
Bar.displayName = "Bar";

interface stepProps {
	variant: "inactive" | "active";
	current?: boolean;
	first?: boolean;
}

const Step = React.forwardRef<null, stepProps>(
	({ variant, current = false, first = false }, ref) => (
		<>
			{first ? (
				<Ball ref={ref} variant={variant} current={current} />
			) : (
				<>
					<Bar ref={ref} variant={variant} />
					<Ball ref={ref} variant={variant} current={current} />
				</>
			)}
		</>
	)
);
Step.displayName = "Step";

export { Ball, Bar, Step };
