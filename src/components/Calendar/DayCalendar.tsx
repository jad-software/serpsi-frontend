import { PlusCircleIcon, PlusIcon } from "@heroicons/react/outline";
import PatientSessionCard from "./PatientSessionCard";
import { Button } from "../ui/button";

export default function DayView() {
	return (
		<section className="flex h-[30rem] w-full flex-col lg:w-2/5">
			<h1 className="mb-2 text-4xl">Terça, 22 de Maio</h1>
			<div className="h-3/4 overflow-y-auto pr-4">
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
				<PatientSessionCard />
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
