"use client";
import DayView from "@/components/Calendar/DayCalendar";
import MonthView from "@/components/Calendar/MonthView";
import ViewModeSelector from "@/components/Calendar/ViewModeSelector";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { useState } from "react";

export default function Home() {
	const [viewMode, setViewMode] = useState<"day" | "week">("day");
	return (
		<main className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-12">
			<div className="mb-2 mt-1 flex w-full flex-col items-center justify-between md:flex-row">
				<div className="mb-2 flex w-full flex-col items-center justify-center md:mb-0 md:flex-row lg:w-1/2">
					<Select>
						<SelectTrigger className="mb-2 min-w-40 border-primary-400 focus:ring-primary-600 md:mb-0">
							<SelectValue placeholder="Psicóloga" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="light">Light</SelectItem>
							<SelectItem value="dark">Dark</SelectItem>
							<SelectItem value="system">System</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant={"outline"}
						className="w-full min-w-52 rounded-sm border-primary-400 font-normal text-primary-600 outline-primary-400 hover:bg-primary-50 hover:text-primary-400 md:mx-4 md:h-7 md:w-3/5"
					>
						Definir Horários Indisponíveis
					</Button>
				</div>
				<ViewModeSelector
					viewMode={viewMode}
					setViewMode={setViewMode}
				/>
			</div>
			<div className="flex h-full w-full flex-grow items-center justify-around rounded-xl border border-primary-600 bg-primary-100 p-8 lg:p-0">
				<MonthView />
				<DayView />
			</div>
		</main>
	);
}
