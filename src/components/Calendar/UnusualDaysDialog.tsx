import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "../form/InputText";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

const setUnusualSchema = z
	.object({
		date: z
			.string()
			.min(1, "A data do dia indisponível é obrigatória.")
			.refine(
				(value) => {
					const [year, month, day] = value.split("-").map(Number);
					const inputDate = new Date(year, month - 1, day);
					const today = new Date();
					today.setHours(0, 0, 0, 0);
					return inputDate.getTime() >= today.getTime();
				},
				{ message: "A data não pode estar no passado." }
			),
		unavaliableTimes: z.array(
			z.object({
				_startTime: z
					.string()
					.min(1, "Horário de início é obrigatório."),
				_endTime: z.string().min(1, "Horário de término é obrigatório.")
			})
		)
	})
	.refine(
		(data) => {
			const parseTime = (timeStr: string) => {
				const [hours, minutes] = timeStr.split(":").map(Number);
				return hours * 60 + minutes;
			};

			const ranges = data.unavaliableTimes.map((r) => ({
				start: parseTime(r._startTime),
				end: parseTime(r._endTime)
			}));

			for (let i = 0; i < ranges.length; i++) {
				const current = ranges[i];
				if (current.start >= current.end) {
					return false; // intervalo inválido (início após o fim)
				}

				for (let j = i + 1; j < ranges.length; j++) {
					const compare = ranges[j];
					const overlap =
						current.start < compare.end &&
						compare.start < current.end;
					if (overlap) {
						return false;
					}
				}
			}
			return true;
		},
		{
			message:
				"Há conflito entre os horários informados ou algum intervalo é inválido.",
			path: ["unavaliableTimes"]
		}
	);

export type UnusualSchema = z.infer<typeof setUnusualSchema>;

type UnusualDaysDialogProps = {
	onSubmit: (data: UnusualSchema) => void;
	triggerButton: ReactNode;
};

export function UnusualDaysDialog({
	onSubmit,
	triggerButton
}: UnusualDaysDialogProps) {
	const methods = useForm<UnusualSchema>({
		resolver: zodResolver(setUnusualSchema),
		defaultValues: {
			date: new Date()
				.toLocaleDateString("pt-BR")
				.split("/")
				.reverse()
				.join("-"),
			unavaliableTimes: [{ _startTime: "08:00", _endTime: "18:00" }]
		}
	});

	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
		watch
	} = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "unavaliableTimes"
	});

	const unavaliableTimes = watch("unavaliableTimes");

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) return;
				methods.reset({
					date: new Date()
						.toLocaleDateString("pt-BR")
						.split("/")
						.reverse()
						.join("-"),
					unavaliableTimes: [
						{ _startTime: "08:00", _endTime: "18:00" }
					]
				});
			}}
		>
			<DialogTrigger asChild>{triggerButton}</DialogTrigger>
			<DialogContent className="md:w-[60dvw]">
				<DialogHeader>
					<DialogTitle className="font-normal text-primary-700">
						Tornar horários indisponíveis
					</DialogTitle>
					<DialogDescription>
						Preencha os horários indisponíveis para uma data
						específica:
					</DialogDescription>
				</DialogHeader>

				<FormProvider {...methods}>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<InputText
							id="dia-indisponivel"
							label="Data de indisponibilidade:"
							placeholder="dd/mm/aaaa"
							type="date"
							name="date"
							register={register}
							error={errors.date?.message}
						/>

						{fields.map((field, index) => (
							<div
								key={field.id}
								className="flex w-full flex-row items-end gap-2"
							>
								<div className="flex w-full flex-col gap-1">
									<InputText
										id={`start-${index}`}
										label="Início:"
										type="time"
										placeholder="08:00"
										name={`unavaliableTimes.${index}._startTime`}
										register={register}
										error={
											errors.unavaliableTimes?.[index]
												?._startTime?.message
										}
									/>
								</div>
								<span
									className={
										errors.unavaliableTimes?.[index]
											? "self-center px-2"
											: "self-center px-2 pt-6"
									}
								>
									até
								</span>
								<div className="flex w-full flex-col gap-1">
									<InputText
										id={`end-${index}`}
										label="Término:"
										type="time"
										placeholder="18:00"
										name={`unavaliableTimes.${index}._endTime`}
										register={register}
										error={
											errors.unavaliableTimes?.[index]
												?._endTime?.message
										}
									/>
								</div>

								<Button
									variant="ghost"
									type="button"
									className={
										errors.unavaliableTimes?.[index]
											? "self-center"
											: ""
									}
									onClick={() => remove(index)}
									disabled={unavaliableTimes.length === 1}
								>
									<TrashIcon width={18} />
								</Button>
							</div>
						))}

						<Button
							type="button"
							variant="outline"
							onClick={() =>
								append({
									_startTime: "",
									_endTime: ""
								})
							}
							className="mt-2 self-start text-primary-700 hover:bg-primary-50"
						>
							<PlusIcon className="mr-2" width={18} />
							Adicionar horário
						</Button>

						<div className="flex justify-end gap-2 pt-4">
							<DialogClose asChild>
								<Button
									variant="ghost"
									className="text-primary-700 hover:text-primary-700"
								>
									Cancelar
								</Button>
							</DialogClose>
							<Button
								type="submit"
								className="bg-primary-600 text-white hover:bg-primary-400"
							>
								Salvar
							</Button>
						</div>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
