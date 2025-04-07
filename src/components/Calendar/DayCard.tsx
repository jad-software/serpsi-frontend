interface DayCardProps {
	day: number;
	hasMeeting?: boolean;
	disabled?: boolean;
	selected?: boolean;
	onClick?: () => void;
}

export default function DayCard({
	day,
	hasMeeting = false,
	disabled = false,
	selected = false,
	...props
}: DayCardProps) {
	const disabledClass = disabled ? " text-black/40" : "";
	const selectedClass = selected
		? " rounded-md border bg-primary-600 text-white"
		: "";

	const getMeetingClass = () => {
		if (hasMeeting) {
			if (selected) {
				return " bg-white";
			}
			return " bg-primary-600";
		}
	};
	const hasMeetingClass = getMeetingClass();

	return (
		<div
			className="flex h-full min-h-10 w-full min-w-10 cursor-pointer border hover:bg-gray-100"
			onClick={props.onClick}
		>
			<div
				className={
					"flex w-full flex-grow flex-col items-center justify-center" +
					selectedClass
				}
			>
				<span className={"text-3xl" + disabledClass}>{day}</span>
				<div
					className={"mx-2 h-1 w-4/5 rounded-lg" + hasMeetingClass}
				></div>
			</div>
		</div>
	);
}
