import { Input } from "@/components/ui/input";
import { DefineLine } from "./defineLine";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
import { dayTypesResolve, ScheduleAgendas, week } from "./dayTypes";
import { Checkbox } from "@/components/ui/checkbox";

export function ScheduleDefiner({
	checkboxes,
	setCheckboxes,
	meetValue,
	setMeetValue
}: {
	checkboxes: boolean[];
	setCheckboxes: any;
	meetValue: number;
	setMeetValue: any;
}) {
	const {
		register,
		setValue,
		formState: { errors }
	} = useFormContext();
	const { fields, insert, remove } = useFieldArray<ScheduleAgendas>({
		name: "agendas"
	});

	const addAgenda = (dayType: dayTypesResolve, index: number) => {
		let iterator = 0;
		for (const value of fields) {
			if (value.key === index) return;
			if (value.key > index) {
				insert(iterator, {
					key: index,
					_day: dayType,
					_avaliableTimes: [
						{
							key: index,
							_startTime: "08:00",
							_endTime: "18:00"
						}
					]
				});
				return;
			}
			iterator++;
		}
		insert(index, {
			key: index,
			_day: dayType,
			_avaliableTimes: [
				{
					key: index,
					_startTime: "08:00",
					_endTime: "18:00"
				}
			]
		});
	};

	const removeAgenda = (idx: number) => {
		fields.map((value, index) => {
			if (value.key == idx) {
				remove(index);
			}
		});
	};

	const handleClickCheckbox = (index: number) => {
		const updatedCheckBoxes = checkboxes.map((value, idx) => {
			let newValue = value;
			if (index === idx) {
				newValue = !value;
				if (newValue) addAgenda(week[index].name, index);
				else removeAgenda(index);
			}
			return newValue;
		});
		setCheckboxes(updatedCheckBoxes);
	};

	const [duration, setDuration] = useState(Number);

	const changeMeetValue = (value: string) => {
		let number = +value.slice(2).replaceAll(".", "").replaceAll(",", ".");
		setMeetValue(number);
		setValue("meetValue", +number);
		return meetValue;
	};
	return (
		<>
			{/* duração e valor */}
			<div className="flex flex-col justify-center gap-2 md:flex-row lg:items-center">
				<label htmlFor="valor">Valor:</label>
				<Input
					id="valor"
					type="numeric"
					mask={"R$ 999.999.999,99"}
					className="w-auto border border-primary-400 lg:w-fit"
					error={errors.meetValue?.message}
					value={"" + meetValue}
					beforeMaskedStateChange={({ nextState }) => {
						let number = nextState.value.replace("R$ ", "");
						if (number.replaceAll(".", "").length < 9) {
							number = number.trim().split(".").join();
							nextState.value = "R$ " + number;
							if (number.split(",").length > 2)
								nextState.value =
									"R$ " + number.replace(",", ".");
						}

						if (
							nextState.value.endsWith(",") ||
							nextState.value.endsWith(".")
						)
							nextState.value = nextState.value.slice(0, -1);
						return nextState;
					}}
					{...register("meetValue", {
						valueAsNumber: true,
						onChange: (e) => changeMeetValue(e.target.value)
					})}
				/>
				<label htmlFor="duracao">Duração:</label>
				<Input
					id="duracao"
					type="number"
					className="w-auto border border-primary-400 lg:w-fit"
					min={0}
					max={600}
					error={errors.meetDuration?.message}
					{...register("meetDuration", {
						valueAsNumber: true,
						setValueAs: setDuration,
						value: duration
					})}
				/>
				<label htmlFor="duracao">minutos</label>
			</div>
			{/* array de checkbox */}
			<div className="flex justify-center gap-2 py-2">
				{week.map((value, index) => {
					return (
						<div
							key={value.key}
							className="flex flex-col-reverse items-center justify-center gap-2 lg:flex-row"
						>
							<Checkbox
								id={"check" + value.name}
								checked={checkboxes[index]}
								onCheckedChange={() =>
									handleClickCheckbox(index)
								}
								className="h-4 w-4"
							/>
							<label htmlFor={"check" + value.name}>
								{value.label}
							</label>
						</div>
					);
				})}
			</div>
			<ul>
				{fields.map((value, index) => {
					return (
						checkboxes[value.key] && (
							<DefineLine
								key={value.id}
								id={index}
								label={week[value.key]?.label || ""}
							/>
						)
					);
				})}
			</ul>
		</>
	);
}
