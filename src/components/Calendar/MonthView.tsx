import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PencilIcon
} from "@heroicons/react/outline";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";

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
	const [showDateInput, setShowDateInput] = useState(false);

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

	const handleDateClick = (
		day: number,
		isPrevMonth: boolean = false,
		isNextMonth: boolean = false
	) => {
		const year = selectedDate.getFullYear();
		const month = selectedDate.getMonth();

		let targetMonth = month;
		let targetYear = year;

		if (isPrevMonth) {
			targetMonth = month - 1;
			if (targetMonth < 0) {
				targetMonth = 11;
				targetYear--;
			}
		} else if (isNextMonth) {
			targetMonth = month + 1;
			if (targetMonth > 11) {
				targetMonth = 0;
				targetYear++;
			}
		}

		const newDate = new Date(targetYear, targetMonth, day);
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

	const handlePreviousMonth = () => {
		const newDate = new Date(selectedDate);
		newDate.setMonth(selectedDate.getMonth() - 1);
		onDateSelect(newDate);
	};

	const handleNextMonth = () => {
		const newDate = new Date(selectedDate);
		newDate.setMonth(selectedDate.getMonth() + 1);
		onDateSelect(newDate);
	};

	const handleDateInput = () => {
		const dateInput = document.getElementById(
			"date-picker"
		) as HTMLInputElement;
		if (dateInput) {
			dateInput.showPicker();
		}
	};

	const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedDate = new Date(e.target.value);
		const actualDate = new Date(selectedDate);
		actualDate.setDate(selectedDate.getDate() + 1);
		onDateSelect(actualDate);
	};

	const mes = getMonthString(selectedDate.getMonth());
	const ano = selectedDate.getFullYear();

	const formatDateValue = () => {
		try {
			return selectedDate.toISOString().split("T")[0];
		} catch (error) {
			return new Date().toISOString().split("T")[0];
		}
	};

	// Add this useEffect to handle invalid dates
	useEffect(() => {
		if (!selectedDate || isNaN(selectedDate.getTime())) {
			onDateSelect(new Date());
		}
	}, [selectedDate, onDateSelect]);

	return (
		<section className="hidden min-h-[30rem] w-2/5 flex-col rounded-xl border border-primary-600 bg-white px-4 py-5 lg:flex">
			<div className="flex w-full items-center justify-between">
				<Button
					variant={"ghost"}
					onClick={handlePreviousMonth}
					size={"icon"}
				>
					<ChevronLeftIcon width={24} />
				</Button>
				<div className="flex w-1/3 items-end justify-center">
					<h1 className="lg:text-3xl">
						{mes},&nbsp;{ano}
					</h1>
					<span
						onClick={handleDateInput}
						className="ml-1 cursor-pointer p-2 hover:rounded-full hover:bg-gray-100"
					>
						<PencilIcon width={20} className="" />
					</span>
					<input
						id="date-picker"
						type="date"
						className="invisible absolute"
						value={formatDateValue()}
						onChange={handleDateInputChange}
					/>
				</div>
				<Button
					variant={"ghost"}
					onClick={handleNextMonth}
					size={"icon"}
				>
					<ChevronRightIcon width={24} />
				</Button>
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
						onClick={() => handleDateClick(day, true, false)}
					/>
				))}

				{/* Current month days */}
				{daysInMonth.map((day) => (
					<DayCard
						key={`current-${day}`}
						day={day}
						selected={day === selectedDate.getDate()}
						onClick={() => handleDateClick(day, false, false)}
					/>
				))}

				{/* Next month days */}
				{nextMonthDays.map((day) => (
					<DayCard
						key={`next-${day}`}
						day={day}
						disabled
						onClick={() => handleDateClick(day, false, true)}
					/>
				))}
			</div>
		</section>
	);
}
