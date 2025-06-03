import { PencilIcon, PlusIcon } from "@heroicons/react/outline";
import PatientSessionCard from "./PatientSessionCard";
import NoData from "./no_data.svg";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getMeetingsInDateRange } from "@/services/calendarService";
import { MeetingType } from "@/services/calendarService";
import { toast } from "sonner";
import Link from "next/link";
interface DayViewProps {
	dateSelected: Date;
	onDateSelect: (date: Date) => void;
}

export default function DayView({ dateSelected, onDateSelect }: DayViewProps) {
	const getDayString = (date: Date) => {
		const weekDays = [
			"Domingo",
			"Segunda",
			"Terça",
			"Quarta",
			"Quinta",
			"Sexta",
			"Sábado"
		];

		const months = [
			"Janeiro",
			"Fevereiro",
			"Março",
			"Abril",
			"Maio",
			"Junho",
			"Julho",
			"Agosto",
			"Setembro",
			"Outubro",
			"Novembro",
			"Dezembro"
		];

		const weekDay = weekDays[date.getDay()];
		const day = date.getDate();
		const month = months[date.getMonth()];

		return `${weekDay}, ${day} de ${month}`;
	};

	const daySelected = getDayString(dateSelected);
	const [meetings, setMeetings] = useState<MeetingType[]>([]);
	const [loading, setLoading] = useState(true);
	const datePickerRef = useRef<HTMLInputElement | null>(null);
	const handleDateInput = () => {
		datePickerRef.current?.showPicker();
	};

	const formatDateValue = () => {
		const date = dateSelected && !isNaN(dateSelected.getTime()) ? dateSelected : new Date();

		const localDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		);
		return localDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
	};

	const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		if (!inputValue) return;
		
		const [year, month, day] = inputValue.split("-").map(Number);
		const selectedDate = new Date(year, month - 1, day);
		onDateSelect(selectedDate);
	};

	useEffect(() => {
		const fetchMeetingsForDate = async () => {
			setLoading(true);
			try {
				const response = await getMeetingsInDateRange(dateSelected);
				setMeetings(response);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				return toast.error(
					"Houve um erro ao buscar por sessões para esse dia."
				);
			}
		};

		fetchMeetingsForDate();
	}, [dateSelected, daySelected]);
	return (
		<section className="flex h-[30rem] w-full flex-col lg:w-2/5 gap-2">
			<div className="flex flex-row text-center justify-center">
				<h1 className="mb-2 text-center text-3xl md:text-left md:text-4xl">
					{daySelected}
				</h1>
				<span
					onClick={handleDateInput}
					className="ml-1 cursor-pointer p-2 hover:rounded-full lg:hidden"
				>
					<PencilIcon width={22} className="" />
				</span>
				<input
					ref={datePickerRef}
					id="date-picker"
					type="date"
					className="absolute opacity-0 pointer-events-none"
					value={formatDateValue()}
					onChange={handleDateInputChange}
				/>
			</div>
			<div className="h-3/4 overflow-y-auto px-2 md:pr-4">
				{loading && (
					<div className="flex h-full flex-grow animate-loadingPulse items-center justify-center text-center">
						<p>Carregando...</p>
					</div>
				)}
				{loading === false && meetings.length === 0 && (
					<div className="flex h-full w-full flex-grow flex-col items-center justify-center">
						<Image
							src={NoData}
							alt="Sem Consultas"
							width={256}
							height={256}
							className="w-4/5 sm:w-1/4 lg:w-1/2"
						/>
						<br />
						<p className="text-center text-gray-600">
							Não existem consultas agendadas para o dia{" "}
							{dateSelected.getDate()}
							{"/"}
							{dateSelected.getMonth() + 1}
							{"/"}
							{dateSelected.getFullYear()}
						</p>
					</div>
				)}
				{loading === false &&
					meetings.length > 0 &&
					meetings.map((meeting) => (
						<PatientSessionCard
							key={meeting.meeting_id}
							id={meeting.meeting_id}
							name={meeting.person_name}
							status={meeting.meeting_status}
							schedule={meeting.meeting_schedule}
						/>
					))}
			</div>
			<div className="mt-2 flex w-full items-center justify-end pr-2">
				<Button
					variant={"outline"}
					asChild
					className="h-12 w-12 rounded-full border-primary-600 bg-white hover:bg-primary-50"
				>
					<Link href="/home/sessions">
						<PlusIcon />
					</Link>
				</Button>
			</div>
		</section>
	);
}
