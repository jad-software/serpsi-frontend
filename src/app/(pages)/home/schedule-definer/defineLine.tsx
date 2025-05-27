import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ScheduleAgendas } from "./dayTypes";
type defineLineProps = {
	label: string;
	id: number;
};
export function DefineLine({ id, label }: defineLineProps) {
	const {
		register,
		setValue,
		watch,
		formState: { errors }
	} = useFormContext<ScheduleAgendas>();
	const { fields, insert, remove } = useFieldArray<ScheduleAgendas>({
		name: `agendas.${id}._avaliableTimes`
	});

	const addAvaliableTime = () => {
		insert(fields.length, {
			key: id,
			_startTime: "",
			_endTime: ""
		});
	};

	const removeAvaliableTime = () => {
		remove(fields.length - 1);
	};

	return (
		<li className="flex items-center justify-center gap-2">
			<div className="flex flex-col gap-2 p-2">
				{fields.map((value, index) => {
					return (
						<div
							key={value.id}
							className="flex flex-col md:flex-row"
						>
							<div className="flex items-center justify-center gap-2">
								<span className="w-8">
									{" "}
									{!index ? label : ""}{" "}
								</span>
								<Input
									type="text"
									className="w-20 border-primary-400 lg:w-fit"
									placeholder="hora inicial"
									defaultValue={watch(
										`agendas.${id}._avaliableTimes.${index}._startTime`
									)}
									error={
										errors.agendas?.[id]?._avaliableTimes?.[
											index
										]?._startTime?.message
									}
									mask="99:99"
									{...register(
										`agendas.${id}._avaliableTimes.${index}._startTime`,
										{
											onChange: (e) =>
												setValue(
													`agendas.${id}._avaliableTimes.${index}._startTime`,
													e.target.value
												)
										}
									)}
								/>
								<span className="w-8"> até </span>
								<Input
									type="text"
									className="w-20 border-primary-400 lg:w-fit"
									placeholder="hora final"
									defaultValue={watch(
										`agendas.${id}._avaliableTimes.${index}._endTime`
									)}
									mask="99:99"
									error={
										errors.agendas?.[id]?._avaliableTimes?.[
											index
										]?._endTime?.message
									}
									{...register(
										`agendas.${id}._avaliableTimes.${index}._endTime`,
										{
											onChange: (e) =>
												setValue(
													`agendas.${id}._avaliableTimes.${index}._endTime`,
													e.target.value
												)
										}
									)}
								/>
							</div>
							<div className="ml-2 flex items-center justify-center lg:justify-start">
								<span className="w-8 md:w-0"> </span>
								{index == fields.length - 1 ? (
									<Button
										type="button"
										variant="link"
										className="mt-2 w-20 bg-primary-400 text-white md:m-0 md:w-fit lg:bg-white lg:text-primary-400"
										size="sm"
										onClick={() => addAvaliableTime()}
									>
										<PlusIcon width={24} height={24} />
									</Button>
								) : null}
								<span className="w-12 md:w-1"> </span>
								{index == fields.length - 1 && index ? (
									<Button
										type="button"
										variant="link"
										className="mt-2 w-20 bg-red-400 text-white md:m-0 md:w-fit lg:bg-white lg:text-red-400"
										size="sm"
										onClick={() => removeAvaliableTime()}
									>
										<TrashIcon width={24} height={24} />
									</Button>
								) : (
									<span className="w-20 px-4 text-white md:w-fit md:py-2">
										<TrashIcon width={24} height={1} />
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</li>
	);
}
