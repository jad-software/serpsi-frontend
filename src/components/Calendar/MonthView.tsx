import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PencilIcon
} from "@heroicons/react/outline";

import { useState, useEffect } from "react";

interface DayCardProps {
	day: number;
	hasMeeting?: boolean;
	disabled?: boolean;
	selected?: boolean;
	onClick?: () => void;
}

function DayCard({
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
	const hasMeetingClass = hasMeeting ? " bg-primary-600" : " bg-white";

	return (
		<div className="flex h-full min-h-10 w-full min-w-10 border">
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

interface MonthViewProps {
	selectedDate: Date;
	onDateSelect: (date: Date) => void;
}

export default function MonthView({
	selectedDate,
	onDateSelect
}: MonthViewProps) {
	const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
	const [firstDayOffset, setFirstDayOffset] = useState(0);
	const [previousMonthDays, setPreviousMonthDays] = useState<number[]>([]);
	const [nextMonthDays, setNextMonthDays] = useState<number[]>([]);

	useEffect(() => {
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth();

		// Get number of days in current month
		const lastDay = new Date(year, month + 1, 0).getDate();
		const days = Array.from({ length: lastDay }, (_, i) => i + 1);

		// Get first day of month (0 = Sunday, 1 = Monday, etc)
		const firstDay = new Date(year, month, 1).getDay();

		// Get days from previous month
		const prevMonthLastDay = new Date(year, month, 0).getDate();
		const prevDays = Array.from(
			{ length: firstDay },
			(_, i) => prevMonthLastDay - firstDay + i + 1
		);

		// Calculate how many days we need from next month
		const totalDays = firstDay + lastDay;
		const remainingDays = Math.ceil(totalDays / 7) * 7 - totalDays;
		const nextDays = Array.from({ length: remainingDays }, (_, i) => i + 1);

		setDaysInMonth(days);
		setFirstDayOffset(firstDay);
		setPreviousMonthDays(prevDays);
		setNextMonthDays(nextDays);
	}, [selectedDate]);

	const handleDateClick = (day: number, disabled: boolean = false) => {
		if (disabled || !onDateSelect) return;

		const newDate = new Date(selectedDate);
		newDate.setDate(day);
		onDateSelect(newDate);
	};

	const getMonthString = (month: number) => {
		switch (month) {
			case 0:
				return "Janeiro";
			case 1:
				return "Fevereiro";
			case 2:
				return "Março";
			case 3:
				return "Abril";
			case 4:
				return "Maio";
			case 5:
				return "Junho";
			case 6:
				return "Julho";
			case 7:
				return "Agosto";
			case 8:
				return "Setembro";
			case 9:
				return "Outubro";
			case 10:
				return "Novembro";
			case 11:
				return "Dezembro";
		}
	};

	const mes = getMonthString(selectedDate.getMonth());
	const ano = selectedDate.getFullYear();

	return (
		<section className="hidden min-h-[30rem] w-2/5 flex-col rounded-xl border border-primary-600 bg-white px-8 py-5 lg:flex">
			<div className="flex w-full items-center justify-between">
				<ChevronLeftIcon width={24} />
				<div className="flex w-1/3 items-end justify-center">
					<h1 className="text-3xl">
						{mes},&nbsp;{ano}
					</h1>
					<span>
						<PencilIcon width={20} className="mb-2 ml-1" />
					</span>
				</div>
				<ChevronRightIcon width={24} />
			</div>
			<div className="mt-3 grid w-full flex-grow grid-cols-7 text-center text-sm">
				<span>Dom.</span>
				<span>Seg.</span>
				<span>Ter.</span>
				<span>Qua.</span>
				<span>Qui.</span>
				<span>Sex.</span>
				<span>Sáb.</span>
				{/* Previous month days */}
				{previousMonthDays.map((day) => (
					<DayCard
						key={`prev-${day}`}
						day={day}
						disabled
						onClick={() => handleDateClick(day, true)}
					/>
				))}

				{/* Current month days */}
				{daysInMonth.map((day) => (
					<DayCard
						key={`current-${day}`}
						day={day}
						selected={day === selectedDate.getDate()}
						onClick={() => handleDateClick(day)}
					/>
				))}

				{/* Next month days */}
				{nextMonthDays.map((day) => (
					<DayCard
						key={`next-${day}`}
						day={day}
						disabled
						onClick={() => handleDateClick(day, true)}
					/>
				))}
			</div>
		</section>
	);
}
