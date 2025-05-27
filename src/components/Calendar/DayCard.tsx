interface DayCardProps {
	day: number;
	hasMeeting?: boolean;
	disabled?: boolean;
	selected?: boolean;
	isToday?: boolean;
	isPastDay?: boolean;
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
	const isTodayClass =
		props.isToday && !selected
			? " border-primary-400"
			: " border-transparent";

	const isPastDayClass = props.isPastDay && !selected ? " bg-gray-100" : "";

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
			className={
				"flex h-full min-h-10 w-full min-w-10 cursor-pointer border hover:bg-gray-200" +
				disabledClass +
				isPastDayClass
			}
			onClick={props.onClick}
		>
			<div
				className={
					"flex w-full flex-grow flex-col items-center justify-center" +
					selectedClass
				}
			>
				<div
					className={
						"flex h-5/6 w-5/6 flex-col items-center justify-center rounded-sm border-2" +
						isTodayClass
					}
				>
					<span className={"text-3xl"}>{day}</span>
					<div
						className={
							"mx-2 h-1 w-4/5 rounded-lg" + hasMeetingClass
						}
					></div>
				</div>
			</div>
		</div>
	);
}
