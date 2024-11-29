import { PlusIcon } from "@heroicons/react/outline";
import PatientSessionCard from "./PatientSessionCard";
import NoData from "./no_data.svg";
import { Button } from "../ui/button";
import Image from "next/image";

interface DayViewProps {
	dateSelected: Date;
}

export default function DayView({ dateSelected }: DayViewProps) {
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
	return (
		<section className="flex h-[30rem] w-full flex-col lg:w-2/5">
			<h1 className="mb-2 text-center text-2xl md:text-left md:text-4xl">
				{daySelected}
			</h1>
			<div className="h-3/4 overflow-y-auto pr-4">
				{/* <PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard /> */}
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
						Não temos consultas agendadas para o dia{" "}
						{dateSelected.getDate()}
						{"/"}
						{dateSelected.getMonth() + 1}
						{"/"}
						{dateSelected.getFullYear()}
					</p>
				</div>
			</div>
			<div className="mt-2 flex w-full items-center justify-end">
				<Button
					variant={"outline"}
					className="h-12 w-12 rounded-full border-primary-600 bg-white hover:bg-primary-50"
				>
					<PlusIcon />
				</Button>
			</div>
		</section>
	);
}
